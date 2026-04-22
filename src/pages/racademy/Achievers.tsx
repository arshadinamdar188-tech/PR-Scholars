import RAcademyLayout from "@/components/layouts/RAcademyLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

const RAcademyAchievers = () => (
  <RAcademyLayout>
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-olive mb-16 text-center">Achievers' Gallery</h1>
        <Card variant="racademy" className="p-12 text-center">
          <CardContent>
            <div className="w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-olive" />
            </div>
            <h2 className="font-display text-2xl font-bold text-olive mb-4">Coming Soon</h2>
            <p className="text-muted-foreground">Our achievers gallery is being updated with success stories of cadets who made it to the Armed Forces.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  </RAcademyLayout>
);

export default RAcademyAchievers;
