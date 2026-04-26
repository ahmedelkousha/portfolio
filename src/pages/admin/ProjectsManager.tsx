import { useState, useEffect } from "react";
import { portfolioService } from "@/services/portfolioService";
import { Plus, Edit2, Trash2, Globe, Github, Save, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [isAdding, setIsAdding] = useState(false);

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
    setFormData(project);
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

  if (loading && !projects.length) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">Manage Projects</h1>
          <p className="text-muted-foreground mt-1">Add, edit or remove projects from your portfolio</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); setFormData({ featured: false, technologies: [] }); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
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
            className="glass-card p-8 rounded-3xl space-y-6 relative border-2 border-primary/20"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Title</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <input
                    type="text"
                    value={formData.image || ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/placeholder.svg"
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GitHub Link</label>
                    <input
                      type="text"
                      value={formData.github || ""}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Live Demo</label>
                    <input
                      type="text"
                      value={formData.liveDemo || ""}
                      onChange={(e) => setFormData({ ...formData, liveDemo: e.target.value })}
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    id="featured"
                    className="w-5 h-5 accent-primary"
                  />
                  <label htmlFor="featured" className="text-sm font-medium cursor-pointer">Mark as Featured Project</label>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setIsAdding(false); }}
                  className="px-6 py-3 rounded-xl border border-border hover:bg-muted transition-all font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Save size={20} />
                  {editingId ? "Update Project" : "Save Project"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            className="glass-card overflow-hidden rounded-3xl flex flex-col group border border-border/50"
          >
            <div className="h-48 overflow-hidden relative">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {project.featured && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  Featured
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => handleEdit(project)} className="p-2 bg-background/80 backdrop-blur rounded-lg hover:bg-primary hover:text-white transition-all">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-2 bg-background/80 backdrop-blur rounded-lg hover:bg-destructive hover:text-white transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{project.description}</p>
              <div className="flex items-center gap-4 pt-4 mt-auto">
                {project.github && <Github size={18} className="text-muted-foreground" />}
                {project.liveDemo && <Globe size={18} className="text-muted-foreground" />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManager;
