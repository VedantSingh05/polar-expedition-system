export default function StatCard({ title, value, subtitle, icon: Icon, color = 'accent' }) {
  const colorMap = {
    accent:  { text: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10' },
    success: { text: 'text-[#34D399]', bg: 'bg-[#34D399]/10' },
    warning: { text: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10' },
    danger:  { text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
  };
  const c = colorMap[color] || colorMap.accent;
  return (
    <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-5 flex items-center justify-between">
      <div>
        <p className="text-[#9CA3AF] text-sm font-medium">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${c.text}`}>{value ?? '—'}</p>
        {subtitle && <p className="text-[#9CA3AF] text-xs mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl ${c.bg}`}>
          <Icon className={`w-6 h-6 ${c.text}`} />
        </div>
      )}
    </div>
  );
}
