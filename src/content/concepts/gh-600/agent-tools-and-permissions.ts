import type { Concept } from '../../types';

export const agentToolsAndPermissions: Concept = {
  id: 'agent-tools-and-permissions',
  title: 'Selecting, Configuring and Permissioning Agent Tools',
  summary:
    'How to work out which tools an agent actually needs, how to configure them in custom agent profiles, Copilot CLI and automations, and how to permission them with tool allowlists, deny rules, read-only MCP tools and hooks so that an agent can do its job and nothing more.',
  certs: ['gh-600', 'gh-700'],
  domains: ['gh-600-2', 'gh-700-3'],
  outcomes: ['gh-600-2-1-1', 'gh-600-2-1-2', 'gh-600-2-1-3', 'gh-700-3-3-3'],
  tags: ['tools', 'custom-agents', 'copilot-cli', 'permissions', 'least-privilege', 'tool-use'],
  difficulty: 'intermediate',
  diagram: 'tool-use-sequence',
  sections: [
    {
      heading: 'Identifying the tools a task needs',
      body: `A tool is a capability the model can call: read a file, run a shell command, edit, search, fetch a URL, delegate to a subagent, or invoke a function exposed by an MCP server. Each tool call follows the same sequence: the model emits a structured request, the host (Copilot CLI, the cloud agent runtime, the IDE) checks permissions and policy, executes the tool, and returns the result into the context window.

Start from the task's outputs and work backwards. A test-writing agent needs \`read\`, \`search\`, \`edit\` and \`execute\` (to run the tests); it does not need \`web\` or the ability to create issues. An issue-triage automation needs the GitHub tools for labels, types, fields and assignees, and nothing that pushes code. A planner needs \`read\` and \`search\` only. Three questions help:

1. **What must the agent observe?** Files, search, issue or pull request context (GitHub MCP read tools), external systems (an MCP server for Sentry or Jira).
2. **What must the agent change?** Files on its branch, issue metadata, a pull request. Each is a separate tool and should be granted separately.
3. **What must the agent run?** Tests, linters, build commands. Shell access is the broadest tool; constrain it by command pattern where the surface allows.

Copilot's surfaces ship with different defaults. The cloud agent has the GitHub MCP server (read-only tools, token scoped to the repository) and Playwright (localhost only) enabled by default. Copilot CLI has the GitHub MCP server built in and includes built-in subagents (explore, task, general-purpose, code-review, research, rubber-duck, security-review). Tool search in the CLI lets the model discover tools lazily so large toolsets do not bloat context.`,
    },
    {
      heading: 'Configuring tools in agent profiles, the CLI and automations',
      body: `**Custom agent profiles** (\`.github/agents/NAME.agent.md\`) carry a \`tools\` property in their YAML frontmatter. Omit it (or use \`["*"]\`) for all tools, \`[]\` for none, or list aliases such as \`read\`, \`edit\`, \`search\`, \`execute\`, \`agent\`, \`web\`, \`todo\`. MCP tools are referenced as \`server/tool\` or \`server/*\` (\`github/*\`, \`playwright/*\`, \`my-mcp/list_issues\`). Unrecognised names are ignored, which lets one profile serve several surfaces. A profile can also declare its own \`mcp-servers\` (cloud agent only), and the processing order is default servers, then the agent profile, then repository settings, with later levels able to override earlier ones.

**Copilot CLI** has two layers at start-up. \`--available-tools\` and \`--excluded-tools\` control which tools the *model even sees*; \`--allow-tool\` and \`--deny-tool\` control which of those run *without prompting*. Patterns are precise: \`shell(git:*)\` allows all git subcommands, \`shell(git push)\` names one, \`write(.github/copilot-instructions.md)\` allows writing one file, \`My MCP(create_issue)\` names an MCP tool. Deny always beats allow, even with \`--allow-all\`. Interactive approvals can be remembered per location in \`permissions-config.json\`.

**Automations** on GitHub.com select tools in the form: GitHub tools (push changes, update labels, create a pull request) plus tools from MCP servers configured for the repository. Only the selected tools are available to the run, and the *Configured tools can change* setting narrows writes to "Only this issue" or "Anything in this repository". GitHub Agentic Workflows take the same stance declaratively: \`tools:\` and \`safe-outputs:\` in frontmatter define what the agent may read and which write operations are allowed.

**IDEs** expose a tool picker per chat session and support toolsets (named groups of tools) in VS Code; custom agent files there can also list tools, and \`runSubagent\` must be enabled for delegation.`,
    },
    {
      heading: 'Permissioning tools: least privilege in practice',
      body: `Tool permission is where prompt injection and honest mistakes are contained. The rules the exam expects:

- **Allowlist specific tools, prefer read-only.** In repository MCP configuration the \`tools\` array is required; GitHub strongly recommends listing specific read-only tools because the agent uses them autonomously without asking. Copilot code review goes further and only uses MCP tools annotated \`readOnlyHint: true\`.
- **Scope credentials, not just tools.** The default GitHub MCP token in the cloud agent is read-only and repository-scoped. Widening it (a PAT or GitHub App with more access) is a deliberate decision. Secrets for MCP servers come from Agents secrets prefixed \`COPILOT_MCP_\` and are only exposed to MCP servers.
- **Separate "can see" from "can use without asking".** In the CLI, hide tools the task never needs (\`--excluded-tools\`), then allow the narrow set that should run silently.
- **Deny wins.** A deny rule overrides allow rules, saved approvals and \`--allow-all\`; enterprise managed settings can add deny rules users cannot override and can disable the unconditional-approval mode.
- **Hooks as a programmable gate.** A \`preToolUse\` hook receives \`toolName\` and \`toolArgs\` and returns \`permissionDecision: allow | deny\`. It can block \`rm -rf\`, protected paths, or any MCP tool during a freeze window. Command hooks for \`preToolUse\` are fail-closed.
- **Non-interactive runs deny by default.** With \`copilot -p\` in CI, anything not pre-approved is denied rather than prompted, so the allow list *is* the permission model.
- **Review third-party servers before enabling.** Check their tools, authentication and data access; use a service account rather than personal credentials for repository-level servers.

Tool permission and autonomy mode are independent: autopilot does not widen permissions, and assisted permissions reduces prompts without granting blanket access.`,
    },
    {
      heading: 'The exam angle',
      body: `GH-600 items here are usually configuration choices:

- "An agent that writes tests should not be able to change production code." Answer: a custom agent whose prompt says so *and* whose tools exclude what it does not need; add a path-specific instruction or a hook for the hard boundary.
- "Copilot CLI in a workflow should explore and commit but never push or reach the internet." Answer: \`--available-tools='bash,edit,view,grep,glob' --allow-tool='shell(git:*)' --deny-tool='shell(git push)'\`.
- "An MCP server exposes forty tools; the agent needs two." Answer: list the two in \`tools\`, do not use \`*\`.
- "Copilot code review ignores an MCP tool." Likely cause: the tool lacks \`annotations.readOnlyHint: true\`.
- "An automation must only ever modify the issue that triggered it." Answer: *Configured tools can change: Only this issue*.

Distractors tend to rely on the prompt ("tell the agent not to push") or on broad settings (\`--allow-all\`, \`tools: ["*"]\`) where a narrow configuration exists.`,
    },
  ],
  examples: [
    {
      title: 'A tests-only custom agent with narrowed MCP tools',
      description:
        'The profile gives the agent the tools it needs to write and run tests, plus two read-only tools from the repository\'s Sentry MCP server so it can reproduce production errors. It cannot create issues, fetch arbitrary URLs or delegate to other agents.',
      language: 'markdown',
      code: `---
name: test-writer
description: Adds or repairs automated tests; never edits production code
tools: ["read", "search", "edit", "execute", "sentry/get_issue", "sentry/get_event"]
---
You write and repair tests only. Edit files under tests/** and test fixtures.
If a fix requires changing production code, stop and describe the change in
your summary instead of making it. Run the relevant test command from
.github/copilot-instructions.md before finishing and include the output.`,
      takeaway: 'Name the exact MCP tools the agent needs with server/tool syntax instead of enabling the whole server.',
    },
    {
      title: 'Copilot CLI in a workflow with layered tool controls',
      description:
        'A nightly job uses Copilot CLI to update a changelog from recent commits. The model only sees the file and shell tools, may run git read commands silently, and is denied pushing. Because the run is non-interactive, anything else is denied automatically.',
      language: 'yaml',
      code: `name: Draft changelog
on:
  schedule:
    - cron: "0 3 * * 1-5"
permissions:
  contents: read
  copilot-requests: write
jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 50
      - run: npm install -g @github/copilot
      - name: Draft CHANGELOG entry
        env:
          GITHUB_TOKEN: \${{ github.token }}
        run: |
          copilot -p "Summarise commits since the last tag into CHANGELOG.md under 'Unreleased'" \\
            --available-tools='bash,edit,view,grep,glob' \\
            --allow-tool='shell(git log:*),shell(git describe:*),write(CHANGELOG.md)' \\
            --deny-tool='shell(git push)' -s
      - uses: actions/upload-artifact@v4
        with:
          name: changelog-draft
          path: CHANGELOG.md`,
      takeaway: 'Restrict what the model can see, allow the narrow set that may run silently, and deny the dangerous command explicitly.',
    },
    {
      title: 'The wildcard-tools mistake and the fix',
      description:
        'A repository administrator adds a Jira MCP server with "tools": ["*"] so the cloud agent can read ticket details. Weeks later an issue containing injected instructions leads the agent to transition and close tickets. The fix: replace the wildcard with the two read tools actually needed, store the Jira token as an Agents secret named COPILOT_MCP_JIRA_TOKEN tied to a service account, and add a preToolUse hook that denies any jira/* tool whose name starts with "update", "transition" or "delete".',
      language: 'json',
      code: `{
  "mcpServers": {
    "jira": {
      "type": "http",
      "url": "https://jira.example.com/mcp",
      "headers": { "Authorization": "Bearer $COPILOT_MCP_JIRA_TOKEN" },
      "tools": ["get_issue", "search_issues"]
    }
  }
}`,
      takeaway: 'The tools array is the blast-radius control for MCP servers; the agent calls listed tools without asking.',
    },
  ],
  keyPoints: [
    'Derive tools from the task: what the agent must observe, change and run; grant each capability separately.',
    'Custom agent profiles use the tools frontmatter with aliases (read, edit, search, execute, agent, web, todo) and server/tool or server/* for MCP tools; omitting tools enables everything, [] disables everything.',
    'Copilot CLI separates visibility (--available-tools, --excluded-tools) from silent approval (--allow-tool, --deny-tool); deny always wins, and non-interactive runs deny anything not pre-approved.',
    'Repository MCP configuration requires a tools array; allowlist specific read-only tools because the cloud agent calls them autonomously.',
    'Copilot code review only uses MCP tools annotated readOnlyHint: true.',
    'Automations select tools per automation and can restrict writes to "Only this issue"; agentic workflows declare tools and safe-outputs in frontmatter.',
    'preToolUse hooks provide a programmable allow/deny gate and are fail-closed on error.',
    'Autopilot and assisted permissions do not widen tool permissions.',
  ],
  flashcards: [
    { front: 'What does omitting the tools property in a custom agent profile do?', back: 'Enables all available tools, including all configured MCP server tools. tools: [] disables all tools.' },
    { front: 'How do you reference one tool from an MCP server in an agent profile?', back: 'Prefix with the server name and a slash, e.g. some-mcp-server/some-tool; some-mcp-server/* enables all of its tools.' },
    { front: 'Difference between --available-tools and --allow-tool in Copilot CLI?', back: '--available-tools limits which tools the model can see at all; --allow-tool lets listed tools run without prompting.' },
    { front: 'Which rule wins when a tool matches both an allow and a deny rule?', back: 'Deny always takes precedence, even over --allow-all and saved approvals.' },
    { front: 'What happens to an unapproved tool request in a non-interactive copilot -p run?', back: 'It is denied automatically because no prompt can be shown.' },
    { front: 'Why does GitHub recommend read-only tools in repository MCP configuration?', back: 'The cloud agent uses configured MCP tools autonomously without asking for approval.' },
    { front: 'What annotation must an MCP tool carry for Copilot code review to use it?', back: 'annotations.readOnlyHint set to true in the tools/list response.' },
    { front: 'How do automations limit which GitHub resources a run may modify?', back: 'The "Configured tools can change" setting: Only this issue, or Anything in this repository.' },
    { front: 'What prefix must Agents secrets have to be visible to MCP server configuration?', back: 'COPILOT_MCP_; such secrets are exposed only to MCP servers.' },
    { front: 'Name the two default MCP servers for the cloud agent and their default scope.', back: 'GitHub (read-only tools, token scoped to the current repository) and Playwright (localhost only).' },
  ],
  quiz: [
    {
      question:
        'You are creating a custom agent that writes unit tests and must never modify production code or reach external systems. Which tools configuration is MOST appropriate?',
      options: [
        'tools: ["*"] with a prompt instruction not to change production code.',
        'tools: ["read", "search", "edit", "execute"] with instructions to edit only tests/**, plus a hook or path protection for the hard boundary.',
        'tools: [] so the agent can only reason.',
        'tools: ["web", "agent"] so it can research and delegate.',
      ],
      correct: [1],
      explanation:
        'The agent needs to read, search, edit tests and run them; web and delegation are unnecessary. A wildcard relies on the prompt alone, and an empty tool list cannot write tests.',
    },
    {
      question:
        'A nightly GitHub Actions job runs Copilot CLI non-interactively. It must read git history and edit one file but must never push. Which option set achieves this?',
      options: [
        '--allow-all',
        '--available-tools=\'bash,edit,view,grep,glob\' --allow-tool=\'shell(git log:*),write(CHANGELOG.md)\' --deny-tool=\'shell(git push)\'',
        '--excluded-tools=\'web_fetch\' --allow-tool=\'shell\'',
        'No options; add "do not push" to the prompt.',
      ],
      correct: [1],
      explanation:
        'Layered controls restrict visibility, allow narrow actions and deny pushing. --allow-all grants everything, allowing all shell commands permits pushing, and prompt text is not enforced.',
    },
    {
      question:
        'Copilot code review is configured to use a repository MCP server but never calls one of its tools. What is the MOST likely cause?',
      options: [
        'The tool is not annotated with readOnlyHint: true.',
        'The repository firewall is disabled.',
        'The MCP server uses the http transport.',
        'The tool name contains uppercase letters.',
      ],
      correct: [0],
      explanation:
        'Code review excludes tools lacking readOnlyHint: true. Firewall state, transport type and letter case do not cause exclusion.',
    },
    {
      question:
        'Which TWO practices follow GitHub guidance when adding a third-party MCP server to a repository for the cloud agent? (Select two)',
      options: [
        'Allowlist specific, preferably read-only, tools in the tools array.',
        'Store the server credential as an Agents secret prefixed COPILOT_MCP_ tied to a service account.',
        'Use tools: ["*"] so the agent is never blocked.',
        'Paste the API token into the server URL as a query parameter.',
      ],
      correct: [0, 1],
      explanation:
        'Specific read-only tools and prefixed Agents secrets are the documented approach. Wildcards maximise blast radius, and query parameters are unsupported and insecure.',
    },
    {
      question:
        'An issue-triage automation should only be able to change the issue that triggered it. Which setting enforces this?',
      options: [
        'Set Configured tools can change to Only this issue.',
        'Set the automation type to Personal.',
        'Set the automation level to Full automation.',
        'Add a comment on the issue asking Copilot to stay focused.',
      ],
      correct: [0],
      explanation:
        'The "Configured tools can change" option scopes writes. Personal/shared controls attribution and billing, automation level controls confidence routing, and comments are not controls.',
    },
  ],
  statements: [
    { text: 'In a custom agent profile, unrecognised tool names cause the agent to fail to load.', isTrue: false, explanation: 'Unrecognised names are ignored so a profile can include product-specific tools for different surfaces.' },
    { text: 'A --deny-tool rule in Copilot CLI overrides --allow-all.', isTrue: true, explanation: 'Deny rules always take precedence over allow rules and saved approvals.' },
    { text: 'The cloud agent asks for approval before using a tool from a repository-configured MCP server.', isTrue: false, explanation: 'Configured MCP tools are used autonomously, which is why GitHub recommends allowlisting read-only tools.' },
    { text: 'Enabling autopilot mode automatically grants the agent all tool permissions.', isTrue: false, explanation: 'Autopilot and tool permissions are separate controls.' },
    { text: 'The default GitHub MCP token in the cloud agent is read-only and scoped to the current repository.', isTrue: true, explanation: 'Broader access requires explicitly configuring a PAT or GitHub App.' },
    { text: 'In GitHub Agentic Workflows, write operations are declared through safe-outputs in the frontmatter.', isTrue: true, explanation: 'Workflows are read-only by default and only declared safe outputs may perform writes.' },
  ],
  resources: [
    { label: 'Custom agents configuration (tools and aliases)', url: 'https://docs.github.com/en/copilot/reference/custom-agents-configuration' },
    { label: 'Allowing and denying tool use in Copilot CLI', url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools' },
    { label: 'Configure MCP servers for your repository', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers' },
    { label: 'Creating automations with Copilot cloud agent', url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-automations' },
  ],
};
