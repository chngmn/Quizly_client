import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const QuizEditPage = () => {
    const { quizId } = useParams(); // URL 파라미터에서 퀴즈 ID 가져오기
    const navigate = useNavigate();

    const [quizData, setQuizData] = useState(null); // 서버에서 불러온 원본 퀴즈 데이터
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [answer, setAnswer] = useState('');
    const [description, setDescription] = useState(''); // 족보용 description
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 퀴즈 데이터 불러오기
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await api.get(`/api/quizzes/${quizId}`);
                const fetchedQuiz = response.data;
                setQuizData(fetchedQuiz);
                setQuestion(fetchedQuiz.content || '');
                setOptions(fetchedQuiz.options || ['', '', '', '']);
                setAnswer(fetchedQuiz.answer || '');
                setDescription(fetchedQuiz.description || ''); // 족보용 description
                setLoading(false);
            } catch (err) {
                console.error('퀴즈 데이터를 불러오는 데 실패했습니다:', err);
                setError('퀴즈 데이터를 불러오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchQuizData();
    }, [quizId]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async () => {
        if (!quizData) return; // 퀴즈 데이터가 없으면 제출 안 함

        // 필수 필드 검사
        if (!question || !answer) {
            alert('문제와 정답을 모두 입력해주세요.');
            return;
        }

        if (quizData.type === 'multiple' && options.some(option => !option.trim())) {
            alert('객관식은 모든 보기를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            const updatedQuizData = {
                major: quizData.major._id, // ID로 전달
                subject: quizData.subject._id, // ID로 전달
                type: quizData.type,
                content: question,
                answer: quizData.type === 'multiple' ? (parseInt(answer, 10) - 1).toString() : answer, // 객관식은 인덱스로 변환
                options: quizData.type === 'multiple' || quizData.type === 'ox' ? options : [],
                description: description, // 족보용 description
                // files 필드는 수정에서 제외 (파일 수정은 별도 로직 필요)
            };

            // FormData가 필요한 경우 (파일 업로드 포함된 경우)
            let dataToSend;
            let headers = { 'Content-Type': 'application/json' };

            if (quizData.type === 'exam_archive') {
                // 족보 수정 시 파일은 별도 처리 (현재는 파일 수정 기능 없음)
                // FormData를 사용해야 하지만, 현재는 파일 필드가 없으므로 일반 JSON으로 보냄
                // 만약 파일 수정 기능이 추가된다면 FormData로 변경해야 함
                dataToSend = updatedQuizData;
            } else {
                dataToSend = updatedQuizData;
            }

            await api.put(`/api/quizzes/${quizId}`, dataToSend, { headers });

            alert('퀴즈가 성공적으로 수정되었습니다!');
            navigate('/my-quizzes');
        } catch (err) {
            console.error('퀴즈 수정 실패:', err);
            alert(err.response?.data?.error || '퀴즈 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const renderQuizForm = () => {
        if (!quizData) return null;

        switch (quizData.type) {
            case 'ox':
                return (
                    <div className="space-y-8">
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
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                정답
                            </label>
                            <div className="flex justify-center space-x-20">
                                <button
                                    className={`w-25 h-25 rounded-full font-bold text-2xl transition-all duration-200 border-4 ${answer === 'O'
                                        ? 'bg-green-400 text-white border-green-400 shadow-lg'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:text-green-400'
                                        }`}
                                    onClick={() => setAnswer('O')}
                                >
                                    O
                                </button>
                                <button
                                    className={`w-25 h-25 rounded-full font-bold text-2xl transition-all duration-200 border-4 ${answer === 'X'
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

            case 'multiple':
                return (
                    <div className="space-y-6">
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
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                정답 체크
                            </label>
                            <div className="flex justify-center space-x-4">
                                {options.map((option, index) => (
                                    <button
                                        key={index}
                                        className={`w-12 h-12 rounded-full font-bold text-lg transition-all duration-200 border-2 ${answer === (index + 1).toString()
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

            case 'subjective':
                return (
                    <div className="space-y-6">
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
            case 'exam_archive':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                족보 제목
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                placeholder="예: 2023년 2학기 운영체제 중간고사 족보"
                                value={quizData.content}
                                onChange={(e) => setQuizData({ ...quizData, content: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                설명
                            </label>
                            <textarea
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700 resize-none"
                                rows="4"
                                placeholder="족보에 대한 추가 설명을 입력하세요"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        {/* 파일 수정 기능은 추후 구현 */}
                        <p className="text-gray-500">파일 수정 기능은 현재 지원되지 않습니다.</p>
                    </div>
                );

            default:
                return <div>퀴즈 유형을 찾을 수 없습니다.</div>;
        }
    };

    const getQuizTypeLabel = () => {
        switch (quizData?.type) {
            case 'ox': return 'O/X 문제';
            case 'multiple': return '객관식 문제';
            case 'subjective': return '주관식 문제';
            case 'exam_archive': return '족보';
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
                            {quizData?.major?.name} {'>'} {quizData?.subject?.name} {'>'} {getQuizTypeLabel()}
                        </p>
                    </div>

                    {renderQuizForm()}

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