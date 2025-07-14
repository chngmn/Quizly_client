import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api'; // API 유틸리티 임포트

const MyQuizzesPage = () => {
    const navigate = useNavigate();
    const [selectedMajorId, setSelectedMajorId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [majors, setMajors] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedQuizType, setSelectedQuizType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [myQuizzes, setMyQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);

    const itemsPerPage = 5; // 페이지 당 항목 수

    // 전공 목록 불러오기
    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const response = await api.get('/api/majors');
                setMajors(response.data);
            } catch (error) {
                console.error('전공 목록을 불러오는 데 실패했습니다:', error);
            }
        };
        fetchMajors();
    }, []);

    // 선택된 전공에 따라 과목 목록 불러오기
    useEffect(() => {
        if (selectedMajorId) {
            const fetchSubjects = async () => {
                try {
                    const response = await api.get(`/api/subjects/${selectedMajorId}`);
                    setSubjects(response.data);
                } catch (error) {
                    console.error('과목 목록을 불러오는 데 실패했습니다:', error);
                }
            };
            fetchSubjects();
        } else {
            setSubjects([]);
        }
    }, [selectedMajorId]);

    // 컴포넌트 마운트 시 내 퀴즈 목록을 서버에서 가져옴
    useEffect(() => {
        const fetchMyQuizzes = async () => {
            try {
                const response = await api.get('/api/quizzes/myquizzes');
                setMyQuizzes(response.data);
                setFilteredQuizzes(response.data);
            } catch (error) {
                console.error("내 퀴즈 목록을 불러오는 데 실패했습니다:", error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchMyQuizzes();
    }, [navigate]);

    // 필터링 로직
    useEffect(() => {
        let filtered = myQuizzes;

        if (selectedMajorId) {
            filtered = filtered.filter(item => item.major._id === selectedMajorId);
        }

        if (selectedSubjectId) {
            filtered = filtered.filter(item => item.subject._id === selectedSubjectId);
        }

        if (selectedQuizType && selectedQuizType !== '전체') {
            filtered = filtered.filter(item => {
                // 서버의 type은 소문자, 클라이언트의 quizTypes는 대소문자 혼용이므로 통일
                const quizTypeMap = {
                    'O/X': 'ox',
                    '객관식': 'multiple',
                    '주관식': 'subjective',
                    '족보': 'exam_archive',
                };
                return item.type === quizTypeMap[selectedQuizType];
            });
        }

        setFilteredQuizzes(filtered);
        setCurrentPage(1);
    }, [selectedMajorId, selectedSubjectId, selectedQuizType, myQuizzes]);

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

    const handleMajorChange = (e) => {
        setSelectedMajorId(e.target.value);
        setSelectedSubjectId('');
    };

    const handleSubjectChange = (e) => {
        setSelectedSubjectId(e.target.value);
    };

    const handleQuizTypeChange = (e) => {
        setSelectedQuizType(e.target.value);
    };

    const handleMenuClick = (quizId) => {
        setOpenMenuId(openMenuId === quizId ? null : quizId);
    };

    const handleEditQuiz = (quizId) => {
        navigate(`/quiz-edit/${quizId}`); // 퀴즈 수정 페이지로 이동
        setOpenMenuId(null);
    };

    const handleDeleteQuiz = async (quizId) => {
        if (window.confirm('정말로 이 퀴즈를 삭제하시겠습니까?')) {
            try {
                await api.delete(`/api/quizzes/${quizId}`);
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

    const quizTypes = ['전체', 'O/X', '객관식', '주관식', '족보'];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
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

                {/* 필터 섹션 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1]"
                                value={selectedMajorId}
                                onChange={handleMajorChange}
                            >
                                <option value="">전공 선택</option>
                                {majors.map((major) => (
                                    <option key={major._id} value={major._id}>
                                        {major.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1]"
                                value={selectedSubjectId}
                                onChange={handleSubjectChange}
                                disabled={!selectedMajorId}
                            >
                                <option value="">과목 선택</option>
                                {subjects.map((subject) => (
                                    <option key={subject._id} value={subject._id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1]"
                                value={selectedQuizType}
                                onChange={handleQuizTypeChange}
                            >
                                <option value="">유형 선택</option>
                                {quizTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 퀴즈 리스트 */}
                <div className="space-y-4 mb-8">
                    {currentItems.length > 0 ? (
                        currentItems.map((quiz) => (
                            <div key={quiz._id} className="bg-white rounded-lg shadow-sm p-6 relative">
                                <div className="flex items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 text-left">{quiz.subject.name.substring(0, 50)}</h3>
                                        <p className="text-gray-700 text-sm mb-3 text-left">{quiz.content}</p>
                                        <div className="flex items-center gap-4 text-left">
                                            <span className="text-gray-600">
                                                전공: <span className="font-semibold">{quiz.major?.name || '알 수 없음'}</span>
                                            </span>
                                            <span className="text-gray-600">
                                                과목: <span className="font-semibold">{quiz.subject?.name || '알 수 없음'}</span>
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
                                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                </svg>
                                            </button>

                                            {openMenuId === quiz._id && (
                                                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
                                                    <button
                                                        onClick={() => handleEditQuiz(quiz._id)}
                                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        퀴즈 수정
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteQuiz(quiz._id)}
                                                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        퀴즈 삭제
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg mb-4">
                                등록한 퀴즈가 없습니다.
                            </div>
                            <button
                                onClick={handleCreateNewQuiz}
                                className="px-6 py-3 bg-[#0C21C1] text-white font-semibold rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-[#0A1DA8] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)]"
                            >
                                첫 번째 퀴즈 만들기
                            </button>
                        </div>
                    )}
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${currentPage === pageNum
                                    ? 'bg-[#0C21C1] text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyQuizzesPage;

