# i-See Mobile App Implementation Guide

## Table of Contents
1. [Project Setup](#project-setup)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Module Implementation](#module-implementation)
5. [API Integration](#api-integration)
6. [Testing Strategy](#testing-strategy)
7. [Deployment](#deployment)

## Project Setup

### React Native Setup (Recommended)

#### Prerequisites
```bash
# Required installations
- Node.js >= 18.x
- npm or yarn
- Xcode (macOS) for iOS development
- Android Studio for Android development
- CocoaPods (iOS dependency manager)
- JDK 11 or newer
```

#### Initialize Project
```bash
# Create new React Native project with TypeScript
npx react-native@latest init iSee --template react-native-template-typescript

# Navigate to project directory
cd iSee

# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..
```

#### Install Core Dependencies
```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated

# State Management
npm install @reduxjs/toolkit react-redux
# Alternative: npm install zustand

# UI Components
npm install react-native-paper
npm install react-native-vector-icons

# Charts & Visualization
npm install victory-native react-native-svg

# Networking
npm install axios
npm install @tanstack/react-query

# Real-time Communication
npm install socket.io-client
npm install mqtt

# Storage
npm install @react-native-async-storage/async-storage
# For advanced: npm install @nozbe/watermelondb

# Authentication
npm install @react-native-firebase/app @react-native-firebase/auth
npm install @react-native-firebase/messaging

# Utilities
npm install react-native-dotenv
npm install date-fns
npm install lodash

# Development
npm install --save-dev @types/react @types/react-native
npm install --save-dev eslint prettier
npm install --save-dev @testing-library/react-native jest
```

#### Configuration Files

**.env**
```env
API_BASE_URL=https://api.inadeafrica.com/v1
API_KEY=your_api_key_here
MQTT_BROKER_URL=wss://mqtt.inadeafrica.com:8883
SENTRY_DSN=your_sentry_dsn
FIREBASE_PROJECT_ID=your_firebase_project
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2017"],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@services/*": ["src/services/*"],
      "@store/*": ["src/store/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "jest.config.js"
  ]
}
```

**.eslintrc.js**
```javascript
module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
```

**.prettierrc.js**
```javascript
module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
};
```

### Flutter Setup (Alternative)

#### Prerequisites
```bash
# Install Flutter SDK
# Follow: https://flutter.dev/docs/get-started/install

# Verify installation
flutter doctor
```

#### Initialize Project
```bash
# Create new Flutter project
flutter create i_see

# Navigate to project
cd i_see
```

#### pubspec.yaml
```yaml
name: i_see
description: InadeAfrica solar monitoring mobile app
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  provider: ^6.1.0
  # Alternative: riverpod, bloc
  
  # UI
  flutter_svg: ^2.0.0
  cached_network_image: ^3.3.0
  
  # Charts
  fl_chart: ^0.66.0
  
  # Networking
  dio: ^5.4.0
  
  # Real-time
  mqtt_client: ^10.0.0
  web_socket_channel: ^2.4.0
  
  # Storage
  sqflite: ^2.3.0
  shared_preferences: ^2.2.0
  
  # Authentication
  firebase_core: ^2.24.0
  firebase_auth: ^4.16.0
  
  # Notifications
  firebase_messaging: ^14.7.0
  
  # Utilities
  intl: ^0.18.0
  path_provider: ^2.1.0
  
dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  mockito: ^5.4.0
```

## Project Structure

### React Native Project Structure
```
iSee/
├── android/                    # Android native code
├── ios/                        # iOS native code
├── src/
│   ├── assets/                # Images, fonts, etc.
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── components/            # Reusable components
│   │   ├── common/           # Generic components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── charts/           # Chart components
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   └── GaugeChart.tsx
│   │   └── widgets/          # Feature-specific widgets
│   │       ├── PowerFlowDiagram.tsx
│   │       ├── BatteryIndicator.tsx
│   │       └── StatusCard.tsx
│   ├── screens/              # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   ├── monitoring/
│   │   │   ├── InverterScreen.tsx
│   │   │   ├── BatteryScreen.tsx
│   │   │   └── SolarScreen.tsx
│   │   ├── analytics/
│   │   │   └── AnalyticsScreen.tsx
│   │   ├── alerts/
│   │   │   └── AlertsScreen.tsx
│   │   └── settings/
│   │       └── SettingsScreen.tsx
│   ├── navigation/           # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── AppNavigator.tsx
│   ├── services/             # API and external services
│   │   ├── api/
│   │   │   ├── apiClient.ts
│   │   │   ├── authApi.ts
│   │   │   ├── installationApi.ts
│   │   │   └── deviceApi.ts
│   │   ├── mqtt/
│   │   │   └── mqttClient.ts
│   │   ├── storage/
│   │   │   └── storageService.ts
│   │   └── notifications/
│   │       └── notificationService.ts
│   ├── store/                # Redux store
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── installationSlice.ts
│   │   │   ├── deviceSlice.ts
│   │   │   └── alertSlice.ts
│   │   ├── hooks.ts
│   │   └── store.ts
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useRealTimeData.ts
│   │   └── useNetworkStatus.ts
│   ├── utils/                # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── types/                # TypeScript type definitions
│   │   ├── models.ts
│   │   ├── api.ts
│   │   └── navigation.ts
│   └── App.tsx               # Root component
├── __tests__/                # Tests
├── .env                      # Environment variables
├── .eslintrc.js
├── .prettierrc.js
├── babel.config.js
├── metro.config.js
├── package.json
├── tsconfig.json
└── README.md
```

### Flutter Project Structure
```
i_see/
├── android/
├── ios/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── core/
│   │   ├── constants/
│   │   ├── themes/
│   │   └── utils/
│   ├── data/
│   │   ├── models/
│   │   ├── repositories/
│   │   └── providers/
│   ├── domain/
│   │   ├── entities/
│   │   └── usecases/
│   ├── presentation/
│   │   ├── screens/
│   │   ├── widgets/
│   │   └── providers/
│   └── services/
│       ├── api/
│       ├── mqtt/
│       └── storage/
├── test/
├── pubspec.yaml
└── README.md
```

## Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/dashboard-screen
# Make changes
git add .
git commit -m "feat: implement dashboard screen"
git push origin feature/dashboard-screen

# Create pull request for review
```

### Branching Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

### Code Review Checklist
- [ ] Code follows style guide
- [ ] TypeScript types properly defined
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Unit tests added/updated
- [ ] Performance considerations addressed
- [ ] Accessibility implemented
- [ ] Documentation updated

## Module Implementation

### 1. Authentication Module

**src/services/api/authApi.ts**
```typescript
import axios from 'axios';
import { API_BASE_URL } from '@env';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });
    return response.data;
  },

  logout: async (accessToken: string): Promise<void> => {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  },
};
```

**src/store/slices/authSlice.ts**
```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, LoginCredentials } from '@/services/api/authApi';
import { storageService } from '@/services/storage/storageService';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    await storageService.saveTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      storageService.clearTokens();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

