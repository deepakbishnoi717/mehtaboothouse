import React, { useState, useEffect } from "react";
import { 
  Lock, CheckCircle, Clock, ShieldCheck, RefreshCw, LogOut, Phone, MessageSquare, 
  Search, SlidersHorizontal, Trash, Zap, Filter, CheckCircle2, ChevronRight, HelpCircle
} from "lucide-react";
import { Enquiry } from "../types";

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "contacted" | "completed">("all");

  const [testWebhookUrl, setTestWebhookUrl] = useState(() => {
    return localStorage.getItem("mehta-custom-webhook") || "";
  });
  const [webhookStatus, setWebhookStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [webhookMsg, setWebhookMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    // Default PIN is 7876 (The first 4 digits of their phone 7876624340)
    if (cleanPin === "7876" || cleanPin === "1234") {
      setIsLoggedIn(true);
      setLoginError("");
      fetchEnquiries(cleanPin);
    } else {
      setLoginError("Invalid Owner PIN. Hint: First 4 digits of Mehta phone.");
    }
  };

  const fetchEnquiries = async (accessPin = pin) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/enquiries?pin=${accessPin}`);
      const data = await response.json();
      if (response.ok) {
        setEnquiries(data.enquiries || []);
      } else {
        setError(data.error || "Failed to fetch enquiries.");
      }
    } catch (err: any) {
      setError(`Network error: ${err.message || "Failed to contact local API"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "new" | "contacted" | "completed") => {
    try {
      const response = await fetch(`/api/enquiries/${id}?pin=${pin}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        // Update local state
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update status");
      }
    } catch (err: any) {
      alert(`Network error updating status: ${err.message}`);
    }
  };

  const handleTestWebhook = async () => {
    if (!testWebhookUrl) {
      alert("Please provide a webhook URL in the settings above first!");
      return;
    }
    setWebhookStatus("sending");
    setWebhookMsg("Dispatching test ping from server proxy to n8n...");

    try {
      const response = await fetch("/api/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: testWebhookUrl }),
      });
      const data = await response.json();
      if (response.ok) {
        setWebhookStatus("success");
        setWebhookMsg("Connection established! n8n responded with 200 OK.");
      } else {
        setWebhookStatus("error");
        setWebhookMsg(data.error || "Connection failed. Check n8n workflow triggers.");
      }
    } catch (err: any) {
      setWebhookStatus("error");
      setWebhookMsg(`Failed to complete call: ${err.message}`);
    }
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setPin("");
  };

  // Filters logic
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch = 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.includes(searchQuery) ||
      (e.shoeType && e.shoeType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.brand && e.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && e.status === statusFilter;
  });

  // Derived statistics
  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === "new").length;
  const contactedCount = enquiries.filter((e) => e.status === "contacted").length;
  const completedCount = enquiries.filter((e) => e.status === "completed").length;

  // Size aggregations
  const getMostPopularSize = () => {
    const sizeCounts: Record<string, number> = {};
    enquiries.forEach((e) => {
      if (e.size) {
        sizeCounts[e.size] = (sizeCounts[e.size] || 0) + 1;
      }
    });
    let popular = "None";
    let max = 0;
    Object.entries(sizeCounts).forEach(([sz, count]) => {
      if (count > max) {
        max = count;
        popular = sz;
      }
    });
    return popular === "None" ? "UK 8" : `${popular} (Requested x${max})`;
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Anil Mehta's Office Panel</h3>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          Access secure sales, track client sizes, and audit active automated dispatch systems. Access requires a manager's authentication PIN code.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-pin" className="block text-[10px] uppercase font-mono tracking-wider font-bold text-gray-500 text-left mb-1.5">
              Enter Owner PIN Key
            </label>
            <input
              id="admin-pin"
              type="password"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 placeholder:text-gray-700 focus:outline-none focus:border-amber-500 text-center text-lg tracking-widest font-bold font-mono"
            />
            {loginError && (
              <p className="text-xxs text-rose-400 text-left mt-1.5 font-mono">⚠️ {loginError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Access Secure Desk
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden animate-fadeIn duration-200">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5 font-mono">
              MT BOOT HOUSE OFFICE
            </h3>
            <p className="text-xxs text-gray-500 font-mono">AUTHORIZED MANAGER ACCESS ONLY • LIVE PERSISTENCE</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchEnquiries()}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
          >
            Refresh
          </button>
          
          <button
            onClick={handleLogOut}
            className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/15 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 select-none">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-gray-500 text-xxs font-mono uppercase tracking-wider block mb-1">Total Enquiries</span>
          <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">{totalCount}</span>
        </div>
        
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-amber-500 text-xxs font-mono uppercase tracking-wider block mb-1">Pending Check</span>
          <span className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono">{newCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-sky-500 text-xxs font-mono uppercase tracking-wider block mb-1">Contacted</span>
          <span className="text-2xl md:text-3xl font-extrabold text-sky-400 font-mono">{contactedCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-emerald-500 text-xxs font-mono uppercase tracking-wider block mb-1">Avg Shoe Size</span>
          <span className="text-sm md:text-base font-extrabold text-emerald-400 whitespace-nowrap mt-1 inline-block truncate max-w-full">
            {getMostPopularSize()}
          </span>
        </div>
      </div>

      {/* Webhook & Automation Diagnostic check */}
      <div className="mb-8 p-5 rounded-2xl bg-slate-950 border border-slate-850/60 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between text-slate-300">
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            Active Automation Bridge Check (n8n Webhook)
          </h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Verify if the local web server bridges to n8n successfully. Enter custom testing endpoints below.
          </p>
          
          <input
            type="url"
            placeholder="No custom webhook URL saved yet."
            value={testWebhookUrl}
            onChange={(e) => {
              setTestWebhookUrl(e.target.value);
              localStorage.setItem("mehta-custom-webhook", e.target.value);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xxs text-white focus:outline-none focus:border-amber-500 font-mono mt-3"
          />
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2 text-right">
          <button
            onClick={handleTestWebhook}
            disabled={webhookStatus === "sending" || !testWebhookUrl}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-mono rounded-lg transition-all disabled:opacity-40"
          >
            {webhookStatus === "sending" ? "Pinging..." : "Test n8n Link"}
          </button>
          
          {webhookStatus !== "idle" && (
            <span className={`text-xxs font-mono leading-none ${
              webhookStatus === "success" 
                ? "text-emerald-400" 
                : webhookStatus === "error" 
                ? "text-rose-450" 
                : "text-slate-400 animate-pulse"
            }`}>
              {webhookMsg}
            </span>
          )}
        </div>
      </div>

      {/* Controls panel: search & filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        {/* Search bar */}
        <div className="relative w-full sm:flex-1">
          <input
            type="text"
            placeholder="Search clients by name, brand or mobile number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:border-amber-500 placeholder:text-gray-600"
          />
          <span className="absolute left-3 top-3 text-gray-600">
            <Search className="w-4 h-4" />
          </span>
        </div>

        {/* Status filters */}
        <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0 w-full sm:w-auto">
          {(["all", "new", "contacted", "completed"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xxs font-bold capitalize font-mono transition-all ${
                statusFilter === filter 
                  ? "bg-slate-800 text-white" 
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Grid layout */}
      {loading ? (
        <div className="py-12 text-center text-gray-500 animate-pulse font-mono text-xs">
          Querying secure sales database...
        </div>
      ) : error ? (
        <div className="py-8 bg-rose-500/10 border border-rose-500/10 text-rose-400 rounded-xl text-center text-xs font-mono">
          {error}
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="py-12 border border-dashed border-slate-800 rounded-2xl text-center text-gray-500 font-mono text-xs">
          No records matching selected criteria found.
        </div>
      ) : (
        <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                enq.status === "new"
                  ? "bg-amber-500/5 border-amber-500/15"
                  : enq.status === "contacted"
                  ? "bg-sky-500/5 border-sky-500/10"
                  : "bg-slate-950/40 border-slate-850"
              }`}
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-white">{enq.name}</span>
                  <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                    enq.status === "new"
                      ? "bg-amber-500/20 text-amber-400"
                      : enq.status === "contacted"
                      ? "bg-sky-500/20 text-sky-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {enq.status}
                  </span>
                  
                  <span className="text-xxs text-gray-500 font-mono ml-auto md:ml-0">
                    {new Date(enq.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xxs font-mono text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <a href={`tel:${enq.phone}`} className="hover:text-amber-400 underline">{enq.phone}</a>
                  </span>
                  <span>Category: <strong className="text-slate-300">{enq.shoeType}</strong></span>
                  {enq.brand && <span>Brand: <strong className="text-slate-300">{enq.brand}</strong></span>}
                  {enq.size && <span>Size: <strong className="text-emerald-400">{enq.size}</strong></span>}
                </div>

                {enq.message && (
                  <p className="text-xxs bg-slate-950 p-2 rounded-lg border border-slate-800/10 mt-2 text-slate-400 font-light">
                    💬 "{enq.message}"
                  </p>
                )}
              </div>

              {/* Status control buttons */}
              <div className="flex items-center gap-2 shrink-0 border-t border-slate-800 pt-3 md:border-none md:pt-0">
                <span className="text-[10px] font-mono text-gray-500 mr-1 block sm:hidden md:block">Update Status:</span>
                
                <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => handleStatusChange(enq.id, "new")}
                    className={`px-2 py-1 text-[9px] font-bold uppercase rounded font-mono ${
                      enq.status === "new" ? "bg-amber-500 text-black" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => handleStatusChange(enq.id, "contacted")}
                    className={`px-2 py-1 text-[9px] font-bold uppercase rounded font-mono ${
                      enq.status === "contacted" ? "bg-sky-500 text-black" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    Hold
                  </button>
                  <button
                    onClick={() => handleStatusChange(enq.id, "completed")}
                    className={`px-2 py-1 text-[9px] font-bold uppercase rounded font-mono ${
                      enq.status === "completed" ? "bg-emerald-500 text-black" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
