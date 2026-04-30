import { useState, useEffect } from "react";
import { Save, Loader2, User, Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Globe } from "lucide-react";
import { toast } from "sonner";
import { usePersonalInfo, usePortfolioMutation } from "@/hooks/usePortfolioData";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const PersonalInfoManager = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  const { data: info, loading } = usePersonalInfo();
  const { save, isSaving } = usePortfolioMutation("metadata");
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (info) setFormData(info);
  }, [info]);

  const set = (field: string, value: string) =>
    setFormData((prev: any) => ({ ...prev, [field]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await save({ id: "personalInfo", data: formData });
      toast.success(t("admin.common.saved"));
    } catch {
      toast.error(t("admin.common.saveFailed"));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  const inputCls = "w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base";
  const labelCls = "text-sm font-medium text-foreground";

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">{t("admin.personalInfo.title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">{t("admin.personalInfo.subtitle")}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 md:space-y-8">

        {/* ── Name (not bilingual) ── */}
        <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6">
          {/* Name — bilingual */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={`${labelCls} flex items-center gap-2`}>
                <User size={16} className="text-primary" /> {t("admin.common.nameEn")}
              </label>
              <input
                type="text"
                value={formData.name_en || formData.name || ""}
                onChange={(e) => set("name_en", e.target.value)}
                required
                className={inputCls}
              />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className={`${labelCls} flex items-center gap-2`}>
                <User size={16} className="text-primary" /> {t("admin.common.nameAr")}
              </label>
              <input
                type="text"
                value={formData.name_ar || ""}
                onChange={(e) => set("name_ar", e.target.value)}
                className={inputCls}
                placeholder={t("admin.common.placeholders.nameAr")}
              />
            </div>
          </div>

          {/* Role — bilingual */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.common.roleEn")}</label>
              <input type="text" value={formData.role_en || ""} onChange={(e) => set("role_en", e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className={labelCls}>{t("admin.common.roleAr")}</label>
              <input type="text" value={formData.role_ar || ""} onChange={(e) => set("role_ar", e.target.value)} className={inputCls} placeholder={t("admin.common.placeholders.roleArPlace")} />
            </div>
          </div>

          {/* Tagline — bilingual */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.common.taglineEn")}</label>
              <input type="text" value={formData.tagline_en || ""} onChange={(e) => set("tagline_en", e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className={labelCls}>{t("admin.common.taglineAr")}</label>
              <input type="text" value={formData.tagline_ar || ""} onChange={(e) => set("tagline_ar", e.target.value)} className={inputCls} placeholder={t("admin.common.placeholders.taglineArPlace")} />
            </div>
          </div>

          {/* Bio — bilingual */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.common.bioEn")}</label>
              <textarea
                value={formData.bio_en || ""}
                onChange={(e) => set("bio_en", e.target.value)}
                rows={6}
                className={`${inputCls} leading-relaxed resize-none`}
              />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className={labelCls}>{t("admin.common.bioAr")}</label>
              <textarea
                value={formData.bio_ar || ""}
                onChange={(e) => set("bio_ar", e.target.value)}
                rows={6}
                placeholder={t("admin.common.placeholders.bioArPlace")}
                className={`${inputCls} leading-relaxed resize-none`}
              />
            </div>
          </div>
        </div>

        {/* ── Contact Details ── */}
        <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6">
          <h2 className="text-xl md:text-2xl font-bold border-b border-border pb-4">{t("admin.personalInfo.contactSection")}</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.common.email")}</label>
              <input type="email" value={formData.email || ""} onChange={(e) => set("email", e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.common.phone")}</label>
              <input type="text" value={formData.phone || ""} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.common.locationEn")}</label>
              <input type="text" value={formData.location_en || formData.location || ""} onChange={(e) => set("location_en", e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className={labelCls}>{t("admin.common.locationAr")}</label>
              <input type="text" value={formData.location_ar || ""} onChange={(e) => set("location_ar", e.target.value)} className={inputCls} placeholder={t("admin.common.placeholders.locationArPlace")} />
            </div>
          </div>
        </div>

        {/* ── Contact Section Content ── */}
        <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6">
          <h2 className="text-xl md:text-2xl font-bold border-b border-border pb-4">{t("admin.personalInfo.contactSectionContent")}</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.common.titleEn")}</label>
              <input type="text" value={formData.contact_title_en || ""} onChange={(e) => set("contact_title_en", e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className={labelCls}>{t("admin.common.titleAr")}</label>
              <input type="text" value={formData.contact_title_ar || ""} onChange={(e) => set("contact_title_ar", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.common.subtitleEn")}</label>
              <textarea value={formData.contact_subtitle_en || ""} onChange={(e) => set("contact_subtitle_en", e.target.value)} className={inputCls} rows={2} />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className={labelCls}>{t("admin.common.subtitleAr")}</label>
              <textarea value={formData.contact_subtitle_ar || ""} onChange={(e) => set("contact_subtitle_ar", e.target.value)} className={inputCls} rows={2} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 border-t border-border/50 pt-4 mt-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.common.infoBoxTitleEn")}</label>
              <input type="text" value={formData.contact_info_title_en || ""} onChange={(e) => set("contact_info_title_en", e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className={labelCls}>{t("admin.common.infoBoxTitleAr")}</label>
              <input type="text" value={formData.contact_info_title_ar || ""} onChange={(e) => set("contact_info_title_ar", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.common.infoBoxDescEn")}</label>
              <textarea value={formData.contact_info_desc_en || ""} onChange={(e) => set("contact_info_desc_en", e.target.value)} className={inputCls} rows={3} />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className={labelCls}>{t("admin.common.infoBoxDescAr")}</label>
              <textarea value={formData.contact_info_desc_ar || ""} onChange={(e) => set("contact_info_desc_ar", e.target.value)} className={inputCls} rows={3} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 border-t border-border/50 pt-6 mt-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.personalInfo.emailLabel")}</label>
              <div className="flex gap-2">
                <input type="text" value={formData.contact_email_label_en || ""} onChange={(e) => set("contact_email_label_en", e.target.value)} className={inputCls} placeholder="Email" />
                <input type="text" value={formData.contact_email_label_ar || ""} onChange={(e) => set("contact_email_label_ar", e.target.value)} className={inputCls} dir="rtl" placeholder="البريد" />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.personalInfo.phoneLabel")}</label>
              <div className="flex gap-2">
                <input type="text" value={formData.contact_phone_label_en || ""} onChange={(e) => set("contact_phone_label_en", e.target.value)} className={inputCls} placeholder="Phone" />
                <input type="text" value={formData.contact_phone_label_ar || ""} onChange={(e) => set("contact_phone_label_ar", e.target.value)} className={inputCls} dir="rtl" placeholder="الهاتف" />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.personalInfo.locationLabel")}</label>
              <div className="flex gap-2">
                <input type="text" value={formData.contact_location_label_en || ""} onChange={(e) => set("contact_location_label_en", e.target.value)} className={inputCls} placeholder="Location" />
                <input type="text" value={formData.contact_location_label_ar || ""} onChange={(e) => set("contact_location_label_ar", e.target.value)} className={inputCls} dir="rtl" placeholder="الموقع" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer & Socials ── */}
        <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6">
          <h2 className="text-xl md:text-2xl font-bold border-b border-border pb-4">{t("admin.personalInfo.footerSocials")}</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("admin.common.footerTaglineEn")}</label>
              <input type="text" value={formData.footer_tagline_en || ""} onChange={(e) => set("footer_tagline_en", e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className={labelCls}>{t("admin.common.footerTaglineAr")}</label>
              <input type="text" value={formData.footer_tagline_ar || ""} onChange={(e) => set("footer_tagline_ar", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-border/50 pt-4 mt-4">
            {[
              { label: "GitHub Profile", field: "github", icon: Github },
              { label: "LinkedIn Profile", field: "linkedin", icon: Linkedin },
              { label: "CV / Resume URL", field: "cvUrl", icon: ExternalLink },
              { label: "Profile Image URL", field: "profileImage", icon: User },
            ].map(({ label, field, icon: Icon }) => (
              <div key={field} className="space-y-2">
                <label className={`${labelCls} flex items-center gap-2`}>
                  <Icon size={16} /> {label}
                </label>
                <input
                  type="text"
                  value={formData[field] || ""}
                  onChange={(e) => set(field, e.target.value)}
                  className={`${inputCls} py-2`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 w-full md:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {t("admin.common.updating")}
              </>
            ) : (
              <>
                <Save size={20} />
                {t("admin.personalInfo.updateProfile")}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoManager;
