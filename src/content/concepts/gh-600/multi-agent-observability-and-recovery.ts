import type { Concept } from '../../types';

export const multiAgentObservabilityAndRecovery: Concept = {
  id: 'multi-agent-observability-and-recovery',
  title: 'Multi-Agent Observability, Failure Detection and Recovery',
  summary:
    'How to make multi-agent workflows produce review- and audit-ready artifacts, document decisions and handoffs across agents, analyse behaviour after the fact with session logs, audit events and OpenTelemetry, detect failed, partial or stalled executions, respond to degraded coordination, and recover with rollback and human-in-the-loop patterns.',
  certs: ['gh-600', 'gh-700'],
  domains: ['gh-600-5', 'gh-700-4'],
  outcomes: ['gh-600-5-2-1', 'gh-600-5-2-2', 'gh-600-5-2-3', 'gh-600-5-3-1', 'gh-600-5-3-2', 'gh-600-5-3-3', 'gh-700-4-2-3', 'gh-700-4-3-3'],
  tags: ['observability', 'audit', 'session-logs', 'opentelemetry', 'stalled-sessions', 'recovery', 'human-in-the-loop'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'Artifacts suitable for review and audit',
      body: `Multi-agent work multiplies the places where something can go wrong, so every agent in the workflow should leave artifacts in the shared system of record. On GitHub that means:

- **One pull request per agent task**, each with the agent's summary, the custom agent name, validation results and firewall warnings. Parallel workers therefore produce parallel, reviewable pull requests rather than one opaque merge.
- **Session logs per session**, shared by default for GitHub Actions-based cloud sessions and shareable (\`/share link\`, gist, Markdown or HTML export) for local ones. The Agents tab "All sessions" view lists every session in the repository.
- **Signed, co-authored commits** with session-log links, so the git history of a multi-agent branch is itself an audit trail.
- **Issue-level records**: rationale and confidence on automation changes, suggestions in the approvals panel, labels and comments used as handoff markers.
- **Reports as safe outputs**: agentic workflows and automations create issues or comments summarising what each run did; dynamic workflows return structured results and can require agents to answer in a specified format.
- **Workflow run logs and uploaded artifacts** in GitHub Actions for CI agents, with the compiled \`.lock.yml\` showing exactly what guardrails applied.
- **Audit log** events carrying \`agent_session_id\` and the initiating user, streamable to external systems for eligible enterprises; enterprise AI controls show agent sessions with filters.

Configure for this deliberately: tell orchestrators to post a consolidated summary (which worker did what, with links), give each worker a required return format, and keep sessions shared within the repository. Avoid patterns that hide work, such as agents pushing straight to a shared branch without a pull request or running outside GitHub's session model.`,
    },
    {
      heading: 'Documenting decisions, handoffs and outcomes',
      body: `In a single-agent task the pull request description is enough. Across agents you need an explicit **handoff record** so reviewers and later analysts can reconstruct who decided what:

- **Decision log** in the plan file or pull request: decision, reason, which agent made it, at which commit. Dynamic workflows and orchestrators should write this; subagents return it in their result format.
- **Handoff markers**: "handed to executor at commit abc123 with plan v2", a label such as \`ready-for-review-agent\`, or a comment from the orchestrator naming the next agent. In GitHub Agentic Workflows the \`assign-to-agent\` safe output is itself a recorded handoff.
- **Outcome summary** at the end: what merged, what was declined, which checks passed, how many steering prompts or retries were needed, credits consumed (session logs show token usage and length; automation panes show credits per run).
- **Rationale on automated changes**: automations attach rationale and confidence automatically; agentic workflows can require it with \`issue-intent: true\`, failing the run if the agent omits it.
- **Consistent identifiers**: issue number, plan version and session IDs appear in every artifact so you can join them later (commit message, PR description, audit events, OTel traces).

The exam angle: "document key decisions, handoffs and outcomes" is answered with artifacts in the repository, issue and pull request produced by the agents themselves, not with a separate wiki a human fills in afterwards.`,
    },
    {
      heading: 'Post-hoc analysis and failure detection',
      body: `**Post-hoc analysis** reconstructs a multi-agent run from its artifacts: start at the outcome (merged or closed pull requests, final issue state), follow commit links to each session log, align sessions by time using the Agents tab or enterprise session view, and compare each worker's result against the plan and the orchestrator's summary. OpenTelemetry traces connect model calls and tool use across sessions with timing; capture classes (identity, prompts, responses, tool arguments, tool output, policy detail) are off by default and enabled only when an investigation needs them. Natural-language session queries ("what agent tasks did I run last week", "sessions where I had to correct the agent") and CLI \`/chronicle\` subcommands summarise patterns across many sessions.

**Detecting failed, partial or stalled executions**:

| State | Signals |
|---|---|
| **Failed** | Session status failed in the enterprise view (\`status:\` filter); pull request closed without merge; CI red; hook or firewall denials in the log; automation run marked failed; agentic workflow run failed (for example missing required issue intent) |
| **Partial** | Plan checklist with unchecked steps; pull request description listing "Needs human"; a worker returned without its required fields; some parallel pull requests missing; coverage or test delta smaller than expected |
| **Stalled** | Session shows no new log entries for a long time; "Copilot started work" with no pull request; Actions session approaching the 59-minute cap; \`/tasks\` shows a subagent still running with no output; queued steering prompts never consumed |

Build detection into the workflow: orchestrators report missing worker results; \`agentStop\`/\`subagentStop\` hooks block completion when required outputs are absent; automations and workflows set per-run credit limits and timeouts; humans watch the Agents tab or enterprise AI controls for sessions in progress longer than expected.`,
    },
    {
      heading: 'Responding to degraded behaviour and recovery patterns',
      body: `Degradation shows up as rising retries, more steering per pull request, declined suggestions, contradictory outputs between agents, or sessions timing out. Respond in order of increasing force:

1. **Steer** the affected session with a follow-up prompt that restates the goal and the handoff contract.
2. **Stop** the session (preserving pushed commits), kill a runaway subagent in \`/tasks\`, or disable the automation; agentic workflows can be disabled like any Actions workflow.
3. **Retry with a fix**: unassign and reassign the issue after fixing the environment or instructions; re-run the automation with *Run now* against the same resource; Agent Merge for failing checks.
4. **Isolate**: narrow the misbehaving agent's tools, lower the automation level, pause one automation so another can finish.
5. **Roll back**: close or revert the agent's pull request (each task has its own branch, so rollback is per task); in the CLI use \`/undo\` to a rewind point; decline pending suggestions in the approvals panel; for shared-branch damage, \`git revert\` the agent commits identified by their session links.
6. **Human-in-the-loop takeover**: a human (or a fresh agent) resumes from the artifacts; *Open in VS Code* or *Continue in Copilot CLI* brings a cloud session to a local machine; cloud sandbox sessions resume with files intact.

Recovery patterns worth naming: **checkpoint and resume** (dynamic workflows pause at checkpoints; plan files record completed steps), **compensating action** (revert pull request, undo labels, close duplicate issues), **circuit breaker** (credit limits and timeouts that stop runaway loops), **fallback to human** (safe outputs that open an issue instead of pushing when the agent is unsure), and **quarantine** (\`disable-model-invocation: true\` on an agent under investigation). Afterwards, run the failure analysis loop: classify root causes and tune instructions, tools or environment so the multi-agent system does not degrade the same way again.`,
    },
  ],
  examples: [
    {
      title: 'An orchestrator summary that doubles as the audit record',
      description:
        'The orchestrating agent is instructed to post a consolidated comment on the tracking issue when all workers finish. Each line links the worker\'s pull request and session so a reviewer or auditor can reconstruct the run without opening every log.',
      language: 'markdown',
      code: `## Fleet summary — ISSUE-204 logging migration (plan v3)

| Worker | PR | Session | Result | Checks |
|---|---|---|---|---|
| core | #431 | sessions/9f2… | 12 files, tests pass | CI green, CodeQL 0 |
| api | #432 | sessions/a71… | 8 files, tests pass | CI green, CodeQL 0 |
| worker | #433 | sessions/c04… | PARTIAL: 2 files blocked (shared/log.py) | CI green |
| cli | #434 | sessions/d9e… | 5 files, tests pass | CI green, 1 secret-scan alert (fixed) |

Decisions: kept structlog over loguru (plan v3, orchestrator, commit 51a…).
Handoffs: @test-writer added tests after each worker (PRs #435–#438).
Needs human: shared/log.py changes listed in #433 require platform review.`,
      takeaway: 'A structured summary with links to pull requests and sessions is the artifact that makes multi-agent work reviewable and auditable.',
    },
    {
      title: 'Detecting a stalled worker and recovering',
      description:
        'During a fleet run, /tasks shows one subagent still running after fifteen minutes with no output while the others have returned. The developer inspects it, finds it looping on a failing command because a host is blocked, kills the task, allowlists the host, and re-delegates only that unit. The other workers\' results are untouched.',
      language: 'bash',
      code: `/tasks                 # one worker: running 15m, no result
# Enter -> details: repeated "curl: (28) Connection timed out" to packages.contoso.corp
# x   -> kill the stalled subagent
# Fix the environment (firewall allowlist or preinstall), then:
/fleet Re-run only the "worker" package migration per docs/plans/LOGGING.md;
       other packages are complete, do not touch them.`,
      takeaway: 'Isolation lets you recover one unit without redoing the rest; the stall signal was "running with no progress", not an error.',
    },
    {
      title: 'The silent-degradation mistake and the fix',
      description:
        'A repository runs three automations (triage, nightly test-fixer, weekly docs refresher). Over a month, review comments per agent pull request triple and maintainers decline most triage suggestions, but nobody looks because every run reports "completed". The fix: add outcome signals to the workflow (declined-suggestion ratio, steering prompts per pull request, credits per merged pull request) reviewed monthly; set per-run and weekly credit limits as circuit breakers; have the orchestrating automation post a weekly summary issue; and when the triage decline rate crosses a threshold, lower its automation level and revisit the prompt and instructions.',
      takeaway: '"Completed" is not "healthy"; degraded coordination is detected through outcome signals and reversed through limits and tuning.',
    },
  ],
  keyPoints: [
    'Make every agent in a multi-agent workflow leave artifacts in GitHub: one PR per task, shared session logs, signed co-authored commits with session links, rationale on issue changes, report issues or comments from safe outputs, compiled .lock.yml files.',
    'Document decisions, handoffs and outcomes in plan files, PR descriptions and orchestrator summaries with consistent identifiers (issue, plan version, session ID) so artifacts can be joined later.',
    'Post-hoc analysis follows commit links to session logs, aligns sessions in the Agents tab or enterprise view, compares results to the plan, and uses OpenTelemetry traces and session queries for patterns.',
    'Failed: status failed, closed PRs, red CI, denials. Partial: unchecked plan steps, missing worker results, "Needs human". Stalled: no log progress, no PR after "started work", nearing the 59-minute cap, /tasks running with no output.',
    'Respond with increasing force: steer, stop or disable, retry after fixing, isolate (narrow tools, lower automation level), roll back per task, human takeover from artifacts.',
    'Recovery patterns: checkpoint and resume, compensating action, circuit breaker (credit limits, timeouts), fallback to human via safe outputs, quarantine with disable-model-invocation.',
    'Degradation is detected through outcome signals (steering per PR, declined suggestions, retries, credits per merged PR), not through "completed" statuses.',
  ],
  flashcards: [
    { front: 'Why should each agent in a multi-agent workflow open its own pull request?', back: 'It yields parallel, reviewable artifacts with their own summaries, checks and session links instead of one opaque merge.' },
    { front: 'How can an agentic workflow be forced to record rationale for issue changes?', back: 'Set issue-intent: true on the safe output; the run fails if the agent omits rationale and confidence.' },
    { front: 'Where do you see all agent sessions in a repository?', back: 'The "All sessions" view on the repository\'s Agents tab (shared Actions-based sessions and shared local sessions).' },
    { front: 'What signals a stalled cloud agent session?', back: 'No new session-log entries for a long time, "Copilot started work" without a pull request, or approaching the 59-minute Actions limit.' },
    { front: 'How do you kill a runaway subagent in Copilot CLI?', back: 'Open /tasks, select the task and press x.' },
    { front: 'What is a circuit breaker in agent terms on GitHub?', back: 'Per-run, daily, weekly or monthly AI-credit limits and timeouts that stop runaway loops before they consume budget.' },
    { front: 'How do you quarantine a suspect custom agent without deleting it?', back: 'Set disable-model-invocation: true (and user-invocable: false) so it is not chosen automatically or selected.' },
    { front: 'Which OpenTelemetry capture classes exist and what is their default?', back: 'Identity, prompts, responses, tool arguments, tool output and policy detail; all default to off.' },
    { front: 'What does a human do to take over a cloud session locally?', back: 'Use Open in VS Code or Continue in GitHub Copilot CLI from the session; cloud sandbox sessions resume with files intact.' },
    { front: 'What is the first recovery step for an agent heading the wrong way mid-session?', back: 'Steer it with a follow-up prompt restating the goal; stop only if steering is insufficient.' },
  ],
  quiz: [
    {
      question:
        'An auditor needs to reconstruct a fleet run that produced five pull requests. Which set of artifacts BEST supports the analysis?',
      options: [
        'The orchestrator\'s summary comment linking each worker\'s pull request and session, the session logs, and the commits\' session links.',
        'The AI credit invoice for the month.',
        'The MCP allowlist and firewall configuration.',
        'The developers\' recollection in a meeting.',
      ],
      correct: [0],
      explanation:
        'Linked summaries, logs and commit metadata are the audit trail. Invoices and configuration do not describe what happened, and recollection is not an artifact.',
    },
    {
      question:
        'Which TWO signals indicate a partial (rather than failed or stalled) multi-agent execution? (Select two)',
      options: [
        'The plan checklist has unchecked steps and the pull request lists items under "Needs human".',
        'One of four expected worker pull requests was never opened while the others completed.',
        'The session status shows failed in the enterprise agent-session view.',
        'The session log has had no new entries for 30 minutes.',
      ],
      correct: [0, 1],
      explanation:
        'Incomplete checklists and missing worker outputs are partial-completion signals. A failed status is failure, and no log progress indicates a stall.',
    },
    {
      question:
        'A nightly automation has started consuming its full weekly credit budget by Tuesday while producing pull requests that are mostly closed unmerged. What is the MOST appropriate response?',
      options: [
        'Remove the weekly limit so it can finish its work.',
        'Treat it as degraded behaviour: keep the limits as circuit breakers, review its sessions for root causes, narrow its tools or prompt, and lower its autonomy until merge rate recovers.',
        'Set the automation to Full automation.',
        'Grant it bypass on the ruleset so pull requests merge automatically.',
      ],
      correct: [1],
      explanation:
        'Rising cost and falling merge rate are degradation signals; limits protect budget while you tune. Removing limits, increasing autonomy or auto-merging make the problem worse.',
    },
    {
      question:
        'A subagent in a fleet run has been running for 20 minutes with repeated identical failing commands while other workers finished. What should you do FIRST?',
      options: [
        'Wait for the 59-minute limit.',
        'Kill the stalled task from /tasks, fix the cause (for example a blocked host), and re-delegate only that unit.',
        'Restart the entire fleet run from scratch.',
        'Merge the other workers\' pull requests and ignore the missing unit.',
      ],
      correct: [1],
      explanation:
        'Isolation allows per-unit recovery. Waiting wastes budget, restarting discards good results, and ignoring the unit leaves the migration incomplete.',
    },
    {
      question:
        'Which pattern provides a fallback to human judgment when an event-driven agent is unsure, without blocking the workflow?',
      options: [
        'Granting the agent broader tools so it can resolve ambiguity itself.',
        'Having the agent open an issue or comment through a safe output (or hold a suggestion in the approvals panel) instead of pushing changes.',
        'Disabling all automations in the repository.',
        'Running the agent with --allow-all.',
      ],
      correct: [1],
      explanation:
        'Safe outputs and suggestions hand decisions to humans while other work proceeds. Broader tools and allow-all remove oversight; disabling everything stops useful work.',
    },
  ],
  statements: [
    { text: 'GitHub Actions-based cloud agent sessions appear in the repository\'s All sessions view by default.', isTrue: true, explanation: 'They are shared by default with anyone who has access to the repository.' },
    { text: 'OpenTelemetry data from Copilot clients includes prompts and tool arguments by default.', isTrue: false, explanation: 'All capture classes default to off; administrators enable them only when needed.' },
    { text: 'A run that reports "completed" can still represent degraded multi-agent behaviour.', isTrue: true, explanation: 'Outcome signals such as declined suggestions and steering per PR reveal degradation that statuses hide.' },
    { text: 'Rolling back one worker\'s changes in a fleet run requires reverting every worker\'s pull request.', isTrue: false, explanation: 'Each task has its own branch and pull request, so rollback is per task.' },
    { text: 'Setting issue-intent: true on an agentic workflow safe output makes rationale and confidence mandatory.', isTrue: true, explanation: 'The workflow fails if the agent omits them.' },
    { text: 'Stopping a cloud agent session deletes its session log.', isTrue: false, explanation: 'Stopping ends the run; the log and pushed commits remain, and sessions can be archived but not deleted.' },
  ],
  resources: [
    { label: 'Managing agent sessions (monitor, steer, stop, share, query)', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents' },
    { label: 'Monitoring agentic activity in your enterprise', url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/monitor-agentic-activity' },
    { label: 'OpenTelemetry for agent monitoring', url: 'https://docs.github.com/en/copilot/concepts/enterprise/opentelemetry' },
    { label: 'Managing rationale, confidence, and approvals for issues', url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/manage-rationale-confidence-approvals' },
  ],
};
