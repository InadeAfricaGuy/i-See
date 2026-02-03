import dashboardReducer, {
  fetchDashboardStart,
  updateRealTimeData,
  updateStats,
  fetchDashboardFailure,
  DashboardState,
} from '../dashboardSlice';
import { RealTimeData, EnergyStats } from '../../../types';

describe('dashboardSlice', () => {
  const initialState: DashboardState = {
    realTimeData: null,
    stats: null,
    isLoading: false,
    error: null,
  };

  const mockRealTimeData: RealTimeData = {
    timestamp: new Date('2024-01-15T10:30:00Z'),
    solarPower: 5.5,
    batteryCharge: 80,
    batteryPower: 2.0,
    gridPower: -1.5,
    consumption: 4.0,
  };

  const mockStats: EnergyStats = {
    todayProduction: 15.5,
    todayConsumption: 12.0,
    monthProduction: 350.0,
    monthConsumption: 280.0,
    lifetimeProduction: 5000.0,
    co2Saved: 3500.0,
    costSaved: 1500.0,
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(dashboardReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('fetchDashboardStart', () => {
    it('should set isLoading to true and clear error', () => {
      const previousState: DashboardState = {
        ...initialState,
        error: 'Previous error',
      };

      const state = dashboardReducer(previousState, fetchDashboardStart());

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('updateRealTimeData', () => {
    it('should update real-time data and set isLoading to false', () => {
      const state = dashboardReducer(
        initialState,
        updateRealTimeData(mockRealTimeData)
      );

      expect(state.realTimeData).toEqual(mockRealTimeData);
      expect(state.isLoading).toBe(false);
    });

    it('should replace previous real-time data', () => {
      const previousData: RealTimeData = {
        timestamp: new Date('2024-01-15T10:00:00Z'),
        solarPower: 3.0,
        batteryCharge: 60,
        batteryPower: 1.0,
        gridPower: 0,
        consumption: 3.5,
      };
      const previousState: DashboardState = {
        ...initialState,
        realTimeData: previousData,
      };

      const state = dashboardReducer(
        previousState,
        updateRealTimeData(mockRealTimeData)
      );

      expect(state.realTimeData).toEqual(mockRealTimeData);
      expect(state.realTimeData).not.toEqual(previousData);
    });
  });

  describe('updateStats', () => {
    it('should update stats and set isLoading to false', () => {
      const state = dashboardReducer(initialState, updateStats(mockStats));

      expect(state.stats).toEqual(mockStats);
      expect(state.isLoading).toBe(false);
    });

    it('should replace previous stats', () => {
      const previousStats: EnergyStats = {
        todayProduction: 10.0,
        todayConsumption: 8.0,
        monthProduction: 300.0,
        monthConsumption: 250.0,
        lifetimeProduction: 4500.0,
        co2Saved: 3000.0,
        costSaved: 1200.0,
      };
      const previousState: DashboardState = {
        ...initialState,
        stats: previousStats,
      };

      const state = dashboardReducer(previousState, updateStats(mockStats));

      expect(state.stats).toEqual(mockStats);
      expect(state.stats).not.toEqual(previousStats);
    });
  });

  describe('fetchDashboardFailure', () => {
    it('should set error and set isLoading to false', () => {
      const errorMessage = 'Failed to fetch dashboard data';
      const state = dashboardReducer(
        initialState,
        fetchDashboardFailure(errorMessage)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should preserve existing data on failure', () => {
      const previousState: DashboardState = {
        realTimeData: mockRealTimeData,
        stats: mockStats,
        isLoading: true,
        error: null,
      };
      const errorMessage = 'Network error';

      const state = dashboardReducer(
        previousState,
        fetchDashboardFailure(errorMessage)
      );

      expect(state.realTimeData).toEqual(mockRealTimeData);
      expect(state.stats).toEqual(mockStats);
      expect(state.error).toBe(errorMessage);
    });
  });
});
