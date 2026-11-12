import type { Concept } from '../../types';

export const copilotStudioGraphAndExtensibility: Concept = {
  id: 'copilot-studio-graph-and-extensibility',
  title: 'Copilot Studio, Microsoft Graph and the Build, Buy or Extend Decision',
  summary:
    'What Microsoft Copilot Studio lets a business build without code, how Microsoft Graph and Copilot connectors supply the organisational data that grounds Copilot and agents, why an integrated Microsoft AI stack reduces risk, where Dynamics 365 and other in-product Copilots fit, and how to decide whether to buy, extend or build using the Microsoft 365 Copilot extensibility framework.',
  certs: ['ab-731', 'ab-900', 'ab-100'],
  domains: ['ab-731-2', 'ab-900-3', 'ab-100-1'],
  outcomes: ['ab-731-2-1-5', 'ab-731-2-1-6', 'ab-731-2-1-7', 'ab-731-2-1-8', 'ab-731-2-1-10', 'ab-900-3-1-6', 'ab-100-1-3-3', 'ab-100-1-2-7'],
  tags: ['copilot-studio', 'microsoft-graph', 'connectors', 'agents', 'extensibility', 'dynamics-365', 'build-buy-extend'],
  difficulty: 'intermediate',
  diagram: 'copilot-extensibility-options',
  sections: [
    {
      heading: 'Microsoft Copilot Studio: agents and workflows without code',
      body: `**Microsoft Copilot Studio** is Microsoft's graphical, low-code studio for building and managing AI agents and workflows. A business analyst can describe an agent in plain language, test it, and publish it to the channels where people already work. The building blocks a leader should recognise:

- **Agents**: an AI assistant with **instructions** (what it is for and how it behaves), **knowledge** sources (SharePoint sites, websites, Dataverse, uploaded files, Microsoft Graph via connectors), **tools** (prebuilt and custom connectors to over a thousand systems, MCP servers, Power Automate and agent flows, prompts) and **triggers** so it can act when events happen, not only when asked. Agents can be given their own identity to work proactively and autonomously.
- **Topics**: designed conversation paths for structured, repeatable interactions where you want predictable wording (refund policy, HR leave rules).
- **Agent flows and workflows**: deterministic automations with human-in-the-loop steps, callable by agents as tools or run on their own.
- **Harnesses**: the engine the agent runs on. The Microsoft Copilot harness suits reasoning-heavy, multi-step work; the Customer Conversation harness suits voice and chat service with escalation to a human; the standard harness suits rule-based, topic-driven agents.
- **Channels**: Microsoft Copilot and Copilot Chat, Teams, SharePoint, websites, mobile apps, and third-party channels.
- **Operations**: analytics, evaluations with test sets, and administration (agent inventory, role-based access, cost management) in Copilot Studio and the Power Platform and Microsoft 365 admin centers.

Business use cases: an HR agent that answers policy questions from the handbook and files a leave request; an IT help-desk agent that resets passwords through a connector and escalates to a ticket; a customer-service agent on the website that answers from product manuals and hands off to a person; an autonomous order-intake agent triggered by each new order. Copilot Studio is the **extend** option in the build-buy-extend decision: it adds your knowledge and actions to Microsoft's models and orchestration while inheriting Microsoft 365 security and compliance.`,
    },
    {
      heading: 'Microsoft Graph: the data layer under every Copilot',
      body: `**Microsoft Graph** is the gateway to data and intelligence across Microsoft 365 and Microsoft Entra: mail, calendar, Teams chats and meetings, OneDrive and SharePoint files, people and organisational relationships, Planner, To Do and more, behind a single API with the user's permissions enforced on every call. It is the reason Microsoft 365 Copilot can answer "what did I agree with Dana last week" without being told where to look.

Three components matter to a leader:

- The **Microsoft Graph API** exposes the data that Copilot, Work IQ and the semantic index reason over. Any Microsoft-built or custom experience that needs organisational context uses it, always as the signed-in user.
- **Microsoft 365 Copilot connectors** (formerly Graph connectors) bring **external** content *into* Graph: ServiceNow tickets, Salesforce records, Jira, Confluence, file shares, databases. Once indexed, that content is searchable in Microsoft Search and usable as grounding by Copilot and agents, with the source system's permissions mapped across. Connectors are how you make Copilot answer questions about systems that are not Microsoft 365.
- **Microsoft Graph Data Connect** moves Graph data at scale into Azure data stores for analytics and custom AI.

For process mapping, the question "is the data in Graph?" decides the path. If a process runs on mail, Teams, SharePoint and Office files, Copilot already has what it needs. If it runs on a line-of-business system, a Copilot connector or an agent tool is required. If it needs the organisation's collaboration patterns analysed in bulk, Data Connect and Azure are the tools. Permissions follow the data in every case: Copilot never sees what the user could not open.`,
    },
    {
      heading: 'The integrated Microsoft AI solution and the wider app portfolio',
      body: `A recurring exam theme is the **benefit of an integrated solution** over a patchwork of point tools. In the Microsoft stack, identity (Entra), data protection (Purview labels, DLP, retention, audit), threat protection (Defender), device management (Intune) and governance (Copilot Control System, Agent 365, Power Platform admin center) apply uniformly to Copilot, Copilot Studio agents and Foundry apps. The risk-mitigation and safety benefits are:

- **One identity and permission model**: no separate user directory or access rules per AI tool; the user's existing permissions bound every answer.
- **Data stays in the boundary**: Enterprise Data Protection covers Copilot and Copilot Chat; prompts and responses are not used to train foundation models; residency commitments hold.
- **Responsible AI built in**: content filtering, prompt defenses and groundedness checks are part of the service rather than something each team must build.
- **Unified visibility**: Purview DSPM for AI and the Security Dashboard for AI show Copilot, agents, Foundry and third-party AI in one place, including shadow AI.
- **Lower integration cost**: agents built in Copilot Studio or Agent Builder inherit compliance automatically; custom engine agents must prove their own.

Beyond Microsoft 365, map processes to the **in-product and role-based Copilots and agents**:

- **Dynamics 365**: Copilot in Sales (meeting prep, email drafting, opportunity summaries, with a Sales Agent in Microsoft 365 Copilot), Customer Service and Contact Center (case summaries, knowledge drafting, Case Management and Customer Intent agents), Finance and Supply Chain (Account Reconciliation, Expense and Supplier Communications agents), Field Service, Business Central for small and mid-sized firms, Customer Insights for marketing journeys.
- **Power Platform**: Copilot in Power Apps, Power Automate and Power BI for makers and analysts.
- **GitHub Copilot** for developers, **Security Copilot** for analysts, Copilot in **Azure** and **Fabric** for operators and data teams.

The mapping rule: enhance individual productivity with Microsoft 365 Copilot, improve a role or system with its in-product Copilot or agent, and automate a cross-system process with Copilot Studio agents or Foundry.`,
    },
    {
      heading: 'Build, buy or extend: the extensibility framework',
      body: `Microsoft's guidance is to choose the option with the **least operational responsibility** that meets the requirement.

**Buy (use what is included).** Microsoft 365 Copilot and its prebuilt agents (Researcher, Analyst, Sales Agent, agents from the store) need no building. Choose this when the need is individual productivity over Microsoft 365 data or a common role scenario a prebuilt agent already covers.

**Extend (the Microsoft 365 Copilot extensibility framework).** Two agent types:

- **Declarative agents** use Copilot's own orchestrator and models and add your instructions, knowledge (SharePoint, connectors, Graph) and actions (APIs, connectors). Build them with **Agent Builder** in Copilot Chat (lightweight, personal or team scope), **Copilot Studio** (richer knowledge, tools, triggers, channels, governance), or pro-code with the Microsoft 365 Agents Toolkit. They inherit Microsoft 365 security, compliance and responsible AI, run inside Copilot and Teams, and are the fastest route for most internal use cases.
- **Copilot connectors and API plugins** extend what Copilot knows and can do without a separate agent.

**Build (custom engine agents).** You bring your own orchestration and models, typically hosted on Azure with Microsoft Foundry and frameworks such as the Microsoft Agent Framework or Semantic Kernel, and surface the agent in Microsoft 365, on a website or in a product. Choose this when you need specific or fine-tuned models, complex multi-system orchestration, proactive behaviour across external systems, group collaboration in Teams channels, availability outside Microsoft 365, or integration of an existing assistant. You then own hosting, cost, compliance and responsible AI.

Decision cues for the exam: "just needs our handbook and to file a request in Teams" is a declarative agent; "needs our own model and must run on the public website" is a custom engine agent; "already exists as a prebuilt agent" is buy. Cost follows the same ladder: included or licensed, then Copilot Credits for metered agents, then Azure consumption plus engineering for custom builds.`,
    },
  ],
  examples: [
    {
      title: 'The HR agent built in a week',
      description:
        'An HR director wants employees to get answers from the 300-page handbook and to submit leave requests without emailing HR. A business analyst builds a declarative agent in Copilot Studio: knowledge source is the HR SharePoint site, a Power Automate connector files the leave request in the HR system, a topic handles the legally sensitive grievance wording verbatim, and the agent is published to Teams and Copilot Chat. It inherits Microsoft 365 permissions and compliance, so no security review of a new platform is needed.',
      takeaway: 'Internal knowledge plus a simple action inside Microsoft 365 is the textbook "extend" case for a Copilot Studio declarative agent.',
    },
    {
      title: 'Building when extending would do (a realistic mistake)',
      description:
        'An IT team commissions a six-month custom engine agent on Azure to answer questions about ServiceNow tickets inside Teams. Halfway through, they discover the ServiceNow Copilot connector would have indexed the tickets into Microsoft Graph, letting Copilot and a declarative agent answer with permissions already mapped, in days rather than months. They retire the custom build and keep Foundry for the one requirement that truly needed it: a public-facing customer portal assistant.',
      takeaway: 'Ask "is the data reachable through Graph or a connector?" before building; custom engine agents are for needs the framework cannot meet.',
    },
    {
      title: 'Choosing the in-product Copilot',
      description:
        'A sales organisation wants sellers to prepare for meetings with account history, draft follow-up emails and update opportunities. Rather than building anything, it enables Copilot in Dynamics 365 Sales and the Sales Agent in Microsoft 365 Copilot, which already connect CRM records to Outlook and Teams. The integrated stack means the same Entra identity, Purview labels and audit apply to CRM-grounded answers.',
      takeaway: 'Role and system scenarios are usually "buy": the in-product Copilot already maps the process and inherits the security model.',
    },
    {
      title: 'When build is right',
      description:
        'A bank needs a loan-pre-qualification assistant on its public website, using a fine-tuned model for its credit policy, calling three external credit bureaus with strict decision rules, and escalating to a human adviser. External audience, own model, complex orchestration and proactive follow-up tick every custom engine criterion, so the team builds it on Microsoft Foundry with Foundry Agent Service and takes ownership of hosting, evaluation and responsible AI.',
      takeaway: 'Custom engine agents fit external, model-specific, multi-system scenarios; the organisation accepts the operational responsibility that comes with them.',
    },
  ],
  keyPoints: [
    'Copilot Studio is the low-code studio for agents (instructions, knowledge, tools, triggers), topics, agent flows and workflows, published to Teams, Copilot, web and other channels, with analytics, evaluations and admin controls.',
    'Microsoft Graph is the permission-enforced gateway to Microsoft 365 data that grounds Copilot; Copilot connectors bring external systems into Graph, and Data Connect exports Graph data to Azure for analytics.',
    'If a process runs on Microsoft 365 data, Copilot already has the context; if it runs on a line-of-business system, use a connector or an agent tool.',
    'An integrated Microsoft AI solution shares one identity, data protection, compliance, responsible AI and visibility layer across Copilot, agents and Foundry, cutting risk and integration cost.',
    'Map roles and systems to in-product Copilots and agents: Dynamics 365 Sales, Customer Service, Finance, Supply Chain and Business Central; Power Platform; GitHub, Security, Azure and Fabric Copilots.',
    'Buy prebuilt experiences first, extend with declarative agents (Agent Builder, Copilot Studio, Agents Toolkit) and connectors next, and build custom engine agents on Foundry only for own models, complex orchestration, external audiences or proactive multi-system behaviour.',
    'Declarative agents inherit Microsoft 365 security, compliance and responsible AI; custom engine agents must provide their own and carry hosting cost.',
  ],
  flashcards: [
    { front: 'What is Microsoft Copilot Studio?', back: 'A graphical, low-code studio for building and managing AI agents and workflows, connecting them to data and systems, and publishing them to channels such as Teams, Copilot and websites.' },
    { front: 'Name the main components of a Copilot Studio agent.', back: 'Instructions, knowledge sources, tools (connectors, MCP servers, flows, prompts), triggers, topics, and channels, running on a chosen harness.' },
    { front: 'What is a topic in Copilot Studio?', back: 'A designed conversation path with steps, questions and conditions for structured, predictable interactions.' },
    { front: 'What is Microsoft Graph?', back: 'The single, permission-enforced API gateway to Microsoft 365 and Entra data (mail, files, chats, meetings, people) that grounds Copilot and powers Work IQ.' },
    { front: 'What do Microsoft 365 Copilot connectors do?', back: 'Bring external content (ServiceNow, Salesforce, Jira, file shares) into Microsoft Graph so Copilot, Search and agents can use it with the source permissions mapped.' },
    { front: 'What is a declarative agent?', back: 'An agent that uses Copilot\'s orchestrator and models with your instructions, knowledge and actions; built in Agent Builder, Copilot Studio or the Agents Toolkit and inheriting Microsoft 365 compliance.' },
    { front: 'What is a custom engine agent?', back: 'An agent with its own orchestration and models, typically hosted on Azure with Foundry; fully customisable, can run outside Microsoft 365 and act proactively, but you own hosting, compliance and responsible AI.' },
    { front: 'Give three reasons to build a custom engine agent rather than a declarative one.', back: 'Need for your own or fine-tuned models, complex multi-system orchestration or business rules, external audience or channels (also proactive triggers and group collaboration).' },
    { front: 'Which Dynamics 365 Copilot experiences map to sales and service processes?', back: 'Copilot in Dynamics 365 Sales and the Sales Agent for sellers; Copilot in Customer Service and Contact Center with Case Management and Customer Intent agents for service.' },
    { front: 'What is the guiding principle for build, buy or extend?', back: 'Choose the option with the least operational responsibility that meets the requirement: buy, then extend, then build.' },
  ],
  quiz: [
    {
      question:
        'Employees ask HR the same policy questions daily and email to request leave. HR wants an assistant in Teams that answers from the HR SharePoint site and files leave requests in the HR system. Which approach has the LEAST operational responsibility while meeting the need?',
      options: [
        'Build a custom engine agent on Microsoft Foundry with a fine-tuned model',
        'Create a declarative agent in Copilot Studio with the SharePoint site as knowledge and a connector action to the HR system',
        'Ask employees to use Copilot Chat (Basic) with web grounding',
        'Deploy Copilot in Dynamics 365 Customer Service',
      ],
      correct: [1],
      explanation:
        'Internal knowledge plus an action inside Teams is the declarative agent case. A custom engine agent is overkill, web grounding does not know the HR site, and Dynamics 365 Customer Service is for customer cases.',
    },
    {
      question:
        'A company wants Copilot to answer questions about incident tickets stored in ServiceNow, respecting ServiceNow permissions. What should you recommend?',
      options: [
        'Export tickets to a public website so web grounding can read them',
        'Deploy a Microsoft 365 Copilot connector for ServiceNow so tickets are indexed into Microsoft Graph with permissions mapped',
        'Fine-tune a model on last year\'s tickets',
        'Give all users administrator rights in ServiceNow',
      ],
      correct: [1],
      explanation:
        'Copilot connectors bring external content into Graph with permissions. Publishing tickets to the web breaches confidentiality, fine-tuning cannot stay current or enforce permissions, and granting admin rights violates least privilege.',
    },
    {
      question: 'Which TWO are benefits of using an integrated Microsoft AI solution rather than separate point tools? (Select two)',
      options: [
        'The same Entra identity, Purview labels, DLP and audit apply across Copilot, Copilot Studio agents and Foundry apps',
        'Responsible AI controls such as content filtering and prompt defenses are built into the service',
        'Users can bypass sensitivity labels when they use an agent',
        'Prompts are shared with other tenants to improve answers',
      ],
      correct: [0, 1],
      explanation:
        'Shared identity, data protection and built-in responsible AI are the integration benefits. Labels are never bypassed and prompts never leave the tenant.',
    },
    {
      question:
        'A bank needs a loan-pre-qualification assistant on its public website using its own fine-tuned model and complex rules across three external credit systems. Which option fits?',
      options: [
        'A declarative agent built with Agent Builder in Copilot Chat',
        'A custom engine agent built on Microsoft Foundry',
        'The Researcher agent',
        'A Copilot connector',
      ],
      correct: [1],
      explanation:
        'External audience, own model and complex orchestration are the custom engine criteria. Agent Builder agents run inside Copilot with Microsoft\'s models, Researcher is a prebuilt research agent, and a connector only brings data into Graph.',
    },
    {
      question: 'A sales leader wants sellers to see account history, draft follow-ups and update opportunities from Outlook and Teams. What is the MOST appropriate first step?',
      options: [
        'Commission a custom CRM assistant on Azure',
        'Enable Copilot in Dynamics 365 Sales and the Sales Agent in Microsoft 365 Copilot',
        'Build Power Automate flows to email CRM reports daily',
        'Assign Copilot Chat (Basic) and ask sellers to paste CRM records',
      ],
      correct: [1],
      explanation:
        'The in-product Copilot and Sales Agent already map this process and inherit the security model, so "buy" applies. Custom builds and manual flows add cost without need, and pasting records does not scale.',
    },
    {
      question: 'A compliance team asks what governance declarative agents inherit compared with custom engine agents. Which statement is correct?',
      options: [
        'Declarative agents inherit Microsoft 365 security, compliance and responsible AI controls; custom engine agents must implement their own',
        'Custom engine agents inherit Microsoft 365 controls; declarative agents must implement their own',
        'Neither type is subject to Microsoft 365 controls',
        'Both types require separate hosting on Azure',
      ],
      correct: [0],
      explanation:
        'Declarative agents run on Copilot\'s orchestrator inside Microsoft 365 and inherit its controls; custom engine agents bring their own orchestration and must prove compliance. Only custom engine agents typically need separate hosting.',
    },
  ],
  statements: [
    { text: 'Copilot Studio requires professional developers to write code before an agent can be published.', isTrue: false, explanation: 'It is a low-code studio; makers can describe an agent in plain language and configure knowledge, tools and channels graphically.' },
    { text: 'Microsoft Graph enforces the signed-in user\'s permissions on every data request.', isTrue: true, explanation: 'That is why Copilot and agents only surface what the user could already open.' },
    { text: 'Copilot connectors move Microsoft 365 data out to external systems.', isTrue: false, explanation: 'Connectors work inbound, bringing external content into Microsoft Graph; Data Connect exports Graph data to Azure.' },
    { text: 'Declarative agents use Copilot\'s own orchestrator and foundation models.', isTrue: true, explanation: 'You add instructions, knowledge and actions; Microsoft supplies the engine and compliance.' },
    { text: 'Custom engine agents can run on a public website outside Microsoft 365.', isTrue: true, explanation: 'Availability outside Microsoft 365 is one of the reasons to choose a custom engine agent.' },
    { text: 'Microsoft recommends building custom agents first and using prebuilt Copilot experiences only if the build fails.', isTrue: false, explanation: 'The guidance is buy, then extend, then build, choosing the least operational responsibility that meets the need.' },
    { text: 'Dynamics 365 includes Copilot experiences and agents for sales, customer service, finance and supply chain.', isTrue: true, explanation: 'In-product Copilots and agents such as Sales Agent, Case Management Agent and Account Reconciliation Agent exist across Dynamics 365 apps.' },
  ],
  resources: [
    { label: 'What is Microsoft Copilot Studio?', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio' },
    { label: 'Overview of Microsoft Graph', url: 'https://learn.microsoft.com/en-us/graph/overview' },
    { label: 'Agents for Microsoft 365 Copilot overview (declarative vs custom engine)', url: 'https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agents-overview' },
    { label: 'Agents, Copilot and AI in Dynamics 365', url: 'https://learn.microsoft.com/en-us/dynamics365/copilot/' },
  ],
};
