import { useState } from 'react';
import { LogOut, CircleCheck, Info, CarFront, Bike } from 'lucide-react';
import { ParkedVehicle, VehicleType } from '@/lib/types';
import { SectionHeader } from '@/components/ui';
import { ParkResult } from '@/lib/useParkingLot';

function durationLabel(ms: number): string {
  const mins = Math.max(1, Math.round((Date.now() - ms) / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function currentFee(type: VehicleType, parkedAt: number): number {
  const hours = Math.max(1, Math.ceil((Date.now() - parkedAt) / 3_600_000));
  return hours * (type === 'Car' ? 30 : 15);
}

export default function RemoveVehicle({
  parkedVehicles,
  onRemove,
}: {
  parkedVehicles: ParkedVehicle[];
  onRemove: (vehicleNumber: string) => ParkResult;
}) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [result, setResult] = useState<ParkResult | null>(null);
  const [preview, setPreview] = useState<ParkedVehicle | null>(null);

  const lookup = (num: string) => {
    const key = num.trim().toLowerCase();
    if (!key) {
      setPreview(null);
      return;
    }
    const found = parkedVehicles.find((v) => v.vehicleNumber.toLowerCase() === key);
    setPreview(found ?? null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      setResult({ ok: false, message: 'Enter a vehicle number to remove.' });
      return;
    }
    const res = onRemove(vehicleNumber);
    setResult(res);
    if (res.ok) {
      setVehicleNumber('');
      setPreview(null);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Remove Vehicle"
        subtitle="Check out a vehicle by number. The fee is calculated and the next queued vehicle is promoted."
        icon={<LogOut size={22} />}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <form onSubmit={submit} className="card p-6 lg:col-span-2">
          <label className="label">Vehicle Number *</label>
          <input
            className="input"
            placeholder="e.g. KA19AB1234"
            value={vehicleNumber}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setVehicleNumber(val);
              lookup(val);
            }}
          />
          <button type="submit" className="btn-danger mt-4 w-full">
            <LogOut size={18} /> Remove Vehicle
          </button>

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
        </form>

        <div className="card p-6 lg:col-span-3">
          <h2 className="mb-4 font-semibold text-slate-800">Vehicle Details</h2>

          {preview ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {preview.type === 'Car' ? (
                  <CarFront size={22} className="text-sky-600" />
                ) : (
                  <Bike size={22} className="text-sky-600" />
                )}
                <span className="text-xl font-bold text-slate-800">{preview.vehicleNumber}</span>
                <span className="badge bg-sky-100 text-sky-700">Slot {preview.slotId}</span>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-400">Owner</dt>
                  <dd className="font-medium text-slate-700">{preview.ownerName}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-400">Vehicle Type</dt>
                  <dd className="font-medium text-slate-700">{preview.type}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-400">Parking Slot</dt>
                  <dd className="font-medium text-slate-700">Slot {preview.slotId}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-400">Duration</dt>
                  <dd className="font-medium text-slate-700">{durationLabel(preview.parkedAt)}</dd>
                </div>
              </dl>
              <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <span className="text-sm font-medium text-emerald-700">Current Fee ({preview.type === 'Car' ? '₹30/hr' : '₹15/hr'})</span>
                <span className="text-2xl font-bold text-emerald-700">₹{currentFee(preview.type, preview.parkedAt)}</span>
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">
              {vehicleNumber ? 'No parked vehicle with that number.' : 'Enter a vehicle number to see details.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
