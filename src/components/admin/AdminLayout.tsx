import { useAuth } from "@/context/AuthContext";
import { Navigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Code2,
  MessageSquare,
  Quote,
  GraduationCap,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  FolderGit
} from "lucide-react";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed for mobile

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" />;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const navItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Personal Info", path: "/admin/personal", icon: User },
    { name: "Skills", path: "/admin/skills", icon: Code2 },
    { name: "Projects", path: "/admin/projects", icon: FolderGit },
    { name: "Experience", path: "/admin/experience", icon: Briefcase },
    { name: "Education", path: "/admin/education", icon: GraduationCap },
    { name: "Testimonials", path: "/admin/testimonials", icon: Quote },
    { name: "Messages", path: "/admin/messages", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <span className="font-black text-xl gradient-text">Admin</span>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
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
          } border-r border-border/50 bg-muted/100 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 md:sticky md:h-screen`}
      >
        <div className={`p-6 flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
          {isSidebarOpen && (
            <span className="font-black text-xl gradient-text">Admin</span>
          )}
          
          {/* Mobile Close Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-muted rounded-lg transition-colors md:hidden"
          >
            <X size={20} />
          </button>

          {/* Desktop Toggle Button (Arrow) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 hover:bg-muted rounded-lg transition-colors hidden md:flex items-center justify-center ${!isSidebarOpen && "bg-primary/5 text-primary"}`}
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  } ${!isSidebarOpen && "justify-center"}`}
                title={!isSidebarOpen ? item.name : ""}
              >
                <Icon size={20} className={`${isActive ? "" : "group-hover:text-primary"} shrink-0`} />
                {isSidebarOpen && (
                  <>
                    <span className="font-medium whitespace-nowrap">{item.name}</span>
                    {isActive && <ChevronRight size={16} className="ml-auto" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors font-medium ${!isSidebarOpen && "justify-center"}`}
            title={!isSidebarOpen ? "Sign Out" : ""}
          >
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
