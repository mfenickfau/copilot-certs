# Contributing

## Add a concept

1. Open the exam's section in `src/content/certifications.ts` (generated from
   the official study guide) and pick the learning outcomes your concept will
   teach. Copy their ids (for example `ab-730-1-2-3`).
2. Copy `src/content/concepts/ab-730/how-copilot-works.ts` to
   `src/content/concepts/<exam>/<your-id>.ts` and rewrite it. Read
   `docs/content-style-guide.md` for depth targets and product facts.
3. Register it in the exam's barrel file (`_<exam>.ts` in the same folder).
4. Run the checks:

```bash
npm run validate
```

```bash
npm run build
```

5. Open a pull request. CI runs the same commands.

The validator rejects unknown outcome ids, outcomes outside the concept's
domains, bad quiz indices and missing explanations, and prints outcome
coverage per exam so you can see where material is still missing.

## Add a diagram

Diagrams are inline SVG components in `src/diagrams/*.tsx` built from
`src/diagrams/primitives.tsx`. Register them in `src/diagrams/index.tsx`.

## Keep blueprints current

When Microsoft updates a study guide, run `scripts/fetch-skills-measured.py`
then `scripts/generate-blueprints.py` and fix any concept the validator flags.

## What not to contribute

Real exam questions. Every candidate agrees to Microsoft's exam NDA. Write
original scenario questions in the official style instead.
