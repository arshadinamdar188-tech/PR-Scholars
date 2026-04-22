import { useState, useEffect } from "react";
import PadmaLayout from "@/components/layouts/PadmaLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Target,
  Users,
  Clock,
  ChevronRight,
  Star,
  BookOpen,
  Award,
  Lightbulb,
  CheckCircle,
  BarChart,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import padmaHero from "@/assets/padma-hero.jpg";
import founderImg from "@/assets/founder-colonel.jpg";
import founderPortrait from "@/assets/founder-portrait.jpg";
import PadmaCourseCard from "@/components/PadmaCourseCard";
import PadmaBookingModal from "@/components/PadmaBookingModal";
// Static class data for homepage
const classCards = [
  { classNumber: "9", slug: "class-9" },
  { classNumber: "10", slug: "class-10" },
  { classNumber: "11", slug: "class-11" },
  { classNumber: "12", slug: "class-12" },
];

const approaches = [
  {
    icon: Target,
    title: "Setting Clear Goals",
    description: "Defining student specific goals to achieve the desired Academic or Entrance exam results.",
  },
  {
    icon: BookOpen,
    title: "Strengthening Foundation",
    description: "Strengthen understanding of basic concepts before approaching advanced topics.",
  },
  {
    icon: Lightbulb,
    title: "Orientation",
    description: "Identify topics of interest and get students oriented to Mathematical fun.",
  },
  {
    icon: CheckCircle,
    title: "Consistency",
    description: "Maintaining healthy balance between practice questions and other subjects.",
  },
  {
    icon: BarChart,
    title: "Focus on Concepts",
    description: "Emphasise on understanding concepts and logic rather than rote learning.",
  },
  { icon: HelpCircle, title: "24x7 Assistance", description: "Encouragement to ask questions anytime anywhere." },
];

const whyUsReasons = [
  {
    icon: Award,
    title: "30+ Years Experience",
    description: "Mentor driven by passion for Mathematics for more than three decades.",
  },
  {
    icon: Target,
    title: "Ex-Army Officer",
    description: "Disciplined teaching methodology with conceptual clarity and systematic approach.",
  },
  {
    icon: Users,
    title: "Personalized Attention",
    description: "Limited students in small batches ensuring individual doubt clearing sessions.",
  },
  {
    icon: BookOpen,
    title: "Tailored Curriculum",
    description: "Designed for Board exams and NDA/CDS & CLAT entrance exams.",
  },
  {
    icon: CheckCircle,
    title: "90%+ Results",
    description: "Prepare students for scoring 90+ in Board exams and competitive exams.",
  },
  { icon: Clock, title: "Flexible Timings", description: "Convenient class timings on weekdays and weekends." },
];

