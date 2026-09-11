import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import AlertBanner from '../../components/ui/AlertBanner.jsx';
import CargoDetailPanel from '../../components/ui/CargoDetailPanel.jsx';
import CargoForm from './CargoForm.jsx';
import { getCargo, createCargo, updateCargo, deleteCargo, confirmCargoReceived } from '../../api/cargo.api.js';
import { getExpeditions } from '../../api/expeditions.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Edit2, Trash2, Search, ArrowRight, Eye } from 'lucide-react';

export default function CargoPage() {
  const { user } = useAuth();
  const role = user?.role;
  const canWrite  = role === 'commander' || role === 'logistics_officer';
  const isField   = role === 'field_personnel';

  const [cargoList, setCargoList] = useState([]);
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterExpedition, setFilterExpedition] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCargo, setEditingCargo] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selectedCargo, setSelectedCargo] = useState(null); // detail panel

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, eRes] = await Promise.all([getCargo(), getExpeditions()]);
      setCargoList(Array.isArray(cRes.data) ? cRes.data : []);
      setExpeditions(Array.isArray(eRes.data) ? eRes.data : []);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to fetch cargo consignment records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = () => { setEditingCargo(null); setModalOpen(true); };
  const handleEdit   = (item) => { setEditingCargo(item); setModalOpen(true); setSelectedCargo(null); };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete cargo record "${name}"?`)) return;
    try {
      await deleteCargo(id);
      setAlert({ type: 'success', message: `Cargo item "${name}" deleted.` });
      setSelectedCargo(null);
      fetchData();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.error || 'Failed to delete cargo.' });
    }
  };

  const handleConfirmReceive = async (cargo) => {
    if (!window.confirm(`Confirm receipt of "${cargo.item_name}"? This cannot be undone.`)) return;
    try {
      await confirmCargoReceived(cargo.id, { confirmed_by: user?.name, location_note: 'Field Camp' });
      setAlert({ type: 'success', message: `Receipt of "${cargo.item_name}" confirmed. Marked as delivered.` });
      setSelectedCargo(null);
      fetchData();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.error || 'Failed to confirm receipt.' });
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingCargo) {
        await updateCargo(editingCargo.id, formData);
        setAlert({ type: 'success', message: 'Cargo consignment updated.' });
      } else {
        await createCargo(formData);
        setAlert({ type: 'success', message: 'Cargo consignment registered.' });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.error || 'Error saving cargo consignment.' });
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = cargoList.filter(item => {
    const matchesExp      = filterExpedition === 'all' || String(item.expedition_id) === String(filterExpedition);
    const matchesStatus   = filterStatus === 'all' || item.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch   = item.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.cargo_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.tracking_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.destination?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesExp && matchesStatus && matchesCategory && matchesSearch;
  });

  // Stage badge colours
  const stageLabel = (stage) => {
    const map = { PORT: 'Port', SHIP: 'Sea', AIRCRAFT: 'Air', SNOWCAT: 'Snowcat', FIELD_CAMP: 'Field Camp' };
    return map[stage] || stage;
  };

  const columns = [
    {
      key: 'item_name',
      label: 'Cargo Item',
      render: (_, row) => (
        <div>
          <p className="font-medium text-[#F9FAFB]">{row.item_name}</p>
          <p className="text-[10px] font-mono text-[#38BDF8] mt-0.5">
            {row.cargo_code || row.tracking_code || `ID-${row.id}`}
          </p>
          <p className="text-xs text-[#9CA3AF]">
            {row.quantity} units {row.weight_kg ? `• ${row.weight_kg.toLocaleString()} kg` : ''}
          </p>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (val) => <Badge value={val} />
    },
    {
      key: 'transport_stage',
      label: 'Stage',
      render: (val, row) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-[#38BDF8]">{stageLabel(val || 'PORT')}</span>
          <Badge value={row.status} />
        </div>
      )
    },
    {
      key: 'route',
      label: 'Logistics Route',
      render: (_, row) => (
        <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
          <span>{row.origin || 'Goa'}</span>
          <ArrowRight className="w-3 h-3 text-[#38BDF8] flex-shrink-0" />
          <span className="text-[#F9FAFB] font-medium">{row.destination || 'Station'}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {/* Everyone: View details */}
          <button
            onClick={() => setSelectedCargo(row)}
            className="p-1.5 bg-[#1F2937] hover:bg-[#1E3A5F] text-[#38BDF8] rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Logistics & Commander: Edit */}
          {canWrite && (
            <button
              onClick={() => handleEdit(row)}
              className="p-1.5 bg-[#1F2937] hover:bg-[#1F2937]/80 text-[#38BDF8] rounded transition-colors"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Logistics & Commander: Delete */}
          {canWrite && (
            <button
              onClick={() => handleDelete(row.id, row.item_name)}
              className="p-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <PageWrapper title="Cargo & Supply Chain Tracking">
      <AlertBanner
        type={alert?.type}
        message={alert?.message}
        onClose={() => setAlert(null)}
      />

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[#F9FAFB] text-xl font-bold">Polar Cargo & Shipment Tracking</h2>
          <p className="text-[#9CA3AF] text-xs mt-0.5">
            Track fuel reserves, scientific instruments, provisions, and cold-weather supplies across all transport stages
          </p>
        </div>
        {/* Only logistics_officer and commander can add cargo */}
        {canWrite && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-[#38BDF8] text-[#0B1120] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#7DD3FC] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Cargo Consignment
          </button>
        )}
        {isField && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-900/20 border border-amber-700/40 rounded-lg">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-xs font-medium">View & Confirm Receipt</span>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, code, route..."
            className="w-full bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={filterExpedition}
            onChange={e => setFilterExpedition(e.target.value)}
            className="bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="all">All Expeditions</option>
            {expeditions.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="lost">Lost</option>
          </select>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="all">All Categories</option>
            <option value="equipment">Equipment</option>
            <option value="scientific">Scientific</option>
            <option value="fuel">Fuel</option>
            <option value="food">Food</option>
            <option value="medical">Medical</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-[#38BDF8]">Loading cargo manifests...</div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage="No cargo consignments match the current filters."
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      {canWrite && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCargo ? 'Edit Cargo Consignment' : 'Register New Cargo Consignment'}
        >
          <CargoForm
            initialData={editingCargo}
            expeditions={expeditions}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalOpen(false)}
            loading={formLoading}
          />
        </Modal>
      )}

      {/* Cargo Detail Panel */}
      {selectedCargo && (
        <CargoDetailPanel
          cargo={selectedCargo}
          onClose={() => setSelectedCargo(null)}
          canEdit={canWrite}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReceive={handleConfirmReceive}
          role={role}
        />
      )}
    </PageWrapper>
  );
}
