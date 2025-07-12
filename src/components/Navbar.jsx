import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
  const [userNickname, setUserNickname] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState(null); // 프로필 이미지 상태 추가

  useEffect(() => {
    const nickname = localStorage.getItem('user_nickname');
    const profileImage = localStorage.getItem('user_profile_image'); // 프로필 이미지 읽기
    if (nickname) {
      setUserNickname(nickname);
    }
    if (profileImage) {
      setUserProfileImage(profileImage);
    }
  }, []);
  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* 로고 */}
      <Link to="/main" className="flex items-center space-x-2">
        <Logo className="ml-2" size="defalut" />
      </Link>

      {/* 중앙 정렬 메뉴 그룹 */}
      <div className="flex-grow flex justify-center items-center space-x-35">
        <Link to="/quiz" className="text-gray-700 hover:text-[#0C21C1] font-medium">
          퀴즈 풀기
        </Link>
        <Link to="/quiz-upload" className="text-gray-700 hover:text-[#0C21C1] font-medium">
          퀴즈 등록
        </Link>
        <Link to="/wrong-answers" className="text-gray-700 hover:text-[#0C21C1] font-medium">
          오답노트
        </Link>
        <Link to="/my-quizzes" className="text-gray-700 hover:text-[#0C21C1] font-medium">
          내 퀴즈 관리
        </Link>
      </div>

      {/* 가장 오른쪽: 내정보확인 또는 닉네임/프로필 사진 버튼 */}
      <Link to="/my-info" className="flex-shrink-0 flex items-center space-x-2 text-gray-700 hover:text-[#0C21C1] font-medium mr-2">
        {userProfileImage && (
          <img src={userProfileImage} alt="프로필" className="w-8 h-8 rounded-full mr-2" />
        )}
        {userNickname ? `${userNickname}님` : '내정보확인'}
      </Link>
    </nav>
  );
};

export default Navbar;
