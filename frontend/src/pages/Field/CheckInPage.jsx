import { useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import { ShieldCheck, MapPin, HeartPulse, CheckCircle } from 'lucide-react';
import { checkInPersonnel } from '../../api/personnel.api.js';

export default function CheckInPage() {
  const [waypoint, setWaypoint] = useState('Waypoint 2 (Schirmacher Ridge)');
  const [healthStatus, setHealthStatus] = useState('fit');
  const [notes, setNotes] = useState('Team Alpha safe. Shelter generators operational. All team members accounted for.');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    try {
      await checkInPersonnel({
        waypoint,
        health_status: healthStatus,
        notes
      });
      setSuccessMsg('✅ Check-in transmitted successfully! Central Command verified.');
    } catch (err) {
      setSuccessMsg('Failed to record check-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Safe Check-in & Station Traversal Verification">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1E3A5F]">
            <ShieldCheck className="w-8 h-8 text-[#34D399]" />
            <div>
              <h2 className="text-base font-bold text-[#F9FAFB] uppercase tracking-wide">
                Polar Safety & Checkpoint Verification Protocol
              </h2>
              <p className="text-xs text-[#9CA3AF]">
                Mandatory hourly transmission of GPS location, physiological status, and team safety
              </p>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 bg-green-950/40 border border-green-700 text-green-300 text-xs rounded-xl text-center font-bold mb-4">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                Current Waypoint / Outpost Position *
              </label>
              <select
                value={waypoint}
                onChange={(e) => setWaypoint(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="Maitri Base Camp">Maitri Base Camp (Antarctica)</option>
                <option value="Waypoint 1 (Ice Tongue Relay)">Waypoint 1 (Ice Tongue Relay)</option>
                <option value="Waypoint 2 (Schirmacher Ridge)">Waypoint 2 (Schirmacher Ridge)</option>
                <option value="Remote Glacial Shelter Pod 4">Remote Glacial Shelter Pod 4</option>
                <option value="Bharati Base Camp">Bharati Base Camp (Larsemann Hills)</option>
                <option value="Himadri Research Station">Himadri Research Station (Ny-Ålesund)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-[#34D399]" />
                Team Physiological Readiness *
              </label>
              <select
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="fit">🟢 100% Fit — Normal Duty Operations</option>
                <option value="under_observation">🟡 Under Medical Observation — Cold Fatigue / Mild Hypothermia</option>
                <option value="medical_leave">🔴 Medical Alert — Evacuation Recommended</option>
              </select>
            </div>

            <div>
              <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
                Field Conditions & Environmental Log
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Wind gusts, visibility, fuel status, radio link strength..."
                className="w-full bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#34D399] hover:bg-[#34D399]/80 text-[#0B1120] font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <CheckCircle className="w-5 h-5" />
              {loading ? 'Transmitting Check-in...' : 'TRANSMIT CHECK-IN TO BASE COMMAND'}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
