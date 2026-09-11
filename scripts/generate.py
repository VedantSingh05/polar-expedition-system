import os

base_dir = "C:/Users/Deepali/Desktop/sem iii/SIH/polar-expedition-system/client"
os.makedirs(base_dir, exist_ok=True)

files = {}

files["package.json"] = """{
  "name": "polar-expedition-client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.8",
    "lucide-react": "^0.363.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "vite": "^5.2.0"
  }
}
"""

files["vite.config.js"] = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
"""

files["tailwind.config.js"] = """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'polar-bg': '#0B1120',
        'polar-surface': '#111827',
        'polar-elevated': '#1F2937',
        'polar-border': '#1E3A5F',
        'polar-accent': '#38BDF8',
        'polar-accent2': '#7DD3FC',
        'polar-success': '#34D399',
        'polar-warning': '#FBBF24',
        'polar-danger': '#EF4444',
        'polar-text': '#F9FAFB',
        'polar-muted': '#9CA3AF'
      }
    },
  },
  plugins: [],
}
"""

files["postcss.config.js"] = """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"""

files["index.html"] = """<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NCPOR Polar Command System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""

files["src/main.jsx"] = """import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
"""

files["src/index.css"] = """@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0B1120;
  color: #F9FAFB;
  font-family: 'Inter', system-ui, sans-serif;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #111827; }
::-webkit-scrollbar-thumb { background: #1E3A5F; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #38BDF8; }
"""

files["src/context/AuthContext.jsx"] = """import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authApi from '../api/auth.api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('polar_token');
    const storedUser = localStorage.getItem('polar_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await authApi.login(email, password);
      localStorage.setItem('polar_token', data.token);
      localStorage.setItem('polar_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('polar_token');
    localStorage.removeItem('polar_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
"""

files["src/api/axiosInstance.js"] = """import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('polar_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
"""

files["src/api/auth.api.js"] = """import axios from './axiosInstance';

export const login = (email, password) => axios.post('/auth/login', { email, password });
export const getMe = () => axios.get('/auth/me');
"""

files["src/api/expeditions.api.js"] = """import axios from './axiosInstance';

export const getExpeditions = () => axios.get('/expeditions');
export const getExpedition = (id) => axios.get(`/expeditions/${id}`);
export const createExpedition = (data) => axios.post('/expeditions', data);
export const updateExpedition = (id, data) => axios.put(`/expeditions/${id}`, data);
export const deleteExpedition = (id) => axios.delete(`/expeditions/${id}`);
"""

files["src/api/personnel.api.js"] = """import axios from './axiosInstance';

export const getPersonnel = () => axios.get('/personnel');
export const getPersonnelByExpedition = (expeditionId) => axios.get(`/personnel?expeditionId=${expeditionId}`);
export const createPersonnel = (data) => axios.post('/personnel', data);
export const updatePersonnel = (id, data) => axios.put(`/personnel/${id}`, data);
export const deletePersonnel = (id) => axios.delete(`/personnel/${id}`);
"""

files["src/api/cargo.api.js"] = """import axios from './axiosInstance';

export const getCargo = (expeditionId) => {
  const url = expeditionId ? `/cargo?expeditionId=${expeditionId}` : '/cargo';
  return axios.get(url);
};
export const createCargo = (data) => axios.post('/cargo', data);
export const updateCargo = (id, data) => axios.put(`/cargo/${id}`, data);
export const deleteCargo = (id) => axios.delete(`/cargo/${id}`);
"""

files["src/api/inventory.api.js"] = """import axios from './axiosInstance';

export const getInventory = () => axios.get('/inventory');
export const getLowStock = () => axios.get('/inventory/low-stock');
export const createInventoryItem = (data) => axios.post('/inventory', data);
export const updateInventoryItem = (id, data) => axios.put(`/inventory/${id}`, data);
export const deleteInventoryItem = (id) => axios.delete(`/inventory/${id}`);
"""

files["src/api/assets.api.js"] = """import axios from './axiosInstance';

export const getAssets = () => axios.get('/assets');
export const createAsset = (data) => axios.post('/assets', data);
export const updateAsset = (id, data) => axios.put(`/assets/${id}`, data);
export const deleteAsset = (id) => axios.delete(`/assets/${id}`);
"""

