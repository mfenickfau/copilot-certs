import type { Concept } from '../../types';

export const multiAgentOrchestration: Concept = {
  id: 'multi-agent-orchestration',
  title: 'Multi-Agent Orchestration: Patterns, Isolation, Conflicts and Agent Lifecycle',
  summary:
    'How to coordinate several agents on GitHub with orchestrator-subagent, parallel fleet, sequential pipeline and dynamic-workflow patterns; how to isolate agents for parallel execution with separate contexts, branches and sessions; how to detect and resolve overlapping changes, duplicated effort and contradictory outputs; and how to add, update, replace and retire agents without disrupting active workflows.',
  certs: ['gh-600', 'gh-700'],
  domains: ['gh-600-5', 'gh-700-3'],
  outcomes: ['gh-600-5-1-1', 'gh-600-5-1-2', 'gh-600-5-1-3', 'gh-600-5-4-1', 'gh-600-5-4-2', 'gh-600-5-4-3', 'gh-700-3-1-4'],
  tags: ['multi-agent', 'orchestration', 'subagents', 'fleet-mode', 'dynamic-workflows', 'agent-lifecycle', 'custom-agents'],
  difficulty: 'advanced',
  diagram: 'coordinator-subagents',
  sections: [
    {
      heading: 'Orchestration patterns available on GitHub',
      body: `Multi-agent work on GitHub typically has an **orchestrator** that owns the goal and delegates to **subagents** that each own a bounded task. GitHub documents a coordinated workflow as: break the goal into tasks, identify dependencies, assign each task to a subagent with the context and tools it needs, run independent tasks in parallel, then review and combine results. The patterns, and where they live:

| Pattern | GitHub mechanism | Use when |
|---|---|---|
| **Orchestrator and subagents** | Main agent delegates to built-in agents (explore, task, general-purpose, code-review, research, rubber-duck, security-review) or custom agents via the \`agent\` tool; IDE \`runSubagent\`; SDK custom agents | A task has separable research, implementation and review parts |
| **Parallel fleet** | \`/fleet\` in Copilot CLI and the Copilot app, \`copilot --fleet -p\` for automation; SDK \`session.fleet.start\` | Independent units with one owner each (multi-file refactors, batch reviews, per-package migrations) |
| **Sequential pipeline** | Plan mode then agent mode; cloud agent then Copilot code review then Agent Merge; agentic workflows chained through issues and pull requests | Each stage needs the previous stage's concrete output |
| **Dynamic workflows** (preview) | Programs defined in Copilot extensions combining deterministic steps, agents, parallel branches, verification and checkpoints; \`copilot workflow run NAME\` | Repeatable, complex tasks that need deterministic control and pause points |
| **Event-driven agents** | Automations and GitHub Agentic Workflows triggered by issues, pull requests and schedules | Recurring repository work with guardrails |
| **Heterogeneous agents** | Third-party coding agents (Claude, Codex, Gemini engines in agentic workflows; third-party agents in the Agents tab), agent apps | Different strengths for different tasks |

Design rule: delegate when the subtasks are independent, boundaries are clear and the cost of coordinating results is lower than the time saved. Fleet mode is explicitly *not* for sequential tasks, tightly coupled edits to the same files, small tasks or work that needs continuous shared reasoning. Each subagent interacts with the model separately, so parallelism costs more AI credits.`,
    },
    {
      heading: 'Isolation for parallel execution',
      body: `Parallel agents must not share mutable state by accident. GitHub provides isolation at several layers; use all that apply:

- **Context isolation.** Each subagent has its own context window and returns only its result to the parent; subagents cannot create further subagents in IDEs. This keeps exploration noise and large outputs out of the orchestrator's context and prevents one agent's assumptions from leaking into another's.
- **Session isolation.** Each cloud agent task is its own session with its own ephemeral environment (GitHub Actions runner or cloud sandbox). Multiple sessions run concurrently from the Agents tab, the Copilot app sidebar or the CLI session picker, and the CLI \`/tasks\` view lists subagent tasks with their status.
- **Branch isolation.** Each cloud agent task works on one branch and opens one pull request; parallel tasks therefore produce parallel pull requests that merge through review rather than colliding on a shared branch. Locally, the Copilot app supports sessions on separate Git worktrees.
- **Tool and permission isolation.** Give each custom agent only the tools its role needs; in fleet mode, name a specialised custom agent for a subtask (\`/fleet ... Use the @test-writer agent to ...\`). Automations select tools per automation and can scope writes to "Only this issue".
- **Credential isolation.** Agents secrets are scoped to repositories or organisations; the GitHub MCP token is per repository; agentic workflows keep secrets in downstream jobs away from the agent runtime.
- **Trigger isolation.** Automations can ignore events raised by Copilot in the cloud so one agent's output does not trigger another, and ignore users without write access by default.

Isolation also sets ownership: one writer per file set, one owner per pull request, one orchestrator that merges. Fleet mode works best when the parent "can create clear units of work, assign one owner per unit, and define what each worker must return".`,
    },
    {
      heading: 'Detecting and resolving conflicts',
      body: `Three conflict types appear on the exam, each with a detection signal and a resolution path:

**Overlapping code changes.** Two agents edit the same files on different branches, producing merge conflicts, or on the same branch, producing interleaved commits. Detect with the pull request merge box (conflicts), diff overlap across open agent pull requests, and CI failures after merge. Resolve by partitioning ownership before delegation (fleet planning), merging sequentially with Agent Merge handling conflicts and failing checks, or rebasing one agent's branch and asking \`@copilot\` to resolve. Prevent with a planning step that assigns files to workers.

**Duplicated effort.** Two agents (or an agent and an automation) solve the same problem. Detect with duplicate pull requests or issues against the same target, similar session prompts in the Agents tab, and automation run histories. Resolve by closing duplicates with a comment linking the kept pull request and by consolidating triggers: one automation per concern, "Can be triggered by: Anyone except Copilot in the cloud", concurrency rules in agentic workflows.

**Contradictory outputs.** A reviewer agent says the change is unsafe while the implementer says it is fine; two triage agents apply different labels; a plan and a diff disagree. Detect by comparing rationale on issue changes, reviewer comments versus pull request descriptions, and plan-versus-diff checks. Resolve with an arbiter: a human decision recorded in the pull request, a second-opinion agent (\`rubber-duck\`, \`code-review\`), or a dynamic workflow step that has subagents verify each other's findings and asks the user when they disagree. Then fix the source: shared instructions so both agents reason from the same conventions.

Rule of thumb: resolve the instance in the pull request, then resolve the class in ownership, triggers or instructions.`,
    },
    {
      heading: 'Agent lifecycle in multi-agent workflows',
      body: `Agents are configuration, and configuration has a lifecycle that must not break running work.

**Adding an agent.** Create a profile in \`.github/agents/NAME.agent.md\` (repository) or in the \`agents/\` directory of the organisation's \`.github\` or \`.github-private\` repository (organisation; enterprise-level agents live in a designated organisation's \`.github-private\`). Give it a unique name across levels, a clear \`description\` (used for automatic delegation), the minimum \`tools\`, and set \`disable-model-invocation: true\` while it is experimental so it is only used when selected explicitly. Trial it privately from a \`.github-private\` repository's \`.github/agents\` directory before releasing it to \`agents/\`. Register it with orchestrators by name in fleet prompts, or let delegation choose it from its description. For automations, add the new agent as a separate automation with its own tools and triggers, and run it manually with *Run now* against a test resource first.

**Updating, reconfiguring or replacing.** Custom agent versions follow commit SHAs: a task uses the latest profile on its branch when it starts and keeps that version for follow-ups within its pull request, so editing a profile does not change active sessions. Make changes on a branch, test from that branch in the Agents tab, then merge. Replace by introducing the new agent alongside the old, switching delegation (names in prompts, automation configuration) and only then removing the old profile. Automations keep a revision history and can be disabled rather than deleted; agentic workflows must be recompiled (\`gh aw compile\`) and both the \`.md\` and \`.lock.yml\` committed.

**Retiring.** Preserve auditability: do not force-delete history. Set \`user-invocable: false\` and \`disable-model-invocation: true\` to stop new use while the file remains, then remove the profile in a reviewed pull request (Git history keeps every version). Disable automations before deleting them; archive rather than delete cloud sessions (cloud agent sessions can be archived, not deleted). Leave pull requests, session logs and audit log entries in place, and update instructions and fleet prompts that referenced the retired agent so orchestrators do not call a name that no longer exists. Monitor usage with the audit log (\`actor:Copilot\`) and enterprise agent-session views to confirm the agent is no longer invoked before final removal.`,
    },
  ],
  examples: [
    {
      title: 'Planning a fleet with clear ownership',
      description:
        'A team migrates logging across four packages. They plan first, then start fleet mode with one worker per package and a dedicated test-writer agent, so no two workers touch the same files and each returns a defined result.',
      language: 'bash',
      code: `# In Copilot CLI: Shift+Tab into plan mode, agree the plan, then:
/fleet Implement the agreed plan. Assign one worker per package
(core, api, worker, cli); each worker edits only its package directory,
runs that package's tests, and returns: files changed, test command, result.
Use the @test-writer agent to add tests for each package after its worker
finishes. Do not edit shared/ in any worker; list needed shared changes
for me to review.

# Non-interactive equivalent for automation
copilot --fleet -p "Migrate logging per docs/plans/LOGGING.md; one worker per package" \\
  --allow-tool='write(core/**),write(api/**),write(worker/**),write(cli/**)' \\
  --deny-tool='write(shared/**)'

# Monitor subagent tasks
/tasks`,
      takeaway: 'Partition ownership and define each worker\'s return value before parallelising; deny shared paths so overlap cannot happen.',
    },
    {
      title: 'Introducing a replacement agent without disrupting work',
      description:
        'The team replaces an org-level "reviewer" agent with "reviewer-v2" that uses a narrower toolset. They add v2 alongside v1 with model invocation disabled, test it from a branch, switch fleet prompts and automation configuration, then retire v1 by disabling invocation before removing the file in a reviewed pull request.',
      language: 'markdown',
      code: `# Step 1: add alongside (org .github-private/agents/reviewer-v2.agent.md)
---
name: reviewer-v2
description: Reviews pull requests for security and test coverage; read-only
tools: ["read", "search", "github/get_pull_request", "github/get_pull_request_files"]
disable-model-invocation: true   # explicit selection only during trial
---
...

# Step 2: switch callers (fleet prompts, automations) to @reviewer-v2

# Step 3: retire v1 without deleting history
---
name: reviewer
description: RETIRED 2026-11 — use reviewer-v2
user-invocable: false
disable-model-invocation: true
---
# Step 4: remove reviewer.agent.md in a reviewed PR once audit log shows no use.`,
      takeaway: 'Add, switch, disable, then remove; versioning by commit SHA means active tasks keep the profile they started with.',
    },
    {
      title: 'The shared-branch mistake and the fix',
      description:
        'To "save time", a developer asks two cloud agent tasks to work on the same feature branch by mentioning @copilot on one pull request twice with different instructions. Commits interleave, tests pass in one session and fail in the next, and the pull request description contradicts itself. The fix is one task per concern, each on its own copilot/ branch and pull request, with a plan that partitions files; sequential merging with Agent Merge handling conflicts; and a final review that reconciles descriptions. Where coordination is genuinely needed, a dynamic workflow or fleet orchestrator owns the merge.',
      takeaway: 'Parallelism needs isolation; a shared branch turns two agents into one confused agent.',
    },
  ],
  keyPoints: [
    'Orchestrator-subagent is the core pattern: break the goal down, identify dependencies, assign bounded tasks with needed context and tools, run independent tasks in parallel, review and combine.',
    'Fleet mode (/fleet, --fleet, SDK fleet.start) parallelises independent units with one owner each; avoid it for sequential, tightly coupled or small tasks; parallel agents consume more AI credits.',
    'Dynamic workflows (preview) add deterministic steps, verification between subagents and checkpoints; agentic workflows and automations give event-driven coordination with guardrails.',
    'Isolate by context (own window, results only), session and environment, branch (one PR per task, worktrees locally), tools and permissions, credentials, and triggers (ignore Copilot-raised events).',
    'Detect conflicts via merge box conflicts, duplicate PRs or issues, contradictory rationale and plan-versus-diff mismatch; resolve the instance in the PR and the class through ownership, triggers and shared instructions.',
    'Add agents with unique names, minimal tools and disable-model-invocation during trials; test privately from .github-private before releasing.',
    'Custom agent versions follow commit SHAs, so edits do not change active tasks; replace by adding alongside, switching callers, then retiring with user-invocable: false and a reviewed removal that preserves history.',
    'Retire while preserving auditability: disable automations before deleting, archive sessions, keep PRs and logs, update prompts that referenced the agent.',
  ],
  flashcards: [
    { front: 'What are the five steps of a coordinated multi-agent workflow per GitHub docs?', back: 'Break the goal into tasks, identify dependencies, assign each to a subagent with context and tools, run independent tasks in parallel, review and combine results.' },
    { front: 'When should you NOT use fleet mode?', back: 'Sequential tasks, tightly coupled edits to the same files, small tasks, or work needing continuous shared reasoning.' },
    { front: 'How does a subagent keep the orchestrator\'s context clean?', back: 'It runs in its own context window and returns only its final result; in IDEs subagents cannot spawn subagents.' },
    { front: 'How many branches and pull requests does one cloud agent task use?', back: 'One branch and one pull request, which naturally isolates parallel tasks.' },
    { front: 'Which CLI command shows running subagent tasks and lets you kill one?', back: '/tasks (Enter for details, x to kill, r to remove completed tasks).' },
    { front: 'How do you stop one automation\'s output from triggering another?', back: 'Set "Can be triggered by" to "Anyone except Copilot in the cloud" and keep one automation per concern.' },
    { front: 'What determines which custom agent version an active pull request uses?', back: 'The commit SHA of the profile when the task started; follow-ups in that PR keep the same version.' },
    { front: 'Which two frontmatter properties let you retire an agent without deleting its file?', back: 'user-invocable: false (cannot be selected) and disable-model-invocation: true (not chosen automatically).' },
    { front: 'Where are organisation-level custom agents stored?', back: 'In the agents/ directory of the organisation\'s .github or .github-private repository (trial copies go in .github/agents of .github-private).' },
    { front: 'What distinguishes dynamic workflows from fleet mode?', back: 'Dynamic workflows are programs with deterministic steps, verification and checkpoints; fleet mode is model-planned parallel delegation.' },
  ],
  quiz: [
    {
      question:
        'A refactor touches four independent packages, each with its own tests. Which approach follows GitHub guidance?',
      options: [
        'One cloud agent task that edits all four packages on a single branch.',
        'Plan first, then fleet mode with one worker per package, each limited to its own directory and returning a defined result.',
        'Four agents editing the same branch simultaneously to finish faster.',
        'A sequential pipeline where each package waits for the previous one.',
      ],
      correct: [1],
      explanation:
        'Independent units with one owner each are the ideal fleet case. A single task or shared branch loses isolation, and sequencing independent work forfeits the benefit.',
    },
    {
      question:
        'Two automations in the same repository both label new issues and the labels keep flipping. What is the BEST resolution?',
      options: [
        'Raise both automations to Full automation.',
        'Consolidate labelling into one automation, share the taxonomy in repository instructions, and set the other to ignore events raised by Copilot in the cloud or remove its label tool.',
        'Add a third automation to arbitrate.',
        'Delete all labels from the repository.',
      ],
      correct: [1],
      explanation:
        'Duplicated effort and contradictory outputs are resolved by single ownership, shared instructions and trigger isolation. More automation increases the conflict.',
    },
    {
      question:
        'Which TWO isolation mechanisms prevent parallel agents from interfering with each other? (Select two)',
      options: [
        'Each subagent runs in its own context window and returns only its result.',
        'Each cloud agent task works on its own branch and opens its own pull request.',
        'All agents share one session so they can see each other\'s edits.',
        'All agents use the same personal access token for GitHub access.',
      ],
      correct: [0, 1],
      explanation:
        'Context and branch isolation are the documented mechanisms. Shared sessions and shared credentials remove isolation.',
    },
    {
      question:
        'You need to update an organisation-level custom agent\'s instructions without affecting pull requests currently being worked on by that agent. What should you know?',
      options: [
        'Editing the profile immediately changes every active session.',
        'Active tasks keep the profile version from the commit they started with; make the change on a branch, test it, then merge so new tasks pick it up.',
        'You must delete the agent and recreate it under a new name.',
        'Organisation agents cannot be updated once published.',
      ],
      correct: [1],
      explanation:
        'Custom agent versioning is based on commit SHAs, so in-flight pull requests are unaffected. No deletion is required and agents are editable.',
    },
    {
      question:
        'An agent is being retired. Which approach preserves auditability and workflow continuity?',
      options: [
        'Force-push to remove the profile and its history, and delete its sessions.',
        'Set user-invocable: false and disable-model-invocation: true, update prompts and automations that referenced it, confirm via the audit log that it is unused, then remove the file in a reviewed pull request.',
        'Rename the file to .bak in the agents directory.',
        'Disable Copilot in the cloud for the organisation.',
      ],
      correct: [1],
      explanation:
        'Disabling invocation, updating callers and a reviewed removal keep history, logs and sessions intact. Force-pushing destroys history, renaming leaves ambiguity, and disabling Copilot affects everything else.',
    },
  ],
  statements: [
    { text: 'Fleet mode is recommended for tasks where step two depends on the concrete output of step one.', isTrue: false, explanation: 'Fleet mode suits independent units; sequential dependencies should run as a pipeline.' },
    { text: 'Subagents in supported IDEs can create their own subagents.', isTrue: false, explanation: 'Subagents use the same tools and model as the main session but cannot create other subagents.' },
    { text: 'Running work across several subagents can consume more AI credits than a single agent doing the same work.', isTrue: true, explanation: 'Each subagent interacts with the model independently.' },
    { text: 'Custom agent versions are tied to Git commit SHAs of the profile file.', isTrue: true, explanation: 'This allows branches and tags to carry different versions and keeps in-flight tasks consistent.' },
    { text: 'Cloud agent sessions can be deleted to clean up after retiring an agent.', isTrue: false, explanation: 'Cloud agent sessions can be archived but not deleted; only local sessions can be deleted.' },
    { text: 'Dynamic workflows can have subagents verify each other\'s findings and pause at checkpoints for review.', isTrue: true, explanation: 'These are documented capabilities of dynamic workflows (public preview).' },
    { text: 'Automations ignore events triggered by users without write access by default.', isTrue: true, explanation: 'There is an opt-in setting to listen to such events.' },
  ],
  resources: [
    { label: 'Delegating and parallelizing work with agents', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/choosing-and-delegating-agent-work/delegating-and-parallelizing-work-with-agents' },
    { label: 'Speeding up task completion with the /fleet command', url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion' },
    { label: 'Dynamic workflows', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/dynamic-workflows' },
    { label: 'Custom agents configuration (versioning and processing)', url: 'https://docs.github.com/en/copilot/reference/custom-agents-configuration' },
  ],
};
