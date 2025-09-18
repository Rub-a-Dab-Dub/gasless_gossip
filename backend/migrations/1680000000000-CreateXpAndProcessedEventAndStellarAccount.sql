-- Migration: create xp, processed_event, stellar_account tables

CREATE TABLE IF NOT EXISTS "xp" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" varchar(255) NOT NULL,
  "xpValue" integer NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "processed_event" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "eventId" varchar(255) NOT NULL UNIQUE,
  "source" varchar(255),
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "stellar_account" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "stellarAccount" varchar(255) NOT NULL UNIQUE,
  "userId" varchar(255),
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
