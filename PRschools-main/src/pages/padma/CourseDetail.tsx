import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PadmaLayout from "@/components/layouts/PadmaLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Clock, Users, Calendar, GraduationCap, CheckCircle, 
  ChevronRight, Phone, Mail, ArrowLeft, BookOpen, Star, ShoppingCart,
  Monitor, Building, Award, Sparkles, TrendingUp, IndianRupee
} from "lucide-react";
import PadmaBookingModal from "@/components/PadmaBookingModal";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// Static syllabus data (could be moved to DB later)
const syllabus: Record<string, { name: string; chapters: { name: string; topics: string[] }[] }[]> = {
  "9": [
    { name: "Number Systems", chapters: [{ name: "Real Numbers", topics: ["Introduction to irrational numbers", "Real numbers and their decimal expansions", "Operations on real numbers", "Laws of exponents"] }] },
    { name: "Algebra", chapters: [{ name: "Polynomials", topics: ["Polynomials in one variable", "Zeros of a polynomial", "Remainder theorem", "Factorization"] }, { name: "Linear Equations", topics: ["Linear equations in two variables", "Graph of linear equation", "Equations of lines parallel to axes"] }] },
    { name: "Geometry", chapters: [{ name: "Lines and Angles", topics: ["Basic terms", "Pairs of angles", "Parallel lines and transversal", "Angle sum property"] }, { name: "Triangles", topics: ["Congruence of triangles", "Criteria for congruence", "Properties of triangles", "Inequalities"] }] },
    { name: "Mensuration", chapters: [{ name: "Areas & Surface Area", topics: ["Heron's formula", "Surface area of cube, cuboid, cylinder, cone, sphere"] }] },
    { name: "Statistics & Probability", chapters: [{ name: "Statistics", topics: ["Collection of data", "Graphical representation", "Measures of central tendency"] }] },
  ],
  "10": [
    { name: "Number Systems", chapters: [{ name: "Real Numbers", topics: ["Euclid's division lemma", "Fundamental theorem of arithmetic", "Irrational numbers", "Rational numbers & decimal expansions"] }] },
    { name: "Algebra", chapters: [{ name: "Polynomials", topics: ["Geometrical meaning of zeros", "Relationship between zeros and coefficients", "Division algorithm"] }, { name: "Quadratic Equations", topics: ["Standard form", "Solution methods", "Nature of roots"] }, { name: "Arithmetic Progressions", topics: ["Introduction to AP", "nth term", "Sum of first n terms"] }] },
    { name: "Coordinate Geometry", chapters: [{ name: "Coordinate Geometry", topics: ["Distance formula", "Section formula", "Area of triangle"] }] },
    { name: "Trigonometry", chapters: [{ name: "Introduction to Trigonometry", topics: ["Trigonometric ratios", "Ratios of specific angles", "Trigonometric identities"] }, { name: "Applications of Trigonometry", topics: ["Heights and distances"] }] },
    { name: "Mensuration", chapters: [{ name: "Areas & Volumes", topics: ["Areas related to circles", "Surface areas and volumes of combinations of solids"] }] },
    { name: "Statistics & Probability", chapters: [{ name: "Statistics", topics: ["Mean, median, mode of grouped data", "Cumulative frequency"] }, { name: "Probability", topics: ["Classical definition", "Simple problems"] }] },
  ],
  "11": [
    { name: "Sets and Functions", chapters: [{ name: "Sets", topics: ["Sets and representations", "Types of sets", "Subsets", "Venn diagrams", "Operations on sets"] }, { name: "Relations and Functions", topics: ["Ordered pairs", "Cartesian product", "Relations", "Functions", "Domain and range"] }, { name: "Trigonometric Functions", topics: ["Angles", "Trigonometric functions", "Trigonometric functions of sum and difference"] }] },
    { name: "Algebra", chapters: [{ name: "Complex Numbers", topics: ["Complex numbers", "Algebraic operations", "Argand plane", "Polar representation"] }, { name: "Linear Inequalities", topics: ["Solving inequalities", "Graphical representation"] }, { name: "Permutations & Combinations", topics: ["Fundamental principle of counting", "Permutations", "Combinations"] }, { name: "Binomial Theorem", topics: ["Binomial theorem for positive integral indices", "General and middle term"] }, { name: "Sequence & Series", topics: ["Arithmetic progression", "Geometric progression", "Special series"] }] },
    { name: "Coordinate Geometry", chapters: [{ name: "Straight Lines", topics: ["Slope of a line", "Various forms of equations", "Distance of a point from a line"] }, { name: "Conic Sections", topics: ["Circle", "Parabola", "Ellipse", "Hyperbola"] }] },
    { name: "Calculus", chapters: [{ name: "Limits and Derivatives", topics: ["Intuitive idea of limits", "Algebra of limits", "Limits of polynomials", "Derivatives"] }] },
    { name: "Statistics & Probability", chapters: [{ name: "Statistics", topics: ["Measures of dispersion", "Range", "Mean deviation", "Variance", "Standard deviation"] }, { name: "Probability", topics: ["Random experiments", "Event", "Axiomatic approach"] }] },
  ],
  "12": [
    { name: "Relations and Functions", chapters: [{ name: "Relations and Functions", topics: ["Types of relations", "Types of functions", "Composition", "Invertible functions"] }, { name: "Inverse Trigonometric Functions", topics: ["Definition", "Range", "Principal value branch", "Properties"] }] },
    { name: "Algebra", chapters: [{ name: "Matrices", topics: ["Types of matrices", "Operations on matrices", "Symmetric and skew symmetric", "Elementary operations", "Invertible matrices"] }, { name: "Determinants", topics: ["Determinant of square matrix", "Properties", "Area of triangle", "Adjoint and inverse", "Solving system of linear equations"] }] },
    { name: "Calculus", chapters: [{ name: "Continuity and Differentiability", topics: ["Continuity", "Differentiability", "Chain rule", "Exponential and logarithmic", "Second order derivatives", "MVT"] }, { name: "Applications of Derivatives", topics: ["Rate of change", "Increasing/decreasing", "Tangents & normals", "Maxima and minima"] }, { name: "Integrals", topics: ["Integration as inverse of differentiation", "Methods of integration", "Definite integrals", "Fundamental theorem of calculus"] }, { name: "Applications of Integrals", topics: ["Area under curves", "Area between two curves"] }, { name: "Differential Equations", topics: ["Definition", "Order and degree", "General and particular solutions", "Methods of solving"] }] },
    { name: "Vectors and 3D Geometry", chapters: [{ name: "Vectors", topics: ["Types of vectors", "Addition of vectors", "Scalar and vector products"] }, { name: "Three Dimensional Geometry", topics: ["Direction cosines and ratios", "Equation of line", "Equation of plane", "Angle between lines/planes", "Distance"] }] },
    { name: "Linear Programming", chapters: [{ name: "Linear Programming", topics: ["Introduction", "Mathematical formulation", "Graphical method"] }] },
    { name: "Probability", chapters: [{ name: "Probability", topics: ["Conditional probability", "Multiplication theorem", "Independent events", "Bayes' theorem", "Random variables", "Binomial distribution"] }] },
  ],
};

