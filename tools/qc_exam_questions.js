#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('app.js', 'utf8');
const start = source.indexOf('const examTrainerQuestions = [');
if (start < 0) throw new Error('Could not find examTrainerQuestions in app.js');
const arrayStart = source.indexOf('[', start);
let depth = 0;
let arrayEnd = -1;
for (let i = arrayStart; i < source.length; i += 1) {
  const ch = source[i];
  if (ch === '[') depth += 1;
  if (ch === ']') {
    depth -= 1;
    if (depth === 0) {
      arrayEnd = i + 1;
      break;
    }
  }
}
if (arrayEnd < 0) throw new Error('Could not parse examTrainerQuestions array');

const questions = vm.runInNewContext(`(${source.slice(arrayStart, arrayEnd)})`);
const written = questions.filter((question) => question.kind === 'written');
const units = ['7C Muscles and bones', '7F Acids and alkalis', '7J Current electricity'];
const forbiddenWrittenVisuals = new Set([
  'litmus-test',
  'ph-scale',
  'hazard-symbols',
  'indicator-palette',
  'circuit-comparison',
  'circuit-short-mistake',
  'alveolus-gas-exchange',
]);
const expectedVisuals = {
  'exam-7c-alveoli-adaptations': 'alveolus-gas-exchange-blank',
  'exam-7c-double-circulation': 'double-circulation',
  'exam-7f-litmus': undefined,
  'exam-7f-universal-indicator': 'indicator-palette-blank',
  'exam-7j-model-limits': 'central-heating-model',
  'exam-7j-complete-circuit': 'circuit-series',
  'exam-7j-series-vs-parallel': 'circuit-comparison-blank',
  'exam-7j-short-circuit': 'circuit-short-mistake-blank',
};

const failures = [];
if (written.length < 15) failures.push(`Expected at least 15 written questions; found ${written.length}.`);
for (const unit of units) {
  const count = written.filter((question) => question.unit === unit).length;
  if (count < 5) failures.push(`Expected at least 5 written questions for ${unit}; found ${count}.`);
}
for (const question of written) {
  if (!question.answer || !question.conciseAnswer || !question.explanation) {
    failures.push(`${question.id} is missing answer, conciseAnswer, or explanation.`);
  }
  if (question.visual && forbiddenWrittenVisuals.has(question.visual)) {
    failures.push(`${question.id} uses answer-revealing written-exam visual: ${question.visual}.`);
  }
}
for (const [id, expected] of Object.entries(expectedVisuals)) {
  const question = questions.find((candidate) => candidate.id === id);
  if (!question) failures.push(`Missing expected question ${id}.`);
  else if (question.visual !== expected) failures.push(`${id} visual expected ${expected || '(none)'}, found ${question.visual || '(none)'}.`);
}

if (!source.includes('function renderExamVisual(key)')) failures.push('Missing renderExamVisual guard.');
if (!source.includes('function alveolusGasExchangeBlankSvg()')) failures.push('Missing blank alveolus exam visual.');
if (!source.includes('function circuitComparisonBlankSvg()')) failures.push('Missing blank circuit comparison exam visual.');
if (!source.includes('function circuitShortMistakeBlankSvg()')) failures.push('Missing blank short-circuit exam visual.');

if (failures.length) {
  console.error('Exam question QC failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Exam question QC passed: ${written.length} written questions across ${units.length} units.`);
for (const unit of units) {
  const count = written.filter((question) => question.unit === unit).length;
  console.log(`- ${unit}: ${count} written questions`);
}
const withVisuals = written.filter((question) => question.visual).length;
console.log(`- Companion graphics: ${withVisuals}/${written.length}`);
