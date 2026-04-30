import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { navLinks, personalInfo } from "@/data/portfolio";
import { portfolioService, localizeField } from "@/services/portfolioService";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

export const Navbar = () => {
  const { theme } = useTheme();
  const [info, setInfo] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || i18n.language || "en";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const fetchInfo = async () => {
      try {
        const data = await portfolioService.getPersonalInfo();
        if (data) setInfo(data);
      } catch (error) {
        console.error("Error fetching navbar info:", error);
      }
    };
    fetchInfo();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayInfo = info || personalInfo;
  const displayName = info
    ? localizeField(info, "name", currentLang) || info.name || personalInfo.name
    : personalInfo.name;

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const switchLanguage = () => {
    const newLang = currentLang === "en" ? "ar" : "en";
    navigate(`/${newLang}`);
  };

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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "glass-card py-1 shadow-lg border-0"
          : "bg-transparent py-3"
        }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            className={`flex items-center gap-2`}
            whileHover={{ scale: 1.05 }}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
          >
            <img 
              src={theme === "dark" ? "/logo-white.png" : "/logo-black.png"} 
              alt="Logo" 
              className={`h-16 w-auto ${isScrolled && currentLang === "en" ? "rotate-[-90deg] transition-all duration-300" : "rotate-0 transition-all"} ${isScrolled && currentLang === "ar" ? "rotate-[90deg] transition-all duration-300" : "rotate-0 transition-all"}`}
            />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors link-underline"
                whileHover={{ y: -2 }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {navKeys[link.href] || link.name}
              </motion.a>
            ))}

            {/* Language Switcher */}
            <motion.button
              onClick={switchLanguage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-border/50 hover:border-primary/50"
              title="Switch language"
            >
              <Globe className="h-4 w-4" />
              {currentLang === "en" ? "العربية" : "English"}
            </motion.button>

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {/* Language Switcher Mobile */}
            <motion.button
              onClick={switchLanguage}
              whileTap={{ scale: 0.9 }}
              className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              {currentLang === "en" ? "ع" : "EN"}
            </motion.button>
            <ThemeToggle />
            <motion.button
              className="p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 glass-card rounded-xl p-4"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-foreground hover:text-primary transition-colors py-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                  >
                    {navKeys[link.href] || link.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
