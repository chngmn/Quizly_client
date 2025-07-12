import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const QuizPage = () => {
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

    return (
        <div className="min-h-screen bg-white-100">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
                <h1 className="w-full text-left pl-4 ml-10 text-4xl text-[#0C21C1] font-bold">퀴즈 풀기</h1>
                <p className="w-full text-left p-4 mb-2 ml-10">원하는 전공, 과목, 문제 유형을 선택하세요</p>

                <div className="">
                    {/* 드롭다운 메뉴들 */}
                    <div className="w-xs max-w-md space-y-4 mb-8">
                        <div className="flex flex-col">
                            <label htmlFor="major-select" className="w-xs text-left text-2xl ml-1 mb-2 font-bold text-gray-700">
                                전공
                            </label>
                            <select
                                id="major-select"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1]"
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

                        <div className="flex flex-col">
                            <label htmlFor="major-select" className="w-xs text-left text-2xl ml-1 mb-2 font-bold text-gray-700">
                                과목
                            </label>
                            <select
                                id="subject-select"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1]"
                                value={selectedSubject}
                                onChange={handleSubjectChange}
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

                        <div className="flex flex-col">
                            <label htmlFor="major-select" className="w-xs text-left text-2xl ml-1 mb-2 font-bold text-gray-700">
                                문제 개수
                            </label>
                            <select
                                id="num-select"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1]"
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

                    {/* 퀴즈 유형 선택 버튼 */}
                    <p className="w-md ml-1 text-left mb-2 text-2xl font-bold text-gray-700">문제 유형</p>
                    <div className="w-full max-w-md flex justify-around space-x-4">
                        <button
                            className={`flex-1 p-3 rounded-md font-semibold transition-colors duration-200 ${selectedQuizType === 'OX' ? 'bg-[#0C21C1] text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                            onClick={() => handleQuizTypeChange('OX')}
                        >
                            O/X
                        </button>
                        <button
                            className={`flex-1 p-3 rounded-md font-semibold transition-colors duration-200 ${selectedQuizType === 'MULTIPLE_CHOICE' ? 'bg-[#0C21C1] text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                            onClick={() => handleQuizTypeChange('MULTIPLE_CHOICE')}
                        >
                            객관식
                        </button>
                        <button
                            className={`flex-1 p-3 rounded-md font-semibold transition-colors duration-200 ${selectedQuizType === 'SUBJECTIVE' ? 'bg-[#0C21C1] text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                            onClick={() => handleQuizTypeChange('SUBJECTIVE')}
                        >
                            주관식
                        </button>
                    </div>
                </div>


                <Link to="/login">
                    <button className="w-[430px] h-[53px] bg-[#0C21C1] text-white font-semibold text-[17px] rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-[#0A1DA8] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)] mt-[40px]">
                        퀴즈 시작하기
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default QuizPage;
