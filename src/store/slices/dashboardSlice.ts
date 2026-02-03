import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RealTimeData {
  timestamp: Date;
  solarPower: number; // kW
  batteryCharge: number; // %
  gridPower: number; // kW
  consumption: number; // kW
}

export interface DashboardStats {
  todayProduction: number; // kWh
  monthProduction: number; // kWh
  lifetimeProduction: number; // kWh
  co2Saved: number; // kg
}

export interface DashboardState {
  realTimeData: RealTimeData | null;
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  realTimeData: null,
  stats: null,
  isLoading: false,
  error: null,
};

/**
 * Dashboard slice
 * Manages dashboard real-time data and statistics
 */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    updateRealTimeData: (state, action: PayloadAction<RealTimeData>) => {
      state.realTimeData = action.payload;
      state.isLoading = false;
    },
    updateStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
      state.isLoading = false;
    },
    fetchDashboardFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDashboardStart,
  updateRealTimeData,
  updateStats,
  fetchDashboardFailure,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
