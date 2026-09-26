import { useCallback, useMemo, useState } from 'react';
import {
  ExitRecord,
  ParkedVehicle,
  TOTAL_SLOTS,
  Vehicle,
  VehicleType,
  rateFor,
} from './types';

const VEHICLE_TYPES: VehicleType[] = ['Car', 'Bike'];

function labelDuration(ms: number): string {
  const mins = Math.max(1, Math.round(ms / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function computeFee(type: VehicleType, parkedAt: number, exitedAt: number): number {
  const hours = Math.max(1, Math.ceil((exitedAt - parkedAt) / 3_600_000));
  return hours * rateFor(type);
}

// Seed sample data so the dashboard looks alive on first load.
function seedSlots(): (ParkedVehicle | null)[] {
  const now = Date.now();
  const seeds: ParkedVehicle[] = [
    { vehicleNumber: 'KA19AB1234', ownerName: 'Arjun Reddy', type: 'Car', slotId: 1, parkedAt: now - 3 * 3_600_000 },
    { vehicleNumber: 'KA05MN7766', ownerName: 'Priya Sharma', type: 'Bike', slotId: 2, parkedAt: now - 45 * 60_000 },
    { vehicleNumber: 'KA03CD9087', ownerName: 'Rohit Nair', type: 'Car', slotId: 3, parkedAt: now - 20 * 60_000 },
  ];
  const slots: (ParkedVehicle | null)[] = Array.from({ length: TOTAL_SLOTS }, () => null);
  for (const v of seeds) slots[v.slotId - 1] = v;
  return slots;
}

function seedWaiting(): Vehicle[] {
  return [
    { vehicleNumber: 'KA51XY4321', ownerName: 'Sneha Iyer', type: 'Bike' },
    { vehicleNumber: 'KA02GH5566', ownerName: 'Vikram Rao', type: 'Car' },
  ];
}

function seedHistory(): ExitRecord[] {
  const now = Date.now();
  return [
    { vehicleNumber: 'KA08EF1122', ownerName: 'Divya Menon', type: 'Bike', slotId: 4, parkedAt: now - 6 * 3_600_000, exitedAt: now - 2 * 3_600_000, fee: 60, durationLabel: '4h 0m' },
    { vehicleNumber: 'KA41JK3344', ownerName: 'Karthik Gupta', type: 'Car', slotId: 5, parkedAt: now - 3 * 3_600_000, exitedAt: now - 90 * 60_000, fee: 90, durationLabel: '1h 30m' },
  ];
}

export interface ParkResult {
  ok: boolean;
  message: string;
  slotId?: number;
  queued?: boolean;
}

export function useParkingLot() {
  // Slots stored as a fixed-size array (index 0 => slot 1).
  const [slots, setSlots] = useState<(ParkedVehicle | null)[]>(seedSlots);
  // Waiting queue implemented as a plain FIFO array (push back, shift front).
  const [waiting, setWaiting] = useState<Vehicle[]>(seedWaiting);
  // Exit history — most recent first (we unshift on exit).
  const [history, setHistory] = useState<ExitRecord[]>(seedHistory);

  const occupiedCount = useMemo(
    () => slots.filter(Boolean).length,
    [slots],
  );
  const freeCount = TOTAL_SLOTS - occupiedCount;
  const isFull = freeCount === 0;

  const park = useCallback((v: Vehicle): ParkResult => {
    // Check whether the vehicle is already parked.
    if (slots.some((s) => s && s.vehicleNumber.toLowerCase() === v.vehicleNumber.toLowerCase())) {
      return { ok: false, message: `${v.vehicleNumber} is already parked.` };
    }
    // Check whether the vehicle is already in the waiting queue.
    if (waiting.some((w) => w.vehicleNumber.toLowerCase() === v.vehicleNumber.toLowerCase())) {
      return { ok: false, message: `${v.vehicleNumber} is already in the waiting queue.` };
    }

    // Find the first available slot (Slot 1 to Slot 5).
    const freeIdx = slots.findIndex((s) => s === null);
    if (freeIdx !== -1) {
      const parked: ParkedVehicle = { ...v, slotId: freeIdx + 1, parkedAt: Date.now() };
      setSlots((prev) => {
        const next = [...prev];
        next[freeIdx] = parked;
        return next;
      });
      return { ok: true, message: `${v.vehicleNumber} parked successfully in Slot ${freeIdx + 1}.`, slotId: freeIdx + 1 };
    }

    // All 5 slots occupied — add to the waiting queue (FIFO).
    setWaiting((q) => [...q, v]);
    return { ok: true, message: `All slots full — ${v.vehicleNumber} added to the waiting queue at position ${waiting.length + 1}.`, queued: true };
  }, [slots, waiting]);

  const remove = useCallback((vehicleNumber: string): ParkResult => {
    const key = vehicleNumber.trim().toLowerCase();
    const idx = slots.findIndex((s) => s && s.vehicleNumber.toLowerCase() === key);
    if (idx === -1 || !slots[idx]) {
      return { ok: false, message: `No parked vehicle with number "${vehicleNumber}".` };
    }

    const removed = slots[idx]!;
    const freedSlot = idx + 1;
    const exitedAt = Date.now();
    const fee = computeFee(removed.type, removed.parkedAt, exitedAt);
    const durationLabel = labelDuration(exitedAt - removed.parkedAt);
    const record: ExitRecord = { ...removed, exitedAt, fee, durationLabel };

    setSlots((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
    setHistory((h) => [record, ...h]);

    // Promote the front of the waiting queue into the freed slot.
    if (waiting.length > 0) {
      const [next, ...rest] = waiting;
      const promoted: ParkedVehicle = { ...next, slotId: freedSlot, parkedAt: Date.now() };
      setSlots((prev) => {
        const copy = [...prev];
        copy[freedSlot - 1] = promoted;
        return copy;
      });
      setWaiting(rest);
      return {
        ok: true,
        message: `${removed.vehicleNumber} removed from Slot ${freedSlot}. Fee: ₹${fee} (${durationLabel}). ${next.vehicleNumber} promoted from the queue into Slot ${freedSlot}.`,
      };
    }

    return { ok: true, message: `${removed.vehicleNumber} removed from Slot ${freedSlot}. Fee: ₹${fee} (${durationLabel}).` };
  }, [slots, waiting]);

  const removeFromQueue = useCallback((vehicleNumber: string): ParkResult => {
    const key = vehicleNumber.trim().toLowerCase();
    if (!waiting.some((w) => w.vehicleNumber.toLowerCase() === key)) {
      return { ok: false, message: `${vehicleNumber} is not in the waiting queue.` };
    }
    setWaiting((q) => q.filter((w) => w.vehicleNumber.toLowerCase() !== key));
    return { ok: true, message: `${vehicleNumber} removed from the waiting queue.` };
  }, [waiting]);

  // Search by vehicle number across parked vehicles, waiting queue, and history.
  const search = useCallback(
    (query: string): {
      parked: ParkedVehicle[];
      waiting: Vehicle[];
      exited: ExitRecord[];
    } => {
      const q = query.trim().toLowerCase();
      if (!q) return { parked: [], waiting: [], exited: [] };
      const parked = slots.filter(
        (s): s is ParkedVehicle =>
          !!s && s.vehicleNumber.toLowerCase().includes(q),
      );
      const inWaiting = waiting.filter((w) =>
        w.vehicleNumber.toLowerCase().includes(q),
      );
      const exited = history.filter((r) =>
        r.vehicleNumber.toLowerCase().includes(q),
      );
      return { parked: parked, waiting: inWaiting, exited: exited };
    },
    [slots, waiting, history],
  );

  const parkedVehicles = useMemo(
    () => slots.filter((s): s is ParkedVehicle => s !== null),
    [slots],
  );

  return {
    slots,
    waiting,
    history,
    parkedVehicles,
    occupiedCount,
    freeCount,
    isFull,
    totalSlots: TOTAL_SLOTS,
    carRate: 30,
    bikeRate: 15,
    park,
    remove,
    removeFromQueue,
    search,
    vehicleTypes: VEHICLE_TYPES,
  };
}
