import type { Concept } from '../../types';

export const agenticDevelopmentRulesAndAgenticWorkflows: Concept = {
  id: 'agentic-development-rules-and-agentic-workflows',
  title: 'Agentic Development Rules, Skills, Loops and GitHub Agentic Workflows',
  summary:
    'How to specify requirements and restrictions for agents that work in your repositories (custom instructions, custom agents, skills, hooks, loop limits, firewall, approvals) and how to design GitHub Agentic Workflows: Markdown plus frontmatter compiled into locked-down GitHub Actions workflows with read-only tokens and safe outputs.',
  certs: ['az-401', 'gh-700'],
  domains: ['az-401-1', 'az-401-3', 'gh-700-1', 'gh-700-3'],
  outcomes: ['az-401-1-3-2', 'az-401-3-3-10', 'gh-700-1-1-10', 'gh-700-3-2-1', 'gh-700-3-2-2', 'gh-700-3-2-5'],
  tags: ['agentic-workflows', 'copilot-cloud-agent', 'custom-instructions', 'skills', 'hooks', 'safe-outputs', 'gh-aw', 'guardrails'],
  difficulty: 'advanced',
  diagram: 'prompt-injection-defense',
  sections: [
    {
      heading: 'Specifying requirements for agents, skills and loops',
      body: `"Agentic development" means an AI agent plans, edits, runs commands and iterates with limited supervision. A DevOps engineer specifies **what the agent must do, what it may use, and when it must stop**. GitHub gives you a layered set of files and settings to express that:

| Need | Mechanism | Where |
|---|---|---|
| Project conventions for every task | Repository custom instructions | \`.github/copilot-instructions.md\`, path-scoped \`.github/instructions/*.instructions.md\` with \`applyTo\`, or \`AGENTS.md\` |
| Organization-wide rules (security, compliance) | Organization custom instructions (Copilot Business/Enterprise) | Organization settings; apply to cloud sessions and code review |
| A specialist persona with a limited toolset | Custom agent profile | \`.github/agents/NAME.agent.md\` with \`name\`, \`description\`, \`tools\` and MCP config in frontmatter |
| A repeatable procedure with scripts | Agent skill | \`.github/skills/<skill>/SKILL.md\` plus resources |
| Deterministic checks around tool calls | Hooks | \`.github/hooks/*.json\` with \`sessionStart\`, \`sessionEnd\`, \`preToolUse\`, \`postToolUse\` |
| Environment and compute | Copilot setup steps | \`.github/workflows/copilot-setup-steps.yml\` (single \`copilot-setup-steps\` job; \`runs-on\` picks the runner) |
| Network reach | Firewall and allowlist | Repository or organization "Internet access" settings |

**Loops** are where agents burn budget and cause harm. Specify them explicitly: how many fix-and-retest iterations before the agent stops and asks; a hard time or token budget; and a definition of done the agent can verify (tests pass, lint clean, PR opened as draft). In Copilot cloud sessions you also pick the **mode** (Interactive or Autopilot) and **tool permissions** (Assisted, Always ask, Allow all); enterprises can block Allow all in managed settings. Write these decisions down in the instructions file so every session inherits them.`,
    },
    {
      heading: 'Restrictions: least privilege for an agent in the pipeline',
      body: `An agent is a non-human contributor with write access, so the same controls you apply to a new hire apply to it:

- **Identity and approvals.** The Copilot cloud agent commits as Copilot with the requester as co-author, and each commit links to the session log. Its pull requests cannot be approved by the requester alone when approvals are required, and **GitHub Actions workflows do not run on its pushes until someone with write access clicks "Approve and run workflows"** (an admin can relax this per repository). Copilot only responds to comments from people with write access.
- **Scope.** Give custom agents the minimum \`tools\` list (for example read, search and a read-only MCP server for a planner). Configure repository MCP servers once, restrict toolsets, and remember those tools run without per-call approval.
- **Network.** The agent firewall is on by default with a recommended allowlist for package registries; add only the hosts you need. Disabling it should be an explicit, reviewed decision.
- **Secrets.** Only Agents secrets and variables (prefixed \`COPILOT_MCP_\` for MCP) reach the agent environment; never paste credentials into instructions.
- **Visibility.** Enterprise owners see agent sessions under AI controls, audit-log them with \`actor:Copilot\`, stream events to a SIEM and can enable OpenTelemetry export from Copilot clients with per-class capture controls.

The exam phrases this as "specify requirements and restrictions for agentic development". The correct answers always add a *control that holds even if the model misbehaves* (permissions, firewall, approval gate) rather than relying on a sentence in the prompt.`,
    },
    {
      heading: 'GitHub Agentic Workflows: Markdown in, locked Actions workflow out',
      body: `**GitHub Agentic Workflows** are repository automations written in Markdown and executed by a coding agent inside GitHub Actions. Each workflow file in \`.github/workflows/\` has two parts: **YAML frontmatter** that sets the guardrails (trigger, permissions, network, tools, safe outputs, engine) and a **Markdown body** with natural-language instructions. The \`gh aw\` GitHub CLI extension **compiles** the Markdown into a \`.lock.yml\` GitHub Actions workflow; you commit both files to the default branch and the workflow runs on its trigger like any other.

\`\`\`markdown
---
on: daily
permissions:
  contents: read
  issues: read
  pull-requests: read
  copilot-requests: write
network: defaults
tools:
  github:
    toolsets: [default]
safe-outputs:
  create-issue:
---
# Daily repo status report
Review the last 24 hours of merged PRs, closed issues and discussions and open one concise issue summarising changes, blockers and next steps.
\`\`\`

The security model is the point. The agent job runs in a **firewalled container with a read-only token**; the only writes allowed are the declared **safe outputs** (create an issue, add a comment, open a pull request, add labels), which run in a separate job with scoped permissions after agentic threat detection checks the content. Supported engines include GitHub Copilot (default; uses \`GITHUB_TOKEN\` with \`copilot-requests: write\` in organization repos), Claude Code, OpenAI Codex and Gemini CLI, each needing its API key as a repository secret. Typical uses: issue triage and labelling, CI failure investigation, weekly status reports, documentation drift fixes, test-coverage improvements and PR review assistants.`,
    },
    {
      heading: 'Designing a good agentic workflow (and knowing when not to)',
      body: `Design checklist for an agentic workflow:

1. **Trigger**: use the narrowest event (\`pull_request\`, \`issues\`, \`schedule\`/\`daily\`, \`workflow_dispatch\`). A schedule plus a small scope is cheaper and safer than reacting to every push.
2. **Permissions**: keep the agent job read-only; declare writes only as safe outputs. Never grant \`contents: write\` to the agent job itself.
3. **Network**: start with \`network: defaults\`; add hosts deliberately.
4. **Tools**: pick the GitHub toolsets you need; connect MCP servers only for context the task requires.
5. **Instructions**: state the goal, the output format, what to do when uncertain (ask in a comment rather than guess) and a **self-critique loop** ("before posting, re-read the diff and remove any claim you cannot cite").
6. **Human review**: safe outputs land as issues, comments or draft PRs that people review; merges stay with humans and branch protection.
7. **Operate**: use \`gh aw\` commands to compile, run, inspect logs and iterate; recompile whenever frontmatter changes.

Use an *ordinary* GitHub Actions or Azure Pipelines workflow when the logic is fixed (build, test, deploy, lint). Use an *agentic* workflow when the step needs reading and judgement (triage, summarise, investigate, propose). Use the **Copilot cloud agent** (assigning an issue or using the Agents tab) when a person wants a one-off task done and reviewed, and an agentic workflow when the same judgement is needed on a trigger without a person starting it. Authoring is itself agentic: \`gh aw init\` installs skills so Copilot CLI or VS Code agent mode can create and refine workflows from a description.`,
    },
  ],
  examples: [
    {
      title: 'A PR test-coverage reviewer as an agentic workflow',
      description:
        'A team wants every pull request checked for adequate tests, with a review comment rather than a blocking failure. They run gh aw init, then ask Copilot CLI with the agentic-workflows skill to "create a PR reviewer that ensures changes are tested". The generated workflow triggers on pull requests, reads the diff with the GitHub toolset, and posts a review through a safe output. They commit the .md and .lock.yml files together.',
      language: 'markdown',
      code: `---
on:
  pull_request:
    types: [opened, synchronize]
permissions:
  contents: read
  pull-requests: read
  copilot-requests: write
network: defaults
tools:
  github:
    toolsets: [default]
safe-outputs:
  add-comment:
---
# Test coverage reviewer
For each changed source file, check whether the PR adds or updates tests.
If coverage is missing, post ONE comment listing files without tests and
suggest the smallest test to add. Do not comment when coverage is adequate.
Before posting, re-read your comment and remove anything you cannot point
to in the diff.`,
      takeaway: 'Read-only agent job plus one declared safe output gives you judgement without giving the model write access to the repository.',
    },
    {
      title: 'Specifying loop limits in custom instructions',
      description:
        'Contoso’s platform team writes repository instructions so every Copilot cloud agent session follows the same stopping rules and conventions, instead of relying on each engineer to repeat them in prompts.',
      language: 'markdown',
      code: `# .github/copilot-instructions.md
- Run \`npm test\` and \`npm run lint\` before pushing. If tests still fail
  after 3 fix attempts, stop, summarise what you tried and ask for guidance
  in the PR instead of continuing.
- Never modify files under infra/prod/ or any *.lock.yml; propose changes
  in the PR description instead.
- Open all pull requests as drafts and link the work item with AB#<id>.
- Use the existing ErrorHandler utility; do not add new try/catch wrappers.`,
      takeaway: 'Put iteration limits, forbidden paths and definition of done in the instructions file so the loop is bounded by design.',
    },
    {
      title: 'Granting the agent job write access (a realistic mistake)',
      description:
        'An engineer hand-edits a .lock.yml file to add contents: write so the agent can "just push the fix" and skips recompiling. The workflow now lets model output land directly on a branch, and the next edit to the Markdown silently regenerates the lock file without the change, confusing everyone. The fix is to revert to a read-only agent job, declare create-pull-request as a safe output so changes arrive as a reviewable PR, edit only the .md frontmatter and run gh aw compile.',
      takeaway: 'Never edit the compiled lock file or widen the agent job’s permissions; express writes as safe outputs and recompile from the Markdown source.',
    },
    {
      title: 'A planner agent with a restricted toolset',
      description:
        'A repository defines a custom agent that only plans. It can read and search code and query the Azure DevOps MCP server for the work item, but it has no edit tool, so a developer can delegate the plan safely and then hand implementation to the default agent.',
      language: 'markdown',
      code: `---
name: implementation-planner
description: Produces an implementation plan in Markdown; never edits code
tools: ["read", "search", "ado-remote-mcp/wit_get_work_item"]
---
You are a planning specialist. Read the linked work item and the code,
then write PLAN.md with steps, affected files, tests to add and risks.
Do not modify any other file.`,
      takeaway: 'Custom agent profiles bind a persona to a minimal tool list, which is the practical form of least privilege for agents.',
    },
  ],
  keyPoints: [
    'Specify agent requirements in files the agent reads every time: .github/copilot-instructions.md, path-scoped .instructions.md, AGENTS.md, organization instructions, custom agent profiles (.github/agents/*.agent.md) and skills (.github/skills).',
    'Bound loops explicitly: retry counts, time or token budgets, forbidden paths and a verifiable definition of done; choose Interactive vs Autopilot and Assisted vs Always ask tool permissions deliberately.',
    'Controls that hold regardless of the model: Approve and run workflows for Copilot PRs, requester approval not counting, firewall with allowlist, COPILOT_MCP_-scoped secrets, hooks, restricted MCP toolsets and audit logging with actor:Copilot.',
    'GitHub Agentic Workflows = Markdown body (instructions) + YAML frontmatter (on, permissions, network, tools, safe-outputs, engine), compiled by gh aw into a .lock.yml Actions workflow; commit both to the default branch.',
    'The agent job runs read-only in a firewalled container; declared safe outputs (create-issue, add-comment, create-pull-request, labels) are the only writes and run in a separate scoped job after threat detection.',
    'Engines include GitHub Copilot (default, GITHUB_TOKEN with copilot-requests: write in org repos), Claude Code, OpenAI Codex and Gemini CLI (API keys as repository secrets).',
    'Use ordinary workflows for fixed logic, agentic workflows for recurring judgement on a trigger, and the Copilot cloud agent for one-off delegated tasks a human reviews.',
  ],
  flashcards: [
    { front: 'What two parts make up a GitHub Agentic Workflow file?', back: 'YAML frontmatter (trigger, permissions, network, tools, safe outputs, engine) and a Markdown body with natural-language instructions.' },
    { front: 'What does gh aw compile produce?', back: 'A .lock.yml GitHub Actions workflow generated from the Markdown workflow; both files are committed to the default branch.' },
    { front: 'How do agentic workflows write to GitHub if the agent token is read-only?', back: 'Through declared safe outputs (for example create-issue, add-comment, create-pull-request) executed in a separate job with scoped permissions.' },
    { front: 'Which permission lets the Copilot engine use GITHUB_TOKEN in an organization repository?', back: 'copilot-requests: write in the workflow frontmatter permissions.' },
    { front: 'Where does a custom agent profile live and what does its frontmatter contain?', back: '.github/agents/NAME.agent.md with name, description, tools (and optional MCP server configuration).' },
    { front: 'Which hook events can a .github/hooks/*.json file define?', back: 'sessionStart, sessionEnd, preToolUse and postToolUse.' },
    { front: 'By default, do GitHub Actions workflows run when the Copilot cloud agent pushes to its PR?', back: 'No. A user with write access must click "Approve and run workflows" (configurable per repository).' },
    { front: 'What file customises the Copilot cloud agent’s GitHub Actions environment and runner?', back: '.github/workflows/copilot-setup-steps.yml, containing a single copilot-setup-steps job whose runs-on selects the runner.' },
    { front: 'Name three places repository custom instructions can be stored.', back: '.github/copilot-instructions.md, .github/instructions/*.instructions.md (with applyTo), and AGENTS.md (also CLAUDE.md or GEMINI.md).' },
    { front: 'How do you make agentic authoring available in a repo?', back: 'Run gh aw init to add skills and instructions, then ask a coding agent (for example /agentic-workflows in Copilot CLI) to create the workflow.' },
  ],
  quiz: [
    {
      question:
        'A team wants an AI agent to label and prioritise every new issue in a repository without a person starting each task. The security team requires that the agent cannot modify code. What should you implement?',
      options: [
        'Assign each issue to the Copilot cloud agent manually.',
        'A GitHub Agentic Workflow triggered on issues with read-only permissions and an add-labels safe output.',
        'A GitHub Actions workflow with contents: write that calls the model API directly.',
        'A custom agent profile with the edit tool enabled.',
      ],
      correct: [1],
      explanation:
        'Agentic workflows run on triggers with a read-only agent job and declared safe outputs, which is exactly the control required. Manual assignment needs a person per issue, contents: write violates the restriction, and a custom agent profile with edit is the opposite of read-only.',
    },
    {
      question:
        'After the Copilot cloud agent pushes commits to its pull request, the CI workflow does not run. What is the cause?',
      options: [
        'The agent’s commits are unsigned so Actions refuses them.',
        'By default workflows do not run on Copilot pushes until a user with write access approves them.',
        'The copilot-setup-steps.yml file is missing.',
        'The repository firewall blocked GitHub Actions.',
      ],
      correct: [1],
      explanation:
        'This is a deliberate safeguard: workflows may be privileged, so a human must click Approve and run workflows. Copilot commits are signed, setup steps affect the agent environment not CI, and the firewall governs the agent’s outbound access.',
    },
    {
      question:
        'Which TWO settings belong in the frontmatter of a GitHub Agentic Workflow rather than in its Markdown body? (Select two)',
      options: ['The trigger (on:)', 'The safe outputs the workflow may produce', 'The explanation of what a good issue summary looks like', 'The tone of voice for comments'],
      correct: [0, 1],
      explanation:
        'Triggers and safe outputs are guardrails expressed in YAML frontmatter. Guidance about content and tone is natural-language instruction for the Markdown body.',
    },
    {
      question:
        'An engineer edits the generated .lock.yml of an agentic workflow to add contents: write so the agent can push fixes directly. Which statement is correct?',
      options: [
        'This is the recommended way to let the agent fix code.',
        'The change will be lost on the next gh aw compile and it removes the read-only guardrail; the agent should instead declare create-pull-request as a safe output.',
        'The lock file is ignored by GitHub Actions, so the change has no effect.',
        'Only enterprise owners can edit lock files.',
      ],
      correct: [1],
      explanation:
        'Lock files are generated artifacts; edits are overwritten on recompile and widening the agent job defeats the security model. Writes belong in safe outputs. The lock file is the file Actions actually runs, and no special role prevents editing it.',
    },
    {
      question:
        'You need a repeatable "release notes in our template" procedure that any Copilot surface (CLI, cloud agent, code review) can load only when relevant. Which mechanism fits BEST?',
      options: ['An agent skill in .github/skills', 'A webhook', 'A deployment protection rule', 'An organization custom instruction'],
      correct: [0],
      explanation:
        'Skills package task-specific instructions, scripts and resources that agents load on demand. Webhooks react to events, deployment protection rules gate environments, and organization instructions apply to every conversation rather than one procedure.',
    },
    {
      question:
        'A regulated team must ensure that even if a prompt is manipulated, the Copilot cloud agent cannot reach arbitrary internet hosts while working on their repository. What should they rely on?',
      options: [
        'A sentence in copilot-instructions.md telling the agent not to access the internet',
        'The agent firewall with a reviewed allowlist, configured at organization level and not left to repositories',
        'Setting the session mode to Interactive',
        'Disabling GitHub Actions',
      ],
      correct: [1],
      explanation:
        'The firewall is an enforced control; instructions can be bypassed by prompt injection, Interactive mode only changes how often a human is consulted, and disabling Actions breaks CI rather than constraining the agent.',
    },
  ],
  statements: [
    { text: 'A GitHub Agentic Workflow is written entirely in YAML like a normal Actions workflow.', isTrue: false, explanation: 'It is a Markdown file with YAML frontmatter; gh aw compiles it into a .lock.yml Actions workflow.' },
    { text: 'The agent job in a GitHub Agentic Workflow runs with a read-only token by default.', isTrue: true, explanation: 'Writes happen only through declared safe outputs in a separate scoped job.' },
    { text: 'GitHub Agentic Workflows support only the GitHub Copilot engine.', isTrue: false, explanation: 'Claude Code, OpenAI Codex and Gemini CLI are also supported, each with its API key stored as a secret.' },
    { text: 'The person who asked the Copilot cloud agent for a change can satisfy a required-approvals rule by approving the resulting PR.', isTrue: false, explanation: 'The requester’s approval does not count toward required approvals; another reviewer must approve.' },
    { text: 'Hooks in .github/hooks can run a command before and after each tool call in a Copilot cloud agent session.', isTrue: true, explanation: 'preToolUse and postToolUse hooks (plus sessionStart and sessionEnd) run commands at those points.' },
    { text: 'Organization custom instructions are supported for Copilot sessions running on GitHub and for Copilot code review.', isTrue: true, explanation: 'They apply to cloud sessions and code review but not to local client sessions.' },
    { text: 'Agent skills must be stored in a central registry outside the repository.', isTrue: false, explanation: 'Project skills live in the repository (.github/skills, .claude/skills or .agents/skills); personal skills live in the home directory.' },
  ],
  resources: [
    { label: 'GitHub Agentic Workflows (concept)', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/about-github-agentic-workflows' },
    { label: 'Develop agentic workflows in GitHub Actions (tutorial)', url: 'https://docs.github.com/en/actions/tutorials/develop-agentic-workflows-in-github-actions' },
    { label: 'Adding repository custom instructions for GitHub Copilot', url: 'https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions' },
    { label: 'Creating custom agents for the Copilot cloud agent', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/create-custom-agents' },
  ],
};
