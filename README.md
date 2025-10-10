# Gasless Gossip: A Gamified On-Chain Messaging App

## URL: www.gaslessgossip.com

Gasless Gossip is a gamified, on-chain messaging app. Users chat, send/receive tokens, gift digital collectibles, share secrets, and level up — all with near‑zero fees on starknet Testnet.

**Vision**: A playful Web3 social playground where gossip is gamified and users earn XP through messaging, token transactions, and gifting collectibles.

**Core Features**
- Send token in chats 
- XP & levels, badges, and profile flair
- Secret Rooms with timed access and ephemeral chats
- Degen Mode with token gifting battles and leaderboards
- Creator tools: tip jars, token transfers, token-gated rooms


## Quick Start (TL;DR)

```bash
# 1. Setup database
brew install postgresql && brew services start postgresql
psql -U postgres -c "CREATE DATABASE gasless; CREATE USER whspr_user WITH PASSWORD 'yourpassword'; GRANT ALL PRIVILEGES ON DATABASE whspr TO whspr_user;"

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


## Tech Stack

- Blockchain: starknet Network (sepolia for on-chain logic)
- Mobile: starknet.dart (iOS/Android)
- Backend: NestJS (port 3001, starknet sepolia configuration)
- Storage: IPFS/Arweave for media (hashed references on-chain)









