import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { usePortfolioData, usePortfolioMutation } from "@/hooks/usePortfolioData";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

interface SEOExpertise {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  icon: string;
}

const SEOExpertiseManager = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  const { data: expertise, loading } = usePortfolioData("seoExpertise");
  const { save, remove, isSaving } = usePortfolioMutation("seoExpertise");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SEOExpertise>>({});
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (item: SEOExpertise) => {
    setEditingId(item.id);
    setFormData({ ...item });
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

  if (loading && !expertise.length) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  const inputCls = "w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base";
  const labelCls = "text-sm font-medium text-foreground mb-1 block";

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">{t("admin.seoExpertise.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">{t("admin.seoExpertise.subtitle")}</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
          >
            <Plus size={20} />
            {t("admin.seoExpertise.addNew")}
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
                      <label className={labelCls}>{t("admin.common.titleEn")}</label>
                      <input type="text" value={formData.title_en || ""} onChange={(e) => set("title_en", e.target.value)} required className={inputCls} placeholder={t("admin.common.placeholders.seoTitleEn")} />
                    </div>
                    <div dir="rtl">
                      <label className={labelCls}>{t("admin.common.titleAr")}</label>
                      <input type="text" value={formData.title_ar || ""} onChange={(e) => set("title_ar", e.target.value)} className={inputCls} placeholder={t("admin.common.placeholders.seoTitleAr")} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>{t("admin.seoExpertise.iconName")}</label>
                      <input type="text" value={formData.icon || ""} onChange={(e) => set("icon", e.target.value)} required className={inputCls} placeholder={t("admin.common.placeholders.seoIcon")} />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>{t("admin.common.descEn")}</label>
                    <textarea value={formData.description_en || ""} onChange={(e) => set("description_en", e.target.value)} required className={`${inputCls} h-32`} placeholder={t("admin.common.placeholders.seoDescEn")} />
                  </div>
                  <div dir="rtl">
                    <label className={labelCls}>{t("admin.common.descAr")}</label>
                    <textarea value={formData.description_ar || ""} onChange={(e) => set("description_ar", e.target.value)} className={`${inputCls} h-32`} placeholder={t("admin.common.placeholders.seoDescAr")} />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expertise.map((item: SEOExpertise) => (
          <motion.div
            layout
            key={item.id}
            className="glass-card p-6 rounded-3xl group border border-border/50 hover:border-primary/30 transition-all relative"
          >
            <div className="absolute top-4 right-4 flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button onClick={() => handleEdit(item)} className="p-2 bg-background/80 backdrop-blur-sm hover:bg-primary/10 rounded-lg text-primary"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 bg-background/80 backdrop-blur-sm hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 size={16} /></button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Search size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none">{item[`title_${currentLang}`] || item.title_en}</h4>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{item[`description_${currentLang}`] || item.description_en}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SEOExpertiseManager;
