import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/auth/LoginScreen';
import { AuthStackParamList } from '../types/navigation';

const Stack = createStackNavigator<AuthStackParamList>();

/**
 * Auth Navigator
 * Handles authentication flow screens
 */
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
