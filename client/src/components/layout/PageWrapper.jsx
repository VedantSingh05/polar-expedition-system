import { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import { getAlerts } from '../../api/emergency.api.js';

export default function PageWrapper({ title, children }) {
  const [activeAlerts, setActiveAlerts] = useState(0);

  useEffect(() => {
    getAlerts(0)
      .then(res => setActiveAlerts(Array.isArray(res.data) ? res.data.length : 0))
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <Sidebar activeAlerts={activeAlerts} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar title={title} />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
