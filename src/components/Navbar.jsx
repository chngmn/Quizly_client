import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* 로고 */}
      <Link to="/main" className="flex items-center space-x-2">
        <img src={logoImage} alt="Quizly Logo" className="h-8 w-auto" />
        <span className="text-2xl font-bold text-[#0C21C1]">Quizly</span>
      </Link>

      {/* 중앙 정렬 메뉴 그룹 */}
      <div className="flex-grow flex justify-center items-center space-x-20">
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
        <Link to="/notice" className="text-gray-700 hover:text-[#0C21C1] font-medium">
          공지사항
        </Link>
      </div>

      {/* 가장 오른쪽: 내정보확인 버튼 */}
      <Link to="/my-info" className="flex-shrink-0 text-gray-700 hover:text-[#0C21C1] font-medium">
        내정보확인
      </Link>
    </nav>
  );
};

export default Navbar;
