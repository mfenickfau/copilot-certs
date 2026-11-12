import type { Concept } from '../../types';

export const copilotCoworkBusinessTasks: Concept = {
  id: 'copilot-cowork-business-tasks',
  title: 'Delegating Work to Copilot Cowork: Skills, Approvals, Plans and Results',
  summary:
    'Copilot Cowork carries out multi-step business tasks on your behalf: it plans the steps, loads the skills it needs (Word, Excel, PowerPoint, Email, Scheduling, Deep Research and more), pauses for your approval before sensitive actions, and returns files and results you review. This concept covers how it works, prebuilt versus custom skills, how to delegate well, how to read the plan and progress, the security model and known limitations, and how to manage scheduled tasks.',
  certs: ['ab-730'],
  domains: ['ab-730-4', 'ab-730-1'],
  outcomes: ['ab-730-4-2-1', 'ab-730-4-2-2', 'ab-730-4-2-3', 'ab-730-4-2-4', 'ab-730-4-2-5', 'ab-730-4-2-6', 'ab-730-4-2-7', 'ab-730-1-1-3'],
  tags: ['cowork', 'agentic', 'skills', 'approvals', 'scheduled-tasks', 'delegation'],
  difficulty: 'intermediate',
  diagram: 'agentic-loop',
  sections: [
    {
      heading: 'How Cowork carries out multi-step work',
      body: `**Microsoft Copilot Cowork** is the agentic experience in the Microsoft Copilot app (web at copilot.cloud.microsoft, Windows and macOS desktop, iOS and Android). Where Copilot Chat helps you think and drafts things for you to act on, Cowork *does the work*: it sends email, schedules meetings, creates Word, Excel, PowerPoint and PDF files, posts in Teams, searches your organisation, manages OneDrive and SharePoint files, conducts deep research, prepares briefings, and runs prompts on a schedule. It requires a Microsoft 365 Copilot licence plus a usage-based billing policy, because consumption (model responses, tool and skill calls, image generation, browser tasks) is metered in Copilot credits.

A typical interaction:

1. **You describe the goal** in natural language (up to 250,000 characters), attaching files or adding work context (files, people, emails, Teams chats and meetings via /, or earlier Copilot chats and Cowork tasks).
2. **Cowork plans and works.** It breaks the request into steps and shows a thinking indicator, skill messages ("Preparing to compose emails"), step-by-step updates, streaming responses and sometimes interactive cards. It draws on **Work IQ** to find relevant content, within your permissions.
3. **It asks when it needs you**: clarifying questions with options you pick from (or Skip), and **approval requests** before sensitive actions.
4. **You review the results**: files appear in the Details pane with preview and download; sent messages can be checked; you can ask for changes.

You stay in control throughout: **pause** (soft, after the current step, or hard, immediately), **resume**, **cancel**, and send new messages while it works (they queue and can redirect the task). Tasks are tracked in **My tasks** with filters (Needs your input, In progress, Complete, Automations, Unread), and related tasks can be grouped into **projects** with their own instructions and shared context.

Cowork is the answer when the request has several deliverables across apps, when you would rather hand off than steer each turn, or when the work should recur.`,
    },
    {
      heading: 'Skills: how Cowork completes parts of a task',
      body: `Cowork does not have one monolithic brain for everything. It loads **skills**, specialised capabilities for a type of task, as it works. When a skill loads, a message appears in the session and the skill shows as a chip in the **Skills** section of the side panel, so you can always see what it is using.

**Built-in (prebuilt) skills** include Word, Excel, PowerPoint, PDF, Email (compose, reply, forward, send, drafts, attachments), Scheduling, Calendar Management, Meetings (meeting intelligence), Daily Briefing, Enterprise Search, Deep Research, Communications (stakeholder updates), Adaptive Cards, OneNote & Notebooks where available, and App (Frontier) for building lightweight apps. Microsoft maintains them.

**Custom skills** are instructions you or your organisation write, stored as a SKILL.md file (with a name and description in its frontmatter) in your OneDrive under /Documents/Cowork/skills/. You can create one from the **Customize > Skills** tab with a guided flow, by asking Cowork in chat to build a skill, or by uploading a .md, .zip or .skill file. Cowork discovers custom skills at the start of each session; you can have up to 50, share them with specific people, and re-share updates. Cowork automatically **evaluates** a skill when you create or update it, scoring trigger clarity, instruction specificity, scope boundaries and robustness, and runs safety checks for prompt injection and unconfirmed actions.

**Plugins** from the Microsoft 365 App Store bundle skills and connectors (for example Finance for Cowork, Capital Markets for Cowork, or third-party line-of-business plugins); admins can deploy or revoke them.

**Choosing prebuilt versus custom.** Use built-in skills whenever they cover the job: they are validated by Microsoft and need no maintenance. Write a custom skill when you want Cowork to do a recurring task **your way**: a weekly report in your template and structure, a standard stakeholder email format, a checklist your team follows. Remember that custom and plugin skills are **not validated by Microsoft**; review their outputs carefully and only upload skills from sources you trust, because a skill runs as instructions to the AI. **Custom instructions** (Customize > Preferences) are different from skills: they are standing preferences applied to every task, not task-specific procedures.`,
    },
    {
      heading: 'Delegating well and reviewing plan, progress and results',
      body: `**Delegating a piece of work.** Good Cowork requests read like a brief to a capable colleague:

- State the **outcome** and deliverables ("a 10-slide deck, a two-paragraph email to the steering group, and a 30-minute review booked for Thursday").
- Give **context and sources** (attach files, reference meetings and chats with /, name the systems).
- Set **constraints** (audience, tone, template, deadline, who must not be emailed).
- Say which **skill** or approach you expect when it matters ("use Deep Research across our Teams channels and the web", "use the weekly-report skill").
- Be specific: "Email Sarah about the Q2 review tomorrow at 2 pm" beats "send that email".

**Reviewing the plan and progress.** Watch the step-by-step log and the **Progress** bar in the side panel (percentage complete plus a step log). If a step goes in the wrong direction, send a message to redirect, or pause and clarify. Answer clarifying questions promptly; Skip lets Cowork continue with what it has. Allow extra time for complex tasks; retry only if progress stops for a minute or more.

**Approving actions.** Before sensitive actions (sending email, posting in Teams, scheduling, sharing, editing an existing file, editing OneNote) Cowork shows an approval dialog with a preview of the content and recipients, and a **risk level indicator** for medium and high-risk actions. Options: the action button (Send, Post, Create: once), **Always allow** via the dropdown (skip similar prompts for the rest of this conversation, optionally limited to a recipient or domain), **Approve All** when several are pending, **Cancel** (skip that action and continue), and **Show parameters** for technical detail. "Don't ask again" choices apply only to the current conversation and can be reviewed under **Permissions** in the side panel. Always read the preview: that is the review moment.

**Reviewing results.** Output files appear in the **Output folder** of the side panel with Preview (Word, Excel, PowerPoint, PDF, Markdown, images, code) and Download (or Download all as a zip); they are also saved to your OneDrive Cowork folder, under your organisation's governance. Check sent messages and calendar changes, rate responses, leave inline comments, and ask for changes. Treat everything Cowork produces as a **draft**.`,
    },
    {
      heading: 'Security considerations and known limitations',
      body: `Cowork follows the same security model as Copilot, with a few agent-specific points:

- **Cowork sees what you see.** It inherits your identity and permissions; tenant isolation applies; it cannot read encrypted files unless you hold the VIEW and EXTRACT rights; it shows the sensitivity label of referenced items and displays the highest label for the conversation.
- **No training on your data.** Organisational data stays within Microsoft 365 and your governance policies (DLP for the Copilot and Cowork location, retention, audit).
- **No sensitive action without you.** Sending, posting, scheduling, sharing and editing wait for approval unless you have explicitly allowed them in that conversation.
- **Models**: Cowork can use models from OpenAI, Anthropic and xAI as subprocessors under Microsoft's data protection terms; admins can disable providers; EU Data Boundary tenants get GPT models only; some models (for example Claude Fable) require data retention and show a banner when selected.
- **Access control**: admins grant Cowork through usage-based billing (spending) policies; removing a user from every policy that includes Cowork removes access. A low credit limit alone does not block access.

**Known limitations** Microsoft lists:

- Ambiguous requests may be misinterpreted; be specific.
- Outputs are drafts; review before approving send or share.
- **No local file access**: Cowork works with OneDrive, SharePoint and connected cloud files only (attachments under 200 MB).
- **Cannot delete files or folders** in OneDrive or SharePoint; cannot create OneNote notebooks or sections (only pages in existing sections).
- Results depend on what is indexed; outdated or unindexed sources may be missed.
- Complex tasks with many dependencies may not fully complete; review carefully.
- Custom and plugin skills are not validated by Microsoft.
- Voice input varies by browser; custom skills are not supported on mobile.
- Not intended for cases requiring guaranteed accuracy without human review (legal filings, medical decisions, financial transactions bypassing approvals).`,
    },
    {
      heading: 'Managing scheduled tasks and automations',
      body: `Cowork turns recurring work into **automations**:

- **Scheduled prompts**: say "every weekday at 7 am, prepare my daily briefing and draft the team stand-up post" and Cowork creates the schedule. Each run is a task; actions still pause for approval unless allowed.
- **Event-driven tasks**: run when something happens, such as receiving an email from a specific sender or a Teams message, for triage or acknowledgement workflows.

Manage them from the **Schedule** section of the side panel or the **Automations** view under My tasks, which lists each schedule with next run time and frequency, filterable by Active or Paused, with **edit, pause, resume and delete**. In Copilot Chat, scheduled prompts are created and managed from the prompt options in the Work IQ tab (10 active and 50 total per user) and their responses land in chat history.

Governance notes: scheduled task data is processed within the Microsoft 365 compliance boundary; legacy Power Platform scheduled prompts retire on 31 December 2026 and must be recreated. Review your automations periodically: a schedule that keeps running after a project ends wastes credits and attention, and an "Always allow" granted in one conversation does not carry over to a scheduled run, so each run's approvals are yours to make.`,
    },
  ],
  examples: [
    {
      title: 'Preparing a QBR end to end',
      description:
        'A customer success manager asks Cowork: "Prepare me for Thursday\'s QBR with Northwind. Pull the last quarter\'s emails and Teams threads about Northwind, summarise open issues, build a 10-slide deck using /QBR template.pptx, draft a pre-read email to their CTO and our account team, and book a 30-minute internal rehearsal on Wednesday afternoon." Cowork loads Enterprise Search, PowerPoint, Email and Scheduling skills, asks which of two templates to use, shows progress, and pauses with previews before sending the email and creating the meeting. She corrects a recipient, approves, and downloads the deck.',
      language: 'text',
      code: `Delegation brief (outcome, sources, constraints, approvals expected):
  "Prepare me for Thursday's QBR with Northwind.
   1) Summarise open issues from last quarter's Northwind emails
      and Teams threads.
   2) Build a 10-slide deck from /QBR template.pptx.
   3) Draft a pre-read email to their CTO and our account team
      (do not send to anyone else).
   4) Book a 30-minute internal rehearsal on Wednesday afternoon.
   Tone: executive, concise."`,
      takeaway: 'Describe deliverables, sources and constraints; Cowork plans, loads skills, and asks for approval before acting.',
    },
    {
      title: 'Always allow, then the wrong recipient (a realistic mistake)',
      description:
        'A team lead asks Cowork to send individual status requests to twelve project owners. After approving the first two he selects Always allow for email sends to speed things up. The eleventh message goes to a contractor at an external domain who should not have seen the budget line. The fix: use the narrower "only to a specific domain" option when allowing, keep reading previews for messages with sensitive content, and remember the permission is per conversation and visible under Permissions in the side panel.',
      takeaway: 'Approval dialogs are the control; scope "Always allow" narrowly and keep reviewing content and recipients.',
    },
    {
      title: 'A custom skill for the weekly report',
      description:
        'An operations manager produces the same weekly report: a two-page Word document with fixed sections, a KPI table from a tracking workbook and an upbeat tone. She asks Cowork to help create a skill, answers the guided questions (name, description, when to trigger, steps, template to use), and Cowork saves SKILL.md to her OneDrive and returns a quality report. She tests it in a new conversation, then shares it with two colleagues. Because custom skills are not validated by Microsoft, she keeps checking the KPI figures each week.',
      takeaway: 'Custom skills encode your recurring procedure; built-in skills cover generic tasks; both still need result review.',
    },
    {
      title: 'The file Cowork could not touch',
      description:
        'A coordinator asks Cowork to "delete the old drafts folder in SharePoint and summarise the files on my desktop". Cowork explains it cannot delete files or folders and cannot access local files, then offers to summarise the files if she uploads them or points to their OneDrive location. She uploads the files and tidies the folder herself.',
      takeaway: 'Know the limits: no local file access and no deletion in OneDrive or SharePoint.',
    },
  ],
  keyPoints: [
    'Cowork completes multi-step work across Microsoft 365 on your behalf: email, meetings, Word/Excel/PowerPoint/PDF files, Teams posts, enterprise search, deep research, briefings and scheduled prompts; it needs the Microsoft 365 Copilot licence plus a usage-based billing policy.',
    'The loop is: describe the goal → Cowork plans and works (thinking, skill messages, step log, streaming) → clarifying questions and approvals → you review results in the Details pane and OneDrive.',
    'Skills are specialised capabilities loaded per task and shown as chips in the side panel; built-in skills are Microsoft-maintained, custom skills are SKILL.md files in OneDrive (up to 50, shareable, auto-evaluated but not validated by Microsoft), plugins bundle skills and connectors.',
    'Delegate with outcome, sources, constraints and the expected approach; be specific. Monitor progress, answer questions, redirect or pause when needed.',
    'Approvals show previews and risk indicators: approve once, Always allow (per conversation, optionally limited to a recipient or domain), Approve All, Cancel, Show parameters; review under Permissions.',
    'Security: Cowork inherits your permissions, respects labels, encryption, DLP and tenant isolation, never trains on your data, and pauses before sensitive actions; admins control models and access via spending policies.',
    'Limitations: no local files, no deleting files or folders, 200 MB attachments, indexed content only, complex tasks may not complete, custom and plugin skills unvalidated, not for decisions needing guaranteed accuracy.',
    'Scheduled and event-driven tasks are managed in the Automations view or the Schedule section: edit, pause, resume, delete; legacy Power Platform scheduled prompts retire on 31 December 2026.',
  ],
  flashcards: [
    { front: 'How does Cowork differ from Copilot Chat?', back: 'Chat generates content and insights within a conversation you steer; Cowork plans and completes multi-step work across apps on your behalf, asking for approval before sensitive actions.' },
    { front: 'What is a Cowork skill?', back: 'A specialised capability for a type of task (Word, Excel, Email, Scheduling, Deep Research and so on) that Cowork loads as needed; active skills appear as chips in the side panel.' },
    { front: 'Where are custom Cowork skills stored and how many can you have?', back: 'As SKILL.md files under /Documents/Cowork/skills/ in your OneDrive; up to 50 custom skills.' },
    { front: 'Are custom and plugin skills validated by Microsoft?', back: 'No. Their quality depends on the author or publisher; review their outputs carefully and only upload skills from trusted sources.' },
    { front: 'What happens before Cowork sends an email or posts in Teams?', back: 'It pauses with an approval dialog showing a preview of recipients and content (with a risk indicator for medium or high risk) and waits for you to approve, allow similar actions, or cancel.' },
    { front: 'How long does an "Always allow" choice last?', back: 'Only for the current conversation; you can review or revoke it under Permissions in the side panel.' },
    { front: 'Where do files created by Cowork go?', back: 'They appear in the Output folder of the side panel with Preview and Download options and are saved to your OneDrive Cowork folder.' },
    { front: 'Name three known limitations of Cowork.', back: 'No access to local files; cannot delete files or folders in OneDrive or SharePoint; complex multi-step tasks may not fully complete (also: 200 MB attachment limit, results depend on indexed content).' },
    { front: 'Can Cowork read an encrypted file?', back: 'Only if you have the VIEW and EXTRACT usage rights for it.' },
    { front: 'Where do you pause or edit a Cowork scheduled task?', back: 'In My tasks > Automations or the Schedule section of the side panel: edit, pause, resume or delete.' },
    { front: 'What is an event-driven task in Cowork?', back: 'An automation that runs when something happens, such as receiving an email or a Teams message.' },
    { front: 'What is the difference between custom instructions and custom skills in Cowork?', back: 'Custom instructions are standing preferences applied to every task; custom skills are task-specific procedures Cowork loads when a matching request arrives.' },
  ],
  quiz: [
    {
      question:
        'A manager asks Cowork to email twelve stakeholders a status update. Before the first email goes out, what does Cowork do?',
      options: [
        'Sends all twelve immediately because the manager requested them.',
        'Pauses and shows an approval dialog with the recipients and full content for review.',
        'Saves the emails as drafts and ends the task.',
        'Asks the Microsoft 365 admin for approval.',
      ],
      correct: [1],
      explanation:
        'Sending email is a sensitive action; Cowork previews it and waits for approval (once, always allow for this conversation, or cancel). It does not act unilaterally, does not stop at drafts unless asked, and admins are not in the approval loop.',
    },
    {
      question: 'Which TWO are documented limitations of Copilot Cowork? (Select two)',
      options: [
        'It cannot access files stored on the user\'s local device.',
        'It cannot create Word documents.',
        'It cannot delete files or folders in OneDrive or SharePoint.',
        'It cannot send email.',
      ],
      correct: [0, 2],
      explanation:
        'No local file access and no file deletion are listed limitations. Creating Word documents and sending email (with approval) are core Cowork capabilities.',
    },
    {
      question: 'An operations manager wants Cowork to produce her weekly report in exactly her template and section order every time. Which option is MOST appropriate?',
      options: [
        'Rely on the built-in Word skill and describe the template each week.',
        'Create a custom skill that encodes the report procedure and template.',
        'Add the template to Settings > Personalization memories.',
        'Ask the admin to publish an organisational prompt.',
      ],
      correct: [1],
      explanation:
        'A custom skill captures a recurring, specific procedure so Cowork applies it consistently. The built-in skill needs re-explaining each time, memories hold preferences rather than procedures, and organisational prompts are Chat templates.',
    },
    {
      question: 'A user selected Always allow for Teams posts in one Cowork conversation. The next day, in a new conversation, Cowork asks for approval again. Why?',
      options: [
        'The user\'s licence changed overnight.',
        'Always allow applies only to the conversation in which it was granted.',
        'Teams posts can never be pre-approved.',
        'The admin reset all permissions.',
      ],
      correct: [1],
      explanation:
        'Don\'t-ask-again choices are scoped to the current conversation and are listed under Permissions in the side panel. They do not persist across conversations.',
    },
    {
      question: 'During a long Cowork task, the user notices from the step log that Cowork is drafting the deck for the wrong audience. What is the BEST action?',
      options: [
        'Cancel the task and start again from scratch.',
        'Send a message clarifying the audience; Cowork queues it and adjusts its approach.',
        'Wait for the task to finish and then delete the deck.',
        'Switch the model to Quick response.',
      ],
      correct: [1],
      explanation:
        'Cowork accepts new messages while working and changes direction if needed; you can also pause and clarify. Cancelling loses progress, waiting wastes effort, and the model does not fix the audience.',
    },
    {
      question: 'Which statement about Cowork\'s security model is correct?',
      options: [
        'Cowork can access any file in the tenant to complete a task efficiently.',
        'Cowork inherits the user\'s permissions, respects sensitivity labels and DLP, and does not train on organisational data.',
        'Cowork bypasses sensitivity labels when it edits an existing file.',
        'Cowork sends organisational data to train the underlying models to improve future tasks.',
      ],
      correct: [1],
      explanation:
        'Cowork sees only what the user can see, shows labels, respects DLP and encryption rights, and Microsoft states no model training occurs on organisational data.',
    },
    {
      question: 'A team lead wants a daily briefing from Cowork at 7 am but needs to stop it for two weeks. Where should she manage this?',
      options: ['Settings > Personalization', 'My tasks > Automations, then Pause', 'Microsoft 365 admin center > Copilot > Prompts', 'The Copilot Library'],
      correct: [1],
      explanation:
        'Cowork scheduled prompts are managed in the Automations view (or the side panel Schedule section) with edit, pause, resume and delete.',
    },
  ],
  statements: [
    { text: 'Cowork shows each step it takes in the session so you can follow along as it works.', isTrue: true, explanation: 'Step-by-step updates, skill messages and the progress bar make the plan visible.' },
    { text: 'Cowork is included with Copilot Chat for all users at no additional cost.', isTrue: false, explanation: 'It requires the Microsoft 365 Copilot licence and a usage-based billing policy; usage is metered.' },
    { text: 'Built-in Cowork skills include Word, Excel, PowerPoint, PDF, Email, Scheduling, Calendar Management, Meetings, Daily Briefing, Enterprise Search, Deep Research and Communications.', isTrue: true, explanation: 'These are the Microsoft-maintained skills documented for Cowork.' },
    { text: 'Microsoft validates every custom skill before it can be used in Cowork.', isTrue: false, explanation: 'Custom skills are auto-evaluated for quality and safety signals but are not validated by Microsoft; review their outputs carefully.' },
    { text: 'Cowork can edit an existing Word file in SharePoint and saves changes to the same shared file, keeping version history.', isTrue: true, explanation: 'After you approve edit access, changes go to the same file and OneDrive/SharePoint version history remains available.' },
    { text: 'Cowork can access files on the user\'s local hard drive to complete a task.', isTrue: false, explanation: 'Cowork works only with OneDrive, SharePoint and connected cloud files, plus files the user uploads.' },
    { text: 'If a referenced email has a sensitivity label, Cowork shows that label and displays the highest label for the conversation.', isTrue: true, explanation: 'This helps users handle the output appropriately.' },
    { text: 'Cowork is suitable for executing financial transactions that bypass approval processes.', isTrue: false, explanation: 'Microsoft states Cowork is not intended for use cases requiring guaranteed accuracy without human review.' },
  ],
  resources: [
    { label: 'Copilot Cowork overview (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/cowork/' },
    { label: 'Use Copilot Cowork: approvals, skills, side panel and tasks (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/cowork/use-cowork' },
    { label: 'Copilot Cowork common questions (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/copilot/cowork/cowork-faq' },
    { label: 'Get more done with Copilot Cowork (training module)', url: 'https://learn.microsoft.com/en-us/training/modules/delegate-work-copilot-cowork/' },
  ],
};
