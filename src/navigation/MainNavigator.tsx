import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import MonitoringScreen from '../screens/monitoring/MonitoringScreen';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { theme } from '../utils/theme';

export type MainTabParamList = {
  Dashboard: undefined;
  Monitoring: undefined;
  Analytics: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Main Navigator
 * Bottom tab navigation for authenticated users
 */
const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Monitoring"
        component={MonitoringScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="monitor" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-line" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="cog" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
