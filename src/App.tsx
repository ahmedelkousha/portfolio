import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import TestimonialsManager from "./pages/admin/TestimonialsManager";
import ProjectsManager from "./pages/admin/ProjectsManager";
import SkillsManager from "./pages/admin/SkillsManager";
import ExperienceManager from "./pages/admin/ExperienceManager";
import EducationManager from "./pages/admin/EducationManager";
import PersonalInfoManager from "./pages/admin/PersonalInfoManager";
import MessagesManager from "./pages/admin/MessagesManager";
import SEOExpertiseManager from "./pages/admin/SEOExpertiseManager";
import HeroManager from "./pages/admin/HeroManager";
import { LangWrapper } from "./components/LangWrapper";
import { ThemeProvider } from "./context/ThemeContext";

import { useEffect } from "react";
import { client } from "./lib/appwrite";
import { CustomCursor } from "./components/CustomCursor";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    client.ping().then(() => {
      console.log("Appwrite connection verified successfully!");
    }).catch((err) => {
      console.warn("Appwrite ping failed:", err);
    });
  }, []);

  return (
    <>
      <CustomCursor />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Redirect root to /en */}
                  <Route path="/" element={<Navigate to="/en" replace />} />

                  {/* Legacy /login — redirect to /en/login */}
                  <Route path="/login" element={<Navigate to="/en/login" replace />} />

                  {/* Legacy /admin/* — redirect to /en/admin/* */}
                  <Route path="/admin" element={<Navigate to="/en/admin" replace />} />
                  <Route path="/admin/*" element={<Navigate to="/en/admin" replace />} />

                  {/* Language-prefixed routes */}
                  <Route path="/:lang" element={<LangWrapper />}>
                    {/* Portfolio */}
                    <Route index element={<Index />} />

                    {/* Login */}
                    <Route path="login" element={<Login />} />

                    {/* Admin */}
                    <Route path="admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
                    <Route path="admin/projects" element={<AdminLayout><ProjectsManager /></AdminLayout>} />
                    <Route path="admin/testimonials" element={<AdminLayout><TestimonialsManager /></AdminLayout>} />
                    <Route path="admin/skills" element={<AdminLayout><SkillsManager /></AdminLayout>} />
                    <Route path="admin/experience" element={<AdminLayout><ExperienceManager /></AdminLayout>} />
                    <Route path="admin/education" element={<AdminLayout><EducationManager /></AdminLayout>} />
                    <Route path="admin/personal" element={<AdminLayout><PersonalInfoManager /></AdminLayout>} />
                    <Route path="admin/messages" element={<AdminLayout><MessagesManager /></AdminLayout>} />
                    <Route path="admin/seo-expertise" element={<AdminLayout><SEOExpertiseManager /></AdminLayout>} />
                    <Route path="admin/hero" element={<AdminLayout><HeroManager /></AdminLayout>} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
