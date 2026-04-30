import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Code2, Users, Rocket, MessageCircle, Loader2 } from "lucide-react";
import { personalInfo } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { portfolioService, localizeField } from "@/services/portfolioService";
import { useTranslation } from "react-i18next";
import { usePersonalInfo } from "@/hooks/usePortfolioData";
import { toArabicNumerals } from "@/lib/numerals";

export const About = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { data: info, loading } = usePersonalInfo();

  // Bilingual resolution with static fallback
  const raw = info || personalInfo;
  const displayName = localizeField(raw, "name", lang);
  const displayBio = toArabicNumerals(localizeField(raw, "bio", lang), lang);
  const displayRole = localizeField(raw, "role", lang);
  const displayLocation = toArabicNumerals(localizeField(raw, "location", lang), lang);
  const displayEmail = raw.email;
  const displayPhone = raw.phone;
  const displayProfileImage = raw.profileImage;

  const highlights = [
    {
      icon: Code2,
      title: t("about.highlights.cleanCode.title"),
      description: toArabicNumerals(t("about.highlights.cleanCode.desc"), lang),
    },
    {
      icon: Users,
      title: t("about.highlights.teamPlayer.title"),
      description: toArabicNumerals(t("about.highlights.teamPlayer.desc"), lang),
    },
    {
      icon: Rocket,
      title: t("about.highlights.fastLearner.title"),
      description: toArabicNumerals(t("about.highlights.fastLearner.desc"), lang),
    },
  ];

  if (loading && !info) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="section-container">
        <SectionHeading
          title={t("about.title")}
          subtitle={t("about.subtitle")}
        />

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square max-w-md mx-auto lg:mx-0 group"
            >
              <div className="absolute inset-0 bg-gradient-cyan-blue rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-2 border-primary/20 shadow-2xl">
                <img
                  src={displayProfileImage}
                  alt={displayName}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 object-top"
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold mb-6 text-foreground text-center lg:text-start">
                {t("about.hiIm")} <span className="gradient-text">{displayName}</span>
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-base text-start whitespace-pre-wrap">
                {displayBio}
              </p>

              <div className="grid md:grid-cols-2 grid-cols-1 flex-wrap lg:justify-start gap-4 mb-8">
                <div className="flex items-center gap-2 text-muted-foreground group">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{displayLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground group">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <a
                    href={`mailto:${displayEmail}`}
                    dir="ltr"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {displayEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground group">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <a
                    href={`tel:${(displayPhone || "").replace(/\s/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {toArabicNumerals(displayPhone, lang)}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground group">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <a
                    href={`https://wa.me/${(displayPhone || "").replace(/\+/g, "").replace(/\s/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {toArabicNumerals(displayPhone, lang)}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Highlights */}
          <div className="grid sm:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20, scale: 0.1 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl text-center hover:hover-card"
              >
                <item.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h4 className="font-semibold text-foreground text-lg mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
