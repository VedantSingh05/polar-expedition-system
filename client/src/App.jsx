import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import ExpeditionsPage from './pages/Expeditions/ExpeditionsPage.jsx';
import PersonnelPage from './pages/Personnel/PersonnelPage.jsx';
import CargoPage from './pages/Cargo/CargoPage.jsx';
import InventoryPage from './pages/Inventory/InventoryPage.jsx';
import EmergencyPage from './pages/Emergency/EmergencyPage.jsx';
import ReportsPage from './pages/Reports/ReportsPage.jsx';
import CargoScanPage from './pages/Field/CargoScanPage.jsx';
import CheckInPage from './pages/Field/CheckInPage.jsx';
import OfflineDataPage from './pages/Field/OfflineDataPage.jsx';

function ProtectedRoute({ children }) {
  const { token, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <span className="text-[#38BDF8] text-lg font-mono">INITIALIZING POLAR COMMAND TERMINAL...</span>
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/expeditions" element={<ProtectedRoute><ExpeditionsPage /></ProtectedRoute>} />
      <Route path="/personnel" element={<ProtectedRoute><PersonnelPage /></ProtectedRoute>} />
      <Route path="/cargo" element={<ProtectedRoute><CargoPage /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/emergency" element={<ProtectedRoute><EmergencyPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/cargo-scan" element={<ProtectedRoute><CargoScanPage /></ProtectedRoute>} />
      <Route path="/check-in" element={<ProtectedRoute><CheckInPage /></ProtectedRoute>} />
      <Route path="/offline-data" element={<ProtectedRoute><OfflineDataPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
