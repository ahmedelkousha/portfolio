import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Code2, Users, Rocket } from "lucide-react";
import { personalInfo } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";

export const About = () => {
  const highlights = [
    {
      icon: Code2,
      title: "Clean Code",
      description: "Writing maintainable, scalable code following best practices",
    },
    {
      icon: Users,
      title: "Team Player",
      description: "Collaborative approach with clear communication",
    },
    {
      icon: Rocket,
      title: "Fast Learner",
      description: "Quick to adapt and master new technologies",
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="section-container">
        <SectionHeading
          title="About Me"
          subtitle="Get to know the developer behind the code"
        />

        <div className="max-w-4xl mx-auto">
          {/* Bio Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Hi, I'm <span className="gradient-text">{personalInfo.name}</span>
            </h3>
            
            <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              {personalInfo.bio}
            </p>

            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5 text-primary" />
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {personalInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-5 w-5 text-primary" />
                <a
                  href={`https://wa.me/${personalInfo.phone.replace(/\+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {personalInfo.phone}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Highlights */}
          <div className="grid sm:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl text-center hover-card"
              >
                <item.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h4 className="font-semibold text-foreground text-lg mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
