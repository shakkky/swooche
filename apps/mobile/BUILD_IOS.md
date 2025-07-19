# Building iOS App for Swooche Mobile

This guide explains how to build and install the app on Apple devices (iPhone/iPad).

## 🍎 **iOS Build Options**

### **Option 1: iOS Simulator (Free, Mac Only)**

Test on your Mac's iOS Simulator - no Apple Developer account needed.

```bash
# Install dependencies and run in simulator
pnpm ios
```

### **Option 2: Development Build (.ipa file)**

Install on your iPhone via Xcode - requires Apple Developer account ($99/year).

```bash
# Build development .ipa
pnpm build:ios-dev
```

### **Option 3: Preview Build (.ipa file)**

Create a preview build for testing - requires Apple Developer account.

```bash
# Build preview .ipa
pnpm build:ios
```

### **Option 4: Production Build**

Create production build for App Store - requires Apple Developer account.

```bash
# Build production .ipa
pnpm build:ios-prod
```

## 📋 **Requirements by Option**

### **iOS Simulator (Free)**

- ✅ Mac computer
- ✅ Xcode installed
- ✅ No Apple Developer account needed

### **Real Device (.ipa files)**

- ✅ Mac computer
- ✅ Xcode installed
- ✅ Apple Developer account ($99/year)
- ✅ iPhone/iPad for testing

## 🚀 **Step-by-Step Instructions**

### **For iOS Simulator (Recommended for testing)**

1. **Install Xcode** (if not already installed)

   - Download from Mac App Store
   - Install iOS Simulator

2. **Run in Simulator**

   ```bash
   pnpm ios
   ```

3. **Test the app**
   - Simulator will open automatically
   - Test login, Twilio Voice, and calls

### **For Real iPhone/iPad**

1. **Get Apple Developer Account**

   - Sign up at https://developer.apple.com
   - $99/year subscription required

2. **Configure EAS Build**

   ```bash
   npx eas build:configure
   ```

3. **Login to Expo**

   ```bash
   npx eas login
   ```

4. **Build for iOS**

   ```bash
   # For testing on your device
   pnpm build:ios-dev

   # For preview/testing
   pnpm build:ios
   ```

5. **Install on Device**
   - Download the .ipa file when build completes
   - Install via Xcode or TestFlight

## 🔧 **Installation Methods**

### **Method 1: Xcode Installation**

1. Download the .ipa file
2. Open Xcode
3. Connect your iPhone/iPad
4. Drag .ipa to Xcode
5. Install on device

### **Method 2: TestFlight (Recommended)**

1. Build with `pnpm build:ios-prod`
2. Submit to App Store Connect
3. Add testers via TestFlight
4. Testers install via TestFlight app

### **Method 3: Ad Hoc Distribution**

1. Register device UDIDs in Apple Developer portal
2. Build with device-specific provisioning
3. Install via iTunes or Xcode

## 📱 **Device Registration**

For real device testing, you need to register your device:

1. **Get Device UDID**

   - Connect device to Mac
   - Open Xcode → Window → Devices and Simulators
   - Copy the UDID

2. **Add to Apple Developer Portal**

   - Go to https://developer.apple.com/account
   - Devices → Register Device
   - Add your device UDID

3. **Update EAS Configuration**
   ```bash
   npx eas device:create
   ```

## 🛠 **Troubleshooting**

### **Common Issues**

1. **Build fails**: Check Apple Developer account status
2. **Installation fails**: Verify device is registered
3. **App crashes**: Check console logs in Xcode
4. **Provisioning errors**: Update certificates in Apple Developer portal

### **Xcode Issues**

1. **Simulator not working**: Reset simulator (Device → Erase All Content and Settings)
2. **Build errors**: Clean build folder (Product → Clean Build Folder)
3. **Device not recognized**: Check USB cable and trust settings

## 💰 **Cost Breakdown**

- **iOS Simulator**: Free
- **Development Build**: $99/year (Apple Developer account)
- **TestFlight Distribution**: $99/year (Apple Developer account)
- **App Store Distribution**: $99/year (Apple Developer account)

## 🎯 **Recommended Approach**

### **For Development/Testing**

1. Use iOS Simulator (free)
2. Test core functionality
3. Debug issues

### **For Real Device Testing**

1. Get Apple Developer account
2. Use TestFlight for distribution
3. Test on multiple devices

### **For Production**

1. Build production .ipa
2. Submit to App Store
3. Distribute via App Store

## 📋 **Next Steps**

After building for iOS:

1. Test login functionality
2. Verify Twilio Voice connection
3. Test incoming calls
4. Check WebRTC polyfills work
5. Test on different iOS versions

## 🔗 **Useful Links**

- [Apple Developer Program](https://developer.apple.com/programs/)
- [TestFlight](https://developer.apple.com/testflight/)
- [Xcode Download](https://developer.apple.com/xcode/)
- [iOS Simulator Guide](https://developer.apple.com/library/archive/documentation/IDEs/Conceptual/iOS_Simulator_Guide/)
