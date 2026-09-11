/**
 * CargoDetailPanel
 * ----------------
 * Slide-in side panel that shows full cargo details including:
 * - Cargo code, category, weight, quantity
 * - Movement timeline (PORT→SHIP→AIRCRAFT→SNOWCAT→FIELD CAMP)
 * - Current location, condition, status
 * - Notes and expedition assignment
 *
 * Props:
 *   cargo    — cargo object (or null)
 *   onClose  — close handler
 *   canEdit  — boolean, show edit/delete buttons
 *   onEdit   — handler for edit
 *   onDelete — handler for delete
 *   onReceive — handler for field personnel confirm received (optional)
 *   role     — current user role
 */

import { X, Package, MapPin, Scale, Calendar, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import Badge from './Badge.jsx';
import CargoTrackingTimeline from './CargoTrackingTimeline.jsx';

const conditionColors = {
  good:     'text-[#34D399]',
  damaged:  'text-[#FBBF24]',
  critical: 'text-red-400',
};

export default function CargoDetailPanel({ cargo, onClose, canEdit, onEdit, onDelete, onReceive, role }) {
  if (!cargo) return null;

  const isFieldPersonnel = role === 'field_personnel';
  const canConfirmReceive = isFieldPersonnel && cargo.status !== 'delivered';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#0D1B2A] border-l border-[#1E3A5F] flex flex-col h-full shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#1E3A5F]">
          <div>
            <p className="text-[#38BDF8] text-xs font-mono uppercase tracking-widest mb-1">
              {cargo.cargo_code || cargo.tracking_code || `CR-${cargo.id}`}
            </p>
            <h2 className="text-[#F9FAFB] text-lg font-bold leading-tight">{cargo.item_name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge value={cargo.status} />
              <Badge value={cargo.category} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-[#1F2937] hover:bg-[#1E3A5F] text-[#9CA3AF] hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Movement Timeline */}
        <div className="p-5 border-b border-[#1E3A5F]">
          <h3 className="text-[#9CA3AF] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Transport Stage
          </h3>
          <CargoTrackingTimeline
            stage={cargo.transport_stage || 'PORT'}
            status={cargo.status}
          />
        </div>

        {/* Details Grid */}
        <div className="p-5 border-b border-[#1E3A5F]">
          <h3 className="text-[#9CA3AF] text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <Info className="w-3.5 h-3.5" /> Consignment Details
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Detail label="Expedition" value={cargo.expedition_name || 'Unassigned'} />
            <Detail label="Quantity" value={`${cargo.quantity} units`} />
            <Detail label="Weight" value={cargo.weight_kg ? `${cargo.weight_kg.toLocaleString()} kg` : 'N/A'} />
            <Detail
              label="Condition"
              value={cargo.condition || 'good'}
              valueClass={conditionColors[cargo.condition] || 'text-[#F9FAFB]'}
            />
            <Detail label="Current Location" value={cargo.current_location || 'Unknown'} fullWidth />
            <Detail label="Origin" value={cargo.origin || 'Goa, India'} />
            <Detail label="Destination" value={cargo.destination || 'N/A'} />
            <Detail label="Dispatch Date" value={cargo.dispatch_date || 'N/A'} />
            <Detail label="Expected Arrival" value={cargo.arrival_date || 'N/A'} />
            <Detail
              label="Last Updated"
              value={cargo.last_updated ? new Date(cargo.last_updated).toLocaleString() : 'N/A'}
              fullWidth
            />
          </div>
        </div>

        {/* Notes */}
        {cargo.notes && (
          <div className="p-5 border-b border-[#1E3A5F]">
            <h3 className="text-[#9CA3AF] text-xs uppercase tracking-widest mb-2">Notes</h3>
            <p className="text-[#9CA3AF] text-xs leading-relaxed bg-[#111827] rounded-lg p-3">
              {cargo.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="p-5 mt-auto space-y-2">
          {/* Field Personnel: Confirm Received */}
          {canConfirmReceive && (
            <button
              onClick={() => onReceive && onReceive(cargo)}
              className="w-full flex items-center justify-center gap-2 bg-[#34D399] text-[#0B1120] font-bold text-sm py-3 rounded-xl hover:bg-[#6EE7B7] transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" />
              CONFIRM RECEIVED
            </button>
          )}

          {/* Logistics / Commander: Edit & Delete */}
          {canEdit && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit && onEdit(cargo)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1F2937] hover:bg-[#1E3A5F] text-[#38BDF8] text-sm font-medium py-2.5 rounded-xl border border-[#1E3A5F] transition-colors"
              >
                Edit Record
              </button>
              <button
                onClick={() => onDelete && onDelete(cargo.id, cargo.item_name)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 text-sm font-medium py-2.5 rounded-xl border border-red-900/40 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 text-[#9CA3AF] hover:text-white text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, fullWidth, valueClass }) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <p className="text-[#4B5563] text-[10px] uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-medium mt-0.5 ${valueClass || 'text-[#F9FAFB]'}`}>{value}</p>
    </div>
  );
}
