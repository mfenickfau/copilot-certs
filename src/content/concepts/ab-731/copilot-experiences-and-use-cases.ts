import type { Concept } from '../../types';

export const copilotExperiencesAndUseCases: Concept = {
  id: 'copilot-experiences-and-use-cases',
  title: 'Microsoft Copilot Experiences: Versions, Apps, Chat and the Reasoning Agents',
  summary:
    'How to map business processes to the right Copilot experience: the three licence-defined versions (Copilot Chat, Microsoft 365 Copilot Basic and Premium), the web, desktop and mobile Copilot app, what Copilot does inside Word, Excel, PowerPoint, Outlook, Teams and Loop, and when to reach for the Researcher and Analyst reasoning agents.',
  certs: ['ab-731', 'ab-900', 'ab-730'],
  domains: ['ab-731-2', 'ab-900-3', 'ab-730-1'],
  outcomes: ['ab-731-2-1-1', 'ab-731-2-1-2', 'ab-731-2-1-3', 'ab-731-2-1-4', 'ab-731-2-1-9', 'ab-900-3-1-4', 'ab-900-3-1-5', 'ab-730-1-1-4'],
  tags: ['microsoft-365-copilot', 'copilot-chat', 'researcher', 'analyst', 'use-cases', 'licensing'],
  difficulty: 'foundations',
  diagram: 'm365-copilot-system',
  sections: [
    {
      heading: 'Three versions, defined by grounding and licence',
      body: `Microsoft is renaming the product **Microsoft 365 Copilot** to **Microsoft Copilot**; the exam may use either name, and the licence keeps the Microsoft 365 Copilot name. What matters for a leader is that there are three distinct experiences, and the difference is **what the AI can see** and **where it appears**:

| Experience | Who gets it | Grounding | Where |
|---|---|---|---|
| **Copilot Chat (Basic)** | Included with eligible Microsoft 365 licences at no extra cost | Web data; organisational content only if you upload it, have it open in Teams or Outlook, or use a pay-as-you-go agent | Copilot app (web, desktop, mobile), Edge, Outlook and Teams |
| **Microsoft 365 Copilot (Basic)** | Users without the add-on who have standard, non-priority access to Copilot inside apps | Web data plus the document you have open; no Microsoft Graph grounding in chat | Word, Excel, PowerPoint, OneNote, subject to fair-use limits and capacity |
| **Microsoft 365 Copilot (Premium)** | The paid add-on licence (also included in Microsoft 365 E7) | Web **and** work data automatically through Microsoft Graph and Work IQ, Copilot Search and the semantic index | All apps with priority access, plus Copilot Cowork and Copilot Code via usage-based billing |

All three run under **Enterprise Data Protection** when the user signs in with a work account: prompts and responses are protected like Exchange mail, and are not used to train foundation models. Web grounding can be turned on or off by administrators for all tiers.

The leadership decision is therefore: who needs **work-grounded** assistance (Premium) versus **secure web chat** (Chat, free), and whether metered agents or Cowork should be enabled for specific groups. Microsoft Copilot Business offers the Premium capabilities to organisations of up to 300 users on eligible Business plans.`,
    },
    {
      heading: 'Copilot Chat on web, desktop and mobile',
      body: `The **Microsoft Copilot app** is one client for web (copilot.cloud.microsoft), Windows and macOS desktop, and Android and iOS mobile. Key capabilities a leader should know:

- **Work and personal are separated.** The app shows a "Work" label and a data-protection shield for Entra accounts; nothing flows between the personal and work experiences, and tenant restrictions can block personal sign-in on managed devices.
- **Chat** answers questions, drafts, summarises uploaded files and (for Premium users) reasons over mail, meetings, files and people with citations. **Pages** turns a chat into a persistent, editable, shareable Loop-based canvas for collaborative work. **Notebooks** gather sources for a project.
- **Agents** appear in the chat side panel: Microsoft's prebuilt agents such as Researcher and Analyst, plus agents the organisation builds or buys. Declarative agents grounded in instructions and public web are included with Copilot Chat; agents that use work data are available to Premium users or on pay-as-you-go.
- **Cowork** (Premium plus usage-based billing) carries out multi-step tasks across Microsoft 365 on the user's behalf, with a plan the user reviews.
- **Mobile** gives the same chat, voice input, photo and document upload, and access to agents, so frontline and travelling staff can use Copilot without a laptop.
- **Image generation** and other actions are admin-controllable.

Use-case mapping: a frontline worker summarising a safety bulletin on a phone, a manager preparing for a meeting from the Teams-integrated chat, an analyst turning a chat into a Pages draft to share with colleagues. Each is "Copilot Chat" but the value depends on licence and grounding.`,
    },
    {
      heading: 'Copilot inside the Microsoft 365 apps',
      body: `With the Premium licence, Copilot is embedded in each app and is grounded in the content you have open plus, where relevant, Microsoft Graph:

- **Word**: draft from a prompt or referenced files, rewrite and adjust tone, summarise long documents, generate from meeting notes, and ask questions about the document.
- **Excel**: analyse tables in natural language, suggest and explain formulas, add formula columns, highlight and sort, create charts and pivot summaries, and run Python-backed advanced analysis.
- **PowerPoint**: create a deck from a Word document or a prompt, apply a template, add or restructure slides, summarise a deck and generate speaker notes.
- **Outlook**: summarise long threads, draft and coach replies for tone and clarity, schedule meetings and prepare for them, and prioritise the inbox.
- **Teams**: recap meetings and calls (with or without a transcript policy), answer "what did I miss", capture action items, and summarise channel and chat threads. Copilot in Teams meetings is the most used entry point for many organisations.
- **Loop, OneNote, Planner, Forms, SharePoint**: Copilot drafts pages, summarises notes, builds plans, writes survey questions and authors SharePoint pages and sites.

Mapping processes to these experiences is the heart of outcome 2-1-1. A **meeting-heavy management layer** maps to Teams recaps and Outlook; a **document-production function** (legal, policy, proposals) to Word and PowerPoint; **analysis roles** (finance, operations) to Excel and the Analyst agent; **customer-facing teams** to Outlook drafting and the Sales Agent; **frontline staff** to the mobile app and Chat. Start where the volume of language work is highest and the data is already in Microsoft 365.`,
    },
    {
      heading: 'Researcher and Analyst: when to use a reasoning agent',
      body: `Two prebuilt **reasoning agents** are included for licensed Copilot users and sit in the Agents list in Copilot Chat. They deliberately take longer than standard chat because they plan, retrieve and reason in multiple passes.

**Researcher** handles complex, multi-step research across the web **and** your work content (files, emails, meetings, chats you can access). It asks clarifying questions, then produces a structured, source-cited report with headings, bullets and visuals. Use it for market or competitor analysis combined with internal strategy documents, a go-to-market plan drawn from scattered threads, or a literature review. Do **not** use it for a quick summary or a short reply; standard chat is faster and cheaper.

**Analyst** is a data-reasoning agent that thinks like a data scientist: it takes spreadsheets and data files, reasons step by step, runs Python to compute, builds charts and shows its working so you can verify. Use it for forecasting from a sales workbook, identifying trends across several Excel files, or answering "why did margin fall in Q3" from raw data. Do not use it for prose research or document drafting.

Decision rule: **Researcher for questions answered with words and sources; Analyst for questions answered with numbers and charts; standard chat for anything quick.** Both respect the user's permissions and the tenant's compliance controls. For data that lives outside Microsoft 365, or for a repeatable, team-wide process, a custom agent built in Copilot Studio may be the better fit (covered in the extensibility concept).

Exam items present a task and ask which experience fits. Look for cue words: "comprehensive report with citations from web and internal documents" (Researcher), "trends across these spreadsheets with a chart" (Analyst), "summarise this thread" (standard chat or Copilot in Outlook), "on a phone without a laptop" (mobile Copilot app).`,
    },
  ],
  examples: [
    {
      title: 'Choosing the version per persona',
      description:
        'A logistics firm has 400 office staff who live in Outlook, Teams, Excel and Word, and 3,000 warehouse and driver staff with Microsoft 365 F3 licences. It assigns Microsoft 365 Copilot (Premium) to the office staff for work-grounded assistance across the apps and enables Copilot Chat on the mobile app for frontline staff to summarise procedures, translate instructions and draft incident notes from photos, at no added licence cost, with web grounding governed by policy.',
      takeaway: 'Match the version to the grounding each persona needs; Chat is a secure, free starting point and Premium adds work data.',
    },
    {
      title: 'The research request sent to the wrong tool (a realistic mistake)',
      description:
        'A strategy manager asks standard Copilot Chat for "a full competitive analysis of our three main rivals, combined with what our product roadmap says." He gets a quick, shallow paragraph and concludes Copilot is not up to the job. Reframing the task in Researcher, scoping it to web plus work content and answering its clarifying questions produces a cited, structured report pulling from the roadmap documents and recent market coverage.',
      takeaway: 'Multi-source, multi-step research belongs to Researcher; standard chat is optimised for speed.',
    },
    {
      title: 'Finance close with Analyst',
      description:
        'A finance team exports three regional sales workbooks each month and needs to explain margin movements to leadership. Analyst ingests the files, runs Python to reconcile them, charts margin by region and product, and shows the steps. The team pastes the chart and narrative into a PowerPoint created from the summary with Copilot.',
      takeaway: 'Analyst is for numeric reasoning over data files with visible working; chain it with Copilot in the apps for the deliverable.',
    },
    {
      title: 'Mapping a process end to end',
      description:
        'A consultancy maps its proposal process: Teams meeting recap captures client requirements, Copilot in Word drafts the proposal from the recap and past proposals, Copilot in Excel builds the pricing table, Copilot in PowerPoint creates the pitch deck from the Word document, and Copilot in Outlook drafts the cover note. Cycle time falls from five days to two, with reviewers still approving each artefact.',
      takeaway: 'The biggest gains come from mapping a whole process across apps, not from one clever prompt.',
    },
  ],
  keyPoints: [
    'Three experiences differ by grounding and licence: Copilot Chat (Basic, included, web-grounded), Microsoft 365 Copilot (Basic, standard in-app access without add-on) and Microsoft 365 Copilot (Premium, the add-on with Graph and Work IQ grounding, priority access, Cowork and Code via usage-based billing).',
    'Enterprise Data Protection applies to all tiers with a work sign-in; prompts and responses are not used to train foundation models.',
    'The Microsoft Copilot app spans web, desktop and mobile, separates work and personal experiences, and hosts Chat, Pages, agents and Cowork.',
    'In-app Copilot: Word drafts and rewrites, Excel analyses and builds formulas and charts, PowerPoint creates decks from documents, Outlook summarises and coaches, Teams recaps meetings and threads.',
    'Map processes by volume of language work and where the data already lives: meetings to Teams and Outlook, document production to Word and PowerPoint, analysis to Excel and Analyst, frontline to mobile Chat.',
    'Researcher: multi-step research across web and work content producing cited reports. Analyst: step-by-step data reasoning with Python and charts. Standard chat for quick tasks.',
    'Declarative agents grounded in web and instructions are included with Copilot Chat; agents using work data need the Premium licence or pay-as-you-go.',
  ],
  flashcards: [
    { front: 'What grounding does Copilot Chat (Basic) have by default?', back: 'Web data; organisational content only when uploaded, open in Teams or Outlook, or supplied through a pay-as-you-go agent. No automatic Microsoft Graph grounding.' },
    { front: 'What does the Microsoft 365 Copilot (Premium) add-on licence add?', back: 'Automatic grounding in work data through Microsoft Graph and Work IQ, priority access to Copilot in the apps, and access to Cowork and Code via usage-based billing.' },
    { front: 'Which Microsoft 365 suite includes Microsoft Copilot without a separate add-on?', back: 'Microsoft 365 E7.' },
    { front: 'What is Microsoft Copilot Business?', back: 'The Copilot add-on for organisations of up to 300 users on eligible Microsoft 365 Business plans, with the same capabilities on an annual commitment.' },
    { front: 'On which platforms is the Microsoft Copilot app available?', back: 'Web (copilot.cloud.microsoft), Windows and macOS desktop, Android and iOS mobile.' },
    { front: 'What are Pages in Copilot Chat?', back: 'A persistent, editable, shareable Loop-based canvas created from a chat for collaborative work.' },
    { front: 'When should you choose Researcher?', back: 'For complex, multi-step research across the web and your work content that needs a structured, source-cited report.' },
    { front: 'When should you choose Analyst?', back: 'For reasoning over data files: trends, forecasts and explanations with Python-backed computation and charts, showing its working.' },
    { front: 'What does Copilot in Teams do in meetings?', back: 'Recaps the meeting, answers what you missed, captures decisions and action items, and summarises chats and channels.' },
    { front: 'Does web grounding apply differently across the three Copilot versions?', back: 'All versions can use web data; administrators control web search with a single policy that applies across Copilot Chat experiences.' },
  ],
  quiz: [
    {
      question:
        'A regional manager needs a comprehensive report comparing three competitors\' recent pricing announcements with the strategy deck and customer feedback stored in her team\'s SharePoint site, with citations. Which Copilot experience is the BEST fit?',
      options: [
        'Standard Copilot Chat with a single prompt',
        'The Researcher agent scoped to both web and work content',
        'The Analyst agent',
        'Copilot in PowerPoint',
      ],
      correct: [1],
      explanation:
        'Multi-source research across web and internal documents with citations is Researcher\'s purpose. Standard chat is for quick tasks, Analyst reasons over data files, and Copilot in PowerPoint produces slides rather than research.',
    },
    {
      question:
        'A finance analyst has four Excel exports of regional sales and must explain why margin fell last quarter, with a chart. Which Copilot capability is MOST appropriate?',
      options: [
        'The Analyst agent',
        'The Researcher agent',
        'Copilot in Outlook',
        'Copilot Chat (Basic) with web grounding',
      ],
      correct: [0],
      explanation:
        'Analyst reasons step by step over data files, runs Python and produces charts. Researcher is for document and web research, Outlook is for mail, and web grounding does not contain the company\'s sales data.',
    },
    {
      question: 'Which TWO statements about Copilot versions are correct? (Select two)',
      options: [
        'Copilot Chat (Basic) is included with eligible Microsoft 365 licences and is grounded primarily in web data.',
        'Microsoft 365 Copilot (Premium) automatically grounds responses in work data through Microsoft Graph and Work IQ.',
        'Copilot Chat (Basic) automatically reasons over the user\'s mailbox and files.',
        'Microsoft 365 Copilot (Premium) is available only to organisations with more than 300 users.',
      ],
      correct: [0, 1],
      explanation:
        'Chat is included and web-grounded; Premium adds automatic Graph grounding. Chat does not automatically read mail and files, and Premium capabilities are available to smaller organisations through Microsoft Copilot Business.',
    },
    {
      question:
        'A hospital wants 2,000 nurses without laptops to summarise shift procedures and draft incident notes from photos, at minimal additional licence cost, with enterprise data protection. What should you recommend?',
      options: [
        'Assign Microsoft 365 Copilot (Premium) to every nurse',
        'Enable Copilot Chat in the Microsoft Copilot mobile app with work sign-in',
        'Deploy Copilot in Excel on shared workstations',
        'Build a custom engine agent on Foundry',
      ],
      correct: [1],
      explanation:
        'Copilot Chat on mobile with a work account provides summarisation, photo and document upload and EDP at no added licence cost. Premium for all is unnecessary expense, Excel is the wrong tool, and a custom agent is far more than the need.',
    },
    {
      question: 'A sales director wants to cut the time to produce client proposals. Which mapping of process steps to Copilot experiences is MOST appropriate?',
      options: [
        'Teams meeting recap for requirements, Copilot in Word to draft from the recap and past proposals, Copilot in PowerPoint to create the pitch deck from the document',
        'Analyst for requirements, Copilot in Excel to draft the proposal text, Researcher to create the deck',
        'Copilot in Outlook for the pricing table and Copilot in PowerPoint for the meeting recap',
        'Copilot Chat (Basic) with web grounding to write the proposal from public information only',
      ],
      correct: [0],
      explanation:
        'Each step uses the app whose content and grounding fit the task. The other mappings assign tools to tasks they do not perform, and web-only grounding ignores the firm\'s own requirements and history.',
    },
    {
      question: 'A user asks why Copilot Chat did not use an internal policy document to answer a question, although a licensed colleague got a cited answer. The user has an eligible Microsoft 365 licence but no Copilot add-on. What is the MOST likely reason?',
      options: [
        'The document exceeds the size Copilot can read',
        'Copilot Chat (Basic) is not grounded in Microsoft Graph, so the user must upload or open the document or use a pay-as-you-go agent',
        'Web search was disabled by the administrator',
        'The colleague used a different language model',
      ],
      correct: [1],
      explanation:
        'Without the Premium licence, Chat does not automatically reason over organisational content. Size limits would affect both users, web search is irrelevant to an internal document, and model choice does not change grounding access.',
    },
  ],
  statements: [
    { text: 'Copilot Chat (Basic) is included with eligible Microsoft 365 licences at no additional cost.', isTrue: true, explanation: 'It is the baseline secure, web-grounded chat experience.' },
    { text: 'Copilot Chat (Basic) automatically grounds answers in the user\'s email, meetings and files.', isTrue: false, explanation: 'Automatic Microsoft Graph and Work IQ grounding requires the Microsoft 365 Copilot (Premium) licence.' },
    { text: 'The Researcher agent is optimised for quick summaries and short replies.', isTrue: false, explanation: 'Researcher deliberately takes longer for deep, multi-source, cited research; standard chat handles quick tasks.' },
    { text: 'Analyst can run Python to analyse data files and shows its reasoning steps.', isTrue: true, explanation: 'That is what distinguishes Analyst from standard chat and from Researcher.' },
    { text: 'Data entered in the personal Microsoft account experience of the Copilot app flows into the work experience.', isTrue: false, explanation: 'The two experiences are separated; nothing flows between them.' },
    { text: 'Copilot in Teams can recap a meeting and list action items.', isTrue: true, explanation: 'Meeting recap is one of the most used Copilot capabilities.' },
    { text: 'Microsoft 365 E7 includes Microsoft Copilot without a separate add-on licence.', isTrue: true, explanation: 'E7 bundles Copilot; other eligible plans need the add-on.' },
  ],
  resources: [
    { label: 'Microsoft Copilot overview', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-overview' },
    { label: 'Microsoft Copilot app overview (web, desktop, mobile)', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/copilot-app-overview' },
    { label: 'Get started with Researcher agent', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/researcher-agent' },
    { label: 'License options for Microsoft Copilot', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-licensing' },
  ],
};
