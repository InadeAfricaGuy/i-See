import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Text, Title, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '../../store';
import { loginThunk } from '../../store/thunks/authThunks';
import { clearError } from '../../store/slices/authSlice';
import { theme } from '../../utils/theme';

/**
 * Login Screen
 * Handles user authentication
 */
const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isLoading, error } = useAppSelector(state => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Clear any previous errors when component mounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

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

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    // Clear previous errors
    dispatch(clearError());
    
    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Dispatch login thunk
    await dispatch(loginThunk({ email, password }));
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword' as never);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>i-See</Title>
        <Text style={styles.subtitle}>Monitor your solar installation</Text>

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

        <TextInput
          label="Password"
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (passwordError) validatePassword(text);
          }}
          onBlur={() => validatePassword(password)}
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

        {error ? (
          <HelperText type="error" visible={!!error} style={styles.errorText}>
            {error}
          </HelperText>
        ) : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}>
          Login
        </Button>

        <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
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
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
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
  forgotPassword: {
    marginTop: 16,
    textAlign: 'center',
    color: theme.colors.primary,
    fontSize: 14,
  },
  errorText: {
    textAlign: 'center',
  },
});

export default LoginScreen;
