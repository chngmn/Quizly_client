import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdComputer, 
  MdCalculate, 
  MdScience, 
  MdArrowForward, 
  MdQuiz, 
  MdCheck, 
  MdStar, 
  MdTrendingUp, 
  MdMemory, 
  MdBuild,
  MdBook
} from 'react-icons/md';
import { FaBook, FaGraduationCap, FaTrophy } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { majorAPI } from '../utils/api';
// 이미지 가져오기
import chipImage from '../assets/chip.png';
import mechanicImage from '../assets/mechanic.png';

const MainPage = () => {
  const navigate = useNavigate();
  const [popularQuizzes, setPopularQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 서버에서 전공별 퀴즈 개수 데이터를 가져오는 함수
  useEffect(() => {
    const fetchMajorsWithQuizCounts = async () => {
      try {
        setLoading(true);
        const data = await majorAPI.getMajorsWithQuizCount();
        console.log('서버에서 받은 전공 데이터:', data);
        setPopularQuizzes(data);
        setLoading(false);
      } catch (err) {
        console.error('전공별 퀴즈 개수를 가져오는데 실패했습니다:', err);
        setError('데이터를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchMajorsWithQuizCounts();
  }, []);

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  // 인기 퀴즈 카테고리 클릭 핸들러 수정
  const handleQuizCategory = (majorId, majorName) => {
    // QuizTakingPage로 전공 ID와 함께 이동
    // 이 때 필요한 파라미터들을 state로 전달
    navigate('/quiz-taking', {
      state: {
        majorId: majorId,        // 전공 ID
        subjectId: null,         // 과목은 지정하지 않고 전공 내 모든 과목에서 선택
        quizType: null,          // 퀴즈 타입도 지정하지 않음
        quizCount: 5,            // 5개의 퀴즈를 랜덤으로 가져옴
        initialQuizId: null      // 특정 퀴즈가 아닌 랜덤 퀴즈
      }
    });
  };

  // 아이콘 또는 이미지 컴포넌트 렌더링
  const renderIconOrImage = (quiz) => {
    // 이미지를 사용하는 경우
    if (quiz.useImage) {
      let imageSrc;
      switch (quiz.imagePath) {
        case 'chip.png':
          imageSrc = chipImage;
          break;
        case 'mechanic.png':
          imageSrc = mechanicImage;
          break;
        default:
          // 기본 이미지가 없으면 기본 아이콘 반환
          return <MdQuiz className="w-8 h-8 text-white" />;
      }
      return <img src={imageSrc} alt={quiz.name} className="w-16 h-16" />;
    } 
    // 아이콘을 사용하는 경우
    else {
      console.log('렌더링할 아이콘:', quiz.icon);
      switch(quiz.icon) {
        case 'MdComputer':
          return <MdComputer className="w-8 h-8 text-white" />;
        case 'MdCalculate':
          return <MdCalculate className="w-8 h-8 text-white" />;
        case 'MdScience':
          return <MdScience className="w-8 h-8 text-white" />;
        case 'MdQuiz':
          return <MdQuiz className="w-8 h-8 text-white" />;
        case 'MdBook':
          return <MdBook className="w-8 h-8 text-white" />;
        case 'MdTrendingUp':
          return <MdTrendingUp className="w-8 h-8 text-white" />;
        default:
          console.log('알 수 없는 아이콘:', quiz.icon);
          return <FaBook className="w-8 h-8 text-white" />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* 메인 섹션 */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16">
          {/* 왼쪽 콘텐츠 - 중앙 정렬 */}
          <div className="flex-1 lg:pr-6 mb-8 lg:mb-0 text-center lg:text-left space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 tracking-[0.02em]">
              Quizly에 오신 것을
              <br />
              환영합니다
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
              전공별 퀴즈로 시험을 준비하세요!
            </p>
            <div className="flex justify-center lg:justify-start">
              <button
                onClick={handleStartQuiz}
                className="bg-[#0C21C1] hover:bg-[#0A1DA8] text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors duration-200 flex items-center group"
              >
                퀴즈 시작
                <MdArrowForward className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* 오른쪽 그래픽 - 퀴즈/학습 테마 */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              {/* 퀴즈 카드들 */}
              <div className="relative space-y-3 mb-6">
                {/* 첫 번째 퀴즈 카드 */}
                <div className="bg-white border-2 border-[#0C21C1] rounded-lg p-4 shadow-md transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MdQuiz className="w-6 h-6 text-[#0C21C1]" />
                      <div>
                        <div className="w-16 h-2 bg-gray-200 rounded mb-1"></div>
                        <div className="w-12 h-2 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="bg-green-500 rounded-full p-1">
                      <MdCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* 두 번째 퀴즈 카드 */}
                <div className="bg-white border-2 border-green-500 rounded-lg p-4 shadow-md transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MdQuiz className="w-6 h-6 text-green-500" />
                      <div>
                        <div className="w-20 h-2 bg-gray-200 rounded mb-1"></div>
                        <div className="w-16 h-2 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="bg-green-500 rounded-full p-1">
                      <MdCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* 세 번째 퀴즈 카드 */}
                <div className="bg-white border-2 border-orange-500 rounded-lg p-4 shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MdQuiz className="w-6 h-6 text-orange-500" />
                      <div>
                        <div className="w-18 h-2 bg-gray-200 rounded mb-1"></div>
                        <div className="w-14 h-2 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="bg-[#0C21C1] rounded-full p-1">
                      <MdStar className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 학습 진도 그래프 */}
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">학습 진도</span>
                  <MdTrendingUp className="w-4 h-4 text-[#0C21C1]" />
                </div>
                <div className="flex items-end space-x-2 h-12">
                  <div className="bg-[#0C21C1] w-3 h-8 rounded-t"></div>
                  <div className="bg-green-500 w-3 h-10 rounded-t"></div>
                  <div className="bg-orange-500 w-3 h-6 rounded-t"></div>
                  <div className="bg-[#0C21C1] w-3 h-12 rounded-t"></div>
                  <div className="bg-green-500 w-3 h-9 rounded-t"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex-1 h-px bg-gray-200"></div>
          <div className="px-6">
            <div className="w-3 h-3 bg-[#0C21C1] rounded-full"></div>
          </div>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* 인기 퀴즈 섹션 */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            인기 퀴즈
          </h2>
          <p className="text-gray-600 text-center mb-12">
            지금 가장 인기 있는 퀴즈들을 풀어보세요!
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0C21C1]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularQuizzes.length > 0 ? popularQuizzes.map((quiz, index) => (
                <div
                  key={quiz._id || `quiz-${index}`}
                  onClick={() => handleQuizCategory(quiz._id, quiz.name)}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* 아이콘 또는 이미지 */}
                    <div className={`${quiz.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      {renderIconOrImage(quiz)}
                    </div>
                    
                    {/* 제목 */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {quiz.name}
                    </h3>
                    
                    {/* 퀴즈 개수 */}
                    <p className="text-gray-600">
                      {quiz.count}개의 퀴즈
                    </p>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">등록된 전공이 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 추가 기능 섹션 */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGraduationCap className="w-8 h-8 text-[#0C21C1]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                맞춤형 학습
              </h3>
              <p className="text-gray-600">
                전공별로 특화된 퀴즈로 효율적인 학습이 가능합니다.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBook className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                체계적 관리
              </h3>
              <p className="text-gray-600">
                틀린 문제는 오답노트로 관리하여 반복 학습할 수 있습니다.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdComputer className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sans">
                실시간 피드백
              </h3>
              <p className="text-gray-600 font-sans">
                퀴즈 풀이 후 즉시 정답과 해설을 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
