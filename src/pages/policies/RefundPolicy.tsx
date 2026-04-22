import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections = [
  { title: "1. Refund Eligibility", content: "A full refund may be requested within 7 days of the date of purchase, provided that no more than one class/session has been attended." },
  { title: "2. Partial Refunds", content: "If a student has attended more than one session but requests cancellation within 15 days of enrolment, a pro-rata refund (minus a 10% processing fee) may be issued at the sole discretion of PRScholars management." },
  { title: "3. Non-Refundable Items", list: ["Registration or admission fees", "Study materials already dispatched or downloaded", "Mock test fees once the test has been attempted", "Courses purchased during promotional/discounted offers, unless stated otherwise"] },
  { title: "4. Cancellation by PRScholars", content: "PRScholars reserves the right to cancel a course or batch due to insufficient enrolments or unforeseen circumstances. In such cases, enrolled students will receive a full refund within 7–10 business days." },
  { title: "5. How to Request a Refund", content: "Send an email to padmamathspro@gmail.com with your order number, registered name, and reason for cancellation. Refunds are processed within 7–10 business days to the original payment method." },
  { title: "6. Contact", content: "For any refund-related queries, reach out at +91 6361474764 or email us at padmamathspro@gmail.com." },
];

const RefundPolicy = () => (
  <div className="min-h-screen bg-background">
    <section className="relative bg-gradient-to-br from-[hsl(var(--navy))] via-[hsl(var(--navy-light))] to-[hsl(var(--royal-blue))] text-primary-foreground py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 70%, hsl(var(--royal-blue)) 0%, transparent 50%)" }} />
      <div className="container mx-auto px-4 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
          Refund & <span className="bg-gradient-to-r from-white to-[hsl(var(--royal-blue-light))] bg-clip-text text-transparent">Cancellation</span>
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

export default RefundPolicy;
