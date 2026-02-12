import { motion } from "framer-motion";
import { skills } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { Code, Server, Wrench } from "lucide-react";

export const Skills = () => {
  const skillCategories = [
    { title: "Frontend", icon: Code, skills: skills.frontend },
    { title: "Backend", icon: Server, skills: skills.backend },
    { title: "Tools & Others", icon: Wrench, skills: skills.tools },
  ];

  return (
    <section id="skills" className="py-20">
      <div className="section-container">
        <SectionHeading
          title="Skills & Expertise"
          subtitle="Technologies I work with to bring ideas to life"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
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
                  <category.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {category.title}
                </h3>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-2 gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
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
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Main Tech Stack
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["MongoDB", "Express", "React", "Node.js"].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="px-6 py-3 glass-card rounded-xl font-bold text-lg gradient-text"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