const faqs: Record<string, { question: string; answer: string }[]> = {
  "9": [
    { question: "What is the batch timing?", answer: "Online: MWF 4pm–5pm. Offline: TTS 4:30pm–5:30pm. More slots coming soon." },
    { question: "Do you provide study materials?", answer: "Yes, comprehensive study materials, practice worksheets, and previous year papers are provided." },
    { question: "How are doubts handled?", answer: "Dedicated doubt-clearing sessions and 24x7 WhatsApp support for quick assistance." },
  ],
  "10": [
    { question: "How do you prepare students for board exams?", answer: "Structured approach with complete syllabus coverage, regular tests, mock exams, and extensive practice with previous year papers." },
    { question: "What score can students expect?", answer: "Our students consistently score 90+. With dedication and following our methodology, high scores are very achievable." },
    { question: "What is the difference between Maths Standard and Basic?", answer: "Maths Standard is for students who plan to pursue Mathematics in higher studies, while Maths Basic is for students who do not wish to pursue Maths further. Both are covered thoroughly." },
  ],
  "11": [
    { question: "Is this course sufficient for JEE preparation?", answer: "This course builds a strong foundation for JEE. For comprehensive JEE prep, additional specialized coaching is recommended." },
    { question: "How is 11th different from 10th?", answer: "11th introduces advanced concepts like calculus, complex numbers, and 3D geometry. Difficulty increases significantly." },
    { question: "What about competitive exam preparation?", answer: "We cover concepts forming the base for competitive exams like JEE, while focusing on board curriculum." },
  ],
  "12": [
    { question: "How is the board exam preparation done?", answer: "Complete syllabus coverage with emphasis on high-weightage topics, regular mock tests, and previous year paper solving." },
    { question: "Is JEE preparation included?", answer: "We cover concepts at a level that helps in JEE. For advanced JEE problem solving, dedicated coaching may be needed." },
    { question: "What support is available before exams?", answer: "Intensive revision sessions, doubt clearing marathons, and practice tests before boards." },
  ],
};

