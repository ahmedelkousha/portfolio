import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success(t("admin.login.success"));
      navigate(`/${currentLang}/admin`);
    } catch (error: any) {
      toast.error(t("admin.login.error"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_50%)] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-3xl w-full max-w-md shadow-2xl mx-4"
      >
        <div className="text-center mb-8">
          <div className="h-14 w-14 md:h-16 md:w-16 bg-gradient-cyan-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <Lock className="text-primary-foreground h-7 w-7 md:h-8 md:w-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black gradient-text">{t("admin.login.title")}</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">{t("admin.login.subtitle")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground ml-1">{t("admin.login.email")}</label>
            <div className="relative group">
              <Mail className={`absolute ${currentLang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t("admin.login.emailPlaceholder")}
                className={`w-full bg-muted/50 border border-border/50 rounded-xl py-3 ${currentLang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground ml-1">{t("admin.login.password")}</label>
            <div className="relative group">
              <Lock className={`absolute ${currentLang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={`w-full bg-muted/50 border border-border/50 rounded-xl py-3 ${currentLang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (loading ? t("admin.login.signingIn") : t("admin.login.signIn"))}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
