import { useState, useEffect } from "react";
import { portfolioService } from "@/services/portfolioService";
import { Save, Loader2, User, Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const PersonalInfoManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getPersonalInfo();
      if (data) setFormData(data);
    } catch (error) {
      toast.error("Failed to fetch info");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await portfolioService.save("metadata", "personalInfo", formData);
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">Personal Information</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Update your basic info, bio, and social links</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
        <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User size={16} className="text-primary" /> Full Name
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Professional Role</label>
              <input
                type="text"
                value={formData.role || ""}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tagline</label>
            <input
              type="text"
              value={formData.tagline || ""}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none text-sm md:text-base"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio / About Me</label>
            <textarea
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
              rows={6}
              className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none leading-relaxed text-sm md:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              Contact Details
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail size={16} /> Email
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone size={16} /> Phone
                </label>
                <input
                  type="text"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin size={16} /> Location
                </label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-5 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              Links & Resume
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Github size={16} /> GitHub Profile
                </label>
                <input
                  type="text"
                  value={formData.github || ""}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Linkedin size={16} /> LinkedIn Profile
                </label>
                <input
                  type="text"
                  value={formData.linkedin || ""}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ExternalLink size={16} /> CV / Resume URL
                </label>
                <input
                  type="text"
                  value={formData.cvUrl || ""}
                  onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                  className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-12 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/30 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoManager;
