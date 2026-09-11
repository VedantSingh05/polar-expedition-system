export default function Badge({ value }) {
  const map = {
    // expedition status
    active: 'bg-green-900 text-green-300',
    planning: 'bg-blue-900 text-blue-300',
    completed: 'bg-gray-700 text-gray-300',
    aborted: 'bg-red-900 text-red-300',
    // cargo status
    pending: 'bg-yellow-900 text-yellow-300',
    in_transit: 'bg-blue-900 text-blue-300',
    delivered: 'bg-green-900 text-green-300',
    lost: 'bg-red-900 text-red-300',
    // asset status
    available: 'bg-green-900 text-green-300',
    in_use: 'bg-blue-900 text-blue-300',
    under_maintenance: 'bg-yellow-900 text-yellow-300',
    decommissioned: 'bg-gray-700 text-gray-300',
    // health
    fit: 'bg-green-900 text-green-300',
    under_observation: 'bg-yellow-900 text-yellow-300',
    medical_leave: 'bg-red-900 text-red-300',
    // severity
    critical: 'bg-red-900 text-red-300',
    high: 'bg-orange-900 text-orange-300',
    medium: 'bg-yellow-900 text-yellow-300',
    low: 'bg-blue-900 text-blue-300',
    // zone
    antarctic: 'bg-cyan-900 text-cyan-300',
    arctic: 'bg-sky-900 text-sky-300',
    // categories
    food: 'bg-green-900 text-green-300',
    medical: 'bg-pink-900 text-pink-300',
    equipment: 'bg-blue-900 text-blue-300',
    fuel: 'bg-orange-900 text-orange-300',
    scientific: 'bg-purple-900 text-purple-300',
    safety: 'bg-yellow-900 text-yellow-300',
    communication: 'bg-teal-900 text-teal-300',
    vehicle: 'bg-indigo-900 text-indigo-300',
    instrument: 'bg-violet-900 text-violet-300',
    other: 'bg-gray-700 text-gray-300',
    // alert types
    weather: 'bg-sky-900 text-sky-300',
    structural: 'bg-orange-900 text-orange-300',
    communication_loss: 'bg-yellow-900 text-yellow-300',
    fire: 'bg-red-900 text-red-300',
  };
  const cls = map[value] || 'bg-gray-700 text-gray-300';
  const label = value ? value.replace(/_/g, ' ') : 'unknown';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {label}
    </span>
  );
}
