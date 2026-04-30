import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone, MessageCircle } from "lucide-react";
import { personalInfo, navLinks } from "@/data/portfolio";
import { useTranslation } from "react-i18next";
import { portfolioService, localizeField } from "@/services/portfolioService";
import { useState, useEffect } from "react";
import { toArabicNumerals } from "@/lib/numerals";
import { useTheme } from "@/hooks/useTheme";

export const Footer = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const currentYear = new Date().getFullYear();
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    portfolioService.getPersonalInfo().then((data) => { if (data) setInfo(data); }).catch(() => {});
  }, []);

  const raw = info || personalInfo;
  const displayName = localizeField(raw, "name", lang);
  const displayTagline = localizeField(raw, "footer_tagline", lang) || localizeField(raw, "tagline", lang);
  const github = raw.github;
  const linkedin = raw.linkedin;
  const email = raw.email;
  const phone = (raw.phone || "").replace(/\+/g, "");
  const skype = raw.skype;

  const socialLinks = [
    { icon: Github, href: github, label: "GitHub" },
    { icon: Linkedin, href: linkedin, label: "LinkedIn" },
    { icon: Mail, href: `mailto:${email}`, label: "Email" },
    { icon: MessageCircle, href: `https://wa.me/${phone}`, label: "WhatsApp" },
    { icon: Phone, href: `skype:${skype}?chat`, label: "Skype" },
  ];

  const navKeys: Record<string, string> = {
    "#home": t("nav.home"),
    "#about": t("nav.about"),
    "#skills": t("nav.skills"),
    "#experience": t("nav.experience"),
    "#projects": t("nav.projects"),
    "#testimonials": t("nav.testimonials"),
    "#contact": t("nav.contact"),
  };

  return (
    <footer className="py-12 border-t border-border bg-card/50">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <motion.div
              className="mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src={theme === "dark" ? "/logo-white.png" : "/logo-black.png"} 
                alt="Logo" 
                className="h-8 w-auto"
              />
            </motion.div>
            <p className="text-muted-foreground text-sm max-w-xs">
              {displayTagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {t("nav.quickLinks")}
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {navKeys[link.href] || link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {t("footer.connect")}
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass-card rounded-lg hover:glow-cyan transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-primary" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
            © <span dir="ltr">{toArabicNumerals(currentYear, lang)}</span> {displayName}.
          </p>
        </div>
      </div>
    </footer>
  );
};