files["src/api/emergency.api.js"] = """import axios from './axiosInstance';

export const getAlerts = (resolved) => {
  const url = resolved !== undefined ? `/emergency?resolved=${resolved}` : '/emergency';
  return axios.get(url);
};
export const createAlert = (data) => axios.post('/emergency', data);
export const resolveAlert = (id, resolutionNotes) => axios.post(`/emergency/${id}/resolve`, { resolutionNotes });
export const deleteAlert = (id) => axios.delete(`/emergency/${id}`);
"""

files["src/api/stats.api.js"] = """import axios from './axiosInstance';

export const getDashboardStats = () => axios.get('/stats/dashboard');
"""

files["src/components/layout/Sidebar.jsx"] = """import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Users, Package, Archive, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ activeAlerts = 0 }) {
  const { user, logout } = useAuth();
  
  const links = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/expeditions", icon: <Map size={20} />, label: "Expeditions" },
    { to: "/personnel", icon: <Users size={20} />, label: "Personnel" },
    { to: "/cargo", icon: <Package size={20} />, label: "Cargo" },
    { to: "/inventory", icon: <Archive size={20} />, label: "Inventory" },
    { 
      to: "/emergency", 
      icon: <AlertTriangle size={20} />, 
      label: "Emergency",
      badge: activeAlerts > 0 ? activeAlerts : null
    },
  ];

  return (
    <div className="w-64 fixed top-0 left-0 h-full bg-polar-surface border-r border-polar-border flex flex-col z-10">
      <div className="p-6 border-b border-polar-border">
        <div className="flex items-center gap-2 text-polar-accent font-bold text-xl mb-1">
          <span>❄️</span> POLAR COMMAND
        </div>
        <div className="text-xs text-polar-muted uppercase tracking-wider">
          NCPOR | MoES
        </div>
      </div>
      
      <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-polar-elevated border-l-4 border-polar-accent text-polar-accent' 
                  : 'text-gray-400 hover:text-white hover:bg-polar-elevated/50 border-l-4 border-transparent'
              }`
            }
          >
            <div className="flex items-center gap-3">
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </div>
            {link.badge && (
              <span className="bg-polar-danger text-white text-xs px-2 py-0.5 rounded-full">
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-polar-border">
        <div className="flex items-center justify-between">
          <div className="overflow-hidden">
            <p className="text-sm text-polar-text truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-polar-muted truncate">{user?.role || 'Operator'}</p>
          </div>
          <button 
            onClick={logout}
            className="text-xs text-polar-muted hover:text-white px-2 py-1 rounded border border-polar-border hover:bg-polar-elevated"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
"""

files["src/components/layout/Navbar.jsx"] = """import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ title }) {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-16 bg-polar-surface border-b border-polar-border px-6 flex items-center justify-between shrink-0">
      <h1 className="text-xl font-semibold text-polar-text">{title}</h1>
      
      <div className="font-mono text-polar-muted text-sm tracking-wider">
        {time.toISOString().replace('T', ' ').slice(0, 19)} UTC
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-polar-text">{user?.name || 'User'}</span>
          <span className="text-xs text-polar-accent bg-polar-accent/10 px-2 rounded-full">
            {user?.role || 'Admin'}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-polar-elevated flex items-center justify-center border border-polar-border relative">
          {user?.name?.[0]?.toUpperCase() || 'U'}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-polar-success border-2 border-polar-surface rounded-full"></span>
        </div>
      </div>
    </div>
  );
}
"""

files["src/components/layout/PageWrapper.jsx"] = """import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import * as emergencyApi from '../../api/emergency.api';

export default function PageWrapper({ children, title }) {
  const [activeAlerts, setActiveAlerts] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await emergencyApi.getAlerts(false);
        setActiveAlerts(data?.length || 0);
      } catch (err) {
        // ignore in MVP
      }
    };
    fetchAlerts();
    const timer = setInterval(fetchAlerts, 30000); // Poll every 30s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-polar-bg overflow-hidden text-polar-text">
      <Sidebar activeAlerts={activeAlerts} />
      <div className="flex-1 ml-64 flex flex-col h-full overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
"""

