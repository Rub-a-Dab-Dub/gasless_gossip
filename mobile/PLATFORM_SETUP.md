# Platform Setup (iOS & Android)

Comprehensive platform-specific setup for building and running Whisper on iOS and Android.

## iOS Development Setup

### Prerequisites

- macOS 12.0+ (Monterey) or later
- Xcode 14.0+ with Command Line Tools
- iOS Simulator or physical device
- Apple Developer account (device testing and App Store distribution)

### Xcode Configuration

- Install iOS SDK updates via Xcode Preferences > Components
- Set active toolchain and ensure `xcode-select` points to the correct Xcode app
- Manage simulators in Xcode > Window > Devices and Simulators

### Code Signing and Provisioning

- For device builds, configure a Team in the iOS Runner target
- Create or reuse a development certificate and provisioning profile
- Ensure bundle identifiers are unique per environment

### iOS Permissions and Capabilities

- Keychain access for secure storage
- Network permissions for API/WebSocket traffic
- Optional future features: camera, photo library, push notifications, background refresh

### Build and Deployment

```bash
cd ios
pod install
cd ..
flutter build ios --simulator
```

For TestFlight and App Store:

- Use Release configuration, archive in Xcode, and upload via Organizer
- Validate signing, entitlements, and versioning

---

## Android Development Setup

### Prerequisites

- Android Studio 2022.3.1+ (Giraffe)
- Android SDK with API level 21+ (Android 5.0)
- Build tools and Platform tools
- Java 11+ (OpenJDK recommended)

### Android Studio Configuration

- Install SDKs via SDK Manager
- Create an emulator with AVD Manager (prefer x86_64 images for speed)
- Enable USB debugging for physical devices

### Gradle and Build

```bash
flutter build apk --debug
flutter build appbundle --release
```

Optimize with R8/ProGuard for release bundles and configure signing in `android/app`.

### Android Permissions

- Internet access for API/WebSocket traffic
- Secure storage permissions as required by wallet/key handling
- Optional future features: camera, media storage, notifications, background processing

### Play Store Deployment

- Generate a signed AAB (App Bundle)
- Upload to Google Play Console, set up internal testing, and promote via staged rollout

---

## Cross-Platform Considerations

- Maintain shared business logic and services in `lib/`
- Adapt UI per platform conventions when needed
- Profile performance on both platforms and optimize accordingly
- Test across a range of OS versions and device classes

---

## Common Issues and Solutions

- iOS CocoaPods issues: run `pod repo update` and `pod install` inside `ios/`
- Android SDK component missing: install via Android Studio SDK Manager
- Signing failures: verify certificates, profiles, keystores, and bundle identifiers
- Dependency conflicts: run `flutter pub upgrade --major-versions` cautiously and re-run builds

---

## Best Practices

- Follow platform design guidelines (Human Interface Guidelines, Material)
- Keep secrets out of source control; use secure storage for keys
- Automate builds and tests in CI; run `flutter analyze` and `flutter test`
- Monitor crash and performance metrics in production


