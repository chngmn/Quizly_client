import React from 'react';
import Navbar from '../components/Navbar';

const NoticePage = () => {
    return (
        <div>
            <Navbar />
            <h1 className="text-2xl font-bold p-4">공지사항 페이지입니다.</h1>
            <p className="p-4">공지사항 버튼 클릭 시 이 페이지로 이동합니다.</p>
        </div>
    );
};

export default NoticePage;
