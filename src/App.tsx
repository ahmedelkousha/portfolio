import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

import { useEffect } from "react";
import { client } from "./lib/appwrite";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Ping Appwrite to verify setup
    client.ping().then(() => {
      console.log("Appwrite connection verified successfully!");
    }).catch((err) => {
      console.warn("Appwrite ping failed, but this might be expected if ping is not allowed:", err);
    });
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
              <Route path="/admin/projects" element={<AdminLayout><ProjectsManager /></AdminLayout>} />
              <Route path="/admin/testimonials" element={<AdminLayout><TestimonialsManager /></AdminLayout>} />
              <Route path="/admin/skills" element={<AdminLayout><SkillsManager /></AdminLayout>} />
              <Route path="/admin/experience" element={<AdminLayout><ExperienceManager /></AdminLayout>} />
              <Route path="/admin/education" element={<AdminLayout><EducationManager /></AdminLayout>} />
              <Route path="/admin/personal" element={<AdminLayout><PersonalInfoManager /></AdminLayout>} />
              <Route path="/admin/messages" element={<AdminLayout><MessagesManager /></AdminLayout>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
