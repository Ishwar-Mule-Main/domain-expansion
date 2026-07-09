"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Mail, Settings, Database, Play, Pause, RefreshCw, Upload, Trash2,
  Search, ShieldAlert, Sparkles, CheckCircle2, XCircle, AlertTriangle,
  ChevronLeft, ChevronRight, UserMinus, Plus, Eye, Edit3, X, Save
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Prospect {
  id: string;
  email: string;
  name: string;
  company?: string | null;
  industry?: string | null;
  website?: string | null;
  status: "PENDING" | "GENERATING" | "READY" | "SENDING" | "SENT" | "REPLIED" | "FAILED" | "UNSUBSCRIBED";
  customSubject?: string | null;
  customBody?: string | null;
  sentAt?: string | null;
  repliedAt?: string | null;
  createdAt: string;
}

interface Stats {
  TOTAL: number;
  PENDING: number;
  GENERATING: number;
  READY: number;
  SENDING: number;
  SENT: number;
  REPLIED: number;
  FAILED: number;
  UNSUBSCRIBED: number;
}

export default function EmailCampaignsPage() {
  // Tabs: 'reports' | 'prospects' | 'settings' | 'brain'
  const [activeTab, setActiveTab] = useState<"reports" | "prospects" | "settings" | "brain">("reports");

  // Settings state
  const [gmailUser, setGmailUser] = useState("connect.domainexpansion@gmail.com");
  const [gmailAppPassword, setGmailAppPassword] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [openRouterApiKey, setOpenRouterApiKey] = useState("");
  const [openRouterModel, setOpenRouterModel] = useState("google/gemini-2.0-flash");
  const [preferredProvider, setPreferredProvider] = useState("GOOGLE");
  const [fallbackEnabled, setFallbackEnabled] = useState(true);
  const [pitchPrompt, setPitchPrompt] = useState("");
  const [replyPrompt, setReplyPrompt] = useState("");
  const [dailyLimit, setDailyLimit] = useState(150);
  const [intervalSeconds, setIntervalSeconds] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Prospects queue state
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [stats, setStats] = useState<Stats>({
    TOTAL: 0, PENDING: 0, GENERATING: 0, READY: 0, SENDING: 0, SENT: 0, REPLIED: 0, FAILED: 0, UNSUBSCRIBED: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingQueue, setLoadingQueue] = useState(false);

  // CSV Import State
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importCount, setImportCount] = useState(0);
  const [importError, setImportError] = useState("");

  // Live Auto-Pilot loop state
  const [autoPilotActive, setAutoPilotActive] = useState(false);
  const [autoPilotTimer, setAutoPilotTimer] = useState<NodeJS.Timeout | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [liveLog, setLiveLog] = useState<string[]>([]);

  // Detailed Modal View State
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [savingDraft, setSavingDraft] = useState(false);

  // Master Brain Logs State
  const [brainLogs, setBrainLogs] = useState<any[]>([]);
  const [brainPage, setBrainPage] = useState(1);
  const [brainTotalPages, setBrainTotalPages] = useState(1);
  const [loadingBrainLogs, setLoadingBrainLogs] = useState(false);
  const [brainSearchQuery, setBrainSearchQuery] = useState("");
  const [brainStatusFilter, setBrainStatusFilter] = useState("all");

  const fetchBrainLogs = async (page: number) => {
    setLoadingBrainLogs(true);
    try {
      const res = await fetch(
        `/api/admin/email/logs?page=${page}&limit=20&status=${brainStatusFilter}&q=${encodeURIComponent(brainSearchQuery)}`
      );
      const data = await res.json();
      if (data.success) {
        setBrainLogs(data.logs);
        setBrainTotalPages(data.pagination.pages);
        setBrainPage(data.pagination.page);
      }
    } catch (err) {
      console.error("Failed to load brain logs:", err);
    } finally {
      setLoadingBrainLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === "brain") {
      fetchBrainLogs(1);
    }
  }, [activeTab, brainStatusFilter]);

  const handleBrainSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBrainPage(1);
    fetchBrainLogs(1);
  };

  // Fetch initial configs and queue data
  useEffect(() => {
    fetchSettings();
    fetchQueue(1);
  }, []);

  // Syncing stats in reports tab regularly
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTab === "reports") {
      interval = setInterval(() => {
        fetchQueue(currentPage, true); // Silent background refresh
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [activeTab, currentPage]);

  // Handle auto-pilot sender loop
  useEffect(() => {
    if (autoPilotActive) {
      addLog("Auto-Pilot sequence initialized. Running loop...");
      const tick = async () => {
        if (cooldown > 0) {
          setCooldown(prev => prev - 1);
          return;
        }

        addLog("Scanning database for queue actions...");
        try {
          const res = await fetch("/api/admin/email/process", { method: "POST" });
          const data = await res.json();

          if (data.success) {
            addLog(`✅ SUCCESS: ${data.message}`);
            // Refresh stats and listing
            fetchQueue(currentPage, true);
            setCooldown(intervalSeconds);
          } else {
            if (data.cooldownSeconds) {
              addLog(`⏳ Cooldown active. Waiting ${data.cooldownSeconds} seconds.`);
              setCooldown(data.cooldownSeconds);
            } else {
              addLog(`⚠️ IDLE / HALTED: ${data.message}`);
              if (data.queueEmpty) {
                addLog("Queue is complete! Disabling Auto-Pilot.");
                setAutoPilotActive(false);
              } else {
                setCooldown(30); // Sleep for 30s before retry on credential/limits halt
              }
            }
          }
        } catch (err: any) {
          addLog(`❌ NETWORK ERROR: ${err.message || "Failed to contact queue worker"}`);
          setCooldown(60);
        }
      };

      // Run immediately then tick every 1s to manage countdowns
      tick();
      const timer = setInterval(tick, 1000);
      return () => clearInterval(timer);
    } else {
      setCooldown(0);
    }
  }, [autoPilotActive, cooldown, intervalSeconds]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLiveLog(prev => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // API calls
  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/email/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setGmailUser(data.settings.gmailUser);
        setGmailAppPassword(data.settings.gmailAppPassword);
        setGeminiApiKey(data.settings.geminiApiKey);
        setOpenRouterApiKey(data.settings.openRouterApiKey || "");
        setOpenRouterModel(data.settings.openRouterModel || "google/gemini-2.0-flash");
        setPreferredProvider(data.settings.preferredProvider || "GOOGLE");
        setFallbackEnabled(data.settings.fallbackEnabled !== false);
        setPitchPrompt(data.settings.pitchPrompt);
        setReplyPrompt(data.settings.replyPrompt);
        setDailyLimit(data.settings.dailyLimit);
        setIntervalSeconds(data.settings.intervalSeconds);
        setIsActive(data.settings.isActive);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/email/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gmailUser,
          gmailAppPassword,
          geminiApiKey,
          openRouterApiKey,
          openRouterModel,
          preferredProvider,
          fallbackEnabled,
          pitchPrompt,
          replyPrompt,
          dailyLimit,
          intervalSeconds,
          isActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Settings synchronized successfully!");
        addLog("Settings updated.");
      } else {
        alert(data.message || "Failed to save settings.");
      }
    } catch (err) {
      alert("Network error. Could not update settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchQueue = async (page: number, silent = false) => {
    if (!silent) setLoadingQueue(true);
    try {
      const res = await fetch(
        `/api/admin/email/prospects?page=${page}&limit=10&status=${statusFilter}&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (data.success) {
        setProspects(data.prospects);
        setTotalPages(data.pagination.pages);
        setCurrentPage(data.pagination.page);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load queue:", err);
    } finally {
      if (!silent) setLoadingQueue(false);
    }
  };

  const handleTriggerManualSend = async () => {
    addLog("Manual trigger started...");
    try {
      const res = await fetch("/api/admin/email/process?force=true", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        addLog(`✅ MANUAL SUCCESS: ${data.message}`);
        fetchQueue(currentPage);
      } else {
        addLog(`❌ MANUAL FAILURE: ${data.message}`);
        alert(`Failed to send: ${data.message}`);
      }
    } catch (err: any) {
      addLog(`❌ NETWORK ERROR: ${err.message}`);
      alert("Network connection error.");
    }
  };

  const handleSyncReplies = async () => {
    addLog("Syncing incoming Gmail replies via IMAP...");
    try {
      const res = await fetch("/api/admin/email/sync-replies", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        addLog(`📥 IMAP SYNC: ${data.message}`);
        alert(data.message);
        fetchQueue(currentPage);
      } else {
        addLog(`❌ IMAP SYNC FAILED: ${data.message}`);
        alert(`IMAP error: ${data.message}`);
      }
    } catch (err: any) {
      addLog(`❌ IMAP SYNC NETWORK ERROR: ${err.message}`);
      alert("Could not connect to sync service.");
    }
  };

  const handleDeleteProspect = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prospect from the list?")) return;
    try {
      const res = await fetch(`/api/admin/email/prospects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        addLog("Prospect record deleted.");
        fetchQueue(currentPage);
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      alert("Error processing delete request.");
    }
  };

  const handleClearQueue = async () => {
    if (!confirm("🚨 WARNING: This will completely wipe all prospects and email logs. Do you want to proceed?")) return;
    try {
      const res = await fetch("/api/admin/email/prospects?clearAll=true", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        addLog("Queue reset completely.");
        setCurrentPage(1);
        fetchQueue(1);
      } else {
        alert("Failed to clear queue.");
      }
    } catch (err) {
      alert("Error clearing database.");
    }
  };

  const handleSaveDraft = async () => {
    if (!editingProspect) return;
    setSavingDraft(true);
    try {
      const res = await fetch("/api/admin/email/prospects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProspect.id,
          customSubject: editedSubject,
          customBody: editedBody,
          status: "READY" // Set it back to READY so it's ready to go
        }),
      });
      const data = await res.json();
      if (data.success) {
        addLog(`Modified draft for ${editingProspect.email}`);
        setEditingProspect(null);
        fetchQueue(currentPage);
      } else {
        alert("Failed to save draft edits.");
      }
    } catch (err) {
      alert("Error syncing draft edits.");
    } finally {
      setSavingDraft(false);
    }
  };

  // CSV parsing engine
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportProgress(0);
    setImportCount(0);
    setImportError("");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setImportError("Empty file content.");
          setImporting(false);
          return;
        }

        // 1. Process CSV text into raw arrays
        const rows: string[][] = [];
        let row: string[] = [""];
        let insideQuote = false;

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const nextChar = text[i + 1];
          if (char === '"') {
            if (insideQuote && nextChar === '"') {
              row[row.length - 1] += '"';
              i++; // skip next quote
            } else {
              insideQuote = !insideQuote;
            }
          } else if (char === ',' && !insideQuote) {
            row.push("");
          } else if ((char === '\r' || char === '\n') && !insideQuote) {
            if (char === '\r' && nextChar === '\n') i++;
            rows.push(row);
            row = [""];
          } else {
            row[row.length - 1] += char;
          }
        }
        if (row.length > 1 || row[0] !== "") {
          rows.push(row);
        }

        if (rows.length < 2) {
          setImportError("CSV contains no records.");
          setImporting(false);
          return;
        }

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const emailIndex = headers.indexOf("email");
        const nameIndex = headers.indexOf("name");
        const companyIndex = headers.indexOf("company");
        const industryIndex = headers.indexOf("industry");
        const websiteIndex = headers.indexOf("website");

        if (emailIndex === -1) {
          setImportError("CSV must contain at least an 'email' column header.");
          setImporting(false);
          return;
        }

        const parsedProspects: any[] = [];
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i];
          if (cols.length === 1 && !cols[0]) continue; // Skip empty rows
          
          parsedProspects.push({
            email: cols[emailIndex] ? cols[emailIndex].trim() : "",
            name: nameIndex !== -1 && cols[nameIndex] ? cols[nameIndex].trim() : "Valued Prospect",
            company: companyIndex !== -1 && cols[companyIndex] ? cols[companyIndex].trim() : null,
            industry: industryIndex !== -1 && cols[industryIndex] ? cols[industryIndex].trim() : null,
            website: websiteIndex !== -1 && cols[websiteIndex] ? cols[websiteIndex].trim() : null,
          });
        }

        addLog(`Parsed ${parsedProspects.length} prospects from CSV locally. Starting server uploads...`);

        // 2. Chunk uploads in batches of 1000 to prevent server timeouts or network payload limit errors
        const chunkSize = 1000;
        let imported = 0;

        for (let i = 0; i < parsedProspects.length; i += chunkSize) {
          const batch = parsedProspects.slice(i, i + chunkSize);
          setImportProgress(Math.round((i / parsedProspects.length) * 100));

          const res = await fetch("/api/admin/email/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prospects: batch }),
          });

          const data = await res.json();
          if (data.success) {
            imported += data.count;
            setImportCount(imported);
          } else {
            console.error("Batch upload failure:", data.message);
          }
        }

        setImportProgress(100);
        addLog(`Import complete. Logged ${imported} new prospects into DB.`);
        alert(`Successfully imported ${imported} new prospects into queue!`);
        fetchQueue(1);
      } catch (err: any) {
        setImportError(err.message || "Failed parsing CSV data.");
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  // Search queue helper
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchQueue(1);
  };

  // Metric computations
  const deliveryRate = useMemo(() => {
    const sentCount = stats.SENT + stats.REPLIED;
    return stats.TOTAL > 0 && sentCount > 0
      ? ((sentCount / (stats.TOTAL - stats.PENDING - stats.GENERATING - stats.READY)) * 100).toFixed(1) + "%"
      : "0.0%";
  }, [stats]);

  const responseRate = useMemo(() => {
    const sentCount = stats.SENT + stats.REPLIED;
    return sentCount > 0
      ? ((stats.REPLIED / sentCount) * 100).toFixed(1) + "%"
      : "0.0%";
  }, [stats]);

  return (
    <div className="flex flex-col gap-8 text-left max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-[#2E2E2E]/60 pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Mail className="h-7 w-7 text-[#FF6200]" /> AI Outreach Suite
          </h1>
          <p className="text-xs text-[#888898] mt-1">Autonomous cold pitch generator, SMTP scheduler, and reports analytics.</p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <Button
            onClick={handleSyncReplies}
            variant="outline"
            className="text-xs font-mono py-2 px-3 border-[#2E2E2E] hover:border-[#FF6200]/50"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2 text-[#FF8C42]" /> Sync replies
          </Button>

          <Button
            onClick={handleTriggerManualSend}
            variant="outline"
            className="text-xs font-mono py-2 px-3 border-[#2E2E2E] hover:border-[#FF6200]/50"
          >
            <Play className="h-3.5 w-3.5 mr-2 text-emerald-500" /> Send Next
          </Button>

          <div className="flex items-center gap-2 bg-[#141414] border border-[#2E2E2E] px-3.5 py-1.5 rounded-lg">
            <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider">Pilot Loop:</span>
            <button
              onClick={() => setAutoPilotActive(!autoPilotActive)}
              className={`h-6 px-3 rounded text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 ${
                autoPilotActive
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {autoPilotActive ? (
                <>
                  <Play className="h-3 w-3 animate-pulse" /> ON
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3" /> OFF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Settings warning */}
      {(!gmailAppPassword || (!geminiApiKey && !openRouterApiKey)) && (
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs flex gap-3 items-center">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <div>
            <span className="font-bold">Setup Required:</span> Gmail App Passwords and at least one AI provider API key (Gemini or OpenRouter) are missing. Configure credentials in the <strong>Settings tab</strong> below to begin automated sending.
          </div>
        </div>
      )}

      {/* Tabs list */}
      <div className="flex border-b border-[#2E2E2E]">
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "reports"
              ? "border-[#FF6200] text-white bg-white/2"
              : "border-transparent text-[#888898] hover:text-white"
          }`}
        >
          📈 Performance & Reports
        </button>
        <button
          onClick={() => {
            setActiveTab("prospects");
            fetchQueue(1);
          }}
          className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "prospects"
              ? "border-[#FF6200] text-white bg-white/2"
              : "border-transparent text-[#888898] hover:text-white"
          }`}
        >
          👥 Prospects Queue ({stats.TOTAL})
        </button>
        <button
          onClick={() => {
            setActiveTab("settings");
            fetchSettings();
          }}
          className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "settings"
              ? "border-[#FF6200] text-white bg-white/2"
              : "border-transparent text-[#888898] hover:text-white"
          }`}
        >
          ⚙️ Settings Panel
        </button>
        <button
          onClick={() => {
            setActiveTab("brain");
            fetchBrainLogs(1);
          }}
          className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "brain"
              ? "border-[#FF6200] text-white bg-white/2"
              : "border-transparent text-[#888898] hover:text-white"
          }`}
        >
          🧠 Master Brain Logs
        </button>
      </div>

      {/* Tab 1: Reports Section */}
      {activeTab === "reports" && (
        <div className="flex flex-col gap-8">
          {/* KPI Dashboard cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="p-5 bg-[#141414] border border-[#2E2E2E] rounded-xl flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#888898] uppercase">Total Upload Pool</span>
              <span className="text-2xl font-extrabold text-white">{stats.TOTAL}</span>
              <span className="text-[9px] text-[#5A5A6A] mt-2">Maximum queue records cached</span>
            </div>

            <div className="p-5 bg-[#141414] border border-[#2E2E2E] rounded-xl flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#888898] uppercase">Total Emails Sent</span>
              <span className="text-2xl font-extrabold text-white text-[#FF8C42]">{stats.SENT + stats.REPLIED}</span>
              <span className="text-[9px] text-[#5A5A6A] mt-2">Delivered to client inboxes</span>
            </div>

            <div className="p-5 bg-[#141414] border border-[#2E2E2E] rounded-xl flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#888898] uppercase">Delivery Rate</span>
              <span className="text-2xl font-extrabold text-emerald-400">{deliveryRate}</span>
              <span className="text-[9px] text-[#5A5A6A] mt-2">Successful SMTP delivery SLA</span>
            </div>

            <div className="p-5 bg-[#141414] border border-[#2E2E2E] rounded-xl flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#888898] uppercase">AI Response Rate</span>
              <span className="text-2xl font-extrabold text-violet-400">{responseRate}</span>
              <span className="text-[9px] text-[#5A5A6A] mt-2">Reply conversations opened</span>
            </div>
          </div>

          {/* Sub-distribution row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status breakdown bar list */}
            <div className="p-6 bg-[#141414] border border-[#2E2E2E] rounded-xl md:col-span-2">
              <h3 className="font-display text-sm font-bold text-white mb-6">Queue Status Distribution</h3>
              <div className="flex flex-col gap-4">
                {[
                  { label: "Pending Generation", count: stats.PENDING, color: "bg-gray-600", val: "PENDING" },
                  { label: "AI Preloader Ready", count: stats.READY, color: "bg-blue-500", val: "READY" },
                  { label: "Delivered pitches", count: stats.SENT, color: "bg-emerald-500", val: "SENT" },
                  { label: "Replies received", count: stats.REPLIED, color: "bg-violet-500", val: "REPLIED" },
                  { label: "Sending / processing", count: stats.GENERATING + stats.SENDING, color: "bg-[#FF6200] animate-pulse", val: "SENDING" },
                  { label: "Delivery failures", count: stats.FAILED, color: "bg-red-500", val: "FAILED" },
                  { label: "Unsubscribed / Opted out", count: stats.UNSUBSCRIBED, color: "bg-[#FF3366]", val: "UNSUBSCRIBED" }
                ].map(item => {
                  const percentage = stats.TOTAL > 0 ? (item.count / stats.TOTAL) * 100 : 0;
                  return (
                    <div key={item.val} className="flex flex-col gap-1.5 text-xs">
                      <div className="flex justify-between items-center text-[#888898]">
                        <span className="font-bold text-[#ACACB8]">{item.label}</span>
                        <span className="font-mono text-white">{item.count} <span className="text-[10px] text-[#5A5A6A]">(${percentage.toFixed(1)}%)</span></span>
                      </div>
                      <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-[#2E2E2E]/40">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick pilot monitor logs */}
            <div className="p-6 bg-[#141414] border border-[#2E2E2E] rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-white mb-4">Pilot Engine Logs</h3>
                <div className="h-56 bg-black/50 border border-[#2E2E2E] rounded-lg p-3 font-mono text-[9px] text-[#888898] overflow-y-auto flex flex-col gap-1 text-left">
                  {cooldown > 0 && (
                    <div className="text-[#FF8C42] border-b border-[#2E2E2E] pb-1.5 mb-1.5 animate-pulse">
                      ⏳ Next automation tick in: {cooldown}s
                    </div>
                  )}
                  {liveLog.map((log, idx) => (
                    <div key={idx} className="whitespace-pre-wrap leading-tight break-all border-b border-[#2E2E2E]/20 pb-1">
                      {log}
                    </div>
                  ))}
                  {liveLog.length === 0 && (
                    <div className="text-center text-[#5A5A6A] py-16">
                      Engine logs will stream here during sends...
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#2E2E2E] mt-4 flex items-center justify-between text-[10px] font-mono text-[#888898]">
                <span>Daily Max cap: {dailyLimit}</span>
                <span>Send Delay: {intervalSeconds}s</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Queue / Prospects Manager */}
      {activeTab === "prospects" && (
        <div className="flex flex-col gap-6">
          {/* CSV Import Box */}
          <div className="p-6 bg-[#141414] border border-[#2E2E2E] rounded-xl flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="text-left">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <Upload className="h-4 w-4 text-[#FF8C42]" /> Load Prospects Database
              </h3>
              <p className="text-[11px] text-[#888898] mt-1 max-w-md">
                Upload CSV file containing headers: <code className="font-mono text-white">email</code>, <code className="font-mono text-white">name</code>, <code className="font-mono text-white">company</code>, <code className="font-mono text-white">industry</code>, <code className="font-mono text-white">website</code>. Larger files are split automatically.
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
              <label className="w-full md:w-auto text-center border border-dashed border-[#2E2E2E] hover:border-[#FF6200]/50 rounded-lg p-4 cursor-pointer text-xs font-mono uppercase bg-black/20 hover:bg-black/40 transition-all flex flex-col justify-center items-center gap-1.5 min-w-[200px]">
                <Plus className="h-5 w-5 text-[#FF6200]" /> Select CSV File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  disabled={importing}
                  className="hidden"
                />
              </label>

              {importing && (
                <div className="w-full text-xs font-mono text-[#888898] mt-2 flex flex-col gap-1 text-right">
                  <div className="flex justify-between items-center w-full">
                    <span>Import progress:</span>
                    <span className="font-bold text-[#FF8C42]">{importProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded overflow-hidden">
                    <div className="h-full bg-[#FF6200]" style={{ width: `${importProgress}%` }}></div>
                  </div>
                  <span>Uploaded: {importCount} records</span>
                </div>
              )}

              {importError && (
                <div className="text-red-400 text-[10px] font-mono mt-1 text-right max-w-xs break-all">
                  ⚠️ Error: {importError}
                </div>
              )}
            </div>
          </div>

          {/* Search, Filter grid */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 items-center bg-[#141414] border border-[#2E2E2E] p-4 rounded-xl">
            <div className="relative flex-grow w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#888898]">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search by name, email, company, or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#2E2E2E] rounded-lg text-xs text-white placeholder-[#888898] focus:outline-none focus:ring-1 focus:ring-[#FF6200] focus:border-[#FF6200] bg-black/40 transition-all"
              />
            </div>

            <div className="w-full sm:w-48 shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[#2E2E2E] rounded-lg text-xs text-white bg-black/40 focus:outline-none focus:ring-1 focus:ring-[#FF6200] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="GENERATING">GENERATING</option>
                <option value="READY">READY</option>
                <option value="SENDING">SENDING</option>
                <option value="SENT">SENT</option>
                <option value="REPLIED">REPLIED</option>
                <option value="FAILED">FAILED</option>
                <option value="UNSUBSCRIBED">UNSUBSCRIBED</option>
              </select>
            </div>

            <div className="flex gap-2 w-full sm:w-auto shrink-0">
              <Button type="submit" className="text-xs py-2 px-4 flex-grow sm:flex-grow-0">
                Search
              </Button>
              <Button
                type="button"
                onClick={handleClearQueue}
                variant="outline"
                className="text-xs py-2 px-3 border-red-950/40 text-red-400 hover:bg-red-950/20 w-12 flex justify-center items-center shrink-0"
                title="Wipe prospects queue"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Queue grid listing */}
          <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-[#2E2E2E]/60 text-[#888898] font-mono uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Prospect</th>
                    <th className="pb-3 font-semibold">Company / Sector</th>
                    <th className="pb-3 font-semibold">Outreach Content</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2E2E]/40 text-[#ACACB8]">
                  {prospects.map((p) => (
                    <tr key={p.id} className="hover:bg-white/2 transition-colors align-top">
                      {/* Name, email */}
                      <td className="py-4 max-w-[200px]">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-white">{p.name}</span>
                          <span className="font-mono text-[10px] text-[#888898] mt-1 break-all">{p.email}</span>
                          {p.website && (
                            <a
                              href={p.website.startsWith("http") ? p.website : `https://${p.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[9px] text-[#FF8C42] hover:underline mt-1"
                            >
                              {p.website}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Company, industry */}
                      <td className="py-4">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-white font-mono text-[10px] uppercase">{p.company || "General"}</span>
                          <span className="text-[10px] text-[#888898] mt-1">{p.industry || "N/A"}</span>
                        </div>
                      </td>

                      {/* Preview message */}
                      <td className="py-4 max-w-sm">
                        <div className="flex flex-col text-left">
                          {p.customSubject ? (
                            <>
                              <span className="text-white font-semibold text-[11px] line-clamp-1">Subj: {p.customSubject}</span>
                              <div
                                className="text-[10px] text-[#888898] line-clamp-2 mt-1 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: p.customBody || "" }}
                              ></div>
                            </>
                          ) : (
                            <span className="text-[#5A5A6A] font-mono text-[10px] italic">No pitch generated yet</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4">
                        <div className="flex flex-col items-start gap-1">
                          <Badge
                            variant={
                              p.status === "SENT"
                                ? "success"
                                : p.status === "REPLIED"
                                ? "violet"
                                : p.status === "UNSUBSCRIBED"
                                ? "dark"
                                : "orange"
                            }
                          >
                            {p.status}
                          </Badge>
                          {p.sentAt && (
                            <span className="text-[9px] text-[#5A5A6A] mt-1">
                              Sent: {new Date(p.sentAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          {p.customSubject && (
                            <Button
                              onClick={() => {
                                setEditingProspect(p);
                                setEditedSubject(p.customSubject || "");
                                setEditedBody(p.customBody || "");
                              }}
                              variant="outline"
                              className="h-7 w-7 p-0 border-[#2E2E2E] hover:border-[#FF6200]/50"
                              title="Edit custom email draft"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteProspect(p.id)}
                            variant="outline"
                            className="h-7 w-7 p-0 border-[#2E2E2E] hover:bg-red-950/20 hover:border-red-900/50 text-red-400"
                            title="Remove prospect"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {prospects.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center font-mono text-[#5A5A6A]">
                        {loadingQueue ? "Loading list records..." : "No prospects in queue matching filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#2E2E2E]/60">
                <span className="text-xs text-[#888898] font-mono">
                  Page {currentPage} of {totalPages}
                </span>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const prev = Math.max(1, currentPage - 1);
                      setCurrentPage(prev);
                      fetchQueue(prev);
                    }}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="py-1 px-2.5 h-8 text-[11px] font-mono flex items-center"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                  </Button>
                  <Button
                    onClick={() => {
                      const next = Math.min(totalPages, currentPage + 1);
                      setCurrentPage(next);
                      fetchQueue(next);
                    }}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="py-1 px-2.5 h-8 text-[11px] font-mono flex items-center"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Settings Config Panel */}
      {activeTab === "settings" && (
        <div className="p-6 bg-[#141414] border border-[#2E2E2E] rounded-xl flex flex-col gap-6 text-left">
          <div className="border-b border-[#2E2E2E] pb-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#FF6200]" /> Campaign Settings & Credentials
            </h3>
            <p className="text-xs text-[#888898] mt-1">Configure Gmail SMTP parameters, Gemini API models, and warm-up speeds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SMTP Fields */}
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-xs text-[#FF8C42] uppercase tracking-wider font-bold">SMTP Sender (Gmail App Passwords)</h4>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-[#888898]">Gmail Username:</label>
                <input
                  type="email"
                  value={gmailUser}
                  onChange={(e) => setGmailUser(e.target.value)}
                  className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  placeholder="connect.domainexpansion@gmail.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-[#888898]">Gmail App Password (16 chars):</label>
                <input
                  type="password"
                  value={gmailAppPassword}
                  onChange={(e) => setGmailAppPassword(e.target.value)}
                  className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  placeholder="xxxx xxxx xxxx xxxx"
                />
                <span className="text-[9px] text-[#5A5A6A] leading-relaxed">
                  * Must be a 16-character App Password generated in Google Account settings (Security &gt; 2-Step Verification &gt; App passwords). Standard Gmail passwords are not supported by SMTP endpoints.
                </span>
              </div>
            </div>

            {/* AI Config */}
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-xs text-[#FF8C42] uppercase tracking-wider font-bold">AI Language Model Providers</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-[#888898]">Preferred Provider:</label>
                  <select
                    value={preferredProvider}
                    onChange={(e) => setPreferredProvider(e.target.value)}
                    className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="GOOGLE">Google Gemini API</option>
                    <option value="OPENROUTER">OpenRouter API</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 justify-end">
                  <label className="flex items-center gap-2 text-[11px] font-mono text-[#888898] cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={fallbackEnabled}
                      onChange={(e) => setFallbackEnabled(e.target.checked)}
                      className="rounded border-[#2E2E2E] text-[#FF6200] focus:ring-0 cursor-pointer bg-black/40"
                    />
                    Enable Auto-Fallback / Failover
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-[#888898]">Gemini API Key:</label>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    placeholder="AIzaSy..."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-[#888898]">OpenRouter API Key:</label>
                  <input
                    type="password"
                    value={openRouterApiKey}
                    onChange={(e) => setOpenRouterApiKey(e.target.value)}
                    className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    placeholder="sk-or-v1-..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-[#888898]">OpenRouter Model ID:</label>
                  <input
                    type="text"
                    value={openRouterModel}
                    onChange={(e) => setOpenRouterModel(e.target.value)}
                    className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    placeholder="google/gemini-2.0-flash"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono text-[#888898]">Daily Send Limit:</label>
                    <input
                      type="number"
                      value={dailyLimit}
                      onChange={(e) => setDailyLimit(Number(e.target.value))}
                      min={1}
                      max={500}
                      className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono text-[#888898]">Cooldown (s):</label>
                    <input
                      type="number"
                      value={intervalSeconds}
                      onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                      min={10}
                      max={1200}
                      className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Master Prompt Customizers */}
          <div className="flex flex-col gap-4 border-t border-[#2E2E2E]/60 pt-6">
            <h4 className="font-mono text-xs text-[#FF8C42] uppercase tracking-wider font-bold">AI Pitch Generation Prompts</h4>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono text-[#888898]">Prospecting Pitch prompt:</label>
              <textarea
                value={pitchPrompt}
                onChange={(e) => setPitchPrompt(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none resize-none leading-relaxed"
                placeholder="Pitching guidelines..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono text-[#888898]">AI Follow-up & Reply Prompt:</label>
              <textarea
                value={replyPrompt}
                onChange={(e) => setReplyPrompt(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none resize-none leading-relaxed"
                placeholder="Reply guidelines..."
              />
            </div>
          </div>

          {/* Action trigger row */}
          <div className="flex justify-between items-center border-t border-[#2E2E2E]/60 pt-6 mt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#ACACB8]">Campaign Status:</span>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all ${
                  isActive
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                    : "bg-gray-500/10 border border-gray-500/20 text-gray-400"
                }`}
              >
                {isActive ? "ACTIVE" : "INACTIVE"}
              </button>
            </div>

            <Button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="text-xs px-6 py-2.5 font-mono uppercase tracking-wider"
            >
              <Save className="h-3.5 w-3.5 mr-2" /> Save Configuration
            </Button>
          </div>
        </div>
      )}

      {/* Tab 4: Master Brain Logs */}
      {activeTab === "brain" && (
        <div className="flex flex-col gap-6">
          <form onSubmit={handleBrainSearchSubmit} className="flex flex-col sm:flex-row gap-4 items-center bg-[#141414] border border-[#2E2E2E] p-4 rounded-xl">
            <div className="relative flex-grow w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#888898]">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search logs by email, prompt, response, model, error..."
                value={brainSearchQuery}
                onChange={(e) => setBrainSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#2E2E2E] rounded-lg text-xs text-white placeholder-[#888898] focus:outline-none focus:ring-1 focus:ring-[#FF6200] focus:border-[#FF6200] bg-black/40 transition-all"
              />
            </div>

            <div className="w-full sm:w-48 shrink-0">
              <select
                value={brainStatusFilter}
                onChange={(e) => setBrainStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[#2E2E2E] rounded-lg text-xs text-white bg-black/40 focus:outline-none focus:ring-1 focus:ring-[#FF6200] cursor-pointer"
              >
                <option value="all">All Outcomes</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>

            <Button type="submit" className="text-xs py-2 px-6 shrink-0 w-full sm:w-auto">
              Search Logs
            </Button>
          </form>

          <div className="p-6 rounded-xl border border-[#2E2E2E] bg-[#141414] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#2E2E2E]/60 text-[#888898] font-mono uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Date & Time</th>
                    <th className="pb-3 font-semibold">Prospect</th>
                    <th className="pb-3 font-semibold">Provider / Model</th>
                    <th className="pb-3 font-semibold">Prompt Snippet</th>
                    <th className="pb-3 font-semibold">Output / Error</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2E2E]/40 text-[#ACACB8]">
                  {brainLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/2 transition-colors align-top">
                      <td className="py-4 font-mono text-[10px] text-[#888898] whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-4">
                        <span className="font-mono text-[10px] text-white break-all max-w-[150px] block">
                          {log.prospectEmail || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-white font-mono text-[10px] uppercase">
                            {log.provider}
                          </span>
                          <span className="text-[10px] text-[#888898] font-mono mt-0.5">
                            {log.model}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 max-w-[200px]">
                        <p className="line-clamp-2 text-[#888898] leading-relaxed animate-none" title={log.prompt}>
                          {log.prompt}
                        </p>
                      </td>
                      <td className="py-4 max-w-[250px]">
                        {log.status === "SUCCESS" ? (
                          <div
                            className="line-clamp-2 text-emerald-400 font-mono text-[10px] leading-relaxed"
                            title={log.response || ""}
                            dangerouslySetInnerHTML={{ __html: log.response || "" }}
                          ></div>
                        ) : (
                          <p className="line-clamp-2 text-red-400 font-mono text-[10px] leading-relaxed" title={log.errorMessage || ""}>
                            {log.errorMessage}
                          </p>
                        )}
                      </td>
                      <td className="py-4">
                        <Badge variant={log.status === "SUCCESS" ? "success" : "orange"}>
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}

                  {brainLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center font-mono text-[#5A5A6A]">
                        {loadingBrainLogs ? "Loading log records..." : "No logs found matching filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {brainTotalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#2E2E2E]/60">
                <span className="text-xs text-[#888898] font-mono">
                  Page {brainPage} of {brainTotalPages}
                </span>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const prev = Math.max(1, brainPage - 1);
                      setBrainPage(prev);
                      fetchBrainLogs(prev);
                    }}
                    disabled={brainPage === 1}
                    variant="outline"
                    className="py-1 px-2.5 h-8 text-[11px] font-mono flex items-center"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                  </Button>
                  <Button
                    onClick={() => {
                      const next = Math.min(brainTotalPages, brainPage + 1);
                      setBrainPage(next);
                      fetchBrainLogs(next);
                    }}
                    disabled={brainPage === brainTotalPages}
                    variant="outline"
                    className="py-1 px-2.5 h-8 text-[11px] font-mono flex items-center"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Edit Pitch Draft Modal Component */}
      {editingProspect && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#141414] border border-[#FF6200]/30 rounded-xl max-w-2xl w-full p-6 relative flex flex-col gap-5 text-left box-shadow-glow">
            <button
              onClick={() => setEditingProspect(null)}
              className="absolute top-4 right-4 text-[#888898] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="font-display text-base font-bold text-white">Adjust Customized AI Draft</h3>
              <p className="text-[11px] text-[#888898] mt-0.5">Email prospect: <span className="text-[#FF8C42] font-mono">{editingProspect.email}</span></p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-[#888898] uppercase">Email Subject Line:</label>
                <input
                  type="text"
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-[#888898] uppercase">Email HTML Body Content:</label>
                <textarea
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  rows={10}
                  className="w-full bg-black/40 border border-[#2E2E2E] focus:border-[#FF6200] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#2E2E2E]/60">
              <Button
                onClick={() => setEditingProspect(null)}
                variant="outline"
                className="text-xs py-2 px-4 border-[#2E2E2E]"
              >
                Discard Edits
              </Button>
              <Button
                onClick={handleSaveDraft}
                disabled={savingDraft}
                className="text-xs py-2 px-5 font-mono uppercase tracking-wider"
              >
                <Save className="h-3.5 w-3.5 mr-2" /> Save as Ready
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
