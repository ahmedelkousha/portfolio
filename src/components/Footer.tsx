import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone, Heart, MessageCircle } from "lucide-react";
import { personalInfo, navLinks } from "@/data/portfolio";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: personalInfo.github, label: "GitHub" },
    { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
    { icon: MessageCircle, href: `https://wa.me/${personalInfo.phone.replace(/\+/g, "")}`, label: "WhatsApp" },
    { icon: Phone, href: `skype:${personalInfo.skype}?chat`, label: "Skype" },
  ];

  return (
    <footer className="py-12 border-t border-border bg-card/50">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <motion.h3
              className="text-2xl font-bold gradient-text mb-4"
              whileHover={{ scale: 1.02 }}
            >
              {personalInfo.name.split(" ")[0]}.
            </motion.h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              {personalInfo.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass-card rounded-lg hover:glow-cyan transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-primary" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
            © {currentYear} {personalInfo.name}. Made with
            <Heart className="h-4 w-4 text-primary animate-pulse" />
            using React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
