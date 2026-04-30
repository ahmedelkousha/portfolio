import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { skills as staticSkills } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { Code, Server, Wrench, Loader2 } from "lucide-react";
import { portfolioService, localizeField } from "@/services/portfolioService";
import { usePortfolioDoc } from "@/hooks/usePortfolioData";

export const Skills = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { data: dbSkills, loading } = usePortfolioDoc("metadata", "skills");

  let skillCategories: any[] = [];

  if (dbSkills?.categories) {
    skillCategories = dbSkills.categories.map((cat: any) => ({
      ...cat,
      title: localizeField(cat, "title", lang) || cat.title_en || cat.title,
    }));
  } else {
    skillCategories = [
      { title: lang === "ar" ? "الواجهة الأمامية" : "Frontend", skills: staticSkills.frontend },
      { title: lang === "ar" ? "الخادم" : "Backend", skills: staticSkills.backend },
      { title: lang === "ar" ? "الأدوات" : "Tools & Others", skills: staticSkills.tools },
    ];
  }

  const getIcon = (title: string) => {
    if (!title) return Wrench;
    const tl = title.toLowerCase();
    if (tl.includes("frontend") || tl.includes("الواجهة")) return Code;
    if (tl.includes("backend") || tl.includes("الخادم")) return Server;
    return Wrench;
  };

  return (
    <section id="skills" className="py-20">
      <div className="section-container">
        <SectionHeading
          title={t("skills.title")}
          subtitle={t("skills.subtitle")}
        />

        {loading && !dbSkills && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category: any, categoryIndex: number) => {
            const Icon = getIcon(category.title);
            const skillsList = Array.isArray(category.skills) ? category.skills : [];

            return (
              <motion.div
                key={`${category.title}-${categoryIndex}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="glass-card p-6 rounded-2xl hover:hover-card"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-cyan-blue">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {skillsList.map((skill: any, skillIndex: number) => (
                    <motion.div
                      key={typeof skill === "string" ? skill : skill.name}
                      initial={{ opacity: 0, scale: 0.1 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="p-3 bg-muted/50 rounded-xl text-center border border-border/50 hover:border-primary/50 hover:bg-primary/5 cursor-default"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {typeof skill === "string" ? skill : (localizeField(skill, "name", lang) || skill.name)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
