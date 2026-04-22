import { useState, useEffect } from "react";
import PadmaLayout from "@/components/layouts/PadmaLayout";
import founderImg from "@/assets/founder-colonel.jpg";
import founderPortrait from "@/assets/founder-portrait.jpg";

const PadmaFounders = () => {
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
              Founder's Gallery
            </h1>
            <p className="text-lg text-muted-foreground">
              Meet the visionary behind Padma Maths Pro
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image Slideshow */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4]">
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
              
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-bold text-padma-primary">
                  Colonel Ramu Ranganathan (Retired)
                </h2>
                <p className="text-lg text-muted-foreground">MSc, MBA, BSc (Hons) Mathematics</p>
                <p className="text-gold font-semibold text-lg">Founder & Mentor</p>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    With over three decades of experience in mathematics education, Colonel Ramu Ranganathan 
                    brings a unique blend of military discipline and academic excellence to Padma Maths Pro.
                  </p>
                  <p>
                    As an ex-Army Officer and a Psychologist, he understands the importance of conceptual 
                    clarity and systematic problem-solving approach in mastering mathematics.
                  </p>
                  <p>
                    His passion for mathematics and dedication to student success has helped thousands of 
                    students achieve their academic goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PadmaLayout>
  );
};

export default PadmaFounders;