files["src/components/ui/StatCard.jsx"] = """import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'accent' }) {
  const colorMap = {
    accent: 'text-polar-accent bg-polar-accent/10',
    success: 'text-polar-success bg-polar-success/10',
    warning: 'text-polar-warning bg-polar-warning/10',
    danger: 'text-polar-danger bg-polar-danger/10',
  };

  return (
    <div className="bg-polar-surface border border-polar-border p-5 rounded-xl flex items-center justify-between">
      <div>
        <p className="text-polar-muted text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-polar-text mb-1">{value}</h3>
        {subtitle && <p className="text-xs text-polar-muted">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
"""

files["src/components/ui/Badge.jsx"] = """import React from 'react';

export default function Badge({ status, type }) {
  let color = 'bg-gray-500/10 text-gray-400 border-gray-500/20';

  if (type === 'status') {
    if (status === 'active' || status === 'delivered') color = 'bg-polar-success/10 text-polar-success border-polar-success/20';
    else if (status === 'planning' || status === 'in_transit') color = 'bg-polar-accent/10 text-polar-accent border-polar-accent/20';
    else if (status === 'pending') color = 'bg-polar-warning/10 text-polar-warning border-polar-warning/20';
    else if (status === 'aborted' || status === 'lost') color = 'bg-polar-danger/10 text-polar-danger border-polar-danger/20';
  } else if (type === 'severity') {
    if (status === 'critical') color = 'bg-polar-danger text-white border-polar-danger animate-pulse';
    else if (status === 'high') color = 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    else if (status === 'medium') color = 'bg-polar-warning/20 text-polar-warning border-polar-warning/30';
    else if (status === 'low') color = 'bg-polar-accent/20 text-polar-accent border-polar-accent/30';
  } else if (type === 'zone') {
    if (status === 'antarctic') color = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    else if (status === 'arctic') color = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  } else if (type === 'health') {
    if (status === 'fit') color = 'bg-polar-success/10 text-polar-success border-polar-success/20';
    else if (status === 'under_observation') color = 'bg-polar-warning/10 text-polar-warning border-polar-warning/20';
    else if (status === 'medical_leave') color = 'bg-polar-danger/10 text-polar-danger border-polar-danger/20';
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider ${color}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}
"""

files["src/components/ui/Modal.jsx"] = """import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-polar-surface border border-polar-border rounded-xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-polar-border shrink-0">
          <h2 className="text-xl font-semibold text-polar-text">{title}</h2>
          <button onClick={onClose} className="text-polar-muted hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
"""

files["src/components/ui/AlertBanner.jsx"] = """import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function AlertBanner({ type = 'info', message, onClose }) {
  const types = {
    error: { bg: 'bg-polar-danger/10', border: 'border-polar-danger', text: 'text-polar-danger', icon: <AlertCircle size={20} /> },
    success: { bg: 'bg-polar-success/10', border: 'border-polar-success', text: 'text-polar-success', icon: <CheckCircle size={20} /> },
    warning: { bg: 'bg-polar-warning/10', border: 'border-polar-warning', text: 'text-polar-warning', icon: <AlertCircle size={20} /> },
    info: { bg: 'bg-polar-accent/10', border: 'border-polar-accent', text: 'text-polar-accent', icon: <Info size={20} /> },
  };

  const style = types[type] || types.info;

  return (
    <div className={`flex items-center justify-between p-4 mb-4 rounded-lg border ${style.bg} ${style.border} ${style.text}`}>
      <div className="flex items-center gap-3">
        {style.icon}
        <span className="font-medium text-sm">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-75">
          <X size={18} />
        </button>
      )}
    </div>
  );
}
"""

files["src/components/ui/DataTable.jsx"] = """import React from 'react';

export default function DataTable({ columns, data, emptyMessage = "No data available." }) {
  return (
    <div className="w-full overflow-x-auto border border-polar-border rounded-xl">
      <table className="w-full text-left text-sm text-polar-text">
        <thead className="bg-polar-elevated text-polar-muted uppercase text-xs">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-4 font-medium">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-polar-border bg-polar-surface">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-polar-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-polar-elevated/30 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
"""

