import type { Concept } from '../../types';

export const designingAgenticWorkflows: Concept = {
  id: 'designing-agentic-workflows',
  title: 'Designing Agentic Workflows: Use Cases, Decomposition, Decision Criteria and Patterns',
  summary:
    'How to spot business processes that benefit from agentic workflows or plain automations, break them into processes and tasks, write decision criteria an agent can apply, and align the design with GitHub\'s common patterns: automation, single agent, plan-then-execute, orchestrator with subagents, critic loops, and human-in-the-loop gates.',
  certs: ['gh-700', 'gh-600'],
  domains: ['gh-700-3', 'gh-600-1'],
  outcomes: ['gh-700-3-1-1', 'gh-700-3-1-2', 'gh-700-3-1-3', 'gh-700-3-1-4', 'gh-600-1-1-1', 'gh-600-1-1-3'],
  tags: ['agentic-workflows', 'design-patterns', 'decomposition', 'decision-criteria', 'automation'],
  difficulty: 'intermediate',
  diagram: 'workflow-vs-agent',
  sections: [
    {
      heading: 'Identifying use cases: automation, agent, or neither',
      body: `GitHub distinguishes three things that are easy to confuse. **Chat** is a back-and-forth conversation. An **agent** completes a goal by reasoning, using tools and adapting to results. An **automation** starts repeatable work from a trigger; it can run fixed steps or invoke an agent, and not every automation is agentic.

A use case is a good fit for an **agentic workflow** when it is **repetitive**, needs **contextual judgment** that fixed if-then rules cannot express, and produces an output a human can **review**: triaging incoming issues by type and priority, investigating CI failures and suggesting fixes, generating daily or weekly status reports, keeping documentation aligned with changes, reproducing a reported bug, capturing screenshots for review, or starting an incident investigation when monitoring fires.

A **plain automation** (project built-in workflows, GitHub Actions, rulesets) is better when the rule is deterministic: set Status to Done when a pull request merges, block pushes with secrets, require a review. Using an agent for deterministic rules adds cost and variability.

**Neither** is appropriate when the task is a one-off (just ask Copilot in chat), when the decision is irreversible or high-stakes without a review step, or when the required data is unavailable to the agent. Assess value by asking: how often does this happen, how long does it take a person, how costly is a mistake, and is the output reviewable before it takes effect?`,
    },
    {
      heading: 'Decomposing a use case into processes and tasks',
      body: `Decomposition turns "triage our issues" into something an agent can execute reliably. GitHub's guidance for multi-step work is to break the goal into smaller tasks, identify dependencies, assign each task the context and tools it needs, run independent tasks in parallel and combine the results. A practical template:

1. **Trigger**: what starts the process (a schedule, an issue opened, a pull request marked ready, an API call from another system, a person typing a slash command).
2. **Inputs and context**: the data the agent needs (the issue body, the last 7 days of pull requests, a template file, an MCP source) and what it should ignore.
3. **Tasks**: discrete steps, each with an owner (agent or human) and a tool. Keep tasks small enough that failure is isolated and cheap.
4. **Decision points**: where judgment is applied and what criteria apply (next section).
5. **Outputs**: the artefact produced (an issue, a comment, a labelled item, a draft pull request, a report file) and its required structure.
6. **Review and escalation**: who checks what, and what happens on low confidence or failure.
7. **Success criteria and limits**: how you will know it worked, plus time, turn and AI-credit caps.

Document the decomposition in an issue or wiki page first. It becomes the Markdown body of the workflow, the acceptance criteria for review, and the evidence that the design was deliberate.`,
    },
    {
      heading: 'Specifying decision-making criteria',
      body: `Agents make better decisions when the criteria are explicit and testable. Write them as rules the agent can apply and a reviewer can check:

- **Classification rules**: "label as bug if the report includes steps to reproduce and an unexpected result; as enhancement if it requests new behaviour; otherwise ask a clarifying question."
- **Thresholds**: "mark priority High when more than three customers are affected or revenue is at risk."
- **Confidence handling**: GitHub automations attach a **rationale and confidence level** to issue changes, and the repository's **automation level** decides what applies automatically: **Full control** (hold everything), **Cautious** (default; only high-confidence changes apply), **Balanced** (routine changes apply, ambiguity is held) and **Full automation** (apply unless flagged uncertain). You can also tell the agent to *suggest* specific changes regardless of confidence.
- **Boundaries**: actions the agent may never take (close issues, contact customers, merge).
- **Stopping condition and definition of done**.
- **Tie-breakers and fallbacks**: what to do when sources conflict or data is missing ("write Unknown and escalate").

Keep criteria in the workflow instructions or a skill so they are versioned and reviewable, and refine them from evidence: session logs, declined suggestions and \`/chronicle improve\` reveal where the agent misjudged.`,
    },
    {
      heading: 'Aligning with common design patterns',
      body: `Match the design to a pattern GitHub supports natively:

| Pattern | When to use | GitHub realisation |
|---|---|---|
| **Deterministic automation** | Fixed rules, no judgment | Project built-in workflows, GitHub Actions, rulesets |
| **Single agent task** | One bounded job per run | Copilot automation or agentic workflow with one prompt and safe outputs |
| **Plan, then execute** | Complex change; validate scope before work | Plan mode then Autopilot in the Copilot app or CLI; \`--plan --mode autopilot\` for unattended runs |
| **Orchestrator and subagents** | Independent subtasks that can run in parallel | \`/fleet\`, custom agents as subagents, dynamic workflows that define steps in code |
| **Critic or evaluator loop** | Quality matters; catch blind spots | Rubber duck agent on a different model, Copilot code review on agent PRs, self-improving automation groups where evaluators propose improvements |
| **Human-in-the-loop gate** | Irreversible or compliance-sensitive steps | Suggestions held in the approvals panel, draft PRs requiring review, "Approve and run workflows", dynamic workflow checkpoints |
| **Scheduled batch versus event-driven** | Predictable cost versus immediacy | \`schedule: daily\` or weekly in agentic workflows versus issue and pull request triggers |

Two agentic forms differ in *where the process is defined*. **Copilot automations** are configured in the UI (prompt, triggers, tools, limits) and are not stored in Git. **GitHub Agentic Workflows** are Markdown files in \`.github/workflows\` compiled to Actions workflows, so they are versioned, reviewed through pull requests and portable across AI engines. **Dynamic workflows** encode the steps, conditions and handoffs in code and let agents handle only the judgment parts. Choose the lightest pattern that meets the risk level, and add a critic or a human gate when the cost of a wrong action is high.`,
    },
  ],
  examples: [
    {
      title: 'From "we spend Mondays writing status" to a designed workflow',
      description:
        'A PMO lead decomposes the weekly status ritual. Trigger: weekly on Monday. Inputs: merged pull requests, closed and opened issues, project status updates from the last 7 days. Tasks: gather activity, group by initiative, draft the summary with the team template. Decision criteria: flag an initiative At risk if more than two issues slipped their target date. Output: one issue titled "Status week N" with a fixed section order. Review: the PMO lead edits and shares. Limits: 150 AI credits per run. The pattern is a single-agent scheduled batch with a human reviewer.',
      takeaway: 'Trigger, inputs, tasks, criteria, output, review and limits turn a vague wish into an implementable workflow.',
    },
    {
      title: 'An agent where a rule would do (a realistic mistake)',
      description:
        'A team configures an agentic workflow to "set the project Status to Done whenever a pull request merges". It works, but it costs AI credits on every merge and occasionally picks the wrong item. The built-in project workflow "pull request merged → Done" does the same thing deterministically for free. The fix is to use the built-in automation and reserve the agent for the judgment-heavy part: writing the release note summary.',
      takeaway: 'Deterministic rules belong in built-in automations or Actions; agents are for context-dependent judgment.',
    },
    {
      title: 'Designing triage with confidence-based criteria',
      description:
        'A support operations analyst writes triage criteria as rules: bug versus enhancement definitions, a High-priority threshold of three affected customers, and "never close an issue; suggest closure instead". She leaves the repository automation level at Cautious so only high-confidence label changes apply while everything else waits in the approvals panel. After two weeks of accepting most suggestions she moves to Balanced, documenting the change in the workflow pull request.',
      language: 'text',
      code: `Criteria (in the workflow instructions):
- bug: steps to reproduce + unexpected result
- enhancement: request for new behaviour
- priority High: >3 customers affected OR revenue at risk
- Never close issues. Suggest closure with rationale.
Repository setting: Settings > Agent suggestions for issues > Automation level = Cautious`,
      takeaway: 'Explicit, testable criteria plus a confidence threshold let you start cautious and loosen with evidence.',
    },
  ],
  keyPoints: [
    'Chat converses, an agent reasons and acts with tools, an automation starts work from a trigger and may or may not invoke an agent.',
    'Good agentic use cases are repetitive, need contextual judgment, and produce reviewable outputs (triage, CI investigation, reports, docs upkeep); deterministic rules belong in built-in automations.',
    'Decompose into trigger, inputs, tasks, decision points, outputs, review/escalation and success criteria with limits; document it before building.',
    'Decision criteria should be explicit and testable: classification rules, thresholds, confidence handling, boundaries, stopping condition and fallbacks.',
    'Repository automation levels for agent issue suggestions: Full control, Cautious (default), Balanced, Full automation.',
    'Patterns: deterministic automation, single agent, plan-then-execute, orchestrator with subagents (/fleet, dynamic workflows), critic loop (rubber duck, code review, evaluator automations), human-in-the-loop gate, scheduled batch versus event-driven.',
    'Copilot automations are UI-configured and not in Git; GitHub Agentic Workflows are Markdown in .github/workflows, versioned and reviewed through pull requests; dynamic workflows define the process in code.',
  ],
  flashcards: [
    { front: 'How does GitHub distinguish chat, agent and automation?', back: 'Chat is a conversation; an agent completes a goal by reasoning and using tools; an automation starts repeatable work from a trigger and may run fixed steps or invoke an agent.' },
    { front: 'Name four use cases GitHub lists for agentic workflows.', back: 'Issue triage and labelling, investigating CI failures, daily or weekly status reports, keeping documentation up to date (also improving test coverage).' },
    { front: 'When is a plain built-in automation better than an agent?', back: 'When the rule is deterministic, such as setting Status to Done on merge; agents add cost and variability without benefit.' },
    { front: 'List the elements of a workflow decomposition.', back: 'Trigger, inputs and context, tasks, decision points, outputs, review and escalation, success criteria and limits.' },
    { front: 'What are the four repository automation levels for agent issue suggestions?', back: 'Full control, Cautious (default), Balanced, Full automation.' },
    { front: 'How do you force a specific change to wait for review regardless of confidence?', back: 'Ask the agent in the prompt to suggest that change rather than apply it.' },
    { front: 'Which pattern does Plan mode followed by Autopilot implement?', back: 'Plan, then execute: validate scope and approach before autonomous implementation.' },
    { front: 'What makes the rubber duck agent a useful critic?', back: 'It runs on a different model family from the session model, so it is less likely to share the same blind spots, and it reports blocking, non-blocking and suggestion-level issues.' },
    { front: 'Key design difference between Copilot automations and GitHub Agentic Workflows?', back: 'Automations are configured in the UI and not stored in Git; agentic workflows are Markdown files compiled to Actions workflows, versioned and reviewed via pull requests.' },
    { front: 'What is a dynamic workflow?', back: 'A process defined in code (a Copilot extension) that combines deterministic steps with agents, can run steps in sequence or parallel, pause at checkpoints and enforce limits.' },
  ],
  quiz: [
    {
      question:
        'A support manager wants new issues sorted into bug, enhancement or question, with a priority based on how many customers mention the problem. Which approach fits best?',
      options: [
        'A project built-in workflow that sets Status when items are added',
        'An agentic workflow or Copilot automation triggered when an issue is created, with explicit classification criteria and suggestions held for review at low confidence',
        'A ruleset that requires labels before merging',
        'A weekly manual review by the manager',
      ],
      correct: [1],
      explanation:
        'Classification by content needs contextual judgment, which is what agents provide; the confidence gate keeps humans in control. Built-in workflows and rulesets are deterministic and cannot read issue content, and manual review is what the team is trying to reduce.',
    },
    {
      question:
        'A process designer proposes an agent to "move project items to Done when their pull request merges". What is the BEST feedback?',
      options: [
        'Approve; agents are the recommended way to update projects',
        'Use the built-in project workflow for merged pull requests instead, because the rule is deterministic and free of AI credits',
        'Use Autopilot mode so the agent does it faster',
        'Add a rubber duck critic to the agent',
      ],
      correct: [1],
      explanation:
        'Deterministic rules belong in built-in automations. Agents add cost and variability here, Autopilot does not change that, and a critic adds more cost to an unnecessary agent.',
    },
    {
      question:
        'Which TWO items belong in the decision-making criteria of an issue-triage workflow? (Select two)',
      options: [
        'A threshold such as "priority High when more than three customers are affected"',
        'A boundary such as "never close issues; suggest closure instead"',
        'The colour of the project board columns',
        'The name of the GitHub Actions runner',
      ],
      correct: [0, 1],
      explanation:
        'Thresholds and boundaries are testable criteria an agent applies and a reviewer can check. Board colours and runner names are presentation or infrastructure details, not decision criteria.',
    },
    {
      question:
        'A team needs an incident investigation that always collects logs first, then has separate agents analyse three systems in parallel, then merges findings into one report, pausing for review before publishing. Which design pattern and GitHub feature fit best?',
      options: [
        'Single-agent chat prompt in Copilot Chat on GitHub.com',
        'A dynamic workflow that defines the steps in code, runs subagents in parallel and pauses at a checkpoint',
        'A project built-in auto-archive workflow',
        'A wiki page describing the procedure',
      ],
      correct: [1],
      explanation:
        'Fixed steps, parallel agents, combined results and a review checkpoint are exactly what dynamic workflows provide. Chat is single-threaded, auto-archive is unrelated, and a wiki documents rather than executes.',
    },
    {
      question:
        'A compliance officer wants every agent-proposed change to a regulatory-tracking repository\'s issues to wait for a human, regardless of the agent\'s confidence. Which repository setting achieves this?',
      options: [
        'Automation level: Full automation',
        'Automation level: Balanced',
        'Automation level: Full control',
        'Automation level: Cautious',
      ],
      correct: [2],
      explanation:
        'Full control holds every change for review. Cautious applies high-confidence changes, Balanced applies routine ones, and Full automation applies everything not flagged uncertain.',
    },
  ],
  statements: [
    { text: 'Every automation on GitHub is agentic.', isTrue: false, explanation: 'Automations can run fixed steps or invoke an agent; project built-in workflows, for example, are deterministic.' },
    { text: 'Agentic workflows suit repetitive tasks that need contextual judgment and produce reviewable outputs.', isTrue: true, explanation: 'Triage, CI investigation, reports and documentation upkeep are GitHub\'s headline examples.' },
    { text: 'The default repository automation level for agent issue suggestions is Full automation.', isTrue: false, explanation: 'The default is Cautious: only high-confidence changes apply automatically.' },
    { text: 'Copilot automations are stored as files in the repository and reviewed through pull requests.', isTrue: false, explanation: 'Automations are stored separately and not committed to Git; GitHub Agentic Workflows are the file-based, reviewable option.' },
    { text: 'The /fleet command makes the main agent act as an orchestrator that delegates subtasks to parallel subagents.', isTrue: true, explanation: 'Copilot decides how to divide the work and runs independent subtasks in parallel.' },
    { text: 'A plan-then-execute pattern can be run unattended in Copilot CLI with --plan --mode autopilot.', isTrue: true, explanation: 'The session plans and then continues into Autopilot without waiting for interactive approval.' },
  ],
  resources: [
    { label: 'About GitHub Copilot agents', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/about-agents/about-github-copilot-agents' },
    { label: 'GitHub Agentic Workflows (concept)', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/about-github-agentic-workflows' },
    { label: 'Dynamic workflows', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/dynamic-workflows' },
    { label: 'Delegating and parallelizing work with agents', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/choosing-and-delegating-agent-work/delegating-and-parallelizing-work-with-agents' },
  ],
};
