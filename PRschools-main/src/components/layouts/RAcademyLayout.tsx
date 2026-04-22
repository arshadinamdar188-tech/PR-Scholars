import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  Info,
  ClipboardList,
  Image,
  Users,
  BookOpen,
  LogIn,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
} from "lucide-react";
import racademyLogo from "@/assets/racademy-logo.png";
import FloatingHomeButton from "@/components/FloatingHomeButton";
import FloatingContactButtons from "@/components/FloatingContactButtons";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/racademy", icon: Home },
  { label: "About Us", href: "/racademy/about", icon: Info },
  { label: "Eligibility Criteria", href: "/racademy/eligibility", icon: ClipboardList },
  { label: "Gallery", href: "/racademy/gallery", icon: Image },
  { label: "Our Mentors", href: "/racademy/mentors", icon: Users },
  {
    label: "Syllabus & Courses",
    icon: BookOpen,
    children: [
      { label: "NDA & NA Entrance Exam", href: "/racademy/courses/nda" },
      { label: "CDS/AFCAT/INET Entrance Exam", href: "/racademy/courses/cds" },
      { label: "SSB Interview Training", href: "/racademy/courses/ssb" },
    ],
  },
];

interface RAcademyLayoutProps {
  children: ReactNode;
}

const RAcademyLayout = ({ children }: RAcademyLayoutProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActiveRoute = (href?: string) => {
    if (!href) return false;
    // For home route, only match exactly
    if (href === "/racademy") {
      return location.pathname === "/racademy";
    }
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/racademy" className="flex items-center gap-3">
              <img src={racademyLogo} alt="Colonel R's Academy" className="h-10 w-auto" />
              <span className="font-display font-bold text-olive text-xl hidden sm:block">Colonel R's Academy</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={cn(
                        "px-3 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-1",
                        location.pathname.includes("/racademy/courses")
                          ? "bg-olive text-white"
                          : "text-muted-foreground hover:text-olive hover:bg-olive/10",
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("w-4 h-4 transition-transform", openDropdown === item.label && "rotate-180")}
                      />
                    </button>

                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-lg shadow-lg z-50 py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            onClick={() => setOpenDropdown(null)}
                            className={cn(
                              "block px-4 py-2.5 text-sm transition-colors",
                              isActiveRoute(child.href)
                                ? "bg-olive/10 text-olive font-medium"
                                : "text-foreground hover:bg-secondary",
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href!}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActiveRoute(item.href)
                        ? "bg-olive text-white"
                        : "text-muted-foreground hover:text-olive hover:bg-olive/10",
                    )}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex border-olive text-olive hover:bg-olive hover:text-white"
                asChild
              >
                <Link to="/racademy/auth?mode=student">
                  <LogIn className="w-4 h-4 mr-1" />
                  Student Login
                </Link>
              </Button>
              <Button size="sm" className="bg-olive hover:bg-olive/90" asChild>
                <Link to="/racademy/auth?mode=teacher">
                  <LogIn className="w-4 h-4 mr-1" />
                  Teacher Login
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
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label}>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-muted-foreground hover:text-olive hover:bg-olive/10"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </div>
                      <ChevronDown
                        className={cn("w-4 h-4 transition-transform", openDropdown === item.label && "rotate-180")}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setOpenDropdown(null);
                            }}
                            className={cn(
                              "block px-4 py-2 rounded-lg text-sm",
                              isActiveRoute(child.href)
                                ? "bg-olive text-white"
                                : "text-muted-foreground hover:text-olive hover:bg-olive/10",
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href!}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActiveRoute(item.href)
                        ? "bg-olive text-white"
                        : "text-muted-foreground hover:text-olive hover:bg-olive/10",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close dropdown */}
      {openDropdown && <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />}

      {/* Floating Home Button */}
      <FloatingHomeButton variant="racademy" />

      {/* Floating Contact Buttons */}
      {/* <FloatingContactButtons variant="racademy" phoneNumber="+916361474764" whatsappNumber="+916361474764" /> */}

      {/* Main Content */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-14">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <Link to="/racademy" className="flex items-center gap-3">
                <img src={racademyLogo} alt="Colonel R's Academy" className="h-12 w-auto" />
              </Link>
              <p className="text-background/60 text-sm leading-relaxed">Shaping Future Armed Forces Leaders</p>
              <p className="text-gold font-semibold text-sm tracking-wide">Duty • Honor • Country</p>
            </div>

            <div>
              <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-background/80">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/racademy" className="text-background/60 hover:text-gold text-sm transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/racademy/about" className="text-background/60 hover:text-gold text-sm transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/racademy/eligibility" className="text-background/60 hover:text-gold text-sm transition-colors">
                    Eligibility
                  </Link>
                </li>
                <li>
                  <Link to="/racademy/gallery" className="text-background/60 hover:text-gold text-sm transition-colors">
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-background/80">Courses</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/racademy/courses/nda" className="text-background/60 hover:text-gold transition-colors">
                    NDA & NA Entrance
                  </Link>
                </li>
                <li>
                  <Link to="/racademy/courses/cds" className="text-background/60 hover:text-gold transition-colors">
                    CDS/AFCAT/INET
                  </Link>
                </li>
                <li>
                  <Link to="/racademy/courses/ssb" className="text-background/60 hover:text-gold transition-colors">
                    SSB Interview Training
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-5 text-sm uppercase tracking-wider text-background/80">Contact Us</h4>
              <ul className="space-y-3 text-sm text-background/60">
                <li className="flex items-center gap-2.5 hover:text-gold transition-colors">
                  <Phone className="w-4 h-4" />
                  +91 6361474764
                </li>
                <li className="flex items-center gap-2.5 hover:text-gold transition-colors">
                  <Mail className="w-4 h-4" />
                  colonelrsacademy@gmail.com
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Dodabenahalli, Bengaluru, Karnataka-560067</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/40 text-sm">
              © {new Date().getFullYear()} Colonel R's Academy. Part of PRScholars.
            </p>
            <Link to="/" className="text-background/40 hover:text-gold text-sm transition-colors">
              ← Back to PRScholars
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RAcademyLayout;
