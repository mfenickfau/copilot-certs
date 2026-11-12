import type { Concept } from '../../types';

export const prebuiltAgentsResearcherAnalyst: Concept = {
  id: 'prebuilt-agents-researcher-analyst',
  title: 'Prebuilt Agents: Researcher, Analyst and Friends, and When to Build Your Own',
  summary:
    'Microsoft ships agents that are ready to use: Researcher for cited multi-source research, Analyst for data analysis, Facilitator for meetings, Idea Coach, Writing Coach, Prompt Coach, Channel Agent and more. This concept covers the scenarios each one fits, how to apply them from Chat, Teams and the Office apps, how to find your agent conversations again, and how to decide when a custom agent built in Agent Builder or Copilot Studio is the better answer.',
  certs: ['ab-730', 'ab-900'],
  domains: ['ab-730-4', 'ab-900-3'],
  outcomes: ['ab-730-4-1-1', 'ab-730-4-1-2', 'ab-730-4-1-3', 'ab-730-4-1-4', 'ab-900-3-1-4', 'ab-900-3-1-5', 'ab-900-3-1-6'],
  tags: ['agents', 'researcher', 'analyst', 'facilitator', 'agent-builder', 'copilot-studio', 'agent-store'],
  difficulty: 'intermediate',
  diagram: 'copilot-extensibility-options',
  sections: [
    {
      heading: 'What a prebuilt agent is and where it fits in a workflow',
      body: `An **agent** is a specialised assistant in Copilot with its own instructions, knowledge sources and sometimes skills or actions, so it answers consistently for a scoped task. Microsoft's prebuilt agents need no configuration; you find them under **Agents** in the Copilot app or Teams, in the **Agent Store** (Microsoft, partner and organisation agents), or by **@mentioning** them in a chat.

Use a prebuilt agent when the work:

- is a **recognisable pattern** (deep research, data analysis, running a meeting, planning a presentation) rather than a one-off question;
- benefits from **structure and consistency** (clarifying questions, a report format, citations);
- needs **more reasoning or more steps** than a single Chat turn.

Stay in plain Copilot Chat for quick summaries, short replies and back-and-forth that does not need heavy analysis. Hand the work to **Cowork** when it spans several deliverables and actions across apps.

The main Microsoft agents a business user meets:

| Agent | What it does | Where |
|---|---|---|
| **Researcher** | Multi-step research across work content, connectors and the web; a cited, structured report | Copilot Chat (Agents), mobile |
| **Analyst** | Data analysis across files: comparisons, trends, calculations, charts; Excel-style tasks | Copilot Chat |
| **Facilitator** | Agenda, timer, shared AI notes, tasks and Q&A in Teams meetings | Teams meetings, Teams Rooms |
| **Channel Agent** | Status reports, deadlines, tasks and Q&A for a Teams channel | Teams channels |
| **Idea Coach** | Structured brainstorming and narrative planning | Copilot Chat, Teams |
| **Writing Coach / Prompt Coach / Visual Creator** | Refine tone and clarity / improve prompts / create visuals | Copilot Chat |
| **Word, Excel, PowerPoint Agents** | Create complete Office files from Chat (paid licence, Anthropic models) | Copilot app |
| **Workforce Insights, Learning, Microsoft 365 Admin agents** | Role-specific agents for HR insights, learning, and IT administration | Copilot Chat |

Researcher and Analyst require the Microsoft 365 Copilot licence; agents grounded only in instructions and public websites are included with Copilot Chat; agents that use organisational data without the licence are billed pay-as-you-go.`,
    },
    {
      heading: 'Researcher and Analyst in depth',
      body: `**Researcher** is for complex, multi-step questions where you want a shareable, source-cited report rather than a quick answer. It draws on **your work content (files, email, meetings, chats), Copilot connectors and the web** (Bing index), asks **clarifying questions** to scope the task, then spends minutes (under five for simple queries, 10 to 45 for complex ones) retrieving, analysing and writing. Output: organised sections, visuals, and citations you can verify. Facts the exam may test:

- Found under **Agents** in Copilot Chat; also @Researcher inside a chat (model picker disabled in that mode).
- Has a **Web search toggle** so you can scope to work, web or both; it obeys the tenant web-search setting.
- Follows the same **permissions, DLP, responsible-AI and data-boundary** rules as Copilot; is not trained on tenant data.
- Limit of **25 queries per user per month**; cannot process images as input; connectors are read-only; cannot be customised in Copilot Studio; users cannot remove or unpin it.
- Best practice: be specific, define the scope, and engage with the clarifying questions.

**Analyst** is the data counterpart: it reasons step by step over spreadsheets and data files, running analysis to compare datasets, calculate, find trends and produce tables and charts. Microsoft's own guidance points Excel-related and spreadsheet-creation tasks to Analyst rather than Researcher, and recommends Analyst to "compare and analyse data across files". Use it when the insight is numeric and spans more than one workbook; use Copilot in Excel for work inside one open workbook.

Both agents are part of the core Microsoft 365 Copilot experience: admins can block Researcher and Analyst through agent settings in the Microsoft 365 admin center, but individual users cannot disable them. Content of Researcher sessions is not directly accessible to admins or compliance tools (only usage metrics), unlike normal chats.`,
    },
    {
      heading: 'Applying an agent from different Copilot experiences',
      body: `Agents travel with you across Microsoft 365, and the exam asks "how would the user apply an agent here":

- **Copilot app and Copilot Chat**: select the agent under Agents to start a dedicated session, or type **@AgentName** in any chat to bring it into the conversation for one step ("@Idea Coach, help me structure a 20-minute pitch"). Agents can also be pinned.
- **Teams**: agents appear under Agents in the left navigation and can be @mentioned in chats; **Facilitator** is enabled per meeting (scheduling toggle or More actions during the meeting) and prompted with @Facilitator in the meeting chat; **Channel Agent** is added to a channel and @mentioned there.
- **Outlook**: Copilot Chat in Outlook offers the same agents for mail-centric work.
- **Word, Excel, PowerPoint**: the Agent Store is reachable from the Office apps, and agents such as Idea Coach can be used alongside the Copilot pane (plan with Idea Coach, then create in PowerPoint).
- **Cowork**: rather than agents, Cowork loads **skills** (Deep Research, Daily Briefing, Meetings, Excel and so on) to do similar jobs inside a larger task; you can also reference an earlier Researcher chat as context for a Cowork task.
- **SharePoint**: site owners can create no-code agents scoped to a site's content, which appear to site users.

Finding what an agent did later: agent sessions are stored in your Chats and the history can be **filtered by agent**; each agent's page also lists recent chats with it. In Cowork, the Tasks view and projects hold delegated work.

Availability depends on your organisation's Agent Store settings; admins deploy, assign, block or remove agents from the Microsoft 365 admin center (Agents > All agents), and organisation-built agents go through an **admin approval request** before they appear under Built by your org.`,
    },
    {
      heading: 'Prebuilt agent or custom agent?',
      body: `Choose a **prebuilt agent** when Microsoft already ships the capability (research, analysis, facilitation, coaching) and you need no organisation-specific knowledge or process. It is instant, maintained by Microsoft, and governed like the rest of Copilot.

Choose a **custom agent** when the task needs:

- **Specific knowledge**: answers grounded only in your HR policy library, a product manual site, a set of Teams channels, or a connector, with a consistent scope and tone.
- **Specific behaviour**: a defined role, response format, approved phrasing and suggested prompts for a team process (onboarding helper, RFP assistant, field-service troubleshooter).
- **Actions or integrations**: creating tickets, looking up systems, triggering flows (Copilot Studio tools, connectors, MCP servers, agent flows).

Two build paths:

| | **Agent Builder** (in Copilot Chat) | **Microsoft Copilot Studio** |
|---|---|---|
| Who | Business users, no code; describe the agent in natural language or configure manually | Makers and developers |
| Configure | Instructions, knowledge (files, SharePoint sites, Teams chats, emails, public websites, connectors, web search), skills such as code or image generation, suggested prompts | Everything in Agent Builder plus topics, tools and actions, triggers, multiple channels, generative orchestration, custom engine agents |
| Share | Private until shared; share with people or groups as Viewer or Editor, or publish to the organisation (admin approval) | Publish to Copilot, Teams, web and other channels; admin review in the Microsoft 365 admin center |
| Licence | Needs the Microsoft 365 Copilot licence or Copilot Studio pay-as-you-go to build; agents using organisational knowledge are metered for unlicensed users | Copilot Studio licensing |

Decision rule for the exam: prebuilt if it exists, Agent Builder for a scoped knowledge-and-instructions agent a team can make itself, Copilot Studio when you need actions, triggers, channels or enterprise lifecycle. And remember you **cannot customise Researcher or Analyst**; if their behaviour is not what you need, build your own.`,
    },
  ],
  examples: [
    {
      title: 'Researcher for a competitive briefing',
      description:
        'A strategy manager asks Researcher: "Produce a briefing on Fabrikam\'s move into managed services: their public announcements since January, analyst commentary, and what our account teams have heard (emails and Teams). Scope: web and work. Audience: our leadership team." Researcher asks two clarifying questions (regions, depth), works for about 15 minutes, and returns a sectioned report with citations to news sources and internal Teams threads. She checks three citations, then shares the report as a Page.',
      takeaway: 'Researcher fits multi-source, cited, shareable research; scope it and answer its clarifying questions.',
    },
    {
      title: 'Analyst instead of Researcher for numbers (a realistic mistake)',
      description:
        'A finance associate asks Researcher to "compare Q2 and Q3 regional margins across these two workbooks and find anomalies" and gets a wordy report with little calculation. He switches to Analyst, references both workbooks, and receives a step-by-step analysis with a comparison table and a chart highlighting two outlier regions, which he verifies in Excel.',
      takeaway: 'Numbers across files are Analyst\'s job; Researcher is for narrative research. Copilot in Excel is for one open workbook.',
    },
    {
      title: 'Prebuilt is not enough: an onboarding agent',
      description:
        'An HR lead wants new hires to ask questions about benefits and get answers only from the official policy library in SharePoint, in a friendly tone, with three suggested starter prompts. No Microsoft agent does this. She uses Agent Builder in Copilot Chat: instructions ("answer only from the knowledge sources; if unsure, direct to HR"), knowledge (the HR Policies SharePoint site), suggested prompts, then shares it with the New Hires group as Viewers. When HR later wants the agent to open a ticket in ServiceNow, that requires actions, so the agent moves to Copilot Studio.',
      takeaway: 'Scoped knowledge and tone → Agent Builder; actions, triggers and channels → Copilot Studio.',
    },
    {
      title: 'Applying agents in the flow of work',
      description:
        'A product marketer uses Idea Coach in Teams to structure a launch narrative, @mentions Writing Coach in Copilot Chat to tighten the key messages, turns Facilitator on for the review meeting so the team gets shared notes and tasks, and asks Analyst to compare the two pricing scenarios before the decision. Afterwards she filters her chat history by Analyst to pull the comparison into the decision page.',
      takeaway: 'Agents are applied from Chat, Teams and meetings via Agents lists and @mentions, and found again by filtering chats by agent.',
    },
  ],
  keyPoints: [
    'A prebuilt agent is a Microsoft-built, ready-to-use specialist: Researcher (cited multi-source research), Analyst (data analysis across files), Facilitator (meetings), Channel Agent, Idea Coach, Writing Coach, Prompt Coach, Visual Creator, and the Word/Excel/PowerPoint Agents.',
    'Researcher asks clarifying questions, takes minutes, cites sources, has a Web search toggle, is limited to 25 queries per user per month, cannot be customised, and uses connectors read-only.',
    'Analyst is for numeric insight across spreadsheets and files; Copilot in Excel is for one open workbook; Researcher is for narrative research.',
    'Apply agents from Copilot Chat (Agents list or @mention), Teams (Agents, @Facilitator in meetings, Channel Agent in channels), Outlook and the Office apps via the Agent Store; Cowork uses skills instead.',
    'Filter chat history by agent to find earlier agent conversations; each agent page also lists recent chats with it.',
    'Prebuilt if Microsoft ships it; Agent Builder (no code, instructions + knowledge + suggested prompts, share as Viewer or Editor) for scoped organisational knowledge; Copilot Studio when actions, triggers, channels or enterprise lifecycle are needed.',
    'Researcher and Analyst need the Microsoft 365 Copilot licence; admins can block them, but users cannot remove them; organisation-built agents require admin approval before tenant-wide publication.',
  ],
  flashcards: [
    { front: 'What is the Researcher agent for?', back: 'Complex, multi-step research across work content, connectors and the web, producing a structured report with citations.' },
    { front: 'How long does Researcher typically take?', back: 'Under five minutes for simple queries and 10 to 45 minutes for complex ones; it asks clarifying questions first.' },
    { front: 'What usage limit applies to Researcher?', back: 'A maximum of 25 queries per user per month.' },
    { front: 'Can Researcher be customised in Copilot Studio?', back: 'No. It is a first-party agent whose logic cannot be modified; build a custom agent if you need different behaviour.' },
    { front: 'Which agent is better suited to spreadsheet and data-comparison tasks?', back: 'Analyst.' },
    { front: 'How do you bring an agent into an existing Copilot chat?', back: '@mention it, for example @Researcher or @Idea Coach.' },
    { front: 'How do you find a previous conversation with a specific agent?', back: 'Filter chat history by agent, or open the agent\'s page to see recent chats with it.' },
    { front: 'What can you configure in Agent Builder?', back: 'Name, description, icon, instructions, knowledge sources (files, SharePoint sites, Teams chats, emails, websites, connectors, web search), skills such as code or image generation, and suggested prompts.' },
    { front: 'What sharing roles exist for an Agent Builder agent?', back: 'Viewer (can use the agent) and Editor (can modify instructions, prompts and sources); it can also be published to the organisation with admin approval.' },
    { front: 'When should you choose Copilot Studio over Agent Builder?', back: 'When the agent needs actions and tools (connectors, MCP servers, flows), triggers, multiple channels, generative orchestration or enterprise lifecycle management.' },
    { front: 'Which licence do Researcher and Analyst require?', back: 'The Microsoft 365 Copilot licence.' },
    { front: 'Where do admins approve agents built by the organisation?', back: 'Microsoft 365 admin center > Agents > All agents > Requests, then Publish or Reject.' },
  ],
  quiz: [
    {
      question: 'A strategy lead needs a shareable, source-cited analysis combining internal account notes with recent industry news. Which option is MOST appropriate?',
      options: ['Copilot Chat with Quick response', 'The Researcher agent', 'Copilot in Word', 'The Facilitator agent'],
      correct: [1],
      explanation:
        'Researcher is designed for multi-step, multi-source research with citations. Quick response trades depth for speed, Word is anchored to a document, and Facilitator runs meetings.',
    },
    {
      question: 'Which TWO statements about the Researcher agent are correct? (Select two)',
      options: [
        'It can be customised with extra knowledge sources in Copilot Studio.',
        'It asks clarifying questions and may take several minutes to produce a report.',
        'It has a usage limit of 25 queries per user per month.',
        'Individual users can remove it from their Copilot experience.',
      ],
      correct: [1, 2],
      explanation:
        'Clarifying questions, longer processing and the 25-query monthly limit are documented. Researcher cannot be customised and users cannot remove or unpin it.',
    },
    {
      question: 'A finance team needs to compare margins across three workbooks and chart anomalies. Which tool fits BEST?',
      options: ['Copilot in Excel with one workbook open', 'Researcher', 'Analyst', 'Copilot in Outlook'],
      correct: [2],
      explanation:
        'Analyst handles numeric analysis across multiple files. Copilot in Excel is scoped to the open workbook, Researcher is for narrative research, and Outlook is for email.',
    },
    {
      question: 'HR wants an assistant that answers benefits questions using only the official policy SharePoint site, in a friendly tone, and is shared with new hires. No code is available. What should they use?',
      options: ['The Researcher agent', 'Agent Builder in Copilot Chat', 'A scheduled prompt', 'Copilot Cowork'],
      correct: [1],
      explanation:
        'Agent Builder creates a no-code agent with specific instructions and knowledge sources, shareable to a group. Researcher cannot be scoped to one site, scheduled prompts automate recurrence, and Cowork is for delegated tasks.',
    },
    {
      question: 'The HR agent must now create a ServiceNow ticket when it cannot answer. Which change is required?',
      options: [
        'Enable the Web content toggle for the agent.',
        'Rebuild or extend the agent in Microsoft Copilot Studio, which supports tools and actions.',
        'Share the agent with Editor permissions.',
        'Switch the agent to Think deeper.',
      ],
      correct: [1],
      explanation:
        'Actions such as creating tickets require tools, which Copilot Studio provides. Web grounding, sharing roles and model mode do not add actions.',
    },
    {
      question: 'A user wants to quickly find the conversation in which Researcher produced a report last month. What is the BEST approach?',
      options: ['Filter chat history by the Researcher agent', 'Ask Researcher to regenerate the report', 'Search the Copilot Library Images tab', 'Open the Microsoft 365 admin center'],
      correct: [0],
      explanation:
        'Chat history can be filtered by agent. Regenerating costs a query and may differ, the Library holds pages and images, and the admin center is for admins.',
    },
  ],
  statements: [
    { text: 'Researcher draws on both the web and the user\'s work content, respecting the user\'s permissions.', isTrue: true, explanation: 'It uses Microsoft Graph, connectors and the Bing index within the same permission and compliance model as Copilot.' },
    { text: 'Researcher can read images included in input documents.', isTrue: false, explanation: 'Microsoft documents that Researcher cannot process images as input.' },
    { text: 'Analyst is the recommended agent for Excel-related and spreadsheet-creation tasks.', isTrue: true, explanation: 'Microsoft\'s Researcher FAQ directs such tasks to Analyst.' },
    { text: 'Agents can be @mentioned inside an existing Copilot chat.', isTrue: true, explanation: 'For example @Researcher or @Idea Coach brings the agent into the conversation.' },
    { text: 'Agent Builder agents are visible to the whole organisation as soon as they are created.', isTrue: false, explanation: 'They are private until shared with people or groups, or published with admin approval.' },
    { text: 'Facilitator is applied to a meeting by @mentioning it in the meeting chat after turning it on for that meeting.', isTrue: true, explanation: 'It is enabled per scheduled meeting and prompted with @Facilitator.' },
    { text: 'Researcher and Analyst are included for all Copilot Chat users without a paid licence.', isTrue: false, explanation: 'They require the Microsoft 365 Copilot licence.' },
    { text: 'If a prebuilt agent nearly fits but needs organisation-specific knowledge and tone, the right move is to modify the prebuilt agent\'s instructions.', isTrue: false, explanation: 'Prebuilt Microsoft agents such as Researcher cannot be modified; build a custom agent instead.' },
  ],
  resources: [
    { label: 'Get started with Researcher agent in Microsoft Copilot (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/manage/researcher-agent' },
    { label: 'Researcher agent frequently asked questions (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/manage/faq-researcher' },
    { label: 'Work smarter with Copilot Chat: agents in Copilot Chat (training module)', url: 'https://learn.microsoft.com/en-us/training/modules/work-smarter-with-microsoft-365-copilot-chat/' },
    { label: 'Agent Store in Microsoft Copilot (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/manage/copilot-agent-store' },
  ],
};
