import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard, Package, Newspaper, Megaphone, MapPin, Mail, Landmark, CreditCard,
  Users, Settings, UserCircle, LogOut, Moon, Sun, Menu, ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { useTheme } from "../context/ThemeContext.tsx";
import type { Role } from "../types.ts";

interface NavItem {
  to: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { to: "/admin", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/admin/products", labelKey: "nav.products", icon: Package },
  { to: "/admin/news", labelKey: "nav.news", icon: Newspaper },
  { to: "/admin/campaigns", labelKey: "nav.campaigns", icon: Megaphone },
  { to: "/admin/branches", labelKey: "nav.branches", icon: MapPin },
  { to: "/admin/messages", labelKey: "nav.messages", icon: Mail },
  { to: "/admin/loan-requests", labelKey: "nav.loanRequests", icon: Landmark },
  { to: "/admin/card-requests", labelKey: "nav.cardRequests", icon: CreditCard },
  { to: "/admin/users", labelKey: "nav.users", icon: Users, roles: ["ADMIN"] },
  { to: "/admin/settings", labelKey: "nav.settings", icon: Settings, roles: ["ADMIN"] },
  { to: "/admin/profile", labelKey: "nav.profile", icon: UserCircle },
];

export default function AdminLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || (user && item.roles.includes(user.role)));

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-200 dark:border-neutral-800">
        <div className="w-9 h-9 rounded-lg bg-brand text-white flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-black text-gray-900 dark:text-white leading-none">{t("layout.appName")}</h1>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t("layout.adminConsole")}</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                isActive
                  ? "bg-brand text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-neutral-800"
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 dark:border-neutral-800 p-3 space-y-2">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-brand-light text-brand flex items-center justify-center text-xs font-black shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-gray-900 dark:text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase truncate">
              {user ? t(`roles.${user.role}`) : ""}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t("nav.logout")}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 flex text-gray-900 dark:text-gray-100">
      <aside className="hidden lg:block w-64 shrink-0 border-l border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-neutral-900 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button className="lg:hidden p-2 -mr-2" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block" />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
            aria-label={t("layout.toggleDarkMode")}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
