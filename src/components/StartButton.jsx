import { Link } from 'react-router-dom';

const StartButton = ({ 
  text = "퀴즈 시작하기", 
  to = "/login" 
}) => {
  return (
    <Link to={to}>
      <button className="w-[430px] h-[53px] bg-[#0C21C1] text-white font-semibold text-[17px] rounded-[32px] shadow-[0_4px_26px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-[#0A1DA8] hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)]">
        {text}
      </button>
    </Link>
  );
};

export default StartButton;