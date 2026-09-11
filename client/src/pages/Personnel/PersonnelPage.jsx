import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import AlertBanner from '../../components/ui/AlertBanner.jsx';
import PersonnelForm from './PersonnelForm.jsx';
import { getPersonnel, createPersonnel, updatePersonnel, deletePersonnel } from '../../api/personnel.api.js';
import { getExpeditions } from '../../api/expeditions.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Edit2, Trash2, Search, HeartPulse, UserCheck, Phone, Shield } from 'lucide-react';

export default function PersonnelPage() {
  const { user } = useAuth();
  const canWrite = user?.role === 'commander' || user?.role === 'logistics_officer';
  const isField = user?.role === 'field_personnel';
  const [personnel, setPersonnel] = useState([]);
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterExpedition, setFilterExpedition] = useState('all');
  const [filterHealth, setFilterHealth] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, eRes] = await Promise.all([getPersonnel(), getExpeditions()]);
      setPersonnel(Array.isArray(pRes.data) ? pRes.data : []);
      setExpeditions(Array.isArray(eRes.data) ? eRes.data : []);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load personnel roster.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setEditingPersonnel(null);
    setModalOpen(true);
  };

  const handleEdit = (p) => {
    setEditingPersonnel(p);
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete record for crew member "${name}"?`)) return;
    try {
      await deletePersonnel(id);
      setAlert({ type: 'success', message: `Crew member "${name}" removed.` });
      fetchData();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.error || 'Failed to delete record.' });
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingPersonnel) {
        await updatePersonnel(editingPersonnel.id, formData);
        setAlert({ type: 'success', message: 'Crew member record updated successfully.' });
      } else {
        await createPersonnel(formData);
        setAlert({ type: 'success', message: 'Crew member registered successfully.' });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.error || 'Error saving member details.' });
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = personnel.filter(p => {
    const matchesExp = filterExpedition === 'all' || String(p.expedition_id) === String(filterExpedition);
    const matchesHealth = filterHealth === 'all' || p.health_status === filterHealth;
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.role_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.skills?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesExp && matchesHealth && matchesSearch;
  });

  const columns = [
    {
      key: 'name',
      label: 'Crew Member',
      render: (_, row) => (
        <div>
          <p className="font-medium text-[#F9FAFB]">{row.name}</p>
          <p className="text-xs text-[#9CA3AF]">{row.email || 'No email recorded'}</p>
        </div>
      )
    },
    {
      key: 'role_title',
      label: 'Specialty / Role',
      render: (val) => (
        <span className="text-xs font-semibold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-1 rounded">
          {val}
        </span>
      )
    },
    {
      key: 'expedition_name',
      label: 'Mission Assignment',
      render: (val) => val ? (
        <span className="text-xs text-[#F9FAFB]">{val}</span>
      ) : (
        <span className="text-xs text-[#9CA3AF] italic">Unassigned Reserve</span>
      )
    },
    {
      key: 'health_status',
      label: 'Medical Status',
      render: (val) => <Badge value={val} />
    },
    {
      key: 'skills',
      label: 'Technical Skills',
      render: (val) => (
        <span className="text-xs text-[#9CA3AF] line-clamp-1 max-w-[180px]" title={val}>
          {val || '—'}
        </span>
      )
    },
    {
      key: 'emergency_contact_name',
      label: 'Emergency Contact',
      render: (_, row) => (
        <div className="text-xs">
          <p className="text-[#F9FAFB]">{row.emergency_contact_name || '—'}</p>
          {row.emergency_contact_phone && (
            <p className="text-[#9CA3AF] flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-[#34D399]" />
              {row.emergency_contact_phone}
            </p>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        canWrite ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(row)}
              className="p-1.5 bg-[#1F2937] hover:bg-[#1F2937]/80 text-[#38BDF8] rounded transition-colors"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(row.id, row.name)}
              className="p-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-[#9CA3AF] italic">Verified Active</span>
        )
      )
    }
  ];

  return (
    <PageWrapper title="Personnel & Crew Management">
      <AlertBanner
        type={alert?.type}
        message={alert?.message}
        onClose={() => setAlert(null)}
      />

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[#F9FAFB] text-xl font-bold">Polar Expedition Personnel Roster</h2>
          <p className="text-[#9CA3AF] text-xs mt-0.5">
            Scientific teams, station engineers, medical officers and logistics personnel
          </p>
        </div>
        {canWrite ? (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-[#38BDF8] text-[#0B1120] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#7DD3FC] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Register Crew Member
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-900/20 border border-amber-700/40 rounded-lg">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-xs font-medium">Read-Only: Team Roster View</span>
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
            placeholder="Search member, skill, role..."
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
            <option value="all">All Missions</option>
            {expeditions.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          <select
            value={filterHealth}
            onChange={e => setFilterHealth(e.target.value)}
            className="bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="all">All Medical Statuses</option>
            <option value="fit">Fit for Duty</option>
            <option value="under_observation">Under Observation</option>
            <option value="medical_leave">Medical Leave</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-[#38BDF8]">Loading crew roster...</div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage="No personnel records match the current filters."
          />
        )}
      </div>

      {/* Modal */}
      {canWrite && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingPersonnel ? 'Edit Crew Member Record' : 'Register Expedition Crew Member'}
        >
          <PersonnelForm
            initialData={editingPersonnel}
            expeditions={expeditions}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalOpen(false)}
            loading={formLoading}
          />
        </Modal>
      )}
    </PageWrapper>
  );
}
