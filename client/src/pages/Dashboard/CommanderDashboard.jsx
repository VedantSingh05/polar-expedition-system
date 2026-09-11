import { useState } from 'react';
import StatCard from '../../components/ui/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { 
  ShieldAlert, 
  Users, 
  MapPin, 
  AlertTriangle, 
  Radio, 
  Activity, 
  Compass, 
  HeartHandshake, 
  ShieldCheck, 
  ExternalLink,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CommanderDashboard({ stats, onRefresh }) {
  const [selectedNode, setSelectedNode] = useState(stats?.mapNodes?.[1] || stats?.mapNodes?.[0] || null);

  const safePersonnel = stats?.personnelSafe ?? (stats?.totalPersonnel - (stats?.personnelAttention || 0));
  const attentionPersonnel = stats?.personnelAttention || 0;

  return (
    <div className="space-y-6">
      {/* Top Banner — Operational Status */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎖️</span>
            <span className="text-xs font-bold text-[#38BDF8] tracking-widest uppercase">
              Operational Command Authority
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#F9FAFB] tracking-tight mt-0.5">
            COMMAND CENTER
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Global Polar Operations, Mission Telemetry & Life-Safety Decision Support System
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#1F2937] border border-[#1E3A5F] px-3.5 py-2 rounded-xl flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-[#34D399] rounded-full animate-ping" />
            <div>
              <p className="text-[10px] uppercase font-bold text-[#9CA3AF]">Operations Health</p>
              <p className="text-xs font-bold text-[#34D399]">
                {stats?.overallOperationalStatus || 'ALL STATIONS NOMINAL'}
              </p>
            </div>
          </div>
          <Link
            to="/emergency"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-red-950 flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Emergency Incident Room ({stats?.activeAlerts || 0})
          </Link>
        </div>
      </div>

      {/* Primary High-Level Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Active Expeditions"
          value={stats?.activeExpeditions || 0}
          subtitle="Out of 4 registered"
          icon={Compass}
          color="accent"
        />
        <StatCard
          title="Personnel Deployed"
          value={stats?.totalPersonnel || 0}
          subtitle="Across all stations"
          icon={Users}
          color="accent"
        />
        <StatCard
          title="Personnel Safe"
          value={safePersonnel}
          subtitle="100% accounted for"
          icon={ShieldCheck}
          color="success"
        />
        <StatCard
          title="Requiring Attention"
          value={attentionPersonnel}
          subtitle={attentionPersonnel > 0 ? 'Medical / Observation' : 'All crew nominal'}
          icon={HeartHandshake}
          color={attentionPersonnel > 0 ? 'warning' : 'success'}
        />
        <StatCard
          title="Active Polar SOS"
          value={stats?.activeAlerts || 0}
          subtitle={stats?.criticalAlerts > 0 ? `${stats.criticalAlerts} CRITICAL PRIORITY` : 'All channels monitored'}
          icon={AlertTriangle}
          color={stats?.activeAlerts > 0 ? 'danger' : 'success'}
        />
        <StatCard
          title="Active Camps & Bases"
          value={stats?.activeCampsCount || 4}
          subtitle="Maitri, Bharati, Himadri"
          icon={MapPin}
          color="accent"
        />
      </div>

      {/* LIVE OPERATIONS MAP / TACTICAL VISUALIZATION */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1E3A5F]">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#38BDF8] animate-pulse" />
              <h2 className="text-base font-bold text-[#F9FAFB] uppercase tracking-wide">
                Live Operations & Tactical Deployment Grid
              </h2>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Live coordinates, team positions, rescue assets, and environmental telemetry
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1F2937] text-green-300">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> Nominal Base
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1F2937] text-yellow-300">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Caution / Active Team
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1F2937] text-sky-300">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span> Rescue Asset
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Map Canvas Simulator */}
          <div className="lg:col-span-2 bg-[#0B1120] border border-[#1E3A5F] rounded-xl p-4 min-h-[320px] flex flex-col justify-between relative overflow-hidden">
            {/* Grid overlay background */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Sector Tags */}
            <div className="flex items-center justify-between z-10 text-[10px] font-mono text-[#9CA3AF]">
              <span>SECTOR ANTARCTIC-A (65°S-75°S)</span>
              <span className="text-[#38BDF8] animate-pulse">SAT-LINK: IRIDIUM NEXT MESH ACTIVE</span>
              <span>SECTOR ARCTIC-B (78°N-82°N)</span>
            </div>

            {/* Tactical Nodes Map Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 z-10 my-4">
              {(stats?.mapNodes || []).map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isRescue = node.type === 'rescue_asset';
                const isCaution = node.status === 'caution';

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-[#1F2937] border-[#38BDF8] shadow-lg shadow-[#38BDF8]/20 ring-1 ring-[#38BDF8]'
                        : 'bg-[#111827]/80 hover:bg-[#1F2937] border-[#1E3A5F]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          isRescue ? 'bg-sky-400' : isCaution ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
                        }`} />
                        <span className="text-xs font-bold text-[#F9FAFB] line-clamp-1">{node.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#9CA3AF]">{node.zone}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#9CA3AF]">
                      <span>{isRescue ? node.capacity : `Crew: ${node.crew} deployed`}</span>
                      <span className="text-[#38BDF8] font-mono">{node.lat.toFixed(2)}°, {node.lng.toFixed(2)}°</span>
                    </div>

                    <div className="mt-1 text-[11px] text-[#34D399] font-mono truncate">
                      🌡️ {node.weather || 'Normal'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#9CA3AF] z-10 pt-2 border-t border-[#1E3A5F]">
              <span>NCPOR POLAR GEO-SURFACE TELEMETRY</span>
              <span>COORDINATE DATUM: WGS84</span>
            </div>
          </div>

          {/* Node Inspector Detail Panel */}
          <div className="bg-[#1F2937] border border-[#1E3A5F] rounded-xl p-4 flex flex-col justify-between">
            {selectedNode ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider">
                      Selected Outpost / Unit
                    </span>
                    <h3 className="text-sm font-bold text-[#F9FAFB]">{selectedNode.name}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    selectedNode.status === 'nominal' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#1E3A5F]/50">
                    <span className="text-[#9CA3AF]">Polar Sector:</span>
                    <span className="text-[#F9FAFB] font-medium">{selectedNode.zone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E3A5F]/50">
                    <span className="text-[#9CA3AF]">GPS Coordinates:</span>
                    <span className="text-[#38BDF8] font-mono">{selectedNode.lat}°, {selectedNode.lng}°</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E3A5F]/50">
                    <span className="text-[#9CA3AF]">Stationed Crew:</span>
                    <span className="text-[#F9FAFB] font-medium">{selectedNode.crew || selectedNode.capacity || 'Standby'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E3A5F]/50">
                    <span className="text-[#9CA3AF]">Environment Conditions:</span>
                    <span className="text-yellow-300 font-medium">{selectedNode.weather || '-20°C'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E3A5F]/50">
                    <span className="text-[#9CA3AF]">Active Incidents:</span>
                    <span className={selectedNode.activeAlerts > 0 ? 'text-red-400 font-bold' : 'text-green-400'}>
                      {selectedNode.activeAlerts > 0 ? `${selectedNode.activeAlerts} Hazard Flag` : 'None (Clear)'}
                    </span>
                  </div>
                </div>

                <div className="bg-[#111827] p-3 rounded-lg border border-[#1E3A5F] text-xs">
                  <p className="text-[#9CA3AF] text-[11px] uppercase font-bold mb-1">Commander Directive</p>
                  <p className="text-[#F9FAFB] text-xs leading-relaxed">
                    Continuous hourly telemetry logging enabled. Emergency rescue snowcats on 15-minute standby protocol.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#9CA3AF] text-center py-10">Select an outpost node to inspect telemetry.</p>
            )}

            <div className="pt-3 border-t border-[#1E3A5F] mt-3 flex items-center gap-2">
              <Link
                to="/expeditions"
                className="w-full text-center bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#0B1120] font-bold text-xs py-2 rounded-lg transition-colors"
              >
                View Full Expedition Dossier
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Priority Alerts & Expedition Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PRIORITY ALERTS (1 Column) */}
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1E3A5F]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wide">
                Priority Alerts & Risk Triage
              </h3>
            </div>
            <Link to="/emergency" className="text-xs text-[#38BDF8] hover:underline font-semibold">
              Emergency Center →
            </Link>
          </div>

          <div className="space-y-3">
            {(stats?.priorityAlerts || []).slice(0, 4).map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3.5 rounded-xl border transition-all ${
                  alert.resolved === 0 && alert.severity === 'high'
                    ? 'bg-red-950/30 border-red-800'
                    : 'bg-[#1F2937] border-[#1E3A5F]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Badge value={alert.severity} />
                    <span className="text-xs font-semibold text-[#F9FAFB] capitalize">
                      {alert.alert_type?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9CA3AF]">
                    {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="text-xs text-[#F9FAFB] line-clamp-2 leading-relaxed">{alert.description}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1E3A5F]/50 text-[11px] text-[#9CA3AF]">
                  <span>📍 {alert.expedition_name || alert.location_description || 'Base'}</span>
                  <span className="text-[#38BDF8] font-medium">{alert.raised_by}</span>
                </div>
              </div>
            ))}

            {(!stats?.priorityAlerts || stats.priorityAlerts.length === 0) && (
              <p className="text-xs text-[#9CA3AF] text-center py-6">All channels clear. Zero active alerts.</p>
            )}
          </div>
        </div>

        {/* EXPEDITION STATUS (2 Columns) */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1E3A5F]">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wide">
                Expedition Operations Status
              </h3>
            </div>
            <Link to="/expeditions" className="text-xs text-[#38BDF8] hover:underline font-semibold">
              Manage Missions →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#1F2937] text-[#9CA3AF] uppercase text-[10px] tracking-wider">
                  <th className="px-3 py-2.5 text-left">Expedition Mission</th>
                  <th className="px-3 py-2.5 text-left">Location / Waypoint</th>
                  <th className="px-3 py-2.5 text-center">Team</th>
                  <th className="px-3 py-2.5 text-center">Risk Level</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                  <th className="px-3 py-2.5 text-right">Last Check-in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A5F]">
                {(stats?.expeditions || []).map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#1F2937]/50 transition-colors">
                    <td className="px-3 py-3">
                      <p className="font-bold text-[#F9FAFB]">{exp.name}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{exp.destination}</p>
                    </td>
                    <td className="px-3 py-3 font-mono text-[#38BDF8]">
                      {exp.current_location || 'Base Camp'}
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-[#F9FAFB]">
                      {exp.team_size || exp.crew_count || 0}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        exp.risk_level === 'high' || exp.risk_level === 'severe'
                          ? 'bg-red-900/50 text-red-300 border border-red-700'
                          : exp.risk_level === 'moderate'
                          ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
                          : 'bg-green-900/50 text-green-300 border border-green-700'
                      }`}>
                        {exp.risk_level || 'Moderate'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge value={exp.status} />
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-[#9CA3AF]">
                      {exp.last_checkin ? new Date(exp.last_checkin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '14:30'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Commander Quick Operational Actions */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5">
        <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
          Commander Rapid Command Actions
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/personnel"
            className="p-3.5 bg-[#1F2937] hover:bg-[#1F2937]/80 rounded-xl text-center border border-[#1E3A5F] transition-colors"
          >
            <Users className="w-5 h-5 text-[#34D399] mx-auto mb-1" />
            <p className="text-sm font-bold text-[#F9FAFB]">Personnel Roster</p>
            <p className="text-[11px] text-[#9CA3AF]">Medical fitness & crew</p>
          </Link>
          <Link
            to="/expeditions"
            className="p-3.5 bg-[#1F2937] hover:bg-[#1F2937]/80 rounded-xl text-center border border-[#1E3A5F] transition-colors"
          >
            <Compass className="w-5 h-5 text-[#38BDF8] mx-auto mb-1" />
            <p className="text-sm font-bold text-[#F9FAFB]">Expeditions</p>
            <p className="text-[11px] text-[#9CA3AF]">Mission planning & routes</p>
          </Link>
          <Link
            to="/emergency"
            className="p-3.5 bg-[#1F2937] hover:bg-[#1F2937]/80 rounded-xl text-center border border-[#1E3A5F] transition-colors"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <p className="text-sm font-bold text-[#F9FAFB]">Emergency Room</p>
            <p className="text-[11px] text-[#9CA3AF]">SOS response & triage</p>
          </Link>
          <Link
            to="/reports"
            className="p-3.5 bg-[#1F2937] hover:bg-[#1F2937]/80 rounded-xl text-center border border-[#1E3A5F] transition-colors"
          >
            <ExternalLink className="w-5 h-5 text-[#FBBF24] mx-auto mb-1" />
            <p className="text-sm font-bold text-[#F9FAFB]">Operational Reports</p>
            <p className="text-[11px] text-[#9CA3AF]">Mission log & compliance</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
