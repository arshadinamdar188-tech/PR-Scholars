import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import prscholarsLogo from "@/assets/prscholars-logo.png";

interface FloatingHomeButtonProps {
  variant?: "padma" | "racademy";
}

const FloatingHomeButton = ({ variant = "padma" }: FloatingHomeButtonProps) => {
  const colorClasses = variant === "padma" 
    ? "from-royal-blue via-blue-600 to-indigo-700 hover:from-blue-700 hover:via-indigo-600 hover:to-purple-700 shadow-royal-blue/40"
    : "from-olive via-emerald-700 to-green-800 hover:from-emerald-700 hover:via-green-700 hover:to-teal-800 shadow-olive/40";

  const positionClasses =
    variant === "padma"
      ? "bottom-24 left-4 sm:bottom-28 sm:left-6"
      : "bottom-4 left-4 sm:bottom-6 sm:left-6";

  return (
    <Link
      to="/"
      className={`
        fixed z-50 group
        ${positionClasses}
        flex items-center gap-2
        px-3 py-2 sm:px-4 sm:py-2.5
        bg-gradient-to-r ${colorClasses}
        rounded-full
        shadow-lg hover:shadow-xl
        transform hover:scale-105 active:scale-95
        transition-all duration-300 ease-out
        border border-white/20
        backdrop-blur-sm
      `}
    >
      {/* Logo - visible on larger screens */}
      <div className="hidden sm:flex w-7 h-7 rounded-full bg-white/20 items-center justify-center overflow-hidden">
        <img 
          src={prscholarsLogo} 
          alt="PR Scholars" 
          className="w-5 h-5 object-contain"
        />
      </div>
      
      {/* Home icon - visible on mobile */}
      <div className="sm:hidden flex w-6 h-6 rounded-full bg-white/20 items-center justify-center">
        <Home className="w-3.5 h-3.5 text-white" />
      </div>
      
      {/* Text */}
      <span className="text-white font-semibold text-xs sm:text-sm whitespace-nowrap pr-1">
        <span className="hidden sm:inline">PR Scholars</span>
        <span className="sm:hidden">Home</span>
      </span>
      
      {/* Animated pulse ring */}
      <div className={`
        absolute inset-0 rounded-full 
        bg-gradient-to-r ${colorClasses}
        animate-ping opacity-20
        pointer-events-none
      `} />
    </Link>
  );
};

export default FloatingHomeButton;
