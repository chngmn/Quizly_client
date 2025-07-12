import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import '../App.css';
import Logo from '../components/Logo.jsx'
import StartButton from '../components/StartButton.jsx'

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
        <Logo className="mb-2" size="large" />

          <h1 className="text-[40px] font-extrabold text-[#2c2b2b] text-center mb-2">
            <div>{textSets[currentTextIndex].main[0]}</div>
            <div>{textSets[currentTextIndex].main[1]}</div>
          </h1>

          <p className="text-[18px] text-[#696969] leading-relaxed text-center mb-[20px]">
            {textSets[currentTextIndex].sub}
          </p>

          <Link to="/login">
              <StartButton />
          </Link>
        </div>
    </div>
  )
}

export default StartPage