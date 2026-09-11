import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Radio, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function Navbar({ title }) {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggleConnection = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (!nextState) {
      setPendingSync(7);
    } else {
      setPendingSync(0);
    }
  };

  return (
    <div className="bg-[#111827] border-b border-[#1E3A5F] h-16 flex items-center justify-between px-6 flex-shrink-0">
      {/* Page Title */}
      <h1 className="text-[#F9FAFB] text-base md:text-lg font-bold truncate max-w-[240px] md:max-w-md">
        {title}
      </h1>

      {/* Center: Live Polar Time & Satellite Connection Indicator */}
      <div className="flex items-center gap-4">
        {/* POLAR SATELLITE / OFFLINE INDICATOR (TASK 4) */}
        <button
          onClick={toggleConnection}
          title="Click to simulate satellite connectivity toggle for presentation"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
            isOnline
              ? 'bg-[#0B1120] border-green-700/60 text-green-300 hover:border-green-500'
              : 'bg-amber-950/40 border-amber-600 text-amber-300 hover:border-amber-400 animate-pulse'
          }`}
        >
          {isOnline ? (
            <>
              <div className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
              <Wifi className="w-3.5 h-3.5 text-[#34D399]" />
              <span className="font-bold hidden sm:inline">🟢 SATELLITE LINK ACTIVE</span>
              <span className="text-[#9CA3AF] text-[11px] hidden md:inline">
                • Sync {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">🟠 OFFLINE MODE</span>
              <span className="text-amber-200 text-[11px] hidden md:inline">
                • {pendingSync} updates queued
              </span>
            </>
          )}
        </button>

        {/* Live Polar Station Master Clock */}
        <div className="hidden lg:block text-right border-l border-[#1E3A5F] pl-4">
          <p className="text-[#38BDF8] text-xs font-mono font-bold">
            {time.toLocaleTimeString('en-IN', { hour12: false })} UTC+5:30
          </p>
          <p className="text-[#9CA3AF] text-[10px]">
            {time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* User Status Badge */}
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 bg-[#34D399] rounded-full" />
        <div className="text-right">
          <span className="text-[#F9FAFB] text-xs font-bold block">{user?.name || 'Operator'}</span>
          <span className="text-[#38BDF8] text-[10px] uppercase font-bold tracking-wider">
            {user?.role?.replace(/_/g, ' ') || 'Crew Member'}
          </span>
        </div>
      </div>
    </div>
  );
}
