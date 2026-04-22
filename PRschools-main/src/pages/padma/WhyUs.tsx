import PadmaLayout from "@/components/layouts/PadmaLayout";
import { Award, Users, BookOpen, Clock, Target, CheckCircle, Sparkles, GraduationCap } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Experienced Mentor",
    description: "The learning at Padma Maths Pro is driven by passion of the Mentor for Mathematics for more than three decades.",
    gradient: "from-amber-500 to-orange-600",
    bgGlow: "bg-amber-500/20"
  },
  {
    icon: Target,
    title: "Ex Army Officer",
    description: "The mentor is an ex-Army Officer, focused on disciplined teaching methodology with conceptual clarity and systematic problem-solving approach.",
    gradient: "from-emerald-500 to-teal-600",
    bgGlow: "bg-emerald-500/20"
  },
  {
    icon: Users,
    title: "Personalised Attention",
    description: "Limited students in small batches ensuring personalized attention and individual doubt clearing sessions.",
    gradient: "from-blue-500 to-indigo-600",
    bgGlow: "bg-blue-500/20"
  },
  {
    icon: BookOpen,
    title: "Tailored Curriculum",
    description: "Curriculum designed to meet the requirements of 9th, 10th, 11th & 12th standards with focus on Board exams and NDA/CDS & CLAT entrance exams.",
    gradient: "from-purple-500 to-pink-600",
    bgGlow: "bg-purple-500/20"
  },
  {
    icon: CheckCircle,
    title: "Proven Results",
    description: "Prepare the students for scoring 90+ in Board exams and pass the competitive exams.",
    gradient: "from-rose-500 to-red-600",
    bgGlow: "bg-rose-500/20"
  },
  {
    icon: Clock,
    title: "Flexible Timings",
    description: "Conducive class timings both on weekdays as well as weekends, convenient for each student/batch (mornings/evenings).",
    gradient: "from-cyan-500 to-blue-600",
    bgGlow: "bg-cyan-500/20"
  },
  {
    icon: GraduationCap,
    title: "Mock Exams",
    description: "Complete the curriculum well in time to have at least two months for Mock Exams.",
    gradient: "from-violet-500 to-purple-600",
    bgGlow: "bg-violet-500/20"
  }
];

const stats = [
  { value: "30+", label: "Years Experience" },
  { value: "500+", label: "Students Trained" },
  { value: "90%", label: "Success Rate" },
  { value: "100%", label: "Dedication" }
];

const PadmaWhyUs = () => {
  return (
    <PadmaLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-padma-primary/5 via-background to-padma-secondary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-padma-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-padma-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating Elements */}
        <div className="absolute top-32 right-20 animate-bounce-slow">
          <Sparkles className="w-8 h-8 text-padma-primary/40" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
          <Award className="w-10 h-10 text-padma-secondary/40" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-padma-primary/10 border border-padma-primary/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-padma-primary" />
              <span className="text-sm font-medium text-padma-primary">Excellence in Mathematics Education</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">Why Choose</span>{" "}
              <span className="bg-gradient-to-r from-padma-primary via-padma-secondary to-padma-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_ease-in-out_infinite]">
                Padma Maths Pro?
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience the difference of learning from a passionate mentor with over three decades of teaching excellence
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-padma-primary to-padma-secondary bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground mt-2 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground)) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Glow Effect */}
                <div className={`absolute inset-0 ${reason.bgGlow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 h-full hover:border-padma-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-padma-primary/10">
                  {/* Icon Container */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <reason.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Number Badge */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-padma-primary/10 group-hover:text-padma-primary transition-colors duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-padma-primary transition-colors duration-300">
                    {reason.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {reason.description}
                  </p>
                  
                  {/* Bottom Accent Line */}
                  <div className={`absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r ${reason.gradient} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-padma-primary to-padma-secondary opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTItNC0yLTQgMi0yIDQtMiA0IDIgMiA0IDIgNCAyIDQtMiAyLTQgMi00cy0yLTItNC0yLTQtMi00IDItMiA0LTIgNCAyIDIgNCAyIDQgMiA0LTIgMi00IDItNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Excel in Mathematics?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join Padma Maths Pro today and experience the transformation in your mathematical journey
          </p>
          <a
            href="/padma/courses"
            className="inline-flex items-center gap-2 bg-white text-padma-primary font-bold px-8 py-4 rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl"
          >
            <GraduationCap className="w-5 h-5" />
            Explore Our Courses
          </a>
        </div>
      </section>
    </PadmaLayout>
  );
};

export default PadmaWhyUs;
