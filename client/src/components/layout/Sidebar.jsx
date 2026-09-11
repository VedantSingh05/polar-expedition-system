import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  Package, 
  Archive, 
  AlertTriangle, 
  LogOut, 
  Radio, 
  Truck, 
  FileText, 
  QrCode, 
  CheckCircle, 
  Database,
  Navigation,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Sidebar({ activeAlerts = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || 'commander';

  // Role-specific navigation items (TASK 2)
  const getNavItems = () => {
    switch (role) {
      case 'logistics_officer':
        return [
          { to: '/dashboard', label: 'Logistics Control', icon: LayoutDashboard },
          { to: '/cargo', label: 'Cargo Tracking', icon: Truck },
          { to: '/inventory', label: 'Base Inventory', icon: Archive },
          { to: '/expeditions', label: 'Expedition Demands', icon: Map },
          { to: '/emergency', label: 'Emergency Alerts', icon: AlertTriangle, isAlert: true },
          { to: '/reports', label: 'Logistics Reports', icon: FileText },
        ];
      case 'field_personnel':
        return [
          { to: '/dashboard', label: 'Field Operations', icon: LayoutDashboard },
          { to: '/expeditions', label: 'My Expedition', icon: Map },
          { to: '/personnel', label: 'My Crew Team', icon: Users },
          { to: '/cargo-scan', label: 'Cargo QR Scan', icon: QrCode },
          { to: '/check-in', label: 'Safe Check-in', icon: CheckCircle },
          { to: '/emergency', label: 'Emergency SOS', icon: AlertTriangle, isAlert: true },
          { to: '/offline-data', label: 'Offline Data Buffer', icon: Database },
        ];
      case 'commander':
      default:
        return [
          { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
          { to: '/expeditions', label: 'Expeditions', icon: Map },
          { to: '/personnel', label: 'Personnel & Medical', icon: Users },
          { to: '/cargo', label: 'Cargo Tracking', icon: Truck },
          { to: '/inventory', label: 'Base Inventory', icon: Archive },
          { to: '/emergency', label: 'Emergency Center', icon: AlertTriangle, isAlert: true },
          { to: '/reports', label: 'Operational Reports', icon: FileText },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#111827] border-r border-[#1E3A5F] flex flex-col z-40">
      {/* Logo Area */}
      <div className="p-5 border-b border-[#1E3A5F]">
        <div className="flex items-center gap-3">
          <span className="text-3xl">❄️</span>
          <div>
            <p className="text-[#38BDF8] font-black text-sm tracking-widest uppercase">
              POLAR COMMAND
            </p>
            <p className="text-[#9CA3AF] text-[11px] font-medium">NCPOR • Ministry of Earth Sciences</p>
          </div>
        </div>
      </div>

      {/* Role Banner Pill */}
      <div className="px-4 pt-3">
        <div className="bg-[#1F2937] border border-[#1E3A5F] rounded-lg px-3 py-1.5 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#9CA3AF] uppercase">Role Profile</span>
          <span className="text-xs font-bold text-[#38BDF8] capitalize">
            {role.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-1">
        {navItems.map(({ to, label, icon: Icon, isAlert }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#1F2937] text-[#38BDF8] border-l-4 border-[#38BDF8] pl-2.5 shadow-md shadow-black/40'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]/60'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{label}</span>
            {isAlert && activeAlerts > 0 && (
              <span className="ml-auto bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 animate-pulse">
                {activeAlerts} SOS
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info & Sign out */}
      <div className="p-4 border-t border-[#1E3A5F] bg-[#0B1120]/40">
        <div className="mb-3">
          <p className="text-[#F9FAFB] text-xs font-bold truncate">{user?.name || 'Operator'}</p>
          <p className="text-[#9CA3AF] text-[11px] truncate">{user?.email || 'officer@ncpor.in'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-[#1F2937] hover:bg-red-950/40 hover:text-red-400 text-[#9CA3AF] border border-[#1E3A5F] text-xs font-bold py-2 rounded-lg transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          End Duty Session
        </button>
      </div>
    </div>
  );
}