files["src/pages/Login/LoginPage.jsx"] = """import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AlertBanner from '../../components/ui/AlertBanner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate login for MVP if API fails
    const result = await login(email, password).catch(() => ({ success: false }));
    
    if (result.success || (email === 'admin@ncpor.gov.in' && password === 'admin123')) {
      if (!result.success) {
        // Fallback fake login
        localStorage.setItem('polar_token', 'fake-token');
        localStorage.setItem('polar_user', JSON.stringify({ name: 'Admin', role: 'Commander', email }));
        window.location.href = '/dashboard';
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error || 'Invalid credentials. Try admin@ncpor.gov.in / admin123');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-polar-bg flex items-center justify-center p-4" style={{
      backgroundImage: 'radial-gradient(circle at center, #111827 0%, #0B1120 100%)'
    }}>
      <div className="w-full max-w-md bg-polar-surface border border-polar-border rounded-2xl p-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">❄️</div>
          <h1 className="text-2xl font-bold text-polar-accent tracking-wider mb-2">POLAR COMMAND SYSTEM</h1>
          <p className="text-polar-muted text-sm uppercase tracking-widest">Ministry of Earth Sciences | NCPOR</p>
        </div>

        {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-polar-muted mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-polar-elevated border border-polar-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-polar-accent focus:ring-1 focus:ring-polar-accent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@ncpor.gov.in"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-polar-muted mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-polar-elevated border border-polar-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-polar-accent focus:ring-1 focus:ring-polar-accent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-polar-accent hover:bg-polar-accent2 text-polar-bg font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Access System'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-polar-muted/50">
          Prototype demonstration system for SIH 2026.<br/>
          Not affiliated with NCPOR or MoES official systems.
        </p>
      </div>
    </div>
  );
}
"""

files["src/pages/Dashboard/DashboardPage.jsx"] = """import React, { useEffect, useState } from 'react';
import StatCard from '../../components/ui/StatCard';
import { Map, Users, Package, AlertTriangle, Box, Wrench } from 'lucide-react';
import * as statsApi from '../../api/stats.api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fake data for MVP since no backend yet
    setTimeout(() => {
      setStats({
        activeExpeditions: 3,
        personnelDeployed: 42,
        cargoInTransit: 15,
        activeAlerts: 1,
        planningExpeditions: 2,
        totalAssets: 128,
        lowStockItems: 5,
        assetsMaintenance: 8
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="text-polar-muted animate-pulse">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Expeditions" value={stats.activeExpeditions} icon={Map} color="accent" />
        <StatCard title="Personnel Deployed" value={stats.personnelDeployed} icon={Users} color="success" />
        <StatCard title="Cargo In Transit" value={stats.cargoInTransit} icon={Package} color="warning" />
        <StatCard title="Active Alerts" value={stats.activeAlerts} icon={AlertTriangle} color="danger" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Planning Phase" value={stats.planningExpeditions} icon={Map} color="accent" />
        <StatCard title="Total Assets" value={stats.totalAssets} icon={Box} color="success" />
        <StatCard title="Low Stock Items" value={stats.lowStockItems} icon={Package} color="warning" />
        <StatCard title="In Maintenance" value={stats.assetsMaintenance} icon={Wrench} color="warning" />
      </div>
    </div>
  );
}
"""

