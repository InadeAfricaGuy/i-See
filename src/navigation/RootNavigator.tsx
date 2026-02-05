import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAppDispatch, useAppSelector } from '../store';
import { autoLoginThunk } from '../store/thunks/authThunks';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { theme } from '../utils/theme';

const Stack = createStackNavigator();

/**
 * Root Navigator
 * Handles switching between Auth and Main app navigation
 * Also handles auto-login on app start
 */
const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Attempt auto-login on app start
    dispatch(autoLoginThunk());
  }, [dispatch]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});

export default RootNavigator;
