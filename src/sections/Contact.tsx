import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, Github, Linkedin, MessageCircle, Loader2 } from "lucide-react";
import { personalInfo } from "@/data/portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { portfolioService, localizeField } from "@/services/portfolioService";
import { useTranslation } from "react-i18next";
import { toArabicNumerals } from "@/lib/numerals";

export const Contact = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { toast } = useToast();
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await portfolioService.getPersonalInfo();
        if (data) setInfo(data);
      } catch (error) {
        console.error(t("admin.common.errors.fetchContact"), error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const displayInfo = { ...personalInfo, ...info };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || !email || !subject || !message) {
      toast({
        title: t("contact.errorTitle"),
        description: t("contact.errorDesc"),
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: t("contact.errorTitle"),
        description: t("contact.errorDesc"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Firebase
      await portfolioService.saveMessage({
        name,
        email,
        subject,
        message
      });

      toast({
        title: t("contact.successTitle"),
        description: t("contact.successDesc"),
      });

      // Clear form
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error(t("admin.common.errors.submitForm"), error);
      toast({
        title: t("contact.errorTitle"),
        description: error.message || t("contact.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: localizeField(displayInfo, "contact_email_label", lang) || t("footer.email"),
      value: displayInfo.email,
      href: `mailto:${displayInfo.email}`,
    },
    {
      icon: Phone,
      label: localizeField(displayInfo, "contact_phone_label", lang) || t("footer.phone"),
      value: toArabicNumerals(displayInfo.phone, lang),
      href: `tel:${(displayInfo.phone || "").replace(/\s/g, "")}`,
    },
    {
      icon: MapPin,
      label: localizeField(displayInfo, "contact_location_label", lang) || t("about.title"),
      value: localizeField(displayInfo, "location", lang),
      href: "#",
    },
  ];

  const socialLinks = [
    { icon: Github, href: displayInfo.github, label: "GitHub" },
    { icon: Linkedin, href: displayInfo.linkedin, label: "LinkedIn" },
    {
      icon: MessageCircle,
      href: `https://wa.me/${(displayInfo.phone || "").replace(/\+/g, "").replace(/\s/g, "")}`,
      label: "WhatsApp",
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
    <section id="contact" className="py-20">
      <div className="section-container">
        <SectionHeading
          title={toArabicNumerals(localizeField(displayInfo, "contact_title", lang) || t("contact.title"), lang)}
          subtitle={toArabicNumerals(localizeField(displayInfo, "contact_subtitle", lang) || t("contact.subtitle"), lang)}
        />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">
              {toArabicNumerals(localizeField(displayInfo, "contact_info_title", lang) || t("contact.infoTitle"), lang)}
            </h3>
            <p className="text-muted-foreground mb-8 text-start whitespace-pre-wrap">
              {toArabicNumerals(localizeField(displayInfo, "contact_info_desc", lang) || t("contact.infoDesc"), lang)}
            </p>

            {/* Contact Details */}
            <div className="space-y-4 mb-8">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 glass-card rounded-xl hover:hover-card group"
                >
                  <div className="p-3 rounded-lg bg-gradient-cyan-blue">
                    <item.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors" dir="ltr">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {t("contact.followSocial")}
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 glass-card rounded-xl hover:glow-cyan transition-all"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-primary" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form
              onSubmit={handleSubmit}
              className="glass-card p-8 rounded-2xl space-y-6 text-start"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("contact.name")}</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={t("contact.namePlaceholder")}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("contact.email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("contact.emailPlaceholder")}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">{t("contact.subject")}</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder={t("contact.subjectPlaceholder")}
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t("contact.message")}</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder={t("contact.messagePlaceholder")}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="bg-background/50 resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-cyan-blue hover:opacity-90 text-primary-foreground font-semibold glow-mixed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                    {t("contact.sending")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    {t("contact.send")}
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
