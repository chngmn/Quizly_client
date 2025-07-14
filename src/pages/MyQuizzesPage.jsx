import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api'; // API 유틸리티 임포트

const MyQuizzesPage = () => {
    const navigate = useNavigate();
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedQuizType, setSelectedQuizType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [myQuizzes, setMyQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    
    const itemsPerPage = 5; // 페이지 당 항목 수

    // 컴포넌트 마운트 시 내 퀴즈 목록을 서버에서 가져옴
    useEffect(() => {
        const fetchMyQuizzes = async () => {
            try {
                const response = await api.get('/api/quizzes/myquizzes');
                setMyQuizzes(response.data);
                setFilteredQuizzes(response.data);
            } catch (error) {
                console.error("내 퀴즈 목록을 불러오는 데 실패했습니다:", error);
                // 예를 들어, 로그인 페이지로 리디렉션 할 수 있습니다.
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchMyQuizzes();
    }, [navigate]);

    // 필터링 로직 (기존 로직 유지)
    useEffect(() => {
        let filtered = myQuizzes;
        // ... 필터링 로직은 여기에 ...
        setFilteredQuizzes(filtered);
        setCurrentPage(1);
    }, [selectedMajor, selectedSubject, selectedQuizType, myQuizzes]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredQuizzes.slice(startIndex, endIndex);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 10;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const handleMenuClick = (quizId) => {
        setOpenMenuId(openMenuId === quizId ? null : quizId);
    };

    const handleEditQuiz = (quizId) => {
        console.log('퀴즈 수정 기능은 구현 예정입니다:', quizId);
        // navigate(`/quiz-edit/${quizId}`); // 수정 페이지로 이동
        setOpenMenuId(null);
    };

    const handleDeleteQuiz = async (quizId) => {
        if (window.confirm('정말로 이 퀴즈를 삭제하시겠습니까?')) {
            try {
                await api.delete(`/api/quizzes/${quizId}`);
                // 상태 업데이트: 삭제된 퀴즈를 목록에서 제거
                const updatedQuizzes = myQuizzes.filter(quiz => quiz._id !== quizId);
                setMyQuizzes(updatedQuizzes);
                alert('퀴즈가 성공적으로 삭제되었습니다.');
            } catch (error) {
                console.error('퀴즈 삭제 실패:', error);
                alert(error.response?.data?.error || '퀴즈 삭제에 실패했습니다.');
            }
        }
        setOpenMenuId(null);
    };

    const handleCreateNewQuiz = () => {
        navigate('/quiz-upload');
    };

    // ... (return 문은 기존 구조와 거의 동일, key와 id를 quiz._id로 변경)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                {/* ... 헤더 ... */}
                <div className="mb-8 relative">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-[#0C21C1] mb-2">내 퀴즈 관리</h1>
                        <p className="text-gray-600 text-lg">등록한 퀴즈를 수정하거나 삭제하세요.</p>
                    </div>
                    <button
                        onClick={handleCreateNewQuiz}
                        className="absolute top-0 right-0 px-6 py-3 bg-[#0C21C1] text-white font-semibold rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-[#0A1DA8] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)]"
                    >
                        새 퀴즈 만들기
                    </button>
                </div>

                {/* ... 필터 ... */}

                {/* 퀴즈 리스트 */}
                <div className="space-y-4 mb-8">
                    {currentItems.map((quiz) => (
                        <div key={quiz._id} className="bg-white rounded-lg shadow-sm p-6 relative">
                            <div className="flex items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-left">{quiz.title}</h3>
                                    <p className="text-gray-700 text-sm mb-3 text-left">{quiz.content}</p>
                                    <div className="flex items-center gap-4 text-left">
                                        <span className="text-gray-600">
                                            과목: <span className="font-semibold">{quiz.subject}</span>
                                        </span>
                                        <span className="text-gray-600">
                                            유형: <span className="font-semibold">{quiz.type}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-20 flex flex-col items-end">
                                    <span className="text-gray-500 text-sm mb-3">{new Date(quiz.createdAt).toLocaleDateString()}</span>
                                    <div className="relative">
                                        <button
                                            onClick={() => handleMenuClick(quiz._id)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                        >
                                            {/* ... SVG 아이콘 ... */}
                                        </button>
                                        
                                        {openMenuId === quiz._id && (
                                            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
                                                <button
                                                    onClick={() => handleEditQuiz(quiz._id)}
                                                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                >
                                                    {/* ... SVG 아이콘 ... */}
                                                    퀴즈 수정
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteQuiz(quiz._id)}
                                                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    {/* ... SVG 아이콘 ... */}
                                                    퀴즈 삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ... 페이지네이션 ... */}

                {/* ... 결과 없음 메시지 ... */}
            </div>
        </div>
    );
};

export default MyQuizzesPage;

