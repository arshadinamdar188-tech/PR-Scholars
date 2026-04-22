import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  Brain,
  Dumbbell,
  Building,
  Flag,
  Megaphone,
  Award,
  GraduationCap,
  Target,
  MessageSquare,
  Sparkles,
  Calendar,
  Monitor,
  Library,
  Heart,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    category: "Core Academic Features",
    icon: GraduationCap,
    gradient: "from-olive via-emerald-700 to-olive",
    items: [
      { title: "Comprehensive Curriculum", description: "Subject-specific coaching (Mathematics, English, General Knowledge and Current Affairs) tailored to each exam's syllabus.", icon: BookOpen },
      { title: "Entrance Exam-Specific Mathematics Coaching", description: "PMPro integrated strong Math foundations aligned with the competitive exam requirements.", icon: Target },
      { title: "Mock Tests & Practice Papers", description: "Regular exam simulations with detailed performance analysis.", icon: Calendar },
      { title: "Adaptive Learning", description: "Personalized study plans based on strengths and weaknesses.", icon: Brain },
    ],
  },
  {
    category: "SSB Interview Mentorship",
    icon: MessageSquare,
    gradient: "from-gold via-amber-500 to-gold",
    items: [
      { title: "Psychological Testing Prep", description: "Guidance for TAT, WAT, SRT and self-description exercises.", icon: Brain },
      { title: "Group Tasks & Discussions", description: "Realistic simulations of GTO tasks, group planning exercises, group discussions and lecturette.", icon: Users },
      { title: "Personal Interview Training", description: "One-on-one sessions to build confidence, clarity and officer-like qualities (OLQs).", icon: MessageSquare },
      { title: "Personality Development Workshops", description: "Communication skills, leadership exercises and stress management.", icon: Sparkles },
    ],
  },
  {
    category: "Physical & Mental Conditioning",
    icon: Dumbbell,
    gradient: "from-slate-700 via-slate-600 to-slate-700",
    items: [
      { title: "Fitness Training", description: "Daily PT, obstacle course practice and endurance building aligned with defence standards.", icon: Dumbbell },
      { title: "Discipline & Routine", description: "Structured schedules that instill time management and military discipline.", icon: Calendar },
      { title: "Mindset Coaching", description: "Resilience, adaptability and decision-making under pressure.", icon: Brain },
    ],
  },
  {
    category: "Resource & Infrastructure",
    icon: Building,
    gradient: "from-olive via-emerald-700 to-olive",
    items: [
      { title: "Dedicated Study Zones", description: "Library with defence-related books, current affairs magazines and digital resources.", icon: Library },
      { title: "Smart Classrooms", description: "Visual aids, interactive modules and recorded lectures for revision.", icon: Monitor },
      { title: "Online Learning Support", description: "Hybrid model with live classes, doubt-clearing sessions and recorded content for remote aspirants.", icon: Monitor },
    ],
  },
  {
    category: "Ethos",
    icon: Flag,
    gradient: "from-gold via-amber-500 to-gold",
    items: [
      { title: "Military Culture", description: "Academy environment reflecting discipline, patriotism and service ethos.", icon: Flag },
      { title: "Mentorship by Veterans", description: "Guest lectures and workshops by retired officers to inspire and guide.", icon: Award },
    ],
  },
  {
    category: "Outreach & Engagement",
    icon: Megaphone,
    gradient: "from-slate-700 via-slate-600 to-slate-700",
    items: [
      { title: "School & College Seminars", description: "Awareness programs about defence careers.", icon: GraduationCap },
      { title: "Parent Engagement", description: "Sessions to help families understand the journey and support aspirants.", icon: Heart },
      { title: "Social Media Presence", description: "Motivational content, exam tips and student success highlights.", icon: Megaphone },
    ],
  },
  {
    category: "Differentiators",
    icon: Award,
    gradient: "from-olive via-emerald-700 to-olive",
    items: [
      { title: "Dual Focus", description: "Academic excellence + officer-like qualities.", icon: Target },
      { title: "Holistic Grooming", description: "Not just exam clearing, but shaping future leaders.", icon: Sparkles },
      { title: "Inclusivity", description: "Equal opportunities for boys and girls, with tailored guidance for each pathway.", icon: Users },
    ],
  },
];

const AnimatedCard = ({ section, index }: { section: typeof features[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = (windowHeight / 2 - elementCenter) / windowHeight;
      setScrollY(distanceFromCenter);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxY = scrollY * 20;
  const scale = 1 + Math.abs(scrollY) * 0.02;

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
      style={{ 
        transitionDelay: `${index * 100}ms`,
        transform: isVisible ? `translateY(${parallaxY}px) scale(${scale})` : undefined,
      }}
    >
      <Card className="overflow-hidden border-0 bg-card shadow-xl hover:shadow-2xl transition-all duration-500 group">
        {/* Category Header */}
        <div className={`relative p-6 md:p-8 bg-gradient-to-r ${section.gradient} overflow-hidden`}>
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-black/10 rounded-full blur-xl" />
          
          {/* Number badge */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
            <span className="text-white font-bold">{String(index + 1).padStart(2, "0")}</span>
          </div>
          
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30 group-hover:rotate-6 transition-transform duration-300">
              <section.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">{section.category}</h3>
              <p className="text-white/70 text-sm mt-1">{section.items.length} key features</p>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <CardContent className="p-6 md:p-8">
          <div className={`grid gap-4 ${section.items.length === 2 ? "md:grid-cols-2" : section.items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}>
            {section.items.map((item, itemIndex) => (
              <div
                key={item.title}
                className="group/item relative p-5 rounded-2xl bg-muted/50 border border-border/50 hover:border-olive/40 hover:bg-olive/5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ transitionDelay: `${itemIndex * 50}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-olive/10 flex items-center justify-center mb-4 group-hover/item:bg-olive/20 group-hover/item:scale-110 transition-all duration-300">
                  <item.icon className="w-5 h-5 text-olive" />
                </div>
                <h4 className="font-bold text-foreground mb-2 group-hover/item:text-olive transition-colors text-sm leading-tight">
                  {item.title}
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {item.description}
                </p>
                {/* Hover accent */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-olive to-gold rounded-full group-hover/item:w-1/2 transition-all duration-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AcademyFeaturesSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-olive/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-olive/10 border border-olive/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-olive font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Our <span className="gradient-text-gold">Comprehensive</span> Training
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            Colonel R's Academy provides a holistic approach to defence preparation, combining academic excellence with character development and physical fitness.
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-5xl mx-auto space-y-8">
          {features.map((section, index) => (
            <AnimatedCard key={section.category} section={section} index={index} />
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-olive/50" />
            <div className="w-3 h-3 rounded-full bg-olive/30 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-gold/50 animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="w-3 h-3 rounded-full bg-olive/30 animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-olive/50" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyFeaturesSection;
