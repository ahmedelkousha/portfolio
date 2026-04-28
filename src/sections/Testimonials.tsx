import { motion } from "framer-motion";
import { Quote, Star, Loader2 } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { testimonials as staticTestimonials } from "@/data/portfolio";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import * as React from "react";

const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: any;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group glass-card rounded-2xl overflow-hidden md:hover:hover-card h-full flex flex-col p-6 relative"
  >
    {/* Quote Icon */}
    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Quote size={40} className="text-primary" />
    </div>

    {/* Rating Stars */}
    <div className="flex gap-1 mb-4">
      {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-3 w-3 fill-amber-400 text-amber-400"
        />
      ))}
    </div>

    {/* Testimonial Content */}
    <div className="flex-grow">
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 italic">
        "{testimonial.content}"
      </p>
    </div>

    {/* Client Info */}
    <div className="border-t border-border/50 pt-4 mt-auto">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-cyan-blue p-[1px]">
          <div className="h-full w-full rounded-full bg-background flex items-center justify-center font-bold text-sm text-primary">
            {testimonial.name?.charAt(0)}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors leading-tight">
            {testimonial.name}
          </h4>
          <p className="text-xs text-primary font-medium">{testimonial.role} @ {testimonial.company}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

export const Testimonials = () => {
  const { data: dbTestimonials, loading } = usePortfolioData("testimonials");
  const isMobile = useIsMobile();
  const allTestimonials = dbTestimonials.length > 0 ? dbTestimonials : staticTestimonials;

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section id="testimonials" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="section-container">
        <SectionHeading
          title="Client Testimonials"
          subtitle="What visionary leaders say about our partnership and results"
        />

        {loading && dbTestimonials.length === 0 && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Dynamic Layout: Carousel on Mobile, Grid on Desktop (Matching Projects) */}
        {isMobile ? (
          <div className="mb-12">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {allTestimonials.map((testimonial, index) => (
                  <CarouselItem key={testimonial.id} className="pl-2 basis-[85%]">
                    <TestimonialCard testimonial={testimonial} index={index} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex flex-col items-center gap-6 mt-6">
                {/* Pagination Dots */}
                <div className="flex gap-2">
                  {Array.from({ length: count }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => api?.scrollTo(i)}
                      className={`h-1.5 transition-all duration-300 rounded-full ${
                        current === i ? "w-8 bg-primary" : "w-1.5 bg-primary/20"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-4">
                  <CarouselPrevious className="relative left-0 translate-y-0" />
                  <CarouselNext className="relative right-0 translate-y-0" />
                </div>
              </div>
            </Carousel>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTestimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-20 flex flex-wrap justify-center gap-12 md:gap-24 opacity-60">
          <div className="text-center">
            <div className="text-3xl font-black text-foreground">100%</div>
            <div className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-1">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-foreground">45+</div>
            <div className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-1">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-foreground">5.0</div>
            <div className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-1">Avg Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};
