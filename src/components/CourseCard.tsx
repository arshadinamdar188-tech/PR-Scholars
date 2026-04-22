import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, ArrowRight, Percent, ShoppingCart } from "lucide-react";
import BookingModal from "@/components/BookingModal";

interface CourseCardProps {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  price: number;
  originalPrice?: number | null;
  duration?: string | null;
  batchSize?: number | null;
  thumbnailUrl?: string | null;
  mentorName?: string | null;
  isFeatured?: boolean;
  institute: "padma" | "racademy";
}

const CourseCard = ({
  id,
  slug,
  title,
  subtitle,
  description,
  price,
  originalPrice,
  duration,
  batchSize,
  thumbnailUrl,
  mentorName,
  isFeatured,
  institute,
}: CourseCardProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const basePath = institute === "padma" ? "/padma" : "/racademy";
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const primaryColor = institute === "padma" ? "royal-blue" : "olive";

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookingOpen(true);
  };

  return (
    <>
      <Card className="group overflow-hidden border-0 shadow-soft hover:shadow-2xl transition-all duration-500 h-full flex flex-col bg-card hover:-translate-y-2 relative">
        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
          institute === "padma" 
            ? "bg-gradient-to-br from-royal-blue/5 via-transparent to-accent/5" 
            : "bg-gradient-to-br from-olive/5 via-transparent to-gold/5"
        }`} />
        
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <div className="aspect-[16/10] bg-gradient-to-br from-muted to-secondary">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${institute === "padma" ? "from-royal-blue/20 via-royal-blue/10 to-accent/20" : "from-olive/20 via-olive/10 to-gold/20"} flex items-center justify-center`}>
                <span className="text-5xl font-bold text-muted-foreground/20">{title.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isFeatured && (
              <Badge className="bg-gold text-navy font-semibold shadow-lg backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1 animate-pulse" />
                Featured
              </Badge>
            )}
            {discount > 0 && institute === "padma" && (
              <Badge variant="destructive" className="font-semibold shadow-lg backdrop-blur-sm">
                <Percent className="w-3 h-3 mr-1" />
                {discount}% OFF
              </Badge>
            )}
          </div>

          {/* Quick Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <div className="flex gap-4 text-white text-sm">
              {duration && (
                <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Clock className="w-3.5 h-3.5" />
                  {duration}
                </span>
              )}
              {batchSize && (
                <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Users className="w-3.5 h-3.5" />
                  {batchSize} students
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 flex flex-col p-5 relative">
          {subtitle && (
            <span className={`text-xs font-semibold uppercase tracking-wider ${institute === "padma" ? "text-royal-blue" : "text-olive"} mb-2`}>
              {subtitle}
            </span>
          )}
          
          <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
              {description}
            </p>
          )}

          {mentorName && (
            <p className="text-xs text-muted-foreground mb-4">
              By <span className="font-medium text-foreground">{mentorName}</span>
            </p>
          )}

          {/* Price & CTA */}
          <div className="space-y-4 mt-auto pt-4 border-t border-border/50">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                ₹{price.toLocaleString("en-IN")}
              </span>
              {originalPrice && originalPrice > price && institute === "padma" && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                className={`flex-1 relative overflow-hidden group/btn ${institute === "padma" ? "bg-royal-blue hover:bg-royal-blue/90" : "bg-olive hover:bg-olive/90"}`}
                onClick={handleBookNow}
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <ShoppingCart className="w-4 h-4" />
                  Book Now
                </span>
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="group/view hover:border-accent/50"
                asChild
              >
                <Link to={`${basePath}/courses/${slug}`}>
                  View
                  <ArrowRight className="w-4 h-4 ml-1 group-hover/view:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Modal */}
      {id && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          course={{
            id,
            title,
            price,
            institute,
          }}
        />
      )}
    </>
  );
};

export default CourseCard;