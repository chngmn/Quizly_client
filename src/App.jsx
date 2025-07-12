import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import KakaoRedirectPage from './pages/KakaoRedirectPage';
import MainPage from './pages/MainPage';
import QuizPage from './pages/QuizPage';
import QuizTakingPage from './pages/QuizTakingPage';
import QuizUploadPage from './pages/QuizUploadPage';
import OXQuizCreatePage from './pages/OXQuizCreatePage';
import MultipleChoiceQuizCreatePage from './pages/MultipleChoiceQuizCreatePage';
import SubjectiveQuizCreatePage from './pages/SubjectiveQuizCreatePage';
import ExamArchiveCreatePage from './pages/ExamArchiveCreatePage';
import WrongAnsPage from './pages/WrongAnsPage';
import MyQuizzesPage from './pages/MyQuizzesPage';
import MyinfoPage from './pages/MyinfoPage';
import ProtectedRoute from './components/ProtectedRoute'; // ProtectedRoute 임포트

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth" element={<KakaoRedirectPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 로그인 보호가 필요한 라우트들 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/main" element={<MainPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz-taking" element={<QuizTakingPage />} />
          <Route path="/quiz-upload" element={<QuizUploadPage />} />
          <Route path="/quiz-create/ox" element={<OXQuizCreatePage />} />
          <Route path="/quiz-create/multiple-choice" element={<MultipleChoiceQuizCreatePage />} />
          <Route path="/quiz-create/subjective" element={<SubjectiveQuizCreatePage />} />
          <Route path="/quiz-create/exam-archive" element={<ExamArchiveCreatePage />} />
          <Route path="/wrong-answers" element={<WrongAnsPage />} />
          <Route path="/my-quizzes" element={<MyQuizzesPage />} />
          <Route path="/my-info" element={<MyinfoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;