// Map Vercel/Neon integration env vars (POSTGRES_*) to the PG_* names Waline expects.
process.env.PG_HOST = process.env.PG_HOST || process.env.POSTGRES_HOST;
process.env.PG_USER = process.env.PG_USER || process.env.POSTGRES_USER;
process.env.PG_PASSWORD = process.env.PG_PASSWORD || process.env.POSTGRES_PASSWORD;
process.env.PG_DB = process.env.PG_DB || process.env.POSTGRES_DATABASE;
process.env.PG_PORT = process.env.PG_PORT || '5432';
if (!process.env.PG_SSL && (process.env.POSTGRES_HOST || '').includes('neon.tech')) {
  process.env.PG_SSL = 'true';
}

// Workaround for a think-loader crash: it sets `__filename` on the prototype of
// every loaded module export, which throws for function exports that have no
// prototype (async/arrow functions, e.g. @waline/vercel's akismet service).
// Pre-require the package's src files and give such exports an empty prototype.
try {
  const fs = require('node:fs');
  const path = require('node:path');
  const srcDir = path.join(__dirname, '..', 'node_modules', '@waline', 'vercel', 'src');
  const walk = (d) =>
    fs.readdirSync(d, { withFileTypes: true }).flatMap((ent) => {
      const p = path.join(d, ent.name);
      return ent.isDirectory() ? walk(p) : ent.name.endsWith('.js') ? [p] : [];
    });
  for (const file of walk(srcDir)) {
    try {
      const exp = require(file);
      if (typeof exp === 'function' && !exp.prototype) exp.prototype = {};
    } catch {
      // Files that need the thinkjs global are loaded later by thinkjs itself.
    }
  }
} catch {
  // Package layout differs; continue without the workaround.
}

const Waline = require('@waline/vercel');

module.exports = Waline({});
