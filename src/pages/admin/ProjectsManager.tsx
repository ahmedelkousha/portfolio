import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Globe, Github, Save, X, Loader2, Star, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { usePortfolioData, usePortfolioMutation } from "@/hooks/usePortfolioData";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  title_en: string;
  title_ar: string;
  description: string;
  description_en: string;
  description_ar: string;
  image: string;
  technologies: string[];
  github: string;
  liveDemo: string;
  featured: boolean;
}

const ProjectPreviewImage = ({ src, title, className }: { src?: string; title: string; className: string }) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(!src);
    setIsReady(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div className={`${className} bg-muted flex items-center justify-center p-4`}>
        <div className="text-center opacity-20">
          <ImageIcon className="h-8 w-8 mx-auto mb-1" />
          <p className="text-[10px] font-mono uppercase">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-muted relative overflow-hidden`}>
      <img
        src={src}
        alt={title}
        onLoad={() => setIsReady(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="animate-spin text-primary/30" size={20} />
        </div>
      )}
    </div>
  );
};

const ProjectsManager = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  const { data: projects, loading } = usePortfolioData("projects");
  const { save, remove, isSaving } = usePortfolioMutation("projects");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({ ...project });
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

  const addTag = () => {
    if (!newTag.trim()) return;
    const tags = formData.technologies || [];
    if (!tags.includes(newTag.trim())) {
      set("technologies", [...tags, newTag.trim()]);
    }
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    set("technologies", (formData.technologies || []).filter((t) => t !== tag));
  };

  if (loading && !projects.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const inputCls = "w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base";
  const labelCls = "text-sm font-medium text-foreground mb-1 block";

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">{t("admin.projects.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">{t("admin.projects.subtitle")}</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => {
              setIsAdding(true);
              setFormData({ technologies: [], featured: false });
            }}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
          >
            <Plus size={20} />
            {t("admin.projects.addNew")}
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
                  {editingId ? t("admin.projects.editTitle") : t("admin.projects.newTitle")}
                </h2>
                <button onClick={() => { setEditingId(null); setIsAdding(false); setFormData({}); }} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Titles */}
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>{t("admin.common.titleEn")}</label>
                      <input type="text" value={formData.title_en || ""} onChange={(e) => set("title_en", e.target.value)} required className={inputCls} placeholder={t("admin.common.placeholders.titleEn")} />
                    </div>
                    <div dir="rtl">
                      <label className={labelCls}>{t("admin.common.titleAr")}</label>
                      <input type="text" value={formData.title_ar || ""} onChange={(e) => set("title_ar", e.target.value)} className={inputCls} placeholder={t("admin.common.placeholders.titleAr")} />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>{t("admin.common.descEn")}</label>
                      <textarea value={formData.description_en || ""} onChange={(e) => set("description_en", e.target.value)} required className={`${inputCls} h-32 resize-none`} placeholder={t("admin.common.placeholders.descEn")} />
                    </div>
                    <div dir="rtl">
                      <label className={labelCls}>{t("admin.common.descAr")}</label>
                      <textarea value={formData.description_ar || ""} onChange={(e) => set("description_ar", e.target.value)} className={`${inputCls} h-32 resize-none`} placeholder={t("admin.common.placeholders.descAr")} />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-3">
                      <label className={labelCls}>{t("admin.common.previewImage")}</label>
                      <ImageUpload
                        value={formData.image}
                        onChange={(url) => set("image", url)}
                        folder="projects"
                      />
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className={labelCls}>{t("admin.common.githubUrl")}</label>
                        <div className="relative">
                          <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <input type="url" value={formData.github || ""} onChange={(e) => set("github", e.target.value)} className={`${inputCls} pl-10`} placeholder={t("admin.common.placeholders.github")} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>{t("admin.common.liveDemoUrl")}</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <input type="url" value={formData.liveDemo || ""} onChange={(e) => set("liveDemo", e.target.value)} className={`${inputCls} pl-10`} placeholder={t("admin.common.placeholders.demo")} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Technologies */}
                    <div className="space-y-3">
                      <label className={labelCls}>{t("admin.projects.technologies")}</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                          className={inputCls}
                          placeholder={t("admin.projects.tagPlaceholder")}
                        />
                        <button type="button" onClick={addTag} className="bg-secondary hover:bg-secondary/80 px-4 rounded-xl transition-colors">
                          <Plus size={20} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.technologies?.map((tag) => (
                          <Badge key={tag} className="pl-3 pr-1 py-1 gap-1 bg-primary/10 text-primary hover:bg-primary/20 border-none">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="p-0.5 hover:bg-primary/20 rounded-full transition-colors">
                              <X size={14} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Star size={20} className={formData.featured ? "text-primary fill-primary" : "text-primary"} />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{t("admin.projects.featured")}</p>
                          <p className="text-xs text-muted-foreground">{t("admin.projects.featuredDesc")}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => set("featured", !formData.featured)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${formData.featured ? "bg-primary" : "bg-muted"}`}
                      >
                        <motion.div
                          animate={{ x: formData.featured ? 26 : 4 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setEditingId(null); setIsAdding(false); setFormData({}); }}
                    className="px-6 py-3 rounded-xl font-bold hover:bg-muted transition-colors"
                  >
                    {t("admin.common.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {editingId ? t("admin.projects.applyChanges") : t("admin.projects.createProject")}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: Project, index: number) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.07,
              duration: 0.2,
              ease: "easeOut"
            }}
            className="glass-card rounded-3xl overflow-hidden group flex flex-col h-full border border-border/50 hover:border-primary/30"
          >
            <div className="relative aspect-video w-full">
              <ProjectPreviewImage src={project.image} title={project.title} className="w-full h-full" />
              {project.featured && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-primary text-primary-foreground shadow-lg">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {t("admin.projects.featured")}
                  </Badge>
                </div>
              )}
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                <button onClick={() => handleEdit(project)} className="p-3 bg-primary text-primary-foreground rounded-xl shadow-lg hover:scale-110 transition-transform">
                  <Edit2 size={20} />
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-3 bg-destructive text-destructive-foreground rounded-xl shadow-lg hover:scale-110 transition-transform">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-lg mb-2">{project[`title_${currentLang}`] || project.title_en}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project[`description_${currentLang}`] || project.description_en}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.technologies?.slice(0, 4).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-[10px] py-0 px-2 font-mono">
                    {tech}
                  </Badge>
                ))}
                {(project.technologies?.length || 0) > 4 && (
                  <span className="text-[10px] text-muted-foreground">+{project.technologies.length - 4} {t("admin.common.placeholders.more")}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManager;