files["src/pages/Expeditions/ExpeditionsPage.jsx"] = """import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import ExpeditionForm from './ExpeditionForm';

export default function ExpeditionsPage() {
  const [expeditions, setExpeditions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpedition, setEditingExpedition] = useState(null);

  useEffect(() => {
    // Fake data for MVP
    setExpeditions([
      { id: 1, name: 'ISEA 44', destination: 'Maitri Station', zone: 'antarctic', status: 'active', startDate: '2024-11-01', endDate: '2025-03-15', teamSize: 24, description: '44th Indian Scientific Expedition to Antarctica.' },
      { id: 2, name: 'Arctic Summer', destination: 'Himadri Station', zone: 'arctic', status: 'planning', startDate: '2025-06-01', endDate: '2025-08-30', teamSize: 12, description: 'Summer observation period in Svalbard.' }
    ]);
  }, []);

  const openForm = (exp = null) => {
    setEditingExpedition(exp);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingExpedition(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Expedition Management</h2>
        <button onClick={() => openForm()} className="bg-polar-accent hover:bg-polar-accent2 text-polar-bg px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> New Expedition
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {expeditions.map(exp => (
          <div key={exp.id} className="bg-polar-surface border border-polar-border rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{exp.name}</h3>
                <p className="text-sm text-polar-muted">{exp.destination}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge status={exp.status} type="status" />
                <Badge status={exp.zone} type="zone" />
              </div>
            </div>
            <p className="text-sm text-polar-text mb-4 flex-1 line-clamp-3">{exp.description}</p>
            <div className="text-xs text-polar-muted mb-6 grid grid-cols-2 gap-2">
              <div>Start: {exp.startDate}</div>
              <div>End: {exp.endDate}</div>
              <div>Team: {exp.teamSize} members</div>
            </div>
            <div className="flex gap-3 border-t border-polar-border pt-4">
              <button onClick={() => openForm(exp)} className="text-sm text-polar-accent hover:text-white">Edit</button>
              <button className="text-sm text-polar-danger hover:text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeForm} title={editingExpedition ? "Edit Expedition" : "New Expedition"}>
        <ExpeditionForm initialData={editingExpedition} onClose={closeForm} />
      </Modal>
    </div>
  );
}
"""

files["src/pages/Expeditions/ExpeditionForm.jsx"] = """import React, { useState } from 'react';

export default function ExpeditionForm({ initialData, onClose }) {
  const [formData, setFormData] = useState(initialData || {
    name: '', destination: 'Maitri Station', zone: 'antarctic', status: 'planning', startDate: '', endDate: '', teamSize: '', description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onClose(); }, 500); // fake submit
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputClass = "w-full bg-polar-elevated border border-polar-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-polar-accent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-polar-muted mb-1">Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-polar-muted mb-1">Zone</label>
          <select name="zone" value={formData.zone} onChange={handleChange} className={inputClass}>
            <option value="antarctic">Antarctic</option>
            <option value="arctic">Arctic</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm text-polar-muted mb-1">Destination</label>
        <select name="destination" value={formData.destination} onChange={handleChange} className={inputClass}>
          <option>Maitri Station</option>
          <option>Bharati Station</option>
          <option>Himadri Station</option>
          <option>IndARC</option>
          <option>Custom</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-polar-muted mb-1">Start Date</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-polar-muted mb-1">End Date</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-polar-muted mb-1">Team Size</label>
          <input type="number" name="teamSize" value={formData.teamSize} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-polar-muted mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="aborted">Aborted</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm text-polar-muted mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className={inputClass}></textarea>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-polar-elevated text-white">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-polar-accent text-polar-bg font-bold disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Expedition'}
        </button>
      </div>
    </form>
  );
}
"""

files["src/pages/Personnel/PersonnelPage.jsx"] = """import React, { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { Plus } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import PersonnelForm from './PersonnelForm';

export default function PersonnelPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const data = [
    { id: 1, name: 'Dr. Ramesh Kumar', role: 'Chief Scientist', expedition: 'ISEA 44', health: 'fit', contact: '+91-9876543210' },
    { id: 2, name: 'Capt. Singh', role: 'Logistics Lead', expedition: 'ISEA 44', health: 'under_observation', contact: '+91-8765432109' }
  ];

  const cols = [
    { key: 'name', label: 'Name', render: (val) => <span className="font-semibold">{val}</span> },
    { key: 'role', label: 'Role' },
    { key: 'expedition', label: 'Expedition' },
    { key: 'health', label: 'Health', render: (val) => <Badge status={val} type="health" /> },
    { key: 'contact', label: 'Emergency Contact' },
    { key: 'actions', label: 'Actions', render: () => <button className="text-polar-accent">Edit</button> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Personnel</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-polar-accent hover:bg-polar-accent2 text-polar-bg px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Add Personnel
        </button>
      </div>
      <DataTable columns={cols} data={data} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Personnel">
        <PersonnelForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
"""

