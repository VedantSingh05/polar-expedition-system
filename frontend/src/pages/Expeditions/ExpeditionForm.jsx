import { useState, useEffect } from 'react';

export default function ExpeditionForm({ initialData, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    destination: 'Maitri Station',
    zone: 'antarctic',
    start_date: '',
    end_date: '',
    status: 'planning',
    team_size: 10,
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        destination: initialData.destination || 'Maitri Station',
        zone: initialData.zone || 'antarctic',
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        status: initialData.status || 'planning',
        team_size: initialData.team_size || 10,
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'team_size' ? Number(value) : value,
      // Auto-set zone if standard station selected
      ...(name === 'destination' && {
        zone: (value === 'Maitri Station' || value === 'Bharati Station' || value === 'Dakshin Gangotri')
          ? 'antarctic'
          : 'arctic'
      })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
          Expedition Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., 44th Indian Scientific Expedition to Antarctica"
          required
          className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Destination Station *
          </label>
          <select
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="Maitri Station">Maitri Station (Antarctica)</option>
            <option value="Bharati Station">Bharati Station (Antarctica)</option>
            <option value="Dakshin Gangotri">Dakshin Gangotri Supply Base</option>
            <option value="Himadri Station">Himadri Station (Arctic, Svalbard)</option>
            <option value="IndARC Mooring">IndARC Underwater Mooring (Arctic)</option>
            <option value="Southern Ocean Campaign">Southern Ocean Expedition Vessel</option>
          </select>
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Polar Zone *
          </label>
          <select
            name="zone"
            value={formData.zone}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="antarctic">Antarctic (South Pole)</option>
            <option value="arctic">Arctic (North Pole)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Start Date *
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            End Date *
          </label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Operational Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="aborted">Aborted</option>
          </select>
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Target Team Size
          </label>
          <input
            type="number"
            name="team_size"
            value={formData.team_size}
            onChange={handleChange}
            min="1"
            max="100"
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
          Mission Scope & Research Objectives
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief details regarding glaciological, atmospheric, or biological research programs..."
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
          className="px-5 py-2 bg-[#38BDF8] text-[#0B1120] font-semibold text-sm rounded-lg hover:bg-[#7DD3FC] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Expedition' : 'Create Expedition'}
        </button>
      </div>
    </form>
  );
}
