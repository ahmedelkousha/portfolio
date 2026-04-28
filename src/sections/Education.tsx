import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Loader2 } from "lucide-react";
import { education as staticEducation } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export const Education = () => {
  const { data: dbEducation, loading } = usePortfolioData("education");
  const displayEducation = dbEducation.length > 0 ? dbEducation : staticEducation;

  if (loading && dbEducation.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="section-container">
        <SectionHeading
          title="Education"
          subtitle="My academic background and qualifications"
        />

        <div className="max-w-2xl mx-auto">
          {displayEducation.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl hover:hover-card mb-6"
            >
              {/* Icon */}
              <div className="flex items-start gap-6">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="p-4 rounded-2xl bg-gradient-cyan-blue shrink-0"
                >
                  <GraduationCap className="h-8 w-8 text-primary-foreground" />
                </motion.div>

                <div className="flex-1">
                  {/* Degree */}
                  <h3 className="sm:text-xl text-lg font-bold text-foreground mb-2">
                    {edu.degree}
                  </h3>

                  {/* Institution */}
                  <p className="sm:text-lg text-base text-primary font-semibold mb-3">
                    {edu.institution}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {edu.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {edu.location}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {edu.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
