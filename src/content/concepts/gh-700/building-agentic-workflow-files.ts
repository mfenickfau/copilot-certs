import type { Concept } from '../../types';

export const buildingAgenticWorkflowFiles: Concept = {
  id: 'building-agentic-workflow-files',
  title: 'Building GitHub Agentic Workflow Files: Frontmatter, Folder Structure, Instructions and Self-Critique',
  summary:
    'The anatomy of a GitHub Agentic Workflow: a Markdown file in .github/workflows with YAML frontmatter for triggers, schedule, permissions, tools and safe outputs, compiled with gh aw into a lock file; how to organise the folder, write the natural-language instructions, and build self-critique loops that check the work before it is published.',
  certs: ['gh-700'],
  domains: ['gh-700-3'],
  outcomes: ['gh-700-3-2-1', 'gh-700-3-2-2', 'gh-700-3-2-3', 'gh-700-3-2-4', 'gh-700-3-2-5'],
  tags: ['agentic-workflows', 'gh-aw', 'frontmatter', 'safe-outputs', 'self-critique', 'github-actions'],
  difficulty: 'intermediate',
  diagram: 'agentic-sdlc',
  sections: [
    {
      heading: 'Creating agentic workflow files',
      body: `A **GitHub Agentic Workflow** is a Markdown file with two parts: **YAML frontmatter** between \`---\` markers that configures *when it runs, what it may do and which AI engine runs it*, and a **Markdown body** containing the natural-language instructions the agent follows. The file lives in \`.github/workflows/NAME.md\` and is **compiled** into a normal GitHub Actions workflow, \`NAME.lock.yml\`, by the GitHub CLI extension \`gh aw\` (\`gh extension install github/gh-aw\`). You commit **both** files to the default branch, then run the workflow from its trigger, the Actions tab, or \`gh aw run NAME\`.

Three ways to create one:

1. **With a coding agent (recommended)**: run \`gh aw init\` once to add authoring skills, instructions and a custom agent to the repository, then in Copilot CLI or VS Code agent mode prompt \`/agentic-workflows Create a workflow that ...\`. The agent writes the Markdown, compiles the lock file and asks you to review and commit.
2. **Import a pre-built workflow**: \`gh aw add-wizard githubnext/agentics/daily-repo-status\` checks prerequisites, configures the engine secret, generates and compiles the files and opens a pull request. Imported workflows keep a \`source:\` field so \`gh aw update\` can pull upstream changes; only import from sources you trust.
3. **Manually or in the GitHub web interface**, then \`gh aw compile\`.

Requirements: Actions enabled, write access, GitHub CLI authenticated with \`repo,workflow\` scopes, and an AI engine account. GitHub Copilot is the default engine; Anthropic Claude, OpenAI Codex and Google Gemini are also supported, each with its own secret. In organisation-owned repositories with a Copilot plan, add \`copilot-requests: write\` to permissions to bill the organisation through the built-in \`GITHUB_TOKEN\` instead of a personal token.`,
    },
    {
      heading: 'Configuring workflow, schedule, permissions and output',
      body: `Key frontmatter fields:

| Field | Purpose |
|---|---|
| \`on:\` | Trigger. Same events as Actions (\`issues\`, \`pull_request\`, \`workflow_dispatch\`, \`slash_command\`, \`label_command\`) plus human-friendly schedules: \`daily\`, \`weekly on monday\`, \`daily around 14:00\`, \`daily between 9:00 and 17:00 utc-5\`, or cron. Fuzzy schedules scatter run times to avoid load spikes. |
| \`permissions:\` | Repository permissions for the agent job. Defaults to **read-only**; add \`copilot-requests: write\` for organisation billing. |
| \`engine:\` | \`copilot\` (default), \`claude\`, \`codex\` or \`gemini\`. |
| \`network:\` | Which hosts the agent may reach (\`defaults\` is the safe baseline). |
| \`tools:\` | Toolsets such as \`github: toolsets: [issues]\` and MCP servers. |
| \`safe-outputs:\` | The **only** way the workflow writes: \`create-issue\`, \`add-comment\`, \`create-pull-request\`, \`add-labels\`, \`set-issue-type\`, \`set-issue-field\`, \`assign-to-user\`, \`close-issue\`, \`update-project\` and more. The agent *requests* an action; a separate job with scoped write permission executes it after validation and threat detection. If no safe outputs are declared, \`create-issue\` is enabled with conservative defaults. |
| \`max-ai-credits:\` | Cap inference per run (default 1,000 AI credits); \`max-turns:\` caps agent turns; \`timeout-minutes:\` bounds the agentic step (default 20). |
| \`roles:\` | Who may trigger it; defaults to trusted roles (admin, maintainer, write). |

For issue-changing outputs, \`issue-intent: true\` requires the agent to attach a rationale and confidence level, feeding the repository's approvals panel. Whenever frontmatter changes, recompile with \`gh aw compile\` and commit both files; open a pull request so Actions checks verify the result.`,
    },
    {
      heading: 'Configuring the folder structure',
      body: `A tidy repository makes workflows discoverable and reviewable:

\`\`\`
.github/
  workflows/
    weekly-status.md          # agentic workflow source (edit this)
    weekly-status.lock.yml    # compiled Actions workflow (generated, do not edit)
    shared/
      common-tools.md         # reusable fragments pulled in with imports:
      mcp/support-desk.md     # shared MCP server definition
    aw.json                   # repository-wide gh aw settings, e.g. strict mode
  agents/                     # custom agent profiles (.agent.md)
  skills/                     # agent skills (SKILL.md folders)
  instructions/               # path-specific *.instructions.md
  copilot-instructions.md     # repository-wide instructions
\`\`\`

Conventions from the documentation: use descriptive kebab-case names (\`issue-responder.md\`, \`weekly-summary.md\`), avoid spaces and special characters, never hand-edit a lock file (its header says "DO NOT EDIT" and lists the secrets and actions it uses), and commit source and lock files together. The \`imports:\` field (or \`{{#import}}\` in the body) composes shared tools, steps, MCP servers and prompt fragments from other files, so common configuration lives once under \`shared/\`. \`gh aw init\` adds authoring skills and instructions in the same tree. Workflows marked \`private: true\` cannot be imported elsewhere. Treat the structure like any other versioned asset: changes arrive through pull requests, and reviewers look at the Markdown source rather than the generated YAML.`,
    },
    {
      heading: 'Writing the instructions (the Markdown body)',
      body: `The body is a prompt the agent reads on every run, so write it the way you would brief a careful new colleague:

- **Goal and context first**: what the workflow is for and which data to read ("Review issue activity from the last 7 days in this repository").
- **Concrete deliverable**: the exact output and its structure ("Create one issue with: totals opened and closed, top recurring themes, notable issues needing attention, two or three recommendations").
- **Decision criteria** as explicit rules and thresholds, plus boundaries ("Never close issues").
- **Tone and length**: "Keep the report concise and action-oriented."
- **Use of inputs**: reference \`workflow_dispatch\` inputs or the triggering issue; say what to ignore (bots, drafts).
- **Stopping condition**: when the run is complete.

Keep the body focused; move reusable procedures into skills (\`skills:\` frontmatter) and long-lived conventions into repository instructions. Because the body is natural language, it is reviewable by non-developers in a pull request, which is the point: the business owner of the process can propose and approve changes to the instructions without touching YAML.`,
    },
    {
      heading: 'Configuring self-critique loops',
      body: `A self-critique loop makes the agent check its own work against criteria before anything is written. Several mechanisms stack:

1. **Instruction-level critique**: add an explicit review step to the body: "Before creating the issue, re-read your draft against the checklist: every claim cites an issue or pull request number, no section exceeds 150 words, recommendations have an owner. Fix any gap, then proceed." This is cheap and works with any engine.
2. **Structured verification**: require the output format and have a later step validate it; dynamic workflows can ask agents to correct a malformed format and can have subagents verify each other's findings.
3. **Independent critic**: the **rubber duck** agent in Copilot CLI and the app runs on a *different model family* and returns blocking, non-blocking and suggestion-level findings; enable proactive invocation via \`/subagents\` so it is consulted after planning and after tests. Copilot cloud agent gets a second opinion from **Copilot code review** on its pull requests by default.
4. **Evaluator automations**: self-improving automation groups where some automations do the work and others evaluate outcomes and propose improvements to prompts, tools or triggers, which you accept or dismiss.
5. **Platform checks**: safe-output **threat detection** scans proposed writes, and rationale/confidence metadata routes low-confidence changes to human review.

Design rule: critique costs extra model calls, so apply it at high-leverage moments (after planning, before publishing) rather than on every trivial step, and cap runs with \`max-turns\` and \`max-ai-credits\` so a loop cannot run away.`,
    },
  ],
  examples: [
    {
      title: 'A weekly issue-activity report, end to end',
      description:
        'A program manager asks Copilot CLI with /agentic-workflows to create a Monday report. The generated file declares a fuzzy weekly schedule, read-only issue access, organisation billing, the issues toolset and a single safe output, then gives concise instructions with a built-in self-check.',
      language: 'markdown',
      code: `---
on: weekly on monday
permissions:
  issues: read
  copilot-requests: write
network: defaults
tools:
  github:
    toolsets: [issues]
safe-outputs:
  create-issue:
max-ai-credits: 150
---
# Weekly issue activity report
Review issue activity from the last 7 days in this repository.
Create one GitHub issue containing: issues opened and closed, top recurring
themes, notable issues still needing attention, and 2-3 recommendations.
Before creating the issue, check your draft: every theme cites at least one
issue number, no section exceeds 150 words, each recommendation names an owner.
Keep the report concise and action-oriented.`,
      takeaway: 'Frontmatter sets trigger, permissions, tools, output and cost cap; the body carries goal, structure, criteria and a self-check.',
    },
    {
      title: 'Editing the lock file by hand (a realistic mistake)',
      description:
        'An analyst wants the report on Fridays, opens weekly-status.lock.yml and changes the cron. The next time someone runs gh aw compile the change is overwritten, and in strict mode the mismatch fails checks. The fix is to edit the frontmatter in weekly-status.md (on: weekly on friday), run gh aw compile, and commit both files through a pull request.',
      takeaway: 'The Markdown file is the source of truth; the lock file is generated and must not be edited.',
    },
    {
      title: 'Adding a critic before publishing a customer-facing summary',
      description:
        'A support lead\'s workflow drafts release notes for customers. After one embarrassing inaccuracy, she adds a two-stage design: the drafting agent produces the notes, a second step instructs a reviewer agent on a different model to check every statement against linked pull requests and list blocking issues, and only when the reviewer reports none does the safe output post the comment. She also sets issue-intent so label changes carry rationale and confidence.',
      takeaway: 'Self-critique is strongest when an independent reviewer with different blind spots gates the write step.',
    },
  ],
  keyPoints: [
    'An agentic workflow is .github/workflows/NAME.md (frontmatter + Markdown instructions) compiled by gh aw into NAME.lock.yml; commit both to the default branch and never edit the lock file.',
    'Create with gh aw init plus the /agentic-workflows skill in a coding agent, import with gh aw add-wizard OWNER/REPO/WORKFLOW, or write manually and run gh aw compile.',
    'Frontmatter: on (events or fuzzy schedules such as daily, weekly on monday), permissions (read-only by default; copilot-requests: write for organisation billing), engine (copilot default), network, tools, safe-outputs, max-ai-credits (default 1,000), max-turns, timeout-minutes, roles.',
    'Safe outputs are the only write path: the agent requests, a separate scoped job validates and executes after threat detection.',
    'Folder structure: workflows and lock files side by side, shared/ fragments via imports, aw.json settings, plus .github/agents, .github/skills and instructions files.',
    'Instructions should state goal, data, deliverable structure, decision criteria, tone, length and a stopping condition in plain language reviewable by non-developers.',
    'Self-critique loops: an explicit review step in the instructions, format verification, an independent critic on a different model (rubber duck, code review), evaluator automations, and platform threat detection; cap turns and credits.',
  ],
  flashcards: [
    { front: 'Where does an agentic workflow source file live and what is generated from it?', back: 'In .github/workflows/NAME.md; gh aw compile generates NAME.lock.yml, the GitHub Actions workflow that actually runs.' },
    { front: 'What are the two parts of an agentic workflow file?', back: 'YAML frontmatter (triggers, permissions, tools, safe outputs, engine) and a Markdown body with natural-language instructions.' },
    { front: 'Which command imports a pre-built workflow and sets up secrets interactively?', back: 'gh aw add-wizard OWNER/REPO/WORKFLOW-NAME, for example githubnext/agentics/daily-repo-status.' },
    { front: 'What does gh aw init do?', back: 'Adds skills, instructions and a custom agent for agentic workflow authoring so coding agents can create and edit workflows effectively.' },
    { front: 'What is the default permission level of an agentic workflow?', back: 'Read-only (read-all); write operations happen only through declared safe outputs.' },
    { front: 'Give two human-friendly schedule expressions supported in frontmatter.', back: 'daily, weekly on monday (also daily around 14:00, daily between 9:00 and 17:00, every 2h, or cron).' },
    { front: 'What happens when no safe-outputs are declared?', back: 'create-issue is enabled automatically with conservative defaults (max 1, labels and title prefix set to the workflow ID).' },
    { front: 'What does issue-intent: true on a safe output require?', back: 'That the agent attaches a rationale and confidence level; the workflow fails if it omits them.' },
    { front: 'Which built-in critic runs on a different model family from the session model?', back: 'The rubber duck agent in Copilot CLI and the Copilot app.' },
    { front: 'Why should you cap max-turns and max-ai-credits when adding critique loops?', back: 'Each critique pass adds model calls; caps prevent a loop from running away in time or cost.' },
  ],
  quiz: [
    {
      question:
        'A business analyst with no coding background needs to add a workflow that posts a daily repository status issue. Which approach is recommended by GitHub and requires the least manual YAML?',
      options: [
        'Write the .lock.yml file by hand in the Actions tab',
        'Run gh aw add-wizard githubnext/agentics/daily-repo-status and review the pull request it opens',
        'Create a project built-in workflow',
        'Ask Copilot Chat on GitHub.com to post an issue every day',
      ],
      correct: [1],
      explanation:
        'The add-wizard imports a trusted pre-built workflow, handles engine authentication, compiles the lock file and opens a pull request. Hand-writing lock files is wrong, project workflows cannot write reports, and chat does not run on a schedule.',
    },
    {
      question:
        'A workflow should run every Monday, read issues, and create exactly one summary issue, with inference costs billed to the organisation. Which frontmatter is correct?',
      options: [
        'on: weekly on monday; permissions: issues: read, copilot-requests: write; safe-outputs: create-issue:',
        'on: push; permissions: write-all; safe-outputs: none',
        'on: weekly on monday; permissions: contents: write; tools: shell',
        'on: issues; permissions: issues: write',
      ],
      correct: [0],
      explanation:
        'A fuzzy weekly schedule, read-only issue access, copilot-requests: write for organisation billing and a create-issue safe output match the requirement. The other options use wrong triggers or grant write permissions directly instead of through safe outputs.',
    },
    {
      question:
        'Which TWO statements about the agentic workflow folder structure are correct? (Select two)',
      options: [
        'The .lock.yml file is generated and should not be edited by hand',
        'Reusable fragments can be placed under .github/workflows/shared and pulled in with imports',
        'Agentic workflow source files must be stored in the repository wiki',
        'Custom agent profiles are stored inside the .lock.yml file',
      ],
      correct: [0, 1],
      explanation:
        'Lock files are compiler output, and shared fragments are composed through imports. Workflows live in .github/workflows, not the wiki, and agent profiles live in .github/agents.',
    },
    {
      question:
        'A team wants an independent check that the agent\'s draft release notes are accurate before they are posted, using a reviewer unlikely to share the drafting model\'s blind spots. Which design is MOST appropriate?',
      options: [
        'Raise the drafting model\'s reasoning level and skip review',
        'Add a reviewing step on a different model (for example the rubber duck agent or a reviewer agent) that must report no blocking issues before the safe output runs',
        'Set max-ai-credits to 10 so the agent cannot write much',
        'Grant the workflow contents: write so it can fix mistakes later',
      ],
      correct: [1],
      explanation:
        'An independent critic on a different model family is GitHub\'s recommended way to reduce single-model blind spots. More reasoning does not add independence, a tiny credit cap just truncates work, and extra write permission reduces safety.',
    },
    {
      question:
        'After changing the schedule in the frontmatter of weekly-status.md, what must you do before the new schedule takes effect?',
      options: [
        'Nothing; GitHub reads the Markdown file directly',
        'Run gh aw compile to regenerate weekly-status.lock.yml and commit both files to the default branch',
        'Delete the lock file so Actions falls back to the Markdown',
        'Re-run gh aw init',
      ],
      correct: [1],
      explanation:
        'Actions executes the compiled lock file, so frontmatter changes require recompilation and committing both files. gh aw init only adds authoring aids, and deleting the lock file removes the workflow.',
    },
  ],
  statements: [
    { text: 'GitHub Agentic Workflows execute natural-language instructions with contextual reasoning while guardrails such as triggers, permissions and safe outputs are declared in frontmatter.', isTrue: true, explanation: 'This is the documented split between frontmatter and Markdown body.' },
    { text: 'Agentic workflows have write access to the repository by default.', isTrue: false, explanation: 'They are read-only by default; writes happen only through declared safe outputs.' },
    { text: 'GitHub Copilot is the default engine, and Claude, Codex and Gemini are also supported.', isTrue: true, explanation: 'The engine field selects the AI engine; each needs its own authentication.' },
    { text: 'Secrets are exposed directly to the agent runtime so it can call external APIs.', isTrue: false, explanation: 'Sensitive credentials stay in isolated downstream jobs, outside the agent runtime.' },
    { text: 'The default max-ai-credits cap per run is 1,000 AI credits.', isTrue: true, explanation: 'You can lower it in frontmatter to control cost.' },
    { text: 'The rubber duck agent edits files directly to fix the issues it finds.', isTrue: false, explanation: 'It has read-only access and returns a critique; the main agent decides what to change.' },
  ],
  resources: [
    { label: 'Creating GitHub Agentic Workflows', url: 'https://docs.github.com/en/copilot/how-tos/github-agentic-workflows/creating-github-agentic-workflows' },
    { label: 'Your first agentic workflow (quickstart)', url: 'https://docs.github.com/en/copilot/how-tos/github-agentic-workflows/quickstart' },
    { label: 'Develop agentic workflows in GitHub Actions (tutorial)', url: 'https://docs.github.com/en/actions/tutorials/develop-agentic-workflows-in-github-actions' },
    { label: 'Getting a second opinion with the rubber duck agent', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/choosing-and-delegating-agent-work/getting-a-second-opinion' },
  ],
};
