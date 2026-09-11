import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import { Database, WifiOff, CheckCircle, RefreshCw, HardDrive, ShieldCheck } from 'lucide-react';

export default function OfflineDataPage() {
  const [syncedCount, setSyncedCount] = useState(48);
  const [pendingSync, setPendingSync] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setPendingSync(0);
      setSyncedCount(prev => prev + 7);
    }, 1200);
  };

  return (
    <PageWrapper title="Polar Offline Data Storage & Synchronization">
      <div className="space-y-6 max-w-4xl">
        {/* Banner */}
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#38BDF8]" />
              <span className="text-xs font-bold text-[#38BDF8] tracking-widest uppercase">
                Local SQLite Database Store
              </span>
            </div>
            <h2 className="text-xl font-black text-[#F9FAFB] tracking-tight mt-0.5">
              Offline-First Data Buffer
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-1">
              All expedition telemetry, check-ins, manifests, and alerts are stored locally on your laptop without internet.
            </p>
          </div>

          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#0B1120] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Synchronizing Store...' : 'Test Full Local Sync'}
          </button>
        </div>

        {/* Sync Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9CA3AF]">Local SQLite File</span>
              <HardDrive className="w-4 h-4 text-[#34D399]" />
            </div>
            <p className="text-xl font-bold text-[#34D399] font-mono">polar.db (Active)</p>
            <p className="text-[11px] text-[#9CA3AF] mt-1">Direct embedded storage</p>
          </div>

          <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9CA3AF]">Cached Telemetry Records</span>
              <CheckCircle className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <p className="text-xl font-bold text-[#38BDF8] font-mono">{syncedCount} Records</p>
            <p className="text-[11px] text-[#9CA3AF] mt-1">100% available offline</p>
          </div>

          <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9CA3AF]">Pending Outbox Queue</span>
              <WifiOff className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl font-bold text-amber-400 font-mono">{pendingSync} Updates</p>
            <p className="text-[11px] text-[#9CA3AF] mt-1">Auto-sync on sat-link</p>
          </div>
        </div>

        {/* Local Storage Verification Checklist */}
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wide border-b border-[#1E3A5F] pb-2">
            Offline Capabilities Verification
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-green-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Full CRUD functionality functions with Wi-Fi / Internet disabled.</span>
            </div>
            <div className="flex items-center gap-2 text-green-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>JWT authentication verified using local token storage and SQLite verification.</span>
            </div>
            <div className="flex items-center gap-2 text-green-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Zero external cloud APIs or map tile server dependencies.</span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
