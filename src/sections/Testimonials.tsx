import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "Aura Marketing SA",
    content:
      "Ahmed transformed our online presence completely. Our website now ranks on the first page for all our target keywords, and page load times improved by 60%. His expertise in both development and SEO is truly rare.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder & CEO",
    company: "Pure Touch US",
    content:
      "Working with Ahmed was a game-changer for our e-commerce platform. He optimized our site architecture, implemented structured data, and our organic traffic increased by 150% within 3 months. Highly recommended!",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "TechStart Solutions",
    content:
      "Ahmed's technical skills are exceptional. He built a complex dashboard application that exceeded our expectations. Clean code, excellent documentation, and delivered ahead of schedule.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Williams",
    role: "Operations Head",
    company: "Global Realty Partners",
    content:
      "The real estate platform Ahmed developed for us handles thousands of listings seamlessly. His attention to performance optimization and SEO best practices made a significant impact on our business.",
    rating: 5,
  },
];

const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="glass-card p-6 rounded-2xl hover-card relative group"
  >
    {/* Quote Icon */}
    <div className="absolute -top-3 -left-3 p-3 bg-gradient-cyan-blue rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
      <Quote className="h-5 w-5 text-primary-foreground" />
    </div>

    {/* Rating Stars */}
    <div className="flex gap-1 mb-4 mt-2">
      {Array.from({ length: testimonial.rating }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-amber-400 text-amber-400"
        />
      ))}
    </div>

    {/* Testimonial Content */}
    <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
      "{testimonial.content}"
    </p>

    {/* Client Info */}
    <div className="border-t border-border/50 pt-4">
      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
      <p className="text-sm text-primary">{testimonial.role}</p>
      <p className="text-xs text-muted-foreground">{testimonial.company}</p>
    </div>
  </motion.div>
);

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20">
      <div className="section-container">
        <SectionHeading
          title="Client Testimonials"
          subtitle="What clients say about working with me"
        />

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-6 md:gap-12"
        >
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">100%</div>
            <div className="text-sm text-muted-foreground">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">20+</div>
            <div className="text-sm text-muted-foreground">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">5.0</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
