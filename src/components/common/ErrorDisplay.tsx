import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';
import { theme } from '../../utils/theme';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Error Display component
 * Shows error message with optional retry button
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message = 'Something went wrong',
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Oops!</Title>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button mode="contained" onPress={onRetry} style={styles.button}>
          Try Again
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: theme.colors.error,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.text,
  },
  button: {
    marginTop: 8,
  },
});

export default ErrorDisplay;
