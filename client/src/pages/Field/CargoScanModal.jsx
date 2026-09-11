import { useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { QrCode, Search, CheckCircle, Package, ArrowRight } from 'lucide-react';
import { getCargo, updateCargo } from '../../api/cargo.api.js';

export default function CargoScanModal({ isOpen, onClose, onScanned }) {
  const [cargoCode, setCargoCode] = useState('');
  const [foundCargo, setFoundCargo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLookup = async (codeToSearch) => {
    const query = codeToSearch || cargoCode;
    if (!query) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await getCargo();
      const list = Array.isArray(res.data) ? res.data : [];
      const item = list.find(c => 
        (c.tracking_code && c.tracking_code.toLowerCase() === query.toLowerCase().trim()) ||
        (`CR-${1000 + c.id}`.toLowerCase() === query.toLowerCase().trim()) ||
        (c.item_name && c.item_name.toLowerCase().includes(query.toLowerCase().trim()))
      );
      if (item) {
        setFoundCargo(item);
      } else {
        setFoundCargo(null);
        setMessage(`No consignment found with tracking ID "${query}". Try CR-1042 or CR-2088.`);
      }
    } catch (err) {
      setMessage('Error reading cargo database.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceived = async () => {
    if (!foundCargo) return;
    setLoading(true);
    try {
      await updateCargo(foundCargo.id, {
        ...foundCargo,
        status: 'delivered',
        transport_leg: 'camp'
      });
      setMessage('✅ Consignment successfully marked as RECEIVED AT FIELD CAMP!');
      if (onScanned) onScanned();
      setTimeout(() => {
        onClose();
        setFoundCargo(null);
        setCargoCode('');
        setMessage('');
      }, 1800);
    } catch (err) {
      setMessage('Failed to update cargo status.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (code) => {
    setCargoCode(code);
    handleLookup(code);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Polar Cargo QR / Barcode Scanner">
      <div className="space-y-4">
        {/* Scanner Simulation Viewport */}
        <div className="bg-[#0B1120] border-2 border-dashed border-[#38BDF8] rounded-xl p-6 text-center relative overflow-hidden">
          <div className="w-16 h-16 border-4 border-[#38BDF8] border-t-transparent rounded-2xl mx-auto flex items-center justify-center animate-spin">
            <QrCode className="w-8 h-8 text-[#38BDF8]" />
          </div>
          <p className="text-xs text-[#38BDF8] font-bold mt-3 uppercase tracking-wider">
            Polar Optical Scanning Sensor Ready
          </p>
          <p className="text-[11px] text-[#9CA3AF] mt-1">
            Align camera with crate QR code or enter Consignment ID manually
          </p>
        </div>

        {/* Input bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={cargoCode}
            onChange={(e) => setCargoCode(e.target.value)}
            placeholder="e.g. CR-1042, CR-1043, CR-2088"
            className="flex-1 bg-[#111827] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#38BDF8]"
          />
          <button
            onClick={() => handleLookup()}
            disabled={loading}
            className="bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#0B1120] font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
          >
            <Search className="w-4 h-4" />
            Lookup
          </button>
        </div>

        {/* Quick sample chips */}
        <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
          <span>Quick Demo:</span>
          <button 
            type="button"
            onClick={() => handleQuickSelect('CR-1042')}
            className="bg-[#111827] hover:bg-[#1F2937] text-[#38BDF8] border border-[#1E3A5F] px-2 py-0.5 rounded text-[11px] font-mono"
          >
            CR-1042 (Generators)
          </button>
          <button 
            type="button"
            onClick={() => handleQuickSelect('CR-2088')}
            className="bg-[#111827] hover:bg-[#1F2937] text-[#38BDF8] border border-[#1E3A5F] px-2 py-0.5 rounded text-[11px] font-mono"
          >
            CR-2088 (Drill Rig)
          </button>
        </div>

        {/* Feedback message */}
        {message && (
          <div className="p-3 bg-[#111827] border border-[#1E3A5F] rounded-lg text-xs text-center text-yellow-300">
            {message}
          </div>
        )}

        {/* Found Consignment Card */}
        {foundCargo && (
          <div className="bg-[#111827] border border-[#38BDF8]/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-2">
              <div>
                <span className="font-mono text-xs font-bold text-[#38BDF8]">{foundCargo.tracking_code || `CR-${1000 + foundCargo.id}`}</span>
                <h4 className="text-sm font-bold text-[#F9FAFB]">{foundCargo.item_name}</h4>
              </div>
              <Badge value={foundCargo.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-[#9CA3AF]">
              <div>Category: <span className="text-[#F9FAFB] capitalize">{foundCargo.category}</span></div>
              <div>Weight: <span className="text-[#F9FAFB]">{foundCargo.weight_kg ? `${foundCargo.weight_kg} kg` : '—'}</span></div>
              <div>Quantity: <span className="text-[#F9FAFB]">{foundCargo.quantity} units</span></div>
              <div>Destination: <span className="text-[#38BDF8]">{foundCargo.destination}</span></div>
            </div>

            <button
              type="button"
              onClick={handleConfirmReceived}
              disabled={loading || foundCargo.status === 'delivered'}
              className="w-full bg-[#34D399] hover:bg-[#34D399]/80 text-[#0B1120] font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {foundCargo.status === 'delivered' ? 'Already Verified & Stocked at Station' : 'Confirm Safe Delivery & Receive at Camp'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
