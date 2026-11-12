import type { Concept } from '../../types';

export const draftingAndAnalysingContent: Concept = {
  id: 'drafting-and-analysing-content',
  title: 'Drafting and Analysing Business Content with Work IQ and Connectors',
  summary:
    'The value of Copilot for business content comes from grounding: Work IQ brings your emails, meetings, files and people relationships into the answer, and Copilot connectors extend that reach to Salesforce, ServiceNow, Jira and other systems. This concept covers how connectors work, how to generate and analyse content from that context, how to derive insights across Work IQ, and how to judge whether the result actually meets the business goal.',
  certs: ['ab-730'],
  domains: ['ab-730-3'],
  outcomes: ['ab-730-3-1-1', 'ab-730-3-1-2', 'ab-730-3-1-5', 'ab-730-3-1-6'],
  tags: ['work-iq', 'connectors', 'grounding', 'drafting', 'insights', 'validation'],
  difficulty: 'intermediate',
  diagram: 'rag-pipeline',
  sections: [
    {
      heading: 'Connecting to sources beyond Microsoft 365 with connectors',
      body: `**Microsoft 365 Copilot connectors** (formerly Graph connectors) bring data from outside Microsoft 365 into Copilot and Copilot Search so you can ask about a Salesforce opportunity, a ServiceNow ticket or a Confluence page without opening those systems. Two families exist:

| Type | How it works | Who sets it up | Typical use |
|---|---|---|---|
| **Synced connectors (tenant configuration)** | Content is crawled and indexed into Microsoft Graph with its permissions (ACLs); the semantic index processes it like any other content | Admin, in the Microsoft 365 admin center | Broad indexing of a system for the whole organisation (Salesforce, ServiceNow, Jira, Box, Google Drive, SAP, file shares via the on-premises agent) |
| **Synced connectors (self-serve)** | Admin enables; each user signs in with their own credentials and a limited set of their recent content is indexed, scoped to that user | Admin enables, user authenticates | Personally relevant content such as your own Gmail or Google Drive |
| **Federated connectors** | Nothing is indexed; Copilot calls the source in real time over the Model Context Protocol (MCP) using the user's identity | Admin enables, user authenticates (OAuth) | Live, dynamic or sensitive data that should stay in the source system (HubSpot, Asana, Notion, Statista, Harvey and many more in the Connectors Gallery) |

Three facts the exam likes: connectors **respect source permissions** (you only see records you could see in the source); Copilot **cites the connected record** so you can open it; and connectors are **read-only by default**, although federated connectors can now create, update or delete in the source where the connector provides those tools and you approve the action. Researcher uses connectors read-only. Microsoft offers over 100 prebuilt connectors; custom synced connectors need a developer and the Graph connectors API.

For a business user, "connect to sources beyond Microsoft 365" usually means: ask your admin which connectors are enabled, sign in when a self-serve or federated connector asks you to, and then simply reference the system in your prompt ("summarise the open ServiceNow incidents for Fabrikam").`,
    },
    {
      heading: 'Generating and analysing content in business context',
      body: `With a Microsoft 365 Copilot licence, Copilot Chat grounds responses automatically in **Work IQ**: your emails, files, meetings, chats, calendar and the organisational relationships between them (who you work with, what you are working on, how your organisation operates). It understands meaning, not just keywords: a question about "budget concerns for the product launch" can surface a document titled "Q3 Revenue Risk Analysis".

How to put that to work when drafting or analysing:

- **Draft from context, not from scratch.** "Draft the customer status update for Fabrikam using last week's steering meeting recap, the open ServiceNow incidents and my email thread with their CTO" produces a draft that already contains the facts; your job becomes editing.
- **Analyse across sources.** "Compare what the sales team promised in /Proposal v3.docx with what engineering committed to in the Falcon channel; list the gaps" is a cross-source analysis a single app pane cannot do.
- **Direct the sources.** Use / to reference specific files, meetings and people; name the connector system where relevant; set the Work IQ control on, and turn the Web content toggle off when you want only internal context (or on when you need market data as well).
- **Use the right app for the output.** Chat to assemble and reason, then move to Word (document), PowerPoint (deck), Excel (analysis) or Outlook (email) to finish, or use **Edit in Pages** when several people will refine the text together.
- **Mind the grounding gaps.** Copilot only grounds in content you can access, that is indexed (recent uploads or un-crawled connector content may be missing) and that DLP does not exclude. "From your company's data" and "From the web" sections in a response show you which is which.

The key habit is the same as prompting generally: tell Copilot the business goal and the sources, not just the artefact you want.`,
    },
    {
      heading: 'Deriving insights across Work IQ',
      body: `Beyond drafting, Work IQ lets Copilot answer the questions people used to need an analyst or an hour of digging for:

- **Catch-up and status**: "What's the latest on Project Falcon from emails, chats and files, organised by source?" or "What changed on the Northwind account since my last meeting with them?"
- **People and relationships**: "Who is working on the data-platform migration and what has each of them shared recently?" or "What should I know about [attendee] before this call?" (Copilot respects profile and permission boundaries.)
- **Decisions and commitments**: "List decisions made across my meetings this month with owner and source." Citations let you jump back to the recap or message.
- **Patterns and risks**: "Across our customer escalations this quarter, what themes recur?" (Think deeper or Researcher for deeper reasoning.)
- **Cross-system views**: with connectors, "Which of my accounts with open Salesforce opportunities also have unresolved ServiceNow incidents?"

Several Copilot experiences are built specifically for this: **Copilot Search** (universal search across Microsoft 365 and connected sources that transitions into chat), **Researcher** (multi-step research across work and web with a cited report), **Analyst** (data analysis across files) and **Cowork's Deep Research and Daily Briefing skills**. Choose Chat for a quick cross-source answer, Researcher or Think deeper when the question needs reasoning, Analyst when the insight is in numbers.

Insight questions are where oversharing shows up: if Copilot returns something that surprises you, it is a permissions signal to report, not a feature to exploit.`,
    },
    {
      heading: 'Interpreting and validating AI-generated content against the goal',
      body: `A fluent draft is not a finished deliverable. Before you send, present or decide, check the output against the **business goal**, not just for grammar:

1. **Does it answer the actual question?** Compare the response with the goal in your prompt. Copilot often answers a nearby, easier question (a summary of everything rather than the three decisions you asked for).
2. **Is it grounded in the right sources?** Open the citations. Check the document version and date. If a key source is missing (not cited), add it explicitly and regenerate.
3. **Is it accurate and complete?** Verify figures, names, dates and commitments against the source. Look for what is absent: a risk, a dissenting view, a caveat the model smoothed over.
4. **Does it fit the audience and constraints?** Tone, length, confidentiality (the response inherits the most restrictive label of its sources), brand and legal requirements.
5. **Would the accountable owner sign it?** For content that leaves the team, a human who owns the outcome reviews it; Microsoft's framework is Ask, review, verify, decide, act.

Validation moves that work well: ask Copilot to list its sources and assumptions; ask "what is missing from this compared with the goal of X?"; ask a different framing of the same question and compare; for data, open the workbook and check the calculation. Record the business metric the content was meant to move (a decision made, a customer reply, time saved) so the team can tell whether Copilot is actually helping.

The exam distractor: treating speed or polish as proof of quality, or validating only the language ("it reads well") rather than the facts and the fit to purpose.`,
    },
  ],
  examples: [
    {
      title: 'Customer status update grounded in three systems',
      description:
        'An account manager asks Copilot Chat: "Draft a 150-word status update for Fabrikam\'s COO. Use the recap of Tuesday\'s steering meeting, the open ServiceNow incidents for Fabrikam, and my email thread with their CTO this week. Tone: candid but reassuring; end with next steps." The response cites the meeting recap, two ServiceNow records (via a connector) and the email thread. She checks the incident count against ServiceNow, adjusts a date, and sends it from Outlook.',
      language: 'text',
      code: `"Draft a 150-word status update for Fabrikam's COO.
 Sources: recap of Tuesday's Fabrikam steering meeting; open
 ServiceNow incidents for Fabrikam; my email thread with their CTO
 this week. Tone: candid but reassuring. End with three next steps."`,
      takeaway: 'Work IQ plus connectors let Copilot assemble the facts from Microsoft 365 and external systems; your job is to verify and finish.',
    },
    {
      title: 'The connector that was not there (a realistic mistake)',
      description:
        'A support lead asks Copilot "summarise this month\'s Jira bugs for the mobile app" and receives a vague answer with no Jira citations. Jira is not connected in his tenant, so Copilot answered from a few emails that mentioned Jira. He asks IT whether a Jira connector (synced or federated) can be enabled; until then he exports the Jira list and attaches it to the prompt so Copilot has the actual data.',
      takeaway: 'If an external system is not connected, Copilot cannot ground in it; check for citations from the source and provide the data another way meanwhile.',
    },
    {
      title: 'Validating against the goal, not the prose',
      description:
        'A product marketer asks for a one-page launch brief "to get budget approval from the CFO". Copilot returns a polished brief about features and positioning. Reading it against the goal, she notices there is no cost, no ROI and no ask. She follows up: "Add the cost from /Launch budget.xlsx, the projected ROI from the Q3 model, and a clear approval request", then checks the two figures against the workbook before sending.',
      takeaway: 'Judge AI content by whether it achieves the business goal for its audience; polish is not evidence of fit.',
    },
    {
      title: 'An insight question across Work IQ',
      description:
        'A regional director asks Copilot Chat with Think deeper: "Across my customer escalations since 1 September (emails, Teams and the escalation tracker in /Escalations.xlsx), what themes recur and which accounts appear more than twice?" Copilot groups the escalations into four themes with citations and a table of repeat accounts. She validates two surprising entries by opening the cited emails before raising the pattern with the service team.',
      takeaway: 'Work IQ turns scattered emails, chats and files into cross-source insights; verify surprising findings through the citations.',
    },
  ],
  keyPoints: [
    'Copilot connectors extend Copilot and Copilot Search to data outside Microsoft 365: synced connectors index content into Microsoft Graph (tenant or self-serve), federated connectors fetch live data over MCP without indexing.',
    'Connectors respect source permissions, Copilot cites connected records, and connectors are read-only by default (federated connectors can act in the source with user approval; Researcher stays read-only).',
    'Work IQ grounds Copilot in emails, files, meetings, chats and organisational relationships, understanding meaning rather than keywords; it only returns what the user can access.',
    'Draft and analyse by stating the business goal and naming the sources (/ files, meetings, people, connector systems), then finish in the right app or in Pages.',
    'Insight questions (status, decisions, people, themes, cross-system views) are answered in Chat, Copilot Search, Researcher, Analyst or Cowork depending on depth and data type.',
    'Validate against the goal: does it answer the question, is it grounded in the right current sources, is it accurate and complete, does it fit audience and confidentiality, would the accountable owner sign it.',
    'Missing citations from an expected source mean Copilot did not reach it: check connectors, permissions, indexing and DLP before re-prompting.',
  ],
  flashcards: [
    { front: 'What are Microsoft 365 Copilot connectors?', back: 'Connections that bring data from systems outside Microsoft 365 (Salesforce, ServiceNow, Jira and others) into Copilot and Copilot Search, either indexed into Microsoft Graph (synced) or fetched live over MCP (federated).' },
    { front: 'What is the difference between synced and federated connectors?', back: 'Synced connectors crawl and index content into Microsoft Graph (admin-configured or self-serve per user); federated connectors fetch data in real time via MCP without indexing, using the user\'s identity.' },
    { front: 'Do connectors let users see records they could not see in the source system?', back: 'No. Connectors enforce the source system\'s permissions; Copilot shows only what the user is authorised to access.' },
    { front: 'Are connectors read-only?', back: 'By default yes. Federated connectors can create, update or delete in the source where the connector provides those tools and the user approves; Researcher uses connectors read-only.' },
    { front: 'What does Work IQ add to a Copilot response?', back: 'Grounding in the user\'s emails, files, meetings, chats, calendar and organisational relationships, with semantic understanding rather than keyword matching.' },
    { front: 'How does Copilot show which parts of a response came from work data versus the web?', back: 'Responses can include sections such as "From your company\'s data" and "From the web", with separate citations.' },
    { front: 'Name three Copilot experiences designed for insights across work data.', back: 'Copilot Search, the Researcher agent and the Analyst agent (plus Cowork skills such as Deep Research and Daily Briefing).' },
    { front: 'What is the first validation question for AI-generated business content?', back: 'Does it actually answer the question and achieve the business goal stated in the prompt, for the intended audience?' },
    { front: 'A response about an external system has no citations from that system. What does it mean?', back: 'Copilot did not reach the system: the connector may not be enabled, the user may not be signed in to it, content may not be indexed, or DLP may exclude it.' },
    { front: 'What label does a draft inherit when it draws on labelled sources?', back: 'The most restrictive sensitivity label among the sources used.' },
  ],
  quiz: [
    {
      question:
        'A sales team wants to ask Copilot about live opportunity values in their CRM without that data being copied into Microsoft 365, and the data must stay current to the minute. Which connector type is MOST appropriate?',
      options: ['A synced connector with tenant configuration', 'A self-serve synced connector', 'A federated connector', 'A SharePoint document library'],
      correct: [2],
      explanation:
        'Federated connectors fetch data in real time over MCP without indexing, which fits live, dynamic data that should stay in the source. Synced connectors index content into Graph on a crawl schedule, and a document library is not a connector.',
    },
    {
      question: 'A user asks Copilot to summarise open ServiceNow incidents and gets a generic answer with no ServiceNow citations. What is the MOST likely cause?',
      options: [
        'Copilot never summarises ticketing data.',
        'The ServiceNow connector is not enabled, or the user has not authenticated to it.',
        'The user\'s Think deeper mode is turned off.',
        'The incidents are too numerous to summarise.',
      ],
      correct: [1],
      explanation:
        'Without an enabled connector (and user sign-in where required) Copilot cannot ground in the external system, so it falls back to whatever mentions exist in Microsoft 365. Model mode and volume do not remove citations.',
    },
    {
      question: 'Which TWO checks are part of validating that a Copilot-generated budget brief meets its business goal? (Select two)',
      options: [
        'Confirm the figures against the cited workbook version the finance team considers authoritative.',
        'Confirm the brief contains the approval request and ROI the CFO needs to decide.',
        'Confirm the brief was generated in under ten seconds.',
        'Confirm the response used the Quick response model.',
      ],
      correct: [0, 1],
      explanation:
        'Validation means checking accuracy against sources and fit to the goal and audience. Speed and model mode say nothing about quality or fitness for purpose.',
    },
    {
      question: 'A regional director wants to know which recurring themes appear across customer escalations in emails, Teams and a tracking workbook this quarter. Which approach is the BEST starting point?',
      options: [
        'Copilot in Excel with the tracking workbook open',
        'Copilot Chat in work mode (Think deeper) referencing the workbook, with Work IQ on',
        'Copilot Chat with Work IQ turned off',
        'Copilot in Outlook on one escalation email',
      ],
      correct: [1],
      explanation:
        'Cross-source insight questions need Graph/Work IQ grounding in Chat; deeper reasoning helps with theme detection. Excel sees only the workbook, turning off Work IQ removes the sources, and Outlook on one email is too narrow.',
    },
    {
      question: 'A user with a connector to Salesforce asks about an opportunity they are not permitted to see in Salesforce. What happens?',
      options: [
        'Copilot shows the record because connectors run with admin permissions.',
        'Copilot does not return the record; connectors enforce the source system\'s permissions.',
        'Copilot returns the record but hides the amount.',
        'Copilot asks the Salesforce admin for approval.',
      ],
      correct: [1],
      explanation:
        'Connector content carries the source ACLs (synced) or is fetched as the user (federated); either way, the user sees only what they can access in the source.',
    },
    {
      question: 'Which statement about Copilot connectors and write actions is correct as of late 2026?',
      options: [
        'All connectors can freely write to external systems without user confirmation.',
        'Connectors are read-only by default; federated connectors can create, update or delete where tools are provided and the user approves, while Researcher remains read-only.',
        'Only synced connectors support write actions.',
        'Write actions are available only in Copilot in Excel.',
      ],
      correct: [1],
      explanation:
        'Microsoft documents read-only as the default, with write capability arriving through federated connectors with user approval, and Researcher excluded.',
    },
  ],
  statements: [
    { text: 'Synced connectors index external content into Microsoft Graph along with its access control lists.', isTrue: true, explanation: 'This is how Copilot and Microsoft Search enforce source permissions on indexed content.' },
    { text: 'Federated connectors copy the external system\'s data into Microsoft 365 nightly.', isTrue: false, explanation: 'Federated connectors fetch data live over MCP and do not index it.' },
    { text: 'Self-serve synced connectors use the user\'s own credentials and index content scoped to that user.', isTrue: true, explanation: 'The admin enables the connector; each user authenticates and only their content is synced.' },
    { text: 'Work IQ matches only exact keywords in file names and email subjects.', isTrue: false, explanation: 'It uses semantic understanding, surfacing related content such as a risk analysis when you ask about budget concerns.' },
    { text: 'A response that reads fluently and arrived quickly can be assumed to meet the business goal.', isTrue: false, explanation: 'Fit to the goal, accuracy against sources and suitability for the audience must be checked explicitly.' },
    { text: 'Copilot can show separate sections for information from your company\'s data and from the web.', isTrue: true, explanation: 'This helps users judge which claims are internal and which are public.' },
    { text: 'The Researcher agent can update records in connected systems through federated connectors.', isTrue: false, explanation: 'Researcher uses connectors read-only.' },
    { text: 'If Copilot surfaces a record you did not expect to be able to see, you should report it as a possible oversharing issue.', isTrue: true, explanation: 'Copilot reveals existing over-broad access; the remedy is permission hygiene, not exploiting the result.' },
  ],
  resources: [
    { label: 'Copilot connectors overview (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview' },
    { label: 'Federated connectors overview (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/federated-connectors-overview' },
    { label: 'Work smarter with Microsoft Copilot Chat (training module)', url: 'https://learn.microsoft.com/en-us/training/modules/work-smarter-with-microsoft-365-copilot-chat/' },
    { label: 'Work IQ overview (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/work-iq' },
  ],
};
