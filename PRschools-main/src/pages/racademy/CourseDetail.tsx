import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import RAcademyLayout from "@/components/layouts/RAcademyLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Clock, Users, Calendar, Shield, CheckCircle, 
  ChevronRight, Phone, Mail, ArrowLeft, BookOpen, Star, ShoppingCart
} from "lucide-react";
import { getDefenceCourseBySlug } from "@/data/defenceCourses";
import BookingModal from "@/components/BookingModal";

const RAcademyCourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const course = getDefenceCourseBySlug(slug || "");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!course) {
    return (
      <RAcademyLayout>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
          <Button onClick={() => navigate("/racademy")}>Back to Home</Button>
        </div>
      </RAcademyLayout>
    );
  }

  return (
    <RAcademyLayout>
      {/* Sticky Course Info Bar - Desktop */}
      <div 
        className={`fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border hidden md:block transition-all duration-300 ${
          showFloatingButton ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="font-bold text-foreground truncate max-w-md">{course.title}</h2>
              <span className="text-olive font-bold">{course.fee}</span>
            </div>
            <Button 
              className="bg-olive hover:bg-olive/90"
              onClick={() => setIsBookingOpen(true)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-olive via-olive to-gold/80 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Link 
              to="/racademy" 
              className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Programs
            </Link>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full mb-4">
              <Star className="w-4 h-4 text-gold" />
              <span className="text-sm">{course.subtitle}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {course.title}
            </h1>
            
            <p className="text-lg text-white/80 mb-8 max-w-2xl">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gold" />
                <span>{course.batchSize}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                <span>Flexible Timings</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-olive hover:bg-white/90"
                onClick={() => setIsBookingOpen(true)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Book Now
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button size="lg" className="bg-white/10 border border-white/50 text-white hover:bg-white/20 hover:border-white/70 backdrop-blur-sm">
                <Phone className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Info Cards */}
      <section className="py-8 bg-secondary border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-olive">{course.fee}</p>
              <p className="text-sm text-muted-foreground">Course Fee</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{course.duration}</p>
              <p className="text-sm text-muted-foreground">Duration</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{course.batchSize}</p>
              <p className="text-sm text-muted-foreground">Batch Size</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">85%+</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Eligibility Criteria
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
            {course.eligibility.map((item, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 bg-olive/5 rounded-lg border border-olive/10"
              >
                <CheckCircle className="w-5 h-5 text-olive mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {course.highlights.map((highlight, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border"
              >
                <CheckCircle className="w-5 h-5 text-olive mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Syllabus */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-olive" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Course Syllabus
            </h2>
          </div>
          
          <div className="max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {course.syllabus.map((unit, unitIndex) => (
                <AccordionItem 
                  key={unitIndex} 
                  value={`unit-${unitIndex}`}
                  className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger className="text-left font-bold hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-olive text-white rounded-lg flex items-center justify-center text-sm font-bold">
                        {unitIndex + 1}
                      </span>
                      {unit.name}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ul className="space-y-2 ml-11">
                      {unit.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-olive mt-1">•</span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Batch Details */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Batch Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-olive/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-olive" />
                  </div>
                  <h3 className="font-bold text-foreground">Schedule</h3>
                </div>
                <p className="text-muted-foreground">{course.schedule}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-olive/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-olive" />
                  </div>
                  <h3 className="font-bold text-foreground">Faculty</h3>
                </div>
                <p className="text-muted-foreground">Col. Ramu Ranganathan (Retd) with 30+ years of military service and extensive experience in training defence aspirants.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              {course.faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`faq-${index}`}
                  className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact & CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary pb-32 md:pb-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-olive to-transparent rounded-full" />
        <div className="absolute top-12 right-12 w-32 h-32 bg-olive/5 rounded-full blur-3xl" />
        <div className="absolute bottom-12 left-12 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-olive/10 border border-olive/20 rounded-full mb-6">
              <Shield className="w-4 h-4 text-olive" />
              <span className="text-sm font-medium text-olive">Start Your Journey</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Begin Your Defence Journey?
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Join Colonel R's Academy and prepare to serve the nation with honour.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button 
                size="lg" 
                className="bg-olive text-white hover:bg-olive/90 shadow-lg shadow-olive/20 px-8"
                onClick={() => setIsBookingOpen(true)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Book Now
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button size="lg" variant="outline" className="border-olive/30 text-olive hover:bg-olive/5 px-8">
                <Phone className="w-4 h-4 mr-2" />
                7702770172
              </Button>
            </div>
            
            <a href="mailto:colonelrsacademy@gmail.com" className="inline-flex items-center gap-2 text-muted-foreground hover:text-olive transition-colors text-sm">
              <Mail className="w-4 h-4" />
              colonelrsacademy@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* Fixed Book Now Button - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-sm border-t border-border md:hidden z-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Course Fee</p>
              <p className="text-xl font-bold text-olive">{course.fee}</p>
            </div>
            <Button 
              size="lg" 
              className="bg-olive hover:bg-olive/90 flex-1 max-w-[200px]"
              onClick={() => setIsBookingOpen(true)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Book Now Button - Desktop (on scroll) */}
      {showFloatingButton && (
        <div className="fixed bottom-8 right-8 z-50 hidden md:block animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Button 
            size="lg" 
            className="bg-olive hover:bg-olive/90 shadow-lg shadow-olive/30"
            onClick={() => setIsBookingOpen(true)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Book Now - {course.fee}
          </Button>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        course={{
          id: slug || "",
          title: course.title,
          price: parseInt(course.fee.replace(/[₹,]/g, "")),
          institute: "racademy",
        }}
      />
    </RAcademyLayout>
  );
};

export default RAcademyCourseDetail;