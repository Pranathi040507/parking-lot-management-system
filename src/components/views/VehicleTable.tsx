import { ListChecks, CarFront, Bike } from 'lucide-react';
import { ParkedVehicle } from '@/lib/types';
import { SectionHeader, EmptyState } from '@/components/ui';

function timeAgo(ms: number): string {
  const mins = Math.floor((Date.now() - ms) / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return 'just now';
}

export default function VehicleTable({ parkedVehicles }: { parkedVehicles: ParkedVehicle[] }) {
  return (
    <div>
      <SectionHeader
        title="Vehicle Table"
        subtitle="All vehicles currently parked in the lot."
        icon={<ListChecks size={22} />}
      />

      <div className="card overflow-hidden">
        {parkedVehicles.length === 0 ? (
          <EmptyState icon={<CarFront size={26} />} title="No parked vehicles" hint="Use the Park Vehicle form to add one." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Vehicle Number</th>
                  <th className="px-5 py-3 font-semibold">Owner</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Slot</th>
                  <th className="px-5 py-3 font-semibold">Parked</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parkedVehicles.map((v) => (
                  <tr key={v.vehicleNumber} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-semibold text-slate-700">{v.vehicleNumber}</td>
                    <td className="px-5 py-3 text-slate-600">{v.ownerName}</td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        {v.type === 'Car' ? <CarFront size={15} /> : <Bike size={15} />}
                        {v.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{v.slotId}</td>
                    <td className="px-5 py-3 text-slate-500">{timeAgo(v.parkedAt)}</td>
                    <td className="px-5 py-3">
                      <span className="badge bg-sky-100 text-sky-700">Parked</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
