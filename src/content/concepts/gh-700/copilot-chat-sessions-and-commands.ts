import type { Concept } from '../../types';

export const copilotChatSessionsAndCommands: Concept = {
  id: 'copilot-chat-sessions-and-commands',
  title: 'Copilot Chat Across Surfaces: Sessions, Agents, @ Mentions and Slash Commands',
  summary:
    'How GitHub Copilot Chat on GitHub.com, the GitHub Copilot app and Copilot CLI differ, how to start, resume, rename, pin, archive and delete sessions, how to select an agent, and how @ mentions and slash commands such as /explain, /fix, /tests, /doc, /clear, /delete and /chronicle speed up everyday work.',
  certs: ['gh-700', 'gh-300'],
  domains: ['gh-700-2', 'gh-300-2'],
  outcomes: ['gh-700-2-1-1', 'gh-700-2-1-2', 'gh-700-2-1-3', 'gh-700-2-1-4', 'gh-700-2-1-5', 'gh-300-2-2-4'],
  tags: ['copilot-chat', 'copilot-app', 'copilot-cli', 'sessions', 'slash-commands', 'mentions'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Three surfaces, one Copilot',
      body: `The exam audience profile explicitly expects you to tell these apart:

- **Copilot Chat on GitHub.com** (github.com/copilot and the chat panel on any page). Best for questions about repositories, issues, pull requests and discussions, for comparing models, and for handing a task to **Copilot in the cloud** (a cloud sandbox or GitHub Actions environment) without leaving the browser. Conversations are saved (up to 100, messages kept 28 days in the classic experience) and can branch into **subthreads** by editing an earlier question.
- **The GitHub Copilot app** is a desktop application built on Copilot CLI for *directing agents*: multiple parallel sessions, each on its own branch or worktree, local or cloud environments, Projects that coordinate work toward a goal, Automations, Chats for brainstorming without a branch, and canvases. Available on all Copilot plans; for Business and Enterprise the Copilot app policy must be enabled (separate from the CLI policy).
- **Copilot CLI** is the terminal agent: interactive sessions with Interactive, Plan and Autopilot modes, plus a programmatic mode (\`copilot -p "prompt"\`) for scripts and schedulers.

Choosing a **model** works the same way everywhere: a model picker below the prompt lets you pick a specific model, Auto, or Copilot Fusion with an effort level, and on GitHub.com you can regenerate a response with a different model and compare. Business users need the organisation to allow model switching.`,
    },
    {
      heading: 'Managing sessions: start, resume, rename, pin, archive, delete',
      body: `A **session** is the conversation plus its context, tool activity and state (working directory, permissions, mode). Session management vocabulary by surface:

| Action | GitHub.com chat | Copilot app | Copilot CLI | Cloud agent sessions on GitHub |
|---|---|---|---|---|
| Start | New conversation, \`/new\` | **+** next to Sessions (choose repo, environment, worktree, mode, model) | \`copilot\` | Agents tab, issue assignment, \`/task\` in chat |
| Resume | Open from history | Click the session in the sidebar | \`copilot --continue\` (most recent), \`copilot --resume\` (picker), \`/resume\` | "Pick up where you left off" on github.com/copilot; continue in CLI or VS Code |
| Rename | \`/rename\` | \`/rename\` | \`/rename NEW NAME\` (\`/session rename\`) | Not applicable |
| Archive | Not applicable | Right-click a chat > Archive; Settings > Sessions > Manage sessions | Sidebar shows status; Sessions tab lists history | **Archive session** on a stopped session (cannot be deleted) |
| Delete | \`/delete\` | Manage sessions > delete | \`/session delete\`, \`/session prune --older-than DAYS\`, press x twice in the sidebar | Not possible; archive only |

Cloud sandbox sessions are not tied to a device: start in the app, steer from GitHub Mobile, review on GitHub.com, finish in the CLI. **Pinning** keeps something at hand: the Copilot app pins the active Autopilot goal panel above the prompt, Discussions can be pinned for visibility, and conversation lists let you keep frequently used threads easy to reach. By default CLI and app sessions **sync** to your GitHub account (governed by the "Store local sessions in the Cloud" policy), which enables \`/chronicle\` and natural-language questions about past sessions.`,
    },
    {
      heading: 'Selecting an agent',
      body: `"Agent" means two things on the exam. First, **which Copilot experience** does the work: chat answers; **Copilot cloud agent** works asynchronously in the cloud and opens a pull request; a **third-party coding agent** (Anthropic Claude, OpenAI Codex) or a partner **agent app** installed as a GitHub App can be chosen from the same dropdown on the Agents tab, from an issue's Assignees list, or by @mentioning it on a pull request.

Second, a **custom agent** profile that gives the session a specialist role:

- On GitHub.com, open the agent dropdown in the prompt box (Agents tab, dashboard, or when assigning an issue) and pick a repository, organisation or enterprise custom agent.
- In the Copilot app, use the agent picker dropdown or type \`/agent\`.
- In Copilot CLI, type \`/agent\` and choose, name the agent in the prompt ("Use the security-auditor agent on..."), let Copilot infer it from the description, or pass \`--agent NAME\` on the command line.

Copilot CLI also ships built-in agents (explore, task, general-purpose, code-review, research, rubber-duck, security-review) that the main agent can delegate to as **subagents** with their own context. Selecting a custom agent for the whole session is different from the main agent delegating a subtask to it; in the CLI a subagent does not read repository instructions unless \`include-custom-instructions: true\` is set.`,
    },
    {
      heading: '@ mentions and slash commands',
      body: `**Attaching context.** On GitHub.com, type \`@\` in the prompt to attach **Discussions, Extensions, Files, Issues, Pull requests and Repositories**, or use the attach menu for files, folders, uploads, repositories and Spaces; images and PDFs can be dropped in for models that support vision. In the Copilot app you reference issues with \`#\`, add files with \`@\` and open commands with \`/\`. In Copilot CLI, \`@path\` attaches a repository file and \`#number\` references an issue or pull request. In VS Code, \`#\` is for variables such as \`#file\` and \`@\` is for chat participants such as \`@github\` and \`@azure\`. "Tools" arrive through MCP servers and skills; chat on GitHub.com has preconfigured tools such as creating a branch or searching code.

**Slash commands** replace long prompts for common jobs. The exam's named list:

| Command | Where | What it does |
|---|---|---|
| \`/explain\` | IDEs, JetBrains, Xcode | Explain the selected code or active file |
| \`/fix\` | IDEs | Propose a fix for problems in the selection |
| \`/tests\` | IDEs | Generate unit tests for the selection |
| \`/doc\` | Visual Studio, Xcode | Add documentation for a symbol |
| \`/clear\` | GitHub.com, CLI, app, IDEs | Clear the conversation / start fresh (\`/new\`, \`/reset\`) |
| \`/delete\` | GitHub.com | Delete a conversation |
| \`/chronicle\` | CLI, Copilot app (and JetBrains CLI sessions) | Session history insights: \`standup\`, \`tips\`, \`cost-tips\`, \`search\`, \`improve\`, \`reindex\` |

Other high-value commands: \`/plan\`, \`/autopilot\`, \`/interactive\`, \`/model\`, \`/agent\`, \`/skills\`, \`/mcp\`, \`/compact\`, \`/context\`, \`/undo\` (\`/rewind\`), \`/share\`, \`/research\`, \`/rubber-duck\`, \`/security-review\`, \`/fleet\`, \`/usage\`, and on GitHub.com \`/task\` to hand work to Copilot cloud agent. Availability depends on surface and context; type \`/\` to see the current list.`,
    },
  ],
  examples: [
    {
      title: 'Monday morning standup from session history',
      description:
        'A technical project manager uses Copilot CLI and the Copilot app all week. On Monday she types /chronicle standup in the CLI. Copilot summarises the last day of work grouped by completion status, names the branches touched and checks the status of linked pull requests. Because the app is built on the CLI and sessions sync to her account, work started in the app appears too.',
      language: 'text',
      code: `/chronicle standup
/chronicle cost-tips
/chronicle improve     # proposes additions to .github/copilot-instructions.md`,
      takeaway: '/chronicle turns synced session history into standups, cost advice and instruction improvements.',
    },
    {
      title: 'Attaching the wrong thing (a realistic mistake)',
      description:
        'An analyst on GitHub.com pastes a 300-line issue into the chat box and asks for acceptance criteria, consuming tokens and losing the issue\'s comments and links. The better approach is to type @ and attach the issue (or just ask from the issue page, where context is automatic), so Copilot reads the live item including comments, labels and linked pull requests.',
      takeaway: 'Use @ mentions and attachments to give Copilot live context instead of pasting copies.',
    },
    {
      title: 'Picking the surface for a long-running task',
      description:
        'A program manager needs a report comparing three repositories\' open bugs. Copilot Chat on GitHub.com answers questions quickly, but for a multi-step job that should keep running while she is in meetings she starts a cloud session from the Copilot app, selects Autopilot mode and a mid-tier model, then steers it from GitHub Mobile when it asks a clarifying question. Later she resumes the same session in the CLI to export the result with /share file.',
      takeaway: 'Chat for quick answers; app or CLI sessions in a cloud sandbox for long tasks you can follow from any client.',
    },
  ],
  keyPoints: [
    'Copilot Chat on GitHub.com answers questions and starts cloud tasks; the Copilot app directs parallel agent sessions and automations; Copilot CLI is the terminal agent with interactive and programmatic modes.',
    'Resume with copilot --continue or --resume (or /resume), rename with /rename, archive or delete from Manage sessions or /session commands; cloud agent sessions can be stopped and archived but not deleted.',
    'Cloud sandbox sessions move between clients (app, mobile, GitHub.com, CLI) with their history intact.',
    'Select an agent via the agent dropdown on GitHub.com, the agent picker or /agent in the app and CLI, or by assigning Copilot, a third-party agent or an agent app to an issue.',
    '@ mentions attach discussions, extensions, files, issues, pull requests and repositories on GitHub.com; CLI uses @path and #number; the app uses # for issues and @ for files.',
    '/explain, /fix and /tests are IDE commands; /doc is Visual Studio and Xcode; /clear and /delete manage conversations; /chronicle gives standup, tips, cost-tips, search, improve and reindex.',
    'Session data from CLI and the app syncs to your account by default (policy-controlled), enabling /chronicle and natural-language questions about past work.',
  ],
  flashcards: [
    { front: 'Which surface is built on Copilot CLI and designed for running multiple agent sessions in parallel?', back: 'The GitHub Copilot app (desktop), available on all Copilot plans; Business and Enterprise need the Copilot app policy enabled.' },
    { front: 'How do you resume your most recent Copilot CLI session from the command line?', back: 'copilot --continue (or copilot --resume to pick from a list, or --resume SESSION-ID).' },
    { front: 'How do you rename the current Copilot CLI session?', back: '/rename NEW_NAME (an alias for /session rename).' },
    { front: 'Can a Copilot cloud agent session be deleted?', back: 'No. Cloud agent sessions can be stopped and archived, but only local sessions (CLI, app, IDE) can be deleted.' },
    { front: 'What can you attach with @ in Copilot Chat on GitHub.com?', back: 'Discussions, Extensions, Files, Issues, Pull requests and Repositories.' },
    { front: 'In Copilot CLI, how do you attach a file and reference an issue?', back: '@path for a repository file, #number for an issue or pull request.' },
    { front: 'Which slash command deletes a conversation on GitHub.com?', back: '/delete (while /clear clears the conversation and /new starts a new one).' },
    { front: 'List the /chronicle subcommands.', back: 'standup, tips, cost-tips, search, improve, reindex.' },
    { front: 'Three ways to use a custom agent in Copilot CLI?', back: '/agent picker, naming it in the prompt (or inference from its description), or copilot --agent NAME --prompt "...".' },
    { front: 'Which IDE slash command adds documentation for a symbol?', back: '/doc (Visual Studio and Xcode).' },
  ],
  quiz: [
    {
      question:
        'A business analyst wants to give Copilot a weekly, multi-step research task that should continue while her laptop is closed and that she can check from her phone. Which setup fits best?',
      options: [
        'A conversation in Copilot Chat on GitHub.com using a lightweight model',
        'A Copilot CLI interactive session on her laptop in Interactive mode',
        'A cloud sandbox session started from the Copilot app, followed from GitHub Mobile',
        'A /chronicle standup each Friday',
      ],
      correct: [2],
      explanation:
        'Cloud sandbox sessions run on GitHub infrastructure and can be followed and steered from any client. Chat is for quick answers, a local CLI session stops with the laptop, and /chronicle reports on past work rather than performing it.',
    },
    {
      question:
        'A project manager has a Copilot CLI session she returns to every day and wants to find it quickly in the session picker. What should she do?',
      options: [
        'Run /chronicle reindex to move it to the top',
        'Run /rename Weekly release coordination to give it a recognisable name',
        'Run /session delete-all so only that session remains',
        'Start a new session each day and paste the old transcript',
      ],
      correct: [1],
      explanation:
        'The session name appears in the --resume and /resume lists, so renaming makes it easy to find. Reindex rebuilds the store, delete-all destroys other sessions, and re-pasting transcripts wastes tokens.',
    },
    {
      question:
        'Which TWO of the following correctly match a slash command to its behaviour? (Select two)',
      options: [
        '/delete on GitHub.com deletes a conversation',
        '/tests in an IDE generates unit tests for the selected code',
        '/explain archives the current session',
        '/doc renames the current conversation',
      ],
      correct: [0, 1],
      explanation:
        '/delete removes a GitHub.com conversation and /tests generates tests. /explain explains code and /doc adds documentation; neither archives or renames.',
    },
    {
      question:
        'An operations lead wants Copilot to work on an issue using the team\'s "release-notes-writer" custom agent and open a pull request. What is the MOST direct way to do this on GitHub.com?',
      options: [
        'Paste the agent profile into the issue description and assign a colleague',
        'Assign the issue to Copilot and choose the custom agent from the dropdown',
        'Create a wiki page describing the agent',
        'Run /chronicle improve from the CLI',
      ],
      correct: [1],
      explanation:
        'Assigning Copilot to an issue starts a cloud agent session, and the dropdown lets you select a custom agent. The other options do not start an agent on the issue.',
    },
    {
      question:
        'A Copilot CLI user asks Copilot to attach a spreadsheet of vendor data stored in the repository and summarise it. Which syntax attaches the file?',
      options: [
        '#data/vendors.csv',
        '@data/vendors.csv',
        '/attach data/vendors.csv',
        '$data/vendors.csv',
      ],
      correct: [1],
      explanation:
        'In Copilot CLI, @path attaches a repository file; #number references an issue or pull request. The other forms are not CLI syntax for attaching files.',
    },
  ],
  statements: [
    { text: 'The GitHub Copilot app and the Copilot CLI are governed by the same organisation policy.', isTrue: false, explanation: 'The Copilot app policy is enabled by default and is separate from the Copilot CLI policy.' },
    { text: 'Copilot CLI sessions sync to your GitHub account by default so you can query them later.', isTrue: true, explanation: 'Syncing is on by default, subject to the "Store local sessions in the Cloud" policy for Business and Enterprise users.' },
    { text: 'Cloud agent sessions started on GitHub can be deleted from the sessions list.', isTrue: false, explanation: 'They can be archived but not deleted; only local sessions can be deleted.' },
    { text: 'Typing @ in Copilot Chat on GitHub.com lets you attach issues and pull requests as context.', isTrue: true, explanation: 'Discussions, extensions, files, issues, pull requests and repositories are all attachable.' },
    { text: '/chronicle standup summarises the last day of your Copilot CLI and app work.', isTrue: true, explanation: 'It groups work by completion status and checks linked pull requests.' },
    { text: 'Selecting a custom agent for a session is identical to the main agent delegating a subtask to that agent.', isTrue: false, explanation: 'They are different ways of using a profile; a subagent runs in its own context and, in the CLI, does not read repository instructions by default.' },
  ],
  resources: [
    { label: 'GitHub Copilot Chat cheat sheet', url: 'https://docs.github.com/en/copilot/reference/chat-cheat-sheet' },
    { label: 'Slash commands for the GitHub Copilot app', url: 'https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands' },
    { label: 'Using GitHub Copilot CLI session data (/chronicle)', url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/chronicle' },
    { label: 'Managing agent sessions', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents' },
  ],
};
