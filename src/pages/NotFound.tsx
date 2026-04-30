import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-md w-full glass-card p-12 rounded-[2.5rem] border-primary/20 shadow-2xl shadow-primary/10"
      >
        <motion.h1 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mb-6 text-8xl font-black gradient-text tracking-tighter"
        >
          {t("notFound.title")}
        </motion.h1>
        
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          {t("notFound.subtitle")}
        </h2>
        
        <p className="mb-8 text-muted-foreground leading-relaxed">
          {t("notFound.description")}
        </p>
        
        <Button 
          asChild
          size="lg"
          className="bg-gradient-cyan-blue text-primary-foreground font-bold rounded-xl glow-cyan hover:opacity-90 transition-all px-8"
        >
          <Link to={`/${lang}`} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            {t("notFound.backHome")}
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
