import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, Clock, Globe } from "lucide-react";

const contactItems = [
  { icon: Phone, label: "Phone", value: "+91 6361474764", href: "tel:+916361474764" },
  { icon: Mail, label: "Email", value: "padmamathspro@gmail.com", href: "mailto:padmamathspro@gmail.com" },
  { icon: Globe, label: "Website", value: "www.prscholars.com", href: "https://www.prscholars.com" },
];

const ContactUs = () => (
  <div className="min-h-screen bg-background">
    {/* Hero */}
    <section className="relative bg-gradient-to-br from-[hsl(var(--navy))] via-[hsl(var(--navy-light))] to-[hsl(var(--royal-blue))] text-primary-foreground py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, hsl(var(--royal-blue-light)) 0%, transparent 50%)" }} />
      <div className="container mx-auto px-4 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
          Contact <span className="bg-gradient-to-r from-white to-[hsl(var(--royal-blue-light))] bg-clip-text text-transparent">Us</span>
        </h1>
        <p className="text-lg text-white/80 max-w-xl">We'd love to hear from you — reach out for course enquiries, admissions, or feedback.</p>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Cards */}
          <div className="space-y-6">
            {contactItems.map((item, i) => (
              <a key={i} href={item.href} target={item.icon === Globe ? "_blank" : undefined} rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-[hsl(var(--royal-blue)/0.3)] hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--royal-blue)/0.1)] to-[hsl(var(--navy)/0.05)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 text-[hsl(var(--royal-blue))]" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="text-muted-foreground">{item.value}</p>
                </div>
              </a>
            ))}

            {/* Address */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--royal-blue)/0.1)] to-[hsl(var(--navy)/0.05)] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[hsl(var(--royal-blue))]" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Address</p>
                <p className="text-muted-foreground">#127, Dodabenahalli, Bidarahalli Hobli,<br />Bengaluru, Karnataka-560067</p>
              </div>
            </div>
          </div>

          {/* Hours & Map */}
          <div className="space-y-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-secondary to-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-[hsl(var(--royal-blue))]" />
                <h3 className="font-display text-xl font-bold text-foreground">Operating Hours</h3>
              </div>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Monday – Saturday</span>
                  <span className="font-medium text-foreground">8:00 AM – 8:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Sunday</span>
                  <span className="font-medium text-foreground">9:00 AM – 1:00 PM</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
              <iframe
                title="PRScholars Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.5!2d77.7!3d13.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDodabenahalli%2C+Bengaluru!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default ContactUs;
