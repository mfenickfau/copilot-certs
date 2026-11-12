import type { Concept } from '../../types';

export const agentLifecycleAndGovernance: Concept = {
  id: 'agent-lifecycle-and-governance',
  title: 'Agent Administration: Access, Creation, Approval and Lifecycle Monitoring',
  summary:
    'How agents are created with Agent Builder, Copilot Studio and SharePoint, how administrators control who can use them, how the approval and publishing workflow in the Microsoft 365 admin center works, and how to monitor usage, operational insights and lifecycle across the Microsoft 365 admin center, Power Platform admin center and Copilot Studio within the Copilot Control System.',
  certs: ['ab-900', 'ab-731'],
  domains: ['ab-900-3', 'ab-731-2'],
  outcomes: ['ab-900-3-3-1', 'ab-900-3-3-2', 'ab-900-3-3-3', 'ab-900-3-3-4', 'ab-731-2-1-5'],
  tags: ['agents', 'agent-governance', 'copilot-studio', 'agent-builder', 'microsoft-365-admin-center', 'power-platform-admin-center', 'copilot-control-system', 'agent-365'],
  difficulty: 'intermediate',
  diagram: 'copilot-studio-agent-anatomy',
  sections: [
    {
      heading: 'Creating an agent: Agent Builder, Copilot Studio and SharePoint',
      body: `Three maker surfaces produce most agents, and administrators are expected to know their shape and limits.

**Agent Builder** lives inside Copilot Chat (Work and Web) and in Teams. A licensed user describes the agent, refines **instructions**, adds **knowledge** (SharePoint sites and files, Copilot connectors, web content, uploaded files), optionally adds skills, tests it in the side panel, then **shares** it with specific people or groups or submits it to the organisation. It creates **declarative agents** only; it cannot author actions. Admins can switch Agent Builder availability on or off for users.

**Microsoft Copilot Studio** (copilotstudio.microsoft.com) is the low-code studio for agents and workflows in a Power Platform **environment**. A maker creates an agent by describing it in natural language or from a blank template, then configures **instructions** (up to 8,000 characters), **knowledge sources**, **tools** (connectors, MCP servers, agent flows, prompts), **topics** for scripted conversations, **triggers** for autonomous runs, other agents as sub-agents and a **harness** (the Microsoft Copilot harness for reasoning-heavy work, Customer Conversation for voice and chat support, or the standard harness). After testing, the maker **publishes** to **channels**: Microsoft 365 Copilot and Teams, a website, mobile app, Slack and more. Choosing *Microsoft Copilot and Teams* and *Make agent available in Microsoft Copilot* sends the agent to the Microsoft 365 admin center for admin approval; *See agent in Microsoft 365* shares it directly as a *Shared by creator* entry. Copilot Studio also authenticates agents with Entra ID automatically and supports SSO.

**SharePoint agents** are created from a site or library by a licensed user with permission to add files; they produce a *.agent* file scoped to that content and are discovered on the site. Pro-code teams use the **Microsoft 365 Agents Toolkit** or **Microsoft Foundry** and submit packaged agents, and external platforms can be onboarded through **Microsoft Agent 365**.`,
    },
    {
      heading: 'Configuring user access to agents',
      body: `User access to agents is layered, and each layer has an owner.

**Licensing**: a Microsoft 365 Copilot licence covers using and building agents; unlicensed users reach metered agents only when a pay-as-you-go billing policy covers them; Copilot Studio authors need a Copilot Studio licence or capacity.

**Tenant-level switches** in *Microsoft 365 admin center > Copilot > Settings > Data access > Agents* decide whether users can install agents at all, whether they can use agents from partners, and whether makers can share or publish. *Settings > Integrated apps* adds deployment and blocking controls shared with Teams apps.

**Per-agent assignment** in *Agents > All agents*: open an agent and choose **Users > Deployed to**: *Just me*, *Entire organization* or *Specific users/groups*; set whether the agent is **installed** (preinstalled and pinned) or merely **available** for users to add from the **Agent Store**; **block** or **remove** it to withdraw access. Pinned agents (up to three visible per user) make an agent prominent across channels.

**Policy templates and permissions**: when publishing or activating an agent, admins apply a **policy template**: the Microsoft **default template** brings Entra ID Protection for agents, lifecycle management of Agent IDs, SharePoint external-sharing restrictions and Purview protections, and can auto-assign licences; a **custom template** adds stricter rules. Admins also review the Graph **permissions** the agent requests and grant **admin consent**.

**Maker-side sharing** in Copilot Studio: owners share agents as Editors or Viewers; Power Platform admins can block or limit sharing at the managed environment or environment-group level, and **Copilot Studio DLP policies** can block publishing to specific channels.

**Data-side controls** apply regardless: the agent runs with the user's permissions, honours sensitivity labels and Restricted Content Discovery, and is covered by Purview DLP, audit, retention and Communication Compliance like Copilot itself.`,
    },
    {
      heading: 'The approval process',
      body: `Agents built by your organisation and intended for everyone pass through **admin approval** in the Microsoft 365 admin center, which is where the **Agent Registry** records them.

1. **Submission**. The maker publishes in Copilot Studio with *Make agent available in Microsoft Copilot*, submits a packaged agent from the Agents Toolkit or Foundry, or an admin uploads a manifest. The agent's full definition (description, owner, capabilities, knowledge sources, actions, requested permissions) is sent to the admin center.
2. **Review**. Under *Agents > All agents > Requests* the item appears as **Pending review** (new), **Pending update** (a new version of an approved agent; users keep the old version until approved) or **Pending activate** (a user wants to create instances of an agent). Admins filter by state and channel and open the request to inspect data sources, tools and permissions.
3. **Decision**. **Publish to store** starts the publishing wizard: choose the audience that can install, optionally who gets it preinstalled, apply a **policy template**, review permissions and grant **admin consent**, then publish. The agent appears in the Agent Store under *Built by your org*. **Reject submission** notifies the maker through Copilot Studio so they can revise and resubmit.

Rules that appear in questions: approving requires the **AI Administrator** or **Global Administrator** role; **Global Reader**, **AI Reader**, Security Reader and Reports Reader can view the registry but cannot approve; **Microsoft agents** blocked by policy can be requested by users and unblocked and approved from the same Requests tab, but **third-party agents cannot be requested or approved** this way; **Researcher and Analyst** are not agents in this sense and never appear for approval. A Copilot Studio agent may show twice in the registry (*Shared by creator* and *Published by your org*) because sharing and publishing are separate lifecycle records, which is expected rather than an error.`,
    },
    {
      heading: 'Monitoring agents across admin centers',
      body: `The **Copilot Control System** (Microsoft's *Copilot controls*) frames agent governance in three pillars: **security and governance**, **management controls** (licensing and metering, **agent lifecycle**, customisation) and **measurement and reporting**. Three consoles deliver it.

**Microsoft 365 admin center** is the tenant-wide control plane, extended by **Microsoft Agent 365** for agents built anywhere. *Agents > Overview* shows 30-day usage trends, pending requests, **agents without owners** and governance gaps. *Agents > All agents > Registry* lists every agent with publisher type (Microsoft, external partner, published by your org, shared by creator), channel, platform, status, risk signals and an Activity tab per agent, with export to CSV and filters. **Lifecycle actions**: install or uninstall, activate, block or unblock, delete (30-day restore), start or stop Foundry agents, assign owners, publish or reject. Rules can flag ownerless or risky agents automatically, and **Shadow AI** views reveal unmanaged ones.

**Power Platform admin center** governs the Power Platform side of Copilot Studio agents: **environments**, the **inventory** of agents built there (including drafts), **Copilot Studio capacity and Copilot Credit** consumption under Licensing, **DLP policies** for connectors and publishing channels, and sharing limits. Its counts differ from the Microsoft 365 registry because it only sees Power Platform-built agents.

**Copilot Studio** provides per-agent **Monitor** (formerly Analytics): sessions, resolution rates, satisfaction, topic effectiveness, autonomous run outcomes and 28 days of transcripts, shareable through the *Analytics Viewer* role.

**Purview** completes the picture: DSPM for AI *Apps and agents* shows which sensitive data each agent touched, and audit logs carry the AgentId and AgentName on every interaction. When a question asks where to see all agents in the tenant and act on ownerless ones, choose the Microsoft 365 admin center; for environment capacity and connector DLP, the Power Platform admin center; for a single agent's conversation quality, Copilot Studio.`,
    },
  ],
  examples: [
    {
      title: 'From maker to store in four steps',
      description:
        'An HR maker builds a Benefits agent in Copilot Studio with the Benefits site as knowledge and an agent flow that opens an HR case. She publishes to the Microsoft Copilot and Teams channel and ticks Make agent available in Microsoft Copilot. The AI Administrator finds it under Agents > All agents > Requests as Pending review, checks the knowledge source and the flow connector permissions, publishes to the HR and Managers groups with the default policy template, and grants admin consent. The agent appears under Built by your org in the Agent Store.',
      takeaway: 'Maker publishes, admin reviews data sources and permissions, admin publishes to an audience with a policy template.',
    },
    {
      title: 'The ownerless agent (a realistic mistake)',
      description:
        'A departing analyst had shared a Sales Insights agent with 400 colleagues. After the account is deleted the agent keeps running with stale knowledge and nobody can fix it. The Agents > Overview card shows one new ownerless agent; the admin filters the registry, assigns a new owner from the sales team, and adds a rule to flag ownerless agents automatically. Had the agent been risky, Block or Delete (restorable for 30 days) were available.',
      language: 'text',
      code: `Microsoft 365 admin center > Agents > Overview
  Agents without owners .......... 1   -> select card (filters registry)
Agents > All agents > Registry
  Filter: Publisher type = Shared by creator, Owner = (none)
  Select "Sales Insights" -> Assign a new owner -> dana@contoso.com
  (alternatives: Block | Delete (30-day restore) | Uninstall)`,
      takeaway: 'Ownerless agents are a lifecycle risk surfaced in the admin center; assigning owners and automated rules keep them governed.',
    },
    {
      title: 'Counting agents in two consoles',
      description:
        'Finance asks how many agents the company has. The Microsoft 365 admin center registry shows 312 (Microsoft, partner, SharePoint, Agent Builder, Copilot Studio drafts and published), while the Power Platform admin center inventory shows 95 (Power Platform-built only). Both are correct within scope; the admin reports the registry number for governance and the inventory number for Copilot Studio capacity planning.',
      takeaway: 'The Microsoft 365 admin center is tenant-wide across platforms; the Power Platform admin center covers Power Platform-built agents and capacity.',
    },
  ],
  keyPoints: [
    'Agent Builder (in Copilot Chat and Teams) creates declarative agents with instructions and knowledge but no actions; Copilot Studio adds tools, topics, triggers, harness choice and channels; SharePoint agents are scoped to a site or library.',
    'User access to agents is layered: licence or pay-as-you-go, tenant Agents settings and Integrated apps, per-agent Deployed to audience (just me, entire organisation, specific users or groups), install or make available, block or remove, pinning, policy templates and admin consent, plus maker-side sharing limits and Copilot Studio DLP.',
    'Approval: makers submit from Copilot Studio, the Agents Toolkit or Foundry; admins review Requests (Pending review, Pending update, Pending activate) and Publish to store (audience, policy template, permissions) or Reject; AI Administrator or Global Administrator required.',
    'Third-party agents cannot be requested or approved through the Requests flow; blocked Microsoft agents can; Researcher and Analyst never need approval.',
    'The Microsoft 365 admin center Agents workload (Agent Registry, Overview, lifecycle actions, ownerless agents, risk signals) is the tenant-wide control plane, extended by Microsoft Agent 365.',
    'The Power Platform admin center manages environments, Power Platform agent inventory, Copilot Studio capacity and credits, connector and channel DLP and sharing; Copilot Studio Monitor shows per-agent sessions, satisfaction and transcripts.',
    'The Copilot Control System pillars are security and governance, management controls (licensing, agent lifecycle, customisation) and measurement and reporting.',
  ],
  flashcards: [
    { front: 'Which agent maker tool cannot author actions?', back: 'Agent Builder; copy the agent to Copilot Studio to add connectors, flows or APIs.' },
    { front: 'Maximum length of agent instructions in Copilot Studio?', back: '8,000 characters.' },
    { front: 'What Copilot Studio option sends an agent to the Microsoft 365 admin center for approval?', back: 'Publishing to the Microsoft Copilot and Teams channel with Make agent available in Microsoft Copilot selected.' },
    { front: 'Where does an admin set which users an agent is deployed to?', back: 'Microsoft 365 admin center > Agents > All agents > agent > Users > Deployed to (Just me, Entire organization, Specific users/groups).' },
    { front: 'Name the three request states on the Requests tab.', back: 'Pending review, Pending update, Pending activate.' },
    { front: 'Which roles can approve agent requests?', back: 'AI Administrator and Global Administrator; reader roles can only view.' },
    { front: 'What does the default policy template include?', back: 'Entra ID Protection for agents, Agent ID lifecycle management, SharePoint external sharing restrictions and Purview protections, with automatic licence assignment.' },
    { front: 'How long can a deleted agent be restored?', back: '30 days.' },
    { front: 'Where do you manage Copilot Studio capacity, environments and connector DLP?', back: 'The Power Platform admin center.' },
    { front: 'Where do you review a single agent\'s session metrics and transcripts?', back: 'Copilot Studio > the agent > Monitor (Analytics), with the Analytics Viewer sharing role for others.' },
    { front: 'Why can one Copilot Studio agent appear twice in the Agent Registry?', back: 'Sharing (Shared by creator) and publishing (Published by your org) create separate lifecycle records; it is by design.' },
  ],
  quiz: [
    {
      question: 'A maker publishes a Copilot Studio agent and selects Make agent available in Microsoft Copilot. Where must the administrator go to make it available to the organisation?',
      options: [
        'Power Platform admin center > Environments',
        'Microsoft 365 admin center > Agents > All agents > Requests, then Publish to store',
        'Microsoft Purview > DSPM for AI',
        'Teams admin center > Meeting policies',
      ],
      correct: [1],
      explanation:
        'Organisation-wide publishing requires admin approval from the Requests tab. Environments manage Power Platform resources, DSPM monitors AI activity, and meeting policies are unrelated.',
    },
    {
      question: 'You need to let only the Legal department use a newly approved agent and have it appear preinstalled for them. What should you configure?',
      options: [
        'Deployed to: Specific users/groups (Legal) with the agent installed, in Agents > All agents',
        'A Conditional Access policy for Legal',
        'A Copilot Studio DLP policy',
        'A SharePoint restricted access control policy',
      ],
      correct: [0],
      explanation:
        'Per-agent deployment scopes the audience and installs the agent. Conditional Access controls sign-in, Copilot Studio DLP governs connectors and publishing, and RAC governs site access.',
    },
    {
      question: 'Which TWO statements about agent approval in the Microsoft 365 admin center are correct? (Select two)',
      options: [
        'A Global Reader can approve pending agent requests.',
        'Users can request a blocked Microsoft-built agent, and the admin can unblock and approve it from the Requests tab.',
        'When an update to an approved agent is pending, users continue to use the previous version until the update is approved.',
        'Third-party agents can be approved for installation through the Requests tab.',
      ],
      correct: [1, 2],
      explanation:
        'Microsoft agent requests and the pending-update behaviour are documented. Reader roles cannot approve, and the request and approval workflow does not cover third-party agents.',
    },
    {
      question: 'A business analyst wants to build an agent that answers from the Procurement SharePoint site and also creates purchase requests through a connector. Which tool should they use?',
      options: ['Agent Builder in Copilot Chat', 'Microsoft Copilot Studio', 'The Copilot Prompt Gallery', 'Microsoft Purview Compliance Manager'],
      correct: [1],
      explanation:
        'Actions such as connectors require Copilot Studio. Agent Builder is limited to instructions and knowledge, Prompt Gallery stores prompts, and Compliance Manager tracks regulations.',
    },
    {
      question: 'An administrator must find every agent in the tenant that no longer has an owner because its creator left, and reassign ownership. Where should they go?',
      options: [
        'Microsoft 365 admin center > Agents > Overview, then the Agents without owners card',
        'Power Platform admin center > Licensing > Copilot Studio',
        'Copilot Studio > Monitor',
        'Entra admin center > Enterprise applications',
      ],
      correct: [0],
      explanation:
        'The Agents Overview surfaces ownerless agents and filters the registry so admins can assign owners. Power Platform licensing shows capacity, Copilot Studio Monitor shows one agent\'s analytics, and enterprise applications list service principals.',
    },
    {
      question: 'Which console should an administrator use to review Copilot Studio message capacity and Copilot Credit consumption for the tenant\'s environments?',
      options: ['Microsoft 365 admin center > Reports > Usage', 'Power Platform admin center', 'Microsoft Purview portal', 'Exchange admin center'],
      correct: [1],
      explanation:
        'Capacity and credits for Copilot Studio environments are managed in the Power Platform admin center (opt-in management also exists in Microsoft 365 Cost management). Usage reports show adoption, Purview covers compliance, and Exchange is mail.',
    },
  ],
  statements: [
    { text: 'Agent Builder can add connectors and API actions to an agent.', isTrue: false, explanation: 'Agent Builder supports instructions, knowledge and skills; actions require Copilot Studio.' },
    { text: 'An agent published by a maker is visible to all users immediately, before any admin action.', isTrue: false, explanation: 'Organisation-wide availability requires admin approval; only direct sharing bypasses the Requests flow.' },
    { text: 'Admins can scope an approved agent to specific users or groups during publishing.', isTrue: true, explanation: 'The publishing wizard selects who can install and who gets it preinstalled.' },
    { text: 'Deleting an agent in the Microsoft 365 admin center is immediate and irreversible.', isTrue: false, explanation: 'Deleted agents can be restored within 30 days unless permanently deleted.' },
    { text: 'The Power Platform admin center agent inventory shows only agents built on Power Platform.', isTrue: true, explanation: 'The Microsoft 365 admin center registry is tenant-wide across platforms.' },
    { text: 'Copilot Studio Monitor retains session transcripts for 28 days.', isTrue: true, explanation: 'Aggregated metrics are available for up to 360 days; transcripts for 28.' },
    { text: 'Researcher must be approved by an administrator before users can use it.', isTrue: false, explanation: 'Researcher and Analyst are part of core Copilot Chat and are not subject to agent approval or agent settings.' },
  ],
  resources: [
    { label: 'Manage agents for Copilot in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/admin/manage-copilot-agents-integrated-apps' },
    { label: 'Agent requests and approval in the Microsoft 365 admin center', url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-requests' },
    { label: 'Governance and lifecycle actions for agents', url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-actions' },
    { label: 'Copilot controls: management controls', url: 'https://learn.microsoft.com/en-us/copilot/implement/copilot-controls-management' },
  ],
};
