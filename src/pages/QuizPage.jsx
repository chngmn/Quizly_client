import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import Navbar from '../components/Navbar';

const QuizPage = () => {
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedQuizType, setSelectedQuizType] = useState('');

    const majors = ['컴퓨터공학', '전자공학', '기계공학'];
    const subjects = {
        '컴퓨터공학': ['자료구조', '알고리즘', '운영체제'],
        '전자공학': ['회로이론', '디지털논리회로', '전자기학'],
        '기계공학': ['열역학', '유체역학', '재료역학'],
    };
    const chapters = {
        '자료구조': ['선형 자료구조', '비선형 자료구조'],
        '알고리즘': ['정렬', '탐색'],
        // ... 다른 과목 및 단원 데이터 추가 예정
    };

    const handleMajorChange = (e) => {
        setSelectedMajor(e.target.value);
        setSelectedSubject(''); // 전공 변경 시 과목 초기화
        setSelectedChapter(''); // 전공 변경 시 단원 초기화
    };

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
        setSelectedChapter(''); // 과목 변경 시 단원 초기화
    };

    const handleQuizTypeChange = (type) => {
        setSelectedQuizType(type);
    };

    const handleSubmit = () => {
        if (!selectedMajor || !selectedSubject || !selectedChapter || !selectedQuizType) {
            alert('모든 항목을 선택해주세요.');
            return;
        }

        // 선택된 값들을 쿼리 파라미터로 넘겨주거나, 상태 관리 라이브러리를 통해 전달할 수 있습니다.
        navigate(`/quiz-taking?major=${selectedMajor}&subject=${selectedSubject}&chapter=${selectedChapter}&type=${selectedQuizType}`);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-11.5">
                <div className="w-full max-w-md text-center mb-12">
                    <h1 className="text-4xl text-[#0C21C1] font-bold mb-4">퀴즈 풀기</h1>
                    <p className="text-gray-600 text-lg">원하는 전공, 과목, 문제 유형을 선택하세요.</p>
                </div>

                {/* 드롭다운 메뉴들 */}
                <div className="w-full max-w-md space-y-8 mb-8">
                    {/* 전공 선택 */}
                    <div>
                        <label className="block text-left text-lg font-semibold text-gray-700 mb-2">
                            전공
                        </label>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700"
                            value={selectedMajor}
                            onChange={handleMajorChange}
                        >
                            <option value="">전공을 선택해주세요.</option>
                            {majors.map((major) => (
                                <option key={major} value={major}>
                                    {major}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 과목 선택 */}
                    <div>
                        <label className="block text-left text-lg font-semibold text-gray-700 mb-2">
                            과목
                        </label>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700"
                            value={selectedSubject}
                            onChange={handleSubjectChange}
                            disabled={!selectedMajor}
                        >
                            <option value="">과목을 선택해주세요.</option>
                            {selectedMajor && subjects[selectedMajor]?.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 문제 개수 선택 */}
                    <div>
                        <label className="block text-left text-lg font-semibold text-gray-700 mb-2">
                            문제 개수
                        </label>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700"
                            value={selectedChapter}
                            onChange={(e) => setSelectedChapter(e.target.value)}
                            disabled={!selectedSubject}
                        >
                            <option value="">없음</option>
                            {selectedSubject && chapters[selectedSubject]?.map((chapter) => (
                                <option key={chapter} value={chapter}>
                                    {chapter}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 문제 유형 선택 */}
                <div className="w-full max-w-md mb-12">
                    <label className="block text-left text-lg font-semibold text-gray-700 mb-4">
                        문제 유형
                    </label>
                    <div className="flex justify-center space-x-4">
                        <button
                            className={`flex-1 p-3 rounded-md font-semibold transition-colors duration-200 border-2 ${selectedQuizType === 'OX'
                                ? 'bg-[#0C21C1] text-white border-[#0C21C1]'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0C21C1] hover:text-[#0C21C1]'
                                }`}
                            onClick={() => handleQuizTypeChange('OX')}
                        >
                            O/X
                        </button>
                        <button
                            className={`flex-1 p-3 rounded-md font-semibold transition-colors duration-200 border-2 ${selectedQuizType === 'MULTIPLE_CHOICE'
                                ? 'bg-[#0C21C1] text-white border-[#0C21C1]'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0C21C1] hover:text-[#0C21C1]'
                                }`}
                            onClick={() => handleQuizTypeChange('MULTIPLE_CHOICE')}
                        >
                            객관식
                        </button>
                        <button
                            className={`flex-1 p-3 rounded-md font-semibold transition-colors duration-200 border-2 ${selectedQuizType === 'SUBJECTIVE'
                                ? 'bg-[#0C21C1] text-white border-[#0C21C1]'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0C21C1] hover:text-[#0C21C1]'
                                }`}
                            onClick={() => handleQuizTypeChange('SUBJECTIVE')}
                        >
                            주관식
                        </button>
                        <button
                            className={`flex-1 p-3 rounded-md font-semibold transition-colors duration-200 border-2 ${selectedQuizType === 'EXAM_ARCHIVE'
                                ? 'bg-[#0C21C1] text-white border-[#0C21C1]'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0C21C1] hover:text-[#0C21C1]'
                                }`}
                            onClick={() => handleQuizTypeChange('EXAM_ARCHIVE')}
                        >
                            족보
                        </button>
                    </div>
                </div>
                {/* 퀴즈 등록하기 버튼 */}
                <button
                    onClick={handleSubmit}
                    className="w-[430px] h-[53px] bg-[#0C21C1] text-white font-semibold text-[17px] rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-[#0A1DA8] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)]"
                >
                    퀴즈 시작하기
                </button>
            </div>
        </div>
    );
};

export default QuizPage;
