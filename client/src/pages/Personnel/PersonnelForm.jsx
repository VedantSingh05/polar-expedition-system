import { useState, useEffect } from 'react';

export default function PersonnelForm({ initialData, expeditions, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_title: 'Glaciologist',
    expedition_id: expeditions[0]?.id || '',
    skills: '',
    health_status: 'fit',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        role_title: initialData.role_title || '',
        expedition_id: initialData.expedition_id || (expeditions[0]?.id || ''),
        skills: initialData.skills || '',
        health_status: initialData.health_status || 'fit',
        emergency_contact_name: initialData.emergency_contact_name || '',
        emergency_contact_phone: initialData.emergency_contact_phone || '',
      });
    } else if (expeditions.length > 0 && !formData.expedition_id) {
      setFormData(prev => ({ ...prev, expedition_id: expeditions[0].id }));
    }
  }, [initialData, expeditions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'expedition_id' ? (value ? Number(value) : null) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Dr. Ramesh Gupta"
            required
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="scientist@ncpor.res.in"
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Designation / Role Title *
          </label>
          <input
            type="text"
            name="role_title"
            value={formData.role_title}
            onChange={handleChange}
            placeholder="e.g. Chief Meteorologist"
            required
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Assigned Expedition
          </label>
          <select
            name="expedition_id"
            value={formData.expedition_id || ''}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="">Unassigned / Reserve</option>
            {expeditions.map(exp => (
              <option key={exp.id} value={exp.id}>
                {exp.name} ({exp.destination})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
          Medical & Physiological Clearance *
        </label>
        <select
          name="health_status"
          value={formData.health_status}
          onChange={handleChange}
          className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
        >
          <option value="fit">Fit for Extreme Cold Duty</option>
          <option value="under_observation">Under Medical Observation</option>
          <option value="medical_leave">Medical Leave / Evacuation Alert</option>
        </select>
      </div>

      <div>
        <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
          Key Technical Skills & Certifications
        </label>
        <textarea
          name="skills"
          rows={2}
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g., Ice Core Drilling, Telemedicine, High Altitude Survival, VSAT"
          className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Emergency Contact Name
          </label>
          <input
            type="text"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
            placeholder="Family / Next of kin"
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Emergency Phone
          </label>
          <input
            type="text"
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={handleChange}
            placeholder="+91-9876543210"
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
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
          className="px-5 py-2 bg-[#38BDF8] text-[#0B1120] font-semibold text-sm rounded-lg hover:bg-[#7DD3FC] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Record' : 'Register Member'}
        </button>
      </div>
    </form>
  );
}
