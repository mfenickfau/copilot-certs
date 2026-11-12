import type { Concept } from '../../types';

export const agentSolutionPlanning: Concept = {
  id: 'agent-solution-planning',
  title: 'Planning an Enterprise Agent Solution in Copilot Studio',
  summary:
    'How to plan a Copilot Studio agent before you build it: which harness and integration pattern fits, which identity model the channels force on you, how responsible-AI, security and governance controls are layered, and how to design for reuse and for internal versus external audiences.',
  certs: ['ab-620', 'ab-731'],
  domains: ['ab-620-1', 'ab-731-2'],
  outcomes: [
    'ab-620-1-1-1',
    'ab-620-1-1-2',
    'ab-620-1-1-3',
    'ab-620-1-1-4',
    'ab-620-1-1-5',
    'ab-620-1-1-6',
    'ab-620-1-1-7',
    'ab-731-2-1-5',
  ],
  tags: ['copilot-studio', 'architecture', 'authentication', 'channels', 'governance', 'responsible-ai', 'component-collections'],
  difficulty: 'intermediate',
  diagram: 'copilot-studio-agent-anatomy',
  sections: [
    {
      heading: 'Anatomy of an agent and the integration decision',
      body: `A Copilot Studio agent is a bundle of **instructions**, **knowledge sources**, **tools** (connectors, agent flows, prompts, REST APIs, MCP servers, computer use), **topics**, **triggers**, **connected or child agents** and **channels**, executed by an **orchestrator** on a **harness**. Microsoft now describes three harnesses: the **standard harness** (rule-based agents, topics and agent flows, generative or classic orchestration), the **Microsoft Copilot harness** (reasoning-heavy, multi-step work with files, skills and memory, billed in Copilot Credits) and the **Customer Conversation harness** (contact-centre style voice and chat with escalation). AB-620 is about the standard harness: topics, generative answers nodes, agent flows and the Tools page.

Planning integration with enterprise systems means picking the right primitive for each system:

| Need | Primitive |
|---|---|
| Ground answers in indexed documents, tickets, wikis | Knowledge: SharePoint, Dataverse, **Copilot connectors** (Graph index), **Azure AI Search** |
| Live lookups and transactions without copying data | **Power Platform connector** as a tool, or as real-time knowledge (preview) |
| Your own REST API | **REST API tool** (OpenAPI) or a **custom connector** |
| A system that already exposes an **MCP server** | MCP tool |
| A system with no API, only a UI | **Computer use** |
| Deterministic, multi-step automation with approvals | **Agent flow** |
| Another agent (Foundry, Fabric, A2A, Copilot Studio) | **Connected agent**; small internal sub-tasks as **child agents** |

Write down the owner of each system, the identity it accepts, its latency, and whether data may leave it. Those four facts decide the primitive, the authentication mode and the data policy work you will need.`,
    },
    {
      heading: 'Identity strategy: three authentication options and two credential modes',
      body: `Under **Settings > Security > Authentication** an agent uses one of three options, and the choice constrains everything downstream:

- **No authentication**: anyone with the link can chat. Only public data; **tools cannot run with user credentials**, Dataverse knowledge is unavailable, and sharing cannot restrict who chats. Blocked when a Power Platform data policy requires authentication.
- **Authenticate with Microsoft** (default): Microsoft Entra ID single sign-on for Teams, SharePoint, Power Apps and Microsoft 365 Copilot with no setup. Exposes \`User.Id\` and \`User.DisplayName\` (and \`User.IsLoggedIn\` in the web app) but **not** \`User.AccessToken\`. Required for the built-in Teams + Microsoft 365 channel and for **Tenant graph grounding with semantic search**.
- **Authenticate manually**: Entra ID V2 (client secret, certificate or federated credentials) or any **generic OAuth 2.0** provider. Exposes \`User.AccessToken\`, enables the **Authenticate** node in topics, **Require users to sign in**, SSO for web and Teams, and is the only option for custom websites that need sign-in. Admins can lock this option with a Power Platform control.

Separately, every **tool** runs with either **End user credentials** (the agent prompts the user to connect; data access stays scoped to that user) or **Maker-provided credentials** (the author's connection; appropriate for shared, low-risk resources, risky for anything personal). Event **triggers** can only use maker credentials. For a maker to call a custom API on behalf of the user, the custom connector uses **On-Behalf-Of (OBO)** authentication with delegated Entra permissions.

For organisational identity, agents can be represented as **Microsoft Entra Agent IDs** and governed through **Microsoft Agent 365** with Conditional Access and access governance. Authentication changes take effect only after you **publish**.`,
    },
    {
      heading: 'Channels, deployment and audiences',
      body: `You **publish** once and then connect channels: Teams and Microsoft 365 Copilot, SharePoint, demo and custom websites, mobile and custom apps (Microsoft 365 Agents SDK or Direct Line), WhatsApp, Facebook, Azure Bot Service channels (Slack, Telegram, Twilio and others), Dynamics 365 Customer Service and voice. Admins can disable channels per environment with **Agent access channels** and data policies in the Power Platform admin center; a blocked channel shows as disabled with an information icon explaining why.

Channel choice and identity are coupled:

- Microsoft channels (Teams, SharePoint, Microsoft 365 Copilot) require a signed-in Entra user, so **No authentication** agents cannot be published there.
- A public **website FAQ** for anonymous customers uses No authentication; a **customer portal** that needs sign-in uses Authenticate manually with a generic OAuth provider or Entra External ID.
- Partners publishing to the global Teams store use **multitenant mode (preview)**, where users from other tenants reach a host-tenant agent; transcripts are off and custom connectors, MCP, computer use and agent flows are unsupported.
- Published content reaches users when a **new session** starts (about 30 minutes of inactivity in most channels); type **start over** in Teams to pick it up immediately.

Design for the audience: internal agents can lean on Microsoft Graph knowledge, user credentials and Teams; external agents need deterministic topics for sensitive flows, higher content moderation, a privacy statement, hand-off to a live agent and nothing that only works with maker credentials.`,
    },
    {
      heading: 'Responsible AI, security and governance layers',
      body: `Responsible AI for an agent is a set of concrete settings rather than a policy document:

- **Content moderation** at agent level (Generative AI settings), per **generative answers node** and per **prompt**; the topic-level setting wins at runtime. Default is High.
- **Allow ungrounded responses** off blocks answers that used no knowledge source or tool.
- **Allow the AI to use its own general knowledge** and **Web search** are explicit opt-ins.
- **Ask the end user before running** on a tool, approval stages in agent flows and **human supervision** for computer use keep a human in the loop.
- Agent evaluation includes **content safety** evaluators (hate and unfairness, sexual, violence, self-harm).
- Tell users when AI generates questions, for example in the Conversation Start topic.

Governance controls live mostly in the **Power Platform admin center**: **data policies** that govern connectors, knowledge sources, HTTP requests, channels, Application Insights and triggers; **environment routing** and maker welcome messages; **customer-managed keys**; **Virtual Network** support for outbound connections and IP firewalls for inbound; **transcript retention**; and an **agent inventory**. In the product, makers see the **automatic security scan**, **agent runtime protection status** and pre-publish warnings. Maker and runtime audit logs flow to **Microsoft Purview** and can be alerted on in **Microsoft Sentinel**; **Microsoft Agent 365** adds a central inventory and Entra-based network controls. Agents that use generative AI can be prevented from publishing tenant-wide, and data movement outside the US geography can be disabled.`,
    },
    {
      heading: 'Reusable components and the exam angle',
      body: `Three mechanisms give you reuse, and the exam expects you to pick the right one:

- **Component collections** move topics, knowledge, tools, child agents, MCP connectors, connectors, flows and entities into a shared, versioned managed solution that any connected agent in the environment can use but not edit. Set a **primary agent** to lock a collection to one agent and to exclude dependencies.
- **Connected agents** make a whole published agent reusable by other agents (turn on **Let other agents connect to and use this one**); **child agents** are lightweight groupings inside one agent and are not reusable across agents.
- **Solutions** with **environment variables** and **connection references** are the unit of ALM across environments; the **Tools** page also hosts shared tools created once and added to many agents.

Exam patterns: a question that names Teams or Microsoft 365 Copilot and asks for the minimum authentication work points to **Authenticate with Microsoft**; one that needs \`User.AccessToken\` or a non-Microsoft identity provider points to **Authenticate manually**; one about blocking a connector or channel for all makers points to a **data policy**, not an agent setting; one about anyone being able to chat points to **No authentication** combined with a public channel. Distractors are typically a control that acts at a different layer (Conditional Access instead of agent authentication, DLP instead of content moderation, a child agent instead of a component collection).`,
    },
  ],
  examples: [
    {
      title: 'Picking primitives for a field-service agent',
      description:
        'Contoso wants a Teams agent for technicians that answers questions from 40,000 ServiceNow knowledge articles, shows the live status of a ticket, creates tickets, and runs a nightly reconciliation in a legacy desktop app that has no API. The architect maps each need: ServiceNow KB through the ServiceNow Copilot connector (indexed, cited, permission-trimmed); ticket status and creation through the ServiceNow Power Platform connector as tools with end-user credentials; the desktop reconciliation through a computer use tool on a dedicated machine, triggered by a scheduled agent flow with maker credentials. Authentication is Authenticate with Microsoft because the only channel is Teams.',
      takeaway: 'Match each system to a primitive by asking: indexed knowledge or live transaction, API or UI only, user identity or maker identity.',
    },
    {
      title: 'The anonymous website agent that stopped working (a realistic mistake)',
      description:
        'A maker builds an HR benefits agent with Dataverse knowledge and an Outlook connector tool, tests it in Copilot Studio, then switches authentication to No authentication so it can go on the public intranet page. Publishing succeeds, but the tool fails and the Dataverse knowledge disappears from the agent. Agents without authentication cannot run tools with user credentials or use Dataverse as knowledge. The fix is to keep Authenticate with Microsoft and publish to SharePoint or Teams, or use Authenticate manually with Entra ID and configure web SSO if it must live on a custom site.',
      code: `Settings > Security > Authentication
  (x) Authenticate with Microsoft      -> Teams, SharePoint, M365 Copilot SSO; no User.AccessToken
  ( ) Authenticate manually            -> Entra ID V2 / generic OAuth 2.0; User.AccessToken, Authenticate node
  ( ) No authentication                -> anyone with the link; no user-credential tools, no Dataverse knowledge`,
      language: 'text',
      takeaway: 'Authentication is a solution decision, not a last-minute toggle; it decides which knowledge, tools and channels are even possible.',
    },
    {
      title: 'Governing a tenant-wide rule',
      description:
        'Security asks that no Copilot Studio agent in production may call the Send an HTTP request node or publish to Facebook. A junior maker proposes documenting the rule in a wiki. The architect instead creates a Power Platform data policy scoped to the production environments that blocks HTTP requests and the Facebook channel; makers then see those options disabled with an explanation icon, and the automatic security scan flags any agent that already violates it.',
      takeaway: 'Tenant-wide restrictions belong in Power Platform data policies, which are enforced in the maker experience, not in agent-by-agent settings.',
    },
    {
      title: 'Sharing a vetted set of topics across ten agents',
      description:
        'A central team maintains the escalation, privacy-notice and feedback topics that every departmental agent must include. They create a component collection containing those topics and a hand-off flow, share it with the environment, and each departmental agent connects to it. Authors in departments can use the components but cannot alter them; the central team republishes the collection when the privacy wording changes.',
      takeaway: 'Component collections are the reuse mechanism for shared building blocks; child agents are for structuring one agent, and connected agents for reusing whole agents.',
    },
  ],
  keyPoints: [
    'Standard-harness agents combine instructions, knowledge, tools, topics, triggers, child/connected agents and channels under generative or classic orchestration.',
    'Three authentication options: No authentication (public, no user-credential tools or Dataverse knowledge), Authenticate with Microsoft (Entra SSO for Microsoft channels, no access token), Authenticate manually (Entra or generic OAuth 2.0, User.AccessToken, Authenticate node).',
    'Each tool additionally runs with end-user or maker-provided credentials; triggers always use maker credentials; OBO lets custom connectors act on behalf of the user.',
    'Microsoft channels (Teams, SharePoint, Microsoft 365 Copilot) require authenticated users; publishing applies to all channels and reaches users on the next session.',
    'Responsible AI is implemented through content moderation levels, grounding settings, confirmation prompts, approvals, human supervision and safety evaluators.',
    'Governance is enforced in the Power Platform admin center (data policies, channel controls, CMK, VNet, transcripts, inventory) and audited through Purview, Sentinel and Agent 365.',
    'Reuse: component collections for shared components, connected agents for whole agents, solutions with environment variables for ALM.',
    'External audiences need deterministic topics, higher moderation, privacy statements and nothing that depends on maker credentials or internal-only knowledge.',
  ],
  flashcards: [
    { front: 'Which authentication option exposes User.AccessToken?', back: 'Authenticate manually. Authenticate with Microsoft exposes only User.Id and User.DisplayName (plus User.IsLoggedIn in the web app).' },
    { front: 'An agent must be published to Teams and Microsoft 365 Copilot with the least configuration. Which authentication option?', back: 'Authenticate with Microsoft, which configures Entra ID SSO for Teams, SharePoint, Power Apps and Microsoft 365 Copilot automatically.' },
    { front: 'What can a No authentication agent not do?', back: 'Run tools with user credentials, use Dataverse tables as knowledge, restrict who can chat through sharing, or publish to Microsoft channels that require a signed-in user.' },
    { front: 'Where do admins block a connector, channel or HTTP requests for every agent in an environment?', back: 'In a data policy in the Power Platform admin center.' },
    { front: 'What is a component collection?', back: 'A versioned managed solution of reusable agent components (topics, knowledge, tools, child agents, MCP connectors, connectors, flows, entities) that connected agents can use but not edit.' },
    { front: 'Which credential mode do event triggers use?', back: 'Only the agent maker\'s (author) credentials.' },
    { front: 'Name the three Copilot Studio harnesses.', back: 'Standard harness (topics, agent flows, rule-based), Microsoft Copilot harness (reasoning-heavy, files, skills, memory, Copilot Credits), Customer Conversation harness (voice and chat contact-centre agents).' },
    { front: 'Which setting at runtime decides content moderation when both agent and generative answers node define one?', back: 'The topic (node) level setting takes precedence over the agent level.' },
    { front: 'What does multitenant mode (preview) allow?', back: 'Users from another Entra tenant to use an agent hosted in your tenant via Teams or Microsoft 365 Copilot; transcripts are disabled and custom connectors, MCP, computer use and agent flows are not supported.' },
    { front: 'Where do makers see an agent\'s security posture before publishing?', back: 'The automatic security scan warnings and the agent runtime protection status on the Agents page.' },
  ],
  quiz: [
    {
      question:
        'You are designing a Copilot Studio agent for Contoso employees. It must be published to Microsoft Teams and Microsoft 365 Copilot, and tools must run with each user\'s own permissions. You want the least configuration effort. Which authentication option should you select?',
      options: [
        'No authentication',
        'Authenticate with Microsoft',
        'Authenticate manually with a generic OAuth 2.0 provider',
        'Authenticate manually with Microsoft Entra ID and Require users to sign in',
      ],
      correct: [1],
      explanation:
        'Authenticate with Microsoft sets up Entra SSO for Teams and Microsoft 365 Copilot automatically and allows end-user credentials on tools. No authentication cannot publish to Teams or run user-credential tools. Manual options work but require app registrations and SSO configuration, so they are not the least effort.',
    },
    {
      question:
        'A topic must call a custom back-end API using the signed-in user\'s OAuth access token stored in User.AccessToken. The agent is embedded in a customer website. Which authentication configuration is required?',
      options: [
        'Authenticate with Microsoft, because it is the default',
        'No authentication, with the token passed in a global variable',
        'Authenticate manually, which exposes User.AccessToken and the Authenticate node',
        'Tenant graph grounding with semantic search',
      ],
      correct: [2],
      explanation:
        'Only Authenticate manually exposes User.AccessToken and the Authenticate node. Authenticate with Microsoft does not provide the token, No authentication has no user identity, and tenant graph grounding is a knowledge setting unrelated to tokens.',
    },
    {
      question:
        'The security team requires that no agent in the production environment can use the Send an HTTP request node or publish to Facebook. What should you do?',
      options: [
        'Turn off the HTTP node and Facebook channel in each agent\'s settings and document the rule',
        'Create a Power Platform data policy scoped to the production environments that blocks HTTP requests and the Facebook channel',
        'Set every agent to Authenticate with Microsoft',
        'Create a component collection that excludes the HTTP node',
      ],
      correct: [1],
      explanation:
        'Data policies in the Power Platform admin center govern HTTP requests and channel publication for all agents in the scoped environments, and the maker UI shows the blocked items as disabled. Per-agent settings are not enforceable, authentication does not restrict nodes or channels, and component collections share components rather than restrict features.',
    },
    {
      question:
        'Which TWO statements about reuse in Copilot Studio are correct? (Select two)',
      options: [
        'A component collection packages topics, tools, knowledge and flows as a managed solution that connected agents can use but not edit',
        'A child agent can be connected to and reused by several different main agents',
        'An existing published agent in the same environment can be connected to a main agent if "Let other agents connect to and use this one" is on',
        'Component collections can only contain topics',
      ],
      correct: [0, 2],
      explanation:
        'Component collections are versioned managed solutions of many component types, and connected agents reuse whole published agents in the same environment. Child agents live inside a single agent and are not reusable across agents, and collections include tools, knowledge, flows, connectors, MCP connectors, child agents and entities, not just topics.',
    },
    {
      question:
        'An ISV wants its Copilot Studio agent, hosted in its own tenant, to be usable by customers in their tenants through the Teams store. Which feature supports this?',
      options: [
        'Multitenant mode (preview)',
        'Authenticate with Microsoft',
        'Environment routing',
        'Customer-managed encryption keys',
      ],
      correct: [0],
      explanation:
        'Multitenant mode lets users from other Entra tenants access a host-tenant agent in Teams and Microsoft 365 Copilot. Authenticate with Microsoft alone keeps the agent single-tenant, environment routing is a maker governance feature, and CMK concerns encryption.',
    },
    {
      question:
        'A public-facing agent for Fabrikam\'s website must answer only from approved content and never from the model\'s own knowledge. Which configuration is MOST appropriate?',
      options: [
        'Turn off Allow ungrounded responses and Allow the AI to use its own general knowledge, and set content moderation to High or above',
        'Enable Web search so the agent has more sources',
        'Switch the agent to maker-provided credentials for all tools',
        'Publish the agent with Authenticate with Microsoft',
      ],
      correct: [0],
      explanation:
        'Grounding controls and moderation levels implement the responsible-AI requirement. Web search widens sources beyond approved content, credential mode concerns tool identity, and Authenticate with Microsoft would prevent anonymous website visitors from using the agent.',
    },
  ],
  statements: [
    { text: 'An agent set to No authentication can still run tools with end-user credentials.', isTrue: false, explanation: 'Without authentication there is no user identity; tools cannot use user credentials and Dataverse knowledge is unavailable.' },
    { text: 'Authenticate with Microsoft provides Entra ID SSO for Teams, SharePoint, Power Apps and Microsoft 365 Copilot without manual setup.', isTrue: true, explanation: 'It is the default option and requires no app registration.' },
    { text: 'Event triggers can be configured to run with the end user\'s credentials.', isTrue: false, explanation: 'Triggers can only use the agent author\'s (maker) credentials.' },
    { text: 'Content moderation can be set at agent, generative answers node and prompt level, with the topic-level setting taking precedence.', isTrue: true, explanation: 'The node setting overrides the agent setting at runtime; prompts can override via their Completion setting.' },
    { text: 'Published changes reach users in an existing Teams conversation immediately.', isTrue: false, explanation: 'New content applies when a new session starts; users can type "start over" to force it.' },
    { text: 'Power Platform data policies can govern knowledge sources, connectors, HTTP requests, channels, Application Insights and triggers for Copilot Studio agents.', isTrue: true, explanation: 'These are the categories listed in the security and governance key concepts.' },
    { text: 'In multitenant mode, custom connectors, MCP tools and agent flows work the same as in single-tenant mode.', isTrue: false, explanation: 'They are not supported in multitenant mode during preview.' },
  ],
  resources: [
    { label: 'Configure user authentication in Copilot Studio', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication' },
    { label: 'Key concepts - Copilot Studio security and governance', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance' },
    { label: 'Key concepts - Publish and deploy your agent', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels' },
    { label: 'Create and share reusable component collections', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-export-import-copilot-components' },
  ],
};
