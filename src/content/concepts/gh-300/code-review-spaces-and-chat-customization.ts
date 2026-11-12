import type { Concept } from '../../types';

export const codeReviewSpacesAndChatCustomization: Concept = {
  id: 'code-review-spaces-and-chat-customization',
  title: 'Copilot Code Review, PR Summaries, Spaces, Spark and Chat Customization',
  summary:
    'How Copilot reviews pull requests and what controls its behaviour, how pull request summaries differ from reviews, what Spaces and Spark are for, and how custom instructions files and reusable prompt files turn Copilot Chat into a consistent, team-standard assistant.',
  certs: ['gh-300', 'gh-700'],
  domains: ['gh-300-2', 'gh-700-1'],
  outcomes: ['gh-300-2-3-2', 'gh-300-2-3-3', 'gh-300-2-3-4', 'gh-700-1-1-10'],
  tags: ['code-review', 'pull-request-summaries', 'copilot-spaces', 'spark', 'custom-instructions', 'prompt-files', 'slash-commands', 'chat'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Copilot code review and pull request summaries',
      body: `**Copilot code review** reads the changes in a pull request, posts review comments labelled High, Medium or Low severity, and where possible attaches **suggested changes** you can apply in a couple of clicks (or hand to the cloud agent with *Fix with Copilot*). It is available on all paid plans, on GitHub.com, GitHub Mobile, the GitHub CLI, VS Code, Visual Studio, JetBrains and Xcode, and organisations must enable the **Copilot code review** policy. In VS Code you can also review a selection or all uncommitted changes.

How it works, and what the exam probes:

- **Request or automate.** Add Copilot as a reviewer like a human, or configure automatic reviews: per user (Copilot settings), per repository or organisation through a **branch ruleset** with *Automatically request Copilot code review*, optionally *Review new pushes* and *Review draft pull requests*. Without "review new pushes" Copilot reviews a pull request once; re-request manually after changes.
- **Comment, not approve, by default.** Reviews are "Comment" reviews that do not count toward required approvals, unless Copilot approvals are explicitly enabled at repository, organisation and enterprise level.
- **Review effort levels**: Lite (fast, targeted), Balanced (default; higher-reasoning model), Max (multiple high-reasoning models; preview). Higher effort costs more AI credits.
- **Agentic context gathering** runs on GitHub Actions runners to understand the whole repository; it can use repository skills and MCP servers (read-only tools) when relevant.
- **Excluded files**: dependency lock files, logs, SVGs, minified bundles, generated and vendor directories are not reviewed.
- **Instructions steer it.** Copilot reads \`.github/copilot-instructions.md\`, path-specific \`.github/instructions/**/*.instructions.md\`, \`AGENTS.md\` (and \`CLAUDE.md\`, \`GEMINI.md\`, \`REVIEW.md\`) from the **head branch**, so you can test instruction changes in the same pull request. Organisation custom instructions also apply. Add \`excludeAgent: "code-review"\` to a path-specific file's front matter to keep it out of reviews.
- **Model switching is not supported**; the product uses a tuned mix of models.
- Copilot is not guaranteed to spot every issue; keep human review.

**Pull request summaries** are a different feature: in the pull request description or a comment, choose the Copilot icon then *Summary* and Copilot writes a prose overview plus a bulleted list of key changes linked to lines. It helps reviewers understand the change; it does not review the code. English only, not available on Copilot Free, and it ignores existing description text.`,
    },
    {
      heading: 'Spaces and Spark',
      body: `**Copilot Spaces** organise the context Copilot uses to answer questions. A space can hold repositories, specific files or code, pull requests, issues, free-text notes or transcripts, images and uploads. GitHub-based sources stay in sync as they change, so the space becomes an "evergreen expert" on a project. You chat inside the space on GitHub.com, and you can reach a space's context from the IDE through the GitHub MCP server. Spaces can belong to a personal account (private, shared with specific users, or public view-only) or to an organisation (admin, editor, viewer or no access for members). Viewers only see sources they already have permission to read. Anyone with a Copilot licence, including Free, can create spaces; questions in a space are ordinary chat requests that consume credits.

Use a space when several people keep asking the same questions about the same material (onboarding, a subsystem, an incident), or when you want curated context that outlives a chat thread.

**GitHub Spark** is Copilot's tool for building and deploying small full-stack web applications ("sparks") from natural-language descriptions, with hosting and AI features handled for you. It targets prototypes, internal tools and personal apps rather than production systems with complex requirements, and its usage is metered separately from other Copilot features. For exam purposes, know what it is for and that it is distinct from the coding agent, which modifies your existing repositories.`,
    },
    {
      heading: 'Custom instructions: always-on context',
      body: `Instead of repeating "we use pnpm, Vitest and single quotes" in every prompt, write it once as **custom instructions**, which Copilot attaches automatically within their scope. Three levels:

| Type | Where | Scope |
|---|---|---|
| **Personal** | GitHub.com Copilot settings (CLI uses local files) | Your own conversations: language, tone, level of detail |
| **Repository** | \`.github/copilot-instructions.md\` (repository-wide); \`.github/instructions/NAME.instructions.md\` with an \`applyTo\` glob (path-specific); \`AGENTS.md\` (agent instructions shared with other tools) | Anyone working in the repository |
| **Organisation** | Organisation settings (Business and Enterprise) | All members; currently applies to Copilot on GitHub.com and code review, not local IDE sessions |

Good instructions are short, self-contained statements: project overview, frameworks and versions, coding and testing conventions, review focus areas. Avoid instructions that are unlikely to work, such as "always refer to styleguide.md in another repository", "answer in fewer than 1,000 characters" or persona-style demands in a large, diverse repo. Precedence on GitHub.com runs personal > repository (path-specific, then repository-wide, then agent) > organisation; most IDEs and the CLI simply combine all applicable files. Because instructions are sent with **every** request, they should apply broadly; AI is non-deterministic, so they are guidance, not a guarantee of compliance.

Which Copilot features read which files varies by surface (the "support for different types of custom instructions" reference): for example, Chat on GitHub.com reads personal, repository-wide and organisation instructions, while the cloud agent and code review also read path-specific and agent instructions.`,
    },
    {
      heading: 'Chat commands, options, limits and reusable prompt files',
      body: `Copilot Chat offers keywords that save typing and sharpen intent:

- **Slash commands** express intent: \`/explain\`, \`/fix\`, \`/tests\`, \`/doc\`, \`/optimize\`, \`/fixTestFailure\`, \`/new\` (new project), \`/clear\` or \`/new\` (fresh conversation), \`/help\`. On GitHub.com: \`/clear\`, \`/delete\`, \`/new\`, \`/rename\`. Type \`/\` to see what your surface offers.
- **Chat participants** (\`@workspace\`, \`@terminal\`, \`@vscode\`, \`@github\`, \`@azure\`) scope a question to a domain expert; \`@github\` unlocks GitHub skills such as web search (\`#web\`).
- **Chat variables** (\`#file\`, \`#selection\`, \`#function\`, \`#class\`, \`#project\`, line ranges like \`#MyFile.cs:66-72\`) pin context.
- **Options**: choose the AI model per conversation, attach images and PDFs, see *References* under a response to learn which files (and which instructions file) were used, and use *inline chat*, *quick chat* and *smart actions*.
- **Feedback**: thumbs up or down on each response; organisations can opt in to user feedback collection and preview features.
- **Limits** to keep in mind: a finite context window per model, chat and premium request allowances by plan, per-language quality differences, English-first optimisation, and the possibility that an irrelevant earlier turn pollutes the answer (delete that turn or start a new conversation).

**Prompt files** make good prompts reusable. A \`.prompt.md\` file (usually in \`.github/prompts/\`) is a standalone Markdown template for one task, optionally with input variables and links to other files. Unlike instructions, you **choose when to run it**: select it from the prompt picker or reference it in chat (for example \`/generate-unit-tests\`). Typical uses: a unit-test generator with your conventions baked in, an API-security review checklist, a README generator. Prompt files are supported in VS Code, Visual Studio, JetBrains and Xcode (not Copilot Chat on GitHub.com or the CLI). The GH-700 angle: instructions are always-on guidance, prompts are on-demand tasks, and **skills** are folders of instructions plus scripts that Copilot loads when relevant.`,
    },
  ],
  examples: [
    {
      title: 'Standardising reviews with an instructions file',
      description:
        'A payments team wants every Copilot review to check for PCI-relevant patterns and to comment in Spanish for their Madrid office. They add repository-wide instructions and a path-specific file for the `payments/**` directory. Because reviews read instructions from the head branch, the engineer tests the new rules on the same pull request that introduces them.',
      language: 'markdown',
      code: `<!-- .github/copilot-instructions.md -->
When performing a code review, respond in Spanish.
When performing a code review, apply the checks in /security/security-checklist.md.
Prefer early returns and avoid nested ternary operators.

<!-- .github/instructions/payments.instructions.md -->
---
applyTo: "payments/**/*.ts"
---
Never log full card numbers; mask all but the last four digits.
All monetary values use the Money type, never floating point.`,
      takeaway: 'Repository-wide and path-specific instructions give code review and chat team-specific standards without repeating them in prompts.',
    },
    {
      title: 'A reusable unit-test prompt file',
      description:
        'Developers keep writing slightly different prompts for tests, producing inconsistent suites. The team adds a prompt file that encodes the framework, naming style and coverage expectations. Anyone can now run it against a selected file from the prompt picker.',
      language: 'markdown',
      code: `<!-- .github/prompts/generate-unit-tests.prompt.md -->
---
mode: 'agent'
description: 'Generate Vitest unit tests for the selected module'
---
Generate Vitest unit tests for \${file}.
- Name tests "should <behaviour> when <condition>".
- Cover happy path, boundary values and thrown errors.
- Mock network and filesystem calls; never hit real services.
- Place the test next to the source as *.test.ts.`,
      takeaway: 'Prompt files are on-demand templates for a focused task; instructions are always-on. Use the right one for the job.',
    },
    {
      title: 'Expecting a review from a summary (a realistic mistake)',
      description:
        'A developer generates a pull request summary with Copilot and tells the team the change "passed Copilot review". Nobody had requested a review: the summary only describes what changed. The team then adds a branch ruleset that automatically requests Copilot code review on every pull request, with "review new pushes" enabled, and keeps the required human approval because Copilot reviews are comments by default.',
      takeaway: 'Summaries describe; reviews critique. Automatic review needs a ruleset, and Copilot approvals do not count unless explicitly enabled.',
    },
    {
      title: 'Onboarding with a Space',
      description:
        'New engineers repeatedly ask how the billing subsystem works. A lead creates an organisation-owned Copilot Space containing the billing repository, the architecture decision records, two key pull requests and a transcript of a design review, then shares it with the team as viewers. Questions asked in the space are grounded in that context and stay current as the repository changes; viewers still only see sources they have permission to access.',
      takeaway: 'Spaces package durable, shareable context so answers are consistent and knowledge outlives individual chats.',
    },
  ],
  keyPoints: [
    'Copilot code review posts severity-labelled comments with one-click suggested changes; it is a Comment review by default and does not count toward required approvals unless approvals are enabled.',
    'Automatic reviews are configured via personal settings or branch rulesets ("Automatically request Copilot code review", optionally "Review new pushes" and "Review draft pull requests"); effort levels are Lite, Balanced (default) and Max.',
    'Code review reads .github/copilot-instructions.md, path-specific *.instructions.md, AGENTS.md and organisation instructions from the head branch; lock files, logs, SVGs and generated code are excluded.',
    'Pull request summaries describe changes in the description or a comment; they are not reviews, are English-only and are unavailable on Copilot Free.',
    'Copilot Spaces bundle repositories, files, issues, pull requests, notes and uploads as shared, auto-updating context; viewers only see sources they can access.',
    'GitHub Spark builds and hosts small web apps from natural language; it is distinct from the coding agent, which changes existing repositories.',
    'Custom instructions are always-on at personal, repository or organisation level; prompt files (.github/prompts/*.prompt.md) are reusable templates you invoke on demand.',
    'Chat keywords: slash commands (/explain, /fix, /tests, /doc, /optimize), @ participants (@workspace, @terminal, @github), # variables (#file, #selection); give feedback with thumbs up or down and check References to see what context was used.',
  ],
  flashcards: [
    { front: 'By default, does a Copilot code review count toward required pull request approvals?', back: 'No. It is a "Comment" review unless Copilot approvals are enabled at repository, organisation and enterprise level.' },
    { front: 'How do you make Copilot review every pull request in a repository automatically?', back: 'Create a branch ruleset with "Automatically request Copilot code review" (optionally "Review new pushes" and "Review draft pull requests").' },
    { front: 'Name the three Copilot code review effort levels.', back: 'Lite, Balanced (default) and Max.' },
    { front: 'From which branch does Copilot code review read custom instructions?', back: 'The head branch of the pull request, so instruction changes can be tested in the same PR.' },
    { front: 'What is the difference between a pull request summary and a code review?', back: 'A summary describes the changes for reviewers; a code review critiques the code with comments and suggested fixes.' },
    { front: 'Where do repository-wide custom instructions live?', back: 'In .github/copilot-instructions.md.' },
    { front: 'How do you scope custom instructions to certain files?', back: 'Create .github/instructions/NAME.instructions.md with an applyTo glob in the YAML front matter, for example applyTo: "**/*.ts".' },
    { front: 'How do prompt files differ from custom instructions?', back: 'Prompt files (.prompt.md in .github/prompts/) are reusable task templates you invoke on demand; instructions apply automatically to every request in scope.' },
    { front: 'What can a Copilot Space contain?', back: 'Repositories, code and files, pull requests, issues, free-text notes or transcripts, images and uploads; GitHub sources stay in sync.' },
    { front: 'What is GitHub Spark for?', back: 'Building and hosting small full-stack web apps from natural-language descriptions, mainly prototypes and internal tools.' },
    { front: 'Which chat keyword scopes a question to the whole project in VS Code?', back: '@workspace (chat participant); #project is the equivalent variable in some IDEs.' },
    { front: 'Which files are excluded from Copilot code review?', back: 'Dependency lock files (package-lock.json, Gemfile.lock), log files, SVGs, minified or bundled JS, node_modules, dist, vendor and generated directories.' },
  ],
  quiz: [
    {
      question:
        'A repository requires one approval before merging. Copilot code review is requested on every pull request and leaves comments, yet pull requests still show "review required". Why?',
      options: [
        'Copilot reviews only count when the Max effort level is used',
        'Copilot reviews are Comment reviews by default and do not satisfy required approvals unless Copilot approvals are explicitly enabled',
        'The repository must be on Copilot Enterprise',
        'Copilot only approves pull requests it authored',
      ],
      correct: [1],
      explanation:
        'Approval counting is off by default and must be enabled at repository, organisation and enterprise level. Effort levels and plan tier do not change this, and Copilot does not approve its own pull requests.',
    },
    {
      question:
        'An organisation wants Copilot to review every pull request across selected repositories, including each new push. What is the MOST appropriate configuration?',
      options: [
        'Ask each developer to request Copilot as a reviewer manually',
        'An organisation branch ruleset targeting those repositories with "Automatically request Copilot code review" and "Review new pushes" enabled',
        'An organisation custom instruction stating "review every pull request"',
        'Enabling the Copilot CLI policy',
      ],
      correct: [1],
      explanation:
        'Rulesets are the mechanism for automatic reviews at repository or organisation scope. Manual requests are inconsistent, instructions guide review content rather than trigger reviews, and the CLI policy is unrelated.',
    },
    {
      question:
        'A team wants Copilot Chat to always use their logging conventions when working in the `services/` directory, but not elsewhere. Which approach is MOST appropriate?',
      options: [
        'A personal instruction in each developer\'s GitHub settings',
        'A path-specific file .github/instructions/services.instructions.md with applyTo: "services/**"',
        'A prompt file that developers remember to run',
        'A Copilot Space containing the logging guide',
      ],
      correct: [1],
      explanation:
        'Path-specific instructions apply automatically only to matching files. Personal instructions are per user, prompt files are on demand, and Spaces are for chat context on GitHub.com rather than automatic IDE guidance.',
    },
    {
      question: 'Which TWO statements about prompt files are correct? (Select two)',
      options: [
        'They use the .prompt.md extension and typically live in .github/prompts/',
        'They are sent automatically with every chat request in the repository',
        'You invoke them for a specific interaction, for example from the prompt picker or by referencing them in chat',
        'They are only supported in Copilot Chat on GitHub.com',
      ],
      correct: [0, 2],
      explanation:
        'Prompt files are on-demand templates stored as .prompt.md files. Automatic inclusion describes custom instructions, and prompt files are supported in IDEs (VS Code, Visual Studio, JetBrains, Xcode), not on GitHub.com.',
    },
    {
      question:
        'A developer wants reviewers to understand a large pull request quickly without changing how the code is reviewed. Which feature should they use?',
      options: ['Copilot pull request summary', 'Copilot code review at Max effort', 'A Copilot Space', 'GitHub Spark'],
      correct: [0],
      explanation:
        'Summaries generate a prose overview and bulleted key changes in the description or a comment. Code review critiques the code, Spaces organise chat context, and Spark builds apps.',
    },
    {
      question:
        'Several engineers keep asking Copilot the same architecture questions about a subsystem and get inconsistent answers. Which option BEST provides shared, up-to-date context?',
      options: [
        'Each engineer adds personal custom instructions',
        'An organisation-owned Copilot Space with the repository, ADRs and key pull requests, shared with the team',
        'A prompt file that pastes the architecture document',
        'Blocking suggestions that match public code',
      ],
      correct: [1],
      explanation:
        'Spaces bundle curated sources that stay in sync and can be shared with access levels. Personal instructions are not shared, a prompt file is a static one-off, and the public-code filter is a licensing control.',
    },
  ],
  statements: [
    { text: 'Copilot code review lets you choose which AI model performs the review.', isTrue: false, explanation: 'Model switching is not supported; the product uses a tuned mix of models, although you can choose an effort level.' },
    { text: 'Copilot code review reads custom instructions from the pull request\'s head branch.', isTrue: true, explanation: 'This lets you test instruction changes in the same pull request before merging.' },
    { text: 'Pull request summaries are available on Copilot Free.', isTrue: false, explanation: 'The feature is not available in Copilot Free.' },
    { text: 'Anyone with a Copilot licence, including Copilot Free, can create a Copilot Space.', isTrue: true, explanation: 'Spaces are available to all licensed users; organisation policy affects sharing and availability.' },
    { text: 'Organisation custom instructions currently apply to local IDE chat sessions.', isTrue: false, explanation: 'They are supported for sessions on GitHub.com and for code review, not for local client sessions.' },
    { text: 'Package-lock.json and other dependency lock files are skipped by Copilot code review.', isTrue: true, explanation: 'Dependency management files, logs, SVGs and generated code are excluded from review.' },
    { text: 'Typing / in the chat prompt box lists the slash commands available in your current surface.', isTrue: true, explanation: 'Available commands vary by IDE and context, so the picker is the authoritative list.' },
  ],
  resources: [
    { label: 'GitHub Copilot code review (concept)', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review' },
    { label: 'Custom instructions for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/custom-instructions' },
    { label: 'Prompt files for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/prompt-files' },
    { label: 'GitHub Copilot Chat cheat sheet', url: 'https://docs.github.com/en/copilot/reference/chat-cheat-sheet' },
  ],
};
