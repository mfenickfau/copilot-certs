import type { Concept } from '../../types';

export const promptLibraryAndReuse: Concept = {
  id: 'prompt-library-and-reuse',
  title: 'Saving, Sharing and Scheduling Prompts',
  summary:
    'A prompt that works once should work every week. This concept covers the Copilot Prompt Gallery (Suggested, Your Prompts, Teams), organisational prompts published by admins, how to save and share a prompt, how scheduled prompts run on a timer, and how scheduled tasks and automations are managed in Copilot Chat and Cowork.',
  certs: ['ab-730', 'ab-900'],
  domains: ['ab-730-2', 'ab-730-4', 'ab-900-3'],
  outcomes: ['ab-730-2-1-3', 'ab-730-2-1-4', 'ab-730-2-1-5', 'ab-730-4-2-7', 'ab-900-3-2-4'],
  tags: ['prompt-gallery', 'saved-prompts', 'scheduled-prompts', 'organizational-prompts', 'automations', 'cowork'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'The Copilot Prompt Gallery',
      body: `The **Copilot Prompt Gallery** is the catalogue of prompts available inside Copilot Chat and the Microsoft Copilot app (there is also a public web version where anyone can read Microsoft's prompts, though you must sign in to try them). It has three collections:

- **Suggested**: Microsoft-curated prompts that show key scenarios and capabilities, each with tips for personalising and extending it.
- **Your Prompts**: prompts you have saved for yourself.
- **Teams**: prompts shared with a team you belong to.

Prompts you save or share are stored in collections in the Microsoft 365 Substrate data store, inside your tenant boundary, encrypted and reachable only through Microsoft 365 APIs. Admins can export the prompts users have saved, liked and shared for analytics, and the gallery feeds the "Suggested prompts" users see when they open Copilot Chat.

Why it matters for the exam: the gallery is the answer to "how does a user reuse a prompt" and "how does a team standardise prompts" questions. It is a user-facing feature; it is not an admin policy, a Copilot Studio agent or a Power Automate flow.`,
    },
    {
      heading: 'Saving and sharing a prompt',
      body: `**Save a prompt.** After you write a prompt that works, open the prompt's options (or select the prompt in the gallery) and choose **Save**. Give it a title; it appears under Your Prompts in the Prompt Gallery so you can run it again from any Copilot Chat surface (Copilot app, Teams, Outlook). Saved prompts can be edited before sending, which is why good saved prompts use placeholders in brackets, for example "Summarise the status of [project] for [audience]".

**Share a prompt.** From the same menu choose **Share** and pick a Microsoft Teams team. Members see the prompt under the Teams collection in the gallery. Sharing a prompt shares the *text* of the prompt; it never shares your data, your chats or your permissions. Each person who runs it gets results based on their own access.

**Organisational prompts.** Admins (AI Administrator or Search Editor role) can publish up to 1,000 prompts for the whole tenant from the **Microsoft 365 admin center > Copilot > Prompts**, individually or by CSV import, and pin up to four as suggested prompts on the Copilot Chat home page. Published prompts also appear in the **prompt lab** (searchable, filterable by task type and department) and as **autosuggest** when users start typing. Selecting one places it in the message box without sending it, so users can adjust it first. Admins see adoption analytics (active users, submissions) per prompt.

The distinction the exam tests: *saving* is personal, *sharing* is to a team via the gallery, *organisational prompts* are admin-published to everyone.`,
    },
    {
      heading: 'Scheduling a prompt',
      body: `**Scheduled prompts** run a saved prompt automatically at a time and frequency you choose, so recurring questions ("Summarise overnight emails from my customers", "List this week's open action items from my meetings") arrive without you asking. Facts to know:

- Scheduling is available in the **Work IQ (work) tab** of Copilot Chat; you will not see the option outside it. It requires the Microsoft 365 Copilot licence.
- Scheduled prompts run across Microsoft Teams, Office.com chat and Outlook; the responses from each run appear in your Copilot chat history, so they are searchable and subject to the same compliance controls as other chats.
- Limits: up to **10 active and 50 total** schedules per user.
- The new generation of scheduled prompts runs as **scheduled tasks** inside the Microsoft 365 compliance boundary; they no longer need a Power Platform environment. Legacy Power Platform scheduled prompts retire on **31 December 2026** and must be recreated as scheduled tasks to keep running. Scheduled tasks are not a connected experience, so the "Allow the use of connected experiences in Office" policy does not control them.
- You can **edit, pause, resume or delete** a schedule from the prompt management menu.

In **Cowork**, scheduling is a first-class skill. Say "do this every weekday morning" and Cowork sets up the schedule; the **Schedule** section of the side panel and the **Automations** view under My tasks list your scheduled prompts with next run time and frequency, filterable by Active or Paused, with edit, pause, resume and delete options. Cowork also supports **event-driven tasks** that run when something happens, such as receiving an email or a Teams message. A scheduled Cowork task still pauses for approval before sensitive actions unless you have allowed them.

Good scheduled prompts are specific, self-contained (no "this" or "that" that depends on an earlier chat) and name their sources.`,
    },
    {
      heading: 'The exam angle',
      body: `Expect items that give a business need and ask for the least-effort feature:

- "A user runs the same weekly status prompt every Monday" → save the prompt (reuse) or schedule it (automate), not create an agent.
- "A team wants everyone to use the same customer-brief prompt" → share it to the team via the Prompt Gallery.
- "IT wants a department-wide catalogue of approved prompts visible to all staff" → organisational prompts in the Microsoft 365 admin center > Copilot > Prompts, optionally via CSV import.
- "A user can't see the Schedule option" → they are in the web tab rather than the Work IQ tab, or lack the licence.
- "A scheduled prompt created in the Power Platform preview must keep running past 2026" → recreate it as a scheduled task.
- "Pause a recurring Cowork task during the holidays" → Automations view, pause.

Distractors: Power Automate flows (no longer the mechanism), Copilot Studio agents (for scoped behaviour and knowledge, not for reusing a prompt), sensitivity labels, Teams meeting policies. Also remember that sharing a prompt never grants data access.`,
    },
  ],
  examples: [
    {
      title: 'From weekly chore to scheduled prompt',
      description:
        'Every Monday a programme manager types the same request: "Using my meetings and emails from last week, list open action items by project with owner and due date." She saves it to Your Prompts, then schedules it for 8 am Mondays from the Work IQ tab of Copilot Chat. The response lands in her chat history before stand-up; she skims it, checks two items against the recap, and shares the list in Teams.',
      language: 'text',
      code: `Saved prompt (self-contained, named sources, no "this/that"):
  "Using my meetings and emails from the last 7 days, list open
   action items grouped by project. Columns: item, owner, due date,
   source. Flag anything overdue."

Schedule: every Monday, 08:00 (Work IQ tab > prompt options > Schedule)`,
      takeaway: 'Save for reuse, schedule for recurrence; write scheduled prompts so they make sense with no prior conversation.',
    },
    {
      title: 'Standardising the team\'s customer brief',
      description:
        'A sales director notices that account managers write wildly different pre-call briefs. One manager\'s prompt consistently produces the best brief, so he shares it with the Sales team in the Prompt Gallery. Each account manager now finds it under Teams, runs it against their own accounts, and sees only the accounts they have access to. For the organisation-wide version, the enablement lead later asks IT to publish it as an organisational prompt pinned on the Copilot home page.',
      takeaway: 'Share to a team for a team standard; organisational prompts, published by admins, reach everyone and can be pinned as suggestions.',
    },
    {
      title: 'The schedule that stopped (a realistic mistake)',
      description:
        'An operations lead created a scheduled prompt during the public preview. In January 2027 it silently stops running. The cause: legacy Power Platform scheduled prompts were retired on 31 December 2026 and are not migrated automatically. He recreates it as a scheduled task in the Work IQ tab, which runs inside the Microsoft 365 compliance boundary and needs no Power Platform environment. The earlier responses are still in his chat history.',
      takeaway: 'Legacy scheduled prompts must be recreated as scheduled tasks; past responses remain in chat history.',
    },
    {
      title: 'Pausing a Cowork automation',
      description:
        'A team lead has Cowork produce a daily briefing at 7 am and post it to the team channel after her approval. Before a two-week leave she opens My tasks > Automations, filters Active, and pauses the briefing; on return she resumes it. No prompts were deleted and no approvals were skipped.',
      takeaway: 'Cowork\'s Automations view is where scheduled and event-driven tasks are edited, paused, resumed or deleted.',
    },
  ],
  keyPoints: [
    'The Copilot Prompt Gallery has three collections: Suggested (Microsoft-curated), Your Prompts (saved) and Teams (shared with a team).',
    'Save a prompt from its options menu to reuse it; share it to a Microsoft Teams team so members find it in the gallery. Sharing shares the prompt text only, never data or permissions.',
    'Organisational prompts are published by admins (AI Administrator or Search Editor) from Microsoft 365 admin center > Copilot > Prompts, up to 1,000 per tenant, with up to four pinned as suggestions, plus CSV import and adoption analytics.',
    'Scheduled prompts run automatically at a chosen time and frequency; they appear only in the Work IQ tab, need the Microsoft 365 Copilot licence, and allow 10 active and 50 total schedules per user.',
    'Responses from scheduled runs land in chat history; schedules can be edited, paused, resumed or deleted.',
    'Scheduled tasks now run inside the Microsoft 365 compliance boundary; legacy Power Platform scheduled prompts retire on 31 December 2026 and must be recreated.',
    'Cowork sets up schedules from natural language ("do this every morning") and supports event-driven tasks; manage them in the Automations view or the Schedule section of the side panel.',
  ],
  flashcards: [
    { front: 'What are the three collections in the Copilot Prompt Gallery?', back: 'Suggested (Microsoft-curated), Your Prompts (saved by you) and Teams (shared with your team).' },
    { front: 'How do you make a prompt available to colleagues in a specific team?', back: 'Use Share on the prompt and pick the Microsoft Teams team; it appears under the Teams collection in the Prompt Gallery.' },
    { front: 'Does sharing a prompt share the data it referenced?', back: 'No. Only the prompt text is shared; each person gets results based on their own permissions.' },
    { front: 'Where do admins publish organisational prompts?', back: 'Microsoft 365 admin center > Copilot > Prompts, with roles AI Administrator or Search Editor; up to 1,000 prompts per tenant.' },
    { front: 'How many organisational prompts can be pinned as suggested prompts?', back: 'Up to four.' },
    { front: 'In which tab of Copilot Chat can a user schedule a prompt?', back: 'The Work IQ (work) tab; scheduling is not offered outside it.' },
    { front: 'How many scheduled prompts can one user have?', back: 'Up to 10 active and 50 total schedules.' },
    { front: 'Where do responses from scheduled prompts appear?', back: 'In the user\'s Copilot chat history, across Teams, Office.com chat and Outlook.' },
    { front: 'What happens to legacy Power Platform scheduled prompts?', back: 'They retire on 31 December 2026 and must be recreated as scheduled tasks; earlier responses remain in chat history.' },
    { front: 'Where does a Cowork user manage scheduled and event-driven tasks?', back: 'In My tasks > Automations (or the Schedule section of the side panel): edit, pause, resume or delete.' },
    { front: 'What is an event-driven task in Cowork?', back: 'An automation that runs when something happens, such as receiving an email or a Teams message, rather than on a timer.' },
  ],
  quiz: [
    {
      question:
        'A finance analyst runs the same prompt every Friday to summarise the week\'s invoice exceptions from her email. She wants the summary to appear automatically without typing anything. Which feature should she use?',
      options: ['Share the prompt with the Finance team', 'Schedule the prompt from the Work IQ tab of Copilot Chat', 'Create a declarative agent in Copilot Studio', 'Apply a retention label to the prompt'],
      correct: [1],
      explanation:
        'Scheduled prompts run on a timer and deliver results to chat history. Sharing reaches other people, an agent is for scoped behaviour, and retention labels are a compliance control.',
    },
    {
      question: 'A user cannot find the option to schedule a prompt. Which TWO are plausible causes? (Select two)',
      options: [
        'They are using the web tab rather than the Work IQ tab of Copilot Chat.',
        'They do not have a Microsoft 365 Copilot licence.',
        'They have not enabled Loop components in Teams.',
        'Their mailbox is over quota.',
      ],
      correct: [0, 1],
      explanation:
        'Scheduling is only shown in the Work IQ tab and requires the Microsoft 365 Copilot licence. Loop settings and mailbox quota are unrelated.',
    },
    {
      question: 'A department head wants all 3,000 employees to see an approved set of prompts when they open Copilot Chat, with four highlighted on the home page. What is the MOST appropriate approach?',
      options: [
        'Ask each employee to save the prompts to Your Prompts.',
        'Share the prompts with every Microsoft Teams team in the organisation.',
        'Have an AI Administrator publish them as organisational prompts in the Microsoft 365 admin center and pin four.',
        'Build a Copilot Studio agent that lists the prompts.',
      ],
      correct: [2],
      explanation:
        'Organisational prompts are the tenant-wide, admin-published mechanism with pinning for up to four suggested prompts. Individual saving does not scale, team sharing is per team, and an agent is the wrong tool.',
    },
    {
      question: 'A manager shares a prompt that references "my customer emails" with her team. What will team members see when they run it?',
      options: [
        'The manager\'s customer emails, because the prompt was hers.',
        'Results based on their own emails and permissions; the prompt text was shared, not her data.',
        'An error, because shared prompts cannot reference email.',
        'Nothing until the manager approves each run.',
      ],
      correct: [1],
      explanation:
        'Sharing a prompt shares only the text. Copilot always runs as the signed-in user, so each member\'s results come from their own accessible data.',
    },
    {
      question: 'A user\'s scheduled prompt created during the public preview stops running in January 2027. What should they do?',
      options: [
        'Enable connected experiences in their privacy settings.',
        'Recreate it as a scheduled task in the Work IQ tab; legacy Power Platform scheduled prompts retired on 31 December 2026.',
        'Ask an admin to create a Power Platform environment.',
        'Reinstall the Copilot app.',
      ],
      correct: [1],
      explanation:
        'Legacy Power Platform scheduled prompts retired at the end of 2026 and are not migrated. New scheduled tasks need no Power Platform environment and are not governed by connected-experience settings.',
    },
    {
      question: 'A team lead wants Cowork to stop its 7 am daily briefing for two weeks and resume afterwards without recreating it. Where should she go?',
      options: ['Microsoft 365 admin center > Copilot > Prompts', 'My tasks > Automations, then Pause (and later Resume)', 'Settings > Personalization', 'Teams admin center > Meeting policies'],
      correct: [1],
      explanation:
        'Cowork\'s Automations view lists scheduled prompts with pause, resume, edit and delete. The admin center manages organisational prompts, Personalization manages memory, and Teams meeting policies are unrelated.',
    },
  ],
  statements: [
    { text: 'Saved prompts in the Copilot Prompt Gallery are stored within the tenant boundary in the Microsoft 365 Substrate data store.', isTrue: true, explanation: 'User and group collections are encrypted and accessible only via Substrate APIs.' },
    { text: 'Sharing a prompt with a team grants team members access to the files the prompt author referenced.', isTrue: false, explanation: 'Only the prompt text is shared; each user runs it with their own permissions.' },
    { text: 'A user can have an unlimited number of active scheduled prompts.', isTrue: false, explanation: 'The limit is 10 active and 50 total schedules per user.' },
    { text: 'Responses from scheduled prompts are delivered to the user\'s Copilot chat history.', isTrue: true, explanation: 'Each run produces a chat response subject to the same compliance controls.' },
    { text: 'Organisational prompts are created by end users and approved by their manager in Teams.', isTrue: false, explanation: 'They are published by admins (AI Administrator or Search Editor) in the Microsoft 365 admin center.' },
    { text: 'Scheduled tasks in Copilot Chat require a Power Platform environment.', isTrue: false, explanation: 'The current generation runs inside the Microsoft 365 compliance boundary without Power Platform; only legacy prompts used it.' },
    { text: 'Cowork can create a recurring schedule when the user simply says "do this every morning".', isTrue: true, explanation: 'Cowork sets up the schedule automatically and lists it under Automations.' },
    { text: 'Selecting an organisational prompt in the prompt lab sends it to Copilot immediately.', isTrue: false, explanation: 'It is placed in the message box so the user can modify it before submitting.' },
  ],
  resources: [
    { label: 'Understand Prompt Gallery in Copilot (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/manage/copilot-prompt-gallery' },
    { label: 'Manage scheduled prompts for Microsoft Copilot (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/manage/scheduled-prompts' },
    { label: 'Organizational prompts overview (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/manage/organizational-prompts' },
    { label: 'Use Copilot Cowork: manage your tasks and automations (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/cowork/use-cowork' },
  ],
};
