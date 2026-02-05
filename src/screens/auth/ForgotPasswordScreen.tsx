import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '../../store';
import { forgotPasswordThunk } from '../../store/thunks/authThunks';
import { clearError, clearPasswordResetFlags } from '../../store/slices/authSlice';
import { theme } from '../../utils/theme';

/**
 * Forgot Password Screen
 * Allows users to request a password reset email
 */
const ForgotPasswordScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isLoading, error, passwordResetSent } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    // Clear flags when component unmounts
    return () => {
      dispatch(clearPasswordResetFlags());
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    // Navigate back to login after successful password reset request
    if (passwordResetSent) {
      const timer = setTimeout(() => {
        navigation.goBack();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [passwordResetSent, navigation]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async () => {
    dispatch(clearError());

    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      return;
    }

    await dispatch(forgotPasswordThunk(email));
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Reset Password</Title>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        {passwordResetSent ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              ✓ Password reset instructions have been sent to your email address.
            </Text>
            <Text style={styles.successSubtext}>
              Please check your inbox and follow the instructions.
            </Text>
          </View>
        ) : (
          <>
            <TextInput
              label="Email"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (emailError) validateEmail(text);
              }}
              onBlur={() => validateEmail(email)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              error={!!emailError}
              disabled={isLoading}
            />
            {emailError ? (
              <HelperText type="error" visible={!!emailError}>
                {emailError}
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
              Send Reset Instructions
            </Button>

            <Button
              mode="text"
              onPress={handleBackToLogin}
              style={styles.backButton}
              disabled={isLoading}>
              Back to Login
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
    lineHeight: 20,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
  backButton: {
    marginTop: 8,
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

export default ForgotPasswordScreen;
