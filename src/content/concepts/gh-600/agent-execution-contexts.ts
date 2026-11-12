import type { Concept } from '../../types';

export const agentExecutionContexts: Concept = {
  id: 'agent-execution-contexts',
  title: 'Agent Execution Contexts: Repositories, Branches, CI and Environment Constraints',
  summary:
    'How to evaluate where an agent runs (IDE, Copilot CLI, cloud sandbox, GitHub Actions runner, custom environment), how to scope agents to specific repositories and branches, how to invoke agents from CI with Copilot CLI or GitHub Agentic Workflows, how the cloud agent creates branches and pull requests autonomously, and how to shape the environment with copilot-setup-steps.yml, Agents secrets, runners and the firewall.',
  certs: ['gh-600'],
  domains: ['gh-600-2'],
  outcomes: ['gh-600-2-3-1', 'gh-600-2-3-2', 'gh-600-2-3-3', 'gh-600-2-3-4', 'gh-600-2-3-5', 'gh-600-2-3-6'],
  tags: ['execution-context', 'copilot-setup-steps', 'github-actions', 'cloud-sandbox', 'firewall', 'rulesets', 'agentic-workflows'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Evaluating the execution context',
      body: `GitHub describes agent work in terms of a **client** (where you start the task), a **session** (the conversation and activity) and an **environment** (where the agent executes). Evaluating the environment answers the questions that determine risk and capability: whose credentials does the agent hold, what network can it reach, what state persists, and who can see the session?

| Environment | Characteristics | Choose when |
|---|---|---|
| Local IDE agent mode / Copilot CLI | Runs with the developer's user permissions unless local sandboxing is enabled; interactive approvals | You are iterating and want to approve actions |
| Local sandbox (CLI, Copilot app) | OS-level isolation of filesystem, network and credentials via a policy | You want autopilot or broad tool permissions on your own machine safely |
| Cloud sandbox | Ephemeral Linux environment hosted by GitHub; sessions resume across clients; can span repositories in one organisation; honours firewall allowlists; no custom compute or setup steps; unshared by default | Cross-repository chat and work, fast sessions, no private network needed |
| GitHub Actions-based session | One repository; up to 59 minutes; supports \`copilot-setup-steps.yml\`, larger and self-hosted runners, Agents secrets and variables; session shared by default; required for issue assignment and @copilot mentions | Repository-specific integrations, private networks, deterministic setup |
| Custom environment | A Linux machine or codespace you register and manage | Tooling that cannot live in a sandbox |

Two consequences the exam likes: the agent's **GitHub token** in Actions-based sessions can push only to its own branch and cannot run arbitrary \`git push\`; \`GITHUB_TOKEN\` is not set inside the sandbox, and Actions, Codespaces and Dependabot secrets are *not* passed to the agent, only Agents secrets. And the **firewall** applies inside the agent's environment to processes started through its shell (and the Playwright server in sandboxes), not to other MCP servers or anything outside.`,
    },
    {
      heading: 'Scoping agents to repositories and branches',
      body: `**Repository scope** is set in layers. An enterprise can block the cloud agent in all repositories it owns; an organisation enables the *Copilot in the cloud* policy and then, under **Settings > Copilot > Cloud**, sets *Repository access* to all or selected repositories and separately allows or blocks automations. Repository administrators can disable Copilot for a repository and configure its MCP servers, firewall, secrets and validation tools. Custom agents live in \`.github/agents/\` of a repository (repository scope) or in the \`agents/\` directory of an organisation's \`.github\` or \`.github-private\` repository (organisation scope), and repository-level definitions override organisation and enterprise ones with the same name.

**Branch scope** has a default shape: the cloud agent works on **one branch at a time**, creating a \`copilot/\` branch for new tasks or pushing to the pull request branch when mentioned on an existing pull request, and opens **one pull request per task**. You can start a session against a specific repository and branch, and custom agent versions follow the branch (the profile is read at its latest commit on that branch and the same version is used for follow-ups within the pull request). Rulesets and branch protection apply to the agent like any actor: a ruleset can prevent Copilot from creating or updating pull requests, and administrators can grant a bypass to Copilot, ideally *for pull requests only* so changes still flow through a pull request. Rulesets can also require an additional approval for pull requests not attributed to a person, and the user who requested the work cannot approve it.

Custom instructions respect scope too: repository-wide \`.github/copilot-instructions.md\`, path-specific \`.github/instructions/*.instructions.md\` with \`applyTo\` globs, and organisation instructions used for sessions on GitHub.com and code review.`,
    },
    {
      heading: 'Invoking agents from CI and enabling autonomous actions',
      body: `There are three documented ways to run an agent inside GitHub Actions:

1. **GitHub Agentic Workflows** (recommended). A Markdown file in \`.github/workflows/\` with YAML frontmatter (\`on\`, \`permissions\`, \`tools\`, \`network\`, \`safe-outputs\`, \`engine\`) and natural-language instructions, compiled with \`gh aw compile\` into a \`.lock.yml\` Actions workflow. Agents run in firewalled containers with read-only tokens by default; writes happen only through declared safe outputs (\`create-issue\`, \`add-comment\`, \`create-pull-request\`, \`add-labels\`...), checked by threat detection, with secrets kept in downstream jobs.
2. **Copilot CLI in a workflow step**: \`npm install -g @github/copilot\` then \`copilot -p "..." -s\` with explicit \`--allow-tool\` rules. Grant \`copilot-requests: write\` so the job can make Copilot requests with \`GITHUB_TOKEN\`, which bills the organisation when the *Allow use of Copilot CLI billed to the organization* policy is on. Non-interactive runs deny any action that is not pre-approved. GitHub warns that this gives the CLI broad access to the workflow environment and that fork-triggered workflows are at higher prompt-injection risk.
3. **Copilot automations** on GitHub.com, which are not Actions workflows but run cloud agent sessions on schedules or repository events with selected tools.

**Autonomous branch and pull request creation** is the cloud agent's native behaviour: assign an issue to Copilot (or prompt from the Agents tab, GitHub Mobile, Copilot CLI with delegation, Slack or Teams) and it creates a \`copilot/\` branch, commits signed work, and opens a draft pull request linked to the issue. From chat or research sessions you ask explicitly: "Create a pull request to ...". Agentic workflows do the same through the \`create-pull-request\` safe output. Prerequisites: the *Copilot in the cloud* policy enabled, the repository allowed, the actor has write access, and rulesets permit the agent (or grant it a bypass).`,
    },
    {
      heading: 'Handling environment-specific constraints',
      body: `The agent's environment is where most "it works for me but not for Copilot" problems originate. GitHub's tools for Actions-based sessions:

- **\`.github/workflows/copilot-setup-steps.yml\`** with a single job named exactly \`copilot-setup-steps\`. Only \`steps\`, \`permissions\`, \`runs-on\`, \`services\`, \`snapshot\` and \`timeout-minutes\` (max 59) are honoured. It must exist on the default branch, runs before the agent starts, and if a step fails the remaining steps are skipped and the agent proceeds with whatever state exists. Copilot code review reuses it unless you add a dedicated \`copilot-code-review.yml\`.
- **Runners**: \`runs-on\` can select larger GitHub-hosted runners or ARC-managed ephemeral self-hosted runners (Ubuntu x64 or Windows x64 only). Self-hosted runners require disabling the integrated firewall and allowing the Copilot API hosts in your own network controls; organisation owners can set a default runner type and whether repositories may override it.
- **Agents secrets and variables** at repository or organisation level (**Settings > Secrets and variables > Agents**), exposed as environment variables; \`COPILOT_MCP_\` ones only to MCP servers; values are masked in logs. In cloud sandboxes only secrets, not variables, are available.
- **The firewall** (**Settings > Copilot > Internet access**): enabled by default with a recommended allowlist of package registries, container registries and certificate authorities; add domains or URL prefixes to a custom allowlist; organisation settings can lock repository choices. Blocked requests surface as warnings in the pull request. Private networks reach the agent through larger runners with Azure private networking or self-hosted runners, with a proxy via \`https_proxy\` variables if needed.
- **Windows**: set \`runs-on: windows-latest\`; Playwright and some defaults differ.

Cloud sandboxes honour repository and organisation firewall allowlists but ignore setup steps, custom compute and self-hosted runners, so pick the environment that matches the constraint rather than fighting the one you have.`,
    },
  ],
  examples: [
    {
      title: 'A copilot-setup-steps.yml for a service with a private registry and Postgres',
      description:
        'The job is named copilot-setup-steps, requests only contents: read, installs Node from a private registry using an Agents secret exposed as an environment variable, and starts a Postgres service container so the agent can run API tests. The workflow also runs on its own changes so the team can validate it in a pull request.',
      language: 'yaml',
      code: `name: "Copilot Setup Steps"
on:
  workflow_dispatch:
  pull_request:
    paths: [".github/workflows/copilot-setup-steps.yml"]
jobs:
  copilot-setup-steps:
    runs-on: ubuntu-4-core
    timeout-minutes: 20
    permissions:
      contents: read
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports: ["5432:5432"]
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v7
        with:
          node-version: "22"
          registry-url: "https://npm.pkg.github.com"
      - run: npm ci
        env:
          NODE_AUTH_TOKEN: \${{ secrets.PRIVATE_NPM_TOKEN }}`,
      takeaway: 'Deterministic setup steps replace trial-and-error dependency discovery; keep permissions minimal because the agent gets its own token.',
    },
    {
      title: 'An agentic workflow invoked from CI with scoped write access',
      description:
        'Instead of calling Copilot CLI directly in a run step, the team compiles a GitHub Agentic Workflow. It triggers on pull requests, reads with the default GitHub toolset, and can only post a comment. Compile with gh aw compile and commit both the .md and the generated .lock.yml.',
      language: 'markdown',
      code: `---
on:
  pull_request:
    types: [opened, synchronize]
permissions:
  contents: read
  pull-requests: read
  copilot-requests: write
network: defaults
tools:
  github:
    toolsets: [default]
safe-outputs:
  add-comment:
    max: 1
---
# Migration safety check
Inspect the changed files. If any file under db/migrations/ drops a column or
table, post one comment listing the affected migration files and the
rollback steps required. Otherwise post nothing.`,
      takeaway: 'Agentic workflows run read-only by default and confine writes to declared safe outputs, which is why GitHub recommends them over raw CLI steps.',
    },
    {
      title: 'The ruleset mistake and the fix',
      description:
        'A team assigns issues to Copilot, sees the 👀 reaction and session logs, but no pull request ever appears. The repository ruleset blocks branch creation from non-approved actors and requires signed commits, which the agent satisfies, but it also restricts who may create pull requests. The fix is to add Copilot to the ruleset bypass list with "For pull requests only", keeping branch protection intact while letting the agent open its draft pull request, and to leave the additional-approval rule for non-person pull requests enabled.',
      takeaway: 'Rulesets apply to the agent like any actor; grant the narrowest bypass that lets work flow through a pull request.',
    },
  ],
  keyPoints: [
    'Evaluate the environment by credentials, network reach, persistence and visibility: IDE/CLI (user permissions), local sandbox, cloud sandbox (cross-repo, resumable, no setup steps), GitHub Actions (one repo, 59 minutes, setup steps, runners, Agents secrets), custom environment.',
    'Repository scope is layered: enterprise block policy, organisation Copilot in the cloud policy and Repository access, repository-level settings; custom agents are repository- or organisation-scoped and the lowest level wins on name conflicts.',
    'The cloud agent works on one branch per task (a copilot/ branch or the PR branch), opens one draft pull request, and is subject to rulesets; grant a "pull requests only" bypass if a ruleset blocks it.',
    'Invoke agents from CI with GitHub Agentic Workflows (recommended: read-only tokens, safe outputs, threat detection), Copilot CLI steps (copilot-requests: write, GITHUB_TOKEN, explicit allow rules), or automations.',
    'copilot-setup-steps.yml needs a job named copilot-setup-steps on the default branch; only steps, permissions, runs-on, services, snapshot and timeout-minutes (max 59) are honoured; a failing step is skipped, not fatal.',
    'Agents secrets and variables (Settings > Secrets and variables > Agents) are the only secrets passed to the agent; COPILOT_MCP_ values go only to MCP servers; cloud sandboxes receive secrets but not variables.',
    'The firewall is on by default with a recommended allowlist; add domains or URL prefixes for private registries; self-hosted runners require disabling it and using your own network controls.',
  ],
  flashcards: [
    { front: 'What is the maximum duration of a cloud agent session on GitHub Actions?', back: '59 minutes; the limit cannot be extended.' },
    { front: 'Which environment supports copilot-setup-steps.yml, self-hosted runners and Agents variables?', back: 'GitHub Actions-based sessions; cloud sandboxes do not support them.' },
    { front: 'What must the job in copilot-setup-steps.yml be called?', back: 'copilot-setup-steps; the file must be on the default branch to take effect.' },
    { front: 'Which workflow keys are honoured in the copilot-setup-steps job?', back: 'steps, permissions, runs-on, services, snapshot and timeout-minutes (maximum 59).' },
    { front: 'Which secrets does the cloud agent receive in its environment?', back: 'Only Agents secrets and variables; Actions, Codespaces and Dependabot secrets are not passed.' },
    { front: 'How does an organisation limit the cloud agent to selected repositories?', back: 'Settings > Copilot > Cloud > Repository access: Selected repositories (automations can be allowed or blocked separately).' },
    { front: 'What branch does the cloud agent push to for a new task?', back: 'A new copilot/ branch; when mentioned on an existing pull request it pushes to that PR branch. One branch and one PR per task.' },
    { front: 'Which Actions permission lets a workflow make Copilot requests with GITHUB_TOKEN?', back: 'copilot-requests: write, with the organisation policy "Allow use of Copilot CLI billed to the organization" enabled.' },
    { front: 'How do you convert an agentic workflow Markdown file into a runnable workflow?', back: 'Run gh aw compile to generate the .lock.yml, then commit both files to the default branch.' },
    { front: 'What does GitHub recommend when a ruleset prevents Copilot from opening pull requests?', back: 'Grant Copilot a ruleset bypass, preferably "For pull requests only".' },
    { front: 'Which runner operating systems does the cloud agent support?', back: 'Ubuntu x64 Linux and Windows 64-bit; macOS is not supported.' },
  ],
  quiz: [
    {
      question:
        'A team needs the cloud agent to run integration tests that require a private package registry and a database. Which environment and configuration should you choose?',
      options: [
        'A cloud sandbox session, because it resumes across clients.',
        'A GitHub Actions-based session with a copilot-setup-steps.yml that installs dependencies, defines a database service, and a firewall allowlist entry for the registry.',
        'Local agent mode on each developer\'s laptop.',
        'A GitHub Actions-based session with the firewall disabled and no setup steps.',
      ],
      correct: [1],
      explanation:
        'Setup steps, services and allowlists are Actions-session features. Cloud sandboxes ignore setup steps, local mode is not the delegated environment, and disabling the firewall is unnecessary and risky.',
    },
    {
      question:
        'An organisation wants Copilot cloud agent available in only three repositories. Where is this configured?',
      options: [
        'In each repository\'s copilot-instructions.md.',
        'Organisation Settings > Copilot > Cloud > Repository access > Selected repositories.',
        'In the enterprise MCP registry URL.',
        'In the repository firewall custom allowlist.',
      ],
      correct: [1],
      explanation:
        'Repository access under the organisation\'s Cloud settings scopes the agent. Instructions, registries and firewall lists do not control availability.',
    },
    {
      question:
        'You want an agent to run on every pull request in CI and post a single review comment, with the least risk from prompt injection. Which approach does GitHub recommend?',
      options: [
        'A GitHub Agentic Workflow with read permissions and an add-comment safe output, compiled with gh aw compile.',
        'A run step that installs Copilot CLI and runs it with --allow-all.',
        'Assigning every pull request to Copilot as an issue.',
        'A personal access token stored in the workflow file.',
      ],
      correct: [0],
      explanation:
        'Agentic workflows provide read-only defaults, safe outputs and threat detection. Allow-all removes controls, issue assignment is not a CI trigger, and tokens in workflow files are insecure.',
    },
    {
      question:
        'Which TWO statements about the cloud agent\'s branch and pull request behaviour are correct? (Select two)',
      options: [
        'For a new task it creates a copilot/ branch and opens a draft pull request.',
        'It can work on several branches and open multiple pull requests in one task.',
        'Rulesets can block it from creating pull requests unless a bypass is granted.',
        'It pushes directly to the default branch when tests pass.',
      ],
      correct: [0, 2],
      explanation:
        'One branch and one draft pull request per task is the model, and rulesets apply to the agent. It never pushes to the default branch and cannot work on several branches in one task.',
    },
    {
      question:
        'A setup step in copilot-setup-steps.yml fails with a non-zero exit code. What happens?',
      options: [
        'The agent session is cancelled.',
        'Remaining setup steps are skipped and the agent starts with the current environment state.',
        'The agent retries the step up to three times.',
        'The pull request is closed automatically.',
      ],
      correct: [1],
      explanation:
        'GitHub documents that a failing step causes the remaining steps to be skipped while the agent proceeds. There is no automatic retry or cancellation.',
    },
    {
      question:
        'Developers report the cloud agent cannot reach an internal artifact server at artifacts.contoso.corp. The repository runs on GitHub-hosted runners. What is the MOST appropriate fix?',
      options: [
        'Add artifacts.contoso.corp (or an https URL prefix) to the repository or organisation custom firewall allowlist, and use larger runners with Azure private networking if the host is only reachable privately.',
        'Disable the firewall for the organisation.',
        'Paste the artifact server credentials into the issue body.',
        'Switch the session to a cloud sandbox.',
      ],
      correct: [0],
      explanation:
        'Targeted allowlist entries keep protection in place; private hosts need private networking or self-hosted runners. Disabling the firewall increases exfiltration risk, credentials belong in Agents secrets, and sandboxes do not support custom networking.',
    },
  ],
  statements: [
    { text: 'Cloud sandbox sessions can make changes across multiple repositories in one organisation.', isTrue: true, explanation: 'Actions-based sessions are limited to one repository; cloud sandboxes can span repositories.' },
    { text: 'The cloud agent can read GitHub Actions secrets configured for the repository.', isTrue: false, explanation: 'Only Agents secrets and variables are passed to the agent.' },
    { text: 'copilot-setup-steps.yml only takes effect once it is present on the default branch.', isTrue: true, explanation: 'The workflow is not used until merged to the default branch.' },
    { text: 'Self-hosted runners work with the integrated agent firewall enabled.', isTrue: false, explanation: 'The firewall is incompatible with self-hosted runners and must be disabled, with network controls applied on the runner.' },
    { text: 'Assigning an issue to Copilot runs the session in a cloud sandbox by default.', isTrue: false, explanation: 'Issue assignment and @copilot mentions currently run on GitHub Actions.' },
    { text: 'GitHub Agentic Workflows keep secrets out of the agent runtime by using isolated downstream jobs for write actions.', isTrue: true, explanation: 'This is one of the documented security guardrails alongside safe outputs and threat detection.' },
    { text: 'Agents variables are available to the agent in cloud sandbox sessions.', isTrue: false, explanation: 'In cloud sandboxes only Agents secrets are available; variables apply to Actions-based sessions.' },
  ],
  resources: [
    { label: 'Configure the development environment for agents on GitHub Actions', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment' },
    { label: 'Customizing or disabling the firewall for GitHub Copilot', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall' },
    { label: 'Using Copilot CLI in GitHub Actions with GITHUB_TOKEN', url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions' },
    { label: 'GitHub Agentic Workflows', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/about-github-agentic-workflows' },
  ],
};
