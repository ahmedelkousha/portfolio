import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Code2, Users, Rocket, MessageCircle, Loader2 } from "lucide-react";
import { personalInfo } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { useState, useEffect } from "react";
import { portfolioService } from "@/services/portfolioService";

export const About = () => {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await portfolioService.getPersonalInfo();
        if (data) setInfo(data);
      } catch (error) {
        console.error("Error fetching about info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const displayInfo = info || personalInfo;

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

  if (loading && !info) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="section-container">
        <SectionHeading
          title="About Me"
          subtitle="Get to know the developer behind the code"
        />

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative group max-w-sm mx-auto lg:mx-0">
                {/* Animated Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

                {/* Image Container */}
                <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted shadow-2xl">
                  <img
                    src={displayInfo.profileImage}
                    alt={displayInfo.name}
                    className="object-cover object-top w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Overlay Decoration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <p className="text-sm font-medium text-primary-foreground drop-shadow-md">
                      {displayInfo.role}
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10"></div>
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -z-10"></div>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold mb-6 text-foreground text-center lg:text-left">
                Hi, I'm <span className="gradient-text">{displayInfo.name}</span>
              </h3>

              <p className="text-muted-foreground mb-8 leading-relaxed text-base text-left">
                {displayInfo.bio}
              </p>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 grid-cols-1 flex-wrap lg:justify-start gap-4 mb-8">
                <div className="flex items-center gap-2 text-muted-foreground group">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{displayInfo.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground group">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <a
                    href={`mailto:${displayInfo.email}`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {displayInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground group">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <a
                    href={`tel:${displayInfo.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {displayInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground group">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <a
                    href={`https://wa.me/${(displayInfo.phone || "").replace(/\+/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {displayInfo.phone}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Highlights */}
          <div className="grid sm:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20, scale: 0.1 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay:index * 0.1 }}

                className="glass-card p-6 rounded-xl text-center hover:hover-card"
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
