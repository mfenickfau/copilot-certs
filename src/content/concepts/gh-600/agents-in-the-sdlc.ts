import type { Concept } from '../../types';

export const agentsInTheSdlc: Concept = {
  id: 'agents-in-the-sdlc',
  title: 'Where Agents Fit in the SDLC: Tasks, Anti-Patterns and Success Criteria',
  summary:
    'How to decide which software-delivery steps to hand to a coding agent, how to specify the inputs, outputs and done-criteria for each task, and how to recognise the anti-patterns (vague tasks, unbounded scope, trusting output without validation) that make agent work expensive instead of fast.',
  certs: ['gh-600', 'gh-700'],
  domains: ['gh-600-1', 'gh-700-3'],
  outcomes: ['gh-600-1-1-1', 'gh-600-1-1-2', 'gh-600-1-1-3', 'gh-700-3-1-1', 'gh-700-3-1-2'],
  tags: ['sdlc', 'copilot-cloud-agent', 'task-design', 'anti-patterns', 'success-criteria', 'copilot-instructions'],
  difficulty: 'foundations',
  diagram: 'agentic-sdlc',
  sections: [
    {
      heading: 'Which steps belong to an agent',
      body: `GitHub positions agents at every stage of delivery, but the exam expects you to be selective. GitHub Copilot's agentic surfaces map to specific SDLC steps:

| SDLC step | Agent surface on GitHub | Typical trigger |
|---|---|---|
| Triage and planning | Copilot automations, GitHub Agentic Workflows, plan mode | Issue opened, schedule |
| Implementation | Copilot cloud agent (assign an issue, prompt from the Agents tab), agent mode or Copilot CLI locally | Issue assignment, prompt |
| Validation | Agent runs tests and linters in its ephemeral environment; CodeQL, secret scanning and dependency checks run on generated code | Automatic during a session |
| Review | Copilot code review, Agent Merge ("Watch and fix") for failing checks and merge conflicts | Pull request opened or updated |
| Operations | Automations and agentic workflows for reports, CI-failure investigation, documentation drift | Schedule, repository events |

The steps that suit an agent share three properties: the task is **well-defined** (a clear outcome and acceptance test), it is **bounded** (one repository, one branch, a predictable blast radius), and its result is **verifiable** by tooling or a reviewer. Good first candidates are bug fixes with a failing test, test-coverage gaps, dependency and documentation updates, small refactors and issue triage. Poor candidates are open-ended architecture decisions, changes that span many repositories in one run (a GitHub Actions-based session can only change the repository it was started in), and anything whose correctness only a human can judge.

Decomposition matters as much as selection. A large feature becomes a set of agent-sized tasks, each with its own issue, each producing a reviewable pull request, with a human (or an orchestrating agent) owning the sequence.`,
    },
    {
      heading: 'Defining inputs, outputs and success criteria',
      body: `An agent task is a contract. Before you assign an issue to Copilot or write an automation prompt, make the three parts explicit:

- **Inputs.** The issue body or prompt, repository instructions (\`.github/copilot-instructions.md\`, path-specific \`.github/instructions/*.instructions.md\`, \`AGENTS.md\`), any linked issues or pull requests, screenshots or designs, and the tools and MCP servers the agent is allowed to use. If a fact is not in these places, assume the agent does not know it.
- **Outputs.** Name the artifact: a draft pull request against a named branch, a plan in Markdown, an issue comment, labels applied, a report issue. State what must *not* change (production code in a tests-only task, the public API, generated files).
- **Success criteria.** Make them checkable: "all tests in \`tests/api\` pass", "no new CodeQL alerts", "the endpoint returns 400 for an empty body", "the plan lists each file to change with a one-line rationale". Pair qualitative goals ("follow the ErrorHandler pattern") with where the agent can see an example.

GitHub's own guidance for the cloud agent is to write issues the way you would for a new team member: a clear problem statement, acceptance criteria, pointers to relevant files, and the commands to build and test. The repository instructions file carries the standing parts of that contract so every task inherits them. The exam rewards answers that move knowledge *into* the repository (instructions, setup steps, tests) rather than into longer one-off prompts.`,
    },
    {
      heading: 'Anti-patterns and their mitigations',
      body: `The anti-patterns the exam probes are recognisable because each has a concrete fix in GitHub tooling:

| Anti-pattern | What goes wrong | Mitigation |
|---|---|---|
| Vague task ("make the app faster") | Agent guesses scope, produces a sprawling diff | Research first, then ask for a plan, then implement the agreed plan (research, plan, iterate) |
| Unbounded scope | One pull request touches dozens of files; reviewers rubber-stamp | Split into issues; constrain with instructions ("only modify files under \`src/billing\`"); custom agent with limited \`tools\` |
| Trusting output without validation | Bugs and insecure code merge | Keep built-in validation tools on; require Copilot code review plus a human review; CI must pass |
| Agent discovers the environment by trial and error | Slow, flaky sessions that cannot install private packages | \`copilot-setup-steps.yml\` preinstalls dependencies deterministically |
| Secrets in prompts | Prompts are visible in shared sessions and logs | Use Agents secrets and variables; never paste tokens into issues |
| Over-broad tool access | Prompt injection or a mistake becomes a destructive action | Allowlist specific, preferably read-only, MCP tools; scope automation writes to "Only this issue" |
| Ignoring the loop | The same failure recurs | Capture failures as repository instructions or memories; tune, do not re-prompt |
| Approvals as the only control | A reviewer clicks through | Rulesets and permissions enforce; approvals are a workflow convenience |

A useful mental test: if the mitigation is "ask the agent nicely", it is not a mitigation. Prefer a change to instructions, environment, permissions or review gates.`,
    },
    {
      heading: 'The exam angle',
      body: `GH-600 items in this group are scenario based. Expect to choose the *first* or *most appropriate* action:

- A team wants to start with the cloud agent. The best first tasks are well-scoped issues with acceptance criteria and tests, not "modernise the monolith".
- A pull request from Copilot keeps failing CI because the agent could not install a private package. The fix is a \`copilot-setup-steps.yml\` workflow (and a firewall allowlist entry for the registry), not a longer prompt.
- Reviewers complain that Copilot pull requests are too large. Decompose the work into smaller issues and constrain scope through instructions, rather than disabling the agent.
- An automation that triages issues sometimes mislabels them. Lower the repository's automation level so lower-confidence changes are held as suggestions, and tighten the prompt with examples.

Distractors usually propose turning the agent off, granting it broader permissions so it "has what it needs", or writing the same prompt again. The correct options change the contract (inputs, outputs, success criteria) or the environment.`,
    },
  ],
  examples: [
    {
      title: 'An issue written as an agent contract',
      description:
        'A platform team assigns a flaky-test fix to Copilot cloud agent. Instead of "fix the flaky test", the issue states the problem, the acceptance criteria, the files involved and the commands to run. The agent opens a draft pull request within one session and the reviewer can check each criterion.',
      language: 'markdown',
      code: `## Problem
\`tests/api/test_orders.py::test_concurrent_checkout\` fails ~1 in 10 runs with a
"deadlock detected" error from Postgres.

## Acceptance criteria
- Run \`make test-api\` 5 times locally: all green.
- No change to \`src/api/public/*.py\` (public contract).
- Add a regression test that reproduces the race deterministically.

## Context
- Checkout locking lives in \`src/api/orders/locks.py\`.
- Follow the retry pattern in \`src/api/common/retry.py\`.`,
      takeaway: 'Inputs, outputs and checkable success criteria turn an agent task into something a reviewer can verify.',
    },
    {
      title: 'Repository instructions that encode the standing contract',
      description:
        'Rather than repeating build commands and conventions in every issue, the team commits a repository-wide instructions file. The cloud agent, Copilot code review and local agent mode all read it, so every task inherits the same rules.',
      language: 'markdown',
      code: `# .github/copilot-instructions.md
This is a Python 3.12 FastAPI service. Use \`uv\` for dependencies.

## Build and test
- Install: \`uv sync\`
- Unit tests: \`uv run pytest tests/unit -q\`
- API tests (needs Postgres service): \`make test-api\`

## Conventions
- Errors go through \`formatApiError\`; never return raw exceptions.
- Database migrations live in \`db/migrations\`, never in startup code.
- Do not edit files under \`api/generated/\`; change \`openapi.yaml\` instead.

## Definition of done for agent tasks
- Tests pass, \`ruff check\` is clean, and the PR description lists each
  changed file with a one-line reason.`,
      takeaway: 'Move standing knowledge into the repository so it applies to every agent session, not just the next prompt.',
    },
    {
      title: 'The unbounded-scope mistake and the fix',
      description:
        'A developer asks the cloud agent to "improve performance across the app". The resulting pull request touches 47 files, mixes a caching layer with unrelated refactors, and reviewers cannot evaluate it. The fix is to run the research-plan-iterate flow: ask Copilot to investigate and report hotspots, request a plan, agree on the top two items, then implement each as its own issue with a tests-only or docs-only custom agent where appropriate.',
      takeaway: 'Scope is a design decision you make before the agent starts; it is not something a reviewer can add afterwards.',
    },
  ],
  keyPoints: [
    'Hand agents tasks that are well-defined, bounded to one repository and branch, and verifiable by tests, scans or a reviewer.',
    'Every agent task is a contract: explicit inputs (issue, instructions, tools), a named output artifact, and checkable success criteria.',
    'Standing knowledge belongs in .github/copilot-instructions.md, path-specific instructions and AGENTS.md, not in each prompt.',
    'Anti-patterns to recognise: vague tasks, unbounded scope, trusting output without validation, trial-and-error environments, secrets in prompts, over-broad tools.',
    'Mitigations are structural: decomposition, setup steps, validation tools, least-privilege tools, rulesets and review gates, never "prompt harder".',
    'Research, plan, then iterate: have Copilot investigate and propose before it changes code.',
    'A GitHub Actions-based cloud agent session changes only the repository it was started in and opens one pull request per task; design work around that.',
  ],
  flashcards: [
    { front: 'Name three properties of an SDLC task that make it suitable for a coding agent.', back: 'Well-defined outcome, bounded scope (one repository, one branch, predictable blast radius), and verifiable by tests, scans or review.' },
    { front: 'Where should standing conventions and build/test commands for agent tasks live?', back: 'In repository custom instructions: .github/copilot-instructions.md, path-specific .github/instructions/*.instructions.md, or an AGENTS.md file.' },
    { front: 'What are the three parts of an agent task contract?', back: 'Inputs (issue, instructions, tools), outputs (the artifact, e.g. a draft PR or plan) and checkable success criteria.' },
    { front: 'The cloud agent keeps failing to install a private package. What is the fix?', back: 'Add a .github/workflows/copilot-setup-steps.yml that preinstalls dependencies deterministically (and allowlist the registry in the firewall if needed).' },
    { front: 'Copilot pull requests are too large to review. Best response?', back: 'Decompose the work into smaller issues and constrain scope through instructions or a custom agent with limited tools; do not disable the agent.' },
    { front: 'Why is "approve every change" not a sufficient control against a bad agent change?', back: 'Approvals are a workflow convenience; repository permissions, rulesets and tool scoping are the enforcing controls.' },
    { front: 'How many pull requests can a single cloud agent task open?', back: 'One pull request per task, working on one branch at a time.' },
    { front: 'What is the recommended sequence for a large, vague request?', back: 'Research the repository, ask for a plan, iterate on the plan, then implement the agreed plan as scoped tasks.' },
    { front: 'Why should secrets never be pasted into an agent prompt?', back: 'Prompts appear in shared session logs; use Agents secrets and variables instead.' },
  ],
  quiz: [
    {
      question:
        'A team is adopting Copilot cloud agent. Which task is the MOST appropriate first candidate to delegate?',
      options: [
        'Redesign the service architecture to support multi-region deployment.',
        'Fix a reproducible bug that has a failing test and clear acceptance criteria in one repository.',
        'Migrate shared code across six repositories in a single run.',
        'Decide which third-party payment provider the company should adopt.',
      ],
      correct: [1],
      explanation:
        'A bounded, verifiable task in one repository is ideal. Architecture redesign and vendor selection need human judgment, and a GitHub Actions-based session can only change the repository it was started in.',
    },
    {
      question:
        'Copilot cloud agent pull requests repeatedly fail CI because the agent could not install dependencies from a private registry during its session. What should you do FIRST?',
      options: [
        'Add a .github/workflows/copilot-setup-steps.yml that installs the dependencies and allowlist the registry host in the firewall.',
        'Rewrite the issue to tell Copilot to try harder to install the packages.',
        'Disable the firewall for the repository.',
        'Grant the agent organization owner permissions.',
      ],
      correct: [0],
      explanation:
        'Setup steps make environment preparation deterministic, and a targeted allowlist entry keeps the firewall on. Longer prompts do not fix environment gaps, disabling the firewall increases exfiltration risk, and permissions are unrelated.',
    },
    {
      question:
        'Which TWO elements belong in the definition of an agent task so that a reviewer can verify the result? (Select two)',
      options: [
        'Checkable success criteria such as named tests passing and no new scan alerts',
        'A named output artifact such as a draft pull request against a specific branch',
        'The agent\'s expected token consumption',
        'A list of every GitHub user who may read the repository',
      ],
      correct: [0, 1],
      explanation:
        'Outputs and success criteria make the result verifiable. Token consumption is a cost signal, not part of the contract, and repository access lists are unrelated to task definition.',
    },
    {
      question:
        'Reviewers report that pull requests from the cloud agent routinely touch 40+ files and mix unrelated changes. What is the MOST appropriate response?',
      options: [
        'Turn off Copilot cloud agent for the repository.',
        'Decompose work into smaller issues and constrain scope through repository instructions or a custom agent with a limited toolset.',
        'Ask reviewers to approve faster so the queue does not grow.',
        'Increase the GitHub Actions runner size so sessions finish sooner.',
      ],
      correct: [1],
      explanation:
        'Scope is set before the agent starts. Disabling the agent loses the benefit, rushing review increases risk, and runner size does not change diff size.',
    },
    {
      question:
        'A developer wants Copilot to "improve performance across the app". Which approach aligns with GitHub guidance for vague, large requests?',
      options: [
        'Assign the request directly to Copilot and review whatever pull request results.',
        'Ask Copilot to research the repository and report hotspots, request a plan, agree on scope, then implement each agreed item as its own task.',
        'Grant the agent write access to all repositories so it can optimise shared libraries too.',
        'Run the request as a scheduled automation so it repeats weekly.',
      ],
      correct: [1],
      explanation:
        'Research, plan, iterate is the documented flow for large changes. Direct assignment of a vague task invites unbounded scope, broader access increases risk, and scheduling a vague task repeats the problem.',
    },
    {
      question:
        'Which statement about repository custom instructions for agent tasks is correct?',
      options: [
        'They are read only by Copilot code review, not by the cloud agent.',
        'They replace the need for tests and acceptance criteria in issues.',
        'They carry standing conventions and build/test commands so every agent session inherits them.',
        'They must be stored as Agents secrets.',
      ],
      correct: [2],
      explanation:
        'Instructions files such as .github/copilot-instructions.md are used by the cloud agent, code review and IDE agents. They complement, not replace, per-task acceptance criteria, and they are plain files in the repository.',
    },
  ],
  statements: [
    { text: 'A Copilot cloud agent session running on GitHub Actions can make changes across several repositories in one run.', isTrue: false, explanation: 'Actions-based sessions are scoped to the repository where the task started; cloud sandbox sessions can span repositories in one organization.' },
    { text: 'Writing acceptance criteria and pointing to relevant files in the issue improves cloud agent results.', isTrue: true, explanation: 'GitHub recommends writing agent tasks the way you would brief a new team member.' },
    { text: 'The best mitigation for an agent that produces oversized pull requests is to ask reviewers to approve more quickly.', isTrue: false, explanation: 'Scope must be constrained before the agent starts; faster approvals increase risk.' },
    { text: 'Secrets needed by the agent should be provided as Agents secrets rather than pasted into the prompt.', isTrue: true, explanation: 'Prompts are visible in session logs; Agents secrets are masked.' },
    { text: 'The research-plan-iterate flow lets you agree on an approach before Copilot changes code.', isTrue: true, explanation: 'You can ask questions, request a plan, iterate and then implement the agreed plan on a branch.' },
    { text: 'Human approvals on their own enforce what an automation can change in a repository.', isTrue: false, explanation: 'GitHub states approvals are a workflow convenience; permissions and tool scoping are the enforcing controls.' },
  ],
  resources: [
    { label: 'About GitHub Copilot agents (GitHub Docs)', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/about-agents/about-github-copilot-agents' },
    { label: 'Research, plan, and iterate on code changes with Copilot', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/research-plan-iterate' },
    { label: 'Custom instructions for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/custom-instructions' },
    { label: 'Study guide for Exam GH-600', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-600' },
  ],
};
