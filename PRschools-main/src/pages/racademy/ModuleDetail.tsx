import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import RAcademyLayout from "@/components/layouts/RAcademyLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock, Users, Calendar, Shield, CheckCircle,
  ChevronRight, Phone, Mail, ArrowLeft, Star, ShoppingCart,
  Monitor, Building, MapPin, IndianRupee, BookOpen
} from "lucide-react";
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
}

interface Subject {
  id: string;
  module_id: string;
  name: string;
  fee_amount: number;
  fee_label: string | null;
  days: string | null;
  timing: string | null;
  duration: string | null;
  display_order: number;
}

const modeLabels: Record<string, string> = {
  online: "Online Program",
  offline: "Offline Program",
  onsite: "Onsite Event",
};

const RAcademyModuleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [mod, setMod] = useState<Module | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowFloatingButton(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      setLoading(true);
      const { data: moduleData } = await supabase
        .from("racademy_modules")
        .select("*")
        .eq("code", slug)
        .eq("is_active", true)
        .single();

      if (!moduleData) { setLoading(false); return; }
      setMod(moduleData as Module);

      const { data: subData } = await supabase
        .from("racademy_subjects")
        .select("*")
        .eq("module_id", moduleData.id)
        .eq("is_active", true)
        .order("display_order");

      setSubjects((subData as Subject[]) || []);
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <RAcademyLayout>
        <div className="py-32 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-olive" />
        </div>
      </RAcademyLayout>
    );
  }

  if (!mod) {
    return (
      <RAcademyLayout>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Program Not Found</h1>
          <Button onClick={() => navigate("/racademy/courses")}>View All Programs</Button>
        </div>
      </RAcademyLayout>
    );
  }

  return (
    <RAcademyLayout>
      {/* Sticky Bar */}
      <div className={`fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border hidden md:block transition-all duration-300 ${showFloatingButton ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h2 className="font-bold text-foreground truncate max-w-md">{mod.name}</h2>
          <Button className="bg-olive hover:bg-olive/90" onClick={() => setIsBookingOpen(true)}>
            <ShoppingCart className="w-4 h-4 mr-2" /> Book Now
          </Button>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-olive via-olive to-gold/80 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Link to="/racademy/courses" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> All Programs
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full mb-4">
              <Star className="w-4 h-4 text-gold" />
              <span className="text-sm">{modeLabels[mod.mode]}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{mod.name}</h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl">{mod.description}</p>

            <div className="flex flex-wrap gap-6 mb-8">
              {mod.duration && (
                <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-gold" /><span>{mod.duration}</span></div>
              )}
              {mod.target_audience && (
                <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gold" /><span>{mod.target_audience}</span></div>
              )}
              <div className="flex items-center gap-2">
                {mod.mode === "online" ? <Monitor className="w-5 h-5 text-gold" /> : mod.mode === "offline" ? <Building className="w-5 h-5 text-gold" /> : <MapPin className="w-5 h-5 text-gold" />}
                <span className="capitalize">{mod.mode} Mode</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-olive hover:bg-white/90" onClick={() => setIsBookingOpen(true)}>
                <ShoppingCart className="w-4 h-4 mr-2" /> Book Now <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <a href="tel:7702770172">
                <Button size="lg" className="bg-white/10 border border-white/50 text-white hover:bg-white/20 backdrop-blur-sm">
                  <Phone className="w-4 h-4 mr-2" /> 7702770172
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-secondary border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-olive">{mod.fee_summary || "Contact Us"}</p>
              <p className="text-sm text-muted-foreground">Fee</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{mod.duration || "—"}</p>
              <p className="text-sm text-muted-foreground">Duration</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground capitalize">{mod.mode}</p>
              <p className="text-sm text-muted-foreground">Mode</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{mod.target_audience?.split("(")[0]?.trim() || "All"}</p>
              <p className="text-sm text-muted-foreground">Eligibility</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      {mod.highlights && mod.highlights.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
              {mod.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-olive/5 rounded-lg border border-olive/10">
                  <CheckCircle className="w-5 h-5 text-olive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subject Plans / Pricing */}
      <section className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-olive font-semibold text-sm uppercase tracking-wider mb-3">
              <IndianRupee className="w-4 h-4" /> Fee Structure
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {subjects.length > 1 ? "Choose Your Subject" : "Program Fee"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All fees are inclusive of taxes as mentioned. Select a subject and book your slot.
            </p>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Contact us for fee details.</p>
            </div>
          ) : subjects.length === 1 ? (
            <div className="max-w-md mx-auto">
              <Card className="border-2 border-olive/20 bg-olive/5">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">{subjects[0].name}</h3>
                  <p className="text-4xl font-black text-olive mb-2">₹{subjects[0].fee_amount.toLocaleString("en-IN")}</p>
                  <p className="text-sm text-muted-foreground mb-4">{subjects[0].fee_label}</p>
                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    {subjects[0].days && <p><strong>Days:</strong> {subjects[0].days}</p>}
                    {subjects[0].timing && <p><strong>Timing:</strong> {subjects[0].timing}</p>}
                    {subjects[0].duration && <p><strong>Duration:</strong> {subjects[0].duration}</p>}
                  </div>
                  <Button className="w-full bg-olive hover:bg-olive/90" onClick={() => setIsBookingOpen(true)}>
                    <ShoppingCart className="w-4 h-4 mr-2" /> Book Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-olive/20">
                    <th className="text-left py-4 px-4 text-foreground font-bold">Subject / Option</th>
                    <th className="text-center py-4 px-4 text-foreground font-bold">Fee</th>
                    <th className="text-center py-4 px-4 text-foreground font-bold hidden md:table-cell">Days</th>
                    <th className="text-center py-4 px-4 text-foreground font-bold hidden lg:table-cell">Timing</th>
                    <th className="text-center py-4 px-4 text-foreground font-bold hidden md:table-cell">Duration</th>
                    <th className="text-center py-4 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((sub, idx) => {
                    const isHighlighted = sub.name.toLowerCase().includes("both") || sub.name.toLowerCase().includes("all three") || sub.name.toLowerCase().includes("all");
                    return (
                      <tr
                        key={sub.id}
                        className={`border-b border-border/50 transition-colors hover:bg-olive/5 ${isHighlighted ? "bg-olive/5" : ""}`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-olive/10 text-olive rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {String.fromCharCode(97 + idx)}
                            </span>
                            <div>
                              <p className="font-semibold text-foreground text-sm">{sub.name}</p>
                              {isHighlighted && <span className="text-[10px] px-2 py-0.5 rounded-full bg-olive text-white font-bold">Best Value</span>}
                              <p className="text-xs text-muted-foreground md:hidden">
                                {sub.days} • {sub.timing} • {sub.duration}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-bold text-foreground text-lg">₹{sub.fee_amount.toLocaleString("en-IN")}</span>
                          <p className="text-xs text-muted-foreground">{sub.fee_label}</p>
                        </td>
                        <td className="py-4 px-4 text-center text-sm text-muted-foreground hidden md:table-cell">{sub.days || "—"}</td>
                        <td className="py-4 px-4 text-center text-sm text-muted-foreground hidden lg:table-cell">{sub.timing || "—"}</td>
                        <td className="py-4 px-4 text-center text-sm text-muted-foreground hidden md:table-cell">{sub.duration || "—"}</td>
                        <td className="py-4 px-4 text-center">
                          <Button
                            size="sm"
                            className="bg-olive hover:bg-olive/90"
                            onClick={() => setIsBookingOpen(true)}
                          >
                            Book Now
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Location for offline */}
      {mod.mode === "offline" && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-olive" /> Training Location
            </h2>
            <Card className="max-w-2xl border-olive/20">
              <CardContent className="p-6">
                <p className="text-foreground font-medium mb-2">Colonel R's Academy</p>
                <p className="text-muted-foreground text-sm">
                  No 2, G Ground, SRS Prashanthi Fields, Adjacent to HDFC Bank ATM,
                  Opposite Whitefield Railway Station, Post Office Road, Kadugodi,
                  Bengaluru, Karnataka-560067
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Faculty */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Faculty</h2>
          <div className="max-w-2xl">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-olive/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-8 h-8 text-olive" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Col. Ramu Ranganathan (Retd)</h3>
                  <p className="text-sm text-muted-foreground mb-2">23 Years of Military Service</p>
                  <p className="text-muted-foreground text-sm">
                    Retired Army Colonel with decades of military experience and educational leadership.
                    Seasoned mentor who instills leadership, confidence and clarity of purpose —
                    qualities essential for future officers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-olive text-white pb-32 md:pb-16">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Begin Your Defence Journey?</h2>
          <p className="text-white/70 mb-8">Join Colonel R's Academy and prepare to serve the nation with honour.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-gold text-olive hover:bg-gold/90" onClick={() => setIsBookingOpen(true)}>
              <ShoppingCart className="w-4 h-4 mr-2" /> Book Now <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <a href="tel:7702770172">
              <Button size="lg" className="bg-white/10 border border-white/50 text-white hover:bg-white/20 backdrop-blur-sm">
                <Phone className="w-4 h-4 mr-2" /> 7702770172
              </Button>
            </a>
          </div>
          <a href="mailto:colonelrsacademy@gmail.com" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
            <Mail className="w-4 h-4" /> colonelrsacademy@gmail.com
          </a>
        </div>
      </section>

      {/* Fixed Mobile Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-sm border-t border-border md:hidden z-50">
        <Button size="lg" className="w-full bg-olive hover:bg-olive/90" onClick={() => setIsBookingOpen(true)}>
          <ShoppingCart className="w-4 h-4 mr-2" /> Book Now
        </Button>
      </div>

      {/* Floating Desktop Button */}
      {showFloatingButton && (
        <div className="fixed bottom-8 right-8 z-50 hidden md:block animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Button size="lg" className="bg-olive hover:bg-olive/90 shadow-lg shadow-olive/30" onClick={() => setIsBookingOpen(true)}>
            <ShoppingCart className="w-4 h-4 mr-2" /> Book Now
          </Button>
        </div>
      )}

      {/* Booking Modal */}
      <RacademyBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedModule={slug}
      />
    </RAcademyLayout>
  );
};

export default RAcademyModuleDetail;
