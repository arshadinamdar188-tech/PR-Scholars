import PadmaLayout from "@/components/layouts/PadmaLayout";
import founderImg from "@/assets/founder-colonel.jpg";

const PadmaAbout = () => {
  return (
    <PadmaLayout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-padma-primary mb-8 text-center">
              About Padma Maths Pro
            </h1>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img src={founderImg} alt="Founder" className="w-full h-[400px] object-cover" />
              </div>
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-padma-primary">
                  Colonel Ramu Ranganathan (Retd)
                </h2>
                <p className="text-muted-foreground">MSc, MBA, BSc (Hons) Maths</p>
                <p className="text-gold font-semibold">Founder & Mentor</p>
                <p className="text-muted-foreground leading-relaxed">
                  Mathematics is the foundation for everything in this Universe. All Mathematics geniuses 
                  had great mentors in their lives. If taught the right way, it becomes the most lovable 
                  subject, else, it becomes a burden.
                </p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Riding a bicycle or swimming, once learnt, the skills stay with us for life. 
                Similarly, Mathematical concepts, once learnt the proper way, will stick with us for life. 
                With this as the underlying theme, Padma Maths Pro creates the interest in the students 
                towards Mathematics, which translates into excellent Academic and competitive exam results.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                Most importantly, the learning at Padma Maths Pro is driven by the passion of the founder 
                for Mathematics.
              </p>
            </div>

            <div className="mt-12 p-8 bg-padma-primary/5 rounded-2xl">
              <h3 className="font-display text-xl font-bold text-padma-primary mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
                <p><strong>Phone:</strong> +91 6361474764</p>
                <p><strong>Email:</strong> padmamathspro@gmail.com</p>
                <p><strong>Website:</strong> www.prscholars.com</p>
                <p><strong>Subjects:</strong> Mathematics (all classes), NDA & CDS Entrance Exams</p>
                <p className="md:col-span-2"><strong>Address:</strong> #127, Dodabenahalli, Bidarahalli Hobli, Bengaluru, Karnataka-560067</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PadmaLayout>
  );
};

export default PadmaAbout;
