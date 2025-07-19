# WebRTC Setup for React Native

This document explains the WebRTC setup for the Swooche mobile app to support Twilio Voice calls.

## Problem

The Twilio Voice SDK is designed for web browsers and expects Web APIs like `getUserMedia` and `navigator.mediaDevices` to be available. In React Native, these APIs don't exist by default, causing the error:

```
NotSupportedError: getUserMedia is not supported
```

## Solution

We've implemented a comprehensive polyfill system that provides the necessary Web APIs for React Native.

### 1. Dependencies Added

- `react-native-webrtc`: Provides WebRTC functionality for React Native
- `expo-av`: Provides audio/video capabilities and permissions

### 2. Polyfills Implemented

#### WebRTC Polyfill (`src/utils/webrtc-polyfill.ts`)

This file provides polyfills for:

- `navigator.mediaDevices.getUserMedia`
- `navigator.mediaDevices.enumerateDevices`
- `RTCPeerConnection`
- `MediaStream`
- `MediaStreamTrack`
- `RTCSessionDescription`
- `RTCIceCandidate`

#### Type Definitions (`src/types/webrtc.d.ts`)

Provides TypeScript definitions for all WebRTC interfaces to ensure type safety.

### 3. Audio Permissions

The app now properly requests audio permissions using `expo-av`:

```typescript
const { status } = await Audio.requestPermissionsAsync();
if (status !== "granted") {
  throw new Error("Audio permission not granted");
}
```

### 4. Audio Mode Configuration

Sets up proper audio mode for voice calls:

```typescript
await Audio.setAudioModeAsync({
  allowsRecordingIOS: true,
  playsInSilentModeIOS: true,
  staysActiveInBackground: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
});
```

## App Configuration

### iOS Permissions (`app.json`)

```json
{
  "ios": {
    "infoPlist": {
      "NSMicrophoneUsageDescription": "This app needs access to your microphone to make voice calls.",
      "NSCameraUsageDescription": "This app needs access to your camera for video calls."
    }
  }
}
```

### Android Permissions (`app.json`)

```json
{
  "android": {
    "permissions": ["RECORD_AUDIO", "CAMERA", "MODIFY_AUDIO_SETTINGS"]
  }
}
```

### Expo Plugin Configuration

```json
{
  "plugins": [
    [
      "expo-av",
      {
        "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone for voice calls."
      }
    ]
  ]
}
```

## How It Works

1. **Early Loading**: Polyfills are loaded in `Main.tsx` before any other code
2. **Permission Request**: Audio permissions are requested when starting Twilio Voice
3. **Audio Mode Setup**: Proper audio mode is configured for voice calls
4. **Error Handling**: Specific getUserMedia errors are caught and handled gracefully
5. **Mock Objects**: Mock MediaStream objects are provided to satisfy the Twilio SDK

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure the app has microphone permissions
2. **Audio Not Working**: Check that audio mode is properly configured
3. **Polyfill Errors**: Verify that polyfills are loaded before Twilio SDK

### Debug Information

The app provides extensive console logging:

- `🔧 Setting up WebRTC polyfills for React Native`
- `🎤 Requesting audio permissions via polyfill`
- `✅ Audio permissions granted and mode set via polyfill`
- `📱 Creating Twilio Device with identity: [identity]`
- `🟢 Twilio.Device registered`

### Testing

To test the setup:

1. Build and run the app
2. Check console logs for polyfill initialization
3. Try starting Twilio Voice device
4. Verify that no getUserMedia errors occur
5. Test incoming call functionality

## Future Enhancements

- Real WebRTC implementation using `react-native-webrtc`
- Video call support
- Background call handling
- Push notification integration
- Call recording functionality

## Notes

- The current implementation uses mock objects for MediaStream
- Real audio handling is managed by the Twilio SDK internally
- This approach provides compatibility while maintaining functionality
- For production, consider implementing full WebRTC support
