-- Initialize database for Gasless Gossip
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant all privileges to gasless_user
GRANT ALL PRIVILEGES ON DATABASE gasless TO gasless_user;

-- You can add any initial seed data here
-- Example:
-- CREATE TABLE IF NOT EXISTS example (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL
-- );
