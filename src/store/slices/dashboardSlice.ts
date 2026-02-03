import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RealTimeData, EnergyStats } from '../../types';

export interface DashboardState {
  realTimeData: RealTimeData | null;
  stats: EnergyStats | null;
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
    updateStats: (state, action: PayloadAction<EnergyStats>) => {
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
