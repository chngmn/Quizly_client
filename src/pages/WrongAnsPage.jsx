import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const WrongAnsPage = () => {
    const navigate = useNavigate();
    const [selectedMajorId, setSelectedMajorId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedQuizType, setSelectedQuizType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [filteredAnswers, setFilteredAnswers] = useState([]);
    const [totalStats, setTotalStats] = useState({ totalQuestions: 0, wrongRate: 0 });
    const [majors, setMajors] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const itemsPerPage = 5;

    const quizTypeMap = {
        'OX': 'ox',
        'MULTIPLE_CHOICE': 'multiple',
        'SUBJECTIVE': 'subjective',
        'EXAM_ARCHIVE': 'exam_archive',
    };
    
    // 서버 유형을 한국어로 변환하는 함수
    const getQuizTypeForClient = (serverType) => {
        const typeMap = {
            'ox': 'O/X',
            'multiple': '객관식',
            'subjective': '주관식',
            'exam_archive': '족보'
        };
        return typeMap[serverType] || serverType;
    };
    
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

    // 오답 목록 불러오기
    useEffect(() => {
        const fetchWrongAnswersAndStats = async () => {
            try {
                setLoading(true);
                // 오답 목록 가져오기
                const wrongAnswersResponse = await api.get('/api/records/wrong-answers');
                setWrongAnswers(wrongAnswersResponse.data);
                setFilteredAnswers(wrongAnswersResponse.data);

                // 전체 푼 문제 수 가져오기
                const totalQuizzesResponse = await api.get('/api/records/total-quizzes-taken');
                const totalQuestions = totalQuizzesResponse.data.totalQuizzesTaken;
                const totalWrongCount = wrongAnswersResponse.data.length;

                const wrongRate = totalQuestions > 0 ? Math.round((totalWrongCount / totalQuestions) * 100) : 0;

                setTotalStats({ totalQuestions, wrongRate });

                setLoading(false);
            } catch (err) {
                console.error('데이터를 불러오는 데 실패했습니다:', err);
                setError('데이터를 불러오는 데 실패했습니다.');
                setLoading(false);
            }
        };
        fetchWrongAnswersAndStats();
    }, []);

    // 필터링 로직
    useEffect(() => {
        let filtered = wrongAnswers;

        if (selectedMajorId) {
            filtered = filtered.filter(item => item.quiz.major?._id === selectedMajorId);
        }

        if (selectedSubjectId) {
            filtered = filtered.filter(item => item.quiz.subject?._id === selectedSubjectId);
        }

        if (selectedQuizType && selectedQuizType !== '전체') {
            filtered = filtered.filter(item => item.quiz.type === quizTypeMap[selectedQuizType]);
        }

        setFilteredAnswers(filtered);
        setCurrentPage(1);
    }, [selectedMajorId, selectedSubjectId, selectedQuizType, wrongAnswers]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredAnswers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredAnswers.slice(startIndex, endIndex);

    // 페이지네이션 번호 생성
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

    const handleRetakeQuiz = (quizItem) => {
        // 해당 퀴즈를 QuizTakingPage로 전달하여 다시 풀기
        navigate('/quiz-taking', {
            state: {
                majorId: quizItem.quiz.major?._id,
                subjectId: quizItem.quiz.subject?._id,
                quizType: Object.keys(quizTypeMap).find(key => quizTypeMap[key] === quizItem.quiz.type), // 서버 유형을 클라이언트 유형으로 변환
                quizCount: 1, // 한 문제만 다시 풀기
                initialQuizId: quizItem.quiz._id // 특정 퀴즈부터 시작하도록 (선택 사항)
            }
        });
    };

    const quizTypes = ['전체', 'O/X', '객관식', '주관식', '족보'];

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-xl font-semibold">오답 목록을 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-xl font-semibold text-red-500">오류: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                {/* 헤더 섹션 */}
                <div className="mb-8 relative">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-[#0C21C1] mb-2">오답노트</h1>
                        <p className="text-gray-600 text-lg">틀린 문제를 전공별로 분류했습니다! 다시 복습해보세요!</p>
                    </div>
                    <div className="absolute top-0 right-0 text-right">
                        <span className="text-gray-700 font-semibold">
                            오답률: {totalStats.wrongRate}% | 총 {totalStats.totalQuestions}문제
                        </span>
                    </div>
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

                {/* 문제 리스트 */}
                <div className="space-y-4 mb-8">
                    {currentItems.length > 0 ? (
                        currentItems.map((item) => (
                            <div key={item.quiz._id} className="bg-white rounded-lg shadow-sm p-6 relative">
                                <div className="flex items-start">
                                    <div className="flex-1">
                                        <p className="text-gray-700 text-sm mb-3 text-left">{item.quiz.content}</p>
                                        <div className="flex items-center gap-6 text-left">
                                            <span className="text-gray-600">
                                                전공: <span className="font-semibold">{item.quiz.major?.name || '알 수 없음'}</span>
                                            </span>
                                            <span className="text-gray-600">
                                                과목: <span className="font-semibold">{item.quiz.subject?.name || '알 수 없음'}</span>
                                            </span>
                                            <span className="text-gray-600">
                                                유형: <span className="font-semibold">{getQuizTypeForClient(item.quiz.type)}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-20 flex flex-col items-end">
                                        <span className="text-gray-500 text-sm mb-3">{new Date(item.recordedAt).toLocaleDateString()}</span>
                                        <button
                                            onClick={() => handleRetakeQuiz(item)}
                                            className="px-6 py-2 bg-[#0C21C1] text-white font-semibold rounded-lg hover:bg-[#0A1DA8] transition-colors duration-200"
                                        >
                                            다시 풀기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg">
                                조건에 맞는 오답이 없습니다.
                            </div>
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

export default WrongAnsPage;