files["src/pages/Personnel/PersonnelForm.jsx"] = """import React, { useState } from 'react';

export default function PersonnelForm({ onClose }) {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onClose(); }, 500);
  };
  
  const inputClass = "w-full bg-polar-elevated border border-polar-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-polar-accent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-polar-muted mb-1">Name</label>
        <input required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-polar-muted mb-1">Role</label>
        <input required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-polar-muted mb-1">Health Status</label>
        <select className={inputClass}>
          <option value="fit">Fit</option>
          <option value="under_observation">Under Observation</option>
          <option value="medical_leave">Medical Leave</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-polar-elevated text-white">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-polar-accent text-polar-bg font-bold">Save</button>
      </div>
    </form>
  );
}
"""

files["src/pages/Cargo/CargoPage.jsx"] = """import React, { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { Plus } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import CargoForm from './CargoForm';

export default function CargoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const data = [
    { id: 1, item: 'Winter Gear Box 1', category: 'Clothing', qty: 10, weight: 150, status: 'in_transit', origin: 'Goa', dest: 'Maitri' }
  ];

  const cols = [
    { key: 'item', label: 'Item Name' },
    { key: 'category', label: 'Category' },
    { key: 'qty', label: 'Qty' },
    { key: 'weight', label: 'Weight (kg)' },
    { key: 'status', label: 'Status', render: (val) => <Badge status={val} type="status" /> },
    { key: 'origin', label: 'Route', render: (val, row) => `${val} → ${row.dest}` },
    { key: 'actions', label: 'Actions', render: () => <button className="text-polar-accent">Edit</button> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Cargo Tracking</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-polar-accent text-polar-bg px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Add Cargo
        </button>
      </div>
      <DataTable columns={cols} data={data} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Cargo">
        <CargoForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
"""

files["src/pages/Cargo/CargoForm.jsx"] = """import React, { useState } from 'react';

export default function CargoForm({ onClose }) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setLoading(true); setTimeout(onClose, 500); };
  const inputClass = "w-full bg-polar-elevated border border-polar-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-polar-accent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm text-polar-muted mb-1">Item Name</label><input required className={inputClass} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm text-polar-muted mb-1">Qty</label><input type="number" className={inputClass} /></div>
        <div><label className="block text-sm text-polar-muted mb-1">Weight (kg)</label><input type="number" className={inputClass} /></div>
      </div>
      <div>
        <label className="block text-sm text-polar-muted mb-1">Status</label>
        <select className={inputClass}>
          <option value="pending">Pending</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-polar-elevated text-white rounded-lg">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-polar-accent text-polar-bg font-bold rounded-lg">Save</button>
      </div>
    </form>
  );
}
"""

files["src/pages/Inventory/InventoryPage.jsx"] = """import React, { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import { Plus } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import InventoryForm from './InventoryForm';
import AlertBanner from '../../components/ui/AlertBanner';

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const data = [
    { id: 1, name: 'Diesel Fuel', category: 'Fuel', qty: 5000, unit: 'L', threshold: 10000, location: 'Maitri Depot' },
    { id: 2, name: 'Rations Type A', category: 'Food', qty: 250, unit: 'Boxes', threshold: 100, location: 'Bharati Kitchen' }
  ];

  const cols = [
    { key: 'name', label: 'Item Name' },
    { key: 'category', label: 'Category' },
    { key: 'qty', label: 'Quantity', render: (val, row) => `${val} ${row.unit}` },
    { key: 'threshold', label: 'Min Threshold' },
    { key: 'location', label: 'Location' },
    { key: 'actions', label: 'Actions', render: () => <button className="text-polar-accent">Edit</button> }
  ];

  return (
    <div className="space-y-6">
      <AlertBanner type="error" message="1 item is below minimum threshold (Diesel Fuel)" />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Station Inventory</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-polar-accent text-polar-bg px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Add Item
        </button>
      </div>
      <DataTable columns={cols} data={data} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Inventory Item">
        <InventoryForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
"""

files["src/pages/Inventory/InventoryForm.jsx"] = """import React, { useState } from 'react';

export default function InventoryForm({ onClose }) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setLoading(true); setTimeout(onClose, 500); };
  const inputClass = "w-full bg-polar-elevated border border-polar-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-polar-accent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm text-polar-muted mb-1">Item Name</label><input required className={inputClass} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm text-polar-muted mb-1">Quantity</label><input type="number" className={inputClass} /></div>
        <div><label className="block text-sm text-polar-muted mb-1">Unit</label><input className={inputClass} placeholder="e.g. L, kg, Boxes" /></div>
      </div>
      <div><label className="block text-sm text-polar-muted mb-1">Threshold</label><input type="number" className={inputClass} /></div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-polar-elevated text-white rounded-lg">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-polar-accent text-polar-bg font-bold rounded-lg">Save</button>
      </div>
    </form>
  );
}
"""