const gradeDescriptions: Record<string, { subtitle: string; description: string; highlights: string[] }> = {
  "9": {
    subtitle: "Foundation Course",
    description: "Build a strong mathematical foundation with our comprehensive 9th standard curriculum. Develop problem-solving skills and conceptual clarity that lasts a lifetime.",
    highlights: ["Complete NCERT syllabus coverage", "Conceptual clarity focus", "Regular doubt clearing sessions", "Monthly assessments & progress tracking", "Olympiad & competitive exam preparation"],
  },
  "10": {
    subtitle: "Board Preparation",
    description: "Focused board exam preparation for 10th standard. Thorough understanding of concepts with extensive practice for scoring 90+ marks in CBSE boards.",
    highlights: ["Complete board exam preparation", "Reference books coverage", "Weekly tests & mock exams", "Previous year paper solving", "Special focus on scoring topics"],
  },
  "11": {
    subtitle: "Senior Secondary",
    description: "Advanced mathematics program for 11th standard. Builds foundation for competitive exams while ensuring strong board exam preparation.",
    highlights: ["Complete 11th curriculum", "JEE foundation preparation", "Rigorous problem-solving practice", "Concept-based learning approach", "Regular doubt clearing sessions"],
  },
  "12": {
    subtitle: "Board & Competitive",
    description: "Intensive program for 12th standard focusing on board exam excellence and competitive exam preparation. Master calculus, algebra, and 3D geometry.",
    highlights: ["Complete 12th board preparation", "JEE/competitive exam focus", "Advanced problem solving", "Mock tests & practice papers", "One-on-one doubt sessions"],
  },
};

interface PricingPlan {
  id: string; grade_id: string; mode: string; plan_type: string;
  plan_label: string; fee_amount: number; savings_percent: string | null;
  payment_frequency: string | null; days: string | null; timing: string | null;
  duration_period: string | null;
}

const PadmaCourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const classNumber = slug?.replace("class-", "") || "";
  const gradeInfo = gradeDescriptions[classNumber];
  const unitData = syllabus[classNumber] || [];
  const faqData = faqs[classNumber] || [];

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch dynamic data from DB
  useEffect(() => {
    if (!classNumber) return;
    const fetchData = async () => {
      setLoadingData(true);
      // Find the CBSE grade ID
      const { data: grades } = await supabase
        .from("padma_grades")
        .select("id, board_id, grade_number")
        .eq("grade_number", parseInt(classNumber))
        .eq("is_active", true);
      
      const cbseGrade = grades?.find(g => g.board_id); // Get first active grade
      if (!cbseGrade) { setLoadingData(false); return; }

      // Check if it's CBSE
      const { data: board } = await supabase
        .from("padma_boards")
        .select("code")
        .eq("id", cbseGrade.board_id)
        .single();
      
      const gradeId = board?.code === "cbse" ? cbseGrade.id : grades?.[0]?.id;
      if (!gradeId) { setLoadingData(false); return; }

      // Fetch subjects and pricing plans in parallel
      const [subjectsRes, plansRes] = await Promise.all([
        supabase.from("padma_subjects").select("id, name").eq("grade_id", gradeId).eq("is_active", true).order("display_order"),
        supabase.from("padma_pricing_plans").select("*").eq("grade_id", gradeId).eq("is_active", true).order("display_order"),
      ]);

      if (subjectsRes.data) setSubjects(subjectsRes.data);
      if (plansRes.data) setPricingPlans(plansRes.data as PricingPlan[]);
      setLoadingData(false);
    };
    fetchData();
  }, [classNumber]);

  // Group plans by mode for display
  const onlinePlans = useMemo(() => pricingPlans.filter(p => p.mode === "online"), [pricingPlans]);
  const offlinePlans = useMemo(() => pricingPlans.filter(p => p.mode === "offline"), [pricingPlans]);

  const renderPricingTable = (plans: PricingPlan[], mode: string) => {
    if (plans.length === 0) return null;
    
    const planOrder = ["platinum", "gold", "regular"];
    const sorted = [...plans].sort(
      (a, b) => planOrder.indexOf(a.plan_type) - planOrder.indexOf(b.plan_type)
    );

    // Get unique plan types
    const uniquePlans = sorted.reduce<PricingPlan[]>((acc, p) => {
      if (!acc.find(x => x.plan_type === p.plan_type)) acc.push(p);
      return acc;
    }, []);

    const planColors: Record<string, { bg: string; border: string; badge: string }> = {
      platinum: { bg: "bg-gradient-to-br from-royal-blue/5 to-indigo-500/5", border: "border-royal-blue/30 ring-2 ring-royal-blue/10", badge: "bg-gradient-to-r from-royal-blue to-indigo-600" },
      gold: { bg: "bg-gradient-to-br from-amber-500/5 to-yellow-500/5", border: "border-amber-500/30", badge: "bg-gradient-to-r from-amber-500 to-yellow-500" },
      regular: { bg: "bg-muted/30", border: "border-border", badge: "bg-gradient-to-r from-gray-500 to-gray-600" },
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {uniquePlans.map((plan) => {
          const colors = planColors[plan.plan_type] || planColors.regular;
          const isPlatinum = plan.plan_type === "platinum";
          const basePrice = plan.fee_amount;
          const gst = Math.round(basePrice * 0.18);
          const total = basePrice + gst;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                colors.bg, colors.border,
                isPlatinum && "md:-mt-4 md:mb-4"
              )}
            >
              {isPlatinum && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r from-royal-blue to-indigo-600 shadow-lg">
                    <Star className="w-3 h-3" /> Best Value
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <span className={cn("inline-block px-4 py-1.5 rounded-full text-white text-sm font-bold", colors.badge)}>
                  {plan.plan_label}
                </span>
              </div>

              <div className="text-center mb-6">
                <p className="text-3xl font-black text-foreground">₹{basePrice.toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">{plan.payment_frequency?.replace("_", " ")}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="font-semibold">₹{basePrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="font-semibold text-foreground">Total Payable</span>
                  <span className="font-bold text-royal-blue text-base">₹{total.toLocaleString("en-IN")}</span>
                </div>
                {plan.savings_percent && (
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Savings</span>
                    <span className="font-bold text-emerald-600">{plan.savings_percent}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Schedule</span>
                  <span className="text-xs font-medium">{plan.days}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Timing</span>
                  <span className="text-xs font-medium">{plan.timing}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-xs">{plan.duration_period || "—"}</span>
                </div>
              </div>

              <Button
                className={cn(
                  "w-full mt-6 h-11 rounded-xl font-bold",
                  isPlatinum
                    ? "bg-royal-blue hover:bg-royal-blue/90 shadow-lg shadow-royal-blue/25"
                    : plan.plan_type === "gold"
                      ? "bg-amber-500 hover:bg-amber-500/90 text-white"
                      : "bg-foreground hover:bg-foreground/90 text-background"
                )}
                onClick={() => setIsBookingOpen(true)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Enroll Now
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  if (!gradeInfo) {
    return (
      <PadmaLayout>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
          <Button onClick={() => navigate("/padma/courses")}>View All Courses</Button>
        </div>
      </PadmaLayout>
    );
  }

  return (
    <PadmaLayout>
      {/* Sticky Course Info Bar */}
      <div 
        className={`fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border hidden md:block transition-all duration-300 ${
          showFloatingButton ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h2 className="font-bold text-foreground truncate max-w-md">Class {classNumber} Mathematics</h2>
          <Button className="bg-royal-blue hover:bg-royal-blue/90" onClick={() => setIsBookingOpen(true)}>
            <ShoppingCart className="w-4 h-4 mr-2" /> Book Now
          </Button>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-navy via-navy to-royal-blue text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Link to="/padma/courses" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> All Courses
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full mb-4">
              <Star className="w-4 h-4 text-royal-blue-light" />
              <span className="text-sm">{gradeInfo.subtitle}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Class {classNumber} Mathematics</h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl">{gradeInfo.description}</p>

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-royal-blue-light" /><span>10 months</span></div>
              <div className="flex items-center gap-2"><Users className="w-5 h-5 text-royal-blue-light" /><span>15-20 students</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-royal-blue-light" /><span>Flexible Timings</span></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-navy hover:bg-white/90" onClick={() => setIsBookingOpen(true)}>
                <ShoppingCart className="w-4 h-4 mr-2" /> Book Now <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button size="lg" className="bg-white/10 border border-white/50 text-white hover:bg-white/20 backdrop-blur-sm">
                <Phone className="w-4 h-4 mr-2" /> +91 6361474764
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-secondary border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">10 months</p>
              <p className="text-sm text-muted-foreground">Duration</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">15-20</p>
              <p className="text-sm text-muted-foreground">Batch Size</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">90%+</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">CBSE</p>
              <p className="text-sm text-muted-foreground">Board</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects for this Grade */}
      {subjects.length > 1 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Available Subjects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              {subjects.map((sub, idx) => (
                <div key={sub.id} className="flex items-center gap-4 p-5 rounded-xl border-2 border-royal-blue/20 bg-royal-blue/5">
                  <div className="p-3 rounded-xl bg-royal-blue text-white">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">({String.fromCharCode(97 + idx)})</p>
                    <p className="font-bold text-foreground">{sub.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key Features */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gradeInfo.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-royal-blue/5 rounded-lg border border-royal-blue/10">
                <CheckCircle className="w-5 h-5 text-royal-blue mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-royal-blue font-semibold text-sm uppercase tracking-wider mb-3">
              <IndianRupee className="w-4 h-4" /> Pricing Plans
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All prices are exclusive of 18% GST. Select the plan that fits your learning journey.
            </p>
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-blue" />
            </div>
          ) : (
            <div className="space-y-16">
              {/* Online Plans */}
              {onlinePlans.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-royal-blue/10">
                      <Monitor className="w-6 h-6 text-royal-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Online Classes</h3>
                      <p className="text-sm text-muted-foreground">Learn from the comfort of your home</p>
                    </div>
                  </div>
                  {renderPricingTable(onlinePlans, "online")}
                </div>
              )}

              {/* Offline Plans */}
              {offlinePlans.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-amber-500/10">
                      <Building className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Offline Classes</h3>
                      <p className="text-sm text-muted-foreground">In-person learning at our center</p>
                    </div>
                  </div>
                  {renderPricingTable(offlinePlans, "offline")}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Syllabus */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-royal-blue" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Course Syllabus</h2>
          </div>
          <div className="max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {unitData.map((unit, unitIndex) => (
                <AccordionItem 
                  key={unitIndex} value={`unit-${unitIndex}`}
                  className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger className="text-left font-bold hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-royal-blue text-white rounded-lg flex items-center justify-center text-sm font-bold">
                        {unitIndex + 1}
                      </span>
                      {unit.name}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4 ml-11">
                      {unit.chapters.map((chapter, chapterIndex) => (
                        <div key={chapterIndex} className="border-l-2 border-royal-blue/20 pl-4">
                          <h4 className="font-medium text-foreground mb-2">{chapter.name}</h4>
                          <ul className="space-y-1">
                            {chapter.topics.map((topic, topicIndex) => (
                              <li key={topicIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-royal-blue mt-1">•</span>{topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Faculty</h2>
          <div className="max-w-2xl">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-royal-blue/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-8 h-8 text-royal-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Col. Ramu Ranganathan (Retd)</h3>
                  <p className="text-sm text-muted-foreground mb-2">MSc, MBA, BSc (Hons) Mathematics</p>
                  <p className="text-muted-foreground text-sm">
                    30+ years of teaching experience. Retired Army Officer with a passion for Mathematics.
                    Disciplined teaching methodology ensuring conceptual clarity and systematic problem-solving approach.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem 
                  key={index} value={`faq-${index}`}
                  className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-4">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-navy text-white pb-32 md:pb-16">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Enroll?</h2>
          <p className="text-white/70 mb-8">Join Padma Maths Pro and start your journey towards mathematical excellence.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-royal-blue hover:bg-royal-blue/90" onClick={() => setIsBookingOpen(true)}>
              <ShoppingCart className="w-4 h-4 mr-2" /> Book Now <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button size="lg" className="bg-white/10 border border-white/50 text-white hover:bg-white/20 backdrop-blur-sm">
              <Phone className="w-4 h-4 mr-2" /> +91 6361474764
            </Button>
          </div>
          <a href="mailto:padmamathspro@gmail.com" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
            <Mail className="w-4 h-4" /> padmamathspro@gmail.com
          </a>
        </div>
      </section>

      {/* Fixed Book Now - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-sm border-t border-border md:hidden z-50">
        <Button size="lg" className="w-full bg-royal-blue hover:bg-royal-blue/90" onClick={() => setIsBookingOpen(true)}>
          <ShoppingCart className="w-4 h-4 mr-2" /> Book Now
        </Button>
      </div>

      {/* Floating Book Now - Desktop */}
      {showFloatingButton && (
        <div className="fixed bottom-8 right-8 z-50 hidden md:block animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Button size="lg" className="bg-royal-blue hover:bg-royal-blue/90 shadow-lg shadow-royal-blue/30" onClick={() => setIsBookingOpen(true)}>
            <ShoppingCart className="w-4 h-4 mr-2" /> Book Now
          </Button>
        </div>
      )}

      <PadmaBookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} preselectedClass={classNumber} />
    </PadmaLayout>
  );
};

export default PadmaCourseDetail;
