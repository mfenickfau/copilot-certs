import type { Concept } from '../../types';

export const copilotPlansAndIdeSetup: Concept = {
  id: 'copilot-plans-and-ide-setup',
  title: 'Copilot Plans, Surfaces and Getting Started in the IDE',
  summary:
    'Which Copilot plan gives you what, how to install and sign in to the extension, how to enable or disable completions globally or per language, and the four ways to trigger Copilot: inline suggestions, Chat, the CLI and agent mode.',
  certs: ['gh-300'],
  domains: ['gh-300-2'],
  outcomes: ['gh-300-2-1-1', 'gh-300-2-1-2', 'gh-300-2-1-3'],
  tags: ['plans', 'copilot-free', 'copilot-business', 'copilot-enterprise', 'vs-code', 'inline-suggestions', 'setup'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Plans: who pays and who controls',
      body: `GitHub Copilot is sold as individual plans and organisation plans. The exam tests which capabilities belong to which tier and, above all, where *policy control* lives.

| Plan | For | Highlights |
|---|---|---|
| **Copilot Free** | Individuals without an organisation seat | Limited allowance (historically 2,000 completions a month and a small chat quota), auto model selection only, chat on GitHub.com and in IDEs, Copilot CLI |
| **Copilot Pro** / **Pro+** / **Max** (and **Student**) | Individuals | Paid tiers with progressively larger monthly allowances of AI credits and access to premium models; code review, agent mode, MCP, the cloud agent. The individual can set their own public-code and training-data preferences |
| **Copilot Business** | Organisations and enterprises | Centralised seat management, **organisation-wide policy management**, content exclusion, audit logs, "block suggestions matching public code", organisation custom instructions; customer data is not used to train models |
| **Copilot Enterprise** | GitHub Enterprise Cloud | Everything in Business plus a larger pool of AI credits, priority access to premium models and enterprise-grade capabilities. (Newer billing options such as *Copilot access* give Enterprise-level features with metered usage) |

Rules worth memorising:

- Copilot Free is only for developers who do **not** have access through an organisation. When you are added to a Business or Enterprise plan, any personal plan is cancelled, so personal and organisation policies cannot conflict.
- Inline suggestions and next edit suggestions do not consume AI credits on paid plans; chat, agent and review requests do, and the amount depends on the model.
- Feature availability on an organisation seat is "subject to administrator policies": a developer on Business who cannot see agent mode should ask their org owner, not reinstall the extension.
- Copilot is not available on GitHub Enterprise Server.`,
    },
    {
      heading: 'Surfaces and how to get set up',
      body: `Copilot runs wherever you work: **IDEs** (Visual Studio Code, Visual Studio, JetBrains IDEs, Eclipse, Xcode, plus Vim/Neovim and Azure Data Studio for completions), the **GitHub website and GitHub Mobile**, **Copilot CLI** in the terminal, the **GitHub Copilot app** (a desktop app for directing agent work), **GitHub Desktop** (commit messages) and **Windows Terminal**.

Enabling Copilot in an IDE is a three-step pattern the exam describes as "enable Copilot in the IDE":

1. **Have access.** Either a personal plan or a seat assigned by an organisation. Your available features are listed at \`github.com/settings/copilot/features\`.
2. **Install the extension or plugin.** VS Code: install *GitHub Copilot* from the Marketplace (Chat ships with it). Visual Studio 17.10+ has Copilot built in; older 17.8/17.9 needs the Copilot and Copilot Chat extensions. JetBrains: install the *GitHub Copilot* plugin from the Marketplace and restart. Eclipse needs version 2024-09 or later. Xcode uses the *GitHub Copilot for Xcode* app.
3. **Sign in to GitHub.** Most IDEs use a device-code flow: copy the code, open the activation page in the browser, authorise the Copilot plugin. Managed user accounts on GHE.com need extra settings before signing in.

Once installed you can toggle completions from the **status bar icon**: choose *Disable completions* (global) or *Disable completions for LANGUAGE*. In VS Code the settings behind this are \`editor.inlineSuggest.enabled\` and the per-language map \`github.copilot.enable\`; JetBrains stores the equivalent in a \`languageAllowList\` in \`github-copilot.xml\`, where \`*\` is a wildcard and specific languages override it. Next edit suggestions are a separate setting (\`github.copilot.nextEditSuggestions.enabled\`) and, on Business or Enterprise, require the *Editor preview features* policy.

Content exclusion is the one setting developers cannot change from the IDE: repository administrators and organisation owners configure it on GitHub.com, and the IDE simply shows a slashed status icon in excluded files. Knowing that it exists and where it lives is "app knowledge" the exam expects here; the detailed configuration is covered in the content-exclusion concept.`,
    },
    {
      heading: 'Four ways to trigger Copilot',
      body: `**Inline suggestions.** Copilot proposes grey "ghost text" as you type, from completing the current line to a whole function body. Press **Tab** to accept, **Esc** to dismiss, and use Alt+] / Alt+[ (Option on macOS) to cycle alternatives. You can accept just the next word (Ctrl/Cmd+Right) or open several suggestions in a new tab (Ctrl+Enter in VS Code and JetBrains). A natural-language comment above the cursor is the classic way to steer a completion. *Next edit suggestions* extend this by predicting the next edit elsewhere in the file after you change something.

**Copilot Chat.** A conversational panel (Ctrl+Alt+I in VS Code), *inline chat* inside the editor or terminal (Ctrl+I), *quick chat*, and *smart actions* from the context menu. Chat has modes: **Ask** (answers and suggestions without changing files), **Edit** (controlled multi-file edits you accept per file; VS Code and JetBrains), **Plan** (research and an implementation plan before any change) and **Agent**. You add context with \`#\` variables such as \`#file\` or \`#selection\`, scope with \`@\` participants such as \`@workspace\`, \`@terminal\`, \`@vscode\` or \`@github\`, and use slash commands such as \`/explain\`, \`/fix\`, \`/tests\`, \`/doc\`.

**Copilot CLI.** Run \`copilot\` in a terminal for an interactive agent session, or \`copilot -p "..."\` for a one-shot programmatic prompt. It reads and edits files, runs commands with your approval, and talks to GitHub.com through the built-in GitHub MCP server.

**Agent mode.** Select *Agent* in the chat mode picker, describe a task, and Copilot decides which files to change, edits them, runs terminal commands (asking for approval by default) and iterates until the task is done. If the Agent option is missing, an organisation or enterprise policy has disabled it.

Choosing between them is itself examinable: completions for flow and repetitive code, Chat for questions, explanations and larger generated blocks, agent mode for multi-step tasks with error handling, the CLI for terminal-first work, and the cloud agent (on GitHub.com) for asynchronous work that ends in a pull request.`,
    },
    {
      heading: 'Troubleshooting the basics',
      body: `Setup problems account for a steady share of exam scenarios because the right first action is usually mundane:

- **No suggestions anywhere** → check the status bar icon (is Copilot disabled globally or for this language?), confirm you are signed in with the account that holds the seat, update the extension (old clients cannot talk to the servers), and check GitHub's status page.
- **No suggestions in one file but fine elsewhere** → on Business or Enterprise the file is probably covered by a **content exclusion**; the icon shows a diagonal line and the tooltip names the setting. Only an admin can change it.
- **"Could not connect to server. Extension activation failed"** → you have no plan or the token request failed; sign out and in again.
- **Behind a corporate proxy or firewall** → use *Developer: Chat Diagnostics* (VS Code) or *Log Diagnostics* (JetBrains) and check the *Reachability* section; custom certificates must be installed at the OS level.
- **Latest Chat features missing in VS Code** → Chat releases track VS Code releases; update VS Code.
- **Agent mode or MCP missing on an organisation seat** → an organisation or enterprise policy is disabled; this is not something the developer fixes locally.
- **Need logs for support** → VS Code: *Output* panel, *GitHub Copilot* channel, or *Developer: Open Extension Logs Folder*; enable *Trace* via *Developer: Set Log Level*. JetBrains: *Help > Show Log*, add \`#com.github.copilot:trace\` for debug logging. Visual Studio: *View > Output > GitHub Copilot*.

The distractor pattern: reinstalling the IDE, deleting the repository, or buying a higher plan when the real cause is a toggle, a policy or an exclusion.`,
    },
  ],
  examples: [
    {
      title: 'Enabling Copilot for two languages only',
      description:
        'A data engineer wants completions in Python and YAML but finds them distracting in Markdown and plain text. In VS Code she edits settings.json so the per-language map disables everything except the two languages she wants. JetBrains users achieve the same with a languageAllowList where the wildcard is false and the named languages are true.',
      language: 'json',
      code: `{
  "editor.inlineSuggest.enabled": true,
  "github.copilot.enable": {
    "*": false,
    "python": true,
    "yaml": true
  }
}`,
      takeaway: 'Per-language enablement is a local editor setting; the wildcard sets the default and named languages override it.',
    },
    {
      title: 'Choosing the trigger that fits the task',
      description:
        'A developer needs three things in one afternoon: finish a repetitive mapper class, understand an unfamiliar authentication module, and migrate twelve files from one logging library to another while keeping the tests green. The efficient split is completions for the mapper (type the pattern, accept with Tab), Chat with #file and /explain for the authentication module, and agent mode for the migration because it spans files, needs commands run and will iterate on test failures.',
      takeaway: 'Completions for flow, Chat for understanding, agent mode for multi-step changes that need commands and iteration.',
    },
    {
      title: 'The reinstall that fixed nothing (a realistic mistake)',
      description:
        'A new hire on a Copilot Business seat gets no suggestions in `config/secrets.yaml` and reinstalls VS Code twice. The status bar icon in that file has a diagonal line through it; hovering shows that an organisation content exclusion for `**/secrets*` applies. Everything was working as designed. The right action was to read the tooltip and, if the exclusion is wrong, ask the organisation owner.',
      takeaway: 'A slashed Copilot icon in a single file means content exclusion, which only repository or organisation admins can change.',
    },
    {
      title: 'Wrong plan assumption',
      description:
        'A team lead on Copilot Free complains that organisation-wide policy management and content exclusion are missing. These are organisation features of Copilot Business and Enterprise; individual plans, including Free, Pro, Pro+ and Max, manage settings per person on GitHub.com. The fix is to subscribe the organisation to Copilot Business and assign seats, after which members\' personal plans are cancelled and organisation policies apply.',
      takeaway: 'Policy management, content exclusion and audit logs are organisation-plan capabilities, not individual-plan settings.',
    },
  ],
  keyPoints: [
    'Individual plans (Free, Pro, Pro+, Max, Student) are self-managed; Business and Enterprise add seat management, organisation-wide policies, content exclusion and audit logs.',
    'Copilot Free is only for individuals without an organisation seat; joining a Business or Enterprise plan cancels a personal plan.',
    'Enable Copilot in an IDE: have access, install the extension or plugin, sign in to GitHub (device-code flow in most IDEs).',
    'Toggle completions from the status bar globally or per language; VS Code uses github.copilot.enable and editor.inlineSuggest.enabled, JetBrains uses languageAllowList in github-copilot.xml.',
    'Trigger Copilot through inline suggestions (Tab to accept), Chat (Ask, Edit, Plan, Agent modes; #, @ and / keywords), the CLI (copilot, copilot -p) and agent mode.',
    'Inline suggestions and next edit suggestions do not consume AI credits on paid plans; chat, agent and review requests do.',
    'A slashed status icon in one file means content exclusion; a missing Agent or MCP option on an organisation seat means a policy is disabled.',
    'Troubleshoot in order: status icon and sign-in, extension and IDE version, policies and exclusions, logs and diagnostics; reinstalling rarely helps.',
  ],
  flashcards: [
    { front: 'Which Copilot plans include organisation-wide policy management and content exclusion?', back: 'Copilot Business and Copilot Enterprise (and Copilot access for eligible enterprises).' },
    { front: 'Who is eligible for Copilot Free?', back: 'Individual developers who do not have access to Copilot through an organisation or enterprise.' },
    { front: 'What happens to a personal Copilot plan when the user is added to a Copilot Business plan?', back: 'The individual plan is cancelled, so personal and organisation policies cannot conflict.' },
    { front: 'Which keyboard shortcut accepts an inline suggestion?', back: 'Tab (Esc dismisses; Alt+] / Alt+[ cycle alternatives).' },
    { front: 'Name the four Copilot Chat modes in VS Code.', back: 'Ask, Edit, Plan and Agent.' },
    { front: 'Which VS Code setting enables or disables Copilot per language?', back: 'github.copilot.enable (a map of language id to true/false, with * as the default).' },
    { front: 'What does a Copilot status-bar icon with a diagonal line through it mean in one specific file?', back: 'The file is covered by a content exclusion configured by a repository or organisation admin.' },
    { front: 'In which IDEs is Copilot Chat built in rather than a separate extension?', back: 'Visual Studio 17.10 and later; in VS Code the Copilot extension includes Chat.' },
    { front: 'Do inline suggestions consume AI credits on paid plans?', back: 'No. Inline and next edit suggestions are unlimited; chat, agent and review requests consume credits.' },
    { front: 'The Agent option is missing from the chat mode picker for a Copilot Business user. What is the likely cause?', back: 'The organisation or enterprise has disabled agent mode for the IDE through policy.' },
    { front: 'How do you start a one-shot Copilot CLI request without an interactive session?', back: 'copilot -p "your prompt" (or pipe a prompt into copilot).' },
  ],
  quiz: [
    {
      question:
        'A developer on a Copilot Business seat reports that Copilot shows no suggestions in one YAML file but works normally in every other file. The status bar icon in that file has a diagonal line through it. What is the MOST likely cause?',
      options: [
        'The developer has exceeded the monthly completions limit',
        'The file is covered by a content exclusion configured at the repository or organisation level',
        'YAML is not a supported language',
        'The Copilot extension needs to be reinstalled',
      ],
      correct: [1],
      explanation:
        'The slashed icon in a specific file is the content-exclusion indicator. Paid plans have unlimited completions, YAML is supported, and reinstalling does not change server-side exclusions.',
    },
    {
      question:
        'An engineering manager wants to prevent all members of the organisation from receiving suggestions that match public code, and to exclude secret files from Copilot. Which plan is the MINIMUM that provides these controls centrally?',
      options: ['Copilot Free', 'Copilot Pro+', 'Copilot Business', 'Copilot Max'],
      correct: [2],
      explanation:
        'Organisation-wide policy management and content exclusion arrive with Copilot Business. Free, Pro+ and Max are individual plans whose settings are managed per person.',
    },
    {
      question: 'Which TWO interactions trigger GitHub Copilot in the IDE? (Select two)',
      options: [
        'Typing code or a natural-language comment and receiving ghost-text inline suggestions',
        'Running git commit, which automatically opens Copilot Chat',
        'Selecting Agent in the chat mode picker and describing a multi-step task',
        'Pushing to a branch, which triggers inline suggestions in the browser',
      ],
      correct: [0, 2],
      explanation:
        'Inline suggestions and agent mode are two of the documented triggers (with Chat and the CLI). Git commits and pushes do not trigger Copilot in the IDE.',
    },
    {
      question:
        'A developer wants Copilot completions in TypeScript but not in Markdown files in VS Code. What is the MOST appropriate action?',
      options: [
        'Ask the organisation owner to add Markdown to content exclusions',
        'Edit the github.copilot.enable map in settings.json to set markdown to false',
        'Uninstall the Copilot Chat extension',
        'Switch to the Copilot Free plan, which excludes documentation files',
      ],
      correct: [1],
      explanation:
        'Per-language enablement is a local editor setting. Content exclusions target file paths for privacy, not personal preference; uninstalling Chat does not affect completions; plans do not filter languages.',
    },
    {
      question:
        'A new team member on Visual Studio 2022 version 17.12 asks which extensions to install to use Copilot Chat. What should you tell them?',
      options: [
        'Install the GitHub Copilot and GitHub Copilot Chat extensions separately',
        'Copilot and Copilot Chat are built in from version 17.10; just sign in to GitHub',
        'Copilot Chat is only available in Visual Studio Code',
        'Install the JetBrains Copilot plugin inside Visual Studio',
      ],
      correct: [1],
      explanation:
        'Visual Studio 17.10 and later include both extensions. Separate installation applied to 17.8 and 17.9. Chat is available in several IDEs, and JetBrains plugins do not run in Visual Studio.',
    },
    {
      question:
        'A developer behind a corporate proxy sees "GitHub Copilot could not connect to server" in VS Code. Which FIRST step gives the most useful diagnostic information?',
      options: [
        'Run Developer: Chat Diagnostics and check the Reachability section',
        'Delete and re-clone the repository',
        'Upgrade to Copilot Pro+',
        'Disable all content exclusions',
      ],
      correct: [0],
      explanation:
        'The diagnostics command reports whether Copilot endpoints are reachable through the proxy. Re-cloning, upgrading plans and content exclusions are unrelated to connectivity.',
    },
  ],
  statements: [
    { text: 'Copilot Free can be used by a developer who already receives a seat from their organisation.', isTrue: false, explanation: 'Copilot Free is only available to individuals without organisation or enterprise access.' },
    { text: 'In Visual Studio Code you can disable Copilot completions for a single language while keeping them for others.', isTrue: true, explanation: 'The github.copilot.enable setting maps languages to true or false, with * as the default.' },
    { text: 'Content exclusions can be edited by any developer from the IDE settings.', isTrue: false, explanation: 'Only repository administrators, organisation owners and enterprise owners configure content exclusion, on GitHub.com.' },
    { text: 'Copilot Chat in the IDE offers Ask, Edit, Plan and Agent modes.', isTrue: true, explanation: 'VS Code and JetBrains expose all four; some IDEs omit Edit or Plan.' },
    { text: 'GitHub Copilot is available for GitHub Enterprise Server.', isTrue: false, explanation: 'The plans page states Copilot is not currently available for GitHub Enterprise Server.' },
    { text: 'Most IDEs sign you in to Copilot with a device-code flow that you complete in the browser.', isTrue: true, explanation: 'The JetBrains and VS Code flows copy a device code to a GitHub activation page where you authorise the plugin.' },
    { text: 'Inline suggestions consume AI credits on Copilot Business.', isTrue: false, explanation: 'Inline and next edit suggestions are unlimited and do not consume credits; chat, agent and review requests do.' },
  ],
  resources: [
    { label: 'Plans for GitHub Copilot', url: 'https://docs.github.com/en/copilot/get-started/plans' },
    { label: 'Quickstart for using GitHub Copilot in your IDE', url: 'https://docs.github.com/en/copilot/get-started/quickstart-for-using-github-copilot-in-your-ide' },
    { label: 'Configuring GitHub Copilot in your environment', url: 'https://docs.github.com/en/copilot/how-tos/configure-personal-settings/configure-in-your-environment' },
    { label: 'Troubleshooting common issues with GitHub Copilot', url: 'https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-common-issues' },
  ],
};
