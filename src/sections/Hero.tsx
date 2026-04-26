import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Briefcase, Eye, Loader2 } from "lucide-react";
import { personalInfo, stats, openToRoles } from "@/data/portfolio";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useCountUp } from "@/hooks/useCountUp";
import { useState, useEffect } from "react";
import { portfolioService } from "@/services/portfolioService";

const StatCard = ({ stat, index }: { stat: typeof stats[0]; index: number }) => {
  // Extract number from stat value (e.g., "3+" -> 3)
  const numericValue = parseInt(stat.value.replace(/\D/g, ""), 10) || 0;
  const suffix = stat.value.replace(/[0-9]/g, "");
  const { count, ref } = useCountUp(numericValue, 2000);

  return (
    <motion.div
      ref={ref}
      key={stat.label}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
      className="glass-card p-4 rounded-xl hover-card"
    >
      <div className="text-2xl md:text-3xl font-bold gradient-text">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{stat.label}</div>
    </motion.div>
  );
};

export const Hero = () => {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await portfolioService.getPersonalInfo();
        if (data) setInfo(data);
      } catch (error) {
        console.error("Error fetching hero info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const roles = [
    "Full-Stack MERN Developer",
    "React.js Developer",
    "Next.js Developer",
    "Web Performance Expert",
    "SEO Specialist",
  ];

  const typedRole = useTypingEffect(roles, 100, 50, 2000);

  const scrollToProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const displayInfo = info || personalInfo; // Fallback to static data

  if (loading && !info) {
    return (
      <section className="min-h-[100svh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      <AnimatedBackground />

      <div className="section-container relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-primary font-mono text-sm md:text-base mb-4"
          >
            Hello, I'm
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
          >
            <span className="gradient-text">{displayInfo.name}</span>
          </motion.h1>

          {/* Role with Typing Effect */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-6 h-10 md:h-12"
          >
            <span>{typedRole}</span>
            <span className="animate-pulse text-primary">|</span>
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8"
          >
            {displayInfo.tagline}
          </motion.p>

          {/* Open to Work Badge - Positioned after tagline */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col items-center gap-3 mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full border border-emerald-500/30 bg-emerald-500/5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Available for Opportunities</span>
              <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div> */}

            {/* Role Tags */}
            {/* <div className="flex flex-wrap justify-center gap-2">
              {openToRoles.map((role) => (
                <span
                  key={role}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground border border-border/50 hover:border-primary/50 transition-colors"
                >
                  {role}
                </span>
              ))}
            </div>
          </motion.div> */}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <Button
              onClick={scrollToProjects}
              size="lg"
              className="bg-gradient-cyan-blue hover:opacity-90 text-primary-foreground font-semibold px-8 glow-mixed"
            >
              View My Work
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-gradient-cyan-blue font-semibold px-8"
              asChild
            >
              <a href={displayInfo.cvUrl} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View Resume
              </a>
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center gap-4 mb-16"
          >
            <motion.a
              href={displayInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-card rounded-full hover:glow-cyan transition-all"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="h-5 w-5 text-foreground" />
            </motion.a>
            <motion.a
              href={displayInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-card rounded-full hover:glow-blue transition-all"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="h-5 w-5 text-foreground" />
            </motion.a>
          </motion.div>

          {/* Stats with Counting Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs font-mono">Scroll Down</span>
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </motion.div> */}
      </div>
    </section>
  );
};
