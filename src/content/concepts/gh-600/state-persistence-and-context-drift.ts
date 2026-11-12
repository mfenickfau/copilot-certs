import type { Concept } from '../../types';

export const statePersistenceAndContextDrift: Concept = {
  id: 'state-persistence-and-context-drift',
  title: 'Persisting Agent State, Resuming Work and Controlling Context Drift',
  summary:
    'How to capture task progress and decisions as durable artifacts (plan files, pull request checklists, issue comments, session logs), how to resume agent work across sessions, clients and tools without repeating steps, how to detect and correct drift during long executions, and how to share state between agents and environments without conflicting or stale context.',
  certs: ['gh-600'],
  domains: ['gh-600-3'],
  outcomes: ['gh-600-3-2-1', 'gh-600-3-2-2', 'gh-600-3-2-3', 'gh-600-3-3-1', 'gh-600-3-3-2', 'gh-600-3-3-3'],
  tags: ['state', 'durable-artifacts', 'resume', 'drift', 'sessions', 'shared-context'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'Durable artifacts for progress and decisions',
      body: `Conversation is volatile: it gets compacted, the sandbox is destroyed, and a teammate cannot see what the agent "knows". Durable state lives in GitHub objects that outlast the session and are visible to everyone with repository access:

- **A plan file on the branch** (\`docs/plans/ISSUE-123.md\`) with checkboxes the agent updates as it completes steps, and a decisions section recording *why* ("chose optimistic locking because the retry wrapper already exists").
- **The pull request description** as the running summary: what is done, what is pending, what blocked. The cloud agent writes its own summary and notes which custom agent it used; follow-up prompts append to the record.
- **Issue comments and labels** for cross-session or cross-agent state ("blocked-on-schema", "ready-for-executor"). Automations can set labels, types and fields with rationale and confidence that are visible on the issue.
- **Session logs**, kept on GitHub.com for cloud sessions and under \`~/.copilot/session-state/\` for local ones, give the full history when the summary is not enough; cloud sandbox snapshots keep files and in-progress work while a session is stopped.
- **Commits** themselves, each linking to its session log, so git history is a timeline of agent decisions.
- **Copilot Memory** for durable *facts* discovered during work (not for task progress).

The exam framing: when a scenario asks how an agent should "capture progress so a human or another agent can take over", choose artifacts in the repository, issue or pull request, not longer chat history or a bigger context window.`,
    },
    {
      heading: 'Resuming without repeating or diverging',
      body: `Resumption has two failure modes: redoing finished steps, and quietly taking a different approach from the one agreed. Both are prevented by making the agent read state before acting.

On GitHub, resumption is built into several surfaces:

- **Cloud sandbox sessions** are not tied to a client. Start in the Copilot app, steer from GitHub Mobile, read the log on GitHub.com, resume in Copilot CLI; the session keeps its conversation, files and in-progress work. GitHub Actions-based sessions, by contrast, are only available on the website and each follow-up runs in a fresh environment, so state must be in the branch and pull request.
- **Copilot CLI** resumes with \`copilot --continue\` (most recent), \`copilot --resume\` (picker) or \`copilot --resume SESSION-ID\`, and \`/resume\` inside a session; loading the full conversation history. Sessions can be renamed (\`/rename\`), shared (\`/share link\`) and queried later with natural language or \`/chronicle\`.
- **The Copilot SDK** persists sessions when you supply your own \`sessionId\`, so a service can pause and resume across restarts or container migrations.
- **Cloud agent follow-ups**: mention \`@copilot\` on the pull request; the agent sees the pull request, its branch and prior comments, and uses the same custom agent version for consistency.

To avoid divergence, give the agent an explicit resume protocol in instructions or the agent profile: read the plan file and pull request description first; do not re-run completed steps; if the agreed approach seems wrong, stop and explain rather than switch silently; record any deviation as a decision. Pair this with checkable completion markers (a committed migration, a passing test) so "done" is observed, not remembered.`,
    },
    {
      heading: 'Detecting and correcting drift',
      body: `Drift is the gap between the agreed intent and what the agent is now doing. It grows in long sessions because compaction loses detail, because each tool result nudges the model, and because fixes beget fixes. Detection signals:

- **Scope creep in the diff**: files outside the plan's list, especially in protected areas. Compare the pull request's changed files against the plan.
- **Repeated similar tool calls** or oscillation in the session log: editing the same function back and forth, retrying the same failing command.
- **Summary mismatch**: the agent's own progress summary no longer mentions the original goal or acceptance criteria.
- **Context pressure**: \`/context\` shows the window nearly full or several compactions have occurred.
- **Validation regressions**: tests that passed earlier now fail, or new scan alerts appear.

Corrections, from lightest to strongest:

1. **Steer** with a follow-up prompt in the session (cloud agent) or a queued message in the CLI: restate the goal and point at the plan file.
2. **Re-anchor the context**: ask the agent to re-read the plan and acceptance criteria, or \`/compact\` so the summary is regenerated with the plan and to-do state preserved.
3. **Rewind** in the CLI (\`/undo\`) to the last good point, restoring files.
4. **Reset**: stop the session and start a new one from the artifacts, which is cheap if state was persisted.
5. **Enforce**: hooks that deny edits outside the planned paths, and an \`agentStop\` hook that blocks completion until the acceptance checks have run.

Automations can also detect drift structurally: a self-improving group of automations reviews outcomes and proposes changes to its own prompts and tools, which you accept or decline.`,
    },
    {
      heading: 'Sharing state across tools and preventing conflicting or stale context',
      body: `Agents increasingly hand work to one another: plan mode to agent mode, cloud agent to Copilot CLI ("Continue in GitHub Copilot CLI"), code review to the cloud agent (passing suggestions to open a fix pull request), orchestrator to subagents. State crosses those boundaries safely when it is in a **shared, versioned place with one owner**:

- **Share through Git and GitHub objects.** Branch, plan file, pull request and issue are readable by every surface and by humans. Spaces share curated context for questions. Copilot Memory shares facts across surfaces (a fact discovered by the cloud agent is available to code review).
- **One writer per artifact.** Give each agent its own files or sections; have the orchestrator merge. Fleet mode and subagents each work in their own context and return results, which the parent combines; the SDK notes that fleet mode uses shared to-do state as the coordination substrate.
- **Prevent conflicting context.** Avoid contradictory instructions across levels (personal, repository, organisation); GitHub applies them all and resolves precedence only on GitHub.com. Keep custom agent names unique across repository, organisation and enterprise levels (the lowest level wins). Do not run two agents editing the same files on one branch; use separate branches or worktrees and merge through pull requests.
- **Prevent stale context.** Read the latest state at the start of every turn rather than trusting a summary: Copilot checks a repository fact's citations against the current branch for exactly this reason. Custom agents are versioned by commit SHA, so a pull request keeps the version it started with; re-run from the current default branch when you need the new version. Delete outdated memories and instructions; refresh Spaces; pin tool outputs to a commit SHA when they feed later steps.
- **Make handoffs explicit.** Record "handed to executor at commit abc123 with plan v2" in the pull request; the next agent reads it and does not re-plan.

The exam angle: answers that keep state in a single conversation, copy it between agents by hand, or rely on each agent's memory are wrong; answers that use branch artifacts, issue or pull request state, single ownership and re-reading at turn start are right.`,
    },
  ],
  examples: [
    {
      title: 'A plan file the agent keeps current',
      description:
        'The executor agent is instructed to update docs/plans/ISSUE-88.md after each step and to record deviations in the Decisions section. A human or a resumed session can see at a glance what is done and why.',
      language: 'markdown',
      code: `# Plan: Add idempotent checkout (ISSUE-88)  — v2, approved by @priya 2026-11-10

## Steps
- [x] 1. Add \`Idempotency-Key\` column migration (0042) — commit 3e1f9a2
- [x] 2. Store keys in \`orders/idempotency.py\` — commit 7c0d1b4
- [ ] 3. Enforce key in POST /checkout handler
- [ ] 4. Tests: duplicate key returns 200 with original order

## Decisions
- Used a Postgres unique index rather than Redis: Redis is not available in
  the agent environment and the plan allowed either. (Deviation from v1.)

## Blocked / needs human
- None.`,
      takeaway: 'A versioned plan with completion markers and decisions lets any session or agent resume without repeating or diverging.',
    },
    {
      title: 'A resume protocol in the agent profile',
      description:
        'The profile tells the agent how to pick up work: read the artifacts first, verify completion markers, and refuse to change approach silently. This applies whether the session is resumed in the CLI or the cloud agent is mentioned on the pull request.',
      language: 'markdown',
      code: `---
name: executor
description: Implements an approved plan step by step and keeps the plan file current
tools: ["read", "search", "edit", "execute"]
---
Before doing anything:
1. Read docs/plans/ISSUE-*.md for this task and the PR description.
2. Verify each step marked [x] by checking its commit or test; do not redo it.
3. Continue from the first unchecked step.

While working:
- After each step, tick it in the plan and reference the commit.
- If the approved approach is wrong, STOP, explain in the PR, and wait.
  Never switch approach silently.
- If you have deviated from the plan, add an entry under "Decisions".`,
      takeaway: 'Make reading state the first action of every turn so resumed work is anchored to the artifacts, not to memory.',
    },
    {
      title: 'The conflicting-context mistake and the fix',
      description:
        'Two automations run in the same repository on the same issue trigger: one labels issues using the org\'s taxonomy, another uses an older team taxonomy from a copied prompt. Labels flip back and forth and the agents\' rationale contradicts. The fix: a single owner for labelling (one automation), shared taxonomy in repository instructions rather than in each prompt, and the second automation reconfigured to "Only this issue" with the labelling tool removed, or deleted. Set "Can be triggered by: Anyone except Copilot in the cloud" so one automation\'s changes do not re-trigger the other.',
      takeaway: 'Conflicting context comes from duplicated, divergent sources of truth; consolidate ownership and share the rule from one place.',
    },
  ],
  keyPoints: [
    'Persist task progress and decisions in durable artifacts: a plan file on the branch, the pull request description, issue comments and labels, commits linked to session logs; use Copilot Memory only for durable facts.',
    'Cloud sandbox sessions resume across clients with files intact; Actions-based sessions run each follow-up in a fresh environment, so state must be in the branch and PR.',
    'Copilot CLI resumes with --continue, --resume or /resume; the SDK persists sessions when you supply a sessionId; cloud agent follow-ups via @copilot reuse the same custom agent version.',
    'Give agents a resume protocol: read artifacts first, verify completion markers, continue from the first unchecked step, never switch approach silently.',
    'Detect drift via out-of-plan files in the diff, repeated or oscillating tool calls, summaries that lose the goal, context pressure and validation regressions.',
    'Correct drift from light to strong: steer, re-anchor or /compact, rewind, reset from artifacts, enforce with hooks.',
    'Share state through Git and GitHub objects with one writer per artifact; avoid contradictory instruction layers and duplicate agent names; re-read current state each turn to avoid staleness.',
  ],
  flashcards: [
    { front: 'Where should an agent record task progress so another agent or a human can take over?', back: 'In durable artifacts: a plan file on the branch, the pull request description, issue comments/labels, and commits linked to session logs.' },
    { front: 'Which cloud agent environment lets a session continue across clients with files intact?', back: 'Cloud sandbox sessions; GitHub Actions-based sessions are website-only and each follow-up runs in a fresh environment.' },
    { front: 'How do you resume the most recent Copilot CLI session from the command line?', back: 'copilot --continue (or copilot --resume for a picker, copilot --resume SESSION-ID for a specific session).' },
    { front: 'What must you supply for a Copilot SDK session to be resumable?', back: 'Your own sessionId when creating the session; otherwise a random ID is generated and the session cannot be resumed.' },
    { front: 'Name three signals of drift in a long agent session.', back: 'Files changed outside the plan, repeated or oscillating tool calls, and a progress summary that no longer mentions the original goal (also context pressure and validation regressions).' },
    { front: 'What is the lightest correction for drift in a cloud agent session?', back: 'Steer with a follow-up prompt in the session log that restates the goal and points at the plan.' },
    { front: 'How does Copilot avoid acting on a stale repository-level fact?', back: 'It checks the fact\'s citations against the current branch before relying on it.' },
    { front: 'Which custom agent version is used for follow-ups within a pull request?', back: 'The same version the task started with, for consistency; new tasks use the latest profile on that branch.' },
    { front: 'How do you stop one automation\'s changes from triggering another?', back: 'Set "Can be triggered by" to "Anyone except Copilot in the cloud" (and give each concern a single owning automation).' },
    { front: 'What should an agent do if the approved approach turns out to be wrong mid-execution?', back: 'Stop, explain in the pull request and wait; never switch approach silently. Record deviations as decisions.' },
  ],
  quiz: [
    {
      question:
        'A long-running task will span several cloud agent sessions and may be finished by a different developer. How should progress and decisions be captured?',
      options: [
        'Keep everything in the chat history and ask the next developer to read it.',
        'Maintain a plan file on the branch with completion markers and a decisions section, and keep the pull request description current.',
        'Ask Copilot to remember the progress as a user-level preference.',
        'Increase the model\'s context window.',
      ],
      correct: [1],
      explanation:
        'Durable artifacts in the branch and pull request are visible to everyone and survive sessions. Chat history is volatile, preferences are personal and not for task state, and context size does not create persistence.',
    },
    {
      question:
        'A resumed agent session re-ran a database migration that had already been applied. Which instruction prevents this?',
      options: [
        'Tell the agent to work faster.',
        'Require the agent to read the plan file and verify completion markers (commits, tests) before continuing from the first unchecked step.',
        'Disable compaction.',
        'Run the agent in autopilot mode.',
      ],
      correct: [1],
      explanation:
        'A resume protocol anchored to verifiable markers prevents repetition. Speed, compaction settings and autopilot do not address what the agent knows about prior steps.',
    },
    {
      question:
        'Which TWO are reliable signals that an agent is drifting from the agreed plan during a long execution? (Select two)',
      options: [
        'The pull request now changes files outside the plan\'s file list.',
        'The session log shows the same function being edited back and forth with repeated failing test runs.',
        'The agent\'s commits are signed and marked Verified.',
        'The session consumed AI credits.',
      ],
      correct: [0, 1],
      explanation:
        'Out-of-scope changes and oscillation are drift signals. Signed commits and credit consumption are normal properties of any session.',
    },
    {
      question:
        'Two teams run agents that both edit the same module on the same branch, producing conflicting changes. What is the MOST appropriate fix?',
      options: [
        'Give each agent its own branch or worktree with one owner per artifact and merge through pull requests.',
        'Ask both agents to coordinate through chat.',
        'Grant both agents bypass permissions on the ruleset.',
        'Store the module\'s state as a user-level memory for both agents.',
      ],
      correct: [0],
      explanation:
        'Single ownership and merging through pull requests prevents conflicts. Agents cannot coordinate through chat across sessions, bypasses increase risk, and memories are not shared task state.',
    },
    {
      question:
        'You want work started in a cloud session from the GitHub Copilot app to be continued later in Copilot CLI with files and history intact. Which environment must the session use?',
      options: [
        'A GitHub Actions-based session.',
        'A cloud sandbox session.',
        'A local sandbox session.',
        'Any environment, because all sessions sync files.',
      ],
      correct: [1],
      explanation:
        'Cloud sandbox sessions keep conversation and files in GitHub-hosted infrastructure and can be resumed across clients. Actions-based sessions are website-only and ephemeral, local sandboxes are tied to the machine.',
    },
  ],
  statements: [
    { text: 'GitHub Actions-based cloud agent sessions can be resumed in Copilot CLI with their files intact.', isTrue: false, explanation: 'Actions-based sessions are only available on the website; cloud sandbox sessions are the resumable ones.' },
    { text: 'A Copilot SDK session created without an explicit sessionId cannot be resumed later.', isTrue: true, explanation: 'Providing your own session ID is the key to resumable sessions.' },
    { text: 'When the cloud agent is mentioned on an existing pull request it uses the latest version of the custom agent profile, even if the profile changed since the task began.', isTrue: false, explanation: 'Interactions within the pull request use the same version the task started with.' },
    { text: 'Compaction preserves the current state of any plans or to-do lists along with the summary.', isTrue: true, explanation: 'The summary replaces old history but keeps original instructions and plan/to-do state.' },
    { text: 'Copilot CLI can resume a session by ID with copilot --resume SESSION-ID.', isTrue: true, explanation: 'You can also use /resume inside a session or --continue for the most recent one.' },
    { text: 'Duplicating the same rule in personal, repository and organisation instructions is the recommended way to make sure it is applied.', isTrue: false, explanation: 'GitHub advises avoiding conflicting or duplicated instruction sets; scope each rule to one level.' },
  ],
  resources: [
    { label: 'Managing agent sessions (continue across clients, steer, stop)', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents' },
    { label: 'Session resume and persistence (Copilot SDK)', url: 'https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/session-persistence' },
    { label: 'About GitHub Copilot session data', url: 'https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/session-data' },
    { label: 'Managing context for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/context-management' },
  ],
};
