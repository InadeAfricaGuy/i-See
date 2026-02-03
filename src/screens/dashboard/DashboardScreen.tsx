import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';

import { theme } from '../../utils/theme';

/**
 * Dashboard Screen
 * Main screen showing system overview and real-time data
 */
const DashboardScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>System Status</Title>
            <Paragraph>Real-time monitoring dashboard</Paragraph>
            <Text style={styles.placeholder}>Dashboard content will be implemented here</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Solar Production</Title>
            <Paragraph>Current: 0.0 kW</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Battery Status</Title>
            <Paragraph>Charge: 0%</Paragraph>
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

export default DashboardScreen;
