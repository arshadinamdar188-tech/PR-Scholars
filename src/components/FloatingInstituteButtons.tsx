import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import padmaLogo from "@/assets/padma-logo.png";
import racademyLogo from "@/assets/racademy-logo.png";
import RacademyBookingModal from "@/components/RacademyBookingModal";

const FloatingInstituteButtons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [defenceModalOpen, setDefenceModalOpen] = useState(false);

  useEffect(() => {
    // Fade in on mount with slight delay
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Maths Button - Right Side */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/padma"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              fixed z-50 right-4 md:right-6 bottom-24 md:bottom-28
              group cursor-pointer
              transition-all duration-700 ease-out
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
            `}
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-royal-blue via-indigo-500 to-purple-600 blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />
            
            {/* Main button */}
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#1B2A4E] via-[#2a3f6e] to-[#1a237e] shadow-[0_4px_20px_rgba(27,42,78,0.6),inset_0_2px_4px_rgba(255,255,255,0.1)] group-hover:shadow-[0_8px_30px_rgba(58,111,248,0.6)] transition-all duration-500 group-hover:scale-110 group-active:scale-95 border border-white/10 overflow-hidden flex items-center justify-center">
              
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* Inner glow */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
              
              {/* Padma Logo */}
              <div className="relative z-10 flex items-center justify-center">
                <img src={padmaLogo} alt="Padma Maths Pro" className="w-9 h-9 md:w-10 md:h-10 object-contain rounded-full drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              {/* Floating particles */}
              <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-blue-300/60 animate-ping" style={{ animationDuration: "3s", animationDelay: "1s" }} />
            </div>

            {/* Floating animation wrapper */}
            <style>{`
              @keyframes float-maths {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-6px); }
              }
            `}</style>
            <div className="absolute inset-0 animate-[float-maths_3s_ease-in-out_infinite]" />
          </Link>
        </TooltipTrigger>
        <TooltipContent 
          side="left" 
          className="bg-gradient-to-r from-[#1B2A4E] to-[#2a3f6e] text-white border-royal-blue/30 px-4 py-2 rounded-lg shadow-xl"
        >
          <div className="flex items-center gap-2">
            <img src={padmaLogo} alt="" className="w-5 h-5 object-contain rounded-full" />
            <span className="font-medium">Explore Maths Programs</span>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Defence Button - Left Side */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setDefenceModalOpen(true)}
            className={`
              fixed z-50 left-4 md:left-6 bottom-24 md:bottom-28
              group cursor-pointer bg-transparent border-0 p-0
              transition-all duration-700 ease-out
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
            `}
            style={{ transitionDelay: "150ms" }}
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-olive via-emerald-600 to-amber-600 blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-[pulse_3s_ease-in-out_infinite]" />
            
            {/* Rotating border effect */}
            <div className="absolute -inset-1 rounded-full bg-gradient-conic from-olive via-gold to-olive opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-[spin_8s_linear_infinite]" />
            
            {/* Main button */}
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#556B2F] via-[#4a5f28] to-[#3d4f21] shadow-[0_4px_20px_rgba(85,107,47,0.6),inset_0_2px_4px_rgba(255,255,255,0.1)] group-hover:shadow-[0_8px_30px_rgba(85,107,47,0.7),0_0_20px_rgba(218,165,32,0.3)] transition-all duration-500 group-hover:scale-110 group-active:scale-95 border border-gold/20 overflow-hidden flex items-center justify-center">
              
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* Inner glow */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
              
              {/* R's Academy Logo */}
              <div className="relative z-10 flex items-center justify-center">
                <img src={racademyLogo} alt="Colonel R's Academy" className="w-9 h-9 md:w-10 md:h-10 object-contain rounded-full drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              {/* Star accents */}
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold/80 animate-pulse" style={{ animationDuration: "2s" }} />
              <div className="absolute bottom-1.5 left-1.5 w-1 h-1 rounded-full bg-amber-300/60 animate-pulse" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
            </div>

            {/* Floating animation wrapper */}
            <style>{`
              @keyframes float-defence {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                25% { transform: translateY(-4px) rotate(1deg); }
                75% { transform: translateY(-4px) rotate(-1deg); }
              }
            `}</style>
            <div className="absolute inset-0 animate-[float-defence_4s_ease-in-out_infinite]" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-gradient-to-r from-[#556B2F] to-[#4a5f28] text-white border-gold/30 px-4 py-2 rounded-lg shadow-xl"
        >
          <div className="flex items-center gap-2">
            <img src={racademyLogo} alt="" className="w-5 h-5 object-contain rounded-full" />
            <span className="font-medium">Explore Defence Programs</span>
          </div>
        </TooltipContent>
      </Tooltip>

      <RacademyBookingModal isOpen={defenceModalOpen} onClose={() => setDefenceModalOpen(false)} />
    </>
  );
};

export default FloatingInstituteButtons;
