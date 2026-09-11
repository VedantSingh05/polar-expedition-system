import { useState, useEffect } from 'react';

export default function InventoryForm({ initialData, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'equipment',
    quantity: 10,
    unit: 'units',
    min_threshold: 5,
    location: 'NCPOR Logistics Warehouse, Goa',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'equipment',
        quantity: initialData.quantity !== undefined ? initialData.quantity : 10,
        unit: initialData.unit || 'units',
        min_threshold: initialData.min_threshold !== undefined ? initialData.min_threshold : 5,
        location: initialData.location || 'NCPOR Logistics Warehouse, Goa',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'quantity' || name === 'min_threshold') ? Number(value) : value
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
            Item Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Arctic Survival Suits (Level 4)"
            required
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="equipment">Field Equipment & Spares</option>
            <option value="safety">Safety & Cold Weather Suits</option>
            <option value="scientific">Scientific Instruments</option>
            <option value="fuel">Fuel & Energy Stores</option>
            <option value="food">Rations & Sustenance</option>
            <option value="medical">Medical & Trauma Kits</option>
            <option value="other">General Stores</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Current Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            required
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Unit of Measurement *
          </label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="units, kg, litres, packs"
            required
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        <div>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
            Minimum Safe Threshold *
          </label>
          <input
            type="number"
            name="min_threshold"
            value={formData.min_threshold}
            onChange={handleChange}
            min="0"
            required
            className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
          Storage Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Cold Storage Bay 2, Maitri Base / NCPOR Goa"
          className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
        />
      </div>

      <div>
        <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
          Stock Notes / Expiry Info
        </label>
        <textarea
          name="notes"
          rows={2}
          value={formData.notes}
          onChange={handleChange}
          placeholder="e.g., Expiry 2028, Keep dry, High-priority winter reserve..."
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
          {loading ? 'Saving...' : initialData ? 'Update Inventory' : 'Add Item to Catalog'}
        </button>
      </div>
    </form>
  );
}
