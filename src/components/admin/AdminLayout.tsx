import { useAuth } from "@/context/AuthContext";
import { Navigate, Link, useLocation, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Code2,
  MessageSquare,
  Search,
  Quote,
  GraduationCap,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  FolderGit,
  Globe,
  Heading,
} from "lucide-react";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { ThemeToggle } from "../ThemeToggle";
import { motion } from "framer-motion";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (loading) return null;
  if (!currentUser) return <Navigate to={`/${currentLang}/login`} />;

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "messages"));
    let isFirstSnapshot = true;
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let count = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (!data.read && !data.archived) {
          count++;
        }
      });
      setUnreadMessages(count);

      if (isFirstSnapshot) {
        isFirstSnapshot = false;
        return;
      }
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // Play sound
          const audio = new Audio("/notification.wav");
          audio.play().catch(e => console.log("Audio play failed:", e));
          
          toast.info(t("admin.messages.newMessageReceived") || "New message received!", {
            icon: '🔔',
          });
        }
      });
    });
    
    return () => unsubscribe();
  }, [currentUser, t]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success(t("admin.common.logoutSuccess"));
      navigate(`/${currentLang}`);
    } catch {
      toast.error(t("admin.common.logoutError"));
    }
  };

  const switchLang = () => {
    const newLang = currentLang === "en" ? "ar" : "en";
    // Replace lang in current path
    const newPath = location.pathname.replace(`/${currentLang}/`, `/${newLang}/`);
    navigate(newPath);
  };

  const base = `/${currentLang}/admin`;

  const navItems = [
    { name: t("admin.nav.dashboard"), path: base, icon: LayoutDashboard },
    { name: t("admin.nav.personalInfo"), path: `${base}/personal`, icon: User },
    { name: t("admin.nav.hero"), path: `${base}/hero`, icon: Heading },
    { name: t("admin.nav.skills"), path: `${base}/skills`, icon: Code2 },
    { name: t("admin.nav.projects"), path: `${base}/projects`, icon: FolderGit },
    { name: t("admin.nav.experience"), path: `${base}/experience`, icon: Briefcase },
    { name: t("admin.nav.seoExpertise"), path: `${base}/seo-expertise`, icon: Search },
    { name: t("admin.nav.education"), path: `${base}/education`, icon: GraduationCap },
    { name: t("admin.nav.testimonials"), path: `${base}/testimonials`, icon: Quote },
    { name: t("admin.nav.messages"), path: `${base}/messages`, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative">
      <div className={`absolute top-10 ${lang === "ar" ? "left-10" : "right-10"} z-50 md:block hidden`}>
        <ThemeToggle />
      </div>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <span className="font-black text-xl gradient-text">
          {t("admin.common.adminPanel")}
        </span>

        <div className="flex flex-row items-center gap-2">
          <div className="top-4 right-4 z-50 md:hidden block">
            <ThemeToggle />
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>

        </div>

      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen
          ? "translate-x-0 w-64"
          : "-translate-x-full md:translate-x-0 md:w-20"
          } border-r border-border/50 bg-muted/100 transition-all duration-300 flex flex-col fixed inset-y-0 top-0 z-50 md:h-screen`}
      >
        <div className={`p-6 flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
          {isSidebarOpen && (
            <span className="font-black text-xl gradient-text text-nowrap">
              {t("admin.common.adminPanel")}
            </span>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-muted rounded-lg transition-colors md:hidden"
          >
            <X size={20} />
          </button>

          {/* Desktop Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 hover:bg-muted rounded-lg transition-all duration-300 hidden md:flex items-start justify-start ${!isSidebarOpen && "bg-primary/5 text-primary"}`}
          >
            {isSidebarOpen ? lang === "ar" ? <ChevronRight size={20} /> : <ChevronLeft size={20} /> : lang === "ar" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-2 overflow-y-auto overflow-x-hidden relative">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname === `${item.path}/`;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all group relative ${isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  } ${!isSidebarOpen && "justify-start"}`}
                title={!isSidebarOpen ? item.name : ""}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35
                    }}
                  />
                )}

                <div className="relative flex items-center justify-center shrink-0">
                  <Icon size={20} className={`${isActive ? "relative z-10" : "group-hover:text-primary"}`} />
                  {item.path.endsWith('/messages') && unreadMessages > 0 && (
                    <span className="absolute -top-2 -right-2 w-[1.2rem] h-[1.2rem] bg-destructive text-destructive-foreground text-[10px] font-normal flex items-center justify-center rounded-full z-20">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                </div>
                {isSidebarOpen && (
                  <>
                    <span className="font-medium text-sm whitespace-nowrap relative z-10">{item.name}</span>
                    {isActive && <ChevronRight size={16} className={`${lang === "ar" ? "rotate-180" : ""} ml-auto relative z-10`} />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-border/50 space-y-2">

          {/* Language switch */}
          <button
            onClick={switchLang}
            className={`flex items-center gap-3 w-full p-3 text-muted-foreground hover:bg-muted/80 rounded-xl transition-colors font-medium text-sm ${!isSidebarOpen && "justify-start"}`}
            title={!isSidebarOpen ? (currentLang === "en" ? t("admin.common.arabic") : t("admin.common.english")) : ""}
          >
            <Globe size={20} className="shrink-0" />
            {isSidebarOpen && (
              <span className="whitespace-nowrap font-medium">
                {currentLang === "en" ? t("admin.common.arabic") : t("admin.common.english")}
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors font-medium text-sm ${!isSidebarOpen && "justify-start"}`}
            title={!isSidebarOpen ? t("admin.nav.logout") : ""}
          >
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap font-medium">{t("admin.nav.logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 md:max-w-[40rem] lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
