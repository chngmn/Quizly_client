import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SubjectiveQuizCreatePage = () => {
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

        console.log('주관식 퀴즈 등록:', quizData);
        alert('주관식 퀴즈가 성공적으로 등록되었습니다!');
        navigate('/quiz-upload');
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl text-[#0C21C1] font-bold mb-4">주관식 퀴즈 등록</h1>
                        <p className="text-gray-600 text-lg">
                            {major} {'>'} {subject} {'>'} 주관식 문제
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* 문제 입력 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                문제
                            </label>
                            <textarea
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700 resize-none"
                                rows="6"
                                placeholder="주관식 문제를 입력하세요"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </div>

                        {/* 정답 입력 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                정답
                            </label>
                            <textarea
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700 resize-none"
                                rows="4"
                                placeholder="정답을 입력하세요"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                        </div>

                        {/* 등록 버튼 */}
                        <div className="flex justify-center space-x-4 mt-8">
                            <button
                                onClick={() => navigate('/quiz-upload')}
                                className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-gray-600 hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)]"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-[#0C21C1] text-white font-semibold rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-[#0A1DA8] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)]"
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

export default SubjectiveQuizCreatePage; 