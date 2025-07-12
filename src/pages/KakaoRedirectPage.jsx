import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const KakaoRedirectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (code) {
      console.log('인가 코드:', code);

      const sendCodeToBackend = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/kakao`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code }),
          });

          if (!response.ok) {
            throw new Error('백엔드 로그인 처리 실패');
          }

          const data = await response.json();
          console.log('백엔드 응답:', data);

          localStorage.setItem('quizly_token', data.token);
          localStorage.setItem('user_nickname', data.user.nickname); // 닉네임 저장
          localStorage.setItem('user_profile_image', data.user.profileImage); // 프로필 이미지 URL 저장

          navigate('/main');

        } catch (error) {
          console.error('로그인 처리 중 오류 발생:', error);
          navigate('/login?error=true');
        }
      };

      sendCodeToBackend();
    } else {
      console.error('인가 코드를 찾을 수 없습니다.');
      navigate('/login?error=true');
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>로그인 처리 중...</p>
    </div>
  );
};

export default KakaoRedirectPage;