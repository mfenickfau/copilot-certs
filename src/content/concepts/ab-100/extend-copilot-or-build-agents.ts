import type { Concept } from '../../types';

export const extendCopilotOrBuildAgents: Concept = {
  id: 'extend-copilot-or-build-agents',
  title: 'Extend Microsoft 365 Copilot or Build Custom Agents',
  summary:
    'The decision every AB-100 architect makes repeatedly: use a prebuilt Microsoft 365 agent, extend Copilot with a declarative agent, or build a custom agent in Copilot Studio or Foundry. Covers prebuilt agent use cases, declarative versus custom engine agents, Agent Builder versus Copilot Studio, and how generative AI and knowledge sources shape a Copilot Studio agent.',
  certs: ['ab-100', 'ab-731'],
  domains: ['ab-100-1', 'ab-100-2', 'ab-731-2'],
  outcomes: ['ab-100-1-2-4', 'ab-100-1-2-6', 'ab-100-1-2-7', 'ab-100-2-2-2', 'ab-100-2-3-3', 'ab-731-2-1-9'],
  tags: ['microsoft-365-copilot', 'declarative-agents', 'custom-engine-agents', 'agent-builder', 'copilot-studio', 'prebuilt-agents', 'knowledge-sources'],
  difficulty: 'advanced',
  diagram: 'copilot-extensibility-options',
  sections: [
    {
      heading: 'The extensibility ladder',
      body: `Microsoft 365 Copilot can be used as-is, extended, or bypassed in favour of a fully custom agent. Think of it as a ladder where each rung adds control and cost:

1. **Prebuilt agents.** Microsoft and partner agents ready to use: **Researcher** (multi-step research with reasoning across work data and the web), **Analyst** (data analysis that writes and runs code over your files), **Facilitator** (meeting and chat notes in Teams), the **Sales agent** (CRM insights in Outlook and Teams, for Dynamics 365 Sales or Salesforce), the **Service Agent** (case summaries, knowledge and case actions from Dynamics 365 Customer Service), and **Copilot Cowork**, which performs multi-step work across apps on the user's behalf. Zero build, covered by the Microsoft 365 Copilot licence (some Dynamics 365 agents have their own licensing).
2. **Declarative agents.** You supply *instructions, knowledge and actions*; Copilot supplies the orchestrator, models, UI, responsible-AI checks and compliance. Built in **Agent Builder** (guided, inside Copilot Chat), **Copilot Studio** (richer tools, workflows, ALM) or code (Agents Toolkit, TypeSpec). They appear inside Copilot Chat, Teams and the Microsoft 365 apps.
3. **Custom engine agents.** You bring your own orchestrator and models (Microsoft 365 Agents SDK, Foundry Agent Service, Copilot Studio with custom logic) and surface the agent in Microsoft 365 or on other channels. Maximum flexibility, maximum responsibility: you own evaluation, safety and hosting.

Microsoft's guidance for choosing: can the scenario be met with instructions and supported knowledge inside Copilot? Start declarative. Do users need an external channel (website, Dynamics 365 Contact Center), external-service actions, workflow logic or dev/test/prod environments? Evaluate Copilot Studio. Do you need a model, orchestration pattern or runtime Copilot does not offer, or must the agent run outside Microsoft 365? Build a custom engine agent. Audience size alone does not force Copilot Studio: Agent Builder agents can be shared and submitted to the organisation catalog.`,
    },
    {
      heading: 'Developing use cases for prebuilt agents',
      body: `The exam asks you to *propose* Microsoft 365 agents for business scenarios and to *develop use cases* for prebuilt agents. Map the scenario to the agent's strength:

| Scenario | Prebuilt agent | Why |
|---|---|---|
| "Produce a competitive landscape brief using our internal win/loss notes and public filings" | Researcher | Multi-step reasoning across Microsoft Graph and the web, with citations |
| "Explain why churn rose last quarter from this Excel export" | Analyst | Code-based data analysis, charts and reproducible steps |
| "Keep running notes and action items during our Teams stand-ups" | Facilitator | Native Teams meeting and chat context |
| "Summarise the account and draft the follow-up before my customer call in Outlook" | Sales agent | CRM-grounded insights where sellers work; saves emails and meeting notes back to CRM |
| "Let representatives ask about a case and update it from Copilot" | Service Agent | Grounded in Customer Service cases and knowledge, with case actions |
| "Complete the quarterly vendor review end to end across SharePoint, Excel and email" | Copilot Cowork | Long-running, multi-step execution producing work products |
| "Answer questions about this document library for the whole department" | SharePoint agent (prebuilt per site, customisable) | Scoped to site content with site permissions |

Design the use case around *where the user already is* and *what grounding exists*. Prebuilt agents inherit Microsoft 365 permissions and Purview controls, so a use case that would need customers or anonymous users, external systems or custom actions is a signal to move up the ladder. Also check regional availability and licensing: Dynamics 365 agents such as the Sales Qualification Agent or Case Management Agent are configured from their product admin experiences and consume their own capacity.`,
    },
    {
      heading: 'Designing agents in Microsoft 365 Copilot',
      body: `A declarative agent has four design levers, and good architecture is mostly about getting them in proportion:

- **Instructions** set identity, scope, tone and behaviour. Microsoft's guidance: be specific about the task and audience, describe when to use each knowledge source and action, define what to do when the request is out of scope, and give examples. Instructions are not a security boundary.
- **Knowledge** can include SharePoint and OneDrive sites and files, Copilot connectors, Teams, email, meetings, Dataverse, web search and uploaded files, each security-trimmed to the user. Fewer, well-chosen sources beat many overlapping ones.
- **Capabilities and actions** add code interpreter, image generation, and API plugins or MCP actions for transactions. Actions require authentication design (OAuth, API key, single sign-on) and are where governance applies.
- **Conversation starters and connected agents** shape adoption and let a declarative agent delegate to other agents.

Lifecycle: build in Agent Builder or Copilot Studio, test in Copilot Chat, share with specific people or submit for admin approval so the agent is **published by your org**; admins manage it in the Microsoft 365 admin center under **Agents > All agents > Registry**, where the same agent can appear as *Shared by creator* and *Published by your org* entries. Use environment and version management (dev, test, prod manifests) for agents built in code, and solutions and pipelines for Copilot Studio agents.

Design rule of thumb for the exam: if the answer is "put the organisation's policy documents in front of employees inside Copilot", a declarative agent with SharePoint knowledge is correct; if the answer needs a website chat widget, voice, or a human handoff to a contact centre, you need a Copilot Studio agent instead.`,
    },
    {
      heading: 'Generative AI and knowledge sources in Copilot Studio agents',
      body: `When the decision lands on Copilot Studio, the next question is how much to rely on **generative AI** versus authored logic, and which **knowledge sources** to attach.

- **Generative orchestration** lets the agent choose among topics, tools, connected agents and knowledge based on their descriptions, ask for missing inputs itself and compose responses. It is the default for new agents and required for MCP tools, Computer Use, event triggers and deep reasoning. **Classic orchestration** triggers one topic from trigger phrases and only uses knowledge as a fallback. Regulated flows that must say exactly the approved words still favour authored topics with message nodes, even inside a generative agent.
- **Generative answers** ground responses in knowledge sources. In generative mode an agent can use up to 25 public websites and 25 SharePoint URLs, unlimited Dataverse and Copilot connector sources, uploaded documents (vector-indexed in Dataverse), Azure AI Search, Bing Custom Search and real-time Power Platform connectors (preview). Sources in a **generative answers node** override agent-level knowledge for that topic, so you can give a topic a narrow authoritative source.
- **AI general knowledge** (the model's own knowledge plus web content) can be allowed as a last resort after custom sources are exhausted; many organisations disable it for compliance agents so that "I don't know" is the answer when the knowledge base is silent.
- **Content moderation levels** trade recall for strictness; higher levels return fewer but better-grounded answers.
- **Billing shape**: classic answers cost 1 Copilot Credit, generative answers 2, agent actions 5, tenant graph grounding 10 per message, so knowledge design is also cost design.

The exam angle is to recognise the determinant: *security-trimmed, citeable enterprise knowledge with natural conversation* means generative orchestration plus knowledge sources; *strict, repeatable scripted dialogue* means authored topics; *data in a non-Microsoft system you must not copy* means a real-time connector or MCP tool rather than an indexed source.`,
    },
  ],
  examples: [
    {
      title: 'Prebuilt before custom at a law firm',
      description:
        'Partners ask for "an AI that summarises matters and researches precedent". Before scoping a build, the architect pilots Researcher for precedent research grounded in the firm\'s SharePoint knowledge and web sources, and a SharePoint agent per practice-group site for matter documents. Only the conflict-check workflow, which must write to the practice-management system, becomes a Copilot Studio agent with an API tool.',
      takeaway: 'Exhaust prebuilt agents and site-scoped SharePoint agents first; build only the part that needs actions or external systems.',
    },
    {
      title: 'Agent Builder chosen for the wrong reason (a realistic mistake)',
      description:
        'A team builds a customer-facing returns assistant in Agent Builder because it was quick, then discovers it cannot be embedded on the public website, cannot hand off to the contact centre and has no dev/test/prod separation. They rebuild in Copilot Studio with a website channel, Dynamics 365 Contact Center handoff and a solution deployed through pipelines. The Agent Builder version is kept for employees inside Copilot Chat.',
      takeaway: 'Choose by required channels, actions and lifecycle, not by build speed; Agent Builder targets Microsoft 365 Copilot audiences.',
    },
    {
      title: 'Knowledge design for a benefits agent',
      description:
        'An HR agent must answer from the official benefits handbook, never guess, and quote the exact escalation wording for grievances. The design uses generative orchestration with a single SharePoint folder as knowledge, AI general knowledge turned off, a higher moderation level, and an authored topic with message nodes for the grievance process. Test cases confirm the agent says it cannot help when the handbook is silent.',
      takeaway: 'Combine generative answers for breadth with authored topics for wording that must not vary, and switch off general knowledge when silence is safer than a guess.',
    },
    {
      title: 'Choosing between declarative and custom engine',
      description:
        'A pharmaceutical company wants an agent inside Teams that uses a domain-specific model fine-tuned in Foundry, with a multi-step orchestration pattern and custom safety evaluation. Copilot\'s orchestrator cannot swap in that model, so the architect designs a custom engine agent with the Microsoft 365 Agents SDK hosted in Foundry Agent Service, published to Teams and registered in the agent registry for governance.',
      takeaway: 'A custom model or custom orchestration requirement pushes you to a custom engine agent; everything else favours declarative.',
    },
  ],
  keyPoints: [
    'Ladder of options: prebuilt agents, declarative agents (Copilot orchestrator and models), custom engine agents (your orchestrator and models).',
    'Prebuilt Microsoft 365 agents to know: Researcher (deep research), Analyst (data analysis), Facilitator (Teams notes), Sales agent, Service Agent, Copilot Cowork, SharePoint agents.',
    'Agent Builder for guided declarative agents inside Microsoft 365 Copilot; Copilot Studio when you need external channels, tools, workflows or dev/test/prod lifecycle. Audience size alone does not decide.',
    'Declarative agent design levers: instructions, knowledge, capabilities and actions, conversation starters and connected agents. Instructions are not a security control.',
    'Published agents are governed in the Microsoft 365 admin center agent registry; the same agent can appear as Shared by creator and Published by your org.',
    'Generative orchestration picks topics, tools and knowledge by description and is required for MCP, Computer Use, event triggers and deep reasoning; classic orchestration matches trigger phrases.',
    'Generative answers node sources override agent-level knowledge; AI general knowledge is a last resort you can disable; moderation levels trade recall for strictness.',
    'Knowledge choices drive cost: generative answers 2 credits, actions 5, tenant graph grounding 10 per message, with no charge for Microsoft 365 Copilot-licensed users under their own identity.',
  ],
  flashcards: [
    { front: 'What does a declarative agent supply, and what does Copilot supply?', back: 'You supply instructions, knowledge and actions; Copilot supplies the orchestrator, models, UI and responsible-AI and compliance controls.' },
    { front: 'When do you need a custom engine agent?', back: 'When you need your own orchestrator or model, a custom orchestration pattern, or to run the agent outside Microsoft 365.' },
    { front: 'Researcher versus Analyst: which is for which?', back: 'Researcher performs multi-step research across work data and the web; Analyst performs code-based data analysis over files and data.' },
    { front: 'Three signals that you need Copilot Studio instead of Agent Builder.', back: 'An external channel (website, contact centre), external-service actions or workflow logic, and separate dev/test/prod environments with ALM.' },
    { front: 'Where do admins govern agents published to Microsoft 365?', back: 'Microsoft 365 admin center, Agents > All agents > Registry (Microsoft Agent 365).' },
    { front: 'Which Copilot Studio features require generative orchestration?', back: 'MCP tools, Computer Use, event triggers and deep reasoning (among others).' },
    { front: 'How do knowledge sources in a generative answers node relate to agent-level knowledge?', back: 'Node-level sources override the agent-level sources for that topic; agent-level knowledge acts as the fallback.' },
    { front: 'What is AI general knowledge in Copilot Studio and when would you disable it?', back: 'The model\'s own knowledge plus web content used after custom sources are exhausted; disable it when a wrong guess is worse than "I don\'t know", for example compliance agents.' },
    { front: 'Copilot Credit cost of a generative answer versus tenant graph grounding?', back: '2 credits for a generative answer, 10 for tenant graph grounding per message (classic answer 1, agent action 5).' },
    { front: 'What is Copilot Cowork?', back: 'The Microsoft 365 Copilot capability that performs long-running, multi-step work across apps on the user\'s behalf, producing work products rather than only text.' },
  ],
  quiz: [
    {
      question:
        'A finance team wants employees to ask natural-language questions about the expense policy stored in SharePoint from within Copilot Chat. No external users, no transactions and no custom model are needed. Which option requires the LEAST effort while meeting the requirement?',
      options: [
        'A custom engine agent built with the Microsoft 365 Agents SDK',
        'A declarative agent built in Agent Builder with the SharePoint policy site as knowledge',
        'A Copilot Studio agent published to a public website',
        'A Foundry hosted agent with Azure AI Search',
      ],
      correct: [1],
      explanation:
        'The scenario fits a declarative agent exactly: Copilot audience, Microsoft 365 knowledge, no actions. Custom engine and Foundry options add unnecessary build, and a public website is the wrong channel.',
    },
    {
      question:
        'Which TWO requirements indicate that Copilot Studio, rather than Agent Builder, should be used to build a declarative agent? (Select two)',
      options: [
        'The agent must be embedded in a customer-facing website',
        'The agent must be used by 5,000 employees',
        'The agent must call an external ERP API and run approval workflows',
        'The agent must answer from SharePoint documents',
      ],
      correct: [0, 2],
      explanation:
        'External channels and external actions or workflows are the stated triggers for Copilot Studio. Audience size alone does not require it (Agent Builder agents can be published to the org catalog), and SharePoint knowledge is supported by both.',
    },
    {
      question:
        'A sales director wants sellers to receive CRM-grounded account summaries and draft follow-up emails inside Outlook and Teams, with meeting notes saved back to Dynamics 365 Sales. Which Microsoft 365 agent should you propose?',
      options: ['Researcher', 'Analyst', 'Sales agent', 'Facilitator'],
      correct: [2],
      explanation:
        'The Sales agent brings CRM insights into Outlook and Teams and saves emails and meeting notes to CRM. Researcher and Analyst are general research and analysis agents; Facilitator takes meeting notes but does not integrate CRM.',
    },
    {
      question:
        'A Copilot Studio compliance agent sometimes answers policy questions with plausible but unsupported content when the policy library has no relevant document. What is the MOST appropriate change?',
      options: [
        'Switch to classic orchestration',
        'Disable AI general knowledge and raise the content moderation level so the agent declines when sources are silent',
        'Add more public websites as knowledge sources',
        'Enable deep reasoning',
      ],
      correct: [1],
      explanation:
        'Unsupported answers come from general knowledge filling gaps; disabling it and tightening moderation makes the agent decline instead. Classic orchestration does not fix grounding, more websites widen the gap, and deep reasoning does not add facts.',
    },
    {
      question:
        'A pharmaceutical company needs an agent in Teams that must use its own fine-tuned model from Foundry and a custom multi-step orchestration with bespoke safety evaluation. Which agent type is required?',
      options: [
        'A declarative agent in Agent Builder',
        'A SharePoint agent',
        'A custom engine agent hosted in Foundry Agent Service and published to Teams',
        'A prebuilt Researcher agent with custom instructions',
      ],
      correct: [2],
      explanation:
        'Only a custom engine agent lets you bring your own model and orchestrator. Declarative, SharePoint and prebuilt agents all run on Copilot\'s orchestrator and models.',
    },
    {
      question:
        'An architect must explain why the same Copilot Studio agent appears twice in the Microsoft 365 admin center agent registry. Which explanation is correct?',
      options: [
        'The agent was deployed to two Dataverse environments',
        'One entry is Shared by creator (from testing) and one is Published by your org (after admin approval); both are expected lifecycle records',
        'The registry is showing a replication error that should be reported to Microsoft',
        'One entry is the declarative agent and the other is its Power Automate flow',
      ],
      correct: [1],
      explanation:
        'Microsoft documents that an agent appears with different publisher types as separate lifecycle records. It is not an environment duplication, an error or a flow entry.',
    },
  ],
  statements: [
    { text: 'A declarative agent uses Copilot\'s orchestrator and foundation models rather than your own.', isTrue: true, explanation: 'You provide instructions, knowledge and actions only.' },
    { text: 'Agent Builder agents cannot be distributed beyond the person who created them.', isTrue: false, explanation: 'They can be shared and submitted to the organisation catalog subject to policy and admin approval.' },
    { text: 'Analyst is the prebuilt Microsoft 365 agent designed for multi-step web and work research with citations.', isTrue: false, explanation: 'That is Researcher; Analyst performs code-based data analysis.' },
    { text: 'In Copilot Studio, MCP tools and Computer Use require generative orchestration.', isTrue: true, explanation: 'Both are only available with generative orchestration turned on.' },
    { text: 'Knowledge sources configured in a generative answers node are ignored if agent-level knowledge exists.', isTrue: false, explanation: 'Node-level sources override agent-level knowledge for that topic.' },
    { text: 'Prebuilt agents such as Researcher inherit the user\'s Microsoft 365 permissions and Purview controls.', isTrue: true, explanation: 'They run inside the Microsoft 365 trust boundary with the user\'s identity.' },
    { text: 'Custom engine agents remove the organisation\'s responsibility for evaluation and safety because Copilot handles it.', isTrue: false, explanation: 'With your own orchestrator and model, you own evaluation, safety and hosting.' },
  ],
  resources: [
    { label: 'Compare declarative and custom engine agents', url: 'https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview' },
    { label: 'Choose between Agent Builder and Copilot Studio', url: 'https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/copilot-studio-experience' },
    { label: 'Orchestrate agent behavior with generative AI (Copilot Studio)', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions' },
    { label: 'Microsoft Agent 365: agent registry', url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-registry-overview' },
  ],
};
