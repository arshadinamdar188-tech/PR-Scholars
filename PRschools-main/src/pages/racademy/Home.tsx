import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RAcademyLayout from "@/components/layouts/RAcademyLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Award,
  Users,
  Target,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowRight,
  Sword,
  Loader2,
  BookOpen,
  Sparkles,
  Monitor,
  Building,
  MapPin,
  Clock,
} from "lucide-react";
import racademyHero from "@/assets/racademy-hero.jpg";
import founderImg from "@/assets/founder-colonel.jpg";
import founderVeteran from "@/assets/founder-veteran.jpg";
import { supabase } from "@/integrations/supabase/client";
import AcademyFeaturesSection from "@/components/AcademyFeaturesSection";
import RacademyBookingModal from "@/components/RacademyBookingModal";

import { Wallet, GraduationCap, Heart, Compass, TrendingUp } from "lucide-react";

interface Module {
  id: string;
  name: string;
  code: string;
  mode: string;
  description: string | null;
  target_audience: string | null;
  duration: string | null;
  fee_summary: string | null;
  highlights: string[] | null;
  display_order: number;
}

const modeIcons: Record<string, React.ElementType> = {
  online: Monitor,
  offline: Building,
  onsite: MapPin,
};

const modeLabels: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  onsite: "Onsite",
};

const modeColors: Record<string, { bg: string; border: string; badge: string; accent: string }> = {
  online: { bg: "bg-gradient-to-br from-olive/5 to-emerald-500/5", border: "border-olive/20 hover:border-olive/40", badge: "bg-olive text-white", accent: "text-olive" },
  offline: { bg: "bg-gradient-to-br from-amber-500/5 to-yellow-500/5", border: "border-amber-500/20 hover:border-amber-500/40", badge: "bg-amber-500 text-white", accent: "text-amber-600" },
  onsite: { bg: "bg-gradient-to-br from-indigo-500/5 to-purple-500/5", border: "border-indigo-500/20 hover:border-indigo-500/40", badge: "bg-indigo-500 text-white", accent: "text-indigo-600" },
};

const careerBenefits = [
  {
    title: "Financial Security",
    icon: Wallet,
    points: [
      "Stable salary with allowances (housing, travel, medical)",
      "Pension benefits and retirement security, ensuring long-term financial stability",
      "Additional perks like subsidized housing, canteen facilities and insurance coverage",
    ],
  },
  {
    title: "Prestige and Social Respect",
    icon: Award,
    points: [
      "Wearing the uniform symbolizes honor, discipline, and patriotism",
      "Armed Forces officers are highly respected in society, often seen as role models",
    ],
  },
  {
    title: "Training & Skill Development",
    icon: GraduationCap,
    points: [
      "Rigorous training at institutions like NDA, IMA, Air Force Academy and Naval Academy builds resilience, leadership and teamwork",
      "Exposure to advanced technology, strategic thinking and decision-making under pressure",
    ],
  },
  {
    title: "Sense of Duty and Patriotism",
    icon: Heart,
    points: [
      "Serving the nation instills pride and purpose",
      "Contribution to national security gives a deep sense of fulfillment",
    ],
  },
  {
    title: "Lifestyle and Adventure",
    icon: Compass,
    points: [
      "Opportunities for travel across India and abroad",
      "Adventure activities like mountaineering, sailing, flying, etc.",
      "A disciplined lifestyle that fosters fitness and mental strength",
    ],
  },
  {
    title: "Professional Growth and Promotions",
    icon: TrendingUp,
    points: [
      "Structured career path with clear promotion stages based on merit and seniority",
      "Opportunities to rise to high-ranking positions with increasing responsibilities",
    ],
  },
];

