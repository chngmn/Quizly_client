import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OXQuizCreatePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { major, subject, quizType } = location.state || {};

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSubmit = () => {
        if (!question || !answer) {
            alert('문제와 정답을 모두 입력해주세요.');
            return;
        }

        // 퀴즈 등록 API 호출 로직 추가 예정
        const quizData = {
            major,
            subject,
            quizType,
            question,
            answer,
            createdAt: new Date().toISOString()
        };

        console.log('O/X 퀴즈 등록:', quizData);
        alert('O/X 퀴즈가 성공적으로 등록되었습니다!');
        navigate('/quiz-upload');
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl text-[#0C21C1] font-bold mb-4">O/X 퀴즈 등록</h1>
                        <p className="text-gray-600 text-lg">
                            {major} {'>'}  {subject} {'>'}  O/X 문제
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* 문제 입력 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                문제
                            </label>
                            <textarea
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700 resize-none"
                                rows="6"
                                placeholder="O/X 문제를 입력하세요..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </div>

                        {/* 정답 선택 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                정답
                            </label>
                            <div className="flex justify-center space-x-20">
                                <button
                                    className={`w-25 h-25 rounded-full font-bold text-2xl transition-all duration-200 border-4 ${
                                        answer === 'O' 
                                            ? 'bg-green-400 text-white border-green-400 shadow-lg' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:text-green-400'
                                    }`}
                                    onClick={() => setAnswer('O')}
                                >
                                    O
                                </button>
                                <button
                                    className={`w-25 h-25 rounded-full font-bold text-2xl transition-all duration-200 border-4 ${
                                        answer === 'X' 
                                            ? 'bg-red-500 text-white border-red-500 shadow-lg' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-500'
                                    }`}
                                    onClick={() => setAnswer('X')}
                                >
                                    X
                                </button>
                            </div>
                        </div>

                        {/* 등록 버튼 */}
                        <div className="flex justify-center space-x-10">
                            <button
                                onClick={() => navigate('/quiz-upload')}
                                className="w-35 py-3 bg-gray-500 text-white font-semibold rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-gray-600 hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)]"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="w-35 py-3 bg-[#0C21C1] text-white font-semibold rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-[#0A1DA8] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)]"
                            >
                                등록하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OXQuizCreatePage;
