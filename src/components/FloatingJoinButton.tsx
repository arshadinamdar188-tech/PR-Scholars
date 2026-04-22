import { useState } from "react";
import { Sparkles } from "lucide-react";
import PadmaBookingModal from "@/components/PadmaBookingModal";

const FloatingJoinButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Floating Join Now Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          fixed z-50 group
          bottom-24 right-4 sm:bottom-28 sm:right-6
          flex items-center gap-2
          px-4 py-3 sm:px-6 sm:py-3.5
          bg-gradient-to-r from-royal-blue via-blue-500 to-indigo-600
          hover:from-indigo-600 hover:via-blue-500 hover:to-royal-blue
          rounded-full
          shadow-[0_8px_32px_rgba(58,111,248,0.4)]
          hover:shadow-[0_12px_40px_rgba(58,111,248,0.6)]
          transform hover:scale-110 active:scale-95
          transition-all duration-300 ease-out
          border border-white/30
          overflow-hidden
        "
      >
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        
        {/* Sparkle icon with bounce animation */}
        <div className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
          <div className="absolute inset-0 blur-sm">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-ping" />
          </div>
        </div>
        
        {/* Button text */}
        <span className="relative text-white font-bold text-sm sm:text-base whitespace-nowrap tracking-wide">
          Join Now
        </span>
        
        {/* Outer glow ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-royal-blue via-blue-400 to-indigo-500 opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300 -z-10" />
        
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping opacity-30" />
        
        {/* Secondary pulse ring with delay */}
        <div className="absolute -inset-2 rounded-full border border-royal-blue/30 animate-pulse" />
      </button>

      {/* Booking Modal */}
      <PadmaBookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default FloatingJoinButton;
