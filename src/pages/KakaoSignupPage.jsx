import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { MdPerson, MdSchool, MdCheck, MdArrowBack } from 'react-icons/md';
import api from '../utils/api';

const KakaoSignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let kakaoInfo = location.state;
  if (!kakaoInfo) {
    try {
      kakaoInfo = JSON.parse(localStorage.getItem('kakao_signup_info'));
    } catch (e) {
      kakaoInfo = null;
    }
  }

  // 단계별 진행
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 약관 동의
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false
  });

  // 추가 정보
  const [nickname, setNickname] = useState(kakaoInfo?.nickname || '');
  const [gender, setGender] = useState('');
  const [school, setSchool] = useState('');

  useEffect(() => {
    if (!kakaoInfo) {
      setError('카카오 회원가입 정보가 없습니다. 다시 로그인해 주세요.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [kakaoInfo, navigate]);

  if (!kakaoInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h1 className="text-2xl font-bold mb-4">추가 정보 입력 및 약관 동의</h1>
        <div className="text-red-500 mb-2">{error || '카카오 회원가입 정보가 없습니다.'}</div>
      </div>
    );
  }

  const { kakaoId, profileImage, refreshToken } = kakaoInfo;

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
      
      console.log('카카오 회원가입 요청:', { kakaoId, nickname, gender, school });
      
      const response = await api.post('/api/auth/kakao/complete-signup', {
        kakaoId, nickname, profileImage, refreshToken, gender, school, marketingAgreement: agreements.marketing
      });
      
      console.log('카카오 회원가입 응답:', response.data);
      
      const data = response.data;
      localStorage.setItem('quizly_token', data.token);
      localStorage.setItem('user_nickname', data.user.nickname);
      localStorage.setItem('user_profile_image', data.user.profileImage);
      localStorage.removeItem('kakao_signup_info');
      navigate('/main');
    } catch (err) {
      console.error('카카오 회원가입 실패:', err);
      setError('회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-2">
        {[1, 2].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
              currentStep >= step
                ? 'bg-[#0C21C1] text-white border-[#0C21C1]'
                : 'bg-white text-gray-400 border-gray-300'
            }`}>
              {currentStep > step ? <MdCheck className="text-lg" /> : step}
            </div>
            {step < 2 && (
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
        </div>
      </div>
    </div>
  );
};

export default KakaoSignupPage; 