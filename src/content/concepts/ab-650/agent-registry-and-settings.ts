import type { Concept } from '../../types';

export const agentRegistryAndSettings: Concept = {
  id: 'agent-registry-and-settings',
  title: 'The Agent Registry: Discovering, Approving, Controlling Agents and Tools',
  summary:
    'Running the Agents workload in the Microsoft 365 admin center: tenant-wide agent settings (allowed agent and plugin types, sharing, templates, user access), discovering Microsoft, partner, organizational and connected-platform agents in the registry and Agent Map, reviewing publish and activation requests, installing, blocking, uploading and pinning agents, and governing tools such as plugins, skills and MCP servers in Agent 365.',
  certs: ['ab-650'],
  domains: ['ab-650-3'],
  outcomes: ['ab-650-3-2-4', 'ab-650-3-2-5', 'ab-650-3-2-6', 'ab-650-3-2-7', 'ab-650-3-2-8'],
  tags: ['agent-registry', 'agent-365', 'agent-settings', 'policy-templates', 'agent-requests', 'agent-store', 'mcp-servers', 'plugins', 'tools-gateway'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'Agent settings: allowed types, sharing, templates and user access',
      body: `Everything agent-related in the Microsoft 365 admin center sits under the **Agents** node: **Overview**, **All agents** (Registry, Requests and Map tabs), **Tools**, **Shadow AI** (Frontier) and **Settings**. Governance actions need **AI Administrator** or Global Administrator; **AI Reader**, Global Reader, Security Administrator and Reader and Reports Reader can view. The **Settings** page defines tenant-wide guardrails:

- **Agent and plugin access**: which publisher categories users may discover and install from the Agent Store: built by **Microsoft**, by **your organization**, or by **external publishers**. Deselecting a category hides or blocks those agents and plugins (Microsoft agents stay visible but cannot be installed). Researcher and Analyst are part of core Copilot Chat and are not governed by agent settings.
- **User access**: **All users** (default), **No users**, or **Specific users or groups** who may access agents and plugins at all, layered on top of per-agent assignments.
- **Sharing**: who may share agents built with **Copilot Agent Builder**: All users, No users (direct sharing with individuals still works), or Specific users. Copilot Studio sharing is governed in the Power Platform admin center.
- **Policy (security) templates**: bundles of Entra, Purview, SharePoint and Defender policies applied when an agent is **activated or published** (see below). Microsoft provides default templates (one for all agents, one for AI teammates in Frontier); custom templates add Conditional Access, access packages and custom security attributes created in Entra.
- **Agent management rules**: condition-based bulk actions: install Microsoft agents, reassign ownerless Agent Builder agents to the previous owner's manager, block ownerless agents without usage, apply a template to existing agent instances, and reject publish requests older than N days. Rules are reviewed before running and are one-time operations, not schedules.
- **Gateways**: connect Azure AI Gateway (API Management) or LiteLLM so their MCP servers appear in Tools (Global Administrator only).
- **Agent feedback sharing** (none, all or selected agents) and **Tags** (up to 50 organization tags to label and filter agents).

The older Copilot > Settings > Data access > **Agents** entry and **Settings > Integrated apps** remain alternative paths for deploying and blocking agents.`,
    },
    {
      heading: 'Discovering agents: registry, Map and connected platforms',
      body: `The **agent registry** (Agents > All agents > Registry) is the inventory of every agent available to the tenant, in four publisher types: **Microsoft agents**, **External partner-built agents**, **Published by your org** (admin-approved LOB agents) and **Shared by creator** (agents individuals built in Agent Builder, Copilot Studio or SharePoint and shared). The same Copilot Studio agent can legitimately appear twice (Shared by creator while testing, Published by your org after approval); removing one entry does not remove the other.

Summary tiles show **Total agents**, **Agents without owners**, **Unmanaged agents** (created outside Agent 365 without its observability) and **Agents at risk**. The **Risks** column aggregates signals from **Purview, Entra and Defender** (E7 or Agent 365 licence) with severity grouping and deep links to each portal. Filters cover **Status** (Available, Blocked, Draft, Not activated), **Publisher type**, **Channel** (Copilot, Teams, Outlook, Microsoft 365 apps, SharePoint), **Platform** (Copilot Studio, Agent Builder, Foundry, SharePoint, Agents Toolkit, Bedrock, Vertex AI) and **Data source** (embedded knowledge, fine-tuned models from Copilot Tuning). Actions on the list: **Refresh**, **Export** to CSV, **Add agent** (upload a manifest ZIP), **Manage pinned agents** (pinned agents appear prominently per channel; users see at most three), **Customize view** and **Search**. Selecting an agent opens the details pane with **Details, Users, Data & Tools, Security, Permissions, Certification, Activity, Agent instances, Connected Agents and Computer use** tabs.

**Agent Map** (Map tab) visualises agents clustered by platform, with filters for status, publisher, platform, channel and usage signals (active users, sessions, exception rate, assisted hours) from Agent 365 observability, plus a single-agent map in preview. It needs E7 or Agent 365 and Global or AI Administrator. **Connected platforms** (Amazon Bedrock, Google Vertex AI, Salesforce Agentforce, Databricks Genie, Anthropic Claude Managed Agents, Oracle, Snowflake) sync third-party agents read-only into the registry with manual synchronisation and key-based credentials; the **Agent 365 SDK and CLI** onboard custom agents with full observability. **Shadow AI** (Frontier) detects unmanaged local agents such as OpenClaw through Defender for Endpoint and can block them with Intune.`,
    },
    {
      heading: 'Requests: review, publish, activate or reject',
      body: `Makers who build in **Copilot Studio**, **Microsoft Foundry** or the **Agents Toolkit** and choose to make an agent available to the whole organization send it for **admin approval**. Copilot Studio makers do this from the agent's **Channels** tab (Microsoft 365 Copilot and Teams channel, *Show to everyone in the organization*). Requests appear under **Agents > All agents > Requests** in three states: **Pending review** (new agent), **Pending update** (a new version; users keep the old version until approved) and **Pending activate** (a user wants to create instances of an AI teammate or activation-gated agent). Filters: state and channel.

Review the agent's metadata before deciding: description, owner, **capabilities, knowledge sources (data), tools and custom actions**, requested **permissions**, and certification signals. Then choose:

- **Publish to store**: a wizard where you pick **who can install** (users, groups or everyone) and optionally who gets it **preinstalled**; select a **policy template** (default or custom); **review permissions and grant admin consent**; publish. The agent then appears in the **Agent Store** for the chosen audience.
- **Update in store** for pending updates.
- **Activate** (for Pending activate): approve requesters and security groups allowed to create instances, apply a template, consent to permissions, finish. Admins can also activate proactively from the registry.
- **Reject submission**: from the request's menu; the maker is notified.

Users can also **request** Microsoft-built agents that an admin policy blocked; third-party agents cannot be requested or approved through this flow. The rule *Reject agent publish requests older than N days* clears stale queues. Exam framing: "an agent built in Copilot Studio is not visible to the whole company although the maker published it" means the admin has not approved the **publish request**; "makers must not be able to publish to everyone without IT review" is the default behaviour of the request flow.`,
    },
    {
      heading: 'Install, block, upload, pin and manage tools',
      body: `Admin actions on an agent (details pane or list menu):

| Action | Effect |
|---|---|
| **Install / Uninstall** | Deploys the agent to selected users or groups (with template and permission consent) or removes the deployment |
| **Block / Unblock** | Prevents everyone from using the agent and removes it from users who installed it; the first response to a risky agent |
| **Delete / Restore / Permanently delete** | 30-day recovery window |
| **Start / Stop** | Foundry agents only: controls the Azure infrastructure |
| **Assign, add or remove owner** | Ownership repair, including ownerless agents |
| **Pin for users** | Promotes the agent in chosen channels; users see up to three pinned agents |
| **Add agent / Update in store** | Upload a **custom agent manifest ZIP** exported from Copilot Studio or Agent Builder |
| **Connected agents / Computer use** | Connect up to 10 other agents; allow web actions on approved sites (web search required) |

Per-agent **Users** settings define who can discover the agent, who gets it preinstalled and whether it is available to the organization; the **Permissions** tab shows requested Graph scopes for admin consent. **Advanced package uploads** (Copilot settings) decides who may upload advanced agent and plugin packages.

**Tools** (Agents > Tools) is the registry of **plugins** (bundles of skills, MCP servers and connectors), **skills**, **MCP servers** and **connectors**, with its own Requests tab. Actions: **Install/Uninstall**, **Manage user availability** (all, none, specific users or groups), **Block/Unblock**, **Delete** (uploaded packages only) and **Upload** a manifest; organization-level plugin access follows the same publisher categories. Connecting an **Azure AI Gateway or LiteLLM gateway** (Agents > Settings > Gateways, Global Administrator) discovers its MCP servers so you can govern them and protect tool calls with Defender and Purview; Power Platform connector usage is visible in preview. Blocking a tool stops every agent and workflow from invoking it, which is the fastest tenant-wide response to a compromised MCP server.`,
    },
  ],
  examples: [
    {
      title: 'Approving a Copilot Studio agent for the whole company',
      description:
        'A maker publishes an HR policy agent in Copilot Studio and selects "Show to everyone in the organization" on the Microsoft 365 Copilot channel. HR asks why nobody can see it. The AI Administrator opens Agents > All agents > Requests, finds it under Pending review, checks the knowledge sources (HR SharePoint site), tools (none) and permissions, then selects Publish to store, scopes installation to All users with the HR group preinstalled, applies the default policy template, grants consent and publishes. It appears in the Agent Store within minutes.',
      takeaway: 'Maker publishing creates a request; only admin approval in the Requests tab makes an agent organization-wide.',
    },
    {
      title: 'Blocking a risky agent and its tool in minutes',
      description:
        'Defender flags an external partner agent as making unusual tool calls; the registry shows two high-severity risk signals. The admin selects Block on the agent, which removes it from every user, then opens Agents > Tools and blocks the third-party MCP server it used so no other agent can invoke it. The security team investigates through the Defender deep link while the business impact is contained.',
      takeaway: 'Block agents and tools first, investigate second; blocking removes the agent from users who already installed it.',
    },
    {
      title: 'Letting everyone install third-party agents (a realistic mistake)',
      description:
        'To speed adoption, an admin enables "Allow agents and plugins built by external publishers" with User access set to All users. Within weeks, dozens of unreviewed partner agents are installed and the Agents at risk tile climbs. The admin restricts external publisher access, keeps Microsoft and organization-built agents allowed, and uses Install to deploy only the vetted partner agents to the groups that need them, so the store shows external agents as blocked by policy with a Request button for Microsoft agents only.',
      takeaway: 'Agent and plugin access categories plus admin-driven Install give controlled adoption; broad external access invites sprawl and risk.',
    },
    {
      title: 'Bulk clean-up with agent management rules and the Graph API',
      description:
        'After a reorganisation, 40 Agent Builder agents are ownerless. The admin creates an agent management rule "Reassign ownerless agents created with Agent Builder to manager", reviews the impacted list and runs it; another rule blocks ownerless agents with no usage, and a third rejects publish requests older than 60 days. The export is checked against a Graph API listing of the registry for the audit file.',
      language: 'powershell',
      code: `Connect-MgGraph -Scopes "Agent.Read.All"   # agent registry read scope (Graph API for agent registry)
# List registry entries and highlight agents without owners (beta endpoint shown for illustration)
Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.com/beta/admin/agents" |
  Select-Object -ExpandProperty value |
  Where-Object { -not $_.owners } |
  Select-Object displayName, publisherType, status`,
      takeaway: 'Agent management rules apply governance in bulk; the Graph API for the agent registry supports reporting and automation.',
    },
  ],
  keyPoints: [
    'Agent settings control allowed publisher categories (Microsoft, your organization, external), user access (all, none, specific), Agent Builder sharing, policy templates, agent management rules, gateways, feedback sharing and tags.',
    'The registry lists Microsoft, external partner, published-by-org and shared-by-creator agents with risk signals from Purview, Entra and Defender; Agent Map visualises them by platform; connected platforms sync third-party agents read-only.',
    'Requests have three states: pending review, pending update and pending activate; admins publish to store (audience, preinstall, template, consent), update, activate or reject.',
    'Install deploys to users or groups; Block removes an agent from everyone including existing installs; delete has a 30-day recovery; Start/Stop is Foundry-only; pinning shows up to three agents per user.',
    'Custom agents are added by uploading a manifest ZIP from Copilot Studio or Agent Builder; advanced package uploads are governed in Copilot settings.',
    'Tools (plugins, skills, MCP servers, connectors) have their own registry with install, availability, block and upload actions; gateways (Azure AI Gateway, LiteLLM) surface MCP servers for governance and Defender/Purview protection.',
    'AI Administrator or Global Administrator perform governance actions; AI Reader and other reader roles can only view; Shadow AI detection needs Defender for Endpoint and Intune for blocking.',
  ],
  flashcards: [
    { front: 'Where is the agent registry in the Microsoft 365 admin center?', back: 'Agents > All agents > Registry (with Requests and Map tabs).' },
    { front: 'Name the four publisher types in the agent registry.', back: 'Microsoft agents, external partner-built agents, published by your org, shared by creator.' },
    { front: 'What are the three options for agent and plugin access by publisher?', back: 'Allow agents and plugins built by Microsoft, by your organization, or by external publishers.' },
    { front: 'What are the three request states on the Requests tab?', back: 'Pending review, pending update, pending activate.' },
    { front: 'What happens to users who already installed an agent when you block it?', back: 'The agent is removed from them; nobody in the tenant can use it until unblocked.' },
    { front: 'How long can a deleted agent be restored?', back: '30 days.' },
    { front: 'Which agents support the Start and Stop actions?', back: 'Microsoft Foundry agents (controls their Azure infrastructure).' },
    { front: 'How many pinned agents can a user see?', back: 'Up to three, by priority order.' },
    { front: 'How do you register a custom agent that is not in the store?', back: 'Agents > All agents > Add agent and upload the manifest ZIP exported from Copilot Studio or Agent Builder.' },
    { front: 'Which agents does the Sharing setting govern?', back: 'Agents built with Microsoft Copilot Agent Builder; Copilot Studio sharing is managed in the Power Platform admin center.' },
    { front: 'What is in the Tools registry?', back: 'Plugins, skills, MCP servers and connectors that agents can use, with install, availability, block and upload actions.' },
    { front: 'Who can connect an Azure AI Gateway or LiteLLM gateway?', back: 'Global Administrator only (AI Administrator cannot).' },
    { front: 'Which agent management rule fixes ownerless agents?', back: 'Reassign ownerless agents created with Agent Builder to the previous owner\'s manager; another rule blocks ownerless agents without usage.' },
  ],
  quiz: [
    {
      question:
        'A maker publishes a Copilot Studio agent and selects "Show to everyone in the organization", but employees cannot find it in the Agent Store. What should the administrator do?',
      options: [
        'Ask the maker to share the agent with individual users instead.',
        'Open Agents > All agents > Requests, review the pending agent and select Publish to store.',
        'Enable web search for Copilot.',
        'Assign the maker the AI Administrator role.',
      ],
      correct: [1],
      explanation:
        'Organization-wide publication requires admin approval of the publish request. Individual sharing bypasses the store, web search is unrelated, and the maker should not need admin rights.',
    },
    {
      question:
        'Security reports that a third-party agent is exfiltrating data through an MCP server. Which TWO actions contain the issue tenant-wide FASTEST? (Select two)',
      options: [
        'Block the agent in the agent registry.',
        'Block the MCP server in Agents > Tools.',
        'Email all users asking them to uninstall the agent.',
        'Create a retention policy for the agent\'s interactions.',
      ],
      correct: [0, 1],
      explanation:
        'Blocking the agent removes it from everyone, and blocking the tool stops any agent from invoking it. User emails are not a control, and retention does not stop activity.',
    },
    {
      question:
        'Your organization wants users to install agents built by Microsoft and by internal teams, but never agents from external publishers unless IT deploys them. Which configuration meets the requirement?',
      options: [
        'Agents > Settings > Agent and plugin access: allow Microsoft and your organization, deselect external publishers; IT uses Install for vetted partner agents.',
        'Agents > Settings > User access: No users.',
        'Agents > Settings > Sharing: No users.',
        'Block every Microsoft agent in the registry.',
      ],
      correct: [0],
      explanation:
        'Publisher categories control what users can install; admins can still deploy specific external agents with Install. User access No users blocks everything, Sharing governs Agent Builder sharing, and blocking Microsoft agents is the opposite of the goal.',
    },
    {
      question:
        'A departed employee created 15 shared Agent Builder agents that are now ownerless. Which approach requires the LEAST administrative effort?',
      options: [
        'Open each agent and assign a new owner manually.',
        'Create and run the agent management rule that reassigns ownerless Agent Builder agents to the previous owner\'s manager.',
        'Delete the agents and ask teams to rebuild them.',
        'Restore the departed employee\'s account.',
      ],
      correct: [1],
      explanation:
        'Agent management rules apply bulk governance after review. Manual reassignment and rebuilding are high-effort, and restoring the account violates leaver controls.',
    },
    {
      question:
        'A business unit built an agent with the Microsoft 365 Agents Toolkit and exported a manifest ZIP. It must be managed and deployed from the Microsoft 365 admin center. What should you do?',
      options: [
        'Use Add agent in the agent registry to upload the ZIP, then install it for the business unit.',
        'Upload the ZIP to a SharePoint library and share the link.',
        'Register the agent in the Power Platform admin center only.',
        'Create a Copilot connector for the manifest.',
      ],
      correct: [0],
      explanation:
        'Custom agents are registered by uploading the manifest package in the registry, after which install, block and pin actions apply. SharePoint links, Power Platform registration and connectors do not register an agent in the Microsoft 365 registry.',
    },
    {
      question:
        'An AI Administrator attempts to connect an Azure AI Gateway so its MCP servers appear under Tools, but the toggle is unavailable. Why?',
      options: [
        'Connecting gateways requires the Global Administrator role.',
        'The tenant must enable Restricted SharePoint Search first.',
        'MCP servers can only be added by uploading a plugin manifest.',
        'Gateways are configured in the Teams admin center.',
      ],
      correct: [0],
      explanation:
        'Gateway connections are a Global Administrator operation; AI Administrator is insufficient. RSS is unrelated, manifests are one of several ways to add tools, and gateways live under Agents > Settings in the Microsoft 365 admin center.',
    },
  ],
  statements: [
    { text: 'Researcher and Analyst are governed by the agent settings page like other agents.', isTrue: false, explanation: 'They are part of core Copilot Chat and are not subject to agent-related settings.' },
    { text: 'The same Copilot Studio agent can appear twice in the registry with different publisher types.', isTrue: true, explanation: 'Shared by creator and Published by your org are separate lifecycle records.' },
    { text: 'Blocking an agent only prevents new installations.', isTrue: false, explanation: 'Blocking also removes the agent from users who already installed it.' },
    { text: 'Admins can approve user requests for third-party agents blocked by policy through the Requests tab.', isTrue: false, explanation: 'The request-and-approve flow supports Microsoft-built agents only.' },
    { text: 'Agent Map requires an E7 or Agent 365 licence and the Global or AI Administrator role.', isTrue: true, explanation: 'It visualises agents by platform with observability-based filters.' },
    { text: 'Policy templates can be applied retroactively to agents that were already approved.', isTrue: false, explanation: 'Templates apply at activation or publish; the Apply template rule targets agent instances with identities but approved agents are otherwise unaffected.' },
    { text: 'Connected platforms synchronise third-party agents into the registry without executing them.', isTrue: true, explanation: 'Connections are read-only and synchronisation is manual.' },
    { text: 'Deleting a tag removes it from every agent that used it.', isTrue: true, explanation: 'Check the agent count before deleting; the tenant limit is 50 tags.' },
  ],
  resources: [
    { label: 'Agent registry in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-registry-overview' },
    { label: 'Manage agent requests in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-requests' },
    { label: 'Agent settings in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-settings' },
    { label: 'Agent tools overview', url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-tools-overview' },
  ],
};
