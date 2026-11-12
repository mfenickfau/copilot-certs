import type { Concept } from '../../types';

export const guardrailsAndHumanInTheLoop: Concept = {
  id: 'guardrails-and-human-in-the-loop',
  title: 'Layered Guardrails and Human-in-the-Loop Workflows',
  summary:
    'How to identify the subset of agent actions that need human judgment, block actions that violate security, compliance or Responsible AI policy, scope permissions and execution contexts for least privilege, require explicit authorisation for irreversible changes, and strip out approvals that do not reduce risk, using GitHub\'s layered controls: policies, rulesets, tool scoping, firewall, sandboxes, hooks and review gates.',
  certs: ['gh-600', 'gh-700'],
  domains: ['gh-600-6', 'gh-700-4', 'gh-700-2'],
  outcomes: ['gh-600-6-1-1', 'gh-600-6-2-1', 'gh-600-6-2-2', 'gh-600-6-2-3', 'gh-600-6-2-4', 'gh-600-6-2-5', 'gh-700-4-1-1', 'gh-700-2-3-3'],
  tags: ['guardrails', 'human-in-the-loop', 'least-privilege', 'policies', 'rulesets', 'firewall', 'hooks', 'responsible-ai'],
  difficulty: 'advanced',
  diagram: 'layered-guardrails',
  sections: [
    {
      heading: 'Which actions need human judgment',
      body: `Not every action deserves a human. The exam wants you to isolate the subset where judgment changes the outcome, using the same risk classification you apply to autonomy levels (operational, security, compliance):

- **Irreversible or hard to reverse**: merging to protected branches, deployments, deleting branches or data, publishing packages, changing access controls, applying database migrations.
- **Compliance-sensitive**: changes to audited code paths, security configuration, workflow files (which run with privileges), licence or legal text, anything regulated.
- **Security-sensitive**: granting new network access, widening credentials, adding or changing MCP servers, running workflows on unreviewed agent code (because workflows can reach secrets).
- **Ambiguous intent**: when the agent's own confidence is low, when requirements conflict, when the plan deviates from what was agreed.
- **Responsible AI concerns**: outputs that affect people (triage decisions assigning or closing community issues, user-facing text), where GitHub's application cards stress human oversight and review.

Everything else, reading, searching, testing, editing on the agent's own branch, opening draft pull requests, applying high-confidence routine labels, should not wait for a human. GitHub bakes this split into defaults: the cloud agent works freely in its ephemeral branch but cannot merge, approve or run workflows without a person; automations hold low-confidence changes and let you request "suggest" for sensitive ones; Copilot CLI prompts for destructive commands and URL access but allows read-only operations automatically.`,
    },
    {
      heading: 'Blocking policy violations and scoping for least privilege',
      body: `Guardrails work in layers so that no single control is load-bearing. From the outside in:

1. **Enterprise and organisation policies** decide what exists: *Copilot in the cloud*, *MCP servers in Copilot*, *Copilot Memory*, Copilot CLI and its organisation billing, code review, third-party agents and agent apps; enterprise-wide blocks (block the cloud agent or code review in all enterprise repositories) that apply regardless of who licenses the user. Enterprise **managed settings** push client configuration users cannot override: MCP allow and deny lists, disabling the unconditional-approval mode (\`permissions.disableBypassPermissionsMode\`), requiring sandboxing, OpenTelemetry configuration, enterprise ask and deny rules for shell commands, file reads and writes and URLs.
2. **Repository access and settings**: organisation *Repository access* for the cloud agent and *Allow automations*; repository toggles for validation tools and *Require approval for workflow runs*; content exclusions so agents never see certain files; Copilot Memory repository access controls.
3. **Execution context**: ephemeral environments, the agent firewall with its recommended allowlist and custom domain or URL rules, local and cloud sandboxes that constrain filesystem, network and credentials, ephemeral single-use self-hosted runners, Agents secrets scoped to repositories.
4. **Identity and credentials**: the agent's token can push only to its branch and cannot run arbitrary git; the GitHub MCP token is read-only and repository-scoped; MCP secrets are \`COPILOT_MCP_\`-prefixed and reach only servers; service accounts rather than personal tokens for repository MCP servers; \`GITHUB_TOKEN\` with \`copilot-requests: write\` instead of PATs in Actions.
5. **Tools**: custom agent \`tools\` lists, repository MCP \`tools\` arrays, automation tool selection and *Only this issue*, agentic workflow \`permissions\` (read-only default) and \`safe-outputs\`, CLI allow/deny patterns.
6. **Hooks**: \`preToolUse\` deny rules for forbidden commands, paths or tools, fail-closed; policy hooks installed by administrators that users cannot disable.
7. **Review and merge gates**: rulesets with required reviews, required status checks, CODEOWNERS, the rule requiring an additional approval for pull requests not attributed to a person, no self-approval by the requester, workflow approval before CI runs on agent code.

**Least privilege** is the thread through all layers: grant the narrowest scope at each layer that still lets the task complete, and prefer removing a capability over instructing the agent not to use it.`,
    },
    {
      heading: 'Explicit authorisation for irreversible or compliance-sensitive changes',
      body: `For the subset identified above, design a **controlled path** so the change can only happen through an explicit, recorded authorisation:

- **Pull-request-only paths.** Rulesets block direct pushes; if Copilot needs a bypass, grant it *for pull requests only*, which still forces a reviewable pull request and an audit trail. Required reviews, CODEOWNERS for protected directories (\`.github/workflows/\`, \`infra/\`, \`db/migrations/\`) and required status checks make the authorisation explicit.
- **Environment protection for deployments.** GitHub Actions environments with required reviewers mean an agent can prepare a release but a human must approve the deployment job; the agent never holds the deploy credential.
- **Workflow approval.** Keep *Require approval for workflow runs* on so agent code cannot execute privileged workflows until a person with write access has looked at it, especially changes under \`.github/workflows/\`.
- **Suggest instead of apply.** Ask automations to suggest compliance-relevant issue changes (closing, reassigning) regardless of confidence; use *Full control* where every change must be reviewed; in agentic workflows, route writes through safe outputs with \`issue-intent: true\` so rationale is mandatory.
- **Hooks as hard gates.** A \`preToolUse\` hook can deny \`execute\` of migration or deployment commands unless an approval marker set by a controlled step exists; command hooks fail closed, so an outage of the gate blocks rather than allows.
- **Two-person rules for agents.** Because the requester cannot approve a Copilot pull request and non-person pull requests can require an extra approval, a human-initiated agent change to a protected path inherits a two-person review automatically.
- **Local safety for destructive commands.** In the CLI, keep manual approval or assisted permissions for destructive shell commands; administrators can disable \`--allow-all\` entirely.

Authorisation must be visible afterwards: approvals on the pull request, environment approval records, audit log events and hook logs are the evidence that the controlled path was followed.`,
    },
    {
      heading: 'Preserving velocity: approvals that do not reduce risk',
      body: `The last outcome in this group is the counterweight: every approval that does not materially reduce risk is pure delay and trains people to rubber-stamp. GitHub's own designs point to where approvals can go:

| Keep (reduces risk) | Remove or automate (does not) |
|---|---|
| Workflow approval on agent pushes | Approving each read, search or test run |
| Required review and merge by a human | A second human sign-off on documentation-only or test-only pull requests already covered by code review and CI |
| Plan approval for protected paths | Plan approval for one-line fixes with a failing test |
| Environment required reviewers for production deploys | Manual re-running of tests the agent already ran and CI will run again |
| Holding low-confidence triage changes | Holding high-confidence routine labels (*Balanced* or *Full automation* for low-stakes repositories) |
| Manual approval of destructive shell commands | Manual approval of read-only commands (assisted permissions, saved per-location approvals) |

Techniques: use **assisted permissions** rather than manual approval for everyday CLI work; save approvals per repository in \`permissions-config.json\`; let **Agent Merge** fix failing checks and conflicts so a human reviews once; enable **automatic Copilot code review** so the human reviewer starts from findings; choose the **automation level** per repository rather than one strict setting everywhere; scope **CODEOWNERS** to genuinely sensitive paths rather than the whole tree; and measure wait time (time to merge for agent pull requests appears in Copilot usage metrics) to find approvals that add delay without catching anything.

The exam framing: "preserve execution velocity" answers are those that remove ceremony while leaving the enforcing controls (branch isolation, rulesets, workflow approval, firewall, least-privilege tools) in place. Answers that remove enforcing controls to save time, or add approvals that cannot change an outcome, are wrong.`,
    },
  ],
  examples: [
    {
      title: 'A layered guardrail set for a production service repository',
      description:
        'The platform team documents the controls at each layer for a repository where the cloud agent is enabled. No layer depends on the agent following instructions; each is enforced by GitHub or by code.',
      language: 'yaml',
      code: `# Guardrail map (documented in docs/agent-guardrails.md)
policies:
  org: Copilot in the cloud = Enabled; Repository access = Selected (this repo)
  org: MCP servers in Copilot = Enabled; allowlist via managed-settings.json
repository:
  validation_tools: CodeQL, secret scanning, dependency check, code review = on
  require_approval_for_workflow_runs: true
  firewall: enabled + recommended allowlist + packages.contoso.corp
tools:
  custom_agents: executor (read, search, edit, execute); planner (read, search)
  repo_mcp: sentry -> [get_issue_details, search_issues]
hooks:
  preToolUse: deny edit under .github/workflows/**, db/migrations/** without .plan-approved
rulesets:
  main: require 2 approvals, require status checks [tests, codeql, dependency-review],
        additional approval for non-person PRs, Copilot bypass = pull requests only
  codeowners: .github/workflows/** @contoso/platform ; db/migrations/** @contoso/data
deploy:
  environment production: required reviewers @contoso/release-managers`,
      takeaway: 'Layers from policy to merge gate each enforce something; losing any one layer still leaves the others.',
    },
    {
      title: 'A preToolUse hook that blocks a destructive command class',
      description:
        'The repository hook denies shell commands that drop database objects or force-push, regardless of what the agent was asked. Because preToolUse command hooks are fail-closed, a crash in the check denies the command rather than letting it through. In the cloud agent the hook runs as bash in the sandbox.',
      language: 'json',
      code: `{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": "input=$(cat); tool=$(echo \\"$input\\" | jq -r .toolName); cmd=$(echo \\"$input\\" | jq -r '.toolArgs.command // empty'); if [ \\"$tool\\" = \\"bash\\" ] && echo \\"$cmd\\" | grep -Eiq 'drop (table|database)|git push --force|rm -rf /'; then echo '{\\"permissionDecision\\":\\"deny\\",\\"permissionDecisionReason\\":\\"Destructive command blocked by policy; open an issue for a human to run it.\\"}'; else echo '{\\"permissionDecision\\":\\"allow\\"}'; fi",
        "timeoutSec": 10
      }
    ]
  }
}`,
      takeaway: 'Hooks turn a policy into code that runs before the tool, with a reason the agent can act on by escalating.',
    },
    {
      title: 'The over-approval mistake and the fix',
      description:
        'A compliance lead requires that every cloud agent pull request, including documentation and test-only changes, receive two senior approvals plus a manual re-run of the test suite, and sets every automation to Full control. Within a month the review queue is days long, seniors approve in bulk, and a real security regression slips through because it looked like the other forty items. The fix is risk-proportionate: two approvals and CODEOWNERS only on protected paths, one approval plus automatic Copilot code review and required CI checks elsewhere, Balanced automation level for low-stakes triage with "suggest" for closures, and a monthly review of time-to-merge against defects caught.',
      takeaway: 'Approvals are a finite attention budget; spend it where judgment changes outcomes.',
    },
  ],
  keyPoints: [
    'Human judgment belongs on irreversible, compliance-sensitive, security-sensitive, ambiguous or people-affecting actions; reads, tests, branch edits and draft PRs should not wait for a human.',
    'Guardrails are layered: policies and managed settings, repository access and settings, execution context (firewall, sandboxes, runners), identity and credentials, tools, hooks, review and merge gates.',
    'Least privilege at every layer: narrow tokens (branch-only push, read-only repository-scoped GitHub MCP), COPILOT_MCP_ secrets, service accounts, minimal tools lists, read-only defaults in agentic workflows.',
    'Controlled paths for irreversible changes: pull-request-only bypasses, CODEOWNERS and required checks, environment required reviewers, workflow approval, suggest-not-apply, fail-closed preToolUse hooks, extra approval for non-person PRs and no self-approval.',
    'Managed settings can disable unconditional approval (--allow-all), require sandboxing and impose deny rules users cannot override; policy hooks cannot be disabled by users.',
    'Preserve velocity by removing approvals that cannot change outcomes: assisted permissions, saved per-location approvals, Agent Merge, automatic code review, automation levels per repository, scoped CODEOWNERS.',
    'Never trade an enforcing control for speed; trade ceremony for speed.',
  ],
  flashcards: [
    { front: 'Name four categories of agent action that should require human judgment.', back: 'Irreversible changes (merge, deploy, delete), compliance-sensitive paths, security-sensitive changes (credentials, network, MCP, workflows), and ambiguous or low-confidence decisions (plus people-affecting outputs).' },
    { front: 'How can a ruleset let Copilot work while still forcing changes through review?', back: 'Grant Copilot a bypass "For pull requests only", so it must open a pull request that reviews and checks still gate.' },
    { front: 'Which managed setting disables the unconditional approval (--allow-all / --yolo) mode in the CLI?', back: 'permissions.disableBypassPermissionsMode: "disable" (assisted permissions can be disabled separately).' },
    { front: 'What ruleset behaviour adds a second approval to Copilot-authored pull requests?', back: 'Requiring an additional approval for pull requests not attributed to a person, enabled by default in rulesets when at least one approval is already required.' },
    { front: 'How do you make a deployment require explicit human authorisation even if an agent prepared it?', back: 'Use a GitHub Actions environment with required reviewers; the agent never holds the deploy credential.' },
    { front: 'What is the difference between a controlled path and an instruction?', back: 'A controlled path is enforced by GitHub or code (rulesets, hooks, environments); an instruction is advisory and may not be followed.' },
    { front: 'Which hook mechanism lets enterprise IT impose guardrails users cannot disable?', back: 'Policy hooks in the platform policy directory (CLI only), loaded before all other hooks and immune to disableAllHooks.' },
    { front: 'Give three examples of approvals that do not materially reduce risk.', back: 'Approving read-only commands, a second sign-off on docs-only PRs already covered by code review and CI, and manually re-running tests CI will run.' },
    { front: 'What is assisted permissions and why does it preserve velocity?', back: 'A model reviews permission requests and auto-approves safe ones while prompting for the rest, reducing prompts without granting blanket permission.' },
    { front: 'Which Copilot usage metric helps find approvals that only add delay?', back: 'Time to merge for agent pull requests (alongside PR creation and merge counts).' },
  ],
  quiz: [
    {
      question:
        'A regulated repository must ensure no agent can apply a database migration without explicit human authorisation, even if an issue instructs it to. Which combination provides a controlled path?',
      options: [
        'An instruction in copilot-instructions.md saying migrations need approval.',
        'CODEOWNERS on db/migrations/** with required reviews, a preToolUse hook denying migration commands without an approval marker, and workflow approval before CI runs on agent code.',
        'Running the agent with --allow-all so it completes quickly for review.',
        'Disabling the firewall so the agent can reach the database.',
      ],
      correct: [1],
      explanation:
        'Enforced gates (reviews, hooks, workflow approval) create a controlled path; instructions are advisory, allow-all removes controls, and the firewall is unrelated to authorisation.',
    },
    {
      question:
        'An enterprise wants to prevent developers from using the unconditional approval mode in Copilot CLI while still allowing assisted permissions. What should it configure?',
      options: [
        'Disable the Copilot CLI policy entirely.',
        'Set permissions.disableBypassPermissionsMode to "disable" in enterprise managed settings.',
        'Set permissions.disableAssistedPermissionsMode to true.',
        'Add --yolo to a denylist in the repository firewall.',
      ],
      correct: [1],
      explanation:
        'That managed setting removes unconditional approval without disabling assisted permissions. Disabling the CLI blocks all use, the assisted setting disables the wrong mode, and the firewall controls hosts, not CLI flags.',
    },
    {
      question:
        'Which TWO changes preserve delivery velocity WITHOUT weakening enforcing controls? (Select two)',
      options: [
        'Enable assisted permissions for everyday CLI work instead of manual approval of read-only commands.',
        'Enable Agent Merge and automatic Copilot code review so humans review agent pull requests once with findings in hand.',
        'Disable Require approval for workflow runs on agent pushes.',
        'Remove required status checks from the main branch ruleset.',
      ],
      correct: [0, 1],
      explanation:
        'Assisted permissions and automated fixing/review remove ceremony. Disabling workflow approval exposes secrets to unreviewed code, and removing required checks removes an enforcing gate.',
    },
    {
      question:
        'Which action is LEAST likely to need human judgment before it happens?',
      options: [
        'Merging an agent pull request into the protected main branch.',
        'Adding a new MCP server with write tools to repository settings.',
        'Running the existing test suite on the agent\'s own copilot/ branch.',
        'Closing a community-reported issue based on low-confidence triage.',
      ],
      correct: [2],
      explanation:
        'Running tests on the agent\'s branch is reversible and low risk. Merging, widening tool access and closing issues affect others or are hard to reverse.',
    },
    {
      question:
        'A team grants Copilot a ruleset bypass so it can work on a protected branch. Which bypass configuration keeps changes reviewable?',
      options: [
        'Always allow, so the agent can push directly.',
        'For pull requests only, so the agent must open a pull request that reviews and checks still gate.',
        'Add Copilot as a repository administrator.',
        'Disable the ruleset while agents are active.',
      ],
      correct: [1],
      explanation:
        'Pull-requests-only bypass preserves the review trail. Always-allow, admin rights and disabling rules remove the gate.',
    },
    {
      question:
        'An organisation uses Full control automation level everywhere and requires two senior approvals on every agent pull request. Review queues are days long and approvers rubber-stamp. What is the MOST appropriate change?',
      options: [
        'Add a third approver to catch what the first two miss.',
        'Apply controls proportionate to risk: two approvals and CODEOWNERS only on protected paths, one approval plus automatic code review and required checks elsewhere, and Balanced automation level for low-stakes triage.',
        'Disable all agents until the backlog clears.',
        'Allow agents to merge their own pull requests when CI passes.',
      ],
      correct: [1],
      explanation:
        'Risk-proportionate gates restore attention where it matters. More approvers deepen the problem, disabling agents loses value, and self-merge removes a core control.',
    },
  ],
  statements: [
    { text: 'Approvals that cannot change an outcome still improve safety by adding oversight.', isTrue: false, explanation: 'They add delay and train reviewers to rubber-stamp; GitHub guidance favours gating effects that matter.' },
    { text: 'Rulesets can require an additional approval for pull requests opened under Copilot\'s own identity.', isTrue: true, explanation: 'This is enabled by default when the repository already requires at least one approval.' },
    { text: 'Enterprise managed settings can require sandboxing so that ordinary settings cannot turn it off.', isTrue: true, explanation: 'If the effective policy permits bypass, a user can still disable it for the current session only.' },
    { text: 'Removing a tool from an agent is a weaker guardrail than telling the agent not to use it.', isTrue: false, explanation: 'Capability removal is enforced; instructions are advisory.' },
    { text: 'GitHub Actions environments with required reviewers let a human authorise a deployment an agent prepared.', isTrue: true, explanation: 'The agent never needs the deploy credential; the environment gate records the approval.' },
    { text: 'Policy hooks installed by administrators can be disabled by a developer with disableAllHooks.', isTrue: false, explanation: 'Policy hooks load before all others and cannot be disabled by disableAllHooks.' },
    { text: 'The agent firewall is a complete security boundary for all processes in the agent environment.', isTrue: false, explanation: 'It covers processes started through the agent\'s shell (and Playwright in sandboxes) but not other MCP servers, and GitHub notes it can be bypassed by sophisticated attacks.' },
  ],
  resources: [
    { label: 'GitHub Copilot policies for enterprises and organizations', url: 'https://docs.github.com/en/copilot/concepts/enterprise/policies' },
    { label: 'Allowing safe commands to run without manual approval (assisted permissions)', url: 'https://docs.github.com/en/copilot/concepts/customizations/allowing-safe-commands' },
    { label: 'Creating rulesets for a repository', url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository' },
    { label: 'Hooks for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/customizations/hooks' },
  ],
};
