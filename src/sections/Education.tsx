import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import { education } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";

export const Education = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="section-container">
        <SectionHeading
          title="Education"
          subtitle="My academic background and qualifications"
        />

        <div className="max-w-2xl mx-auto">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl hover-card"
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
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {edu.degree}
                  </h3>

                  {/* Institution */}
                  <p className="text-lg text-primary font-semibold mb-3">
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
