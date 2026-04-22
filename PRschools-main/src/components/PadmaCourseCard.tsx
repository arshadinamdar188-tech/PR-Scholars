import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, Sparkles } from "lucide-react";
import PadmaBookingModal from "@/components/PadmaBookingModal";

// Import class images
import class9Img from "@/assets/class-9-math.jpg";
import class10Img from "@/assets/class-10-math.jpg";
import class11Img from "@/assets/class-11-math.jpg";
import class12Img from "@/assets/class-12-math.jpg";

interface PadmaCourseCardProps {
  classNumber: string;
  slug: string;
}

const classImages: Record<string, string> = {
  "9": class9Img,
  "10": class10Img,
  "11": class11Img,
  "12": class12Img,
};

const classGradients: Record<string, string> = {
  "9": "from-blue-500/20 via-purple-500/10 to-pink-500/20",
  "10": "from-teal-500/20 via-cyan-500/10 to-blue-500/20",
  "11": "from-indigo-500/20 via-violet-500/10 to-purple-500/20",
  "12": "from-amber-500/20 via-yellow-500/10 to-orange-500/20",
};

const classAccentColors: Record<string, string> = {
  "9": "from-blue-500 to-purple-600",
  "10": "from-teal-500 to-cyan-600",
  "11": "from-indigo-500 to-violet-600",
  "12": "from-amber-500 to-orange-600",
};

const PadmaCourseCard = ({ classNumber, slug }: PadmaCourseCardProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookingOpen(true);
  };

  const imageUrl = classImages[classNumber];
  const gradient = classGradients[classNumber] || classGradients["9"];
  const accentColor = classAccentColors[classNumber] || classAccentColors["9"];

  return (
    <>
      <div className="group relative h-full">
        {/* Card Glow Effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${accentColor} rounded-3xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
        
        {/* Main Card */}
        <div className="relative h-full bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 flex flex-col">
          {/* Image Container */}
          <div className="relative overflow-hidden">
            <div className="aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10]">
              <img
                src={imageUrl}
                alt={`Class ${classNumber} Mathematics`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Class Badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${accentColor} text-white text-xs sm:text-sm font-bold shadow-lg`}>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Class {classNumber}</span>
              </div>
            </div>

            {/* Title Overlay on Image */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <h3 className="font-bold text-xl sm:text-2xl text-white drop-shadow-lg">
                Class {classNumber}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mt-1">
                Mathematics Excellence Program
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-4 sm:p-5">
            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["Concept Clarity", "Live Classes", "Doubt Support"].map((feature, idx) => (
                <span
                  key={idx}
                  className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border/50"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-auto space-y-2 sm:space-y-0 sm:flex sm:gap-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:flex-1 group/view hover:border-royal-blue/50 text-xs sm:text-sm h-9 sm:h-10"
                asChild
              >
                <Link to={`/padma/courses/${slug}`}>
                  View Details
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover/view:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button
                size="sm"
                className="w-full sm:flex-1 relative overflow-hidden group/btn bg-gradient-to-r from-royal-blue to-indigo-600 hover:from-royal-blue/90 hover:to-indigo-600/90 text-white text-xs sm:text-sm h-9 sm:h-10 shadow-md"
                onClick={handleBookNow}
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                  Book Now
                </span>
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <PadmaBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedClass={classNumber}
      />
    </>
  );
};

export default PadmaCourseCard;
