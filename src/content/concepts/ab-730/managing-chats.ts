import type { Concept } from '../../types';

export const managingChats: Concept = {
  id: 'managing-chats',
  title: 'Managing Chats, Notebooks and the Copilot Library',
  summary:
    'Your Copilot conversations are a record of work: how to find a previous chat, rename it so it is findable later, delete it (and what deletion does and does not remove), filter chats by the agent you used, and organise and share information with Copilot Notebooks, Pages and the Copilot Library.',
  certs: ['ab-730'],
  domains: ['ab-730-2', 'ab-730-4'],
  outcomes: ['ab-730-2-2-1', 'ab-730-2-2-2', 'ab-730-2-2-3', 'ab-730-2-2-4', 'ab-730-4-1-4'],
  tags: ['chat-history', 'notebooks', 'copilot-pages', 'copilot-library', 'retention', 'agents'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Finding, renaming and deleting chats',
      body: `The left navigation of the Microsoft Copilot app (and of Copilot Chat in Teams and Outlook) lists your **Chats**: recent conversations with Copilot and with individual agents. Selecting one reopens every message so you can pick up where you left off or retrieve something Copilot gave you.

- **Find a previous chat.** Scroll the Chats list, or use the search box above it to search by title or content. Chats are grouped by recency. Because Copilot Chat is one app across surfaces, a chat you started in Teams is visible in the Copilot app and in Outlook. Responses from scheduled prompts and Researcher or Analyst sessions appear in the same history.
- **Rename a chat.** Copilot auto-titles a chat from the first prompt, which is often unhelpful ("Summary of the document"). Open the chat's more options (...) menu and choose **Rename** to give it a name you will search for later, such as "Northwind renewal prep, Nov 2026".
- **Delete a chat.** The same menu offers **Delete**. Deleting removes the conversation from your history across devices. Two consequences to understand: it does **not** delete saved memories that Copilot created from the chat (those live in Settings > Personalization), and from a compliance point of view the data is handled by your organisation's **retention policy**: deleted Copilot messages move to a hidden holds folder and are permanently deleted on the policy's schedule, remaining searchable by eDiscovery until then. What you see in the chat window is not the compliance record.
- **Temporary chats**, where available, are not kept in your history but are still discoverable by admins.

Cowork tracks conversations as **tasks** in the My tasks view (Recent, with status filters such as Needs your input, In progress and Complete), and lets you group related tasks into **projects**.`,
    },
    {
      heading: 'Filtering chats by agent',
      body: `When you use an agent in Copilot Chat, whether by selecting it from Agents or by @mentioning it in a conversation, the resulting chat is associated with that agent. The chat history can be **filtered by agent**, which is the quickest way to find the conversation where Researcher produced last month's competitor report, or where the HR agent answered the parental-leave question.

Two ways agents show up in history:

- **Agent sessions**: you opened Researcher, Analyst, Idea Coach or a custom agent and chatted inside it. The chat carries the agent's name and icon.
- **@mention inside a normal chat**: you were in a general chat and added "@Researcher …" for one step. The chat stays a Copilot chat but the agent's contribution is marked.

Filter by agent (via the Chats list filter or from the agent's own page, which lists recent chats with that agent) when you know *who* answered but not *what* the title was. Combine with search for the fastest result. In Cowork, the Tasks view and project pages give you the equivalent for delegated work.`,
    },
    {
      heading: 'Copilot Notebooks: organise information around a topic',
      body: `A **Copilot Notebook** is a workspace you create for a topic, project or deal and fill with the material that matters: files from OneDrive and SharePoint, Copilot Pages, meeting notes, links and your own notes. Copilot then answers questions **grounded only in that notebook's contents**, so you can:

- Ask "what did we commit to in the last three proposals?" and get an answer limited to the proposals you added, without noise from the rest of your tenant.
- Keep a running set of questions and answers about a large document set (Microsoft positions Notebooks as "customised sessions to ask questions about files you have hosted in your Microsoft 365 tenant", especially large documents).
- Add new content as the project evolves; the notebook's answers update accordingly.
- Generate summaries or overviews from the notebook's sources to brief others.

Notebooks still respect permissions: you can only add content you can access, and someone you share a notebook with sees only the sources they can open. Notebooks and Copilot Pages share a user-owned storage container (SharePoint Embedded) in your tenant; admins control creation with the Cloud Policy setting **Create and view Copilot Pages and Copilot Notebooks**. If creation is disabled, the Notebooks module is hidden, existing files remain in OneDrive and SharePoint, and sharing links to notebooks stop working.

Rule of thumb from the training: a quick question → Chat; a long-running topic with a defined set of sources → a Notebook; a result you want to edit and co-author → a Page.`,
    },
    {
      heading: 'Sharing information: Pages and the Copilot Library',
      body: `**Copilot Pages** turn a chat response into a persistent, editable, shareable canvas. Select **Edit in Pages** on a response, add it to a new or existing page, then edit, insert more responses, add headings, tables and checklists. Share by link or mention; collaborators co-edit in real time but do not see the chat that produced the page. Pages can be shared as interactive components in Teams and Outlook and exported to Word or PowerPoint.

The **Copilot Library** is the hub in the Copilot app for everything you have created with Copilot Chat and Create: pages, images, infographics and stories. In the Pages tab you can open a page, **add it to a notebook**, filter to pages shared with you, or delete it; in the Images tab you can download (as .jpeg), edit, copy, delete, or copy the prompt that created an image. The Library is a view, not extra storage, and it is available to anyone eligible for Copilot Chat even without the paid licence. Admins can hide the Images or Pages tab by disabling image or page creation in Cloud Policy.

Putting it together for the exam: **Chats** are the conversational record, **Notebooks** organise sources around a topic and ground answers in them, **Pages** are the editable, shareable output, and the **Library** is where you find pages and images again. Saved **memories** are separate from all of these.`,
    },
  ],
  examples: [
    {
      title: 'The chat you cannot find',
      description:
        'A consultant knows Copilot gave her a good risk register two weeks ago but every chat is called "Summary" or "Draft". She searches the Chats list for "risk", finds it, and immediately renames it "Fabrikam risk register v1" so it is findable next time. She adopts a habit: rename any chat worth keeping as soon as it produces something useful.',
      takeaway: 'Search finds content; renaming makes the next search trivial.',
    },
    {
      title: 'Deleting a chat does not delete a memory (a realistic mistake)',
      description:
        'A manager shares a hypothetical reorganisation with Copilot to draft talking points, then deletes the chat so it will not be visible. Weeks later Copilot references "the planned team restructure" in an unrelated draft: a saved memory had been created from the deleted chat. He removes it in Settings > Personalization. The compliance officer also reminds him that deletion does not override retention; the messages remain discoverable until the retention policy disposes of them.',
      takeaway: 'Deleting a chat clears your view; memories must be removed separately and retention governs the compliance record.',
    },
    {
      title: 'Finding the Researcher report by agent',
      description:
        'A strategy lead needs the market analysis Researcher produced last quarter but cannot remember its title. She filters her chat history to Researcher, which narrows dozens of chats to four, and opens the right one in seconds. She then adds the report to a Page and shares it with the leadership team.',
      takeaway: 'Filter chats by agent when you remember which agent did the work but not what the chat was called.',
    },
    {
      title: 'A notebook for a bid',
      description:
        'A bid manager creates a Copilot Notebook called "Contoso RFP" and adds the RFP, the pricing sheet, three past proposals and the Pages from the kick-off chat. Throughout the bid she asks the notebook questions ("Which compliance requirements have no owner yet?") and the answers stay scoped to the bid material. When a new addendum arrives she drops it in; a colleague she shares the notebook with can see everything except one past proposal stored on a site he cannot access.',
      takeaway: 'Notebooks ground Copilot in a chosen set of sources for a long-running topic, while still respecting each person\'s permissions.',
    },
  ],
  keyPoints: [
    'Previous chats are found in the Chats list of the Copilot app, Teams or Outlook: scroll or search by title and content; the history is the same across surfaces.',
    'Rename a chat from its more options (...) menu to make it findable; delete removes it from your history across devices.',
    'Deleting a chat does not delete saved memories, and compliance retention (hidden holds folder, eDiscovery) governs what is actually kept.',
    'Chats can be filtered by the agent used (Researcher, Analyst, custom agents), both for agent sessions and @mentions.',
    'Copilot Notebooks gather files, pages, notes and links around a topic and ground Copilot\'s answers in that content only, respecting permissions.',
    'Copilot Pages turn responses into editable, shareable canvases; the Copilot Library is the hub where pages and images are found, with pages addable to notebooks.',
    'Admins control Pages and Notebooks creation with the Cloud Policy setting "Create and view Copilot Pages and Copilot Notebooks"; the Library adapts its tabs to those policies.',
  ],
  flashcards: [
    { front: 'Where do you find a previous Copilot conversation?', back: 'In the Chats list in the left navigation of the Copilot app, Teams or Outlook; scroll or use the search box.' },
    { front: 'How do you rename a chat?', back: 'Open the chat\'s more options (...) menu and select Rename.' },
    { front: 'What does deleting a chat NOT remove?', back: 'Saved memories generated from the chat (managed in Settings > Personalization) and the compliance copy governed by retention policy.' },
    { front: 'How can you quickly find a conversation you had with the Researcher agent?', back: 'Filter the chat history by agent, or open the agent\'s page to see recent chats with it.' },
    { front: 'What is a Copilot Notebook?', back: 'A workspace that gathers files, pages, notes and links on a topic so Copilot answers questions grounded only in that content.' },
    { front: 'Does a shared notebook give collaborators access to all of its sources?', back: 'No. Each person sees only the sources they already have permission to open.' },
    { front: 'What is the Copilot Library?', back: 'The hub in the Copilot app for pages, images, infographics and stories created with Copilot Chat and Create; a view, not extra storage.' },
    { front: 'Which admin policy controls creation of Copilot Pages and Notebooks?', back: 'The Cloud Policy setting "Create and view Copilot Pages and Copilot Notebooks".' },
    { front: 'What happens to Copilot messages when a user deletes a chat and a retention policy applies?', back: 'They move to a hidden SubstrateHolds folder, remain searchable by eDiscovery, and are permanently deleted when the retention period expires.' },
    { front: 'In Cowork, where do you find past delegated work?', back: 'In the My tasks view (Recent, with status filters) and inside projects.' },
  ],
  quiz: [
    {
      question: 'A user wants to make a useful chat easy to find again next month with the LEAST effort. What should they do now?',
      options: ['Delete all other chats', 'Rename the chat with a descriptive title from its more options menu', 'Export the chat to Word', 'Create a new agent for the topic'],
      correct: [1],
      explanation:
        'Renaming makes the chat searchable by a meaningful title. Deleting other chats is destructive and unnecessary, exporting creates a separate artefact, and an agent is unrelated to retrieval.',
    },
    {
      question: 'A manager deletes a chat containing a confidential plan. Which TWO statements are correct? (Select two)',
      options: [
        'Any saved memory Copilot created from that chat remains until deleted in Settings > Personalization.',
        'The chat is immediately and permanently removed from all compliance systems.',
        'The messages may remain discoverable by eDiscovery until the organisation\'s retention policy disposes of them.',
        'Deleting a chat also deletes the files referenced in it from SharePoint.',
      ],
      correct: [0, 2],
      explanation:
        'Memories are independent of chat deletion, and retention governs the compliance record. Deletion does not bypass retention and never touches referenced files.',
    },
    {
      question: 'A strategy lead remembers that Analyst produced a dataset comparison but not the chat title. What is the FASTEST way to find it?',
      options: ['Scroll the entire chat history', 'Filter chat history by the Analyst agent', 'Ask Analyst to regenerate the comparison', 'Search the Copilot Library Images tab'],
      correct: [1],
      explanation:
        'Filtering by agent narrows history to Analyst conversations. Scrolling is slow, regenerating wastes effort and may differ, and the Library holds pages and images, not chats.',
    },
    {
      question: 'A bid manager needs Copilot to answer questions using only the RFP, pricing sheet and past proposals for one bid, over several weeks. Which feature fits BEST?',
      options: ['A Copilot Notebook containing those files', 'A scheduled prompt', 'The Web content toggle', 'A renamed chat'],
      correct: [0],
      explanation:
        'Notebooks ground Copilot in a chosen set of sources for a long-running topic. Scheduled prompts automate recurrence, the web toggle governs web grounding, and a renamed chat does not scope sources.',
    },
    {
      question: 'Where can a user find the images and Copilot Pages they created last month in one place?',
      options: ['Settings > Personalization', 'The Copilot Library in the Copilot app', 'Microsoft 365 admin center > Copilot > Prompts', 'The Teams admin center'],
      correct: [1],
      explanation:
        'The Copilot Library consolidates user-created pages and images. Personalization manages memory, the admin center manages organisational prompts, and the Teams admin center is for admins.',
    },
    {
      question: 'After an admin disables "Create and view Copilot Pages and Copilot Notebooks", what happens to a user\'s existing notebooks?',
      options: [
        'They are permanently deleted within 24 hours.',
        'The Notebooks module is hidden in the Copilot app, but the files remain in OneDrive and SharePoint and remain discoverable.',
        'They are converted to Word documents automatically.',
        'They continue to work unchanged, including sharing links.',
      ],
      correct: [1],
      explanation:
        'Existing content is not deleted; the module is hidden, files stay in their storage locations and are still searchable and discoverable by Purview, but sharing links to notebooks stop working.',
    },
  ],
  statements: [
    { text: 'A chat started in Copilot in Teams is also visible in the Chats list of the Microsoft Copilot app.', isTrue: true, explanation: 'Copilot Chat history is shared across the Copilot app, Teams and Outlook surfaces.' },
    { text: 'Renaming a chat changes the content of Copilot\'s earlier responses.', isTrue: false, explanation: 'Renaming only changes the title used in the Chats list.' },
    { text: 'Deleting a chat guarantees the conversation is no longer discoverable by compliance tools.', isTrue: false, explanation: 'Retention policies and eDiscovery holds govern the compliance record; deleted messages sit in a hidden holds folder until disposal.' },
    { text: 'Chat history can be filtered by the agent that was used.', isTrue: true, explanation: 'This is how you locate Researcher, Analyst or custom-agent conversations quickly.' },
    { text: 'A Copilot Notebook grounds Copilot\'s answers only in the content added to that notebook.', isTrue: true, explanation: 'This scoping is the point of a notebook for long-running topics.' },
    { text: 'Sharing a Copilot Notebook grants collaborators access to every file in it regardless of their permissions.', isTrue: false, explanation: 'Permissions are respected; collaborators see only the sources they can open.' },
    { text: 'The Copilot Library requires the paid Microsoft 365 Copilot licence.', isTrue: false, explanation: 'It is available to users with Copilot Chat eligibility; a paid licence is not required.' },
    { text: 'Copilot Pages and Copilot Notebooks share a user-owned storage container in the tenant.', isTrue: true, explanation: 'They use a shared SharePoint Embedded container, also shared with Loop My workspace.' },
  ],
  resources: [
    { label: 'Manage images and pages with Copilot Library (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/manage/copilot-library' },
    { label: 'Manage Copilot Pages and Copilot Notebooks settings (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/microsoft-365/loop/cpcn-admin-configuration' },
    { label: 'Learn about retention for Copilot and AI apps (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/purview/retention-policies-copilot' },
    { label: 'Build agents in Copilot Chat: Copilot Chat navigation (training module)', url: 'https://learn.microsoft.com/en-us/training/modules/agents-copilot-chat/' },
  ],
};
