import { Users, CircleCheck, X, CarFront, Bike } from 'lucide-react';
import { Vehicle } from '@/lib/types';
import { SectionHeader, EmptyState } from '@/components/ui';
import { ParkResult } from '@/lib/useParkingLot';

export default function WaitingQueue({
  waiting,
  onRemoveFromQueue,
}: {
  waiting: Vehicle[];
  onRemoveFromQueue: (vehicleNumber: string) => ParkResult;
}) {
  return (
    <div>
      <SectionHeader
        title="Waiting Queue"
        subtitle="FIFO queue — the first vehicle in line gets the next free slot."
        icon={<Users size={22} />}
      />

      <div className="card p-6">
        {waiting.length === 0 ? (
          <EmptyState icon={<CircleCheck size={26} />} title="Queue is empty" hint="Vehicles are added here automatically when the lot is full." />
        ) : (
          <ol className="space-y-3">
            {waiting.map((v, i) => (
              <li
                key={v.vehicleNumber}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition hover:border-amber-200 hover:bg-amber-50/40"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    {v.type === 'Car' ? <CarFront size={18} className="text-slate-400" /> : <Bike size={18} className="text-slate-400" />}
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{v.vehicleNumber}</p>
                      <p className="text-xs text-slate-400">{v.ownerName} · {v.type}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFromQueue(v.vehicleNumber)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  title="Remove from queue"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
