import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  MessageSquare,
  Search,
  Loader2,
  ChevronDown,
  ChevronUp,
  Inbox,
  Archive,
  ArchiveRestore
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { usePortfolioData, usePortfolioMutation } from "@/hooks/usePortfolioData";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  archived: boolean;
}

const MessagesManager = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  const { data: rawMessages, loading } = usePortfolioData("messages");
  const { save, remove } = usePortfolioMutation("messages");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "read" | "archived">("active");

  const messages = useMemo(() => {
    return [...((rawMessages as Message[]) || [])].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [rawMessages]);

  const safeFormatDate = (dateStr: any) => {
    try {
      if (!dateStr) return t("admin.messages.justNow");
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return t("admin.messages.invalidDate");
      return format(date, "MMM d, h:mm a");
    } catch {
      return t("admin.messages.errorDate");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("admin.common.confirmDelete"))) return;
    try {
      await remove(id);
      toast.success(t("admin.common.deleted"));
    } catch (error) {
      toast.error(t("admin.common.deleteFailed"));
    }
  };

  const toggleReadStatus = async (message: Message) => {
    try {
      const newStatus = !message.read;
      await save({ id: message.id, data: { ...message, read: newStatus } });
    } catch (error) {
      toast.error(t("admin.common.saveFailed"));
    }
  };

  const toggleArchiveStatus = async (message: Message) => {
    try {
      const newStatus = !message.archived;
      await save({ id: message.id, data: { ...message, archived: newStatus } });
      toast.success(newStatus ? t("admin.messages.archived") : t("admin.messages.restored"));
    } catch (error) {
      toast.error(t("admin.common.saveFailed"));
    }
  };

  const filteredMessages = messages.filter(m => {
    const name = m.name || "";
    const email = m.email || "";
    const subject = m.subject || "";
    const messageText = m.message || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      messageText.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "active") return !m.read && !m.archived;
    if (activeTab === "read") return m.read && !m.archived;
    if (activeTab === "archived") return m.archived;

    return true;
  });

  const stats = {
    active: messages.filter(m => !m.read && !m.archived).length,
    read: messages.filter(m => m.read && !m.archived).length,
    archived: messages.filter(m => m.archived).length
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">{t("admin.messages.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">{t("admin.messages.subtitle")}</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("admin.messages.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 md:py-2 bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex p-1 bg-muted/50 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar relative">
        {[
          { id: "active", label: t("admin.messages.active"), count: stats.active, icon: Inbox },
          { id: "read", label: t("admin.messages.read"), count: stats.read, icon: CheckCircle },
          { id: "archived", label: t("admin.messages.archivedTab"), count: stats.archived, icon: Archive }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "active" | "read" | "archived")}
            className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap flex-1 sm:flex-none relative ${activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeMessageTab"
                className="absolute inset-0 bg-background rounded-xl shadow-sm"
              />
            )}
            <tab.icon size={14} className="md:w-4 md:h-4 relative z-10" />
            <span className="relative z-10">{tab.label}</span>
            {tab.count > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] relative z-10 ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && !messages.length ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse text-sm">{t("admin.messages.loading")}</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="glass-card p-10 md:p-20 rounded-[2rem] md:rounded-3xl text-center space-y-4">
          <div className="h-16 w-16 md:h-20 md:w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Inbox className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-foreground">{t("admin.messages.noMessages", { tab: activeTab })}</h3>
          <p className="text-sm text-muted-foreground">{t("admin.messages.everythingClear")}</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                layout
               initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "linear", delay: index * 0.1 }}
            style={{ overflow: "hidden" }}
                className={`glass-card rounded-2xl md:rounded-[2rem] overflow-hidden border-l-4 ${message.read ? "border-l-transparent" : "border-l-primary shadow-lg shadow-primary/5"
                  }`}
              >
                <div
                  className="p-4 md:p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedMessage(expandedMessage === message.id ? null : message.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full shrink-0 flex items-center justify-center font-bold text-base md:text-lg ${message.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                        }`}>
                        {(message.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className={`font-bold truncate transition-colors text-sm md:text-base ${message.read ? "text-foreground/70" : "text-foreground"}`}>
                          {message.name}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                          <Mail size={12} className="shrink-0" /> {message.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-6 border-t sm:border-none pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <p className="font-semibold text-xs md:text-sm line-clamp-1">{message.subject}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground flex items-center sm:justify-end gap-1 mt-0.5">
                          <Clock size={10} /> {safeFormatDate(message.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleReadStatus(message);
                          }}
                          className={`p-2 rounded-lg transition-all ${message.read
                              ? "text-primary bg-primary/10 hover:bg-primary/20"
                              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                            }`}
                          title={message.read ? t("admin.messages.markAsUnread") : t("admin.messages.markAsRead")}
                        >
                          <CheckCircle size={16} className="md:w-[18px] md:h-[18px]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleArchiveStatus(message);
                          }}
                          className="p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                          title={message.archived ? t("admin.messages.restore") : t("admin.messages.archive")}
                        >
                          {message.archived ? <ArchiveRestore size={16} className="md:w-[18px] md:h-[18px]" /> : <Archive size={16} className="md:w-[18px] md:h-[18px]" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(message.id);
                          }}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                          title={t("admin.common.delete")}
                        >
                          <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                        </button>
                        <div className="text-muted-foreground ml-1">
                          {expandedMessage === message.id ? <ChevronUp size={16} className="md:w-[18px] md:h-[18px]" /> : <ChevronDown size={16} className="md:w-[18px] md:h-[18px]" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedMessage === message.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "linear" }}
                      style={{ overflow: "hidden" }}
                      className="overflow-hidden bg-muted/20 border-t border-border/50"
                    >
                      <div className="p-5 md:p-6 space-y-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-primary mt-1 shrink-0" />
                          <div className="space-y-2">
                            <p className="font-bold text-[10px] md:text-sm uppercase tracking-wider text-muted-foreground">{t("admin.messages.messageBody")}</p>
                            <p className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-wrap">
                              {message.message}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 md:pt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl text-xs md:text-sm h-9 md:h-10 px-4"
                            asChild
                          >
                            <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
                              {t("admin.messages.reply")}
                            </a>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MessagesManager;
