/**
 * CargoTrackingTimeline
 * ----------------------
 * Visual movement timeline: PORT → SHIP → AIRCRAFT → SNOWCAT → FIELD CAMP
 * Shows completed / current / pending states with icons.
 *
 * Props:
 *   stage    — current transport_stage value (e.g. 'SHIP', 'AIRCRAFT', etc.)
 *   status   — cargo status ('pending', 'in_transit', 'delivered', 'lost')
 */

import { Anchor, Plane, Truck, Tent, MapPin } from 'lucide-react';

const STAGES = [
  { key: 'PORT',       label: 'Port',        icon: Anchor, desc: 'Goa Port' },
  { key: 'SHIP',       label: 'Sea Transit', icon: Anchor, desc: 'Indian Ocean' },
  { key: 'AIRCRAFT',   label: 'Air Lift',    icon: Plane,  desc: 'Cargo Aircraft' },
  { key: 'SNOWCAT',    label: 'Snowcat',     icon: Truck,  desc: 'Ice Traverse' },
  { key: 'FIELD_CAMP', label: 'Field Camp',  icon: Tent,   desc: 'Destination' },
];

export default function CargoTrackingTimeline({ stage, status }) {
  const currentIndex = STAGES.findIndex(s => s.key === stage);
  const isLost = status === 'lost';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#1E3A5F] z-0" />

        {STAGES.map((s, idx) => {
          const isDone    = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;
          const Icon = s.icon;

          let circleClass = '';
          let labelClass  = 'text-[#4B5563]';

          if (isLost) {
            circleClass = 'bg-red-900/40 border-red-500 text-red-400';
            labelClass  = 'text-red-400';
          } else if (isDone) {
            circleClass = 'bg-[#34D399]/20 border-[#34D399] text-[#34D399]';
            labelClass  = 'text-[#34D399]';
          } else if (isCurrent) {
            circleClass = 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8] ring-2 ring-[#38BDF8]/30 animate-pulse';
            labelClass  = 'text-[#38BDF8] font-semibold';
          } else {
            circleClass = 'bg-[#1F2937] border-[#1E3A5F] text-[#4B5563]';
          }

          return (
            <div key={s.key} className="flex flex-col items-center z-10 flex-1">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${circleClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className={`text-[10px] mt-1.5 text-center leading-tight ${labelClass}`}>
                {s.label}
              </p>
              <p className="text-[9px] text-[#4B5563] text-center leading-tight mt-0.5">
                {s.desc}
              </p>
              {isCurrent && !isLost && (
                <span className="mt-1 px-1.5 py-0.5 bg-[#38BDF8] text-[#0B1120] text-[8px] font-bold rounded uppercase tracking-wide">
                  HERE
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
