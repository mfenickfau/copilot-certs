import type { Concept } from '../../types';

export const howCopilotWorks: Concept = {
  id: 'how-copilot-works',
  title: 'How Microsoft 365 Copilot Works and Keeps Data Private',
  summary:
    'What happens between your prompt and the answer: grounding in your work data through Microsoft Graph and Work IQ, the large language model, responsible-AI checks, and why Copilot only ever sees what you are already allowed to see.',
  certs: ['ab-730', 'ab-900', 'ab-731'],
  domains: ['ab-730-1', 'ab-900-2', 'ab-731-2'],
  outcomes: ['ab-730-1-1-1', 'ab-730-1-1-2', 'ab-730-1-2-4', 'ab-900-2-1-1', 'ab-731-2-1-1'],
  tags: ['copilot', 'grounding', 'work-iq', 'microsoft-graph', 'privacy', 'fundamentals'],
  difficulty: 'foundations',
  diagram: 'm365-copilot-system',
  sections: [
    {
      heading: 'The request path, step by step',
      body: `Microsoft 365 Copilot is not a chatbot bolted onto Word. It is an orchestration system that sits between the app you are using, your organisation's data, and a large language model (LLM). A single prompt moves through five stages:

1. **You type a prompt** in a Copilot surface: Copilot Chat, the Copilot pane in Word, Excel, PowerPoint, Outlook or Teams, or an agent.
2. **Pre-processing and grounding.** The orchestrator enriches the prompt with context. It can pull from the document you have open, from your organisation's data through **Microsoft Graph** (mail, chats, meetings, files, people), from the **semantic index** that makes that data searchable by meaning, and, if enabled, from the web. Microsoft calls this layer of organisational understanding **Work IQ**: who you work with, what you are working on, and how your organisation operates.
3. **The LLM generates a response** from the enriched prompt. The model is hosted in the Microsoft Cloud, inside the Microsoft 365 service boundary.
4. **Post-processing.** Responsible-AI (RAI) checks, security and compliance checks, and formatting with citations are applied.
5. **The response returns to the app**, where you review, edit, or act on it.

The important consequence: the quality of a response depends as much on *what context was available* as on the words in your prompt. A vague prompt with rich grounding often beats a precise prompt with none.`,
    },
    {
      heading: 'Why Copilot cannot see what you cannot see',
      body: `Copilot inherits your identity. Every lookup it performs against Microsoft Graph runs **as you**, with exactly the permissions you already hold. If you cannot open a SharePoint site today, Copilot cannot summarise its contents for you tomorrow. This is the single most tested idea in the fundamentals exams, and the admin exams build on it.

Three guarantees follow:

- **Tenant boundary.** Your prompts, the data retrieved to ground them, and the responses stay within your Microsoft 365 tenant. They are not used to train the foundation models.
- **Existing controls apply.** Sensitivity labels, Data Loss Prevention (DLP), retention policies, conditional access and Purview auditing all apply to Copilot interactions. A document labelled *Highly Confidential* with extraction blocked will not be used as grounding for a summary, and a response that inherits a label keeps that label.
- **Oversharing is the real risk.** Copilot does not create new access; it makes *existing* over-broad access visible. If a payroll spreadsheet was shared with "Everyone" years ago, Copilot will happily surface it to anyone who asks. This is why admin preparation focuses on permissions hygiene before rollout.

For a business user the practical rule is: if Copilot shows you something surprising, the surprise is about permissions, not about Copilot.`,
    },
    {
      heading: 'What changes the answer: context sources',
      body: `Different Copilot surfaces have different context, and the exams expect you to predict the effect.

| Where you ask | Grounding available | Typical effect |
|---|---|---|
| Copilot in Word, with a document open | The open document, plus Graph if you reference files or people | Answers stay anchored to the document |
| Copilot Chat (work mode) | Microsoft Graph via Work IQ: mail, Teams, files, meetings | Answers cite your organisation's content |
| Copilot Chat with web grounding on | Bing web results in addition to Graph | Broader, more current, but less specific to you |
| An agent with its own knowledge sources | Only what the agent was configured with (a SharePoint library, a connector) | Narrow, consistent, scoped answers |
| Copilot Cowork | Long-running, multi-step task execution across apps on your behalf | Produces work products, not just text |

Two habits make a difference. First, **reference the context explicitly**: "using /Q3 plan.docx" or "based on my meeting with Priya yesterday" tells the orchestrator where to look. Second, **check which mode you are in**: a web-grounded answer about "our refund policy" may describe a competitor's policy.`,
    },
    {
      heading: 'The exam angle',
      body: `Questions about how Copilot works are usually framed as a situation with a surprising outcome. Expect patterns like:

- A user asks Copilot to summarise a file and gets "I couldn't find that." The most likely cause is that the user lacks permission to the file, not that Copilot is broken or the file is too large.
- A manager worries that prompts will train the public model. The correct response is that prompts, grounding data and responses stay within the tenant and are not used to train foundation models.
- A response quotes outdated numbers. The right move is to check the cited sources and, if the data lives in a file Copilot cannot reach, fix access or attach the file, rather than re-asking the same prompt.
- A user wants Copilot to reason about a long project history. Copilot Chat in work mode (Graph-grounded) is the better choice over Copilot in a single document.

The distractor to recognise: any answer that claims Copilot bypasses permissions, "learns" from one tenant to help another, or needs sensitivity labels removed to work. Those are always wrong.`,
    },
  ],
  examples: [
    {
      title: 'The "missing" document',
      description:
        'An operations lead asks Copilot Chat to "summarise the vendor contract for Northwind" and receives a reply that no matching document was found. A colleague runs the same prompt and gets a full summary with a citation. Nothing is wrong with Copilot: the contract sits in a Legal SharePoint site the operations lead was never granted access to. Copilot searched as her identity and found nothing she could open.',
      takeaway: 'Copilot results are bounded by the asking user\'s permissions; "not found" usually means "not permitted".',
    },
    {
      title: 'A good prompt in the wrong surface',
      description:
        'A marketer opens a blank Word document and asks Copilot to "write the launch announcement using what we decided in last week\'s planning meetings." The draft is generic. The same prompt in Copilot Chat (work mode) produces a draft citing the meeting recap and the Teams thread, because Chat is grounded in Microsoft Graph while Copilot in a blank document mainly sees the document.',
      language: 'text',
      code: `Weak (blank Word doc):
  "Write the launch announcement using what we decided last week."

Strong (Copilot Chat, work mode):
  "Draft a 150-word internal launch announcement for Project Falcon.
   Use the decisions from /Falcon planning recap.docx and my Teams
   chat with Dana on Tuesday. Tone: upbeat, plain language."`,
      takeaway: 'Pick the surface whose grounding matches the task, and point Copilot at the sources explicitly.',
    },
    {
      title: 'The oversharing discovery (a realistic mistake)',
      description:
        'After rollout, an employee asks Copilot "what is the average salary in the sales team?" and gets a precise answer sourced from a spreadsheet in an old Teams channel that had been shared with the whole company. Leadership blames Copilot. The fix is not to disable Copilot; it is to restrict the spreadsheet, run a permissions review (for example with SharePoint Advanced Management or Purview oversharing reports), and label the data so DLP can block it from grounding.',
      takeaway: 'Copilot reveals existing oversharing; the remedy is permission hygiene and labelling, not turning Copilot off.',
    },
  ],
  keyPoints: [
    'Copilot = app surface + orchestrator + grounding (Graph, semantic index, Work IQ, open document, web) + LLM + responsible-AI checks.',
    'Copilot runs as the signed-in user and can only retrieve data that user already has permission to access.',
    'Prompts, grounding data and responses stay inside the tenant and are not used to train foundation models.',
    'Sensitivity labels, DLP, retention, conditional access and auditing all apply to Copilot interactions.',
    'Oversharing, not Copilot itself, is the main data-exposure risk; fix permissions and labels before and after rollout.',
    'The surface you ask from determines the context: document pane, Graph-grounded Chat, web-grounded Chat, scoped agents, or Cowork.',
  ],
  flashcards: [
    { front: 'What does Copilot use to ground a prompt in your organisation\'s data?', back: 'Microsoft Graph (mail, chats, meetings, files, people) via the semantic index and Work IQ, plus the open document and optionally the web.' },
    { front: 'Whose permissions does Copilot use when retrieving data?', back: 'The signed-in user\'s. It never shows data the user could not open themselves.' },
    { front: 'Are Microsoft 365 Copilot prompts used to train the foundation models?', back: 'No. Prompts, grounding data and responses stay within the tenant boundary.' },
    { front: 'Name four existing Microsoft 365 controls that still apply to Copilot interactions.', back: 'Sensitivity labels, Data Loss Prevention, retention policies, conditional access (and Purview auditing).' },
    { front: 'What is Work IQ?', back: 'Microsoft\'s layer of organisational understanding: the people, content and context of your work that Copilot uses to ground responses.' },
    { front: 'A user gets "I couldn\'t find that document." What is the most likely cause?', back: 'The user does not have permission to the document, so Copilot (acting as them) cannot see it.' },
    { front: 'Which surface gives the broadest grounding in your organisation\'s data?', back: 'Copilot Chat in work mode, grounded in Microsoft Graph.' },
    { front: 'What is the main data-exposure risk a Copilot rollout exposes?', back: 'Pre-existing oversharing: content accessible to too many people becomes easy to find.' },
    { front: 'What happens to a response that draws on a labelled document?', back: 'It inherits the sensitivity label (the most restrictive applicable), and label-based protections continue to apply.' },
  ],
  quiz: [
    {
      question:
        'A project manager asks Copilot Chat to summarise the latest version of the budget workbook and receives a response that no such file exists. Her teammate gets a full summary with the same prompt. What is the MOST likely explanation?',
      options: [
        'The workbook exceeds the size limit Copilot can process.',
        'The project manager does not have permission to the SharePoint location where the workbook is stored.',
        'Copilot only indexes files that were created after the Copilot licence was assigned.',
        'The teammate\'s prompt was processed by a newer model version.',
      ],
      correct: [1],
      explanation:
        'Copilot retrieves data as the signed-in user, so missing permissions produce "not found". Size limits would affect both users, there is no licence-date indexing rule, and model version does not change which files are visible.',
    },
    {
      question: 'A compliance officer asks whether employee prompts in Microsoft 365 Copilot are used to improve the underlying language models. Which answer is correct?',
      options: [
        'Yes, unless the tenant opts out in the Microsoft 365 admin center.',
        'No. Prompts, grounding data and responses remain within the tenant boundary and are not used to train foundation models.',
        'Only prompts that contain no sensitivity labels are used for training.',
        'Yes, but personal identifiers are removed first.',
      ],
      correct: [1],
      explanation:
        'Tenant data stays in the tenant and is not used for foundation-model training. There is no opt-out because there is nothing to opt out of; the label-based and anonymised variants are invented.',
    },
    {
      question: 'Which TWO sources can Microsoft 365 Copilot use to ground a response in Copilot Chat work mode? (Select two)',
      options: [
        'Microsoft Graph content such as emails, Teams messages and files the user can access',
        'Any SharePoint site in the tenant regardless of the user\'s permissions',
        'The web, when web grounding is enabled',
        'Other customers\' tenants that use the same industry template',
      ],
      correct: [0, 2],
      explanation:
        'Graph content the user can access and (optionally) web results are legitimate grounding sources. Copilot never bypasses permissions and never reads other tenants.',
    },
    {
      question:
        'After a Copilot rollout, staff discover that asking about salaries returns figures from a spreadsheet in an old company-wide Teams channel. What is the MOST appropriate first action?',
      options: [
        'Disable Copilot for all users until a full data audit is complete.',
        'Restrict access to the spreadsheet, review oversharing across the tenant and apply sensitivity labels so DLP can protect similar content.',
        'Ask employees not to query salary information.',
        'Delete the Teams channel and all of its history.',
      ],
      correct: [1],
      explanation:
        'The problem is pre-existing oversharing. Fix permissions and labelling. Disabling Copilot or deleting history addresses symptoms, and asking users nicely is not a control.',
    },
    {
      question: 'A user wants a draft that reflects decisions made across several recent meetings and Teams threads. Which surface is the BEST starting point?',
      options: [
        'Copilot in a new, blank Word document',
        'Copilot Chat in work mode, grounded in Microsoft Graph',
        'Copilot in Excel',
        'Copilot Chat with web grounding only',
      ],
      correct: [1],
      explanation:
        'Work-mode Chat is grounded across meetings, chats and files. A blank document gives Copilot little context, Excel is the wrong tool, and web-only grounding ignores organisational data.',
    },
  ],
  statements: [
    { text: 'Microsoft 365 Copilot can summarise any document in the tenant, even ones the user cannot open.', isTrue: false, explanation: 'Copilot acts with the user\'s permissions and only retrieves what they can already access.' },
    { text: 'Prompts and responses in Microsoft 365 Copilot are not used to train the foundation models.', isTrue: true, explanation: 'They remain within the tenant boundary.' },
    { text: 'Sensitivity labels stop applying once content is used as grounding for a Copilot response.', isTrue: false, explanation: 'Labels and DLP continue to apply, and responses inherit the label of the content they draw on.' },
    { text: 'Work IQ refers to Copilot\'s understanding of your organisation\'s people, content and context.', isTrue: true, explanation: 'It is the organisational-context layer that grounds responses.' },
    { text: 'Oversharing in SharePoint and Teams is a leading cause of unexpected Copilot results.', isTrue: true, explanation: 'Copilot makes existing over-broad access easy to discover.' },
    { text: 'Copilot in a blank Word document has the same grounding as Copilot Chat in work mode.', isTrue: false, explanation: 'The document pane is anchored to the document; work-mode Chat is grounded in Microsoft Graph.' },
  ],
  resources: [
    { label: 'Microsoft 365 Copilot overview (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-overview' },
    { label: 'Data, privacy, and security for Microsoft 365 Copilot', url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy' },
    { label: 'Study guide for Exam AB-730', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-730' },
  ],
};
