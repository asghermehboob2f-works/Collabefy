"use client";

import React, { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import { apiGet, apiPost, apiPatch } from "@/lib/api-client";
import {
  MessageSquare,
  Search,
  RefreshCw,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  ShieldAlert,
} from "lucide-react";

interface TicketItem {
  id: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "WAITING_USER" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    role: string;
    creatorProfile?: { displayName: string };
    brandProfile?: { companyName: string };
  };
  _count?: { messages: number };
}

interface MessageItem {
  id: string;
  message: string;
  isInternal: boolean;
  createdAt: string;
  sender?: {
    email: string;
    role: string;
  };
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await apiGet<{ success: boolean; data: TicketItem[] }>("/api/v1/support/tickets");
      if (res?.data) {
        setTickets(res.data);
      }
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSelectTicket = async (ticket: TicketItem) => {
    setSelectedTicket(ticket);
    try {
      setLoadingMessages(true);
      const res = await apiGet<{ success: boolean; data: { messages: MessageItem[] } }>(
        `/api/v1/support/tickets/${ticket.id}`
      );
      if (res?.data?.messages) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("Failed to load ticket conversation:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    try {
      setIsSending(true);
      const res = await apiPost<{ success: boolean; data: MessageItem }>(
        `/api/v1/support/tickets/${selectedTicket.id}/messages`,
        { message: replyText.trim() }
      );

      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
        setReplyText("");
      }
    } catch (err: any) {
      alert(`Failed to send reply: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicket) return;
    try {
      await apiPatch(`/api/v1/support/admin/tickets/${selectedTicket.id}`, { status });
      setSelectedTicket((prev) => (prev ? { ...prev, status: status as any } : null));
      setTickets((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: status as any } : t))
      );
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const filtered = tickets.filter((t) => {
    const userDisplay = t.user?.creatorProfile?.displayName || t.user?.brandProfile?.companyName || t.user?.email || "";
    const matchesSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      userDisplay.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Customer Experience
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-text">
            Support Desk & Inquiries ({tickets.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Triage creator payment questions, brand campaign proposals, and platform dispute tickets.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text hover:bg-surface-3 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ticket List (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-1 py-1.5 pl-9 pr-3 text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-accent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-border bg-surface-1 px-3 py-1.5 text-xs font-mono text-text focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="rounded-xl border border-border bg-surface-1 divide-y divide-border/60 max-h-[650px] overflow-y-auto">
            {loading && tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-subtle font-mono">
                <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-accent" />
                Loading support tickets...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-subtle font-mono">
                No tickets matching criteria.
              </div>
            ) : (
              filtered.map((t) => {
                const senderName = t.user?.creatorProfile?.displayName || t.user?.brandProfile?.companyName || t.user?.email || "User";
                const isSelected = selectedTicket?.id === t.id;

                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTicket(t)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? "bg-surface-2 border-l-2 border-l-accent" : "hover:bg-surface-2/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-mono text-text-subtle truncate max-w-[200px]">
                        {senderName}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold border ${
                          t.status === "OPEN"
                            ? "bg-warning/10 text-warning border-warning/30"
                            : t.status === "RESOLVED"
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-surface-3 text-text-muted border-border"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-text line-clamp-1">{t.subject}</div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-text-subtle mt-2">
                      <span>{t.category}</span>
                      <span>{formatDate(t.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Conversation Thread (Right 7 Cols) */}
        <div className="lg:col-span-7 rounded-xl border border-border bg-surface-1 p-6 flex flex-col min-h-[500px] max-h-[700px]">
          {selectedTicket ? (
            <>
              {/* Thread Header */}
              <div className="pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold uppercase text-accent">
                      {selectedTicket.category}
                    </span>
                    <span className="text-xs font-mono text-text-subtle">
                      • Priority: {selectedTicket.priority}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-text mt-0.5">{selectedTicket.subject}</h3>
                  <div className="text-xs text-text-muted mt-0.5">
                    From: {selectedTicket.user?.email} ({selectedTicket.user?.role})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    className="rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-mono text-text focus:outline-none"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {loadingMessages ? (
                  <div className="py-8 text-center text-xs text-text-subtle font-mono">
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-accent" />
                    Loading conversation...
                  </div>
                ) : (
                  messages.map((m) => {
                    const isStaff = m.sender?.role?.includes("ADMIN") || m.sender?.role === "SUPER_ADMIN";

                    return (
                      <div
                        key={m.id}
                        className={`rounded-lg p-3 text-xs space-y-1.5 ${
                          isStaff
                            ? "bg-accent/10 border border-accent/20 ml-6"
                            : "bg-surface-2 border border-border mr-6"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className={isStaff ? "font-bold text-accent" : "text-text-subtle"}>
                            {isStaff ? "Collabefy Staff" : m.sender?.email || "User"}
                          </span>
                          <span className="text-text-subtle">{formatDate(m.createdAt)}</span>
                        </div>
                        <p className="text-text leading-relaxed whitespace-pre-wrap">{m.message}</p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-border flex gap-2">
                <input
                  type="text"
                  placeholder="Type an official response..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={isSending || !replyText.trim()}
                  className="rounded-md bg-accent px-4 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-8 text-text-subtle">
              <MessageSquare className="w-10 h-10 mb-2 opacity-40 text-accent" />
              <div className="text-sm font-semibold text-text">No Ticket Selected</div>
              <p className="text-xs text-text-muted mt-1 max-w-xs">
                Select an inquiry from the left panel to review message history, inspect creator details, and post replies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
