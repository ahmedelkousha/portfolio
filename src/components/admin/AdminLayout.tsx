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
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    { name: "Projects", path: "/admin/projects", icon: Briefcase },
    { name: "Experience", path: "/admin/experience", icon: Briefcase },
    { name: "Education", path: "/admin/education", icon: GraduationCap },
    { name: "Testimonials", path: "/admin/testimonials", icon: Quote },
    { name: "Messages", path: "/admin/messages", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } border-r border-border/50 bg-muted/30 transition-all duration-300 flex flex-col fixed h-full z-50 md:sticky top-0`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="font-black text-xl gradient-text">Admin</span>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                  isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={20} className={isActive ? "" : "group-hover:text-primary"} />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                {isActive && isSidebarOpen && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
