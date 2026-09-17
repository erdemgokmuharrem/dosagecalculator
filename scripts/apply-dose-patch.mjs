/**
 * Applies a reviewed dose-data patch to the drug catalogue.
 *
 * The catalogue is TypeScript object literals spread over four files, so a patch
 * is applied by locating a record by id and rewriting only the named fields.
 * Nothing else in the file is touched, and every changed record must carry its
 * provenance (which source it was compared against, and when).
 *
 * Usage: node scripts/apply-dose-patch.mjs <patch.json> [--dry]
 *
 * Patch shape, keyed by drug id:
 *   {
 *     "25": {
 *       "formula":  { "dosePerKg": 5, "frequency": "q24h", "maxSingleDose": 500 },
 *       "record":   { "unit": "mg", "maxDailyDose": 500 },
 *       "requiresClinicalReview": true,
 *       "clinicalReviewNote": "...",
 *       "sourceReference": "FDA label ...",
 *       "sourceDate": "2026-09-15",
 *       "sourceVerification": "SOURCE_CHECKED"
 *     }
 *   }
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_FILES = [
  'src/data/drugs.ts',
  'src/data/drugs_extended.ts',
  'src/data/drugs_chemo_supplements.ts',
  'src/data/drugs_extra.ts',
];

const [patchPath, ...flags] = process.argv.slice(2);
if (!patchPath) {
  console.error('usage: node scripts/apply-dose-patch.mjs <patch.json> [--dry]');
  process.exit(2);
}
const dry = flags.includes('--dry');
const patch = JSON.parse(readFileSync(patchPath, 'utf8'));

/**
 * Returns [start, end) of the object literal that declares `id`.
 *
 * Found by locating the `id:` entry and walking back to the brace that opens its
 * object, so it keeps working after this script has inserted keys above `id`.
 */
const recordRange = (source, id) => {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = source.match(new RegExp(`\\n\\s*id: '${escaped}',`));
  if (!m) return null;
  const idAt = m.index ?? 0;
  let depth = 0;
  let start = -1;
  for (let i = idAt; i >= 0; i--) {
    const ch = source[i];
    if (ch === '}') depth++;
    else if (ch === '{') {
      if (depth === 0) {
        start = i;
        break;
      }
      depth--;
    }
  }
  if (start === -1) return null;
  depth = 0;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return [start, i + 1];
    }
  }
  return null;
};

/** Returns [start, end) of the dosageFormula literal inside a record slice. */
const formulaRange = (slice) => {
  const i = slice.indexOf('dosageFormula: {');
  if (i === -1) return null;
  const open = slice.indexOf('{', i);
  let depth = 0;
  for (let j = open; j < slice.length; j++) {
    const ch = slice[j];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return [open, j + 1];
    }
  }
  return null;
};

/** Serialises a patch value as a TypeScript literal. Arrays and objects are
 *  emitted with unquoted keys; the formatter re-wraps them afterwards. */
