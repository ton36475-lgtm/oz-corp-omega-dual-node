import React from 'react';

interface SystemStatus {
  status: string;
  lastUpdated: string;
}

async function getSystemStatus(): Promise<SystemStatus> {
  try {
    const res = await fetch(`${process.env.API_SIRINX_CO}/status`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch system status:", error);
    return { status: 'Offline', lastUpdated: new Date().toISOString() };
  }
}

export default async function HomePage() {
  const systemStatus = await getSystemStatus();

  return (
    <div className="min-h-screen bg-[#030712] text-emerald-400 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#030712] p-6 border-r border-emerald-900">
        <h2 className="text-2xl font-bold mb-6 text-emerald-500">System Status</h2>
        <div className="space-y-4">
          <div>
            <p className="text-emerald-300">Status:</p>
            <p className={`font-semibold ${systemStatus.status === 'Online' ? 'text-emerald-400' : 'text-red-400'}`}>
              {systemStatus.status}
            </p>
          </div>
          <div>
            <p className="text-emerald-300">Last Updated:</p>
            <p className="font-semibold text-emerald-400">
              {new Date(systemStatus.lastUpdated).toLocaleString()}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-5xl font-extrabold mb-8 text-emerald-500">Daylight Energy Dashboard</h1>
        <p className="text-lg text-emerald-200">Welcome, Commander. Monitoring the pulse of the OZ-CORP OMEGA network.</p>
        {/* Add more dashboard content here */}
      </main>
    </div>
  );
}
