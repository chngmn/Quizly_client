import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import logoImage from '../assets/logo_1.png';
import api from '../utils/api';

const QuizTakingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const [userSelectedOption, setUserSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // QuizPage에서 전달받은 데이터
  const { majorId, subjectId, quizType, quizCount } = location.state || {};

  // 서버의 퀴즈 유형과 클라이언트의 퀴즈 유형 매핑
  const quizTypeMap = {
    'OX': 'ox',
    'MULTIPLE_CHOICE': 'multiple',
    'SUBJECTIVE': 'subjective',
    'EXAM_ARCHIVE': 'exam_archive',
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!majorId || !subjectId || !quizType || !quizCount) {
        setError('퀴즈를 시작하기 위한 정보가 부족합니다. 이전 페이지로 돌아가 다시 선택해주세요.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const serverQuizType = quizTypeMap[quizType];
        if (!serverQuizType) {
          setError('유효하지 않은 퀴즈 유형입니다.');
          setLoading(false);
          return;
        }

        const response = await api.get('/api/quizzes', {
          params: {
            majorId,
            subjectId,
            type: serverQuizType,
            limit: quizCount,
          },
        });
        setQuizzes(response.data);
        setLoading(false);
      } catch (err) {
        console.error('퀴즈를 불러오는 데 실패했습니다:', err);
        setError('퀴즈를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [majorId, subjectId, quizType, quizCount]);

  const currentQuiz = quizzes[currentQuizIndex];

  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        setShowFeedback(false);
        setFeedback(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  const handleAnswerSubmit = async (answer) => {
    if (answered) return;

    setUserSelectedOption(answer);

    let isCorrect = false;
    if (currentQuiz.type === 'subjective') {
      isCorrect = answer.toLowerCase() === currentQuiz.answer.toLowerCase();
    } else if (currentQuiz.type === 'multiple') {
      isCorrect = answer === currentQuiz.options[parseInt(currentQuiz.answer)];
    } else if (currentQuiz.type === 'ox') {
      isCorrect = answer === currentQuiz.answer;
    }

    if (isCorrect) {
      setFeedback('정답입니다!');
      try {
        await api.post('/api/records', {
          quizId: currentQuiz._id,
          isCorrect: true,
          submittedAnswer: answer,
          correctAnswer: currentQuiz.answer,
        });
      } catch (recordError) {
        console.error('정답 기록 실패:', recordError);
      }
    } else {
      setFeedback('오답입니다!');
      try {
        await api.post('/api/records', {
          quizId: currentQuiz._id,
          isCorrect: false,
          submittedAnswer: answer,
          correctAnswer: currentQuiz.answer,
        });
      } catch (recordError) {
        console.error('오답 기록 실패:', recordError);
      }
    }
    setShowFeedback(true);
    setAnswered(true);
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setAnswered(false);
    setUserSelectedOption(null);
    setShowFeedback(false);
    setCurrentQuizIndex((prevIndex) => prevIndex + 1);
  };

  const renderQuizInput = () => {
    if (!currentQuiz) return null;

    switch (currentQuiz.type) {
      case 'ox':
        return (
          <div className="flex justify-center space-x-8">
            <button
              className={`w-24 h-24 rounded-full font-bold text-2xl transition-all duration-200 border-4 ${userAnswer === 'O'
                ? 'bg-[#0C21C1] text-white border-[#0C21C1] shadow-lg'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0C21C1] hover:text-[#0C21C1]'
                }`}
              onClick={() => handleAnswerSubmit('O')}
              disabled={answered}
            >
              O
            </button>
            <button
              className={`w-24 h-24 rounded-full font-bold text-2xl transition-all duration-200 border-4 ${userAnswer === 'X'
                ? 'bg-red-500 text-white border-red-500 shadow-lg'
                : 'bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-500'
                }`}
              onClick={() => handleAnswerSubmit('X')}
              disabled={answered}
            >
              X
            </button>
          </div>
        );
      case 'multiple':
        return (
          <div className="flex flex-col space-y-2">
            {currentQuiz.options.map((option, index) => (
              <button
                key={index}
                className={`p-3 rounded-md font-semibold transition-colors duration-200 border-2 ${answered && option === currentQuiz.options[parseInt(currentQuiz.answer)]
                  ? 'bg-green-500 text-white border-green-500'
                  : answered && option === userSelectedOption && option !== currentQuiz.options[parseInt(currentQuiz.answer)]
                    ? 'bg-red-500 text-white border-red-500'
                    : answered
                      ? 'bg-gray-200 text-gray-700 border-gray-300 opacity-50 cursor-not-allowed'
                      : option === userSelectedOption
                        ? 'bg-[#0C21C1] text-white border-[#0C21C1]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#0C21C1] hover:text-[#0C21C1]'
                  }`}
                onClick={() => handleAnswerSubmit(option)}
                disabled={answered}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 'subjective':
        return (
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C21C1] disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="정답을 입력하세요"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !answered) {
                  handleAnswerSubmit(userAnswer);
                }
              }}
              disabled={answered}
            />
            <button
              className="p-3 rounded-md font-semibold bg-[#0C21C1] text-white hover:bg-[#0A1DA8] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleAnswerSubmit(userAnswer)}
              disabled={answered}
            >
              제출
            </button>
          </div>
        );
      case 'exam_archive':
        return (
          <div className="w-full h-[500px]">
            {currentQuiz.files && currentQuiz.files.length > 0 ? (
              <iframe
                src={`http://localhost:8000${currentQuiz.files[0]}`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="족보 미리보기"
              ></iframe>
            ) : (
              <p className="text-gray-500">첨부된 족보 파일이 없습니다.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl font-semibold">퀴즈를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl font-semibold text-red-500">오류: {error}</p>
      </div>
    );
  }

  if (!currentQuiz || currentQuizIndex >= quizzes.length) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
          <h1 className="text-3xl font-bold mb-4">퀴즈 종료</h1>
          <p className="text-lg mb-16">모든 퀴즈를 푸셨습니다!</p>
          <div className="flex space-x-4">
            <button
              className="p-3 rounded-md font-semibold bg-[#0C21C1] text-white hover:bg-[#0A1DA8]"
              onClick={() => navigate('/main')}
            >
              메인화면으로 돌아가기
            </button>
            <button
              className="p-3 rounded-md font-semibold bg-red-500 text-white hover:bg-red-600"
              onClick={() => navigate('/wrong-answers')}
            >
              오답노트로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <h1 className="text-2xl font-bold mb-4">퀴즈 풀이</h1>
        <p className="text-lg mb-6">{currentQuiz.major?.name} &gt; {currentQuiz.subject?.name} &gt; {currentQuiz.type}</p>

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl text-center relative">
          <p className="text-xl font-medium mb-8">{currentQuiz.content}</p>
          {renderQuizInput()}

          {showFeedback && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-black text-3xl font-bold ${feedback === '정답입니다!' ? 'bg-opacity-90' : 'bg-opacity-90'}`}>
              <img
                src={logoImage}
                alt="Quizly Logo"
                className={`w-32 h-40 ${feedback === '정답입니다!' ? 'animate-quiz-popup-fade-out animate-quiz-bounce' : 'animate-quiz-popup-fade-out'}`}
              />
              <p className="mt-4">{feedback}</p>
            </div>
          )}
        </div>

        {answered && currentQuiz.type !== 'exam_archive' && (
          <button
            className="mt-8 p-3 rounded-md font-semibold bg-[#0C21C1] text-white hover:bg-[#0A1DA8]"
            onClick={handleNextQuestion}
          >
            다음 문제
          </button>
        )}
        {currentQuiz.type === 'exam_archive' && (
          <button
            className="mt-8 p-3 rounded-md font-semibold bg-[#0C21C1] text-white hover:bg-[#0A1DA8]"
            onClick={handleNextQuestion}
          >
            다음 족보
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTakingPage;