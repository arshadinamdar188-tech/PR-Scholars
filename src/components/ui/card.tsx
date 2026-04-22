import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-2xl border bg-card text-card-foreground transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "shadow-soft hover:shadow-soft-xl hover:-translate-y-1",
        glass: "bg-white/70 backdrop-blur-xl border-white/30 shadow-xl hover:bg-white/80",
        elevated: "shadow-xl hover:shadow-2xl hover:-translate-y-2 border-transparent",
        navy: "bg-navy text-white border-navy-light hover:bg-navy-light",
        gold: "bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20 hover:border-gold/40",
        padma: "bg-gradient-to-br from-royal-blue/5 via-transparent to-accent/5 border-royal-blue/10 hover:border-royal-blue/30 hover:shadow-blue",
        racademy: "bg-gradient-to-br from-olive/5 via-transparent to-gold/5 border-olive/10 hover:border-olive/30 hover:shadow-olive",
        outline: "bg-transparent border-2 hover:bg-muted/50",
        interactive: "shadow-soft hover:shadow-2xl hover:-translate-y-3 cursor-pointer border-transparent hover:border-accent/20",
        feature: "bg-card border-border/50 hover:shadow-xl hover:-translate-y-1 hover:border-accent/20 relative overflow-hidden group",
        modern: "bg-card/80 backdrop-blur-sm border-border/30 hover:border-border shadow-soft hover:shadow-xl hover:-translate-y-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-xl font-display font-bold leading-tight tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };