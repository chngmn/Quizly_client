import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const OXQuizCreatePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { majorId, subjectId } = location.state || {}; // QuizUploadPage에서 전달받은 ID

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSubmit = async () => {
        if (!question || !answer) {
            alert('문제와 정답을 모두 입력해주세요.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', `O/X 퀴즈`);
            formData.append('major', majorId);
            formData.append('subject', subjectId);
            formData.append('type', 'ox');
            formData.append('content', question);
            formData.append('answer', answer);
            formData.append('options', JSON.stringify([])); // options를 JSON 문자열로 변환

            await api.post('/api/quizzes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
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
                        <h1 className="text-4xl text-[#0C21C1] font-bold mb-4">O/X 퀴즈 등록</h1>
                    </div>

                    <div className="space-y-8">
                        {/* 문제 입력 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                문제
                            </label>
                            <textarea
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm resize-none"
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
                                    className={`w-24 h-24 rounded-full font-bold text-3xl transition-all duration-200 border-4 ${
                                        answer === 'O' 
                                            ? 'bg-green-400 text-white border-green-400 shadow-lg' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:text-green-400'
                                    }`}
                                    onClick={() => setAnswer('O')}
                                >
                                    O
                                </button>
                                <button
                                    className={`w-24 h-24 rounded-full font-bold text-3xl transition-all duration-200 border-4 ${
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
                        <div className="flex justify-center space-x-4 mt-10">
                            <button
                                onClick={() => navigate(-1)} // 이전 페이지로
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

export default OXQuizCreatePage;