const literal = (value) => {
  if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`;
  if (Array.isArray(value)) return `[${value.map(literal).join(', ')}]`;
  if (value && typeof value === 'object') {
    return `{ ${Object.entries(value)
      .map(([k, v]) => `${k}: ${literal(v)}`)
      .join(', ')} }`;
  }
  return String(value);
};

/**
 * Sets `key` inside an object literal: replaces the existing entry, or inserts
 * one after the id line.
 *
 * The existing value may span several lines, because the formatter wraps long
 * strings. Matching only to end-of-line once left the old value behind and
 * added a second copy of the key, so the value is scanned properly: through
 * strings, brackets and template literals, up to the comma that closes it.
 */
const valueEnd = (block, from) => {
  let depth = 0;
  let quote = null;
  for (let i = from; i < block.length; i++) {
    const ch = block[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === '[' || ch === '{' || ch === '(') depth++;
    else if (ch === ']' || ch === '}' || ch === ')') {
      if (depth === 0) return i;
      depth--;
    } else if (ch === ',' && depth === 0) return i + 1;
  }
  return block.length;
};

/** Removes `key` from an object literal; used when a patch sets it to null. */
const dropKey = (block, key) => {
  const m = block.match(new RegExp(`\\n(\\s*)${key}:`));
  if (!m) return block;
  const start = m.index ?? 0; // the newline that begins the key's line
  const colon = block.indexOf(':', start + 1) + 1;
  const end = valueEnd(block, colon);
  // Keep the newline that begins the next line. Removing it glued that line
  // onto the previous one, so the next setKey could not find its key and added
  // a second copy.
  return block.slice(0, start) + block.slice(end);
};

const setKey = (block, key, value) => {
  if (value === null) return { block: dropKey(block, key), skipped: false };
  const m = block.match(new RegExp(`\\n(\\s*)${key}:`));
  if (m) {
    const at = (m.index ?? 0) + 1;
    const colon = block.indexOf(':', at) + 1;
    const end = valueEnd(block, colon);
    const existing = block.slice(colon, end).trim().replace(/,$/, '');
    // An existing array or object is only replaced when the patch supplies one;
    // a scalar patch must never silently flatten a structured value.
    const structuredExisting = /^[[{]/.test(existing);
    const structuredValue = Array.isArray(value) || (value && typeof value === 'object');
    if (structuredExisting && !structuredValue) return { block, skipped: true };
    return {
      block: block.slice(0, at) + `${m[1]}${key}: ${literal(value)},` + block.slice(end),
      skipped: false,
    };
  }
  const afterId = block.match(/\n(\s*)id: '[^']*',\n/);
  if (afterId) {
    return {
      block: block.replace(afterId[0], `${afterId[0]}${afterId[1]}${key}: ${literal(value)},\n`),
      skipped: false,
    };
  }
  const indent = (block.match(/\n(\s+)\S/) ?? [null, '      '])[1];
  return {
    block: block.replace(/\{\n/, `{\n${indent}${key}: ${literal(value)},\n`),
    skipped: false,
  };
};

let changed = 0;
const missing = [];
const skipped = [];
const touched = new Set();

for (const file of DATA_FILES) {
  const path = join(ROOT, file);
  let source = readFileSync(path, 'utf8');
  let fileChanged = false;

  for (const [id, spec] of Object.entries(patch)) {
    const range = recordRange(source, id);
    if (!range) continue;
    touched.add(id);
    let [start, end] = range;
    let record = source.slice(start, end);

    // Record-level fields, including provenance.
    const recordFields = {
      ...(spec.record ?? {}),
      ...(spec.requiresClinicalReview === undefined
        ? {}
        : { requiresClinicalReview: spec.requiresClinicalReview }),
      ...(spec.clinicalReviewNote ? { clinicalReviewNote: spec.clinicalReviewNote } : {}),
      ...(spec.sourceReference ? { sourceReference: spec.sourceReference } : {}),
      ...(spec.sourceDate ? { sourceDate: spec.sourceDate } : {}),
      ...(spec.sourceVerification ? { sourceVerification: spec.sourceVerification } : {}),
    };

    if (spec.formula) {
      const fr = formulaRange(record);
      if (!fr) {
        skipped.push(`${id}: no dosageFormula`);
      } else {
        let formula = record.slice(fr[0], fr[1]);
        for (const [key, value] of Object.entries(spec.formula)) {
          const res = setKey(formula, key, value);
          if (res.skipped) skipped.push(`${id}.${key}: not a scalar`);
          formula = res.block;
        }
        record = record.slice(0, fr[0]) + formula + record.slice(fr[1]);
      }
    }

    for (const [key, value] of Object.entries(recordFields)) {
      const res = setKey(record, key, value);
      if (res.skipped) skipped.push(`${id}.${key}: not a scalar`);
      record = res.block;
    }

    if (record !== source.slice(start, end)) {
      source = source.slice(0, start) + record + source.slice(end);
      fileChanged = true;
      changed++;
    }
  }

  if (fileChanged && !dry) writeFileSync(path, source);
}

for (const id of Object.keys(patch)) if (!touched.has(id)) missing.push(id);

console.log(`${changed} record(s) ${dry ? 'would be ' : ''}updated`);
if (skipped.length) console.log('skipped:', skipped.join('; '));
if (missing.length) {
  console.error('NOT FOUND in any data file:', missing.join(', '));
  process.exit(1);
}
