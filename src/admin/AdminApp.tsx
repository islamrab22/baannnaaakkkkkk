import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AdminLayout from "./components/AdminLayout.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import NewsPage from "./pages/NewsPage.tsx";
import CampaignsPage from "./pages/CampaignsPage.tsx";
import BranchesPage from "./pages/BranchesPage.tsx";
import MessagesPage from "./pages/MessagesPage.tsx";
import LoanRequestsPage from "./pages/LoanRequestsPage.tsx";
import CardRequestsPage from "./pages/CardRequestsPage.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

export default function AdminApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-center" richColors closeButton />
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route
            path=""
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="branches" element={<BranchesPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="loan-requests" element={<LoanRequestsPage />} />
            <Route path="card-requests" element={<CardRequestsPage />} />
            <Route
              path="users"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
