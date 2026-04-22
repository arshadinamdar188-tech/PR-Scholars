import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  Info,
  Image,
  Award,
  Users,
  BookOpen,
  LogIn,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import padmaLogo from "@/assets/padma-logo.png";
import FloatingHomeButton from "@/components/FloatingHomeButton";
import FloatingJoinButton from "@/components/FloatingJoinButton";
import FloatingContactButtons from "@/components/FloatingContactButtons";

const navItems = [
  { label: "Home", href: "/padma", icon: Home },
  { label: "About Us", href: "/padma/about", icon: Info },
  { label: "Gallery", href: "/padma/gallery", icon: Image },
  { label: "Our Mentors", href: "/padma/mentors", icon: Users },
  { label: "Courses", href: "/padma/courses", icon: BookOpen },
];

interface PadmaLayoutProps {
  children: ReactNode;
}

const PadmaLayout = ({ children }: PadmaLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedInTeacher, setLoggedInTeacher] = useState<string | null>(null);
  const [loggedInStudent, setLoggedInStudent] = useState<string | null>(null);

  useEffect(() => {
    setLoggedInTeacher(window.sessionStorage.getItem("padmaTeacherName"));
    setLoggedInStudent(window.sessionStorage.getItem("padmaStudentName"));
  }, [location.pathname]);

  const handleTeacherLogout = () => {
    window.sessionStorage.removeItem("padmaTeacherName");
    setLoggedInTeacher(null);
    navigate("/padma/auth?mode=teacher");
  };

  const handleStudentLogout = () => {
    window.sessionStorage.removeItem("padmaStudentName");
    setLoggedInStudent(null);
    navigate("/padma/auth?mode=student");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/padma" className="flex items-center gap-3">
              <img src={padmaLogo} alt="Padma Maths Pro" className="h-10 w-auto" />
              <span className="font-display font-bold text-royal-blue text-xl hidden sm:block">Padma Maths Pro</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    location.pathname === item.href
                      ? "bg-royal-blue text-white"
                      : "text-muted-foreground hover:text-royal-blue hover:bg-royal-blue/10",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2">
              {loggedInStudent ? (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm font-medium text-royal-blue border border-royal-blue rounded-md px-3 py-1">{loggedInStudent}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStudentLogout}
                    className="text-muted-foreground hover:text-destructive"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:inline-flex border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white"
                  asChild
                >
                  <Link to="/padma/auth?mode=student">
                    <LogIn className="w-4 h-4 mr-1" />
                    Student Login
                  </Link>
                </Button>
              )}
              {loggedInTeacher ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white bg-royal-blue rounded-md px-3 py-1">{loggedInTeacher}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleTeacherLogout}
                    className="text-muted-foreground hover:text-destructive"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button size="sm" className="bg-royal-blue hover:bg-royal-blue/90" asChild>
                  <Link to="/padma/auth?mode=teacher">
                    <LogIn className="w-4 h-4 mr-1" />
                    Teacher Login
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex border-amber-400 text-amber-600 hover:bg-amber-500 hover:text-white"
                asChild
              >
                <Link to="/padma/admin">
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  Admin
                </Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border py-4 animate-slide-down">
            <div className="container mx-auto px-4 space-y-1">
              <Link
                to="/padma/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-amber-700 hover:bg-amber-50"
              >
                <ShieldCheck className="w-5 h-5" />
                Admin
              </Link>

              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    location.pathname === item.href
                      ? "bg-royal-blue text-white"
                      : "text-muted-foreground hover:text-royal-blue hover:bg-royal-blue/10",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Floating Home Button */}
      <FloatingHomeButton variant="padma" />

      {/* Floating Join Now Button */}
      <FloatingJoinButton />

      {/* Floating Contact Buttons */}
      {/* <FloatingContactButtons variant="padma" phoneNumber="+916361474764" whatsappNumber="+916361474764" /> */}

      {/* Main Content */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="space-y-5">
              <Link to="/padma" className="flex items-center gap-3 group">
                <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                  <img src={padmaLogo} alt="Padma Maths Pro" className="h-10 w-auto" />
                </div>
                <span className="font-display font-bold text-xl text-white">Padma Maths Pro</span>
              </Link>
              <p className="text-slate-300 text-sm leading-relaxed">
                Master Mathematics from Basics to Finesse. Your journey to mathematical excellence starts here.
              </p>

              {/* Social Media */}
              <div className="pt-2">
                <h5 className="text-white font-semibold text-sm mb-3">Follow Us</h5>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.linkedin.com/in/padma-maths-pro-6264573a6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-700 transition-all duration-300 group"
                  >
                    <Linkedin className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                  </a>
                  <a
                    href="https://www.instagram.com/pmpro25?igsh=dGplcWx1a2t3amFy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-all duration-300 group"
                  >
                    <Instagram className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                  </a>
                  <a
                    href="https://x.com/PMPro_Maths"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-black transition-all duration-300 group"
                  >
                    <svg
                      className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/people/Padma-Maths-Pro/pfbid0YwoNmv5eEyqAxr6uwPaWjDab9GM9eYkJJmWVynkwDNW453B31LQncQuzGpVNC771l/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group"
                  >
                    <Facebook className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-5 text-lg">Quick Links</h4>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-slate-300 hover:text-royal-blue text-sm transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-royal-blue/50 group-hover:bg-royal-blue transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Courses */}
            <div>
              <h4 className="font-bold text-white mb-5 text-lg">Our Courses</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/padma/courses/9th-maths"
                    className="text-slate-300 hover:text-royal-blue text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors" />
                    Class 9 Maths
                  </Link>
                </li>
                <li>
                  <Link
                    to="/padma/courses/10th-maths"
                    className="text-slate-300 hover:text-royal-blue text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 group-hover:bg-purple-500 transition-colors" />
                    Class 10 Maths
                  </Link>
                </li>
                <li>
                  <Link
                    to="/padma/courses/11th-maths"
                    className="text-slate-300 hover:text-royal-blue text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors" />
                    Class 11 Maths
                  </Link>
                </li>
                <li>
                  <Link
                    to="/padma/courses/12th-maths"
                    className="text-slate-300 hover:text-royal-blue text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 group-hover:bg-amber-500 transition-colors" />
                    Class 12 Maths
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-5 text-lg">Contact Us</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="tel:+916361474764"
                    className="flex items-center gap-3 text-slate-300 hover:text-green-400 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <Phone className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm">+91 6361474764</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:padmamathspro@gmail.com"
                    className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <Mail className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm">padmamathspro@gmail.com</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-sm leading-relaxed">
                    Dodabanahalli, Bidarahalli Hobili,
                    <br />
                    Bengaluru, Karnataka-560115
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm text-center sm:text-left">
                © {new Date().getFullYear()} Padma Maths Pro. Part of{" "}
                <Link to="/" className="text-royal-blue hover:text-blue-400 font-medium transition-colors">
                  PRScholars
                </Link>
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Back to PRScholars
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PadmaLayout;
