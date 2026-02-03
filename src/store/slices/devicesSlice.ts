import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Device {
  id: string;
  type: 'inverter' | 'battery' | 'solar' | 'meter';
  name: string;
  status: 'online' | 'offline' | 'error';
  lastSeen: Date;
}

export interface Installation {
  id: string;
  name: string;
  location: string;
  devices: Device[];
}

export interface DevicesState {
  installations: Installation[];
  selectedInstallationId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DevicesState = {
  installations: [],
  selectedInstallationId: null,
  isLoading: false,
  error: null,
};

/**
 * Devices slice
 * Manages installations and devices
 */
const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    fetchDevicesStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    setInstallations: (state, action: PayloadAction<Installation[]>) => {
      state.installations = action.payload;
      state.isLoading = false;
      // Auto-select first installation if none selected
      if (!state.selectedInstallationId && action.payload.length > 0) {
        state.selectedInstallationId = action.payload[0].id;
      }
    },
    selectInstallation: (state, action: PayloadAction<string>) => {
      state.selectedInstallationId = action.payload;
    },
    fetchDevicesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDevicesStart, setInstallations, selectInstallation, fetchDevicesFailure } =
  devicesSlice.actions;
export default devicesSlice.reducer;
