import { useState } from 'react';
import { Search, CarFront, Bike, LogOut, Clock, CircleCheck } from 'lucide-react';
import { ParkedVehicle, ExitRecord, Vehicle } from '@/lib/types';
import { SectionHeader, EmptyState } from '@/components/ui';

function fmtTime(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SearchVehicle({
  onSearch,
}: {
  onSearch: (q: string) => { parked: ParkedVehicle[]; waiting: Vehicle[]; exited: ExitRecord[] };
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ parked: ParkedVehicle[]; waiting: Vehicle[]; exited: ExitRecord[] } | null>(null);

  const run = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults(null);
      return;
    }
    setResults(onSearch(query));
  };

  const total = results ? results.parked.length + results.waiting.length + results.exited.length : 0;

  return (
    <div>
      <SectionHeader
        title="Search Vehicle"
        subtitle="Search by vehicle number across parked vehicles, the waiting queue, and exit history."
        icon={<Search size={22} />}
      />

      <form onSubmit={run} className="card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-10"
            placeholder="Enter vehicle number e.g. KA19AB1234"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
          />
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {!results && (
        <EmptyState icon={<Search size={26} />} title="Search for a vehicle" hint="Results will appear here." />
      )}

      {results && (
        <div className="space-y-6">
          <p className="text-sm text-slate-500">
            {total > 0 ? `${total} match(es) for "${query}"` : `No matches for "${query}"`}
          </p>

          {results.parked.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                <CarFront size={18} className="text-sky-600" /> Currently Parked
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="pb-2 font-semibold">Vehicle Number</th>
                      <th className="pb-2 font-semibold">Owner</th>
                      <th className="pb-2 font-semibold">Type</th>
                      <th className="pb-2 font-semibold">Slot</th>
                      <th className="pb-2 font-semibold">Entry Time</th>
                      <th className="pb-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.parked.map((v) => (
                      <tr key={v.vehicleNumber} className="transition hover:bg-slate-50/60">
                        <td className="py-3 font-semibold text-slate-700">{v.vehicleNumber}</td>
                        <td className="py-3 text-slate-600">{v.ownerName}</td>
                        <td className="py-3 text-slate-600">{v.type}</td>
                        <td className="py-3 text-slate-600">Slot {v.slotId}</td>
                        <td className="py-3 text-slate-500">{fmtTime(v.parkedAt)}</td>
                        <td className="py-3"><span className="badge bg-sky-100 text-sky-700">Parked</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {results.waiting.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                <Clock size={18} className="text-amber-500" /> In Waiting Queue
              </h2>
              <ul className="divide-y divide-slate-100">
                {results.waiting.map((v) => (
                  <li key={v.vehicleNumber} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      {v.type === 'Car' ? <CarFront size={18} className="text-amber-500" /> : <Bike size={18} className="text-amber-500" />}
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{v.vehicleNumber}</p>
                        <p className="text-xs text-slate-400">{v.ownerName} · {v.type}</p>
                      </div>
                    </div>
                    <span className="badge bg-amber-100 text-amber-700">Waiting for parking</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.exited.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                <LogOut size={18} className="text-slate-500" /> Exit History
              </h2>
              <ul className="divide-y divide-slate-100">
                {results.exited.map((r, i) => (
                  <li key={`${r.vehicleNumber}-${i}`} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{r.vehicleNumber}</p>
                      <p className="text-xs text-slate-400">{r.ownerName} · Slot {r.slotId} · {r.durationLabel}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge bg-slate-100 text-slate-500">Exited</span>
                      <span className="text-sm font-bold text-emerald-600">₹{r.fee}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {total === 0 && (
            <div className="card">
              <EmptyState icon={<CircleCheck size={26} />} title="No matching vehicles" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
