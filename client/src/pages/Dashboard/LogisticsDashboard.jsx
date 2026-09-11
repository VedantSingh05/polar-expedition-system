import { useState } from 'react';
import StatCard from '../../components/ui/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { 
  Package, 
  Truck, 
  Ship, 
  Plane, 
  Archive, 
  AlertTriangle, 
  Fuel, 
  Utensils, 
  HeartPulse, 
  Wind, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LogisticsDashboard({ stats, onRefresh }) {
  const [filterCat, setFilterCat] = useState('all');

  const resourceGauges = stats?.resourceGauges || {
    fuel: { title: 'Fuel Reserves (Diesel & ATK)', pct: 68, current: 16700, max: 25000, unit: 'L' },
    food: { title: 'Food & Rations (6-mo Buffer)', pct: 82, current: 465, max: 560, unit: 'packs' },
    oxygen: { title: 'Medical Oxygen Cylinders', pct: 25, current: 4, max: 20, unit: 'cylinders', status: 'critical' },
    medical: { title: 'Trauma & Pharmaceutical Stores', pct: 74, current: 14, max: 20, unit: 'kits' }
  };

  const cargoMovements = stats?.cargoMovements || [];

  return (
    <div className="space-y-6">
      {/* Top Banner — Logistics Authority */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <span className="text-xs font-bold text-[#38BDF8] tracking-widest uppercase">
              Supply Chain & Material Resource Command
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#F9FAFB] tracking-tight mt-0.5">
            LOGISTICS CONTROL CENTER
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Multimodal Polar Freight Pipeline, Depot Inventory Buffers & Life-Sustaining Provisioning
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/cargo"
            className="bg-[#38BDF8] hover:bg-[#7DD3FC] text-[#0B1120] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Dispatch Consignment
          </Link>
          <Link
            to="/inventory"
            className="bg-[#1F2937] hover:bg-[#1F2937]/80 text-[#F9FAFB] border border-[#1E3A5F] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
          >
            Manage Stores
          </Link>
        </div>
      </div>

      {/* Primary Logistics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Cargo In Transit"
          value={stats?.cargoInTransit || 0}
          subtitle="At sea / flight / overland"
          icon={Truck}
          color="warning"
        />
        <StatCard
          title="Pending Dispatch"
          value={stats?.cargoPending || 0}
          subtitle="At Goa / Cape Town port"
          icon={Clock}
          color="accent"
        />
        <StatCard
          title="Delivered to Station"
          value={stats?.cargoDelivered || 0}
          subtitle="Stocked at polar bases"
          icon={CheckCircle2}
          color="success"
        />
        <StatCard
          title="Low Stock Warning"
          value={stats?.lowStockItems || 0}
          subtitle={stats?.lowStockItems > 0 ? 'Urgent reorder required' : 'All buffers nominal'}
          icon={AlertTriangle}
          color={stats?.lowStockItems > 0 ? 'danger' : 'success'}
        />
        <StatCard
          title="Critical Items"
          value={stats?.criticalInventoryItems || 1}
          subtitle="Below 50% threshold"
          icon={Archive}
          color="warning"
        />
        <StatCard
          title="Total Catalog Items"
          value={stats?.totalInventoryItems || 10}
          subtitle="Active SKU inventory"
          icon={Package}
          color="accent"
        />
      </div>

      {/* RESOURCE AVAILABILITY PROGRESS GAUGES */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E3A5F]">
          <div>
            <h2 className="text-base font-bold text-[#F9FAFB] uppercase tracking-wide">
              Critical Polar Resource Depletion & Buffers
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Live consumption tracking against severe Antarctic winter survival minimums
            </p>
          </div>
          <span className="text-xs font-mono text-[#38BDF8] bg-[#1F2937] px-3 py-1 rounded-lg border border-[#1E3A5F]">
            AUTO-REQUISITION ENABLED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fuel */}
          <div className="bg-[#1F2937] border border-[#1E3A5F] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-[#F9FAFB]">Fuel Reserves</span>
              </div>
              <span className="text-xs font-bold text-orange-400 font-mono">{resourceGauges.fuel.pct}%</span>
            </div>
            <div className="w-full bg-[#111827] rounded-full h-2.5 mb-2 overflow-hidden">
              <div 
                className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${resourceGauges.fuel.pct}%` }} 
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#9CA3AF]">
              <span>Avail: {resourceGauges.fuel.current.toLocaleString()} {resourceGauges.fuel.unit}</span>
              <span>Buffer: 68 Days</span>
            </div>
          </div>

          {/* Food */}
          <div className="bg-[#1F2937] border border-[#1E3A5F] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-green-400" />
                <span className="text-xs font-bold text-[#F9FAFB]">Food & Rations</span>
              </div>
              <span className="text-xs font-bold text-green-400 font-mono">{resourceGauges.food.pct}%</span>
            </div>
            <div className="w-full bg-[#111827] rounded-full h-2.5 mb-2 overflow-hidden">
              <div 
                className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${resourceGauges.food.pct}%` }} 
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#9CA3AF]">
              <span>Avail: {resourceGauges.food.current} {resourceGauges.food.unit}</span>
              <span>Buffer: 180 Days</span>
            </div>
          </div>

          {/* Oxygen */}
          <div className="bg-[#1F2937] border border-red-800/60 rounded-xl p-4 bg-red-950/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-xs font-bold text-red-200">Medical Oxygen</span>
              </div>
              <span className="text-xs font-bold text-red-400 font-mono">{resourceGauges.oxygen.pct}% (LOW)</span>
            </div>
            <div className="w-full bg-[#111827] rounded-full h-2.5 mb-2 overflow-hidden">
              <div 
                className="bg-red-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${resourceGauges.oxygen.pct}%` }} 
              />
            </div>
            <div className="flex justify-between text-[11px] text-red-300">
              <span>Avail: {resourceGauges.oxygen.current} {resourceGauges.oxygen.unit}</span>
              <span>Threshold: 6 cylinders</span>
            </div>
          </div>

          {/* Medical */}
          <div className="bg-[#1F2937] border border-[#1E3A5F] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-bold text-[#F9FAFB]">Medical & Trauma</span>
              </div>
              <span className="text-xs font-bold text-pink-400 font-mono">{resourceGauges.medical.pct}%</span>
            </div>
            <div className="w-full bg-[#111827] rounded-full h-2.5 mb-2 overflow-hidden">
              <div 
                className="bg-pink-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${resourceGauges.medical.pct}%` }} 
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#9CA3AF]">
              <span>Avail: {resourceGauges.medical.current} {resourceGauges.medical.unit}</span>
              <span>Sterile Status: 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* MULTIMODAL CARGO MOVEMENT LOGISTICS CHAIN */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E3A5F]">
          <div>
            <h2 className="text-base font-bold text-[#F9FAFB] uppercase tracking-wide">
              Multimodal Polar Freight Pipeline (Ship → Air → Snowcat → Camp)
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Live status tracking across sequential multimodal transportation legs
            </p>
          </div>
          <Link to="/cargo" className="text-xs text-[#38BDF8] hover:underline font-semibold">
            Full Manifest →
          </Link>
        </div>

        <div className="space-y-3">
          {cargoMovements.map((cargo) => {
            const leg = cargo.transport_leg || 'ship';
            const isDelivered = cargo.status === 'delivered';

            return (
              <div key={cargo.id} className="bg-[#1F2937] border border-[#1E3A5F] rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded">
                        {cargo.tracking_code}
                      </span>
                      <h3 className="text-sm font-bold text-[#F9FAFB]">{cargo.item_name}</h3>
                      <Badge value={cargo.category} />
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      {cargo.origin} → <strong className="text-[#F9FAFB]">{cargo.destination}</strong> ({cargo.weight_kg ? `${cargo.weight_kg.toLocaleString()} kg` : 'Standard Weight'})
                    </p>
                  </div>

                  <Badge value={cargo.status} />
                </div>

                {/* Visual Step Chain */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#1E3A5F]/50">
                  {/* Leg 1: Ship */}
                  <div className={`p-2 rounded-lg border text-center ${
                    isDelivered || leg === 'aircraft' || leg === 'snowcat' || leg === 'camp'
                      ? 'bg-green-950/30 border-green-700 text-green-300'
                      : leg === 'ship'
                      ? 'bg-yellow-950/40 border-yellow-600 text-yellow-300 animate-pulse'
                      : 'bg-[#111827] border-[#1E3A5F] text-[#9CA3AF]'
                  }`}>
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold">
                      <Ship className="w-3.5 h-3.5" />
                      <span>1. Research Vessel</span>
                    </div>
                    <p className="text-[10px] mt-0.5 font-mono">
                      {isDelivered || leg !== 'ship' ? '✓ Completed' : '🟡 Active Sea Leg'}
                    </p>
                  </div>

                  {/* Leg 2: Aircraft */}
                  <div className={`p-2 rounded-lg border text-center ${
                    isDelivered || leg === 'snowcat' || leg === 'camp'
                      ? 'bg-green-950/30 border-green-700 text-green-300'
                      : leg === 'aircraft'
                      ? 'bg-yellow-950/40 border-yellow-600 text-yellow-300 animate-pulse'
                      : 'bg-[#111827] border-[#1E3A5F] text-[#9CA3AF]'
                  }`}>
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold">
                      <Plane className="w-3.5 h-3.5" />
                      <span>2. Polar Airfield</span>
                    </div>
                    <p className="text-[10px] mt-0.5 font-mono">
                      {isDelivered || leg === 'snowcat' || leg === 'camp' ? '✓ Completed' : leg === 'aircraft' ? '🟡 Air Lift Active' : '○ Queued'}
                    </p>
                  </div>

                  {/* Leg 3: Snowcat */}
                  <div className={`p-2 rounded-lg border text-center ${
                    isDelivered || leg === 'camp'
                      ? 'bg-green-950/30 border-green-700 text-green-300'
                      : leg === 'snowcat'
                      ? 'bg-yellow-950/40 border-yellow-600 text-yellow-300 animate-pulse'
                      : 'bg-[#111827] border-[#1E3A5F] text-[#9CA3AF]'
                  }`}>
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold">
                      <Truck className="w-3.5 h-3.5" />
                      <span>3. Snowcat Traverse</span>
                    </div>
                    <p className="text-[10px] mt-0.5 font-mono">
                      {isDelivered || leg === 'camp' ? '✓ Completed' : leg === 'snowcat' ? '🟡 Overland Transit' : '○ Queued'}
                    </p>
                  </div>

                  {/* Leg 4: Base / Camp */}
                  <div className={`p-2 rounded-lg border text-center ${
                    isDelivered || leg === 'camp'
                      ? 'bg-green-950/30 border-green-700 text-green-300'
                      : 'bg-[#111827] border-[#1E3A5F] text-[#9CA3AF]'
                  }`}>
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>4. Base Station</span>
                    </div>
                    <p className="text-[10px] mt-0.5 font-mono">
                      {isDelivered || leg === 'camp' ? '✓ Received at Base' : '○ Pending Final Leg'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Logistics Alerts & Inventory Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LOGISTICS ALERTS (1 Column) */}
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1E3A5F]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wide">
                Logistics Warnings & Alerts
              </h3>
            </div>
            <span className="text-xs font-mono text-orange-400 font-bold">
              {stats?.logisticsAlerts?.length || 0} Warnings
            </span>
          </div>

          <div className="space-y-3">
            {(stats?.logisticsAlerts || []).map((alert) => (
              <div 
                key={alert.id}
                className="p-3.5 bg-[#1F2937] border border-[#1E3A5F] rounded-xl text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-300">{alert.title}</span>
                  <span className="text-[10px] text-[#9CA3AF] uppercase font-bold">{alert.severity}</span>
                </div>
                <p className="text-[#F9FAFB] leading-relaxed">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* INVENTORY STORES OVERVIEW (2 Columns) */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1E3A5F]">
            <div className="flex items-center gap-2">
              <Archive className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wide">
                Station Inventory & Depot Reserves
              </h3>
            </div>
            <Link to="/inventory" className="text-xs text-[#38BDF8] hover:underline font-semibold">
              Manage Catalog →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#1F2937] text-[#9CA3AF] uppercase text-[10px] tracking-wider">
                  <th className="px-3 py-2.5 text-left">Item Name</th>
                  <th className="px-3 py-2.5 text-left">Category</th>
                  <th className="px-3 py-2.5 text-center">Available</th>
                  <th className="px-3 py-2.5 text-center">Buffer Threshold</th>
                  <th className="px-3 py-2.5 text-left">Storage Bay</th>
                  <th className="px-3 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A5F]">
                {(stats?.inventoryOverview || []).map((item) => {
                  const isLow = item.quantity <= item.min_threshold;
                  return (
                    <tr key={item.id} className="hover:bg-[#1F2937]/50 transition-colors">
                      <td className="px-3 py-2.5 font-bold text-[#F9FAFB]">{item.name}</td>
                      <td className="px-3 py-2.5"><Badge value={item.category} /></td>
                      <td className="px-3 py-2.5 text-center font-bold text-[#38BDF8]">{item.quantity} {item.unit}</td>
                      <td className="px-3 py-2.5 text-center text-[#9CA3AF]">{item.min_threshold} {item.unit}</td>
                      <td className="px-3 py-2.5 text-[#9CA3AF]">{item.location}</td>
                      <td className="px-3 py-2.5 text-right">
                        {isLow ? (
                          <span className="text-red-400 font-bold bg-red-950/40 border border-red-800 px-2 py-0.5 rounded text-[10px] uppercase">
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-green-400 font-bold bg-green-950/40 border border-green-800 px-2 py-0.5 rounded text-[10px] uppercase">
                            Nominal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Logistics Rapid Actions */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-5">
        <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
          Logistics Officer Quick Tools
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/cargo"
            className="p-3.5 bg-[#1F2937] hover:bg-[#1F2937]/80 rounded-xl text-center border border-[#1E3A5F] transition-colors"
          >
            <Truck className="w-5 h-5 text-[#38BDF8] mx-auto mb-1" />
            <p className="text-sm font-bold text-[#F9FAFB]">Manage Cargo</p>
            <p className="text-[11px] text-[#9CA3AF]">Tracking & manifests</p>
          </Link>
          <Link
            to="/inventory"
            className="p-3.5 bg-[#1F2937] hover:bg-[#1F2937]/80 rounded-xl text-center border border-[#1E3A5F] transition-colors"
          >
            <Archive className="w-5 h-5 text-[#34D399] mx-auto mb-1" />
            <p className="text-sm font-bold text-[#F9FAFB]">Base Stores</p>
            <p className="text-[11px] text-[#9CA3AF]">Stock refills & buffers</p>
          </Link>
          <Link
            to="/expeditions"
            className="p-3.5 bg-[#1F2937] hover:bg-[#1F2937]/80 rounded-xl text-center border border-[#1E3A5F] transition-colors"
          >
            <Ship className="w-5 h-5 text-[#FBBF24] mx-auto mb-1" />
            <p className="text-sm font-bold text-[#F9FAFB]">Expedition Demands</p>
            <p className="text-[11px] text-[#9CA3AF]">Mission supply planning</p>
          </Link>
          <Link
            to="/reports"
            className="p-3.5 bg-[#1F2937] hover:bg-[#1F2937]/80 rounded-xl text-center border border-[#1E3A5F] transition-colors"
          >
            <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <p className="text-sm font-bold text-[#F9FAFB]">Logistics Audit</p>
            <p className="text-[11px] text-[#9CA3AF]">Depot & freight logs</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
