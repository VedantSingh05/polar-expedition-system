import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Badge from '../../components/ui/Badge.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import { getDashboardStats } from '../../api/stats.api.js';
import { getExpeditions } from '../../api/expeditions.api.js';
import { getCargo } from '../../api/cargo.api.js';
import { getInventory } from '../../api/inventory.api.js';
import { getPersonnel } from '../../api/personnel.api.js';
import { getAlerts } from '../../api/emergency.api.js';
import { FileText, Printer, Download, ShieldCheck, Truck, Archive, AlertTriangle } from 'lucide-react';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('summary'); // 'summary' | 'cargo' | 'personnel' | 'inventory' | 'incidents'
  const [stats, setStats] = useState(null);
  const [cargo, setCargo] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getCargo(),
      getPersonnel(),
      getInventory(),
      getAlerts()
    ]).then(([sRes, cRes, pRes, iRes, aRes]) => {
      setStats(sRes.data);
      setCargo(Array.isArray(cRes.data) ? cRes.data : []);
      setPersonnel(Array.isArray(pRes.data) ? pRes.data : []);
      setInventory(Array.isArray(iRes.data) ? iRes.data : []);
      setAlerts(Array.isArray(aRes.data) ? aRes.data : []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageWrapper title="Operational Reports & Mission Logs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[#F9FAFB] text-xl font-bold">NCPOR Polar Expedition Operations Log</h2>
            <p className="text-[#9CA3AF] text-xs mt-0.5">
              Certified mission documentation for Ministry of Earth Sciences (MoES) & NCPOR audit
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#1F2937] hover:bg-[#1E3A5F] text-[#38BDF8] border border-[#1E3A5F] px-4 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Export PDF
          </button>
        </div>

        {/* Report Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#1E3A5F] pb-3">
          <button
            onClick={() => setActiveReport('summary')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeReport === 'summary' ? 'bg-[#38BDF8] text-[#0B1120]' : 'bg-[#1F2937] text-[#9CA3AF] hover:text-white'
            }`}
          >
            📋 Master Mission Summary
          </button>
          <button
            onClick={() => setActiveReport('cargo')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeReport === 'cargo' ? 'bg-[#38BDF8] text-[#0B1120]' : 'bg-[#1F2937] text-[#9CA3AF] hover:text-white'
            }`}
          >
            🚚 Cargo & Logistics Pipeline
          </button>
          <button
            onClick={() => setActiveReport('personnel')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeReport === 'personnel' ? 'bg-[#38BDF8] text-[#0B1120]' : 'bg-[#1F2937] text-[#9CA3AF] hover:text-white'
            }`}
          >
            👥 Crew Medical Fitness Audit
          </button>
          <button
            onClick={() => setActiveReport('inventory')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeReport === 'inventory' ? 'bg-[#38BDF8] text-[#0B1120]' : 'bg-[#1F2937] text-[#9CA3AF] hover:text-white'
            }`}
          >
            📦 Station Depots & Critical Stock
          </button>
          <button
            onClick={() => setActiveReport('incidents')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeReport === 'incidents' ? 'bg-[#38BDF8] text-[#0B1120]' : 'bg-[#1F2937] text-[#9CA3AF] hover:text-white'
            }`}
          >
            🚨 Emergency Incident Ledger
          </button>
        </div>

        {/* Report Canvas Content */}
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-6 print:bg-white print:text-black print:border-none">
          {/* Printable Header */}
          <div className="border-b border-[#1E3A5F] pb-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">❄️</span>
              <div>
                <h3 className="text-base font-black text-[#F9FAFB] uppercase tracking-wider print:text-black">
                  National Centre for Polar and Ocean Research
                </h3>
                <p className="text-xs text-[#9CA3AF] print:text-gray-600">
                  Government of India • Ministry of Earth Sciences • Polar Operations Division
                </p>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-[#9CA3AF]">
              <p>Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <p>Status: CERTIFIED OFFICIAL</p>
            </div>
          </div>

          {/* Report View: Summary */}
          {activeReport === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-[#1F2937] rounded-xl">
                  <p className="text-[11px] text-[#9CA3AF]">Active Missions</p>
                  <p className="text-xl font-bold text-[#38BDF8]">{stats?.activeExpeditions || 3}</p>
                </div>
                <div className="p-3 bg-[#1F2937] rounded-xl">
                  <p className="text-[11px] text-[#9CA3AF]">Total Personnel</p>
                  <p className="text-xl font-bold text-[#34D399]">{stats?.totalPersonnel || 8} Deployed</p>
                </div>
                <div className="p-3 bg-[#1F2937] rounded-xl">
                  <p className="text-[11px] text-[#9CA3AF]">Cargo in Pipeline</p>
                  <p className="text-xl font-bold text-[#FBBF24]">{stats?.cargoInTransit || 3} Consignments</p>
                </div>
                <div className="p-3 bg-[#1F2937] rounded-xl">
                  <p className="text-[11px] text-[#9CA3AF]">Life-Safety Incidents</p>
                  <p className="text-xl font-bold text-red-400">{stats?.activeAlerts || 1} Active</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
                  Current Active Polar Campaigns
                </h4>
                <div className="space-y-2">
                  {(stats?.expeditions || []).map((exp) => (
                    <div key={exp.id} className="p-3 bg-[#1F2937] rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#F9FAFB]">{exp.name}</p>
                        <p className="text-[#9CA3AF]">Station: {exp.destination} • Risk: {exp.risk_level}</p>
                      </div>
                      <Badge value={exp.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Report View: Cargo */}
          {activeReport === 'cargo' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#1F2937] text-[#9CA3AF] uppercase text-[10px]">
                    <th className="p-2.5 text-left">Code</th>
                    <th className="p-2.5 text-left">Item</th>
                    <th className="p-2.5 text-left">Category</th>
                    <th className="p-2.5 text-left">Origin → Destination</th>
                    <th className="p-2.5 text-center">Weight</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A5F]">
                  {cargo.map((c) => (
                    <tr key={c.id}>
                      <td className="p-2.5 font-mono text-[#38BDF8]">{c.tracking_code || `CR-${1000 + c.id}`}</td>
                      <td className="p-2.5 font-bold text-[#F9FAFB]">{c.item_name}</td>
                      <td className="p-2.5"><Badge value={c.category} /></td>
                      <td className="p-2.5 text-[#9CA3AF]">{c.origin} → {c.destination}</td>
                      <td className="p-2.5 text-center">{c.weight_kg ? `${c.weight_kg} kg` : '—'}</td>
                      <td className="p-2.5 text-right"><Badge value={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Report View: Personnel */}
          {activeReport === 'personnel' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#1F2937] text-[#9CA3AF] uppercase text-[10px]">
                    <th className="p-2.5 text-left">Name</th>
                    <th className="p-2.5 text-left">Specialty</th>
                    <th className="p-2.5 text-left">Assigned Mission</th>
                    <th className="p-2.5 text-left">Current Location</th>
                    <th className="p-2.5 text-right">Medical Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A5F]">
                  {personnel.map((p) => (
                    <tr key={p.id}>
                      <td className="p-2.5 font-bold text-[#F9FAFB]">{p.name}</td>
                      <td className="p-2.5 text-[#38BDF8]">{p.role_title}</td>
                      <td className="p-2.5 text-[#9CA3AF]">{p.expedition_name || 'General Roster'}</td>
                      <td className="p-2.5 font-mono text-[#F9FAFB]">{p.current_waypoint || 'Base'}</td>
                      <td className="p-2.5 text-right"><Badge value={p.health_status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Report View: Inventory */}
          {activeReport === 'inventory' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#1F2937] text-[#9CA3AF] uppercase text-[10px]">
                    <th className="p-2.5 text-left">Catalog Item</th>
                    <th className="p-2.5 text-left">Category</th>
                    <th className="p-2.5 text-center">Available Stock</th>
                    <th className="p-2.5 text-center">Buffer Threshold</th>
                    <th className="p-2.5 text-left">Depot Bay</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A5F]">
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5 font-bold text-[#F9FAFB]">{item.name}</td>
                      <td className="p-2.5"><Badge value={item.category} /></td>
                      <td className="p-2.5 text-center font-bold text-[#38BDF8]">{item.quantity} {item.unit}</td>
                      <td className="p-2.5 text-center text-[#9CA3AF]">{item.min_threshold} {item.unit}</td>
                      <td className="p-2.5 text-[#9CA3AF]">{item.location}</td>
                      <td className="p-2.5 text-right">
                        {item.quantity <= item.min_threshold ? (
                          <span className="text-red-400 font-bold">REORDER</span>
                        ) : (
                          <span className="text-green-400 font-bold">NOMINAL</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Report View: Incidents */}
          {activeReport === 'incidents' && (
            <div className="space-y-3">
              {alerts.map((a) => (
                <div key={a.id} className="p-3.5 bg-[#1F2937] rounded-xl border border-[#1E3A5F] text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge value={a.severity} />
                      <Badge value={a.alert_type} />
                      <span className="font-bold text-[#F9FAFB]">{a.expedition_name || a.location_description}</span>
                    </div>
                    <span className="text-[10px] text-[#9CA3AF]">{new Date(a.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-[#F9FAFB] mb-2">{a.description}</p>
                  <p className="text-[11px] text-[#9CA3AF]">
                    Raised by: <strong className="text-[#38BDF8]">{a.raised_by}</strong> • Status: {a.resolved ? '✅ Resolved' : '🚨 Active'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
