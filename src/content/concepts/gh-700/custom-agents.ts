import type { Concept } from '../../types';

export const customAgents: Concept = {
  id: 'custom-agents',
  title: 'Creating and Managing Custom Agents for Business Work',
  summary:
    'How to define a custom agent profile with instructions and tools (including web search), where to save it so a project or the whole organisation can use it, how to add guardrails that limit what it can do, and how to review what it actually did.',
  certs: ['gh-700', 'gh-600'],
  domains: ['gh-700-2', 'gh-600-2'],
  outcomes: ['gh-700-2-3-1', 'gh-700-2-3-2', 'gh-700-2-3-3', 'gh-700-2-3-4', 'gh-600-2-1-3'],
  tags: ['custom-agents', 'agent-profile', 'tools', 'guardrails', 'session-logs'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'What a custom agent is and how to create one',
      body: `A **custom agent** is a reusable specialist role for Copilot: a Markdown file with YAML frontmatter (an **agent profile**, usually \`NAME.agent.md\`) that describes the agent's purpose, gives it instructions and can restrict its tools. Define the role once instead of repeating the same instructions every session. Use one when you need a *particular approach and toolset*; if you only need task instructions, a skill is simpler.

Frontmatter properties that matter on the exam: \`description\` (required; tells Copilot when to pick the agent), optional \`name\`, \`tools\` (list of tool names or aliases; omit for all tools, \`[]\` for none), \`model\`, \`mcp-servers\` (servers only this agent uses), \`disable-model-invocation\` (true means it must be chosen manually) and \`user-invocable\`. The Markdown body is the agent's prompt, up to 30,000 characters.

Ways to create one:

- **GitHub.com**: on the Agents tab choose the repository, click **Create an agent**; a template \`my-agent.agent.md\` opens in \`.github/agents\`. Commit it to the default branch and it appears in the agent dropdown.
- **Copilot CLI**: type \`/agent\`, press **N**, pick Project (\`.github/agents/\`) or User (\`~/.copilot/agents/\`), then either describe the agent in plain language and let Copilot write the profile, or fill in name, description, instructions and tools yourself. Restart or reload to use it.
- **Copilot app**: profiles from your repositories and CLI are available automatically; pick them from the agent picker or \`/agent\`.

Adding **web search**: in Copilot CLI and VS Code the \`web\` tool alias (WebSearch, WebFetch) lets a profile fetch and search the web, and the body can instruct the agent to verify facts against public sources or to run the built-in \`/research\` agent. Copilot in the cloud does not currently map the \`web\` alias, so for cloud sessions use an MCP server or connector that provides search, or ask the agent to use the research workflow.`,
    },
    {
      heading: 'Saving an agent to a project, organisation or yourself',
      body: `Where the profile lives decides who can use it and which one wins:

| Level | Location | Scope |
|---|---|---|
| User (personal) | \`~/.copilot/agents/\` | All your local projects in Copilot CLI and the app |
| Repository (project) | \`.github/agents/\` in the repository | Everyone working in that repository, on GitHub.com, in the CLI, the app and IDEs |
| Organisation | \`/agents\` in the organisation's \`.github\` or \`.github-private\` repository | All repositories in the organisation |
| Enterprise | \`/agents\` in the \`.github-private\` repository of a designated organisation | All organisations in the enterprise |

When two profiles share an ID (the file name without \`.agent.md\`), the more local one wins: user over repository over organisation over enterprise.

Saving to the **project repository** is the collaborative choice: the profile is versioned, reviewed through pull requests, picked up by Copilot cloud agent when someone assigns an issue, and available in automations and agentic workflows. Saving **personally** is for your own experiments. Note two "project" homonyms: GitHub **Projects** boards do not store agents, and the Copilot app's **Projects** coordinate sessions and keep supporting material in a Library but still read agent profiles from repositories and your CLI configuration. For reuse across many repositories, bundle agents with skills and MCP configuration into a **plugin**.`,
    },
    {
      heading: 'Implementing agent guardrails',
      body: `Guardrails make an agent safe to hand real work to. Layer them:

1. **Restrict tools in the profile.** A reviewer that only needs \`read\` and \`search\` cannot edit files or run commands. Grant MCP tools selectively with \`server/tool\` or \`server/*\`; \`tools: []\` disables everything. In the CLI, \`strict-tools-list: true\` stops default tools from being added back.
2. **Write explicit boundaries in the prompt**: scope ("only files under /docs"), forbidden actions ("never close issues; suggest instead"), output format and a stopping condition.
3. **Control invocation**: \`disable-model-invocation: true\` prevents the cloud agent from choosing the profile automatically; \`user-invocable: false\` hides it from manual selection for programmatic use only.
4. **Keep repository conventions in force**: for subagents in the CLI add \`include-custom-instructions: true\`, otherwise the specialist ignores \`copilot-instructions.md\`.
5. **Surface controls still apply**: session mode and tool permissions (Ask every time, Assisted, Approve all), local or cloud sandboxes, content exclusion, the cloud agent's firewall and read-only GitHub token, rulesets requiring review, and hooks that check a tool call before it runs.
6. **Pin a model** with \`model\` when a task needs a specific capability or cost profile; \`model-policy: required\` makes it mandatory rather than preferred.

Remember that Copilot cloud agent uses configured MCP tools autonomously without asking, so for delegated work the profile's tool list *is* the approval step.`,
    },
    {
      heading: 'Reviewing custom agent activities',
      body: `Review is where accountability lives. Evidence trails by surface:

- **Session logs** on GitHub (Agents tab, agents panel, or github.com/copilot) show the agent's reasoning, the tools it used, token usage and session length. Copilot cloud agent sessions are visible to everyone with repository access; local sessions are private unless you share them.
- **Pull request description**: when Copilot opens a pull request it notes which custom agent completed the work.
- **Commits** are authored by Copilot with the requester as co-author, are signed ("Verified"), and link back to the session log, so a reviewer or auditor can trace why a change happened.
- **Audit log** events are available to administrators.
- **Copilot CLI and the app**: \`/chronicle search\`, natural-language questions about past sessions ("show sessions where I had to correct the agent"), \`/share\` to export a transcript, and \`/session info\`.
- **Automations**: the Automations pane lists runs, AI credits consumed and revision history; the approvals panel on an issue shows every suggested change with rationale and confidence.

Review the output like any colleague's work: read the diff, run or request the checks, and use the thumbs up or down on Copilot pull requests to feed back quality. If the agent repeatedly needs correction, \`/chronicle improve\` suggests instruction changes, and you can tighten the profile's tools or prompt.`,
    },
  ],
  examples: [
    {
      title: 'A vendor-research agent with web search for a procurement team',
      description:
        'A procurement analyst creates a repository-level agent that compares supplier options against the team\'s evaluation criteria. In Copilot CLI and VS Code it can search the web; it may read the repository but not edit it, and it must cite sources and flag uncertainty.',
      language: 'markdown',
      code: `---
name: vendor-researcher
description: Compares supplier options against procurement criteria using public sources. Use when asked to research, compare or shortlist vendors.
tools: ["read", "search", "web"]
---
You research vendors for a procurement team.
- Use the criteria in /procurement/criteria.md and the web tool to gather current facts.
- Produce a table: Vendor | Criterion scores (1-5) | Evidence link | Open questions.
- Cite a source for every factual claim; say "unverified" when you cannot.
- Never create issues or edit files. Stop when the table and a 100-word recommendation are complete.`,
      takeaway: 'Web search comes from the web tool alias plus instructions on how to use it; the tools list is also the guardrail.',
    },
    {
      title: 'The personal agent nobody else could use (a realistic mistake)',
      description:
        'A program manager builds an excellent "status-reporter" agent in ~/.copilot/agents and then assigns an issue to Copilot on GitHub.com expecting it to appear in the dropdown. It does not: personal agents are local to her machine. The fix is to move the profile to .github/agents in the repository (or the organisation\'s .github repository for cross-repository use) and merge it to the default branch.',
      takeaway: 'Save agents to the project repository when the team, Copilot cloud agent or automations need them.',
    },
    {
      title: 'Auditing what the triage agent did last night',
      description:
        'A support lead wakes up to twelve relabelled issues. She opens the Agents tab, filters All sessions for the triage automation, reads a session log to see the rationale and tools used, then checks the approvals panel on the two issues where confidence was low. Finding the agent kept applying a retired label, she adds "do not use label legacy-ui" to the agent profile and asks the automation to suggest rather than apply label changes for a week.',
      takeaway: 'Session logs, rationale and confidence metadata and revision history are the review surface for agent activity.',
    },
  ],
  keyPoints: [
    'A custom agent is an .agent.md profile: YAML frontmatter (description required; tools, model, mcp-servers, disable-model-invocation, user-invocable) plus a Markdown prompt of up to 30,000 characters.',
    'Create agents from the Agents tab on GitHub.com (Create an agent), with /agent then N in Copilot CLI, or by writing the file; the Copilot app reads repository and CLI agents automatically.',
    'Web search is provided through the web tool alias (WebSearch, WebFetch) in CLI and VS Code; Copilot in the cloud does not map it, so use MCP, connectors or the research agent there.',
    'Save to .github/agents for the project, ~/.copilot/agents for yourself, or /agents in the organisation .github(-private) repository; local definitions override broader ones with the same ID.',
    'Guardrails: restrict tools (tools: [] disables all), write explicit boundaries and a stopping condition, control invocation flags, keep instructions in force for subagents, and rely on surface controls such as permissions, sandboxes and rulesets.',
    'Copilot cloud agent calls configured MCP tools autonomously, so the profile\'s tool list acts as the approval boundary.',
    'Review activities through session logs, pull request descriptions naming the agent, signed co-authored commits linking to logs, audit logs, /chronicle and the automations revision history.',
  ],
  flashcards: [
    { front: 'Which frontmatter property is required in a custom agent profile?', back: 'description; it tells Copilot what the agent does and when to use it.' },
    { front: 'How do you give a custom agent all tools, and how do you give it none?', back: 'Omit tools (or tools: ["*"]) for all; tools: [] for none.' },
    { front: 'Which tool alias enables web search and fetching in a custom agent, and where does it work?', back: 'web (WebSearch, WebFetch); it works in Copilot CLI and VS Code but is not currently mapped for Copilot in the cloud.' },
    { front: 'Where do you save an agent so everyone in one repository can use it?', back: 'In .github/agents/ in that repository, merged to the default branch.' },
    { front: 'Where are organisation-level custom agents stored?', back: 'In the /agents directory of the organisation\'s .github or .github-private repository.' },
    { front: 'If a personal and a repository agent share an ID, which is used?', back: 'The personal (user-level) agent; more local definitions override broader ones.' },
    { front: 'What does disable-model-invocation: true do?', back: 'Prevents Copilot in the cloud from selecting the agent automatically; it must be chosen manually.' },
    { front: 'Why add include-custom-instructions: true to a CLI custom agent?', back: 'So the agent still follows repository custom instructions when it runs as a subagent (subagents skip them by default).' },
    { front: 'How can a reviewer tell which custom agent produced a pull request?', back: 'Copilot notes the custom agent in the pull request description; commits also link to the session log.' },
    { front: 'How do you create a custom agent interactively in Copilot CLI?', back: 'Type /agent, press N, choose Project or User location, then describe the agent for Copilot to write or fill in the fields manually.' },
  ],
  quiz: [
    {
      question:
        'A procurement analyst wants a custom agent that can look up current supplier information on the public web when she runs it in Copilot CLI, but must never modify repository files. Which tools list is MOST appropriate?',
      options: [
        'tools: ["*"]',
        'tools: ["read", "search", "web"]',
        'tools: ["edit", "execute"]',
        'tools: []',
      ],
      correct: [1],
      explanation:
        'read and search allow research in the repository, web adds search and fetch, and omitting edit and execute prevents changes. All tools or edit/execute violate the constraint, and an empty list removes web access too.',
    },
    {
      question:
        'A program manager created a custom agent on her laptop in ~/.copilot/agents. Her teammates cannot select it when assigning issues to Copilot on GitHub.com. What should she do?',
      options: [
        'Ask teammates to install Copilot CLI',
        'Commit the profile to .github/agents in the repository and merge it to the default branch',
        'Set user-invocable: true in the profile',
        'Rename the file to agent.md',
      ],
      correct: [1],
      explanation:
        'Personal agents are local to one user. Repository-level agents in .github/agents are available to the whole team and to Copilot cloud agent. The other options do not publish the agent.',
    },
    {
      question:
        'Which TWO guardrails directly limit what a custom agent can do when Copilot cloud agent runs it autonomously? (Select two)',
      options: [
        'Restricting the tools property to the minimum needed, including specific MCP tools',
        'Writing explicit boundaries and a stopping condition in the agent prompt',
        'Choosing a model with a larger context window',
        'Renaming the agent to include the word "safe"',
      ],
      correct: [0, 1],
      explanation:
        'Tool restrictions and explicit instructions are the profile-level guardrails. Context window size and naming have no effect on permitted actions.',
    },
    {
      question:
        'An auditor asks why a particular change was made to the pricing document by an agent last month. What is the MOST reliable way to find out?',
      options: [
        'Ask the agent to remember what it did',
        'Open the commit, follow the session log link in the commit message, and read the reasoning and tools used',
        'Check the repository wiki',
        'Re-run the automation and compare results',
      ],
      correct: [1],
      explanation:
        'Copilot\'s commits are signed, co-authored and link to the session log, which records reasoning and tool use. Agents do not retain reliable memory of past sessions for audit, wikis are not activity records, and re-running does not explain the original change.',
    },
    {
      question:
        'You want a custom agent to be available only when a person deliberately selects it, never chosen automatically by Copilot cloud agent based on task context. Which setting achieves this?',
      options: [
        'user-invocable: false',
        'disable-model-invocation: true',
        'tools: []',
        'target: vscode',
      ],
      correct: [1],
      explanation:
        'disable-model-invocation: true stops automatic selection while allowing manual choice. user-invocable: false does the opposite (hides it from manual selection), an empty tools list removes capabilities, and target limits the environment rather than invocation.',
    },
  ],
  statements: [
    { text: 'A custom agent profile is a Markdown file with YAML frontmatter.', isTrue: true, explanation: 'The frontmatter configures name, description, tools and more; the body is the prompt.' },
    { text: 'If the tools property is omitted, the custom agent has no tools.', isTrue: false, explanation: 'Omitting tools gives the agent access to all available tools; tools: [] disables them.' },
    { text: 'The web tool alias is currently not applicable for Copilot in the cloud.', isTrue: true, explanation: 'The custom agents configuration reference lists web as not applicable for cloud agent mappings.' },
    { text: 'Organisation-level custom agents live in the /agents folder of the organisation\'s .github or .github-private repository.', isTrue: true, explanation: 'Enterprise-level agents use the .github-private repository of a designated organisation.' },
    { text: 'Copilot cloud agent asks for approval before each MCP tool call made by a custom agent.', isTrue: false, explanation: 'When delegated work via assignment or @mention, the cloud agent uses configured MCP tools autonomously, so restrict the tool list.' },
    { text: 'Local Copilot CLI sessions are shared with repository collaborators by default.', isTrue: false, explanation: 'Local sessions are unshared by default; cloud sessions on GitHub Actions are shared by default.' },
  ],
  resources: [
    { label: 'Custom agents (concept)', url: 'https://docs.github.com/en/copilot/concepts/customizations/custom-agents' },
    { label: 'Creating custom agents for Copilot cloud agent', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/create-custom-agents' },
    { label: 'Creating and using custom agents for GitHub Copilot CLI', url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli' },
    { label: 'Custom agents configuration reference', url: 'https://docs.github.com/en/copilot/reference/custom-agents-configuration' },
  ],
};
