import { useState } from 'react';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import SOSForm from '../Emergency/SOSForm.jsx';
import CargoScanModal from '../Field/CargoScanModal.jsx';
import CheckInModal from '../Field/CheckInModal.jsx';
import { createAlert } from '../../api/emergency.api.js';
import { 
  ShieldCheck, 
  AlertTriangle, 
  QrCode, 
  MapPin, 
  Radio, 
  Clock, 
  Users, 
  Compass, 
  CheckCircle2, 
  CircleDot,
  Navigation,
  ThermometerSnowflake,
  HeartPulse
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FieldDashboard({ stats, onRefresh }) {
  const [sosOpen, setSosOpen] = useState(false);
  const [cargoScanOpen, setCargoScanOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [routeViewOpen, setRouteViewOpen] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [sosFeedback, setSosFeedback] = useState('');

  const fieldData = stats?.fieldData || {};
  const myRecord = fieldData.myRecord || {};
  const myTeam = fieldData.myTeam || [];
  const waypoints = fieldData.waypointsRoute || [
    { name: 'Maitri Base Camp', status: 'completed', coords: '70.7694° S, 11.7397° E', alt: '117m' },
    { name: 'Waypoint 1 (Ice Tongue Relay)', status: 'completed', coords: '70.7950° S, 11.8100° E', alt: '280m' },
    { name: 'Waypoint 2 (Schirmacher Ridge)', status: 'active', coords: '70.8200° S, 11.8900° E', alt: '450m' },
    { name: 'Remote Glacial Shelter Pod 4', status: 'pending', coords: '70.8600° S, 12.0500° E', alt: '610m' }
  ];

  const handleSosSubmit = async (formData) => {
    setSosLoading(true);
    try {
      await createAlert(formData);
      setSosFeedback('🚨 EMERGENCY SOS BROADCAST SENT TO CENTRAL COMMAND!');
      if (onRefresh) onRefresh();
      setTimeout(() => {
        setSosOpen(false);
        setSosFeedback('');
      }, 2000);
    } catch (err) {
      setSosFeedback('Error broadcasting SOS.');
    } finally {
      setSosLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner — Field Operator Status */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏔️</span>
            <span className="text-xs font-bold text-[#38BDF8] tracking-widest uppercase">
              Field Operations Terminal
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#F9FAFB] tracking-tight mt-0.5">
            FIELD OPERATIONS
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Extreme Environment Tactical Interface • Offline Telemetry & Rapid Response
          </p>
        </div>

        {/* Live Satellite Status Pill */}
        <div className="bg-[#0B1120] border border-[#1E3A5F] px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="w-3 h-3 bg-[#34D399] rounded-full animate-pulse" />
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-[#38BDF8] tracking-wider">SAT-BEACON ACTIVE</p>
            <p className="text-xs font-mono text-[#F9FAFB]">Iridium Mesh Channel 04</p>
          </div>
        </div>
      </div>

      {/* BIG PRIMARY FIELD ACTION BUTTONS (4 LARGE BUTTONS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Button 1: Safe Arrival / Check-in */}
        <button
          onClick={() => setCheckInOpen(true)}
          className="p-6 bg-gradient-to-br from-[#1F2937] to-[#111827] hover:from-[#1E3A5F]/60 hover:to-[#1F2937] border-2 border-[#34D399] hover:border-[#34D399] rounded-2xl text-left transition-all shadow-xl flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#34D399] uppercase bg-[#34D399]/10 px-2 py-0.5 rounded">
                Checkpoint Protocol
              </span>
            </div>
            <h3 className="text-lg font-black text-[#F9FAFB] group-hover:text-[#34D399] transition-colors">
              ✅ SAFE ARRIVAL / CHECK-IN
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              Transmit GPS location, checkpoint arrival, and crew safety verification
            </p>
          </div>
          <div className="w-12 h-12 bg-[#34D399]/20 group-hover:bg-[#34D399] rounded-2xl flex items-center justify-center transition-colors flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#34D399] group-hover:text-[#0B1120] transition-colors" />
          </div>
        </button>

        {/* Button 2: EMERGENCY SOS */}
        <button
          onClick={() => setSosOpen(true)}
          className="p-6 bg-gradient-to-br from-red-950/60 to-[#111827] hover:from-red-900/80 hover:to-red-950 border-2 border-red-600 rounded-2xl text-left transition-all shadow-xl shadow-red-950/40 flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-red-300 uppercase bg-red-900/40 px-2 py-0.5 rounded animate-pulse">
                Life-Safety Priority
              </span>
            </div>
            <h3 className="text-lg font-black text-red-100 group-hover:text-white transition-colors">
              🚨 TRANSMIT SOS DISTRESS
            </h3>
            <p className="text-xs text-red-300">
              Immediate satellite broadcast: blizzard lockdown, injury, power loss
            </p>
          </div>
          <div className="w-12 h-12 bg-red-600 group-hover:bg-red-500 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
        </button>

        {/* Button 3: Scan Cargo QR */}
        <button
          onClick={() => setCargoScanOpen(true)}
          className="p-6 bg-gradient-to-br from-[#1F2937] to-[#111827] hover:from-[#1E3A5F]/60 hover:to-[#1F2937] border border-[#1E3A5F] hover:border-[#38BDF8] rounded-2xl text-left transition-all shadow-xl flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase bg-[#38BDF8]/10 px-2 py-0.5 rounded">
                Supply Manifest
              </span>
            </div>
            <h3 className="text-lg font-black text-[#F9FAFB] group-hover:text-[#38BDF8] transition-colors">
              📦 SCAN CARGO QR / CODE
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              Scan supply crates, verify spare parts, and confirm receipt at field camp
            </p>
          </div>
          <div className="w-12 h-12 bg-[#38BDF8]/20 group-hover:bg-[#38BDF8] rounded-2xl flex items-center justify-center transition-colors flex-shrink-0">
            <QrCode className="w-6 h-6 text-[#38BDF8] group-hover:text-[#0B1120] transition-colors" />
          </div>
        </button>

        {/* Button 4: My Route & Waypoints */}
        <button
          onClick={() => setRouteViewOpen(!routeViewOpen)}
          className="p-6 bg-gradient-to-br from-[#1F2937] to-[#111827] hover:from-[#1E3A5F]/60 hover:to-[#1F2937] border border-[#1E3A5F] hover:border-[#FBBF24] rounded-2xl text-left transition-all shadow-xl flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#FBBF24] uppercase bg-[#FBBF24]/10 px-2 py-0.5 rounded">
                Navigation Trajectory
              </span>
            </div>
            <h3 className="text-lg font-black text-[#F9FAFB] group-hover:text-[#FBBF24] transition-colors">
              🗺️ MY ROUTE & WAYPOINTS
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              Inspect route terrain, altitude profiles, and shelter waypoints
            </p>
          </div>
          <div className="w-12 h-12 bg-[#FBBF24]/20 group-hover:bg-[#FBBF24] rounded-2xl flex items-center justify-center transition-colors flex-shrink-0">
            <Navigation className="w-6 h-6 text-[#FBBF24] group-hover:text-[#0B1120] transition-colors" />
          </div>
        </button>
      </div>

      {/* Field Operator Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Assigned Expedition */}
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <Compass className="w-4 h-4 text-[#38BDF8]" />
            <span className="font-bold uppercase tracking-wider">Assigned Mission</span>
          </div>
          <h3 className="text-sm font-bold text-[#F9FAFB]">
            {fieldData.assignedExpeditionName || 'Maitri Field Survey — Team Alpha'}
          </h3>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1E3A5F]/50">
            <span className="text-[#9CA3AF]">Target Station:</span>
            <span className="text-[#38BDF8] font-medium">{myRecord.expedition_destination || 'Maitri Base'}</span>
          </div>
        </div>

        {/* Card 2: Current Waypoint Position */}
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <MapPin className="w-4 h-4 text-[#34D399]" />
            <span className="font-bold uppercase tracking-wider">Current Waypoint</span>
          </div>
          <h3 className="text-sm font-bold text-[#34D399]">
            {fieldData.currentLocation || 'Waypoint 2 (Schirmacher Ridge)'}
          </h3>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1E3A5F]/50">
            <span className="text-[#9CA3AF]">Last Check-in:</span>
            <span className="text-[#F9FAFB] font-mono">
              {fieldData.lastCheckInTime ? new Date(fieldData.lastCheckInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '14:32'}
            </span>
          </div>
        </div>

        {/* Card 3: Crew Health Readiness */}
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <HeartPulse className="w-4 h-4 text-pink-400" />
            <span className="font-bold uppercase tracking-wider">Operator Readiness</span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F9FAFB]">{myRecord.name || 'Dr. Arun Kumar'}</h3>
            <Badge value={myRecord.health_status || 'fit'} />
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1E3A5F]/50">
            <span className="text-[#9CA3AF]">Role:</span>
            <span className="text-[#38BDF8] text-[11px] font-medium">{myRecord.role_title || 'Glaciologist & Team Lead'}</span>
          </div>
        </div>
      </div>

      {/* WAYPOINT ROUTE STEPPER VISUALIZER */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E3A5F]">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#FBBF24]" />
            <h2 className="text-base font-bold text-[#F9FAFB] uppercase tracking-wide">
              Expedition Traversal Path & Shelter Checkpoints
            </h2>
          </div>
          <span className="text-xs font-mono text-[#9CA3AF]">Active Leg: Waypoint 2 → Shelter Pod 4</span>
        </div>

        {/* Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {waypoints.map((wp, idx) => {
            const isCompleted = wp.status === 'completed';
            const isActive = wp.status === 'active';

            return (
              <div 
                key={idx}
                className={`p-3.5 rounded-xl border relative ${
                  isActive
                    ? 'bg-[#1F2937] border-[#38BDF8] ring-1 ring-[#38BDF8]'
                    : isCompleted
                    ? 'bg-[#111827] border-green-800/60 text-green-300'
                    : 'bg-[#0B1120] border-[#1E3A5F] text-[#9CA3AF]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#9CA3AF]">
                    Leg {idx + 1}
                  </span>
                  {isCompleted ? (
                    <span className="text-[10px] font-bold text-green-400 bg-green-950/40 px-1.5 py-0.5 rounded">
                      ✓ Cleared
                    </span>
                  ) : isActive ? (
                    <span className="text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/20 px-1.5 py-0.5 rounded animate-pulse">
                      📍 CURRENT
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#9CA3AF]">Pending</span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-[#F9FAFB] mt-1">{wp.name}</h4>
                <div className="mt-2 text-[11px] text-[#9CA3AF] font-mono space-y-0.5">
                  <p>Coords: {wp.coords}</p>
                  <p>Elevation: {wp.alt}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Field Team Roster */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1E3A5F]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#38BDF8]" />
            <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wide">
              Deployed Expedition Field Team Roster
            </h3>
          </div>
          <span className="text-xs text-[#9CA3AF] font-mono">{myTeam.length} Crew Members</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {myTeam.map((member) => (
            <div key={member.id} className="p-3 bg-[#1F2937] border border-[#1E3A5F] rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#F9FAFB] truncate">{member.name}</p>
                <Badge value={member.health_status} />
              </div>
              <p className="text-[#38BDF8] text-[11px]">{member.role_title}</p>
              <p className="text-[10px] text-[#9CA3AF] truncate">📍 {member.current_waypoint || 'Base'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <CheckInModal
        isOpen={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        onCheckedIn={() => {
          if (onRefresh) onRefresh();
        }}
        currentWaypoint={fieldData.currentLocation}
      />

      <CargoScanModal
        isOpen={cargoScanOpen}
        onClose={() => setCargoScanOpen(false)}
        onScanned={() => {
          if (onRefresh) onRefresh();
        }}
      />

      {/* SOS Modal */}
      <Modal
        isOpen={sosOpen}
        onClose={() => setSosOpen(false)}
        title="Emergency Polar SOS Distress Transmission"
      >
        {sosFeedback ? (
          <div className="p-4 bg-red-950 border border-red-600 text-red-200 text-sm font-bold rounded-xl text-center">
            {sosFeedback}
          </div>
        ) : (
          <SOSForm
            expeditions={stats?.expeditions || []}
            onSubmit={handleSosSubmit}
            onCancel={() => setSosOpen(false)}
            loading={sosLoading}
          />
        )}
      </Modal>
    </div>
  );
}
