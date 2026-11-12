import type { Concept } from '../../types';

export const agentModeEditsAndMcp: Concept = {
  id: 'agent-mode-edits-and-mcp',
  title: 'Agent Mode, Copilot Edits, MCP, Agent Sessions and Subagents',
  summary:
    'From single-file suggestions to delegated work: how edit mode, agent mode, plan mode and the cloud coding agent differ, how MCP servers extend what an agent can do, how to manage and steer agent sessions, and when to hand a subtask to a subagent to protect your context window.',
  certs: ['gh-300', 'gh-700'],
  domains: ['gh-300-2', 'gh-700-1'],
  outcomes: ['gh-300-2-1-2', 'gh-300-2-3-1', 'gh-700-1-1-11'],
  tags: ['agent-mode', 'copilot-edits', 'mcp', 'coding-agent', 'cloud-agent', 'subagents', 'agent-sessions', 'plan-mode'],
  difficulty: 'intermediate',
  diagram: 'agentic-sdlc',
  sections: [
    {
      heading: 'A ladder of autonomy: Ask, Edit, Plan, Agent, cloud agent',
      body: `Copilot offers several ways to change code, and the exam expects you to pick the right rung for a scenario.

- **Ask mode** answers questions and proposes code but changes nothing. You copy or insert.
- **Edit mode (Copilot Edits)** makes controlled, multi-file edits from a single prompt. You define a **working set** of files, Copilot proposes changes, and you accept or discard them per file after each turn. Best for quick, specific updates to a known set of files and when you want full control over how many model requests are used. Available in VS Code and JetBrains.
- **Plan mode** researches the task with read-only tools, asks clarifying questions and produces a structured implementation plan. Nothing is changed until you approve; then you click *Start Implementation* (hand off to agent mode) or *Open in Editor* to keep the plan as Markdown.
- **Agent mode** takes a high-level task, decides which files to change, edits them, runs terminal commands (asking for approval by default), reads the results and iterates until done. Use it when the task is complex, multi-step, needs error handling, or must integrate with external systems through MCP. You can steer mid-task with follow-up prompts, approve or reject each command, and undo streamed edits. If *Agent* is missing from the picker, an organisation policy disabled it.
- **Copilot cloud agent** (the *coding agent* on GitHub.com) works asynchronously in a GitHub-hosted environment. Assign it an issue, @mention \`@copilot\` on a pull request, or start a task from github.com/copilot, the Agents tab, the CLI (\`/delegate\`) or VS Code. It researches the repository, plans, edits on a \`copilot/\` branch, runs tests and linters in its own ephemeral environment, and opens a **draft pull request** that a human must review and merge. Sessions run in a cloud sandbox (resumable across clients) or on GitHub Actions (59-minute maximum, single repository).

Each agent-mode prompt consumes AI credits; edit mode gives you tighter control over that spend.`,
    },
    {
      heading: 'Model Context Protocol: giving agents tools',
      body: `**MCP** is an open standard for connecting LLM applications to tools and data. An MCP *server* exposes tools (and sometimes resources and prompts); the Copilot client calls them when the model decides they are relevant. MCP works across all major Copilot surfaces: IDEs, the CLI, the Copilot app, the cloud agent and code review.

Why it matters for the exam: agent mode's power comes from its tools. Without MCP the agent can read and edit the workspace and run commands. With MCP it can also query an issue tracker, read documentation, drive a browser (Playwright), or act on GitHub.com (the **GitHub MCP server**, built into the CLI and configured by default for the cloud agent alongside Playwright).

When to recommend an MCP server:
- The task needs **live external context** the model cannot know (a ticket's acceptance criteria, an incident record, a service catalogue).
- The agent must **take an action in another system** (create a branch, update an issue, run a database query) rather than only produce text.
- You want the integration **reused across surfaces** without copying content into prompts.

When *not* to: for standing guidance about how to work (use custom instructions), for reusable task prompts (prompt files), or for bundled procedures (skills). MCP adds connections; it does not replace instructions.

Configuration differs by surface: \`mcp.json\` in the IDE (location varies), \`copilot mcp add\` or \`~/.copilot/mcp-config.json\` in the CLI, and **repository settings on GitHub.com** for the cloud agent and code review (the same configuration serves both; code review only uses tools annotated read-only). Governance: the **MCP servers in Copilot** policy is disabled by default for Business and Enterprise seats; enterprises can restrict servers to an MCP registry; the cloud agent calls configured tools autonomously, so allow-list only the tools a task needs and prefer read-only ones.`,
    },
    {
      heading: 'Managing agent sessions',
      body: `An **agent session** is the conversation plus activity of a delegated task: prompts, responses, tool calls, file changes, and state such as the working directory and permission mode. GitHub exposes sessions in several places:

- **Agents tab or panel** in a repository and the **Copilot home page** (github.com/copilot) list sessions you started or that others asked Copilot to work on. Clicking one opens the **session log**, which shows the agent's reasoning, every tool used, token usage and duration.
- **Steer** a running session by typing a follow-up under the log; Copilot applies it after its current tool call. Each steering message consumes credits.
- **Stop** a session to end the run while preserving pushed commits; **archive** stopped sessions to tidy the list (cloud agent sessions can be archived but not deleted).
- **Trace** work: agent commits are authored by Copilot with the requesting developer as co-author, are signed ("Verified"), and the commit message links to the session log.
- **Continue elsewhere**: cloud-sandbox sessions move between GitHub.com, GitHub Mobile, the Copilot app, VS Code and the CLI; you can *Open in VS Code* or *Continue in Copilot CLI* from the Agents tab.
- **Query history** in natural language ("what did I work on last week?") across synced sessions, subject to the *Store local sessions in the cloud* policy.

In VS Code the **Agents window** does the same for local parallel sessions. Sharing defaults differ: GitHub Actions-based cloud sessions are shared with anyone who has repository access; local and sandbox sessions are private unless you share them.`,
    },
    {
      heading: 'Subagents and optimised context usage',
      body: `Every message, response, tool call and result lands in the **context window**, which has a fixed token budget. Long agent tasks fill it with build logs, file contents and search results that are only relevant for a moment. Two mechanisms keep the main conversation focused:

**Compaction** summarises old history when the window nears its limit (automatic in the CLI and Copilot app; manual with \`/compact\` or the IDE's compact action). Detail is lost, so it is a safety net rather than a strategy.

**Subagents** are the strategy. A subagent is a separate agent that runs a delegated subtask in its **own context window** and returns only the result. In the IDE you enable the \`runSubagent\` tool (VS Code) or the *Enable subagents* setting (JetBrains, Xcode, Eclipse; not Visual Studio), then let Copilot delegate automatically, name an agent ("Use the testing subagent to write unit tests for the auth module"), or call \`#runSubagent\`. Subagents use the same tools and model as the main session and cannot spawn their own subagents.

The CLI and Copilot app ship **built-in agents** the main agent delegates to: *explore* (codebase questions without polluting main context), *task* (run tests and builds, report briefly), *general-purpose*, *code-review*, *research*, *rubber-duck* and *security-review*. \`/fleet\` asks the orchestrator to split a prompt into independent subtasks and run them in parallel. You can also define **custom agents**: Markdown profiles with YAML front matter that set instructions, allowed tools and, in some environments, MCP servers, stored in \`.github/agents/\`, \`~/.copilot/agents/\` or the organisation's \`.github-private\` repository.

Trade-offs to remember: delegation costs more model interactions (and credits), parallelism only helps when subtasks are independent, and a subagent does not inherit repository instructions by default in the CLI unless you opt in.`,
    },
  ],
  examples: [
    {
      title: 'Edit mode versus agent mode for a rename',
      description:
        'A developer must rename `fetchUser` to `getUser` across six known files and nothing else. Edit mode with those six files in the working set does exactly that, lets her accept per file and costs one request. A colleague instead uses agent mode for "migrate the service from REST to gRPC, regenerate the client, and make the tests pass": the agent must discover files, run the code generator, run tests and fix failures, which is what agent mode is for.',
      takeaway: 'Known files and a precise change: edit mode. Unknown scope, commands and iteration: agent mode.',
    },
    {
      title: 'Letting the cloud agent work on an issue',
      description:
        'A maintainer assigns issue #482 ("add rate limiting to /login") to Copilot. The cloud agent starts a session on GitHub Actions, reads the repository instructions, implements the change on a `copilot/` branch, runs the test suite in its ephemeral environment and opens a draft pull request linked to the session log. Workflows do not run until a maintainer clicks "Approve and run workflows"; the maintainer who assigned the issue cannot approve the pull request themselves, and Copilot cannot mark it ready or merge it.',
      takeaway: 'The coding agent produces a reviewable draft under human controls; it never bypasses review, approvals or branch protections.',
    },
    {
      title: 'Adding an MCP server for a ticket system',
      description:
        'A team wants agent mode to read acceptance criteria from their issue tracker while implementing features. They add the tracker\'s MCP server to the IDE configuration and, for the cloud agent and code review, to the repository\'s Copilot settings using a service-account secret rather than personal credentials, allow-listing only the read tools. Prompts can now say "implement PROJ-123 as described in the ticket".',
      language: 'json',
      code: `{
  "servers": {
    "tracker": {
      "type": "http",
      "url": "https://mcp.tracker.example/mcp",
      "headers": { "Authorization": "Bearer \${input:tracker-token}" }
    }
  }
}`,
      takeaway: 'Use MCP when the agent needs live external context or must act in another system; scope credentials and tools to the minimum.',
    },
    {
      title: 'The exhausted context window (a realistic mistake)',
      description:
        'During a long agent session, a developer repeatedly asks the agent to read large log files to diagnose flaky tests. The main context fills, compaction kicks in, and the agent "forgets" an earlier decision about the database fixture, reintroducing a bug it had fixed. The better approach is to delegate the log analysis to a subagent (or the CLI\'s built-in task or explore agent), which returns a short summary, keeping the main context focused on the plan and decisions.',
      takeaway: 'Push noisy, bulky work into subagents so the main agent keeps its decisions in context.',
    },
  ],
  keyPoints: [
    'Ask mode answers; Edit mode makes controlled multi-file edits to a working set you accept per file; Plan mode drafts a plan with read-only tools; Agent mode edits, runs commands and iterates autonomously; the cloud agent works asynchronously on GitHub and opens a draft pull request.',
    'Agent mode is best for complex, multi-step tasks with error handling or external integrations; each prompt consumes AI credits.',
    'MCP is an open standard for connecting agents to tools and data; the GitHub MCP server is built into the CLI and default for the cloud agent (with Playwright).',
    'Recommend an MCP server when the agent needs live external context or must act in another system; use instructions, prompt files or skills for guidance instead.',
    'MCP configuration lives in mcp.json (IDE), the CLI config, or repository settings on GitHub.com (shared by cloud agent and code review); the MCP policy is off by default for Business and Enterprise seats.',
    'Agent sessions are monitored, steered, stopped and archived from the Agents tab or Copilot home; commits are signed, co-authored and link to the session log.',
    'Subagents run delegated subtasks in their own context window and return only results; /fleet parallelises independent subtasks; compaction summarises history when the window fills.',
    'The cloud agent cannot approve or merge its own pull request, pushes only to a single copilot/ branch, and needs a human to approve workflow runs.',
  ],
  flashcards: [
    { front: 'What distinguishes edit mode from agent mode?', back: 'Edit mode edits a working set of files you choose and you accept per file; agent mode decides which files to change, runs commands and iterates autonomously.' },
    { front: 'What does plan mode do before any code changes?', back: 'Researches the task with read-only tools, asks clarifying questions and produces a structured implementation plan you approve.' },
    { front: 'What is MCP?', back: 'Model Context Protocol: an open standard for connecting LLM applications to external tools and data through MCP servers.' },
    { front: 'Which two MCP servers are configured by default for the Copilot cloud agent?', back: 'The GitHub MCP server and the Playwright MCP server.' },
    { front: 'Where do you configure MCP servers for the cloud agent and Copilot code review?', back: 'In the repository\'s Copilot settings on GitHub.com; one configuration applies to both.' },
    { front: 'What is a subagent?', back: 'A separate agent that performs a delegated subtask in its own context window and returns the result to the main session; it cannot spawn further subagents.' },
    { front: 'How do you enable subagents in VS Code?', back: 'Enable the runSubagent tool in the chat tools picker (and list it in the tools front matter of custom agents or prompt files).' },
    { front: 'What does the /fleet command do?', back: 'Asks the main agent to split a task into independent subtasks and run them in parallel subagents, at the cost of more model interactions.' },
    { front: 'Where can you monitor and steer a cloud agent session?', back: 'The Agents tab or panel in the repository, or the Copilot home page at github.com/copilot; type a follow-up under the session log to steer.' },
    { front: 'What happens when an agent session\'s context window nears its limit?', back: 'Compaction summarises older history into a structured summary, losing fine detail; it cannot be reversed.' },
    { front: 'Can the Copilot cloud agent merge the pull request it created?', back: 'No. It opens a draft pull request that a human must review and merge; it cannot approve, mark ready or merge.' },
    { front: 'The Agent option is missing in the IDE chat mode picker on an organisation seat. Why?', back: 'An organisation or enterprise administrator has disabled agent mode for the IDE by policy.' },
  ],
  quiz: [
    {
      question:
        'A developer needs to update the copyright header in exactly eight files they can name, and wants to approve each file\'s change individually with minimal AI credit usage. Which mode is MOST appropriate?',
      options: ['Ask mode', 'Edit mode with the eight files in the working set', 'Agent mode', 'Assign the task to the Copilot cloud agent'],
      correct: [1],
      explanation:
        'Edit mode is designed for quick, specific updates to a defined set of files with per-file acceptance and control over request count. Ask mode changes nothing; agent mode and the cloud agent are for open-ended, multi-step work.',
    },
    {
      question:
        'A team wants Copilot agent mode to read acceptance criteria directly from their issue tracker while implementing features, without pasting tickets into prompts. What should they configure?',
      options: [
        'A path-specific custom instructions file describing the tracker',
        'An MCP server for the issue tracker',
        'A prompt file that includes the ticket text',
        'Content exclusions for the tracker export files',
      ],
      correct: [1],
      explanation:
        'Live external context and actions in another system are exactly what MCP servers provide. Instructions and prompt files hold static text, and content exclusions hide files rather than fetch data.',
    },
    {
      question:
        'During a long agent-mode session, Copilot begins contradicting decisions it made earlier after analysing several large log files. Which TWO actions address the root cause? (Select two)',
      options: [
        'Delegate bulky analysis such as log inspection to a subagent with its own context window',
        'Switch the public-code filter from Allow to Block',
        'Start a fresh session for the new phase of work, or compact the conversation proactively before it fills',
        'Disable MCP servers in the organisation policy',
      ],
      correct: [0, 2],
      explanation:
        'The symptom is context-window exhaustion followed by lossy compaction. Subagents keep noise out of the main context, and new or proactively compacted sessions keep decisions available. The public-code filter and MCP policy are unrelated.',
    },
    {
      question: 'Which statement about Copilot cloud agent (coding agent) pull requests is correct?',
      options: [
        'The agent marks its pull request ready for review and merges it when tests pass',
        'Commits are authored by Copilot, co-authored by the requesting developer, signed, and link to the session log; a human must review and merge',
        'The agent can push to any branch, including the default branch',
        'GitHub Actions workflows always run immediately on the agent\'s pull request',
      ],
      correct: [1],
      explanation:
        'Attribution, signing and session links are documented. The agent pushes only to a single copilot/ (or existing PR) branch, cannot approve or merge, and workflows wait for a human with write access to approve them.',
    },
    {
      question:
        'An organisation owner on Copilot Business asks why developers cannot use MCP servers in their IDE even though the servers are configured locally. What is the MOST likely cause?',
      options: [
        'MCP requires Copilot Enterprise',
        'The "MCP servers in Copilot" organisation policy is disabled, which is the default',
        'MCP only works in the Copilot CLI',
        'The developers have not enabled agent mode in their personal GitHub settings',
      ],
      correct: [1],
      explanation:
        'The MCP policy governs Business and Enterprise seats and is disabled until an administrator enables it. MCP is available on Business and across IDEs, CLI and GitHub.com; agent mode is not a personal GitHub setting.',
    },
    {
      question:
        'A developer wants to inspect why a cloud agent session made a particular change and redirect it to use an existing utility class without stopping the run. Where should they go?',
      options: [
        'The repository\'s Actions tab, to cancel the workflow',
        'The session log in the Agents tab or Copilot home page, then type a steering prompt below the log',
        'The organisation audit log',
        'The pull request "Files changed" tab, which allows editing the agent\'s plan',
      ],
      correct: [1],
      explanation:
        'Session logs show reasoning and tool calls, and the prompt box beneath them steers the agent mid-session. Cancelling the workflow stops the task, the audit log records events rather than steering, and the diff view does not control the agent.',
    },
  ],
  statements: [
    { text: 'In agent mode, Copilot runs terminal commands without any approval by default.', isTrue: false, explanation: 'By default you approve commands before they run; administrators or your settings can allow some commands to run automatically.' },
    { text: 'Subagents have their own context window separate from the main agent.', isTrue: true, explanation: 'That isolation is the main reason to delegate noisy or bulky subtasks.' },
    { text: 'Subagents can create further subagents.', isTrue: false, explanation: 'The documentation states subagents cannot create other subagents.' },
    { text: 'Repository-level MCP configuration on GitHub.com applies to both the cloud agent and Copilot code review.', isTrue: true, explanation: 'One configuration serves both, and a separate setting can disable MCP tool use for code review.' },
    { text: 'Plan mode makes code changes as soon as it finishes researching.', isTrue: false, explanation: 'The plan agent makes no changes until you review the plan and choose to start implementation.' },
    { text: 'Cloud agent sessions running on GitHub Actions have a maximum execution time of 59 minutes.', isTrue: true, explanation: 'The limit cannot be extended; sandbox sessions do not share this constraint.' },
    { text: 'Using /fleet always reduces AI credit consumption because tasks finish faster.', isTrue: false, explanation: 'Parallel subagents each interact with the model, so credit usage can increase; the benefit is speed on independent subtasks.' },
  ],
  resources: [
    { label: 'Using agent mode in your IDE', url: 'https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode' },
    { label: 'Model Context Protocol (MCP) for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/customizations/mcp' },
    { label: 'Using subagents in your IDE', url: 'https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-subagents' },
    { label: 'Managing agent sessions', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents' },
  ],
};
