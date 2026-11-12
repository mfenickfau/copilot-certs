import type { Concept } from '../../types';

export const copilotAutomations: Concept = {
  id: 'copilot-automations',
  title: 'Implementing Copilot Automations: Triggers, Prompts, Models and Tools',
  summary:
    'How to build automations that run Copilot cloud agent on a schedule, on repository events or via the API: choosing personal or shared ownership, selecting and filtering triggers, writing the prompt and picking a model and reasoning level, granting only the tools the task needs, and testing before trusting.',
  certs: ['gh-700'],
  domains: ['gh-700-3'],
  outcomes: ['gh-700-3-3-1', 'gh-700-3-3-2', 'gh-700-3-3-3'],
  tags: ['automations', 'cloud-agent', 'triggers', 'tools', 'copilot-app', 'copilot-cli'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'What an automation is and where to build it',
      body: `A **Copilot automation** runs Copilot cloud agent automatically, either on a **schedule**, in response to a **repository event**, or when **triggered via the API**, and can act inside the repository where it is configured: label an issue, reproduce a bug, capture screenshots for a pull request, open a pull request, start an incident investigation. You define a **name**, a **type**, a **prompt**, **triggers**, **tools**, optionally a **model and reasoning level**, and optionally **AI credit limits**.

Where to create and manage them: the **Agents tab > Automations** pane of a repository on GitHub (Create with agent, or Create manually with a form), the **Automations** tab in the GitHub Copilot app, the Agents window in VS Code, and the REST API. The Copilot app additionally supports **local automations** that run on your machine (no credit limits) alongside **cloud automations**.

Availability: paid plans (Pro, Pro+, Max, Business, Enterprise); **private and internal repositories only**; Copilot cloud agent and automations must be allowed by the organisation (both on by default); anyone with write access can create one.

**Type** is permanent and matters for governance:

| | Personal | Shared |
|---|---|---|
| Visible to | Only you | Everyone with read access |
| Editable by | Only you | Everyone with write access |
| Billed to | You | Repository owner (organisation needs "Allow use of Copilot cloud agent billed to the organization") |
| Acts as | Your identity | Copilot's identity (extra PR approval required) |

Runs of either type are visible to everyone with read access, so prompts must never contain secrets. Unlike agentic workflows, automations are **not stored in Git**; their revision history lives in the Automations pane.`,
    },
    {
      heading: 'Selecting and configuring triggers',
      body: `An automation runs when **any** of its triggers fires (click **Add another trigger** for more). Available triggers include:

- **On a schedule**: hourly, daily or weekly.
- **When an issue is created**, optionally filtered by a **search query** (for example \`label:customer-request\`).
- **When a pull request is opened** or **synchronized** (new commits pushed), optionally filtered by search query and by **files changed**.
- **Manual / API**: every automation can be triggered via the API with extra context passed into the prompt, which connects external systems such as monitoring tools.

Event triggers carry safety settings that the exam likes:

- **Configured tools can change**: \`Anything in this repository\` or \`Only this issue\` (limits GitHub tools' writes to the triggering issue or pull request and resources created in the run). It does not limit MCP tools.
- **Can be triggered by**: \`Anyone except Copilot in the cloud\` (ignore events caused by Copilot, including other automations, to avoid chains) or \`Anyone\`.
- **Ignore events triggered by users without write access** is on by default to reduce prompt injection from untrusted contributors; you can opt in to allow them, unless the repository locks the setting.

Choose a schedule when batching keeps cost predictable; choose an event when latency matters (a bug repro should start when the issue arrives). In Copilot CLI, \`/every INTERVAL PROMPT\` and \`/after DELAY PROMPT\` (experimental) schedule prompts inside a running session, and \`copilot -p "..."\` with an external scheduler such as cron covers unattended runs.`,
    },
    {
      heading: 'Configuring prompts and models',
      body: `The **prompt** is what Copilot performs on every run, so apply the reliable-prompt method: goal, data scope, criteria, output structure, boundaries and a stopping condition. Example: "Triage this issue by setting a type, labels and priority, and explain your reasoning for each." You do not have to mention rationale or confidence; supported issue changes carry them automatically and are routed by the repository's **automation level**. To hold a specific change for review regardless of confidence, ask the agent to **suggest** rather than apply it. You can type \`/\` in the prompt to invoke a skill.

**Create with agent** lets Copilot interview you and draft the prompt, triggers and tools, and it can set up **self-improving automation groups** where evaluator automations review outcomes and propose improvements that you accept or dismiss.

**Model and reasoning level** are optional per automation. Pick a lighter model for routine labelling and a reasoning model for investigations; a higher reasoning level improves hard problems at higher cost. Automations inherit the repository's Copilot cloud agent configuration: custom instructions, agent skills, firewall rules, and Agents secrets and variables.

**AI credit limits** complete the configuration: per run (minimum 30; the only limit that stops a run in progress), daily, weekly and monthly (prevent new runs; reset at 00:00 UTC, Monday, and the first of the month).`,
    },
    {
      heading: 'Selecting and configuring tools, then testing',
      body: `Tools are how you **scope** an automation; "Select only the tools the task requires" is GitHub's rule. Two kinds:

- **GitHub tools** act only in the automation's repository: push changes, update labels, set issue type or fields, assign users, close issues, create pull requests, upload attachments, hide comments, add reactions, read and comment on discussions.
- **MCP tools** from servers a repository administrator configured in the repository's MCP settings. You pick which of each server's tools the automation may use. MCP tools are **not** limited to the repository; they reach whatever the server's credentials allow, so review scope first.

Use **Suggest tools** to let Copilot propose a tool list from the prompt, then prune it. If the automation only needs to read, grant no write tools at all.

Before trusting an automation, **test it**: open it in the Automations pane, click **Run**, pick the trigger to simulate (for a manual trigger you can supply context; for an event trigger supply the resource URL of an issue or pull request), click **Run now**, and open the resulting session to follow progress and review changes. Then manage the lifecycle: edit name, prompt, triggers, tools, model, reasoning and limits (with revision history), review **proposed improvements**, **disable** to pause, **enable** to resume, or **delete**. The user-level Automations view lists every automation across your repositories.`,
    },
  ],
  examples: [
    {
      title: 'Bug reproduction when a customer issue arrives',
      description:
        'A support operations lead creates a shared automation: trigger "When an issue is created" filtered to label:bug, Configured tools can change = Only this issue, Can be triggered by = Anyone except Copilot in the cloud. The prompt asks Copilot to attempt to reproduce the bug, add a comment with steps and outcome, and suggest a priority rather than set it. Tools: add comment, upload attachment, set issue field. Model: a general-purpose model. Limits: 80 credits per run, 1,500 weekly. She tests with Run now on a recent bug issue before saving.',
      takeaway: 'Event trigger plus scoped writes, minimal tools and a per-run cap make an event-driven automation safe.',
    },
    {
      title: 'Granting every tool "to be safe" (a realistic mistake)',
      description:
        'A program manager creating a weekly summary automation selects all GitHub tools and every tool from the ticketing MCP server, reasoning that Copilot will only use what it needs. One week a malformed issue body steers the agent into closing issues and posting to the ticketing system. Because tools, not intentions, define what an automation can do, the fix is to grant only create issue and read tools, keep the default that ignores events from users without write access, and scope writes to Only this issue for event triggers.',
      takeaway: 'Tool selection is the main control over scope; prompt injection is mitigated by least-privilege tools, not by hoping the agent behaves.',
    },
    {
      title: 'Personal standup prep versus a shared team automation',
      description:
        'An analyst builds a personal automation that runs daily and drafts her standup notes from her assigned issues; it is billed to her and acts as her identity, and only she can see it. The team then wants the same for everyone, so a shared automation is created instead: everyone can see and edit it, usage is billed to the organisation (requiring the "billed to the organization" policy), actions are attributed to Copilot, and any pull request it opens needs an extra approval.',
      takeaway: 'Choose the type deliberately; it cannot be changed later and determines visibility, billing and identity.',
    },
  ],
  keyPoints: [
    'Automations run Copilot cloud agent on a schedule, on issue or pull request events, or via the API; they exist in private and internal repositories on paid plans and are managed from the Agents tab, the Copilot app, VS Code or the REST API.',
    'Type is permanent: personal (only you see it, billed to you, your identity) or shared (repository-visible, billed to the owner, Copilot\'s identity with an extra PR approval).',
    'Triggers: hourly/daily/weekly schedule, issue created, pull request opened or synchronized (with search-query and files-changed filters), and API; an automation with several triggers runs when any fires.',
    'Safety settings on event triggers: Configured tools can change (Anything in this repository or Only this issue), Can be triggered by (exclude Copilot to avoid chains), and ignoring events from users without write access by default.',
    'The prompt defines the task; rationale and confidence are attached automatically to issue changes and routed by the repository automation level; ask the agent to suggest changes to force review.',
    'Pick model and reasoning level per automation; automations inherit repository custom instructions, skills, firewall rules and Agents secrets; set per-run, daily, weekly and monthly AI credit limits.',
    'Select only required tools: GitHub tools stay within the repository, MCP tools reach whatever their server allows; use Suggest tools, then test with Run now before relying on it.',
  ],
  flashcards: [
    { front: 'In which repositories are Copilot automations available?', back: 'Private and internal repositories only, on paid Copilot plans, with cloud agent and automations allowed by the organisation.' },
    { front: 'Can you change an automation from personal to shared after creating it?', back: 'No. The type is fixed at creation.' },
    { front: 'Who is billed for a shared automation and whose identity does it use?', back: 'The repository owner (organisation or user) is billed and actions are attributed to Copilot; organisations must allow cloud agent usage billed to the organisation.' },
    { front: 'List the event triggers available for automations.', back: 'When an issue is created, when a pull request is opened, when a pull request is synchronized (new commits), plus schedule and API triggers.' },
    { front: 'What does "Only this issue" do?', back: 'Limits GitHub tools\' writes to the triggering issue or pull request and resources created during the run; it does not limit MCP tools.' },
    { front: 'Why do automations ignore events from users without write access by default?', back: 'To reduce the risk of prompt injection from untrusted contributors; you can opt in to allow those events.' },
    { front: 'How do you make an automation hold a specific change for human review regardless of confidence?', back: 'Ask it in the prompt to suggest the change rather than apply it.' },
    { front: 'What repository configuration do automations inherit?', back: 'Custom instructions, agent skills, firewall rules, and Agents secrets and variables.' },
    { front: 'What is the minimum per-run AI credit limit?', back: '30 AI credits; the per-run limit is the only one that stops a run already in progress.' },
    { front: 'How do you test an automation without waiting for its trigger?', back: 'Open it in the Automations pane, click Run, choose the trigger to simulate (with context or a resource URL), then Run now and follow the session.' },
  ],
  quiz: [
    {
      question:
        'A support lead wants Copilot to try to reproduce every new bug report as soon as it is filed, but only comment on that specific issue and never touch others. Which configuration is MOST appropriate?',
      options: [
        'Schedule: daily; tools: all GitHub tools; Configured tools can change: Anything in this repository',
        'Trigger: when an issue is created with filter label:bug; tools: add comment and upload attachment; Configured tools can change: Only this issue',
        'Trigger: when a pull request is opened; tools: push changes',
        'A project built-in workflow that sets Status to Todo',
      ],
      correct: [1],
      explanation:
        'An issue-created trigger with a label filter gives immediacy, minimal tools limit actions, and Only this issue scopes writes. A daily schedule loses immediacy and all tools over-grant; pull request triggers and project workflows do not address bug reproduction.',
    },
    {
      question:
        'A team wants an automation that keeps running even if its creator leaves the company, with usage billed to the organisation. Which choice is required?',
      options: [
        'A personal automation with a monthly limit',
        'A shared automation, with the organisation policy allowing Copilot cloud agent usage billed to the organisation',
        'A local automation in the Copilot app',
        'A Copilot CLI /every schedule on the creator\'s laptop',
      ],
      correct: [1],
      explanation:
        'Shared automations belong to the repository and keep working when the creator leaves; organisation billing needs the corresponding policy. Personal, local and CLI-session schedules depend on one person or machine.',
    },
    {
      question:
        'Which TWO statements about automation tools are correct? (Select two)',
      options: [
        'GitHub tools can only act within the repository the automation is scoped to',
        'MCP server tools can reach whatever the server\'s configuration and credentials allow, including external systems',
        'Selecting all tools is recommended so the agent is never blocked',
        'Tools from MCP servers are automatically limited by the "Only this issue" setting',
      ],
      correct: [0, 1],
      explanation:
        'GitHub tools are repository-scoped while MCP tools follow their server\'s access. GitHub recommends selecting only required tools, and "Only this issue" does not constrain MCP tools.',
    },
    {
      question:
        'An automation that opens pull requests sometimes triggers a second automation that comments on new pull requests, which then triggers a third. What setting prevents these chains with the least impact?',
      options: [
        'Delete all automations except one',
        'Set "Can be triggered by" to "Anyone except Copilot in the cloud" on the event-triggered automations',
        'Set a daily AI credit limit of 30',
        'Remove the pull request opened trigger and use a schedule for everything',
      ],
      correct: [1],
      explanation:
        'Excluding events caused by Copilot (including other automations) stops chaining while keeping human-triggered behaviour. Deleting automations or switching everything to schedules loses functionality, and a tiny daily limit just blocks runs.',
    },
    {
      question:
        'Before enabling a new shared triage automation, a program manager wants to see exactly what it would do on a real issue without waiting for the next issue to be created. What should she do?',
      options: [
        'Change the trigger to hourly and wait',
        'Open the automation, click Run, choose the issue-created trigger, supply the issue URL and click Run now, then review the session',
        'Ask Copilot Chat to predict the outcome',
        'Set the repository automation level to Full automation',
      ],
      correct: [1],
      explanation:
        'The Run now test simulates a trigger against a specified resource and starts a reviewable session. Waiting for an hourly run delays feedback, chat cannot run the automation, and Full automation removes the review gate rather than testing.',
    },
  ],
  statements: [
    { text: 'Copilot automations are available in public repositories.', isTrue: false, explanation: 'Automations are available in private and internal repositories only.' },
    { text: 'An automation with several triggers runs when any one of them fires.', isTrue: true, explanation: 'Click Add another trigger to combine triggers; any firing starts a run.' },
    { text: 'Automations are committed to the repository as files and versioned in Git.', isTrue: false, explanation: 'Automations are stored separately from repository contents; their revision history is in the Automations pane. Agentic workflows are the Git-based option.' },
    { text: 'By default, automations ignore events triggered by users without write access to the repository.', isTrue: true, explanation: 'This default mitigates prompt injection from untrusted users.' },
    { text: 'A personal automation acts under the creator\'s identity and is billed to the creator.', isTrue: true, explanation: 'Shared automations act as Copilot and are billed to the repository owner.' },
    { text: 'Daily and weekly AI credit limits stop a run that is already in progress.', isTrue: false, explanation: 'Only the per-run limit stops an in-progress run; the others prevent new runs from starting.' },
  ],
  resources: [
    { label: 'Copilot automations (concept)', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/about-automations' },
    { label: 'Creating automations with Copilot cloud agent', url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-automations' },
    { label: 'Using automations in the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/how-tos/github-copilot-app/using-automations' },
    { label: 'Scheduling prompts in GitHub Copilot CLI', url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/schedule-prompts' },
  ],
};
