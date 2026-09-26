import { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  CirclePlus,
  LogOut,
  Search,
  Users,
  ScrollText,
  ListChecks,
  Menu,
  X,
  ParkingSquare,
} from 'lucide-react';
import { useParkingLot } from '@/lib/useParkingLot';
import Dashboard from '@/components/views/Dashboard';
import ParkingSlots from '@/components/views/ParkingSlots';
import ParkVehicle from '@/components/views/ParkVehicle';
import RemoveVehicle from '@/components/views/RemoveVehicle';
import SearchVehicle from '@/components/views/SearchVehicle';
import WaitingQueue from '@/components/views/WaitingQueue';
import ExitHistory from '@/components/views/ExitHistory';
import VehicleTable from '@/components/views/VehicleTable';

type ViewId =
  | 'dashboard'
  | 'park'
  | 'remove'
  | 'search'
  | 'slots'
  | 'queue'
  | 'history'
  | 'table';

interface NavItem {
  id: ViewId;
  label: string;
  icon: React.ReactNode;
}

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'park', label: 'Park Vehicle', icon: <CirclePlus size={20} /> },
  { id: 'remove', label: 'Remove Vehicle', icon: <LogOut size={20} /> },
  { id: 'search', label: 'Search Vehicle', icon: <Search size={20} /> },
  { id: 'slots', label: 'Parking Slots', icon: <MapPin size={20} /> },
  { id: 'queue', label: 'Waiting Queue', icon: <Users size={20} /> },
  { id: 'history', label: 'Exit History', icon: <ScrollText size={20} /> },
  { id: 'table', label: 'Vehicle Table', icon: <ListChecks size={20} /> },
];

export default function App() {
  const lot = useParkingLot();
  const [view, setView] = useState<ViewId>('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const go = (id: ViewId) => {
    setView(id);
    setDrawerOpen(false);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard
            totalSlots={lot.totalSlots}
            occupiedCount={lot.occupiedCount}
            freeCount={lot.freeCount}
            waiting={lot.waiting}
            history={lot.history}
            parkedVehicles={lot.parkedVehicles}
          />
        );
      case 'park':
        return (
          <ParkVehicle
            onPark={lot.park}
            vehicleTypes={lot.vehicleTypes}
            freeCount={lot.freeCount}
            waitingCount={lot.waiting.length}
            carRate={lot.carRate}
            bikeRate={lot.bikeRate}
          />
        );
      case 'remove':
        return <RemoveVehicle parkedVehicles={lot.parkedVehicles} onRemove={lot.remove} />;
      case 'search':
        return <SearchVehicle onSearch={lot.search} />;
      case 'slots':
        return <ParkingSlots slots={lot.slots} />;
      case 'queue':
        return <WaitingQueue waiting={lot.waiting} onRemoveFromQueue={lot.removeFromQueue} />;
      case 'history':
        return <ExitHistory history={lot.history} />;
      case 'table':
        return <VehicleTable parkedVehicles={lot.parkedVehicles} />;
    }
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
          <ParkingSquare size={22} />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-slate-800">ParkManage</p>
          <p className="text-xs text-slate-400">Parking Lot System</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map((item) => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-100'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <span className={active ? 'text-sky-600' : 'text-slate-400'}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-400">Data Structures Project</p>
        <p className="text-xs font-medium text-slate-500">Car ₹30/hr · Bike ₹15/hr</p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white">
            <ParkingSquare size={20} />
          </div>
          <span className="font-bold text-slate-800">ParkManage</span>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white shadow-xl">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
          <SidebarContent />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
