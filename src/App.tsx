import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store } from './store';
import { theme } from './utils/theme';
import RootNavigator from './navigation/RootNavigator';

/**
 * Main App Component
 * Sets up providers and navigation for the i-See mobile application
 */
const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
              <RootNavigator />
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
