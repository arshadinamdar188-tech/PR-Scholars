import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections = [
  { title: "1. Acceptance of Terms", content: "By accessing and using the PRScholars website (www.prscholars.com) and enrolling in any course offered by Padma Maths Pro or Colonel R's Academy, you agree to be bound by these Terms & Conditions." },
  { title: "2. Services", content: "PRScholars provides online and offline coaching for Mathematics (Classes 6–12) and defence entrance examinations (NDA, CDS, SSB). Course content, schedules, and fees are subject to change with reasonable notice." },
  { title: "3. Registration & Accounts", list: ["You must provide accurate and complete information during registration.", "You are responsible for maintaining the confidentiality of your login credentials.", "One account per student. Sharing accounts is prohibited."] },
  { title: "4. Payment", content: "All fees are payable in Indian Rupees (INR). Payment is processed securely via our payment gateway. By making a payment you confirm you are authorised to use the payment method provided." },
  { title: "5. Intellectual Property", content: "All course materials, videos, documents, and content are the intellectual property of PRScholars. Reproduction, distribution, or sharing of materials without written consent is strictly prohibited." },
  { title: "6. Code of Conduct", list: ["Students must maintain respectful behaviour in all interactions.", "Any form of cheating, plagiarism, or misconduct may result in expulsion without refund.", "Disruptive behaviour during online or offline sessions is not tolerated."] },
  { title: "7. Limitation of Liability", content: "PRScholars shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid by you for the specific course in question." },
  { title: "8. Governing Law", content: "These terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka." },
  { title: "9. Contact", content: "For questions about these terms, contact us at padmamathspro@gmail.com." },
];

const TermsAndConditions = () => (
  <div className="min-h-screen bg-background">
    <section className="relative bg-gradient-to-br from-[hsl(var(--navy))] via-[hsl(var(--navy-light))] to-[hsl(var(--royal-blue))] text-primary-foreground py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 60% 40%, hsl(var(--royal-blue-light)) 0%, transparent 50%)" }} />
      <div className="container mx-auto px-4 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
          Terms & <span className="bg-gradient-to-r from-white to-[hsl(var(--royal-blue-light))] bg-clip-text text-transparent">Conditions</span>
        </h1>
        <p className="text-white/60 text-sm">Last updated: February 2026</p>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        {sections.map((s, i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-[hsl(var(--royal-blue)/0.2)] transition-colors">
            <h2 className="font-display text-lg font-bold text-foreground mb-3">{s.title}</h2>
            {s.content && <p className="text-muted-foreground leading-relaxed">{s.content}</p>}
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

export default TermsAndConditions;
