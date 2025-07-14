import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const QuizEditPage = () => {
    const navigate = useNavigate();
    const { quizId } = useParams();
    const location = useLocation();
    const quizData = location.state?.quizData;

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    // 초기 데이터 설정
    useEffect(() => {
        if (quizData) {
            setQuestion(quizData.question || '');
            setOptions(quizData.options || ['', '', '', '']);
            setAnswer(quizData.answer || '');
        }
    }, [quizData]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = () => {
        if (!question || !answer) {
            alert('문제와 정답을 모두 입력해주세요.');
            return;
        }

        // 객관식인 경우 모든 보기 확인
        if (quizData?.type === 'MULTIPLE_CHOICE') {
            if (options.some(option => !option.trim())) {
                alert('모든 보기를 입력해주세요.');
                return;
            }
        }

        setLoading(true);

        // 백엔드 API 호출 (현재는 목업)
        console.log('퀴즈 수정 데이터:', {
            question,
            options,
            answer,
            type: quizData?.type
        });
        
        setTimeout(() => {
            alert('퀴즈가 성공적으로 수정되었습니다!');
            navigate('/my-quizzes');
        }, 1000);
    };

    const renderQuizForm = () => {
        switch (quizData?.type) {
            case 'OX':
                return (
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
                    </div>
                );

            case 'MULTIPLE_CHOICE':
                return (
                    <div className="space-y-6">
                        {/* 문제 입력 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                문제
                            </label>
                            <textarea
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700 resize-none"
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
                                        className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700"
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
                                            answer === (index + 1).toString()
                                                ? 'bg-[#0C21C1] text-white border-[#0C21C1] shadow-lg'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0C21C1] hover:text-[#0C21C1]'
                                        }`}
                                        onClick={() => setAnswer((index + 1).toString())}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'SUBJECTIVE':
                return (
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
                    </div>
                );

            default:
                return <div>퀴즈 유형을 찾을 수 없습니다.</div>;
        }
    };

    const getQuizTypeLabel = () => {
        switch (quizData?.type) {
            case 'OX': return 'O/X 문제';
            case 'MULTIPLE_CHOICE': return '객관식 문제';
            case 'SUBJECTIVE': return '주관식 문제';
            default: return '문제';
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl text-[#0C21C1] font-bold mb-4">퀴즈 수정</h1>
                        <p className="text-gray-600 text-lg">
                            {quizData?.major} {'>'} {quizData?.subject} {'>'} {getQuizTypeLabel()}
                        </p>
                    </div>

                    {renderQuizForm()}

                    {/* 수정 버튼 */}
                    <div className="flex justify-center space-x-4 mt-8">
                        <button
                            onClick={() => navigate('/my-quizzes')}
                            className="w-40 py-3 bg-gray-500 text-white font-semibold rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-gray-600 hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)]"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-40 py-3 bg-[#0C21C1] text-white font-semibold rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-[#0A1DA8] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)] disabled:opacity-50"
                        >
                            {loading ? '수정 중...' : '수정하기'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizEditPage;
