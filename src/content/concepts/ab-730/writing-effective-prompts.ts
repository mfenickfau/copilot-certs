import type { Concept } from '../../types';

export const writingEffectivePrompts: Concept = {
  id: 'writing-effective-prompts',
  title: 'Writing Effective Prompts: Goal, Context, Source, Expectations, Model and Memory',
  summary:
    'A good prompt tells Copilot what to produce, why, from which sources and in what form, then improves through iteration. This concept covers Microsoft\'s four prompt elements, how to reference files, people, meetings and chats, when to pick a model or reasoning mode, how to refine a weak response, and how Copilot\'s memory and custom instructions shape every answer.',
  certs: ['ab-730'],
  domains: ['ab-730-2'],
  outcomes: ['ab-730-2-1-1', 'ab-730-2-1-2', 'ab-730-2-1-6', 'ab-730-2-1-7'],
  tags: ['prompting', 'context-engineering', 'model-selection', 'memory', 'custom-instructions', 'iteration'],
  difficulty: 'foundations',
  diagram: 'context-window',
  sections: [
    {
      heading: 'The four elements of an effective prompt',
      body: `Microsoft teaches prompting as a conversation with a knowledgeable assistant. Unlike a search box, Copilot responds best to detailed, descriptive requests built from four elements:

1. **Goal**: what you want Copilot to do and produce: a summary, a first draft, a list of action items, a chart, a table. If you have a format in mind, say so.
2. **Context**: why you need it and who is involved. "I'm preparing for a client renewal meeting with Fabrikam's CFO" changes the answer.
3. **Source**: where Copilot should look. Name the files, emails, meetings or chats. Without a source, Copilot guesses from everything it can reach, or from the web.
4. **Expectations**: how it should respond: audience, tone, length, structure, language. A note for senior leadership reads differently from a team update.

A clear goal is the foundation; the other three make the response more accurate and useful, but none of them guarantees factual accuracy, so verification still applies.

Compare:

- Weak: "Write a project update."
- Strong: "Draft a 200-word project update for the steering committee on Project Falcon. Use /Falcon status.xlsx for milestone dates and my Teams chat with Dana from Tuesday for the risk discussion. Tone: factual and direct; end with two decisions I need from them."

Microsoft's Cowork guidance adds a fifth habit for agentic work: **be specific about the outcome**. "Email Sarah about the Q2 review tomorrow at 2 pm" succeeds where "send that email" fails.`,
    },
    {
      heading: 'Referencing the right resources',
      body: `The source element is where Copilot Chat differs most from a public chatbot. With a Microsoft 365 Copilot licence you can point Copilot at your work content instead of uploading it:

- Type **/** in the prompt box to open the context picker and reference files from OneDrive and SharePoint, people, emails, Teams chats, channels and meetings. Microsoft's training also describes **@** for people and agents and **#** for meetings in some experiences; the picker is the dependable way.
- **Attach or upload** a file (the + button or drag and drop) when the content is on your device or you want Copilot to use exactly that version. Uploaded files are stored in your OneDrive and are not used for training.
- **Use open content**: Copilot in Word, Excel, PowerPoint, Outlook and Teams automatically sees the document, workbook, deck, thread or chat you have open; in Copilot Chat (Basic) inside Teams and Outlook this is the main way to bring organisational content in.
- **Reference previous chats and tasks**: in Cowork, / then the Copilot tab lets you cite an earlier Copilot Chat conversation or Cowork task as context for a new request.
- **Connectors**: if your organisation has connected Salesforce, ServiceNow, Jira or similar, Copilot can cite those records too.
- **Scope the web**: use the Web content toggle to include or exclude web results; in Researcher there is a dedicated Web search toggle.

Choose sources that are authoritative and current. Pointing Copilot at the final signed-off report rather than "the Q3 files" avoids the classic cited-the-draft mistake. In PowerPoint you can reference up to five files and tell Copilot what to take from each; the same discipline (which source, for which part) works everywhere.`,
    },
    {
      heading: 'Model selection: Auto, Quick response, Think deeper',
      body: `Copilot Chat offers the latest models without changing your security, compliance or privacy settings. By default a real-time router (**Auto**) picks the model for each prompt. You can override it in the model selector:

| Mode | When to choose it |
|---|---|
| **Auto** | Most of the time; Copilot chooses based on the prompt |
| **Quick response** | Routine questions, short rewrites, simple lookups; prioritises speed with a high-throughput model |
| **Think deeper** | Complex, open-ended or multi-step questions; the model plans, gathers context and checks its work before answering, so it is slower |

Agents and Cowork expose richer choices. Researcher has a model picker in the agent. Cowork lists specific models from OpenAI (GPT), Anthropic (Claude) and xAI (Grok) when the organisation enables them, plus a **reasoning effort** level (Light, Medium default, High, Extra High, Max). Higher effort is more thorough but slower and uses more Copilot credits. If your tenant is inside the EU Data Boundary, only GPT models are available in Cowork. Admins can disable individual model providers in the Microsoft 365 admin center under Copilot > Settings, and Auto then chooses from what remains.

The exam-level rule: **use Auto unless you have a reason not to; pick Think deeper or higher reasoning effort for analysis and planning, Quick response for speed on simple tasks.** Changing model never changes what data Copilot can access.`,
    },
    {
      heading: 'Refining prompts from the response',
      body: `The first response is rarely the last. Microsoft calls this "prompt and iterate": Copilot works best as a back-and-forth conversation, not a one-shot transaction. Refinement moves:

- **Add the missing element.** Generic answer → add context or source. Wrong length or tone → add expectations. Wrong content → tighten the goal.
- **Ask follow-ups in the same chat** so Copilot keeps the context: "Make it shorter", "Add the risks from the Thursday meeting", "Turn this into a table with owner and due date".
- **Use the built-in rewrite options** in Teams and PowerPoint (make it concise, professional, confident, custom instruction) and regenerate up to several times, comparing versions.
- **Check sources, then correct the input**: if Copilot cited the wrong document, name the right one rather than arguing with the answer.
- **Change surface or tool** if the limitation is structural: a cross-app question in the Word pane will not improve with better wording; move to Chat. A one-line Chat answer to a research question may need Researcher or Think deeper.
- **Use Prompt Coach** (a Microsoft agent) or the Copilot Prompt Gallery to see how a prompt could be structured.

The exam distractor: starting a new chat and typing the same prompt again. Repetition without a change in goal, context, source or expectations produces the same weakness.`,
    },
    {
      heading: 'How Copilot uses memory and instructions',
      body: `Copilot personalisation (in preview through the Frontier programme, available to Copilot Chat users with and without the Microsoft 365 Copilot licence) lets Copilot remember across chats. Three kinds of memory exist:

- **Saved memories**: facts you tell Copilot to remember ("I'm the EMEA account lead; my reports go to the VP of Sales") or that it offers to save.
- **Details inferred from chat history**: dynamic observations Copilot keeps about your preferences and projects; it may update or discard older details.
- **Custom instructions**: standing guidance you write once ("respond in British English, prefer bullet lists, never use exclamation marks") that Copilot applies to every response.

Where it lives and how it is governed: memories are stored in a hidden folder of your own Exchange mailbox, so mailbox security applies (encryption at rest, Customer Lockbox). You manage everything in **Settings > Personalization**, where you can view and delete saved memories, edit custom instructions, or turn each kind of memory off. Deleting a chat does **not** delete saved memories generated from it. Admins have an *Enhanced personalization* control to turn memory off for users; when it is off, Copilot stops applying memories and instructions but does not erase them. Purview retention policies do not apply to memories, and admins cannot restrict what kinds of information get remembered. Temporary chats are discoverable by admins like any other chat.

Cowork has its own layers: **custom instructions** on the Customize > Preferences tab (personal, up to about 3,000 words, applied to every task) and **project instructions** that apply to tasks in a project and take precedence over global instructions. Agents built in Agent Builder carry **agent instructions** that define role, tone and format for everyone who uses them.

Practical consequences: memory means you can stop repeating your role and format preferences; it also means an outdated memory can quietly skew answers, so review Settings > Personalization when your job or project changes.`,
    },
  ],
  examples: [
    {
      title: 'Rebuilding a vague prompt',
      description:
        'A customer success manager types "Help me prepare for the Northwind meeting" and gets a generic agenda. She rewrites it with the four elements: goal (a one-page briefing), context (renewal is at risk after two escalations), source (/Northwind escalation summary.docx, emails from their CTO in the last month, the #Northwind sync meeting recap), expectations (five bullets, neutral tone, end with three questions to ask). The second response is specific, cited and usable.',
      language: 'text',
      code: `Before:
  "Help me prepare for the Northwind meeting."

After:
  "Create a one-page briefing for tomorrow's renewal meeting with
   Northwind. Context: the renewal is at risk after two escalations.
   Use /Northwind escalation summary.docx, emails from their CTO in
   the last 30 days, and the recap of the Northwind weekly sync.
   Format: five bullets plus three questions I should ask.
   Tone: neutral and factual."`,
      takeaway: 'Goal, context, source and expectations turn a generic answer into a grounded, specific one.',
    },
    {
      title: 'Iterating instead of restarting (a realistic mistake)',
      description:
        'A team lead gets a summary that is too long and misses the budget decision. He opens a new chat and pastes the identical prompt, getting an almost identical result. The fix is to refine in the same conversation: "Cut this to 120 words and include the budget decision from /Oct planning recap.docx." Copilot keeps the context and corrects both problems in one turn.',
      takeaway: 'Refine with follow-ups that change goal, source or expectations; repeating the same prompt in a new chat changes nothing.',
    },
    {
      title: 'Choosing Think deeper for analysis',
      description:
        'An operations analyst asks "Which of our three warehouse consolidation options has the lowest risk, considering /Options analysis.xlsx and the supplier constraints discussed in the Logistics channel?" On Quick response the answer is a confident paragraph with little reasoning. Switching the model selector to Think deeper, Copilot plans, pulls both sources, and lays out the trade-offs with citations. The analyst still verifies the figures before the recommendation goes to leadership.',
      takeaway: 'Reserve Think deeper (or higher reasoning effort in Cowork) for multi-step analysis; keep Auto or Quick response for routine tasks.',
    },
    {
      title: 'The stale memory',
      description:
        'A marketer moved from the consumer team to the enterprise team three months ago. Copilot keeps framing her drafts for consumer audiences because a saved memory from her old role says so. She opens Settings > Personalization, deletes the outdated memory, updates her custom instructions to "my audience is enterprise IT decision makers", and the next drafts land correctly.',
      takeaway: 'Memory and custom instructions shape every answer; review them when your role or projects change.',
    },
  ],
  keyPoints: [
    'Microsoft\'s four prompt elements: goal (what to produce), context (why and who), source (where to look) and expectations (audience, tone, length, format). A clear goal is the foundation.',
    'Reference work content with the / context picker (files, people, emails, chats, meetings), attach files, or rely on open content in the app; choose authoritative, current sources and say what to take from each.',
    'Model selection in Copilot Chat: Auto (default router), Quick response (speed) and Think deeper (planning and reasoning); Cowork adds specific models and a reasoning effort level, with higher effort slower and more credit-intensive.',
    'Refine in the same chat by adding the missing element, using rewrite options, or correcting the source; change surface or tool when the limitation is structural.',
    'Copilot memory has three parts: saved memories, details inferred from chat history and custom instructions; all are managed in Settings > Personalization.',
    'Memories live in a hidden folder of the user\'s Exchange mailbox; deleting a chat does not delete saved memories; admins can turn personalisation off but Purview retention does not apply to memories.',
    'Cowork custom instructions apply to every task, and project instructions override them within a project; agent instructions define how a shared agent behaves for everyone.',
  ],
  flashcards: [
    { front: 'What are the four elements of an effective Copilot prompt?', back: 'Goal, context, source and expectations.' },
    { front: 'How do you reference a specific file, person or meeting in Copilot Chat?', back: 'Type / to open the context picker and select files, people, emails, Teams chats, channels or meetings; you can also attach files with the + button.' },
    { front: 'What does the Auto model mode do?', back: 'A real-time router selects the underlying model for each prompt; it is the default and recommended for most work.' },
    { front: 'When should you choose Think deeper?', back: 'For complex, open-ended or multi-step questions where the model should plan, gather context and check its work; it is slower.' },
    { front: 'What is reasoning effort in Cowork?', back: 'A setting next to the model picker (Light, Medium default, High, Extra High, Max) that trades speed and credits for thoroughness.' },
    { front: 'Does changing the model change what data Copilot can access?', back: 'No. Model choice affects speed, depth and style; permissions and grounding are unchanged.' },
    { front: 'What should you do when Copilot\'s response is too generic?', back: 'Refine in the same chat by adding context, naming the source, or setting expectations rather than repeating the prompt in a new chat.' },
    { front: 'What three kinds of memory does Copilot personalisation use?', back: 'Saved memories, details inferred from chat history, and custom instructions.' },
    { front: 'Where are Copilot memories stored and where does a user manage them?', back: 'In a hidden folder of the user\'s Exchange mailbox; managed in Settings > Personalization.' },
    { front: 'Does deleting a chat delete the saved memories created from it?', back: 'No. Saved memories persist until the user deletes them in Settings > Personalization.' },
    { front: 'Which instructions take precedence in Cowork: project instructions or global custom instructions?', back: 'Project instructions apply to tasks in that project and take precedence over global Cowork instructions.' },
    { front: 'What is the limit for Cowork custom instructions?', back: 'About 20 KB, roughly 3,000 English words, personal to the user.' },
  ],
  quiz: [
    {
      question:
        'A product manager types "Write the launch update" and receives a generic paragraph. Which change to the prompt is MOST likely to produce a useful result?',
      options: [
        'Switch the model to Quick response and resend the same prompt.',
        'Add the audience, the files to use (/Launch plan.docx), the length and the tone.',
        'Turn off the Work IQ control so Copilot focuses on the web.',
        'Open a new chat and type the same prompt again.',
      ],
      correct: [1],
      explanation:
        'Adding context, source and expectations to the goal is Microsoft\'s four-element method. Quick response changes speed not content, turning off Work IQ removes the grounding needed, and repeating the prompt yields the same result.',
    },
    {
      question: 'An analyst needs Copilot to weigh three options across a workbook and a Teams discussion and explain the trade-offs. Which model setting is MOST appropriate?',
      options: ['Quick response', 'Think deeper', 'Auto with Web content turned off', 'Any setting, because model choice only affects which files Copilot can access'],
      correct: [1],
      explanation:
        'Think deeper is for complex, multi-step reasoning. Quick response prioritises speed, turning off web content does not add reasoning, and model choice never changes data access.',
    },
    {
      question: 'Which TWO are valid ways to give Copilot Chat a specific source for a response? (Select two)',
      options: [
        'Type / and select the file, meeting or person from the context picker.',
        'Attach the file with the + button or by dragging it into the prompt box.',
        'Mention the file name in a saved memory so Copilot always uses it.',
        'Ask a colleague who has access to the file to run the prompt.',
      ],
      correct: [0, 1],
      explanation:
        'The context picker and file attachment are the documented ways to reference sources. Saved memories hold preferences, not source bindings, and borrowing a colleague\'s access bypasses permissions.',
    },
    {
      question: 'A user deletes a chat in which she told Copilot to remember that she manages the APAC region. Later, Copilot still frames answers for APAC. Why?',
      options: [
        'Deleting a chat does not delete saved memories; they persist until removed in Settings > Personalization.',
        'The retention policy for Copilot chats has not yet run.',
        'Copilot caches the last ten chats regardless of deletion.',
        'Her admin re-enabled the memory from the Microsoft 365 admin center.',
      ],
      correct: [0],
      explanation:
        'Saved memories are independent of chat history and are managed in Settings > Personalization. Retention policies do not govern memory, there is no ten-chat cache, and admins cannot restore individual memories.',
    },
    {
      question: 'A compliance officer asks whether Purview retention policies that delete Copilot chats after 90 days also remove Copilot memories. What is the correct answer?',
      options: [
        'Yes, memories are part of chat history and follow the same policy.',
        'No, retention policies and labels do not apply to Copilot memory; memories remain until the user deletes them.',
        'Yes, but only for saved memories, not custom instructions.',
        'No, because memories are stored outside the tenant.',
      ],
      correct: [1],
      explanation:
        'Microsoft states retention policies configured in Purview do not apply to Copilot memory. Memories are stored in the user\'s mailbox within the tenant.',
    },
    {
      question: 'Copilot keeps producing drafts in a casual tone although the user wants formal British English every time. What is the LEAST effort way to fix this permanently?',
      options: [
        'Add "formal British English" to custom instructions in Settings > Personalization.',
        'Add the instruction to every prompt.',
        'Ask the admin to publish an organisational prompt.',
        'Switch the model to Think deeper.',
      ],
      correct: [0],
      explanation:
        'Custom instructions apply to every response. Repeating the instruction is effort, organisational prompts are admin-published templates not personal preferences, and the model does not set tone policy.',
    },
  ],
  statements: [
    { text: 'Including context, source and expectations in a prompt guarantees the response is factually accurate.', isTrue: false, explanation: 'They make responses more relevant and useful; verification is still required.' },
    { text: 'In Copilot Chat, Auto is the default model mode and uses a real-time router to pick the model for each prompt.', isTrue: true, explanation: 'Quick response and Think deeper are manual overrides.' },
    { text: 'Choosing a different model in Copilot gives it access to additional files.', isTrue: false, explanation: 'Model choice affects speed, depth and style; data access is governed by permissions.' },
    { text: 'Copilot memories are stored in a hidden folder in the user\'s Exchange mailbox.', isTrue: true, explanation: 'They therefore inherit mailbox security such as encryption at rest and Customer Lockbox.' },
    { text: 'When an admin turns off Enhanced personalization, all users\' saved memories are permanently erased.', isTrue: false, explanation: 'Copilot stops applying memories and instructions but does not remove them.' },
    { text: 'Repeating an unchanged prompt in a new chat is an effective refinement technique.', isTrue: false, explanation: 'Refinement means changing goal, context, source or expectations, ideally as a follow-up in the same chat.' },
    { text: 'In Cowork, project instructions take precedence over the user\'s global custom instructions for tasks within that project.', isTrue: true, explanation: 'Project instructions are scoped and override global preferences.' },
    { text: 'Higher reasoning effort in Cowork produces more thorough results but is slower and uses more credits.', isTrue: true, explanation: 'Microsoft documents this trade-off; Medium is the default.' },
  ],
  resources: [
    { label: 'Write prompts that get results (training module unit)', url: 'https://learn.microsoft.com/en-us/training/modules/get-ready-work-microsoft-365-copilot/' },
    { label: 'Manage Copilot personalization and memory (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/manage/copilot-personalization-memory' },
    { label: 'Microsoft Copilot overview: model selection (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/plan/copilot-overview' },
    { label: 'Choose a model for Copilot Cowork (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/cowork/cowork-models' },
  ],
};
