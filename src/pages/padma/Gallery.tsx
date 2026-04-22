import { useEffect, useState } from "react";
import PadmaLayout from "@/components/layouts/PadmaLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  gallery_type: string;
}

const PadmaGallery = () => {
  const [foundersItems, setFoundersItems] = useState<GalleryItem[]>([]);
  const [achieversItems, setAchieversItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("institute", "padma")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching gallery:", error);
      } else if (data) {
        setFoundersItems(data.filter((item) => item.gallery_type === "founders"));
        setAchieversItems(data.filter((item) => item.gallery_type === "achievers"));
      }
      setLoading(false);
    };

    fetchGalleryItems();
  }, []);

  const GalleryGrid = ({ items, emptyMessage }: { items: GalleryItem[]; emptyMessage: string }) => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-padma-primary" />
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title || "Gallery image"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {(item.title || item.description) && (
              <div className="p-4">
                {item.title && (
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                )}
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <PadmaLayout>
      {/* Hero */}
      <section className="bg-gradient-to-r from-padma-primary to-padma-accent text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
            <Image className="w-4 h-4" />
            <span className="text-sm font-medium">Our Memories</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Moments of inspiration, dedication, and academic excellence at Padma Maths Pro
          </p>
        </div>
      </section>

      {/* Gallery Tabs */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="founders" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="founders">Founders' Gallery</TabsTrigger>
              <TabsTrigger value="achievers">Achievers' Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="founders">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Founders' Gallery</h2>
                <p className="text-muted-foreground">The journey of Padma Maths Pro</p>
              </div>
              <GalleryGrid items={foundersItems} emptyMessage="No images in Founders' Gallery yet" />
            </TabsContent>

            <TabsContent value="achievers">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Achievers' Gallery</h2>
                <p className="text-muted-foreground">Our proud students and their achievements</p>
              </div>
              <GalleryGrid items={achieversItems} emptyMessage="No images in Achievers' Gallery yet" />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Join Our Success Stories?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey to mathematical excellence with Padma Maths Pro
          </p>
          <Button size="lg" className="bg-padma-primary hover:bg-padma-primary/90" asChild>
            <Link to="/padma/courses">Explore Courses</Link>
          </Button>
        </div>
      </section>
    </PadmaLayout>
  );
};

export default PadmaGallery;
