"use client";

import React, { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import { apiGet } from "@/lib/api-client";
import { History, RefreshCw, Search } from "lucide-react";

interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  targetResource: string;
  targetId?: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  status: string;
  createdAt: string;
  admin?: {
    email: string;
    role: string;
    adminProfile?: {
      department?: string;
    };
  };
}

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await apiGet<{ success: boolean; data: { logs: AuditLogEntry[] } }>("/api/v1/admin/audit-logs");
      if (res?.data?.logs) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const actionMatches = actionFilter === "ALL" || log.action.includes(actionFilter);
    const searchMatches =
      !search ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(search.toLowerCase()) ||
      (log.admin?.email || "").toLowerCase().includes(search.toLowerCase());
    return actionMatches && searchMatches;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Security & Compliance
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text">
            Administrative Audit Trail ({logs.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Immutable logging of staff actions, rate updates, pool allocations, and verification approvals stored in database.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text hover:bg-surface-3 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="w-3.5 h-3.5 text-text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action, resource, or admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-1 py-1.5 pl-9 pr-3 text-xs text-text placeholder:text-text-subtle focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "CAMPAIGN", "SUBMISSION", "CMS", "LOGIN"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActionFilter(cat)}
              className={`rounded px-3 py-1 text-xs font-mono capitalize transition-colors ${
                actionFilter === cat
                  ? "bg-surface-3 text-accent border border-accent/30 font-semibold"
                  : "bg-surface-1 text-text-muted border border-border hover:text-text"
              }`}
            >
              {cat.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-surface-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-text-subtle">
                <th className="py-3 px-4 font-medium">Timestamp</th>
                <th className="py-3 px-4 font-medium">Administrator</th>
                <th className="py-3 px-4 font-medium">Action</th>
                <th className="py-3 px-4 font-medium">Target Resource</th>
                <th className="py-3 px-4 font-medium">State Mutation</th>
                <th className="py-3 px-4 font-medium text-right">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs font-mono text-text-subtle">
                    {loading ? "Loading audit records from database..." : "No matching audit log records found."}
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-2/20 transition-colors">
                    <td className="py-3 px-4 text-text-subtle whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="py-3 px-4 font-medium text-text whitespace-nowrap">
                      <div>{log.admin?.email || log.adminId}</div>
                      <div className="text-[10px] text-text-subtle font-mono">
                        {log.admin?.adminProfile?.department || log.admin?.role || "Staff"}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-accent whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-text max-w-xs truncate">
                      <span className="bg-surface-2 px-1.5 py-0.5 rounded border border-border text-[11px]">
                        {log.targetResource} {log.targetId ? `(${log.targetId})` : ""}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-muted max-w-md truncate font-mono text-[11px]">
                      {log.newValue ? log.newValue : log.previousValue || "Action executed"}
                    </td>
                    <td className="py-3 px-4 text-right text-text-subtle font-mono text-[11px] whitespace-nowrap">
                      {log.ipAddress || "127.0.0.1"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
