import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import StartButton from '../components/StartButton';
import kakaoLoginIcon from '../assets/kakaologin.png';
import { MdEmail, MdPerson, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const kakao = window.Kakao;
        if (!kakao.isInitialized()) {
            kakao.init('9805c31b5de3334a5a707c4095a955ea');
        }
    },[]);

    const handleKakaoLogin = () => {
        const kakao = window.Kakao;
        kakao.Auth.authorize({
            redirectUri: 'http://localhost:5173/oauth',
        });
    };

    return (
        <div className="h-screen bg-white overflow-hidden">
            <div className="absolute top-8 left-8">
                <Logo />
            </div>  

        <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-left mb-2">회원가입</h1>

                <div className="text-left text-gray-600 mb-8">
                    <p>이미 계정이 있으신가요?</p>
                    <a href="/login" className="text-[#0C21C1] hover:underline">
                        로그인
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
                        <label htmlFor="nickname" className="block text-left text-sm text-gray-600 mb-1">
                            닉네임
                        </label>
                        <div className="relative">
                            <MdPerson className="absolute left-3 top-3 text-gray-400 text-xl" />
                            <input
                                type="text"
                                id="nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
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

                    <div>
                        <label htmlFor="confirmPassword" className="block text-left text-sm text-gray-600 mb-1">
                            비밀번호 확인
                        </label>
                        <div className="relative">
                            <MdLock className="absolute left-3 top-3 text-gray-400 text-xl" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-3 py-3 border-b border-gray-300 focus:border-[#0C21C1] focus:outline-none bg-transparent text-left"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-gray-400 text-xl hover:text-gray-600"
                            >
                                {showConfirmPassword ? <MdVisibility /> : <MdVisibilityOff />}
                            </button>
                        </div>
                    </div>

                    <StartButton text="회원가입" to="/login" />
                </div>

                <div className="mt-4 text-center">
                    <p className="text-gray-400 text-sm">or continue with</p>
                </div>

                <div className="mt-3 flex justify-center">
                    <button
                    onClick={handleKakaoLogin}
                    className="hover:opacity-80 transition duration-200"
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

export default SignupPage;