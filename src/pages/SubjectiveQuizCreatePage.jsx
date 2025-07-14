import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const SubjectiveQuizCreatePage = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSubmit = async () => {
        if (!subject || !question || !answer) {
            alert('과목, 문제, 정답을 모두 입력해주세요.');
            return;
        }

        try {
            const quizData = {
                title: `${subject} - 주관식 퀴즈`, // 제목 자동 생성
                subject,
                type: 'subjective',
                content: question,
                answer,
            };

            await api.post('/api/quizzes', quizData);
            alert('퀴즈가 성공적으로 등록되었습니다!');
            navigate('/my-quizzes');
        } catch (error) {
            console.error('퀴즈 등록 실패:', error);
            alert('퀴즈 등록에 실패했습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl text-[#0C21C1] font-bold mb-4">주관식 퀴즈 등록</h1>
                    </div>

                    <div className="space-y-6">
                        {/* 과목 입력 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                과목
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                placeholder="예: 데이터베이스"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        {/* 문제 입력 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                문제
                            </label>
                            <textarea
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm resize-none"
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
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm resize-none"
                                rows="4"
                                placeholder="정답을 입력하세요"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                        </div>

                        {/* 등록 버튼 */}
                        <div className="flex justify-center space-x-4 mt-8">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-40 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-lg"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="w-40 py-3 bg-[#0C21C1] text-white font-semibold rounded-full shadow-lg"
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