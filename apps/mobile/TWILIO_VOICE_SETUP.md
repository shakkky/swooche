# Twilio Voice Integration for Mobile App

This document explains how the Twilio Voice integration works in the Swooche mobile app.

## Overview

The mobile app now includes a complete authentication flow with automatic Twilio Voice registration:

1. **Login Screen**: Users must log in first
2. **Automatic Registration**: Twilio Voice device starts automatically after login
3. **Connection Status**: Shows connection status and provides manual connect option
4. **Call Handling**: Full incoming call management

## Authentication Flow

### 1. Login Process

- Users start at the login screen
- Simple demo login button (replace with real authentication)
- After successful login, user is redirected to home screen

### 2. Automatic Twilio Voice Registration

- Twilio Voice device starts automatically after login
- No manual intervention required
- Device registers with Twilio and reports agent status

### 3. Connection Status Management

- **Connected**: Shows green status when ready to receive calls
- **Not Connected**: Shows red status with "Connect" button for manual connection
- **Error Handling**: Displays any connection errors

## Components

### 1. AuthContext (`src/contexts/AuthContext.tsx`)

Manages authentication state and automatically starts Twilio Voice:

- **Login State**: Tracks if user is logged in
- **Auto-start**: Automatically starts Twilio Voice after login
- **Logout**: Handles user logout

### 2. TwilioVoiceContext (`src/contexts/TwilioVoiceContext.tsx`)

Global context that manages the Twilio Voice device:

- **State Management**: Tracks device status, call state, errors, etc.
- **Device Registration**: Automatically registers the device with Twilio
- **Call Handling**: Manages incoming calls and call lifecycle
- **Status Reporting**: Reports agent status to the server

### 3. Login Screen (`app/login.tsx`)

First screen users see:

- Simple login interface
- Demo login button (replace with real authentication)
- Consistent branding with the app

### 4. Home Screen (`src/templates/Home.tsx`)

Main app interface with:

- **Connection Status**: Shows if Twilio Voice is ready
- **Manual Connect**: Button to manually connect if needed
- **Call Management**: Incoming call handling and active call controls
- **Recent Activity**: List of recent calls and messages
- **Logout**: Available in settings tab

## How It Works

### 1. App Startup

1. App checks authentication status
2. If not logged in → redirects to login screen
3. If logged in → redirects to home screen

### 2. Login Process

1. User taps "Login" button
2. Auth context processes login (simulated)
3. User is redirected to home screen
4. Twilio Voice device starts automatically

### 3. Twilio Voice Registration

1. Device fetches token from server (`/token` endpoint)
2. Creates Twilio Device instance with token
3. Registers device with Twilio
4. Reports agent status as "ready" to server

### 4. Connection Status

- **Ready**: Green status when device is registered and ready
- **Not Ready**: Red status with connect button for manual connection
- **Error**: Shows error message and connect button

### 5. Incoming Calls

1. When call comes in, Twilio triggers "incoming" event
2. App shows native alert with accept/reject options
3. User can accept or reject the call
4. If accepted, call becomes active and status reported as "in-call"

### 6. Active Calls

1. During active calls, app tracks call duration
2. User can end call using "End Call" button
3. When call ends, status reported back to "ready"

## Usage Instructions

1. **Start the App**: Launch the mobile app
2. **Login**: Tap "Login" on the login screen
3. **Wait for Auto-connection**: Twilio Voice will start automatically
4. **Check Status**: Verify green "Ready to receive calls" status
5. **Manual Connect**: If not connected, tap "Connect" button
6. **Receive Calls**: When calls come in, use accept/reject buttons
7. **End Calls**: Use "End Call" button during active calls
8. **Logout**: Go to Settings tab and tap "Logout"

## Configuration

### Server URL

The app uses different server URLs for development and production:

```typescript
const SERVER_URL = __DEV__
  ? "http://192.168.8.131:3001" // Development
  : "https://api.swooche.com"; // Production
```

### Required Endpoints

The server must provide these endpoints:

1. `GET /token` - Returns Twilio token and agent identity
2. `POST /agent/status` - Receives agent status updates

## Troubleshooting

### Common Issues

1. **Login fails**: Check authentication implementation
2. **Auto-connection fails**: Check server connectivity and token endpoint
3. **Manual connection needed**: Tap "Connect" button on home screen
4. **No incoming calls**: Verify device is registered and status is "ready"
5. **Call audio issues**: Ensure microphone permissions are granted
6. **Network errors**: Check internet connection and server URL configuration

### Debug Information

The app provides extensive console logging for debugging:

- Authentication status
- Device registration status
- Incoming call events
- Call state changes
- Error messages
- Status reporting

## Dependencies

- `@twilio/voice-sdk`: Twilio Voice SDK for React Native
- `expo-notifications`: For push notification support (future use)
- `expo-device`: For device information
- `expo-router`: For navigation and routing

## Future Enhancements

- Real authentication with credentials
- Persistent login state with secure storage
- Push notification support to wake up the app for incoming calls
- Background call handling
- Call recording functionality
- Advanced call controls (mute, hold, transfer)
- Call history and analytics
