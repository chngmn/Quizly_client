import logoImage from '../assets/logo.png';

const Logo = ({className = "", size = "default" }) => {
    const sizeStyles = {
        default: {
            logo: "w-[40px] h-[50px]",
            text: "text-[30px]"
        },
        large: {
            logo: "w-[160px] h-[200px]",
            text: "text-[120px]"
        }
    };

    const currentSize = sizeStyles[size] || sizeStyles.default;

    return (
        <div className={`flex items-center justify-center ${className}`}>
        {/* PNG 로고 파일 */}
        <img 
            src={logoImage} 
            alt="Quizly Q Logo" 
            className={`${currentSize.logo} opacity-76`}
        />
        {/* uizly 텍스트 */}
        <span className={`${currentSize.text} font-bold text-[#0C21C1] opacity-76`}>
            uizly
        </span>
    </div>
  );
};

export default Logo;