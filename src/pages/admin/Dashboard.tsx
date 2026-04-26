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
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { migrateDataToFirebase } from "@/services/migration";
import { portfolioService } from "@/services/portfolioService";
import { toast } from "sonner";

const Dashboard = () => {
  const [migrating, setMigrating] = useState(false);
  const [stats, setStats] = useState([
    { label: "Total Projects", value: "-", icon: Briefcase, color: "bg-blue-500" },
    { label: "Skill Categories", value: "-", icon: Code2, color: "bg-purple-500" },
    { label: "Testimonials", value: "-", icon: MessageSquare, color: "bg-emerald-500" },
    { label: "Experience Items", value: "-", icon: Users, color: "bg-amber-500" },
  ]);
  const [personalInfo, setPersonalInfo] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
        { label: "Total Projects", value: projects.length.toString(), icon: Briefcase, color: "bg-blue-500" },
        { label: "Skill Categories", value: skillCount.toString(), icon: Code2, color: "bg-purple-500" },
        { label: "Testimonials", value: testimonials.length.toString(), icon: Quote, color: "bg-emerald-500" },
        { label: "Client Messages", value: messages.length.toString(), icon: MessageSquare, color: "bg-red-500" },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const handleMigration = async () => {
    if (!window.confirm("This will overwrite your current Firestore data with local static data. Continue?")) return;
    setMigrating(true);
    try {
      const success = await migrateDataToFirebase();
      if (success) {
        toast.success("Data migrated successfully!");
        fetchDashboardData(); // Refresh stats
      } else {
        toast.error("Migration failed.");
      }
    } catch (error: any) {
      toast.error(`Migration failed: ${error.message || "Unknown error"}`);
      console.error("Migration error:", error);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-foreground">
          Welcome back, {personalInfo?.name?.split(" ")[0] || "Admin"}
        </h1>
        <p className="text-muted-foreground mt-2">Here's an overview of your portfolio content</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 rounded-3xl group hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 text-${stat.color.split("-")[1]}-500`} />
              </div>
              <span className="text-3xl font-black text-foreground">{stat.value}</span>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass-card p-8 rounded-3xl space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Add New Project", path: "/admin/projects", icon: Briefcase },
              { name: "View Messages", path: "/admin/messages", icon: MessageSquare },
              { name: "Update Profile", path: "/admin/personal", icon: Users },
              { name: "View Live Site", path: "/", icon: ExternalLink, external: true },
            ].map((action) => (
              action.external ? (
                <a
                  key={action.name}
                  href={action.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <action.icon size={20} />
                    <span className="font-bold">{action.name}</span>
                  </div>
                  <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ) : (
                <Link
                  key={action.name}
                  to={action.path}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <action.icon size={20} />
                    <span className="font-bold">{action.name}</span>
                  </div>
                  <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              )
            ))}
          </div>
        </section>

        <section className="glass-card p-8 rounded-3xl flex flex-col justify-center items-center text-center space-y-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Database className="text-primary h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Initialize Database</h3>
            <p className="text-muted-foreground text-sm max-w-xs mt-1 mb-4">
              Push your local `portfolio.ts` data to Firebase Firestore to get started.
            </p>
            <button
              onClick={handleMigration}
              disabled={migrating}
              className="px-6 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl transition-all font-bold text-sm flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              {migrating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database size={16} />}
              {migrating ? "Migrating..." : "Migrate Local Data"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
