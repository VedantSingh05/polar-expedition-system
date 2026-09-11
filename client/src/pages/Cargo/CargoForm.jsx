import { useState, useEffect } from 'react';

export default function CargoForm({ initialData, expeditions, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    expedition_id: expeditions[0]?.id || '',
    item_name: '',
    category: 'equipment',
    quantity: 1,
    weight_kg: '',
    status: 'pending',
    transport_stage: 'PORT',
    current_location: 'Port, Goa',
    condition: 'good',
    origin: 'NCPOR Logistics Base, Goa',
    destination: 'Maitri Station, Antarctica',
    dispatch_date: '',
    arrival_date: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        expedition_id: initialData.expedition_id || (expeditions[0]?.id || ''),
        item_name: initialData.item_name || '',
        category: initialData.category || 'equipment',
        quantity: initialData.quantity || 1,
        weight_kg: initialData.weight_kg || '',
        status: initialData.status || 'pending',
        transport_stage: initialData.transport_stage || 'PORT',
        current_location: initialData.current_location || 'Port, Goa',
        condition: initialData.condition || 'good',
        origin: initialData.origin || 'NCPOR Logistics Base, Goa',
        destination: initialData.destination || 'Maitri Station, Antarctica',
        dispatch_date: initialData.dispatch_date || '',
        arrival_date: initialData.arrival_date || '',
        notes: initialData.notes || '',
      });
    } else if (expeditions.length > 0 && !formData.expedition_id) {
      setFormData(prev => ({ ...prev, expedition_id: expeditions[0].id }));
    }
  }, [initialData, expeditions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'quantity' || name === 'weight_kg')
        ? (value === '' ? '' : Number(value))
        : (name === 'expedition_id' ? Number(value) : value)
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
          Cargo Item Description *
        </label>
        <input
          type="text"
          name="item_name"
          value={formData.item_name}
          onChange={handleChange}
          placeholder="e.g., Cold-weather Aviation Turbine Fuel (50 drums)"
          required
          className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Target Expedition *
          </label>
          <select
            name="expedition_id"
            value={formData.expedition_id}
            onChange={handleChange}
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
            Cargo Classification *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="equipment">Heavy Machinery & Equipment</option>
            <option value="scientific">Scientific Instruments</option>
            <option value="fuel">Fuel & Energy Reserves</option>
            <option value="food">Rations & Food Supplies</option>
            <option value="medical">Medical & Pharmaceutical Kits</option>
            <option value="other">General Logistics & Spares</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Quantity (units) *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Total Weight (kg)
          </label>
          <input
            type="number"
            name="weight_kg"
            value={formData.weight_kg}
            onChange={handleChange}
            min="0"
            step="0.1"
            placeholder="e.g., 1250"
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Transit Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="pending">Pending Dispatch</option>
            <option value="in_transit">In Transit / At Sea</option>
            <option value="delivered">Delivered at Station</option>
            <option value="lost">Lost / Damaged in Transit</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Transport Stage
          </label>
          <select
            name="transport_stage"
            value={formData.transport_stage}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="PORT">Port (Goa)</option>
            <option value="SHIP">Sea Transit</option>
            <option value="AIRCRAFT">Air Lift</option>
            <option value="SNOWCAT">Snowcat</option>
            <option value="FIELD_CAMP">Field Camp</option>
          </select>
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Current Location
          </label>
          <input
            type="text"
            name="current_location"
            value={formData.current_location}
            onChange={handleChange}
            placeholder="e.g., Goa Port Terminal 3"
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Cargo Condition
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="good">Good Condition</option>
            <option value="damaged">Damaged</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Origin / Departure Port
          </label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="Goa Port / Cape Town"
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Destination Station / Port
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Bharati Station / Longyearbyen"
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Dispatch Date
          </label>
          <input
            type="date"
            name="dispatch_date"
            value={formData.dispatch_date}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Expected / Actual Arrival
          </label>
          <input
            type="date"
            name="arrival_date"
            value={formData.arrival_date}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
          Handling Instructions / Special Requirements
        </label>
        <textarea
          name="notes"
          rows={2}
          value={formData.notes}
          onChange={handleChange}
          placeholder="e.g., Maintain temperature above -10°C, Fragile optical sensors..."
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
          {loading ? 'Saving...' : initialData ? 'Update Cargo Record' : 'Register Cargo Consignment'}
        </button>
      </div>
    </form>
  );
}
