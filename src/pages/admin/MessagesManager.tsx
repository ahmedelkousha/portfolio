import { useState, useEffect } from "react";
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
  Star,
  XCircle,
  ArchiveRestore
} from "lucide-react";
import { portfolioService } from "@/services/portfolioService";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const MessagesManager = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "read" | "archived">("active");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await portfolioService.getAll("messages");
      // Sort by date descending
      const sorted = data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMessages(sorted);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this message?")) return;
    try {
      await portfolioService.delete("messages", id);
      setMessages(messages.filter(m => m.id !== id));
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const toggleReadStatus = async (message: any) => {
    try {
      const newStatus = !message.read;
      await portfolioService.save("messages", message.id, { ...message, read: newStatus });
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, read: newStatus } : m
      ));
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const toggleArchiveStatus = async (message: any) => {
    try {
      const newStatus = !message.archived;
      await portfolioService.save("messages", message.id, { ...message, archived: newStatus });
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, archived: newStatus } : m
      ));
      toast.success(newStatus ? "Message archived" : "Message restored to inbox");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground">Inquiries</h1>
          <p className="text-muted-foreground mt-2">Manage your client inquiries and leads</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex p-1 bg-muted/50 rounded-2xl w-fit">
        {[
          { id: "active", label: "Active", count: stats.active, icon: Inbox },
          { id: "read", label: "Read", count: stats.read, icon: CheckCircle },
          { id: "archived", label: "Archived", count: stats.archived, icon: Archive }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
              ? "bg-background text-primary shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading inquiries...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="glass-card p-20 rounded-3xl text-center space-y-4">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Inbox className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No {activeTab} messages</h3>
          <p className="text-muted-foreground">Everything is clear for now!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card rounded-2xl overflow-hidden border-l-4 transition-all ${
                  message.read ? "border-l-transparent" : "border-l-primary shadow-lg shadow-primary/5"
                }`}
              >
                <div 
                  className="p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedMessage(expandedMessage === message.id ? null : message.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        message.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                      }`}>
                        {message.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className={`font-bold transition-colors ${message.read ? "text-foreground/70" : "text-foreground"}`}>
                          {message.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail size={12} /> {message.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden md:block text-right">
                        <p className="font-semibold text-sm">{message.subject}</p>
                        <p className="text-xs text-muted-foreground flex items-center justify-end gap-1 mt-1">
                          <Clock size={10} /> {format(new Date(message.createdAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleReadStatus(message);
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            message.read 
                            ? "text-primary bg-primary/10 hover:bg-primary/20" 
                            : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                          }`}
                          title={message.read ? "Mark as unread" : "Mark as read"}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleArchiveStatus(message);
                          }}
                          className="p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                          title={message.archived ? "Restore to inbox" : "Archive message"}
                        >
                          {message.archived ? <ArchiveRestore size={18} /> : <Archive size={18} />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(message.id);
                          }}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                          title="Permanently delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="text-muted-foreground ml-2">
                          {expandedMessage === message.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedMessage === message.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-muted/20 border-t border-border/50"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="h-5 w-5 text-primary mt-1 shrink-0" />
                          <div className="space-y-2">
                            <p className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Message Body</p>
                            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                              {message.message}
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-4 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl"
                            asChild
                          >
                            <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
                              Reply via Email
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
