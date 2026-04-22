import { useState, useEffect } from "react";
import RAcademyLayout from "@/components/layouts/RAcademyLayout";
import { Card, CardContent } from "@/components/ui/card";
import founderImg from "@/assets/founder-colonel.jpg";
import founderVeteran from "@/assets/founder-veteran.jpg";

const RAcademyMentors = () => {
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
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-olive mb-16 text-center">Our Mentors</h1>
          <Card variant="racademy" className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Image Slideshow */}
              <div className="relative h-[400px] md:h-auto">
                {founderImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Colonel Ramu Ranganathan - Mentor"
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
              
              <CardContent className="p-8 flex flex-col justify-center">
                <h2 className="font-display text-2xl font-bold text-olive mb-2">
                  Colonel Ramu Ranganathan (Retired)
                </h2>
                <p className="text-muted-foreground mb-2">23 Years of Military Service</p>
                <p className="text-gold font-semibold mb-4">Lead Mentor</p>
                <p className="text-muted-foreground leading-relaxed">
                  With extensive experience in defence training and psychology, Colonel Ranganathan guides aspirants 
                  through their journey to the Armed Forces with discipline and expertise. His mission is to instill 
                  discipline, resilience, and leadership, preparing young men and women to serve the nation with 
                  honor, courage, and integrity.
                </p>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>
    </RAcademyLayout>
  );
};

export default RAcademyMentors;
