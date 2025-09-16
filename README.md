# Whisper: A Gamified On-Chain Messaging App on Stellar

Whisper is a gamified, on-chain messaging app built on the Stellar network. Users chat, send/receive tokens, gift digital collectibles, share secrets, and level up — all with near‑zero fees on Stellar Testnet.

## Project Overview

**Vision**: A playful Web3 social playground where gossip is gamified and users earn XP through messaging, token transactions, and gifting collectibles.

**Core Features**
- XP & levels, badges, and profile flair
- Secret Rooms with timed access and ephemeral chats
- Degen Mode with token gifting battles and leaderboards
- Creator tools: tip jars, token transfers, NFT-gated rooms

## Tech Stack

- Blockchain: Stellar Network (Soroban for on-chain logic)
- Mobile: Flutter (iOS/Android)
- Backend: NestJS (port 3001, Stellar Testnet configuration)
- Storage: IPFS/Arweave for media (hashed references on-chain)

---

## Prerequisites and System Requirements

Ensure your system meets the following before setting up:

- Flutter SDK 3.10+
- Dart SDK (bundled with Flutter)
- Node.js 18+ and npm 9+ (for backend)
- Git, OpenSSL
- Platform tooling:
  - macOS: Xcode 14+ with Command Line Tools
  - Android: Android Studio (Giraffe+) with SDK API 21+
  - Web: Chrome 88+ or Safari 14+

To verify Flutter tooling:

```bash
flutter --version
flutter doctor -v
```

---

## Quick Start

Clone and open the workspace:

```bash
git clone <your-fork-or-repo-url>
cd whspr_stellar
```

### 1) Mobile (Flutter)

```bash
cd mobile
flutter pub get
cp .env.example .env    # if present; otherwise see mobile/README.md
flutter run
```

### 2) Backend (NestJS)

```bash
cd backend
npm install
cp .env.example .env    # configure Stellar testnet, API port 3001
npm run start:dev
```

The backend exposes a health endpoint on `http://localhost:3001/health`.

---

## Environment Setup

Both mobile and backend use environment files. See `mobile/README.md` for Flutter variables and wallet configuration. Typical settings include:

- API_URL: `http://localhost:3001`
- STELLAR_NETWORK: `testnet`
- WEBSOCKET_URL: `ws://localhost:3001`

For Stellar Testnet, create or fund an account using friendbot, and configure wallet credentials in the mobile app (see `mobile/README.md`).

---

## Platform Setup

For detailed iOS/Android setup (Xcode, Android Studio, emulators, signing, capabilities), see `mobile/PLATFORM_SETUP.md`.

---

## Testing and CI/CD

- Local Flutter tests: see `mobile/TESTING.md` and use `mobile/test_runner.sh` for unit, widget, and integration tests.
- Static analysis: `flutter analyze` in `mobile/` and ESLint/Jest in `backend/` as applicable.
- CI/CD: Configure pipeline to run analyze, tests, and build artifacts for Android/iOS/web.

---

## Troubleshooting

- CocoaPods issues: run `sudo xcode-select --switch /Applications/Xcode.app` and `cd ios && pod install`.
- Android SDK missing platforms: open Android Studio > SDK Manager and install API 21+.
- Network errors from the app: confirm backend at `http://localhost:3001/health` and `API_URL` in the mobile `.env`.
- Stellar issues: ensure Testnet is selected and accounts funded via friendbot.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/xyz`
3. Commit: `git commit -m "feat: add xyz"`
4. Push: `git push origin feature/xyz`
5. Open a pull request
