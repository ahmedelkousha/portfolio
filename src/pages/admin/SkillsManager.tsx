import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Loader2, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { usePortfolioDoc, usePortfolioMutation } from "@/hooks/usePortfolioData";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const SkillsManager = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  const { data: skillsDoc, loading } = usePortfolioDoc("metadata", "skills");
  const { save, isSaving } = usePortfolioMutation("metadata");
  const [categories, setCategories] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (skillsDoc) {
      if (skillsDoc.categories) {
        setCategories(skillsDoc.categories);
      } else {
        setCategories(Array.isArray(skillsDoc) ? skillsDoc : Object.values(skillsDoc));
      }
    }
  }, [skillsDoc]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let newCategories = [...categories];

    const processedData = {
      ...formData,
      skills: typeof formData.skills === 'string'
        ? formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
        : formData.skills
    };

    if (editingIndex !== null) {
      newCategories[editingIndex] = processedData;
    } else {
      newCategories.push(processedData);
    }

    try {
      await save({ id: "skills", data: { categories: newCategories } });
      toast.success(t("admin.common.saved"));
      setEditingIndex(null);
      setIsAdding(false);
      setFormData({});
    } catch (error) {
      toast.error(t("admin.common.saveFailed"));
    }
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm(t("admin.common.confirmDelete"))) return;
    const newCategories = categories.filter((_, i) => i !== index);
    try {
      await save({ id: "skills", data: { categories: newCategories } });
      toast.success(t("admin.common.deleted"));
    } catch (error) {
      toast.error(t("admin.common.deleteFailed"));
    }
  };

  if (loading && !categories.length) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  const inputCls = "w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base";
  const labelCls = "text-sm font-medium text-foreground mb-1 block";

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">{t("admin.skills.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">{t("admin.skills.subtitle")}</p>
        </div>
        {!isAdding && editingIndex === null && (
          <button
            onClick={() => { setIsAdding(true); setFormData({ title_en: "", title_ar: "", skills: "" }); }}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
          >
            <Plus size={20} />
            {t("admin.skills.addNew")}
          </button>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingIndex !== null) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            style={{ overflow: "hidden" }}
            className="glass-card z-40 rounded-[2rem] md:rounded-3xl border-2 border-primary/20"
          >
            <div className="p-5 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingIndex !== null ? t("admin.common.editExisting") : t("admin.common.addNew")}
                </h2>
                <button onClick={() => { setEditingIndex(null); setIsAdding(false); setFormData({}); }} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>{t("admin.common.titleEn")}</label>
                    <input type="text" value={formData.title_en || ""} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required className={inputCls} placeholder={t("admin.common.placeholders.skillCatEn")} />
                  </div>
                  <div dir="rtl">
                    <label className={labelCls}>{t("admin.common.titleAr")}</label>
                    <input type="text" value={formData.title_ar || ""} onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })} className={inputCls} placeholder={t("admin.common.placeholders.skillCatAr")} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{t("admin.skills.skillsLabel")}</label>
                  <textarea
                    value={typeof formData.skills === 'string' ? formData.skills : (Array.isArray(formData.skills) ? formData.skills.map((s: any) => typeof s === 'string' ? s : (s.name || s.name_en || "")).join(", ") : formData.skills || "")}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className={`${inputCls} h-24`}
                    placeholder={t("admin.common.placeholders.skillsList")}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => { setEditingIndex(null); setIsAdding(false); setFormData({}); }} className="px-6 py-3 rounded-xl font-bold hover:bg-muted transition-colors">{t("admin.common.cancel")}</button>
                  <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {t("admin.common.save")}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            layout
            key={idx}
            className="glass-card p-6 rounded-3xl group border border-border/50 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0 h-fit">
                  <Code2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-tight">{cat[`title_${currentLang}`] || cat.title_en || cat.title}</h3>
                </div>
              </div>
              <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingIndex(idx); setFormData(cat); setIsAdding(false); }} className="p-2 hover:bg-primary/10 rounded-lg text-primary"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(idx)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(cat.skills) ? cat.skills : []).map((skill: any, i: number) => (
                <span key={i} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsManager;
