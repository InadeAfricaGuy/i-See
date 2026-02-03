import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';

import { theme } from '../../utils/theme';

/**
 * Monitoring Screen
 * Detailed device monitoring and metrics
 */
const MonitoringScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Device Monitoring</Title>
            <Text style={styles.placeholder}>Device monitoring content will be implemented here</Text>
          </Card.Content>
        </Card>
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
  placeholder: {
    marginTop: 16,
    fontStyle: 'italic',
    color: theme.colors.placeholder,
  },
});

export default MonitoringScreen;
