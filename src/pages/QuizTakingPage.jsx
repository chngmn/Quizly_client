import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // useNavigate 임포트
import Navbar from '../components/Navbar';

const dummyQuizzes = [
  {
    id: 1,
    question: "운영체제에서 프로세스 스케줄링의 목적은 CPU 활용도를 높이는 것이다. (O/X)",
    type: "OX",
    answer: "O",
  },
  {
    id: 2,
    question: "다음 중 객체지향 프로그래밍의 4가지 주요 특징이 아닌 것은?",
    type: "MULTIPLE_CHOICE",
    options: ["캡슐화", "상속", "다형성", "추상화", "병렬성"],
    answer: "병렬성",
  },
  {
    id: 3,
    question: "데이터베이스에서 여러 테이블의 데이터를 결합하는 데 사용되는 SQL 키워드는 무엇인가?",
    type: "SUBJECTIVE",
    answer: "JOIN",
  },
  {
    id: 4,
    question: "컴퓨터 네트워크에서 IP 주소를 물리적 주소(MAC 주소)로 변환하는 프로토콜은 ARP이다. (O/X)",
    type: "OX",
    answer: "O",
  },
  {
    id: 5,
    question: "다음 중 운영체제의 역할이 아닌 것은?",
    type: "MULTIPLE_CHOICE",
    options: ["자원 관리", "프로세스 관리", "파일 시스템 관리", "하드웨어 설계", "네트워크 관리"],
    answer: "하드웨어 설계",
  },
];

const QuizTakingPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [answered, setAnswered] = useState(false); // 문제 답변 여부 상태 추가

  const queryParams = new URLSearchParams(location.search);
  const major = queryParams.get('major');
  const subject = queryParams.get('subject');
  const chapter = queryParams.get('chapter');
  const quizType = queryParams.get('type');

  const currentQuiz = dummyQuizzes[currentQuizIndex];

  // 피드백 표시 후 2초 뒤에 사라지도록 하는 useEffect (자동 다음 문제 제거)
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        setShowFeedback(false);
        setFeedback(null); // 피드백 메시지 초기화
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  const handleAnswerSubmit = (answer) => {
    if (answered) return; // 이미 답변했으면 중복 제출 방지

    let isCorrect;
    if (currentQuiz.type === 'SUBJECTIVE') {
      isCorrect = answer.toLowerCase() === currentQuiz.answer.toLowerCase();
    } else {
      isCorrect = answer === currentQuiz.answer;
    }

    if (isCorrect) {
      setFeedback('정답입니다!');
    } else {
      setFeedback('오답입니다!');
    }
    setShowFeedback(true);
    setAnswered(true); // 답변 완료 상태로 변경
  };

  const handleNextQuestion = () => {
    setUserAnswer(''); // 사용자 입력 초기화
    setAnswered(false); // 답변 상태 초기화
    setCurrentQuizIndex((prevIndex) => prevIndex + 1);
  };

  const renderQuizInput = () => {
    if (!currentQuiz) return null;

    switch (currentQuiz.type) {
      case 'OX':
        return (
          <div className="flex space-x-4">
            <button
              className="p-3 rounded-md font-semibold bg-[#0C21C1] text-white hover:bg-[#0A1DA8] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleAnswerSubmit('O')}
              disabled={answered}
            >
              O
            </button>
            <button
              className="p-3 rounded-md font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleAnswerSubmit('X')}
              disabled={answered}
            >
              X
            </button>
          </div>
        );
      case 'MULTIPLE_CHOICE':
        return (
          <div className="flex flex-col space-y-2">
            {currentQuiz.options.map((option, index) => (
              <button
                key={index}
                className="p-3 rounded-md font-semibold bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleAnswerSubmit(option)}
                disabled={answered}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 'SUBJECTIVE':
        return (
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C21C1] disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="정답을 입력하세요"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !answered) { // 답변하지 않았을 때만 Enter 키 작동
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
      default:
        return null;
    }
  };

  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
          <h1 className="text-3xl font-bold mb-8">퀴즈 종료</h1>
          <p className="text-lg mb-8">모든 퀴즈를 푸셨습니다!</p>
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
        <p className="text-lg mb-6">{major} &gt; {subject} &gt; {chapter} &gt; {quizType}</p>

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl text-center relative">
          <p className="text-xl font-medium mb-8">{currentQuiz.question}</p>
          {renderQuizInput()}

          {showFeedback && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-white text-3xl font-bold ${feedback === '정답입니다!' ? 'bg-green-500 bg-opacity-90' : 'bg-red-500 bg-opacity-90'}`}>
              {feedback}
            </div>
          )}


        </div>

        {answered && (
          <button
            className="mt-8 p-3 rounded-md font-semibold bg-[#0C21C1] text-white hover:bg-[#0A1DA8]"
            onClick={handleNextQuestion}
          >
            다음 문제
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTakingPage;
