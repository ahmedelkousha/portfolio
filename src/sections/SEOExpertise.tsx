import { motion } from "framer-motion";
import { Settings, Gauge, Code, Zap, Network, Smartphone, Loader2 } from "lucide-react";
import { seoExpertise as staticSeoExpertise } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { localizeField } from "@/services/portfolioService";
import { useTranslation } from "react-i18next";
import { toArabicNumerals } from "@/lib/numerals";
import React from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings,
  Gauge,
  Code,
  Zap,
  Network,
  Smartphone,
};

export const SEOExpertise = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { data: dbSeo, loading } = usePortfolioData("seoExpertise");

  const rawList = dbSeo.length > 0 ? dbSeo : staticSeoExpertise;

  const displaySeo = rawList.map((item: any) => ({
    ...item,
    title: toArabicNumerals(localizeField(item, "title", lang), lang),
    description: toArabicNumerals(localizeField(item, "description", lang), lang),
  }));

  const seoTools = [
    { en: "Google Search Console", ar: "جوجل سيرش كونسول" },
    { en: "Lighthouse", ar: "لايت هاوس" },
    { en: "PageSpeed Insights", ar: "بيج سبيد إنسايتس" },
    { en: "Screaming Frog", ar: "سكريمنج فروج" },
    { en: "Ahrefs", ar: "أهريفس" },
    { en: "SEMrush", ar: "سيمرش" },
  ];

  const displayTools = seoTools.map(t => lang === "ar" ? t.ar : t.en);

  return (
    <section id="seo-expertise" className="py-20 bg-muted/30">
      <div className="section-container">
        <SectionHeading
          title={t("seo.title")}
          subtitle={t("seo.subtitle")}
        />

        {loading && dbSeo.length === 0 && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySeo.map((item: any, index: number) => {
            const IconComponent = iconMap[item.icon] || Settings;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30, scale: 0.1 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-2xl hover:hover-card group"
              >
                <div className="mb-4">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-cyan-blue">
                    <IconComponent className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* SEO Tools Tags */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-3">
            {displayTools.map((tool, index) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="px-4 py-2 text-sm font-medium glass-card rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};