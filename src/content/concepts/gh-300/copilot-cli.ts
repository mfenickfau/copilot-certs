import type { Concept } from '../../types';

export const copilotCli: Concept = {
  id: 'copilot-cli',
  title: 'GitHub Copilot CLI: Installing, Sessions, Permissions and Scripting',
  summary:
    'The terminal-native Copilot agent: what it is for, how to install and authenticate it, the interactive and programmatic interfaces, the slash commands that control a session, the permission model that keeps it safe, and how to generate scripts and manage files from the command line.',
  certs: ['gh-300'],
  domains: ['gh-300-2'],
  outcomes: ['gh-300-2-2-1', 'gh-300-2-2-2', 'gh-300-2-2-3', 'gh-300-2-2-4', 'gh-300-2-2-5'],
  tags: ['copilot-cli', 'terminal', 'agent', 'permissions', 'sandbox', 'mcp', 'sessions'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'What Copilot CLI is and why developers use it',
      body: `GitHub Copilot CLI brings a full Copilot agent into the terminal. You type natural language and it can answer questions, write and debug code, run shell commands, perform Git operations, and talk to GitHub.com (list your pull requests, start work on an issue, open a pull request, create an issue) through the built-in GitHub MCP server. It is available on every Copilot plan; on an organisation seat the **Copilot CLI** policy must be enabled.

Why a terminal agent rather than an IDE?

- **Stay in the terminal.** Many tasks (Git, build tooling, CI debugging, log triage) already live there. The CLI removes the context switch of opening a browser or an editor.
- **Repeatable workflows.** Prompts can be scripted, piped and scheduled, so Copilot becomes a step in automation rather than a chat window.
- **Agentic by default.** The CLI does not just suggest commands; with your approval it runs them, inspects results and iterates.
- **Portable context.** Sessions are saved, resumable, can be moved to a cloud sandbox (\`copilot --cloud\`) and steered from GitHub Mobile or GitHub.com with remote control.

Supported platforms are Linux, macOS and Windows (PowerShell v6+ or WSL). It runs independently of the GitHub CLI (\`gh\`) but can use your existing GitHub authentication.

Older study material refers to the previous \`gh copilot suggest\` and \`gh copilot explain\` extension for GitHub CLI. The current product is the standalone \`copilot\` command described here; if an exam item mentions "explain a command" or "suggest a command", the modern equivalent is simply asking the agent in natural language.`,
    },
    {
      heading: 'Installing and authenticating',
      body: `Installation options, all documented by GitHub:

\`\`\`bash
# npm (all platforms; needs Node.js 22+)
npm install -g @github/copilot

# Homebrew (macOS and Linux)
brew install --cask copilot-cli

# WinGet (Windows)
winget install GitHub.Copilot

# Install script (macOS and Linux)
curl -fsSL https://gh.io/copilot-install | bash
\`\`\`

You can also download executables from the \`github/copilot-cli\` repository. The command to update is in the CLI command reference (\`copilot help\` lists it).

Authentication happens on first launch: if you are not signed in, the CLI prompts you to run **\`/login\`** and follow the device flow in your browser. For unattended use (scripts, CI), create a **fine-grained personal access token** owned by your personal account with the **Copilot Requests** permission and export it as \`COPILOT_GITHUB_TOKEN\` (also honoured: \`GH_TOKEN\`, \`GITHUB_TOKEN\`, in that order of precedence). The Copilot Requests permission is only available on user-owned tokens, not organisation-owned ones.

When a session starts, the CLI asks whether you **trust the files in this folder**: *Yes* (this session), *Yes, and remember this folder*, or *No*. Trusted directories control where Copilot may read, modify and execute files. GitHub's guidance is blunt: do not launch the CLI from your home directory or from folders containing files you do not trust.`,
    },
    {
      heading: 'Interactive sessions, modes and slash commands',
      body: `Enter \`copilot\` to start an **interactive session**. Within it you converse with the agent, give feedback, queue follow-up messages while it is thinking, and reject a proposed command with inline guidance about what to do instead. Press **Shift+Tab** to cycle modes: the default ask/execute mode, **plan mode** (Copilot asks clarifying questions and writes a structured plan before touching code) and **autopilot** (works through a well-defined task without pausing after each step). Press Esc twice to stop a running operation.

Context tools: attach a file with \`@path/to/file\`, reference an issue or pull request with \`#123\`, drag in images or PDFs, and prefix a line with \`!\` to run a shell command directly without calling the model.

Frequently examined slash commands (type \`?\` or \`/help\` for the full list):

| Command | Purpose |
|---|---|
| \`/login\`, \`/logout\` | Authenticate |
| \`/model\` | Choose the AI model (also \`--model\` flag) |
| \`/mcp add\`, \`/mcp\` | Add or manage MCP servers (stored in \`~/.copilot/mcp-config.json\`) |
| \`/agent\` | Pick a custom agent; \`/fleet\` parallelises subtasks across subagents |
| \`/plan\`, \`/autopilot\` | Plan first, or run autonomously |
| \`/context\`, \`/compact\`, \`/usage\` | Inspect token usage, compress history, see session statistics |
| \`/permissions\` (\`default\`, \`assisted\`, \`allow-all\`), \`/yolo\` | Change the permission mode |
| \`/sandbox enable\` | Restrict commands to a local sandbox |
| \`/resume\`, \`/continue\`, \`/session\` | Switch, list or manage sessions |
| \`/undo\` (\`/rewind\`) | Roll back conversation and optionally restore files |
| \`/review\`, \`/security-review\`, \`/research\` | Built-in review and research agents |
| \`/add-dir\`, \`/cwd\` | Trust another directory or change working directory |
| \`/chronicle\` | Query your session history (standup, tips, search) |
| \`/feedback\` | Report a bug or suggest a feature |

Sessions persist. \`copilot --continue\` resumes the most recent session, \`copilot --resume\` lets you choose one, and you can run several sessions side by side and switch with the sidebar. Context is managed automatically: when a conversation nears the token limit, the CLI compacts history in the background so sessions can run indefinitely.

Customisation mirrors the rest of Copilot: repository instructions in \`.github/copilot-instructions.md\`, path-specific \`.github/instructions/**/*.instructions.md\`, \`AGENTS.md\`, custom agents (\`.github/agents\` or \`~/.copilot/agents\`), skills, hooks, and Copilot Memory.`,
    },
    {
      heading: 'Programmatic use, permissions and generating scripts',
      body: `The **programmatic interface** passes a single prompt and exits:

\`\`\`bash
copilot -p "Summarize this week's commits" --allow-tool='shell(git)'
echo "Explain this file: ./complex.ts" | copilot
\`\`\`

Useful flags for automation: \`-s\` (silent, clean output for capture), \`--no-ask-user\` (do not stop for clarifying questions), \`--model\` (deterministic model choice), \`--share=./report.md\` (export the transcript), \`--assisted-approval\` (let a model-based safety check approve eligible permission requests).

**Permissions are the core safety model.** In manual mode every tool that modifies or executes files asks for approval: *Yes* (once), *Yes for the rest of the session* (any invocation of that tool, so approving \`rm\` once approves \`rm -rf\` too) or *No, and tell Copilot what to do differently*. Flags set permissions up front:

- \`--allow-tool='shell(git)'\`, \`--allow-tool='shell(git push)'\`, \`--allow-tool='write'\`, \`--allow-tool='My-MCP-Server(tool_name)'\`
- \`--deny-tool=...\` always wins over allow rules, including \`--allow-all-tools\`
- \`--allow-all-tools\` (alias \`--yolo\`) grants everything; GitHub says use it only in a sandbox or isolated environment

\`\`\`bash
# Allow everything except deleting files and pushing
copilot --allow-all-tools --deny-tool='shell(rm)' --deny-tool='shell(git push)'
\`\`\`

**Generating scripts and managing files** is a typical CLI task. Ask for the script in plain language ("create a bash script that finds .log files older than seven days under ./var and compresses them, with a dry-run flag"); the agent writes the file, asks permission to create or \`chmod\` it, offers to run it, and will fix errors you report. Likewise "rename every \`.jsx\` file in src to \`.tsx\` and update imports" or "revert the last commit, leaving the changes unstaged" are file and Git management prompts. Always review the proposed command before approving, and remember that \`/undo\` can restore files the CLI changed.

For CI, a workflow step can run \`copilot -p "..." -s --allow-tool='shell(npm:*), write' --no-ask-user\` with \`COPILOT_GITHUB_TOKEN\` supplied from a secret.`,
    },
  ],
  examples: [
    {
      title: 'Generating a maintenance script safely',
      description:
        'An SRE wants a script that archives old log files. In an interactive session they describe the requirement and the CLI proposes writing `archive-logs.sh`, asks permission to create it (write), then to make it executable (chmod), then offers a dry run. The SRE reads the script, notices the default path is wrong, and replies with a correction; the agent edits the file and reruns.',
      language: 'bash',
      code: `$ copilot
> Create a bash script archive-logs.sh that finds *.log files under ./var older
> than 7 days and gzips them. Add a --dry-run flag that only prints the files.

Copilot wants to run: touch archive-logs.sh (write)   -> 1. Yes
Copilot wants to run: chmod +x archive-logs.sh        -> 2. Yes, for this session
Copilot wants to run: ./archive-logs.sh --dry-run     -> 1. Yes`,
      takeaway: 'Script generation is conversational: approve each tool call, review the file, and iterate with corrections rather than accepting blindly.',
    },
    {
      title: 'A programmatic review step in CI',
      description:
        'A team adds a workflow step that asks Copilot CLI to review the changes on a branch against main and print findings, using a personal access token with the Copilot Requests permission stored as a secret. The step allows only read-only git commands, runs silently and disables clarifying questions because nobody is there to answer them.',
      language: 'yaml',
      code: `- name: Copilot review of branch
  env:
    COPILOT_GITHUB_TOKEN: \${{ secrets.COPILOT_PAT }}
  run: |
    copilot -p '/review the changes on this branch compared to main. Focus on bugs and security.' \\
      -s --allow-tool='shell(git:*)' --no-ask-user`,
      takeaway: 'Programmatic use means -p, a token in the environment, minimal allow-tool rules, -s for clean output and --no-ask-user for unattended runs.',
    },
    {
      title: 'The --allow-all-tools shortcut that went wrong (a realistic mistake)',
      description:
        'To avoid approval prompts, a developer runs `copilot --allow-all-tools` from their home directory and asks it to "clean up the project build artefacts". The agent interprets a stale `dist` reference loosely and deletes a sibling project\'s build output as well. Nothing stopped it: the home directory was trusted, and blanket approval removed the review step. The documented fix is to launch from the project folder, keep manual or assisted permissions, add `--deny-tool=\'shell(rm)\'` if you must use allow-all, or enable `/sandbox enable` so commands run in a restricted environment.',
      takeaway: 'Deny rules beat allow rules, sandboxes limit blast radius, and the home directory is never a trusted launch point.',
    },
    {
      title: 'Picking up where you left off',
      description:
        'A developer starts a refactor in the CLI, then needs to leave. Later they run `copilot --continue` to resume the most recent session with its full context, or `/resume` to pick an older one. Because sessions can also be started in a cloud sandbox with `copilot --cloud`, the same session can be checked from GitHub Mobile on the train and finished back in the terminal.',
      takeaway: 'Sessions are first-class: resume, switch, share, roll back with /undo, and move between local and cloud without re-explaining the task.',
    },
  ],
  keyPoints: [
    'Copilot CLI is a terminal-native agent available on all plans (the Copilot CLI policy must be enabled on organisation seats).',
    'Install with npm install -g @github/copilot, brew install --cask copilot-cli, winget install GitHub.Copilot, or the gh.io/copilot-install script; authenticate with /login or a fine-grained PAT with the Copilot Requests permission in COPILOT_GITHUB_TOKEN.',
    'Two interfaces: interactive (copilot) with ask/execute, plan and autopilot modes, and programmatic (copilot -p "..." or piped input) that runs once and exits.',
    'Key slash commands: /login, /model, /mcp, /agent, /plan, /context, /compact, /permissions, /sandbox, /resume, /undo, /review, /chronicle, /feedback.',
    'Permission model: approve each tool call, or pre-authorise with --allow-tool / --deny-tool; --deny-tool always wins; --allow-all-tools only in a sandbox.',
    'Trusted directories bound what the CLI can touch; never launch it from your home directory.',
    'Context is managed automatically (auto-compaction near the token limit); sessions persist and can be resumed, shared, moved to a cloud sandbox (--cloud) or steered remotely.',
    'Script generation and file management are conversational: describe the outcome, review each proposed command, iterate, and use /undo to roll back.',
  ],
  flashcards: [
    { front: 'Which npm command installs GitHub Copilot CLI?', back: 'npm install -g @github/copilot (requires Node.js 22 or later).' },
    { front: 'How do you authenticate Copilot CLI interactively on first launch?', back: 'Run the /login slash command and complete the browser device flow.' },
    { front: 'Which token permission does a fine-grained PAT need for Copilot CLI, and which variable holds it?', back: 'The Copilot Requests permission (user-owned token); export it as COPILOT_GITHUB_TOKEN (GH_TOKEN or GITHUB_TOKEN also work).' },
    { front: 'How do you run Copilot CLI with a single prompt and exit?', back: 'copilot -p "prompt" (or --prompt), or pipe text into copilot.' },
    { front: 'What does --deny-tool do when combined with --allow-all-tools?', back: 'Deny rules take precedence, so the denied tool still requires approval or is blocked.' },
    { front: 'Which key combination cycles between ask/execute and plan mode?', back: 'Shift+Tab.' },
    { front: 'Which slash command shows context-window token usage, and which compresses history?', back: '/context shows usage; /compact compresses the conversation.' },
    { front: 'How do you resume the most recently closed local session from the command line?', back: 'copilot --continue (or copilot --resume to pick a session).' },
    { front: 'What does the trusted-directory prompt protect against?', back: 'Copilot reading, modifying or executing files outside folders you trust; do not launch from your home directory.' },
    { front: 'How do you add a remote MCP server to Copilot CLI from the terminal?', back: 'copilot mcp add --transport http SERVER-NAME URL (or /mcp add in a session); config lives in ~/.copilot/mcp-config.json.' },
    { front: 'Which slash command restricts the CLI\'s commands to a local sandbox?', back: '/sandbox enable.' },
    { front: 'Which command starts a Copilot CLI session in a GitHub-hosted cloud sandbox?', back: 'copilot --cloud.' },
  ],
  quiz: [
    {
      question:
        'A platform engineer wants to run Copilot CLI inside a GitHub Actions workflow to summarise test failures. Which TWO steps are required for unattended operation? (Select two)',
      options: [
        'Provide a fine-grained personal access token with the Copilot Requests permission via COPILOT_GITHUB_TOKEN',
        'Run copilot with the -p flag and --no-ask-user so it does not wait for interactive input',
        'Open an interactive session and press Shift+Tab to enter plan mode',
        'Install the GitHub Copilot extension for Visual Studio Code on the runner',
      ],
      correct: [0, 1],
      explanation:
        'Programmatic use needs a token in the environment and a one-shot prompt that will not block on questions. Plan mode is interactive, and the VS Code extension is irrelevant to the CLI.',
    },
    {
      question:
        'A developer wants Copilot CLI to run most commands without prompting but must guarantee it never deletes files or pushes to the remote. Which command line is MOST appropriate?',
      options: [
        "copilot --allow-all-tools",
        "copilot --allow-tool='shell(rm)' --allow-tool='shell(git push)'",
        "copilot --allow-all-tools --deny-tool='shell(rm)' --deny-tool='shell(git push)'",
        "copilot --deny-tool='shell'",
      ],
      correct: [2],
      explanation:
        'Deny rules override allow-all, so this combination allows everything except rm and git push. Option A allows deletion, option B explicitly allows the dangerous tools, and option D denies every shell command.',
    },
    {
      question: 'Which statement about Copilot CLI sessions is correct?',
      options: [
        'Each session is discarded when the terminal closes and cannot be resumed',
        'Sessions are saved and can be resumed with copilot --continue or /resume, including sessions started in a cloud sandbox',
        'Only one session can exist at a time',
        'Session history is never compacted, so long sessions eventually fail',
      ],
      correct: [1],
      explanation:
        'Sessions persist locally (and can sync to your account); you can run several and resume any. The CLI auto-compacts context as it approaches the token limit.',
    },
    {
      question:
        'A developer launches copilot from their home directory and approves "Yes, for the rest of the session" when the agent asks to run rm on one file. What is the main risk?',
      options: [
        'The agent can now run any rm command anywhere under the trusted home directory without asking again',
        'The session will consume premium requests at double rate',
        'The CLI will switch to plan mode automatically',
        'Content exclusions will stop applying',
      ],
      correct: [0],
      explanation:
        'Session-wide approval applies to the tool with any arguments, and trusting the home directory makes the whole tree reachable. Billing, modes and content exclusions are unaffected.',
    },
    {
      question:
        'Which slash command lets you roll back the conversation and optionally restore files Copilot CLI changed?',
      options: ['/compact', '/undo', '/context', '/model'],
      correct: [1],
      explanation:
        '/undo (alias /rewind) opens the rewind picker with "conversation only" or "conversation + files". /compact compresses history, /context shows token usage, /model changes the model.',
    },
    {
      question:
        'A developer asks Copilot CLI to "generate a PowerShell script that rotates log files and schedule it". What is the responsible way to proceed when the CLI proposes running the new script?',
      options: [
        'Approve immediately; the CLI validates scripts before proposing them',
        'Read the generated script, run it with a dry-run or in a sandbox first, then approve the real run',
        'Decline and write the script manually, because the CLI cannot create files',
        'Switch to --allow-all-tools so future runs are faster',
      ],
      correct: [1],
      explanation:
        'The CLI does create and run scripts, but it does not guarantee correctness; review and a dry run or sandbox are the documented safeguards. Blanket approval removes the review step.',
    },
  ],
  statements: [
    { text: 'Copilot CLI requires a Copilot Enterprise plan.', isTrue: false, explanation: 'It is available on all Copilot plans, subject to the Copilot CLI policy for organisation seats.' },
    { text: 'The --deny-tool option takes precedence over --allow-all-tools.', isTrue: true, explanation: 'GitHub documents that deny rules override both allow-all and allow-tool.' },
    { text: 'Copilot CLI includes the GitHub MCP server without additional configuration.', isTrue: true, explanation: 'The GitHub MCP server is built in; other servers are added with /mcp add or copilot mcp add.' },
    { text: 'Approving a tool "for the rest of the session" only approves that exact command line.', isTrue: false, explanation: 'It approves the tool with any options for the session, so approving rm once permits rm -rf.' },
    { text: 'The /context command shows how the context window is being used.', isTrue: true, explanation: 'It breaks down tokens by system prompt, instructions, tools and messages.' },
    { text: 'Piped input is used even when a -p prompt is also supplied.', isTrue: false, explanation: 'Piped input is ignored if you also pass -p or --prompt.' },
    { text: 'Running copilot --cloud starts the session in a GitHub-hosted sandbox that can be steered from other clients.', isTrue: true, explanation: 'Cloud sandbox sessions live in GitHub infrastructure and can be resumed from GitHub.com, GitHub Mobile or the CLI.' },
  ],
  resources: [
    { label: 'GitHub Copilot CLI (concept)', url: 'https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-cli' },
    { label: 'Installing GitHub Copilot CLI', url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli' },
    { label: 'Using GitHub Copilot CLI', url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview' },
    { label: 'Running GitHub Copilot CLI programmatically', url: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically' },
  ],
};
