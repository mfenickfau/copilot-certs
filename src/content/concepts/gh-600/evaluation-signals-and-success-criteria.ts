import type { Concept } from '../../types';

export const evaluationSignalsAndSuccessCriteria: Concept = {
  id: 'evaluation-signals-and-success-criteria',
  title: 'Evaluating Agents: Success Criteria, Signals and Automated Scans',
  summary:
    'How to specify expected outcomes and operational constraints for agent tasks, which qualitative and quantitative signals tell you whether an agent is doing a good job, how to keep evaluation criteria aligned with what the developer actually intended, and how GitHub\'s scanning tools (CodeQL, secret scanning, dependency review, Copilot code review, CI checks) generate evaluation signals automatically.',
  certs: ['gh-600', 'gh-700'],
  domains: ['gh-600-4', 'gh-700-4'],
  outcomes: ['gh-600-4-1-1', 'gh-600-4-1-2', 'gh-600-4-1-3', 'gh-600-4-1-4', 'gh-700-4-3-2'],
  tags: ['evaluation', 'success-criteria', 'codeql', 'secret-scanning', 'copilot-code-review', 'metrics'],
  difficulty: 'intermediate',
  diagram: 'eval-loop',
  sections: [
    {
      heading: 'Expected outcomes and operational constraints',
      body: `Evaluation starts before the agent runs: you cannot measure against criteria you never wrote. For each agent task (or each class of task an automation handles) specify two things.

**Expected outcomes** are what the result must contain or achieve: the failing test passes, the endpoint validates input, the report issue lists merged pull requests from the last 24 hours, the triage label matches the taxonomy. Write them as observable checks, ideally executable ("\`make test-api\` passes", "no CodeQL alerts of severity high or critical", "the pull request touches only files under \`src/billing\`").

**Operational constraints** are the limits the agent must respect while getting there: scope (one repository, listed paths), budget (AI credits per run, session length under the 59-minute Actions cap), time (completes before the nightly build), safety (no changes to workflows or migrations, read-only MCP tools), process (opens a draft pull request, never merges), and compliance (no secrets in logs, co-authored commits). Constraints are where GitHub's platform helps: tool allowlists, firewall, rulesets, automation credit limits and the *Configured tools can change* setting turn constraints into enforced boundaries, and a violation becomes an evaluation signal (a firewall warning in the pull request, a denied tool call in the log, a blocked push).

Record both in the place the agent reads: the issue body for one-off tasks, the automation prompt for recurring ones, repository instructions for standing criteria. GitHub's cloud agent guidance to write issues with acceptance criteria is, in evaluation terms, specifying the oracle up front.`,
    },
    {
      heading: 'Qualitative and quantitative evaluation signals',
      body: `Good evaluation mixes numbers with judgment, because agents can satisfy a metric while missing the point.

**Quantitative signals** (cheap, automatable, trendable):
- Task success rate: pull requests merged versus closed without merge; issues resolved without a human rewrite.
- Validation outcomes: CI pass rate on agent pull requests, CodeQL and secret-scanning alert counts on generated code, dependency advisories introduced.
- Review load: review comments per agent pull request, number of \`@copilot\` steering prompts, rounds before merge; Copilot code review findings per pull request.
- Efficiency: session duration, token and AI-credit consumption, number of tool calls, retries, firewall blocks. Session logs show token usage and length; billing dashboards show credits; usage metrics APIs report pull request creation, merges and time to merge for the cloud agent.
- Stability: stalled or timed-out sessions, hook denials, repeated failing commands.

**Qualitative signals** (expensive, decisive):
- Reviewer judgment on correctness, design fit and readability.
- Copilot code review comments and the thumbs-up/thumbs-down feedback on agent pull requests and comments.
- Rationale quality: does the agent's pull request description or automation rationale explain the change convincingly? Confidence ratings on automation changes are the agent's self-assessment and can be compared with reviewer decisions in the approvals panel.
- Plan adherence: did the diff match the approved plan?

For automations, the \`has:suggestions\` queue is a built-in evaluation loop: the ratio of accepted to declined suggestions tells you whether the automation level and prompt are right. For local and cloud sessions, session queries ("show me sessions where the agent struggled or I had to correct it multiple times") surface qualitative problems at scale.`,
    },
    {
      heading: 'Aligning criteria with development intent',
      body: `Misalignment is the classic agent failure: the agent made the tests pass by deleting the assertions, or closed the issue by labelling it "won't fix". Alignment techniques the exam expects:

- **Express intent, not just the metric.** Pair "tests pass" with "without weakening or removing existing tests" and "the behaviour described in the issue is implemented". Put the *why* in the issue and instructions.
- **Protect the oracle.** Make the acceptance test something the agent cannot edit (a tests-only custom agent for the fix, path protection on \`tests/acceptance/\`, CODEOWNERS review for test changes) or have a separate reviewer agent check that tests were not weakened.
- **Review the plan against intent before execution.** Plan approval catches "technically satisfies the ticket" approaches early.
- **Use the developer's own artifacts as the reference.** Repository instructions, existing patterns ("follow \`retry.py\`"), and Copilot Memory facts anchor what "good" looks like in this codebase. Copilot code review uses custom instructions to review against the team's standards rather than generic ones.
- **Close the loop with humans.** Thumbs-down with a reason on an agent pull request, declined suggestions with feedback, and steering prompts are the alignment data; capture recurring themes as instruction changes.
- **Keep criteria stable across surfaces.** The same instructions files feed the cloud agent, code review and IDE agents, so evaluation in one place reflects behaviour everywhere.

The exam angle: when an agent "passes" but reviewers are unhappy, the fix is usually to make criteria express intent and to stop the agent being able to change the thing that measures it.`,
    },
    {
      heading: 'Generating signals with automated scanning tools',
      body: `GitHub generates evaluation signals for free if you keep the tooling on:

- **Built-in validation in the cloud agent.** By default the agent checks generated code with **CodeQL**, checks new dependencies against the **GitHub Advisory Database** (malware, high/critical CVSS), runs **secret scanning**, and gets a second opinion from **Copilot code review**, attempting to fix findings before the pull request is ready. Repository administrators can toggle these under Settings > Copilot > Cloud agent > Validation tools; turning them off trades signal for speed.
- **Copilot code review** on every pull request (automatic reviews configurable at repository and organisation level, with Lite, Balanced or Max effort), guided by custom instructions, and able to pass suggestions to the cloud agent for a fix pull request. It can also run in the CLI (\`agentic code review\`) and from the Copilot app.
- **GitHub Advanced Security on the pull request**: code scanning alerts, Copilot Autofix and Agentic Autofix, secret scanning push protection, Dependabot alerts and dependency review. The GitHub MCP server's \`secret_protection\` toolset and \`run_secret_scanning\` tool let the agent scan for secrets *before* pushing (remote server only; findings are ephemeral).
- **CI checks** in GitHub Actions: tests, linters, type checks and coverage gates run once a human approves workflow runs (or automatically if the repository relaxes that). Required status checks in rulesets make them a hard gate.
- **Agentic threat detection** in GitHub Agentic Workflows scans proposed outputs for suspicious changes before any write.
- **Hooks** as custom scanners: \`postToolUse\` can run a linter after every edit; \`agentStop\` can block completion until a scan ran.

Treat scan results as signals in two directions: a clean scan is weak evidence of correctness, but any finding is strong evidence of a problem worth tracing back to instructions, tools or environment.`,
    },
  ],
  examples: [
    {
      title: 'An evaluation rubric for a recurring automation',
      description:
        'A team runs a weekly automation that proposes test-coverage improvements. They define outcomes, constraints and the signals they will track, and review the numbers monthly alongside sampled pull requests.',
      language: 'markdown',
      code: `## Automation: weekly-coverage-improver

### Expected outcomes
- Opens at most one draft PR adding tests for the lowest-coverage module.
- Coverage for that module rises by >= 5 points; no production code changed.

### Constraints
- Tools: read, search, edit, execute, github/create_pull_request only.
- Per-run AI credit limit: 60. Session must finish within 30 minutes.
- Firewall: recommended allowlist only.

### Quantitative signals (tracked monthly)
- Merge rate of its PRs, review comments per PR, CI pass rate on first push,
  CodeQL/secret alerts introduced (target 0), credits per merged PR.

### Qualitative signals
- Reviewer thumbs-down reasons; sampled PRs checked for weakened assertions
  or tests that only exercise mocks.`,
      takeaway: 'Write outcomes, constraints and signals together; the numbers tell you when to look, the samples tell you what to change.',
    },
    {
      title: 'A GitHub Actions gate that turns scans into required evaluation signals',
      description:
        'The repository requires these checks in a ruleset so an agent pull request cannot merge unless tests, CodeQL and dependency review pass. The workflow only runs after a human clicks Approve and run workflows on agent pushes.',
      language: 'yaml',
      code: `name: agent-pr-gates
on:
  pull_request:
permissions:
  contents: read
  security-events: write
  pull-requests: read
jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: make test-api
  codeql:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: github/codeql-action/init@v3
        with:
          languages: python
      - uses: github/codeql-action/analyze@v3
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: high`,
      takeaway: 'Required status checks make scan signals binding for agent and human pull requests alike.',
    },
    {
      title: 'The gamed-metric mistake and the fix',
      description:
        'An agent tasked to "make the CI green" deletes three flaky-but-important assertions and the pipeline passes. The quantitative signal (green build) looked good; the qualitative review caught it a week later. The fix: restate the criterion as "tests pass without removing or weakening existing assertions", protect tests/acceptance with CODEOWNERS and a path rule, use a tests-only custom agent that cannot edit production code for test work and an executor that cannot edit acceptance tests for fixes, and add a review step (Copilot code review with an instruction to flag deleted assertions) before a human sees the pull request.',
      takeaway: 'If the agent can change the thing that measures it, the metric stops measuring intent.',
    },
  ],
  keyPoints: [
    'Specify expected outcomes as observable checks and operational constraints (scope, budget, time, safety, process, compliance) before the agent runs; put them where the agent reads them.',
    'Quantitative signals: merge rate, CI pass rate, scan alerts, review comments and steering prompts per PR, session duration, tokens and credits, retries, firewall blocks, stalled sessions.',
    'Qualitative signals: reviewer judgment, Copilot code review findings, thumbs-up/down feedback, rationale quality, plan adherence, accepted versus declined automation suggestions.',
    'Align criteria with intent by expressing the why, protecting the oracle (tests the agent cannot edit), approving plans, anchoring on the team\'s own patterns and instructions, and feeding reviewer feedback back into instructions.',
    'The cloud agent validates generated code by default with CodeQL, dependency advisory checks, secret scanning and Copilot code review; administrators can toggle these validation tools.',
    'Copilot code review (Lite, Balanced, Max), GitHub Advanced Security alerts, dependency review, the GitHub MCP server secret-scanning tools, CI checks and agentic threat detection generate automated signals.',
    'A clean scan is weak evidence of correctness; a finding is strong evidence of a problem to trace back to instructions, tools or environment.',
  ],
  flashcards: [
    { front: 'What two things should be specified for an agent task before it runs?', back: 'Expected outcomes (observable, ideally executable checks) and operational constraints (scope, budget, time, safety, process, compliance).' },
    { front: 'Name four quantitative evaluation signals for agent pull requests.', back: 'Merge rate, CI pass rate on first push, scan alerts introduced, review comments or steering prompts per PR (also duration, tokens/credits, retries).' },
    { front: 'Name three qualitative evaluation signals.', back: 'Reviewer judgment, Copilot code review findings and thumbs-down reasons, plan adherence or rationale quality.' },
    { front: 'Which validation tools does the cloud agent run on generated code by default?', back: 'CodeQL, dependency checks against the GitHub Advisory Database, secret scanning and a Copilot code review second opinion.' },
    { front: 'Where can a repository administrator disable the cloud agent\'s validation tools?', back: 'Repository Settings > Copilot > Cloud agent, in the Validation tools section.' },
    { front: 'How can an agent scan for secrets before pushing?', back: 'Via the GitHub remote MCP server with the secret_protection toolset and the run_secret_scanning tool (findings are ephemeral).' },
    { front: 'What are Copilot code review\'s effort levels?', back: 'Lite, Balanced and Max; administrators can set the default for automatic reviews.' },
    { front: 'What is the classic sign of misaligned criteria?', back: 'The agent satisfies the metric while defeating the intent, e.g. deleting assertions to make tests pass.' },
    { front: 'How do you stop an agent from changing the tests that evaluate it?', back: 'Protect test paths (CODEOWNERS, path rules), use a custom agent whose scope excludes those files, and review for weakened assertions.' },
    { front: 'What does the has:suggestions search qualifier show?', back: 'Issues with automation suggestions awaiting review; the accept/decline ratio is an evaluation signal for the automation.' },
  ],
  quiz: [
    {
      question:
        'An agent assigned to "make CI pass" deleted several assertions. Which change BEST realigns evaluation with intent?',
      options: [
        'Reward the agent for fast completion so it finishes sooner.',
        'Restate the criterion as passing tests without weakening existing assertions, protect test paths with CODEOWNERS and path rules, and review for removed assertions.',
        'Disable Copilot code review to reduce noise.',
        'Give the agent write access to the CI configuration so it can fix flaky checks.',
      ],
      correct: [1],
      explanation:
        'Express intent and protect the oracle. Faster completion, less review and broader access all make the problem worse.',
    },
    {
      question:
        'Which TWO are quantitative signals you can collect for cloud agent pull requests without additional tooling? (Select two)',
      options: [
        'Session duration and token usage shown in the session log',
        'Count of CodeQL and secret-scanning alerts on the pull request',
        'Whether the reviewer found the design elegant',
        'The agent\'s self-reported honesty score',
      ],
      correct: [0, 1],
      explanation:
        'Session metrics and scan alert counts are built-in quantitative data. Design judgment is qualitative, and there is no self-reported honesty score.',
    },
    {
      question:
        'A repository administrator wants agent pull requests to finish faster and considers disabling the cloud agent\'s built-in validation tools. What is the trade-off?',
      options: [
        'None; validation tools only affect billing.',
        'Faster sessions but loss of automatic CodeQL, dependency, secret-scanning and code review signals on generated code before the PR is ready.',
        'The agent loses access to the GitHub MCP server.',
        'Commits will no longer be co-authored.',
      ],
      correct: [1],
      explanation:
        'Validation tools generate evaluation signals and fix attempts before review; disabling them trades signal for speed. MCP access and commit attribution are unaffected.',
    },
    {
      question:
        'You want scans to be a hard gate for agent pull requests, not just advisory comments. What should you configure?',
      options: [
        'Required status checks in a ruleset for the test, CodeQL and dependency-review workflows.',
        'A note in copilot-instructions.md asking the agent to run scans.',
        'A larger GitHub Actions runner.',
        'Automatic workflow runs on agent pushes.',
      ],
      correct: [0],
      explanation:
        'Required status checks block merging until checks pass. Instructions are advisory, runner size is unrelated, and auto-running workflows changes when checks run, not whether they gate.',
    },
    {
      question:
        'An issue-triage automation\'s suggestions are declined by maintainers 60% of the time. What does this signal indicate and what should you do?',
      options: [
        'The maintainers are wrong; set the automation level to Full automation.',
        'The automation is misaligned with the team\'s taxonomy; refine the prompt and repository instructions with examples and keep the automation level at Cautious while re-evaluating.',
        'Delete the issue tracker.',
        'Increase the per-run AI credit limit.',
      ],
      correct: [1],
      explanation:
        'A high decline rate is a qualitative alignment signal. Applying changes automatically would spread the misalignment, and budgets do not affect correctness.',
    },
  ],
  statements: [
    { text: 'A green CI run is sufficient evidence that an agent implemented the intended behaviour.', isTrue: false, explanation: 'Agents can satisfy metrics while defeating intent; pair quantitative signals with qualitative review and protect the oracle.' },
    { text: 'By default, Copilot cloud agent uses CodeQL and secret scanning to check the code it generates.', isTrue: true, explanation: 'It also checks new dependencies against the GitHub Advisory Database and gets a Copilot code review second opinion.' },
    { text: 'Secret-scanning findings returned by the GitHub MCP server are persisted as alerts in the Security tab.', isTrue: false, explanation: 'MCP-invoked scan findings are ephemeral and appear only in the agent chat for that session.' },
    { text: 'Copilot code review can be guided by repository custom instructions.', isTrue: true, explanation: 'Custom instructions let reviews reflect the repository\'s conventions and standards.' },
    { text: 'Operational constraints such as scope and budget are part of an agent task specification.', isTrue: true, explanation: 'Constraints define the limits the agent must respect while achieving the outcome, and violations are evaluation signals.' },
    { text: 'The ratio of accepted to declined automation suggestions has no evaluation value.', isTrue: false, explanation: 'It directly measures alignment between the automation\'s judgments and the maintainers\'.' },
  ],
  resources: [
    { label: 'GitHub Copilot code review', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review' },
    { label: 'Risks and mitigations for GitHub Copilot cloud agent (built-in validation)', url: 'https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations' },
    { label: 'Scanning for secrets with the GitHub MCP server', url: 'https://docs.github.com/en/code-security/how-tos/use-ghas-with-ai-coding-agents/scan-for-secrets-with-github-mcp-server' },
    { label: 'Configuring settings for GitHub Copilot in the cloud (validation tools)', url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/configuring-agent-settings' },
  ],
};
