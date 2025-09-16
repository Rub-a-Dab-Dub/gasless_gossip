# Whisper Mobile

A Flutter mobile app for Whisper — a gamified on-chain messaging app on Stellar.

## Prerequisites

- Flutter 3.10.0 or newer
- Dart SDK bundled with Flutter
- iOS or Android tooling set up (Xcode/Android Studio, emulators or devices)

## Getting Started

```bash
flutter pub get
flutter run
```

> If you have multiple devices connected, select a target with `-d <device_id>`.

## Project Structure

```
mobile/
  lib/
    main.dart                # App entry — MaterialApp with SplashScreen
    screens/
      splash_screen.dart     # Initial splash screen (placeholder)
    widgets/                 # Reusable UI components
    services/                # API clients, Stellar services (planned)
    models/                  # Data models and DTOs (planned)
    utils/                   # Helpers and formatters (planned)
  pubspec.yaml               # App metadata and dependencies
```

## App Info

- Name: Whisper
- Description: A gamified on-chain messaging app on Stellar
- Theme: Dark-first, Material 3

## Next Steps (Upcoming)

- Environment configuration for backend base URL and Stellar network
- Add dependencies: provider, http, stellar_flutter_sdk, etc.
- Authentication flow and navigation scaffolding
- Wallet integration and secure key management
- Feature screens: Secret Rooms, Profile, Degen Mode

## Helpful Links

- Flutter docs: https://docs.flutter.dev/
- Dart packages: https://pub.dev/
- Material 3: https://m3.material.io/

## Notes

This is the initial scaffold to integrate later with the existing NestJS backend (Stellar testnet configured) and IPFS. Configure environments and services in subsequent phases.
