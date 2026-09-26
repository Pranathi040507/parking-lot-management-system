import { useState } from 'react';
import { CirclePlus, CircleCheck, Info } from 'lucide-react';
import { Vehicle, VehicleType } from '@/lib/types';
import { SectionHeader } from '@/components/ui';
import { ParkResult } from '@/lib/useParkingLot';

const empty: Vehicle = { vehicleNumber: '', ownerName: '', type: 'Car' };

export default function ParkVehicle({
  onPark,
  vehicleTypes,
  freeCount,
  waitingCount,
  carRate,
  bikeRate,
}: {
  onPark: (v: Vehicle) => ParkResult;
  vehicleTypes: VehicleType[];
  freeCount: number;
  waitingCount: number;
  carRate: number;
  bikeRate: number;
}) {
  const [form, setForm] = useState<Vehicle>(empty);
  const [result, setResult] = useState<ParkResult | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicleNumber.trim() || !form.ownerName.trim()) {
      setResult({ ok: false, message: 'Vehicle number and owner name are required.' });
      return;
    }
    const res = onPark(form);
    setResult(res);
    if (res.ok) setForm(empty);
  };

  return (
    <div>
      <SectionHeader
        title="Park Vehicle"
        subtitle="Enter vehicle details — the first available slot is assigned automatically."
        icon={<CirclePlus size={22} />}
      />

      <div className="mx-auto max-w-2xl">
        <form onSubmit={submit} className="card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Vehicle Number *</label>
              <input
                className="input"
                placeholder="e.g. KA19AB1234"
                value={form.vehicleNumber}
                onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label className="label">Owner Name *</label>
              <input
                className="input"
                placeholder="e.g. Arjun Reddy"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Vehicle Type</label>
              <select
                className="input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as VehicleType })}
              >
                {vehicleTypes.map((t) => (
                  <option key={t} value={t}>{t} — ₹{t === 'Car' ? carRate : bikeRate}/hour</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Info size={16} />
              <span>{freeCount} slot(s) free · {waitingCount} in queue</span>
            </div>
            <button type="submit" className="btn-primary">
              <CirclePlus size={18} /> Park Vehicle
            </button>
          </div>
        </form>

        {result && (
          <div
            className={`mt-4 flex items-start gap-3 rounded-xl border p-4 ${
              result.ok
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            {result.ok ? <CircleCheck size={20} className="mt-0.5 shrink-0" /> : <Info size={20} className="mt-0.5 shrink-0" />}
            <p className="text-sm font-medium">{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
