import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLeadsPage from './pages/admin/AdminLeadsPage';
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage';
import AdminAgentsPage from './pages/admin/AdminAgentsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// Protected Route Guard
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <Navigate to="/admin/dashboard" replace />;
};

const App: React.FC = () => (
  <Routes>
    {/* Public */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:id" element={<PropertyDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Route>

    {/* Auth */}
    <Route path="/login" element={<LoginPage />} />

    {/* Dashboard (Protected) */}
    <Route path="/admin" element={<DashboardLayout />}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="leads" element={<AdminLeadsPage />} />
      <Route path="properties" element={<AdminRoute><AdminPropertiesPage /></AdminRoute>} />
      <Route path="agents" element={<AdminRoute><AdminAgentsPage /></AdminRoute>} />
      <Route path="analytics" element={<AdminRoute><AdminAnalyticsPage /></AdminRoute>} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
