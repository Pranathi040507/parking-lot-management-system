export type VehicleType = 'Car' | 'Bike';

export interface Vehicle {
  vehicleNumber: string;
  ownerName: string;
  type: VehicleType;
}

export interface ParkedVehicle extends Vehicle {
  slotId: number;
  parkedAt: number; // epoch ms
}

export interface ExitRecord extends Vehicle {
  slotId: number;
  parkedAt: number;
  exitedAt: number;
  fee: number;
  durationLabel: string;
}

export const TOTAL_SLOTS = 5;
export const CAR_RATE = 30; // ₹ per hour
export const BIKE_RATE = 15; // ₹ per hour

export function rateFor(type: VehicleType): number {
  return type === 'Car' ? CAR_RATE : BIKE_RATE;
}
