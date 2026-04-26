import { motion } from "framer-motion";
import { skills as staticSkills } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { Code, Server, Wrench, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { portfolioService } from "@/services/portfolioService";

export const Skills = () => {
  const [dbSkills, setDbSkills] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await portfolioService.getDocData("metadata", "skills");
        setDbSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Logic to determine which data to use
  let skillCategories: any[] = [];
  
  if (dbSkills) {
    if (dbSkills.categories) {
      skillCategories = dbSkills.categories;
    } else {
      skillCategories = Array.isArray(dbSkills) ? dbSkills : Object.values(dbSkills);
    }
  } else {
    skillCategories = [
      { title: "Frontend", skills: staticSkills.frontend },
      { title: "Backend", skills: staticSkills.backend },
      { title: "Tools & Others", skills: staticSkills.tools },
    ];
  }

  // Map icons to titles
  const getIcon = (title: string) => {
    if (!title) return Wrench;
    const t = title.toLowerCase();
    if (t.includes("frontend")) return Code;
    if (t.includes("backend")) return Server;
    return Wrench;
  };

  return (
    <section id="skills" className="py-20">
      <div className="section-container">
        <SectionHeading
          title="Web Development Expertise"
          subtitle="Technologies I work with to bring ideas to life"
        />

        {loading && !dbSkills && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category: any, categoryIndex: number) => {
            const Icon = getIcon(category.title);
            const skillsList = Array.isArray(category.skills) ? category.skills : [];
            
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="glass-card p-6 rounded-2xl hover-card"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-cyan-blue">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {category.title}
                  </h3>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {skillsList.map((skill: any, skillIndex: number) => (
                    <motion.div
                      key={typeof skill === "string" ? skill : skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="p-3 bg-muted/50 rounded-xl text-center border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {typeof skill === "string" ? skill : skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
