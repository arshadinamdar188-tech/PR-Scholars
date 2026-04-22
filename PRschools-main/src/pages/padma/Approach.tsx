import PadmaLayout from "@/components/layouts/PadmaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, BookOpen, Clock, CheckCircle, Lightbulb, Users, BarChart, HelpCircle } from "lucide-react";

const approaches = [
  {
    icon: Target,
    title: "Setting Clear Goals",
    description: "Defining student specific goals to achieve the desired Academic or Entrance exam results."
  },
  {
    icon: BookOpen,
    title: "Strengthening the Foundation",
    description: "Strengthen the understanding of basic concepts before approaching more advanced topics."
  },
  {
    icon: Lightbulb,
    title: "Orientation",
    description: "Identify the topics of interest and get the student oriented to the Mathematical fun, ensuring students score 90+ in board exams."
  },
  {
    icon: CheckCircle,
    title: "Consistency",
    description: "Maintaining a healthy balance between daily dose of practice questions and student's commitment towards other subjects."
  },
  {
    icon: Target,
    title: "Focus on Concepts",
    description: "Emphasise on understanding the concepts and logic rather than rote learning."
  },
  {
    icon: Users,
    title: "Learning Tools",
    description: "Combination of audio-visual tools and books for better understanding."
  },
  {
    icon: Lightbulb,
    title: "Relevant Learning",
    description: "Correlating the mathematical concepts to understand how they apply to the real world around us."
  },
  {
    icon: HelpCircle,
    title: "24 X 7 Assistance",
    description: "Encouragement to ask questions anytime anywhere."
  },
  {
    icon: Clock,
    title: "Time Management",
    description: "Students will be mentored on time management to have a balanced approach to all subjects."
  },
  {
    icon: BarChart,
    title: "Review of Progress",
    description: "Periodic assessments to understand and track the progress to stay on track."
  }
];

const PadmaApproach = () => {
  return (
    <PadmaLayout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-padma-primary mb-4">
              The Approach at Padma Maths Pro
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our methodology is designed to make mathematics enjoyable while ensuring excellent results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approaches.map((approach, index) => (
              <Card key={index} variant="padma" className="hover:-translate-y-1 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-padma-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <approach.icon className="w-6 h-6 text-padma-primary" />
                  </div>
                  <CardTitle className="text-xl text-padma-primary">{approach.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{approach.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PadmaLayout>
  );
};

export default PadmaApproach;
