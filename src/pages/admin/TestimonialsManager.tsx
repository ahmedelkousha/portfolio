import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Loader2, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { usePortfolioData, usePortfolioMutation } from "@/hooks/usePortfolioData";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

interface Testimonial {
  id: string;
  name: string;
  name_en: string;
  name_ar: string;
  role: string;
  role_en: string;
  role_ar: string;
  content: string;
  content_en: string;
  content_ar: string;
  image: string;
}

const TestimonialsManager = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  const { data: testimonials, loading } = usePortfolioData("testimonials");
  const { save, remove, isSaving } = usePortfolioMutation("testimonials");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({});
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (test: Testimonial) => {
    setEditingId(test.id);
    setFormData({ ...test });
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

  if (loading && !testimonials.length) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  const inputCls = "w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base";
  const labelCls = "text-sm font-medium text-foreground mb-1 block";

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">{t("admin.testimonials.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">{t("admin.testimonials.subtitle")}</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
          >
            <Plus size={20} />
            {t("admin.testimonials.addNew")}
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
            className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6 border-2 border-primary/20"
          >
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{t("admin.common.nameEn")}</label>
                      <input type="text" value={formData.name_en || formData.name || ""} onChange={(e) => set("name_en", e.target.value)} required className={inputCls} placeholder={t("admin.common.placeholders.testiNameEn")} />
                    </div>
                    <div dir="rtl">
                      <label className={labelCls}>{t("admin.common.nameAr")}</label>
                      <input type="text" value={formData.name_ar || ""} onChange={(e) => set("name_ar", e.target.value)} className={inputCls} placeholder={t("admin.common.placeholders.testiNameAr")} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{t("admin.common.roleEn")}</label>
                      <input type="text" value={formData.role_en || formData.role || ""} onChange={(e) => set("role_en", e.target.value)} required className={inputCls} placeholder={t("admin.common.placeholders.testiRoleEn")} />
                    </div>
                    <div dir="rtl">
                      <label className={labelCls}>{t("admin.common.roleAr")}</label>
                      <input type="text" value={formData.role_ar || ""} onChange={(e) => set("role_ar", e.target.value)} className={inputCls} placeholder={t("admin.common.placeholders.testiRoleAr")} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className={labelCls}>{t("admin.common.previewImage")}</label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => set("image", url)}
                    folder="testimonials"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>{t("admin.common.contentEn")}</label>
                  <textarea value={formData.content_en || formData.content || ""} onChange={(e) => set("content_en", e.target.value)} required className={`${inputCls} h-32`} placeholder={t("admin.common.placeholders.testiContentEn")} />
                </div>
                <div dir="rtl">
                  <label className={labelCls}>{t("admin.common.contentAr")}</label>
                  <textarea value={formData.content_ar || ""} onChange={(e) => set("content_ar", e.target.value)} className={`${inputCls} h-32`} placeholder={t("admin.common.placeholders.testiContentAr")} />
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
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((test: Testimonial) => (
          <div key={test.id} className="glass-card p-6 rounded-3xl group border border-border/50 hover:border-primary/30 transition-all relative overflow-hidden">
            <div className="absolute top-4 right-4 flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button onClick={() => handleEdit(test)} className="p-2 bg-background/80 backdrop-blur-sm hover:bg-primary/10 rounded-lg text-primary"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(test.id)} className="p-2 bg-background/80 backdrop-blur-sm hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 size={16} /></button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20">
                {test.image ? (
                  <img src={test.image} alt={test.name_en || test.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center text-primary"><Quote size={20} /></div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none">{test[`name_${currentLang}`] || test.name_en || test.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{test[`role_${currentLang}`] || test.role_en || test.role}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic line-clamp-4">"{test[`content_${currentLang}`] || test.content_en || test.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsManager;
