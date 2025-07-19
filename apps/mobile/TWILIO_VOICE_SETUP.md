# Twilio Voice Integration for Mobile App

This document explains how the Twilio Voice integration works in the Swooche mobile app.

## Overview

The mobile app now includes a global Twilio Voice context that allows the app to:

- Register as an online agent using a Twilio token
- Receive incoming calls
- Accept/reject calls
- Handle active calls with duration tracking
- Report agent status to the server

## Components

### 1. TwilioVoiceContext (`src/contexts/TwilioVoiceContext.tsx`)

This is the main context that manages the Twilio Voice device. It provides:

- **State Management**: Tracks device status, call state, errors, etc.
- **Device Registration**: Automatically registers the device with Twilio
- **Call Handling**: Manages incoming calls and call lifecycle
- **Status Reporting**: Reports agent status to the server

### 2. Welcome Screen (`src/templates/Welcome.tsx`)

Updated to use the Twilio Voice context instead of manually fetching tokens. Features:

- Start the Twilio Voice device
- Display device status and agent identity
- Show any errors that occur
- Display incoming call notifications

### 3. Home Screen (`src/templates/Home.tsx`)

Provides a comprehensive call management interface:

- Real-time device status display
- Incoming call handling with accept/reject buttons
- Active call management with duration tracking
- Call end functionality

## How It Works

### 1. Device Startup

1. User taps "Start Twilio Voice Device" on the Welcome screen
2. App fetches a token from the server (`/token` endpoint)
3. Creates a Twilio Device instance with the token
4. Registers the device with Twilio
5. Reports agent status as "ready" to the server

### 2. Incoming Calls

1. When a call comes in, Twilio triggers the "incoming" event
2. App shows a native alert with accept/reject options
3. User can accept or reject the call
4. If accepted, the call becomes active and status is reported as "in-call"

### 3. Active Calls

1. During active calls, the app tracks call duration
2. User can end the call using the "End Call" button
3. When call ends, status is reported back to "ready"

### 4. Status Reporting

The app automatically reports agent status to the server:

- `ready`: Device is registered and ready for calls
- `in-call`: Agent is currently on a call
- `error`: Device encountered an error
- `offline`: Device is offline

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

## Usage Instructions

1. **Start the App**: Launch the mobile app
2. **Initialize Voice Device**: On the Welcome screen, tap "Start Twilio Voice Device"
3. **Wait for Registration**: The device will register and show "🟢 Started" status
4. **Receive Calls**: When calls come in, you'll see alerts and call controls
5. **Handle Calls**: Use the accept/reject buttons to manage incoming calls
6. **End Calls**: Use the "End Call" button to hang up during active calls

## Troubleshooting

### Common Issues

1. **Device won't start**: Check server connectivity and token endpoint
2. **No incoming calls**: Verify device is registered and status is "ready"
3. **Call audio issues**: Ensure microphone permissions are granted
4. **Network errors**: Check internet connection and server URL configuration

### Debug Information

The app provides extensive console logging for debugging:

- Device registration status
- Incoming call events
- Call state changes
- Error messages
- Status reporting

## Dependencies

- `@twilio/voice-sdk`: Twilio Voice SDK for React Native
- `expo-notifications`: For push notification support (future use)
- `expo-device`: For device information

## Future Enhancements

- Push notification support to wake up the app for incoming calls
- Background call handling
- Call recording functionality
- Advanced call controls (mute, hold, transfer)
- Call history and analytics
