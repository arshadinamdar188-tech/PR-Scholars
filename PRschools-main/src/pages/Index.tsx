import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Shield,
  ChevronRight,
  Star,
  Users,
  BookOpen,
  Award,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Target,
  Trophy,
  Zap,
  UserCheck,
  ClipboardList,
  TrendingUp,
  FileText,
  Linkedin,
  Instagram,
  Facebook,
} from "lucide-react";
import { useState } from "react";
import { useStaggeredAnimation, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import padmaLogo from "@/assets/padma-logo.png";
import racademyLogo from "@/assets/racademy-logo.png";
import founderPhoto from "@/assets/founder-colonel.jpg";
import prscholarsLogo from "@/assets/prscholars-logo.png";
import BannerCarousel from "@/components/BannerCarousel";
import DefenceCarousel from "@/components/DefenceCarousel";
import FloatingInstituteButtons from "@/components/FloatingInstituteButtons";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll animations for About section
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: founderRef, isVisible: founderVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: introRef, isVisible: introVisible } = useScrollAnimation({ threshold: 0.2 });
  const { containerRef: pillarsRef, visibleItems: pillarsVisible } = useStaggeredAnimation(4);

  const features = [
    {
      icon: Users,
      title: "Expert Faculty",
      description: "Highly qualified professionals with strong academic backgrounds and years of teaching experience",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: BookOpen,
      title: "Comprehensive Material",
      description: "Study material designed for academic excellence and competitive exam preparation",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Target,
      title: "Performance Tracking",
      description: "Regular assessments and detailed progress reports with customized feedback",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Trophy,
      title: "Holistic Development",
      description: "Focus on academics, discipline, confidence-building and leadership qualities",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const faqs = [
    {
      question: "What courses does PRScholars offer?",
      answer:
        "PRScholars offers two specialized programs: Padma Maths Pro for mathematics coaching (9th-12th standard, CBSE, ICSE & State Boards) and Colonel R's Academy for NDA, CDS, AFCAT, INET preparation and SSB training.",
    },
    {
      question: "Who are the instructors at PRScholars?",
      answer:
        "Our courses are led by Colonel Ramu Ranganathan (Retd), an experienced educator with MSc, MBA, and BSc (Hons) in Mathematics. Our team includes qualified teachers and ex-defence personnel.",
    },
    {
      question: "What is the batch size for classes?",
      answer:
        "We maintain small batch sizes to ensure personalized attention. Typically, each batch has 15-20 students to facilitate effective learning and individual doubt resolution.",
    },
    {
      question: "Do you offer online classes?",
      answer:
        "Yes, we offer both online and offline classes. Our online platform provides live interactive sessions, recorded lectures, and digital study materials.",
    },
    {
      question: "How can I enroll for a course?",
      answer:
        "You can enroll by visiting our respective institute pages - Padma Maths Pro or Colonel R's Academy - and clicking on the 'Register Now' button for your chosen course.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={prscholarsLogo}
              alt="PR Scholars"
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-display font-bold text-navy text-xl">PRScholars</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-royal-blue hover:after:w-full after:transition-all"
            >
              About
            </a>
            <a
              href="#institutes"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-royal-blue hover:after:w-full after:transition-all"
            >
              Institutes
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-royal-blue hover:after:w-full after:transition-all"
            >
              Contact
            </a>
            <a
              href="#faq"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-royal-blue hover:after:w-full after:transition-all"
            >
              FAQ
            </a>
            <a
              href="/mock-test.html"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-royal-blue to-[#f57c00] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(26,115,232,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(245,124,0,0.25)]"
            >
              <ClipboardList className="w-4 h-4" />
              Mock Test
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* 3D Navy Blue Button - Padma */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-md bg-[#0a1628] transform translate-y-1" />
              <Button
                size="sm"
                className="relative bg-gradient-to-b from-[#1B2A4E] via-navy to-[#0f1d36] hover:from-[#243660] hover:via-[#1B2A4E] hover:to-[#142544] gap-2 shadow-[0_3px_10px_rgba(27,42,78,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_4px_15px_rgba(27,42,78,0.6)] transition-all duration-300 h-10 border-t border-white/10 active:translate-y-0.5"
                asChild
              >
                <a href="/padma" target="_blank" rel="noopener noreferrer">
                  <img src={padmaLogo} alt="Padma" className="w-6 h-6 rounded-full object-cover bg-white" />
                  Padma Maths Pro
                </a>
              </Button>
            </div>
            {/* 3D Blood Red Button - R's Academy */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-md bg-[#4a0000] transform translate-y-1" />
              <Button
                size="sm"
                className="relative bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#4a0000] hover:from-[#9B1010] hover:via-[#8B0000] hover:to-[#5a0000] gap-2 shadow-[0_3px_10px_rgba(139,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_4px_15px_rgba(139,0,0,0.6)] transition-all duration-300 h-10 border-t border-white/10 active:translate-y-0.5"
                asChild
              >
                <a href="/racademy" target="_blank" rel="noopener noreferrer">
                  <img src={racademyLogo} alt="R Academy" className="w-6 h-6 rounded-full object-cover bg-white" />
                  R's Academy
                </a>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-fade-in">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                About
              </a>
              <a href="#institutes" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Institutes
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Contact
              </a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                FAQ
              </a>
              <a
                href="/mock-test.html"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-royal-blue to-[#f57c00] px-4 py-3 text-sm font-semibold text-white shadow-lg"
              >
                <ClipboardList className="w-4 h-4" />
                Mock Test
              </a>
              <div className="flex flex-col gap-4 pt-2 border-t border-border">
                {/* 3D Navy Blue Button - Padma (Mobile) */}
                <div className="relative w-full">
                  <div className="absolute inset-0 rounded-md bg-[#0a1628] transform translate-y-1" />
                  <Button
                    size="sm"
                    className="relative w-full bg-gradient-to-b from-[#1B2A4E] via-navy to-[#0f1d36] gap-2 shadow-[0_3px_10px_rgba(27,42,78,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] h-10 border-t border-white/10"
                    asChild
                  >
                    <a href="/padma" target="_blank" rel="noopener noreferrer">
                      <img src={padmaLogo} alt="Padma" className="w-6 h-6 rounded-full object-cover bg-white" />
                      Padma Maths Pro
                    </a>
                  </Button>
                </div>

                {/* 3D Blood Red Button - R's Academy (Mobile) */}
                <div className="relative w-full">
                  <div className="absolute inset-0 rounded-md bg-[#4a0000] transform translate-y-1" />
                  <Button
                    size="sm"
                    className="relative w-full bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#4a0000] gap-2 shadow-[0_3px_10px_rgba(139,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] h-10 border-t border-white/10"
                    asChild
                  >
                    <a href="/racademy" target="_blank" rel="noopener noreferrer">
                      <img src={racademyLogo} alt="R Academy" className="w-6 h-6 rounded-full object-cover bg-white" />
                      R's Academy
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Banner Carousel - Full viewport */}
      <div className="pt-16">
        <BannerCarousel />
      </div>

      {/* Defence Forces & Mathematics Carousel */}
      {/* <DefenceCarousel /> */}

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-secondary via-background to-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-royal-blue/10 rounded-full blur-3xl animate-blob" />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-olive/10 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-royal-blue/10 to-olive/10 border border-royal-blue/20 rounded-full mb-8 animate-fade-in backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-royal-blue" />
              <span className="text-sm font-medium bg-gradient-to-r from-royal-blue to-olive bg-clip-text text-transparent">
                Premier Educational Institute
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 animate-slide-up leading-tight">
              Excellence in Education,
              <br />
              <span className="gradient-text">Leadership for Tomorrow</span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed"
              style={{ animationDelay: "0.1s" }}
            >
              Shaping future leaders through specialized mathematics coaching and defence academy preparation. Join
              PRScholars for a transformative learning experience.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              {/* 3D Navy Blue Button - Padma */}
              <div className="relative group">
                <div className="absolute inset-0 rounded-lg bg-[#0a1628] transform translate-y-1.5" />
                <Button
                  size="lg"
                  className="relative bg-gradient-to-b from-[#1B2A4E] via-navy to-[#0f1d36] hover:from-[#243660] hover:via-[#1B2A4E] hover:to-[#142544] gap-3 text-lg px-8 py-6 shadow-[0_4px_15px_rgba(27,42,78,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(27,42,78,0.6)] transition-all duration-300 border-t border-white/10 active:translate-y-0.5 active:shadow-[0_2px_10px_rgba(27,42,78,0.4)]"
                  asChild
                >
                  <a href="/padma" target="_blank" rel="noopener noreferrer">
                    <img src={padmaLogo} alt="Padma" className="w-8 h-8 rounded-full object-cover bg-white" />
                    Explore Padma Maths Pro
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
              {/* 3D Blood Red Button - R's Academy */}
              <div className="relative group">
                <div className="absolute inset-0 rounded-lg bg-[#4a0000] transform translate-y-1.5" />
                <Button
                  size="lg"
                  className="relative bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#4a0000] hover:from-[#9B1010] hover:via-[#8B0000] hover:to-[#5a0000] gap-3 text-lg px-8 py-6 shadow-[0_4px_15px_rgba(139,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(139,0,0,0.6)] transition-all duration-300 border-t border-white/10 active:translate-y-0.5 active:shadow-[0_2px_10px_rgba(139,0,0,0.4)]"
                  asChild
                >
                  <a href="/racademy" target="_blank" rel="noopener noreferrer">
                    <img src={racademyLogo} alt="R Academy" className="w-8 h-8 rounded-full object-cover bg-white" />
                    Explore R's Academy
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden"
      >
        {/* Enhanced Decorative Elements */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-royal-blue/10 to-navy/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-olive/10 to-gold/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-royal-blue/5 via-transparent to-transparent rounded-full" />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

        <div className="container mx-auto px-4 relative">
          {/* Section Header with Legacy of Excellence */}
          <div
            ref={headerRef}
            className={`max-w-5xl mx-auto mb-16 transition-all duration-700 ${
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Enhanced Label */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-royal-blue to-navy animate-pulse" />
                <span className="w-16 h-[3px] bg-gradient-to-r from-royal-blue to-royal-blue/30 rounded-full" />
              </div>
              <span className="text-royal-blue font-bold text-lg md:text-xl uppercase tracking-[0.2em] drop-shadow-sm">
                About PRScholars
              </span>
            </div>

            {/* Main Heading with Better Typography */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-10 leading-[1.1] tracking-tight">
              A Legacy of{" "}
              <span className="relative inline-block">
                <span className="gradient-text">Excellence</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path
                    d="M0,8 Q50,0 100,8 T200,8"
                    stroke="url(#underlineGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--royal-blue))" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="hsl(var(--royal-blue))" stopOpacity="1" />
                      <stop offset="100%" stopColor="hsl(var(--royal-blue))" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{" "}
              in
              <br />
              Education
            </h2>

            {/* PR Scholars Badge and Intro - Enhanced Layout */}
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3 text-lg md:text-xl leading-relaxed text-muted-foreground">
                <span>Founded by Colonel Ramu Ranganathan (Retd),</span>
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-navy via-royal-blue to-navy text-white font-semibold px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(27,42,78,0.4)] border border-white/10 hover:shadow-[0_6px_25px_rgba(27,42,78,0.5)] transition-all duration-300 hover:scale-105">
                  <GraduationCap className="w-5 h-5" />
                  PR Scholars
                </span>
                <span>
                  is a comprehensive educational ecosystem dedicated to nurturing mathematical excellence and preparing
                  future leaders for the Indian Armed Forces.
                </span>
              </div>
            </div>
          </div>

          {/* Founder Experience Quote - Premium Design */}
          <div
            ref={founderRef}
            className={`max-w-5xl mx-auto mb-16 transition-all duration-700 delay-100 ${
              founderVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative group">
              {/* Background Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-royal-blue/20 via-transparent to-olive/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-gradient-to-br from-card via-card to-muted/30 rounded-2xl p-8 md:p-10 border border-border/50 shadow-xl overflow-hidden">
                {/* Decorative Quote Mark */}
                <div className="absolute -top-4 -left-2 text-[120px] font-serif text-royal-blue/10 leading-none select-none">
                  "
                </div>

                {/* Left Accent Bar */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-2/3 bg-gradient-to-b from-royal-blue via-royal-blue to-olive rounded-full" />

                <p className="relative text-muted-foreground text-lg md:text-xl leading-relaxed italic pl-6">
                  With over three decades of experience in education and military service, our founder brings a unique
                  blend of discipline, dedication, and pedagogical expertise to every student's learning journey.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Statement - Premium Card Design */}
          <div
            ref={introRef}
            className={`max-w-5xl mx-auto mb-16 transition-all duration-700 delay-200 ${
              introVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative group">
              {/* Multi-layer Shadow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/10 to-olive/10 rounded-3xl transform translate-x-2 translate-y-2 blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-navy/5 to-transparent rounded-3xl transform translate-x-1 translate-y-1" />

              <div className="relative bg-card rounded-3xl p-8 md:p-12 border border-border/50 shadow-2xl overflow-hidden">
                {/* Corner Decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-royal-blue/10 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-olive/10 to-transparent rounded-tr-full" />

                {/* Content */}
                <p className="relative text-foreground text-lg md:text-xl leading-[1.8] text-justify">
                  At <strong className="font-bold text-navy">PR Scholars</strong>, we strengthen the foundation of
                  analytical thinking, discipline and resilience. Our institution is dedicated to harnessing the power
                  of Mathematics to sharpen minds and prepare students for success in their Academic domain and the most
                  prestigious defense examinations, including NDA, CDS, AFCAT and INET. Beyond Academics, we provide
                  specialized coaching for the Services Selection Board (SSB), ensuring that students are equipped with
                  the confidence, leadership qualities and problem-solving skills required to excel in the rigorous
                  selection process. <strong className="font-bold text-navy">PR Scholars'</strong> unique approach
                  blends Academic excellence with character development, instilling values of integrity, perseverance
                  and service to the nation. With experienced faculty, structured programs and a supportive environment,
                  every student is inspired to push boundaries, embrace challenges and rise to their fullest potential.
                  We don't just teach Mathematics—we shape leaders for tomorrow, ready to serve with honor and
                  distinction.
                </p>

                {/* Bottom Accent */}
                <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-royal-blue animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-navy animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 rounded-full bg-olive animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Founder Profile - Legacy Section */}
          <div className="max-w-5xl mx-auto mb-16">
            {/* Section Header with Premium Styling */}
            <div className="text-center mb-12 relative">
              {/* Decorative Background Orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-olive/10 to-royal-blue/10 rounded-full blur-3xl animate-pulse" />

              <div className="relative">
                <span className="inline-flex items-center gap-3 text-olive font-bold text-sm uppercase tracking-[0.2em] mb-6">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-olive animate-pulse" />
                    <span className="w-12 h-[2px] bg-gradient-to-r from-olive to-olive/30" />
                  </span>
                  Meet Our Founder
                  <span className="flex items-center gap-1">
                    <span className="w-12 h-[2px] bg-gradient-to-l from-olive to-olive/30" />
                    <span className="w-2 h-2 rounded-full bg-olive animate-pulse" />
                  </span>
                </span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                  The Visionary Behind{" "}
                  <span className="relative inline-block">
                    <span className="gradient-text">PR Scholars</span>
                    <svg
                      className="absolute -bottom-1 left-0 w-full h-2"
                      viewBox="0 0 200 8"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,6 Q50,0 100,6 T200,6"
                        stroke="url(#founderUnderline)"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="founderUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(var(--olive))" stopOpacity="0.4" />
                          <stop offset="50%" stopColor="hsl(var(--royal-blue))" stopOpacity="1" />
                          <stop offset="100%" stopColor="hsl(var(--olive))" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h3>
              </div>
            </div>

            <div className="relative group">
              {/* Multi-Layer 3D Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy/30 via-royal-blue/15 to-olive/25 rounded-3xl transform translate-x-3 translate-y-3 blur-lg transition-all duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />
              <div className="absolute inset-0 bg-gradient-to-br from-navy/20 via-royal-blue/10 to-olive/15 rounded-3xl transform translate-x-1.5 translate-y-1.5 blur-sm" />

              {/* Animated Glow on Hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-royal-blue/20 via-olive/20 to-royal-blue/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative bg-gradient-to-br from-card via-card to-muted/50 rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
                {/* Enhanced Top Banner with Animated Elements */}
                <div className="bg-gradient-to-r from-navy via-[#1a365d] to-royal-blue h-24 md:h-28 relative overflow-hidden">
                  {/* Animated Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

                  {/* Grid Pattern */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

                  {/* Floating Stars/Particles */}
                  <div className="absolute top-4 left-8 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" />
                  <div
                    className="absolute top-8 left-20 w-1 h-1 bg-white/20 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <div
                    className="absolute top-6 right-32 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                  />

                  {/* Enhanced Badges */}
                  <div className="absolute bottom-3 right-4 flex gap-2">
                    <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 shadow-lg hover:from-white/20 hover:to-white/15 transition-all duration-300 cursor-default">
                      <Shield className="w-3.5 h-3.5" />
                      Indian Army Veteran
                    </div>
                    <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 shadow-lg hover:from-white/20 hover:to-white/15 transition-all duration-300 cursor-default">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Mathematics Expert
                    </div>
                  </div>

                  {/* Military Rank Decoration */}
                  <div className="absolute top-3 left-4 flex gap-1">
                    <div className="w-8 h-1 bg-gradient-to-r from-gold to-gold/50 rounded-full" />
                    <div className="w-8 h-1 bg-gradient-to-r from-gold to-gold/50 rounded-full" />
                    <div className="w-8 h-1 bg-gradient-to-r from-gold to-gold/50 rounded-full" />
                  </div>
                </div>

                <div className="px-6 md:px-10 pb-10 pt-16 md:pt-14 relative">
                  {/* Enhanced Profile Image with Glow */}
                  <div className="absolute -top-12 md:-top-14 left-6 md:left-10">
                    <div className="relative group/avatar">
                      {/* Animated Glow Ring */}
                      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-royal-blue via-olive to-royal-blue blur-md opacity-60 group-hover/avatar:opacity-100 transition-opacity duration-500 animate-pulse" />
                      <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-royal-blue to-olive opacity-70" />
                      <img
                        src={founderPhoto}
                        alt="Colonel Ramu Ranganathan (Retired)"
                        className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover object-top shadow-2xl border-4 border-card group-hover/avatar:scale-105 transition-transform duration-300"
                      />
                      {/* Verified Badge */}
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-royal-blue to-navy rounded-full flex items-center justify-center shadow-lg border-2 border-card">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Name & Title with Enhanced Typography */}
                  <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                      <div>
                        <h3 className="font-display font-bold text-foreground text-2xl md:text-3xl mb-2 leading-tight">
                          Colonel Ramu Ranganathan
                          <span className="bg-gradient-to-r from-royal-blue to-olive bg-clip-text text-transparent ml-2">
                            (Retired)
                          </span>
                        </h3>
                        <p className="text-royal-blue font-semibold text-sm md:text-base flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Founder & Chief Mentor, PRScholars
                        </p>
                      </div>
                      {/* Enhanced Credential Badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gradient-to-r from-royal-blue/15 to-royal-blue/5 text-royal-blue text-xs font-bold px-4 py-2 rounded-full border border-royal-blue/20 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-default">
                          MSc Mathematics
                        </span>
                        <span className="bg-gradient-to-r from-olive/15 to-olive/5 text-olive text-xs font-bold px-4 py-2 rounded-full border border-olive/20 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-default">
                          MBA
                        </span>
                        <span className="bg-gradient-to-r from-navy/15 to-navy/5 text-navy text-xs font-bold px-4 py-2 rounded-full border border-navy/20 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-default">
                          BSc (Hons) Mathematics
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio Content with Premium Styling */}
                  <div className="space-y-6">
                    {/* First Bio Paragraph with Quote Style */}
                    <div className="relative pl-6 border-l-4 border-gradient-to-b from-royal-blue to-olive">
                      <div className="absolute -left-[2px] top-0 w-1 h-full bg-gradient-to-b from-royal-blue via-navy to-olive rounded-full" />
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        Colonel Ramu Ranganathan (Retired) is a renowned{" "}
                        <strong className="text-foreground font-semibold">Indian Army Veteran</strong>, an avid
                        Mathematician with immense passion for the subject. He believes in methodical and systematic
                        approach to problem solving, which builds confidence in his students. He is also known for their
                        groundbreaking work in{" "}
                        <strong className="text-foreground font-semibold">mentoring and guiding young aspirants</strong>{" "}
                        who want to join the Indian Armed Forces.
                      </p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      With over{" "}
                      <strong className="text-foreground font-semibold">23 years of experience with Indian Army</strong>{" "}
                      and almost five years of experience in the Corporate Sector, he has contributed significantly to
                      development of Leadership qualities of Leaders from different walks of lives and his insights have
                      shaped both academic and practical approaches to Leadership.
                    </p>

                    {/* Enhanced Two Column Layout for Credentials */}
                    <div className="grid md:grid-cols-2 gap-5">
                      {/* Education & Credentials */}
                      <div className="relative group/card overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/10 to-transparent rounded-2xl transform group-hover/card:scale-105 transition-transform duration-500" />
                        <div className="relative bg-gradient-to-br from-royal-blue/8 to-transparent rounded-2xl p-6 border border-royal-blue/20 hover:border-royal-blue/40 transition-all duration-300 hover:shadow-lg">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-royal-blue/10 to-transparent rounded-bl-full" />
                          <h4 className="font-bold text-foreground mb-3 flex items-center gap-2.5 text-base">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-royal-blue to-navy flex items-center justify-center shadow-md">
                              <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            Academic Excellence
                          </h4>
                          <p className="text-muted-foreground leading-relaxed text-sm">
                            Alumnus of <strong className="text-foreground">Sri Venkateshwara College</strong>, Delhi
                            University. Distinguished in academics with{" "}
                            <strong className="text-foreground">Masters in Science and MBA</strong>, along with multiple
                            professional certifications.
                          </p>
                        </div>
                      </div>

                      {/* Military Training */}
                      <div className="relative group/card overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-olive/10 to-transparent rounded-2xl transform group-hover/card:scale-105 transition-transform duration-500" />
                        <div className="relative bg-gradient-to-br from-olive/8 to-transparent rounded-2xl p-6 border border-olive/20 hover:border-olive/40 transition-all duration-300 hover:shadow-lg">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-olive/10 to-transparent rounded-bl-full" />
                          <h4 className="font-bold text-foreground mb-3 flex items-center gap-2.5 text-base">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-olive to-gold flex items-center justify-center shadow-md">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            Military Training
                          </h4>
                          <p className="text-muted-foreground leading-relaxed text-sm">
                            Alumnus of <strong className="text-foreground">Indian Military Academy, Dehradun</strong>{" "}
                            and <strong className="text-foreground">School of Artillery, Deolali</strong>. Served in
                            Kargil, North East CI areas, and Western Sector.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Achievements Row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="relative group/achieve overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/20 to-royal-blue/5 rounded-xl transform group-hover/achieve:scale-105 transition-transform duration-500" />
                        <div className="relative bg-gradient-to-br from-royal-blue/15 to-royal-blue/5 rounded-xl p-5 border border-royal-blue/25 text-center hover:shadow-xl hover:border-royal-blue/40 transition-all duration-300">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-royal-blue/50 to-transparent" />
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-royal-blue to-navy flex items-center justify-center mx-auto mb-3 group-hover/achieve:scale-110 group-hover/achieve:rotate-6 transition-all duration-300 shadow-lg">
                            <Star className="w-6 h-6 text-white" />
                          </div>
                          <h5 className="font-bold text-foreground text-sm mb-1">IMA Instructor</h5>
                          <p className="text-xs text-muted-foreground font-medium">Dehradun</p>
                        </div>
                      </div>
                      <div className="relative group/achieve overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-olive/20 to-olive/5 rounded-xl transform group-hover/achieve:scale-105 transition-transform duration-500" />
                        <div className="relative bg-gradient-to-br from-olive/15 to-olive/5 rounded-xl p-5 border border-olive/25 text-center hover:shadow-xl hover:border-olive/40 transition-all duration-300">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-olive/50 to-transparent" />
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-olive to-gold flex items-center justify-center mx-auto mb-3 group-hover/achieve:scale-110 group-hover/achieve:rotate-6 transition-all duration-300 shadow-lg">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                          <h5 className="font-bold text-foreground text-sm mb-1">Unit Commander</h5>
                          <p className="text-xs text-muted-foreground font-medium">Artillery</p>
                        </div>
                      </div>
                      <div className="relative group/achieve overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-navy/20 to-navy/5 rounded-xl transform group-hover/achieve:scale-105 transition-transform duration-500" />
                        <div className="relative bg-gradient-to-br from-navy/15 to-navy/5 rounded-xl p-5 border border-navy/25 text-center hover:shadow-xl hover:border-navy/40 transition-all duration-300">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-navy/50 to-transparent" />
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy to-royal-blue flex items-center justify-center mx-auto mb-3 group-hover/achieve:scale-110 group-hover/achieve:rotate-6 transition-all duration-300 shadow-lg">
                            <Zap className="w-6 h-6 text-white" />
                          </div>
                          <h5 className="font-bold text-foreground text-sm mb-1">Singapore</h5>
                          <p className="text-xs text-muted-foreground font-medium">Delegation Lead</p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Accent Bar */}
                    <div className="pt-6 flex items-center justify-center gap-3">
                      <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-royal-blue/50 rounded-full" />
                      <div className="w-2 h-2 rounded-full bg-royal-blue animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-navy animate-pulse" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 rounded-full bg-olive animate-pulse" style={{ animationDelay: "0.4s" }} />
                      <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-olive/50 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Four Pillars Section */}
          <div className="max-w-6xl mx-auto">
            {/* Section Header with Premium Styling */}
            <div className="text-center mb-16 relative">
              {/* Decorative Background Orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-royal-blue/10 to-olive/10 rounded-full blur-3xl animate-pulse" />

              <div className="relative">
                <span className="inline-flex items-center gap-3 text-royal-blue font-bold text-sm uppercase tracking-[0.2em] mb-6">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-royal-blue animate-pulse" />
                    <span className="w-12 h-[2px] bg-gradient-to-r from-royal-blue to-royal-blue/30" />
                  </span>
                  Our Foundation
                  <span className="flex items-center gap-1">
                    <span className="w-12 h-[2px] bg-gradient-to-l from-royal-blue to-royal-blue/30" />
                    <span className="w-2 h-2 rounded-full bg-royal-blue animate-pulse" />
                  </span>
                </span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  The Four Pillars of{" "}
                  <span className="relative inline-block">
                    <span className="gradient-text">Success</span>
                    <svg
                      className="absolute -bottom-1 left-0 w-full h-2"
                      viewBox="0 0 200 8"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,6 Q50,0 100,6 T200,6"
                        stroke="url(#pillarsUnderline)"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="pillarsUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(var(--royal-blue))" stopOpacity="0.4" />
                          <stop offset="50%" stopColor="hsl(var(--olive))" stopOpacity="1" />
                          <stop offset="100%" stopColor="hsl(var(--royal-blue))" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Building tomorrow's leaders through personalized attention, expert guidance, comprehensive resources,
                  and measurable progress
                </p>
              </div>
            </div>

            {/* Four Pillars Grid */}
            <div ref={pillarsRef} className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* Personal Attention */}
              <div
                className={`relative group transition-all duration-700 h-full ${
                  pillarsVisible[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              >
                {/* Multi-layer 3D Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/20 to-royal-blue/5 rounded-3xl transform translate-x-2 translate-y-2 blur-sm transition-all duration-500 group-hover:translate-x-3 group-hover:translate-y-3" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-royal-blue/30 via-transparent to-royal-blue/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />

                <div className="relative bg-gradient-to-br from-card via-card to-royal-blue/5 p-8 rounded-3xl border border-royal-blue/20 hover:border-royal-blue/40 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col">
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-royal-blue to-transparent" />
                  {/* Corner Decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-royal-blue/10 to-transparent rounded-bl-full" />

                  <div className="flex items-center gap-4 mb-6 relative">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-br from-royal-blue to-navy rounded-2xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-blue to-navy flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <UserCheck className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      {/* <span className="text-royal-blue text-xs font-bold uppercase tracking-wider">Pillar 01</span> */}
                      <h3 className="font-bold text-foreground text-xl">Personal Attention</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    At PR Scholars, we believe that every student is unique, with individual strengths, challenges and
                    aspirations. Our coaching approach is built on the principle of personalized attention, ensuring
                    that each learner receives the guidance they truly need.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-muted-foreground group/item hover:bg-royal-blue/5 p-2 rounded-lg transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-royal-blue to-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span>
                        <strong className="text-foreground">Individual Mentorship:</strong> Faculty members closely
                        monitor each student's progress, offering tailored feedback and strategies for improvement.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground group/item hover:bg-royal-blue/5 p-2 rounded-lg transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-royal-blue to-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span>
                        <strong className="text-foreground">Customized Learning Plans:</strong> Lessons and practice
                        sessions are adapted to match the pace and learning style of every student.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground group/item hover:bg-royal-blue/5 p-2 rounded-lg transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-royal-blue to-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span>
                        <strong className="text-foreground">Doubt-Clearing Sessions:</strong> Dedicated time is provided
                        for one-on-one interactions, helping students overcome specific academic hurdles.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground group/item hover:bg-royal-blue/5 p-2 rounded-lg transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-royal-blue to-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span>
                        <strong className="text-foreground">Holistic Development:</strong> Beyond academics, mentors
                        focus on discipline, confidence-building, and exam temperament.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground group/item hover:bg-royal-blue/5 p-2 rounded-lg transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-royal-blue to-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span>
                        <strong className="text-foreground">Continuous Tracking:</strong> Regular assessments and
                        performance reviews ensure that students stay on the right path toward their goals.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Expert Faculty */}
              <div
                className={`relative group transition-all duration-700 h-full ${
                  pillarsVisible[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                {/* Multi-layer 3D Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-olive/20 to-olive/5 rounded-3xl transform translate-x-2 translate-y-2 blur-sm transition-all duration-500 group-hover:translate-x-3 group-hover:translate-y-3" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-olive/30 via-transparent to-olive/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />

                <div className="relative bg-gradient-to-br from-card via-card to-olive/5 p-8 rounded-3xl border border-olive/20 hover:border-olive/40 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col">
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-olive to-transparent" />
                  {/* Corner Decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-olive/10 to-transparent rounded-bl-full" />

                  <div className="flex items-center gap-4 mb-6 relative">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-br from-olive to-gold rounded-2xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-olive to-gold flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      {/* <span className="text-olive text-xs font-bold uppercase tracking-wider">Pillar 02</span> */}
                      <h3 className="font-bold text-foreground text-xl">Expert Faculty</h3>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-muted-foreground group/item hover:bg-olive/5 p-2 rounded-lg transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-olive to-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span>
                        <strong className="text-foreground">Highly Qualified Professionals:</strong> The faculty at PR
                        Scholars comprises subject experts with strong academic backgrounds and years of teaching
                        experience.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground group/item hover:bg-olive/5 p-2 rounded-lg transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-olive to-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span>
                        <strong className="text-foreground">Specialized in Board and Competitive Exams:</strong> Each
                        faculty member is well-versed in the syllabus, exam patterns and strategies for Board and
                        competitive exams.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground group/item hover:bg-olive/5 p-2 rounded-lg transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-olive to-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span>
                        <strong className="text-foreground">Personalized Mentorship:</strong> Beyond classroom teaching,
                        they provide one-on-one guidance, doubt-clearing sessions and motivational support to help
                        students stay disciplined and focused.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground group/item hover:bg-olive/5 p-2 rounded-lg transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-olive to-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span>
                        <strong className="text-foreground">Innovative Teaching Methods:</strong> Use of interactive
                        lectures, problem-solving drills and real-time practice ensures conceptual clarity and
                        analytical thinking.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground group/item hover:bg-olive/5 p-2 rounded-lg transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-olive to-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span>
                        <strong className="text-foreground">Result-Oriented Approach:</strong> The faculty emphasizes
                        exam-specific preparation, time management and confidence-building, leading to consistent
                        success stories.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground group/item hover:bg-olive/5 p-2 rounded-lg transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-olive to-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span>
                        <strong className="text-foreground">Role Models for Students:</strong> By blending academic
                        excellence with values of discipline, they inspire students to excel in all spheres.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Comprehensive Material */}
              <div
                className={`relative group transition-all duration-700 h-full ${
                  pillarsVisible[2] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                {/* Multi-layer 3D Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/20 to-royal-blue/5 rounded-3xl transform translate-x-2 translate-y-2 blur-sm transition-all duration-500 group-hover:translate-x-3 group-hover:translate-y-3" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-royal-blue/30 via-transparent to-royal-blue/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />

                <div className="relative bg-gradient-to-br from-card via-card to-royal-blue/5 p-8 rounded-3xl border border-royal-blue/20 hover:border-royal-blue/40 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col">
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-royal-blue to-transparent" />
                  {/* Corner Decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-royal-blue/10 to-transparent rounded-bl-full" />

                  <div className="flex items-center gap-4 mb-6 relative">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-br from-royal-blue to-navy rounded-2xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-blue to-navy flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      {/* <span className="text-royal-blue text-xs font-bold uppercase tracking-wider">Pillar 03</span> */}
                      <h3 className="font-bold text-foreground text-xl">Comprehensive Material</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    At PR Scholars, students receive comprehensive study material designed to meet the dual needs of
                    academic excellence and competitive exam preparation.
                  </p>

                  {/* Mathematics for All Boards */}
                  <div className="mb-4 relative group/sub">
                    <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/10 to-transparent rounded-xl transform group-hover/sub:scale-[1.02] transition-transform duration-300" />
                    <div className="relative p-4 bg-royal-blue/5 rounded-xl border border-royal-blue/10 hover:border-royal-blue/30 transition-colors">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-royal-blue to-navy flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        Mathematics for All Boards
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-royal-blue" />
                          Covers NCERT, CBSE, ICSE and State Boards.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-royal-blue" />
                          Structured explanations, solved examples and practice exercises aligned with board syllabi.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-royal-blue" />
                          Special focus on conceptual clarity and problem-solving techniques.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Entrance Exam Preparation */}
                  <div className="mb-4 relative group/sub">
                    <div className="absolute inset-0 bg-gradient-to-br from-olive/10 to-transparent rounded-xl transform group-hover/sub:scale-[1.02] transition-transform duration-300" />
                    <div className="relative p-4 bg-olive/5 rounded-xl border border-olive/10 hover:border-olive/30 transition-colors">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-olive to-gold flex items-center justify-center">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        Entrance Exam Preparation (Armed Forces)
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                          Tailored modules for NDA, CDS, AFCAT, INET and other defense-related exams.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                          Topic-wise practice sets, previous year papers and mock tests.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                          Strategy notes highlighting shortcuts, time management and exam-oriented problem-solving.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Integrated Approach */}
                  <div className="mb-4 relative group/sub">
                    <div className="absolute inset-0 bg-gradient-to-br from-navy/10 to-transparent rounded-xl transform group-hover/sub:scale-[1.02] transition-transform duration-300" />
                    <div className="relative p-4 bg-muted/50 rounded-xl border border-border/30 hover:border-navy/30 transition-colors">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-navy to-royal-blue flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        Integrated Approach
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-navy" />
                          Bridges school-level mathematics with advanced entrance exam requirements.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-navy" />
                          Builds analytical thinking, logical reasoning and disciplined study habits.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Supplementary Resources */}
                  <div className="relative group/sub">
                    <div className="absolute inset-0 bg-gradient-to-br from-olive/10 to-transparent rounded-xl transform group-hover/sub:scale-[1.02] transition-transform duration-300" />
                    <div className="relative p-4 bg-muted/50 rounded-xl border border-border/30 hover:border-olive/30 transition-colors">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-olive to-gold flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        Supplementary Resources
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                          Revision booklets, formula sheets and quick-reference guides.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                          Personality development and interview preparation notes for SSB coaching.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Tracking */}
              <div
                className={`relative group transition-all duration-700 h-full ${
                  pillarsVisible[3] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                {/* Multi-layer 3D Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-olive/20 to-olive/5 rounded-3xl transform translate-x-2 translate-y-2 blur-sm transition-all duration-500 group-hover:translate-x-3 group-hover:translate-y-3" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-olive/30 via-transparent to-olive/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />

                <div className="relative bg-gradient-to-br from-card via-card to-olive/5 p-8 rounded-3xl border border-olive/20 hover:border-olive/40 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col">
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-olive to-transparent" />
                  {/* Corner Decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-olive/10 to-transparent rounded-bl-full" />

                  <div className="flex items-center gap-4 mb-6 relative">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-br from-olive to-gold rounded-2xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-olive to-gold flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      {/* <span className="text-olive text-xs font-bold uppercase tracking-wider">Pillar 04</span> */}
                      <h3 className="font-bold text-foreground text-xl">Performance Tracking</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Performance tracking is a cornerstone of effective coaching at PR Scholars, ensuring that every
                    student receives personalized attention and measurable progress in both Mathematics (all Boards) and
                    Armed Forces Entrance Exam preparation.
                  </p>

                  {/* Regular Assessments */}
                  <div className="mb-4 relative group/sub">
                    <div className="absolute inset-0 bg-gradient-to-br from-olive/10 to-transparent rounded-xl transform group-hover/sub:scale-[1.02] transition-transform duration-300" />
                    <div className="relative p-4 bg-olive/5 rounded-xl border border-olive/10 hover:border-olive/30 transition-colors">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-olive to-gold flex items-center justify-center">
                          <ClipboardList className="w-4 h-4 text-white" />
                        </div>
                        Regular Assessments
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                          Weekly and monthly tests aligned with Board syllabi and Armed Forces exam patterns.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                          Mock SSB interview sessions to evaluate personality, discipline and analytical skills.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Individual Progress Reports */}
                  <div className="mb-4 relative group/sub">
                    <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/10 to-transparent rounded-xl transform group-hover/sub:scale-[1.02] transition-transform duration-300" />
                    <div className="relative p-4 bg-royal-blue/5 rounded-xl border border-royal-blue/10 hover:border-royal-blue/30 transition-colors">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-royal-blue to-navy flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        Individual Progress Reports
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-royal-blue" />
                          Detailed scorecards highlighting strengths and areas for improvement.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-royal-blue" />
                          Comparative analysis with previous performances to track growth.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Customized Feedback */}
                  <div className="mb-4 relative group/sub">
                    <div className="absolute inset-0 bg-gradient-to-br from-navy/10 to-transparent rounded-xl transform group-hover/sub:scale-[1.02] transition-transform duration-300" />
                    <div className="relative p-4 bg-muted/50 rounded-xl border border-border/30 hover:border-olive/30 transition-colors">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-olive to-gold flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-white" />
                        </div>
                        Customized Feedback
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                          One-on-one mentoring sessions to address weak topics in Mathematics.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                          Guidance on exam strategies, time management and confidence building.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Data-Driven Monitoring */}
                  <div className="mb-4 relative group/sub">
                    <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/10 to-transparent rounded-xl transform group-hover/sub:scale-[1.02] transition-transform duration-300" />
                    <div className="relative p-4 bg-muted/50 rounded-xl border border-border/30 hover:border-royal-blue/30 transition-colors">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-royal-blue to-navy flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        Data-Driven Monitoring
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-royal-blue" />
                          Use of performance charts and analytics to identify trends.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-royal-blue" />
                          Categorization of students into learning levels (foundation, intermediate, advanced).
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Holistic Evaluation */}
                  <div className="relative group/sub">
                    <div className="absolute inset-0 bg-gradient-to-br from-olive/10 to-transparent rounded-xl transform group-hover/sub:scale-[1.02] transition-transform duration-300" />
                    <div className="relative p-4 bg-olive/5 rounded-xl border border-olive/10 hover:border-olive/30 transition-colors">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-olive to-gold flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        Holistic Evaluation
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                          Academic performance combined with discipline, resilience and leadership qualities.
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                          Tracking participation in workshops, seminars and group activities.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutes Section - Highlighted */}
      <section
        id="institutes"
        className="py-24 md:py-40 bg-gradient-to-b from-background via-muted/50 to-background relative overflow-hidden"
      >
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/10 via-transparent to-olive/10" />
        <div className="absolute top-20 left-0 w-72 h-72 bg-royal-blue/20 rounded-full blur-[100px] animate-pulse" />
        <div
          className="absolute bottom-20 right-0 w-72 h-72 bg-olive/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Spotlight effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-royal-blue/10 to-transparent opacity-50" />

        <div className="container mx-auto px-4 relative">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            {/* Animated badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-royal-blue/20 to-olive/20 border-2 border-royal-blue/30 rounded-full mb-8 animate-bounce-slow shadow-lg backdrop-blur-sm">
              <div className="flex -space-x-2">
                <img
                  src={padmaLogo}
                  alt="Padma"
                  className="w-8 h-8 rounded-full border-2 border-white bg-white shadow-md"
                />
                <img
                  src={racademyLogo}
                  alt="R Academy"
                  className="w-8 h-8 rounded-full border-2 border-white bg-white shadow-md"
                />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-royal-blue to-olive bg-clip-text text-transparent">
                Two Premier Institutes • One Vision
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mt-2 mb-6 leading-tight">
              Discover Our{" "}
              <span className="relative">
                <span className="gradient-text">Institutes</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  preserveAspectRatio="none"
                >
                  <path d="M0,5 Q50,0 100,5 T200,5" stroke="url(#gradient)" strokeWidth="3" fill="none" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--royal-blue))" />
                      <stop offset="100%" stopColor="hsl(var(--olive))" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed">
              Choose your path to success with our specialized academies –
              <span className="font-semibold text-royal-blue"> Mathematics Excellence</span> and
              <span className="font-semibold text-olive"> Defence Career Preparation</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Padma Maths Pro Card - Enhanced */}
            <Card className="overflow-hidden border-2 border-royal-blue/20 shadow-2xl hover:shadow-[0_25px_60px_-15px_rgba(37,99,235,0.3)] transition-all duration-500 group bg-card hover:border-royal-blue/40 hover:-translate-y-2">
              <div className="h-64 bg-gradient-to-br from-royal-blue via-royal-blue to-navy flex items-center justify-center relative overflow-hidden">
                <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-50' />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/80 to-transparent" />
                {/* Floating math symbols */}
                <div className="absolute top-4 left-4 text-white/20 text-4xl font-bold animate-float">∑</div>
                <div
                  className="absolute bottom-8 right-8 text-white/20 text-3xl font-bold animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  π
                </div>
                <div
                  className="absolute top-12 right-12 text-white/20 text-2xl font-bold animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  ∫
                </div>
                <img
                  src={padmaLogo}
                  alt="Padma Maths Pro"
                  className="h-32 w-auto drop-shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-royal-blue/10 flex items-center justify-center group-hover:bg-royal-blue/20 transition-colors">
                    <GraduationCap className="w-7 h-7 text-royal-blue" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-2xl font-bold text-foreground">Padma Maths Pro (PMPro)</h3>
                    <p className="text-sm text-muted-foreground">Mathematics Excellence Center</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                  Padma Maths Pro is dedicated to nurturing Mathematical excellence and empowering students to achieve
                  Academic success through a strong foundation in Mathematics. The focus is on building conceptual
                  clarity, analytical thinking and problem-solving skills that not only enhances classroom performance
                  but also prepares students for National level competitive examinations.
                </p>
                <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
                  Beyond academics, the institution instills discipline, resilience and logical reasoning—qualities
                  essential for success in both examinations and life. PMPro creates an environment where students are
                  inspired to push boundaries and overcome fear of mathematics.
                </p>
                <div className="flex flex-wrap gap-2 mb-10">
                  <span className="px-4 py-2 bg-royal-blue/10 text-royal-blue rounded-full text-sm font-semibold">
                    9th - 12th
                  </span>
                  <span className="px-4 py-2 bg-royal-blue/10 text-royal-blue rounded-full text-sm font-semibold">
                    CBSE, ICSE & State Boards
                  </span>
                  <span className="px-4 py-2 bg-royal-blue/10 text-royal-blue rounded-full text-sm font-semibold">
                    Board Exams
                  </span>
                </div>
                {/* 3D Navy Blue Button */}
                <div className="relative w-full group/btn">
                  <div className="absolute inset-0 rounded-lg bg-[#0a1628] transform translate-y-1.5" />
                  <Button
                    className="relative w-full bg-gradient-to-b from-[#1B2A4E] via-navy to-[#0f1d36] hover:from-[#243660] hover:via-[#1B2A4E] hover:to-[#142544] shadow-[0_4px_15px_rgba(27,42,78,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(27,42,78,0.6)] transition-all duration-300 py-7 text-lg font-semibold border-t border-white/10 active:translate-y-0.5 active:shadow-[0_2px_10px_rgba(27,42,78,0.4)]"
                    asChild
                  >
                    <a href="/padma" target="_blank" rel="noopener noreferrer">
                      <img src={padmaLogo} alt="" className="w-6 h-6 rounded-full bg-white mr-2" />
                      Explore Padma Maths Pro
                      <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Colonel R's Academy Card - Enhanced */}
            <Card className="overflow-hidden border-2 border-olive/20 shadow-2xl hover:shadow-[0_25px_60px_-15px_rgba(85,107,47,0.3)] transition-all duration-500 group bg-card hover:border-olive/40 hover:-translate-y-2">
              <div className="h-64 bg-gradient-to-br from-olive via-olive to-gold flex items-center justify-center relative overflow-hidden">
                <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-50' />
                <div className="absolute inset-0 bg-gradient-to-t from-olive/80 to-transparent" />
                {/* Floating military symbols */}
                <div className="absolute top-4 left-4 text-white/20 text-3xl animate-float">★</div>
                <div
                  className="absolute bottom-8 right-8 text-white/20 text-4xl animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  ⚔
                </div>
                <div
                  className="absolute top-12 right-12 text-white/20 text-2xl animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  🎖
                </div>
                <img
                  src={racademyLogo}
                  alt="Colonel R's Academy"
                  className="h-32 w-auto drop-shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-olive/10 flex items-center justify-center group-hover:bg-olive/20 transition-colors">
                    <Shield className="w-7 h-7 text-olive" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-2xl font-bold text-foreground">Colonel R's Academy (R's)</h3>
                    <p className="text-sm text-muted-foreground">Defence Career Training Center</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                  Colonel R's Academy is a distinguished institution committed to guiding and mentoring young aspirants
                  who dream of serving the nation through the Armed Forces. With a specialized focus on preparing
                  students for prestigious entrance examinations such as NDA, CDS, AFCAT and INET, the Academy combines
                  academic rigor with character development.
                </p>
                <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
                  Beyond academics, the academy provides comprehensive SSB interview preparation, equipping candidates
                  with confidence, communication skills and leadership qualities. Through mock interviews, group
                  discussions and psychological tests, students are trained to demonstrate resilience, teamwork, and
                  officer-like qualities.
                </p>
                <div className="flex flex-wrap gap-2 mb-10">
                  <span className="px-4 py-2 bg-olive/10 text-olive rounded-full text-sm font-semibold">NDA & NA</span>
                  <span className="px-4 py-2 bg-olive/10 text-olive rounded-full text-sm font-semibold">
                    CDS / AFCAT / INET
                  </span>
                  <span className="px-4 py-2 bg-olive/10 text-olive rounded-full text-sm font-semibold">
                    SSB Mentoring
                  </span>
                </div>
                {/* 3D Blood Red Button */}
                <div className="relative w-full group/btn">
                  <div className="absolute inset-0 rounded-lg bg-[#4a0000] transform translate-y-1.5" />
                  <Button
                    className="relative w-full bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#4a0000] hover:from-[#9B1010] hover:via-[#8B0000] hover:to-[#5a0000] shadow-[0_4px_15px_rgba(139,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(139,0,0,0.6)] transition-all duration-300 py-7 text-lg font-semibold border-t border-white/10 active:translate-y-0.5 active:shadow-[0_2px_10px_rgba(139,0,0,0.4)]"
                    asChild
                  >
                    <a href="/racademy" target="_blank" rel="noopener noreferrer">
                      <img src={racademyLogo} alt="" className="w-6 h-6 rounded-full bg-white mr-2" />
                      Explore R's Defence Academy
                      <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why PRScholars Section - Modern Stats Design */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-navy via-navy to-navy/95 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-royal-blue/20 rounded-full blur-3xl animate-blob" />
            <div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-olive/15 rounded-full blur-3xl animate-blob"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute top-1/2 right-1/3 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-blob"
              style={{ animationDelay: "4s" }}
            />
          </div>
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-white/90">Why PRScholars</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              What Sets Us <span className="text-gold">Apart</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              A unique blend of military discipline and academic excellence
            </p>
          </div>

          {/* Modern Stats Grid */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Stat 1 - Years Legacy */}
              <div className="text-center group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-gold mb-2 group-hover:scale-110 transition-transform duration-300">
                  30+
                </div>
                <div className="text-white/80 font-medium text-sm md:text-base tracking-wide">Years Legacy</div>
              </div>

              {/* Stat 2 - Dedication */}
              <div className="text-center group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-royal-blue mb-2 group-hover:scale-110 transition-transform duration-300">
                  100%
                </div>
                <div className="text-white/80 font-medium text-sm md:text-base tracking-wide">Dedication</div>
              </div>

              {/* Stat 3 - Support */}
              <div className="text-center group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-gold mb-2 group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-white/80 font-medium text-sm md:text-base tracking-wide">Support</div>
              </div>

              {/* Stat 4 - Possibilities */}
              <div className="text-center group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  ∞
                </div>
                <div className="text-white/80 font-medium text-sm md:text-base tracking-wide">Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 bg-background relative overflow-hidden">
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-royal-blue/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 text-royal-blue font-semibold text-sm uppercase tracking-wider mb-4">
                <span className="w-8 h-[2px] bg-royal-blue" />
                FAQ
                <span className="w-8 h-[2px] bg-royal-blue" />
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
              <p className="text-muted-foreground text-lg">Find answers to common questions about our programs</p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border/50 rounded-2xl px-6 data-[state=open]:shadow-lg data-[state=open]:border-royal-blue/30 transition-all duration-300 overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 text-foreground hover:text-royal-blue transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/5 via-transparent to-olive/5" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 text-royal-blue font-semibold text-sm uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4" />
                Contact Us
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Get In <span className="gradient-text">Touch</span>
              </h2>
              <p className="text-muted-foreground text-lg">Ready to begin your journey towards excellence?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="group bg-card p-8 rounded-2xl border border-border/50 text-center hover:shadow-xl hover:border-royal-blue/30 transition-all duration-500 hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-royal-blue to-royal-blue/70 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <p className="font-bold text-foreground text-lg mb-2">Phone</p>
                <a
                  href="tel:+917702770172"
                  className="block text-muted-foreground text-sm hover:text-royal-blue transition-colors"
                >
                  +91 7702770172
                </a>
                <a
                  href="tel:+916361474764"
                  className="block text-muted-foreground text-sm hover:text-royal-blue transition-colors"
                >
                  +91 6361474764
                </a>
              </div>

              <div className="group bg-card p-8 rounded-2xl border border-border/50 text-center hover:shadow-xl hover:border-royal-blue/30 transition-all duration-500 hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <p className="font-bold text-foreground text-lg mb-2">Email</p>
                <a
                  href="mailto:prscholars25@gmail.com"
                  className="block text-muted-foreground text-sm hover:text-royal-blue transition-colors"
                >
                  prscholars25@gmail.com
                </a>
                <a
                  href="mailto:padmamathspro@gmail.com"
                  className="block text-muted-foreground text-sm hover:text-royal-blue transition-colors"
                >
                  padmamathspro@gmail.com
                </a>
                <a
                  href="mailto:colonelrsacademy@gmail.com"
                  className="block text-muted-foreground text-sm hover:text-royal-blue transition-colors"
                >
                  colonelrsacademy@gmail.com
                </a>
              </div>

              <div className="group bg-card p-8 rounded-2xl border border-border/50 text-center hover:shadow-xl hover:border-royal-blue/30 transition-all duration-500 hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-olive to-olive/70 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <p className="font-bold text-foreground text-lg mb-2">Address</p>
                <p className="text-muted-foreground text-sm">Dodabanahalli, Bidarahalli Hobili,</p>
                <p className="text-muted-foreground text-sm">Bengaluru, Karnataka-560115</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {/* 3D Navy Blue Button - Padma */}
              <div className="relative group">
                <div className="absolute inset-0 rounded-lg bg-[#0a1628] transform translate-y-1.5" />
                <Button
                  size="lg"
                  className="relative bg-gradient-to-b from-[#1B2A4E] via-navy to-[#0f1d36] hover:from-[#243660] hover:via-[#1B2A4E] hover:to-[#142544] gap-3 shadow-[0_4px_15px_rgba(27,42,78,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(27,42,78,0.6)] transition-all duration-300 py-6 px-8 text-lg border-t border-white/10 active:translate-y-0.5"
                  asChild
                >
                  <a href="/padma" target="_blank" rel="noopener noreferrer">
                    <img src={padmaLogo} alt="Padma" className="w-7 h-7 rounded-full object-cover bg-white" />
                    Explore Padma Maths Pro
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
              {/* 3D Blood Red Button - R's Academy */}
              <div className="relative group">
                <div className="absolute inset-0 rounded-lg bg-[#4a0000] transform translate-y-1.5" />
                <Button
                  size="lg"
                  className="relative bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#4a0000] hover:from-[#9B1010] hover:via-[#8B0000] hover:to-[#5a0000] gap-3 shadow-[0_4px_15px_rgba(139,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(139,0,0,0.6)] transition-all duration-300 py-6 px-8 text-lg border-t border-white/10 active:translate-y-0.5"
                  asChild
                >
                  <a href="/racademy" target="_blank" rel="noopener noreferrer">
                    <img src={racademyLogo} alt="R Academy" className="w-7 h-7 rounded-full object-cover bg-white" />
                    Explore R's Academy
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-16 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-white/90 flex items-center justify-center shadow-lg">
                  <span className="font-display font-bold text-navy text-lg">PR</span>
                </div>
                <span className="font-display font-bold text-white text-xl">PRScholars</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Shaping tomorrow's leaders through excellence in education.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#about"
                    className="text-white/50 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#institutes"
                    className="text-white/50 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    Our Institutes
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-white/50 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/mock-test.html"
                    className="text-white/50 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    Mock Test
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-white/50 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Institutes</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/padma"
                    className="text-white/50 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    Padma Maths Pro
                  </Link>
                </li>
                <li>
                  <Link
                    to="/racademy"
                    className="text-white/50 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    R's Defence Academy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Contact</h4>
              <ul className="space-y-3">
                <li className="text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-white/50" />
                  <a href="tel:+917702770172" className="text-white/50 hover:text-white transition-colors">
                    +91 7702770172
                  </a>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-white/50" />
                  <a href="tel:+916361474764" className="text-white/50 hover:text-white transition-colors">
                    +91 6361474764
                  </a>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white/50" />
                  <a href="mailto:prscholars25@gmail.com" className="text-white/50 hover:text-white transition-colors">
                    prscholars25@gmail.com
                  </a>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white/50" />
                  <a href="mailto:padmamathspro@gmail.com" className="text-white/50 hover:text-white transition-colors">
                    padmamathspro@gmail.com
                  </a>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white/50" />
                  <a
                    href="mailto:colonelrsacademy@gmail.com"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    colonelrsacademy@gmail.com
                  </a>
                </li>
                <li className="text-white/50 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dodabanahalli, Bengaluru-560115
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="border-t border-white/10 pt-8 mt-8">
            <h4 className="font-bold text-white mb-6 text-lg text-center">Follow Us</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* PR Scholars */}
              <div className="text-center">
                <p className="text-white/70 font-medium mb-3">PR Scholars</p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://www.linkedin.com/in/pr-scholars-1104543a6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/prscholars?igsh=OHEwYjVtcnJnZW5p"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-pink-400 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/PrScholars25"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/people/Padma-Maths-Pro/pfbid0YwoNmv5eEyqAxr6uwPaWjDab9GM9eYkJJmWVynkwDNW453B31LQncQuzGpVNC771l/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-blue-400 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Padma Maths Pro */}
              <div className="text-center">
                <p className="text-white/70 font-medium mb-3">Padma Maths Pro</p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://www.linkedin.com/in/padma-maths-pro-6264573a6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/pmpro25?igsh=dGplcWx1a2t3amFy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-pink-400 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/PMPro_Maths"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/people/Padma-Maths-Pro/pfbid0YwoNmv5eEyqAxr6uwPaWjDab9GM9eYkJJmWVynkwDNW453B31LQncQuzGpVNC771l/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-blue-400 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Colonel R's Academy */}
              <div className="text-center">
                <p className="text-white/70 font-medium mb-3">Colonel R's Academy</p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://www.linkedin.com/in/ssb-training-academy-82a3a039a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/colonelrsacademy?igsh=MW5iZzIzY2hlbjluZw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-pink-400 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/Col_Rs_Academy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/people/Padma-Maths-Pro/pfbid0YwoNmv5eEyqAxr6uwPaWjDab9GM9eYkJJmWVynkwDNW453B31LQncQuzGpVNC771l/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-blue-400 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 mt-8">
            <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
              <Link to="/about" className="text-white/50 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-white/50 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link to="/refund-policy" className="text-white/50 hover:text-white transition-colors">
                Refund & Cancellation
              </Link>
              <Link to="/terms" className="text-white/50 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-white/50 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
            <p className="text-white/30 text-sm text-center">
              © {new Date().getFullYear()} PRScholars. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Institute Buttons */}
      <FloatingInstituteButtons />
    </div>
  );
};

export default Index;
