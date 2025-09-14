Whisper: A Gamified On-Chain Messaging App on Stellar
Whisper is a gamified, on-chain messaging app built on the Stellar network, blending degen culture, private gossip, and token-driven social interactions. Users chat, send/receive tokens, gift digital collectibles, share secrets, and level up—all with near-zero fees, leveraging Stellar's fast and cost-effective blockchain.
Project Overview

Vision: A playful, chaotic Web3 social playground where gossip is gamified, and users earn XP through messaging, token transactions, and gifting exclusive digital collectibles.
Core Features:
XP & Level System: Earn XP for messages, reactions, and token sends; unlock badges and profile flair.
Secret Rooms: Private, timed-access rooms with pseudonymous chats and auto-deleting messages.
Degen Mode: High-risk bets, token gifting battles, and leaderboards.
Creator Tools: Tip jars, token transfers, and NFT-gated rooms.
Gamification: Daily quests, streaks, and event-based XP boosts.



Tech Stack

Blockchain: Stellar Network (Soroban smart contracts for XP, token gifting, and logic).
Mobile App: Flutter (iOS/Android) for emoji-rich, mobile-first UX.
Backend: NestJS for API, off-chain message storage, and analytics.
Web App: NextJS for responsive, fast frontend with wallet integration (e.g., Freighter).
Storage: IPFS/Arweave for off-chain message/voice note data (hashed on Stellar for immutability).


Installation

Clone the Repo:git clone https://github.com/whisper-app/whisper.git
cd whisper


Mobile App (Flutter):cd mobile
flutter pub get
flutter run


Backend (NestJS):cd backend
npm install
npm run start:dev


Web App (NextJS):cd web
npm install
npm run dev


Smart Contracts (Soroban):
Install Soroban CLI: Soroban Setup.
Deploy contracts:cd contracts
soroban contract deploy --network testnet

Environment Setup

Create .env files in backend and web folders:STELLAR_NETWORK=testnet
IPFS_API_KEY=<your-ipfs-key>
DATABASE_URL=<your-db-url>


Configure Stellar account and Freighter wallet for testing.

Usage

Mobile: Sign in with Stellar wallet, join Secret Rooms, send tokens, or gift collectibles.
Web: Access leaderboards, manage rooms, or trade gifts in the marketplace.
Contracts: Use Soroban to manage XP, token transfers, and gated rooms.

Contributing

Fork the repo.
Create a feature branch (git checkout -b feature/xyz).
Commit changes (git commit -m 'Add xyz feature').
Push to branch (git push origin feature/xyz).
Open a pull request.