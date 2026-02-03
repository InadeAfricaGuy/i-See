import devicesReducer, {
  fetchDevicesStart,
  setInstallations,
  selectInstallation,
  fetchDevicesFailure,
  DevicesState,
} from '../devicesSlice';
import { Installation, Device } from '../../../types';

describe('devicesSlice', () => {
  const initialState: DevicesState = {
    installations: [],
    selectedInstallationId: null,
    isLoading: false,
    error: null,
  };

  const mockDevices: Device[] = [
    {
      id: 'device-1',
      type: 'inverter',
      name: 'Main Inverter',
      manufacturer: 'SolarEdge',
      model: 'SE10K',
      status: 'online',
      lastSeen: new Date('2024-01-15T10:30:00Z'),
    },
    {
      id: 'device-2',
      type: 'battery',
      name: 'Battery Bank',
      manufacturer: 'Tesla',
      model: 'Powerwall 2',
      status: 'online',
      lastSeen: new Date('2024-01-15T10:30:00Z'),
    },
  ];

  const mockInstallations: Installation[] = [
    {
      id: 'installation-1',
      name: 'Main Office',
      location: 'Lagos, Nigeria',
      devices: mockDevices,
      capacity: {
        solar: 10.0,
        battery: 13.5,
        inverter: 10.0,
      },
      status: 'active',
    },
    {
      id: 'installation-2',
      name: 'Factory Building',
      location: 'Abuja, Nigeria',
      devices: [],
      capacity: {
        solar: 50.0,
        battery: 27.0,
        inverter: 50.0,
      },
      status: 'active',
    },
  ];

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(devicesReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('fetchDevicesStart', () => {
    it('should set isLoading to true and clear error', () => {
      const previousState: DevicesState = {
        ...initialState,
        error: 'Previous error',
      };

      const state = devicesReducer(previousState, fetchDevicesStart());

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('setInstallations', () => {
    it('should set installations and auto-select first one', () => {
      const state = devicesReducer(
        initialState,
        setInstallations(mockInstallations)
      );

      expect(state.installations).toEqual(mockInstallations);
      expect(state.selectedInstallationId).toBe('installation-1');
      expect(state.isLoading).toBe(false);
    });

    it('should not change selection if already set', () => {
      const previousState: DevicesState = {
        ...initialState,
        selectedInstallationId: 'installation-2',
      };

      const state = devicesReducer(
        previousState,
        setInstallations(mockInstallations)
      );

      expect(state.installations).toEqual(mockInstallations);
      expect(state.selectedInstallationId).toBe('installation-2');
    });

    it('should not set selection when installations array is empty', () => {
      const state = devicesReducer(initialState, setInstallations([]));

      expect(state.installations).toEqual([]);
      expect(state.selectedInstallationId).toBeNull();
    });

    it('should replace previous installations', () => {
      const previousState: DevicesState = {
        ...initialState,
        installations: [mockInstallations[0]],
        selectedInstallationId: 'installation-1',
      };

      const state = devicesReducer(
        previousState,
        setInstallations(mockInstallations)
      );

      expect(state.installations).toEqual(mockInstallations);
      expect(state.installations.length).toBe(2);
    });
  });

  describe('selectInstallation', () => {
    it('should select an installation by id', () => {
      const state = devicesReducer(
        initialState,
        selectInstallation('installation-2')
      );

      expect(state.selectedInstallationId).toBe('installation-2');
    });

    it('should change previously selected installation', () => {
      const previousState: DevicesState = {
        ...initialState,
        selectedInstallationId: 'installation-1',
      };

      const state = devicesReducer(
        previousState,
        selectInstallation('installation-2')
      );

      expect(state.selectedInstallationId).toBe('installation-2');
    });
  });

  describe('fetchDevicesFailure', () => {
    it('should set error and set isLoading to false', () => {
      const errorMessage = 'Failed to fetch devices';
      const state = devicesReducer(
        initialState,
        fetchDevicesFailure(errorMessage)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should preserve existing installations on failure', () => {
      const previousState: DevicesState = {
        installations: mockInstallations,
        selectedInstallationId: 'installation-1',
        isLoading: true,
        error: null,
      };
      const errorMessage = 'Network error';

      const state = devicesReducer(
        previousState,
        fetchDevicesFailure(errorMessage)
      );

      expect(state.installations).toEqual(mockInstallations);
      expect(state.selectedInstallationId).toBe('installation-1');
      expect(state.error).toBe(errorMessage);
    });
  });
});
