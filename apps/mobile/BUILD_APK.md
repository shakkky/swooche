# Building APK for Swooche Mobile App

This guide explains how to build a downloadable APK file for your Android phone.

## Prerequisites

1. **Expo Account**: You need an Expo account (free at https://expo.dev)
2. **EAS CLI**: Already installed as a dev dependency
3. **Internet Connection**: Required for cloud builds

## Build Options

### Option 1: Preview Build (Recommended for testing)

```bash
pnpm build:apk
```

This creates a preview APK that's perfect for testing on your phone.

### Option 2: Development Build

```bash
pnpm build:apk-dev
```

This creates a development build with debugging capabilities.

### Option 3: Production Build

```bash
pnpm build:apk-prod
```

This creates a production-ready APK.

## Step-by-Step Process

### 1. Login to Expo (if not already logged in)

```bash
npx eas login
```

### 2. Configure the build (first time only)

```bash
npx eas build:configure
```

### 3. Build the APK

```bash
# For testing on your phone (recommended)
pnpm build:apk

# Or use the full command
npx eas build --platform android --profile preview
```

### 4. Download the APK

- The build will take 5-10 minutes
- You'll get a download link when it's complete
- Click the link to download the APK file

### 5. Install on your phone

- Transfer the APK to your Android phone
- Enable "Install from unknown sources" in your phone settings
- Tap the APK file to install

## Build Configuration

The build is configured in `eas.json` with these profiles:

- **preview**: Internal distribution, APK format, good for testing
- **development**: Development client, APK format, includes debugging
- **production**: Production build, APK format, optimized

## Troubleshooting

### Common Issues

1. **Build fails**: Check your internet connection and Expo account
2. **APK won't install**: Make sure "Install from unknown sources" is enabled
3. **App crashes**: Check the console logs for errors

### Build Logs

You can monitor build progress at: https://expo.dev/accounts/[your-username]/projects/swooche/builds

## Alternative: Local Build

If you prefer to build locally (requires Android Studio):

```bash
# Install dependencies
pnpm install

# Build locally
pnpm android
```

## Notes

- Cloud builds are free for Expo accounts
- APK files are typically 20-50MB
- Build time varies based on server load
- You can share the APK with others for testing

## Next Steps

After installing the APK:

1. Test the login functionality
2. Verify Twilio Voice connection
3. Test incoming calls
4. Check that WebRTC polyfills work correctly
