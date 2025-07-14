import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const MultipleChoiceQuizCreatePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { majorId, subjectId } = location.state || {};

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async () => {
        if (!question || options.some(opt => !opt.trim()) || !correctAnswer) {
            alert('문제, 모든 보기, 정답을 입력해주세요.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', `객관식 퀴즈`);
            formData.append('major', majorId);
            formData.append('subject', subjectId);
            formData.append('type', 'multiple');
            formData.append('content', question);
            formData.append('options', JSON.stringify(options)); // options를 JSON 문자열로 변환
            formData.append('answer', correctAnswer); // answer는 문자열 그대로

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
                        <h1 className="text-4xl text-[#0C21C1] font-bold mb-4">객관식 퀴즈 등록</h1>
                    </div>

                    <div className="space-y-6">
                        {/* 문제 입력 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                문제
                            </label>
                            <textarea
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm resize-none"
                                rows="4"
                                placeholder="객관식 문제를 입력하세요"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </div>

                        {/* 보기 입력 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                보기
                            </label>
                            {options.map((option, index) => (
                                <div key={index} className="flex items-center mb-3">
                                    <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full font-semibold text-gray-700 mr-3">
                                        {index + 1}
                                    </span>
                                    <input
                                        type="text"
                                        className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm"
                                        placeholder={`${index + 1}번 보기를 입력하세요`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* 정답 선택 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                정답 체크
                            </label>
                            <div className="flex justify-center space-x-4">
                                {options.map((option, index) => (
                                    <button
                                        key={index}
                                        className={`w-12 h-12 rounded-full font-bold text-lg transition-all duration-200 border-2 ${
                                            correctAnswer === (index + 1).toString()
                                                ? 'bg-[#0C21C1] text-white border-[#0C21C1] shadow-lg'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0C21C1] hover:text-[#0C21C1]'
                                        }`}
                                        onClick={() => setCorrectAnswer((index + 1).toString())}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
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

export default MultipleChoiceQuizCreatePage; 