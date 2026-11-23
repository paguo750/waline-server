// Map Vercel/Neon integration env vars (POSTGRES_*) to the PG_* names Waline expects.
process.env.PG_HOST = process.env.PG_HOST || process.env.POSTGRES_HOST;
process.env.PG_USER = process.env.PG_USER || process.env.POSTGRES_USER;
process.env.PG_PASSWORD = process.env.PG_PASSWORD || process.env.POSTGRES_PASSWORD;
process.env.PG_DB = process.env.PG_DB || process.env.POSTGRES_DATABASE;
process.env.PG_PORT = process.env.PG_PORT || '5432';
if (!process.env.PG_SSL && (process.env.POSTGRES_HOST || '').includes('neon.tech')) {
  process.env.PG_SSL = 'true';
}

const Waline = require('@waline/vercel');

module.exports = Waline({});
