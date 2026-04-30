import { motion } from "framer-motion";
import { Github, Linkedin, Eye, Loader2 } from "lucide-react";
import { personalInfo, stats, openToRoles } from "@/data/portfolio";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useCountUp } from "@/hooks/useCountUp";
import { usePersonalInfo } from "@/hooks/usePortfolioData";
import { localizeField } from "@/services/portfolioService";
import { useTranslation } from "react-i18next";
import { toArabicNumerals } from "@/lib/numerals";

const StatCard = ({ stat, index, label, lang }: { stat: typeof stats[0]; index: number; label: string; lang: string }) => {
  const numericValue = parseInt(stat.value.replace(/\D/g, ""), 10) || 0;
  const suffix = stat.value.replace(/[0-9]/g, "");
  const { count, ref } = useCountUp(numericValue, 2000);

  return (
    <motion.div
      ref={ref}
      key={label}
      initial={{ scale: 0.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.2 }}
      className="glass-card p-4 rounded-xl hover:hover-card"
    >
      <div className="text-2xl md:text-3xl font-bold gradient-text" dir="ltr">
        {toArabicNumerals(count, lang)}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

export const Hero = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { data: info, loading } = usePersonalInfo();

  const dbRoles = info?.openToRoles || openToRoles;
  const roles = dbRoles.map((r: any) => localizeField(r, "name", lang) || r.name || r);
  
  const typedRole = useTypingEffect(roles, 100, 50, 2000);

  const scrollToProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  // Resolve bilingual fields — fallback to static data
  const raw = info || personalInfo;
  const displayName = localizeField(raw, "name", lang);
  const displayTagline = localizeField(raw, "tagline", lang);
  const displayGithub = raw.github;
  const displayLinkedin = raw.linkedin;
  const displayCvUrl = info?.cvUrl || personalInfo.cvUrl;

  const dbStats = info?.stats || stats;
  const displayStats = dbStats.map((s: any) => ({
    ...s,
    label: toArabicNumerals(localizeField(s, "label", lang) || s.label, lang)
  }));

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
      className="relative min-h-[100svh] flex items-center justify-center overflow-x-hidden"
    >
      <AnimatedBackground />

      <div className="section-container relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-primary font-mono text-sm md:text-base !text-center ${lang === "en" ? "mb-4" : ""}`}
          >
            {t("hero.greeting")}
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ opacity: { duration: 0.6, delay: 0.1 }, y: { duration: 0.6, delay: 0.1 } }}
            className={`text-4xl md:text-6xl lg:text-7xl font-bold ${lang === "en" ? "mb-4" : ""}`}
          >
            <span className="gradient-text gradient-text-animated py-3">{displayName}</span>
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
            {displayTagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1, 1.06, 1, 1] }}
              transition={{
                duration: 2,
                times: [0, 0.0625, 0.125, 0.1875, 0.25, 1],
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
                repeatDelay: 3,
              }}
            >
              <Button
                onClick={scrollToProjects}
                size="lg"
                className="bg-gradient-cyan-blue hover:opacity-90 text-primary-foreground font-semibold px-8 glow-mixed w-full"
              >
                {t("hero.viewWork")}
              </Button>
            </motion.div>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-gradient-cyan-blue font-semibold px-8"
              asChild
            >
              <a href={displayCvUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                {t("hero.viewResume")}
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
              href={displayGithub}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-card rounded-full hover:glow-cyan transition-all"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="h-5 w-5 text-foreground" />
            </motion.a>
            <motion.a
              href={displayLinkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-card rounded-full hover:glow-blue transition-all"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="h-5 w-5 text-foreground" />
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {displayStats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} label={stat.label} lang={lang} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
