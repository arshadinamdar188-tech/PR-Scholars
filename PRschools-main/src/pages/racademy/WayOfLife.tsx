import RAcademyLayout from "@/components/layouts/RAcademyLayout";
import { Shield, Flag, Star, Wallet, Award, GraduationCap, Heart, Compass, TrendingUp } from "lucide-react";

const careerBenefits = [
  {
    title: "Financial Security",
    icon: Wallet,
    points: [
      "Stable salary with allowances (housing, travel, medical)",
      "Pension benefits and retirement security, ensuring long-term financial stability",
      "Additional perks like subsidized housing, canteen facilities and insurance coverage"
    ]
  },
  {
    title: "Prestige and Social Respect",
    icon: Award,
    points: [
      "Wearing the uniform symbolizes honor, discipline, and patriotism",
      "Armed Forces officers are highly respected in society, often seen as role models"
    ]
  },
  {
    title: "Training & Skill Development",
    icon: GraduationCap,
    points: [
      "Rigorous training at institutions like NDA, IMA, Air Force Academy and Naval Academy builds resilience, leadership and teamwork",
      "Exposure to advanced technology, strategic thinking and decision-making under pressure"
    ]
  },
  {
    title: "Sense of Duty and Patriotism",
    icon: Heart,
    points: [
      "Serving the nation instills pride and purpose",
      "Contribution to national security gives a deep sense of fulfillment"
    ]
  },
  {
    title: "Lifestyle and Adventure",
    icon: Compass,
    points: [
      "Opportunities for travel across India and abroad",
      "Adventure activities like mountaineering, sailing, flying, etc.",
      "A disciplined lifestyle that fosters fitness and mental strength"
    ]
  },
  {
    title: "Professional Growth and Promotions",
    icon: TrendingUp,
    points: [
      "Structured career path with clear promotion stages based on merit and seniority",
      "Opportunities to rise to high-ranking positions with increasing responsibilities"
    ]
  }
];

const RAcademyWayOfLife = () => (
  <RAcademyLayout>
    {/* Hero Header Section */}
    <section className="py-16 bg-gradient-to-b from-olive/10 to-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-olive/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-olive/10 border border-olive/20 mb-6">
          <Flag className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium text-olive uppercase tracking-wider">The Way of Life</span>
        </div>
        
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          <span className="text-foreground">Why Choose </span>
          <span className="text-gold">Armed Forces?</span>
        </h1>
        
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          If you dream of doing something brave, exciting and meaningful, the Armed Forces is the perfect path.
        </p>
      </div>
    </section>

    {/* Main Content - Two Column Layout */}
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Card - Icon Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-olive/30 via-gold/20 to-olive/30 rounded-3xl blur-sm opacity-60" />
            <div className="relative bg-olive rounded-3xl p-8 md:p-10 h-full flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1 flex items-center">
                <div className="w-20 h-1.5 bg-gradient-to-r from-gold to-gold/50 rounded-full" />
              </div>
              
              <div className="mt-auto pt-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gold animate-pulse" />
                  <span className="text-white/80 text-sm font-medium">Honor • Courage • Commitment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card - Content Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-olive/20 via-gold/10 to-olive/20 rounded-3xl blur-sm opacity-60" />
            <div className="relative bg-card border border-olive/20 rounded-3xl p-8 md:p-10 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-olive/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-olive" />
                </div>
                <h2 className="font-display text-2xl font-bold text-olive">Why Choose Armed Forces?</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Choosing a career in the Armed Forces is more than a profession—it is a calling to serve the nation with honor, courage and commitment. The Armed Forces offer young aspirants a life of discipline, adventure and unmatched pride. Beyond the uniform lies a journey of leadership, resilience and responsibility, where every challenge shapes you into a stronger individual.
                </p>
                
                <p>
                  From safeguarding borders to leading humanitarian missions, officers of the Armed Forces embody integrity and selfless service. The career provides not only financial stability and respect but also the rare opportunity to inspire and lead others. It is a path where personal growth meets national duty and where every day brings purpose and meaning.
                </p>
                
                <p className="font-medium text-foreground">
                  Choosing this path means choosing a future filled with respect, growth and the chance to make a real difference. For those who dream of making a difference of standing tall as leaders and of dedicating themselves to the nation, the Armed Forces are not just a choice—they are <span className="text-gold font-semibold">destiny</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Career Benefits Section */}
    <section className="py-20 bg-gradient-to-b from-background to-olive/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-olive/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-olive mb-3">Career Benefits</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-olive via-gold to-olive mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-olive/40 to-gold/40 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                
                <div className="relative bg-card backdrop-blur-sm rounded-2xl p-6 border border-olive/15 group-hover:border-olive/40 transition-all duration-500 h-full flex flex-col shadow-lg shadow-olive/5">
                  {/* Icon header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-olive to-olive/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display font-bold text-olive text-lg leading-tight">{benefit.title}</h3>
                  </div>
                  
                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-olive/30 via-gold/40 to-transparent mb-5" />
                  
                  {/* Points */}
                  <ul className="space-y-3 flex-1">
                    {benefit.points.map((point, pIndex) => (
                      <li key={pIndex} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Bottom accent bar */}
                  <div className="mt-5 h-1 w-0 group-hover:w-full bg-gradient-to-r from-olive via-gold to-olive rounded-full transition-all duration-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  </RAcademyLayout>
);

export default RAcademyWayOfLife;
