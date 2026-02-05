import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title, HelperText } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '../../store';
import { resetPasswordThunk } from '../../store/thunks/authThunks';
import { clearError, clearPasswordResetFlags } from '../../store/slices/authSlice';
import { theme } from '../../utils/theme';

type ResetPasswordRouteProp = RouteProp<{ params: { token?: string } }, 'params'>;

/**
 * Reset Password Screen
 * Allows users to set a new password using a reset token
 */
const ResetPasswordScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute<ResetPasswordRouteProp>();
  const { isLoading, error, passwordResetSuccess } = useAppSelector(state => state.auth);

  const [token] = useState(route.params?.token || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    // Clear flags when component unmounts
    return () => {
      dispatch(clearPasswordResetFlags());
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    // Navigate to login after successful password reset
    if (passwordResetSuccess) {
      const timer = setTimeout(() => {
        navigation.navigate('Login' as never);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [passwordResetSuccess, navigation]);

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('Password must contain uppercase, lowercase, and number');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirm: string): boolean => {
    if (!confirm) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirm !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSubmit = async () => {
    dispatch(clearError());

    const isPasswordValid = validatePassword(newPassword);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (!isPasswordValid || !isConfirmValid) {
      return;
    }

    await dispatch(resetPasswordThunk({ token, newPassword }));
  };

  if (!token) {
    // Token is required for password reset
    // This UI is shown when the token is missing or invalid from the deep link
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Title style={styles.title}>Invalid Reset Link</Title>
          <Text style={styles.subtitle}>
            This password reset link is invalid or has expired. Please request a new one.
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ForgotPassword' as never)}
            style={styles.button}>
            Request New Link
          </Button>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Set New Password</Title>
        <Text style={styles.subtitle}>Enter your new password below.</Text>

        {passwordResetSuccess ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>✓ Password successfully reset!</Text>
            <Text style={styles.successSubtext}>
              You can now log in with your new password.
            </Text>
          </View>
        ) : (
          <>
            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={text => {
                setNewPassword(text);
                if (passwordError) validatePassword(text);
                if (confirmPassword) validateConfirmPassword(confirmPassword);
              }}
              onBlur={() => validatePassword(newPassword)}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              error={!!passwordError}
              disabled={isLoading}
            />
            {passwordError ? (
              <HelperText type="error" visible={!!passwordError}>
                {passwordError}
              </HelperText>
            ) : null}

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (confirmPasswordError) validateConfirmPassword(text);
              }}
              onBlur={() => validateConfirmPassword(confirmPassword)}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              error={!!confirmPasswordError}
              disabled={isLoading}
            />
            {confirmPasswordError ? (
              <HelperText type="error" visible={!!confirmPasswordError}>
                {confirmPasswordError}
              </HelperText>
            ) : null}

            {error ? (
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}>
              Reset Password
            </Button>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    color: theme.colors.text,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
  errorText: {
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  successText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtext: {
    color: '#2E7D32',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ResetPasswordScreen;
