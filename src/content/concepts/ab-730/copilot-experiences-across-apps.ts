import type { Concept } from '../../types';

export const copilotExperiencesAcrossApps: Concept = {
  id: 'copilot-experiences-across-apps',
  title: 'Choosing the Right Copilot Experience: Chat, Apps, Agents and Cowork',
  summary:
    'Microsoft Copilot shows up as Copilot Chat, as a pane inside Word, Excel, PowerPoint, Outlook and Teams, as purpose-built agents, and as Copilot Cowork. Each has different grounding, licensing and strengths; the exam tests whether you can pick the right one for the shape of the work.',
  certs: ['ab-730', 'ab-900'],
  domains: ['ab-730-1', 'ab-900-3'],
  outcomes: ['ab-730-1-1-3', 'ab-730-1-1-4', 'ab-900-3-1-1'],
  tags: ['copilot-chat', 'cowork', 'agents', 'microsoft-365-apps', 'licensing', 'fundamentals'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'One Copilot, four shapes of work',
      body: `Microsoft now uses the name **Microsoft Copilot** for the whole experience (the exam may still say "Microsoft 365 Copilot", and that name remains the name of the licence). Underneath the single brand there are four distinct ways of working:

| Experience | What it is | How you interact |
|---|---|---|
| **Copilot Chat** | The conversational assistant in the Microsoft Copilot app (copilot.cloud.microsoft, desktop, mobile), Teams, Outlook and Edge | One prompt, one result; you steer every turn |
| **Copilot in the apps** | The Copilot pane inside Word, Excel, PowerPoint, Outlook, OneNote and Teams | Works on the content you have open: draft, rewrite, analyse, summarise |
| **Agents** | Purpose-built assistants with their own instructions and knowledge: Researcher, Analyst, Facilitator, Idea Coach, agents your organisation builds | You pick the agent that fits a scoped, repeatable task |
| **Copilot Cowork** | An agentic experience that plans and completes multi-step work across your apps on your behalf | You hand off a goal; Cowork plans, acts, asks for approval, and returns results |

Microsoft's own guidance for choosing is simple: **exploring or researching → start in Chat; creating something → start in the app; planning, analysing or multi-step → use an agent; a goal with several deliverables you would rather not manage one by one → hand it to Cowork.**

The Home tab of the Copilot app is the unified starting point for Chat and Cowork; a toggle in the prompt box switches between them.`,
    },
    {
      heading: 'Chat, agents and Cowork: the comparison the exam wants',
      body: `Microsoft's Cowork training module draws the lines like this:

- **Copilot Chat** is a *conversation*. Even heavy tasks (deep research, long drafts, analysing a spreadsheet) follow the pattern "ask one thing, review, decide what is next". Speed: seconds to minutes. Best for a quick draft, answer or insight.
- **Agents** are *purpose-built help for scoped work*. An HR agent answers benefits questions; a project agent is grounded in a specific set of files; Researcher writes a cited report. Agents are not meant to handle every part of a broad, open-ended goal; they work inside the boundaries they were configured for.
- **Cowork** is an *assignment you hand off*. "Help me prepare everything I need for Thursday's QBR" becomes a plan: find the emails, summarise past discussions, build a deck, draft the follow-up. Cowork works across email, files, calendar and Teams, pauses for approval before sensitive actions, and can run on a schedule. Speed: minutes to hours.

A useful signal from the training: **if your prompt is turning into a numbered list of steps ("first do this, then that, then create…"), you are describing a goal, and Cowork is probably the better tool.**

Licensing matters here. Copilot Chat (web-grounded) is included with eligible Microsoft 365 licences. Grounding in your work data through Microsoft Graph and Work IQ, Copilot in Word/Excel/PowerPoint with priority access, Researcher and Analyst all require the **Microsoft 365 Copilot** licence. Cowork additionally requires a usage-based billing policy because it is metered on consumption.`,
    },
    {
      heading: 'How features differ across the apps',
      body: `The same Copilot behaves differently depending on where you open it, because each app gives it different context and different actions:

- **Word**: draft from a prompt, rewrite a selection, summarise a long document, reference other files when drafting. Anchored to the open document.
- **Excel**: analyse a table, suggest formula columns, highlight and sort, create charts and PivotTables, run advanced analysis with Python. Works best on data formatted as a table.
- **PowerPoint**: create a deck from a prompt or from a Word document, add slides, rewrite slide text, generate images with Designer, apply your branded template, summarise the deck. Two modes: *Allow editing* (Copilot changes slides) and *Chat only*.
- **Outlook**: draft and reply to email, summarise long threads, get coaching on tone and clarity, prepare for meetings from the calendar event.
- **Teams**: summarise chats and channels (30-day default window), catch up on meetings, answer questions privately during a meeting from the live transcript, intelligent recap afterwards.
- **Copilot Chat (work)**: reason across mail, chats, meetings and files at once; use agents; create Pages; schedule prompts; use connectors to reach data outside Microsoft 365.

In Chat, a **Work IQ control** lets you turn work-data grounding on or off without starting a new conversation (on by default). A **Web content** toggle does the same for web grounding. Both change the answer you get, so knowing which is on is part of using Copilot well.

Users without the Microsoft 365 Copilot licence (Copilot Chat Basic) can still use organisational content, but only by uploading or pasting it, or by using Chat with content open in Teams or Outlook. They do not get automatic Graph grounding.`,
    },
    {
      heading: 'The exam angle',
      body: `Expect "which experience should the user choose?" items. Patterns:

- Someone wants a quick summary of an email thread → Copilot Chat or Copilot in Outlook, not Researcher (overkill, slow) and not Cowork.
- Someone needs a cited, multi-source report that combines internal files and the web → Researcher agent.
- Someone must build a deck, draft follow-up emails and book a review meeting from one request → Cowork.
- A recurring, scoped task for a department (answer policy questions from a SharePoint library) → an agent, not repeated Chat prompts.
- A user is "ready to create" a document with a clear goal → open the app and use the Copilot pane rather than Chat.

Distractors usually propose the right tool for a *different* shape of work: Cowork for a one-line question, Copilot in Word when the information lives across Teams and email, or Copilot Chat Basic (web only) when organisational grounding is needed. Also watch licence traps: Cowork and the Word/Excel/PowerPoint agents in the Copilot app need the paid licence; web-grounded Chat does not.`,
    },
  ],
  examples: [
    {
      title: 'Picking the tool by the shape of the work',
      description:
        'A sales manager has three needs on Monday morning: understand what a customer said in last week\'s thread, produce a competitive briefing with sources for Thursday, and get a renewal deck, follow-up emails and a scheduling of the internal review done. She uses Copilot in Outlook for the first (one summary of open content), Researcher for the second (deep, cited, multi-source) and hands the third to Cowork as a single assignment, approving each email before it is sent.',
      takeaway: 'Match the experience to the work: open content → app pane; cited research → Researcher; several deliverables across apps → Cowork.',
    },
    {
      title: 'The right prompt in the wrong place (a realistic mistake)',
      description:
        'An analyst opens Copilot in a blank Excel workbook and asks for "a summary of the budget decisions we made in the finance channel". Copilot has nothing to work with: Copilot in Excel sees the workbook, not Teams. He moves to Copilot Chat in work mode, where Graph grounding finds the channel thread and the meeting recap, then pastes the resulting table into Excel to continue the analysis.',
      language: 'text',
      code: `Wrong surface (Copilot in Excel, blank workbook):
  "Summarise the budget decisions from the finance channel."

Right surface (Copilot Chat, work mode):
  "Summarise the budget decisions made in the Finance Planning
   channel since 1 October. Output a table: decision, owner, date."`,
      takeaway: 'The app pane is anchored to the open file; cross-app questions belong in Copilot Chat with Work IQ on.',
    },
    {
      title: 'Web-only Chat answers the wrong question',
      description:
        'A new hire without a Microsoft 365 Copilot licence asks Copilot Chat "what is our parental leave policy?" and gets a generic description of statutory leave from the web. Nothing is broken: Copilot Chat Basic is grounded in the web, not Microsoft Graph. The fix is to upload or paste the HR policy document, use the HR agent the organisation published, or ask IT about a licence if this is a recurring need.',
      takeaway: 'Without the Copilot licence, organisational content must be provided explicitly or reached through an agent; Chat Basic is web-grounded.',
    },
  ],
  keyPoints: [
    'Copilot Chat = a conversation you steer; agents = scoped, purpose-built help; Cowork = an assignment you hand off that runs across apps and asks for approval.',
    'Exploring → Chat; creating → the app pane; planning/analysing → an agent; many deliverables across apps → Cowork.',
    'Each app gives Copilot different context and actions: Word drafts and summarises the document, Excel analyses tables and builds charts, PowerPoint creates and edits slides, Outlook drafts and coaches email, Teams recaps chats and meetings.',
    'The Work IQ control and the Web content toggle in Chat change what grounds a response; both are on by default.',
    'Web-grounded Copilot Chat is included with eligible Microsoft 365 licences; Graph/Work IQ grounding, Copilot in the apps with priority access, Researcher and Analyst need the Microsoft 365 Copilot licence; Cowork also needs a usage-based billing policy.',
    'A prompt that reads like a list of steps is a signal to use Cowork instead of managing each step in Chat.',
    'Microsoft 365 Copilot has been renamed Microsoft Copilot in the product; the licence keeps the Microsoft 365 Copilot name.',
  ],
  flashcards: [
    { front: 'What are the four main Copilot experiences a business user chooses between?', back: 'Copilot Chat, Copilot in the Microsoft 365 apps (Word, Excel, PowerPoint, Outlook, Teams), agents (prebuilt or custom) and Copilot Cowork.' },
    { front: 'When should you use Copilot Chat rather than Cowork?', back: 'For a single task you can describe in one prompt and want to steer turn by turn: a draft, an answer, a summary, an insight.' },
    { front: 'When is Cowork the better choice?', back: 'When the work has several tasks or deliverables across email, files, calendar or Teams, may need approvals, or should run on a schedule, and you would rather hand off the goal than manage every step.' },
    { front: 'What is an agent best for?', back: 'A scoped, repeatable task or domain, such as answering HR policy questions, researching with citations (Researcher) or facilitating a meeting (Facilitator).' },
    { front: 'What does the Work IQ control in Copilot Chat do?', back: 'Turns grounding in your organisational data (emails, files, meetings, people) on or off without starting a new chat. It is on by default.' },
    { front: 'Which Copilot experiences require the Microsoft 365 Copilot licence?', back: 'Graph/Work IQ-grounded Chat, Copilot in Word, Excel, PowerPoint and Outlook with priority access, Researcher and Analyst. Cowork also needs a usage-based billing policy.' },
    { front: 'How can a Copilot Chat (Basic) user bring organisational content into a chat?', back: 'Upload or paste the content, use Chat with the content open in Teams or Outlook, or use a pay-as-you-go agent that has access to organisational data.' },
    { front: 'What are the two modes of the Copilot pane in PowerPoint?', back: 'Allow editing (Copilot creates and modifies slides directly) and Chat only (Copilot answers without changing the deck).' },
    { front: 'Where is Copilot Chat available?', back: 'The Microsoft Copilot app at copilot.cloud.microsoft, the desktop and mobile apps, Teams, Outlook and the Edge sidebar.' },
    { front: 'What is the Home tab in the Copilot app?', back: 'The unified starting point for Chat and Cowork; a toggle in the prompt box switches between them.' },
  ],
  quiz: [
    {
      question:
        'A marketing lead needs to prepare for a quarterly business review: gather the last quarter\'s customer emails, summarise the decisions, build a slide deck and draft a status email to stakeholders. She wants to hand the whole thing off and come back to results. Which experience is MOST appropriate?',
      options: [
        'Copilot in PowerPoint with Allow editing turned on',
        'Copilot Chat in work mode, one prompt per task',
        'Copilot Cowork',
        'The Researcher agent',
      ],
      correct: [2],
      explanation:
        'Several deliverables across email, files and PowerPoint, handed off as one goal, is exactly what Cowork is for. Copilot in PowerPoint only builds the deck, Chat would need her to manage each step, and Researcher produces a research report rather than acting across apps.',
    },
    {
      question: 'A user wants a quick summary of a 40-message Teams chat before a call in five minutes. Which approach is the BEST fit?',
      options: [
        'Open the chat and select the Copilot icon to summarise what was missed',
        'Delegate the summary to Copilot Cowork',
        'Ask the Researcher agent for a report on the chat',
        'Open a blank Word document and ask Copilot to summarise the chat',
      ],
      correct: [0],
      explanation:
        'Copilot in Teams chat is anchored to the open conversation and answers in seconds. Cowork and Researcher are built for multi-step or deep work and take longer; Copilot in a blank Word document has no access to the chat.',
    },
    {
      question: 'Which TWO statements about licensing for Copilot experiences are correct? (Select two)',
      options: [
        'Copilot Chat grounded in web data is available to users with eligible Microsoft 365 licences without the Microsoft 365 Copilot add-on.',
        'Researcher and Analyst are available to every Copilot Chat user at no cost.',
        'Copilot Cowork requires a Microsoft 365 Copilot licence and an assigned usage-based billing policy.',
        'Copilot in Word requires a separate Word Copilot licence that is sold per application.',
      ],
      correct: [0, 2],
      explanation:
        'Web-grounded Copilot Chat is included with eligible Microsoft 365 licences, and Cowork is a usage-billed capability for Microsoft 365 Copilot licensed users. Researcher and Analyst require the Microsoft 365 Copilot licence, and there is no per-app Copilot licence for Word.',
    },
    {
      question: 'An employee without a Microsoft 365 Copilot licence asks Copilot Chat about the company\'s expense policy and receives a generic answer from the web. What should they do to get an answer based on the actual policy with the LEAST effort?',
      options: [
        'Upload the policy document to the chat or use the published HR agent',
        'Turn off the Web content toggle and ask again',
        'Switch to Copilot in Excel',
        'Ask the Facilitator agent',
      ],
      correct: [0],
      explanation:
        'Copilot Chat (Basic) has no Graph grounding, so the user must provide the content or use an agent that has it. Turning off web content leaves Copilot with nothing, Excel is unrelated, and Facilitator is a meeting agent.',
    },
    {
      question: 'A team lead\'s prompt in Copilot Chat has grown into "first find the emails, then summarise, then create a tracker, then draft replies to each vendor". According to Microsoft guidance, what does this signal?',
      options: [
        'The prompt should be split into several Copilot in Outlook prompts',
        'The work is a larger goal and is a good candidate for Copilot Cowork',
        'The user needs the Microsoft 365 Copilot licence removed and replaced with Copilot Chat Basic',
        'The user should disable Work IQ to speed up the response',
      ],
      correct: [1],
      explanation:
        'A prompt that reads as a list of steps describes a goal with several deliverables, which Microsoft identifies as a Cowork scenario. The other options do not address the multi-step nature of the work.',
    },
  ],
  statements: [
    { text: 'In Copilot Chat you steer each turn; in Cowork you describe an outcome and Cowork plans and executes the steps.', isTrue: true, explanation: 'This is the core distinction Microsoft draws between the two experiences.' },
    { text: 'Agents are designed to handle every part of any broad, open-ended business goal.', isTrue: false, explanation: 'Agents work within the scope they were built or configured for; open-ended multi-step goals are a better fit for Cowork.' },
    { text: 'Copilot in Excel can summarise a Teams channel conversation without any reference to Teams content.', isTrue: false, explanation: 'Copilot in an app is anchored to the open content; cross-app questions belong in Copilot Chat.' },
    { text: 'The Work IQ control in Copilot Chat is on by default and can be turned off mid-conversation.', isTrue: true, explanation: 'Turning it off removes organisational context from responses without starting a new chat.' },
    { text: 'Copilot Cowork is included with every eligible Microsoft 365 licence at no additional cost.', isTrue: false, explanation: 'Cowork requires the Microsoft 365 Copilot licence plus a usage-based billing policy.' },
    { text: 'Microsoft recommends starting in an app such as Word or PowerPoint when you have a clear goal and are ready to create.', isTrue: true, explanation: 'Chat is for exploring; the app pane is for moving from idea to output.' },
    { text: 'The Microsoft 365 Copilot licence name has been retired along with the product name.', isTrue: false, explanation: 'The product is now Microsoft Copilot, but the licence keeps the Microsoft 365 Copilot name.' },
  ],
  resources: [
    { label: 'Microsoft Copilot overview: licences and experiences (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/plan/copilot-overview' },
    { label: 'Get more done with Copilot Cowork: choose the right AI tool (training module)', url: 'https://learn.microsoft.com/en-us/training/modules/delegate-work-copilot-cowork/' },
    { label: 'Get ready to work with Microsoft Copilot (training module)', url: 'https://learn.microsoft.com/en-us/training/modules/get-ready-work-microsoft-365-copilot/' },
  ],
};
