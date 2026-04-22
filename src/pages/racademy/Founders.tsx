import { useState, useEffect } from "react";
import RAcademyLayout from "@/components/layouts/RAcademyLayout";
import founderImg from "@/assets/founder-colonel.jpg";
import founderVeteran from "@/assets/founder-veteran.jpg";

const RAcademyFounders = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const founderImages = [founderVeteran, founderImg];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % founderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [founderImages.length]);

  return (
    <RAcademyLayout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-olive mb-16">Founder's Gallery</h1>
          
          {/* Image Slideshow */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl max-w-md mx-auto mb-8 aspect-[3/4]">
            {founderImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Colonel Ramu Ranganathan - Founder"
                className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${
                  currentSlide === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            
            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {founderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
          
          <h2 className="font-display text-2xl font-bold text-olive">Colonel Ramu Ranganathan (Retired)</h2>
          <p className="text-muted-foreground mt-1">23 Years of Military Service</p>
          <p className="text-gold font-semibold mt-2">Founder & Chief Mentor</p>
        </div>
      </section>
    </RAcademyLayout>
  );
};

export default RAcademyFounders;
