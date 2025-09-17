
# 🚀 Whisper StellarModule Testing Guide

This guide walks you through testing the **Stellar + Soroban integration** in your NestJS backend.
You’ll confirm that **accounts, balances, payments, contract calls, and event listening** all work correctly on **Stellar testnet**.

---

## 📌 Prerequisites

* Node.js 18+
* NestJS project running locally
* Installed dependencies:

  ```bash
  npm install @stellar/stellar-sdk
  ```
* Add this to `.env`:

  ```env
  STELLAR_NETWORK=testnet
  STELLAR_RPC_URL=https://soroban-testnet.stellar.org
  STELLAR_FRIEND_BOT=https://friendbot.stellar.org
  ```

---

## ✅ Endpoints to Test

### 1. **Check Status**

Verify SDK + Soroban connection.

```http
GET http://localhost:3001/stellar/status
```

📌 Expected Response:

```json
{
  "network": "testnet",
  "url": "https://soroban-testnet.stellar.org",
  "soroban": {
    "friendbotUrl": "https://friendbot.stellar.org/",
    "passphrase": "Test SDF Network ; September 2015",
    "protocolVersion": 23
  }
}
```

---

### 2. **Create Test Account**

Generate a funded account on testnet using **friendbot**.

```http
POST http://localhost:3001/stellar/create-account
```

📌 Expected Response:

```json
{
  "publicKey": "GBYT47TSCKZJEK7E3UZRGSJWVCQTCQ5AMGZD5F6WKERBH7JZRDFBZEIQ",
  "secret": "SALGFTJVBAFJS7D4CB33DWPXR7AHW23SNVIBRPWQWPMY6NAYDIVPLBC6",
  "funded": {
    "_links": {
      "self": {
        "href": "https://horizon-testnet.stellar.org/transactions/43ad4bb71df457f26476e0450f5a3f61cb9d36a80ba140475b476d7207a76d53"
      },
      "account": {
        "href": "https://horizon-testnet.stellar.org/accounts/GC27XKLFXPNUCJBCUHBRW24NPOZPPSTZY7SQVSE4G53ZHZBS5AJZPS6M"
      },
      "ledger": {
        "href": "https://horizon-testnet.stellar.org/ledgers/585990"
      },
      "operations": {
        "href": "https://horizon-testnet.stellar.org/transactions/43ad4bb71df457f26476e0450f5a3f61cb9d36a80ba140475b476d7207a76d53/operations{?cursor,limit,order}",
        "templated": true
      },
      "effects": {
        "href": "https://horizon-testnet.stellar.org/transactions/43ad4bb71df457f26476e0450f5a3f61cb9d36a80ba140475b476d7207a76d53/effects{?cursor,limit,order}",
        "templated": true
      },
      "precedes": {
        "href": "https://horizon-testnet.stellar.org/transactions?order=asc&cursor=2516807885787136"
      },
      "succeeds": {
        "href": "https://horizon-testnet.stellar.org/transactions?order=desc&cursor=2516807885787136"
      },
      "transaction": {
        "href": "https://horizon-testnet.stellar.org/transactions/43ad4bb71df457f26476e0450f5a3f61cb9d36a80ba140475b476d7207a76d53"
      }
    },
    "id": "43ad4bb71df457f26476e0450f5a3f61cb9d36a80ba140475b476d7207a76d53",
    "paging_token": "2516807885787136",
    "successful": true,
    "hash": "43ad4bb71df457f26476e0450f5a3f61cb9d36a80ba140475b476d7207a76d53",
    "ledger": 585990,
    "created_at": "2025-09-17T16:10:51Z",
    "source_account": "GC27XKLFXPNUCJBCUHBRW24NPOZPPSTZY7SQVSE4G53ZHZBS5AJZPS6M",
    "source_account_sequence": "1292785156208",
    "fee_account": "GC27XKLFXPNUCJBCUHBRW24NPOZPPSTZY7SQVSE4G53ZHZBS5AJZPS6M",
    "fee_charged": "100",
    "max_fee": "1000000",
    "operation_count": 1,
    "envelope_xdr": "AAAAAgAAAAC1+6llu9tBJCKhwxtrjXuy98p5x+UKyJw3d5PkMugTlwAPQkAAAAEtAAAAcAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAABB90WssODNIgi6BHveqzxTRmIpvAFRyVNM+Hm2GVuCcAAAAAAAAAABxPn5yErKSK+TdMxNJNqihMUOgYbI+l9ZRIhP9OYjKHAAAABdIdugAAAAAAAAAAAIy6BOXAAAAQHPDL9jfuxYQqCR8cDLujOei1and74CYMVvFDqulM+KWle/frxDMb4/vpstVjnbWfXN44wNs9tRYrWO05SGfIw6GVuCcAAAAQHNqEqEVMK9in6GUNuE/ju5UvlOHfJsaKnwwMs3U73mRySdZUAjFUz9zO0aIGlgq0cXAXhM3Gy9qRXiZEKjifQg=",
    "result_xdr": "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAA=",
    "fee_meta_xdr": "AAAAAgAAAAMACIynAAAAAAAAAAC1+6llu9tBJCKhwxtrjXuy98p5x+UKyJw3d5PkMugTlwAAAAA8MzUkAAABLQAAAG8AAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAADAAAAAAAIjKcAAAAAaMjnIQAAAAAAAAABAAjxBgAAAAAAAAAAtfupZbvbQSQiocMba417svfKecflCsicN3eT5DLoE5cAAAAAPDM0wAAAAS0AAABvAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAwAAAAAACIynAAAAAGjI5yEAAAAA",
    "memo_type": "none",
    "signatures": [
      "c8Mv2N+7FhCoJHxwMu6M56LVqd3vgJgxW8UOq6Uz4paV79+vEMxvj++my1WOdtZ9c3jjA2z21FitY7TlIZ8jDg==",
      "c2oSoRUwr2KfoZQ24T+O7lS+U4d8mxoqfDAyzdTveZHJJ1lQCMVTP3M7RogaWCrRxcBeEzcbL2pFeJkQqOJ9CA=="
    ],
    "preconditions": {
      "timebounds": {
        "min_time": "0"
      }
    }
  }
}
```

