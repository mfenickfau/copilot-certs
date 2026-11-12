/**
 * Content validator. Run with `npm run validate`.
 *
 * Checks every registered concept against the schema rules in
 * docs/content-style-guide.md so broken or thin content fails CI instead of
 * reaching students.
 */
import { allConcepts } from '../src/content/concepts';
import { certifications } from '../src/content/certifications';
import { diagrams } from '../src/diagrams';

const certIds = new Set(certifications.map((c) => c.id));
const domainIds = new Set(certifications.flatMap((c) => c.domains.map((d) => d.id)));
const outcomeIds = new Set(certifications.flatMap((c) => c.domains.flatMap((d) => d.skills.flatMap((s) => s.outcomes.map((o) => o.id)))));
const diagramIds = new Set(Object.keys(diagrams));

const errors: string[] = [];
const warnings: string[] = [];
const seen = new Set<string>();

for (const c of allConcepts) {
  const where = `[${c.id}]`;
  if (!/^[a-z0-9-]+$/.test(c.id)) errors.push(`${where} id must be lowercase kebab-case`);
  if (seen.has(c.id)) errors.push(`${where} duplicate id`);
  seen.add(c.id);
  if (!c.certs.length) errors.push(`${where} needs at least one cert`);
  for (const id of c.certs) if (!certIds.has(id)) errors.push(`${where} unknown cert "${id}"`);
  if (!c.domains.length) errors.push(`${where} needs at least one domain`);
  for (const d of c.domains) if (!domainIds.has(d)) errors.push(`${where} unknown domain "${d}"`);
  for (const id of c.certs) {
    if (!c.domains.some((d) => d.startsWith(id + '-'))) errors.push(`${where} lists cert ${id} but no ${id} domain`);
  }
  for (const d of c.domains) {
    const cert = d.replace(/-\d+$/, '');
    if (!c.certs.includes(cert as (typeof c.certs)[number])) errors.push(`${where} domain ${d} but cert ${cert} not listed`);
  }
  if (c.diagram && !diagramIds.has(c.diagram)) errors.push(`${where} unknown diagram "${c.diagram}"`);
  if (!c.outcomes.length) errors.push(`${where} must list at least one official learning outcome id`);
  for (const o of c.outcomes) {
    if (!outcomeIds.has(o)) errors.push(`${where} unknown outcome id "${o}"`);
    else if (!c.domains.some((d) => o.startsWith(d + '-'))) errors.push(`${where} outcome ${o} is not under any listed domain`);
  }

  if (c.sections.length < 3) warnings.push(`${where} only ${c.sections.length} sections (want 3+)`);
  if (c.examples.length < 3) warnings.push(`${where} only ${c.examples.length} examples (want 3+)`);
  if (c.keyPoints.length < 5) warnings.push(`${where} only ${c.keyPoints.length} key points (want 5+)`);
  if (c.flashcards.length < 8) warnings.push(`${where} only ${c.flashcards.length} flashcards (want 8+)`);
  if (c.quiz.length < 5) warnings.push(`${where} only ${c.quiz.length} quiz questions (want 5+)`);
  if (c.statements.length < 6) warnings.push(`${where} only ${c.statements.length} statements (want 6+)`);

  c.quiz.forEach((q, i) => {
    const w = `${where} quiz #${i + 1}`;
    if (q.options.length < 3 || q.options.length > 6) errors.push(`${w} must have 3–6 options`);
    if (!q.correct.length) errors.push(`${w} has no correct answer`);
    for (const k of q.correct) if (k < 0 || k >= q.options.length) errors.push(`${w} correct index ${k} out of range`);
    if (new Set(q.correct).size !== q.correct.length) errors.push(`${w} duplicate correct indices`);
    if (q.correct.length >= q.options.length) errors.push(`${w} every option is correct`);
    if (!q.explanation?.trim()) errors.push(`${w} missing explanation`);
    if (q.options.some((o) => /^(all|none) of the above/i.test(o))) warnings.push(`${w} uses an "of the above" option`);
  });
  const trueCount = c.statements.filter((s) => s.isTrue).length;
  if (c.statements.length >= 6 && (trueCount === 0 || trueCount === c.statements.length)) {
    warnings.push(`${where} statements are all ${trueCount ? 'true' : 'false'}; mix them`);
  }
  c.statements.forEach((s, i) => {
    if (!s.explanation?.trim()) errors.push(`${where} statement #${i + 1} missing explanation`);
  });
  c.flashcards.forEach((f, i) => {
    if (!f.front.trim() || !f.back.trim()) errors.push(`${where} flashcard #${i + 1} has an empty side`);
  });
  c.resources.forEach((r) => {
    if (!/^https:\/\//.test(r.url)) errors.push(`${where} resource "${r.label}" must be an https URL`);
  });
}

const totals = {
  concepts: allConcepts.length,
  flashcards: allConcepts.reduce((n, c) => n + c.flashcards.length, 0),
  quiz: allConcepts.reduce((n, c) => n + c.quiz.length, 0),
  statements: allConcepts.reduce((n, c) => n + c.statements.length, 0),
  examples: allConcepts.reduce((n, c) => n + c.examples.length, 0),
};

console.log('Content totals:', totals);
for (const cert of certifications) {
  const list = allConcepts.filter((c) => c.certs.includes(cert.id));
  const outs = cert.domains.flatMap((d) => d.skills.flatMap((s) => s.outcomes));
  const covered = outs.filter((o) => allConcepts.some((c) => c.outcomes.includes(o.id))).length;
  console.log(`  ${cert.code}: ${list.length} concepts · ${covered}/${outs.length} outcomes covered`);
}
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log('  - ' + w);
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('\nContent OK.');
