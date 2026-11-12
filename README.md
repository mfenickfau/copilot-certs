# Copilot Cert Academy

An open-source study platform for Microsoft's AI and Copilot certifications,
built around the **official learning outcomes**. Every exam's "skills
measured" outline from Microsoft Learn is the backbone: weighted functional
groups, skills, and each individual outcome. Concepts teach those outcomes;
flashcards, true/false statements, practice quizzes and timed exam
simulations test them; an outcome checklist shows exactly what is left.

## Exams covered

| Track | Exam | Certification | Level |
|---|---|---|---|
| Microsoft 365 Copilot & Agents | AB-730 | Microsoft Certified: AI Business Professional | Fundamentals |
| | AB-900 | Microsoft 365 Certified: Copilot and Agent Administration Fundamentals | Fundamentals |
| | AB-731 | Microsoft Certified: AI Transformation Leader | Fundamentals |
| | AB-620 | Microsoft Certified: AI Agent Builder Associate (Copilot Studio) | Associate |
| | AB-650 | Microsoft 365 Certified: Microsoft 365 and AI Services Administrator Associate | Associate |
| | AB-100 | Microsoft Certified: Agentic AI Business Solutions Architect Expert | Expert |
| Azure AI & Foundry | AI-901 | Microsoft Certified: Azure AI Fundamentals | Fundamentals |
| | AI-103 | Microsoft Certified: Azure AI Apps and Agents Developer Associate | Associate |
| | AI-200 | Microsoft Certified: Azure AI Cloud Developer Associate | Associate |
| | AI-300 | Operationalizing Machine Learning and Generative AI Solutions | Associate |
| | AI-500 | Microsoft Certified: Multi-Agent AI Solutions Expert | Expert |
| GitHub Copilot & Agentic AI | GH-300 | GitHub Copilot | Professional |
| | GH-600 | GitHub Certified: Agentic AI Developer | Professional |
| | GH-700 | GitHub Certified: Agentic AI Business Professional (beta) | Professional |
| | AZ-401 | Microsoft Certified: Agentic DevOps Engineer Expert (beta) | Expert |

AI-900 and AI-102 retired on 30 June 2026 and are replaced by AI-901 and
AI-103. Industry-specific AI consultant certifications (Dynamics 365 Sales,
Contact Center, Supply Chain, SQL and Cosmos DB AI developer, SC-500) are out
of scope for now.

## What's inside

- **Outcome checklist.** All 784 official learning outcomes, grouped and
  weighted the way the exams are, with links to the concepts that teach each
  one and a tick box to track your own readiness.
- **Concepts.** Lessons with worked examples (including a realistic mistake
  and its fix), key points, diagrams and links to the official documentation.
  Each concept declares the outcome ids it covers, and the validator enforces
  that.
- **Flashcards** with Leitner spaced repetition. **Statements** for quick
  true/false drills. **Quiz** in practice mode (explanations after each item)
  or **exam simulation** mode (timer, blueprint-weighted draw, per-group score
  report).
- **Progress** stored only in your browser.

## Run it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run validate
```

## Refresh the blueprints when Microsoft updates an exam

```bash
python3 scripts/fetch-skills-measured.py
```

```bash
python3 scripts/generate-blueprints.py
```

The first script downloads and parses the official study guides into
`scripts/data/skills-measured.json`; the second regenerates
`src/content/certifications.ts`. Run `npm run validate` afterwards: it will
list any concept whose outcome ids no longer exist.

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.
In the repository settings under Pages, set the source to **GitHub Actions**.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and `docs/content-style-guide.md`.
Never contribute real exam questions; candidates sign an NDA.

## Disclaimer

Community material. Not affiliated with or endorsed by Microsoft or GitHub.
Microsoft, Microsoft 365, Copilot, Azure and GitHub are trademarks of their
respective owners. Skills measured are transcribed from the publicly available
study guides on Microsoft Learn; all teaching content, examples and questions
are original.

## License

MIT.
