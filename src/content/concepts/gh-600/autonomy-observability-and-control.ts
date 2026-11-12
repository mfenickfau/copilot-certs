import type { Concept } from '../../types';

export const autonomyObservabilityAndControl: Concept = {
  id: 'autonomy-observability-and-control',
  title: 'Autonomy Levels, Inspectable Artifacts and Lightweight Human Intervention',
  summary:
    'How to decide how much autonomy an agent gets by classifying actions by operational, security and compliance risk; how GitHub makes agent work inspectable through session logs, co-authored signed commits, draft pull requests and audit events; and how to keep humans in the loop at the points that matter without slowing delivery.',
  certs: ['gh-600'],
  domains: ['gh-600-1', 'gh-600-6'],
  outcomes: ['gh-600-1-3-1', 'gh-600-1-3-2', 'gh-600-1-3-3', 'gh-600-6-1-1', 'gh-600-6-1-2'],
  tags: ['autonomy', 'risk-classification', 'session-logs', 'observability', 'human-in-the-loop', 'rulesets'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Classifying actions to right-size autonomy',
      body: `Autonomy is not a single dial. The exam expects you to classify each kind of action an agent can take along three risk axes and then assign the intervention that fits:

| Risk axis | Low | High |
|---|---|---|
| Operational | Read files, run tests, open a draft PR on a \`copilot/\` branch | Push to a release branch, run a deployment workflow, delete resources |
| Security | Read-only GitHub MCP tools scoped to the repository | Tools with write scopes outside the repository, network access to new hosts, workflow file changes |
| Compliance | Label an issue, propose documentation | Change a migration, touch audited code paths, alter access controls |

Assign autonomy per class, not per agent:

- **Autonomous**: reversible, low-risk, verifiable actions. Let the agent read, test, edit on its own branch, open draft pull requests, add rationale to issues.
- **Autonomous with review before effect**: the agent acts, but the effect waits for a human gate. This is the cloud agent's default shape: draft pull request, workflows held until *Approve and run workflows*, Copilot cannot mark ready, approve or merge, and the requester cannot approve their own Copilot pull request.
- **Suggest only**: the agent proposes, a human applies. Automation levels for issue triage (*Full control*, *Cautious*) do this; so does asking an automation to "suggest" rather than apply.
- **Prohibited**: irreversible or compliance-sensitive actions the agent should never perform. Enforce with missing tools (no deploy tool, no \`git push\` credential), rulesets, firewall rules and \`preToolUse\` hooks.

GitHub's Responsible AI stance (human oversight, review of outputs) and the organisation's security standards set the ceiling. Within it, the goal is to maximise delivery speed: the more an action is reversible and checked by tooling, the less a human needs to see it before it happens.`,
    },
    {
      heading: 'Inspectable artifacts inside standard tooling',
      body: `Autonomous agents are acceptable when their work is visible in the tools developers already use. GitHub's cloud agent is designed so that each piece of work leaves inspectable evidence:

- **Draft pull request** on a dedicated \`copilot/\` branch, with the agent's summary, the custom agent used (noted in the description), firewall warnings and validation results.
- **Commits** authored by Copilot with the requesting developer as **co-author**, **signed** ("Verified"), and each commit message **links to the session log**. During review or an audit you can go from a diff to the reasoning that produced it.
- **Session logs** in the Agents tab or panel: the agent's reasoning, every tool call, test runs, setup-step output, token usage and session length. Secret values are masked. GitHub Actions-based cloud sessions are shared by default with everyone who has repository access.
- **Issue timeline events** such as "Copilot started work" and the 👀 reaction on comments it has seen.
- **Rationale and confidence** on automation-driven issue changes, viewable on the issue, plus the \`has:suggestions\` search qualifier for pending suggestions.
- **Audit log** events (filter by \`actor:Copilot\` in an organisation; enterprise AI controls show agent sessions from the last 24 hours with filters such as \`status:\`, \`user:\` and \`timeframe:\`), with an \`agent_session_id\` linking events to the session.
- **OpenTelemetry** traces, metrics and events from Copilot clients for enterprise observability backends.

When you design your own agents (custom agents, agentic workflows, CLI automations) copy the pattern: write plans and reports to files on the branch, post summaries as pull request or issue comments, and export CLI sessions with \`/share\` so the record lives where reviewers work.`,
    },
    {
      heading: 'Human intervention without slowing delivery',
      body: `The cost of oversight is wait time. Put humans where their judgment changes an outcome and remove them where it does not:

- **Review the artifact, not the process.** Let the agent run end to end in its sandbox and review the pull request. Steering mid-session (a follow-up prompt in the session log) is available when the direction is clearly wrong, but it costs AI credits and attention.
- **Gate on effect, not on every step.** Keep *Require approval for workflow runs* enabled so unreviewed agent code cannot run privileged workflows, but do not require a human to approve every file edit in the agent's own branch.
- **Use confidence-based routing.** Automation levels hold only lower-confidence issue changes; *Balanced* applies routine changes and holds ambiguous ones.
- **Reduce prompts without removing oversight.** In the CLI and app, *assisted permissions* lets a model approve requests it judges safe while still prompting for the rest; deny rules and enterprise restrictions still apply. This is a middle path between manual approval and \`--allow-all\`.
- **Delegate validation to tooling.** Built-in validation (CodeQL, secret scanning, dependency checks, Copilot code review) runs before the pull request is ready. Agent Merge ("Watch and fix") fixes failing checks and merge conflicts so humans review once.
- **Shift intervention earlier when it is cheaper.** Approving a plan is faster than reviewing a 40-file diff.

The exam framing is usually "preserve velocity while remaining compliant". The correct answer keeps the controls that materially reduce risk (branch isolation, workflow approval, required reviews, firewall) and removes ceremony that does not (approving each read, a second sign-off on documentation-only changes, manual re-runs of tests the agent already ran).`,
    },
    {
      heading: 'The exam angle',
      body: `Expect items such as:

- Choose the autonomy level for a documentation-fix agent versus an agent that edits infrastructure code. Documentation: autonomous with a single review. Infrastructure: suggest-only or plan approval plus required reviews and CODEOWNERS.
- A compliance officer asks how to trace a line of code back to the agent reasoning. Answer: the commit is co-authored, signed and links to the session log; the audit log carries the session identifier.
- A team complains that reviewing agent work is slow. Prefer answers that use built-in validation, Agent Merge and plan approval over answers that add more approvers.
- A manager wants agents to run workflows automatically to save time. The risk is that unreviewed code gains access to secrets; the default is to require approval, and relaxing it is a repository-administrator decision that should be matched by other controls.

Distractors offer either extreme: full autonomy with no artifacts, or a human approving every action. The right answer is risk-proportionate and uses GitHub's built-in artifacts.`,
    },
  ],
  examples: [
    {
      title: 'An autonomy matrix committed to the repository',
      description:
        'A platform team records, in an instructions file, which actions the agents may take on their own and which require a human. The file is read by the cloud agent and by reviewers, and the enforcing controls are listed beside each policy so nobody mistakes the text for the control.',
      language: 'markdown',
      code: `# .github/instructions/agent-autonomy.instructions.md
---
applyTo: "**"
---
## Autonomous (no human before the action)
- Read, search, run tests/linters, edit files on your own copilot/ branch.
- Open a draft pull request. (Enforced: agent token can push only to its branch.)

## Human before effect
- Running GitHub Actions workflows. (Enforced: "Require approval for workflow runs".)
- Merging. (Enforced: ruleset requires 2 approvals; Copilot cannot approve or merge.)

## Suggest only
- Changing labels/assignees on issues. (Enforced: automation level = Cautious.)

## Never
- Editing .github/workflows/** or db/migrations/**. (Enforced: preToolUse hook denies edits; CODEOWNERS review required.)
- Contacting hosts outside the firewall allowlist. (Enforced: agent firewall.)`,
      takeaway: 'Document the autonomy level per action class and name the control that enforces each one.',
    },
    {
      title: 'Tracing a change back to the agent session',
      description:
        'During an audit, a reviewer starts from a suspicious line, uses git blame to find the commit, and follows the session-log link in the commit message. The log shows the tool calls, the tests the agent ran, and the firewall warning that explains why one dependency was skipped. The co-author trailer identifies the developer who assigned the task.',
      language: 'bash',
      code: `git log -1 --format='%H%n%an <%ae>%n%b' 4f2c9e1
# 4f2c9e1...
# Copilot <...@users.noreply.github.com>
# Add retry wrapper to checkout lock
#
# Co-authored-by: priya-dev <priya@example.com>
# https://github.com/octo-org/shop/sessions/0a1b2c3d-...

gh api /orgs/octo-org/audit-log -f phrase='actor:Copilot action:copilot' --jq '.[].agent_session_id' | head`,
      takeaway: 'Commit metadata, session logs and audit events form a chain from code to intent to actor.',
    },
    {
      title: 'The "approve everything" mistake and the fix',
      description:
        'To be safe, a team configures their process so a senior engineer must approve every file edit the cloud agent proposes, by steering each session and re-running tests by hand. Throughput collapses and the senior engineer starts approving without reading. The fix is risk-based: let the agent complete its branch autonomously, keep workflow approval and required reviews as the gates, turn on Copilot code review for an automated second opinion, and reserve human plan approval for migrations and infrastructure changes.',
      takeaway: 'Approvals that do not change outcomes train people to click through; keep the gates that matter.',
    },
  ],
  keyPoints: [
    'Classify agent actions by operational, security and compliance risk, then assign autonomy per class: autonomous, review-before-effect, suggest-only, prohibited.',
    'The cloud agent\'s defaults are review-before-effect: copilot/ branch, draft PR, workflows held for approval, no self-approval or merge by Copilot.',
    'Inspectable artifacts: draft PRs, signed co-authored commits linking to session logs, session logs with tool calls and token usage, issue timeline events, rationale on automation changes.',
    'Audit log (actor:Copilot, agent_session_id) and enterprise AI controls agent-session views give administrators visibility; OpenTelemetry adds traces and metrics.',
    'Keep humans at the points of effect (workflow approval, merge, plan approval for high-risk paths) and remove ceremony that does not reduce risk.',
    'Assisted permissions and confidence-based automation levels reduce prompts without granting blanket permission.',
    'Relaxing "Require approval for workflow runs" lets unreviewed agent code reach secrets; treat it as a deliberate risk decision.',
  ],
  flashcards: [
    { front: 'What three risk axes should you use to classify agent actions?', back: 'Operational, security and compliance risk.' },
    { front: 'How are cloud agent commits attributed?', back: 'Authored by Copilot, co-authored by the developer who started the task, signed (Verified), with a link to the session log in the commit message.' },
    { front: 'Can Copilot cloud agent mark its pull request ready for review, approve it or merge it?', back: 'No. A human must do all three, and the requester\'s approval does not count toward required approvals.' },
    { front: 'How do you find automation-driven issue changes awaiting review?', back: 'Search with the has:suggestions qualifier and review them in the issue\'s approvals panel.' },
    { front: 'Where do administrators see agent sessions across an enterprise?', back: 'The enterprise AI controls page lists agent sessions (last 24 hours) with filters such as status:, user: and timeframe:; the audit log also records agentic events.' },
    { front: 'What is "assisted permissions"?', back: 'A mode where a model approves permission requests it judges safe and prompts for the rest; deny rules and enterprise restrictions still apply.' },
    { front: 'By default, do GitHub Actions workflows run when the cloud agent pushes?', back: 'No. A user with write access must click Approve and run workflows, unless a repository admin disables that requirement.' },
    { front: 'What should you review for an autonomous agent to keep velocity high?', back: 'The artifact (the pull request and its validation results), not every intermediate step.' },
    { front: 'Which GitHub feature fixes failing checks and merge conflicts on an agent pull request automatically?', back: 'Agent Merge ("Watch and fix" in the merge box).' },
  ],
  quiz: [
    {
      question:
        'You are designing autonomy for two agents: one fixes typos in documentation, the other edits Terraform in an audited production module. Which assignment is MOST appropriate?',
      options: [
        'Both agents fully autonomous, including merging, to maximise velocity.',
        'Documentation agent autonomous up to a draft pull request with one review; infrastructure agent produces a plan for approval and its pull requests require CODEOWNERS review.',
        'Both agents suggest-only with every edit approved by a senior engineer.',
        'Documentation agent disabled; infrastructure agent fully autonomous because Terraform has a plan step.',
      ],
      correct: [1],
      explanation:
        'Autonomy should be proportionate to risk. Full autonomy including merging bypasses review controls, suggest-only for everything slows delivery without reducing risk, and the last option inverts the risk ordering.',
    },
    {
      question:
        'An auditor asks how a specific line changed by Copilot cloud agent can be traced to the reasoning behind it. What should you show them?',
      options: [
        'The commit, which is co-authored and signed and whose message links to the agent session log.',
        'The agent\'s AI credit consumption report.',
        'The repository\'s firewall allowlist.',
        'The MCP registry configuration.',
      ],
      correct: [0],
      explanation:
        'Commit metadata links to session logs that show tool calls and reasoning. Credit reports, firewall lists and registry settings do not explain a specific change.',
    },
    {
      question:
        'Which TWO built-in controls keep humans in the loop for cloud agent work without requiring approval of each file edit? (Select two)',
      options: [
        'GitHub Actions workflows are held until a user with write access clicks Approve and run workflows.',
        'Copilot cannot approve or merge its own pull request, so a human must.',
        'The agent pauses after every edit to ask for confirmation in the session log.',
        'The agent requires a second developer to co-sign each commit before pushing.',
      ],
      correct: [0, 1],
      explanation:
        'Workflow approval and the merge/approval restriction are the real gates. The cloud agent runs non-interactively and does not pause per edit, and commits are co-authored automatically, not co-signed.',
    },
    {
      question:
        'A team finds reviewing agent output slow and wants to speed up without reducing safety. Which action BEST fits GitHub guidance?',
      options: [
        'Disable Require approval for workflow runs so CI runs immediately on every agent push.',
        'Keep built-in validation and Copilot code review on, enable Agent Merge to fix failing checks and conflicts, and approve plans for high-risk paths instead of reviewing large diffs.',
        'Add a third required approver for all agent pull requests.',
        'Run all agents with --allow-all in the CLI.',
      ],
      correct: [1],
      explanation:
        'Automated validation and earlier, cheaper approval preserve velocity and safety. Disabling workflow approval exposes secrets to unreviewed code, more approvers add delay, and allow-all removes oversight.',
    },
    {
      question:
        'A repository administrator is asked to let workflows run automatically whenever the cloud agent pushes. What is the main risk they should weigh?',
      options: [
        'Session logs will no longer be recorded.',
        'Unreviewed code written by Copilot could gain write access or access GitHub Actions secrets through privileged workflows.',
        'The agent will lose access to the GitHub MCP server.',
        'Commits will no longer be signed.',
      ],
      correct: [1],
      explanation:
        'GitHub warns that allowing workflows to run without approval may let unreviewed agent code reach secrets or write access. Logging, MCP access and commit signing are unaffected.',
    },
  ],
  statements: [
    { text: 'Autonomy should be assigned per class of action based on risk rather than as one setting for the whole agent.', isTrue: true, explanation: 'Different actions carry different operational, security and compliance risk.' },
    { text: 'Copilot cloud agent commits appear as Verified because they are signed.', isTrue: true, explanation: 'GitHub signs the agent\'s commits and lists the requesting developer as co-author.' },
    { text: 'The developer who asked Copilot to create a pull request can supply the required approval for it.', isTrue: false, explanation: 'GitHub prevents the requester from approving, preserving the Required approvals control.' },
    { text: 'Assisted permissions grants unconditional approval to all tool requests.', isTrue: false, explanation: 'A model approves requests it judges safe and prompts for the rest; deny rules still apply.' },
    { text: 'GitHub Actions-based cloud agent sessions are shared by default with people who have access to the repository.', isTrue: true, explanation: 'They appear in the All sessions view on the Agents tab; cloud sandbox sessions are unshared by default.' },
    { text: 'Requiring a human to approve every agent file edit is the recommended way to stay compliant.', isTrue: false, explanation: 'GitHub guidance favours reviewing artifacts and gating effects; per-edit approval slows delivery without materially reducing risk.' },
  ],
  resources: [
    { label: 'Risks and mitigations for GitHub Copilot cloud agent', url: 'https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations' },
    { label: 'Managing agent sessions (session logs, steering, sharing)', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents' },
    { label: 'Review output from Copilot', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output' },
    { label: 'Monitoring agentic activity in your enterprise', url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/monitor-agentic-activity' },
  ],
};
