import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import kakaoLoginIcon from '../assets/kakaologin.png';
import { MdEmail, MdPerson, MdLock, MdVisibility, MdVisibilityOff, MdSchool, MdCheck, MdArrowBack } from 'react-icons/md';
import { authAPI } from '../utils/api';

const SignupPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // 약관 동의 상태
    const [agreements, setAgreements] = useState({
        terms: false,
        privacy: false,
        marketing: false
    });
    
    // 이메일/비밀번호 정보
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // 추가 정보
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState('');
    const [school, setSchool] = useState('');
    
    const navigate = useNavigate();

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

    const handleAgreementChange = (type) => {
        setAgreements(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!agreements.terms || !agreements.privacy) {
                setError('필수 약관에 동의해주세요.');
                return;
            }
            setError('');
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (!email || !password || !confirmPassword) {
                setError('모든 필드를 입력해주세요.');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('유효한 이메일 주소를 입력해주세요.');
                return;
            }
            
            if (password.length < 6) {
                setError('비밀번호는 최소 6자 이상이어야 합니다.');
                return;
            }
            
            if (password !== confirmPassword) {
                setError('비밀번호가 일치하지 않습니다.');
                return;
            }
            
            setError('');
            setCurrentStep(3);
        }
    };

    const handlePrevStep = () => {
        setError('');
        setCurrentStep(prev => prev - 1);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (!nickname || !gender || !school) {
                setError('모든 필드를 입력해주세요.');
                return;
            }

            if (nickname.length < 2) {
                setError('닉네임은 최소 2자 이상이어야 합니다.');
                return;
            }

            const response = await authAPI.signup({ 
                email, 
                nickname, 
                password,
                gender,
                school,
                marketingAgreement: agreements.marketing
            });
            
            localStorage.setItem('quizly_token', response.token);
            localStorage.setItem('user_nickname', response.user.nickname);
            if (response.user.profileImage) {
                localStorage.setItem('user_profile_image', response.user.profileImage);
            }
            if (response.user.gender) {
                localStorage.setItem('user_gender', response.user.gender);
            }
            if (response.user.school) {
                localStorage.setItem('user_school', response.user.school);
            }
            if (response.user.email) {
                localStorage.setItem('user_email', response.user.email);
            }

            navigate('/main');
        } catch (error) {
            console.error('회원가입 실패:', error);
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                            currentStep >= step 
                                ? 'bg-[#0C21C1] text-white border-[#0C21C1]' 
                                : 'bg-white text-gray-400 border-gray-300'
                        }`}>
                            {currentStep > step ? <MdCheck className="text-lg" /> : step}
                        </div>
                        {step < 3 && (
                            <div className={`w-12 h-1 mx-2 rounded ${
                                currentStep > step ? 'bg-[#0C21C1]' : 'bg-gray-300'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div>
            <h1 className="text-3xl font-bold text-left mb-2">약관 동의</h1>
            <div className="text-left text-gray-600 mb-8">
                <p>Quizly 서비스 이용을 위한 약관에 동의해주세요.</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0C21C1] transition-colors">
                    <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreements.terms}
                            onChange={() => handleAgreementChange('terms')}
                            className="mt-1 w-4 h-4 text-[#0C21C1] border-gray-300 rounded focus:ring-[#0C21C1]"
                        />
                        <div className="text-left">
                            <span className="font-medium text-gray-900">[필수] 서비스 이용약관</span>
                            <p className="text-sm text-gray-600 mt-1">
                                Quizly 서비스 이용을 위한 기본 약관에 동의합니다.
                            </p>
                        </div>
                    </label>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0C21C1] transition-colors">
                    <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreements.privacy}
                            onChange={() => handleAgreementChange('privacy')}
                            className="mt-1 w-4 h-4 text-[#0C21C1] border-gray-300 rounded focus:ring-[#0C21C1]"
                        />
                        <div className="text-left">
                            <span className="font-medium text-gray-900">[필수] 개인정보 처리방침</span>
                            <p className="text-sm text-gray-600 mt-1">
                                개인정보 수집 및 이용에 동의합니다.
                            </p>
                        </div>
                    </label>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-[#0C21C1] transition-colors">
                    <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreements.marketing}
                            onChange={() => handleAgreementChange('marketing')}
                            className="mt-1 w-4 h-4 text-[#0C21C1] border-gray-300 rounded focus:ring-[#0C21C1]"
                        />
                        <div className="text-left">
                            <span className="font-medium text-gray-900">[선택] 마케팅 정보 수신</span>
                            <p className="text-sm text-gray-600 mt-1">
                                이메일을 통한 마케팅 정보 수신에 동의합니다.
                            </p>
                        </div>
                    </label>
                </div>
            </div>

            <div className="mt-8 flex justify-between">
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="px-4 py-3 text-gray-600 hover:text-gray-800 flex items-center"
                >
                    <MdArrowBack className="mr-2" />
                    로그인으로 돌아가기
                </button>
                <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-[#0C21C1] text-white rounded-lg hover:bg-[#0A1A9A] transition-colors"
                >
                    다음
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div>
            <h1 className="text-3xl font-bold text-left mb-2">계정 정보</h1>
            <div className="text-left text-gray-600 mb-8">
                <p>이메일과 비밀번호를 입력해주세요.</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

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
            </div>

            <div className="mt-8 flex justify-between">
                <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-3 text-gray-600 hover:text-gray-800 flex items-center"
                >
                    <MdArrowBack className="mr-2" />
                    이전
                </button>
                <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-[#0C21C1] text-white rounded-lg hover:bg-[#0A1A9A] transition-colors"
                >
                    다음
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div>
            <h1 className="text-3xl font-bold text-left mb-2">추가 정보</h1>
            <div className="text-left text-gray-600 mb-8">
                <p>프로필 정보를 입력해주세요.</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
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
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-left text-sm text-gray-600 mb-1">
                        성별
                    </label>
                    <div className="flex space-x-6">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={gender === 'male'}
                                onChange={(e) => setGender(e.target.value)}
                                className="mr-2 text-[#0C21C1] focus:ring-[#0C21C1]"
                                disabled={isLoading}
                            />
                            <span className="text-gray-700">남성</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={gender === 'female'}
                                onChange={(e) => setGender(e.target.value)}
                                className="mr-2 text-[#0C21C1] focus:ring-[#0C21C1]"
                                disabled={isLoading}
                            />
                            <span className="text-gray-700">여성</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="other"
                                checked={gender === 'other'}
                                onChange={(e) => setGender(e.target.value)}
                                className="mr-2 text-[#0C21C1] focus:ring-[#0C21C1]"
                                disabled={isLoading}
                            />
                            <span className="text-gray-700">기타</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="school" className="block text-left text-sm text-gray-600 mb-1">
                        학교
                    </label>
                    <div className="relative">
                        <MdSchool className="absolute left-3 top-3 text-gray-400 text-xl" />
                        <select
                            id="school"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            className="w-full pl-12 pr-3 py-3 border-b border-gray-300 focus:border-[#0C21C1] focus:outline-none bg-transparent text-left appearance-none"
                            required
                            disabled={isLoading}
                        >
                            <option value="">학교를 선택해주세요</option>
                            <option value="seoul_national">서울대학교</option>
                            <option value="yonsei">연세대학교</option>
                            <option value="korea">고려대학교</option>
                            <option value="kaist">카이스트</option>
                            <option value="hanyang">한양대학교</option>
                            <option value="sungkyunkwan">성균관대학교</option>
                            <option value="sogang">서강대학교</option>
                            <option value="kyunghee">경희대학교</option>
                            <option value="ewha">이화여자대학교</option>
                            <option value="chungang">중앙대학교</option>
                            <option value="dgist">DGIST</option>
                            <option value="sejong">세종대학교</option>
                            <option value="konkuk">건국대학교</option>
                            <option value="hongik">홍익대학교</option>
                            <option value="sookmyung">숙명여자대학교</option>
                            <option value="other">기타</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-between">
                    <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-4 py-3 text-gray-600 hover:text-gray-800 flex items-center"
                        disabled={isLoading}
                    >
                        <MdArrowBack className="mr-2" />
                        이전
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-[#0C21C1] text-white rounded-lg hover:bg-[#0A1A9A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '가입 중...' : '회원가입 완료'}
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="h-screen bg-white overflow-hidden">
            <div className="absolute top-8 left-8">
                <Logo />
            </div>  

            <div className="flex flex-col items-center justify-center h-full px-4">
                <div className="w-full max-w-md">
                    {renderStepIndicator()}
                    
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm mb-3">or continue with</p>
                        <button
                            onClick={handleKakaoLogin}
                            className="hover:opacity-80 transition duration-200"
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

export default SignupPage;