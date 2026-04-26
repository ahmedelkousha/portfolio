import { useState, useEffect } from "react";
import { portfolioService } from "@/services/portfolioService";
import { Plus, Edit2, Trash2, Globe, Github, Save, X, Loader2, Star, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Project {
  id: string;
  title: string;
  description: string;
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getAll("projects");
      setProjects(data as Project[]);
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({ ...project });
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await portfolioService.delete("projects", id);
      toast.success("Project deleted");
      fetchProjects();
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message || "Unknown error"}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingId || Date.now().toString();
    try {
      await portfolioService.save("projects", id, { ...formData, id });
      toast.success(editingId ? "Project updated" : "Project added");
      setEditingId(null);
      setIsAdding(false);
      setFormData({});
      fetchProjects();
    } catch (error: any) {
      toast.error(`Save failed: ${error.message || "Unknown error"}`);
    }
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    const currentTags = formData.technologies || [];
    if (currentTags.includes(newTag.trim())) {
      setNewTag("");
      return;
    }
    setFormData({
      ...formData,
      technologies: [...currentTags, newTag.trim()]
    });
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      technologies: (formData.technologies || []).filter(t => t !== tagToRemove)
    });
  };

  if (loading && !projects.length) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">Manage Projects</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Add, edit or remove projects</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); setFormData({ featured: false, technologies: [] }); }}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
          >
            <Plus size={20} />
            Add Project
          </button>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6 relative border-2 border-primary/20"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="text-muted-foreground hover:text-foreground p-1">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base"
                    placeholder="Enter project name..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base"
                    placeholder="Tell the story of this project..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Technologies</label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                        className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                        placeholder="Add tag"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="bg-muted border border-border rounded-xl px-4 hover:bg-primary hover:text-white transition-all text-sm font-bold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.technologies?.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <ImageUpload 
                    value={formData.image} 
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    folder="projects"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">GitHub</label>
                    <input
                      type="text"
                      value={formData.github || ""}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                      placeholder="Repository URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Demo</label>
                    <input
                      type="text"
                      value={formData.liveDemo || ""}
                      onChange={(e) => setFormData({ ...formData, liveDemo: e.target.value })}
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                      placeholder="Website URL"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    id="featured"
                    className="w-6 h-6 accent-primary rounded-lg"
                  />
                  <div>
                    <label htmlFor="featured" className="font-bold cursor-pointer flex items-center gap-2 text-sm">
                      <Star size={16} className="text-primary fill-primary" />
                      Featured Project
                    </label>
                    <p className="text-[10px] md:text-xs text-muted-foreground">Highlighted at the top of your portfolio.</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setIsAdding(false); }}
                  className="px-8 py-3 rounded-xl border border-border hover:bg-muted transition-all font-bold order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 order-1 sm:order-2"
                >
                  <Save size={20} />
                  {editingId ? "Apply Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            className="glass-card overflow-hidden rounded-[2rem] flex flex-col group border border-border/50 hover:border-primary/30 transition-all"
          >
            <div className="aspect-video w-full relative group">
              <ProjectPreviewImage
                src={project.image}
                title={project.title}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-3 bg-white text-black rounded-2xl hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-3 bg-white text-black rounded-2xl hover:bg-destructive hover:text-white transition-all transform hover:scale-110"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              {project.featured && (
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] md:text-xs font-black rounded-full shadow-lg flex items-center gap-1.5">
                  <Star size={12} className="fill-current" />
                  FEATURED
                </div>
              )}
            </div>
            <div className="p-6 md:p-8 flex flex-col flex-1 gap-4">
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-black text-foreground">{project.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                      {tag}
                    </span>
                  ))}
                  {project.technologies?.length > 3 && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      +{project.technologies.length - 3} MORE
                    </span>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground text-xs md:text-sm line-clamp-3 leading-relaxed">
                {project.description}
              </p>
              <div className="flex items-center gap-6 pt-4 border-t border-border/30 mt-auto">
                <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-help group/tip relative">
                  <Github size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Repo</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-help group/tip relative">
                  <Globe size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Live</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManager;
