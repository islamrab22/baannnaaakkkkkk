import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Package, Newspaper, Megaphone, MapPin, Users, Mail, Landmark, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    return <div className="text-center py-20 text-gray-400 font-bold text-sm">{t("dashboard.loading")}</div>;
  }

  const requestData = [
    { name: t("dashboard.loanRequestsLabel"), pending: stats.loanRequests.pending },
    { name: t("dashboard.cardRequestsLabel"), pending: stats.cardRequests.pending },
    { name: t("dashboard.unreadMessagesLabel"), pending: stats.messages.unread },
  ];

  const messageTypeData = stats.messages.byType.map((m) => ({ name: t(`messages.types.${m.type}`, m.type), value: m.count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white">
          {t("dashboard.welcomeBack", { name: user?.name?.split(" ")[0] })}
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-1">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label={t("dashboard.totalProducts")} value={stats.products.total} sub={t("dashboard.published", { count: stats.products.published })} />
        <StatCard icon={Newspaper} label={t("dashboard.newsArticles")} value={stats.news.total} sub={t("dashboard.published", { count: stats.news.published })} />
        <StatCard icon={Megaphone} label={t("dashboard.campaigns")} value={stats.campaigns.total} />
        <StatCard icon={MapPin} label={t("dashboard.branches")} value={stats.branches.total} />
        <StatCard icon={Mail} label={t("dashboard.unreadMessages")} value={stats.messages.unread} />
        <StatCard icon={Landmark} label={t("dashboard.pendingLoanRequests")} value={stats.loanRequests.pending} />
        <StatCard icon={CreditCard} label={t("dashboard.pendingCardRequests")} value={stats.cardRequests.pending} />
        <StatCard icon={Users} label={t("dashboard.staffUsers")} value={stats.users.total} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5">
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("dashboard.pendingFollowUps")}</h3>
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
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("dashboard.messagesByType")}</h3>
          {messageTypeData.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-xs font-bold text-gray-400">{t("dashboard.noMessagesYet")}</div>
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
