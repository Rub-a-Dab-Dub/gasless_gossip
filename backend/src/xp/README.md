XP Module

Purpose
- Manage user experience points (XP) accrued from on-chain and app events.

Entities
- Xp: stores per-user XP totals (`id`, `userId`, `xpValue`, `createdAt`).
- ProcessedEvent: dedupes processed Stellar events to ensure idempotency (`eventId`).
- StellarAccount: maps on-chain Stellar addresses to internal `userId`.

Endpoints
- GET `/xp/:userId` — returns `{ userId, xp }`.
- POST `/xp/add` — body `AddXpDto` `{ userId, amount, source? }`.
- POST `/xp/event` — body `StellarEventDto` `{ eventId, type, userId, data? }`.
- POST `/xp/map-account` — body `MapStellarAccountDto` `{ stellarAccount, userId? }`.

Accrual Mechanics (suggested)
- Message: +5 XP per message event.
- Token send: +10 XP per token send.
- Optional multipliers: first-time bonus, daily caps, or streak bonuses.

Operational notes
- The service uses a transaction and `processed_event` table to avoid double-awarding.
- For production, run SQL migrations in `backend/migrations` and disable `synchronize`.
- Protect `/xp/event` and `/xp/map-account` endpoints with auth/signatures.
