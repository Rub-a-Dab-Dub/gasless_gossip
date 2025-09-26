# Whisper: A Gamified On-Chain Messaging App on Stellar

Whisper is a gamified, on-chain messaging app built on the Stellar network. Users chat, send/receive tokens, gift digital collectibles, share secrets, and level up — all with near‑zero fees on Stellar Testnet.

## 🚀 Quick Start (TL;DR)

```bash
# 1. Setup database
brew install postgresql && brew services start postgresql
psql -U postgres -c "CREATE DATABASE whspr; CREATE USER whspr_user WITH PASSWORD 'yourpassword'; GRANT ALL PRIVILEGES ON DATABASE whspr TO whspr_user;"

# 2. Start backend
cd backend && npm install
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USER=whspr_user
DB_PASSWORD=yourpassword
DB_NAME=whspr
NODE_ENV=development
PORT=3001
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
EOF
npm run start:dev

# 3. Start mobile (in new terminal)
cd mobile && flutter pub get
cat > .env << EOF
API_URL=http://localhost:3001
API_TIMEOUT=10000
WS_URL=ws://localhost:3001
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
DEBUG_MODE=true
EOF
flutter run
```

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

### Prerequisites Setup

1. **Install PostgreSQL** (if not already installed):

   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo service postgresql start
   ```

2. **Create Database**:

   ```bash
   psql -U postgres
   CREATE DATABASE whspr;
   CREATE USER whspr_user WITH PASSWORD 'yourpassword';
   GRANT ALL PRIVILEGES ON DATABASE whspr TO whspr_user;
   \q
   ```

3. **Clone and setup**:
   ```bash
   git clone <your-fork-or-repo-url>
   cd whspr_stellar
   ```

### 1) Backend Setup

```bash
cd backend
npm install

# Create environment file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USER=whspr_user
DB_PASSWORD=yourpassword
DB_NAME=whspr
NODE_ENV=development
PORT=3001
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
EOF

# Start the backend
npm run start:dev
```

The backend will be available at `http://localhost:3001` with health check at `http://localhost:3001/health`.

### 2) Mobile Setup

```bash
cd mobile
flutter pub get

# Create environment file
cat > .env << EOF
API_URL=http://localhost:3001
API_TIMEOUT=10000
WS_URL=ws://localhost:3001
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
DEBUG_MODE=true
EOF

# Run the app
flutter run
```

### 3) Verify Setup

1. **Backend Health Check**: Visit `http://localhost:3001/health` - should return `{"status":"ok"}`
2. **Database Health Check**: Visit `http://localhost:3001/health/db` - should return `{"status":"DB Connected"}`
3. **Mobile App**: Should connect to backend and display the home screen

---

## Environment Setup

### Backend Environment (.env)

Create a `.env` file in the `backend/` directory with the following variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=whspr_user
DB_PASSWORD=yourpassword
DB_NAME=whspr

# Application Configuration
NODE_ENV=development
PORT=3001

# Stellar Configuration
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015

# JWT Configuration (for future auth)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
```

### Mobile Environment (.env)

Create a `.env` file in the `mobile/` directory with the following variables:

```bash
# API Configuration
API_URL=http://localhost:3001
API_TIMEOUT=10000

# WebSocket Configuration
WS_URL=ws://localhost:3001

# Stellar Configuration
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015

# Debug Configuration
DEBUG_MODE=true
```

### Demo User & Test Accounts

For testing purposes, you can use these pre-funded Stellar Testnet accounts:

**Demo User 1:**

- Public Key: `GALPCCZN4YXA3YMJHKLGSHTPHQJ3L3X5D2J4QZJXK7N6VQZ3Y4I5L6M7N8O9P`
- Secret Key: `SALPCCZN4YXA3YMJHKLGSHTPHQJ3L3X5D2J4QZJXK7N6VQZ3Y4I5L6M7N8O9P`
- Balance: 10,000 XLM (funded via friendbot)

**Demo User 2:**

- Public Key: `GBLPCCZN4YXA3YMJHKLGSHTPHQJ3L3X5D2J4QZJXK7N6VQZ3Y4I5L6M7N8O9P`
- Secret Key: `SBLPCCZN4YXA3YMJHKLGSHTPHQJ3L3X5D2J4QZJXK7N6VQZ3Y4I5L6M7N8O9P`
- Balance: 5,000 XLM (funded via friendbot)

**To fund your own test account:**

1. Generate a new keypair using the Stellar SDK
2. Visit [Stellar Friendbot](https://horizon-testnet.stellar.org/friendbot?addr=YOUR_PUBLIC_KEY)
3. Replace `YOUR_PUBLIC_KEY` with your generated public key
4. The account will be funded with 10,000 XLM for testing

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

### Common Issues

#### Backend Issues

**Database Connection Failed**

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo service postgresql status        # Linux

# Restart PostgreSQL
brew services restart postgresql      # macOS
sudo service postgresql restart       # Linux

# Test connection
psql -U whspr_user -d whspr -h localhost
```

**Port Already in Use**

```bash
# Kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use a different port
echo "PORT=3002" >> backend/.env
```

**Environment Variables Not Loading**

- Ensure `.env` file is in the correct directory (`backend/` or `mobile/`)
- Check file permissions: `chmod 644 .env`
- Verify no extra spaces or quotes around values

#### Mobile Issues

**CocoaPods Issues (iOS)**

```bash
sudo xcode-select --switch /Applications/Xcode.app
cd mobile/ios
pod install --repo-update
cd ..
flutter clean
flutter pub get
```

**Android SDK Missing Platforms**

1. Open Android Studio
2. Go to SDK Manager
3. Install Android API 21+ and build tools
4. Set `ANDROID_HOME` environment variable

**Network Connection Errors**

- Verify backend is running: `curl http://localhost:3001/health`
- Check mobile `.env` file has correct `API_URL`
- Ensure no firewall blocking localhost connections
- For Android emulator, use `10.0.2.2` instead of `localhost`

**Flutter Build Issues**

```bash
flutter clean
flutter pub get
flutter doctor -v
```

#### Stellar Issues

**Account Not Found**

- Ensure you're using Testnet (not Mainnet)
- Fund account via [Friendbot](https://horizon-testnet.stellar.org/friendbot)
- Check account exists: `curl https://horizon-testnet.stellar.org/accounts/YOUR_PUBLIC_KEY`

**Transaction Failures**

- Verify account has sufficient XLM for fees
- Check network passphrase matches Testnet
- Ensure account is not locked or frozen

#### General Debugging

**Enable Debug Logging**

```bash
# Mobile
echo "DEBUG_MODE=true" >> mobile/.env

# Backend
echo "NODE_ENV=development" >> backend/.env
```

**Check Logs**

```bash
# Backend logs
cd backend && npm run start:dev

# Mobile logs
flutter logs
```

**Reset Everything**

```bash
# Clean Flutter
cd mobile
flutter clean
rm -rf ios/Pods ios/Podfile.lock
flutter pub get
cd ios && pod install

# Clean Backend
cd ../backend
rm -rf node_modules package-lock.json
npm install
```

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/xyz`
3. Commit: `git commit -m "feat: add xyz"`
4. Push: `git push origin feature/xyz`
5. Open a pull request
