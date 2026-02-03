# i-See Security Guide

## Table of Contents
1. [Authentication Security](#authentication-security)
2. [Data Security](#data-security)
3. [Network Security](#network-security)
4. [Mobile App Security](#mobile-app-security)
5. [API Security](#api-security)
6. [Compliance](#compliance)
7. [Security Checklist](#security-checklist)

## Authentication Security

### JWT Token Management

#### Token Storage
```typescript
// GOOD - Use secure storage
import * as Keychain from 'react-native-keychain';

async function saveTokens(accessToken: string, refreshToken: string) {
  await Keychain.setGenericPassword(
    'tokens',
    JSON.stringify({ accessToken, refreshToken }),
    {
      service: 'i-see-tokens',
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
    }
  );
}

// BAD - Don't use AsyncStorage for tokens
// AsyncStorage.setItem('token', token); // ❌ Not secure
```

#### Token Lifecycle
- **Access Token**: 15 minutes expiry
- **Refresh Token**: 7 days expiry
- Automatic token refresh before expiry
- Revoke tokens on logout
- Invalidate all tokens on password change

### Password Security

```typescript
// Password Requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

// Password validation
function validatePassword(password: string): boolean {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= 8 && 
         hasUpperCase && 
         hasLowerCase && 
         hasNumbers && 
         hasSpecialChar;
}
```

### Biometric Authentication

```typescript
import ReactNativeBiometrics from 'react-native-biometrics';

async function authenticateWithBiometrics(): Promise<boolean> {
  const rnBiometrics = new ReactNativeBiometrics();
  
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    
    if (!available) {
      return false;
    }
    
    const { success } = await rnBiometrics.simplePrompt({
      promptMessage: 'Confirm fingerprint',
    });
    
    return success;
  } catch (error) {
    console.error('Biometric auth failed:', error);
    return false;
  }
}
```

## Data Security

### Encryption at Rest

```typescript
import EncryptedStorage from 'react-native-encrypted-storage';

// Store sensitive data
async function storeSensitiveData(key: string, value: any) {
  try {
    await EncryptedStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.error('Storage error:', error);
  }
}

// Retrieve sensitive data
async function getSensitiveData(key: string) {
  try {
    const value = await EncryptedStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Retrieval error:', error);
    return null;
  }
}
```

### Data Classification

| Classification | Description | Encryption | Access |
|---------------|-------------|------------|--------|
| **Critical** | Authentication tokens, passwords | Required (AES-256) | Admin only |
| **Confidential** | User PII, installation details | Required (AES-256) | User + Admin |
| **Internal** | Device metrics, analytics | Recommended | User + Admin |
| **Public** | App version, public docs | Not required | Everyone |

### Secure Data Deletion

```typescript
async function secureLogout() {
  try {
    // Clear secure storage
    await Keychain.resetGenericPassword({ service: 'i-see-tokens' });
    
    // Clear encrypted storage
    await EncryptedStorage.clear();
    
    // Clear AsyncStorage
    await AsyncStorage.clear();
    
    // Clear cache
    await clearCache();
    
    // Invalidate tokens on server
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
}
```

## Network Security

### TLS/SSL Configuration

```typescript
// GOOD - Enforce HTTPS
const API_BASE_URL = 'https://api.inadeafrica.com';

// BAD - Don't use HTTP
// const API_BASE_URL = 'http://api.inadeafrica.com'; // ❌

// Certificate Pinning
import { RNFetchBlob } from 'react-native-fetch-blob';

const pinnedCertificates = [
  'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
];

// Validate server certificate
async function makeSecureRequest(url: string) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      // Enable certificate validation
      credentials: 'include',
    });
    return response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

### API Request Security

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': APP_VERSION,
    'X-Platform': Platform.OS,
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle token expiry
    if (error.response?.status === 401) {
      await handleUnauthorized();
    }
    return Promise.reject(error);
  }
);
```

### MQTT Security

```typescript
import mqtt from 'mqtt';

const mqttOptions = {
  clientId: `i-see-${userId}-${deviceId}`,
  username: 'app',
  password: accessToken,
  clean: true,
  
  // Use WSS (WebSocket Secure)
  protocol: 'wss',
  
  // TLS options
  rejectUnauthorized: true,
  
  // Reconnection settings
  reconnectPeriod: 5000,
  connectTimeout: 30000,
  
  // Keep alive
  keepalive: 60,
};

const client = mqtt.connect(MQTT_BROKER_URL, mqttOptions);

// Validate incoming messages
client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    
    // Validate message structure
    if (!isValidMessage(data)) {
      console.warn('Invalid message received:', topic);
      return;
    }
    
    // Process message
    handleMessage(topic, data);
  } catch (error) {
    console.error('Message processing error:', error);
  }
});
```

## Mobile App Security

### Code Obfuscation

#### Android ProGuard Configuration
```proguard
# app/proguard-rules.pro

# Keep application classes
-keep class com.isee.** { *; }

# Keep React Native
-keep class com.facebook.react.** { *; }

# Obfuscate everything else
-repackageclasses
-allowaccessmodification

# Remove logging in production
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
```

#### iOS Configuration
```xml
<!-- Enable bitcode -->
<key>ENABLE_BITCODE</key>
<string>YES</string>

<!-- Strip debug symbols -->
<key>STRIP_INSTALLED_PRODUCT</key>
<string>YES</string>
```

### Root/Jailbreak Detection

```typescript
import JailMonkey from 'jail-monkey';

function checkDeviceSecurity(): SecurityCheck {
  const isJailBroken = JailMonkey.isJailBroken();
  const canMockLocation = JailMonkey.canMockLocation();
  const isDebugged = JailMonkey.isDebugged();
  
  return {
    isSecure: !isJailBroken && !canMockLocation && !isDebugged,
    issues: {
      jailbroken: isJailBroken,
      mockLocation: canMockLocation,
      debugged: isDebugged,
    },
  };
}

// Show warning (don't block access)
if (!checkDeviceSecurity().isSecure) {
  Alert.alert(
    'Security Warning',
    'Your device may be rooted/jailbroken. This could compromise app security.',
    [{ text: 'I Understand', style: 'default' }]
  );
}
```

### Input Validation

```typescript
// Sanitize user input
import DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(input: string): string {
  // Remove HTML tags
  const clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  
  // Trim whitespace
  return clean.trim();
}

// Validate email
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Prevent SQL injection (use parameterized queries)
// BAD
// const query = `SELECT * FROM users WHERE email = '${email}'`; // ❌

// GOOD
const query = 'SELECT * FROM users WHERE email = ?';
const params = [email];
```

### Secure Logging

```typescript
// Custom logger that redacts sensitive data
class SecureLogger {
  private static SENSITIVE_FIELDS = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'apiKey',
    'secret',
  ];
  
  static log(message: string, data?: any) {
    if (__DEV__) {
      const sanitized = this.sanitizeData(data);
      console.log(message, sanitized);
    }
  }
  
  static error(message: string, error?: any) {
    // Always log errors (even in production)
    const sanitized = this.sanitizeData(error);
    console.error(message, sanitized);
    
    // Send to crash reporting
    Crashlytics.recordError(new Error(message));
  }
  
  private static sanitizeData(data: any): any {
    if (!data) return data;
    
    const sanitized = { ...data };
    this.SENSITIVE_FIELDS.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
}

// Usage
SecureLogger.log('User data:', { email: 'user@example.com', password: '123' });
// Output: User data: { email: 'user@example.com', password: '[REDACTED]' }
```

## API Security

### Rate Limiting

```typescript
// Implement client-side rate limiting
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private window: number; // in milliseconds
  
  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.window = windowMs;
  }
  
  async checkLimit(key: string): Promise<boolean> {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.window);
    
    if (validRequests.length >= this.limit) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

const rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

// Before making API call
if (!await rateLimiter.checkLimit('api-calls')) {
  throw new Error('Rate limit exceeded. Please try again later.');
}
```

### API Key Protection

```typescript
// NEVER hardcode API keys
// BAD
// const API_KEY = 'abc123xyz'; // ❌

// GOOD - Use environment variables
import { API_KEY } from '@env';

// Additional protection: Use a proxy for sensitive keys
async function callProtectedEndpoint() {
  // Instead of sending API key from mobile app,
  // use user's access token which is validated on backend
  const response = await apiClient.get('/protected-resource', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // Backend adds API key when calling third-party services
    },
  });
  return response.data;
}
```

## Compliance

### GDPR Compliance

```typescript
// Data collection consent
interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  essential: boolean; // Always true
}

async function updateConsent(preferences: ConsentPreferences) {
  await apiClient.post('/users/me/consent', preferences);
  
  // Update analytics based on consent
  if (preferences.analytics) {
    Analytics.setAnalyticsCollectionEnabled(true);
  } else {
    Analytics.setAnalyticsCollectionEnabled(false);
  }
}

// Right to deletion
async function deleteUserAccount() {
  Alert.alert(
    'Delete Account',
    'This will permanently delete all your data. This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await apiClient.delete('/users/me');
          await secureLogout();
        },
      },
    ]
  );
}

// Data export
async function exportUserData() {
  const data = await apiClient.get('/users/me/export');
  // Provide data in machine-readable format (JSON)
  await Share.share({
    message: JSON.stringify(data, null, 2),
    title: 'My i-See Data',
  });
}
```

### Privacy Policy

Users must accept privacy policy before using the app:

```typescript
async function showPrivacyPolicyConsent() {
  const hasAccepted = await AsyncStorage.getItem('privacy-policy-accepted');
  
  if (!hasAccepted) {
    // Show privacy policy modal
    const accepted = await showPrivacyPolicyModal();
    
    if (accepted) {
      await AsyncStorage.setItem('privacy-policy-accepted', 'true');
      await apiClient.post('/users/me/accept-privacy-policy');
    } else {
      // User must accept to continue
      Alert.alert(
        'Privacy Policy Required',
        'You must accept the privacy policy to use this app.',
        [{ text: 'OK', onPress: () => showPrivacyPolicyConsent() }]
      );
    }
  }
}
```

## Security Checklist

### Before Each Release

- [ ] **Authentication**
  - [ ] Tokens stored securely (Keychain/Keystore)
  - [ ] Token expiry implemented
  - [ ] Automatic token refresh working
  - [ ] Logout clears all sensitive data
  
- [ ] **Data Protection**
  - [ ] Sensitive data encrypted at rest
  - [ ] No sensitive data in logs
  - [ ] Secure data deletion implemented
  - [ ] Input validation on all forms
  
- [ ] **Network Security**
  - [ ] All API calls use HTTPS
  - [ ] Certificate pinning enabled (optional but recommended)
  - [ ] Request timeouts configured
  - [ ] Error handling doesn't leak sensitive info
  
- [ ] **Code Security**
  - [ ] ProGuard/R8 enabled (Android)
  - [ ] Code obfuscation enabled
  - [ ] Debug logs removed in production
  - [ ] No hardcoded secrets or API keys
  
- [ ] **App Security**
  - [ ] Root/jailbreak detection implemented
  - [ ] Screenshot protection for sensitive screens
  - [ ] Clipboard cleared for sensitive data
  - [ ] Deep link validation
  
- [ ] **Compliance**
  - [ ] Privacy policy displayed and accepted
  - [ ] Data collection consent obtained
  - [ ] User can export their data
  - [ ] User can delete their account
  
- [ ] **Testing**
  - [ ] Security testing performed
  - [ ] Penetration testing done
  - [ ] Vulnerability scanning completed
  - [ ] Dependencies updated to latest secure versions

### Security Monitoring

```typescript
// Track security events
function logSecurityEvent(event: string, details?: any) {
  Analytics.logEvent('security_event', {
    event_type: event,
    timestamp: new Date().toISOString(),
    ...details,
  });
  
  // For critical events, send immediate alert
  if (isCriticalEvent(event)) {
    Crashlytics.log(`Security Event: ${event}`);
  }
}

// Examples
logSecurityEvent('unauthorized_access_attempt', { endpoint: '/admin' });
logSecurityEvent('token_refresh_failed');
logSecurityEvent('suspicious_activity', { reason: 'multiple_failed_logins' });
```

## Incident Response

### Security Incident Procedure

1. **Detection**: Monitor for unusual activity
2. **Analysis**: Investigate the scope and impact
3. **Containment**: Limit the damage
4. **Eradication**: Remove the threat
5. **Recovery**: Restore normal operations
6. **Lessons Learned**: Update security measures

### Emergency Contacts

- **Security Team**: security@inadeafrica.com
- **Development Lead**: tech@inadeafrica.com
- **24/7 Hotline**: [To be configured]

---

## Resources

- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [React Native Security Best Practices](https://reactnative.dev/docs/security)
- [iOS Security Guide](https://www.apple.com/business/docs/site/iOS_Security_Guide.pdf)
- [Android Security Best Practices](https://developer.android.com/topic/security/best-practices)

**Remember: Security is an ongoing process, not a one-time task. Regularly review and update security measures.**
