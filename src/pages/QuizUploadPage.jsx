import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const QuizUploadPage = () => {
    const navigate = useNavigate();
    const [majors, setMajors] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedMajorId, setSelectedMajorId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedQuizType, setSelectedQuizType] = useState('');

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

    const handleMajorChange = (e) => {
        setSelectedMajorId(e.target.value);
        setSelectedSubjectId(''); // 전공 변경 시 과목 초기화
    };

    const handleSubjectChange = (e) => {
        setSelectedSubjectId(e.target.value);
    };

    const handleQuizTypeChange = (type) => {
        setSelectedQuizType(type);
    };

    const handleSubmit = () => {
        if (!selectedMajorId || !selectedSubjectId || !selectedQuizType) {
            alert('모든 항목을 선택해주세요.');
            return;
        }
        
        const quizCreationData = {
            majorId: selectedMajorId,
            subjectId: selectedSubjectId,
            quizType: selectedQuizType
        };

        // 문제 유형에 따라 다른 페이지로 이동
        if (selectedQuizType === 'OX') {
            navigate('/quiz-create/ox', { state: quizCreationData });
        } else if (selectedQuizType === 'MULTIPLE_CHOICE') {
            navigate('/quiz-create/multiple-choice', { state: quizCreationData });
        } else if (selectedQuizType === 'SUBJECTIVE') {
            navigate('/quiz-create/subjective', { state: quizCreationData });
        } else if (selectedQuizType === 'EXAM_ARCHIVE') {
            navigate('/quiz-create/exam-archive', { state: quizCreationData });
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
                            value={selectedMajorId}
                            onChange={handleMajorChange}
                        >
                            <option value="">전공을 선택해주세요.</option>
                            {majors.map((major) => (
                                <option key={major._id} value={major._id}>
                                    {major.name}
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
                            value={selectedSubjectId}
                            onChange={handleSubjectChange}
                            disabled={!selectedMajorId}
                        >
                            <option value="">과목을 선택해주세요.</option>
                            {subjects.map((subject) => (
                                <option key={subject._id} value={subject._id}>
                                    {subject.name}
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