import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ExamArchiveCreatePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { major, subject, quizType } = location.state || {};

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [examYear, setExamYear] = useState('');
    const [examSemester, setExamSemester] = useState('');
    const [examType, setExamType] = useState('');
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const examTypes = ['중간고사', '기말고사', '퀴즈', '과제'];
    const semesters = ['1학기', '2학기', '여름학기', '겨울학기'];

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!title || !examYear || !examSemester || !examType || files.length === 0) {
            alert('모든 필수 항목을 입력하고 파일을 첨부해주세요.');
            return;
        }

        // 족보 등록 API 호출 로직 추가 예정
        const examArchiveData = {
            major,
            subject,
            quizType,
            title,
            description,
            examYear,
            examSemester,
            examType,
            files: files.map(file => file.name),
            createdAt: new Date().toISOString()
        };

        console.log('족보 등록:', examArchiveData);
        alert('족보가 성공적으로 등록되었습니다!');
        navigate('/quiz-upload');
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl text-[#0C21C1] font-bold mb-4">족보 등록</h1>
                        <p className="text-gray-600 text-lg">
                            {major} {'>'}  {subject} {'>'}  족보
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* 제목 입력 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                제목 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700"
                                placeholder="족보 제목을 입력하세요"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* 시험 정보 */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                    연도 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700"
                                    placeholder="2024"
                                    value={examYear}
                                    onChange={(e) => setExamYear(e.target.value)}
                                    min="2000"
                                    max="2030"
                                />
                            </div>
                            <div>
                                <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                    학기 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700"
                                    value={examSemester}
                                    onChange={(e) => setExamSemester(e.target.value)}
                                >
                                    <option value="">선택</option>
                                    {semesters.map((semester) => (
                                        <option key={semester} value={semester}>
                                            {semester}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                    시험 유형 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0C21C1] focus:border-[#0C21C1] text-gray-700"
                                    value={examType}
                                    onChange={(e) => setExamType(e.target.value)}
                                >
                                    <option value="">선택</option>
                                    {examTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 설명 입력 */}
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

                        {/* 파일 업로드 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                파일 첨부 <span className="text-red-500">*</span>
                            </label>
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                                    dragActive 
                                        ? 'border-[#0C21C1] bg-blue-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">파일을 드래그하여 업로드하거나</p>
                                        <label className="cursor-pointer">
                                            <span className="text-[#0C21C1] hover:text-[#0A1DA8] font-semibold">파일 선택</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        PDF, JPG, PNG, DOC, DOCX 파일 지원
                                    </p>
                                </div>
                            </div>

                            {/* 첨부된 파일 목록 */}
                            {files.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-700">첨부된 파일:</h4>
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-700">{file.name}</span>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 등록 버튼 */}
                        <div className="flex justify-center space-x-4 mt-8">
                            <button
                                onClick={() => navigate('/quiz-upload')}
                                className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-gray-600 hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)]"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-[#0C21C1] text-white font-semibold rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-[#0A1DA8] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)]"
                            >
                                등록하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamArchiveCreatePage; 