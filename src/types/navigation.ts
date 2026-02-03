/**
 * Type definitions for navigation props
 */

import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;

// Main Tab
export type MainTabParamList = {
  Dashboard: undefined;
  Monitoring: undefined;
  Analytics: undefined;
  Settings: undefined;
};

export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

// Screen props type helpers
export type ScreenNavigationProp<T extends keyof MainTabParamList> = {
  navigation: BottomTabNavigationProp<MainTabParamList, T>;
  route: RouteProp<MainTabParamList, T>;
};
