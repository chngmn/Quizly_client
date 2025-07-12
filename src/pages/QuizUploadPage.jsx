import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const QuizUploadPage = () => {
    const navigate = useNavigate();
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedQuizType, setSelectedQuizType] = useState('');

    const majors = ['전산학/컴퓨터과학', '전자공학', '기계공학', '경영학'];
    const subjects = {
        '전산학/컴퓨터과학': ['운영체제', '자료구조', '알고리즘', '데이터베이스'],
        '전자공학': ['회로이론', '디지털논리회로', '전자기학'],
        '기계공학': ['열역학', '유체역학', '재료역학'],
        '경영학': ['경영전략', '마케팅', '회계학'],
    };

    const handleMajorChange = (e) => {
        setSelectedMajor(e.target.value);
        setSelectedSubject(''); 
    };

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const handleQuizTypeChange = (type) => {
        setSelectedQuizType(type);
    };

    const handleSubmit = () => {
        if (!selectedMajor || !selectedSubject || !selectedQuizType) {
            alert('모든 항목을 선택해주세요.');
            return;
        }
        
        const quizData = {
            major: selectedMajor,
            subject: selectedSubject,
            quizType: selectedQuizType
        };

        // 문제 유형에 따라 다른 페이지로 이동
        if (selectedQuizType === 'OX') {
            navigate('/quiz-create/ox', { state: quizData });
        } else if (selectedQuizType === 'MULTIPLE_CHOICE') {
            navigate('/quiz-create/multiple-choice', { state: quizData });
        } else if (selectedQuizType === 'SUBJECTIVE') {
            navigate('/quiz-create/subjective', { state: quizData });
        } else if (selectedQuizType === 'EXAM_ARCHIVE') {
            navigate('/quiz-create/exam-archive', { state: quizData });
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
                <div className="w-full max-w-md text-center mb-12">
                    <h1 className="text-4xl text-[#0C21C1] font-bold mb-4">퀴즈 등록</h1>
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
                </div>

                {/* 문제 유형 선택 */}
                <div className="w-full max-w-md mb-12">
                    <label className="block text-left text-lg font-semibold text-gray-700 mb-4">
                        문제 유형
                    </label>
                    <div className="flex justify-center space-x-4">
                        <button
                            className={`flex-1 p-3 rounded-md font-semibold transition-colors duration-200 border-2 ${
                                selectedQuizType === 'OX' 
                                    ? 'bg-[#0C21C1] text-white border-[#0C21C1]' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#0C21C1] hover:text-[#0C21C1]'
                            }`}
                            onClick={() => handleQuizTypeChange('OX')}
                        >
                            O/X
                        </button>
                        <button
                            className={`flex-1 p-3 rounded-md font-semibold transition-colors duration-200 border-2 ${
                                selectedQuizType === 'MULTIPLE_CHOICE' 
                                    ? 'bg-[#0C21C1] text-white border-[#0C21C1]' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#0C21C1] hover:text-[#0C21C1]'
                            }`}
                            onClick={() => handleQuizTypeChange('MULTIPLE_CHOICE')}
                        >
                            객관식
                        </button>
                        <button
                            className={`flex-1 p-3 rounded-md font-semibold transition-colors duration-200 border-2 ${
                                selectedQuizType === 'SUBJECTIVE' 
                                    ? 'bg-[#0C21C1] text-white border-[#0C21C1]' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#0C21C1] hover:text-[#0C21C1]'
                            }`}
                            onClick={() => handleQuizTypeChange('SUBJECTIVE')}
                        >
                            주관식
                        </button>
                        <button
                            className={`flex-1 p-3 rounded-md font-semibold transition-colors duration-200 border-2 ${
                                selectedQuizType === 'EXAM_ARCHIVE' 
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
                    퀴즈 등록하기
                </button>
            </div>
        </div>
    );
};

export default QuizUploadPage;