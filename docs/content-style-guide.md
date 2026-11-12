# Content style guide

For anyone (human or AI) writing concepts for Copilot Cert Academy. Students
will sit proctored Microsoft exams on this material, so accuracy beats volume.

## The organising principle: official learning outcomes

Microsoft publishes a study guide for every exam with weighted **functional
groups**, each containing **skills**, each listing concrete **learning
outcomes** ("Identify...", "Configure...", "Select..."). We transcribe those
verbatim into `src/content/certifications.ts` (generated from
`scripts/data/skills-measured.json`). Every outcome has a stable id:

```
<exam>-<group>-<skill>-<outcome>   e.g. ab-730-1-2-3
```

Every concept **must** declare the outcome ids it teaches in
`Concept.outcomes`. The site uses this to show outcome-level coverage, and the
validator rejects unknown ids or outcomes outside the concept's domains. Write
concepts *from* the outcomes: read the group's outcomes first, cluster the ones
that belong together, then teach that cluster.

## Where content lives

- `src/content/types.ts` is the schema.
- `src/content/certifications.ts` is generated; never edit by hand.
- `src/content/concepts/<exam>/<concept-id>.ts` exports one `Concept`.
  Exemplar: `src/content/concepts/ab-730/how-copilot-works.ts`.
- `src/content/concepts/index.ts` registers every concept group.
- Diagrams live in `src/diagrams/` and are referenced by id.

## Shape of a good concept

| Field | Target |
|---|---|
| `outcomes` | 2 to 8 official outcome ids. Cover every outcome of the exam across the concept set. |
| `sections` | 3 to 5 sections, 80 to 250 words each. Mechanism, then tradeoffs, then the exam angle. |
| `examples` | 3 or more workplace or engineering situations with a one-sentence takeaway. At least one shows a realistic mistake and the fix. Code only where the exam is technical (AB-620, AI-*, AZ-401, GH-*). |
| `keyPoints` | 5 to 8 crisp bullets. |
| `flashcards` | 8 or more. |
| `quiz` | 5 or more Microsoft-style scenario items, four options, one or two correct; at least one "(Select two)". Explanations say why distractors are wrong. |
| `statements` | 6 or more plausible true/false claims, roughly balanced. |
| `resources` | 1 to 4 links, preferably `learn.microsoft.com` or `docs.github.com`. Verify each URL returns 200. |

## Microsoft exam style

Microsoft items are scenario based: "You are an administrator for Contoso...
You need to... What should you do?" Options are often concrete product
features, admin-center locations, or policy types. Distractors are plausible
features that solve a *different* problem (DLP instead of a sensitivity label,
Conditional Access instead of a Copilot licence, a connector instead of a
knowledge source). Prefer "most appropriate", "first action", "minimum
privilege", "least administrative effort" framings. Multiple-response items say
how many to select.

## Product facts to get right (as of November 2026)

Verify anything you are unsure about against `learn.microsoft.com` (it is
reachable from the build environment with `curl`). Names move quickly:

- **Microsoft 365 Copilot** is the licensed experience in Word, Excel,
  PowerPoint, Outlook, Teams and Copilot Chat. **Microsoft 365 Copilot Chat**
  is the chat experience (web-grounded for all users; work-grounded with a
  licence). **Copilot Cowork** performs multi-step work on the user's behalf.
  **Work IQ** is Microsoft's name for the organisational context layer
  (people, content, workflows) that grounds Copilot.
- Grounding comes from **Microsoft Graph** and the **semantic index**; Copilot
  runs with the user's permissions; prompts and responses stay in the tenant
  and are not used to train foundation models. Purview sensitivity labels,
  DLP, retention, eDiscovery and audit apply to Copilot interactions.
- **Agents**: prebuilt agents (Researcher, Analyst and others), declarative
  agents built in Copilot Studio or the Agent Builder, and custom engine
  agents. **Microsoft Copilot Studio** builds agents with knowledge sources,
  topics, tools/actions (connectors, MCP servers, Power Automate flows, agent
  flows), triggers, channels (Teams, Microsoft 365 Copilot, web, Slack and
  others), and generative orchestration. Agents are published and governed via
  the Microsoft 365 admin center and Power Platform admin center.
- **Microsoft Foundry** (formerly Azure AI Foundry) is the platform for building
  AI apps and agents on Azure: model catalog, Foundry Agent Service,
  evaluations, content safety, observability. **Azure OpenAI** models sit in
  Foundry. **Azure AI services** cover vision, language, speech, document
  intelligence and search (Azure AI Search for RAG).
- **Responsible AI**: Microsoft's six principles are fairness, reliability and
  safety, privacy and security, inclusiveness, transparency, and
  accountability. Azure AI Content Safety and prompt shields are the product
  controls; the Copilot Control System and Entra Agent ID govern agents.
- **GitHub Copilot**: plans (Free, Pro, Pro+, Business, Enterprise), surfaces
  (code completions, Copilot Chat, agent mode, coding agent that opens pull
  requests, code review), content exclusions, policies at organisation and
  enterprise level, data handling (prompts not retained for training on
  Business and Enterprise), MCP server support and custom instructions.
- Exam logistics: Microsoft role-based and fundamentals exams are scored
  1–1,000 with a 700 pass mark; fundamentals exams are around 45 minutes,
  role-based around 100–120 minutes. Item counts vary (typically 40–60).
  Renewal is a free online assessment before the one-year expiry (fundamentals
  do not expire). Do not state exact prices; they vary by country.
- **Retired**: AI-900 and AI-102 retired on 30 June 2026; AI-901 and AI-103
  replace them.

If unsure, say less rather than guess, and link the official page.

## Tone

Plain, direct, second person. Short paragraphs. Teach the why so students can
handle scenarios they have not seen.
