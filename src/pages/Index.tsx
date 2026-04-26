import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Skills } from "@/sections/Skills";
import { Projects } from "@/sections/Projects";
import { Experience } from "@/sections/Experience";
import { Education } from "@/sections/Education";
import { Testimonials } from "@/sections/Testimonials";
import { Contact } from "@/sections/Contact";
import { SEOExpertise } from "@/sections/SEOExpertise";
import { SEO } from "@/components/SEO";

const Index = () => {
  useEffect(() => {
    // Initialize dark mode by default
    const stored = localStorage.getItem("portfolio-theme");
    if (!stored) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      document.documentElement.classList.add(stored);
    }
  }, []);

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <SEO />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <SEOExpertise />
        <Projects />
        <Testimonials />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