const RAcademyHome = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedModuleCode, setSelectedModuleCode] = useState<string | undefined>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const founderImages = [founderVeteran, founderImg];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % founderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [founderImages.length]);

  useEffect(() => {
    const fetchModules = async () => {
      const { data, error } = await supabase
        .from("racademy_modules")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching modules:", error);
      } else {
        setModules((data as Module[]) || []);
      }
      setLoading(false);
    };

    fetchModules();
  }, []);

  const mainPrograms = modules.filter(m => ["nda", "cds", "ssb"].includes(m.code));
  const events = modules.filter(m => !["nda", "cds", "ssb"].includes(m.code));

  return (
    <RAcademyLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={racademyHero} alt="Colonel R's Academy" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-olive/90 to-slate-900/80" />
          <div className="absolute inset-0 bg-gradient-to-l from-gold/10 via-transparent to-transparent" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-amber-400/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-white/90 text-sm font-medium tracking-wide">Duty • Honor • Country</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight">
              Colonel R's{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold">Academy</span>
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-gold via-amber-300 to-gold rounded-full" />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed animate-slide-up stagger-1 max-w-xl">
              Shaping the next generation of Armed Forces leaders. Top-tier training for NDA, CDS, AFCAT, INET and SSB interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-2">
              <Button size="lg" className="bg-gradient-to-r from-gold via-amber-400 to-gold text-slate-900 hover:from-amber-400 hover:to-gold gap-2 text-lg px-8 py-6 shadow-xl hover:shadow-gold/30 transition-all duration-300 group font-semibold" asChild>
                <Link to="/racademy/courses">
                  <Shield className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Explore Courses
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/50 text-lg px-8 py-6 backdrop-blur-md transition-all duration-300" asChild>
                <Link to="/racademy/eligibility">Check Eligibility</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Pricing Badge Mobile */}
        <div className="absolute top-20 right-4 animate-fade-in md:hidden">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold via-amber-500 to-gold rounded-xl blur-md opacity-70 animate-pulse" />
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white px-3 py-2 rounded-xl shadow-xl border border-gold/50">
              <div className="text-center">
                <span className="block text-[10px] font-bold tracking-wide uppercase text-gold">Courses Starting</span>
                <div className="text-lg font-black">@₹999/-</div>
                <span className="text-[9px] font-semibold text-white/70">per batch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Badge Desktop */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 lg:right-20 xl:right-32 animate-fade-in hidden md:block">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-gold via-amber-400 to-gold rounded-2xl blur-xl opacity-50 group-hover:opacity-70 animate-pulse transition-opacity" />
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-8 py-6 rounded-2xl shadow-2xl border border-gold/40">
              <div className="text-center">
                <span className="block text-sm font-bold tracking-wider uppercase text-gold mb-1">Courses Starting</span>
                <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">@₹999/-</div>
                <span className="text-xs font-semibold text-white/60 mt-1 block">per batch</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-background relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-olive/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group aspect-[3/4] max-h-[550px]">
                {founderImages.map((img, index) => (
                  <img key={index} src={img} alt="Colonel Ramu Ranganathan - Founder"
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${currentSlide === index ? "opacity-100" : "opacity-0"}`} />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-olive/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {founderImages.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-white w-6" : "bg-white/50"}`} />
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 bg-card p-6 rounded-2xl shadow-2xl max-w-xs hidden md:block border border-border/50 backdrop-blur-sm animate-float">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-olive/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-olive" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Colonel Ramu Ranganathan</p>
                    <p className="text-sm text-muted-foreground">(Retired)</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">23 Years of Military Service</p>
                <p className="text-gold font-semibold text-sm">Founder & Chief Mentor</p>
              </div>
              <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-olive/20 rounded-3xl -z-10" />
            </div>

            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 text-olive font-semibold text-sm uppercase tracking-wider mb-4">
                  <span className="w-8 h-[2px] bg-olive" />
                  About Colonel R's Academy
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                  Armed Forces as a <span className="gradient-text-gold">Career</span>
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                A career in the Armed Forces is more than a profession—it's a calling to serve the nation with honour, courage and commitment. It offers unmatched opportunities for leadership, discipline and personal growth.
              </p>
              <div className="p-4 bg-olive/10 rounded-xl border border-olive/20">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Colonel R's Academy is dedicated to shaping the next generation of Armed Forces officers by blending academic excellence with military ethos. We empower aspirants to excel in NDA, CDS, AFCAT, and INET examinations while cultivating Officer-Like Qualities (OLQs) through rigorous SSB mentorship.
                </p>
              </div>
              <Button size="lg" className="bg-olive hover:bg-olive/90 group shadow-olive transition-all duration-300" asChild>
                <Link to="/racademy/about">
                  Learn More
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <AcademyFeaturesSection />

      {/* Way of Life Section */}
      <section className="section-padding bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-olive/5 via-transparent to-gold/5 opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-olive/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-olive font-semibold text-sm uppercase tracking-wider mb-4">
              <Sword className="w-4 h-4" />
              The Way of Life
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose <span className="gradient-text-gold">Armed Forces?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              If you dream of doing something brave, exciting and meaningful, the Armed Forces is the perfect path.
            </p>
          </div>

          <div className="grid lg:grid-cols-1 gap-6 mb-16">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-olive/20 via-gold/10 to-olive/20 rounded-3xl blur-sm opacity-60" />
              <div className="relative bg-card border border-olive/20 rounded-3xl p-8 md:p-10 h-full">
                <div className="space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base">
                  <p>
                    Choosing a career in the Armed Forces is more than a profession—it is a calling to serve the nation with honor, courage and commitment. The Armed Forces offer young aspirants a life of discipline, adventure and unmatched pride.
                  </p>
                  <p>
                    From safeguarding borders to leading humanitarian missions, officers of the Armed Forces embody integrity and selfless service. The career provides not only financial stability and respect but also the rare opportunity to inspire and lead others.
                  </p>
                  <p className="font-medium text-foreground">
                    Choosing this path means choosing a future filled with respect, growth and the chance to make a real difference. For those who dream of standing tall as leaders—the Armed Forces are{" "}
                    <span className="text-gold font-semibold">destiny</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Career Benefits */}
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Career Benefits</h3>
            <div className="w-20 h-1 bg-gradient-to-r from-olive via-gold to-olive mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {careerBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-olive/40 to-gold/40 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                  <div className="relative bg-card backdrop-blur-sm rounded-2xl p-5 border border-olive/15 group-hover:border-olive/40 transition-all duration-500 h-full flex flex-col shadow-lg shadow-olive/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-olive to-olive/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-display font-bold text-olive text-base leading-tight">{benefit.title}</h4>
                    </div>
                    <div className="w-full h-px bg-gradient-to-r from-olive/30 via-gold/40 to-transparent mb-4" />
                    <ul className="space-y-2 flex-1">
                      {benefit.points.map((point, pIndex) => (
                        <li key={pIndex} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-olive via-gold to-olive rounded-full transition-all duration-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programs Section - Dynamic from racademy_modules */}
      <section className="section-padding bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-olive font-semibold text-sm uppercase tracking-wider mb-4">
              <BookOpen className="w-4 h-4" />
              Our Programs
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Syllabus & <span className="gradient-text-gold">Courses</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comprehensive training programs for various defence entrance examinations
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-olive" />
                <p className="text-muted-foreground">Loading programs...</p>
              </div>
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-lg">No programs available at the moment.</p>
            </div>
          ) : (
            <>
              {/* Core Programs */}
              {mainPrograms.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-10">
                  {mainPrograms.map((mod, index) => {
                    const colors = modeColors[mod.mode] || modeColors.online;
                    const ModeIcon = modeIcons[mod.mode] || Monitor;
                    return (
                      <div key={mod.id} className="group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <Card className={`h-full border-2 ${colors.bg} ${colors.border} transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl overflow-hidden`}>
                          <CardContent className="p-0 flex flex-col h-full">
                            {/* Card Header with gradient */}
                            <div className="relative p-6 pb-4 bg-gradient-to-br from-olive/10 via-transparent to-gold/5">
                              <div className="flex items-center justify-between mb-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${colors.badge} shadow-md`}>
                                  <ModeIcon className="w-3.5 h-3.5" />
                                  {modeLabels[mod.mode]}
                                </span>
                                {mod.fee_summary && (
                                  <span className="text-xs font-bold text-olive bg-olive/10 px-3 py-1.5 rounded-full">{mod.fee_summary}</span>
                                )}
                              </div>
                              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-olive transition-colors leading-tight">{mod.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{mod.description}</p>
                            </div>

                            {/* Card Body */}
                            <div className="px-6 pb-2 flex-1">
                              <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
                                {mod.duration && (
                                  <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg"><Clock className="w-3.5 h-3.5 text-olive" />{mod.duration}</span>
                                )}
                                {mod.target_audience && (
                                  <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg"><Users className="w-3.5 h-3.5 text-olive" />{mod.target_audience}</span>
                                )}
                              </div>
                              {mod.highlights && mod.highlights.length > 0 && (
                                <div className="space-y-2 mb-4">
                                  {mod.highlights.slice(0, 3).map((h, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                      <CheckCircle className="w-3.5 h-3.5 text-olive mt-0.5 flex-shrink-0" />
                                      <span>{h}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Card Footer with buttons */}
                            <div className="px-6 pb-6 pt-2 flex gap-3 mt-auto">
                              <Button
                                className="flex-1 bg-olive hover:bg-olive/90 text-white font-semibold shadow-lg shadow-olive/20 transition-all"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedModuleCode(mod.code);
                                  setIsBookingOpen(true);
                                }}
                              >
                                Register Now
                              </Button>
                              <Button variant="outline" className="border-olive/30 text-olive hover:bg-olive/10 hover:border-olive/50" asChild>
                                <Link to={`/racademy/courses/${mod.code}`}>
                                  Details <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Events */}
              {events.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {events.map((mod) => {
                    const colors = modeColors[mod.mode] || modeColors.onsite;
                    const ModeIcon = modeIcons[mod.mode] || MapPin;
                    return (
                      <div key={mod.id} className="group">
                        <Card className={`h-full border-2 ${colors.bg} ${colors.border} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}>
                          <CardContent className="p-6 flex flex-col h-full">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors.badge} mb-4 w-fit`}>
                              <ModeIcon className="w-3 h-3" />
                              {modeLabels[mod.mode]}
                            </span>
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-indigo-600 transition-colors">{mod.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{mod.description}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{mod.duration}</span>
                              <span className="font-semibold">{mod.fee_summary}</span>
                            </div>
                            <Button
                              size="sm"
                              className="w-full bg-olive hover:bg-olive/90 text-white"
                              onClick={() => {
                                setSelectedModuleCode(mod.code);
                                setIsBookingOpen(true);
                              }}
                            >
                              Register Now
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <div className="text-center mt-12">
            <Button size="lg" className="bg-olive hover:bg-olive/90 group shadow-olive transition-all duration-300" asChild>
              <Link to="/racademy/courses">
                View All Courses
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-olive via-olive to-olive/90 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to <span className="text-gold">Serve</span> the Nation?
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join Colonel R's Academy and begin your journey to the Armed Forces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gold text-olive hover:bg-gold/90 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 group" asChild>
                <Link to="/racademy/courses">
                  Explore Courses
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" className="bg-white/10 border border-white/50 text-white hover:bg-white/20 hover:border-white/70 text-lg px-8 py-6 backdrop-blur-sm transition-all duration-300" asChild>
                <Link to="/racademy/eligibility">Check Eligibility</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <RacademyBookingModal
        isOpen={isBookingOpen}
        onClose={() => { setIsBookingOpen(false); setSelectedModuleCode(undefined); }}
        preselectedModule={selectedModuleCode}
      />
    </RAcademyLayout>
  );
};

export default RAcademyHome;