Save the **publicKey** + **secret** for further testing.

---

### 3. **Get Balance**

Check the balance of the test account.

```http
GET http://localhost:3001/stellar/balance?publicKey=GBYT47TSCKZJEK7E3UZRGSJWVCQTCQ5AMGZD5F6WKERBH7JZRDFBZEIQ
```

📌 Expected Response:

```json
[
  { "asset": "XLM", "balance": "10000.0000000" }
]
```

---

### 4. **Send Payment**

Transfer XLM between two test accounts.

```http
POST http://localhost:3000/stellar/send-payment
Content-Type: application/json

{
  "sourceSecret": "SB3Z...XYZ",
  "destination": "GABC...XYZ",
  "amount": "10"
}
```

📌 Expected Response:

```json
{
  "hash": "1f3b7...",
  "ledger": 123456,
  "successful": true
}
```

---

### 5. **Call Soroban Contract (Read-Only)**

Simulate a contract function call (e.g., check XP balance).

```http
POST http://localhost:3000/stellar/call-contract
Content-Type: application/json

{
  "contractId": "CDY3...XYZ",
  "functionName": "get_balance",
  "args": ["GCFX...XYZ"]
}
```

📌 Expected Response (example):

```json
{
  "results": [
    {
      "xdr": "AAAAA...",
      "decoded": "100 XP"
    }
  ]
}
```

---

### 6. **Invoke Soroban Contract (State Change)**

Execute a contract function (e.g., award XP or send a gift).

```http
POST http://localhost:3000/stellar/invoke-contract
Content-Type: application/json

{
  "sourceSecret": "SB3Z...XYZ",
  "contractId": "CDY3...XYZ",
  "functionName": "award_xp",
  "args": ["GABC...XYZ", "50"]
}
```

📌 Expected Response:

```json
{
  "status": "PENDING",
  "hash": "e3f5b...",
  "latestLedger": 123456
}
```

---

### 7. **Listen to Contract Events**

Start event listening (use WebSocket or backend logs).

```ts
await stellarService.listenToEvents("CDY3...XYZ", (event) => {
  console.log("New Event:", event);
});
```

📌 Expected Log:

```
New Event: { type: "gift_sent", from: "GCFX...XYZ", to: "GABC...XYZ", amount: "50" }
```

---

## 🎯 Acceptance Criteria

* ✅ `/stellar/status` confirms testnet connection.
* ✅ `create-account` returns funded account.
* ✅ `balance` shows correct XLM.
* ✅ `send-payment` succeeds.
* ✅ `call-contract` simulates Soroban read.
* ✅ `invoke-contract` updates Soroban state.
* ✅ Event listener logs new contract events.

---