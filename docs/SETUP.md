# i-See React Native Setup

This document explains the code framework structure that has been set up for the i-See mobile application.

## Framework Overview

The project is built with:
- **React Native 0.73.0** - Cross-platform mobile framework
- **TypeScript 5.3.3** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **React Navigation 6.x** - Navigation system
- **React Native Paper** - Material Design UI components

## Project Structure

```
i-See/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── common/         # Common components (Loading, ErrorDisplay)
│   ├── navigation/         # Navigation configuration
│   │   ├── RootNavigator.tsx     # Root navigation controller
│   │   ├── AuthNavigator.tsx     # Authentication flow
│   │   └── MainNavigator.tsx     # Main app tabs
│   ├── screens/            # Screen components
│   │   ├── auth/          # Authentication screens
│   │   ├── dashboard/     # Dashboard screens
│   │   ├── monitoring/    # Monitoring screens
│   │   ├── analytics/     # Analytics screens
│   │   └── settings/      # Settings screens
│   ├── services/          # API and service layer
│   │   ├── api/          # API client and endpoints
│   │   └── storageService.ts  # Local storage service
│   ├── store/            # Redux state management
│   │   ├── index.ts      # Store configuration
│   │   └── slices/       # Redux slices
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   │   ├── constants.ts  # App constants
│   │   ├── helpers.ts    # Helper functions
│   │   └── theme.ts      # Theme configuration
│   └── App.tsx           # Main app component
├── android/              # Android native code (to be initialized)
├── ios/                  # iOS native code (to be initialized)
├── index.js              # App entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── babel.config.js       # Babel configuration
├── metro.config.js       # Metro bundler configuration
├── jest.config.js        # Jest test configuration
├── .eslintrc.js          # ESLint configuration
└── .prettierrc.js        # Prettier configuration
```

## Key Features Implemented

### 1. Navigation System
- **RootNavigator**: Switches between Auth and Main app based on authentication state
- **AuthNavigator**: Stack navigation for login/registration flows
- **MainNavigator**: Bottom tab navigation for main app features

### 2. State Management (Redux)
Three main slices:
- **authSlice**: User authentication state
- **dashboardSlice**: Dashboard data and real-time metrics
- **devicesSlice**: Installation and device management

### 3. Services Layer
- **apiClient**: Axios-based HTTP client with interceptors
- **authApi**: Authentication API endpoints
- **storageService**: AsyncStorage wrapper for local data persistence

### 4. Screens
Basic placeholder screens for:
- Login
- Dashboard
- Monitoring
- Analytics
- Settings

### 5. Common Components
- **Loading**: Loading spinner with message
- **ErrorDisplay**: Error message with retry button

### 6. Utilities
- **theme**: Material Design theme configuration with InadeAfrica branding
- **constants**: App-wide constants (API URLs, refresh intervals, etc.)
- **helpers**: Utility functions (formatting, validation, debounce, etc.)

## Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- Xcode (for iOS development on macOS)
- Android Studio (for Android development)
- CocoaPods (iOS dependency manager)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install iOS dependencies** (macOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Run the app**:
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android
   ```

### Development Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage

## Code Style

The project follows these conventions:
- **TypeScript** for type safety
- **Functional components** with hooks
- **Arrow functions** for consistency
- **Named exports** for better tree-shaking
- **Path aliases** (@components, @screens, etc.) for cleaner imports

### ESLint & Prettier
- Code is automatically linted and formatted
- Run `npm run lint:fix` to auto-fix issues
- Run `npm run format` to format all files

## Next Steps

To complete the setup and start development:

1. **Initialize native projects**:
   - Run `npx react-native init` to create Android and iOS folders
   - Or manually set up Android and iOS projects

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Connect to backend API**:
   - Update API_BASE_URL in `src/utils/constants.ts`
   - Implement actual authentication in `src/screens/auth/LoginScreen.tsx`

4. **Implement features**:
   - Add real-time data fetching in Dashboard
   - Implement device monitoring
   - Add analytics charts
   - Set up push notifications

5. **Testing**:
   - Write unit tests for components
   - Add integration tests
   - Set up E2E tests with Detox

## Architecture Decisions

### Why Redux Toolkit?
- Type-safe state management
- Built-in best practices (Immer, Redux DevTools)
- Simplified boilerplate compared to vanilla Redux

### Why React Navigation?
- Most popular navigation library for React Native
- Excellent TypeScript support
- Highly customizable

### Why React Native Paper?
- Material Design 3 components
- Excellent theming support
- Well-maintained and documented

## Troubleshooting

### TypeScript Errors
TypeScript compilation will fail until dependencies are installed:
```bash
npm install
```

### Metro Bundler Issues
Clear the cache:
```bash
npm start -- --reset-cache
```

### Build Errors
Clean and rebuild:
```bash
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod install && cd ..
```

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)

## Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
