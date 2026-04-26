import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, MapPin, Loader2 } from "lucide-react";
import { experience as staticExperience } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export const Experience = () => {
  const { data: dbExperience, loading } = usePortfolioData("experience");
  const [activeIndex, setActiveIndex] = useState(0);

  const displayExperience = dbExperience.length > 0 ? dbExperience : staticExperience;
  const active = displayExperience[activeIndex];

  if (loading && dbExperience.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!active) return null;

  return (
    <section id="experience" className="py-20">
      <div className="section-container">
        <SectionHeading
          title="Work Experience"
          subtitle="My professional journey and career highlights"
        />

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Tab List */}
            <div className="flex md:flex-col gap-2 md:w-64 shrink-0 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {displayExperience.map((exp, index) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveIndex(index)}
                  className={`relative text-left px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap md:whitespace-normal ${activeIndex === index
                      ? "glass-card text-foreground glow-mixed"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                  {activeIndex === index && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 font-semibold text-sm">
                    {exp.company}
                  </span>
                  <span className="relative z-10 block text-xs mt-0.5 text-muted-foreground">
                    {exp.period}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-6 sm:p-8 rounded-2xl"
                >
                  {/* Header */}
                  <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-1">
                    {active.role}
                  </h3>
                  <p className="text-primary font-semibold text-base sm:text-lg mb-4">
                    {active.company}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 shrink-0" />
                      {active.period}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {active.location}
                    </span>
                  </div>

                  {/* Description */}
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {active.description.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2"
                      >
                        <span className="text-primary mt-0.5 shrink-0">▹</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
