import React from 'react';
import { Link } from 'react-router-dom';

function StartPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-blue-600">Quizly</h1>
      <Link to="/login">
        <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">퀴즈 시작하기</button>
      </Link>
    </div>
  );
}

export default StartPage;
