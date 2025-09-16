# Whisper Mobile (Flutter)

A Flutter mobile client for Whisper — a gamified on-chain messaging app on Stellar Testnet.

## Prerequisites

- Flutter 3.10.0 or newer
- Dart SDK (bundled with Flutter)
- Xcode 14+ (macOS, for iOS) and/or Android Studio (Giraffe+) with SDK API 21+
- A configured device or emulator/simulator

Verify tooling:

```bash
flutter --version
flutter doctor -v
```

## Installation and First Run

```bash
cd mobile
flutter pub get
cp .env.example .env    # if present; otherwise create .env per below
flutter run
```

If multiple devices are connected, select with `-d <device_id>`.

## Environment Configuration

Create `.env` in `mobile/` (or use platform-specific configuration) and set:

- API_URL: Base URL of the backend (e.g., `http://localhost:3001`)
- STELLAR_NETWORK: `testnet` (default) or `public`
- WEBSOCKET_URL: WebSocket endpoint (e.g., `ws://localhost:3001`)
- DEBUG_LOGGING: `true` for verbose logs (optional)

These values are used by services like `api_service.dart`, `websocket_service.dart`, and wallet services.

## Stellar Wallet Integration

- Uses `stellar_wallet_flutter_sdk` and `stellar_flutter_sdk` for Testnet connectivity.
- Supports secure key handling and account operations.
- Testnet account funding: use the friendbot for your public key.
- Basic flow:
  1) Initialize wallet service on app start
  2) Import or create a keypair for Testnet
  3) Verify balance and submit sample transactions

See examples in `services/stellar_wallet_service.dart` and `services/stellar_wallet_service_example.dart`.

## Project Structure

```
mobile/
  lib/
    main.dart                      # App entry
    screens/                       # Screens (e.g., Splash, Home)
    widgets/                       # Reusable UI components
    services/                      # API, wallet, websocket, persistence
    providers/                     # Provider-based state management
    models/                        # Data models (user, room, xp, collectible)
    theme/                         # Theming and styles
```

## Development Workflow

- State management with `provider`
- API access via `services/api_service.dart`
- Real-time features via `services/websocket_service.dart`
- Persist lightweight state via `services/state_persistence_service.dart`
- Run fast iterations with hot reload: `flutter run`

## Platform-Specific Configuration

Refer to `mobile/PLATFORM_SETUP.md` for:

- iOS: Xcode setup, simulators, signing, capabilities, and permissions
- Android: SDK/AVD setup, Gradle config, and permissions

## Testing and Quality

- Run all tests via helper script:

```bash
./test_runner.sh all
```

- Unit tests for services/models, widget tests for UI, and integration tests. See `mobile/TESTING.md` for detailed guidance.

## Troubleshooting

- Backend not reachable: ensure `npm run start:dev` in `backend/` and `API_URL` is correct
- iOS build issues: `cd ios && pod install`, ensure Xcode 14+ and correct toolchain selected
- Android SDK errors: install required platforms/build-tools in Android Studio SDK Manager
- Stellar errors: confirm `STELLAR_NETWORK=testnet` and fund account via friendbot
