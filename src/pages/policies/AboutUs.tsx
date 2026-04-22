import { Link } from "react-router-dom";
import { ArrowLeft, GraduationCap, Shield, Target, Users } from "lucide-react";
import founderImg from "@/assets/founder-colonel.jpg";

const pillars = [
  { icon: GraduationCap, title: "Academic Excellence", desc: "Building strong mathematical foundations from Class 6 to 12 across all boards." },
  { icon: Shield, title: "Defence Preparation", desc: "Comprehensive NDA, CDS & SSB coaching by experienced military professionals." },
  { icon: Target, title: "Focused Mentorship", desc: "Small batch sizes ensuring personal attention and customised learning paths." },
  { icon: Users, title: "Community of Achievers", desc: "A proven track record of students excelling in academics and defence selections." },
];

const AboutUs = () => (
  <div className="min-h-screen bg-background">
    {/* Hero */}
    <section className="relative bg-gradient-to-br from-[hsl(var(--navy))] via-[hsl(var(--navy-light))] to-[hsl(var(--royal-blue))] text-primary-foreground py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--royal-blue)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--royal-blue-light)) 0%, transparent 40%)" }} />
      <div className="container mx-auto px-4 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
          About <span className="bg-gradient-to-r from-white to-[hsl(var(--royal-blue-light))] bg-clip-text text-transparent">PRScholars</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl">
          Empowering students with world-class Mathematics coaching and shaping future leaders for the Indian Armed Forces.
        </p>
      </div>
    </section>

    {/* Founder */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-2">
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-br from-[hsl(var(--royal-blue)/0.3)] to-[hsl(var(--navy)/0.2)] rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <img src={founderImg} alt="Colonel Ramu Ranganathan" className="relative rounded-2xl w-full h-[350px] object-cover object-top shadow-xl" />
            </div>
          </div>
          <div className="md:col-span-3 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-[hsl(var(--royal-blue))]">Founder & Mentor</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Colonel Ramu Ranganathan <span className="text-muted-foreground text-xl">(Retd)</span>
            </h2>
            <p className="text-muted-foreground">MSc, MBA, BSc (Hons) Maths · Psychologist</p>
            <p className="text-muted-foreground leading-relaxed">
              With decades of distinguished service in the Indian Army and a lifelong passion for Mathematics, Colonel Ranganathan founded PRScholars to make quality education accessible. His unique approach combines military discipline with innovative pedagogy, creating an environment where students thrive.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Institutes */}
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="font-display text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[hsl(var(--navy))] to-[hsl(var(--royal-blue))] bg-clip-text text-transparent">Our Institutes</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[hsl(var(--royal-blue)/0.1)] flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-[hsl(var(--royal-blue))]" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Padma Maths Pro</h3>
            <p className="text-muted-foreground leading-relaxed">
              Specialising in Mathematics coaching for Classes 6–12 across CBSE, ICSE, and State Board curricula. We make Mathematics intuitive, enjoyable, and a lifelong skill.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[hsl(var(--olive)/0.1)] flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[hsl(var(--olive))]" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Colonel R's Academy</h3>
            <p className="text-muted-foreground leading-relaxed">
              A dedicated training centre for NDA, CDS, and SSB preparation. Rigorous coaching for written examinations and comprehensive SSB interview training.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Pillars */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="font-display text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[hsl(var(--navy))] to-[hsl(var(--royal-blue))] bg-clip-text text-transparent">What Sets Us Apart</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-card border border-border hover:border-[hsl(var(--royal-blue)/0.3)] hover:shadow-lg transition-all group">
              <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-[hsl(var(--royal-blue)/0.1)] to-[hsl(var(--navy)/0.05)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <p.icon className="w-7 h-7 text-[hsl(var(--royal-blue))]" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Contact bar */}
    <section className="bg-gradient-to-r from-[hsl(var(--navy))] to-[hsl(var(--royal-blue))] py-10">
      <div className="container mx-auto px-4 max-w-5xl text-center text-primary-foreground">
        <h3 className="font-display text-2xl font-bold mb-4">Get in Touch</h3>
        <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
          <span>📞 +91 6361474764</span>
          <span>✉️ padmamathspro@gmail.com</span>
          <span>📍 Dodabenahalli, Bengaluru 560067</span>
        </div>
      </div>
    </section>
  </div>
);

export default AboutUs;
