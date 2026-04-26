import { useState, useEffect } from "react";
import { portfolioService } from "@/services/portfolioService";
import { Plus, Edit2, Trash2, Save, X, Loader2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getAll("testimonials");
      setTestimonials(data as Testimonial[]);
    } catch (error) {
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (test: Testimonial) => {
    setEditingId(test.id);
    setFormData(test);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await portfolioService.delete("testimonials", id);
      toast.success("Deleted");
      fetchTestimonials();
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message || "Unknown error"}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingId || Date.now().toString();
    try {
      await portfolioService.save("testimonials", id, { ...formData, id });
      toast.success("Saved");
      setEditingId(null);
      setIsAdding(false);
      setFormData({});
      fetchTestimonials();
    } catch (error: any) {
      toast.error(`Save failed: ${error.message || "Unknown error"}`);
    }
  };

  if (loading && !testimonials.length) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">Client Testimonials</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">What clients say about you</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); setFormData({ rating: 5 }); }}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
          >
            <Plus size={20} />
            Add Testimonial
          </button>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6 border-2 border-primary/20"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? "Edit Testimonial" : "New Testimonial"}</h2>
              <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="text-muted-foreground hover:text-foreground p-1">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client Name</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <input
                      type="text"
                      value={formData.role || ""}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <input
                      type="text"
                      value={formData.company || ""}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating (1-5)</label>
                  <div className="flex gap-1 md:gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: num })}
                        className={`p-2 rounded-lg transition-all ${
                          (formData.rating || 0) >= num ? "text-amber-400" : "text-muted"
                        }`}
                      >
                        <Star className="fill-current" size={20} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Testimonial Content</label>
                  <textarea
                    value={formData.content || ""}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={4}
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
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {testimonials.map((test) => (
          <div key={test.id} className="glass-card p-5 md:p-6 rounded-[2rem] md:rounded-3xl space-y-4 relative group">
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5 md:gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < test.rating ? "text-amber-400 fill-amber-400" : "text-muted"} />
                ))}
              </div>
              <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(test)} className="p-2 hover:bg-primary/10 rounded-lg text-primary"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(test.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 size={18} /></button>
              </div>
            </div>
            <p className="text-muted-foreground italic line-clamp-4 text-sm md:text-base">"{test.content}"</p>
            <div className="border-t border-border/50 pt-4">
              <h4 className="font-bold text-sm md:text-base">{test.name}</h4>
              <p className="text-[10px] md:text-xs text-primary">{test.role} @ {test.company}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsManager;
