import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import AlertBanner from '../../components/ui/AlertBanner.jsx';
import SOSForm from './SOSForm.jsx';
import { getAlerts, createAlert, resolveAlert, deleteAlert } from '../../api/emergency.api.js';
import { getExpeditions } from '../../api/expeditions.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { AlertTriangle, CheckCircle, Clock, ShieldAlert, MapPin, User, Trash2, Radio, Shield } from 'lucide-react';

export default function EmergencyPage() {
  const { user } = useAuth();
  const isCommander = user?.role === 'commander';
  const isField = user?.role === 'field_personnel';

  const [alerts, setAlerts] = useState([]);
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'resolved'
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolvingAlert, setResolvingAlert] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [bannerAlert, setBannerAlert] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aRes, eRes] = await Promise.all([
        getAlerts(),
        getExpeditions()
      ]);
      setAlerts(Array.isArray(aRes.data) ? aRes.data : []);
      setExpeditions(Array.isArray(eRes.data) ? eRes.data : []);
    } catch (err) {
      setBannerAlert({ type: 'error', message: 'Failed to fetch emergency alerts.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSOS = async (formData) => {
    setFormLoading(true);
    try {
      await createAlert(formData);
      setBannerAlert({ type: 'success', message: 'SOS alert broadcasted to command network!' });
      setSosModalOpen(false);
      fetchData();
    } catch (err) {
      setBannerAlert({ type: 'error', message: err.response?.data?.error || 'Failed to transmit SOS alert.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenResolve = (alert) => {
    setResolvingAlert(alert);
    setResolutionNotes('');
    setResolveModalOpen(true);
  };

  const handleConfirmResolve = async (e) => {
    e.preventDefault();
    if (!resolvingAlert) return;
    setFormLoading(true);
    try {
      await resolveAlert(resolvingAlert.id, resolutionNotes);
      setBannerAlert({ type: 'success', message: 'Emergency alert marked as resolved and archived.' });
      setResolveModalOpen(false);
      fetchData();
    } catch (err) {
      setBannerAlert({ type: 'error', message: err.response?.data?.error || 'Failed to resolve emergency alert.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this emergency alert log?')) return;
    try {
      await deleteAlert(id);
      setBannerAlert({ type: 'success', message: 'Emergency log deleted.' });
      fetchData();
    } catch (err) {
      setBannerAlert({ type: 'error', message: 'Failed to delete alert.' });
    }
  };

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => Boolean(a.resolved));
  const currentList = activeTab === 'active' ? activeAlerts : resolvedAlerts;
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;

  return (
    <PageWrapper title="Emergency Response & Incident Command">
      <AlertBanner
        type={bannerAlert?.type}
        message={bannerAlert?.message}
        onClose={() => setBannerAlert(null)}
      />

      {/* Critical Global Threat Banner */}
      {criticalCount > 0 && (
        <div className="bg-red-950 border-2 border-red-600 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <Radio className="w-8 h-8 text-red-500 animate-spin flex-shrink-0" />
            <div>
              <p className="text-red-100 font-extrabold text-base tracking-wide">
                CRITICAL LIFE-SAFETY ALERT ACTIVE ({criticalCount})
              </p>
              <p className="text-red-300 text-xs">
                Emergency protocol in effect. Expedition personnel require immediate support and operational triage.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSosModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors whitespace-nowrap shadow-lg shadow-red-900/50"
          >
            Dispatch Incident Update
          </button>
        </div>
      )}

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[#F9FAFB] text-xl font-bold">Polar Incident Log & Distress Protocol</h2>
          <p className="text-[#9CA3AF] text-xs mt-0.5">
            Real-time SOS tracking, medical evacuations, blizzard lock-downs, and infrastructure alerts
          </p>
          {isField && (
            <p className="text-amber-400 text-xs mt-1 flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5" />
              Field Personnel Priority Channel: Incidents are reviewed directly by Central Command.
            </p>
          )}
        </div>
        <button
          onClick={() => setSosModalOpen(true)}
          className={`flex items-center gap-2 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-lg cursor-pointer ${
            isField 
              ? 'bg-red-600 hover:bg-red-500 animate-pulse shadow-red-900/80' 
              : 'bg-red-600 hover:bg-red-700 shadow-red-950'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          {isField ? '🚨 TRANSMIT DISTRESS SOS' : 'RAISE EMERGENCY SOS'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#1E3A5F] mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'active'
              ? 'text-red-400 border-red-500'
              : 'text-[#9CA3AF] border-transparent hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Active Incidents ({activeAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'resolved'
              ? 'text-[#34D399] border-[#34D399]'
              : 'text-[#9CA3AF] border-transparent hover:text-white'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Resolved & Archived ({resolvedAlerts.length})
        </button>
      </div>

      {/* Alerts Grid */}
      {loading ? (
        <div className="text-center py-16 text-[#38BDF8]">Scanning emergency channels...</div>
      ) : currentList.length === 0 ? (
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-12 text-center text-[#9CA3AF]">
          {activeTab === 'active' ? (
            <div className="flex flex-col items-center justify-center gap-2 text-[#34D399]">
              <CheckCircle className="w-12 h-12" />
              <p className="font-semibold text-base mt-2">All Polar Stations Operational</p>
              <p className="text-xs text-[#9CA3AF]">No active distress signals or emergency alarms reported.</p>
            </div>
          ) : (
            'No archived emergency records found.'
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map(alert => {
            const isCrit = alert.severity === 'critical';
            return (
              <div
                key={alert.id}
                className={`bg-[#111827] border rounded-xl p-5 transition-colors ${
                  isCrit && !alert.resolved
                    ? 'border-red-600 bg-red-950/20'
                    : 'border-[#1E3A5F] hover:border-[#38BDF8]/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge value={alert.severity} />
                      <Badge value={alert.alert_type} />
                      <span className="text-xs font-bold text-[#F9FAFB]">
                        Station: {alert.expedition_name || 'Central Command'}
                      </span>
                    </div>
                    {alert.location_description && (
                      <p className="text-xs text-[#9CA3AF] flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#38BDF8] flex-shrink-0" />
                        {alert.location_description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#9CA3AF] flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span>{alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'Recent'}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-[#1F2937]/70 border border-[#1E3A5F]/50 rounded-lg p-3 text-sm text-[#F9FAFB] mb-3 leading-relaxed">
                  {alert.description}
                </div>

                {/* Resolution Notes if resolved */}
                {alert.resolved === 1 && alert.resolution_notes && (
                  <div className="bg-green-950/30 border border-green-900 rounded-lg p-3 text-xs text-green-300 mb-3">
                    <p className="font-bold mb-0.5">Resolution Protocol Log:</p>
                    <p>{alert.resolution_notes}</p>
                    {alert.resolved_at && (
                      <p className="text-[11px] text-green-400 mt-1 opacity-80">
                        Resolved at: {new Date(alert.resolved_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Footer details & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#1E3A5F]">
                  <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                    <User className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Originator: {alert.raised_by || 'Officer'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCommander ? (
                      <>
                        {!alert.resolved && (
                          <button
                            onClick={() => handleOpenResolve(alert)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#34D399] hover:bg-[#34D399]/80 text-[#0B1120] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Mark Resolved
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(alert.id)}
                          className="p-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-[#9CA3AF] px-2 py-1 bg-[#1F2937] rounded border border-[#1E3A5F]">
                        {alert.resolved ? '✓ Concluded' : '● Live Command Triage'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SOS Modal */}
      <Modal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        title="Broadcast Station Distress SOS Signal"
      >
        <SOSForm
          expeditions={expeditions}
          onSubmit={handleCreateSOS}
          onCancel={() => setSosModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Resolve Incident Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Resolve & Close Emergency Incident"
      >
        <form onSubmit={handleConfirmResolve} className="space-y-4">
          <p className="text-sm text-[#9CA3AF]">
            Documenting the conclusion and corrective actions taken for incident at{' '}
            <strong className="text-[#F9FAFB]">{resolvingAlert?.expedition_name}</strong>:
          </p>
          <div className="bg-[#111827] p-3 rounded-lg text-xs text-[#F9FAFB] border border-[#1E3A5F]">
            {resolvingAlert?.description}
          </div>
          <div>
            <label className="block text-[#9CA3AF] text-xs font-semibold uppercase mb-1">
              Resolution Log & Corrective Measures *
            </label>
            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              placeholder="e.g., Blizzard subsided. Structural repairs completed. Medical condition stabilized with on-site telemedicine..."
              required
              className="w-full bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E3A5F]">
            <button
              type="button"
              onClick={() => setResolveModalOpen(false)}
              className="px-4 py-2 text-sm text-[#9CA3AF] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-5 py-2 bg-[#34D399] text-[#0B1120] font-bold text-sm rounded-lg hover:bg-[#34D399]/80 transition-colors disabled:opacity-50"
            >
              {formLoading ? 'Recording...' : 'Confirm Resolution'}
            </button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
