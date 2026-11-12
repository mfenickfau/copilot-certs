import type { Concept } from '../../types';

export const developerProductivityUseCases: Concept = {
  id: 'developer-productivity-use-cases',
  title: 'Developer Productivity: Generation, Refactoring, Documentation, Learning and Measuring Impact',
  summary:
    'Where Copilot pays off in daily work: generating boilerplate and sample data, refactoring and translating legacy code, writing documentation, learning unfamiliar languages without leaving the editor, and how organisations measure whether any of it is working with usage metrics, the impact dashboard and developer surveys.',
  certs: ['gh-300'],
  domains: ['gh-300-5'],
  outcomes: ['gh-300-5-1-1', 'gh-300-5-1-2', 'gh-300-5-1-3'],
  tags: ['productivity', 'refactoring', 'documentation', 'legacy-code', 'sample-data', 'metrics', 'usage-metrics', 'developer-survey'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Code generation, refactoring and documentation',
      body: `GitHub's own guidance on what Copilot does best: **writing tests and repetitive code, debugging and correcting syntax, explaining and commenting code, generating regular expressions**. It is not designed to answer non-coding questions or to replace your expertise. Within that frame, the productivity use cases the exam names are:

**Code generation.** Boilerplate (a REST endpoint with validation and error handling, a class skeleton, configuration for several environments), complete functions from a comment or signature, regular expressions, SQL and query construction, infrastructure-as-code. Inline completions handle the small, flow-preserving cases; Chat and agent mode handle larger blocks and multi-file scaffolding.

**Refactoring.** Ask Chat or agent mode to simplify a function, extract methods, apply a design pattern, remove duplication, improve readability, or optimise a hot path (\`/optimize\` in Visual Studio; "act as a performance expert" elsewhere). Edit mode is ideal when you know the files; agent mode when the change ripples through the project and tests must be re-run. Always verify behaviour with tests before and after.

**Documentation.** \`/doc\` adds a documentation comment for a symbol; Chat drafts README sections, API descriptions and inline explanations in your project's style; the cloud agent can generate a \`.github/copilot-instructions.md\` describing how to build and test the repository. Copilot keeps documentation consistent across a project because it imitates what it sees.

The underlying mechanism is the same everywhere: Copilot reads your context and produces statistically typical code for it. Clean, well-named, well-tested code therefore yields better generation, which is why "follow good coding practices" is a productivity tip, not just a style one.`,
    },
    {
      heading: 'Learning faster and switching context less',
      body: `Two productivity effects are about attention rather than keystrokes.

**Accelerated learning.** Working in an unfamiliar language or framework, you can let Copilot generate idiomatic code and then ask \`/explain\` (or "explain this line") to understand it, ask how a library call works, or ask for the equivalent construct in a language you know. Inline suggestions show correct API usage and parameters as you type, so you learn the library while using it. This is why Copilot is valued for onboarding and for polyglot teams.

**Reduced context switching.** Every trip to a browser, a documentation site or a Q&A forum breaks flow. Copilot keeps answers in the editor: \`@terminal\` explains a failing command, Chat explains an error message or stack trace, completions supply the parameter order you would otherwise look up, \`@github\` with \`#web\` searches the web from the chat panel, and the CLI answers Git and shell questions where you already are. Agent mode and the cloud agent go further by running the build and tests themselves and reporting back.

The exam frames these as "accelerate learning and reduce context switching"; the right answers describe Copilot *inside the workflow* (IDE, terminal, pull request) rather than as another tab.`,
    },
    {
      heading: 'Sample data and modernising legacy code',
      body: `**Sample data.** Tests, demos and local development need realistic fixtures. Ask Copilot for "twenty customer records as JSON with realistic names, UK postcodes and ISO dates, including two with missing phone numbers", or for a CSV, SQL seed script or factory function. Specify the schema, the volume, the edge cases to include and the format, and never paste real personal data as the example to imitate.

**Modernising legacy code.** Copilot helps at every stage:
- **Understand**: \`/explain\` on dense legacy functions, "summarise what this module does and list its external dependencies", \`@workspace\` to trace callers.
- **Translate**: ask Chat to convert a script from one language to another, keeping behaviour and output identical and explaining how to run the result (GitHub's documented example converts a Perl script to TypeScript). Translation of standalone files is straightforward; large systems need incremental, tested migration.
- **Upgrade**: move to newer language versions or frameworks, replace deprecated APIs, add types to untyped code, introduce tests around code that has none (characterisation tests) before changing it.
- **Delegate**: assign well-scoped modernisation issues to the cloud agent, which works in its own environment, runs the tests and opens a pull request for review.

The caution the exam expects: legacy code often encodes undocumented business rules, so translation must be verified against the original's behaviour, with tests written first where none exist.`,
    },
    {
      heading: 'Measuring productivity and impact',
      body: `Anecdotes ("it feels faster") are not enough for a rollout decision. GitHub provides several measurement instruments:

- **Copilot usage metrics dashboard** (organisation or enterprise *Insights*, requires the *Copilot usage metrics* policy): daily and weekly active users, acceptance rate for completions, lines of code suggested and accepted, requests per chat mode (Ask, Edit, Plan, Agent), agent adoption, model and language usage. A healthy signal is a high weekly-active-to-licensed ratio (GitHub cites above 60 percent) and a rising acceptance rate.
- **Impact dashboard**: groups users into **adoption cohorts** (chat-first, code-first, agent-first, multi-agent) and connects them to pull request throughput and time to merge, with optional industry comparisons and directional return-on-investment estimates. GitHub stresses these are associations, not proof of causation.
- **Code generation dashboard**: code written by users versus agents.
- **Usage metrics REST API and NDJSON exports** for custom reporting, with repository- and user-level detail; the older Learn material describes \`GET /orgs/{org}/copilot/usage\` and enterprise and team equivalents returning daily suggestions, acceptances and active users by editor and language.
- **Activity report and user management API**: \`last_activity_at\` per seat (90-day retention) for licence hygiene.
- **Developer surveys**: a short-form survey every two weeks ("How would you feel if you could no longer use Copilot?", time saved) and a long-form survey no more than every four weeks, anonymised and tracked over time.

GitHub suggests a staged framework: **evaluation** (leading indicators: satisfaction, task completion, daily active users, acceptance rate), **adoption** (engagement and enablement gaps), **optimisation** (tie to business goals such as time-to-market and quality) and **sustained efficiency**. Pair quantitative metrics with developer feedback, look at patterns rather than single numbers, and remember that usage metrics measure activity, not licences, and that data arrives within two UTC days.`,
    },
  ],
  examples: [
    {
      title: 'Generating realistic fixtures',
      description:
        'A QA engineer needs seed data for an orders table with awkward cases. Instead of hand-writing it, she specifies the schema, the count and the edge cases in a prompt. Copilot returns a JSON array she saves as a fixture and a factory function for tests.',
      language: 'text',
      code: `Generate 25 sample orders as a JSON array matching this TypeScript type:
  { id: string; customerId: string; total: number; currency: 'GBP'|'EUR';
    placedAt: string /* ISO 8601 */; status: 'pending'|'paid'|'refunded' }
Include: 3 refunded orders, 2 with total 0, 1 placed on 29 Feb 2024,
and realistic but fictional customer ids. Output only the JSON.`,
      takeaway: 'Specify schema, volume, edge cases and output format; never use real personal data as the template.',
    },
    {
      title: 'Translating a legacy script with verification',
      description:
        'A team has a Perl utility nobody can maintain. Following GitHub\'s documented pattern they ask Chat to convert it to TypeScript with identical behaviour and output, plus instructions to run it under Node. Before adopting the result they write characterisation tests that run both versions on the same inputs and compare outputs, catching a difference in how empty files were counted.',
      takeaway: 'Copilot makes translation fast; tests that compare old and new behaviour make it safe.',
    },
    {
      title: 'Learning a new framework in the editor',
      description:
        'A backend developer joins a Go project for the first time. Completions supply idiomatic error-handling patterns as he types; he selects an unfamiliar construct and uses /explain to understand goroutine channels; @terminal explains a failing go test command. He never leaves the IDE and ships a reviewed change on day two.',
      takeaway: 'Generate, then explain: Copilot accelerates learning and removes the browser round-trips that break flow.',
    },
    {
      title: 'Measuring the wrong thing (a realistic mistake)',
      description:
        'A manager declares the rollout a success because "lines of code accepted" doubled. A reviewer points out that acceptance volume says nothing about quality or delivery. They switch to the impact dashboard\'s adoption cohorts and pull request throughput and time to merge, add a fortnightly short-form developer survey, and track acceptance rate alongside code review findings. The picture is still positive, but now it is defensible.',
      takeaway: 'Combine engagement metrics, delivery metrics and developer feedback; no single number measures productivity.',
    },
  ],
  keyPoints: [
    'Copilot excels at tests and repetitive code, debugging and syntax fixes, explaining and commenting code, and regular expressions; it does not replace expertise or answer non-coding questions well.',
    'Code generation spans boilerplate, functions from comments, queries and infrastructure code; refactoring and optimisation use Chat, edit mode or agent mode with tests before and after.',
    'Documentation help: /doc for symbol comments, Chat for READMEs and API docs, the cloud agent can draft copilot-instructions.md.',
    'Copilot accelerates learning (generate, then /explain) and reduces context switching by keeping answers in the IDE, terminal and pull request.',
    'Sample data generation: specify schema, volume, edge cases and format; do not seed with real personal data.',
    'Legacy modernisation: explain, translate, upgrade and delegate, always verified with tests because legacy code hides undocumented rules.',
    'Measure with the usage metrics dashboard (active users, acceptance rate, chat modes), the impact dashboard (adoption cohorts, PR throughput, time to merge), the usage metrics API and exports, and periodic developer surveys.',
    'Treat metrics as associations, combine them with feedback, and follow the evaluation, adoption, optimisation, sustained-efficiency framework.',
  ],
  flashcards: [
    { front: 'According to GitHub, what four things does Copilot do best?', back: 'Writing tests and repetitive code, debugging and correcting syntax, explaining and commenting code, generating regular expressions.' },
    { front: 'Which slash command adds a documentation comment to a symbol?', back: '/doc' },
    { front: 'How does Copilot reduce context switching?', back: 'By answering questions, explaining errors and supplying API usage inside the IDE, terminal and pull request instead of requiring a browser search.' },
    { front: 'What should you specify when asking Copilot for sample data?', back: 'The schema or type, the number of records, edge cases to include, and the output format; use fictional data only.' },
    { front: 'What is the recommended safeguard when translating legacy code to a new language?', back: 'Write tests (characterisation tests) that compare the original and translated behaviour before adopting the result.' },
    { front: 'Which policy must be enabled to view the Copilot usage metrics dashboards?', back: 'The "Copilot usage metrics" policy at organisation or enterprise level.' },
    { front: 'What does the impact dashboard add beyond active-user counts?', back: 'Adoption cohorts (chat-first, code-first, agent-first, multi-agent) connected to pull request throughput and time to merge, plus industry comparisons and directional ROI.' },
    { front: 'What weekly-active-to-licensed ratio does GitHub cite as healthy?', back: 'Above 60 percent.' },
    { front: 'How often does Microsoft Learn suggest running the short-form and long-form developer surveys?', back: 'Short-form every two weeks; long-form no more than once every four weeks.' },
    { front: 'What are the four stages of the measurement framework?', back: 'Evaluation, adoption, optimisation, sustained efficiency.' },
    { front: 'Do usage metrics measure licence assignments?', back: 'No; they measure activity. Seat and licence information comes from the user management API.' },
  ],
  quiz: [
    {
      question:
        'A developer new to Rust wants to understand idiomatic error handling without leaving the editor. Which combination BEST uses Copilot for learning?',
      options: [
        'Disable completions and read the Rust book in a browser',
        'Let completions generate idiomatic code, then select it and use /explain to understand the constructs',
        'Ask the cloud agent to rewrite the project in a language the developer knows',
        'Enable the public-code filter so suggestions are simpler',
      ],
      correct: [1],
      explanation:
        'Generate-then-explain is the documented learning pattern and keeps the developer in flow. Rewriting the project avoids learning, and the public-code filter does not simplify code.',
    },
    {
      question:
        'A team needs 500 realistic test customers including malformed email addresses and duplicate names. What is the MOST appropriate prompt approach?',
      options: [
        'Paste 20 real customers from production and ask Copilot to generate 480 more like them',
        'Specify the schema, count, required edge cases and output format, and ask for fictional data',
        'Ask Copilot to query the production database',
        'Use /tests on the customer model',
      ],
      correct: [1],
      explanation:
        'Specifying the shape and edge cases yields useful data without exposing personal data. Real data in prompts is a privacy risk, Copilot Chat does not query databases, and /tests writes tests rather than fixtures.',
    },
    {
      question: 'Which TWO metrics come from the Copilot impact dashboard rather than raw activity counts? (Select two)',
      options: [
        'Adoption cohorts such as chat-first, code-first, agent-first and multi-agent',
        'Pull request throughput and time to merge compared across adoption phases',
        'The number of content exclusion rules',
        'The organisation audit log retention period',
      ],
      correct: [0, 1],
      explanation:
        'The impact dashboard connects adoption depth to delivery outcomes. Exclusion rules and audit retention are governance settings, not productivity metrics.',
    },
    {
      question:
        'An engineering director wants to justify the Copilot budget. Which approach is MOST defensible?',
      options: [
        'Report total lines of code accepted this quarter',
        'Combine usage metrics (active users, acceptance rate), impact dashboard delivery metrics and periodic anonymised developer surveys, interpreting results as associations',
        'Count how many developers have the extension installed',
        'Compare the number of Copilot requests against the previous quarter',
      ],
      correct: [1],
      explanation:
        'GitHub recommends combining signals and developer feedback, and warns against single numbers. Installed counts and raw request volume measure neither value nor outcomes.',
    },
    {
      question:
        'A team wants to migrate a 400-line Perl utility to TypeScript using Copilot. Which step is MOST important before replacing the original?',
      options: [
        'Ask Copilot to delete the Perl file to avoid confusion',
        'Write tests that run both versions on the same inputs and compare outputs',
        'Switch the public-code setting to Allow',
        'Generate a README describing the new script',
      ],
      correct: [1],
      explanation:
        'Behavioural verification protects against silent differences in translated code. Deleting the original removes the oracle, the public-code setting is unrelated, and documentation is useful but secondary.',
    },
    {
      question:
        'The usage metrics dashboard shows a high weekly-active ratio but a falling acceptance rate for completions after a framework upgrade. What does GitHub\'s interpretation guidance suggest?',
      options: [
        'Acceptance rate is irrelevant; only active users matter',
        'A falling acceptance rate may indicate mismatched suggestions or workflow friction, so investigate with developer feedback',
        'The organisation should immediately cancel seats',
        'The metric is delayed by 90 days and should be ignored',
      ],
      correct: [1],
      explanation:
        'GitHub reads acceptance-rate drops as possible signs of mismatched suggestions or friction, to be checked with feedback. Metrics arrive within about two days, not 90, and cancelling seats is not a measurement step.',
    },
  ],
  statements: [
    { text: 'GitHub states Copilot is well suited to writing repetitive code and tests, debugging syntax and explaining code.', isTrue: true, explanation: 'These are listed among Copilot\'s strengths in the best-practices documentation.' },
    { text: 'Copilot is designed to answer prompts unrelated to coding and technology.', isTrue: false, explanation: 'GitHub lists non-coding prompts among the things Copilot is not designed for.' },
    { text: 'Translating a standalone legacy script to another language is a documented Copilot Chat use case.', isTrue: true, explanation: 'GitHub\'s documentation shows converting a Perl script to TypeScript and how to run it with Node.' },
    { text: 'The impact dashboard proves that Copilot adoption caused improvements in pull request throughput.', isTrue: false, explanation: 'GitHub states that comparisons show associations, not proof of causation; team composition and project complexity also matter.' },
    { text: 'Usage metrics data for a given day is available within two full UTC days.', isTrue: true, explanation: 'This latency is documented; the 90-day figure applies to last_activity_at retention.' },
    { text: 'Organisation-level usage totals can be added together to get an enterprise total.', isTrue: false, explanation: 'Users can belong to several organisations, so totals overlap; use enterprise-level reports instead.' },
    { text: 'Developer surveys should be anonymised and run at a regular cadence to avoid survey fatigue.', isTrue: true, explanation: 'Learn guidance recommends anonymised responses, short-form surveys every two weeks and long-form no more than monthly.' },
  ],
  resources: [
    { label: 'Boost developer productivity with AI (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/training/modules/developer-use-cases-for-ai-with-github-copilot/2-boost-developer-productivity' },
    { label: 'Understand limitations and measure impact (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/training/modules/developer-use-cases-for-ai-with-github-copilot/5-understand-limitations-measure-impact' },
    { label: 'GitHub Copilot usage metrics', url: 'https://docs.github.com/en/copilot/concepts/billing-and-usage/copilot-usage-metrics/copilot-metrics' },
    { label: 'Translating code to a different programming language', url: 'https://docs.github.com/en/copilot/tutorials/modernize-legacy-code' },
  ],
};