files["src/pages/Emergency/EmergencyPage.jsx"] = """import React, { useState } from 'react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import SOSForm from './SOSForm';

export default function EmergencyPage() {
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const alerts = [
    { id: 1, type: 'Medical', severity: 'critical', exp: 'ISEA 44', desc: 'Crew member injured', by: 'Dr. Kumar', time: '10 mins ago', resolved: false }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-polar-danger text-white p-4 rounded-xl flex justify-between items-center shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse">
        <span className="font-bold text-lg">⚠️ CRITICAL ALERT ACTIVE — Immediate response required</span>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Emergency Operations</h2>
        <button onClick={() => setIsSOSOpen(true)} className="bg-polar-danger hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2">
          🚨 RAISE SOS
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map(a => (
          <div key={a.id} className="bg-polar-surface border border-polar-border p-6 rounded-xl flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">🚑</span>
                <span className="font-bold">{a.type}</span>
                <Badge status={a.severity} type="severity" />
              </div>
              <p className="text-polar-text mb-1">{a.desc}</p>
              <p className="text-sm text-polar-muted">{a.exp} • Raised by {a.by} • {a.time}</p>
            </div>
            <button className="bg-polar-success text-polar-bg px-4 py-2 rounded-lg font-bold">
              Mark Resolved
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} title="Raise SOS Alert">
        <SOSForm onClose={() => setIsSOSOpen(false)} />
      </Modal>
    </div>
  );
}
"""

files["src/pages/Emergency/SOSForm.jsx"] = """import React, { useState } from 'react';

export default function SOSForm({ onClose }) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setLoading(true); setTimeout(onClose, 500); };
  const inputClass = "w-full bg-polar-elevated border border-polar-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-polar-danger";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-polar-muted mb-1">Alert Type</label>
          <select className={inputClass}>
            <option>Medical Emergency</option>
            <option>Fire / Hazard</option>
            <option>Equipment Failure</option>
            <option>Weather Warning</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-polar-muted mb-1">Severity</label>
          <select className={inputClass}>
            <option value="critical">Critical (Life Threatening)</option>
            <option value="high">High (Urgent Response)</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>
      <div><label className="block text-sm text-polar-muted mb-1">Description</label><textarea required rows="3" className={inputClass} /></div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-polar-elevated text-white rounded-lg">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-polar-danger text-white font-bold rounded-lg shadow-lg shadow-polar-danger/50">
          BROADCAST SOS
        </button>
      </div>
    </form>
  );
}
"""

files["src/App.jsx"] = """import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PageWrapper from './components/layout/PageWrapper';

import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ExpeditionsPage from './pages/Expeditions/ExpeditionsPage';
import PersonnelPage from './pages/Personnel/PersonnelPage';
import CargoPage from './pages/Cargo/CargoPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import EmergencyPage from './pages/Emergency/EmergencyPage';

const ProtectedRoute = ({ children, title }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return null;
  if (!token) return <Navigate to="/login" replace />;
  return <PageWrapper title={title}>{children}</PageWrapper>;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={<ProtectedRoute title="Command Overview"><DashboardPage /></ProtectedRoute>} />
      <Route path="/expeditions" element={<ProtectedRoute title="Expeditions"><ExpeditionsPage /></ProtectedRoute>} />
      <Route path="/personnel" element={<ProtectedRoute title="Personnel"><PersonnelPage /></ProtectedRoute>} />
      <Route path="/cargo" element={<ProtectedRoute title="Cargo"><CargoPage /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute title="Inventory"><InventoryPage /></ProtectedRoute>} />
      <Route path="/emergency" element={<ProtectedRoute title="Emergency"><EmergencyPage /></ProtectedRoute>} />
    </Routes>
  );
}
"""

import pathlib

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Files generated successfully!")
