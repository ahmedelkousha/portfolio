import { useState, useEffect } from "react";
import { portfolioService } from "@/services/portfolioService";
import { Plus, Edit2, Trash2, Save, X, Loader2, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
}

const EducationManager = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getAll("education");
      setEducation(data as Education[]);
    } catch (error) {
      toast.error("Failed to fetch education");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingId || Date.now().toString();
    try {
      await portfolioService.save("education", id, { ...formData, id });
      toast.success("Saved");
      setEditingId(null);
      setIsAdding(false);
      setFormData({});
      fetchEducation();
    } catch (error) {
      toast.error("Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await portfolioService.delete("education", id);
      toast.success("Deleted");
      fetchEducation();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading && !education.length) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">Education</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your academic background</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); setFormData({}); }}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
          >
            <Plus size={20} />
            Add Education
          </button>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6 border-2 border-primary/20"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? "Edit Education" : "New Education"}</h2>
              <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="text-muted-foreground hover:text-foreground p-1">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Degree / Field of Study</label>
                  <input
                    type="text"
                    value={formData.degree || ""}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    required
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Institution Name</label>
                  <input
                    type="text"
                    value={formData.institution || ""}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    required
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <input
                      type="text"
                      value={formData.location || ""}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Period</label>
                    <input
                      type="text"
                      value={formData.period || ""}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      required
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                      placeholder="e.g. 2014 - 2019"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Details</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setIsAdding(false); }}
                  className="px-8 py-3 rounded-xl border border-border hover:bg-muted transition-all font-bold order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 order-1 sm:order-2">
                  <Save size={20} />
                  Save Education
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {education.map((edu) => (
          <div key={edu.id} className="glass-card p-5 md:p-6 rounded-[2rem] md:rounded-3xl group relative border border-border/50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0 h-fit">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold leading-tight">{edu.degree}</h3>
                  <p className="text-primary font-medium text-sm md:text-base">{edu.institution}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{edu.period} | {edu.location}</p>
                  {edu.description && <p className="mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">{edu.description}</p>}
                </div>
              </div>
              <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingId(edu.id); setFormData(edu); setIsAdding(false); }} className="p-2 hover:bg-primary/10 rounded-lg text-primary">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(edu.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationManager;
