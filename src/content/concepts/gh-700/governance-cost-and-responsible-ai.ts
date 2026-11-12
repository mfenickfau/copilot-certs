import type { Concept } from '../../types';

export const governanceCostAndResponsibleAi: Concept = {
  id: 'governance-cost-and-responsible-ai',
  title: 'Budgets, Token Usage, Secrets and Responsible AI Guardrails',
  summary:
    'How a business professional keeps GitHub Copilot and agentic work inside the guardrails: AI credits and budgets, token-aware habits, organisational standards, secrets management, governance and privacy controls, and the Responsible AI principles GitHub follows.',
  certs: ['gh-700', 'gh-300'],
  domains: ['gh-700-1', 'gh-300-1'],
  outcomes: ['gh-700-1-1-1', 'gh-700-1-1-2', 'gh-700-1-1-3', 'gh-700-1-1-4', 'gh-700-1-1-5', 'gh-700-1-1-6', 'gh-300-1-2-2'],
  tags: ['governance', 'budgets', 'ai-credits', 'secrets', 'responsible-ai', 'policies'],
  difficulty: 'foundations',
  diagram: 'layered-guardrails',
  sections: [
    {
      heading: 'AI credits and budget guardrails',
      body: `GitHub Copilot usage is measured in **AI credits**, where 1 AI credit = USD 0.01. Every plan includes a monthly allowance; organisations pool the credits that come with each licence. The amount a task consumes depends on the model chosen (each model has its own per-token price) and on how many tokens the interaction processes, so a long autonomous session on a frontier model costs far more than a quick question on a lightweight model.

Budget guardrails exist at several layers, and the exam expects you to pick the right one for a scenario:

- **Billing budgets** (Settings > Billing > Budgets and alerts) can be product-level, SKU-level (for example Copilot AI credits, Copilot cloud agent) or a **Bundled AI credits budget** across every AI-credit SKU. You can receive alerts at 75%, 90% and 100%, and optionally **Stop usage when budget limit is reached**. User-level budgets always hard-stop and are evaluated first.
- **Automation limits**: each Copilot automation can carry per-run (minimum 30 credits), daily, weekly and monthly AI credit limits. Only the per-run limit stops a run already in progress; the others prevent new runs starting.
- **Agentic workflow caps**: the \`max-ai-credits\` frontmatter field caps inference for one run (default 1,000 AI credits), and \`gh aw logs\` / \`gh aw audit\` report estimated spend.
- **Session limits**: in Copilot CLI, \`/limits set max-ai-credits NUMBER\` (or \`--max-ai-credits\`) stops a session cleanly when the soft limit is reached.

Avoid overlapping hard budgets (a product budget plus a SKU budget for the same spend) because the first one exhausted blocks everyone who relies on the feature.`,
    },
    {
      heading: 'Evaluating token usage',
      body: `Tokens are the unit the model reads and writes; credits follow tokens. Everything in the **context window** counts: system instructions and tool definitions, your prompts, Copilot's responses, and every tool call and result. Long sessions, large attachments and big tool outputs inflate the input tokens sent on every turn.

Practical habits that reduce usage without reducing quality:

- **Match the model to the task**: lighter models for routine, well-scoped work; reasoning models for architecture, debugging and multi-step analysis. Use Auto model selection or Copilot Fusion when unsure.
- **Keep context lean**: start a new conversation when you switch problems (\`/new\` or \`/clear\`), use \`/compact\` to summarise a long CLI session, and check usage with \`/context\`.
- **Preserve the cache**: cached tokens are typically billed at about 10% of the normal input price. Switching models, changing reasoning effort or toggling tools mid-session invalidates the cache.
- **Bring only needed tools**: a full MCP server's tool list is sent on every request.
- **Write a clear stopping condition** so the agent does not keep refactoring after the goal is met.
- **Review your own patterns** with \`/chronicle cost-tips\`, which analyses recent sessions for expensive habits.

On the exam, "evaluate token usage" questions usually reward the answer that reduces tokens *structurally* (new session, smaller model, lean tools) over answers that simply buy more credits.`,
    },
    {
      heading: 'Organisational standards and secrets management',
      body: `Standards are enforced with a mix of instructions, policies and repository rules:

- **Custom instructions** encode conventions: repository-wide (\`.github/copilot-instructions.md\`), path-specific (\`.github/instructions/*.instructions.md\`), agent instructions (\`AGENTS.md\`) and **organisation custom instructions** that apply to every member for cloud sessions and code review.
- **Copilot policies** at organisation and enterprise level turn surfaces on or off (Copilot CLI, the Copilot app, Copilot cloud agent, MCP servers, model availability) and control billing choices such as "Allow use of Copilot CLI billed to the organization".
- **Rulesets and branch protection** force review and status checks before anything reaches the default branch.

Secrets never belong in a prompt. Automation sessions and their prompts are visible to everyone with read access to the repository, so the documented approach is to store credentials as secrets:

- **Agents secrets and variables** (Settings > Secrets and variables > **Agents**) are passed to Copilot cloud agent and automations; names prefixed \`COPILOT_MCP_\` are only exposed to MCP servers. Values are masked in session logs. Repository-level values override organisation-level ones with the same name.
- **Actions secrets** hold engine credentials for agentic workflows (for example \`COPILOT_GITHUB_TOKEN\` or a third-party API key). In organisation-owned repositories the built-in \`GITHUB_TOKEN\` with \`copilot-requests: write\` avoids managing a personal token at all. Agentic workflows keep secrets in isolated downstream jobs, outside the agent runtime.
- **Secret scanning and push protection** block credentials from being committed in the first place; Copilot cloud agent also runs secret scanning on code it generates.`,
    },
    {
      heading: 'Governance, privacy, usage and risk controls',
      body: `Governance questions ask "which control addresses this risk?" Know the toolbox:

| Risk | Control |
|---|---|
| Copilot reads sensitive files | **Content exclusion** (repository, organisation or enterprise). It is a guardrail for GitHub-controlled tools, not a filesystem security boundary. |
| Agents act on untrusted input | Automations ignore events from users without write access by default; hidden HTML comments are stripped from issues before they reach the agent. |
| Unsupervised writes | Read-only tokens by default; **safe outputs** in agentic workflows; "Only this issue" scoping for automations; draft PRs that a human must review and merge. |
| Loss of oversight | Session logs, signed and co-authored commits linking to the session, audit log events, the Agents tab "All sessions" view. |
| Session data leaving the device | The "Store local sessions in the Cloud" policy governs whether CLI and app sessions sync; synced data is private to the user. |
| Runaway spend | Budgets, automation limits, \`max-ai-credits\`, session limits. |

Privacy facts to remember: prompts and responses on Business and Enterprise plans are not used to train models, local sessions are unshared by default, and GitHub Actions-based cloud sessions are shared with everyone who can access the repository.`,
    },
    {
      heading: 'Applying Responsible AI principles',
      body: `GitHub states that its agentic features adhere to Microsoft's six Responsible AI principles: **fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability**. The "application cards" for Copilot Chat, inline suggestions and Copilot Agents explain purposes, capabilities and limitations so that teams can make informed deployment choices.

For a business professional, applying the principles means:

- **Human oversight**: you remain responsible for defining the goal, granting appropriate access and reviewing the agent's work. Copilot cannot approve or merge its own pull requests.
- **Transparency**: keep rationale visible. Automations attach a rationale and confidence level to issue changes; session logs show reasoning and tool use.
- **Accountability**: personal automations act under your identity; shared automations act as Copilot and require an extra approval on pull requests.
- **Reliability and safety**: validate outputs the way you would a colleague's work, start new automations on a small scope, and set stopping conditions.
- **Privacy and security**: least-privilege tools, secrets outside prompts, firewalls and sandboxes for autonomous runs.

Distractors on the exam typically describe "turning off review to move faster" or "letting the agent approve its own work". Those always conflict with the principles.`,
    },
  ],
  examples: [
    {
      title: 'A shared automation blows through the monthly pool',
      description:
        'A program manager creates a shared weekly-report automation on a frontier model with no limits. Three weeks later the organisation receives a 90% budget alert. The fix is layered: set a per-run limit (for example 100 AI credits) so a single run cannot spiral, add a monthly limit on the automation, switch the model to a mid-tier option, and keep the organisation-level bundled AI credits budget with alerts but without a hard stop so unrelated teams are not blocked.',
      takeaway: 'Control spend at the automation that causes it; use account-wide hard stops sparingly because they block everyone.',
    },
    {
      title: 'The API key in the prompt (a realistic mistake)',
      description:
        'An analyst writes an automation prompt that says "use key sk-live-... to query the billing API". Because automation sessions are visible to everyone with read access to the repository, the key is now exposed. The fix is to rotate the key, store it as an Agents secret with the COPILOT_MCP_ prefix, reference it from the repository MCP configuration, and remove it from the prompt.',
      language: 'text',
      code: `Wrong:  "Call the billing API with key sk-live-9f3... and summarise invoices."
Right:  Settings > Secrets and variables > Agents > New repository secret
        Name: COPILOT_MCP_BILLING_API_KEY
        Prompt: "Use the billing MCP server to list this month's invoices
                 and summarise totals by customer."`,
      takeaway: 'Secrets go in Agents or Actions secrets, never in prompts or instructions files.',
    },
    {
      title: 'Choosing the right control for sensitive HR files',
      description:
        'A people-operations lead wants Copilot to help with a repository that also holds salary spreadsheets. Deleting the files or disabling Copilot for the whole organisation are both overkill. Content exclusion for the /hr/compensation path stops Copilot tools reading those files, while rulesets keep anyone from pushing changes without review.',
      takeaway: 'Content exclusion scopes what Copilot can see; rulesets and secrets scope what anyone can do.',
    },
  ],
  keyPoints: [
    '1 AI credit = USD 0.01; cost depends on the model chosen and the tokens processed.',
    'Budgets exist at billing level (product, SKU, bundled AI credits, user), automation level (per run, daily, weekly, monthly) and run level (max-ai-credits, session limits).',
    'Only a per-run limit stops an automation run already in progress; daily/weekly/monthly limits prevent new runs.',
    'Reduce tokens structurally: right-size the model, start new sessions per task, compact long sessions, enable only needed tools, preserve the cache.',
    'Secrets belong in Agents secrets (COPILOT_MCP_ prefix for MCP servers) or Actions secrets; automation prompts and logs are visible to repository readers.',
    'Content exclusion, least-privilege tools, safe outputs, read-only tokens, session logs and audit logs are the governance toolbox.',
    'Responsible AI at GitHub follows Microsoft\'s six principles; humans stay accountable, and Copilot cannot approve or merge its own pull requests.',
  ],
  flashcards: [
    { front: 'What is one AI credit worth?', back: 'USD 0.01. Usage depends on the model and the number of tokens processed.' },
    { front: 'Which automation AI credit limit stops a run that is already in progress?', back: 'The per-run limit (minimum 30 credits). Daily, weekly and monthly limits only prevent new runs from starting.' },
    { front: 'What is the default max-ai-credits cap for one GitHub Agentic Workflow run?', back: '1,000 AI credits, set in the workflow frontmatter.' },
    { front: 'Name three habits that reduce token usage.', back: 'Start a new session when switching tasks, use /compact on long CLI sessions, choose a lighter model for routine work (also: fewer tools, stable settings to preserve the cache).' },
    { front: 'Where do you store a credential that an MCP server used by Copilot cloud agent needs?', back: 'As an Agents secret named with the COPILOT_MCP_ prefix (Settings > Secrets and variables > Agents).' },
    { front: 'Why must secrets never appear in an automation prompt?', back: 'Automation sessions, including prompts and logs, are visible to everyone with read access to the repository.' },
    { front: 'Is content exclusion a security boundary?', back: 'No. It is a guardrail for GitHub-controlled tools and is not guaranteed to be respected by third-party MCP servers or indirect file access.' },
    { front: 'Which six Responsible AI principles does GitHub say it follows?', back: 'Fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability.' },
    { front: 'Which policy allows an organisation to pay for Copilot CLI and agentic workflow usage instead of individuals?', back: '"Allow use of Copilot CLI billed to the organization" in Copilot policy settings, combined with copilot-requests: write in the workflow permissions.' },
    { front: 'What happens when a budget without "Stop usage when budget limit is reached" is exceeded?', back: 'You are notified by email (and banner), but usage continues.' },
  ],
  quiz: [
    {
      question:
        'You manage a shared automation that triages issues nightly. Finance asks you to make sure a single malfunctioning run can never consume more than 150 AI credits, while still allowing the automation to run every night. What should you configure?',
      options: [
        'A monthly AI credit limit of 150 on the automation',
        'A per-run AI credit limit of 150 on the automation',
        'An organisation bundled AI credits budget of 150 with "Stop usage when budget limit is reached"',
        'A content exclusion for the issues directory',
      ],
      correct: [1],
      explanation:
        'Only the per-run limit stops a run in progress at the threshold. A monthly limit would block all nightly runs after the first one or two, an organisation-wide hard budget would block every team, and content exclusion controls what Copilot can read, not what it spends.',
    },
    {
      question:
        'A business analyst notices her Copilot CLI sessions use far more AI credits than a colleague\'s for similar tasks. She keeps one session open all week, switches models when a response is slow, and attaches whole folders to each prompt. Which TWO changes would most reduce her token usage? (Select two)',
      options: [
        'Start a new session when she switches to an unrelated task',
        'Upgrade to a higher Copilot plan to receive more included credits',
        'Pick one model for the session and stay with it so the cache is reused',
        'Enable every available MCP server so Copilot needs fewer prompts',
      ],
      correct: [0, 2],
      explanation:
        'Fresh sessions per task and a stable model (cache reuse) cut input tokens. Buying more credits does not reduce usage, and enabling more MCP servers adds tool definitions to every request, increasing tokens.',
    },
    {
      question:
        'A program manager wants Copilot cloud agent to call an internal ticketing MCP server that needs an API token. Which approach follows GitHub guidance?',
      options: [
        'Paste the token into the automation prompt so Copilot can read it',
        'Add the token to the repository README under a "Copilot settings" heading',
        'Create an Agents secret named COPILOT_MCP_TICKETING_TOKEN and reference it in the repository MCP configuration',
        'Store the token as a Codespaces secret, which the cloud agent inherits',
      ],
      correct: [2],
      explanation:
        'Agents secrets with the COPILOT_MCP_ prefix are the documented mechanism and are only exposed to MCP servers. Prompts and READMEs are visible to repository readers, and Copilot cloud agent does not receive Codespaces, Actions or Dependabot secrets.',
    },
    {
      question:
        'Leadership is concerned that an agent working on a repository could read a folder containing confidential supplier contracts. Which control is the MOST appropriate first step?',
      options: [
        'Disable Copilot for the entire organisation',
        'Configure content exclusion for the contracts path at repository or organisation level',
        'Create a ruleset that requires two approvals on the default branch',
        'Set a user-level AI credits budget for everyone with access to the repository',
      ],
      correct: [1],
      explanation:
        'Content exclusion stops Copilot tools using those files as context. Disabling Copilot is disproportionate, rulesets control merges rather than reading, and budgets control spend.',
    },
    {
      question:
        'A team lead proposes letting a shared automation approve and merge its own pull requests to save review time. Which Responsible AI principle does this most directly undermine, according to GitHub\'s guidance?',
      options: [
        'Inclusiveness, because fewer people are involved',
        'Accountability, because human oversight and review of outputs is removed',
        'Fairness, because the model may prefer certain code styles',
        'Privacy, because merged code becomes public',
      ],
      correct: [1],
      explanation:
        'GitHub\'s agent guidance centres on human oversight and review: Copilot cannot approve or merge its own pull requests, and shared-automation PRs need an extra approval. The other options describe different principles that are not the primary concern here.',
    },
  ],
  statements: [
    { text: 'One AI credit equals USD 0.01 and the credits consumed depend on the model used.', isTrue: true, explanation: 'Models have different per-token prices, so the same task costs different amounts on different models.' },
    { text: 'A daily AI credit limit on an automation stops a run that is already in progress once the daily total is reached.', isTrue: false, explanation: 'Daily, weekly and monthly limits only prevent new runs from starting; use a per-run limit to cap a run in progress.' },
    { text: 'Copilot cloud agent can use secrets configured for GitHub Actions, Codespaces and Dependabot.', isTrue: false, explanation: 'Only the dedicated Agents secrets and variables are passed to Copilot cloud agent.' },
    { text: 'Switching models in the middle of a session invalidates the cache and increases token costs.', isTrue: true, explanation: 'A different model cannot reuse another model\'s cache, so the full context is re-sent.' },
    { text: 'Content exclusion guarantees that no file access of any kind can reach excluded files.', isTrue: false, explanation: 'It is a guardrail for GitHub-controlled tools, not a filesystem security boundary.' },
    { text: 'GitHub states that its agentic features follow Microsoft\'s six Responsible AI principles.', isTrue: true, explanation: 'Fairness, reliability and safety, privacy and security, inclusiveness, transparency and accountability are listed in the Copilot Agents application card.' },
  ],
  resources: [
    { label: 'Setting up budgets to control spending on metered products', url: 'https://docs.github.com/en/billing/managing-your-billing/using-budgets-control-spending' },
    { label: 'Optimizing your AI usage to maximize efficiency and reduce cost', url: 'https://docs.github.com/en/copilot/tutorials/optimize-ai-usage' },
    { label: 'Configure secrets and variables for Copilot cloud agent', url: 'https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/configure-secrets-and-variables' },
    { label: 'Application card: GitHub Copilot Agents (responsible use)', url: 'https://docs.github.com/en/copilot/responsible-use/agents' },
  ],
};
