import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import kakaoLoginIcon from '../assets/kakaologin.png';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { authAPI } from '../utils/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }
  }, []);

  const handleKakaoLogin = () => {
    const kakao = window.Kakao;
    kakao.Auth.authorize({
      redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
    });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 기본 검증
      if (!email || !password) {
        setError('이메일과 비밀번호를 모두 입력해주세요.');
        return;
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('유효한 이메일 주소를 입력해주세요.');
        return;
      }

      const response = await authAPI.login({ email, password });
      
      // 로그인 성공 시 토큰과 사용자 정보 저장
      localStorage.setItem('quizly_token', response.token);
      localStorage.setItem('user_nickname', response.user.nickname);
      if (response.user.profileImage) {
        localStorage.setItem('user_profile_image', response.user.profileImage);
      }

      // 자동 로그인 설정
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('remember_me');
      }

      // 메인 페이지로 이동
      navigate('/main');
    } catch (error) {
      console.error('로그인 실패:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* 로고 */}
      <div className="absolute top-8 left-8">
        <Logo />
      </div>

      {/* 로그인 폼 */}
      <div className="flex flex-col items-center justify-center h-full px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-left mb-2">로그인</h1>
          
          <div className="text-left text-gray-600 mb-8">
            <p>아직 계정이 없으신가요?</p>
            <a href="/signup" className="text-[#0C21C1] hover:underline">
              회원가입
            </a>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-left text-sm text-gray-600 mb-1">
                이메일
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-3 text-gray-400 text-xl" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-3 py-3 border-b border-gray-300 focus:border-[#0C21C1] focus:outline-none bg-transparent text-left"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-left text-sm text-gray-600 mb-1">
                비밀번호
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-3 text-gray-400 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-3 py-3 border-b border-gray-300 focus:border-[#0C21C1] focus:outline-none bg-transparent text-left"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 text-xl hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600">자동 로그인</span>
              </label>
              <a href="/forgot-password" className="text-sm text-[#0C21C1] hover:underline">
                비밀번호 찾기
              </a>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0C21C1] text-white py-3 px-6 rounded-lg hover:bg-[#0A1A9A] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">or continue with</p>
          </div>

          <div className="mt-3 flex justify-center">
            <button
              onClick={handleKakaoLogin}
              className="transition duration-200"
              disabled={isLoading}
            >
              <img 
                src={kakaoLoginIcon} 
                alt="카카오 로그인" 
                className="w-12 h-12 object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;