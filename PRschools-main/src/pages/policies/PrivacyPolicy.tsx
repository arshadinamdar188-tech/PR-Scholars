import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections = [
  { title: "1. Information We Collect", content: "We collect the following types of information:", list: ["Personal Information: Name, email, phone, and address provided during registration.", "Payment Information: Processed securely via Razorpay. We do not store card details.", "Usage Data: Browser type, IP address, pages visited, collected via cookies and analytics."] },
  { title: "2. How We Use Your Information", list: ["To process enrolments and deliver course content", "To communicate class updates, schedules, and results", "To process payments and issue receipts", "To improve our website and services", "To comply with legal obligations"] },
  { title: "3. Data Sharing", content: "We do not sell, rent, or trade your personal information. We may share data with:", list: ["Payment processors (Razorpay) for transaction processing", "Service providers who assist in operating our platform", "Legal authorities when required by law"] },
  { title: "4. Data Security", content: "We implement industry-standard security measures including encryption, secure servers, and access controls. However, no method of electronic transmission is 100% secure." },
  { title: "5. Cookies", content: "Our website uses cookies to enhance user experience and gather analytics. You may disable cookies in your browser settings, though this may affect site functionality." },
  { title: "6. Your Rights", list: ["Access, correct, or delete your personal data", "Opt out of promotional communications", "Request a copy of your data"], content: "To exercise these rights, email us at padmamathspro@gmail.com." },
  { title: "7. Changes to This Policy", content: "We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated date." },
  { title: "8. Contact", content: "For privacy-related concerns, contact us at +91 6361474764 or padmamathspro@gmail.com." },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <section className="relative bg-gradient-to-br from-[hsl(var(--navy))] via-[hsl(var(--navy-light))] to-[hsl(var(--royal-blue))] text-primary-foreground py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 60%, hsl(var(--royal-blue)) 0%, transparent 50%)" }} />
      <div className="container mx-auto px-4 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
          Privacy <span className="bg-gradient-to-r from-white to-[hsl(var(--royal-blue-light))] bg-clip-text text-transparent">Policy</span>
        </h1>
        <p className="text-white/60 text-sm">Last updated: February 2026</p>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        {sections.map((s, i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-[hsl(var(--royal-blue)/0.2)] transition-colors">
            <h2 className="font-display text-lg font-bold text-foreground mb-3">{s.title}</h2>
            {s.content && <p className="text-muted-foreground leading-relaxed mb-3">{s.content}</p>}
            {s.list && (
              <ul className="space-y-2 text-muted-foreground">
                {s.list.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--royal-blue))] mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default PrivacyPolicy;
