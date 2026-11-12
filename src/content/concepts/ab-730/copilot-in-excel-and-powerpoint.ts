import type { Concept } from '../../types';

export const copilotInExcelAndPowerpoint: Concept = {
  id: 'copilot-in-excel-and-powerpoint',
  title: 'Creating Content Across Word, Excel and PowerPoint: Documents, Data, Visuals and Images',
  summary:
    'How Copilot behaves inside the core Microsoft 365 apps, how to move content between them (a Word document into a deck, a Chat answer into Excel), and how to generate the images, charts and visuals that business content needs, including Designer images, brand libraries, Excel charts and the Create experience in the Copilot app.',
  certs: ['ab-730'],
  domains: ['ab-730-3', 'ab-730-1'],
  outcomes: ['ab-730-3-1-3', 'ab-730-3-1-4', 'ab-730-1-1-4'],
  tags: ['word', 'excel', 'powerpoint', 'outlook', 'images', 'charts', 'designer', 'create'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Copilot in Word and Outlook: drafting and refining text',
      body: `**Word.** The Copilot pane and the in-document Copilot button let you *draft* from a prompt ("write a two-page proposal for…"), *draft with references* (type / to pull in up to several files from OneDrive or SharePoint so the draft uses their content), *rewrite* a selection (shorter, more formal, as a table, your own instruction), *summarise* the document and *ask questions about it* ("which sections mention pricing?"). Copilot in Word is anchored to the open document plus whatever you reference; it is not grounded in your whole mailbox the way Chat is. Full in-app Copilot with priority access requires the Microsoft 365 Copilot licence; users without it have standard access subject to capacity and fair-use limits.

**Outlook.** Copilot drafts new mail and replies from a short brief, adjusts tone and length, **summarises long threads** (who said what, open questions), offers **coaching** on clarity, sentiment and tone before you send, and surfaces **Prepare for this meeting** summaries inside calendar events. Copilot Chat is also available in Outlook's left navigation.

**OneNote** drafts plans, ideas and lists; **Forms** drafts survey questions. **Teams** rewrites messages (concise, professional, confident, custom) and summarises chats and channels.

Across every app the same four prompt elements apply: goal, context, source and expectations. The app supplies much of the context (the open content), so your prompt should focus on goal and expectations.`,
    },
    {
      heading: 'Copilot in Excel: analysing data and building charts',
      body: `Copilot in Excel analyses the data you have open and helps you act on it:

- **Understand**: "What are the top three products by margin?", "Show trends in monthly revenue". Copilot answers with explanations and can insert a summary.
- **Formulas**: suggest formula columns ("add a column that calculates year-over-year growth") and explain existing formulas.
- **Format and organise**: highlight cells meeting a condition, sort and filter, add conditional formatting.
- **Visualise**: create charts and **PivotTables** from a description ("create a bar chart of sales by region for 2026"); Copilot proposes the chart and inserts it on a new sheet so you can refine it.
- **Advanced analysis**: for deeper statistics, forecasting or custom visuals, Copilot can use **Python in Excel** to run analysis and produce charts, showing the code so an analyst can review it.

Practical requirements: data should be in a **structured range or table** with a header row and no merged cells, and the workbook should be saved in OneDrive or SharePoint with AutoSave on. Copilot does not change your data unless you ask it to; it adds suggested columns, sheets or charts you can keep or undo. For a cross-file question ("compare this quarter\'s sheet with last quarter\'s workbook") the **Analyst agent** or Copilot Chat referencing both files is the better tool.

Copilot Chat can also build charts without Excel: "Create a pie chart of market share from this data" or "Create a line chart from the table above", useful for a quick visual for a Page or a Teams post. When Copilot in a Teams meeting returns a table, **Open in Excel** moves it into a workbook for further analysis.`,
    },
    {
      heading: 'Copilot in PowerPoint: from document to deck',
      body: `Copilot in PowerPoint has two modes: **Allow editing** (Copilot creates and modifies slides) and **Chat only** (Copilot answers about the deck without changing it). Key capabilities:

- **Create a presentation from a prompt.** Copilot may ask clarifying questions (audience, tone, slide count), proposes an outline you can refine, then generates the deck.
- **Create from a file.** *Create presentation from file* turns a Word document into slides; Word documents under about 24 MB that use Word Styles for headings convert best. You can reference up to **five files** (Word, PDF, TXT, Excel in preview, Loop pages) in one prompt and tell Copilot what to take from each.
- **Use your brand.** Open your organisation's .potx template first, then create from file or prompt; Copilot uses its layouts and design. If the admin has configured a SharePoint **Organization Asset Library** (or Templafy), Copilot can insert approved brand images.
- **Edit and refine.** Add a slide about a topic, rewrite slide text (auto-rewrite, condense, make professional, custom, visualise as a list), apply deck-wide formatting changes, reorganise the flow.
- **Review.** Right-click any object and choose **Explain** for a plain-language explanation; ask Copilot to stress-test the narrative ("what will a CFO ask after slide 6?"); **Summarize this presentation** produces a pre-read with slide citations that you can paste into Outlook or Teams.
- **Visuals.** Ask Copilot to *Create an image* and Designer generates one; prompt descriptively for a useful result.

A common cross-app pattern: plan the narrative with the **Idea Coach** agent, write the content in Word with Copilot, then create the deck from that file, and finally paste Copilot's deck summary into an Outlook invitation as the pre-read.`,
    },
    {
      heading: 'Generating images and visuals to support business content',
      body: `Three places produce images for business use, and each has different governance:

1. **Create in the Microsoft Copilot app** generates images, infographics, posters, banners and stories from a description. Everything you make lands in the **Copilot Library** (Images tab), where you can download it as a .jpeg, edit, copy the prompt, or delete it. Admins can turn image creation off (Copilot Chat image-generation setting via Copilot actions / Cloud Policy), and the Images tab disappears when they do.
2. **Designer inside PowerPoint and Word** creates an image from a prompt in the Copilot pane ("Create a photorealistic image of a diverse team reviewing a dashboard in a bright office"). Generic prompts give generic stock-style results; describe subject, setting, mood and style, and make sure the picture reinforces the slide's claim.
3. **Charts and data visuals** come from Copilot in Excel (charts, PivotTables, Python visuals) and from Copilot Chat and Analyst ("create a bar chart from this table"). These are data-bound, so validate the numbers before the visual goes into a deck.

Governance notes a business user should know: for customer-facing or executive material, prefer **approved brand assets** from the Organization Asset Library over generated images; Microsoft applies **protected-material detection** and content filters to generation; organisations can add **watermarks** to AI-generated or altered content; and generated images should be reviewed for accuracy of any text or data they appear to depict. AI images are illustrations, not evidence.`,
    },
    {
      heading: 'Word, Excel and PowerPoint Agents in the Copilot app',
      body: `In addition to Copilot *inside* the apps, the Microsoft Copilot app includes **Word, Excel and PowerPoint Agents** (sometimes called the Office Agent). From Copilot Chat you can ask the agent to create a complete Word document, Excel workbook or PowerPoint deck from a description, grounded in your work data through Work IQ, and the file is saved to your OneDrive. Facts to know:

- They are **premium** capabilities for users with the paid Microsoft 365 Copilot licence; Copilot Chat (Basic) users do not get them.
- They run exclusively on **Anthropic Claude models**; if an admin disables the Anthropic provider in the Microsoft 365 admin center, the agents are unavailable even to licensed users (they may still be visible in the Agent Store).
- Microsoft performs the searches and shares only relevant context with the model; permissions, sensitivity labels and compliance policies apply as for any Copilot experience.

Cowork offers a related capability through its Word, Excel, PowerPoint and PDF **skills**, which create or edit files as part of a larger task. The distinction for the exam: Copilot *in* the app works on the file you have open; the Office agents and Cowork skills *produce* files from Chat or a delegated task.`,
    },
  ],
  examples: [
    {
      title: 'Proposal to deck to pre-read',
      description:
        'A consultant drafts a proposal in Word with Copilot, referencing the client\'s RFP and two prior case studies. She opens the firm\'s .potx template in PowerPoint, chooses Create presentation from file, and gets a branded 12-slide deck that follows the document\'s headings. She asks Copilot to add a slide on risks, rewrites two wordy slides with Condense, generates one Designer image for the vision slide, and finally asks for a three-bullet executive summary which she pastes into the Outlook invitation.',
      takeaway: 'Content moves across apps: Word structure drives the deck, the template carries the brand, and the deck summary becomes the pre-read.',
    },
    {
      title: 'The chart that would not generate (a realistic mistake)',
      description:
        'An analyst asks Copilot in Excel to "create a chart of sales by region" and Copilot replies that it cannot work with the data. The sheet has merged header cells, two header rows and the file is on his desktop. He saves the workbook to OneDrive, converts the range to a table with a single header row, and tries again; Copilot inserts a bar chart on a new sheet and suggests a PivotTable.',
      takeaway: 'Copilot in Excel needs a clean table (one header row, no merged cells) in a cloud-saved workbook.',
    },
    {
      title: 'Choosing between a generated image and a brand asset',
      description:
        'A marketer preparing a customer-facing deck asks Designer for "an image of our headquarters". The result is a plausible but fictional building. She switches to "Add an image of our headquarters from the brand library", which pulls the approved photo from the Organization Asset Library. She keeps the generated images for the internal brainstorm version only.',
      takeaway: 'Generated images illustrate; for anything that must be true or on-brand, use approved assets.',
    },
    {
      title: 'A workbook from Chat',
      description:
        'A team lead with a Microsoft 365 Copilot licence asks the Excel agent in the Copilot app to "build a workbook tracking the Falcon action items from my last four Falcon meetings, with owner, due date and status columns". The agent creates the workbook in her OneDrive from the meeting recaps. Her colleague on Copilot Chat (Basic) tries the same and cannot see the agent, because it requires the paid licence and Anthropic models enabled in the tenant.',
      takeaway: 'Office agents produce whole files from Chat but need the paid licence and the Anthropic provider enabled.',
    },
  ],
  keyPoints: [
    'Copilot in Word drafts (with / file references), rewrites, summarises and answers questions about the open document; Copilot in Outlook drafts, summarises threads, coaches tone and prepares you for meetings.',
    'Copilot in Excel explains data, suggests formula columns, highlights and sorts, creates charts and PivotTables, and can run Python for advanced analysis; data should be a clean table in a OneDrive or SharePoint workbook.',
    'Copilot in PowerPoint creates decks from a prompt or a Word file (up to five referenced files), uses your .potx template and Organization Asset Library, rewrites slide text, explains objects, stress-tests the narrative and summarises the deck.',
    'Allow editing lets Copilot change slides; Chat only answers without editing.',
    'Images come from Create in the Copilot app (stored in the Copilot Library), Designer in PowerPoint and Word, and charts from Excel, Chat and Analyst; prefer approved brand assets for external material.',
    'Word, Excel and PowerPoint Agents in the Copilot app create whole files from Chat using Work IQ; they need the paid licence and Anthropic models enabled.',
    'Copilot in an app is anchored to the open file; cross-file and cross-app work belongs in Copilot Chat, Analyst or Cowork.',
  ],
  flashcards: [
    { front: 'What can Copilot in Word do with other files while drafting?', back: 'Type / to reference files from OneDrive or SharePoint so the draft draws on their content.' },
    { front: 'Name four things Copilot in Excel can do.', back: 'Explain or summarise data, suggest formula columns, highlight/sort/filter, and create charts and PivotTables (plus advanced analysis with Python).' },
    { front: 'What data format does Copilot in Excel work best with?', back: 'A structured range or table with a single header row and no merged cells, in a workbook saved to OneDrive or SharePoint with AutoSave on.' },
    { front: 'What are the two modes of Copilot in PowerPoint?', back: 'Allow editing (creates and modifies slides) and Chat only (answers without editing).' },
    { front: 'How many files can you reference in one PowerPoint creation prompt?', back: 'Up to five, for example Word, PDF, TXT, Excel (preview) and Loop pages.' },
    { front: 'How do you make Copilot use your organisation\'s brand when creating a deck?', back: 'Open the .potx template first, then create from file or prompt; use the Organization Asset Library for approved images.' },
    { front: 'What does the Explain feature in PowerPoint do?', back: 'Right-click any object or slide to get a plain-language explanation of what it means and where it fits.' },
    { front: 'Where are images created with Create or Copilot Chat stored?', back: 'In the Copilot Library (Images tab), downloadable as .jpeg.' },
    { front: 'Which models power the Word, Excel and PowerPoint Agents in the Copilot app?', back: 'Anthropic Claude models exclusively; if the admin disables Anthropic, the agents are unavailable.' },
    { front: 'Who can use the Word, Excel and PowerPoint Agents?', back: 'Only users with the paid Microsoft 365 Copilot licence; not Copilot Chat (Basic) users.' },
    { front: 'What should you do before putting a Copilot-generated chart into a customer deck?', back: 'Validate the underlying numbers against the source data.' },
  ],
  quiz: [
    {
      question: 'A manager has a 10-page Word strategy document and needs a branded deck for the leadership team. What is the MOST efficient approach?',
      options: [
        'Copy each heading into a blank PowerPoint slide and ask Copilot to rewrite each one.',
        'Open the organisation\'s .potx template, then use Create presentation from file with the Word document in Allow editing mode.',
        'Ask Copilot in Word to convert the document to slides.',
        'Paste the whole document into Copilot Chat and ask for slide text.',
      ],
      correct: [1],
      explanation:
        'Create from file with the branded template open produces a styled deck that follows the document structure. Word does not generate decks, manual copying is slow, and Chat produces text rather than slides.',
    },
    {
      question: 'Copilot in Excel says it cannot analyse a user\'s data. Which TWO changes are MOST likely to fix it? (Select two)',
      options: [
        'Save the workbook to OneDrive or SharePoint.',
        'Format the data as a table with a single header row and no merged cells.',
        'Switch the model to Quick response.',
        'Turn off the Web content toggle.',
      ],
      correct: [0, 1],
      explanation:
        'Copilot in Excel needs a cloud-saved workbook and a clean structured table. Model mode and web grounding are unrelated to Excel\'s data requirements.',
    },
    {
      question: 'A marketer needs a photo of the company\'s actual flagship store for a customer-facing deck. Which source is MOST appropriate?',
      options: ['Designer: "Create an image of our flagship store"', 'The Organization Asset Library via Copilot ("add an image of our flagship store from the brand library")', 'Create in the Copilot app', 'A chart from Copilot in Excel'],
      correct: [1],
      explanation:
        'Generated images are illustrations and will not depict the real store; approved brand assets from the asset library are accurate and compliant. Excel charts are for data.',
    },
    {
      question: 'A user on Copilot Chat (Basic) cannot see the Excel agent in the Copilot app, while a licensed colleague can. What explains this?',
      options: [
        'The Excel agent requires the paid Microsoft 365 Copilot licence (and Anthropic models enabled in the tenant).',
        'The agent only appears on Windows.',
        'The user has not saved any workbooks to OneDrive.',
        'The agent requires the Web content toggle to be on.',
      ],
      correct: [0],
      explanation:
        'Word, Excel and PowerPoint Agents are premium capabilities for licensed users and run on Anthropic models. Platform, OneDrive contents and web grounding are not the gating factors.',
    },
    {
      question: 'During a Teams meeting, Copilot returns a table of action items that a project manager wants to analyse further. What should he do?',
      options: ['Retype the table into Excel', 'Select Open in Excel on the Copilot response', 'Ask Facilitator to convert it to a PivotTable', 'Export the meeting recording'],
      correct: [1],
      explanation:
        'Copilot in meetings offers Open in Excel for tables (and Open in Word for long text). Facilitator does not create PivotTables and the recording is not the data.',
    },
    {
      question: 'Which statement about Copilot in PowerPoint\'s Chat only mode is correct?',
      options: [
        'Copilot can generate images but cannot answer questions.',
        'Copilot answers questions about the deck and offers suggestions without modifying slides.',
        'Copilot creates a new deck from a Word file automatically.',
        'Copilot rewrites every slide to a standard template.',
      ],
      correct: [1],
      explanation:
        'Chat only is the non-editing mode. Creating and modifying slides requires Allow editing.',
    },
  ],
  statements: [
    { text: 'Copilot in Word can reference other files from OneDrive or SharePoint when drafting a document.', isTrue: true, explanation: 'Type / to add files so the draft uses their content.' },
    { text: 'Copilot in Excel permanently overwrites your data when it suggests a formula column.', isTrue: false, explanation: 'It adds suggested columns, sheets or charts that you can keep or undo; it does not change your data unless asked.' },
    { text: 'Copilot in PowerPoint can create a presentation from a Word document that uses Word Styles for headings.', isTrue: true, explanation: 'Create presentation from file works best with styled Word documents under about 24 MB.' },
    { text: 'Images generated by Designer are accurate depictions of real company locations.', isTrue: false, explanation: 'Generated images are illustrations; use the Organization Asset Library for real, approved imagery.' },
    { text: 'Summarize this presentation in PowerPoint returns a summary with citations to the slides each point came from.', isTrue: true, explanation: 'This makes it suitable as a pre-read that can be pasted into email or Teams.' },
    { text: 'The Word, Excel and PowerPoint Agents are available to all Copilot Chat users, including those without the paid licence.', isTrue: false, explanation: 'They require the paid Microsoft 365 Copilot licence and Anthropic models enabled.' },
    { text: 'Copilot Chat can create a simple chart from a table in the conversation without opening Excel.', isTrue: true, explanation: 'Chat can generate charts and other visualisations from data in the prompt or conversation.' },
    { text: 'Copilot in an app is grounded across the user\'s whole mailbox and all Teams chats by default.', isTrue: false, explanation: 'The app pane is anchored to the open content plus what you reference; broad grounding is Copilot Chat in work mode.' },
  ],
  resources: [
    { label: 'Build effective presentations with AI: Copilot in PowerPoint (training module)', url: 'https://learn.microsoft.com/en-us/training/modules/present-copilot-microsoft-powerpoint/' },
    { label: 'Word, Excel, and PowerPoint Agents in Microsoft Copilot (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/manage/wordexcelppt-agents' },
    { label: 'Manage images and pages with Copilot Library (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/manage/copilot-library' },
    { label: 'Microsoft Copilot overview: Copilot features in Microsoft 365 apps (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/plan/copilot-overview' },
  ],
};
