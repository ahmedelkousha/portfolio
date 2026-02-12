import { motion } from "framer-motion";
import { Settings, Gauge, Code, Zap, Network, Smartphone } from "lucide-react";
import { seoExpertise } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings,
  Gauge,
  Code,
  Zap,
  Network,
  Smartphone,
};

export const SEOExpertise = () => {
  return (
    <section id="seo-expertise" className="py-20 bg-muted/30">
      <div className="section-container">
        <SectionHeading
          title="SEO Expertise"
          subtitle="Technical SEO skills that drive organic growth and search visibility"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seoExpertise.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Settings;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-2xl hover-card group"
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-cyan-blue">
                    <IconComponent className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* SEO Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-3">
            {["Google Search Console", "Lighthouse", "PageSpeed Insights", "Screaming Frog", "Ahrefs", "SEMrush"].map((tool, index) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="px-4 py-2 text-sm font-medium glass-card rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
