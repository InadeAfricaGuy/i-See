import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';

import { theme } from '../../utils/theme';

/**
 * Analytics Screen
 * Historical data and analytics
 */
const AnalyticsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Analytics</Title>
            <Text style={styles.placeholder}>Analytics content will be implemented here</Text>
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

export default AnalyticsScreen;
