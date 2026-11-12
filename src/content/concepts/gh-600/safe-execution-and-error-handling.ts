import type { Concept } from '../../types';

export const safeExecutionAndErrorHandling: Concept = {
  id: 'safe-execution-and-error-handling',
  title: 'Safe Execution Paths: Error Handling, Retries, Rollbacks, Escalation and Traceability',
  summary:
    'How to design agent workflows that fail safely on GitHub: handling tool and environment errors, retrying with backoff and limits, rolling back agent changes with git and session rewind, escalating to humans through pull requests, issues and approvals, and keeping every action traceable through session logs, signed co-authored commits and audit events.',
  certs: ['gh-600', 'gh-700'],
  domains: ['gh-600-2', 'gh-700-4'],
  outcomes: ['gh-600-2-4-1', 'gh-600-2-4-2', 'gh-600-2-4-3', 'gh-600-2-4-4', 'gh-600-2-4-5', 'gh-700-4-1-3'],
  tags: ['error-handling', 'retries', 'rollback', 'escalation', 'traceability', 'hooks', 'audit-log'],
  difficulty: 'intermediate',
  diagram: 'escalation-decision',
  sections: [
    {
      heading: 'Error handling: classify, contain, continue or stop',
      body: `Agents meet errors constantly: a test fails, a command is denied by permissions, a tool returns malformed output, the firewall blocks a download, an MCP server is unreachable. A well-designed agent workflow treats each as data, not as a reason to improvise. Three habits make execution safe:

- **Classify before reacting.** Transient (network timeout, rate limit, flaky test), deterministic (compile error, failing assertion, denied permission) or environmental (missing dependency, blocked host). Only transient errors deserve a blind retry. Deterministic errors need a different approach; environmental ones need an environment change.
- **Contain the blast radius.** Agents act on their own branch, in an ephemeral environment, with scoped tokens, so an error cannot damage the default branch or production. Keep it that way: never give the agent a deploy credential "so it can fix the pipeline".
- **Make errors visible and actionable.** The cloud agent surfaces firewall blocks as warnings in the pull request, writes test and lint output to the session log, and reports validation findings (CodeQL, secret scanning, dependency advisories) before finishing. GitHub Agentic Workflows fail the run if a required safe output is missing its rationale metadata when \`issue-intent: true\` is set. Hooks provide the programmable layer: \`postToolUse\` can log failures and raise alerts, \`errorOccurred\` can record error patterns, \`agentStop\` can force another turn with a \`block\` decision when a required check did not pass.

In the Copilot SDK, hooks have explicit error-handling semantics and the CLI documents which failures are fail-open (most events, timeouts) and which are fail-closed (\`preToolUse\` command hooks). Design for the fail-closed path: if a gate cannot run, the action should not run.`,
    },
    {
      heading: 'Retries and rollbacks',
      body: `**Retries** need a budget and a reason. Patterns that work on GitHub:

- The agent's own loop: in autopilot mode it runs checks, reads failures and revises until done. Bound it with instructions ("try at most two approaches, then summarise what blocked you") and with budgets: AI-credit limits per run, daily, weekly and monthly for automations; session limits in the CLI; the 59-minute cap on Actions sessions.
- Workflow-level retries: Agent Merge ("Watch and fix") re-runs on failing checks and merge conflicts; a stuck cloud agent session can be retried by unassigning and reassigning the issue, or by re-posting the comment.
- Deterministic retries belong in setup, not in the model: \`copilot-setup-steps.yml\` installs dependencies so the agent does not discover them by trial and error.

**Rollbacks** rely on Git being the system of record:

- Everything the cloud agent does lands as commits on a \`copilot/\` branch in a draft pull request. Rolling back is closing the pull request, reverting a commit, or asking \`@copilot\` to undo a change. The checkout depth in setup steps is overridden by GitHub precisely so the agent can roll back commits on request.
- Copilot CLI offers **rewind** (\`/undo\`, \`/rewind\`, or double Esc when idle) to roll conversation history back to a rewind point and optionally restore the files Copilot changed, skipping files you edited afterwards. Rewind is permanent and unavailable for remote-backed sessions or while work is in progress.
- Automations and agentic workflows should produce *reviewable* outputs (issues, comments, pull requests) rather than direct mutations, so reverting is declining or closing rather than repairing.
- Stopping a session does not undo changes already made; plan the rollback path before the run, not after.`,
    },
    {
      heading: 'Escalation paths',
      body: `An escalation path answers "who or what takes over when the agent should not continue?" The decision is driven by tool usage and risk: reads continue, reversible writes continue on the agent's branch, anything irreversible or outside the task's scope escalates. GitHub gives agents natural escalation channels:

- **The pull request.** The agent describes what it could not do in the pull request body, requests a human reviewer, and leaves the pull request as a draft. Reviewers steer with \`@copilot\` comments (only comments from users with write access reach the agent).
- **Issues and comments.** Agentic workflows and automations open issues or comments as safe outputs to hand a decision to a human; automation suggestions wait in the approvals panel, discoverable with \`has:suggestions\`.
- **Permission denials as escalation.** In non-interactive CLI runs, an action not on the allow list is denied and the model receives the reason, so it can take a different approach or stop and report. In assisted-permissions mode the model-based reviewer escalates uncertain requests to the user; in autopilot or non-interactive runs they are denied instead.
- **Hooks.** A \`preToolUse\` hook can deny with a \`permissionDecisionReason\` that tells the agent to escalate; an HTTP hook can notify an on-call channel (in the cloud agent only to firewall-allowed hosts).
- **Stop.** Humans can stop a cloud agent session (preserving pushed commits), kill subagent tasks in the CLI \`/tasks\` view, or disable an automation.

Document the path in the agent's instructions: what to do on failure (summarise, link logs, request a specific reviewer or CODEOWNERS team) and what never to do (retry destructive operations, widen permissions, work around the firewall).`,
    },
    {
      heading: 'Traceability and accountability',
      body: `Accountability on GitHub means any action can be attributed to an agent session, to the human who initiated it, and to the configuration in force at the time:

- **Commits**: authored by Copilot, co-authored by the requester, signed (Verified), with a session-log link in the message. Shared automations attribute actions to Copilot; personal automations to their creator, who then cannot approve the resulting pull request.
- **Session logs**: the full record of prompts, reasoning, tool calls, test output and setup-step output; Actions-based sessions are shared by default with repository collaborators, and local sessions can be shared or exported (\`/share link|gist|file|html\`). Session data syncs to the user's account subject to the *Store local sessions in the Cloud* policy.
- **Audit log**: agentic events with an \`agent_session_id\`, filterable by \`actor:Copilot\`; streaming of agent-session events and Copilot API usage records for eligible enterprises; enterprise AI controls list sessions with \`status:\`, \`user:\` and \`timeframe:\` filters.
- **Configuration as code**: custom agents are versioned by commit SHA, instructions and hooks live in the repository, agentic workflows commit their \`.lock.yml\`, so you can reconstruct what rules applied to a given run.
- **OpenTelemetry**: traces connecting model calls and tool use, with capture classes for identity, prompts, responses, tool arguments and output that administrators enable only when needed.

The exam angle: when asked how to make agent actions auditable, choose answers that use these built-in artifacts and keep agents on pull-request-based paths; answers that let agents push directly to protected branches, run with shared personal tokens, or operate outside GitHub's session model lose traceability.`,
    },
  ],
  examples: [
    {
      title: 'A hook set that logs failures and blocks completion without tests',
      description:
        'The repository hooks record every failed tool call to an audit endpoint and force the agent to take another turn if it tries to finish without having run the test command. In the cloud agent, the HTTP hook target must be on the firewall allowlist and files written locally are discarded with the sandbox.',
      language: 'json',
      code: `{
  "version": 1,
  "hooks": {
    "postToolUse": [
      {
        "type": "http",
        "url": "https://audit.contoso.corp/agent-events",
        "timeoutSec": 5
      }
    ],
    "agentStop": [
      {
        "type": "command",
        "bash": "if [ -f .tests-ran ]; then echo '{\\"decision\\":\\"allow\\"}'; else echo '{\\"decision\\":\\"block\\",\\"reason\\":\\"Run make test-api and report the results before finishing.\\"}'; fi",
        "timeoutSec": 10
      }
    ]
  }
}`,
      takeaway: 'postToolUse gives you an audit trail; agentStop with a block decision turns a missed step into another turn instead of a silent finish.',
    },
    {
      title: 'Escalation instructions and a rollback path in the agent profile',
      description:
        'A custom agent used for dependency upgrades is told exactly how to escalate and how its work is rolled back. Because it only ever produces a draft pull request, rollback is closing the pull request or reverting the commit, and the reviewer team is named.',
      language: 'markdown',
      code: `---
name: dependency-upgrader
description: Upgrades one dependency at a time and validates with the full test suite
tools: ["read", "search", "edit", "execute"]
---
Upgrade exactly one dependency per task.

On failure:
1. If tests fail after the upgrade, try at most ONE compatible fix. If it still
   fails, revert your change (git revert) and describe the failure in the PR.
2. If a command is denied or a host is blocked by the firewall, do not work
   around it. Record the blocked command in the PR body under "Needs human".
3. Request review from @contoso/platform-reviewers and leave the PR as a draft.

Never: modify lockfiles for other packages, change CI workflows, or retry a
failing database migration.`,
      takeaway: 'Escalation and rollback are part of the task definition; the agent should know when to stop and whom to hand off to.',
    },
    {
      title: 'The silent-retry mistake and the fix',
      description:
        'An automation that fixes failing nightly builds is allowed to push changes and run with a high per-run credit limit. One night a flaky external API causes failures; the agent retries different "fixes" for forty minutes, rewriting retry logic across the codebase and consuming the budget before the session hits the 59-minute cap. The fix: classify the failure first (instructions to detect external-service errors and stop), set a modest per-run AI-credit limit, make the automation open an issue via a safe output instead of pushing code when the cause is external, and require Approve and run workflows so no unreviewed change reaches CI.',
      takeaway: 'Unbounded retries turn a transient fault into a large diff; budget the loop and escalate when the cause is outside the repository.',
    },
  ],
  keyPoints: [
    'Classify errors as transient, deterministic or environmental; only transient errors deserve a retry, deterministic ones need a new approach, environmental ones need setup steps or allowlist changes.',
    'Bound retries with instructions, AI-credit limits (per run, daily, weekly, monthly), CLI session limits and the 59-minute Actions cap; use Agent Merge for failing checks and merge conflicts.',
    'Rollback relies on Git: agent work lands on a copilot/ branch in a draft PR (close, revert or ask @copilot to undo); Copilot CLI rewind (/undo, /rewind, double Esc) restores conversation and files but is permanent and local-only.',
    'Stopping a session does not undo pushed changes; design the rollback path before the run.',
    'Escalate through pull requests, issues and comments, permission denials, hooks (deny with a reason, HTTP notifications) and stop controls; only users with write access can steer the cloud agent.',
    'preToolUse command hooks are fail-closed; most other hook failures and all timeouts are fail-open, so put hard gates in preToolUse.',
    'Traceability comes from signed co-authored commits linking to session logs, shared session logs, audit log events with agent_session_id, versioned agent configuration and optional OpenTelemetry.',
  ],
  flashcards: [
    { front: 'Which hook event can force the agent to take another turn before finishing?', back: 'agentStop (or subagentStop) returning decision: "block" with a reason that becomes the next prompt.' },
    { front: 'Which hook failures are fail-closed?', back: 'preToolUse command hooks: a crash, exit 2 or other non-zero exit denies the tool call. Timeouts are fail-open for every event.' },
    { front: 'How do you roll back changes made in a Copilot CLI session?', back: 'Use /undo or /rewind (or press Esc twice when idle) to pick a rewind point and optionally restore the files Copilot changed; it cannot be undone.' },
    { front: 'Does stopping a cloud agent session revert its commits?', back: 'No. Stopping ends the run and preserves commits already pushed; roll back via the pull request or git revert.' },
    { front: 'How can a stuck Actions-based cloud agent session be retried?', back: 'It times out after an hour; unassign and reassign the issue, or re-post the comment that triggered it.' },
    { front: 'What happens to a non-pre-approved action in a non-interactive copilot -p run?', back: 'It is denied and the reason is passed back so the agent can take another approach or report.' },
    { front: 'How are cloud agent commits made traceable to intent?', back: 'They are co-authored by the requester, signed, and the commit message links to the session log.' },
    { front: 'Which audit log field links an event to the agent session that produced it?', back: 'agent_session_id.' },
    { front: 'Who can steer a cloud agent session with @copilot comments?', back: 'Only users with write access to the repository; other comments are never shown to the agent.' },
    { front: 'What limits can you set to bound an automation\'s cost?', back: 'AI-credit limits per run (minimum 30), daily, weekly and monthly.' },
  ],
  quiz: [
    {
      question:
        'An agent\'s test command fails because a package download was blocked by the firewall. According to good error-handling practice, what should the agent do and what should you change?',
      options: [
        'The agent should disable the firewall; you should grant it admin rights.',
        'The agent should report the blocked host in the pull request; you should add the host to the custom allowlist or preinstall the package in copilot-setup-steps.yml.',
        'The agent should retry the download every minute until the session times out.',
        'The agent should remove the dependency from the project.',
      ],
      correct: [1],
      explanation:
        'Environmental errors need an environment fix, not retries or workarounds. The agent cannot and should not change the firewall; removing dependencies changes scope.',
    },
    {
      question:
        'You need a hard guarantee that the agent cannot run a destructive command even if the hook that checks it crashes. Which hook event provides fail-closed behaviour?',
      options: [
        'postToolUse',
        'preToolUse command hook',
        'sessionEnd',
        'userPromptSubmitted',
      ],
      correct: [1],
      explanation:
        'preToolUse command hooks deny the call on crash or non-zero exit. The other events log or react after the fact and are fail-open.',
    },
    {
      question:
        'A developer wants to undo the last two turns of a Copilot CLI session, including file changes, but keep edits they made by hand afterwards. What should they use?',
      options: [
        'Stop session in the Agents tab.',
        '/undo (or /rewind) and choose to restore files; Copilot skips files whose current contents differ from what it last wrote.',
        'git push --force to the default branch.',
        '/compact',
      ],
      correct: [1],
      explanation:
        'Rewind restores only files Copilot changed and skips ones edited afterwards. Stop session is for cloud sessions, force-pushing is destructive, and /compact summarises context.',
    },
    {
      question:
        'Which TWO features give an auditor a chain from a merged line of code back to the agent session and the person who initiated it? (Select two)',
      options: [
        'Commits co-authored by the requester whose message links to the session log',
        'Audit log events carrying an agent_session_id',
        'The repository\'s MCP registry URL',
        'The size of the GitHub Actions runner',
      ],
      correct: [0, 1],
      explanation:
        'Commit metadata and audit events are the traceability artifacts. Registry URLs and runner size are configuration details unrelated to attribution.',
    },
    {
      question:
        'A nightly automation that pushes build fixes sometimes spends its whole budget retrying when an external API is down. What is the BEST set of changes?',
      options: [
        'Raise the per-run AI credit limit and extend the session.',
        'Instruct the agent to detect external-service errors and stop, set a modest per-run credit limit, and have it open an issue via a safe output instead of pushing code when the cause is external.',
        'Allow workflows to run automatically on the agent\'s pushes so fixes land faster.',
        'Grant the automation the deploy tool so it can restart the external service.',
      ],
      correct: [1],
      explanation:
        'Classification plus budgets plus escalation stops runaway retries. Raising limits and auto-running workflows increase cost and risk; the external service is outside the agent\'s scope.',
    },
    {
      question:
        'A reviewer without write access comments "@copilot please fix the typo" on an agent pull request and nothing happens. Why?',
      options: [
        'The pull request must be marked ready for review first.',
        'Only comments from users with write access are passed to the cloud agent.',
        'The firewall blocked the comment.',
        'Copilot only responds to comments that include a session ID.',
      ],
      correct: [1],
      explanation:
        'GitHub limits who can trigger or steer the agent to users with write access. Draft status, the firewall and session IDs are unrelated.',
    },
  ],
  statements: [
    { text: 'Stopping a cloud agent session reverts any commits it already pushed.', isTrue: false, explanation: 'Stopping preserves pushed commits; rollback is done through the pull request or git.' },
    { text: 'Copilot CLI rewind can restore files the agent changed while leaving your later manual edits intact.', isTrue: true, explanation: 'Files whose current contents no longer match what Copilot last wrote are skipped.' },
    { text: 'Hook timeouts for preToolUse deny the tool call.', isTrue: false, explanation: 'Timeouts are fail-open for every event; crashes and non-zero exits of preToolUse command hooks are fail-closed.' },
    { text: 'An agentStop hook can return a block decision to make the agent continue working.', isTrue: true, explanation: 'The reason becomes the prompt for the next turn.' },
    { text: 'Shared automations attribute their GitHub actions to the user who created the automation.', isTrue: false, explanation: 'Shared automations are attributed to Copilot; personal automations are attributed to their creator.' },
    { text: 'Automations can be limited by per-run, daily, weekly and monthly AI-credit limits.', isTrue: true, explanation: 'Per-run limits stop a run; the others prevent new runs from starting.' },
    { text: 'The checkout depth set in copilot-setup-steps.yml is honoured exactly as written.', isTrue: false, explanation: 'GitHub overrides fetch-depth so the agent can roll back commits on request.' },
  ],
  resources: [
    { label: 'GitHub Copilot hooks reference', url: 'https://docs.github.com/en/copilot/reference/hooks-reference' },
    { label: 'Canceling operations and rolling back changes in Copilot CLI', url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/roll-back-changes' },
    { label: 'Troubleshooting GitHub Copilot cloud agent', url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/troubleshoot-cloud-agent' },
    { label: 'Risks and mitigations for GitHub Copilot cloud agent', url: 'https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations' },
  ],
};
