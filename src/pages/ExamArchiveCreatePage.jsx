import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const ExamArchiveCreatePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { majorId, subjectId } = location.state || {};

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [examYear, setExamYear] = useState('');
    const [examSemester, setExamSemester] = useState('');
    const [examType, setExamType] = useState('');
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const [majorName, setMajorName] = useState('');
    const [subjectName, setSubjectName] = useState('');

    // 전공 이름 가져오기
    useEffect(() => {
        const fetchMajorName = async () => {
            if (majorId) {
                try {
                    const response = await api.get(`/api/majors`);
                    const major = response.data.find(m => m._id === majorId);
                    if (major) setMajorName(major.name);
                } catch (error) {
                    console.error('전공 이름을 불러오는 데 실패했습니다:', error);
                }
            }
        };
        fetchMajorName();
    }, [majorId]);

    // 과목 이름 가져오기
    useEffect(() => {
        const fetchSubjectName = async () => {
            if (subjectId && majorId) { // majorId도 필요, 해당 전공의 과목만 가져오므로
                try {
                    const response = await api.get(`/api/subjects/${majorId}`);
                    const subject = response.data.find(s => s._id === subjectId);
                    if (subject) setSubjectName(subject.name);
                } catch (error) {
                    console.error('과목 이름을 불러오는 데 실패했습니다:', error);
                }
            }
        };
        fetchSubjectName();
    }, [subjectId, majorId]);

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

    const handleSubmit = async () => {
        if (!title || !examYear || !examSemester || !examType || files.length === 0) {
            alert('모든 필수 항목을 입력하고 파일을 첨부해주세요.');
            return;
        }

        try {
            const quizData = {
                title,
                major: majorId,
                subject: subjectId,
                type: 'exam_archive',
                content: `족보 내용: ${title} (${examYear}년 ${examSemester} ${examType})`,
                explanation: description, // 족보의 경우 explanation 필드를 활용
                answer: 'N/A', // 족보는 정답 개념이 없으므로 N/A
                options: [], // 족보는 보기가 없으므로 빈 배열
            };

            // 파일 업로드 로직은 추후 구현 (현재는 파일 데이터만 포함)
            // 실제 파일 업로드는 FormData를 사용하고 별도의 API 엔드포인트가 필요
            // quizData.files = files.map(file => file.name); // 예시

            await api.post('/api/quizzes', quizData);
            alert('족보가 성공적으로 등록되었습니다!');
            navigate('/my-quizzes');
        } catch (error) {
            console.error('족보 등록 실패:', error);
            alert('족보 등록에 실패했습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl text-[#0C21C1] font-bold mb-4">족보 등록</h1>
                        <p className="text-gray-600 text-lg">
                            {majorName} {'>'}  {subjectName} {'>'}  족보
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* 족보 제목 입력 */}
                        <div>
                            <label className="block text-left text-lg font-semibold text-gray-700 mb-3">
                                족보 제목
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                                placeholder="예: 2023년 2학기 운영체제 중간고사 족보"
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
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${dragActive
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
                                onClick={() => navigate(-1)}
                                className="w-40 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-lg"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="w-40 py-3 bg-[#0C21C1] text-white font-semibold rounded-full shadow-lg"
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
