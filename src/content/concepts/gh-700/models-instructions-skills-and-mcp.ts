import type { Concept } from '../../types';

export const modelsInstructionsSkillsAndMcp: Concept = {
  id: 'models-instructions-skills-and-mcp',
  title: 'Choosing Models and the Right Customisation: Instructions, Prompts, Skills and MCP',
  summary:
    'How model choice changes output, cost and explainability; what Auto model selection, Copilot Fusion and session modes add; and how to tell custom instructions, prompts, skills, custom agents and MCP servers apart so you recommend the smallest customisation that solves the problem.',
  certs: ['gh-700'],
  domains: ['gh-700-1', 'gh-700-2'],
  outcomes: ['gh-700-1-1-8', 'gh-700-1-1-9', 'gh-700-1-1-10', 'gh-700-1-1-11', 'gh-700-2-1-1'],
  tags: ['models', 'auto-model-selection', 'custom-instructions', 'skills', 'mcp', 'prompt-files'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'How the model affects output and explainability',
      body: `GitHub Copilot offers many models from several providers (OpenAI, Anthropic, Google, Microsoft, xAI and others), and the model you choose changes three things: the **quality and style of the response**, the **latency**, and the **AI credits consumed**. GitHub's model comparison groups them by task:

- **Fast help with simple or repetitive tasks**: lightweight models for quick edits, summaries, formatting and short questions. Cheapest and fastest.
- **General-purpose coding and writing**: balanced defaults for everyday interactive and agentic work.
- **Deep reasoning and debugging**: models with a high reasoning ceiling for multi-step analysis, planning across layers, weighing trade-offs and large-context work. Slower and more expensive.
- **Working with visuals**: multimodal models that accept screenshots, diagrams and mock-ups.

Explainability follows the same split. Reasoning models and higher **reasoning levels** produce more structured, step-by-step rationale, which helps when a stakeholder must understand *why* a recommendation was made, but they consume more tokens. Overusing reasoning models on execution-heavy tasks can even reduce quality, because the model overthinks and introduces unnecessary changes. GitHub's rule of thumb: use as much capability as the task requires and as little as necessary. Some models also carry provider-specific behaviours or data-retention terms, which the model picker flags.`,
    },
    {
      heading: 'Choosing between models, Auto, Fusion and modes',
      body: `For a business purpose, start from the task, not the model name:

| Business task | Suitable choice |
|---|---|
| Summarise a thread, draft a status note, tidy a table | Lightweight model, or Auto with the **Efficiency** tier |
| Everyday analysis and interactive agent work | General-purpose model, or Auto with **Balance** |
| Investigate a complex incident, plan a multi-repository change | Deep-reasoning model with a higher reasoning level, or Auto **Intelligence** |
| Explain a screenshot or wireframe | A multimodal model |

**Auto model selection** routes each prompt to a suitable model based on task complexity and real-time system health, and gives paid plans a 10% discount. **Copilot Fusion** (where available) goes further: you choose an effort level (Standard, High, Max) and Copilot orchestrates one or several models, including review passes. Models can be excluded by plan, administrator policy or data-residency rules.

The exam also asks about the strengths of each **mode**. In the Copilot app and Copilot CLI the session modes are **Interactive** (collaborate step by step), **Plan** (the agent plans first, you approve, then it executes) and **Autopilot** (fully autonomous until done). Mode is separate from tool permissions. Use Plan to validate scope cheaply, Interactive when you want tight steering, and Autopilot only for a well-defined task with clear validation.`,
    },
    {
      heading: 'Instructions, prompts and skills: characteristics',
      body: `Three customisations shape *how* Copilot behaves, and they differ in scope and timing:

- **Custom instructions** are persistent guidance that applies to every request within a scope: personal, repository (\`.github/copilot-instructions.md\`, path-specific \`*.instructions.md\`, \`AGENTS.md\`) or organisation. Use them for conventions that matter almost every time (tone, naming, "always cite sources"). Keep them short; the model does not guarantee to follow every rule.
- **Prompts** are the request itself, plus **prompt files** that store a reusable, task-specific prompt you *choose* to run. They are explicit and on demand: good for "generate the monthly vendor report in our standard format".
- **Agent skills** are folders containing a \`SKILL.md\` (with required \`name\` and \`description\` frontmatter) plus optional scripts and templates. Copilot loads a skill **only when its description matches the task**, so detailed procedures do not clutter every conversation. Skills live in \`.github/skills\` (project) or \`~/.copilot/skills\` (personal) and follow an open specification shared with other AI tools.

GitHub's comparison guidance: broad conventions → instructions; a repeatable workflow or consistent output format for one kind of task → a skill; a reusable specialist with its own toolset → a custom agent; checks around tool use → hooks; access to an external system → MCP. Start with the smallest customisation that solves the problem.`,
    },
    {
      heading: 'When to recommend an MCP server',
      body: `The **Model Context Protocol (MCP)** is an open standard that lets Copilot connect to external tools and data. An MCP server adds a *collection of tools*: look up a support ticket, read a calendar, query a database, post to a chat channel. Recommend one when Copilot needs **information from** or **actions in** a system outside the repository that its built-in tools cannot reach. Do not add one when existing tools already cover the need, because every server's tool definitions are sent with each request.

Where MCP fits by surface:

- **Copilot CLI and the Copilot app**: the GitHub MCP server is built in; add others with \`/mcp add\` or from the app's Customize tab. **Copilot connectors** are GitHub-verified MCP servers you connect once and reuse across surfaces.
- **Copilot cloud agent, automations and code review**: repository administrators configure servers in repository settings; the GitHub and Playwright servers are present by default; only MCP *tools* are supported (not resources or prompts); the agent uses tools autonomously without asking, so allow only what the task needs.
- **Agentic workflows**: declare servers in frontmatter or import shared definitions.

Governance: for Copilot Business and Enterprise the **MCP servers in Copilot** policy is disabled by default and must be enabled by an administrator; MCP tools from a repository configuration can reach whatever the server's credentials allow, so review scope before enabling.`,
    },
  ],
  examples: [
    {
      title: 'Picking a model for a board summary versus a root-cause analysis',
      description:
        'A product manager uses Copilot Chat twice in one morning. First she asks for a 120-word summary of a release discussion; a lightweight model (or Auto on the Efficiency tier) answers in seconds at minimal cost. Later she asks Copilot to work through three weeks of incident issues, correlate them with deploys and explain the likely root cause; she switches to a deep-reasoning model with a higher reasoning level because she needs the step-by-step rationale to present to engineering.',
      takeaway: 'Choose capability by task complexity and by how much explanation the audience needs.',
    },
    {
      title: 'Instructions that became a 40-page skill (a realistic mistake)',
      description:
        'An operations team pastes its entire incident-review procedure into .github/copilot-instructions.md. Every Copilot request now carries thousands of unrelated tokens, answers get slower and the model starts ignoring parts of the file. The fix is to keep two or three broad conventions in the instructions file and move the procedure into .github/skills/incident-review/SKILL.md with a clear description, so Copilot loads it only when someone asks for an incident review.',
      language: 'markdown',
      code: `---
name: incident-review
description: Produce a post-incident review using the ops template. Use when asked to review, write up or analyse an incident.
---
1. Read the incident issue and linked pull requests.
2. Fill in TEMPLATE.md in this folder: timeline, impact, root cause, actions.
3. Keep the summary under 200 words and list owners for every action.`,
      takeaway: 'Instructions are for always-on conventions; skills are for detailed procedures loaded on demand.',
    },
    {
      title: 'When a prompt is not enough: the support ticket lookup',
      description:
        'A business analyst keeps copying ticket details from the support desk into Copilot Chat. A better prompt will not help, because the data lives outside GitHub. The right recommendation is an MCP server for the support system (or a GitHub-verified connector if one exists), configured at repository level by an administrator if the whole team needs it, with only the read tools enabled.',
      takeaway: 'Recommend MCP when the gap is access to an external system, not wording.',
    },
  ],
  keyPoints: [
    'Model choice changes response quality, latency, explainability and AI credits; GitHub groups models into fast, general-purpose, deep-reasoning and multimodal tasks.',
    'Higher reasoning levels improve rationale for complex problems but cost more tokens; use the regular level by default.',
    'Auto model selection routes by task complexity and system health (10% discount on paid plans); Copilot Fusion adds effort levels and multi-model review passes.',
    'Session modes: Interactive (collaborate), Plan (approve before execution), Autopilot (autonomous); mode is separate from tool permissions.',
    'Custom instructions = always-on conventions; prompts and prompt files = explicit requests on demand; skills = SKILL.md folders loaded when the description matches.',
    'Recommend an MCP server when Copilot needs data or actions from an external system; do not add one if built-in tools suffice.',
    'For Business and Enterprise, the MCP servers policy is disabled by default; repository-level MCP applies to cloud agent, automations and code review, and agents call those tools without asking.',
  ],
  flashcards: [
    { front: 'Name the four task groups GitHub uses to compare Copilot models.', back: 'Fast help with simple or repetitive tasks; general-purpose coding and writing; deep reasoning and debugging; working with visuals.' },
    { front: 'What does a higher reasoning level trade off?', back: 'Better answers on complex problems and more visible step-by-step rationale, in exchange for more tokens (AI credits) and latency.' },
    { front: 'What is Auto model selection and what discount does it carry?', back: 'Copilot picks the model per prompt based on task complexity and system health; paid plans get a 10% discount on model costs. Tiers: Efficiency, Balance, Intelligence.' },
    { front: 'What are the three session modes in the Copilot app and Copilot CLI?', back: 'Interactive (collaborative), Plan (agent plans, you approve), Autopilot (fully autonomous).' },
    { front: 'Where do repository-wide custom instructions live?', back: 'In .github/copilot-instructions.md (path-specific ones in .github/instructions/*.instructions.md; agent instructions in AGENTS.md).' },
    { front: 'What two frontmatter fields are required in a SKILL.md file?', back: 'name (lowercase, hyphens) and description (what it does and when Copilot should use it).' },
    { front: 'When does Copilot load a skill?', back: 'When the task matches the skill\'s description, or when you reference it explicitly with /skill-name in a prompt.' },
    { front: 'When should you recommend an MCP server?', back: 'When Copilot needs information from, or actions in, an external system that built-in tools cannot reach.' },
    { front: 'Which MCP servers does Copilot cloud agent start with by default?', back: 'The GitHub MCP server (read-only token scoped to the repository) and the Playwright MCP server (localhost only).' },
    { front: 'Is the "MCP servers in Copilot" policy on by default for Copilot Business and Enterprise?', back: 'No, it is disabled by default and must be enabled by an administrator.' },
  ],
  quiz: [
    {
      question:
        'A project manager needs Copilot to reformat a list of 30 action items into a table with owner and due-date columns. She wants the lowest cost and fastest response. Which choice is MOST appropriate?',
      options: [
        'A deep-reasoning model with the highest reasoning level',
        'A lightweight model, or Auto model selection on the Efficiency tier',
        'A multimodal model so she can attach a screenshot of the list',
        'Copilot Fusion at the Max effort level',
      ],
      correct: [1],
      explanation:
        'A routine, well-scoped reformatting task suits a fast, cost-efficient model. Reasoning models and Fusion Max add cost without improving a simple table, and a multimodal model is only needed when the input is an image.',
    },
    {
      question:
        'Which TWO statements correctly describe differences between custom instructions and agent skills? (Select two)',
      options: [
        'Custom instructions apply to every request in their scope, while a skill loads only when its description matches the task',
        'Skills are stored as SKILL.md files in folders such as .github/skills, while repository instructions live in .github/copilot-instructions.md',
        'Skills guarantee the model follows every rule, while instructions are advisory',
        'Custom instructions can include executable scripts, while skills are text only',
      ],
      correct: [0, 1],
      explanation:
        'Scope and location are the real differences. Neither customisation guarantees compliance, and it is skills, not instructions, that can bundle scripts and resources.',
    },
    {
      question:
        'An analyst wants Copilot to answer "how many open support tickets mention Product X this month?" directly from the help-desk system. What should you recommend?',
      options: [
        'Write a more detailed prompt describing the help-desk data model',
        'Add a custom instruction telling Copilot the help-desk URL',
        'Configure an MCP server (or GitHub-verified connector) for the help-desk system with read tools enabled',
        'Create a skill named help-desk-counts',
      ],
      correct: [2],
      explanation:
        'The gap is access to an external system, which is exactly what MCP provides. Prompts, instructions and skills shape behaviour but cannot fetch live data from another service.',
    },
    {
      question:
        'An operations lead must present the reasoning behind an agent\'s recommendation to auditors. Which configuration choice best improves the explainability of the output?',
      options: [
        'Use a lightweight model to keep the answer short',
        'Use a reasoning-capable model with a higher reasoning level and ask for the rationale step by step',
        'Disable custom instructions so the model is not biased',
        'Switch the session to Autopilot mode',
      ],
      correct: [1],
      explanation:
        'Reasoning models and higher reasoning levels produce more structured rationale. Lightweight models prioritise speed, instructions do not reduce explainability, and Autopilot controls continuation, not explanation.',
    },
    {
      question:
        'A Copilot Business user cannot see any MCP servers in Copilot cloud agent even though a colleague on an individual plan can. What is the MOST likely cause?',
      options: [
        'MCP requires a GitHub Enterprise Cloud subscription',
        'The organisation has not enabled the "MCP servers in Copilot" policy, which is disabled by default',
        'The repository has more than 50 MCP servers configured',
        'The user is using Auto model selection, which blocks MCP tools',
      ],
      correct: [1],
      explanation:
        'For Business and Enterprise plans the MCP policy is off by default and governs members\' access; individual plans are not governed by it. The 50-server cap and model selection do not hide MCP entirely.',
    },
  ],
  statements: [
    { text: 'Using the most capable reasoning model for every task always produces the best results.', isTrue: false, explanation: 'GitHub notes that overusing reasoning models on execution-heavy tasks can increase cost and even reduce quality by overthinking.' },
    { text: 'Auto model selection gives paid Copilot plans a 10% discount on model costs.', isTrue: true, explanation: 'The discount applies while using Auto in Copilot Chat or Copilot cloud agent.' },
    { text: 'A skill\'s description tells Copilot when to load the skill.', isTrue: true, explanation: 'Copilot decides to use a skill based on the prompt and the skill\'s description, or when you call it explicitly.' },
    { text: 'Plan mode automatically grants the agent permission to use every tool.', isTrue: false, explanation: 'Session mode and tool permissions are separate controls.' },
    { text: 'Copilot cloud agent supports MCP tools but not MCP resources or prompts.', isTrue: true, explanation: 'Cloud agent and code review only support tools from MCP servers.' },
    { text: 'You should add an MCP server whenever possible so Copilot has maximum context.', isTrue: false, explanation: 'Large tool sets add tokens to every request; add a server only when built-in tools do not cover the need.' },
  ],
  resources: [
    { label: 'AI model comparison', url: 'https://docs.github.com/en/copilot/reference/ai-models/model-comparison' },
    { label: 'About GitHub Copilot auto model selection', url: 'https://docs.github.com/en/copilot/concepts/models/auto-model-selection' },
    { label: 'Comparing Copilot customization features', url: 'https://docs.github.com/en/copilot/concepts/customizations/comparing-customizations' },
    { label: 'Model Context Protocol (MCP)', url: 'https://docs.github.com/en/copilot/concepts/context/mcp' },
  ],
};
