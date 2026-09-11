import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function SOSForm({ expeditions, onSubmit, onCancel, loading }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    expedition_id: expeditions[0]?.id || '',
    raised_by: user?.name || 'Duty Officer',
    alert_type: 'weather',
    severity: 'critical',
    description: '',
    location_description: 'Maitri Station, Schirmacher Oasis',
  });

  useEffect(() => {
    if (expeditions.length > 0 && !formData.expedition_id) {
      setFormData(prev => ({
        ...prev,
        expedition_id: expeditions[0].id,
        location_description: expeditions[0].destination || prev.location_description
      }));
    }
  }, [expeditions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'expedition_id' ? (value ? Number(value) : null) : value
    }));
  };

  const handleExpeditionChange = (e) => {
    const id = e.target.value ? Number(e.target.value) : null;
    const selected = expeditions.find(exp => exp.id === id);
    setFormData(prev => ({
      ...prev,
      expedition_id: id,
      location_description: selected ? selected.destination : prev.location_description
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-red-950/40 border border-red-800 rounded-lg p-3 text-red-200 text-xs">
        ⚠️ <strong>Emergency Transmission:</strong> This will broadcast a distress alert across the Central Command network and flag this mission for high-priority response.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Station / Expedition in Distress *
          </label>
          <select
            name="expedition_id"
            value={formData.expedition_id || ''}
            onChange={handleExpeditionChange}
            required
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          >
            {expeditions.map(exp => (
              <option key={exp.id} value={exp.id}>
                {exp.name} ({exp.destination})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Distress Call Originator *
          </label>
          <input
            type="text"
            name="raised_by"
            value={formData.raised_by}
            onChange={handleChange}
            placeholder="Officer / Commander Name"
            required
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Emergency Incident Nature *
          </label>
          <select
            name="alert_type"
            value={formData.alert_type}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="weather">Extreme Polar Blizzard / Cyclone</option>
            <option value="medical">Medical Emergency / Trauma / Evacuation</option>
            <option value="structural">Station Power Failure / Structural Damage</option>
            <option value="communication_loss">Total SATCOM & Radio Blackout</option>
            <option value="fire">Fire in Habitation / Fuel Storage</option>
            <option value="other">Other Unforeseen Extreme Threat</option>
          </select>
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Severity Threat Level *
          </label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8] font-bold text-red-400"
          >
            <option value="critical">🚨 CRITICAL (Immediate Life Threat)</option>
            <option value="high">🔴 HIGH (Urgent Intervention Needed)</option>
            <option value="medium">🟡 MEDIUM (Significant Hazard)</option>
            <option value="low">🔵 LOW (Advisory / Observation)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
          Exact Location / Coordinates / Bay
        </label>
        <input
          type="text"
          name="location_description"
          value={formData.location_description}
          onChange={handleChange}
          placeholder="e.g. Maitri Station Main Dome, 70.7694° S, 11.7397° E"
          className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
        />
      </div>

      <div>
        <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
          Situation Report / Urgent Requirements *
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the emergency in detail: casualty status, structural integrity, generator failure, weather forecast, immediate supplies required..."
          required
          className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E3A5F]">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-[#9CA3AF] hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <span>🚨</span>
          {loading ? 'Broadcasting...' : 'TRANSMIT SOS ALERT'}
        </button>
      </div>
    </form>
  );
}
