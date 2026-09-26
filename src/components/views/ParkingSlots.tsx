import { CarFront, Bike, CircleCheck, MapPin, Clock } from 'lucide-react';
import { ParkedVehicle } from '@/lib/types';
import { SectionHeader, EmptyState } from '@/components/ui';

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m}m ago`;
  if (m > 0) return `${m}m ago`;
  return 'just now';
}

export default function ParkingSlots({
  slots,
}: {
  slots: (ParkedVehicle | null)[];
}) {
  return (
    <div>
      <SectionHeader
        title="Parking Slots"
        subtitle={`${slots.filter(Boolean).length} of ${slots.length} slots occupied`}
        icon={<MapPin size={22} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {slots.map((v, idx) => {
          const slotNum = idx + 1;
          const occupied = !!v;
          return (
            <div
              key={slotNum}
              className={`card relative overflow-hidden p-5 transition-all hover:shadow-md ${
                occupied ? 'border-sky-200 bg-gradient-to-br from-white to-sky-50/40' : 'border-dashed border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">SLOT</span>
                <span className="text-2xl font-extrabold text-slate-700">{slotNum}</span>
              </div>

              <div className="mt-4">
                {occupied ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {v!.type === 'Car' ? (
                        <CarFront size={20} className="text-sky-600" />
                      ) : (
                        <Bike size={20} className="text-sky-600" />
                      )}
                      <span className="text-lg font-bold tracking-wide text-slate-800">{v!.vehicleNumber}</span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-500">
                      <p><span className="font-medium text-slate-600">Owner:</span> {v!.ownerName}</p>
                      <p><span className="font-medium text-slate-600">Type:</span> {v!.type}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={12} /> {timeAgo(v!.parkedAt)}
                      </p>
                    </div>
                    <span className="badge bg-sky-100 text-sky-700">Occupied</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                      <CircleCheck size={24} />
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-500">Available</p>
                    <span className="badge mt-2 bg-emerald-100 text-emerald-700">Free</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {slots.every((s) => s === null) && (
        <div className="mt-4">
          <EmptyState icon={<MapPin size={26} />} title="No vehicles parked yet" hint="Use the Park Vehicle form to add one." />
        </div>
      )}
    </div>
  );
}
