import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Type,
  BarChart3,
  X,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { usePersonalInfo, usePortfolioMutation } from "@/hooks/usePortfolioData";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { motion, Reorder } from "framer-motion";

interface Role {
  id: string; // Temporary ID for stable Reorder keys
  name_en: string;
  name_ar: string;
}

interface Stat {
  id: string; // Temporary ID for stable Reorder keys
  label_en: string;
  label_ar: string;
  value: string;
}

const HeroManager = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  const { data: info, loading } = usePersonalInfo();
  const { save, isSaving } = usePortfolioMutation("metadata");

  const [roles, setRoles] = useState<Role[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    if (info) {
      // Inject temporary unique IDs for stable Reorder tracking
      setRoles((info.openToRoles || []).map((r: any) => ({ ...r, id: r.id || Math.random().toString(36).substr(2, 9) })));
      setStats((info.stats || []).map((s: any) => ({ ...s, id: s.id || Math.random().toString(36).substr(2, 9) })));
    }
  }, [info]);

  const handleSave = async () => {
    try {
      // Strip temporary IDs before saving
      const rolesToSave = roles.map(({ id, ...rest }) => rest);
      const statsToSave = stats.map(({ id, ...rest }) => rest);

      await save({
        id: "personalInfo",
        data: {
          ...info,
          openToRoles: rolesToSave,
          stats: statsToSave
        }
      });
      toast.success(t("admin.common.saved"));
    } catch {
      toast.error(t("admin.common.saveFailed"));
    }
  };

  // Roles Management
  const addRole = () => {
    setRoles([...roles, { id: Math.random().toString(36).substr(2, 9), name_en: "", name_ar: "" }]);
  };

  const updateRole = (index: number, field: keyof Omit<Role, "id">, value: string) => {
    const newRoles = [...roles];
    newRoles[index] = { ...newRoles[index], [field]: value };
    setRoles(newRoles);
  };

  const removeRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  // Stats Management
  const addStat = () => {
    setStats([...stats, { id: Math.random().toString(36).substr(2, 9), label_en: "", label_ar: "", value: "" }]);
  };

  const updateStat = (index: number, field: keyof Omit<Stat, "id">, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  const inputCls = "w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all duration-200";
  const labelCls = "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-8 max-w-5xl pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-foreground">{t("admin.hero.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">{t("admin.hero.subtitle")}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isSaving ? t("admin.common.updating") : t("admin.common.save")}
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* ── Roles Section ── */}
        <section className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6 border border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Type size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{t("admin.hero.rolesTitle")}</h2>
                <p className="text-sm text-muted-foreground">{t("admin.hero.rolesSubtitle")}</p>
              </div>
            </div>
            <button
              onClick={addRole}
              className="flex items-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-xl transition-colors font-bold text-sm"
            >
              <Plus size={18} /> {t("admin.hero.addRole")}
            </button>
          </div>

          <Reorder.Group axis="y" values={roles} onReorder={setRoles} className="space-y-4">
            {roles.map((role, index) => (
              <Reorder.Item
                key={role.id} // Use stable ID as key
                value={role}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileDrag={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                className="flex items-start gap-4 p-4 bg-muted/30 border border-border/50 rounded-2xl group relative transition-colors hover:border-primary/30"
              >
                <div className="mt-9 cursor-grab active:cursor-grabbing text-muted-foreground/30 group-hover:text-muted-foreground transition-colors">
                  <GripVertical size={20} />
                </div>

                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={labelCls}>{t("admin.common.titleEn")}</label>
                    <input
                      type="text"
                      value={role.name_en}
                      onChange={(e) => updateRole(index, "name_en", e.target.value)}
                      placeholder="e.g. Full Stack Developer"
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1" dir="rtl">
                    <label className={labelCls}>{t("admin.common.titleAr")}</label>
                    <input
                      type="text"
                      value={role.name_ar}
                      onChange={(e) => updateRole(index, "name_ar", e.target.value)}
                      placeholder="مثال: مطور ويب"
                      className={inputCls}
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeRole(index)}
                  className="mt-9 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </section>

        {/* ── Stats Section ── */}
        <section className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-3xl space-y-6 border border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <BarChart3 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{t("admin.hero.statsTitle")}</h2>
                <p className="text-sm text-muted-foreground">{t("admin.hero.statsSubtitle")}</p>
              </div>
            </div>
            <button
              onClick={addStat}
              className="flex items-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-xl transition-colors font-bold text-sm"
            >
              <Plus size={18} /> {t("admin.hero.addStat")}
            </button>
          </div>

          <Reorder.Group axis="y" values={stats} onReorder={setStats} className="space-y-4">
            {stats.map((stat, index) => (
              <Reorder.Item
                key={stat.id} // Use stable ID as key
                value={stat}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileDrag={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                className="flex items-start gap-4 p-4 bg-muted/30 border border-border/50 rounded-2xl group transition-colors hover:border-primary/30"
              >
                <div className="mt-9 cursor-grab active:cursor-grabbing text-muted-foreground/30 group-hover:text-muted-foreground transition-colors">
                  <GripVertical size={20} />
                </div>

                <div className="flex-grow space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className={labelCls}>{t("admin.hero.statValue")}</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStat(index, "value", e.target.value)}
                        placeholder="45+"
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>{t("admin.hero.labelEn")}</label>
                      <input
                        type="text"
                        value={stat.label_en}
                        onChange={(e) => updateStat(index, "label_en", e.target.value)}
                        placeholder="Projects Completed"
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1" dir="rtl">
                      <label className={labelCls}>{t("admin.hero.labelAr")}</label>
                      <input
                        type="text"
                        value={stat.label_ar}
                        onChange={(e) => updateStat(index, "label_ar", e.target.value)}
                        placeholder="مشروع منجز"
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeStat(index)}
                  className="mt-9 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </section>
      </div>
    </div>
  );
};

export default HeroManager;
