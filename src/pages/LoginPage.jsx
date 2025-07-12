import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import StartButton from '../components/StartButton';
import kakaoLoginIcon from '../assets/kakaologin.png';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="h-screen bg-white overflow-hidden">
      {/* 로고 */}
      <div className="absolute top-8 left-8">
        <Logo />
      </div>

      {/* 로그인 폼 */}
      <div className="flex flex-col items-center justify-center h-full px-4">
        <div className="w-full max-w-md">
          {/* 왼쪽 정렬로 변경 */}
          <h1 className="text-3xl font-bold text-left mb-2">로그인</h1>
          
          <div className="text-left text-gray-600 mb-8">
            <p>아직 계정이 없으신가요?</p>
            <a href="/signup" className="text-[#0C21C1] hover:underline">
              회원가입
            </a>
          </div>

          <div className="space-y-6">
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 text-xl hover:text-gray-600"
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
                />
                <span className="text-sm text-gray-600">자동 로그인</span>
              </label>
              <a href="/forgot-password" className="text-sm text-[#0C21C1] hover:underline">
                비밀번호 찾기
              </a>
            </div>

            {/* StartButton 컴포넌트로 메인 페이지로 이동 */}
            <StartButton text="로그인" to="/main" />
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">or continue with</p>
          </div>

          <div className="mt-3 flex justify-center">
            <button
              onClick={handleKakaoLogin}
              className="transition duration-200"
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