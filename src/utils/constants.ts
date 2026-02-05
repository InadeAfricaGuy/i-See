/**
 * Application constants
 */

// API Configuration
export const API_BASE_URL = process.env.API_BASE_URL || 'https://api.isee.inadeafrica.com';
export const API_TIMEOUT = 30000; // 30 seconds

// WebSocket/MQTT Configuration
export const WS_URL = process.env.WS_URL || 'wss://ws.isee.inadeafrica.com';
export const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://mqtt.isee.inadeafrica.com';

// Refresh Intervals (in milliseconds)
export const DASHBOARD_REFRESH_INTERVAL = 30000; // 30 seconds
export const REALTIME_DATA_INTERVAL = 5000; // 5 seconds
export const DEVICE_STATUS_INTERVAL = 60000; // 1 minute

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@i-see/auth_token',
  REFRESH_TOKEN: '@i-see/refresh_token',
  USER_DATA: '@i-see/user_data',
  SELECTED_INSTALLATION: '@i-see/selected_installation',
  THEME_PREFERENCE: '@i-see/theme_preference',
  NOTIFICATION_SETTINGS: '@i-see/notification_settings',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
} as const;

// Chart Colors
export const CHART_COLORS = {
  solar: '#FFA500', // Orange
  battery: '#4CAF50', // Green
  grid: '#2196F3', // Blue
  consumption: '#9C27B0', // Purple
} as const;

// Energy Units
export const ENERGY_UNITS = {
  POWER: 'kW',
  ENERGY: 'kWh',
  VOLTAGE: 'V',
  CURRENT: 'A',
  FREQUENCY: 'Hz',
  TEMPERATURE: '°C',
} as const;
