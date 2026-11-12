import type { Concept } from '../../types';

export const copilotAndAgentCapabilities: Concept = {
  id: 'copilot-and-agent-capabilities',
  title: 'Copilot versus Agents: Capabilities, Licensing Models, Researcher, Analyst and Custom Agents',
  summary:
    'What Microsoft 365 Copilot does out of the box compared with agents, how the monthly per-user licence differs from pay-as-you-go and Copilot Credits (including SharePoint agents), and when Researcher, Analyst or a custom agent is the right answer to a business request.',
  certs: ['ab-900', 'ab-731', 'ab-730'],
  domains: ['ab-900-3', 'ab-731-2', 'ab-731-3', 'ab-730-4'],
  outcomes: ['ab-900-3-1-1', 'ab-900-3-1-2', 'ab-900-3-1-4', 'ab-900-3-1-5', 'ab-900-3-1-6', 'ab-731-2-1-9', 'ab-731-3-2-5', 'ab-730-4-1-2'],
  tags: ['copilot', 'agents', 'researcher', 'analyst', 'licensing', 'pay-as-you-go', 'copilot-credits', 'sharepoint-agents'],
  difficulty: 'foundations',
  diagram: 'copilot-extensibility-options',
  sections: [
    {
      heading: 'Built-in Copilot versus agents',
      body: `**Microsoft 365 Copilot** is the general-purpose assistant. With a licence a user gets Copilot in Word, Excel, PowerPoint, Outlook, Teams, OneNote and Loop, plus **Copilot Chat** grounded in their work data through Microsoft Graph and Work IQ, Copilot Pages and Notebooks, intelligent meeting recap, and the prebuilt reasoning agents **Researcher** and **Analyst**. Without a licence, users signed in with a work account still get **Copilot Chat** grounded in the web with enterprise data protection, and can use agents on a **pay-as-you-go** basis if the organisation enables it.

**Agents** are specialised versions of Copilot: a set of **instructions**, **knowledge** (SharePoint sites, Copilot connectors, uploaded files, the web) and **actions or tools** (connectors, MCP servers, agent flows, APIs), optionally with **triggers** so they run autonomously. They come in several flavours:

- **Prebuilt Microsoft agents**: Researcher, Analyst, Facilitator in Teams meetings, the Microsoft 365 Admin agent, Sales Agent and others.
- **Declarative agents** that reuse Copilot's orchestrator and model, built with **Agent Builder** in Copilot Chat or **Copilot Studio**, and **SharePoint agents** scoped to a site or library.
- **Custom engine agents** that bring their own orchestrator and models (Copilot Studio with generative orchestration, Microsoft Foundry, Agents SDK) and can run in Teams, Copilot and other channels.
- **Partner agents** from the Agent Store.

The comparison the exam wants: Copilot is broad, interactive and inherits everything the user can see; an agent is narrow, consistent and scoped to what it was given, can take actions, and is governed as an object (approved, deployed, blocked, retired) in the Microsoft 365 admin center. Copilot answers "what does this document say?"; an agent answers "open an IT ticket for this and tell me the SLA" every time, the same way.`,
    },
    {
      heading: 'Monthly licence versus pay-as-you-go versus Copilot Credits',
      body: `Microsoft offers two ways to pay for AI work, and administrators must be able to compare them.

**User subscription licence (USL)**: the per-user, per-month Microsoft 365 Copilot licence, bought by IT and assigned like any other licence. It covers *everyday AI*: Copilot in the apps, work-grounded Copilot Chat, Researcher and Analyst, Agent Builder, SharePoint agents, use of declarative agents, and included use of Copilot Studio agents when the licensed user interacts with them. It also includes **SharePoint Advanced Management**. Microsoft 365 **E7** bundles the Copilot licence with E5, Agent 365 and the Entra Suite; **Copilot Business** serves organisations up to 300 users on Business plans.

**Pay-as-you-go**: consumption billing through an **Azure subscription** meter. In the Microsoft 365 admin center (*Copilot > Billing & usage*) an admin creates a **billing policy** (Azure subscription, resource group, users or groups, optional budget) and connects it to a service: **Copilot Chat** metered agents for unlicensed users, **SharePoint agents** for unlicensed users, and the Copilot Retrieval API. Budgets send email notifications at percentage thresholds but **do not cut off usage**. Pay-as-you-go lets you measure demand before committing to licences and scale with usage.

**Copilot Credits and usage-based billing (UBB)**: a common currency for *advanced AI*: Copilot Cowork, Copilot Code, autonomous agents, advanced agentic work in SharePoint and OneDrive, the Work IQ API and frontier models. These experiences **require a Copilot licence** and additionally consume credits, which can come from pay-as-you-go, prepaid capacity packs or a Copilot Credit pre-purchase plan, governed by **spending policies** in *Copilot > Cost management*. Copilot Studio agents consume Copilot Credits when unlicensed users or autonomous triggers use them.

**SharePoint agents** make a clean exam case: a licensed user can create and use agents; an unlicensed user can only *use* them when pay-as-you-go is connected, billed per generative answer and per tenant-graph-grounded message; with neither, the user cannot use agents at all.`,
    },
    {
      heading: 'Researcher and Analyst: when to use which',
      body: `Both are Microsoft-built **reasoning agents** inside Copilot Chat, available to licensed users under *Agents* (or *Tools*), running entirely within the Microsoft 365 service boundary with the user's permissions. Because they are part of the core Copilot Chat experience, they are **not governed by agent settings** in the admin center: you cannot block Researcher the way you block a Copilot Studio agent; they follow the Copilot licence.

**Researcher** performs **multi-step, deep research**. It plans, asks clarifying questions, searches the web and the user's work content (files, email, meetings, chats, connectors), reasons over the results for several minutes, and produces a long, structured, **source-cited report** with headings, bullets and visuals. Use cases: a competitive landscape, a go-to-market strategy drawing on internal plans and market data, due-diligence summaries, a literature review. Researcher with Computer Use can also act in a browser.

**Analyst** performs **data analysis** like a skilled data scientist. It uses chain-of-thought reasoning, loads spreadsheets and CSV files from the user's prompt or OneDrive and SharePoint, writes and runs **Python code** to clean, join and compute, and returns tables, charts and findings with the code visible for verification. Use cases: forecasting revenue from several workbooks, finding which product lines drive churn, reconciling two exports, turning a raw survey file into a summary with charts.

Standard Copilot Chat remains right for quick summaries, drafts and back-and-forth tasks. The exam heuristics: *many sources, a report, citations* means Researcher; *numbers, files, calculations, charts, code* means Analyst; *quick and conversational* means Copilot Chat. Both agents are included with the Copilot licence and appear in audit logs and DSPM for AI like any Copilot interaction.`,
    },
    {
      heading: 'When a custom agent is the answer',
      body: `Prebuilt capability covers general productivity. A **custom agent** is justified when a request has at least one of these properties:

- **Scoped knowledge**: answers must come only from a defined source (the HR policy library, a product manual, a Copilot connector to ServiceNow) so results are consistent and citable. Agent Builder and SharePoint agents handle this with a few clicks.
- **Repeatable behaviour and persona**: fixed instructions, tone and format, such as a Writing Coach that applies brand style, or an onboarding buddy for a specific team.
- **Actions**: creating tickets, updating records, sending notifications, calling an API or an MCP server, or running an agent flow. These need Copilot Studio (or pro-code tools), because Agent Builder cannot author actions.
- **Autonomy**: triggers that run without a user prompt (a new email arrives, a record changes) or long-running tasks across systems, which also moves billing into Copilot Credits.
- **Different channels or external audiences**: a customer-facing website bot or a Teams-only agent for frontline staff, where Copilot Studio channels and the Customer Conversation harness fit.

Decision ladder administrators use: start with Copilot Chat and Researcher or Analyst; if scoping or consistency is the issue, build a declarative agent in Agent Builder or a SharePoint agent; if actions, triggers, orchestration control or external channels are needed, use Copilot Studio; if you need your own models and runtime, build a custom engine agent in Microsoft Foundry or with the Agents SDK and bring it into Copilot through the Agent Store. Every rung inherits Microsoft 365 permissions, Purview protections and admin approval, so the governance story stays constant while capability grows.`,
    },
  ],
  examples: [
    {
      title: 'Picking the tool for three requests',
      description:
        'Marketing asks for a competitor analysis citing public sources and internal win-loss notes (Researcher). Finance asks which cost centres drove the variance across four Excel exports, with charts (Analyst). The service desk wants staff to ask "how do I request a laptop?" and get the exact procedure from the IT policy site every time, plus a ticket raised (a Copilot Studio agent with SharePoint knowledge and a ServiceNow action).',
      takeaway: 'Research and citations: Researcher. Data and code: Analyst. Scoped knowledge plus actions: a custom agent.',
    },
    {
      title: 'Licensing an agent for unlicensed users (a realistic mistake)',
      description:
        'Contoso publishes a SharePoint agent on the Benefits site and announces it to all 5,000 employees, but only 800 hold Copilot licences. Unlicensed staff see nothing. The admin had assumed the agent was free to use. The fix is either to license the audience or to create a pay-as-you-go billing policy for the relevant security group and connect it to the SharePoint agents service, accepting per-message Azure charges.',
      language: 'text',
      code: `Microsoft 365 admin center > Copilot > Billing & usage
  Billing policies > Add a billing policy
    Azure subscription ... Contoso-Prod   Resource group ... rg-copilot-payg
    Users/groups ......... SG-Benefits-Readers
    Budget (optional) .... 2,000 per month -> email at 50%, 75%, 90% (not enforced)
  Pay-as-you-go services > SharePoint agents > Connect billing policy`,
      takeaway: 'Unlicensed users can only use agents when a pay-as-you-go billing policy is connected; licences or billing must be planned before announcing an agent.',
    },
    {
      title: 'Trying to block Researcher like an agent',
      description:
        'A compliance lead asks the admin to disable Researcher for the organisation through the Agents page in the admin center. The admin finds no such control because Researcher and Analyst are part of the core Copilot Chat experience and follow the Copilot licence rather than agent settings. The conversation moves to the real concern, which Purview DLP and Communication Compliance address for all Copilot interactions, Researcher included.',
      takeaway: 'Researcher and Analyst are governed as Copilot, not as agents; Purview controls apply to them automatically.',
    },
  ],
  keyPoints: [
    'Microsoft 365 Copilot is the broad, permission-inheriting assistant in the apps and Copilot Chat; agents are scoped bundles of instructions, knowledge and actions that are governed as objects.',
    'Agent types: prebuilt Microsoft agents, declarative agents (Agent Builder, Copilot Studio, SharePoint agents), custom engine agents (Copilot Studio, Foundry, Agents SDK) and partner agents from the Agent Store.',
    'The per-user monthly licence (USL) covers everyday AI and includes SharePoint Advanced Management; E7 bundles it; Copilot Business serves up to 300 users.',
    'Pay-as-you-go bills metered Copilot Chat agents, SharePoint agents and the Retrieval API through an Azure subscription using billing policies in Copilot > Billing & usage; budgets notify but do not enforce.',
    'Copilot Credits (usage-based billing) fund advanced AI such as Cowork, Code and autonomous agents, require a Copilot licence, and are governed by spending policies in Copilot > Cost management.',
    'SharePoint agents: licensed users create and use; unlicensed users use only with pay-as-you-go; neither means no access.',
    'Researcher produces cited multi-source research reports; Analyst runs Python over data files for analysis and charts; both are part of core Copilot Chat and not controlled by agent settings.',
    'Build a custom agent when you need scoped knowledge, consistent behaviour, actions, autonomy or other channels; escalate from Agent Builder to Copilot Studio to Foundry as needs grow.',
  ],
  flashcards: [
    { front: 'What does an unlicensed user signed in with a work account get in Copilot Chat?', back: 'Web-grounded Copilot Chat with enterprise data protection, and metered agents if pay-as-you-go is enabled; no work-grounded Chat or Copilot in the apps.' },
    { front: 'Declarative agent vs custom engine agent?', back: 'Declarative agents reuse Copilot\'s orchestrator and model with your instructions, knowledge and actions; custom engine agents bring their own orchestrator and models.' },
    { front: 'Which admin center page configures pay-as-you-go billing policies for Copilot Chat and SharePoint agents?', back: 'Microsoft 365 admin center > Copilot > Billing & usage.' },
    { front: 'What does a pay-as-you-go budget do when exceeded?', back: 'Sends email notifications at thresholds; it does not stop usage.' },
    { front: 'What are Copilot Credits?', back: 'The common currency for usage-based billing of advanced AI (Cowork, Code, autonomous agents, Work IQ API), managed in Copilot > Cost management.' },
    { front: 'Can an unlicensed user create a SharePoint agent?', back: 'No. Creating requires a Copilot licence; unlicensed users can only use agents when pay-as-you-go is connected.' },
    { front: 'When should you recommend Researcher?', back: 'For deep, multi-step research across web and work content that needs a structured, cited report.' },
    { front: 'When should you recommend Analyst?', back: 'For analysing data in spreadsheets or CSV files: it reasons step by step, runs Python, and returns tables and charts.' },
    { front: 'Can an admin block Researcher from the Agents page?', back: 'No. Researcher and Analyst are part of core Copilot Chat and follow the Copilot licence, not agent settings.' },
    { front: 'Which tool is required to add actions (connectors, APIs, flows) to a declarative agent?', back: 'Microsoft Copilot Studio (Agent Builder cannot author actions).' },
    { front: 'Which licence bundles Microsoft 365 Copilot with E5, Agent 365 and the Entra Suite?', back: 'Microsoft 365 E7.' },
  ],
  quiz: [
    {
      question: 'A finance analyst must combine three Excel exports, compute year-over-year variance by cost centre and produce charts, and wants to verify how the numbers were calculated. Which Copilot capability is MOST appropriate?',
      options: ['Copilot in Outlook', 'Researcher', 'Analyst', 'A SharePoint agent on the Finance site'],
      correct: [2],
      explanation:
        'Analyst reasons over data files, runs Python and shows its code and charts. Researcher writes research reports, Outlook Copilot drafts mail, and a SharePoint agent answers questions about site content rather than computing.',
    },
    {
      question: 'Contoso wants to let 2,000 unlicensed employees use a SharePoint agent on the HR site and pay only for actual usage. What should the administrator configure?',
      options: [
        'Assign Microsoft 365 Copilot licences to all 2,000 users.',
        'Create a pay-as-you-go billing policy in Copilot > Billing & usage and connect it to the SharePoint agents service.',
        'Enable restricted content discovery on the HR site.',
        'Publish the agent to the Agent Store.',
      ],
      correct: [1],
      explanation:
        'Pay-as-you-go through a billing policy is the consumption option for unlicensed users. Licences are the fixed-cost alternative, RCD hides content from Copilot, and store publishing does not change billing.',
    },
    {
      question: 'Which TWO statements correctly compare the Microsoft 365 Copilot monthly licence with pay-as-you-go? (Select two)',
      options: [
        'The monthly licence is a fixed per-user cost that includes Copilot in the Microsoft 365 apps and work-grounded Copilot Chat.',
        'Pay-as-you-go is billed through an Azure subscription meter and requires a billing policy.',
        'Pay-as-you-go budgets automatically block users when the budget is reached.',
        'The monthly licence is required before a user can access web-grounded Copilot Chat.',
      ],
      correct: [0, 1],
      explanation:
        'The licence is fixed and comprehensive; pay-as-you-go is Azure-metered via billing policies. Budgets only notify, and web-grounded Copilot Chat is available without a licence.',
    },
    {
      question: 'A department wants an assistant that answers only from its approved procedures library, always in the same format, and can create a ticket in ServiceNow. What should you recommend?',
      options: [
        'Copilot Chat in work mode',
        'Researcher',
        'A custom agent built in Copilot Studio with the library as knowledge and a ServiceNow action',
        'A Teams messaging policy',
      ],
      correct: [2],
      explanation:
        'Scoped knowledge, consistent behaviour and an action require a custom agent; Copilot Studio supports actions. Copilot Chat and Researcher are not scoped and cannot create tickets, and messaging policies are unrelated.',
    },
    {
      question: 'Which experience is available to a user who has NO Microsoft 365 Copilot licence but signs in with a work account?',
      options: [
        'Copilot in Word and Excel',
        'Copilot Chat grounded in the web with enterprise data protection',
        'Researcher and Analyst',
        'Copilot Cowork',
      ],
      correct: [1],
      explanation:
        'Web-grounded Copilot Chat with EDP is included with Microsoft 365. App Copilots, Researcher, Analyst and Cowork require the Copilot licence (Cowork also consumes Copilot Credits).',
    },
    {
      question: 'Why can an administrator not block Researcher from the Agents page in the Microsoft 365 admin center?',
      options: [
        'Researcher is a third-party agent and only the publisher can block it.',
        'Researcher and Analyst are part of the core Copilot Chat experience and are governed by the Copilot licence, not agent settings.',
        'Researcher can only be blocked in the Power Platform admin center.',
        'Blocking requires a Copilot Studio licence.',
      ],
      correct: [1],
      explanation:
        'Microsoft documents that Researcher and Analyst coexist with agents but are not subject to agent-related settings. They are Microsoft first-party features, not Power Platform objects.',
    },
  ],
  statements: [
    { text: 'Agents can take actions such as creating records, whereas built-in Copilot primarily generates and summarises content.', isTrue: true, explanation: 'Actions, tools and triggers are what distinguish agents.' },
    { text: 'Pay-as-you-go budgets in the Microsoft 365 admin center stop usage once the budget amount is reached.', isTrue: false, explanation: 'Budgets trigger email notifications only; usage continues.' },
    { text: 'SharePoint Advanced Management is included with the Microsoft 365 Copilot licence.', isTrue: true, explanation: 'SAM comes with Copilot (and E7) or as a separate add-on.' },
    { text: 'Analyst is designed to write long, cited research reports from web and work sources.', isTrue: false, explanation: 'That is Researcher; Analyst performs data analysis with Python over files.' },
    { text: 'Copilot Cowork and other advanced AI experiences consume Copilot Credits and require a Copilot licence.', isTrue: true, explanation: 'Usage-based billing experiences require a USL and draw on credits.' },
    { text: 'Agent Builder can author actions that call external APIs.', isTrue: false, explanation: 'Agent Builder supports instructions and knowledge; actions require Copilot Studio or pro-code tools.' },
    { text: 'Researcher and Analyst appear in Purview audit logs and DSPM for AI like other Copilot interactions.', isTrue: true, explanation: 'They run inside the Microsoft 365 boundary and inherit Copilot compliance coverage.' },
  ],
  resources: [
    { label: 'Microsoft Copilot license options', url: 'https://learn.microsoft.com/en-us/copilot/plan/copilot-license-options' },
    { label: 'Microsoft Copilot pay-as-you-go service overview', url: 'https://learn.microsoft.com/en-us/copilot/plan/pay-as-you-go-overview' },
    { label: 'Get started with agents in SharePoint (licensing and pay-as-you-go comparison)', url: 'https://learn.microsoft.com/en-us/sharepoint/get-started-sharepoint-agents' },
    { label: 'Overview of Researcher agent', url: 'https://learn.microsoft.com/en-us/copilot/manage/researcher-agent' },
  ],
};
