import React from 'react';
import Navbar from '../components/Navbar';

const MainPage = () => {
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-bold p-4">메인 페이지입니다.</h1>
      <p className="p-4">카카오 로그인 후 이 페이지로 이동합니다.</p>
    </div>
  );
};

export default MainPage;
