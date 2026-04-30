import { motion } from "framer-motion";
import { 
  Users, 
  Briefcase, 
  Code2, 
  MessageSquare, 
  Quote,
  ArrowUpRight,
  ExternalLink,
  Database,
  Loader2,
  FolderGit,
  Heading
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { migrateDataToFirebase } from "@/services/migration";
import { portfolioService } from "@/services/portfolioService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  const [migrating, setMigrating] = useState(false);
  const [stats, setStats] = useState([
    { label: t("admin.dashboard.totalProjects"), value: "-", icon: FolderGit, color: "bg-blue-500" },
    { label: t("admin.dashboard.totalSkills"), value: "-", icon: Code2, color: "bg-purple-500" },
    { label: t("admin.dashboard.testimonials"), value: "-", icon: Quote, color: "bg-emerald-500" },
    { label: t("admin.dashboard.clientMessages"), value: "-", icon: MessageSquare, color: "bg-red-500" },
  ]);
  const [personalInfo, setPersonalInfo] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [t]);

  const fetchDashboardData = async () => {
    try {
      const [projects, skillsData, testimonials, experience, info, messages] = await Promise.all([
        portfolioService.getAll("projects"),
        portfolioService.getDocData("metadata", "skills"),
        portfolioService.getAll("testimonials"),
        portfolioService.getAll("experience"),
        portfolioService.getPersonalInfo(),
        portfolioService.getAll("messages")
      ]);

      const skillCount = skillsData?.categories?.length || 0;
      setPersonalInfo(info);

      setStats([
        { label: t("admin.dashboard.totalProjects"), value: projects.length.toString(), icon: FolderGit, color: "bg-blue-500" },
        { label: t("admin.dashboard.totalSkills"), value: skillCount.toString(), icon: Code2, color: "bg-purple-500" },
        { label: t("admin.dashboard.testimonials"), value: testimonials.length.toString(), icon: Quote, color: "bg-emerald-500" },
        { label: t("admin.dashboard.clientMessages"), value: messages.length.toString(), icon: MessageSquare, color: "bg-red-500" },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const handleMigration = async () => {
    if (!window.confirm(t("admin.dashboard.migrationConfirm"))) return;
    setMigrating(true);
    try {
      const success = await migrateDataToFirebase();
      if (success) {
        toast.success(t("admin.dashboard.migrationSuccess"));
        fetchDashboardData(); // Refresh stats
      } else {
        toast.error(t("admin.dashboard.migrationFailed"));
      }
    } catch (error: any) {
      toast.error(`${t("admin.dashboard.migrationFailed")}: ${error.message || ""}`);
      console.error("Migration error:", error);
    } finally {
      setMigrating(false);
    }
  };

  const base = `/${currentLang}/admin`;

  return (
    <div className="space-y-6 md:space-y-10">
      <header>
        <h1 className="text-2xl md:text-4xl font-black text-foreground">
          {t("admin.dashboard.welcome")}, {personalInfo?.[`name_${currentLang}`] || personalInfo?.name?.split(" ")[0] || "Admin"}
        </h1>
        <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">{t("admin.dashboard.subtitle")}</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.07, 
              duration: 0.2,
              ease: "easeOut"
            }}
            className="glass-card p-4 md:p-6 rounded-[2rem] md:rounded-3xl group hover:border-primary/30"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-5 w-5 md:h-6 md:w-6 text-${stat.color.split("-")[1]}-500`} />
              </div>
              <span className="text-2xl md:text-3xl font-black text-foreground">{stat.value}</span>
            </div>
            <div className="mt-3 md:mt-4">
              <p className="text-muted-foreground text-sm md:text-base font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <section className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
            {t("admin.dashboard.quickActions")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {[
              { name: t("admin.dashboard.addProject"), path: `${base}/projects`, icon: FolderGit },
              { name: t("admin.dashboard.viewMessages"), path: `${base}/messages`, icon: MessageSquare },
              { name: t("admin.dashboard.updateProfile"), path: `${base}/personal`, icon: Users },
              { name: t("admin.nav.hero"), path: `${base}/hero`, icon: Heading },
              { name: t("admin.dashboard.viewLive"), path: `/${currentLang}`, icon: ExternalLink, external: true },
            ].map((action) => (
              action.external ? (
                <a
                  key={action.name}
                  href={action.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 md:p-4 bg-muted/50 rounded-xl md:rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <action.icon size={18} className="md:w-5 md:h-5" />
                    <span className="font-bold text-sm md:text-base">{action.name}</span>
                  </div>
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity md:w-[18px] md:h-[18px]" />
                </a>
              ) : (
                <Link
                  key={action.name}
                  to={action.path}
                  className="flex items-center justify-between p-3 md:p-4 bg-muted/50 rounded-xl md:rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <action.icon size={18} className="md:w-5 md:h-5" />
                    <span className="font-bold text-sm md:text-base">{action.name}</span>
                  </div>
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity md:w-[18px] md:h-[18px]" />
                </Link>
              )
            ))}
          </div>
        </section>

        <section className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-3xl flex flex-col justify-center items-center text-center space-y-4">
          <div className="h-14 w-14 md:h-16 md:w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Database className="text-primary h-7 w-7 md:h-8 md:w-8" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold">{t("admin.dashboard.initDb")}</h3>
            <p className="text-muted-foreground text-xs md:text-sm max-w-xs mt-1 mb-4">
              {t("admin.dashboard.initDbDesc")}
            </p>
            <button
              onClick={handleMigration}
              disabled={migrating}
              className="px-6 py-2.5 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl transition-all font-bold text-sm flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              {migrating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database size={16} />}
              {migrating ? t("admin.dashboard.migrating") : t("admin.dashboard.migrate")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
