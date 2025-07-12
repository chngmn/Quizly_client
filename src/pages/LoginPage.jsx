import React, { useEffect } from 'react';

const LoginPage = () => {
  useEffect(() => {
    const kakao = window.Kakao;
    // JavaScript 키를 사용하여 카카오 SDK 초기화
    // 여기에 실제 발급받은 JavaScript 키를 입력하세요.
    if (!kakao.isInitialized()) {
      kakao.init('9805c31b5de3334a5a707c4095a955ea');
    }
  }, []);

  const handleKakaoLogin = () => {
    const kakao = window.Kakao;
    kakao.Auth.authorize({
      redirectUri: 'http://localhost:5173/oauth',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">로그인</h1>
      <button onClick={handleKakaoLogin}>
        <img src="/kakao_login_medium_narrow.png" alt="카카오 로그인" />
      </button>
    </div>
  );
};

export default LoginPage;