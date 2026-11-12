import type { Concept } from '../../types';

export const mcpServersRegistriesAndAllowlists: Concept = {
  id: 'mcp-servers-registries-and-allowlists',
  title: 'MCP Servers, the GitHub Remote MCP Server, Registries and Allowlists',
  summary:
    'How Model Context Protocol servers plug tools into Copilot agents, how to add a server to the cloud agent, Copilot CLI, IDEs and custom agents, how to configure the GitHub remote MCP server (including toolsets and enterprise endpoints), and how organisations govern MCP with the policy toggle, managed-settings allowlists and private registries.',
  certs: ['gh-600', 'gh-700'],
  domains: ['gh-600-2', 'gh-700-1', 'gh-700-3'],
  outcomes: ['gh-600-2-2-1', 'gh-600-2-2-2', 'gh-600-2-2-3', 'gh-600-2-2-4', 'gh-700-1-1-11', 'gh-700-3-4-4'],
  tags: ['mcp', 'github-mcp-server', 'mcp-registry', 'allowlist', 'managed-settings', 'copilot-cloud-agent'],
  difficulty: 'intermediate',
  diagram: 'mcp-architecture',
  sections: [
    {
      heading: 'MCP in the Copilot architecture',
      body: `The Model Context Protocol is an open standard for connecting an LLM application (the *host*: Copilot CLI, the cloud agent runtime, VS Code) to *servers* that expose tools, resources and prompts. Copilot's agents consume MCP **tools**; the cloud agent and Copilot code review do not currently use MCP resources or prompts. Servers are **local** (started as a process over stdio; GitHub's JSON uses \`"type": "local"\` and maps \`stdio\` to it) or **remote** (\`http\` or \`sse\`, reached by URL with headers for authentication).

Where configuration lives depends on the surface:

| Surface | Where MCP servers are configured |
|---|---|
| Cloud agent, automations, Copilot code review | Repository **Settings > Copilot > MCP servers** (JSON); custom agent \`mcp-servers\` frontmatter; personal MCP servers for cloud sandboxes at github.com/copilot Customize |
| Copilot CLI | \`copilot mcp add\`, \`~/.copilot/mcp-config.json\`, per-repository project files, \`/mcp\` commands; GitHub MCP server built in |
| VS Code and other IDEs | \`mcp.json\` (\`servers\` object), MCP Registry view in the Extensions panel, tool picker |
| GitHub Agentic Workflows | \`tools:\` frontmatter (for example \`github: toolsets: [default]\`) plus \`mcp-servers\` |

Two defaults matter for the exam. The cloud agent starts with the **GitHub MCP server** (read-only tools, token scoped to the current repository) and **Playwright** (localhost only). Copilot **connectors** are GitHub-verified remote MCP servers with managed authentication; they work in cloud sandboxes and local clients but not in GitHub Actions-based sessions. Secrets for repository or agent MCP servers come from Agents secrets prefixed \`COPILOT_MCP_\` and are substituted with \`$NAME\`, \`\${NAME}\` or \`\${NAME:-default}\`; agent profiles additionally accept \`\${{ secrets.NAME }}\` and \`\${{ vars.NAME }}\`. Remote servers that need OAuth are not supported for repository or agent-profile configuration in the cloud agent; use key-based headers. Up to 50 servers can be configured across personal and repository levels.`,
    },
    {
      heading: 'Adding an MCP server to an agent',
      body: `**Repository level (cloud agent and code review).** A repository administrator enters JSON with an \`mcpServers\` object. Every server needs \`type\` and a \`tools\` array; local servers need \`command\` and \`args\` (optional \`env\`), remote servers need \`url\` (optional \`headers\`). The configuration is validated on save. GitHub warns that once configured, the agent uses the tools autonomously, so allowlist specific read-only tools rather than \`"*"\`. Automations can then pick from these tools; code review additionally requires \`readOnlyHint\`.

**Custom agent level.** The \`mcp-servers\` property in an agent profile is the YAML form of the same configuration and makes a server available only to that agent. Processing order is defaults, then the agent profile, then repository settings. Enterprise allowlists in \`managed-settings.json\` do **not** apply to servers defined in agent profiles; the firewall (which blocks the hosts needed to start them) is the control there.

**Copilot CLI.** \`copilot mcp add SERVER -- COMMAND ARGS\` for local servers or \`copilot mcp add --transport http SERVER URL\` for remote, with \`--env\` and \`--header\` options; the CLI also walks from your working directory up to the repository root loading project MCP files so teams can commit shared configuration. Local servers run inside the sandbox when local sandboxing is enabled; remote servers are never sandboxed.

**IDEs.** Install from the MCP Registry view (\`@mcp\` search in VS Code Extensions, backed by the GitHub MCP Registry) or write \`mcp.json\`. Trust confirmation is required before a server starts.

**Agentic workflows.** Declare servers under \`mcp-servers\` and GitHub toolsets under \`tools:\`; write actions still flow through \`safe-outputs\`.`,
    },
    {
      heading: 'The GitHub remote MCP server',
      body: `GitHub hosts a remote MCP server at \`https://api.githubcopilot.com/mcp/\`. It is the recommended option for most users because there is nothing to install and it authenticates with **OAuth** (scopes you approve at sign-in, subject to organisation app policies) or a **PAT** passed as \`Authorization: Bearer\` (PATs are disabled by default for Enterprise Managed Users). The local alternative, \`ghcr.io/github/github-mcp-server\` run with Docker, suits custom setups and is the only option for **GitHub Enterprise Server**, which does not support remote hosting. **GitHub Enterprise Cloud with data residency** uses \`https://copilot-api.SUBDOMAIN.ghe.com/mcp\`.

Tools are grouped into **toolsets** (repos, issues, pull requests, actions, code security, secret protection and more). You enable toolsets with headers such as \`X-MCP-Toolsets\` and individual tools with \`X-MCP-Tools\`; in the CLI, \`copilot mcp --toolsets=... --tools=...\`. A practical example from the security docs: the \`secret_protection\` toolset plus the \`run_secret_scanning\` tool lets an agent scan code for exposed secrets before pushing; those tools exist only on the remote server, and findings are ephemeral (not persisted as alerts). Tools inherit the access requirements of the underlying feature, so a tool that drives the cloud agent needs a paid Copilot licence.

In the cloud agent, the built-in GitHub MCP server is scoped to the source repository with read-only tools. To reach other repositories you configure a PAT or GitHub App in the repository's MCP settings and store the credential as an Agents secret; you may also need to add \`api.github.com\` to the firewall allowlist if you see a firewall warning.`,
    },
    {
      heading: 'Registries, allowlists and the MCP policy',
      body: `Governance has three layers, and the exam tests which to use when:

1. **The MCP policy.** *MCP servers in Copilot* is an enterprise or organisation policy that decides whether MCP servers can run at all for users licensed by that entity. It also governs connectors. For sessions on GitHub.com there is a related *MCP servers on GitHub.com* policy. If MCP is disabled here, nothing below matters.

2. **Allowlists and denylists in \`managed-settings.json\`** (generally available, recommended). \`allowedMcpServers\` and \`deniedMcpServers\` entries match by \`serverUrl\` (wildcards allowed, e.g. \`https://api.githubcopilot.com/*\`) or by exact \`serverCommand\` arrays. Evaluation order: built-in default servers are always allowed; deny matches block; if an allowlist exists, anything not matching is blocked; servers whose URL or command contains an unresolved variable are blocked. A malformed list is treated as an empty allowlist, blocking everything except built-ins. These lists apply to user and repository settings but not to agent-profile servers. Connectors are remote MCP servers and are matched by URL.

3. **A private MCP registry** (public preview, weaker). You host a registry that implements the v0.1 registry specification (\`GET /v0.1/servers\` and version endpoints, with CORS headers) or use Azure API Center, then set the **MCP Registry URL** and the **Restrict MCP access to registry servers** policy to *Allow all* or *Registry only* under enterprise **AI controls > MCP** or organisation **Settings > Copilot > Policies**. Enforcement matches by server name or ID only and can be bypassed by editing configuration files; *Registry only* also blocks connectors. For users with multiple seats, enterprise policies override organisation policies, *Registry only* beats *Allow all*, and the most recently uploaded registry wins.

The **GitHub MCP Registry** at github.com/mcp is the public, curated catalogue that backs the IDE registry view; it is a discovery aid, not an enforcement mechanism. For strict, user-proof enforcement choose managed settings; for discovery with light governance choose a registry.`,
    },
  ],
  examples: [
    {
      title: 'Repository MCP configuration with a remote server and a narrowed GitHub server',
      description:
        'A repository administrator adds Sentry over HTTP with a bearer header sourced from an Agents secret, and keeps only two Sentry tools. Code review will use them because they are read-only; the cloud agent will call them without asking.',
      language: 'json',
      code: `{
  "mcpServers": {
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp",
      "headers": { "Authorization": "Bearer $COPILOT_MCP_SENTRY_TOKEN" },
      "tools": ["get_issue_details", "search_issues"]
    }
  }
}`,
      takeaway: 'Repository MCP JSON needs type and tools for every server; secrets are referenced by COPILOT_MCP_-prefixed names.',
    },
    {
      title: 'Enterprise allowlist in managed-settings.json',
      description:
        'The enterprise allows the GitHub remote MCP server, the Playwright server started with a specific command, and all Copilot connectors, while denying a filesystem server pointed at the root directory. Anything else is blocked on clients that honour managed settings.',
      language: 'json',
      code: `{
  "allowedMcpServers": [
    { "serverUrl": "https://api.githubcopilot.com/*" },
    { "serverUrl": "https://api.github.com/copilot-connectors/api/v1/connectors/*/mcp" },
    { "serverCommand": ["npx", "@playwright/mcp@latest"] }
  ],
  "deniedMcpServers": [
    { "serverCommand": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "/"] }
  ]
}`,
      takeaway: 'Managed-settings allowlists match on URL or exact command and are the generally available, user-proof control.',
    },
    {
      title: 'The registry-only mistake and the fix',
      description:
        'A security team sets Restrict MCP access to registry servers to Registry only, believing it blocks every unapproved server. Developers find that renaming a server ID in their local configuration lets it run, and the Slack connector stops working for everyone. The fix is to move enforcement to managed-settings.json (allowedMcpServers with URL and command matching, which users cannot override), set the registry policy back to Allow all and optionally keep the registry purely for discovery, and add the connector URLs to the allowlist.',
      takeaway: 'Private registry enforcement is name/ID based and preview; managed settings are the strict control GitHub recommends.',
    },
  ],
  keyPoints: [
    'Copilot agents consume MCP tools; the cloud agent and code review do not use MCP resources or prompts and do not support OAuth remote servers in repository or agent-profile configuration.',
    'Repository MCP JSON (Settings > Copilot > MCP servers) requires type and a tools array per server; it serves the cloud agent, automations and code review.',
    'The cloud agent ships with the GitHub MCP server (read-only, repository-scoped token) and Playwright (localhost); agent profiles can add servers via mcp-servers.',
    'The GitHub remote MCP server lives at https://api.githubcopilot.com/mcp/ with OAuth or PAT auth and header-selected toolsets; GHE.com uses copilot-api.SUBDOMAIN.ghe.com/mcp and GHES supports only the local server.',
    'The "MCP servers in Copilot" policy gates all MCP use for licensed users and also governs connectors.',
    'managed-settings.json allowedMcpServers/deniedMcpServers (URL or command matching) is the recommended, generally available allowlist; built-in servers are always allowed, deny wins, malformed lists block everything but built-ins.',
    'Private registries (v0.1 spec or Azure API Center) with Registry only enforcement are preview, match by name/ID only, can be bypassed locally and block connectors.',
    'Enterprise allowlists do not cover servers defined in custom agent profiles; use the firewall to control those.',
  ],
  flashcards: [
    { front: 'What is the URL of the GitHub remote MCP server?', back: 'https://api.githubcopilot.com/mcp/ (for GitHub Enterprise Cloud with data residency: https://copilot-api.SUBDOMAIN.ghe.com/mcp).' },
    { front: 'Which GitHub deployment type supports only the local GitHub MCP server?', back: 'GitHub Enterprise Server; it does not support remote MCP hosting.' },
    { front: 'Which two keys are required for every server in repository MCP JSON?', back: 'type (local, stdio, http or sse) and tools (array of tool names, or "*").' },
    { front: 'Where does a repository administrator configure MCP servers for the cloud agent?', back: 'Repository Settings > Copilot > MCP servers, as JSON with an mcpServers object.' },
    { front: 'Which MCP features does the cloud agent NOT support?', back: 'MCP resources and prompts, and remote servers using OAuth (for repository or agent-profile configuration).' },
    { front: 'How are MCP toolsets selected on the GitHub remote MCP server?', back: 'Via headers such as X-MCP-Toolsets and X-MCP-Tools, or copilot mcp --toolsets/--tools in the CLI.' },
    { front: 'What policy must be enabled before any MCP server can run for Business/Enterprise users?', back: 'The "MCP servers in Copilot" policy at the enterprise or organisation level.' },
    { front: 'Recommended method to restrict MCP servers enterprise-wide?', back: 'allowedMcpServers and deniedMcpServers in the enterprise managed-settings.json, matching by URL or command.' },
    { front: 'What happens if a managed-settings allowlist is malformed JSON?', back: 'It is treated as an empty allowlist: all servers are blocked except built-in default servers.' },
    { front: 'Which registry spec version must a private MCP registry implement?', back: 'v0.1 (GET /v0.1/servers plus version endpoints) with CORS headers; v0 is unstable and should not be used.' },
    { front: 'Do managed-settings MCP allowlists apply to servers in custom agent profiles?', back: 'No. Control those with the organisation or repository firewall instead.' },
  ],
  quiz: [
    {
      question:
        'A repository administrator wants Copilot cloud agent to read error details from Sentry. Which configuration follows GitHub guidance?',
      options: [
        'Add the Sentry server in repository Settings > Copilot > MCP servers with type, a bearer header referencing $COPILOT_MCP_SENTRY_TOKEN, and a tools array listing the read-only tools needed.',
        'Add the Sentry server with "tools": ["*"] and paste the token directly into the JSON.',
        'Install the Sentry server in each developer\'s VS Code mcp.json.',
        'Ask the agent in the issue to look up Sentry on the web.',
      ],
      correct: [0],
      explanation:
        'Repository-level configuration with scoped tools and an Agents secret is the documented approach. Wildcards and literal tokens are unsafe, IDE configuration does not affect the cloud agent, and web fetching is not available to it.',
    },
    {
      question:
        'Developers on GitHub Enterprise Server ask how to connect VS Code to the GitHub MCP server. What should you tell them?',
      options: [
        'Use the remote server at https://api.githubcopilot.com/mcp/ with OAuth.',
        'Use the local GitHub MCP server, because GitHub Enterprise Server does not support remote MCP hosting.',
        'Use https://copilot-api.SUBDOMAIN.ghe.com/mcp.',
        'MCP is not available with GitHub Enterprise Server in any form.',
      ],
      correct: [1],
      explanation:
        'GHES supports only the local MCP server configuration. The api.githubcopilot.com endpoint is for GitHub.com, the ghe.com endpoint is for Enterprise Cloud with data residency, and MCP is available locally.',
    },
    {
      question:
        'An enterprise must guarantee that developers can run only approved MCP servers and cannot bypass the restriction locally. Which approach should you recommend?',
      options: [
        'Host a private MCP registry and set Restrict MCP access to registry servers to Registry only.',
        'Define allowedMcpServers and deniedMcpServers in the enterprise managed-settings.json.',
        'Disable the MCP servers in Copilot policy.',
        'Publish an approved list in the organisation README.',
      ],
      correct: [1],
      explanation:
        'Managed settings match on URL or command and cannot be overridden by users. Registry enforcement is preview and name/ID based, disabling MCP blocks approved servers too, and a README is not enforcement.',
    },
    {
      question:
        'Which TWO statements about managed-settings MCP allowlist evaluation are correct? (Select two)',
      options: [
        'Built-in default servers such as the GitHub MCP server are always allowed.',
        'A server matching a deniedMcpServers entry is blocked even if it also matches an allowlist entry.',
        'Servers defined in custom agent profiles are also filtered by the allowlist.',
        'A malformed allowlist allows all servers until it is fixed.',
      ],
      correct: [0, 1],
      explanation:
        'Built-ins are always allowed and deny rules take precedence. Agent-profile servers are not covered (use the firewall), and a malformed list is treated as an empty allowlist that blocks everything except built-ins.',
    },
    {
      question:
        'After an organisation sets its MCP registry policy to Registry only, the Slack connector stops working in cloud sandboxes. Why?',
      options: [
        'Connectors require the Playwright server to be enabled.',
        'Registry only permits only servers in the registry, and connectors are blocked under that setting; choose Allow all or allowlist connector URLs in managed settings.',
        'Connectors only work in GitHub Actions-based sessions.',
        'The Slack connector needs a COPILOT_MCP_ secret in every repository.',
      ],
      correct: [1],
      explanation:
        'GitHub documents that Registry only blocks connectors. Connectors do not depend on Playwright, they work in cloud sandboxes and local clients (not Actions sessions), and they use managed authentication rather than repository secrets.',
    },
    {
      question:
        'A custom agent profile defines its own MCP server. Which control can prevent that server from being used in the cloud agent?',
      options: [
        'The enterprise allowedMcpServers list.',
        'The organisation or repository firewall, by not allowing the domains needed to start the server.',
        'The Copilot code review readOnlyHint requirement.',
        'The GitHub MCP Registry listing.',
      ],
      correct: [1],
      explanation:
        'Managed-settings allowlists do not apply to agent-profile servers; the firewall is the documented control. readOnlyHint affects only code review tool selection, and the public registry is for discovery.',
    },
  ],
  statements: [
    { text: 'The cloud agent can use MCP prompts and resources as well as tools.', isTrue: false, explanation: 'Copilot cloud agent and code review support MCP tools only.' },
    { text: 'The GitHub remote MCP server supports OAuth sign-in in supported IDEs.', isTrue: true, explanation: 'Remote configuration uses one-click OAuth by default, with PAT as an alternative.' },
    { text: 'Private MCP registry enforcement matches servers by URL and command, so users cannot bypass it.', isTrue: false, explanation: 'Registry enforcement matches by name/ID only and can be bypassed by editing configuration; managed settings provide URL/command matching.' },
    { text: 'The GitHub MCP Registry at github.com/mcp is a curated discovery catalogue rather than an enforcement mechanism.', isTrue: true, explanation: 'It backs the IDE registry view; allowlists and policies do the enforcing.' },
    { text: 'Copilot connectors are available in GitHub Actions-based cloud agent sessions.', isTrue: false, explanation: 'Connectors work in cloud sandboxes and local clients but not in Actions-based sessions.' },
    { text: 'Repository-level MCP configuration is shared by the cloud agent, automations and Copilot code review.', isTrue: true, explanation: 'One configuration serves all three, with a separate toggle to disable MCP tools for code review.' },
    { text: 'Agents secrets used by MCP servers must have names starting with COPILOT_MCP_.', isTrue: true, explanation: 'Only secrets and variables with that prefix are available to MCP configuration.' },
  ],
  resources: [
    { label: 'Model Context Protocol (MCP) concepts for Copilot', url: 'https://docs.github.com/en/copilot/concepts/customizations/mcp' },
    { label: 'Setting up the GitHub MCP Server', url: 'https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/set-up-the-github-mcp-server' },
    { label: 'Configuring an MCP server allowlist for your enterprise', url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-enterprise-allowlist' },
    { label: 'Configure an MCP registry for your organization or enterprise', url: 'https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-registry' },
  ],
};
