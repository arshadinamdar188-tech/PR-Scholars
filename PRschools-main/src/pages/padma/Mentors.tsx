import { useState, useEffect } from "react";
import PadmaLayout from "@/components/layouts/PadmaLayout";
import { Card, CardContent } from "@/components/ui/card";
import founderImg from "@/assets/founder-colonel.jpg";
import founderPortrait from "@/assets/founder-portrait.jpg";

const PadmaMentors = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const founderImages = [founderPortrait, founderImg];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % founderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [founderImages.length]);

  return (
    <PadmaLayout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-padma-primary mb-4">
              Our Mentors
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experienced educators dedicated to your success
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card variant="padma" className="overflow-hidden">
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
                  <h2 className="font-display text-2xl font-bold text-padma-primary mb-2">
                    Colonel Ramu Ranganathan (Retired)
                  </h2>
                  <p className="text-muted-foreground mb-2">MSc, MBA, BSc (Hons) Mathematics</p>
                  <p className="text-gold font-semibold mb-4">Lead Mentor</p>
                  <p className="text-muted-foreground leading-relaxed">
                    With over 30 years of experience in mathematics education and a background as an 
                    Army Officer, Colonel Ranganathan brings discipline, clarity, and passion to teaching.
                    His unique approach makes mathematics enjoyable while ensuring excellent academic results.
                  </p>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PadmaLayout>
  );
};

export default PadmaMentors;
