import type { Concept } from '../../types';

export const skillsAndMcpInWorkflows: Concept = {
  id: 'skills-and-mcp-in-workflows',
  title: 'Integrating Skills and MCP Servers into Agentic Workflows',
  summary:
    'Installing skills others have published, authoring your own SKILL.md, calling skills explicitly or letting Copilot pick them, and connecting agentic workflows, automations and cloud agent sessions to MCP servers so agents work with richer, live context.',
  certs: ['gh-700', 'gh-600'],
  domains: ['gh-700-3', 'gh-600-2'],
  outcomes: ['gh-700-3-4-1', 'gh-700-3-4-2', 'gh-700-3-4-3', 'gh-700-3-4-4', 'gh-600-2-2-1'],
  tags: ['skills', 'skill-md', 'mcp', 'connectors', 'agentic-workflows', 'plugins'],
  difficulty: 'intermediate',
  diagram: 'mcp-architecture',
  sections: [
    {
      heading: 'Installing external skills',
      body: `**Agent skills** are folders of instructions, scripts and resources that Copilot loads when relevant. The format is an open specification used by several AI systems, so skills published for other tools often work with Copilot. Trusted sources include GitHub's community collection **github/awesome-copilot** and the **anthropics/skills** repository.

Ways to install:

- **GitHub CLI**: \`gh skill\` searches, installs, updates and publishes skills from GitHub repositories.
- **Copilot CLI**: \`/skills add <FILE | URL | DIRECTORY>\` (add \`--project\` to scope to the repository) or \`copilot skill add\` from the terminal; then \`/skills reload\` and \`/skills info NAME\` to confirm. \`/skills list\`, enable/disable and \`/skills remove\` manage them.
- **Manual**: download the skill folder (unzip if needed) and place it in a supported location.
- **Copilot app**: **Customize > Skills** to browse and manage; skills configured for your repositories or CLI appear automatically.
- **Plugins** bundle skills with agents, hooks and MCP configuration for one-step team-wide installation; enterprises can require or block plugins through managed settings.

Locations decide scope: **project skills** in \`.github/skills\`, \`.claude/skills\` or \`.agents/skills\` of the repository (shared with the team, cloud agent and automations); **personal skills** in \`~/.copilot/skills\` or \`~/.agents/skills\` (your machine; include them in a dotfiles repository under \`.copilot/skills\` for cloud sandboxes). Review any skill before installing it, especially one whose frontmatter pre-approves the shell tool, because a malicious skill or injected instruction could then run commands without confirmation.`,
    },
    {
      heading: 'Creating custom skills',
      body: `A skill is a directory named in lowercase with hyphens, containing a file that must be called **\`SKILL.md\`**:

- **Frontmatter**: \`name\` (required, matches the folder name convention), \`description\` (required; what it does *and when Copilot should use it*), optional \`license\`, optional \`allowed-tools\` to pre-approve tools (use with care).
- **Body**: step-by-step instructions, examples and guidelines; reference supporting files such as \`TEMPLATE.md\` or a script in the same folder. When the skill is invoked, Copilot discovers every file in the folder.

Business-friendly skills look like: a release-notes skill with the team template and a script to gather merged pull requests; a vendor-comparison skill with scoring criteria; an incident-review skill with a timeline template. GitHub's rule for choosing between customisations: **custom instructions** for short guidance relevant to almost every task; **skills** for detailed instructions Copilot should load only when relevant; a **custom agent** when you also need a distinct toolset or persona.

Keep descriptions precise because they drive automatic selection; test by asking "What skills do you have?" and by running a task that should trigger the skill. Store project skills in the repository so changes go through pull requests and are available to Copilot cloud agent, automations and agentic workflows.`,
    },
    {
      heading: 'Calling skills',
      body: `Skills are used in three ways:

1. **Automatically**: Copilot matches the prompt to a skill's description and injects \`SKILL.md\` into context, then follows the instructions and uses any bundled scripts.
2. **Explicitly** by name: include \`/skill-name\` in a prompt, for example \`Use the /release-notes skill for version 3.2\`. In the Copilot app some slash commands *are* skills (\`/orchestrate\`, \`/create-canvas\`, \`/af\`), and in an automation prompt you can type \`/\` to pick an available skill.
3. **From workflows**: in GitHub Agentic Workflows the \`skills:\` frontmatter makes skills available to the run, and \`gh aw init\` installs the **agentic-workflows** skill that authoring agents use (\`/agentic-workflows Create a workflow that ...\`). In Copilot CLI you can schedule a user-invocable skill with \`/every\` or \`/after\`.

Skills complement rather than replace other customisations: a skill can describe *how* to use tools that an MCP server provides, and a plugin can distribute both. If a skill does not fire, check its description, reload with \`/skills reload\`, and confirm the location is supported on the surface you are using (a personal skill on your laptop is not visible to a cloud session unless it is in your dotfiles).`,
    },
    {
      heading: 'Connecting agentic workflows to MCP servers',
      body: `The **Model Context Protocol** gives agents live context and actions from systems outside the repository. How to connect by surface:

- **GitHub Agentic Workflows**: declare servers in frontmatter (\`mcp-servers:\`) or import a shared definition such as \`shared/mcp/support-desk.md\` with \`imports:\`; choose GitHub toolsets under \`tools: github: toolsets: [...]\`. Credentials stay in Actions secrets handled by the compiled workflow, not in the Markdown.
- **Copilot cloud agent and automations**: a repository administrator configures servers in **repository MCP settings**; the configuration also applies to Copilot code review. The **GitHub** server (read-only token scoped to the repository) and **Playwright** (localhost only) are present by default. Automations use only the MCP tools you select for each automation. Secrets for servers are **Agents secrets** prefixed \`COPILOT_MCP_\`; use a service account rather than personal credentials for shared servers.
- **Personal MCP servers and connectors**: at github.com/copilot > Customize you can add servers for your own cloud sessions (key-based auth, \`COPILOT_MCP_\` secrets) or connect **GitHub-verified MCP servers (connectors)** once and reuse them across surfaces; connectors work in cloud sandboxes but not in GitHub Actions-based sessions.
- **Copilot CLI and the app**: \`/mcp add\`, \`~/.copilot/mcp-config.json\`, repository \`.mcp.json\` or \`.github/mcp.json\`, or the app's Customize > MCP page.

Governance: up to 50 servers across personal and repository configurations; only MCP **tools** are supported by cloud agent and code review; the "MCP servers in Copilot" policy is off by default for Business and Enterprise; and because delegated agents call MCP tools without asking, enable only the tools each task needs and remember MCP tools are not limited to the repository.`,
    },
  ],
  examples: [
    {
      title: 'A release-notes skill shared through the repository',
      description:
        'A product manager creates .github/skills/release-notes/ with SKILL.md, TEMPLATE.md and a script that lists merged pull requests since the last tag. The description says "Draft customer-facing release notes in the team template. Use when asked for release notes, changelog or what shipped." From then on, "Use the /release-notes skill for 3.2" in Copilot CLI, the Copilot app, a cloud agent session or a weekly agentic workflow produces the same structure.',
      language: 'markdown',
      code: `---
name: release-notes
description: Draft customer-facing release notes in the team template. Use when asked for release notes, a changelog, or what shipped.
---
1. Run list-merged-prs.sh from this folder to collect pull requests since the last tag.
2. Group them under Features, Fixes, Known issues using TEMPLATE.md.
3. One sentence per item, customer language, no internal ticket IDs.
4. Stop when every merged pull request is listed once.`,
      takeaway: 'A precise description, a template and a script make a skill reusable across every Copilot surface.',
    },
    {
      title: 'The skill that never loaded in the cloud (a realistic mistake)',
      description:
        'An analyst installs a vendor-scoring skill into ~/.copilot/skills and it works in Copilot CLI. When she sets up an agentic workflow to score vendors weekly, the agent ignores the skill, because personal skills on her laptop are invisible to GitHub Actions. The fix is to move the skill into .github/skills in the repository (project scope) and reference it in the workflow.',
      takeaway: 'Scope follows location: project skills are shared with cloud agent, automations and agentic workflows; personal skills are not.',
    },
    {
      title: 'Giving a triage workflow live support-desk context',
      description:
        'A support operations lead wants the triage automation to check whether a reported bug already has open support tickets. The repository administrator configures the support-desk MCP server in repository MCP settings with a service-account token stored as COPILOT_MCP_SUPPORT_TOKEN. In the automation she enables only the search_tickets tool from that server plus the GitHub add-labels tool. The agent now labels issues with the ticket count, and the equivalent agentic workflow imports shared/mcp/support-desk.md.',
      takeaway: 'Admins configure the server, builders select only the tools the task needs, and secrets stay in Agents or Actions secrets.',
    },
  ],
  keyPoints: [
    'Install external skills with gh skill, /skills add (or copilot skill add) in Copilot CLI, the Copilot app Customize page, plugins, or by copying the folder into a supported location; review skills that pre-approve shell tools.',
    'Project skills live in .github/skills (or .claude/skills, .agents/skills) and are shared with the team, cloud agent, automations and agentic workflows; personal skills live in ~/.copilot/skills or ~/.agents/skills.',
    'A skill is a lowercase-hyphen folder with SKILL.md: required name and description frontmatter, optional license and allowed-tools, a Markdown body, plus optional scripts and templates.',
    'Call skills automatically through their description, explicitly with /skill-name in a prompt or automation, via skills: frontmatter in agentic workflows, or by scheduling with /every and /after in the CLI.',
    'Connect agentic workflows to MCP through mcp-servers: frontmatter or imports of shared definitions; cloud agent and automations use repository-level MCP settings configured by administrators.',
    'Secrets for MCP servers are Agents secrets prefixed COPILOT_MCP_ (service accounts for shared servers); connectors are GitHub-verified servers that work across surfaces and in cloud sandboxes, not Actions-based sessions.',
    'Limits and governance: 50 servers total, tools only for cloud agent and code review, MCP policy off by default for Business and Enterprise, MCP tools not limited to the repository.',
  ],
  flashcards: [
    { front: 'Name two community sources of skills GitHub points to.', back: 'github/awesome-copilot and the anthropics/skills repository.' },
    { front: 'Which Copilot CLI commands add and then confirm a new skill?', back: '/skills add <FILE | URL | DIRECTORY> (or copilot skill add), then /skills reload and /skills info NAME.' },
    { front: 'Where do project skills live?', back: 'In .github/skills, .claude/skills or .agents/skills inside the repository.' },
    { front: 'What file name is mandatory inside a skill folder?', back: 'SKILL.md.' },
    { front: 'Which SKILL.md frontmatter field should you treat with caution and why?', back: 'allowed-tools, because pre-approving shell or bash removes the confirmation step and could let a malicious skill run commands.' },
    { front: 'How do you call a skill explicitly in a prompt?', back: 'Include its name with a leading slash, for example "Use the /release-notes skill for 3.2".' },
    { front: 'How does a GitHub Agentic Workflow make skills and MCP servers available?', back: 'Through skills: and mcp-servers: frontmatter fields, or by importing shared definitions with imports:.' },
    { front: 'Who configures MCP servers for Copilot cloud agent and automations, and where?', back: 'A repository administrator, in the repository\'s MCP settings; the configuration also applies to Copilot code review.' },
    { front: 'What prefix must secrets for MCP servers carry?', back: 'COPILOT_MCP_, stored as Agents secrets (repository or organisation level).' },
    { front: 'What is a Copilot connector?', back: 'A GitHub-verified MCP server you connect once and reuse across surfaces; GitHub handles configuration and authentication. Works in cloud sandboxes but not GitHub Actions-based sessions.' },
  ],
  quiz: [
    {
      question:
        'A program manager found a useful "meeting-minutes" skill in a public GitHub repository and wants every automation in her team\'s repository to use it. Where should the skill be placed?',
      options: [
        'In ~/.copilot/skills on her laptop',
        'In .github/skills in the team repository, committed through a pull request',
        'In the repository wiki',
        'In the automation prompt as pasted text',
      ],
      correct: [1],
      explanation:
        'Project skills in .github/skills are available to the team, cloud agent and automations. Personal skills are local to one machine, wikis are not a skill location, and pasting text defeats the purpose of a reusable skill.',
    },
    {
      question:
        'Which TWO elements are required in a SKILL.md file\'s frontmatter? (Select two)',
      options: [
        'name',
        'description',
        'license',
        'allowed-tools',
      ],
      correct: [0, 1],
      explanation:
        'name and description are required; license and allowed-tools are optional, and allowed-tools should be used sparingly.',
    },
    {
      question:
        'An operations lead wants a weekly agentic workflow to pull open ticket counts from the company\'s help-desk system. What is the correct way to provide the help-desk connection?',
      options: [
        'Paste the help-desk API token into the workflow\'s Markdown body',
        'Declare the help-desk MCP server in the workflow frontmatter (or import a shared definition) with its credential stored as a secret',
        'Ask the agent to browse the help desk website manually each week',
        'Add the help-desk URL to .github/copilot-instructions.md',
      ],
      correct: [1],
      explanation:
        'MCP servers are declared in frontmatter or imported, with credentials kept in secrets outside the agent runtime. Tokens never belong in Markdown, agents cannot log into arbitrary websites reliably, and instructions do not provide tools.',
    },
    {
      question:
        'A skill works perfectly in Copilot CLI but Copilot cloud agent never uses it when an issue is assigned. What is the MOST likely cause?',
      options: [
        'Cloud agent does not support skills',
        'The skill is stored in a personal location on the laptop, not in the repository\'s project skills folder',
        'Skills must be invoked with /chronicle in the cloud',
        'The repository has more than 50 MCP servers',
      ],
      correct: [1],
      explanation:
        'Cloud agent supports skills, but only reads project skills from the repository (or dotfiles for cloud sandboxes). /chronicle is unrelated and the MCP server limit does not affect skills.',
    },
    {
      question:
        'A repository administrator is asked to add an external MCP server for a shared triage automation. Which practice follows GitHub guidance?',
      options: [
        'Use the administrator\'s personal API token stored as an Agents secret with the COPILOT_MCP_ prefix',
        'Use a service account credential stored as an Agents secret with the COPILOT_MCP_ prefix, and let the automation select only the tools it needs',
        'Store the credential as a Codespaces secret',
        'Enable every tool from the server so Copilot has full context',
      ],
      correct: [1],
      explanation:
        'Shared repository-level servers should use a service account, not personal credentials; secrets must be Agents secrets with the COPILOT_MCP_ prefix; and tool selection should be minimal. Codespaces secrets are not passed to the cloud agent.',
    },
  ],
  statements: [
    { text: 'The Agent Skills format is an open standard used by a range of AI systems.', isTrue: true, explanation: 'This is why skills shared in community repositories can be reused with Copilot.' },
    { text: 'A skill file can be named anything as long as it is Markdown.', isTrue: false, explanation: 'Skill files must be named SKILL.md.' },
    { text: 'Including a skill name with a leading slash in a prompt tells Copilot to use that skill.', isTrue: true, explanation: 'For example "Use the /frontend-design skill to ...".' },
    { text: 'Copilot connectors work in GitHub Actions-based agent sessions.', isTrue: false, explanation: 'Connectors work in cloud sandbox sessions but not in sessions running on GitHub Actions.' },
    { text: 'An automation can use every tool of a repository-configured MCP server automatically.', isTrue: false, explanation: 'Automations can use only the MCP tools you select for each automation.' },
    { text: 'You can use up to 50 MCP servers across personal and repository-level configurations.', isTrue: true, explanation: 'This is the documented limit for Copilot cloud agent configurations.' },
  ],
  resources: [
    { label: 'Agent skills (concept)', url: 'https://docs.github.com/en/copilot/concepts/agents/about-agent-skills' },
    { label: 'Adding agent skills for GitHub Copilot CLI', url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills' },
    { label: 'Model Context Protocol (MCP)', url: 'https://docs.github.com/en/copilot/concepts/context/mcp' },
    { label: 'Using MCP with Copilot cloud agent', url: 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-with-mcp' },
  ],
};
