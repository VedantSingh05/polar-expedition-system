import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import AlertBanner from '../../components/ui/AlertBanner.jsx';
import ExpeditionForm from './ExpeditionForm.jsx';
import { getExpeditions, createExpedition, updateExpedition, deleteExpedition } from '../../api/expeditions.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Edit2, Trash2, Users, Calendar, MapPin, Search, Eye, ShieldAlert } from 'lucide-react';

export default function ExpeditionsPage() {
  const { user } = useAuth();
  const role = user?.role;
  const isCommander       = role === 'commander';
  const isLogistics       = role === 'logistics_officer';
  const isField           = role === 'field_personnel';

  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpedition, setEditingExpedition] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchExpeditions = async () => {
    try {
      setLoading(true);
      const res = await getExpeditions();
      setExpeditions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to fetch expeditions data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpeditions(); }, []);

  const handleCreate = () => { setEditingExpedition(null); setModalOpen(true); };
  const handleEdit   = (exp) => { setEditingExpedition(exp); setModalOpen(true); };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete expedition "${name}"?`)) return;
    try {
      await deleteExpedition(id);
      setAlert({ type: 'success', message: `Expedition "${name}" successfully deleted.` });
      fetchExpeditions();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.error || 'Failed to delete expedition.' });
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingExpedition) {
        await updateExpedition(editingExpedition.id, formData);
        setAlert({ type: 'success', message: 'Expedition successfully updated.' });
      } else {
        await createExpedition(formData);
        setAlert({ type: 'success', message: 'New expedition successfully registered.' });
      }
      setModalOpen(false);
      fetchExpeditions();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.error || 'Error saving expedition details.' });
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = expeditions.filter(exp => {
    const matchesFilter = filterStatus === 'all' || exp.status === filterStatus;
    const matchesSearch = exp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.destination?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <PageWrapper title="Expedition Management">
      <AlertBanner
        type={alert?.type}
        message={alert?.message}
        onClose={() => setAlert(null)}
      />

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[#F9FAFB] text-xl font-bold">Polar Missions & Field Campaigns</h2>
          <p className="text-[#9CA3AF] text-xs mt-0.5">
            Manage Indian Antarctic & Arctic scientific expeditions
          </p>
        </div>

        {/* Commander: Create button */}
        {isCommander && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-[#38BDF8] text-[#0B1120] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#7DD3FC] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Plan New Expedition
          </button>
        )}

        {/* Logistics Officer: Info badge instead of create */}
        {isLogistics && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-900/20 border border-blue-700/40 rounded-lg">
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-xs font-medium">View Expedition Requirements</span>
          </div>
        )}

        {/* Field Personnel: Read-only badge */}
        {isField && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-900/20 border border-amber-700/40 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-xs font-medium">Assigned Expedition View</span>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search missions, stations..."
            className="w-full bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'active', 'planning', 'completed', 'aborted'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-[#38BDF8] text-[#0B1120] font-semibold'
                  : 'bg-[#1F2937] text-[#9CA3AF] hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-[#38BDF8]">Loading expedition records...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-12 text-center text-[#9CA3AF]">
          {isField
            ? 'No expeditions are currently assigned to you.'
            : 'No expeditions found matching your criteria.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(exp => (
            <div
              key={exp.id}
              className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-5 flex flex-col justify-between hover:border-[#38BDF8]/60 transition-colors"
            >
              <div>
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge value={exp.zone} />
                  <Badge value={exp.status} />
                </div>

                {/* Title */}
                <h3 className="text-[#F9FAFB] font-bold text-base mb-2">{exp.name}</h3>

                {/* Meta details */}
                <div className="space-y-2 text-xs text-[#9CA3AF] mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                    <span>Station: {exp.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#34D399] flex-shrink-0" />
                    <span>{exp.start_date} → {exp.end_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#FBBF24] flex-shrink-0" />
                    <span>Deployed Team: {exp.team_size || 0} scientists/engineers</span>
                  </div>
                </div>

                {/* Description */}
                {exp.description && (
                  <p className="text-[#9CA3AF] text-xs line-clamp-3 bg-[#1F2937]/60 p-2.5 rounded-lg mb-4">
                    {exp.description}
                  </p>
                )}
              </div>

              {/* Actions row — only Commander sees Edit/Delete */}
              {isCommander && (
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E3A5F]">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F2937] hover:bg-[#1F2937]/80 text-[#38BDF8] text-xs font-medium rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id, exp.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              )}

              {/* Logistics Officer: View Requirements button */}
              {isLogistics && (
                <div className="flex items-center justify-end pt-3 border-t border-[#1E3A5F]">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/20 text-blue-400 text-xs font-medium rounded-lg border border-blue-700/30">
                    <Eye className="w-3.5 h-3.5" />
                    View Requirements
                  </span>
                </div>
              )}

              {/* Field Personnel: just their assignment badge */}
              {isField && (
                <div className="flex items-center justify-start pt-3 border-t border-[#1E3A5F]">
                  <span className="text-xs text-amber-400 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Your Assigned Expedition
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal — Commander only */}
      {isCommander && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingExpedition ? 'Edit Expedition Campaign' : 'Plan New Polar Expedition'}
        >
          <ExpeditionForm
            initialData={editingExpedition}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalOpen(false)}
            loading={formLoading}
          />
        </Modal>
      )}
    </PageWrapper>
  );
}
