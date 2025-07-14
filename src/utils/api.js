import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quizly_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료 시 재발급 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // 토큰 만료 에러 (401 Unauthorized) 이고, 이미 재시도한 요청이 아니라면
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정

      try {
        // 현재 로그인된 사용자의 userId를 가져와야 합니다.
        // 이 예시에서는 localStorage에 userId가 저장되어 있다고 가정합니다.
        // 실제로는 JWT를 디코딩하거나, 로그인 시 userId를 별도로 저장해야 합니다.
        const quizlyToken = localStorage.getItem('quizly_token');
        let userId = null;
        if (quizlyToken) {
          try {
            const decodedToken = JSON.parse(atob(quizlyToken.split('.')[1]));
            userId = decodedToken.userId;
          } catch (decodeError) {
            console.error('토큰 디코딩 실패:', decodeError);
            // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
            localStorage.removeItem('quizly_token');
            localStorage.removeItem('user_nickname');
            localStorage.removeItem('user_profile_image');
            window.location.href = '/login';
            return Promise.reject(error);
          }
        }

        if (!userId) {
          // userId가 없으면 로그인 페이지로 리다이렉트
          localStorage.removeItem('quizly_token');
          localStorage.removeItem('user_nickname');
          localStorage.removeItem('user_profile_image');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // 새로운 액세스 토큰 요청
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, { userId });
        const newAccessToken = response.data.token;

        // 새로운 토큰 저장
        localStorage.setItem('quizly_token', newAccessToken);

        // 원래 요청의 Authorization 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 원래 요청 재시도
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('토큰 재발급 실패:', refreshError);
        // 재발급 실패 시 로그인 페이지로 리다이렉트
        localStorage.removeItem('quizly_token');
        localStorage.removeItem('user_nickname');
        localStorage.removeItem('user_profile_image');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API 함수들
export const authAPI = {
  // 이메일/비밀번호 회원가입
  signup: async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  },

  // 이메일/비밀번호 로그인
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // 카카오 로그인
  kakaoLogin: async (code) => {
    const response = await api.post('/api/auth/kakao', { code });
    return response.data;
  },

  // 비밀번호 찾기
  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  // 로그아웃
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  // 토큰 재발급
  refreshToken: async (userId) => {
    const response = await api.post('/api/auth/refresh-token', { userId });
    return response.data;
  },
};

export default api;
