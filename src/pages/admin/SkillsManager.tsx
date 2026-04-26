import { useState, useEffect } from "react";
import { portfolioService } from "@/services/portfolioService";
import { Plus, Edit2, Trash2, Save, X, Loader2, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Skill {
  name: string;
  icon?: string;
}

interface SkillCategory {
  title: string;
  skills: string[] | Skill[];
}

const SkillsManager = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getDocData("metadata", "skills");
      if (data) {
        if (data.categories) {
          setCategories(data.categories);
        } else {
          // Fallback for old structure or direct object values
          setCategories(Array.isArray(data) ? data : Object.values(data));
        }
      }
    } catch (error) {
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let updatedCategories = [...categories];
      if (editingIndex !== null) {
        updatedCategories[editingIndex] = formData;
      } else {
        updatedCategories.push(formData);
      }
      
      await portfolioService.save("metadata", "skills", { categories: updatedCategories });
      toast.success("Skills updated");
      setEditingIndex(null);
      setIsAdding(false);
      setCategories(updatedCategories);
    } catch (error) {
      toast.error("Save failed");
    }
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const updated = categories.filter((_, i) => i !== index);
      await portfolioService.save("metadata", "skills", { categories: updated });
      setCategories(updated);
      toast.success("Category deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading && !categories.length) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">Manage Skills</h1>
          <p className="text-muted-foreground mt-1">Organize your expertise into categories</p>
        </div>
        {!isAdding && editingIndex === null && (
          <button
            onClick={() => { setIsAdding(true); setFormData({ title: "", skills: [] }); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={20} />
            Add Category
          </button>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingIndex !== null) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-8 rounded-3xl space-y-6 border-2 border-primary/20"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingIndex !== null ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => { setEditingIndex(null); setIsAdding(false); }} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Title (e.g., Frontend, Tools)</label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Skills (Comma separated)</label>
                <textarea
                  value={Array.isArray(formData.skills) ? formData.skills.join(", ") : ""}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(",").map((s: string) => s.trim()).filter((s: string) => s) })}
                  placeholder="React, Next.js, TypeScript..."
                  rows={3}
                  className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                  <Save size={20} />
                  Save Category
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, index) => (
          <div key={index} className="glass-card p-6 rounded-3xl space-y-4 group relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Code2 size={20} />
                </div>
                <h3 className="text-xl font-bold">{cat.title}</h3>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingIndex(index); setFormData(cat); setIsAdding(false); }} className="p-2 hover:bg-primary/10 rounded-lg text-primary">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(index)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(cat.skills) && cat.skills.map((skill: any, i: number) => (
                <span key={i} className="px-3 py-1 bg-muted/50 rounded-full text-sm font-medium text-muted-foreground border border-border/50">
                  {typeof skill === "string" ? skill : skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsManager;
