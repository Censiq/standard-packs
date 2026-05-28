#!/usr/bin/env node
// Validates all intensity YAML files in packs/ against schema/pack.schema.json
// Usage: node scripts/validate.js [--pack soc-triage]

'use strict';

const fs    = require('fs');
const path  = require('path');
const yaml  = require('js-yaml');
const Ajv   = require('ajv');

const ajv    = new Ajv({ allErrors: true });
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../schema/pack.schema.json'), 'utf8'));
const validate = ajv.compile(schema);

const PACK_DIR   = path.join(__dirname, '../packs');
const INTENSITIES = ['light', 'standard', 'aggressive', 'expert'];

const targetPack = process.argv.includes('--pack')
  ? process.argv[process.argv.indexOf('--pack') + 1]
  : null;

let totalFiles = 0;
let errors     = 0;

const packs = fs.readdirSync(PACK_DIR).filter(d =>
  fs.statSync(path.join(PACK_DIR, d)).isDirectory() &&
  (!targetPack || d === targetPack)
);

for (const pack of packs) {
  for (const intensity of INTENSITIES) {
    const filePath = path.join(PACK_DIR, pack, `${intensity}.yaml`);
    if (!fs.existsSync(filePath)) continue;

    totalFiles++;
    let data;
    try {
      data = yaml.load(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error(`✗ ${pack}/${intensity}.yaml — YAML parse error: ${e.message}`);
      errors++;
      continue;
    }

    const valid = validate(data);
    if (valid) {
      const rubric = data.default_rubric;
      if (rubric) {
        const sum = Object.values(rubric).reduce((a, b) => a + b, 0);
        if (Math.abs(sum - 1.0) > 0.001) {
          console.error(`✗ ${pack}/${intensity}.yaml — default_rubric weights sum to ${sum.toFixed(3)}, must equal 1.0`);
          errors++;
          continue;
        }
      }
      // Check per-scenario rubrics too
      let rubricError = false;
      for (const s of data.scenarios) {
        if (s.rubric) {
          const sum = Object.values(s.rubric).reduce((a, b) => a + b, 0);
          if (Math.abs(sum - 1.0) > 0.001) {
            console.error(`✗ ${pack}/${intensity}.yaml — scenario "${s.title}" rubric weights sum to ${sum.toFixed(3)}`);
            errors++;
            rubricError = true;
          }
        }
        if (s.is_agentic && (!s.available_actions || s.available_actions.length === 0)) {
          console.error(`✗ ${pack}/${intensity}.yaml — scenario "${s.title}" is_agentic but has no available_actions`);
          errors++;
          rubricError = true;
        }
      }
      if (!rubricError) {
        console.log(`✔ ${pack}/${intensity}.yaml — ${data.scenarios.length} scenarios`);
      }
    } else {
      console.error(`✗ ${pack}/${intensity}.yaml`);
      validate.errors.forEach(e => {
        console.error(`    ${e.instancePath || '(root)'} ${e.message}`);
      });
      errors++;
    }
  }
}

console.log('');
console.log(`${totalFiles} files checked. ${errors} error${errors !== 1 ? 's' : ''}.`);
if (errors > 0) process.exit(1);
