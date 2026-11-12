import type { Concept } from '../../types';

export const humanReviewAndEscalation: Concept = {
  id: 'human-review-and-escalation',
  title: 'Designing Human Review: Decision Points, Interactive, Plan and Autopilot Modes, and Escalation Paths',
  summary:
    'Where human judgment must stay in the loop, how the three ways an agent can work (Interactive, Plan, Autopilot) and the three tool-permission levels combine to set autonomy, and how to design escalation paths that trigger on what tools an agent tries to use.',
  certs: ['gh-700', 'gh-600'],
  domains: ['gh-700-4', 'gh-600-6'],
  outcomes: ['gh-700-4-1-1', 'gh-700-4-1-2', 'gh-700-4-1-3', 'gh-600-6-2-1', 'gh-600-6-2-4'],
  tags: ['human-in-the-loop', 'autopilot', 'plan-mode', 'permissions', 'escalation', 'approvals'],
  difficulty: 'intermediate',
  diagram: 'escalation-decision',
  sections: [
    {
      heading: 'Identifying critical decision points',
      body: `Human judgment is required wherever a wrong agent action is **hard to reverse, externally visible, or compliance-sensitive**, or where the agent itself is **uncertain**. Classify each decision point in your workflow decomposition by asking:

- **Reversibility**: can we undo it cheaply? Adding a label is reversible; closing an issue, merging a pull request, deleting files, emailing a customer or posting to a public discussion is not, or not cleanly.
- **Blast radius**: does it affect one item (comment on this issue) or many (bulk relabel, change a shared automation, modify files under \`.github/workflows\`)?
- **Trust of the input**: did the trigger come from someone with write access or from an untrusted contributor who might be injecting instructions?
- **Confidence**: is the agent's own confidence below the repository's automation level, or has it flagged the result as uncertain?
- **Policy**: does a ruleset, regulation or Responsible AI requirement demand a named human approver?

GitHub builds some of these gates in. Copilot cloud agent opens **draft pull requests** that it cannot mark ready, approve or merge; the requester cannot approve them; a pull request under Copilot's own identity needs an **extra approval**; GitHub Actions workflows on an agent's pull request do not run until a person clicks **Approve and run workflows**. Your design adds the rest: which issue changes are suggestions, which tools require permission, and who is paged when the agent gets stuck. The GitHub guidance for autonomy is to minimise approvals that do not materially reduce risk while requiring explicit authorisation for irreversible or compliance-sensitive changes.`,
    },
    {
      heading: 'Choosing how the agent performs work: Interactive, Plan, Autopilot',
      body: `In the Copilot app and Copilot CLI (and for cloud sessions on GitHub.com, Interactive or Autopilot) the **session mode** sets how much the agent does between check-ins:

| Mode | Behaviour | Best for |
|---|---|---|
| **Interactive** (default) | The agent suggests changes and waits for your input before proceeding | Exploring a problem, frequent decisions, tight steering |
| **Plan** | The agent asks clarifying questions and builds a structured plan; you review, revise and **Accept plan** before any work | Complex or multi-step tasks; catching misunderstandings before anything is built |
| **Autopilot** | The agent writes, runs checks, evaluates results and iterates until it judges the task complete | Well-defined tasks with clear outcomes and validation; unattended runs |

GitHub's recommended sequence for complex work is **Plan, then Autopilot**: develop and review the plan, then let the agent implement it, monitoring progress and interrupting if needed. Switch with \`Shift+Tab\`, \`/plan\`, \`/interactive\`, \`/autopilot\`, or the mode dropdown; from the command line \`copilot --plan --mode autopilot\` moves from planning to Autopilot without waiting for approval, which suits scripts but removes the human gate, so use it only for low-risk, well-tested tasks.

Mode is **separate from tool permissions**: Autopilot controls *continuation*, not *access*. Three permission levels apply: **Ask every time** (manual approval; most oversight), **Assisted** (a model approves requests it judges safe and asks you about the rest), and **Approve all** (\`/allow-all\` or \`/yolo\`; no per-action oversight). Autopilot with manual approval will auto-deny tool requests it cannot ask about, so for autonomous runs GitHub recommends enabling permissions inside a **local or cloud sandbox** rather than on an unrestricted machine. Autopilot also consumes more AI credits because it keeps calling the model; cap it with \`--max-autopilot-continues\` and \`--max-ai-credits\`.`,
    },
    {
      heading: 'Designing escalation paths based on tool usage',
      body: `Escalation means the agent stops and a human decides. Design it around *what the agent is about to do*:

1. **Tool-level permission prompts.** Any tool not pre-approved produces a permission request in the CLI or app; pressing **Esc** denies it. Assisted mode escalates only requests the safety model judges risky. Dynamic-workflow subagents inherit the session's grants and surface new requests as normal prompts.
2. **Restricted tool lists.** A custom agent with read-only tools, an automation granted only comment and label tools, or \`Only this issue\` scoping means an attempt to do more simply fails, which is the cheapest escalation: the agent must report back and a human performs the write.
3. **Suggestions instead of actions.** Automations and agentic workflows attach a **rationale and confidence** to issue changes; the repository **automation level** (Full control, Cautious, Balanced, Full automation) decides what is held in the **approvals panel**. Instruct the agent to *suggest* closing, assigning or re-typing issues so those always escalate.
4. **Safe outputs and separate jobs.** In agentic workflows, writes are requested by the agent and executed by a separate, scoped job after validation and threat detection; declaring only \`add-comment\` while omitting \`create-pull-request\` is an escalation design.
5. **Hooks.** A hook can check a tool request against an allow-list or protected paths before it runs, log it, or block it.
6. **Pull request gates.** Draft PR → human review → **Approve and run workflows** → required approvals → merge. Agent Merge with Watch and fix can keep a PR healthy, but merging remains a human action under your rulesets.
7. **Stuck or failing work.** Dynamic workflows pause at checkpoints or when limits are hit; the Copilot app's project Overview groups **Needs input** items (decisions, reviews, permission requests); use notifications and the Agents tab to route them to the right person.

Right-size escalation: too many prompts train people to click Approve all. Escalate on irreversible, external or low-confidence actions; let the rest flow.`,
    },
  ],
  examples: [
    {
      title: 'Mapping decision points for a contract-renewal tracker',
      description:
        'A procurement manager designs an agent that reviews supplier contracts due in 90 days. Reading documents and drafting a summary is low risk and runs autonomously. Setting a Priority field is reversible and medium confidence, so it applies automatically under the Cautious automation level but is held when confidence is low. Emailing suppliers and closing the tracking issue are irreversible and external, so the agent is told to suggest those actions and a named buyer approves them in the approvals panel.',
      takeaway: 'Classify each action by reversibility, blast radius and confidence, then decide what applies automatically and what escalates.',
    },
    {
      title: 'Autopilot on an unrestricted laptop (a realistic mistake)',
      description:
        'A program manager runs Copilot CLI in Autopilot mode with Approve all so a documentation clean-up finishes overnight. The agent, following a stale instruction file, also "tidies" an unrelated folder and runs a script that deletes build artefacts. Autopilot did exactly what it was told: continue without asking. The fix is to run such tasks in a cloud sandbox or with local sandboxing enabled, keep Assisted permissions, add a stopping condition and scope ("only files under /docs"), and use Plan mode first so the plan is reviewed before execution.',
      language: 'text',
      code: `Risky:  Autopilot + Approve all + no sandbox + vague scope
Safer:  Plan mode -> review -> Accept plan and continue in Autopilot
        Assisted permissions, local or cloud sandbox
        "Only change files under /docs. Stop when headings are consistent."
        --max-autopilot-continues and --max-ai-credits caps`,
      takeaway: 'Mode controls continuation and permissions control access; make both deliberate and sandbox autonomous runs.',
    },
    {
      title: 'An escalation path that scales with trust',
      description:
        'A support operations team starts a triage automation with the repository automation level at Full control, so every change waits in the approvals panel and the team learns how the agent reasons. After two weeks of mostly accepted suggestions they move to Cautious, then Balanced, while permanently keeping "never close issues; suggest closure" in the prompt and granting no MCP write tools. Declined suggestions are reviewed weekly to refine the criteria.',
      takeaway: 'Start with maximal escalation, relax it with evidence, and keep irreversible actions behind a human for good.',
    },
  ],
  keyPoints: [
    'Human judgment belongs at decision points that are irreversible, externally visible, broad in impact, compliance-sensitive, based on untrusted input, or low-confidence.',
    'Built-in gates: Copilot cloud agent opens draft PRs it cannot mark ready, approve or merge; the requester cannot approve; Copilot-identity PRs need an extra approval; workflows wait for Approve and run workflows.',
    'Session modes: Interactive (step by step), Plan (plan reviewed and accepted first), Autopilot (autonomous until done); GitHub recommends Plan then Autopilot for complex work.',
    'Mode is separate from tool permissions: Ask every time, Assisted (a model approves safe requests), Approve all (/allow-all, /yolo); Autopilot does not grant access by itself.',
    'For autonomous runs, enable permissions inside a local or cloud sandbox and cap continuations and AI credits.',
    'Escalation paths based on tool usage: permission prompts, restricted tool lists and Only this issue scoping, suggestions held by the automation level, safe outputs in separate jobs, hooks, pull request gates, and Needs input routing.',
    'Right-size approvals: escalate irreversible, external and low-confidence actions; let routine, reversible actions flow to avoid approval fatigue.',
  ],
  flashcards: [
    { front: 'Which questions identify a critical decision point for human judgment?', back: 'Is it reversible? How wide is the blast radius? Is the input trusted? Is the agent confident? Does policy require a named approver?' },
    { front: 'What can Copilot cloud agent not do to its own pull request?', back: 'Mark it ready for review, approve it or merge it; the person who requested it also cannot count as approver.' },
    { front: 'Describe the three session modes.', back: 'Interactive: agent waits for input after each suggestion. Plan: agent builds a plan you approve before execution. Autopilot: agent works autonomously until the task is complete.' },
    { front: 'What is GitHub\'s recommended sequence for complex autonomous work?', back: 'Plan mode to develop and review a plan, then Accept plan and continue in Autopilot, monitoring and interrupting if needed.' },
    { front: 'Does Autopilot mode grant the agent unrestricted tool access?', back: 'No. Autopilot controls continuation; tool permissions (Ask every time, Assisted, Approve all) control access separately.' },
    { front: 'What does the Assisted permission level do?', back: 'A model assesses each tool request, auto-approving ones it judges safe and prompting you for potentially unsafe ones.' },
    { front: 'How do you deny a pending permission request in Copilot CLI?', back: 'Press Esc once while the permission dialog is open.' },
    { front: 'Name four escalation mechanisms based on tool usage.', back: 'Permission prompts, restricted tool lists or Only this issue scoping, suggestions held in the approvals panel by automation level, and safe outputs executed in separate scoped jobs (also hooks and PR gates).' },
    { front: 'Which CLI command starts plan-then-autopilot without waiting for approval?', back: 'copilot --plan --mode autopilot (removes the human plan gate, so use for low-risk tasks).' },
    { front: 'What happens to GitHub Actions workflows on a pull request opened by Copilot cloud agent?', back: 'They do not run until a user with write access clicks Approve and run workflows (unless configured otherwise).' },
  ],
  quiz: [
    {
      question:
        'A program manager is designing an agent that updates a vendor-tracking repository. Which action MOST clearly requires a human decision point before it happens?',
      options: [
        'Adding a "needs-review" label to an issue',
        'Sending the renewal decision to the vendor by email through an MCP tool',
        'Drafting a summary comment on the tracking issue',
        'Reading the contract PDF attached to the issue',
      ],
      correct: [1],
      explanation:
        'An external, irreversible communication is the highest-risk action. Labels and comments are reversible and internal, and reading is harmless.',
    },
    {
      question:
        'A team wants an agent to implement a multi-step reorganisation of their documentation but first wants to confirm the approach without any files changing. Which mode should they start in?',
      options: [
        'Autopilot',
        'Interactive with Approve all permissions',
        'Plan',
        'Assisted',
      ],
      correct: [2],
      explanation:
        'Plan mode builds and lets you approve a plan before implementation. Autopilot executes immediately, Interactive with Approve all still edits as it goes, and Assisted is a permission level, not a mode.',
    },
    {
      question:
        'Which TWO statements about Autopilot mode are correct? (Select two)',
      options: [
        'Autopilot continues through successive steps without waiting for a new prompt',
        'Autopilot automatically grants unrestricted tool access',
        'Autopilot is separate from tool permission settings',
        'Autopilot cannot be used with Plan mode',
      ],
      correct: [0, 2],
      explanation:
        'Autopilot controls continuation and is independent of permissions; it does not grant access, and Plan then Autopilot is the recommended combination.',
    },
    {
      question:
        'An automation triages issues. Compliance requires that closing an issue always involves a human, even when the agent is highly confident, while routine label changes may apply automatically. What should you configure?',
      options: [
        'Set the repository automation level to Full automation',
        'Keep an automation level that allows confident changes, and instruct the agent to suggest closures rather than apply them (or omit the close-issue tool)',
        'Disable the automation and triage manually',
        'Grant the automation all tools and review the audit log monthly',
      ],
      correct: [1],
      explanation:
        'Asking the agent to suggest a specific change holds it for review regardless of confidence, and withholding the tool makes closure impossible for the agent. Full automation applies everything, manual triage abandons the benefit, and audit logs are after the fact.',
    },
    {
      question:
        'A business analyst runs Copilot CLI in Autopilot mode with manual approval and finds the agent keeps failing tasks that require running commands. Why?',
      options: [
        'Autopilot mode cannot run commands in any configuration',
        'With manual approval in Autopilot, requests needing approval are automatically denied; she should grant appropriate permissions, ideally inside a sandbox',
        'The agent needs a higher reasoning level',
        'Autopilot only works in the Copilot app',
      ],
      correct: [1],
      explanation:
        'Autopilot does not pause to ask, so unapproved tool requests are denied. The fix is appropriate permissions (Assisted or Approve all) within a local or cloud sandbox. Reasoning level and surface are irrelevant here.',
    },
  ],
  statements: [
    { text: 'The person who asked Copilot cloud agent to create a pull request can approve that pull request to satisfy required reviews.', isTrue: false, explanation: 'GitHub prevents the requester from counting as approver to preserve review controls.' },
    { text: 'Plan mode has the agent ask clarifying questions and build a plan before writing anything.', isTrue: true, explanation: 'You review and accept the plan before execution.' },
    { text: 'Autopilot mode is available in GitHub Copilot CLI and the GitHub Copilot app.', isTrue: true, explanation: 'Cloud sessions on GitHub.com also offer Interactive and Autopilot modes.' },
    { text: 'Enabling Approve all permissions is the same as enabling Autopilot.', isTrue: false, explanation: 'Approve all controls approvals; Autopilot controls continuation. In Interactive mode with Approve all, the agent still stops when it needs direction.' },
    { text: 'Stopping an Autopilot run undoes the changes the agent already made.', isTrue: false, explanation: 'Stopping ends new work; use rewind or Git to undo completed changes.' },
    { text: 'Declaring only add-comment as a safe output in an agentic workflow prevents the agent from opening pull requests.', isTrue: true, explanation: 'Writes are limited to declared safe outputs executed by separate scoped jobs.' },
  ],
  resources: [
    { label: 'Allowing GitHub Copilot to work autonomously (Autopilot mode)', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/autopilot' },
    { label: 'Working with agent sessions in the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions' },
    { label: 'Managing rationale, confidence, and approvals for issues', url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/manage-rationale-confidence-approvals' },
    { label: 'Risks and mitigations for GitHub Copilot cloud agent', url: 'https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations' },
  ],
};
