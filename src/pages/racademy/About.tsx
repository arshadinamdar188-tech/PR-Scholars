import RAcademyLayout from "@/components/layouts/RAcademyLayout";
import founderImg from "@/assets/founder-colonel.jpg";

const RAcademyAbout = () => (
  <RAcademyLayout>
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-olive mb-8 text-center">About Us</h1>
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src={founderImg} alt="Founder" className="w-full h-[400px] object-cover" />
          </div>
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-olive">Colonel Ramu Ranganathan (Retd)</h2>
            <p className="text-muted-foreground">Psychologist | Founder & Mentor</p>
            <p className="text-muted-foreground leading-relaxed">
              At Colonel R's Academy, we are committed to shaping the next generation of Armed Forces leaders. Founded by Colonel Ramu Ranganathan (Retired), our Academy offers top-tier training for written exams and SSB interview across Army, Navy and Air Force entries.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With a focus on discipline, excellence and national service, we empower aspiring candidates to pursue their dreams with confidence and integrity. Join us to embark on a transformative journey guided by the values of Duty, Honor and Country.
            </p>
          </div>
        </div>
      </div>
    </section>
  </RAcademyLayout>
);

export default RAcademyAbout;
