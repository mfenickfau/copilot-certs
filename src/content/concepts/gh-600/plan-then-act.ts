import type { Concept } from '../../types';

export const planThenAct: Concept = {
  id: 'plan-then-act',
  title: 'Separating Planning from Execution: Structured Plans and Approval Gates',
  summary:
    'How to keep an agent\'s planning distinct from its execution using plan mode, planner-only custom agents and the research-plan-iterate flow on GitHub; how to make plans structured and validatable; and how to stop an agent acting until a human (or a check) has approved the plan.',
  certs: ['gh-600', 'gh-700'],
  domains: ['gh-600-1', 'gh-700-4'],
  outcomes: ['gh-600-1-2-1', 'gh-600-1-2-2', 'gh-600-1-2-3', 'gh-600-1-2-4', 'gh-700-4-1-2'],
  tags: ['plan-mode', 'custom-agents', 'structured-plan', 'approval-gate', 'autopilot', 'agentic-loop'],
  difficulty: 'intermediate',
  diagram: 'agentic-loop',
  sections: [
    {
      heading: 'Why planning and execution should be different steps',
      body: `An agent loop is observe, reason, act, observe again. When the same session reasons and acts in one breath, the first irreversible action can happen before anyone has seen the approach. Separating planning from execution gives you a cheap checkpoint: a plan is text, it costs nothing to reject, and reviewing it takes minutes rather than the hour it takes to review a sprawling diff.

GitHub exposes this separation in several places:

- **Plan mode** in VS Code, JetBrains, Xcode and Eclipse (and plan mode in Copilot CLI and the GitHub Copilot app). The plan agent researches with read-only tools, breaks the task into steps, lists open questions, and makes **no code changes** until you review and approve. You then click *Start Implementation* to hand the plan to agent mode, or *Open in Editor* to save it as Markdown.
- **Research, plan, iterate** with the cloud agent on GitHub.com: ask questions about the repository, ask for a plan, refine it, then say "Implement the plan we agreed upon". Sessions do not create pull requests until you ask.
- **Planner-only custom agents**, whose \`tools\` frontmatter contains only \`read\`, \`search\` and (optionally) \`edit\` for writing Markdown, so the agent physically cannot run commands or push code.
- **Mode selection** in the app and CLI: *Interactive* (check in after each step), *Plan* (approach first), *Autopilot* (run to completion). GitHub's recommended sequence is plan mode first, then autopilot once the plan meets requirements.

The exam distinguishes these controls from tool permissions: autopilot governs whether the agent keeps going without new prompts; permissions govern what it may do at all. Both matter, and neither replaces the other.`,
    },
    {
      heading: 'Making plans structured and validatable',
      body: `A free-text plan is hard to validate. A structured plan follows a template so that a human, a script or a second agent can check it mechanically. Common fields, which you can request in a custom agent prompt or instructions file:

1. **Goal and non-goals** in one sentence each.
2. **Files to change**, each with a one-line reason and the kind of change (add, modify, delete).
3. **Ordered steps** with explicit dependencies between them.
4. **Validation**: the commands or tests that prove each step worked.
5. **Risks and rollback**: what could break and how it would be undone.
6. **Open questions** that must be answered before execution.

Validation then has three layers. First, **human review** of the plan in the chat, in a Markdown file committed to a branch, or in an issue comment. Second, **mechanical checks**: a hook or script can parse the plan and refuse to proceed if a protected path (\`.github/workflows/\`, \`db/migrations/\`) appears, if the file list exceeds a threshold, or if a required section is missing. Third, **a second opinion**: delegate the plan to a review subagent, or use Copilot CLI's built-in \`code-review\` and \`rubber-duck\` agents, before anything executes.

Keep the plan as an artifact. Saving it to the branch (for example \`docs/plans/ISSUE-123.md\`) or pasting it into the pull request description means the executor, the reviewer and later a post-incident analyst all see the same intent. This also becomes the reference for detecting drift during long executions.`,
    },
    {
      heading: 'Preventing action until the plan is approved',
      body: `"Approved" must mean something the tooling can enforce, not a comment that says "looks good". GitHub gives you layered ways to hold execution:

- **Tool scoping.** A planner custom agent with \`tools: ["read", "search"]\` cannot act. Execution requires a human to start a new task with an executor agent. The handoff itself is the approval.
- **Plan mode gates.** In IDE plan mode nothing changes until you click *Start Implementation*; in the cloud agent, nothing is pushed until you ask for changes, and no pull request is created until you ask for one.
- **Hooks.** A \`preToolUse\` hook in \`.github/hooks/*.json\` can deny \`edit\` or \`execute\` tool calls unless an approval marker exists (a file written by the reviewer, a label on the issue, an environment variable set by a controlled step). In the cloud agent, hooks run inside the ephemeral Linux sandbox and only \`bash\` entries are honoured; \`preToolUse\` command hooks are fail-closed, so an erroring hook denies the call.
- **GitHub controls after execution.** Even if the agent acts, draft pull requests cannot be marked ready, approved or merged by Copilot; workflows wait for *Approve and run workflows*; rulesets can require an additional approval for pull requests not attributed to a person.
- **Automation levels.** For issue-triage automations, the repository's automation level (*Full control*, *Cautious*, *Balanced*, *Full automation*) decides which confidence levels are held as suggestions in the approvals panel. Remember GitHub's caveat: approvals here are a workflow convenience, not a security boundary; use permissions to limit what the automation can change.

The exam angle: when a scenario says "the agent must not change code until the lead has reviewed the approach", the answer combines a plan artifact with a control that physically withholds the acting tools, not an instruction in the prompt.`,
    },
    {
      heading: 'The exam angle',
      body: `Typical GH-600 scenarios in this skill area:

- A regulated team wants every agent change pre-approved. Correct: planner custom agent (read/search only) produces a structured plan as a Markdown artifact; a human approves; an executor agent implements the agreed plan. Wrong: a prompt that says "ask before you change anything" (not enforced) or disabling agents entirely.
- A plan should be rejected automatically if it touches workflow files. Correct: a hook or script validates the plan against protected paths. Wrong: rely on reviewers to notice.
- A developer wants fast iteration on a well-understood task. Correct: plan mode once, then autopilot for execution, with tool permissions still scoped. Wrong: \`--allow-all\` because "the plan was approved".
- An issue-triage automation applies labels nobody agreed with. Correct: lower the automation level so medium and low-confidence changes become suggestions. Wrong: remove the automation's issue tools entirely if triage is still wanted.

Remember the difference between the plan agent (research with read-only tools, no changes) and agent mode (acts). "Start Implementation" is the explicit handoff.`,
    },
  ],
  examples: [
    {
      title: 'A planner-only custom agent',
      description:
        'A team defines a custom agent whose only tools are read, search and edit (for writing the plan file). It cannot run shell commands or push code, so a plan it produces is a proposal, never an action. The executor is a separate agent that a human selects after approving the plan.',
      language: 'markdown',
      code: `---
name: release-planner
description: Produces a structured implementation plan for an issue without changing code
tools: ["read", "search", "edit"]
disable-model-invocation: true
---
You are a planning specialist. Never modify source files, tests or workflows.
Write your plan to docs/plans/ISSUE-<number>.md using exactly these sections:

## Goal / Non-goals
## Files to change (path, change type, one-line reason)
## Ordered steps (note dependencies between steps)
## Validation (commands or tests that prove each step)
## Risks and rollback
## Open questions

Stop after writing the plan and ask for approval.`,
      takeaway: 'Scoping tools makes "plan only" an enforced property of the agent, not a hope expressed in the prompt.',
    },
    {
      title: 'A preToolUse hook that gates execution on an approval marker',
      description:
        'The repository hook denies edit and shell tools unless an approval file exists. In the cloud agent the hook runs in the sandbox with bash; a non-zero exit from a preToolUse hook denies the call, so the check fails closed.',
      language: 'json',
      code: `{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": "tool=$(jq -r .toolName); if [ -f .plan-approved ] || [ \\"$tool\\" = \\"view\\" ] || [ \\"$tool\\" = \\"search\\" ]; then echo '{\\"permissionDecision\\":\\"allow\\"}'; else echo '{\\"permissionDecision\\":\\"deny\\",\\"permissionDecisionReason\\":\\"Plan not approved: .plan-approved missing\\"}'; fi",
        "timeoutSec": 10
      }
    ]
  }
}`,
      takeaway: 'Hooks run code rather than asking the model to follow a rule, which is what "prevent action until approved" requires.',
    },
    {
      title: 'The "ask first" prompt mistake and the fix',
      description:
        'A developer adds "Always ask me before changing files" to an issue and assigns it to the cloud agent. The agent, running non-interactively in GitHub Actions with all tool permissions pre-granted, cannot ask; it proceeds and opens a pull request that modifies a migration. The fix is structural: use the research-plan-iterate flow (or plan mode) to agree the approach first, use a planner agent for the plan, and protect db/migrations with a hook or ruleset so the executor cannot touch it without an explicit path.',
      takeaway: 'Non-interactive agents cannot pause for permission; gate with tooling, not with polite instructions.',
    },
  ],
  keyPoints: [
    'Plan mode researches with read-only tools and makes no changes until you approve and click Start Implementation (or Open in Editor to save the plan).',
    'The research-plan-iterate flow on GitHub.com separates investigation, planning and implementation; a pull request is only created when you ask.',
    'A planner-only custom agent (tools: read, search, optionally edit) physically cannot execute; the handoff to an executor is the approval.',
    'Structured plans have fixed sections (goal, files, ordered steps, validation, risks, open questions) so humans and scripts can validate them.',
    'preToolUse hooks can deny acting tools until an approval marker exists; they are fail-closed on error and run as bash in the cloud agent sandbox.',
    'Autopilot controls whether the agent continues without prompts; tool permissions control what it may do. Approving a plan does not justify --allow-all.',
    'Automation levels (Full control, Cautious, Balanced, Full automation) route low-confidence issue changes to an approvals panel, but approvals are not a security control.',
  ],
  flashcards: [
    { front: 'What does the plan agent do differently from agent mode?', back: 'It researches with read-only tools and produces a plan with open questions; it makes no code changes until you approve and start implementation.' },
    { front: 'How do you hand an approved plan to execution in VS Code plan mode?', back: 'Click Start Implementation (switches to agent mode) or Open in Editor to save the plan as Markdown.' },
    { front: 'How can a custom agent be made incapable of executing changes?', back: 'Limit its tools frontmatter, for example tools: ["read", "search"], so shell and edit tools are unavailable.' },
    { front: 'Name four sections of a validatable structured plan.', back: 'Goal/non-goals, files to change with reasons, ordered steps with dependencies, validation commands, plus risks/rollback and open questions.' },
    { front: 'Which hook event can approve or deny a tool call before it runs?', back: 'preToolUse; it returns a permissionDecision of allow or deny and is fail-closed on errors.' },
    { front: 'In the cloud agent, which hook command field is honoured?', back: 'Only bash (or the cross-platform command fallback); powershell entries are ignored and hooks run in the ephemeral Linux sandbox.' },
    { front: 'Does autopilot mode grant broader tool permissions?', back: 'No. Autopilot only removes the wait for new prompts; permission settings still decide which tools may run without approval.' },
    { front: 'What is the default automation level for issue-triage automations?', back: 'Cautious: only high-confidence changes apply automatically; others are held as suggestions.' },
    { front: 'Does the cloud agent create a pull request automatically after a research session?', back: 'No. You must ask for a pull request (or click Create pull request after reviewing the diff).' },
  ],
  quiz: [
    {
      question:
        'A regulated team requires that no agent modifies code until a lead has approved the approach. Which configuration BEST enforces this?',
      options: [
        'Add "ask before changing files" to the issue body and assign it to Copilot cloud agent.',
        'Use a planner custom agent limited to read and search tools to produce a structured plan artifact, then have a human start an executor agent on the approved plan.',
        'Run the agent in autopilot mode with --allow-all so it finishes quickly and reviewers assess the final diff.',
        'Disable Copilot cloud agent for the repository.',
      ],
      correct: [1],
      explanation:
        'Tool scoping enforces plan-only behaviour and the human handoff is the approval. Prompt instructions are not enforced in a non-interactive run, allow-all removes controls, and disabling the agent abandons the benefit.',
    },
    {
      question:
        'You want any plan that proposes changes under .github/workflows/ to be rejected automatically before execution. What should you implement?',
      options: [
        'A preToolUse hook or validation script that parses the plan and denies acting tools when protected paths appear.',
        'A note in copilot-instructions.md asking the agent to avoid workflow files.',
        'A larger GitHub Actions runner so the plan completes faster.',
        'A personal custom instruction in your GitHub profile.',
      ],
      correct: [0],
      explanation:
        'Hooks run code and can deny tool calls; instructions are advisory and not guaranteed to be followed. Runner size and personal instructions do not gate execution.',
    },
    {
      question:
        'Which TWO statements about plan mode in supported IDEs are correct? (Select two)',
      options: [
        'The plan agent uses read-only tools and makes no code changes until you approve.',
        'Clicking Start Implementation switches to agent mode to implement the plan.',
        'Plan mode automatically opens a pull request on GitHub.com.',
        'Plan mode requires the --allow-all option to be set first.',
      ],
      correct: [0, 1],
      explanation:
        'Plan mode is read-only until approval and hands off via Start Implementation. It does not create pull requests, and it has nothing to do with the CLI allow-all option.',
    },
    {
      question:
        'A developer approved a plan and now wants the agent to implement it without pausing after each step. Which combination follows GitHub guidance?',
      options: [
        'Switch to autopilot mode while keeping tool permissions scoped to what the task needs.',
        'Switch to autopilot mode and run with --yolo because the plan was approved.',
        'Stay in plan mode and ask the agent to "pretend" to implement.',
        'Grant the agent organization owner rights so no permission prompts appear.',
      ],
      correct: [0],
      explanation:
        'Autopilot removes the wait for new prompts; permissions remain a separate control and should stay least-privilege. Allow-all and elevated rights remove oversight, and plan mode does not implement.',
    },
    {
      question:
        'An issue-triage automation applies labels that maintainers often disagree with. Which change keeps triage running while routing uncertain changes to human review?',
      options: [
        'Set the repository automation level to Cautious or Full control so lower-confidence changes are held as suggestions in the approvals panel.',
        'Remove all issue tools from the automation.',
        'Change the trigger from "issue opened" to a weekly schedule.',
        'Grant the automation write access to all repositories in the organization.',
      ],
      correct: [0],
      explanation:
        'Automation levels use the agent\'s confidence rating to decide what is applied versus suggested. Removing tools stops triage, rescheduling does not improve quality, and broader access is unrelated.',
    },
  ],
  statements: [
    { text: 'In plan mode, Copilot may edit source files as long as it explains the change in the plan.', isTrue: false, explanation: 'The plan agent uses read-only tools and makes no code changes until the plan is approved.' },
    { text: 'A custom agent whose tools list contains only read and search cannot run shell commands.', isTrue: true, explanation: 'The tools property filters the tools available to the agent; execute/shell is not included.' },
    { text: 'preToolUse command hooks that crash or exit non-zero deny the tool call.', isTrue: true, explanation: 'preToolUse command hooks are fail-closed on errors; timeouts, by contrast, are fail-open.' },
    { text: 'Approving a plan in plan mode automatically grants the agent unconditional tool permissions.', isTrue: false, explanation: 'Permission mode is separate from plan or autopilot mode.' },
    { text: 'Approvals in the issue approvals panel are a server-side security boundary for what an automation can change.', isTrue: false, explanation: 'GitHub states approvals are a workflow convenience; use repository and agent permissions to control what an automation can do.' },
    { text: 'Saving a structured plan as a Markdown artifact helps later detection of drift during long executions.', isTrue: true, explanation: 'The plan becomes the shared reference for executor, reviewer and post-hoc analysis.' },
  ],
  resources: [
    { label: 'Using plan mode in your IDE (GitHub Docs)', url: 'https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-plan-mode' },
    { label: 'Allowing GitHub Copilot to work autonomously (Autopilot mode)', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/autopilot' },
    { label: 'Custom agents configuration reference', url: 'https://docs.github.com/en/copilot/reference/custom-agents-configuration' },
    { label: 'GitHub Copilot hooks reference', url: 'https://docs.github.com/en/copilot/reference/hooks-reference' },
  ],
};
