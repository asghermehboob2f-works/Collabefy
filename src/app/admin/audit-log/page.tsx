import React from "react";
import { getAuditLogs } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { History, ShieldAlert } from "lucide-react";

export default function AdminAuditLogPage() {
  const logs = getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-border">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
          Security & Compliance
        </span>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text">
          Administrative Audit Trail
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          Immutable logging of staff actions, rate updates, pool allocations, and verification approvals.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-text-subtle">
                <th className="py-3 px-4 font-medium">Timestamp</th>
                <th className="py-3 px-4 font-medium">Administrator</th>
                <th className="py-3 px-4 font-medium">Action</th>
                <th className="py-3 px-4 font-medium">Target</th>
                <th className="py-3 px-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-2/20 transition-colors">
                  <td className="py-3 px-4 text-text-subtle whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 font-medium text-text whitespace-nowrap">
                    {log.adminName}
                  </td>
                  <td className="py-3 px-4 font-semibold text-accent whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-text max-w-xs truncate">
                    {log.targetTitle}
                  </td>
                  <td className="py-3 px-4 text-text-muted max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

