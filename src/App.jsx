import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import KakaoRedirectPage from './pages/KakaoRedirectPage';
import MainPage from './pages/MainPage';
import QuizPage from './pages/QuizPage';
import QuizUploadPage from './pages/QuizUploadPage'
import WrongAnsPage from './pages/WrongAnsPage';
import MyQuizzesPage from './pages/MyQuizzesPage';
import NoticePage from './pages/NoticePage';
import MyinfoPage from './pages/MyinfoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth" element={<KakaoRedirectPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz-upload" element={<QuizUploadPage />} />
        <Route path="/wrong-answers" element={<WrongAnsPage />} />
        <Route path="/my-quizzes" element={<MyQuizzesPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/my-info" element={<MyinfoPage />} />
      </Routes>
    </Router>
  );
}

export default App;