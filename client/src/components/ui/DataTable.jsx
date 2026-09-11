export default function DataTable({ columns, data, emptyMessage = 'No data found.', rowClassName }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#1F2937] text-[#9CA3AF] uppercase text-xs">
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 text-left font-medium tracking-wider whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1E3A5F]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-[#9CA3AF]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id ?? i}
                className={`hover:bg-[#1F2937]/50 transition-colors ${rowClassName ? rowClassName(row) : ''}`}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-[#F9FAFB]">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
