import { useState, useEffect } from "react";
import { portfolioService } from "@/services/portfolioService";
import { Plus, Edit2, Trash2, Save, X, Loader2, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
}

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getAll("experience");
      setExperiences(data as Experience[]);
    } catch (error) {
      toast.error("Failed to fetch experience");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingId || Date.now().toString();
    try {
      await portfolioService.save("experience", id, { ...formData, id });
      toast.success("Saved successfully");
      setEditingId(null);
      setIsAdding(false);
      setFormData({});
      fetchExperiences();
    } catch (error: any) {
      toast.error(`Save failed: ${error.message || "Unknown error"}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await portfolioService.delete("experience", id);
      toast.success("Deleted");
      fetchExperiences();
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message || "Unknown error"}`);
    }
  };

  if (loading && !experiences.length) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">Work Experience</h1>
          <p className="text-muted-foreground mt-1">Manage your professional career history</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); setFormData({ description: [] }); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={20} />
            Add Experience
          </button>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-8 rounded-3xl space-y-6 border-2 border-primary/20"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? "Edit Experience" : "New Experience"}</h2>
              <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role / Job Title</label>
                  <input
                    type="text"
                    value={formData.role || ""}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <input
                    type="text"
                    value={formData.company || ""}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <input
                      type="text"
                      value={formData.location || ""}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Period (e.g., 2021 - Present)</label>
                    <input
                      type="text"
                      value={formData.period || ""}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      required
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Responsibilities (One per line)</label>
                  <textarea
                    value={Array.isArray(formData.description) ? formData.description.join("\n") : ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value.split("\n").filter(l => l.trim()) })}
                    required
                    rows={6}
                    placeholder="Developed full-stack web applications..."
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                  <Save size={20} />
                  Save Experience
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="glass-card p-6 rounded-3xl group relative border border-border/50">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{exp.role}</h3>
                  <p className="text-primary font-medium">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.period} | {exp.location}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingId(exp.id); setFormData(exp); setIsAdding(false); }} className="p-2 hover:bg-primary/10 rounded-lg text-primary">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(exp.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <ul className="mt-4 space-y-2 ml-14">
              {exp.description.map((line, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary">•</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceManager;
