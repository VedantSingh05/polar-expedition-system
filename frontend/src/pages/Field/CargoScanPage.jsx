import { useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Badge from '../../components/ui/Badge.jsx';
import CargoTrackingTimeline from '../../components/ui/CargoTrackingTimeline.jsx';
import { QrCode, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import { getCargoByCode, confirmCargoReceived } from '../../api/cargo.api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function CargoScanPage() {
  const { user } = useAuth();
  const [cargoCode, setCargoCode] = useState('POLAR-CR-1042');
  const [foundCargo, setFoundCargo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'info' | 'success' | 'error'

  const handleLookup = async (codeOverride) => {
    const query = (codeOverride || cargoCode).trim();
    if (!query) return;
    setLoading(true);
    setMessage('');
    setFoundCargo(null);
    try {
      const res = await getCargoByCode(query);
      setFoundCargo(res.data);
      setMessage('');
    } catch (err) {
      setFoundCargo(null);
      setMessage(
        err.response?.data?.error ||
        `No cargo found with code "${query}". Try POLAR-CR-1042, POLAR-CR-2088, or POLAR-CR-3051.`
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceived = async () => {
    if (!foundCargo) return;
    if (!window.confirm(`Confirm receipt of "${foundCargo.item_name}"? This will mark it as delivered.`)) return;
    setLoading(true);
    try {
      await confirmCargoReceived(foundCargo.id, {
        confirmed_by: user?.name || 'Field Personnel',
        location_note: 'Field Camp'
      });
      setFoundCargo(prev => ({
        ...prev,
        status: 'delivered',
        transport_stage: 'FIELD_CAMP',
        current_location: 'Field Camp'
      }));
      setMessage('✅ RECEIPT CONFIRMED — Consignment logged as delivered at Field Station.');
      setMessageType('success');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to confirm receipt.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const quickCodes = [
    { code: 'POLAR-CR-1042', label: 'Generator Spares' },
    { code: 'POLAR-CR-2088', label: 'Ice Core Drill' },
    { code: 'POLAR-CR-3051', label: 'Medical Supplies' },
  ];

  return (
    <PageWrapper title="Polar Cargo QR / Barcode Scanner">
      <div className="space-y-6 max-w-3xl mx-auto">

        {/* Scanner Card */}
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="w-5 h-5 text-[#38BDF8]" />
            <h2 className="text-base font-bold text-[#F9FAFB] uppercase tracking-wide">
              Field Station Cargo Intake Scanner
            </h2>
          </div>
          <p className="text-xs text-[#9CA3AF]">
            Scan delivery crates upon arrival via snowcat, helicopter, or twin-otter aircraft to update central logistics.
          </p>

          {/* Scanner Viewport Simulation */}
          <div className="bg-[#0B1120] border-2 border-dashed border-[#38BDF8] rounded-xl p-8 my-5 text-center relative overflow-hidden">
            <div className="w-16 h-16 border-4 border-[#38BDF8] border-t-transparent rounded-2xl mx-auto flex items-center justify-center animate-spin">
              <QrCode className="w-8 h-8 text-[#38BDF8]" />
            </div>
            <p className="text-xs text-[#38BDF8] font-bold mt-3 uppercase tracking-wider">
              Polar Optical Sensor Online
            </p>
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              Enter cargo code in POLAR-CR-XXXX format
            </p>
          </div>

          {/* Input & Search */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={cargoCode}
              onChange={(e) => setCargoCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              placeholder="e.g., POLAR-CR-1042"
              className="flex-1 bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#38BDF8]"
            />
            <button
              onClick={() => handleLookup()}
              disabled={loading}
              className="bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#0B1120] font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Scanning...' : 'Scan / Lookup'}
            </button>
          </div>

          {/* Quick Demo Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#9CA3AF]">
            <span>Quick Samples:</span>
            {quickCodes.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => { setCargoCode(code); handleLookup(code); }}
                className="px-2.5 py-1 rounded bg-[#1F2937] text-[#38BDF8] border border-[#1E3A5F] font-mono hover:bg-[#1E3A5F] transition-colors"
              >
                {code.replace('POLAR-', '')} — {label}
              </button>
            ))}
          </div>

          {/* Message Banner */}
          {message && (
            <div className={`p-3.5 rounded-xl text-xs text-center font-semibold mt-4 border ${
              messageType === 'success'
                ? 'bg-green-900/20 border-green-700/40 text-green-400'
                : 'bg-red-900/20 border-red-700/40 text-red-400'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Found Cargo Dossier */}
        {foundCargo && (
          <div className="bg-[#111827] border border-[#38BDF8]/60 rounded-2xl p-5 space-y-5">

            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#1E3A5F] pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#38BDF8]">
                  {foundCargo.cargo_code || foundCargo.tracking_code}
                </span>
                <h3 className="text-lg font-bold text-[#F9FAFB] mt-0.5">{foundCargo.item_name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge value={foundCargo.status} />
                  <Badge value={foundCargo.category} />
                </div>
              </div>
              {foundCargo.status === 'delivered' && (
                <div className="flex items-center gap-1.5 text-[#34D399] text-xs font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  Delivered
                </div>
              )}
            </div>

            {/* Movement Timeline */}
            <div>
              <p className="text-[#9CA3AF] text-xs uppercase tracking-widest mb-4">Transport Stage</p>
              <CargoTrackingTimeline
                stage={foundCargo.transport_stage || 'PORT'}
                status={foundCargo.status}
              />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { label: 'Weight',          value: foundCargo.weight_kg ? `${foundCargo.weight_kg} kg` : 'N/A' },
                { label: 'Quantity',        value: `${foundCargo.quantity} units` },
                { label: 'Condition',       value: foundCargo.condition || 'good' },
                { label: 'Current Location', value: foundCargo.current_location || 'N/A' },
                { label: 'Origin',          value: foundCargo.origin || 'Goa, India' },
                { label: 'Destination',     value: foundCargo.destination || 'N/A' },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-[#1F2937] rounded-lg">
                  <p className="text-[#9CA3AF]">{label}</p>
                  <p className="font-bold text-[#F9FAFB] mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* Confirm Received Button */}
            {foundCargo.status !== 'delivered' ? (
              <button
                onClick={handleConfirmReceived}
                disabled={loading}
                className="w-full bg-[#34D399] hover:bg-[#6EE7B7] text-[#0B1120] font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                CONFIRM SAFE ARRIVAL & ACCEPT DELIVERY
              </button>
            ) : (
              <div className="w-full py-3.5 rounded-xl bg-green-900/20 border border-green-700/40 flex items-center justify-center gap-2 text-green-400 font-semibold text-sm">
                <CheckCircle className="w-5 h-5" />
                Consignment Already Received & Logged
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
