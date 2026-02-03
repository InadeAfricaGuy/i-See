import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, List, Button } from 'react-native-paper';

import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { theme } from '../../utils/theme';

/**
 * Settings Screen
 * User preferences and app settings
 */
const SettingsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>User Profile</Title>
            {user && (
              <>
                <Text>Name: {user.firstName} {user.lastName}</Text>
                <Text>Email: {user.email}</Text>
                <Text>Role: {user.role}</Text>
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Preferences</Title>
            <List.Item title="Notifications" left={() => <List.Icon icon="bell" />} />
            <List.Item title="Theme" left={() => <List.Icon icon="palette" />} />
            <List.Item title="Language" left={() => <List.Icon icon="translate" />} />
          </Card.Content>
        </Card>

        <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 16,
  },
});

export default SettingsScreen;
