import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Fallback banner images
import bannerClassroom from "@/assets/banner-classroom.jpg";
import bannerSuccess from "@/assets/banner-success.jpg";
import bannerBooks from "@/assets/banner-books.jpg";

interface Banner {
  id: string;
  title: string | null;
  media_url: string;
  media_type: string;
  link_url: string | null;
  display_order: number;
}

const fallbackBanners: Banner[] = [
  {
    id: "fallback-1",
    title: "Excellence in Education",
    media_url: bannerClassroom,
    media_type: "image",
    link_url: null,
    display_order: 0,
  },
  {
    id: "fallback-2",
    title: "Achieve Your Dreams",
    media_url: bannerSuccess,
    media_type: "image",
    link_url: null,
    display_order: 1,
  },
  {
    id: "fallback-3",
    title: "Master Mathematics",
    media_url: bannerBooks,
    media_type: "image",
    link_url: null,
    display_order: 2,
  },
];

const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      // Use database banners if any exist, otherwise use fallbacks
      if (!error && data && data.length > 0) {
        setBanners(data);
      } else {
        setBanners(fallbackBanners);
      }
      setLoading(false);
    };

    fetchBanners();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setProgress(0);
  }, [emblaApi]);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 100 / 60;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [loading, selectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  const handleImageError = (bannerId: string) => {
    setImageErrors((prev) => new Set([...prev, bannerId]));
  };

  const validBanners = banners.filter((b) => !imageErrors.has(b.id));
  const displayBanners = validBanners.length > 0 ? validBanners : fallbackBanners;

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-gradient-to-br from-background via-secondary to-background relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] overflow-hidden group bg-background">
      {/* Main Carousel */}
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full touch-pan-y">
          {displayBanners.map((banner, index) => (
            <div key={banner.id} className="flex-[0_0_100%] min-w-0 h-full relative">
              {banner.link_url ? (
                <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <BannerMedia
                    banner={banner}
                    isActive={index === selectedIndex}
                    onError={() => handleImageError(banner.id)}
                  />
                </a>
              ) : (
                <BannerMedia
                  banner={banner}
                  isActive={index === selectedIndex}
                  onError={() => handleImageError(banner.id)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {displayBanners.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/20 backdrop-blur-md border border-foreground/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background/40"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-foreground/80" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/20 backdrop-blur-md border border-foreground/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background/40"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-foreground/80" />
          </button>
        </>
      )}

      {/* Dot Navigation */}
      {displayBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/20 backdrop-blur-md border border-foreground/10">
            {displayBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className="relative"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === selectedIndex ? "bg-primary scale-125" : "bg-foreground/40 hover:bg-foreground/60",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface BannerMediaProps {
  banner: Banner;
  isActive: boolean;
  onError: () => void;
}

const BannerMedia = ({ banner, isActive, onError }: BannerMediaProps) => {
  const [loaded, setLoaded] = useState(false);

  if (banner.media_type === "video") {
    return (
      <div className="w-full h-full">
        <video
          src={banner.media_url}
          className={cn(
            "w-full h-full object-cover transition-transform duration-[2000ms] ease-out",
            isActive ? "scale-100" : "scale-110",
          )}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 bg-secondary">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      )}
      <img
        src={banner.media_url}
        alt={banner.title || "Banner"}
        className={cn(
          "w-full h-full object-cover transition-all duration-[2000ms] ease-out",
          loaded ? "opacity-100" : "opacity-0",
          isActive ? "scale-100" : "scale-110",
        )}
        onLoad={() => setLoaded(true)}
        onError={onError}
        loading="eager"
      />
    </div>
  );
};

export default BannerCarousel;
