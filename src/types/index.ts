/**
 * Common type definitions
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'client' | 'admin' | 'technician';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Installation {
  id: string;
  name: string;
  location: string;
  devices: Device[];
  capacity: {
    solar: number; // kW
    battery: number; // kWh
    inverter: number; // kW
  };
  status: 'active' | 'inactive' | 'maintenance';
}

export interface Device {
  id: string;
  type: 'inverter' | 'battery' | 'solar' | 'meter';
  name: string;
  manufacturer?: string;
  model?: string;
  status: 'online' | 'offline' | 'error';
  lastSeen: Date;
}

export interface RealTimeData {
  timestamp: Date;
  solarPower: number; // kW
  batteryCharge: number; // %
  batteryPower: number; // kW (positive = charging, negative = discharging)
  gridPower: number; // kW (positive = importing, negative = exporting)
  consumption: number; // kW
}

export interface EnergyStats {
  todayProduction: number; // kWh
  todayConsumption: number; // kWh
  monthProduction: number; // kWh
  monthConsumption: number; // kWh
  lifetimeProduction: number; // kWh
  co2Saved: number; // kg
  costSaved: number; // local currency
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  deviceId?: string;
}
