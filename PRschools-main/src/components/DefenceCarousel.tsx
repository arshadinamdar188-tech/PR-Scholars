import { useEffect, useRef } from "react";

// Defence forces images - Army, Navy, Air Force
const defenceImages = [
  {
    src: "https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=400&h=250&fit=crop",
    alt: "Indian Army",
    label: "ARMY",
  },
  {
    src: "https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=400&h=250&fit=crop",
    alt: "Indian Navy",
    label: "NAVY",
  },
  {
    src: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=250&fit=crop",
    alt: "Indian Air Force",
    label: "AIR FORCE",
  },
  {
    src: "https://images.unsplash.com/photo-1580752300992-559f8e3b5c2b?w=400&h=250&fit=crop",
    alt: "Military Training",
    label: "TRAINING",
  },
  {
    src: "https://images.unsplash.com/photo-1534643960519-11ad79bc19df?w=400&h=250&fit=crop",
    alt: "Defence Academy",
    label: "ACADEMY",
  },
  {
    src: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&h=250&fit=crop",
    alt: "Military Parade",
    label: "PARADE",
  },
];

// Mathematics themed images for second row
const mathImages = [
  {
    src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop",
    alt: "Mathematics",
    label: "ALGEBRA",
  },
  {
    src: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=250&fit=crop",
    alt: "Equations",
    label: "CALCULUS",
  },
  {
    src: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=250&fit=crop",
    alt: "Geometry",
    label: "GEOMETRY",
  },
  {
    src: "https://images.unsplash.com/photo-1453733190371-0a9bedd82893?w=400&h=250&fit=crop",
    alt: "Numbers",
    label: "NUMBERS",
  },
  {
    src: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&h=250&fit=crop",
    alt: "Statistics",
    label: "STATISTICS",
  },
  {
    src: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&h=250&fit=crop",
    alt: "Formulas",
    label: "FORMULAS",
  },
];

const DefenceCarousel = () => {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;

    if (!row1 || !row2) return;

    // Clone items for seamless loop
    const row1Clone = row1.innerHTML;
    const row2Clone = row2.innerHTML;
    row1.innerHTML += row1Clone;
    row2.innerHTML += row2Clone;
  }, []);

  return (
    <section className="py-8 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      {/* <div className="container mx-auto px-4 mb-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            <span className="w-8 h-[2px] bg-royal-blue" />
            Serving the Nation
            <span className="w-8 h-[2px] bg-olive" />
          </span>
        </div>
      </div> */}

      {/* Defence Forces Row - Scrolling Left */}
      <div className="relative mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

        <div
          ref={row1Ref}
          className="flex gap-4 animate-scroll-left"
          style={{
            width: "max-content",
            animation: "scroll-left 30s linear infinite",
          }}
        >
          {defenceImages.map((img, index) => (
            <div key={index} className="relative w-64 h-40 rounded-xl overflow-hidden shadow-lg group flex-shrink-0">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#8B0000]/80 via-[#8B0000]/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold tracking-wider">
                  {img.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematics Row - Scrolling Right */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

        <div
          ref={row2Ref}
          className="flex gap-4"
          style={{
            width: "max-content",
            animation: "scroll-right 35s linear infinite",
          }}
        >
          {mathImages.map((img, index) => (
            <div key={index} className="relative w-64 h-40 rounded-xl overflow-hidden shadow-lg group flex-shrink-0">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold tracking-wider">
                  {img.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for scrolling animations */}
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default DefenceCarousel;
