# Whisper Mobile Testing Guide

This guide documents end-to-end testing and verification for the Whisper Flutter app and its NestJS backend.

## Testing Overview

- Validate integration between Flutter app and backend (port 3001)
- Verify Stellar Testnet connectivity and wallet transactions
- Ensure performance, reliability, and security standards

## Local Test Runner

Use the provided script to run tests:

```bash
./test_runner.sh all
```

You can also run specific suites:

```bash
./test_runner.sh unit
./test_runner.sh widget
./test_runner.sh services
```

## Flutter Build Testing

Validate builds across targets:

```bash
flutter build apk --debug
flutter build ios --simulator
flutter build web
```

Checklist:

- App launches without runtime errors
- No missing assets or fonts
- Stable performance on list scrolling and animations

## Stellar Network Integration Testing

Steps:

1. Ensure `STELLAR_NETWORK=testnet`
2. Create/import a keypair in the app
3. Fund via friendbot and confirm balance
4. Submit a small transaction and verify confirmation

Validate using services in `lib/services/stellar_wallet_service.dart`.

## Backend API Integration Testing

- Confirm backend is running: `http://localhost:3001/health`
- Test API flows used by `api_service.dart`:
  - Health/status checks
  - User XP and room data endpoints
  - WebSocket events for real-time updates

Simulate network errors and timeouts to verify handling and retries.

## End-to-End User Flows

- Onboarding: launch app, initialize wallet, connect to backend
- Rooms: join a room, send a message, observe XP update
- Gifting: send/receive a collectible

Verify data persists as expected and state recovers on app restart.

## Performance Testing

- Startup time within acceptable thresholds
- Steady 60fps on common screens
- Memory growth stable under navigation loops

Use Flutter DevTools for CPU/memory profiling and frame analysis.

## Security Testing

- Validate secure key storage for wallet credentials
- Ensure API calls use HTTPS in non-local environments
- Input validation for user-generated content

## Automated Testing and Coverage

- Run analyzer and tests in CI:

```bash
flutter analyze
flutter test --coverage
```

- Enforce quality gates on coverage and lints

## Manual Testing Procedures

- Test on physical iOS and Android devices
- Cross-platform rendering checks and accessibility audits
- Validate error states (network offline, API failures, Stellar unavailability)

## Testing Checklist

- Backend health endpoint reachable
- App builds and runs on iOS/Android/Web
- Stellar Testnet transactions succeed
- WebSocket events handled gracefully
- Performance and memory within targets

