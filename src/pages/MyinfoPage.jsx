import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdLogout, MdCamera, MdVisibility, MdVisibilityOff, MdSave, MdDelete } from 'react-icons/md';
import Navbar from '../components/Navbar';

const MyinfoPage = () => {
    const [userInfo, setUserInfo] = useState({
        nickname: '',
        email: '',
        gender: '',
        school: '',
        profileImage: '',
        isLoggedIn: false
    });
    const [originalUserInfo, setOriginalUserInfo] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // 한글 변환 함수 추가
    const genderToKorean = (g) => {
        if (g === 'male') return '남성';
        if (g === 'female') return '여성';
        if (g === 'other') return '기타';
        return g;
    };
    const schoolToKorean = (s) => {
        const map = {
            seoul_national: '서울대학교',
            yonsei: '연세대학교',
            korea: '고려대학교',
            sungkyunkwan: '성균관대학교',
            hanyang: '한양대학교',
            kyunghee: '경희대학교',
            sogang: '서강대학교',
            hongik: '홍익대학교',
            dongguk: '동국대학교',
            chungang: '중앙대학교',
            kookmin: '국민대학교',
            sejong: '세종대학교',
            konkuk: '건국대학교',
            kaist: '카이스트',
            other: '기타',
        };
        return map[s] || s;
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        const token = localStorage.getItem('quizly_token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const userData = {
                    nickname: data.user.nickname || '',
                    email: data.user.email || '',
                    gender: data.user.gender || '여',
                    school: data.user.school || '카이스트',
                    profileImage: data.user.profileImage || '',
                    isLoggedIn: true
                };
                setUserInfo(userData);
                setOriginalUserInfo(userData);
            } else {
                throw new Error('사용자 정보 조회 실패');
            }
        } catch (error) {
            console.error('사용자 정보 조회 실패:', error);
            // localStorage의 정보로 폴백
            const nickname = localStorage.getItem('user_nickname');
            const profileImage = localStorage.getItem('user_profile_image');
            if (nickname) {
                const userData = {
                    nickname: nickname,
                    email: '',
                    gender: '여',
                    school: '카이스트',
                    profileImage: profileImage || '',
                    isLoggedIn: true
                };
                setUserInfo(userData);
                setOriginalUserInfo(userData);
            }
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('quizly_token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nickname: userInfo.nickname,
                    email: userInfo.email,
                    gender: userInfo.gender,
                    school: userInfo.school,
                    profileImage: userInfo.profileImage,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // localStorage 업데이트
                localStorage.setItem('user_nickname', userInfo.nickname);
                localStorage.setItem('user_profile_image', userInfo.profileImage);
                
                setOriginalUserInfo(userInfo);
                setIsEditing(false);
                alert('정보가 저장되었습니다.');
            } else {
                throw new Error('저장 실패');
            }
        } catch (error) {
            console.error('정보 저장 실패:', error);
            alert('정보 저장에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSave = async () => {
        if (newPassword !== confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        if (newPassword.length < 6) {
            alert('비밀번호는 6자리 이상이어야 합니다.');
            return;
        }

        try {
            const token = localStorage.getItem('quizly_token');
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }
            const response = await fetch('http://localhost:8000/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('비밀번호가 변경되었습니다.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setIsEditingPassword(false);
            } else {
                const data = await response.json();
                alert(data.error || '비밀번호 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('비밀번호 변경 실패:', error);
            alert('비밀번호 변경에 실패했습니다.');
        }
    };

    const handleCancel = () => {
        setUserInfo(originalUserInfo);
        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('quizly_token');
        localStorage.removeItem('user_nickname');
        localStorage.removeItem('user_profile_image');
        navigate('/login');
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                setUserInfo(prev => ({ ...prev, profileImage: imageUrl }));
                setIsEditing(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (field, value) => {
        setUserInfo(prev => ({ ...prev, [field]: value }));
        setIsEditing(true);
    };

    const hasChanges = JSON.stringify(userInfo) !== JSON.stringify(originalUserInfo);

    const handleWithdraw = async () => {
        if (!window.confirm('정말로 회원 탈퇴를 진행하시겠습니까? 탈퇴 시 모든 정보가 삭제됩니다.')) return;
        const token = localStorage.getItem('quizly_token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/api/user', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                localStorage.removeItem('quizly_token');
                localStorage.removeItem('user_nickname');
                localStorage.removeItem('user_profile_image');
                alert('회원 탈퇴가 완료되었습니다.');
                navigate('/login');
            } else {
                const data = await response.json();
                alert(data.error || '회원 탈퇴에 실패했습니다.');
            }
        } catch (error) {
            alert('회원 탈퇴 중 오류가 발생했습니다.');
        }
    };

    if (!userInfo.isLoggedIn) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>로그인 정보를 확인하는 중...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white relative">
            <Navbar />
            
            <div className="flex flex-col items-center pt-12 px-4 pb-20">
                {/* 프로필 이미지 */}
                <div className="relative w-32 h-32 mb-6">
                    <div className="w-full h-full rounded-full overflow-hidden">
                        {userInfo.profileImage ? (
                            <img 
                                src={userInfo.profileImage} 
                                alt="프로필 이미지" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <span className="text-4xl">👤</span>
                            </div>
                        )}
                    </div>
                    {/* 카메라 아이콘 */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors shadow-lg"
                    >
                        <MdCamera size={16} />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                    />
                </div>

                {/* 닉네임 */}
                <h1 className="text-2xl font-medium text-gray-800 mb-12">
                    {userInfo.nickname}
                </h1>

                {/* 폼 필드들 */}
                <div className="w-full max-w-md space-y-6">
                    {/* 닉네임 필드 */}
                    <div>
                        <label className="block text-left text-sm font-medium text-gray-600 mb-2">
                            닉네임
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={userInfo.nickname}
                                onChange={(e) => handleInputChange('nickname', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-100 border-0 focus:outline-none focus:bg-gray-200 text-gray-800 text-left"
                            />
                            <MdEdit className="absolute right-3 top-2 text-gray-400" size={20} />
                        </div>
                    </div>

                    {/* 이메일 필드 */}
                    <div>
                        <label className="block text-left text-sm font-medium text-gray-600 mb-2">
                            이메일
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={userInfo.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="이메일을 입력하세요"
                                className="w-full px-3 py-2 bg-gray-100 border-0 focus:outline-none focus:bg-gray-200 text-gray-800 text-left"
                            />
                            <MdEdit className="absolute right-3 top-2 text-gray-400" size={20} />
                        </div>
                    </div>

                    {/* 비밀번호 필드 */}
                    <div>
                        <label className="block text-left text-sm font-medium text-gray-600 mb-2">
                            비밀번호
                        </label>
                        {isEditingPassword ? (
                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="현재 비밀번호"
                                        className="w-full px-3 py-2 bg-gray-100 border-0 focus:outline-none focus:bg-gray-200 text-gray-800 text-left"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showCurrentPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="새 비밀번호"
                                        className="w-full px-3 py-2 bg-gray-100 border-0 focus:outline-none focus:bg-gray-200 text-gray-800 text-left"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="새 비밀번호 확인"
                                        className="w-full px-3 py-2 bg-gray-100 border-0 focus:outline-none focus:bg-gray-200 text-gray-800 text-left"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handlePasswordSave}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        저장
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditingPassword(false);
                                            setCurrentPassword('');
                                            setNewPassword('');
                                            setConfirmPassword('');
                                        }}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="password"
                                    value="********"
                                    className="w-full px-3 py-2 bg-gray-100 border-0 focus:outline-none text-gray-800 text-left"
                                    readOnly
                                />
                                <button
                                    onClick={() => setIsEditingPassword(true)}
                                    className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                                >
                                    <MdEdit size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 성별 필드 */}
                    <div>
                        <label className="block text-left text-sm font-medium text-gray-600 mb-2">
                            성별
                        </label>
                        <div className="relative">
                            <select
                                value={userInfo.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-100 border-0 focus:outline-none focus:bg-gray-200 text-gray-800 text-left appearance-none"
                            >
                                <option value="여">여</option>
                                <option value="남">남</option>
                            </select>
                            <div className="absolute right-3 top-2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* 학교 필드 */}
                    <div>
                        <label className="block text-left text-sm font-medium text-gray-600 mb-2">
                            학교
                        </label>
                        <div className="relative">
                            <select
                                value={userInfo.school}
                                onChange={(e) => handleInputChange('school', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-100 border-0 focus:outline-none focus:bg-gray-200 text-gray-800 text-left appearance-none"
                            >
                                <option value="카이스트">카이스트</option>
                                <option value="서울대학교">서울대학교</option>
                                <option value="연세대학교">연세대학교</option>
                                <option value="고려대학교">고려대학교</option>
                                <option value="포항공과대학교">포항공과대학교</option>
                                <option value="성균관대학교">성균관대학교</option>
                                <option value="한양대학교">한양대학교</option>
                                <option value="중앙대학교">중앙대학교</option>
                                <option value="경희대학교">경희대학교</option>
                                <option value="기타">기타</option>
                            </select>
                            <div className="absolute right-3 top-2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* 저장/취소 버튼 */}
                    {isEditing && (
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                <MdSave className="mr-2" size={20} />
                                {isLoading ? '저장 중...' : '저장'}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                취소
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 로그아웃/회원탈퇴 버튼 - 오른쪽 아래 고정 */}
            <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3">
                <button
                    onClick={handleLogout}
                    className="bg-white text-[#0C21C1] font-bold rounded-full p-4 hover:bg-blue-200 transition-colors shadow-lg"
                >
                    <MdLogout size={24} />
                </button>
                <button
                    onClick={handleWithdraw}
                    className="bg-white text-red-500 font-bold rounded-full p-4 hover:bg-red-100 transition-colors shadow-lg"
                >
                    <MdDelete size={24} />
                </button>
            </div>
        </div>
    );
};

export default MyinfoPage;
