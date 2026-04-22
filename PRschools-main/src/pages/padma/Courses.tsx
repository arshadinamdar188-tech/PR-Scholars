import PadmaLayout from "@/components/layouts/PadmaLayout";
import PadmaCourseCard from "@/components/PadmaCourseCard";
import { Button } from "@/components/ui/button";
import { GraduationCap, Phone } from "lucide-react";

// Static class data for courses page
const classCards = [
  { classNumber: "9", slug: "class-9", description: "Build strong mathematical foundations for 9th standard students." },
  { classNumber: "10", slug: "class-10", description: "Focused board exam preparation with comprehensive coverage." },
  { classNumber: "11", slug: "class-11", description: "Advanced mathematics with competitive exam foundation." },
  { classNumber: "12", slug: "class-12", description: "Intensive board and competitive exam preparation." },
];

const PadmaCourses = () => {
  return (
    <PadmaLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-royal-blue via-navy to-royal-blue text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.05&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-medium">Mathematics Excellence</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Courses
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Master Mathematics from Basics to Finesse. Choose from our comprehensive courses designed for students from Class 9 to 12.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {classCards.map((card, index) => (
              <div key={card.classNumber} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slide-up">
                <PadmaCourseCard
                  classNumber={card.classNumber}
                  slug={card.slug}
                />
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-royal-blue/5 rounded-2xl p-8 border border-royal-blue/10">
              <h3 className="text-xl font-bold text-foreground mb-4">CBSE Stream</h3>
              <p className="text-muted-foreground mb-4">
                Complete curriculum coverage following CBSE guidelines with focus on NCERT and board exam preparation.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-royal-blue" />
                  Multiple payment plan options
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-royal-blue" />
                  MWF and TTS batch slots available
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-royal-blue" />
                  Online payment with instant enrollment
                </li>
              </ul>
            </div>
            <div className="bg-amber-500/5 rounded-2xl p-8 border border-amber-500/10">
              <h3 className="text-xl font-bold text-foreground mb-4">ICSE Stream</h3>
              <p className="text-muted-foreground mb-4">
                Specialized ICSE curriculum with application-based learning approach tailored to ICSE examination patterns.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Register interest - we'll contact you
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Batch formation based on demand
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Personalized attention guaranteed
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Need Help Choosing a Course?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact us for a free consultation and we'll help you choose the right course for your academic goals.
          </p>
          <Button size="lg" className="bg-royal-blue hover:bg-royal-blue/90 gap-2">
            <Phone className="w-4 h-4" />
            +91 6361474764
          </Button>
        </div>
      </section>
    </PadmaLayout>
  );
};

export default PadmaCourses;