**src/screens/auth/LoginScreen.tsx**
```typescript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const handleLogin = () => {
    dispatch(login({ email, password }));
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        i-See Login
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
```

### 2. Real-time Data Integration

**src/services/mqtt/mqttClient.ts**
```typescript
import mqtt, { MqttClient } from 'mqtt';
import { MQTT_BROKER_URL } from '@env';

class MQTTService {
  private client: MqttClient | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();

  connect(clientId: string, accessToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = mqtt.connect(MQTT_BROKER_URL, {
        clientId,
        username: 'app',
        password: accessToken,
        clean: true,
        reconnectPeriod: 5000,
      });

      this.client.on('connect', () => {
        console.log('MQTT Connected');
        resolve();
      });

      this.client.on('error', (error) => {
        console.error('MQTT Error:', error);
        reject(error);
      });

      this.client.on('message', (topic, message) => {
        const data = JSON.parse(message.toString());
        this.notifySubscribers(topic, data);
      });
    });
  }

  subscribe(topic: string, callback: (data: any) => void): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
      this.client?.subscribe(topic);
    }
    this.subscribers.get(topic)?.add(callback);
  }

  unsubscribe(topic: string, callback: (data: any) => void): void {
    const topicSubscribers = this.subscribers.get(topic);
    if (topicSubscribers) {
      topicSubscribers.delete(callback);
      if (topicSubscribers.size === 0) {
        this.client?.unsubscribe(topic);
        this.subscribers.delete(topic);
      }
    }
  }

  private notifySubscribers(topic: string, data: any): void {
    this.subscribers.get(topic)?.forEach(callback => callback(data));
  }

  disconnect(): void {
    this.client?.end();
    this.client = null;
    this.subscribers.clear();
  }
}

export const mqttService = new MQTTService();
```

**src/hooks/useRealTimeData.ts**
```typescript
import { useEffect, useState } from 'react';
import { mqttService } from '@/services/mqtt/mqttClient';

export const useRealTimeData = <T>(topic: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleData = (receivedData: T) => {
      setData(receivedData);
      setIsConnected(true);
    };

    mqttService.subscribe(topic, handleData);

    return () => {
      mqttService.unsubscribe(topic, handleData);
    };
  }, [topic]);

  return { data, isConnected };
};
```

### 3. Dashboard Implementation

