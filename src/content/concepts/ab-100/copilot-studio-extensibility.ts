import type { Concept } from '../../types';

export const copilotStudioExtensibility: Concept = {
  id: 'copilot-studio-extensibility',
  title: 'Copilot Studio Extensibility: Tools, MCP, Computer Use, Reasoning, Voice and Microsoft 365 Surfaces',
  summary:
    'How an architect extends a Copilot Studio agent beyond knowledge and topics: connectors and REST tools, Model Context Protocol servers, Computer Use for systems without APIs, deep reasoning and voice behaviours, and the design choices for publishing agents into Microsoft 365, Teams and SharePoint.',
  certs: ['ab-100', 'ab-620'],
  domains: ['ab-100-2', 'ab-620-2'],
  outcomes: ['ab-100-2-2-3', 'ab-100-2-2-4', 'ab-100-2-2-5', 'ab-100-2-2-6', 'ab-100-2-2-7', 'ab-620-2-2-1', 'ab-620-2-2-2'],
  tags: ['copilot-studio', 'tools', 'mcp', 'computer-use', 'deep-reasoning', 'voice', 'teams', 'sharepoint'],
  difficulty: 'advanced',
  diagram: 'copilot-studio-agent-anatomy',
  sections: [
    {
      heading: 'The extensibility surface of an agent',
      body: `A Copilot Studio agent is extended along five axes, and a good design states which axis each requirement uses:

- **Knowledge** (what it can cite): SharePoint and OneDrive, Dataverse, uploaded files, public websites, Copilot connectors, Azure AI Search, Bing Custom Search, real-time Power Platform connectors (preview).
- **Tools** (what it can do): Power Platform **connectors** (prebuilt and custom, thousands of systems), **REST API** tools from an OpenAPI description, **MCP servers**, **prompt actions**, **agent flows** and **Computer Use**. Generative orchestration calls tools by name and description; classic orchestration calls them from topics.
- **Agents** (whom it can delegate to): child agents, connected Copilot Studio agents, Foundry agents, Fabric data agents, Agents SDK agents and A2A agents.
- **Triggers** (what starts it): user messages, or event triggers from connectors for autonomous behaviour.
- **Channels** (where it appears): Microsoft 365 Copilot and Teams, SharePoint, websites and custom apps, Dynamics 365 Contact Center, telephony, and, in preview, exposing the agent itself as an **MCP server or A2A agent** so other orchestrators can call it.

Extensibility is governed, not free: **data policies** in the Power Platform admin center classify connectors (Business, Non-business, Blocked) and can restrict HTTP requests, knowledge types, channels and triggers; **channel publishing controls** and **connected agent access** settings limit where agents go; **knowledge source rules** restrict SharePoint, OneDrive, files and public websites. The architect designs within these, and proposes policy changes through governance rather than working around them.

Harness awareness matters here. On the standard harness all of the above apply. On the Microsoft Copilot harness, prompt tools are replaced by **skills**, topics by **workflows and hooks**, memory and native code interpreter are added, and some channels (SharePoint, Contact Center) and Azure AI Search knowledge are not available at the time of writing.`,
    },
    {
      heading: 'Model Context Protocol and Computer Use',
      body: `**MCP in Copilot Studio.** An MCP server publishes **tools** (functions the model can call) and **resources** (file-like data the agent can read); Copilot Studio currently supports both, not MCP prompts. Connect an existing server with the onboarding wizard (a custom connector wraps it), or build your own; every published tool becomes available to the agent and **changes on the server are reflected dynamically**, so you do not re-author when tools change. Microsoft business apps ship MCP servers: **Dynamics 365 Sales** (record summaries, recent changes, catch-ups), **Customer Service** (case and knowledge tools, vocabulary management), the **Dynamics 365 ERP MCP** for finance and operations, and the **Power Apps MCP server** for Dataverse record automation with human review in the agent feed. Design points: MCP needs generative orchestration; the connector is subject to data policies; you are responsible for third-party servers you connect; descriptions on the server drive tool selection; and MCP connectors can be published for cross-tenant reuse. Prefer MCP when many tools share one system and evolve; prefer a REST tool for a single stable endpoint.

**Computer Use.** When a system has **no API**, the Computer Use tool lets the agent operate a Windows desktop or website with a virtual mouse and keyboard, driven by a Computer-Using Agent model that combines vision and reasoning so it adapts when buttons move. You configure name, description, **instructions** (steps, URLs, application names), the **model**, optional **inputs** for dynamic values, the target **machine** (managed through Power Automate machine management, hosted or your own), the connection and **credentials** to use. Typical uses: data entry into legacy applications, invoice processing in a vendor portal, extraction from systems that only have a UI. Design constraints: generative orchestration only; runs are slower and costlier than API calls; treat screen content as untrusted input; use least-privilege credentials; log and monitor runs (run history, screenshots) and keep a human approval step for consequential actions. Computer Use is a bridge, not a destination: when the system later exposes an API or MCP server, replace the tool.`,
    },
    {
      heading: 'Agent behaviours: reasoning, voice and model selection',
      body: `**Deep reasoning (preview).** Agents with generative orchestration can be given a deep reasoning model (in the United States and EU excluding the UK at the time of writing, using an Azure OpenAI reasoning model). The agent decides which steps need reasoning, or you force it with the **reason** keyword in instructions. Expect better accuracy on multi-step, logic-heavy tasks with slower responses, higher cost and, during preview, no data residency commitment, so processing may happen outside your region. Use it selectively: eligibility checks against layered rules, reconciling conflicting documents, planning multi-step actions. Do not use it for simple lookups or latency-sensitive voice turns.

**Primary model selection.** Each agent has a primary model powering orchestration (GPT Chat Latest by default, with GA, preview and experimental models tagged by region and cross-geo processing). Experimental models are for exploration, not production. Separate settings govern deep reasoning, generative responses and prompt-tool models.

**Voice.** Copilot Studio supports two voice agent types. **Basic voice agents** use topics and classic orchestration with NLU for intent and entities, speech and **DTMF** input, **SSML** to shape voice output, custom audio, silence detection, **barge-in**, long-running-operation messages and constrained speech grammars for alphanumeric input such as account numbers. **Real-time voice agents** use generative orchestration with a speech-to-speech model for low-latency natural conversation. Both need a phone number from **Azure Communication Services** and integrate with **Dynamics 365 Contact Center** for routing, transfer to a representative, sensitive variable masking and reporting. Voice design differs from chat: shorter turns, explicit confirmation of captured values, call transfer and termination paths, and testing with real audio. The Customer Conversation harness (preview) is Microsoft's newer path for customer-facing voice and chat with sub-agents and escalation.

Other behaviours an architect specifies: authentication (Entra ID, no authentication, or manual), content moderation level, response language handling, memory (Microsoft Copilot harness), and whether the agent may act autonomously via triggers.`,
    },
    {
      heading: 'Optimising with agents in Microsoft 365, Teams and SharePoint',
      body: `Many requirements are best met by putting the agent where people already work rather than building a new channel.

- **Microsoft 365 Copilot channel.** Publishing a Copilot Studio agent to Microsoft 365 Copilot makes it available in Copilot Chat and Teams, inherits the Microsoft 365 Copilot licence for employee use (no Copilot Credits for authenticated licensed users), and routes through admin approval and the **agent registry** in the Microsoft 365 admin center. Work IQ grounding gives access to the user's files, mail, meetings and chats within their permissions.
- **Teams.** Agents can be pinned, added to channels and meetings, triggered by @mentions and deliver adaptive cards; Teams admin policies decide who can install which agents. Design for Teams' lack of a default Fallback topic and for group-chat context.
- **SharePoint agents.** Every site gets a ready-made agent scoped to its content; site owners can create agents scoped to selected libraries and files, and these can be **edited in Copilot Studio** for more knowledge, instructions and tools. Permissions are the site's permissions, which makes SharePoint agents the quickest safe answer for "let the department ask questions about these documents".
- **Agent Builder to Copilot Studio.** Start simple in Agent Builder; copy to Copilot Studio when you need tools, workflows, channels or ALM.
- **Copilot Studio agents inside Dynamics 365 apps**: the finance and operations sidecar, Copilot in Sales and the Customer Service Copilot pane are themselves Copilot Studio agents you extend rather than replace.

Optimisation heuristics for the exam: fewer channels and one shared agent beats many duplicates; prefer licensed Microsoft 365 surfaces for internal audiences to avoid credit consumption; choose SharePoint agents for document Q&A with no actions; move to a full Copilot Studio agent when actions, triggers, external users or voice are required; and keep governance (registry, approval, DLP) in the design from day one.`,
    },
  ],
  examples: [
    {
      title: 'Choosing MCP over twelve REST tools',
      description:
        'A field service agent needs twelve operations against a work-order system whose vendor publishes an MCP server and updates it monthly. Rather than maintaining twelve REST tools and OpenAPI files, the architect connects the MCP server through the onboarding wizard; new tools appear automatically, and the connector is classified as Business in the data policy so it cannot be combined with Non-business connectors.',
      takeaway: 'Use MCP when a system exposes many evolving tools; govern the MCP connector like any other connector.',
    },
    {
      title: 'Computer Use as a stopgap for a legacy portal',
      description:
        'A logistics company must file customs declarations in a government portal with no API. The agent uses a Computer Use tool with explicit step instructions, inputs for shipment fields, a dedicated hosted machine, a least-privilege service account and a human approval before final submission. The design records that the tool will be retired when the portal\'s announced API ships.',
      takeaway: 'Computer Use bridges systems without APIs; constrain credentials, keep approval gates and plan to replace it.',
    },
    {
      title: 'Deep reasoning everywhere (a realistic mistake)',
      description:
        'A team enables deep reasoning for an entire HR agent to "make it smarter". Latency triples, credits rise sharply, and the privacy office objects because preview reasoning may process data outside the EU region. The fix is to keep the default model for Q&A, add the reason keyword only to the eligibility-check instructions, and document the residency exception for that single step.',
      takeaway: 'Apply deep reasoning selectively to complex steps, and account for latency, cost and residency.',
    },
    {
      title: 'SharePoint agent instead of a new build',
      description:
        'Legal asks for "a chatbot for our contract templates". The architect creates a SharePoint agent on the legal site scoped to the templates library, lets the team refine instructions, and only later opens it in Copilot Studio to add a tool that creates a matter record. No website channel, no credits for licensed users, permissions inherited from the site.',
      takeaway: 'For document Q&A with an internal audience, start with a SharePoint agent and extend in Copilot Studio when actions are needed.',
    },
  ],
  keyPoints: [
    'Extend along five axes: knowledge, tools (connectors, REST, MCP, prompts, flows, Computer Use), connected agents, triggers and channels; all governed by data policies, channel controls and knowledge-source rules.',
    'MCP servers expose tools and resources that Copilot Studio reflects dynamically; MCP needs generative orchestration and is wrapped in a connector subject to DLP. Dynamics 365 Sales, Customer Service, ERP and Power Apps ship MCP servers.',
    'Computer Use lets an agent drive Windows apps and websites with no API via a Computer-Using Agent model; configure instructions, model, inputs, machine and credentials, and keep approvals and least privilege.',
    'Deep reasoning (preview) improves multi-step accuracy at the cost of latency, credits and, in preview, data residency; apply it selectively with the reason keyword.',
    'Basic voice agents use classic orchestration with NLU, DTMF, SSML and barge-in; real-time voice agents use generative orchestration with speech-to-speech; both need Azure Communication Services numbers and integrate with Dynamics 365 Contact Center.',
    'Publishing to Microsoft 365 Copilot and Teams covers licensed employees without Copilot Credits and routes through admin approval and the agent registry.',
    'SharePoint agents give site-scoped document Q&A with site permissions and can be opened in Copilot Studio for more knowledge, instructions and tools.',
    'Harness capabilities differ: the Microsoft Copilot harness replaces topics and prompt tools with workflows, hooks and skills, and lacks SharePoint and Contact Center channels and Azure AI Search knowledge at the time of writing.',
  ],
  flashcards: [
    { front: 'Which MCP primitives does Copilot Studio support?', back: 'Tools and resources (not MCP prompts, at the time of writing).' },
    { front: 'What happens in Copilot Studio when tools change on a connected MCP server?', back: 'The changes are reflected dynamically; obsolete tools disappear and new ones appear without re-authoring.' },
    { front: 'When is Computer Use the right tool?', back: 'When the target application or website has no API and a person could complete the task through its user interface.' },
    { front: 'Name the four required configuration fields of a Computer Use tool.', back: 'Name, description, model and instructions (plus optional inputs, machine, connection and credentials).' },
    { front: 'How can you force deep reasoning on a specific step?', back: 'Include the reason keyword in the relevant agent instructions.' },
    { front: 'Where is deep reasoning available and what is its residency status?', back: 'United States and EU (excluding the UK) in preview, with no data residency commitment during preview.' },
    { front: 'Basic versus real-time voice agents?', back: 'Basic: topics with classic orchestration, NLU, DTMF and SSML. Real-time: generative orchestration with a speech-to-speech model for low-latency natural conversation.' },
    { front: 'What is needed to give a voice agent a phone number?', back: 'Azure Communication Services (new or ported number), typically integrated with Dynamics 365 Contact Center.' },
    { front: 'Why publish an internal agent to the Microsoft 365 Copilot channel rather than a website?', back: 'Licensed employees are covered by Microsoft 365 Copilot (no Copilot Credits), governance runs through admin approval and the agent registry, and users stay in Copilot Chat and Teams.' },
    { front: 'How do SharePoint agents relate to Copilot Studio?', back: 'They are site-scoped agents with site permissions that can be opened in Copilot Studio to add knowledge, instructions and tools.' },
  ],
  quiz: [
    {
      question:
        'A Copilot Studio agent must perform 15 operations against a vendor system that publishes an MCP server and changes its tool set monthly. Which approach minimises maintenance?',
      options: [
        'Create 15 REST API tools from the vendor\'s OpenAPI file',
        'Connect the MCP server; tools and resources are reflected dynamically',
        'Build 15 Power Automate flows',
        'Use Computer Use to operate the vendor\'s web UI',
      ],
      correct: [1],
      explanation:
        'MCP reflects server-side changes automatically. REST tools and flows need manual updates, and Computer Use is for systems without an API.',
    },
    {
      question:
        'A government customs portal has no API. An agent must submit declarations into it. Which TWO design decisions are appropriate? (Select two)',
      options: [
        'Use a Computer Use tool with explicit instructions, inputs and a dedicated machine',
        'Require human approval before final submission and use least-privilege credentials',
        'Grant the tool the maker\'s global admin credentials for reliability',
        'Switch the agent to classic orchestration to run Computer Use',
      ],
      correct: [0, 1],
      explanation:
        'Computer Use fits the no-API case, and approvals with least privilege control the risk. Admin credentials violate least privilege, and Computer Use requires generative orchestration.',
    },
    {
      question:
        'An EU bank wants its Copilot Studio agent to perform a complex eligibility assessment that combines several policy documents, but most interactions are simple questions. Data must stay in the EU. What should you recommend?',
      options: [
        'Enable deep reasoning for the whole agent',
        'Use the default model for general questions and apply deep reasoning only to the eligibility step, after confirming EU availability and documenting the preview residency caveat',
        'Use an experimental model for all requests',
        'Replace the agent with a Computer Use tool',
      ],
      correct: [1],
      explanation:
        'Deep reasoning is slower, costlier and in preview has no residency commitment, so it should be applied selectively with explicit risk acceptance. Experimental models are not for production, and Computer Use is irrelevant.',
    },
    {
      question:
        'A contact centre needs a phone agent that captures 12-digit account numbers reliably, plays an approved greeting recording and lets callers interrupt prompts. Which design fits?',
      options: [
        'A real-time voice agent with generative orchestration only',
        'A basic voice agent with classic orchestration, constrained speech grammars, uploaded audio and barge-in, connected through Azure Communication Services to Dynamics 365 Contact Center',
        'A Teams-published chat agent',
        'A SharePoint agent',
      ],
      correct: [1],
      explanation:
        'Constrained grammars for alphanumeric input, custom audio and barge-in are basic voice agent features. Real-time agents suit natural conversation but not this controlled capture; chat and SharePoint agents are not telephony.',
    },
    {
      question:
        'A department wants employees to ask questions about documents in its SharePoint site, with no actions and the site\'s existing permissions. What is the quickest appropriate solution?',
      options: [
        'A SharePoint agent scoped to the site\'s libraries',
        'A Copilot Studio agent published to a public website',
        'A Foundry hosted agent with Azure AI Search',
        'A custom engine agent in Teams',
      ],
      correct: [0],
      explanation:
        'SharePoint agents are purpose-built for site-scoped document Q&A with site permissions and can be extended later in Copilot Studio. The other options add channels, infrastructure or build effort the requirement does not need.',
    },
    {
      question:
        'An admin reports that makers cannot add a newly connected MCP server\'s tools to their agent even though the server works in testing. Which cause is MOST likely?',
      options: [
        'The agent uses classic orchestration, which does not support MCP tools',
        'MCP servers must be in the same Azure region as the tenant',
        'The agent has too many knowledge sources',
        'The MCP server exposes prompts, which Copilot Studio converts to topics',
      ],
      correct: [0],
      explanation:
        'MCP requires generative orchestration. There is no region co-location rule, knowledge count is unrelated, and Copilot Studio does not consume MCP prompts.',
    },
  ],
  statements: [
    { text: 'Copilot Studio reflects tool changes on a connected MCP server without re-authoring the agent.', isTrue: true, explanation: 'Tools and resources are discovered dynamically from the server.' },
    { text: 'Computer Use works with agents on classic orchestration.', isTrue: false, explanation: 'Computer Use requires generative orchestration.' },
    { text: 'Content read from the screen by Computer Use should be treated as untrusted input.', isTrue: true, explanation: 'Screen content can carry injected instructions just like documents or web pages.' },
    { text: 'Deep reasoning in Copilot Studio is generally available worldwide with full data residency.', isTrue: false, explanation: 'It is a region-limited preview without residency commitments.' },
    { text: 'Real-time voice agents rely on topics and classic orchestration.', isTrue: false, explanation: 'Real-time voice agents use generative orchestration with speech-to-speech models; basic voice agents use topics.' },
    { text: 'Publishing a Copilot Studio agent to Microsoft 365 Copilot lets licensed employees use it without consuming Copilot Credits when authenticated under their own identity.', isTrue: true, explanation: 'Employee-facing use under a Microsoft 365 Copilot licence is included, subject to fair use.' },
    { text: 'SharePoint agents can be opened in Copilot Studio to add tools and additional knowledge.', isTrue: true, explanation: 'Site agents are extensible in Copilot Studio.' },
  ],
  resources: [
    { label: 'Extend your agent with Model Context Protocol (Copilot Studio)', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp' },
    { label: 'Computer use in Copilot Studio', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/computer-use' },
    { label: 'Add deep reasoning models to agents (preview)', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-reasoning-models' },
    { label: 'Use interactive voice response in your agents', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/voice-overview' },
  ],
};
