import { useMemo } from 'react';
import { CarFront, CircleCheck, Clock, ParkingSquare } from 'lucide-react';
import { ParkedVehicle, ExitRecord } from '@/lib/types';
import { Card } from '@/components/ui';

function StatCard({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  tone: 'sky' | 'emerald' | 'amber' | 'slate';
}) {
  const tones: Record<string, string> = {
    sky: 'bg-sky-50 text-sky-600 ring-sky-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    slate: 'bg-slate-100 text-slate-500 ring-slate-200',
  };
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({
  totalSlots,
  occupiedCount,
  freeCount,
  waiting,
  history,
  parkedVehicles,
}: {
  totalSlots: number;
  occupiedCount: number;
  freeCount: number;
  waiting: { vehicleNumber: string }[];
  history: ExitRecord[];
  parkedVehicles: ParkedVehicle[];
}) {
  const occupancyPct = Math.round((occupiedCount / totalSlots) * 100);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">Dashboard</h1>
        <p className="mt-0.5 text-sm text-slate-500">Live overview of the parking lot.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Occupied Slots" value={`${occupiedCount}/${totalSlots}`} sub={`${occupancyPct}% occupied`} icon={<CarFront size={22} />} tone="sky" />
        <StatCard label="Available Slots" value={freeCount} sub={freeCount === 0 ? 'Lot is full' : 'Ready to park'} icon={<CircleCheck size={22} />} tone="emerald" />
        <StatCard label="In Waiting Queue" value={waiting.length} sub="Vehicles queued" icon={<Clock size={22} />} tone="amber" />
        <StatCard label="Total Exits" value={history.length} sub="Vehicles exited" icon={<ParkingSquare size={22} />} tone="slate" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Parking Slot Overview</h2>
            <span className="text-sm font-medium text-slate-500">{occupancyPct}% full</span>
          </div>
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-500" style={{ width: `${occupancyPct}%` }} />
          </div>
          <div className="mt-5 grid grid-cols-5 gap-3">
            {Array.from({ length: totalSlots }).map((_, i) => {
              const v = parkedVehicles.find((p) => p.slotId === i + 1);
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center ${
                    v ? 'border-sky-200 bg-sky-50' : 'border-dashed border-slate-300 bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-400">SLOT</span>
                  <span className="text-lg font-bold text-slate-700">{i + 1}</span>
                  {v ? (
                    <span className="mt-1 text-[10px] font-medium text-sky-600">{v.vehicleNumber.slice(0, 8)}</span>
                  ) : (
                    <span className="mt-1 text-[10px] font-medium text-emerald-500">Free</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <ParkingSquare size={18} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Recent Exits</h2>
          </div>
          {history.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No exit records yet.</p>
          ) : (
            <ul className="space-y-3">
              {history.slice(0, 5).map((r, i) => (
                <li key={`${r.vehicleNumber}-${i}`} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{r.vehicleNumber}</p>
                    <p className="text-xs text-slate-400">Slot {r.slotId} · {r.durationLabel}</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">₹{r.fee}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
