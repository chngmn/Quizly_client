import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const QuizUploadPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 퀴즈 기본 정보
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    
    // 문제 목록
    const [questions, setQuestions] = useState([]);

    // 다른 페이지에서 문제 추가하고 돌아왔을 때 상태 업데이트
    useEffect(() => {
        if (location.state?.newQuestion) {
            setQuestions(prevQuestions => [...prevQuestions, location.state.newQuestion]);
            // 중복 추가 방지를 위해 location.state 초기화
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate]);

    const handleAddQuestion = (quizType) => {
        if (!title || !subject) {
            alert('퀴즈 제목과 과목을 먼저 입력해주세요.');
            return;
        }
        
        const quizInfo = { title, subject, description };

        // 문제 유형에 따라 다른 생성 페이지로 이동 (퀴즈 정보 전달)
        if (quizType === 'OX') {
            navigate('/quiz-create/ox', { state: { quizInfo, existingQuestions: questions } });
        } else if (quizType === 'MULTIPLE_CHOICE') {
            navigate('/quiz-create/multiple-choice', { state: { quizInfo, existingQuestions: questions } });
        } else if (quizType === 'SUBJECTIVE') {
            navigate('/quiz-create/subjective', { state: { quizInfo, existingQuestions: questions } });
        }
    };

    const handleQuizSubmit = async () => {
        if (!title || !subject || questions.length === 0) {
            alert('퀴즈 제목, 과목을 입력하고, 하나 이상의 문제를 추가해주세요.');
            return;
        }

        try {
            // 서버의 새로운 API에 맞춰 퀴즈 정보와 문제 목록을 한 번에 전송
            const quizData = {
                title,
                subject,
                description,
                questions, // 문제 객체 배열을 그대로 전달
            };

            await api.post('/api/quizzes', quizData);

            alert('퀴즈가 성공적으로 등록되었습니다!');
            navigate('/my-quizzes'); // 내 퀴즈 목록 페이지로 이동

        } catch (error) {
            console.error('퀴즈 등록 실패:', error);
            alert('퀴즈 등록에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8 text-[#0C21C1]">새 퀴즈 만들기</h1>

                    {/* 퀴즈 정보 입력 */}
                    <div className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-md mb-8">
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">퀴즈 제목</label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="예: 2024년 1학기 운영체제 기말고사"
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">과목</label>
                            <input 
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="예: 운영체제"
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-2">퀴즈 설명 (선택)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="퀴즈에 대한 간단한 설명을 입력하세요."
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* 문제 목록 */}
                    <div className="space-y-4 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800">문제 목록</h2>
                        {questions.length === 0 ? (
                            <p className="text-gray-500">아직 추가된 문제가 없습니다. 아래에서 문제 유형을 선택하여 추가해주세요.</p>
                        ) : (
                            <ul className="space-y-3">
                                {questions.map((q, index) => (
                                    <li key={index} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                                        <span className="font-medium">{index + 1}. {q.content.substring(0, 50)}... ({q.type})</span>
                                        {/* 수정/삭제 버튼은 추후 구현 */}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 문제 추가 버튼 */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
                        <h3 className="text-xl font-semibold text-center mb-4">문제 추가하기</h3>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => handleAddQuestion('MULTIPLE_CHOICE')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold">객관식</button>
                            <button onClick={() => handleAddQuestion('OX')} className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold">O/X</button>
                            <button onClick={() => handleAddQuestion('SUBJECTIVE')} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold">주관식</button>
                        </div>
                    </div>

                    {/* 퀴즈 제출 버튼 */}
                    <div className="text-center">
                        <button 
                            onClick={handleQuizSubmit}
                            className="w-full max-w-xs py-3 bg-[#0C21C1] text-white font-bold rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105"
                        >
                            퀴즈 등록 완료
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizUploadPage;
