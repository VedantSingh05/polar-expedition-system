import { useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';
import { CheckCircle, ShieldCheck, MapPin, HeartPulse } from 'lucide-react';
import { checkInPersonnel } from '../../api/personnel.api.js';

export default function CheckInModal({ isOpen, onClose, onCheckedIn, currentWaypoint }) {
  const [waypoint, setWaypoint] = useState(currentWaypoint || 'Waypoint 2 (Schirmacher Ridge)');
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
      setSuccessMsg('✅ Check-in recorded! Base Command telemetry updated.');
      if (onCheckedIn) onCheckedIn();
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1500);
    } catch (err) {
      setSuccessMsg('Failed to record check-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Operational Check-In & Safe Arrival">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#0B1120] border border-[#1E3A5F] rounded-xl p-3.5 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[#34D399] flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#F9FAFB]">Polar Safety Checkpoint Protocol</p>
            <p className="text-[11px] text-[#9CA3AF]">
              Transmits location telemetry, vital safety confirmations, and crew status back to Central Command.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 bg-green-950/40 border border-green-700 text-green-300 text-xs rounded-lg text-center font-bold">
            {successMsg}
          </div>
        )}

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
            Current Field Waypoint / Station Position *
          </label>
          <select
            value={waypoint}
            onChange={(e) => setWaypoint(e.target.value)}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#38BDF8]"
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
            Team Medical & Physical Readiness *
          </label>
          <select
            value={healthStatus}
            onChange={(e) => setHealthStatus(e.target.value)}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="fit">🟢 100% Fit — Normal Duty Operations</option>
            <option value="under_observation">🟡 Under Medical Observation — Cold Fatigue / Mild Hypothermia</option>
            <option value="medical_leave">🔴 Medical Alert — Urgent Assistance / Evacuation Recommended</option>
          </select>
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Field Status Briefing
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Environmental conditions, fuel status, radio link strength..."
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E3A5F]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#9CA3AF] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-[#34D399] hover:bg-[#34D399]/80 text-[#0B1120] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            {loading ? 'Transmitting...' : 'TRANSMIT CHECK-IN'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
