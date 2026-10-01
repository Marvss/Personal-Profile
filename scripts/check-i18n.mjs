#!/usr/bin/env node
// Verifies that every translation key used in index.html or the JS modules
// exists in every locale, and that all locales define the same keys.
// Usage: node scripts/check-i18n.mjs
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const localesDir = join(root, 'assets/js/i18n/locales');

const locales = {};
for (const file of (await readdir(localesDir)).filter((f) => f.endsWith('.js'))) {
  const mod = await import(pathToFileURL(join(localesDir, file)).href);
  locales[file.replace('.js', '')] = mod.default;
}

const used = new Set();
const html = await readFile(join(root, 'index.html'), 'utf8');
for (const [, key] of html.matchAll(/data-i18n="([^"]+)"/g)) used.add(key);
for (const [, pairs] of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
  pairs.split(';').forEach((pair) => used.add(pair.split(':')[1].trim()));
}

async function scanJs(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'locales') await scanJs(path);
    } else if (entry.name.endsWith('.js')) {
      const src = await readFile(path, 'utf8');
      for (const [, key] of src.matchAll(/\bt\('([^']+)'\)/g)) used.add(key);
    }
  }
}
await scanJs(join(root, 'assets/js'));
used.add('meta.title'); // applied to document.title by the i18n engine

const errors = [];
const allKeys = new Set(Object.values(locales).flatMap((dict) => Object.keys(dict)));

for (const [name, dict] of Object.entries(locales)) {
  for (const key of used) if (!(key in dict)) errors.push(`[${name}] missing key used in the page: ${key}`);
  for (const key of allKeys) if (!(key in dict)) errors.push(`[${name}] missing key defined in another locale: ${key}`);
  for (const [key, value] of Object.entries(dict)) {
    if (typeof value !== 'string' || !value.trim()) errors.push(`[${name}] empty value: ${key}`);
  }
}

const unused = [...allKeys].filter((key) => !used.has(key));
if (unused.length) console.warn(`Unused keys (not an error):\n  ${unused.join('\n  ')}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`i18n OK — ${Object.keys(locales).join(', ')} · ${used.size} keys in use`);
