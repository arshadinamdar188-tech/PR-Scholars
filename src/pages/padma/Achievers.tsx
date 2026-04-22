import PadmaLayout from "@/components/layouts/PadmaLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

const PadmaAchievers = () => {
  return (
    <PadmaLayout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-padma-primary mb-4">
              Achievers' Gallery
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Celebrating our students who have excelled in their academic journey
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card variant="padma" className="p-12 text-center">
              <CardContent>
                <div className="w-20 h-20 bg-padma-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-padma-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-padma-primary mb-4">
                  Coming Soon
                </h2>
                <p className="text-muted-foreground">
                  Our achievers gallery is being updated with the success stories of our students. 
                  Check back soon to see the remarkable achievements of Padma Maths Pro students!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PadmaLayout>
  );
};

export default PadmaAchievers;
