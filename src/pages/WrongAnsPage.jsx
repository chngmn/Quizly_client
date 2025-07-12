import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const WrongAnsPage = () => {
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedQuizType, setSelectedQuizType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [filteredAnswers, setFilteredAnswers] = useState([]);
    const [totalStats, setTotalStats] = useState({ totalQuestions: 0, wrongRate: 0 });
    
    const itemsPerPage = 3;

    // 목업 데이터
    const mockWrongAnswers = [
        {
            id: 1,
            title: "이산수학 퀴즈",
            major: "전산학/컴퓨터과학",
            subject: "컴퓨터과학",
            quizType: "MULTIPLE_CHOICE",
            quizTypeKr: "객관식",
            myAnswer: "C",
            correctAnswer: "A",
            date: "2024.07.01",
            question: "그래프 이론에서 완전그래프 K5의 간선 수는?"
        },
        {
            id: 2,
            title: "회로이론 퀴즈",
            major: "전자공학",
            subject: "전기전자",
            quizType: "OX",
            quizTypeKr: "O/X",
            myAnswer: "False",
            correctAnswer: "True",
            date: "2024.06.27",
            question: "키르히호프 전압 법칙은 폐루프에서 전압의 합이 0이다."
        },
        {
            id: 3,
            title: "미시경제학 퀴즈",
            major: "경영학",
            subject: "경제학",
            quizType: "SUBJECTIVE",
            quizTypeKr: "주관식",
            myAnswer: "Seoul",
            correctAnswer: "Busan",
            date: "2024.06.25",
            question: "한국의 최대 무역항은 어디인가?"
        },
        {
            id: 4,
            title: "자료구조 퀴즈",
            major: "전산학/컴퓨터과학",
            subject: "컴퓨터과학",
            quizType: "MULTIPLE_CHOICE",
            quizTypeKr: "객관식",
            myAnswer: "B",
            correctAnswer: "D",
            date: "2024.06.20",
            question: "스택의 시간복잡도는?"
        },
        {
            id: 5,
            title: "열역학 퀴즈",
            major: "기계공학",
            subject: "기계공학",
            quizType: "OX",
            quizTypeKr: "O/X",
            myAnswer: "X",
            correctAnswer: "O",
            date: "2024.06.15",
            question: "엔트로피는 항상 증가한다."
        },
        {
            id: 6,
            title: "알고리즘 퀴즈",
            major: "전산학/컴퓨터과학",
            subject: "컴퓨터과학",
            quizType: "SUBJECTIVE",
            quizTypeKr: "주관식",
            myAnswer: "O(n²)",
            correctAnswer: "O(n log n)",
            date: "2024.06.10",
            question: "퀵 정렬의 평균 시간복잡도는?"
        },
        {
            id: 7,
            title: "디지털논리회로 퀴즈",
            major: "전자공학",
            subject: "전기전자",
            quizType: "MULTIPLE_CHOICE",
            quizTypeKr: "객관식",
            myAnswer: "A",
            correctAnswer: "C",
            date: "2024.06.05",
            question: "NAND 게이트의 진리표에서 0,0의 출력은?"
        },
        {
            id: 8,
            title: "마케팅 퀴즈",
            major: "경영학",
            subject: "경영학",
            quizType: "OX",
            quizTypeKr: "O/X",
            myAnswer: "O",
            correctAnswer: "X",
            date: "2024.05.30",
            question: "4P 마케팅 믹스에는 People이 포함된다."
        }
    ];
     const subjects = {
        '전체': ['전체'],
        '전산학/컴퓨터과학': ['전체', '컴퓨터과학', '자료구조', '알고리즘', '데이터베이스', '네트워크', '소프트웨어공학'],
        '전자공학': ['전체', '전기전자', '회로이론', '디지털논리회로', '신호처리', '통신공학'],
        '기계공학': ['전체', '기계공학', '열역학', '유체역학', '재료역학', '동역학'],
        '경영학': ['전체', '경영학', '경제학', '마케팅', '회계학', '재무관리']
    };

    const majors = ['전체', '전산학/컴퓨터과학', '전자공학', '기계공학', '경영학'];
    const quizTypes = ['전체', 'O/X', '객관식', '주관식', '족보'];

    // 컴포넌트 마운트 시 데이터 초기화
    useEffect(() => {
        setWrongAnswers(mockWrongAnswers);
        setFilteredAnswers(mockWrongAnswers);
        
        // 통계 계산 (실제로는 전체 푼 문제 수와 오답 수를 서버에서 가져와야 함)
        const totalQuestions = 36; // 전체 푼 문제 수
        const wrongCount = mockWrongAnswers.length;
        const wrongRate = Math.round((wrongCount / totalQuestions) * 100);
        
        setTotalStats({ totalQuestions, wrongRate });
    }, []);

    // 필터링 로직
    useEffect(() => {
        let filtered = wrongAnswers;
        
        if (selectedMajor && selectedMajor !== '전체') {
            filtered = filtered.filter(item => item.major === selectedMajor);
        }

        if (selectedSubject && selectedSubject !== '전체') {
            filtered = filtered.filter(item => item.subject === selectedSubject);
        }
        
        if (selectedQuizType && selectedQuizType !== '전체') {
            filtered = filtered.filter(item => item.quizTypeKr === selectedQuizType);
        }
        
        setFilteredAnswers(filtered);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
    }, [selectedMajor, selectedSubject, selectedQuizType, wrongAnswers]);

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

    const handleRetakeQuiz = (quizId) => {
        // 실제로는 해당 퀴즈 재시도 페이지로 이동
        console.log(`퀴즈 ${quizId} 다시 풀기`);
        alert('퀴즈 다시 풀기 기능은 추후 구현됩니다.');
    };

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
                                value={selectedMajor}
                                onChange={(e) => setSelectedMajor(e.target.value)}
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
                                <option value="">퀴즈 유형</option>
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
                    {currentItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 relative">
                            <div className="flex items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-left">{item.title}</h3>
                                    <p className="text-gray-700 text-sm mb-3 text-left">{item.question}</p>
                                    <div className="flex items-center gap-4 text-left">
                                        <span className="text-gray-600">
                                            전공: <span className="font-semibold">{item.major}</span>
                                        </span>
                                        <span className="text-gray-600">
                                            퀴즈 유형: <span className="font-semibold">{item.quizTypeKr}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-20 flex flex-col items-end">
                                    <span className="text-gray-500 text-sm mb-3">{item.date}</span>
                                    <button
                                        onClick={() => handleRetakeQuiz(item.id)}
                                        className="px-6 py-2 bg-[#0C21C1] text-white font-semibold rounded-lg hover:bg-[#0A1DA8] transition-colors duration-200"
                                    >
                                        다시 풀기
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 페이지네이션 */}
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

                {/* 결과 없음 메시지 */}
                {filteredAnswers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg">
                            조건에 맞는 오답이 없습니다.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WrongAnsPage;
