-- Initialize Midas Core Database
-- This script is run when the PostgreSQL container starts

-- Create additional databases for different environments
CREATE DATABASE midas_core_dev;
CREATE DATABASE midas_core_test;

-- Create additional users
CREATE USER midas_dev WITH PASSWORD 'midas_dev_password';
CREATE USER midas_test WITH PASSWORD 'midas_test_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE midas_core TO midas_user;
GRANT ALL PRIVILEGES ON DATABASE midas_core_dev TO midas_dev;
GRANT ALL PRIVILEGES ON DATABASE midas_core_test TO midas_test;

-- Connect to main database and create extensions
\c midas_core;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Connect to dev database and create extensions
\c midas_core_dev;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Connect to test database and create extensions
\c midas_core_test;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
