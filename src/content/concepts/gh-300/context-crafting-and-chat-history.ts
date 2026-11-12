import type { Concept } from '../../types';

export const contextCraftingAndChatHistory: Concept = {
  id: 'context-crafting-and-chat-history',
  title: 'Context Crafting: How Copilot Decides What It Knows, and Managing Chat History',
  summary:
    'What goes into the context window and in what order, how each Copilot surface determines context (open files, selection, workspace, repository index, instructions, attachments, tools), how the prompt-processing flow uses chat history, and how to keep history relevant with new sessions, compaction and subagents.',
  certs: ['gh-300', 'gh-700'],
  domains: ['gh-300-4', 'gh-300-3', 'gh-700-2'],
  outcomes: ['gh-300-4-1-2', 'gh-300-4-2-2', 'gh-300-3-1-2', 'gh-700-2-1-4'],
  tags: ['context-window', 'chat-history', 'compaction', 'context-variables', 'mentions', 'repository-indexing', 'custom-instructions'],
  difficulty: 'intermediate',
  diagram: 'context-window',
  sections: [
    {
      heading: 'The context window as a budget',
      body: `Every request Copilot sends to a model is a single block of tokens: the **system instructions** that define Copilot's behaviour, **tool definitions** (built-in and MCP), your **custom instructions**, the **conversation so far** (your messages and Copilot's replies), **tool calls and their results**, and finally your new prompt. The model can only consider what fits in its **context window**, a fixed token budget that varies by model.

Think of the window as a budget with fixed and variable costs:
- *Fixed*: system prompt and tool schemas are always present; adding many MCP servers shrinks the space left for your work, which is why toolsets can be disabled.
- *Variable*: messages, attached files and tool output. A single command that dumps a large log can consume a huge share; Copilot CLI therefore saves tool output above 20 KiB to a file and passes the model a preview.
- *Reserve*: headroom kept for the model's answer.

You can see the split with \`/context\` in the CLI and Copilot app (system prompt, custom instructions, system tools, MCP tools, messages, free space, buffer) or the context indicator near the chat input in supported IDEs.

The practical rule: the model does not "remember" anything outside the window. If a detail matters, it must be in a file you attach, in instructions, or in a recent message.`,
    },
    {
      heading: 'How each surface determines context',
      body: `Context is **determined by the surface, your actions and your configuration**. The exam asks you to predict what Copilot can see in a given situation.

| Surface | Automatic context | How you add more |
|---|---|---|
| **Inline completions** | Code around the cursor (Fill-in-the-Middle), file name and language, open tabs, project info | Open relevant files, close irrelevant ones, write descriptive comments and names |
| **Chat in the IDE** | The active file and current selection; repository custom instructions; conversation history | \`#file\`, \`#selection\`, \`#function\`, \`#class\`, line ranges, drag-and-drop files or images; \`@workspace\` for a semantic search of the project; \`@terminal\`, \`@vscode\`, \`@github\` (GitHub skills and \`#web\` search); MCP tools |
| **Chat on GitHub.com** | The repository, file, issue or pull request you started from; a **semantic code search index** built automatically for the repository (default branch); personal, repository-wide and organisation instructions | The repository selector, the \`+\` menu and \`@\` mentions to attach files, issues, pull requests, repositories or a Space; web search when enabled |
| **Cloud agent** | The repository and base branch you chose, the issue or task text, repository and path-specific instructions, \`AGENTS.md\`, organisation instructions, MCP tools (GitHub and Playwright by default), semantic code search | Acceptance criteria, relevant files, screenshots in the task; start from a chat session to carry discussion forward |
| **Copilot CLI** | Files it reads with tools, trusted directories, instructions files, custom agents, skills, Copilot Memory | \`@path\` for files, \`#123\` for issues or pull requests, images and PDFs |
| **Spaces** | Everything added to the space (repositories, files, issues, PRs, notes, uploads), kept in sync | Add or remove sources |

Other inputs shape context without appearing in the prompt text: **content exclusions** remove files, **Copilot Memory** stores repository facts and preferences across sessions where allowed, and **custom instructions** are injected on every request in scope. The References list under a chat answer tells you exactly which files and instruction files were used, which is the fastest way to debug "why did it ignore X".`,
    },
    {
      heading: 'The prompt process flow and chat history',
      body: `When you press Enter in Chat, Copilot:

1. **Pre-processes your input**: resolves \`#\` and \`@\` references, attaches the active file or selection, pulls in custom instructions and any attached images.
2. **Builds the prompt** by combining system instructions, tool definitions, the **conversation history** and the new message. On GitHub.com it may also run semantic search over the repository index or a web search.
3. **Sends** it to the model, which may call tools (read a file, search, run a command in agent mode); each result is appended to the context and the model continues.
4. **Formats the response** with syntax highlighting, insert and copy buttons and links to the sources used.

Chat history is what makes follow-ups work: "now add error handling" only makes sense because the previous function is still in the window. The same mechanism causes problems when history is **stale or irrelevant**: an earlier tangent about a different module biases later answers, and long histories cost more tokens (older Learn material notes that full-history turns can consume two to three times the credits of a focused request).

Managing history well:
- **Start a new conversation or session for a new task** (\`/clear\` or \`/new\` in IDEs and the CLI; a new thread on GitHub.com).
- **Remove or roll back** turns that no longer help: delete a request in the IDE, \`/undo\` or \`/rewind\` in the CLI. The cloud agent lets you start a new task or stop and archive a session but not delete individual turns.
- **Summarise instead of carrying everything**: "Based on our earlier authentication design, now add rate limiting" replaces pasting the whole discussion.
- **Compaction**: when a long session approaches the window limit, Copilot summarises the history into a structured checkpoint (goals, what was done, key files, next steps). It is automatic in the CLI and Copilot app around 80 percent of capacity and can be triggered with \`/compact\`; IDEs offer a compact action. Detail is lost and compaction cannot be reversed, so check \`/session checkpoints\` if the agent seems to have forgotten a decision.
- **Delegate noisy work to subagents**, which have their own windows and return only a summary.`,
    },
    {
      heading: 'Context crafting: a checklist',
      body: `"Context crafting" is the exam's term for deliberately shaping what Copilot sees. A checklist you can apply to any scenario:

1. **Is the right code in view?** Open the files that matter; close the ones that do not. For a new test file, open an existing test so Copilot sees the framework and style.
2. **Have I pointed at the target?** Select the code or use \`#file\`/\`#selection\` rather than saying "this".
3. **Does the model need the whole project?** Use \`@workspace\` (IDE) or repository context (GitHub.com) for cross-file questions; use a Space for curated, shared material.
4. **Is standing knowledge in instructions?** Frameworks, conventions, test commands and architecture belong in \`.github/copilot-instructions.md\` or path-specific files so every prompt inherits them.
5. **Does the task need live data or actions?** Add an MCP server or use \`@github\` rather than pasting tickets and docs.
6. **Is anything in view that must not be?** Secrets and sensitive files should be covered by content exclusions, not left to chance.
7. **Is the history helping?** If not, start fresh or compact.
8. **Can I verify what was used?** Check References, the session log or \`/context\`.

The exam's favourite distractors here: expecting Chat in a blank file to know about other files you never opened or referenced; expecting the IDE to see an issue you did not attach; assuming a long conversation makes answers better; and reaching for a bigger model when the real problem is missing context.`,
    },
  ],
  examples: [
    {
      title: 'Why the test used the wrong framework',
      description:
        'A developer opens a brand-new `payment.test.ts`, runs /tests and receives Jest-style tests although the project uses Vitest with custom matchers. Nothing in view told Copilot otherwise. Opening an existing Vitest test in an adjacent tab and adding "Testing: Vitest; use the matchers in test/setup.ts" to the repository instructions fixes it for everyone, every time.',
      takeaway: 'Copilot infers conventions from what it can see; put conventions in view (open files) or in instructions.',
    },
    {
      title: 'Attaching the right things on GitHub.com',
      description:
        'A product engineer wants Copilot to draft an implementation approach for a bug. Asking in a fresh chat with no attachments gives a generic answer. Starting the chat from the issue, then using @ mentions to attach the related pull request and the two relevant source files, grounds the answer in the actual code paths, and the response lists those sources as references.',
      takeaway: 'On GitHub.com, context comes from where you start and what you attach with the repository selector, the + menu or @ mentions.',
    },
    {
      title: 'The conversation that outgrew itself (a realistic mistake)',
      description:
        'Over two hours a developer uses one Chat thread to debug a CI failure, then refactor a module, then draft release notes. The release notes mention the CI failure and use the module\'s internal names because the stale history is still in the window. Each task should have been its own conversation, or the developer should have deleted the earlier turns before switching topics.',
      takeaway: 'Keep history relevant: new task, new conversation.',
    },
    {
      title: 'Reading the context budget',
      description:
        'In a CLI session with six MCP servers configured, /context shows MCP tool definitions consuming a quarter of the window before any work starts, and auto-compaction fires repeatedly. Disabling unused servers and toolsets frees the space, and delegating log analysis to the built-in explore agent keeps the main conversation lean.',
      language: 'text',
      code: `/context
Model: <selected model>   Tokens: 71,200 / 128,000
  System Prompt .......... 6%
  Custom Instructions .... 2%
  System Tools ........... 9%
  MCP Tools .............. 24%
  Messages ............... 15%
  Free Space ............. 36%
  Buffer ................. 8%`,
      takeaway: 'Tool definitions are a fixed cost in the context window; trim them and push bulky work to subagents.',
    },
  ],
  keyPoints: [
    'The context window holds system instructions, tool definitions, custom instructions, conversation history, tool results and your prompt; anything outside it is invisible to the model.',
    'Inline completions see code around the cursor, file name and language, and open tabs; Chat in the IDE sees the active file and selection plus what you attach with #, @ and drag-and-drop.',
    'Chat on GitHub.com uses the repository, file, issue or PR you started from, a semantic code search index, and attachments via the repository selector, + menu or @ mentions; the cloud agent adds instructions files and MCP tools.',
    'Custom instructions are injected on every request in scope; content exclusions remove files; References show exactly what was used.',
    'Prompt processing: resolve references and attach context, combine with history and system prompt, call the model (and tools), format the response with sources.',
    'Chat history enables follow-ups but stale history biases answers and costs tokens; start a new conversation per task, delete or rewind irrelevant turns, summarise instead of repeating.',
    'Compaction summarises long sessions automatically (around 80 percent capacity in the CLI) or via /compact; it loses detail and cannot be undone; subagents keep noisy work out of the main window.',
    'Inspect usage with /context in the CLI and Copilot app or the context indicator in IDEs; trim unused MCP tools to free fixed context cost.',
  ],
  flashcards: [
    { front: 'What is held in the context window during a Copilot session?', back: 'System instructions, tool definitions, custom instructions, your messages, Copilot\'s responses, tool calls and results, and the new prompt.' },
    { front: 'What context does Copilot Chat in the IDE use by default?', back: 'The active file and any selected code, plus repository custom instructions and the conversation history.' },
    { front: 'How do you attach a specific file, a selection or the whole workspace to an IDE chat prompt?', back: '#file and #selection chat variables; @workspace participant for a semantic search of the project.' },
    { front: 'How do you add context to Copilot Chat on GitHub.com?', back: 'Start from a repository, file, issue or pull request; use the repository selector, the + menu, or @ mentions to attach files, issues, PRs, repositories or Spaces.' },
    { front: 'What does the References link under a chat response show?', back: 'The files and instruction files Copilot used to generate the response.' },
    { front: 'Which CLI command shows a breakdown of context-window usage?', back: '/context' },
    { front: 'What is compaction and what is its downside?', back: 'Summarising older conversation history into a structured summary to free context space; fine detail is lost and it cannot be reversed.' },
    { front: 'How should you handle chat history when switching to an unrelated task?', back: 'Start a new conversation or session (/clear or /new), or delete the irrelevant turns.' },
    { front: 'Why do many MCP servers reduce effective context?', back: 'Their tool definitions are always present in the window, consuming a fixed share before any conversation.' },
    { front: 'Can the Copilot cloud agent delete individual turns from a session?', back: 'No. You can start a new task or stop and archive a session, but not rewind or delete turns.' },
    { front: 'What does Copilot CLI do with tool output larger than 20 KiB?', back: 'Saves it to a temporary file and gives the model the path plus a preview, to protect the context window.' },
  ],
  quiz: [
    {
      question:
        'A developer in VS Code opens a new, empty file and asks Copilot Chat to "write tests for the OrderService" without attaching anything. Copilot replies that it cannot find OrderService. What is the MOST likely reason?',
      options: [
        'The organisation has disabled Copilot Chat',
        'Chat in the IDE uses the active file and selection by default; OrderService was not in context and was not referenced with #file or @workspace',
        'OrderService is covered by a content exclusion',
        'The model\'s training data predates the project',
      ],
      correct: [1],
      explanation:
        'Context is determined by the active file plus what you attach. Nothing pointed Copilot at the service. Disabled Chat would prevent any reply, exclusions would show a slashed icon in that file, and training data is irrelevant to project code.',
    },
    {
      question:
        'After a long debugging conversation, a developer asks Copilot Chat to draft release notes and the notes wrongly mention the debugging topic. What is the BEST remedy?',
      options: [
        'Switch to a premium model',
        'Start a new conversation for the release notes so stale history is not used as context',
        'Add more MCP servers',
        'Ask the same prompt three more times',
      ],
      correct: [1],
      explanation:
        'Conversation history is context; irrelevant history biases answers. A fresh conversation isolates the task. Bigger models and more tools do not remove stale context.',
    },
    {
      question: 'Which TWO statements about compaction are correct? (Select two)',
      options: [
        'It summarises older conversation history to free context-window space',
        'It can be reversed to restore the original messages',
        'In Copilot CLI it starts automatically as the conversation approaches roughly 80 percent of the window',
        'It deletes files the agent created during the session',
      ],
      correct: [0, 2],
      explanation:
        'Compaction replaces history with a structured summary and is triggered automatically in the CLI (or manually with /compact). It cannot be undone and does not touch files.',
    },
    {
      question:
        'On GitHub.com, a developer wants Copilot to reason about a bug using a specific issue and two source files. Which approach provides that context?',
      options: [
        'Open the files in VS Code; GitHub.com Chat sees your local editor',
        'Start the chat from the issue and attach the files using @ mentions or the + menu',
        'Write the file names in custom instructions',
        'Enable web search',
      ],
      correct: [1],
      explanation:
        'GitHub.com Chat takes context from where you start and what you attach. It does not see your local editor, instructions are for standing guidance rather than one-off files, and web search adds internet results, not repository files.',
    },
    {
      question:
        'A CLI session shows frequent auto-compaction even on short conversations. /context reveals MCP tool definitions occupying a large share of the window. What should the developer do FIRST?',
      options: [
        'Disable MCP servers or toolsets that the current task does not need',
        'Increase the public-code filter sensitivity',
        'Switch to plan mode',
        'Delete the repository instructions file',
      ],
      correct: [0],
      explanation:
        'Tool definitions are a fixed context cost; trimming them frees space. The public-code filter, plan mode and instructions (usually small) do not address the cause.',
    },
    {
      question:
        'Which step in Copilot Chat\'s prompt-processing flow resolves #file references and attaches custom instructions?',
      options: ['Input pre-processing and prompt building', 'Model inference', 'Response formatting', 'Audit logging'],
      correct: [0],
      explanation:
        'References and instructions are resolved while the prompt is assembled, before the model runs. Formatting happens after inference, and audit logging is unrelated to prompt construction.',
    },
  ],
  statements: [
    { text: 'Copilot Chat in the IDE automatically includes every file in the workspace in each prompt.', isTrue: false, explanation: 'It uses the active file and selection by default; @workspace performs a targeted search and #file attaches specific files.' },
    { text: 'Custom instructions are added to every chat request within their scope.', isTrue: true, explanation: 'That is why they should be short and broadly applicable.' },
    { text: 'The References link under a response lists the files Copilot used, including any custom instructions file.', isTrue: true, explanation: 'This is the documented way to see what context informed an answer.' },
    { text: 'Longer chat histories always improve answer quality.', isTrue: false, explanation: 'Irrelevant history biases answers and consumes tokens; GitHub recommends keeping history relevant and starting new conversations for new tasks.' },
    { text: 'On GitHub.com, Copilot Chat builds a semantic code search index of a repository to answer questions about it.', isTrue: true, explanation: 'Indexing runs automatically when a conversation has repository context and is used by Chat and the cloud agent.' },
    { text: 'Compaction preserves the exact wording of every earlier message.', isTrue: false, explanation: 'Compaction is a summary; fine-grained details may be lost.' },
    { text: 'The Copilot cloud agent allows you to rewind individual turns within a session.', isTrue: false, explanation: 'You can start a new task or stop and archive a session, but not delete or rewind turns.' },
  ],
  resources: [
    { label: 'Managing context for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/context-management' },
    { label: 'Asking GitHub Copilot questions in your IDE', url: 'https://docs.github.com/en/copilot/how-tos/use-chat/use-chat-in-ide' },
    { label: 'Indexing repositories for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/repository-indexing' },
    { label: 'Prompt engineering for GitHub Copilot (relevant context and history)', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/prompt-engineering' },
  ],
};
