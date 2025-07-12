import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MyQuizzesPage = () => {
    const navigate = useNavigate();
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedQuizType, setSelectedQuizType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [myQuizzes, setMyQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    
    const itemsPerPage = 3;

    // 목업 데이터
    const mockMyQuizzes = [
        {
            id: 1,
            title: "이산수학 퀴즈",
            question: "다음 중 운영체제의 주요 기능에 해당하지 않는 것은?",
            major: "전산학/컴퓨터과학",
            subject: "운영체제",
            quizType: "MULTIPLE_CHOICE",
            quizTypeKr: "객관식",
            options: ["프로세스 관리", "메모리 관리", "파일 시스템", "웹 개발"],
            correctAnswer: "4",
            createdAt: "2024.07.01"
        },
        {
            id: 2,
            title: "자료구조 퀴즈",
            question: "다음 중 스택의 특성에 해당하지 않는 것은?",
            major: "전산학/컴퓨터과학",
            subject: "자료구조",
            quizType: "MULTIPLE_CHOICE",
            quizTypeKr: "객관식",
            options: ["LIFO", "FIFO", "push", "pop"],
            correctAnswer: "2",
            createdAt: "2024.06.28"
        },
        {
            id: 3,
            title: "알고리즘 퀴즈",
            question: "버블정렬의 시간복잡도는 O(n²)이다.",
            major: "전산학/컴퓨터과학",
            subject: "알고리즘",
            quizType: "OX",
            quizTypeKr: "O/X",
            correctAnswer: "O",
            createdAt: "2024.06.25"
        },
        {
            id: 4,
            title: "데이터베이스 퀴즈",
            question: "관계형 데이터베이스 정규화의 목적을 설명하시오.",
            major: "전산학/컴퓨터과학",
            subject: "데이터베이스",
            quizType: "SUBJECTIVE",
            quizTypeKr: "주관식",
            correctAnswer: "데이터 중복 제거 및 무결성 보장",
            createdAt: "2024.06.20"
        },
        {
            id: 5,
            title: "회로이론 퀴즈",
            question: "다음 중 수동소자에 해당하지 않는 것은?",
            major: "전자공학",
            subject: "회로이론",
            quizType: "MULTIPLE_CHOICE",
            quizTypeKr: "객관식",
            options: ["저항", "인덕터", "캐패시터", "트랜지스터"],
            correctAnswer: "4",
            createdAt: "2024.06.15"
        },
        {
            id: 6,
            title: "열역학 퀴즈",
            question: "엔트로피는 항상 증가한다.",
            major: "기계공학",
            subject: "열역학",
            quizType: "OX",
            quizTypeKr: "O/X",
            correctAnswer: "O",
            createdAt: "2024.06.10"
        },
        {
            id: 7,
            title: "네트워크 퀴즈",
            question: "OSI 7계층 모델에 대해 설명하시오.",
            major: "전산학/컴퓨터과학",
            subject: "네트워크",
            quizType: "SUBJECTIVE",
            quizTypeKr: "주관식",
            correctAnswer: "물리층부터 응용층까지의 통신 모델",
            createdAt: "2024.06.05"
        },
        {
            id: 8,
            title: "마케팅 퀴즈",
            question: "다음 중 마케팅 믹스 4P에 해당하지 않는 것은?",
            major: "경영학",
            subject: "마케팅",
            quizType: "MULTIPLE_CHOICE",
            quizTypeKr: "객관식",
            options: ["제품", "가격", "유통", "기술"],
            correctAnswer: "4",
            createdAt: "2024.05.30"
        },
        {
            id: 9,
            title: "디지털회로 퀴즈",
            question: "TCP는 연결 지향적 프로토콜이다.",
            major: "전자공학",
            subject: "디지털회로",
            quizType: "OX",
            quizTypeKr: "O/X",
            correctAnswer: "O",
            createdAt: "2024.05.25"
        },
        {
            id: 10,
            title: "경영전략 퀴즈",
            question: "다음 중 포터의 5가지 경쟁요소에 해당하지 않는 것은?",
            major: "경영학",
            subject: "경영전략",
            quizType: "MULTIPLE_CHOICE",
            quizTypeKr: "객관식",
            options: ["신규진입자", "대체재", "구매자", "정부"],
            correctAnswer: "4",
            createdAt: "2024.05.20"
        }
    ];

    const majors = ['전체', '전산학/컴퓨터과학', '전자공학', '기계공학', '경영학'];
    const subjects = {
        '전산학/컴퓨터과학': ['전체', '운영체제', '자료구조', '알고리즘', '데이터베이스', '네트워크'],
        '전자공학': ['전체', '회로이론', '디지털회로', '전자기학'],
        '기계공학': ['전체', '열역학', '유체역학', '재료역학'],
        '경영학': ['전체', '마케팅', '경영전략', '회계학'],
    };
    const quizTypes = ['전체', 'O/X', '객관식', '주관식', '족보'];

    // 컴포넌트 마운트 시 데이터 초기화
    useEffect(() => {
        setMyQuizzes(mockMyQuizzes);
        setFilteredQuizzes(mockMyQuizzes);
    }, []);

    // 필터링 로직
    useEffect(() => {
        let filtered = myQuizzes;
        
        if (selectedMajor && selectedMajor !== '전체') {
            filtered = filtered.filter(item => item.major === selectedMajor);
        }
        
        if (selectedSubject && selectedSubject !== '전체') {
            filtered = filtered.filter(item => item.subject === selectedSubject);
        }
        
        if (selectedQuizType && selectedQuizType !== '전체') {
            filtered = filtered.filter(item => item.quizTypeKr === selectedQuizType);
        }
        
        setFilteredQuizzes(filtered);
        setCurrentPage(1);
    }, [selectedMajor, selectedSubject, selectedQuizType, myQuizzes]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredQuizzes.slice(startIndex, endIndex);

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
        setSelectedMajor(e.target.value);
        setSelectedSubject('');
    };

    const handleMenuClick = (quizId) => {
        setOpenMenuId(openMenuId === quizId ? null : quizId);
    };

    const handleEditQuiz = (quizId) => {
        console.log('퀴즈 수정:', quizId);
        // 퀴즈 수정 페이지로 이동
        setOpenMenuId(null);
    };

    const handleDeleteQuiz = (quizId) => {
        if (window.confirm('정말로 이 퀴즈를 삭제하시겠습니까?')) {
            setMyQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
            console.log('퀴즈 삭제:', quizId);
        }
        setOpenMenuId(null);
    };

    const handleCreateNewQuiz = () => {
        navigate('/quiz-upload');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                {/* 헤더 섹션 */}
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
                                value={selectedMajor}
                                onChange={handleMajorChange}
                            >
                                <option value="">전공 선택</option>
                                {majors.map((major) => (
                                    <option key={major} value={major}>
                                        {major}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1]"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                disabled={!selectedMajor}
                            >
                                <option value="">과목 선택</option>
                                {selectedMajor && subjects[selectedMajor]?.map((subject) => (
                                    <option key={subject} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1]"
                                value={selectedQuizType}
                                onChange={(e) => setSelectedQuizType(e.target.value)}
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
                    {currentItems.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-lg shadow-sm p-6 relative">
                            <div className="flex items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-left">{quiz.title}</h3>
                                    <p className="text-gray-700 text-sm mb-3 text-left">{quiz.question}</p>
                                    <div className="flex items-center gap-4 text-left">
                                        <span className="text-gray-600">
                                            전공: <span className="font-semibold">{quiz.major}</span>
                                        </span>
                                        <span className="text-gray-600">
                                            과목: <span className="font-semibold">{quiz.subject}</span>
                                        </span>
                                        <span className="text-gray-600">
                                            유형: <span className="font-semibold">{quiz.quizTypeKr}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-20 flex flex-col items-end">
                                    <span className="text-gray-500 text-sm mb-3">{quiz.createdAt}</span>
                                    <div className="relative">
                                        <button
                                            onClick={() => handleMenuClick(quiz.id)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>
                                        
                                        {openMenuId === quiz.id && (
                                            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
                                                <button
                                                    onClick={() => handleEditQuiz(quiz.id)}
                                                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    퀴즈 수정
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteQuiz(quiz.id)}
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
                    ))}
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
                                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                    currentPage === pageNum
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

                {/* 결과 없음 메시지 */}
                {filteredQuizzes.length === 0 && (
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
        </div>
    );
};

export default MyQuizzesPage;
