# API Design Specification

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
4. [Real-time Communication](#real-time-communication)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

## Overview

### Base URL
```
Production: https://api.inadeafrica.com/v1
Staging: https://staging-api.inadeafrica.com/v1
Development: http://localhost:3000/v1
```

### API Versioning
- Version is included in the URL path (`/v1`)
- Breaking changes require a new version
- Deprecated versions supported for 6 months

### Request/Response Format
- Content-Type: `application/json`
- Character Encoding: `UTF-8`
- Date Format: ISO 8601 (`2024-01-15T10:30:00Z`)

## Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "client"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK)**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {accessToken}
```

**Response (204 No Content)**

## Endpoints

### Users

#### Get Current User
```http
GET /users/me
Authorization: Bearer {accessToken}
```

**Response (200 OK)**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "role": "client",
  "installations": ["inst_001", "inst_002"],
  "preferences": {
    "notifications": true,
    "emailAlerts": true,
    "units": "metric",
    "language": "en",
    "theme": "auto"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Update User Profile
```http
PATCH /users/me
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+1234567890"
}
```

**Response (200 OK)**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+1234567890",
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

### Installations

#### List Installations
```http
GET /installations
Authorization: Bearer {accessToken}
```

**Query Parameters**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status (active, inactive, maintenance)

**Response (200 OK)**
```json
{
  "data": [
    {
      "id": "inst_001",
      "name": "Main Office Solar",
      "location": {
        "address": "123 Business Rd",
        "city": "Lagos",
        "country": "Nigeria",
        "coordinates": {
          "latitude": 6.5244,
          "longitude": 3.3792
        }
      },
      "owner": "user_123",
      "sharedWith": [],
      "status": "active",
      "capacity": {
        "solar": 50.0,
        "battery": 100.0,
        "inverter": 40.0
      },
      "installedDate": "2023-06-15T00:00:00Z",
      "lastUpdate": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 2,
    "totalPages": 1
  }
}
```

#### Get Installation Details
```http
GET /installations/{installationId}
Authorization: Bearer {accessToken}
```

**Response (200 OK)**
```json
{
  "id": "inst_001",
  "name": "Main Office Solar",
  "location": {
    "address": "123 Business Rd",
    "city": "Lagos",
    "country": "Nigeria",
    "coordinates": {
      "latitude": 6.5244,
      "longitude": 3.3792
    }
  },
  "owner": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "sharedWith": [
    {
      "userId": "user_456",
      "email": "tech@example.com",
      "role": "viewer",
      "sharedAt": "2024-01-10T00:00:00Z"
    }
  ],
  "devices": [
    {
      "id": "dev_inv_001",
      "type": "inverter",
      "manufacturer": "SolarEdge",
      "model": "SE10000H",
      "serialNumber": "7E123456",
      "status": {
        "online": true,
        "operational": true,
        "errors": [],
        "warnings": []
      },
      "lastSeen": "2024-01-15T10:30:00Z"
    },
    {
      "id": "dev_bat_001",
      "type": "battery",
      "manufacturer": "Tesla",
      "model": "Powerwall 2",
      "serialNumber": "TG123456789",
      "status": {
        "online": true,
        "operational": true,
        "errors": [],
        "warnings": ["Temperature slightly elevated"]
      },
      "lastSeen": "2024-01-15T10:30:00Z"
    }
  ],
  "capacity": {
    "solar": 50.0,
    "battery": 100.0,
    "inverter": 40.0
  },
  "installedDate": "2023-06-15T00:00:00Z",
  "status": "active"
}
```

### Devices

#### Get Device Real-time Data
```http
GET /devices/{deviceId}/realtime
Authorization: Bearer {accessToken}
```

**Response (200 OK) - Inverter**
```json
{
  "deviceId": "dev_inv_001",
  "type": "inverter",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "power": {
      "dc": 38.5,
      "ac": 37.2
    },
    "voltage": {
      "dc": 380.5,
      "ac": 230.2
    },
    "current": {
      "dc": 101.3,
      "ac": 161.7
    },
    "frequency": 50.02,
    "temperature": 45.3,
    "efficiency": 96.6
  }
}
```

**Response (200 OK) - Battery**
```json
{
  "deviceId": "dev_bat_001",
  "type": "battery",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "stateOfCharge": 85.5,
    "voltage": 52.3,
    "current": -12.5,
    "power": -6.5,
    "temperature": 28.4,
    "health": 98.2,
    "cycleCount": 245,
    "estimatedRuntime": 8.5
  }
}
```

#### Get Historical Data
```http
GET /devices/{deviceId}/history
Authorization: Bearer {accessToken}
```

**Query Parameters**
- `startDate` (required): ISO 8601 date
- `endDate` (required): ISO 8601 date
- `interval` (optional): `1m`, `5m`, `15m`, `1h`, `1d` (default: `15m`)
- `metrics` (optional): Comma-separated list of metrics

**Response (200 OK)**
```json
{
  "deviceId": "dev_inv_001",
  "interval": "15m",
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-15T23:59:59Z",
  "data": [
    {
      "timestamp": "2024-01-15T00:00:00Z",
      "power": {
        "dc": 0.0,
        "ac": 0.0
      },
      "temperature": 22.1
    },
    {
      "timestamp": "2024-01-15T00:15:00Z",
      "power": {
        "dc": 0.0,
        "ac": 0.0
      },
      "temperature": 21.8
    },
    {
      "timestamp": "2024-01-15T06:00:00Z",
      "power": {
        "dc": 12.3,
        "ac": 11.8
      },
      "temperature": 28.5
    }
  ]
}
```

### Analytics

#### Get Energy Metrics
```http
GET /installations/{installationId}/metrics
Authorization: Bearer {accessToken}
```

**Query Parameters**
- `period` (required): `today`, `week`, `month`, `year`, `custom`
- `startDate` (optional): Required if period is `custom`
- `endDate` (optional): Required if period is `custom`

**Response (200 OK)**
```json
{
  "installationId": "inst_001",
  "period": "today",
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-15T23:59:59Z",
  "summary": {
    "production": {
      "solar": 45.2
    },
    "consumption": {
      "total": 38.7,
      "grid": 2.1,
      "battery": 36.6
    },
    "gridExport": 6.5,
    "selfConsumption": 85.7,
    "savings": {
      "cost": 12.50,
      "currency": "NGN",
      "co2": 22.6
    }
  },
  "hourly": [
    {
      "hour": "2024-01-15T00:00:00Z",
      "production": 0.0,
      "consumption": 1.2,
      "gridImport": 0.0,
      "gridExport": 0.0
    },
    {
      "hour": "2024-01-15T06:00:00Z",
      "production": 2.5,
      "consumption": 1.8,
      "gridImport": 0.0,
      "gridExport": 0.7
    }
  ]
}
```

### Alerts

#### List Alerts
```http
GET /installations/{installationId}/alerts
Authorization: Bearer {accessToken}
```

**Query Parameters**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): `unread`, `read`, `acknowledged`
- `severity` (optional): `critical`, `warning`, `info`
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Response (200 OK)**
```json
{
  "data": [
    {
      "id": "alert_001",
      "installationId": "inst_001",
      "deviceId": "dev_bat_001",
      "type": "battery_low",
      "severity": "warning",
      "title": "Battery Low",
      "message": "Battery charge level is below 20%",
      "timestamp": "2024-01-15T08:30:00Z",
      "status": "unread",
      "data": {
        "currentCharge": 18.5,
        "threshold": 20.0
      }
    },
    {
      "id": "alert_002",
      "installationId": "inst_001",
      "deviceId": "dev_inv_001",
      "type": "inverter_fault",
      "severity": "critical",
      "title": "Inverter Fault",
      "message": "Inverter has detected a fault condition",
      "timestamp": "2024-01-14T15:45:00Z",
      "status": "acknowledged",
      "acknowledgedAt": "2024-01-14T16:00:00Z",
      "acknowledgedBy": "user_123",
      "data": {
        "errorCode": "E042",
        "errorDescription": "DC overvoltage"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 15,
    "totalPages": 1
  }
}
```

#### Acknowledge Alert
```http
POST /alerts/{alertId}/acknowledge
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "notes": "Checked on-site, issue resolved"
}
```

**Response (200 OK)**
```json
{
  "id": "alert_002",
  "status": "acknowledged",
  "acknowledgedAt": "2024-01-15T10:35:00Z",
  "acknowledgedBy": "user_123",
  "notes": "Checked on-site, issue resolved"
}
```

## Real-time Communication

### MQTT Topics

#### Subscribe to Installation Updates
```
Topic: installations/{installationId}/realtime
```

**Message Format**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "solar": {
    "power": 38.5,
    "voltage": 380.5,
    "current": 101.3,
    "status": "operational"
  },
  "battery": {
    "charge": 85.5,
    "power": -6.5,
    "current": -12.5,
    "status": "discharging"
  },
  "inverter": {
    "powerAC": 37.2,
    "powerDC": 38.5,
    "status": "operational"
  },
  "grid": {
    "power": 0.0,
    "importing": false,
    "exporting": false
  }
}
```

#### Subscribe to Alerts
```
Topic: installations/{installationId}/alerts
```

**Message Format**
```json
{
  "id": "alert_003",
  "type": "battery_low",
  "severity": "warning",
  "title": "Battery Low",
  "message": "Battery charge level is below 20%",
  "timestamp": "2024-01-15T10:30:00Z",
  "deviceId": "dev_bat_001",
  "data": {
    "currentCharge": 18.5
  }
}
```

### WebSocket Alternative
```
wss://api.inadeafrica.com/v1/ws?token={accessToken}
```

**Subscribe Message**
```json
{
  "action": "subscribe",
  "channel": "installations/inst_001/realtime"
}
```

**Unsubscribe Message**
```json
{
  "action": "unsubscribe",
  "channel": "installations/inst_001/realtime"
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Invalid request parameters |
| 401 | UNAUTHORIZED | Invalid or missing authentication |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource conflict |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |
| 503 | SERVICE_UNAVAILABLE | Service temporarily unavailable |

## Rate Limiting

### Limits
- **Authenticated requests**: 1000 requests per hour per user
- **Unauthenticated requests**: 60 requests per hour per IP
- **Real-time data**: 100 requests per minute per installation

### Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1610712000
```

### Rate Limit Exceeded Response
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 3600

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again in 3600 seconds.",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Pagination

### Request
```http
GET /installations?page=2&limit=20
```

### Response
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "totalItems": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrevious": true
  }
}
```

## Filtering and Sorting

### Query Parameters
- `sort`: Field to sort by (prefix with `-` for descending)
- `filter[field]`: Filter by field value

### Example
```http
GET /installations?sort=-installedDate&filter[status]=active
```

---

For implementation details, see [IMPLEMENTATION.md](./IMPLEMENTATION.md).
