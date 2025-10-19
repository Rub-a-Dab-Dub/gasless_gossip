# GaslessGossip Payments Contract

A minimal, gas-efficient payment contract for the GaslessGossip social app on Starknet. Enables tipping, room entry payments, and free P2P transfers with a simple 2% platform fee model.

---

## 🎯 Overview

GaslessGossip is a Web3 social messaging app where users chat, tip, and join premium rooms—all without paying gas fees thanks to account abstraction and session keys.

This contract handles **only the payment layer**. All social features (messages, XP, rooms, quests) live off-chain for speed and flexibility.

### Three Payment Types

| Payment Type | Platform Fee | Use Case |
|-------------|--------------|----------|
| **Tip User** | 2% | Reward users for funny messages, helpful info |
| **Room Entry** | 2% | Pay to access exclusive/premium rooms |
| **P2P Send** | 0% (FREE) | Send money to friends, settle debts |

---

## ✨ Features

- ✅ **Simple fee model** - Just 2% on tips and room entries
- ✅ **Free P2P transfers** - No fees for direct payments
- ✅ **OpenZeppelin Ownable** - Battle-tested access control
- ✅ **Pause mechanism** - Emergency stop functionality
- ✅ **Flexible withdrawals** - Admin can withdraw fees to any address
- ✅ **Comprehensive tests** - 25+ test cases covering all scenarios
- ✅ **Gas optimized** - Minimal storage, efficient calculations

---

## 🚀 Quick Start

### Build

```bash
scarb build
```

### Test

```bash
snforge test
```

---

**Testnet Addresses:**
- Starknet Sepolia STRK: `0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d`
- GG PAY Sepolia: `0x02656933f624f6047bf77fb6b4d4699175b56785be4e619bfe9841eb134aaa40`

---

## 📖 Usage

### For Users

#### 1. Tip Another User

```cairo
// Tip 10 STRK
payments.tip_user(
    recipient: bob_address,
    amount: 10_000000000000000000,  // 10 STRK (18 decimals)
    context: 'chat_tip'
);

// Result:
// - Sender pays: 10 STRK
// - Platform keeps: 0.2 STRK (2%)
// - Recipient gets: 9.8 STRK
```

**Context types (e.g):**
- `'chat_tip'` - Regular chat message tip
- `'room_tip'` - Tip in a room
- `'secret_reward'` - Reward for sharing gossip
- `'voice_tip'` - Voice note appreciation

#### 2. Pay to Enter Room

```cairo
// Pay 20 STRK to enter premium room
payments.pay_room_entry(
    room_id: 123,
    room_creator: alice_address,
    entry_fee: 20_000000000000000000
);

// Result:
// - User pays: 20 STRK
// - Platform keeps: 0.4 STRK (2%)
// - Creator gets: 19.6 STRK
```

#### 3. Send Tokens (P2P)

```cairo
// Send 50 STRK directly to friend (NO FEES)
payments.send_tokens(
    recipient: charlie_address,
    amount: 50_000000000000000000
);

// Result:
// - Sender pays: 50 STRK
// - Platform keeps: 0 STRK
// - Recipient gets: 50 STRK (full amount!)
```

---

## 📁 Project Structure

```
gg_pay/
├── src/
│   ├── lib.cairo              # Module exports
│   ├── interface.cairo        # IGGPay trait
│   ├── gg_pay.cairo          # Main contract
│   └── mock/
│       └── erc20.cairo       # Mock STRK token for tests
│
├── tests/
│   └── test_contract.cairo   # Comprehensive test suite
│
├── Scarb.toml                # Project config & dependencies
├── snfoundry.toml           # Foundry config
└── README.md                 # This file
```

---

## ⚠️ Important: Token Approval Required

Before using payment functions, users **must approve** the contract to spend their STRK tokens.

### Functions Requiring Approval

1. **`tip_user()`** - Requires approval for the tip amount
2. **`pay_room_entry()`** - Requires approval for the entry fee amount  
3. **`send_tokens()`** - Requires approval for the transfer amount
