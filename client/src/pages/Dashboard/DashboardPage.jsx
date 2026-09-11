import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import CommanderDashboard from './CommanderDashboard.jsx';
import LogisticsDashboard from './LogisticsDashboard.jsx';
import FieldDashboard from './FieldDashboard.jsx';
import { getDashboardStats } from '../../api/stats.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Radio } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load operational stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const role = user?.role || 'commander';

  const getTitle = () => {
    switch (role) {
      case 'logistics_officer':
        return 'Logistics Control Center';
      case 'field_personnel':
        return 'Field Operations Terminal';
      case 'commander':
      default:
        return 'Command Center';
    }
  };

  if (loading) {
    return (
      <PageWrapper title={getTitle()}>
        <div className="flex flex-col items-center justify-center h-80 gap-3">
          <Radio className="w-8 h-8 text-[#38BDF8] animate-pulse" />
          <div className="text-[#38BDF8] text-sm font-mono tracking-wider">
            SYNCHRONIZING POLAR TELEMETRY & BEACONS...
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={getTitle()}>
      {role === 'logistics_officer' ? (
        <LogisticsDashboard stats={stats} onRefresh={fetchStats} />
      ) : role === 'field_personnel' ? (
        <FieldDashboard stats={stats} onRefresh={fetchStats} />
      ) : (
        <CommanderDashboard stats={stats} onRefresh={fetchStats} />
      )}
    </PageWrapper>
  );
}
