import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RAcademyLayout from "@/components/layouts/RAcademyLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Phone, Loader2, BookOpen, Monitor, Building, MapPin, ChevronRight, Users, Clock, Sparkles, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RacademyBookingModal from "@/components/RacademyBookingModal";

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

const RAcademyCourses = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      const { data, error } = await supabase
        .from("racademy_modules")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) console.error("Error:", error);
      else setModules((data as Module[]) || []);
      setLoading(false);
    };
    fetchModules();
  }, []);

  const mainCourses = modules.filter(m => ["nda", "cds", "ssb"].includes(m.code));
  const events = modules.filter(m => !["nda", "cds", "ssb"].includes(m.code));

  return (
    <RAcademyLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-olive via-olive to-gold/80 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.05&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Duty • Honor • Country</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Programs
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Comprehensive mentoring for NDA, CDS Entrance Exams & SSB Interviews. 
              Choose your path to serve the nation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Courses Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-olive font-semibold text-sm uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" /> Defence Training Programs
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Core Programs</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-olive" />
            </div>
          ) : mainCourses.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No programs available.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {mainCourses.map((mod, index) => {
                const colors = modeColors[mod.mode] || modeColors.online;
                const ModeIcon = modeIcons[mod.mode] || Monitor;
                return (
                  <Link 
                    key={mod.id} 
                    to={`/racademy/courses/${mod.code}`}
                    className="group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card className={`h-full border-2 ${colors.bg} ${colors.border} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}>
                      <CardContent className="p-6">
                        {/* Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                            <ModeIcon className="w-3 h-3" />
                            {modeLabels[mod.mode]}
                          </span>
                          {mod.fee_summary && (
                            <span className="text-xs font-semibold text-muted-foreground">{mod.fee_summary}</span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-olive transition-colors">
                          {mod.name}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {mod.description}
                        </p>

                        {/* Meta */}
                        <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
                          {mod.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {mod.duration}
                            </span>
                          )}
                          {mod.target_audience && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {mod.target_audience}
                            </span>
                          )}
                        </div>

                        {/* Highlights */}
                        {mod.highlights && mod.highlights.length > 0 && (
                          <div className="space-y-1.5 mb-5">
                            {mod.highlights.slice(0, 3).map((h, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.badge}`} />
                                {h}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* CTA */}
                        <div className={`flex items-center gap-2 font-semibold text-sm ${colors.accent} group-hover:gap-3 transition-all`}>
                          View Details <ChevronRight className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Events & Workshops Section */}
      {events.length > 0 && (
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3">
                <MapPin className="w-4 h-4" /> Seminars & Workshops
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Events & Outreach</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Leadership seminars for corporates and awareness programs for educational institutions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {events.map((mod, index) => {
                const colors = modeColors[mod.mode] || modeColors.onsite;
                const ModeIcon = modeIcons[mod.mode] || MapPin;
                return (
                  <Link 
                    key={mod.id} 
                    to={`/racademy/courses/${mod.code}`}
                    className="group"
                  >
                    <Card className={`h-full border-2 ${colors.bg} ${colors.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                      <CardContent className="p-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors.badge} mb-4`}>
                          <ModeIcon className="w-3 h-3" />
                          {modeLabels[mod.mode]}
                        </span>
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-indigo-600 transition-colors">
                          {mod.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{mod.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{mod.duration}</span>
                          <span className="font-semibold">{mod.fee_summary}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">Why Choose Colonel R's Academy?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Mentors with decades of military experience and educational leadership",
                "Structured online classes ensuring flexibility and accessibility",
                "Seasoned IOs, GTOs and Psychologists for personalized guidance",
                "Instills leadership, confidence and clarity of purpose",
                "Proven success track record in entrance exams and SSB interviews",
                "Limited batch sizes for personal attention",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-olive/5 rounded-lg border border-olive/10">
                  <Shield className="w-5 h-5 text-olive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground text-sm">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-olive text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready for the Mission?</h2>
          <p className="text-white/70 mb-4">👉 Limited Seats. Book your spot now!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gold text-olive hover:bg-gold/90 gap-2" onClick={() => setIsBookingOpen(true)}>
              <ShoppingCart className="w-4 h-4" /> Book Now
            </Button>
            <a href="tel:7702770172">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2">
                <Phone className="w-4 h-4" /> 7702770172
              </Button>
            </a>
          </div>
        </div>
      </section>

      <RacademyBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </RAcademyLayout>
  );
};

export default RAcademyCourses;
