import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import '../App.css';
import logoImage from '../assets/logo.png'

function StartPage() {
  const textSets = [
    {
      main: ["다양한 전공퀴즈로", "완벽한 시험준비!"],
      sub: "O/X, 객관식, 주관식까지 당신만의 전공테스트"
    },
    {
      main: ["전공 공부,", "이제 퀴즈로 더 재밌게!"],
      sub: "다양한 형식으로 지루할 틈 없이 반복 학습"
    }
  ]
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => 
        (prevIndex + 1) % textSets.length
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [textSets.length])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* 로고 */}
        <div className="mb-2">
          <div className="flex items-center justify-center mb-2">
            {/* PNG 로고 파일 */}
            <img 
              src={logoImage} 
              alt="Quizly Q Logo" 
              className="w-[160px] h-[200px] opacity-76"
            />
            {/* uizly 텍스트 */}
            <span className="text-[120px] font-bold text-[#0C21C1] opacity-76">
              uizly
            </span>
          </div>
        </div>

          <h1 className="text-[40px] font-extrabold text-[#2c2b2b] text-center mb-2">
            <div>{textSets[currentTextIndex].main[0]}</div>
            <div>{textSets[currentTextIndex].main[1]}</div>
          </h1>

          <p className="text-[18px] text-[#696969] leading-relaxed text-center">
            {textSets[currentTextIndex].sub}
          </p>

          <Link to="/login">
            <button className="w-[430px] h-[53px] bg-[#0C21C1] text-white font-semibold text-[17px] rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-[#0A1DA8] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)] mt-[40px]">
              퀴즈 시작하기
            </button>
          </Link>
        </div>
    </div>
  )
}

export default StartPage