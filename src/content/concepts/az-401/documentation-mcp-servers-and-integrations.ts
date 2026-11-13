import type { Concept } from '../../types';

export const documentationMcpServersAndIntegrations: Concept = {
  id: 'documentation-mcp-servers-and-integrations',
  title: 'Project Documentation, MCP Servers and Boards-GitHub Integration',
  summary:
    'Documenting a project with AI help (wikis, READMEs, changelogs, releases, licences, CODEOWNERS, Mermaid diagrams), configuring the GitHub and Azure DevOps MCP servers, and wiring systems together with webhooks, MCP tools and skills, including Azure Boards to GitHub integration driven through MCP and the Copilot cloud agent.',
  certs: ['az-401', 'gh-600', 'gh-700'],
  domains: ['az-401-1', 'gh-600-2', 'gh-700-1'],
  outcomes: ['az-401-1-3-1', 'az-401-1-3-3', 'az-401-1-3-4', 'az-401-1-3-5', 'gh-600-2-2-2', 'gh-700-1-1-11'],
  tags: ['mcp', 'github-mcp-server', 'azure-devops-mcp-server', 'webhooks', 'wiki', 'codeowners', 'azure-boards', 'documentation'],
  difficulty: 'intermediate',
  diagram: 'mcp-architecture',
  sections: [
    {
      heading: 'Documenting a project with AI assistance',
      body: `Documentation is part of the delivery system, not an afterthought, and the exam lists seven artifacts you should know where to put and how to generate:

| Artifact | Azure DevOps | GitHub | AI assist |
|---|---|---|---|
| Wiki | Project wiki (provisioned, its own Git repo) or **publish code as wiki** from a repo folder | Repository wiki, or docs folder with GitHub Pages | Copilot drafts pages; the Azure DevOps MCP server can create and update wiki pages |
| README | README.md in the repo root, shown on the project summary | README.md rendered on the repo home page | Copilot Chat: "write a README from this repo's structure and scripts" |
| Change log | CHANGELOG.md kept in the repo | CHANGELOG.md plus **release notes** generated from merged PRs | Copilot summarises PRs between two tags |
| Releases | Pipeline release artifacts and tags | **Releases** page attached to Git tags, with auto-generated notes | Copilot cloud agent drafts the release description |
| Licence | LICENSE file | LICENSE file; GitHub detects the licence and shows it on the repo | Copilot explains licence compatibility of dependencies |
| Code owners | Automatically included reviewers branch policy | **CODEOWNERS** in .github/, root or docs/ | Copilot proposes owners from commit history |
| Process diagrams | Mermaid in wiki and Markdown | Mermaid blocks render in Markdown | Copilot turns a YAML pipeline into a Mermaid flowchart |

Two practical rules. First, keep documentation next to the code it describes so pull requests update both; the wiki is for cross-repo knowledge. Second, treat AI-generated docs the way you treat AI-generated code: a human reviews for accuracy, and the review happens in a PR. CODEOWNERS deserves special care because it drives **required reviews from code owners** in branch protection; a wrong owner silently weakens your merge gate.`,
    },
    {
      heading: 'Configuring the GitHub MCP server and the Azure DevOps MCP server',
      body: `The **Model Context Protocol (MCP)** is the open standard that lets an AI client (Copilot Chat in VS Code, the Copilot cloud agent, Copilot CLI, Azure SRE Agent) call tools exposed by a server. Each client runs one MCP client per server; servers expose tools, resources and prompts over stdio (local) or streamable HTTP (remote). For DevOps you need two servers:

**GitHub MCP server.** The remote server lives at \`https://api.githubcopilot.com/mcp/\` and authenticates with OAuth or a personal access token; a local Docker-based server also exists. In VS Code you add it under \`servers\` in \`.vscode/mcp.json\` with \`"type": "http"\`. It exposes toolsets for repositories, issues, pull requests, Actions runs, code scanning and more, and a read-only variant exists for safer use. Enterprise and organization owners govern which MCP servers Copilot may use through the MCP policy, an allowlist in managed settings and a configurable **MCP registry**.

**Azure DevOps MCP server.** Microsoft recommends the **remote** server at \`https://mcp.dev.azure.com/{organization}\`, which needs no installation and authenticates with Microsoft Entra ID (the organization must be Entra-backed). The **local** server (\`npx -y @azure-devops/mcp {organization}\`) uses stdio and is for clients that cannot do Entra OAuth. You restrict tools with headers: \`X-MCP-Toolsets\` (repos, wit, pipelines, wiki, work, testplan, advsec) and \`X-MCP-Readonly\` to block writes.

For the Copilot cloud agent and Copilot code review, MCP servers are configured once per repository under **Settings > Copilot > Model Context Protocol**, with secrets supplied as Agents secrets prefixed \`COPILOT_MCP_\`. Tools from these servers run without per-call approval, so restrict toolsets and prefer read-only where the agent only needs context.`,
    },
    {
      heading: 'Integration patterns: webhooks, MCP tools and skills',
      body: `Integration questions come down to **who initiates** and **who reasons**:

- **Webhooks** are event-driven and deterministic. Azure DevOps **service hooks** post a JSON payload to an HTTPS endpoint (or Teams, Slack, Azure Service Bus, Storage queues, Grafana) when a work item changes, a build completes or a PR is updated. GitHub **webhooks** do the same for pushes, pull requests, releases, workflow runs and deployments, signed with a secret you verify. Use webhooks when a system must react to an event in near real time with fixed logic.
- **MCP tools** are pull-based and agent-driven. An agent decides mid-task to query Azure Boards, open a GitHub issue or read a pipeline log. Use MCP when the step requires judgement or when a human in chat should be able to ask ad hoc questions.
- **Skills** (folders of instructions, scripts and resources in \`.github/skills\`, \`.claude/skills\` or \`.agents/skills\`) package *how* to do a repeatable task, for example "write release notes in our template". A skill often *uses* MCP tools; it does not replace them.

Typical architecture: a GitHub webhook on \`pull_request\` triggers an automation; the automation runs an agent that uses the GitHub MCP server to read the diff and the Azure DevOps MCP server to update the linked work item; a skill tells the agent the team's release-note format. Design the boundaries so the deterministic part (webhook, workflow trigger, permission scope) stays deterministic and only the reasoning part is delegated to the model.`,
    },
    {
      heading: 'Azure Boards and GitHub: connection, AB# links and MCP-driven work',
      body: `The classic integration is the **Azure Boards app for GitHub**. A project administrator connects the Boards project to one or more GitHub repositories (OAuth is preferred for GitHub.com; GitHub Enterprise Server supports OAuth or PAT). After that, \`AB#123\` in a commit message, PR description or issue description links the artifact to work item 123, and \`Fixes AB#123\` (or a state name such as \`Closed AB#123\`) transitions it when the PR merges. The work item shows the GitHub commit, PR and branch in its Development section, and release status if Pipelines is also connected.

The agentic layer adds two things. First, the **Azure Boards GitHub integration can invoke the Copilot cloud agent**: from a work item, choose *Create a pull request with Copilot*, pick the repository and base branch, and Copilot opens a draft PR that captures the description, repro steps and the last 50 comments as context, linked back to the work item. The Azure Boards app must be installed by a GitHub org owner and its new permissions accepted. Second, with both MCP servers configured in a client, an engineer can run one conversation that reads the Boards work item (Azure DevOps MCP, \`wit\` toolset), creates the GitHub issue or branch (GitHub MCP) and writes the AB# reference so the link is preserved.

Exam angle: if the question is about *linking and state transitions*, the answer is the Boards app and AB# syntax; if it is about *an agent doing the work across both systems*, the answer involves MCP servers (and possibly the cloud agent); if it is about *reacting to an event*, it is a service hook or webhook.`,
    },
  ],
  examples: [
    {
      title: 'Remote Azure DevOps MCP server, read-only, work items only',
      description:
        'A platform engineer configures VS Code so Copilot Chat can answer questions about sprint work items without being able to change anything. She uses the remote server, limits the toolset to work item tracking and sets the read-only header.',
      language: 'json',
      code: `{
  "servers": {
    "ado-remote-mcp": {
      "url": "https://mcp.dev.azure.com/contoso",
      "type": "http",
      "headers": {
        "X-MCP-Toolsets": "wit,work",
        "X-MCP-Readonly": "true"
      }
    },
    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "type": "http"
    }
  },
  "inputs": []
}`,
      takeaway: 'Prefer the remote Entra-authenticated server and narrow it with toolset and read-only headers before you expose it to an agent.',
    },
    {
      title: 'Generating a changelog and release with Copilot',
      description:
        'Before tagging v2.4.0, a maintainer asks the Copilot cloud agent: "Summarise merged PRs since tag v2.3.0 grouped by Added, Changed, Fixed, update CHANGELOG.md and draft the GitHub release notes." Copilot opens a PR with the changelog edit; after review and merge, the release is created from the tag with the generated notes. CODEOWNERS routes the PR to the docs team automatically.',
      language: 'markdown',
      code: `## [2.4.0] - 2026-11-12
### Added
- Canary deployment stage for the checkout API (#412, AB#9871)
### Changed
- Pipeline templates moved to the shared \`pipeline-templates\` repo (#418)
### Fixed
- Flaky integration test on Linux agents marked and quarantined (#420, AB#9902)`,
      takeaway: 'Let the agent assemble the changelog from merged PRs, but merge it through a pull request so code owners review the text that ships with the release.',
    },
    {
      title: 'The silent CODEOWNERS mistake (a realistic mistake)',
      description:
        'A team adds a CODEOWNERS file to docs/ but their branch protection rule requires reviews from code owners based on the default branch’s .github/CODEOWNERS, which still lists a developer who left. PRs touching infrastructure wait for an owner who will never respond, and people start using admin bypass. The fix: keep a single CODEOWNERS file in .github/ on the default branch, use teams (such as @contoso/platform) instead of individuals, and ask Copilot to propose owners from recent commit history before reviewing them.',
      takeaway: 'CODEOWNERS feeds required reviews; stale or duplicated files create bypass habits that defeat the policy.',
    },
    {
      title: 'From work item to pull request without leaving Azure Boards',
      description:
        'A product owner refines bug AB#5521 with repro steps and acceptance criteria. From the work item she selects "Create a pull request with Copilot", picks the contoso/checkout repository and adds "follow the error-handling guidance in .github/copilot-instructions.md". The Copilot cloud agent opens a draft PR linked to AB#5521; the branch policy still requires a human reviewer and a passing build before merge.',
      takeaway: 'The Boards app plus Copilot cloud agent turns a well-specified work item into a reviewable PR while keeping the AB# link and the merge gates intact.',
    },
  ],
  keyPoints: [
    'Keep README, CHANGELOG, LICENSE, CODEOWNERS and Mermaid diagrams in the repository so PRs update docs and code together; use the wiki (provisioned or publish-code-as-wiki) for cross-repository knowledge.',
    'The GitHub MCP server remote endpoint is https://api.githubcopilot.com/mcp/; the Azure DevOps remote MCP server is https://mcp.dev.azure.com/{organization} with Microsoft Entra authentication.',
    'Restrict the Azure DevOps MCP server with X-MCP-Toolsets (repos, wit, pipelines, wiki, work, testplan, advsec) and X-MCP-Readonly; use the local npx server only when Entra OAuth is not possible.',
    'For the Copilot cloud agent and code review, configure MCP servers in repository settings and pass secrets as COPILOT_MCP_-prefixed Agents secrets; tools then run without per-call approval.',
    'Webhooks and service hooks react to events deterministically; MCP tools let an agent pull data and act with judgement; skills package repeatable procedures that may call MCP tools.',
    'Azure Boards connects to GitHub through the Azure Boards app; AB#<id> in commits, PR descriptions and issue descriptions links work, and Fixes AB#<id> transitions state on merge.',
    'From an Azure Boards work item you can create a pull request with the Copilot cloud agent, which carries the description and comments as context and links the PR back.',
    'Enterprise and organization owners govern MCP with a policy, an allowlist in managed settings and an MCP registry.',
  ],
  flashcards: [
    { front: 'What is the recommended way to run the Azure DevOps MCP server?', back: 'The remote server at https://mcp.dev.azure.com/{organization} using streamable HTTP and Microsoft Entra ID; the local npx server is the fallback.' },
    { front: 'Which header limits the Azure DevOps MCP server to specific tool groups?', back: 'X-MCP-Toolsets, for example "repos,wiki,wit". X-MCP-Readonly blocks write operations.' },
    { front: 'What is the URL of the remote GitHub MCP server?', back: 'https://api.githubcopilot.com/mcp/' },
    { front: 'Where do you configure MCP servers for the Copilot cloud agent and Copilot code review?', back: 'In the repository settings under Copilot > Model Context Protocol, with secrets as Agents secrets prefixed COPILOT_MCP_.' },
    { front: 'In which directories can GitHub find a CODEOWNERS file?', back: '.github/, the repository root, or docs/ (on the base branch of the pull request).' },
    { front: 'What text links a GitHub pull request to Azure Boards work item 42 and closes it on merge?', back: 'Fixes AB#42 (or Fixed/Fix AB#42, or a valid state name such as Closed AB#42) in the PR description.' },
    { front: 'Webhook vs MCP tool: which is event-driven and which is agent-driven?', back: 'Webhooks and service hooks push events deterministically; MCP tools are called by an agent when it decides it needs data or an action.' },
    { front: 'What are agent skills and where are project skills stored?', back: 'Folders of instructions, scripts and resources an agent loads for a specific task; project skills live in .github/skills, .claude/skills or .agents/skills.' },
    { front: 'How does the Copilot cloud agent get started from Azure Boards?', back: 'From a work item choose "Create a pull request with Copilot" (requires the Azure Boards GitHub app with updated permissions); Copilot opens a draft PR linked to the work item.' },
    { front: 'What does "publish code as wiki" do in Azure DevOps?', back: 'It publishes Markdown files from a Git repository folder as wiki pages so documentation versions with the code.' },
  ],
  quiz: [
    {
      question:
        'You need Copilot Chat in VS Code to read Azure Boards work items for a Microsoft Entra-backed organization. The security team requires that the agent cannot modify Azure DevOps resources and that no software is installed locally. What should you configure?',
      options: [
        'The local Azure DevOps MCP server via npx with the wit domain',
        'The remote Azure DevOps MCP server with the X-MCP-Readonly header',
        'A service hook that posts work item changes to a webhook',
        'The GitHub MCP server with the issues toolset',
      ],
      correct: [1],
      explanation:
        'The remote server needs no installation and X-MCP-Readonly blocks writes. The local server requires Node.js, a service hook is push-based notification rather than a query tool, and the GitHub MCP server cannot read Azure Boards.',
    },
    {
      question:
        'A repository administrator configures an MCP server for the Copilot cloud agent that needs an API key. Where must the key be stored so the configuration can use it?',
      options: [
        'As a repository Actions secret named MCP_API_KEY',
        'As an Agents secret with a name prefixed COPILOT_MCP_',
        'Inline in the MCP JSON configuration',
        'In the .github/copilot-instructions.md file',
      ],
      correct: [1],
      explanation:
        'Only Agents secrets and variables prefixed COPILOT_MCP_ are available to the repository MCP configuration. Ordinary Actions secrets are not exposed to it, and inline keys or instruction files would leak the secret.',
    },
    {
      question:
        'Which TWO artifacts should live in the repository rather than the project wiki so that pull requests update them together with the code? (Select two)',
      options: ['CODEOWNERS', 'CHANGELOG.md', 'Cross-team onboarding guide', 'Organization-wide architecture principles'],
      correct: [0, 1],
      explanation:
        'CODEOWNERS must be in the repository (it drives reviews) and the changelog changes with every release. Cross-team guides and organization-wide principles belong in a wiki shared across repositories.',
    },
    {
      question:
        'A developer adds "AB#881" to a pull request comment but the Azure Boards work item shows no link. What is the MOST likely cause?',
      options: [
        'The Azure Boards app only supports GitHub Enterprise Server.',
        'AB# mentions create links only from commit messages, PR descriptions and issue descriptions, not from comments or titles.',
        'The work item must be in the Active state before it can be linked.',
        'The repository must use squash merges for links to work.',
      ],
      correct: [1],
      explanation:
        'Azure Boards ignores AB# in comments and PR titles. The app supports GitHub.com, work item state does not block linking, and merge strategy is irrelevant.',
    },
    {
      question:
        'Contoso wants a deployment-tracking system to be updated within seconds whenever a release pipeline completes, with fixed logic and no AI reasoning. Which integration is MOST appropriate?',
      options: [
        'An Azure DevOps service hook (webhook) on the release completed event',
        'The Azure DevOps MCP server with the pipelines toolset',
        'An agent skill in .github/skills',
        'A Copilot custom instructions file',
      ],
      correct: [0],
      explanation:
        'Event-driven, deterministic updates are what service hooks are for. MCP tools are pulled by an agent, skills describe procedures for agents, and custom instructions shape model behaviour; none of them fire on an event by themselves.',
    },
    {
      question:
        'A product owner wants to turn a refined Azure Boards bug into a GitHub pull request drafted by Copilot without leaving Azure Boards. What is required?',
      options: [
        'Install the Azure Boards app in the GitHub organization, accept its updated permissions and use "Create a pull request with Copilot" on the work item.',
        'Enable auditing and stream events to Log Analytics.',
        'Configure a build validation branch policy on the target branch.',
        'Create a Power Automate flow that calls the GitHub REST API.',
      ],
      correct: [0],
      explanation:
        'The Azure Boards GitHub integration includes a Copilot action that sends the work item to the Copilot cloud agent. Auditing, branch policies and Power Automate do not provide this capability.',
    },
  ],
  statements: [
    { text: 'The remote Azure DevOps MCP server requires Node.js 20 on the developer’s machine.', isTrue: false, explanation: 'Only the local server needs Node.js and npx; the remote server is hosted by Azure DevOps.' },
    { text: 'The GitHub MCP server can be reached remotely at https://api.githubcopilot.com/mcp/.', isTrue: true, explanation: 'That is the remote endpoint; a local Docker-based server is also available.' },
    { text: 'MCP servers configured in repository settings are shared by the Copilot cloud agent and Copilot code review.', isTrue: true, explanation: 'The repository-level MCP configuration is a single shared settings page for both.' },
    { text: 'A CODEOWNERS file placed in the src/ folder is honoured by GitHub.', isTrue: false, explanation: 'GitHub reads CODEOWNERS from .github/, the root or docs/.' },
    { text: 'Service hooks in Azure DevOps can only target Microsoft Teams.', isTrue: false, explanation: 'They support webhooks, Slack, Teams, Azure Service Bus, Azure Storage, Grafana, Datadog, Jenkins and more.' },
    { text: 'Agent skills are folders of instructions, scripts and resources that an agent loads when relevant.', isTrue: true, explanation: 'That is the Agent Skills open specification used by Copilot and other agents.' },
    { text: 'Using "Fixes AB#123" in a GitHub pull request description can transition the Azure Boards work item when the PR merges.', isTrue: true, explanation: 'Azure Boards recognises fix/fixes/fixed and state names before an AB# reference.' },
  ],
  resources: [
    { label: 'Remote Azure DevOps MCP Server', url: 'https://learn.microsoft.com/en-us/azure/devops/mcp-server/remote-mcp-server' },
    { label: 'Set up the GitHub MCP server in your IDE', url: 'https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/set-up-the-github-mcp-server' },
    { label: 'Integrating Copilot cloud agent with Azure Boards', url: 'https://docs.github.com/en/copilot/how-tos/copilot-integrations/integrate-cloud-agent-with-azure-boards' },
    { label: 'Link GitHub commits, pull requests and issues to Azure Boards work items', url: 'https://learn.microsoft.com/en-us/azure/devops/boards/github/link-to-from-github' },
  ],
};
