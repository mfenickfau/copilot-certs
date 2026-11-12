import type { Concept } from '../../types';

export const dataFlowAndSuggestionLifecycle: Concept = {
  id: 'data-flow-and-suggestion-lifecycle',
  title: 'How Copilot Handles Data: Prompt Building, Proxy Filtering and the Suggestion Lifecycle',
  summary:
    'The end-to-end path of a Copilot request: how the client assembles a prompt from your editor context, how GitHub\'s proxy filters it, what the model does, which post-processing filters run on the way back, what is retained and for how long, and why LLM limitations shape every step.',
  certs: ['gh-300'],
  domains: ['gh-300-3'],
  outcomes: ['gh-300-3-1-1', 'gh-300-3-1-2', 'gh-300-3-1-3', 'gh-300-3-2-1', 'gh-300-3-2-2'],
  tags: ['data-flow', 'proxy', 'content-filter', 'retention', 'fill-in-the-middle', 'llm-limitations', 'privacy'],
  difficulty: 'intermediate',
  diagram: 'layered-guardrails',
  sections: [
    {
      heading: 'Inbound: from keystroke to prompt',
      body: `The exam describes the suggestion lifecycle as an **inbound** flow (your context to the model) and an **outbound** flow (the model's answer back to you). Being able to narrate it in order is the point of this concept.

**1. Context gathering and prompt building (on the client).** When you pause typing, the Copilot extension assembles a prompt from:
- code **before and after the cursor**, using the **Fill-in-the-Middle (FIM)** technique so the model completes a gap rather than only continuing text;
- the **file name, path and language**, so suggestions fit the file type;
- content from **adjacent open tabs** and information about project structure, frameworks and dependencies;
- for Chat: your message, the **chat history**, any \`#\` references or \`@\` participants, selected code, and **custom instructions** (\`.github/copilot-instructions.md\`, path-specific files, personal and organisation instructions);
- for agents: tool definitions and the results of tool calls (file reads, searches, command output).

Content covered by **content exclusions** is left out at this stage, and large tool outputs may be summarised or saved to a file so they do not swamp the context window.

**2. Secure transmission.** The prompt travels over **HTTPS/TLS** to GitHub.

**3. Proxy filtering.** The request lands on a **proxy service hosted in a GitHub-owned Microsoft Azure tenant**. The proxy filters traffic: it blocks attempts to hack the prompt or manipulate the model into revealing how it works, and it applies **content filtering** before anything reaches the model. The exam calls out two filter categories here: **toxicity** (hate speech, offensive or inappropriate content) and **personal data** (names, addresses, identifiers), plus the general check that the request is relevant to coding.

**4. Model inference.** The filtered prompt goes to the selected large language model, hosted by GitHub's model providers (for example Azure OpenAI and other hosted models; the *model hosting* reference lists where each runs). The model predicts a completion or response; it has no access to your repository beyond what the prompt contains, and it does not run your code.`,
    },
    {
      heading: 'Outbound: post-processing, delivery and feedback',
      body: `**5. Post-processing and response validation.** The response passes back through the same filters in reverse plus a set of checks the exam expects you to name:
- **Toxicity and harmful-content filtering** removes offensive output.
- **Security vulnerability filtering** targets common insecure patterns such as hard-coded credentials, SQL injection and path injection; flagged content is truncated or discarded.
- **Code quality checks** for obvious bugs.
- **Duplicate detection (public-code filter).** If the policy is set to **Block**, a suggestion whose roughly 150 characters of surrounding code closely matches public code on GitHub is suppressed; if set to **Allow**, matching suggestions are shown with a **code reference** (repository URL and licence) in the IDE log or beneath a chat answer. Typically fewer than one percent of inline suggestions match.

**6. Delivery and the feedback loop.** Only responses that pass all checks reach the editor as ghost text or a chat answer. Your action, accept, modify, reject or thumbs up or down, is recorded as **engagement telemetry** that informs the product and, where you have allowed it, model improvement.

**7. Repeat.** Each new prompt starts the cycle again; in Chat the conversation history travels with it.

Two implications follow. First, latency and quality are partly determined before the model sees anything: poor context in, poor suggestion out. Second, the filters are a **layered defence**, not a guarantee. The application cards are explicit that output may still be incorrect, insecure or biased, which is why human review remains mandatory.`,
    },
    {
      heading: 'Data usage, sharing and retention',
      body: `What GitHub keeps depends on the feature and the plan. The exam-relevant defaults:

| Data | Handling |
|---|---|
| **Prompts and suggestions for code completions** | Transmitted to produce the suggestion and **discarded once it is returned**; not retained |
| **Copilot Chat in the IDE and Copilot CLI** (Business and Enterprise) | Prompts and responses not retained by default |
| **Copilot on GitHub.com and GitHub Mobile** | Prompts and responses retained for up to **28 days** by default; GitHub Actions-based agent session data is also retained for 28 days, while cloud-sandbox sessions persist with the account so they can be resumed |
| **User engagement data** (accepts, rejects, errors, feature usage) | Collected as telemetry and used for product metrics and dashboards |
| **Model training** | **Copilot Business and Enterprise customer data is never used to train models**, protected by the Data Protection Agreement. For Free, Pro, Pro+ and Max, GitHub may use interactions to train and improve models unless the individual **opts out** in their Copilot settings |
| **Content exclusions** | Excluded files are not sent as context; the client sends only the repository URL to fetch the policy, and that URL is not logged |
| **Web search** | When enabled, a Bing query derived from your prompt is sent to Microsoft under its privacy statement |
| **Bring your own key (BYOK) or a custom model provider** | Prompts go directly to that provider under its terms; GitHub's retention rules no longer apply |

Session data is a newer dimension: locally run CLI and Copilot app sessions are stored under \`~/.copilot/session-state/\` and, by default, **synced** to your GitHub account (controlled for organisations by the *Store local sessions in the cloud* policy). Syncing does not share a session; sharing is explicit, and administrators who allow syncing do not gain access to your sessions. Some third-party models route through zero-data-retention endpoints, while others may retain data for safety classifiers; the plans page documents these exceptions per model.

The compliance one-liner: on Business and Enterprise, your code is used to serve you, not to teach the model, and completion prompts are gone as soon as the suggestion arrives.`,
    },
    {
      heading: 'Limitations of LLMs and of Copilot',
      body: `Understanding the pipeline explains Copilot's limits, which the exam lists separately:

- **Finite context window.** The model sees a fixed number of tokens. Older Learn material quotes a few thousand tokens for completions and about 4k for Chat; modern models offer far more (some up to a million tokens in the CLI), but the principle holds: what is not in the window does not exist for the model. Compaction summarises history when it fills, losing detail.
- **No execution, no verification.** The model predicts; it does not compile, run tests or query your database. Only agents with tools do that, and they still rely on your review.
- **Training cut-off and gaps.** Knowledge of libraries, APIs and language versions is frozen at training time and uneven across languages and frameworks. Niche or brand-new technologies get weaker suggestions.
- **Bias and outdated patterns** inherited from public code.
- **Hallucination** of plausible but non-existent APIs.
- **Weak at high-level design and novel problems**; strong at code-level, repetitive and well-trodden tasks.
- **English-first optimisation**; other natural languages may perform less well.
- **Non-determinism**: the same prompt can yield different answers; custom instructions are not always followed identically.
- **Rate limits and credits**: heavy or premium usage can be throttled or exhaust allowances.
- **Matches to public code** and the licensing questions they raise.

Mitigations map one-to-one: feed the right context and keep it relevant, verify against documentation, test everything, keep filters and policies on, and treat Copilot as a tool rather than a replacement for expertise.`,
    },
  ],
  examples: [
    {
      title: 'Narrating a completion end to end',
      description:
        'A developer types a comment "// parse ISO-8601 dates from the CSV header" in `importer.ts` with `csv-utils.ts` open in another tab. The extension builds a FIM prompt with the code around the cursor, the file name and language, and snippets from the open tab; sends it over HTTPS to the GitHub proxy in Azure; the proxy screens for prompt manipulation, toxicity and personal data; the model returns a function; the response is checked for harmful content and insecure patterns and, because the organisation blocks public-code matches, the ~150-character match check passes; the suggestion appears as ghost text; the developer presses Tab and the acceptance is logged as telemetry. The prompt itself is discarded once the suggestion returns.',
      takeaway: 'Context gathering, proxy filtering, inference, post-processing and feedback: know the order and what happens at each step.',
    },
    {
      title: 'Why a suggestion silently vanished',
      description:
        'A developer types `function fizzBuzz()` and gets nothing, while a colleague on a personal plan gets a full implementation. The organisation has set "Suggestions matching public code" to Block; the canonical fizz-buzz implementation matches public code, so the duplicate detection filter suppressed it. The colleague\'s personal setting is Allow, so they received the suggestion along with a code reference in the VS Code "GitHub Copilot Log (Code References)" output channel.',
      takeaway: 'The public-code filter is an outbound post-processing step; "Block" can remove suggestions entirely, "Allow" shows them with references.',
    },
    {
      title: 'The compliance question answered wrongly (a realistic mistake)',
      description:
        'A security officer blocks a Copilot Business rollout, claiming "GitHub will train models on our proprietary code." The engineering lead corrects the record using the documentation: Business and Enterprise customer data is not used to train models under the Data Protection Agreement; completion prompts are discarded once a suggestion is returned; Chat prompts in the IDE and CLI are not retained by default, and Copilot on GitHub.com retains prompts for up to 28 days. The officer\'s concern would have been valid for an individual Pro user who had not opted out of training-data use.',
      takeaway: 'Retention and training rules differ by feature and plan; Business and Enterprise data is never used for model training.',
    },
    {
      title: 'A context-window symptom',
      description:
        'In a long Chat session a developer pasted an entire 3,000-line module in several messages and then asks a question about a function from the first message. The answer is generic and wrong. The earlier content fell out of the effective window (or was compacted). Starting a fresh conversation and attaching only the relevant file with #file restores accuracy.',
      takeaway: 'The model only knows what is inside the context window; manage what goes in rather than assuming it remembers everything.',
    },
  ],
  keyPoints: [
    'Inbound flow: client gathers context (code around the cursor via Fill-in-the-Middle, file name and language, open tabs, project info, chat history, instructions), sends the prompt over HTTPS to a GitHub-owned proxy in Azure, which filters prompt-hacking attempts, toxicity and personal data before the model.',
    'Outbound flow: responses pass toxicity filtering, security-vulnerability and code-quality checks and the optional public-code duplicate detection filter before delivery; your accept or reject feeds a telemetry loop.',
    'Code completion prompts are discarded once a suggestion is returned; IDE Chat and CLI prompts are not retained by default; Copilot on GitHub.com and Mobile retains prompts for up to 28 days.',
    'Copilot Business and Enterprise customer data is never used to train models; individual-plan users may have interactions used for training unless they opt out.',
    'The public-code filter compares a suggestion plus about 150 characters of surrounding code against public GitHub code; Block suppresses matches, Allow shows code references.',
    'Content exclusions remove files from prompts; BYOK or custom model providers send prompts directly to that provider under its own terms.',
    'LLM limitations: finite context window, no execution or verification, training cut-off and uneven language coverage, bias, hallucination, weak high-level design, non-determinism, rate limits.',
    'Filters are layered defences, not guarantees; human review remains required.',
  ],
  flashcards: [
    { front: 'What is Fill-in-the-Middle (FIM) in Copilot prompt building?', back: 'A technique that includes code both before and after the cursor so the model completes a gap in context rather than only continuing text.' },
    { front: 'Where is the Copilot proxy hosted and what does it do?', back: 'In a GitHub-owned Microsoft Azure tenant; it filters traffic, blocking prompt-hacking attempts and applying content filters before requests reach the model.' },
    { front: 'Name the two content categories the inbound filter screens for according to the exam material.', back: 'Toxicity (hate speech and inappropriate content) and personal data (names, addresses, identifiers).' },
    { front: 'What checks run on the outbound response?', back: 'Toxicity filtering, security vulnerability filtering (such as hard-coded credentials, SQL injection), code quality checks, and the optional public-code duplicate detection filter.' },
    { front: 'How long are code completion prompts retained?', back: 'They are not retained; they are discarded once the suggestion is returned.' },
    { front: 'How long does Copilot on GitHub.com and GitHub Mobile retain prompts by default?', back: 'Up to 28 days.' },
    { front: 'Is Copilot Business or Enterprise customer data used to train AI models?', back: 'No; it is protected under GitHub\'s Data Protection Agreement.' },
    { front: 'How much surrounding code does the public-code filter compare?', back: 'The suggestion plus roughly 150 characters of surrounding code, against public code on GitHub.' },
    { front: 'What context does the client gather for an inline suggestion?', back: 'Code before and after the cursor, file name and type, adjacent open tabs, project structure and paths, languages and frameworks.' },
    { front: 'What happens to a response that fails post-processing checks?', back: 'It is truncated or discarded; only responses passing all filters are delivered.' },
    { front: 'Does the model execute or test the code it suggests?', back: 'No. Completions and chat answers are predictions; only agents with tools run code, and humans still review.' },
    { front: 'What happens to prompts when you use bring-your-own-key or a custom model provider?', back: 'They are sent directly to that provider and fall under its data retention and privacy terms, not GitHub\'s.' },
  ],
  quiz: [
    {
      question: 'Place the stages of an inline suggestion in the correct order. Which sequence is correct?',
      options: [
        'Model inference → proxy filtering → context gathering → post-processing → delivery',
        'Context gathering and prompt building → HTTPS transmission → proxy and content filtering → model inference → post-processing → delivery and feedback',
        'Proxy filtering → delivery → model inference → context gathering',
        'Post-processing → context gathering → model inference → proxy filtering',
      ],
      correct: [1],
      explanation:
        'The client builds the prompt first, the proxy filters it, the model generates, filters run again on the output, and only then is the suggestion shown and feedback recorded.',
    },
    {
      question:
        'A compliance team asks whether prompts sent from VS Code for code completions are stored by GitHub on a Copilot Business plan. What is the correct answer?',
      options: [
        'They are stored for 28 days',
        'They are stored for 24 months as engagement data',
        'They are discarded once the suggestion is returned and are not retained',
        'They are stored indefinitely for model training',
      ],
      correct: [2],
      explanation:
        'Completion prompts are transient. The 28-day retention applies to Copilot on GitHub.com and Mobile, engagement telemetry is separate from prompt content, and Business data is never used for training.',
    },
    {
      question: 'Which TWO filters are applied to a Copilot response AFTER the model generates it? (Select two)',
      options: [
        'Security vulnerability filtering for patterns such as hard-coded credentials and SQL injection',
        'Fill-in-the-Middle context expansion',
        'Duplicate detection against public code (when the policy is set to Block)',
        'Repository indexing',
      ],
      correct: [0, 2],
      explanation:
        'Vulnerability filtering and the public-code filter are outbound post-processing steps. FIM is part of inbound prompt building, and indexing is a separate feature for repository-aware chat.',
    },
    {
      question:
        'An individual developer on Copilot Pro is concerned that GitHub might use their chat interactions to improve models. What is the MOST accurate guidance?',
      options: [
        'Individual-plan interactions are never used for training',
        'GitHub may use Free, Pro, Pro+ and Max interactions for training unless the user disables it in their personal Copilot settings',
        'Only Business customers can opt out of training',
        'Training use can be prevented by enabling content exclusions',
      ],
      correct: [1],
      explanation:
        'Individual plans are subject to training use with a personal opt-out. Business and Enterprise are excluded by contract rather than by an opt-out, and content exclusions control context, not training policy.',
    },
    {
      question:
        'Which limitation of large language models explains why Copilot may suggest a library method that was removed in the library\'s latest major version?',
      options: [
        'Content exclusion',
        'Training data cut-off and the model\'s lack of live knowledge of current APIs',
        'The proxy\'s toxicity filter',
        'The 28-day retention window',
      ],
      correct: [1],
      explanation:
        'The model\'s knowledge is frozen at training time and may be outdated. Exclusions, toxicity filtering and retention do not affect API knowledge.',
    },
    {
      question:
        'A team enables "Suggestions matching public code: Allowed" for their organisation. What should developers expect when a suggestion matches public code?',
      options: [
        'The suggestion is silently removed',
        'The suggestion is shown together with a code reference listing the matching repositories and licences',
        'Copilot refuses to generate further suggestions in that file',
        'The matching repository owner is notified',
      ],
      correct: [1],
      explanation:
        'Allow mode shows the suggestion with references in the IDE log or beneath a chat answer; Block mode suppresses it. Nobody is notified and the file is not locked.',
    },
  ],
  statements: [
    { text: 'Copilot prompts are sent to the model over plain HTTP.', isTrue: false, explanation: 'Prompts are transmitted securely over HTTPS/TLS to GitHub\'s proxy.' },
    { text: 'The Copilot proxy blocks attempts to manipulate the model into revealing how it generates suggestions.', isTrue: true, explanation: 'Blocking prompt-hacking attempts is one of the proxy\'s documented roles.' },
    { text: 'Copilot Chat in the IDE retains prompts for 28 days on Copilot Business by default.', isTrue: false, explanation: 'IDE Chat and CLI prompts are not retained by default; the 28-day default applies to Copilot on GitHub.com and GitHub Mobile.' },
    { text: 'Content excluded by content-exclusion rules is still sent to the model but hidden from the response.', isTrue: false, explanation: 'Excluded content is not used as context at all; only the repository URL is sent to fetch the policy.' },
    { text: 'The duplicate detection filter compares roughly 150 characters of context against public code on GitHub.', isTrue: true, explanation: 'This is how the public-code filter identifies matches or near matches.' },
    { text: 'LLM responses can vary between runs of the same prompt.', isTrue: true, explanation: 'Models are non-deterministic, which is why custom instructions are guidance rather than guarantees.' },
    { text: 'Because Copilot filters for vulnerabilities, generated code does not need security review.', isTrue: false, explanation: 'Filters are layered safeguards that catch common patterns; the application cards require human review and testing.' },
  ],
  resources: [
    { label: 'GitHub Copilot user prompt process flow (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/training/modules/introduction-prompt-engineering-with-github-copilot/3-github-copilot-user-prompt-process-flow' },
    { label: 'GitHub Copilot data handling (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/training/modules/introduction-prompt-engineering-with-github-copilot/4-github-copilot-data' },
    { label: 'Managing GitHub Copilot policies as an individual subscriber (training and public code settings)', url: 'https://docs.github.com/en/copilot/how-tos/manage-your-account/manage-policies' },
    { label: 'About GitHub Copilot session data', url: 'https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/session-data' },
  ],
};