const PadmaHome = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
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
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={padmaHero} alt="Padma Maths Pro" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/50" />
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-royal-blue/20 rounded-full blur-3xl animate-blob" />
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-blob"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="hero-badge mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-royal-blue-light" />
              <span>Excel in Mathematics</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight">
              Mathematics is{" "}
              <span className="text-royal-blue-light relative">
                Fun!
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path
                    d="M0,5 Q25,0 50,5 T100,5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-royal-blue-light/50"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed animate-slide-up stagger-1 max-w-xl">
              Mathematics is the foundation for everything in this Universe. With the right mentor, it becomes the most
              lovable subject. Master Maths from Basics to Finesse.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-2">
              <Button
                size="lg"
                className="bg-royal-blue hover:bg-royal-blue/90 gap-2 text-lg px-8 py-6 shadow-blue hover:shadow-glow transition-all duration-300 group"
                asChild
              >
                <Link to="/padma/courses">
                  <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Explore Courses
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-white/10 border border-white/50 text-white hover:bg-white/20 hover:border-white/70 text-lg px-8 py-6 backdrop-blur-sm transition-all duration-300"
                asChild
              >
                <Link to="/padma/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Highlighted Pricing Badge - Mobile Version */}
        <div className="absolute top-20 right-4 animate-fade-in md:hidden">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-xl blur-md opacity-70 animate-pulse" />
            <div className="relative bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 text-navy px-3 py-2 rounded-xl shadow-xl border border-yellow-300/80">
              <div className="text-center">
                <span className="block text-[10px] font-bold tracking-wide uppercase">Courses Starting</span>
                <div className="text-lg font-black">@₹499/-</div>
                <span className="text-[9px] font-semibold opacity-80">per month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted Pricing Badge - Desktop Version */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 lg:right-20 xl:right-32 animate-fade-in hidden md:block">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 animate-pulse transition-opacity" />
            <div className="relative bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 text-navy px-6 py-4 rounded-2xl shadow-2xl border-2 border-yellow-300/80">
              <div className="text-center">
                <span className="block text-sm font-bold tracking-wide uppercase">Courses Starting</span>
                <div className="text-3xl lg:text-4xl font-black mt-1">@₹499/-</div>
                <span className="text-xs font-semibold opacity-80">per month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-background relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-royal-blue/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Slideshow */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group aspect-[3/4] max-h-[550px]">
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
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />

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

              {/* Floating card */}
              <div className="absolute -bottom-8 -right-8 bg-card p-6 rounded-2xl shadow-2xl max-w-xs hidden md:block border border-border/50 backdrop-blur-sm animate-float">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-royal-blue/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-royal-blue" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Colonel Ramu Ranganathan</p>
                    <p className="text-sm text-muted-foreground">(Retired)</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">MSc, MBA, BSc (Hons) Mathematics</p>
                <p className="text-royal-blue font-semibold text-sm">Founder & Mentor</p>
              </div>

              {/* Decorative element */}
              <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-royal-blue/20 rounded-3xl -z-10" />
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 text-royal-blue font-semibold text-sm uppercase tracking-wider mb-4">
                  <span className="w-8 h-[2px] bg-royal-blue" />
                  About Padma Maths Pro
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                  Passion-Driven <span className="gradient-text">Learning</span>
                </h2>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Riding a bicycle or swimming, once learnt, the skills stay with us for life. Similarly, Mathematical
                  concepts, once learnt the proper way, will stick with us for life.
                </p>
                <p>
                  With this as the underlying theme, Padma Maths Pro creates interest in students towards Mathematics,
                  which translates into excellent Academic and competitive exam results.
                </p>
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Target, label: "Concept Clarity" },
                  { icon: Users, label: "Personal Attention" },
                  { icon: Clock, label: "Flexible Timings" },
                  { icon: Award, label: "Proven Results" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-3 p-4 rounded-xl bg-royal-blue/5 border border-royal-blue/10 hover:border-royal-blue/30 hover:bg-royal-blue/10 transition-all duration-300"
                  >
                    <div className="icon-container icon-container-blue">
                      <item.icon className="w-5 h-5 text-royal-blue" />
                    </div>
                    <span className="font-medium text-foreground text-sm">{item.label}</span>
                  </div>
                ))}
              </div> */}

              <Button
                size="lg"
                className="bg-royal-blue hover:bg-royal-blue/90 group shadow-blue hover:shadow-glow transition-all duration-300"
                asChild
              >
                <Link to="/padma/about">
                  More About Us
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Teaching Philosophy - 8 Pillars Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Premium Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900" />

        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-royal-blue/15 rounded-full blur-[100px] animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse"
            style={{ animationDelay: "3s" }}
          />
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-royal-blue-light font-semibold text-sm uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" />
              Why Padma Maths Pro?
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-white">The 8 </span>
              <span className="bg-gradient-to-r from-royal-blue-light via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Pillars
              </span>
              <span className="text-white"> of PMPro</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Our comprehensive approach ensures every student achieves mathematical excellence
            </p>
          </div>

          {/* Bento Grid - 8 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
            {/* 1. Concept Clarity - Large */}
            <div className="group relative lg:col-span-2 lg:row-span-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-royal-blue to-cyan-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-700" />
              <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 group-hover:-translate-y-1">
                {/* Gradient Glow */}
                <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-royal-blue/20 via-cyan-500/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number */}
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-royal-blue/30 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-white/70">01</span>
                </div>

                {/* Icon */}
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-blue to-cyan-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-royal-blue-light transition-colors">
                  Concept Clarity
                </h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  At PMPro, we believe that true success in Mathematics comes not from rote learning, but from{" "}
                  <span className="text-royal-blue-light font-semibold">conceptual clarity</span>. Our coaching approach
                  ensures that every student—whether from{" "}
                  <span className="text-cyan-400 font-semibold">CBSE, ICSE, or State Boards</span>—develops a strong
                  foundation in mathematical principles.
                </p>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-royal-blue-light mt-1">□</span>{" "}
                    <span>
                      <span className="text-white/80 font-medium">Board-Specific Guidance:</span> Tailored teaching
                      methods that align with the syllabus requirements of each board.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-royal-blue-light mt-1">□</span>{" "}
                    <span>
                      <span className="text-white/80 font-medium">Focus on Fundamentals:</span> Emphasis on
                      understanding core concepts before moving to advanced problem-solving.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-royal-blue-light mt-1">□</span>{" "}
                    <span>
                      <span className="text-white/80 font-medium">Interactive Learning:</span> Step-by-step
                      explanations, real-life applications and doubt-clearing sessions.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-royal-blue-light mt-1">□</span>{" "}
                    <span>
                      <span className="text-white/80 font-medium">Skill Development:</span> Training students to think
                      analytically and apply mathematics confidently.
                    </span>
                  </li>
                </ul>

                <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-royal-blue to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </div>

            {/* 2. Personal Attention */}
            <div className="group relative lg:col-span-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-700" />
              <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 group-hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-emerald-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-white/70">02</span>
                </div>

                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-all duration-500">
                  <Users className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  Personal Attention
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                  Every student's journey in Mathematics is unique. We emphasize{" "}
                  <span className="text-emerald-400 font-semibold">personal attention</span> as a cornerstone of our
                  teaching philosophy across <span className="text-teal-400">CBSE and ICSE Boards</span>.
                </p>
                <ul className="space-y-1.5 text-white/50 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">□</span> Individualized Guidance & tailored support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">□</span> Dedicated time for doubt resolution
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">□</span> Small Batch Advantage for close monitoring
                  </li>
                </ul>

                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </div>

            {/* 3. Flexibility */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-700" />
              <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 group-hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-white/70">03</span>
                </div>

                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-all duration-500">
                  <Clock className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  Flexibility
                </h3>
                <p className="text-white/60 text-xs leading-relaxed mb-2">
                  We offer <span className="text-amber-400 font-semibold">flexible options</span> that allow students to
                  balance academics, extracurriculars without stress.
                </p>
                <ul className="space-y-1 text-white/50 text-xs">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400">□</span> Multiple Batches: Morning, afternoon & evening
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400">□</span> Board-Specific Coverage: CBSE, ICSE & State
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400">□</span> Rescheduling Facility available
                  </li>
                </ul>

                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </div>

            {/* 4. Result Oriented Approach */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-700" />
              <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 group-hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-purple-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-white/70">04</span>
                </div>

                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-all duration-500">
                  <BarChart className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  Result Oriented
                </h3>
                <p className="text-white/60 text-xs leading-relaxed mb-2">
                  Curriculum designed with a{" "}
                  <span className="text-purple-400 font-semibold">result-oriented approach</span> ensuring measurable
                  success across CBSE & ICSE.
                </p>
                <ul className="space-y-1 text-white/50 text-xs">
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-400">□</span> Structured Curriculum aligned with boards
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-400">□</span> Practice & Assessment with mock exams
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-400">□</span> Performance Tracking & feedback
                  </li>
                </ul>

                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </div>

            {/* 5. Setting Clear Goals */}
            <div className="group relative lg:col-span-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-red-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-700" />
              <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 group-hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-rose-500/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-rose-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-white/70">05</span>
                </div>

                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-all duration-500">
                  <Target className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-rose-400 transition-colors">
                  Setting Clear Goals
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                  Goals are set to provide direction for both teachers and students, ensuring learning outcomes are{" "}
                  <span className="text-rose-400 font-semibold">aligned with board-specific requirements</span> (CBSE
                  and ICSE), thereby maintaining academic discipline.
                </p>
                <div className="grid grid-cols-2 gap-2 text-white/50 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400">□</span> Curriculum Goals: Systematic syllabus coverage
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400">□</span> Performance Goals: Target scores for exams
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400">□</span> Skill Goals: Analytical & logical thinking
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400">□</span> Personal Growth: Confidence & consistency
                  </div>
                </div>

                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-rose-500 to-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </div>

            {/* 6. Strengthening Foundation */}
            <div className="group relative lg:col-span-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-700" />
              <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 group-hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-sky-500/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-sky-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-white/70">06</span>
                </div>

                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-all duration-500">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
                  Strengthening Foundation
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                  We believe that a strong foundation in Mathematics is the key to success in academics and competitive
                  examinations. We nurture{" "}
                  <span className="text-sky-400 font-semibold">clarity, confidence and consistency</span> in students.
                </p>
                <div className="grid grid-cols-2 gap-2 text-white/50 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-sky-400">□</span> Conceptual Clarity: Deep understanding over rote
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sky-400">□</span> Board-Specific Guidance: Tailored teaching methods
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sky-400">□</span> Step-by-Step Approach: Structured lessons
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sky-400">□</span> Practice & Application: Worksheets & mock tests
                  </div>
                </div>

                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-sky-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </div>

            {/* 7. 24x7 Assistance */}
            <div className="group relative lg:col-span-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-lime-500 to-green-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-700" />
              <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 group-hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-lime-500/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-lime-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-white/70">07</span>
                </div>

                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-lime-500 to-green-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-all duration-500">
                  <HelpCircle className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-lime-400 transition-colors">
                  24 X 7 Assistance
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                  We believe that learning mathematics should never be limited by time. We provide{" "}
                  <span className="text-lime-400 font-semibold">round-the-clock assistance</span> designed to ensure
                  that doubts are cleared instantly and learning continues seamlessly.
                </p>
                <div className="grid grid-cols-2 gap-2 text-white/50 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-lime-400">□</span> Always Available: Reach out anytime—day or night
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lime-400">□</span> Instant Doubt Resolution: Quick responses to queries
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lime-400">□</span> Expert Faculty Access: Dedicated mentors available
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lime-400">□</span> Multiple Channels: Email, phone, WhatsApp & online
                  </div>
                </div>

                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-lime-500 to-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </div>

            {/* 8. Online Classes */}
            <div className="group relative lg:col-span-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-700" />
              <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 group-hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-violet-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-white/70">08</span>
                </div>

                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-all duration-500">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors">
                  Online Classes
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                  We impart Online mathematics classes offering{" "}
                  <span className="text-violet-400 font-semibold">
                    flexibility, accessibility, personalized learning
                  </span>{" "}
                  and interactive tools that make Math easier and more engaging for students of all levels.
                </p>
                <div className="grid grid-cols-2 gap-2 text-white/50 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-violet-400">•</span> Learn anytime, anywhere without being restricted
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-violet-400">•</span> Recorded sessions to revisit lessons multiple times
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-violet-400">•</span> Connect with qualified teachers worldwide
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-violet-400">•</span> Real-time doubt clearing through live sessions
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-violet-400">•</span> Videos, animations & simulations make Math fun
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-violet-400">•</span> Cost-Effective: Reduced travel & material expenses
                  </div>
                </div>

                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section - Dynamic */}
      <section className="section-padding bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-royal-blue font-semibold text-sm uppercase tracking-wider mb-4">
              <BookOpen className="w-4 h-4" />
              Our Programs
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Mathematics <span className="gradient-text">Courses</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comprehensive programs for students from Class 9 to 12
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {classCards.map((card, index) => (
              <div key={card.classNumber} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slide-up">
                <PadmaCourseCard classNumber={card.classNumber} slug={card.slug} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-royal-blue hover:bg-royal-blue/90 group shadow-blue hover:shadow-glow transition-all duration-300"
              asChild
            >
              <Link to="/padma/courses">
                View All Courses
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Premium Gradient Background - Different from footer */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />

        {/* Animated Glow Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-royal-blue/30 rounded-full blur-[150px] animate-pulse" />
          <div
            className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Subtle Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Ready to{" "}
              <span className="bg-gradient-to-r from-royal-blue-light via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Master
              </span>{" "}
              Mathematics?
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join Padma Maths Pro and transform your relationship with Mathematics forever.
            </p>

            {/* Single Join Now Button */}
            <Button
              size="xl"
              onClick={() => setIsBookingOpen(true)}
              className="bg-gradient-to-r from-royal-blue via-blue-500 to-indigo-500 hover:from-royal-blue/90 hover:via-blue-500/90 hover:to-indigo-500/90 text-white text-lg md:text-xl px-12 py-7 shadow-2xl shadow-royal-blue/30 hover:shadow-royal-blue/50 transition-all duration-300 group rounded-2xl font-bold"
            >
              Join Now
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <PadmaBookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </PadmaLayout>
  );
};

export default PadmaHome;
