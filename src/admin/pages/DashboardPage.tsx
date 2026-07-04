import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Package, Newspaper, Megaphone, MapPin, Users, Mail, Landmark, CreditCard } from "lucide-react";
import { api } from "../api/client.ts";
import type { DashboardStats } from "../types.ts";
import { useAuth } from "../context/AuthContext.tsx";

const PIE_COLORS = ["#9B1A5C", "#7B1046", "#D46FA1", "#F0B7D4", "#4C1029"];

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; sub?: string }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-black text-gray-900 dark:text-white leading-none">{value}</div>
        <div className="text-[11px] font-bold text-gray-400 mt-1">{label}</div>
        {sub && <div className="text-[10px] font-bold text-emerald-600 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DashboardStats>("/api/admin/dashboard/stats")
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return <div className="text-center py-20 text-gray-400 font-bold text-sm">Loading dashboard...</div>;
  }

  const requestData = [
    { name: "Loan Requests", pending: stats.loanRequests.pending },
    { name: "Card Requests", pending: stats.cardRequests.pending },
    { name: "Unread Messages", pending: stats.messages.unread },
  ];

  const messageTypeData = stats.messages.byType.map((m) => ({ name: m.type, value: m.count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-xs text-gray-400 font-medium mt-1">Here is what's happening across the platform today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={stats.products.total} sub={`${stats.products.published} published`} />
        <StatCard icon={Newspaper} label="News Articles" value={stats.news.total} sub={`${stats.news.published} published`} />
        <StatCard icon={Megaphone} label="Campaigns" value={stats.campaigns.total} />
        <StatCard icon={MapPin} label="Branches" value={stats.branches.total} />
        <StatCard icon={Mail} label="Unread Messages" value={stats.messages.unread} />
        <StatCard icon={Landmark} label="Pending Loan Requests" value={stats.loanRequests.pending} />
        <StatCard icon={CreditCard} label="Pending Card Requests" value={stats.cardRequests.pending} />
        <StatCard icon={Users} label="Staff Users" value={stats.users.total} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5">
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Pending Follow-ups</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={requestData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-neutral-800" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="pending" fill="#9B1A5C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5">
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Messages by Type</h3>
          {messageTypeData.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-xs font-bold text-gray-400">No messages yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={messageTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {messageTypeData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
