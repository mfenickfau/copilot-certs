import type { Concept } from '../../types';

export const dynamics365FinanceSupplyChainAi: Concept = {
  id: 'dynamics-365-finance-supply-chain-ai',
  title: 'AI in Dynamics 365 Finance and Supply Chain, and Multi-App Solutions',
  summary:
    'Orchestrating Copilot and agents in the finance and operations apps: the Copilot for finance and operations apps agent in Copilot Studio, adding knowledge to generative help and guidance, extending agent chats with finance and operations data and other knowledge sources, deploying Microsoft-provided ERP agents, and designing AI solutions that span several Dynamics 365 apps on a Dataverse backbone.',
  certs: ['ab-100'],
  domains: ['ab-100-1', 'ab-100-2'],
  outcomes: ['ab-100-1-2-13', 'ab-100-2-3-1', 'ab-100-2-3-6', 'ab-100-2-3-7'],
  tags: ['dynamics-365', 'finance', 'supply-chain', 'finance-and-operations', 'copilot-studio', 'virtual-entities', 'dual-write', 'erp-mcp'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'How Copilot works in finance and operations apps',
      body: `Copilot in the finance and operations apps (Dynamics 365 Finance, Supply Chain Management, Commerce, Project Operations, Human Resources) appears in three shapes: a **sidecar** chat alongside the application (the primary interface, which hosts **generative help and guidance** and **chat with finance and operations data**), **embedded** AI inside specific pages (for example the *Confirmed purchase orders with changes* workspace, workflow history summaries, Immersive Home), and **outside** experiences such as Microsoft 365 Copilot and Copilot Cowork reaching ERP data through the Dynamics 365 ERP apps plugin and skills.

Architecturally, the sidecar is bound to a single Copilot Studio agent named **Copilot for finance and operations apps**, deployed by the **msdyn_FnoCopilot** solution into the Dataverse environment linked to the finance and operations environment. The client embeds the same AI Copilot control used in canvas and model-driven apps; prompts go to Copilot Studio, which determines intent, selects topics or tools, runs them and returns a natural-language answer. Generative orchestration is supported for this agent but not enabled by default; turn it on when you add capabilities that need it.

Capabilities are added as **tools** (previously called plugins): **client plugins** that perform actions in the user interface, **AI tools with X++ business logic**, **low-code plugins** built in Copilot Studio with Power Automate and AI Builder, and, increasingly, the **Dynamics 365 ERP MCP server**, which exposes finance and operations data operations and business logic to any compatible agent platform with consistent permissions and auditability. **Business events** can trigger autonomous agents, and the **Agent feed** in Immersive Home surfaces agent-created work items as secured, ranked cards.

Prerequisites an architect checks before any of this: a supported version (10.0.44 or later for agent management and Immersive Home; 10.0.47 for several newer features), a **linked Dataverse environment**, the Copilot feature flag on in the Power Platform admin center, the Copilot solution installed, **Copilot Credits** allocated to the environment through Billing > Licenses, and the relevant features enabled in **Feature management**.`,
    },
    {
      heading: 'Adding knowledge to in-app help and guidance',
      body: `**Generative help and guidance with Copilot** is grounded by default in Microsoft's published product documentation for finance and operations apps, respecting each user's language preference. AB-100 asks you to recommend the process for adding your organisation's own knowledge, for example implementation guides, process documents and training material.

The process:
1. Enable generative help and guidance in Feature management and confirm the Copilot for finance and operations apps agent is installed.
2. Open **Copilot Studio** and select the Dataverse environment associated with the finance and operations environment.
3. Open **Agents > Copilot for finance and operations apps**.
4. On the **Knowledge** tab, select **Add knowledge** and **upload files** (PDF, RTF, Word). These feed the out-of-box **conversational boosting topic**, which uses generative answers over the attached sources. Wait for the status to show **Ready**.
5. **Test** with representative questions, then **Publish**. Users must start a new Copilot session to see new knowledge.
6. Optionally enable **AI general knowledge** (model knowledge and Bing web content) so Copilot can answer general questions after exhausting custom sources. It is off by default and increases the risk of incorrect content, so test carefully before production.

Constraints: other knowledge types such as **SharePoint** require you to add your own topic in the agent rather than attaching them to the out-of-box topic; **Dataverse virtual entities are not currently supported as knowledge for help and guidance**; content volume is limited by knowledge type; and because the out-of-box topic assumes all knowledge relates to product functionality, unrelated documents can produce misleading answers. Governance: keep help content in a controlled library with owners, use the same solution-based ALM you use for other Copilot Studio customisations, and remove superseded guides.`,
    },
    {
      heading: 'Interoperable agent chats with additional knowledge sources',
      body: `Beyond help text, users want to **ask questions about their ERP data** and have other agents reuse the same knowledge. The design pattern is **finance and operations data as Dataverse knowledge**:

- Enable **virtual entities** for finance and operations apps in the linked Dataverse environment. They appear as Dataverse tables with the **mserp_** prefix (for example mserp_inventoryonhandaientity) and support CRUD where allowed, so the agent reads live data with the user's permissions.
- Alternatively **synchronise** data to native Dataverse tables with **dual-write**, which keeps finance and operations and the customer engagement apps in near-real-time sync and makes the data available to any agent as a Dataverse knowledge source.
- Add the tables as **Dataverse knowledge** to the Copilot for finance and operations apps agent (so the in-app sidecar answers "how much stock do we have for item M0001 per company?"), to **custom Copilot Studio agents**, or to a **declarative agent** published to Microsoft 365 Copilot so employees can ask ERP questions from Copilot Chat.
- Combine with **unstructured** sources (SharePoint procedures, uploaded policies) and **external** sources through Copilot connectors so one agent explains both the number and the policy behind it.
- For actions and richer tool access use the **Dynamics 365 ERP MCP server**, which also works from Foundry and Visual Studio Code, and the Dataverse MCP server for customer engagement data.

Interoperability considerations: respect **security roles** (virtual entities enforce finance and operations security), watch **query performance** on large tables (prefer AI-ready entities designed for aggregation), keep **regional data movement** settings consistent across the Dataverse and finance and operations environments, and track **Copilot Credit** consumption, since Dataverse grounding and generative answers are billed. Where the Microsoft 365 Copilot licence covers the user, in-tenant employee usage is included.`,
    },
    {
      heading: 'Microsoft-provided ERP agents and multi-app Dynamics 365 design',
      body: `Microsoft ships finance and supply chain agents as **managed solutions** deployed through the **agent deployment wizard** in the Power Platform admin center **Copilot Hub (Dynamics 365)**: the **Supplier Communications Agent** (procurement), **Account Reconciliation agent**, **Expense agent**, **Time agent** and **Approvals agent**, each with its own post-deployment configuration and security roles. The wizard validates environment readiness, applies configuration, deploys and monitors status. Inside finance and operations, the **Agent management** feature (Immersive Home, Agents page with Manage and Library tabs, Agent activity) lets administrators discover, activate and supervise agents. Autonomous agents here always pair with human review in Immersive Home or the agent feed.

**Designing solutions across multiple Dynamics 365 apps** is where AB-100 expects architecture judgement. Patterns:
- **Dataverse as the hub.** Sales, Customer Service, Field Service and Customer Insights already run on Dataverse; finance and operations joins through virtual entities and dual-write. One Copilot Studio agent (or a coordinator with connected agents) can then reason over leads, cases, orders and invoices.
- **Lead-to-cash.** Sales Qualification and Opportunity agents in Sales create the opportunity; an order agent uses the ERP MCP server to create the sales order in Supply Chain Management; finance agents reconcile and chase payment; Copilot Cowork gives sellers and finance one view.
- **Case-to-resolution with supply chain.** A Customer Service case about a late delivery triggers a Copilot Studio autonomous agent that queries on-hand inventory and shipment status through virtual entities, drafts a customer response for the representative, and raises a return order if needed.
- **Shared knowledge and vocabulary.** Reuse glossary terms, policies and prompt actions across the apps' Copilots so "credit hold" means the same thing in Sales and Finance.
- **Governance spans apps**: one environment strategy (the finance and operations environment is linked to exactly one Dataverse environment), one ALM pipeline for solutions, consistent data policies and credit allocation, and Agent 365 registry entries for every agent.

Exam cue: when a scenario names two Dynamics 365 apps, the answer usually involves Dataverse integration (virtual entities or dual-write), a Copilot Studio agent orchestrating across them, and the ERP or Dataverse MCP server for actions, not point-to-point custom APIs.`,
    },
  ],
  examples: [
    {
      title: 'Teaching in-app help the company way of posting journals',
      description:
        'Accountants ask the finance and operations Copilot how to post intercompany journals and get Microsoft\'s generic answer rather than the company\'s approval steps. The architect uploads the controller\'s PDF procedure to the Copilot for finance and operations apps agent in Copilot Studio, tests ten typical questions, publishes, and leaves AI general knowledge disabled. Help answers now cite the internal procedure first and the product documentation second.',
      takeaway: 'Add custom knowledge to the finance and operations Copilot agent through Copilot Studio; keep general knowledge off unless tested and accepted.',
    },
    {
      title: 'Virtual entity added to the wrong environment (a realistic mistake)',
      description:
        'A team enables virtual entities in a sandbox Dataverse environment that is not the one linked to the production finance and operations environment, then wonders why the mserp_ tables are missing from Copilot Studio\'s knowledge picker. Each finance and operations environment is linked to exactly one Dataverse environment; the fix is to enable the entities and author the agent in the linked environment and move changes with solutions.',
      takeaway: 'Finance and operations Copilot customisation lives in the linked Dataverse environment; check the Power Platform Integration details in Lifecycle Services first.',
    },
    {
      title: 'Deploying the Supplier Communications Agent',
      description:
        'A procurement director wants suppliers chased automatically for confirmations. Rather than building from scratch, the architect uses the agent deployment wizard in the Power Platform admin center Copilot Hub to validate the environment, deploy the Supplier Communications Agent as a managed solution, assign security roles, allocate Copilot Credits, and activate it from Immersive Home with buyers reviewing drafted emails before sending.',
      takeaway: 'Prefer Microsoft-provided ERP agents deployed through the wizard, with human review configured in the app.',
    },
    {
      title: 'A late-delivery case across Customer Service and Supply Chain',
      description:
        'A retailer designs a Copilot Studio autonomous agent triggered when a Customer Service case is tagged "late delivery". It reads shipment and on-hand data through finance and operations virtual entities, checks the customer\'s entitlement in Dataverse, drafts a response and a goodwill credit proposal for the representative, and, on approval, creates a return order through the Dynamics 365 ERP MCP server.',
      takeaway: 'Multi-app solutions run on Dataverse integration plus a Copilot Studio agent that uses MCP servers for cross-app actions with human approval.',
    },
  ],
  keyPoints: [
    'Finance and operations Copilot appears as a sidecar (help and guidance, chat with data), embedded features and outside experiences (Microsoft 365 Copilot, Cowork), all orchestrated by the Copilot for finance and operations apps agent in Copilot Studio (msdyn_FnoCopilot).',
    'Prerequisites: supported version, a linked Dataverse environment, the Copilot feature flag in the Power Platform admin center, the Copilot solution installed, Copilot Credits allocated and features enabled in Feature management.',
    'Add knowledge to generative help by uploading files to the Copilot for finance and operations apps agent in Copilot Studio (conversational boosting topic), test, publish; SharePoint needs a custom topic; virtual entities are not supported for help; AI general knowledge is off by default.',
    'Chat with finance and operations data by adding virtual entities (mserp_ tables) or dual-write-synchronised Dataverse tables as Dataverse knowledge to the in-app agent, custom agents or a Microsoft 365 Copilot declarative agent.',
    'The Dynamics 365 ERP MCP server exposes ERP data operations and business logic to Copilot Studio, Foundry and other MCP clients with consistent permissions and auditability.',
    'Microsoft-provided ERP agents (Supplier Communications, Account Reconciliation, Expense, Time, Approvals) deploy as managed solutions via the agent deployment wizard in the Power Platform admin center Copilot Hub and are managed from Immersive Home.',
    'Multi-app Dynamics 365 designs use Dataverse as the hub (virtual entities, dual-write), a Copilot Studio agent orchestrating across apps, MCP servers for actions and shared vocabulary and governance.',
  ],
  flashcards: [
    { front: 'Which Copilot Studio agent powers the finance and operations sidecar, and which solution deploys it?', back: 'Copilot for finance and operations apps, deployed by the msdyn_FnoCopilot solution into the linked Dataverse environment.' },
    { front: 'Which file types can you upload to extend generative help and guidance?', back: 'PDF, RTF and Word files, added as knowledge to the Copilot for finance and operations apps agent in Copilot Studio.' },
    { front: 'How do you add SharePoint content to finance and operations help and guidance?', back: 'Create your own topic in the Copilot for finance and operations apps agent that uses the SharePoint knowledge source; the out-of-box topic only takes uploaded files.' },
    { front: 'Is AI general knowledge enabled by default for finance and operations help?', back: 'No. It is disabled by default and should be tested carefully because it increases the risk of incorrect answers.' },
    { front: 'What prefix identifies finance and operations virtual entities in Dataverse?', back: 'mserp_, for example mserp_inventoryonhandaientity.' },
    { front: 'Two ways to make finance and operations data available as Dataverse knowledge?', back: 'Virtual entities (live) or dual-write synchronisation into native Dataverse tables.' },
    { front: 'Where is the agent deployment wizard for Dynamics 365 ERP agents?', back: 'Power Platform admin center, Copilot Hub, Dynamics 365; it deploys managed-solution agents such as Supplier Communications and Account Reconciliation.' },
    { front: 'What is Immersive Home?', back: 'An AI-first landing page in finance and operations apps (10.0.44+) for working with agents, the agent feed and prioritised work items; it is a prerequisite for Agent management.' },
    { front: 'What does the Dynamics 365 ERP MCP server provide?', back: 'Standardised tools for data operations and business logic of finance and operations apps usable by Copilot Studio, Foundry, Visual Studio Code and other MCP clients.' },
    { front: 'How many Dataverse environments can a finance and operations environment be linked to?', back: 'Exactly one; Copilot customisation must be done in that linked environment.' },
  ],
  quiz: [
    {
      question:
        'Warehouse staff want Copilot in Dynamics 365 Supply Chain Management to answer questions using the company\'s own receiving procedures (PDF) in addition to Microsoft documentation. What is the correct process?',
      options: [
        'Upload the PDF to the Help pane in Lifecycle Services',
        'In Copilot Studio, open the Copilot for finance and operations apps agent in the linked Dataverse environment, add the PDF as uploaded-file knowledge, test and publish',
        'Create a new Copilot Studio agent and publish it to Teams',
        'Enable AI general knowledge so Copilot can search the intranet',
      ],
      correct: [1],
      explanation:
        'Custom knowledge for generative help is added to the finance and operations Copilot agent in Copilot Studio. Lifecycle Services does not host Copilot knowledge, a separate Teams agent does not change the in-app sidecar, and general knowledge uses model and Bing content, not the intranet.',
    },
    {
      question:
        'Finance analysts want to ask the in-app Copilot about live customer balances and on-hand inventory with their existing security roles enforced. Which design meets this?',
      options: [
        'Export data nightly to a public website knowledge source',
        'Enable finance and operations virtual entities in the linked Dataverse environment and add them as Dataverse knowledge to the Copilot for finance and operations apps agent',
        'Paste the balances into the agent instructions',
        'Add the Lifecycle Services project URL as knowledge',
      ],
      correct: [1],
      explanation:
        'Virtual entities expose live data with security enforced and can be added as Dataverse knowledge. Public websites break security and freshness, instructions are static, and Lifecycle Services is not a data source.',
    },
    {
      question:
        'Which TWO statements about adding knowledge to finance and operations generative help and guidance are correct? (Select two)',
      options: [
        'Dataverse virtual entities are not currently supported as knowledge sources for help and guidance',
        'AI general knowledge is enabled by default',
        'Users must start a new Copilot session to see newly published knowledge',
        'Knowledge can only be added by editing X++ code',
      ],
      correct: [0, 2],
      explanation:
        'Microsoft documents both the virtual entity limitation and the new-session requirement. General knowledge is off by default, and knowledge is added in Copilot Studio without code.',
    },
    {
      question:
        'A procurement team wants an agent that chases suppliers for order confirmations, with buyers reviewing emails before they are sent. What is the MOST appropriate approach?',
      options: [
        'Build a custom Foundry agent that emails suppliers directly',
        'Deploy the Supplier Communications Agent with the agent deployment wizard in the Power Platform admin center Copilot Hub and activate it from Immersive Home with review',
        'Create a Power Automate flow that sends reminders every day',
        'Use Computer Use to operate the supplier portal',
      ],
      correct: [1],
      explanation:
        'A Microsoft-provided agent exists for this scenario and deploys as a managed solution through the wizard. Custom builds, basic flows and UI automation add effort and lose the built-in review experience.',
    },
    {
      question:
        'An architect must design a solution where a Customer Service case about a late delivery leads to an automated shipment check in Supply Chain Management and, on approval, a return order. Which architecture is MOST appropriate?',
      options: [
        'Separate agents per app with no integration, and manual re-keying',
        'A Copilot Studio autonomous agent triggered by the case, reading finance and operations virtual entities in Dataverse and using the Dynamics 365 ERP MCP server for the return order after human approval',
        'A nightly batch export from both apps to Excel',
        'A SharePoint agent over shipment reports',
      ],
      correct: [1],
      explanation:
        'Cross-app solutions use Dataverse integration, an orchestrating agent and MCP for actions with approval. The other options are not agentic designs or do not integrate the apps.',
    },
    {
      question:
        'A maker cannot find the mserp_ tables in the Copilot Studio knowledge picker after enabling virtual entities. What is the MOST likely cause?',
      options: [
        'Virtual entities require a Microsoft 365 Copilot licence',
        'The entities were enabled in a Dataverse environment that is not linked to the finance and operations environment',
        'Copilot Studio only supports SharePoint knowledge',
        'The agent uses generative orchestration',
      ],
      correct: [1],
      explanation:
        'Virtual entities surface only in the Dataverse environment linked to the finance and operations environment. Licences, SharePoint-only support and orchestration mode are not the cause.',
    },
  ],
  statements: [
    { text: 'Copilot in finance and operations apps is orchestrated by a Copilot Studio agent named Copilot for finance and operations apps.', isTrue: true, explanation: 'It is deployed by the msdyn_FnoCopilot solution and bound to the sidecar.' },
    { text: 'Generative orchestration is enabled by default for the Copilot for finance and operations apps agent.', isTrue: false, explanation: 'It is supported but not enabled by default; turn it on when extending with capabilities that require it.' },
    { text: 'You can attach a SharePoint site directly to the out-of-box conversational boosting topic for finance and operations help.', isTrue: false, explanation: 'Only uploaded files attach to the out-of-box topic; SharePoint requires a custom topic.' },
    { text: 'Dual-write can synchronise finance and operations data into Dataverse tables that agents use as knowledge.', isTrue: true, explanation: 'Dual-write provides near-real-time sync between finance and operations and Dataverse.' },
    { text: 'The agent deployment wizard runs inside Lifecycle Services.', isTrue: false, explanation: 'It runs in the Power Platform admin center Copilot Hub.' },
    { text: 'Agent management in finance and operations requires Immersive Home to be enabled.', isTrue: true, explanation: 'Immersive Home is a prerequisite and the primary navigation hub for agents.' },
    { text: 'The Dynamics 365 ERP MCP server can be used from Microsoft Foundry as well as Copilot Studio.', isTrue: true, explanation: 'Microsoft documents using ERP MCP with Foundry and Visual Studio Code.' },
  ],
  resources: [
    { label: 'Overview of Copilot capabilities in finance and operations apps', url: 'https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/copilot/copilot-for-finance-operations' },
    { label: 'Add knowledge to generative help and guidance with Copilot', url: 'https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/extend-copilot-generative-help' },
    { label: 'Chat with finance and operations data', url: 'https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/chat-with-fno-data' },
    { label: 'Agents, Copilot and AI capabilities in Dynamics 365 apps', url: 'https://learn.microsoft.com/en-us/dynamics365/copilot/ai-get-started' },
  ],
};