**src/screens/dashboard/DashboardScreen.tsx**
```typescript
import React from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { PowerFlowDiagram } from '@/components/widgets/PowerFlowDiagram';
import { BatteryIndicator } from '@/components/widgets/BatteryIndicator';
import { StatusCard } from '@/components/widgets/StatusCard';

interface DashboardData {
  solar: { power: number; status: string };
  battery: { charge: number; power: number; status: string };
  inverter: { power: number; status: string };
  grid: { power: number; importing: boolean };
}

export const DashboardScreen: React.FC = () => {
  const { data, isConnected } = useRealTimeData<DashboardData>(
    'installations/123/realtime'
  );
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Trigger data refresh
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  if (!data) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.statusIndicator}>
        <Text>
          {isConnected ? '● Connected' : '○ Disconnected'}
        </Text>
      </View>

      <PowerFlowDiagram
        solar={data.solar.power}
        battery={data.battery.power}
        grid={data.grid.power}
        load={data.inverter.power}
      />

      <View style={styles.cardRow}>
        <StatusCard
          title="Solar"
          value={`${data.solar.power.toFixed(1)} kW`}
          status={data.solar.status}
          icon="white-balance-sunny"
        />
        <StatusCard
          title="Battery"
          value={`${data.battery.charge}%`}
          status={data.battery.status}
          icon="battery-charging"
        />
      </View>

      <BatteryIndicator
        charge={data.battery.charge}
        power={data.battery.power}
        status={data.battery.status}
      />

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Today's Summary</Text>
          <Text>Production: 45.2 kWh</Text>
          <Text>Consumption: 38.7 kWh</Text>
          <Text>Grid Export: 6.5 kWh</Text>
          <Text>Savings: $12.50</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  statusIndicator: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  card: {
    marginVertical: 8,
  },
});
```

## API Integration

### API Client Setup

**src/services/api/apiClient.ts**
```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@env';
import { storageService } from '@/services/storage/storageService';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        const token = await storageService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = await storageService.getRefreshToken();
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });
            await storageService.saveTokens(response.data);
            return this.client(originalRequest);
          } catch (refreshError) {
            // Logout user
            await storageService.clearTokens();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

## Testing Strategy

### Unit Testing

**src/store/slices/__tests__/authSlice.test.ts**
```typescript
import authReducer, { login, logout } from '../authSlice';
import { configureStore } from '@reduxjs/toolkit';

describe('authSlice', () => {
  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it('should handle logout', () => {
    const previousState = {
      user: { id: '1', email: 'test@test.com' },
      accessToken: 'token',
      refreshToken: 'refresh',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
    expect(authReducer(previousState, logout())).toEqual({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });
});
```

### Integration Testing

**src/screens/__tests__/LoginScreen.test.tsx**
```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginScreen } from '../auth/LoginScreen';
import authReducer from '@/store/slices/authSlice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe('LoginScreen', () => {
  it('should render login form', () => {
    const store = createTestStore();
    const { getByText, getByLabelText } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    expect(getByText('i-See Login')).toBeTruthy();
    expect(getByLabelText('Email')).toBeTruthy();
    expect(getByLabelText('Password')).toBeTruthy();
  });

  it('should handle login submission', async () => {
    const store = createTestStore();
    const { getByText, getByLabelText } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      // Assert expected behavior
    });
  });
});
```

### E2E Testing (with Detox)

```bash
npm install --save-dev detox
```

**e2e/login.e2e.ts**
```typescript
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully', async () => {
    await element(by.id('emailInput')).typeText('test@example.com');
    await element(by.id('passwordInput')).typeText('password123');
    await element(by.id('loginButton')).tap();
    await expect(element(by.text('Dashboard'))).toBeVisible();
  });
});
```

## Deployment

### Build for Production

#### iOS
```bash
# Install dependencies
cd ios && pod install && cd ..

# Build for testing
npx react-native run-ios --configuration Release

# Archive for App Store
# Open Xcode -> Product -> Archive
```

#### Android
```bash
# Generate release keystore (first time only)
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore \
  -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Build release APK
cd android
./gradlew assembleRelease

# Build App Bundle (for Play Store)
./gradlew bundleRelease
```

### Continuous Integration

**.github/workflows/ci.yml**
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm test
      
  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: cd ios && pod install
      - run: npx react-native run-ios --configuration Release
      
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'
      - run: npm install
      - run: cd android && ./gradlew assembleRelease
```

### Environment Configuration

Create different .env files:
- `.env.development`
- `.env.staging`
- `.env.production`

Use during build:
```bash
ENVFILE=.env.production npm run build:android
```

---

## Next Steps

1. Review [ROADMAP.md](ROADMAP.md) for development phases
2. Set up your development environment
3. Start with Phase 1 implementation
4. Follow the testing strategy for each module
5. Deploy to TestFlight/Internal Testing for initial feedback

## Support

For questions or issues, contact:
- Technical Lead: tech@inadeafrica.com
- Documentation: https://docs.inadeafrica.com
