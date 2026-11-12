import type { Concept } from '../../types';

export const failureAnalysisAndTuning: Concept = {
  id: 'failure-analysis-and-tuning',
  title: 'Analysing Agent Failures and Tuning Instructions, Tools and Memory',
  summary:
    'How to find agent failures in session logs, plans, traces, outputs and workflow artifacts; how to classify root causes as reasoning errors, tool misuse, or context and environment problems; and how to tune by revising instructions, workflows and constraints, refining memory, and refining tool access rather than re-prompting.',
  certs: ['gh-600'],
  domains: ['gh-600-4'],
  outcomes: ['gh-600-4-2-1', 'gh-600-4-2-2', 'gh-600-4-3-1', 'gh-600-4-3-2', 'gh-600-4-3-3'],
  tags: ['root-cause', 'session-logs', 'traces', 'opentelemetry', 'tuning', 'custom-instructions', 'tool-access'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'Where failures show up',
      body: `Agent failures leave evidence in several places; the skill is knowing which artifact answers which question.

| Artifact | What it tells you | Where |
|---|---|---|
| **Session log** | Reasoning, every tool call and result, test and lint output, setup-step output, firewall blocks, token usage, duration | Agents tab or panel on GitHub.com; Copilot app and CLI session history; linked from each commit message |
| **Plan** | The agreed approach; divergence between plan and diff | Plan file on the branch, plan-mode output, pull request description |
| **Traces** | The flow of model calls and tool use with timing | OpenTelemetry traces exported from Copilot clients (CLI, Copilot app, VS Code with Agent Host, SDK) to your observability backend |
| **Outputs** | The pull request diff and description, issue changes with rationale and confidence, comments, reports | Pull request, issue approvals panel, automation run history |
| **Workflow artifacts** | CI logs, test reports, CodeQL and dependency review results, uploaded artifacts | GitHub Actions run pages, Checks tab, Security tab |
| **Hook output** | Denied tool calls with reasons, post-tool audit records, error events | Hook logs, HTTP hook destinations, CLI output |
| **Audit log and enterprise views** | Who started what, when, with which agent; session status (in progress, failed) | Organisation audit log (\`actor:Copilot\`), enterprise AI controls agent sessions with \`status:\`, \`user:\`, \`timeframe:\` filters |

Triage flow: start from the symptom (a bad pull request, a stalled session, a declined suggestion), open the session log to see what the agent believed and did, compare against the plan and instructions, then check workflow artifacts and traces for environment and timing issues. GitHub also lets you query past sessions in natural language ("show me sessions where the agent struggled or I had to correct it multiple times"), which is useful for finding patterns across many runs rather than one.`,
    },
    {
      heading: 'Classifying root causes',
      body: `GH-600 uses three root-cause classes. Each has distinctive evidence and a different fix, so classification determines tuning.

**Reasoning errors.** The agent had the right information and tools but drew the wrong conclusion: misread a requirement, chose a poor design, declared success without checking, weakened a test to pass it, stopped early. Evidence: the session log shows the relevant file was read, the instruction was present, and the agent still chose wrongly; often a plan-versus-diff mismatch. Fixes live in instructions, plan approval, review agents and model choice (custom agents can pin a \`model\`; automations choose model and reasoning level).

**Tool misuse.** The agent called the wrong tool, called a tool with bad arguments, used a tool for an unintended effect (a write where a read was needed, \`git\` commands that the environment denies), or had a tool it should never have had. Evidence: denied tool calls, hook denials, firewall warnings, repeated failing commands with argument variations, MCP errors. Fixes: tool allowlists and aliases, \`--deny-tool\` patterns, read-only MCP tools, hooks, and instructions that name the right tool for the job (for example, "run tests with \`make test-api\`").

**Context or environment issues.** The agent lacked information or capability: missing dependency, blocked host, instructions file not on the default branch, stale or conflicting instructions, compaction dropped a decision, wrong branch, policy disabled a feature, session timed out at 59 minutes. Evidence: setup-step failures, firewall warnings in the pull request, "not available" errors, long sessions with many compactions, differences between surfaces. Fixes: \`copilot-setup-steps.yml\`, firewall allowlist entries, Agents secrets, policy and repository access settings, instruction hygiene, splitting work, choosing the right environment.

A useful discipline is to ask "if I replayed this with perfect instructions, would it still fail?" (environment), "with perfect tools?" (tool misuse), and only then attribute the rest to reasoning.`,
    },
    {
      heading: 'Tuning instructions, workflows and constraints',
      body: `Tuning is changing the system so the failure class cannot recur, in the smallest effective place:

- **Instructions.** Add or sharpen repository-wide instructions for standing rules, path-specific instructions for localised conventions, and custom agent prompts for role behaviour. Prefer short, self-contained statements and examples of the right pattern over long prose. Remove conflicting rules across personal, repository and organisation layers. Instructions are non-deterministic guidance; if a rule must always hold, back it with a hook or permission.
- **Workflows.** Insert a planning step before execution; split a task into smaller issues; move recurring work into an automation or agentic workflow with a precise trigger; add a review subagent; require plan approval for high-risk paths; use Agent Merge for failing checks instead of asking the agent to "fix CI" vaguely.
- **Constraints.** Narrow or widen scope deliberately: budget limits for automations, \`timeout-minutes\` for setup steps, firewall rules, *Configured tools can change: Only this issue*, automation level for issue changes, rulesets for branches and required checks.
- **Environment.** Preinstall dependencies and services in setup steps, pick larger or self-hosted runners for heavy builds, choose a cloud sandbox when cross-repository context matters and setup steps do not.
- **Model and reasoning effort** where available: custom agents can set \`model\` in IDEs; automations choose model and reasoning level; Copilot code review has effort levels.

Validate each tuning change the way you would a code change: run the same task again, compare the signals from the evaluation concept, and keep the change if the signal moved. Organisations can trial custom agents privately from a \`.github-private\` repository's \`.github/agents\` directory before releasing them to the \`agents\` directory.`,
    },
    {
      heading: 'Refining memory and tool access',
      body: `Two tuning levers get their own outcomes on the exam.

**Refining memory usage.** When failures trace to forgotten decisions, stale facts or noisy context: persist decisions to plan files and pull request descriptions; \`/compact\` at phase boundaries and split long sessions; delete outdated repository-level facts in repository settings and outdated user preferences in user settings; promote rules that must always apply from Copilot Memory into instructions or hooks; scope guidance with path-specific instructions and role-specific custom agents; keep large tool output out of context (the CLI's 20 KiB threshold, summarised test output, research delegated to subagents). Conversely, when the agent keeps re-discovering the same facts (how to run tests, where migrations live), *add* durable knowledge: an instructions file entry or an explicit "remember that..." prompt.

**Refining tool usage and tool access.** When failures trace to the wrong tool or too much power: list exact tools in the custom agent's \`tools\` property instead of a wildcard, name MCP tools with \`server/tool\`, require \`readOnlyHint\` for review tools, tighten \`--allow-tool\`/\`--deny-tool\` patterns in CLI automations, remove tools from an automation that it never legitimately needs, and add a \`preToolUse\` hook for the hard boundary. When failures trace to *missing* capability (the agent could not reproduce a production error because it had no access to the error tracker), add a scoped MCP server with read-only tools and an Agents secret bound to a service account, rather than giving developers' personal tokens.

Both levers interact with evaluation: after each change, watch the signals that motivated it (steering prompts per pull request, denied tool calls, firewall warnings, declined suggestions) and stop tuning when they stabilise. Chasing every anomaly with a new rule bloats instructions and reintroduces the context problems you were fixing.`,
    },
  ],
  examples: [
    {
      title: 'Reading a session log to classify a failure',
      description:
        'A pull request from the cloud agent changed the wrong module. The session log shows the agent searched for "rate limit", found two implementations, picked the first without reading the issue\'s pointer to src/api/throttle.py, and never ran the tests because make was missing. Two root causes emerge: a reasoning error (ignored the pointer) and an environment issue (no make). The team records the classification and the fixes.',
      language: 'text',
      code: `Symptom      PR #412 edits src/legacy/limiter.py instead of src/api/throttle.py
Evidence     Session log: search("rate limit") -> 2 hits; view(src/legacy/limiter.py);
             edit(...); execute("make test-api") -> "make: command not found"; finish.
Root causes  1. Reasoning: issue said "throttle.py"; agent did not read it after search.
             2. Environment: make not installed; tests never ran, so the error was not caught.
Fixes        1. Instructions: "When the issue names a file, open it before searching."
                Add path-specific rule: src/legacy/** is frozen; do not edit.
             2. copilot-setup-steps.yml installs make and runs \`uv sync\`.
             3. agentStop hook blocks finishing if .tests-ran marker is missing.
Validation   Re-run the same issue; check diff paths and that tests executed.`,
      takeaway: 'Classify each contributing cause separately; reasoning fixes go in instructions, environment fixes go in setup steps and hooks.',
    },
    {
      title: 'Tuning tool access after tool misuse',
      description:
        'A documentation agent had all tools and started running the full test suite and pushing unrelated formatting changes. The tuned profile narrows tools to what documentation work needs, and a CLI automation that uses the same agent gets matching allow/deny rules.',
      language: 'markdown',
      code: `---
name: docs-writer
description: Updates Markdown documentation to match code changes; never edits code or runs builds
tools: ["read", "search", "edit"]
---
Edit only files under docs/** and README.md. Do not run commands.
When code behaviour is unclear, quote the relevant source lines in the PR
description and ask a maintainer instead of guessing.

# CLI automation equivalent
# copilot -p "Update docs for the changes in HEAD" -s \\
#   --available-tools='view,grep,glob,edit' \\
#   --allow-tool='write(docs/**),write(README.md)' --deny-tool='shell'`,
      takeaway: 'When the root cause is tool misuse, remove the tool rather than instructing the agent not to use it.',
    },
    {
      title: 'The re-prompting mistake and the fix',
      description:
        'After each bad pull request, a developer writes a longer issue: "Remember to run tests. Remember not to touch legacy code. Remember to follow the error pattern." The issues grow, results do not improve, and other developers\' tasks still fail the same way. The fix is to move each recurring rule to the right place once: test and build commands into copilot-instructions.md, the frozen path into a path-specific instruction plus a preToolUse hook, the error pattern into a repository-level memory and an instruction with a code example, and tool access narrowed in a custom agent. Future issues shrink back to problem and acceptance criteria.',
      takeaway: 'Tuning changes the system for everyone; re-prompting changes one task and leaves the failure class in place.',
    },
  ],
  keyPoints: [
    'Find failures in session logs (reasoning, tool calls, tests), plans (intent versus diff), traces (OpenTelemetry), outputs (PRs, issue changes with rationale), workflow artifacts (CI, scans) and audit or enterprise session views.',
    'Classify root causes as reasoning errors (right info, wrong conclusion), tool misuse (wrong tool, bad arguments, excess power) or context/environment issues (missing info or capability, stale or conflicting context, timeouts).',
    'Tune in the smallest effective place: instructions for guidance, workflows for structure (plan steps, splitting, review agents), constraints for limits (budgets, firewall, automation level, rulesets), environment for capability.',
    'Instructions are non-deterministic; rules that must always hold need hooks or permissions behind them.',
    'Refine memory by persisting decisions, compacting at phase boundaries, pruning stale facts and preferences, promoting must-follow rules to instructions, and scoping guidance by path and role.',
    'Refine tool access by naming exact tools and MCP tools, requiring read-only annotations for review, tightening CLI allow/deny patterns, removing unneeded automation tools, and adding scoped MCP servers when capability is missing.',
    'Validate each tuning change by re-running the task and watching the signals that motivated it; stop when they stabilise.',
  ],
  flashcards: [
    { front: 'Which artifact shows the agent\'s reasoning and every tool call it made?', back: 'The session log, available from the Agents tab/panel and linked from each agent commit message.' },
    { front: 'What are the three root-cause classes used in GH-600?', back: 'Reasoning errors, tool misuse, and context or environment issues.' },
    { front: 'Evidence pattern for a reasoning error?', back: 'The relevant information and tools were present in the session log, yet the agent chose wrongly; often a plan-versus-diff mismatch.' },
    { front: 'Evidence pattern for tool misuse?', back: 'Denied tool calls, hook denials, firewall warnings, repeated failing commands with varied arguments, MCP errors.' },
    { front: 'Evidence pattern for an environment issue?', back: 'Setup-step failures, missing commands, blocked hosts, instructions not on the default branch, timeouts, many compactions.' },
    { front: 'An agent keeps running the full test suite and pushing formatting changes while writing docs. Which tuning lever?', back: 'Refine tool access: restrict the custom agent\'s tools to read, search and edit (and deny shell in CLI automations).' },
    { front: 'An agent repeatedly forgets a mid-task decision. Which tuning lever?', back: 'Refine memory: persist decisions to a plan file and PR, compact at phase boundaries, split long sessions.' },
    { front: 'Why is re-prompting a weak fix?', back: 'It changes one task only; moving the rule into instructions, hooks, tools or environment fixes the failure class for everyone.' },
    { front: 'Where can organisations trial a custom agent before releasing it?', back: 'In the .github/agents directory of the organisation\'s .github-private repository, then move it to the agents directory to release.' },
    { front: 'What do OpenTelemetry traces add that session logs do not?', back: 'A connected view of model calls and tool use with timing across sessions in your observability backend.' },
  ],
  quiz: [
    {
      question:
        'A cloud agent pull request edited the wrong module even though the issue named the correct file, and the session log shows the agent never opened that file. How should you classify the root cause?',
      options: [
        'Environment issue',
        'Reasoning error',
        'Tool misuse',
        'Firewall block',
      ],
      correct: [1],
      explanation:
        'The information was available and the tools worked; the agent drew the wrong conclusion. Nothing indicates a missing capability, a wrong tool, or a blocked host.',
    },
    {
      question:
        'Session logs show "make: command not found" and tests never ran before the agent finished. Which tuning action addresses the root cause?',
      options: [
        'Add "please run tests" to every issue.',
        'Add make and dependency installation to copilot-setup-steps.yml and block completion with an agentStop hook until tests have run.',
        'Switch the custom agent\'s model.',
        'Disable the firewall.',
      ],
      correct: [1],
      explanation:
        'This is an environment issue fixed by deterministic setup, with a hook to enforce the validation step. Re-prompting, model changes and firewall changes do not install tooling.',
    },
    {
      question:
        'Which TWO artifacts would you check first to determine whether an agent diverged from the agreed approach? (Select two)',
      options: [
        'The plan file or plan-mode output describing the approved approach',
        'The pull request diff and the session log of tool calls',
        'The organisation\'s billing dashboard',
        'The MCP registry URL',
      ],
      correct: [0, 1],
      explanation:
        'Divergence is detected by comparing intent (plan) with what was done (diff and log). Billing and registry settings do not describe behaviour.',
    },
    {
      question:
        'A documentation agent with all tools enabled keeps running builds and reformatting code. What is the MOST effective tuning change?',
      options: [
        'Add "do not run builds" to its prompt.',
        'Restrict its tools property to read, search and edit so it cannot execute commands.',
        'Increase its AI credit limit so it finishes anyway.',
        'Move it to a larger runner.',
      ],
      correct: [1],
      explanation:
        'Tool misuse is fixed by removing the tool. Prompt text is advisory, and budgets or runners do not change capability.',
    },
    {
      question:
        'After several tuning rounds the repository instructions file has grown to hundreds of rules and agents now ignore some of them. What should you do?',
      options: [
        'Keep adding rules until behaviour stabilises.',
        'Prune and scope: move localised rules into path-specific instructions and custom agents, delete obsolete rules, and back must-hold rules with hooks or permissions.',
        'Disable custom instructions entirely.',
        'Store all the rules as user-level memories instead.',
      ],
      correct: [1],
      explanation:
        'Over-long instructions compete for context and are followed less reliably; scoping and pruning restore effectiveness. Disabling loses guidance, and memories are not guaranteed to apply.',
    },
  ],
  statements: [
    { text: 'Each cloud agent commit message links to the session log that produced it.', isTrue: true, explanation: 'This lets reviewers and auditors trace a change back to the agent\'s reasoning.' },
    { text: 'If an agent had the right information and tools but chose wrongly, the root cause is an environment issue.', isTrue: false, explanation: 'That pattern is a reasoning error; environment issues involve missing information or capability.' },
    { text: 'Custom instructions guarantee deterministic agent behaviour once written clearly.', isTrue: false, explanation: 'GitHub notes Copilot may not always follow instructions the same way; rules that must hold need hooks or permissions.' },
    { text: 'Removing an unnecessary tool from a custom agent is a valid way to fix tool misuse.', isTrue: true, explanation: 'Capability removal is more reliable than instructing the agent not to use the tool.' },
    { text: 'Natural-language queries over past sessions can help find patterns such as sessions where the user corrected the agent repeatedly.', isTrue: true, explanation: 'Session querying searches synced sessions across Copilot surfaces.' },
    { text: 'Writing longer issue prompts after each failure is the recommended tuning strategy.', isTrue: false, explanation: 'Recurring rules belong in instructions, hooks, tools and environment so every task benefits.' },
  ],
  resources: [
    { label: 'Managing agent sessions (session logs and queries)', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents' },
    { label: 'OpenTelemetry for agent monitoring', url: 'https://docs.github.com/en/copilot/concepts/enterprise/opentelemetry' },
    { label: 'Custom instructions for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/custom-instructions' },
    { label: 'Testing and releasing custom agents in your organization or enterprise', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/test-custom-agents' },
  ],
};
