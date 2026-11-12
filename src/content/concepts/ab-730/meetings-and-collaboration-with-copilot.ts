import type { Concept } from '../../types';

export const meetingsAndCollaborationWithCopilot: Concept = {
  id: 'meetings-and-collaboration-with-copilot',
  title: 'Meetings and Collaboration: Preparation, Facilitator, Catch-up, Intelligent Recap and Pages',
  summary:
    'Copilot covers the whole meeting lifecycle in Teams and Outlook: preparing from the calendar event, running the meeting with private Copilot answers and the shared Facilitator agent, catching up when you join late, reviewing with Intelligent Recap (notes, tasks, chapters, markers, audio and video recap), and turning the output into co-authored Copilot Pages.',
  certs: ['ab-730'],
  domains: ['ab-730-3'],
  outcomes: ['ab-730-3-2-1', 'ab-730-3-2-2', 'ab-730-3-2-3', 'ab-730-3-2-4', 'ab-730-3-2-5'],
  tags: ['teams', 'meetings', 'facilitator', 'intelligent-recap', 'copilot-pages', 'outlook'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Before the meeting: prepare with Copilot',
      body: `Preparation starts in the calendar. Open the event in Outlook and the **Prepare for this meeting** section shows a Copilot summary built from the invitation, relevant emails, shared documents, prior action items and chat history. Select *Show more* for the full summary, then use a suggested prompt or start a chat: "What are the open action items from my last meeting with this team?", "Summarise the documents shared for this meeting", "What should I know about [attendee] before this call?". The summary is **personal**: it reflects only what you can access, so other attendees see a different one. An admin setting (Meeting Insights) must be on.

When creating a meeting, Copilot can **suggest an agenda** from the title, description and attendees. Edit it before sending; when the meeting starts, the Facilitator agent can pick that agenda up automatically.

Other pre-meeting moves: ask Copilot Chat in work mode for a cross-source briefing ("latest on Project Falcon from emails, chats and files"), summarise pre-read files from the Teams preview (*Summarize with Copilot*), and catch up on the meeting chat or channel thread with the Copilot icon (30-day window by default; add a time frame such as "since Monday" to focus it). In Cowork, the **Meetings** skill prepares meeting intelligence and the **Daily Briefing** skill summarises the day ahead.`,
    },
    {
      heading: 'During the meeting: Copilot answers you privately, Facilitator works for everyone',
      body: `Two complementary tools run during a Teams meeting, and the exam expects you to know how they differ:

**Copilot in the meeting** (the Copilot button in meeting controls) reasons over the live transcript and chat and answers **privately**: nobody else sees your prompts. Useful prompts: "How did Priya respond to the proposal?", "Where do we still disagree?", "Create a table of ideas with pros and cons", "What questions would move this forward?". Long answers can **Open in Word**; tables can **Open in Excel** (sensitivity labels may block export). Copilot does not work in meetings hosted outside your organisation or in end-to-end encrypted meetings.

The organiser's meeting option **Allow Copilot and Facilitator** has three values: *During and after the meeting* (requires transcription; enables recap), *Only during the meeting* (live speech-to-text, nothing retained unless someone starts a transcript), and *Off* (also disables recording and transcription). Admin meeting policy sets the default and whether organisers can change it.

**Facilitator** is a Microsoft 365 agent that behaves like a participant: anything a user says to it in the meeting chat, and everything it replies, is **visible to everyone**. Turn it on when scheduling (Facilitator toggle) or during the meeting (More actions > Turn on Facilitator, then pick the spoken language). It:

- Reads the agenda from the invite or notes (visible once a non-organiser joins; encrypted invites cannot be read) or takes one from the chat ("@Facilitator, here's the agenda: intros 5 min, review 20 min…") and shows a **timer** with the current item.
- Generates **AI notes** in real time into a shared page all participants can co-edit, and captures **follow-up tasks** that can sync to Planner.
- Answers **@mention questions** from meeting and web content, flags people mentioned who are not present, warns when the meeting runs over, and can **create a Word document** ("@Facilitator, create a project brief based on this meeting").

Only a licensed Microsoft 365 Copilot user can turn Facilitator on; unlicensed attendees see its notes and responses but cannot prompt it. Facilitator works in scheduled meetings and Teams Rooms, not in channel meetings, instant meetings, 1:1 chats or calls.`,
    },
    {
      heading: 'Real-time catch-up when you join late',
      body: `Joining a meeting after it has started no longer means whispering "what did I miss?". If **Copilot is active and you join more than five minutes late**, Copilot sends you a notification offering to catch you up; select *Open Copilot* for an instant private summary of what has been discussed, decided and asked so far. You can keep asking ("what was decided about pricing before I joined?") while the meeting continues. Because this is Copilot in the meeting, it depends on transcription or the *Only during the meeting* speech-to-text mode being active.

Catch-up also applies outside the live meeting:

- **Chats and channels**: open the conversation, select the Copilot icon, and ask "summarise what I've missed in the past two days" or "what decisions were made in this thread?" Citations jump to the source messages. Copilot summarises up to 30 days by default and cannot summarise images, Loop components or files shared in the thread (preview the file and use *Summarize with Copilot* for that).
- **Facilitator for absentees**: people who missed the meeting can @mention Facilitator in the meeting chat afterwards to find a decision or open question rather than waiting for a written recap.
- **Audio recap**: a podcast-style narrated summary across up to eight transcribed meetings for catching up after time away (see Intelligent Recap).

The exam distinction: *real-time catch-up* is Copilot in the live meeting (late-join notification and private questions); *Intelligent Recap* is the post-meeting experience.`,
    },
    {
      heading: 'After the meeting: Intelligent Recap',
      body: `**Intelligent Recap** lives in the **Recap** tab of the meeting chat (and the Teams calendar) for meetings that were recorded or transcribed. It requires a Microsoft 365 Copilot licence or Teams Premium (audio recap and some features need the Copilot licence). What it offers:

- **AI summary** from the full transcript, separate from Facilitator's live notes, plus **AI recommended follow-up tasks**; *Share > Share to email* drafts an Outlook message to invitees with the summary and tasks for you to review and send.
- **Notes** tab: Facilitator's AI-generated notes if it was on.
- **Topics and chapters**: the recording is divided into labelled chapters (keywords from transcript and PowerPoint Live content) so you jump to the part you need. Requires recording **and** transcription.
- **Timeline markers**: personal markers for when your **name was mentioned**, when **screens were shared** and when **you joined or left**; only you see your own markers.
- **Speakers** view: who spoke when, organised by the people you work with most; select a bar to jump there.
- **Video recap**: a narrated highlight reel with short clips; needs recording and transcription and a meeting of at least 10 minutes.
- **Audio recap**: one narrated summary across up to **eight** transcribed meetings, generated from the Meet app or any recap; stored in your OneDrive for 60 days; scheduled meetings only; Copilot licence required; no recording needed.
- Recap can be **shared with external attendees** via Outlook, and multilingual recap (preview) translates it into each participant's chosen language.

For meetings that must not leave a record, the *Only during the meeting* option gives Copilot during the call and discards the data afterwards; there is then no recap. Note that Purview retention may still retain Copilot prompts and responses for compliance.`,
    },
    {
      heading: 'Collaborate on the output with Copilot Pages',
      body: `Meeting output usually needs to become something a group edits: an action plan, a decision log, a draft announcement. **Copilot Pages** is the collaboration canvas for Copilot content.

- From any Copilot Chat response select **Edit in Pages** (or ask Copilot to "create a page"). The response opens beside the chat as an editable page; add more responses, headings, tables, checklists and code blocks with /.
- **Share** by link or by mentioning a colleague. Collaborators edit in **real time**, with contributor changes tracked, but they **do not get access to the chat** that produced the page. Pages can be shared as **interactive components** in Teams and Outlook (Loop components must be enabled for that), and later **exported to Word or PowerPoint**.
- Pages are stored in a user-owned container in your tenant (shared with Copilot Notebooks and Loop My workspace), appear in the **Copilot Library**, and remain until the owner deletes them; if an owner leaves, copy content you need. Using Copilot *inside* a shared page for AI-assisted co-editing requires the Microsoft 365 Copilot licence; creating, editing and sharing pages is available to eligible users without it.

Related collaboration tools: Facilitator's notes are a shared, co-editable page in the meeting; the **Channel Agent** summarises channel progress, flags deadlines and creates tasks; **Copilot Notebooks** hold pages and files for a long-running topic.`,
    },
  ],
  examples: [
    {
      title: 'A full meeting lifecycle',
      description:
        'A programme lead opens Thursday\'s steering meeting in Outlook, reads the Prepare for this meeting summary, and asks "what open actions do we have from the last steering meeting?". She turns on Facilitator when scheduling and pastes the agenda into the invite. During the meeting Facilitator shows the timer, takes shared notes and captures three tasks that she syncs to Planner; she privately asks Copilot "where do we still disagree on the vendor choice?". Afterwards she opens Recap, shares the AI summary and tasks to email, and turns the decision log into a Page the team refines together.',
      takeaway: 'Prepare in Outlook, run with Copilot (private) and Facilitator (shared), review in Recap, collaborate in Pages.',
    },
    {
      title: 'Joining fifteen minutes late',
      description:
        'A product manager joins a design review late. Copilot (active via transcription) posts a notification; he selects Open Copilot and gets a private summary: two options discussed, one rejected on cost, a question for him pending. He asks "what exactly was asked of me?" and answers in the meeting without derailing it.',
      takeaway: 'Late joiners get a real-time private catch-up from Copilot when it is active and they are more than five minutes late.',
    },
    {
      title: 'No recap after the meeting (a realistic mistake)',
      description:
        'A team lead expects an Intelligent Recap but the Recap tab shows nothing. The organiser had set Allow Copilot and Facilitator to Only during the meeting and nobody started a transcript, so no data was retained. For the next meeting she asks the organiser to use During and after the meeting (which requires transcription) and to turn on recording as well so chapters, speakers and video recap are available.',
      takeaway: 'Recap depends on the meeting option and on transcription (and recording for chapters, speakers and video recap).',
    },
    {
      title: 'Asking Facilitator in front of everyone',
      description:
        'A manager types "@Facilitator, summarise what the client said about budget" in the meeting chat during a vendor call. The question and answer appear for all participants, including the vendor. Facilitator is a shared participant; the private channel for questions is the Copilot button in meeting controls.',
      takeaway: 'Copilot in meetings is private; Facilitator is visible to everyone in the meeting chat.',
    },
  ],
  keyPoints: [
    'Prepare for this meeting in Outlook gives a personal, permission-based summary of emails, files, actions and chats; Copilot can also suggest an agenda the Facilitator can reuse.',
    'Copilot in a Teams meeting answers privately from the live transcript and chat; results can be opened in Word or Excel.',
    'Facilitator is a shared agent: it manages the agenda and timer, writes co-editable AI notes, captures tasks (Planner sync), answers @mentions for everyone, and can create a Word document; only licensed users can turn it on, in scheduled meetings and Teams Rooms.',
    'The organiser option Allow Copilot and Facilitator has three values: During and after the meeting (transcription required, enables recap), Only during the meeting (nothing retained), Off (also disables recording and transcription).',
    'Real-time catch-up: join more than five minutes late with Copilot active and it offers a private summary; chats and channels can be caught up with the Copilot icon (30-day default).',
    'Intelligent Recap (Recap tab): AI summary and tasks, Facilitator notes, chapters and topics, personal timeline markers, speakers view, video recap (10+ minutes, recorded and transcribed), audio recap (up to eight meetings, 60 days in OneDrive).',
    'Copilot Pages turn responses into shareable, real-time co-edited pages (collaborators do not see the originating chat), shareable as components in Teams and Outlook and exportable to Word or PowerPoint.',
  ],
  flashcards: [
    { front: 'Where do you find Copilot\'s pre-meeting summary?', back: 'In the Outlook calendar event under Prepare for this meeting; it is personal to your permissions.' },
    { front: 'Who can see a user\'s prompts to Copilot during a Teams meeting?', back: 'Only that user; Copilot in meetings is private.' },
    { front: 'Who can see prompts to Facilitator during a meeting?', back: 'Everyone in the meeting; Facilitator acts like a participant in the meeting chat.' },
    { front: 'What are the three values of the Allow Copilot and Facilitator meeting option?', back: 'During and after the meeting (requires transcription), Only during the meeting (speech-to-text, nothing retained), Off (disables recording and transcription too).' },
    { front: 'When does Copilot offer to catch you up in a live meeting?', back: 'When Copilot is active and you join more than five minutes after the start; a notification offers an instant summary.' },
    { front: 'Who can turn Facilitator on?', back: 'Only a user with a Microsoft 365 Copilot licence; unlicensed attendees can view notes and responses but cannot prompt it.' },
    { front: 'Which meeting types does Facilitator NOT support?', back: 'Channel meetings, instant meetings, 1:1 and group chats, external chats and Teams calls (it supports scheduled meetings and Teams Rooms).' },
    { front: 'What does Intelligent Recap require for chapters, topics and the speakers view?', back: 'The meeting must be both recorded and transcribed.' },
    { front: 'What is audio recap?', back: 'A narrated summary across up to eight transcribed scheduled meetings, stored for 60 days in OneDrive; requires the Copilot licence, no recording needed.' },
    { front: 'How long must a meeting be for video recap?', back: 'At least 10 minutes, and it must be recorded and transcribed.' },
    { front: 'How do you turn a Copilot response into a collaborative page?', back: 'Select Edit in Pages on the response and add it to a new or existing Copilot Page, then share the link.' },
    { front: 'Do collaborators on a shared Copilot Page see the chat it came from?', back: 'No. They can edit the page in real time but do not gain access to the originating chat.' },
  ],
  quiz: [
    {
      question: 'A manager wants a live agenda timer, shared AI notes and follow-up tasks that everyone in the meeting can see. Which tool should she use?',
      options: ['Copilot in the meeting (Copilot button)', 'The Facilitator agent', 'Intelligent Recap', 'Copilot Pages'],
      correct: [1],
      explanation:
        'Facilitator manages the agenda and timer, writes shared notes and captures tasks visibly for all. Copilot in the meeting is private, Recap is post-meeting, and Pages is a collaboration canvas.',
    },
    {
      question: 'A project manager joins a meeting 12 minutes late while Copilot is active. What is the FASTEST way to learn what was discussed without interrupting?',
      options: ['Wait for the Intelligent Recap after the meeting', 'Select Open Copilot on the catch-up notification for a private summary', '@mention Facilitator in the meeting chat', 'Ask a colleague in a side chat'],
      correct: [1],
      explanation:
        'Copilot offers a private real-time catch-up to late joiners. Recap arrives only after the meeting, Facilitator responses are visible to everyone, and a side chat distracts a colleague.',
    },
    {
      question: 'Which TWO features of Intelligent Recap require the meeting to be both recorded AND transcribed? (Select two)',
      options: ['Topics and chapters', 'Audio recap', 'Speakers view', 'AI summary'],
      correct: [0, 2],
      explanation:
        'Chapters/topics and the speakers view need recording plus transcription. Audio recap needs transcription only (no recording), and the AI summary is generated from the transcript.',
    },
    {
      question: 'After a sensitive negotiation meeting, the team finds there is no recap and no transcript. The organiser had set Allow Copilot and Facilitator to Only during the meeting. What is true?',
      options: [
        'This is a Teams bug; the recap will appear within 24 hours.',
        'This is by design: Copilot used live speech-to-text and no data was retained after the meeting.',
        'The recap is available to the organiser only.',
        'Facilitator deleted the recap when the meeting ended.',
      ],
      correct: [1],
      explanation:
        'Only during the meeting keeps Copilot available live but discards the data afterwards unless a transcript is started. Recap requires During and after the meeting with transcription.',
    },
    {
      question: 'A team wants to refine a Copilot-generated action plan together in real time, with colleagues who were not in the original chat. What should the author do?',
      options: ['Forward the chat link', 'Select Edit in Pages and share the page', 'Save the response as a prompt', 'Schedule the prompt for the team'],
      correct: [1],
      explanation:
        'Copilot Pages are the co-editable canvas; collaborators edit the page without seeing the chat. Chat links do not grant access, and saved or scheduled prompts are not collaborative documents.',
    },
    {
      question: 'An unlicensed attendee tries to ask Facilitator a question in the meeting chat and nothing happens, although they can see Facilitator\'s notes. Why?',
      options: [
        'Facilitator only answers the organiser.',
        'Only users with a Microsoft 365 Copilot licence can prompt Facilitator; unlicensed users can view its notes and responses.',
        'Facilitator is disabled in all meetings with external attendees.',
        'The attendee must enable transcription first.',
      ],
      correct: [1],
      explanation:
        'Prompting Facilitator requires the Copilot licence. Facilitator is not organiser-only, and transcription is not the gating factor for an attendee\'s ability to prompt.',
    },
  ],
  statements: [
    { text: 'The Prepare for this meeting summary in Outlook is identical for every attendee.', isTrue: false, explanation: 'It is personal, based on each attendee\'s own emails, files and permissions.' },
    { text: 'Copilot in a Teams meeting shows your questions and its answers to all participants.', isTrue: false, explanation: 'Copilot in meetings is private; Facilitator is the shared experience.' },
    { text: 'Setting Allow Copilot and Facilitator to Off also turns off recording and transcription for the meeting.', isTrue: true, explanation: 'Off disables Copilot, Facilitator, recording and transcription.' },
    { text: 'Facilitator can be added to channel meetings and instant meetings.', isTrue: false, explanation: 'Facilitator supports scheduled meetings and Teams Rooms only.' },
    { text: 'Audio recap can summarise up to eight meetings into one narrated recording.', isTrue: true, explanation: 'It needs transcription, a Copilot licence and scheduled meetings; recordings are not required.' },
    { text: 'Timeline markers for name mentions and join/leave times are visible to everyone who opens the recap.', isTrue: false, explanation: 'These markers are personal; only you see your own.' },
    { text: 'Sharing a Copilot Page gives collaborators real-time editing rights but not access to the chat that created it.', isTrue: true, explanation: 'The page and the conversation have separate access.' },
    { text: 'Copilot in meetings works in meetings hosted by another organisation as long as you are licensed.', isTrue: false, explanation: 'Copilot does not work in meetings hosted outside your organisation.' },
  ],
  resources: [
    { label: 'Make your meetings more productive with AI (training module)', url: 'https://learn.microsoft.com/en-us/training/modules/make-your-meetings-more-productive-ai/' },
    { label: 'Set up Facilitator in Microsoft Teams (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/microsoftteams/facilitator-teams' },
    { label: 'Intelligent recap for Teams calls, meetings, and events (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/microsoftteams/intelligent-recap-calls-meetings' },
    { label: 'Work smarter with Copilot Chat: create and collaborate with Copilot Pages (training module)', url: 'https://learn.microsoft.com/en-us/training/modules/work-smarter-with-microsoft-365-copilot-chat/' },
  ],
};
