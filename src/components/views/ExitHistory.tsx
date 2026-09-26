import { ScrollText } from 'lucide-react';
import { ExitRecord } from '@/lib/types';
import { SectionHeader, EmptyState } from '@/components/ui';

function fmtTime(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ExitHistory({ history }: { history: ExitRecord[] }) {
  return (
    <div>
      <SectionHeader
        title="Exit History"
        subtitle="Recently exited vehicles, newest first."
        icon={<ScrollText size={22} />}
      />

      <div className="card overflow-hidden">
        {history.length === 0 ? (
          <EmptyState icon={<ScrollText size={26} />} title="No exit records yet" hint="Checked-out vehicles will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Vehicle Number</th>
                  <th className="px-5 py-3 font-semibold">Exit Time</th>
                  <th className="px-5 py-3 font-semibold">Duration</th>
                  <th className="px-5 py-3 text-right font-semibold">Parking Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((r, i) => (
                  <tr key={`${r.vehicleNumber}-${i}`} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-semibold text-slate-700">{r.vehicleNumber}</td>
                    <td className="px-5 py-3 text-slate-500">{fmtTime(r.exitedAt)}</td>
                    <td className="px-5 py-3 text-slate-600">{r.durationLabel}</td>
                    <td className="px-5 py-3 text-right font-bold text-emerald-600">₹{r.fee}</td>
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
