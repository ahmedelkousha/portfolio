import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Loader2, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { usePortfolioData, usePortfolioMutation } from "@/hooks/usePortfolioData";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

interface Experience {
  id: string;
  role: string;
  role_en: string;
  role_ar: string;
  company: string;
  location: string;
  location_en: string;
  location_ar: string;
  period: string;
  description: string[];
  description_en: string[];
  description_ar: string[];
}

const ExperienceManager = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  const { data: experiences, loading } = usePortfolioData("experience");
  const { save, remove, isSaving } = usePortfolioMutation("experience");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({});
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setFormData({ ...exp });
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("admin.common.confirmDelete"))) return;
    try {
      await remove(id);
      toast.success(t("admin.common.deleted"));
    } catch (error: any) {
      toast.error(`${t("admin.common.deleteFailed")}: ${error.message || ""}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingId || Date.now().toString();
    try {
      await save({ id, data: { ...formData, id } });
      toast.success(t("admin.common.saved"));
      setEditingId(null);
      setIsAdding(false);
      setFormData({});
    } catch (error: any) {
      toast.error(`${t("admin.common.saveFailed")}: ${error.message || ""}`);
    }
  };

  const set = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  if (loading && !experiences.length) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  const inputCls = "w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base";
  const labelCls = "text-sm font-medium text-foreground mb-1 block";

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">{t("admin.experience.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">{t("admin.experience.subtitle")}</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); setFormData({ description_en: [], description_ar: [] }); }}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
          >
            <Plus size={20} />
            {t("admin.experience.addNew")}
          </button>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            style={{ overflow: "hidden" }}
            className="glass-card z-40 rounded-[2rem] md:rounded-3xl border-2 border-primary/20 mb-8"
          >
            <div className="p-5 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editingId ? <Edit2 size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
                {editingId ? t("admin.common.editExisting") : t("admin.common.addNew")}
              </h2>
              <button onClick={() => { setEditingId(null); setIsAdding(false); setFormData({}); }} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>{t("admin.common.roleEn")}</label>
                    <input type="text" value={formData.role_en || ""} onChange={(e) => set("role_en", e.target.value)} required className={inputCls} placeholder={t("admin.common.placeholders.roleEn")} />
                  </div>
                  <div dir="rtl">
                    <label className={labelCls}>{t("admin.common.roleAr")}</label>
                    <input type="text" value={formData.role_ar || ""} onChange={(e) => set("role_ar", e.target.value)} className={inputCls} placeholder={t("admin.common.placeholders.roleAr")} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>{t("admin.common.institutionEn")}</label>
                    <input type="text" value={formData.company || ""} onChange={(e) => set("company", e.target.value)} required className={inputCls} placeholder={t("admin.common.placeholders.company")} />
                  </div>
                  <div>
                    <label className={labelCls}>{t("admin.common.locationEn")}</label>
                    <input type="text" value={formData.location_en || ""} onChange={(e) => set("location_en", e.target.value)} className={inputCls} placeholder={t("admin.common.placeholders.locationEn")} />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>{t("admin.common.period")}</label>
                  <input type="text" value={formData.period || ""} onChange={(e) => set("period", e.target.value)} required className={inputCls} placeholder={t("admin.common.placeholders.period")} />
                </div>
                <div dir="rtl">
                  <label className={labelCls}>{t("admin.common.locationAr")}</label>
                  <input type="text" value={formData.location_ar || ""} onChange={(e) => set("location_ar", e.target.value)} className={inputCls} placeholder={t("admin.common.placeholders.locationAr")} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>{t("admin.common.descBulletEn")}</label>
                  <textarea
                    value={(formData.description_en || []).join("\n")}
                    onChange={(e) => set("description_en", e.target.value.split("\n"))}
                    className={`${inputCls} h-32`}
                    placeholder={t("admin.common.placeholders.descExpEn")}
                  />
                </div>
                <div dir="rtl">
                  <label className={labelCls}>{t("admin.common.descBulletAr")}</label>
                  <textarea
                    value={(formData.description_ar || []).join("\n")}
                    onChange={(e) => set("description_ar", e.target.value.split("\n"))}
                    className={`${inputCls} h-32`}
                    placeholder={t("admin.common.placeholders.descExpAr")}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setEditingId(null); setIsAdding(false); setFormData({}); }} className="px-6 py-3 rounded-xl font-bold hover:bg-muted transition-colors">{t("admin.common.cancel")}</button>
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {editingId ? t("admin.common.save") : t("admin.common.add")}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {experiences.map((exp: Experience) => (
          <div key={exp.id} className="glass-card p-6 rounded-3xl group border border-border/50 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0 h-fit">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold leading-tight">{exp[`role_${currentLang}`] || exp.role_en || exp.role}</h3>
                  <p className="text-primary font-medium text-sm md:text-base">{exp.company}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{exp.period} | {exp[`location_${currentLang}`] || exp.location_en || exp.location}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(exp)} className="p-2 hover:bg-primary/10 rounded-lg text-primary"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(exp.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 size={18} /></button>
              </div>
            </div>

            <div className="mt-4">
              {((exp as any)[`description_${currentLang}`] || exp.description_en || exp.description || []).length > 0 && (
                <ul className="space-y-1" dir={currentLang === "ar" ? "rtl" : "ltr"}>
                  {((exp as any)[`description_${currentLang}`] || exp.description_en || exp.description || []).map((line: string, i: number) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary shrink-0">•</span> {line}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceManager;
