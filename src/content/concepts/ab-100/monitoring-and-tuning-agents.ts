import type { Concept } from '../../types';

export const monitoringAndTuningAgents: Concept = {
  id: 'monitoring-and-tuning-agents',
  title: 'Monitoring, Telemetry and Tuning of Agents in Production',
  summary:
    'The operate phase of an agentic solution: which tools monitor agents across Copilot Studio, Microsoft Foundry, Power Platform admin center, Microsoft 365 admin center and Agent 365; which metrics matter for conversational and autonomous agents; how to interpret telemetry and user feedback; and how to use AI-based tooling to find issues and tune knowledge, prompts and models.',
  certs: ['ab-100', 'ab-620'],
  domains: ['ab-100-3', 'ab-620-2'],
  outcomes: ['ab-100-3-1-1', 'ab-100-3-1-2', 'ab-100-3-1-3', 'ab-100-3-1-4', 'ab-100-3-1-5', 'ab-620-2-4-3'],
  tags: ['monitoring', 'telemetry', 'application-insights', 'copilot-studio-analytics', 'foundry-observability', 'tuning', 'feedback'],
  difficulty: 'advanced',
  diagram: 'eval-loop',
  sections: [
    {
      heading: 'The monitoring toolchain, layer by layer',
      body: `No single console monitors an enterprise agent estate. The architect recommends a **process** (who looks at what, how often, with which thresholds) and the **tools** per layer:

- **Agent level (makers).** Copilot Studio's **Monitor** page: AI-generated summary of insights, customer comments summary, active users (DAU and MAU, only when authentication is required), **effectiveness** (conversation outcomes: resolved, escalated, abandoned; customer satisfaction), **use** (knowledge and tool success, themes of generative-answer questions), **savings** (estimated time and cost), up to three natural-language **custom metrics** (preview), topic-level Monitor panes for standard-harness topics, and session transcripts for the last 28 days (metrics for 360 days). Autonomous agents get run outcomes, trigger use, tool use and knowledge-source use. Owners can share the **Analytics Viewer** role for view-only access.
- **Environment and tenant level (admins, CoE).** Power Platform admin center **Monitor > Copilot Studio** shows operational health such as **agent session success rate** and recent agent sessions across environments, with outcomes mapped to success or failure (for example "escalated, system intended" counts as success while "escalated, user requested" counts as failure). **Copilot Hub** shows usage, cost and Copilot Credit consumption; capacity reports can be downloaded per environment, agent or user. The **agent inventory** lists every agent.
- **Deep telemetry (platform teams).** **Application Insights**: agent-level telemetry (standard harness, maker-owned, connection string in agent settings, optional conversation details and node events) or **environment-level telemetry** (preview, managed environments, admin-owned, OpenTelemetry-aligned GenAI spans across agents on both harnesses). Query with Kusto, alert with Azure Monitor, build workbooks. Agent flows have their own run history and monitoring.
- **Foundry agents.** **Foundry Observability**: tracing of every step, the **Agent Monitoring Dashboard** (token usage, latency, success rates, evaluation results on production traffic), **continuous evaluation** sampling live traces, and Application Insights integration.
- **Microsoft 365 surfaces.** The **Microsoft Copilot usage report** in the Microsoft 365 admin center (adoption, retention, engagement, available within about 48 hours), the **Microsoft Copilot Dashboard in Viva Insights** (readiness, adoption, impact, agent insights for tenants with enough licences) and **Agent 365** (registry with usage, risk signals and ownership, observability integration for Copilot Studio and Foundry agents).
- **Dynamics 365.** Agent insights dashboards in Sales and Customer Service, Quality Evaluation Agent scoring in Contact Center, Agent activity in finance and operations.

The process: daily automated alerts on failure spikes, weekly maker review of fallback themes and feedback, monthly CoE review of success rate, credits and risk signals, quarterly value review against the ROI model.`,
    },
    {
      heading: 'Metrics that matter and how to read them',
      body: `Choose metrics by agent type and tie each to an action.

**Conversational agents.** *Engagement rate* (sessions with a user turn), *resolution rate* (resolved outcomes), *escalation rate* split into intended and unintended, *abandonment rate*, *customer satisfaction* from surveys, *fallback rate* and *unrecognised utterances*, *knowledge hit rate* and *citation presence*, *tool success rate*, *latency per turn*, *active users*. A rising abandonment rate after a release usually means a topic or instruction regression; high escalation with low fallback means the agent understands but cannot act, so add tools or knowledge.

**Autonomous agents.** *Run outcomes* (success, failure, needs review), *trigger volume* by trigger, *tool success and error rates*, *knowledge errors*, *time to complete*, *human intervention rate*, *actions reversed*. A high intervention rate is not automatically bad: it may be the designed approval gate.

**Platform and cost.** *Agent session success rate* across environments, *Copilot Credit* consumption per agent and per feature (tenant graph grounding at 10 credits per message is a common surprise), *Foundry token usage* per model and per agent, *latency percentiles*, *quota and throttling events*, *content safety blocks* and *Prompt Shields detections*.

**Business value.** Time saved and deflection from the Savings area, CRM outcomes for Sales agents, case handling time for Service, mapped back to the ROI baseline.

Interpreting telemetry for **model tuning**: group failures by theme (Copilot Studio themes cluster generative-answer questions weekly); compare traces of failed versus successful sessions (which knowledge source was used, which tool was selected, how long the model took); check whether failures correlate with a model version change, a knowledge refresh or a connector outage; and distinguish *grounding gaps* (no source found), *selection errors* (wrong tool or topic), *generation errors* (unsupported claims despite good sources) and *execution errors* (tool failures). Each class has a different fix: content, descriptions, instructions or model, or the integration.`,
    },
    {
      heading: 'Backlog and user feedback: turning signals into work',
      body: `Agents improve through a managed **backlog**, not ad hoc edits. Sources of feedback to analyse:

- **In-product feedback**: thumbs up and down and comments in Copilot Studio (summarised on the Monitor page), Microsoft 365 Copilot feedback, enhanced user feedback in finance and operations apps (thumbs plus written comments).
- **Transcripts and themes**: downloadable transcripts (28 days, with the Bot Transcript Viewer role for sensitive content), theme clustering of unanswered or generative questions, the UnrecognizedTriggerPhrase captured in Fallback.
- **Operational signals**: escalations to representatives with reasons, tool failures, DLP blocks, security scan findings.
- **Adoption data**: Viva Insights Copilot Dashboard and usage reports show who is not using the agent and which scenarios stall.
- **Business owners and champions**: structured review sessions and surveys.

Triage each item into a category (knowledge gap, missing capability, wrong behaviour, performance, cost, risk), estimate value and effort, and prioritise against the roadmap. Keep the backlog in the same system the delivery team uses (Azure DevOps or GitHub) so fixes flow through ALM with test cases. Typical cadence: makers clear knowledge gaps weekly; capability requests go through the CoE monthly; risk items are handled immediately.

Two anti-patterns the exam likes: editing a production agent directly because a user complained (bypasses ALM and testing), and tuning the prompt in response to a single anecdote without checking the metric trend. The correct answer in both is to log the item, reproduce it with a test case, fix in development, run the evaluation set, then deploy.`,
    },
    {
      heading: 'AI-based tools for analysis and tuning',
      body: `Microsoft increasingly ships AI that analyses your agents for you. Know what each does and where it lives:

- **Copilot Studio Monitor summary and customer comments summary**: generated insights and sentiment grouping, prioritised by volume and significance.
- **Themes (preview)**: weekly clustering of generative-answer questions with daily classification, exposing frequent intents that lack topics or knowledge.
- **Custom metrics (preview)**: describe a business metric in natural language and Copilot Studio generates classification or scoring criteria applied to sessions.
- **Session outcome analysis**: for some agent types Monitor uses AI to assign each completed session a single outcome (resolved, escalated, abandoned) up to 48 hours after use.
- **Copilot Agent Kit** (Power CAT): **Agent Insights Hub** aggregating Application Insights telemetry and transcripts, **Agent Debugger** for step-by-step diagnosis of recorded conversations, **Compliance Hub** evaluating agent configurations against controls, and test automation with rubrics.
- **Foundry**: **Agent optimizer (preview)** evaluates agent behaviour and generates better instructions, skills, tool descriptions and model selections; **continuous evaluation** scores sampled production traces with quality, safety and agent evaluators; the **AI Red Teaming Agent** probes for safety issues; **model router** monitoring shows which models served which requests.
- **Dynamics 365**: Quality Evaluation Agent scores every interaction; Customer Intent Agent surfaces emerging intents from cases and conversations.
- **Agent 365 and Purview DSPM for AI**: risk signals, oversharing and sensitive-data insights across agents.

Tuning loop: observe (metrics, themes, traces), diagnose (classify the failure), change one thing (knowledge, description, instruction, model, tool), evaluate against the test set, release through ALM, and watch the metric. Record each change with its before and after metric so tuning becomes evidence, not folklore. Model-level tuning (switching primary model, enabling deep reasoning for a step, adjusting prompt-tool model settings, fine-tuning in Foundry) is the last resort after content and design fixes, and always goes through the 30-day model retention window and evaluation gate.`,
    },
  ],
  examples: [
    {
      title: 'Designing the monitoring process for a regional bank',
      description:
        'The architect specifies: makers own Copilot Studio Monitor and clear fallback themes weekly; the platform team enables environment-level Application Insights telemetry on the managed production environment with alerts on tool error rate above 5% and p95 latency above 8 seconds; the CoE reviews agent session success rate and Copilot Credit burn in the Power Platform admin center monthly; Foundry agents report into the Agent Monitoring Dashboard with continuous evaluation; Agent 365 provides the registry and risk view for the CISO.',
      takeaway: 'A monitoring recommendation names the layer, the tool, the owner, the cadence and the thresholds.',
    },
    {
      title: 'Reading an escalation spike correctly',
      description:
        'Escalations rise 40% after a release. Monitor shows the increase is almost entirely "escalated, system unintended" and tool success for the order-lookup connector fell to 60%. Traces in Application Insights show timeouts from the ERP API after a vendor patch. The fix is in the integration (retry and timeout tuning, a fallback message), not in prompts or knowledge.',
      takeaway: 'Split escalation by cause and correlate with tool telemetry before touching the agent\'s language.',
    },
    {
      title: 'Hot-fixing production from a complaint (a realistic mistake)',
      description:
        'A director reports one bad answer and a maker edits the production agent\'s instructions on the spot. Two days later resolution rate drops because the new instruction suppressed a whole class of valid answers. The CoE reinstates the rule: log the feedback, add a test case that reproduces it, fix in development, run the evaluation set, deploy via pipeline, then verify the metric.',
      takeaway: 'Feedback enters a backlog and flows through evaluation and ALM; never tune production from an anecdote.',
    },
    {
      title: 'Using themes and the optimizer to tune',
      description:
        'Themes reveal that 18% of generative-answer questions concern warranty transfers, which no knowledge source covers well, and Foundry\'s agent optimizer suggests clearer tool descriptions for a connected Foundry agent that was being selected for the wrong requests. The team adds a warranty knowledge source, adopts the suggested descriptions, re-runs evaluations (compare-meaning and tool-use methods) and watches theme resolution rise over the following weeks.',
      takeaway: 'Let AI tooling find the gaps, then validate every change with evaluations and trend metrics.',
    },
  ],
  keyPoints: [
    'Monitor in layers: Copilot Studio Monitor for makers, Power Platform admin center Monitor and Copilot Hub for admins, Application Insights for deep telemetry, Foundry Observability for Foundry agents, Microsoft 365 usage reports and Viva Insights for adoption, Agent 365 for the estate.',
    'Copilot Studio Monitor keeps metrics for 360 days and transcripts for 28 days; active-user metrics require authenticated agents; Analytics Viewer gives view-only access.',
    'Conversational metrics: engagement, resolution, escalation (intended versus unintended), abandonment, satisfaction, fallback, knowledge and tool success. Autonomous metrics: run outcomes, trigger use, tool use, knowledge errors, intervention rate.',
    'Agent-level Application Insights telemetry is maker-owned and standard-harness only; environment-level telemetry (preview) is admin-owned, managed environments, OpenTelemetry GenAI spans across harnesses.',
    'Foundry provides tracing, the Agent Monitoring Dashboard, continuous evaluation on production traces and the agent optimizer.',
    'Classify failures as grounding gaps, selection errors, generation errors or execution errors; each has a different fix.',
    'Feedback and backlog: collect thumbs, comments, transcripts, themes, escalations and adoption data; triage into a managed backlog; fix through test cases and ALM, never by editing production on an anecdote.',
    'AI-based analysis tools: Monitor summaries, themes, custom metrics, Copilot Agent Kit (Insights Hub, Debugger, Compliance Hub), Foundry agent optimizer and continuous evaluation, Quality Evaluation Agent.',
  ],
  flashcards: [
    { front: 'How long are Copilot Studio Monitor metrics and transcripts retained?', back: 'Metrics up to 360 days; session details and transcripts for the last 28 days.' },
    { front: 'What is required for active user (DAU/MAU) metrics in Copilot Studio?', back: 'The agent must require authentication (Settings > Security > Authentication).' },
    { front: 'Which role grants view-only access to an agent\'s Monitor page?', back: 'Analytics Viewer (plus Bot Transcript Viewer for transcripts).' },
    { front: 'Agent-level versus environment-level Application Insights telemetry?', back: 'Agent-level: per agent, maker-owned, standard harness, no OpenTelemetry spans. Environment-level (preview): managed environments, admin-owned, OpenTelemetry GenAI spans across agents on both harnesses.' },
    { front: 'Where do admins see agent session success rate across environments?', back: 'Power Platform admin center > Monitor > Copilot Studio.' },
    { front: 'Which escalation outcome counts as success in Power Platform admin center monitoring?', back: 'Escalated, system intended (a maker-configured escalation rule); user-requested or system-unintended escalations count as failures.' },
    { front: 'What does the Foundry Agent Monitoring Dashboard show?', back: 'Token usage, latency, success rates and evaluation results for production traffic, read from the connected Application Insights resource.' },
    { front: 'What does Foundry\'s agent optimizer do?', back: 'Evaluates agent behaviour and generates improved instructions, skills, tool descriptions and model selections.' },
    { front: 'What are Copilot Studio themes?', back: 'Weekly AI clustering of user questions that triggered generative answers, with daily classification, to reveal frequent intents and gaps.' },
    { front: 'Name the four failure classes to diagnose from telemetry.', back: 'Grounding gaps, selection errors (wrong tool or topic), generation errors (unsupported claims) and execution errors (tool failures).' },
    { front: 'Which Microsoft 365 tools report Copilot adoption?', back: 'The Microsoft Copilot usage report in the Microsoft 365 admin center and the Microsoft Copilot Dashboard in Viva Insights.' },
  ],
  quiz: [
    {
      question:
        'A Center of Excellence must centrally observe traces across 60 Copilot Studio agents on both the standard and Microsoft Copilot harnesses in a managed production environment, using OpenTelemetry-aligned spans. What should the architect recommend?',
      options: [
        'Ask each maker to add an Application Insights connection string to their agent',
        'Configure environment-level Application Insights telemetry from the Power Platform admin center',
        'Download transcripts weekly from each agent\'s Monitor page',
        'Enable the Viva Insights Copilot Dashboard',
      ],
      correct: [1],
      explanation:
        'Environment-level telemetry is admin-owned, spans agents on both harnesses and emits OpenTelemetry GenAI spans. Agent-level telemetry is per agent and standard-harness only, transcripts are not traces, and the Viva dashboard measures Microsoft 365 Copilot adoption.',
    },
    {
      question:
        'After a release, Monitor shows escalations up 40%, almost all classified as "escalated, system unintended", and the order-lookup tool\'s success rate fell to 60%. What is the MOST appropriate first action?',
      options: [
        'Rewrite the agent\'s instructions to discourage escalation',
        'Investigate the tool failures in telemetry and fix the integration (timeouts, retries, fallback message)',
        'Switch the primary model to a reasoning model',
        'Reduce the number of knowledge sources',
      ],
      correct: [1],
      explanation:
        'System-unintended escalations with falling tool success point to an execution error in the integration. Prompts, models and knowledge are not the failing component.',
    },
    {
      question:
        'Which TWO metrics are specific to monitoring autonomous (event-triggered) agents in Copilot Studio? (Select two)',
      options: ['Run outcomes', 'Trigger use', 'Customer satisfaction survey score', 'Monthly active users'],
      correct: [0, 1],
      explanation:
        'Run outcomes and trigger use are the autonomous agent health areas (with tool and knowledge use). Satisfaction surveys and active users are conversational metrics.',
    },
    {
      question:
        'A manager reports a single incorrect answer and asks a maker to change the production agent\'s instructions immediately. What should the architect\'s governance process require instead?',
      options: [
        'Make the change in production and monitor for complaints',
        'Log the feedback, reproduce it as a test case, fix in development, run the evaluation set and deploy through the pipeline',
        'Disable the agent until the model is retrained',
        'Add the manager\'s question as a trigger phrase in production',
      ],
      correct: [1],
      explanation:
        'Feedback flows through the backlog, evaluation and ALM. Direct production edits cause regressions, disabling is disproportionate, and a trigger phrase does not address the root cause.',
    },
    {
      question:
        'Themes in Copilot Studio show that 18% of generative-answer questions concern a topic with no knowledge source, and the resolution rate for those questions is low. Which tuning action addresses the root cause?',
      options: [
        'Enable deep reasoning for the agent',
        'Add an authoritative knowledge source for that theme and re-run the evaluation set',
        'Increase the content moderation level',
        'Raise the Copilot Credit allocation',
      ],
      correct: [1],
      explanation:
        'A theme without coverage is a grounding gap, fixed by content. Reasoning, moderation and credits do not add missing knowledge.',
    },
    {
      question:
        'Production Foundry agents must have quality and safety scored continuously on sampled live traffic with results visible alongside latency and token usage. Which capability should you use?',
      options: [
        'Copilot Studio Monitor page',
        'Foundry Agent Monitoring Dashboard with continuous evaluation connected to Application Insights',
        'Microsoft 365 Copilot usage report',
        'Power Platform admin center Copilot Hub',
      ],
      correct: [1],
      explanation:
        'Foundry Observability provides the dashboard and continuous evaluation for Foundry agents. The other tools monitor Copilot Studio agents or Microsoft 365 Copilot adoption.',
    },
  ],
  statements: [
    { text: 'Copilot Studio session transcripts are available in Monitor for 360 days.', isTrue: false, explanation: 'Metrics are available for 360 days; transcripts and session details for 28 days.' },
    { text: 'Agent-level Application Insights telemetry in Copilot Studio is available only for the standard harness.', isTrue: true, explanation: 'Environment-level telemetry covers both harnesses.' },
    { text: 'In Power Platform admin center monitoring, a user-requested escalation counts as a successful session.', isTrue: false, explanation: 'User-requested and system-unintended escalations count as failures; only system-intended escalations count as success.' },
    { text: 'Copilot Studio can generate custom business metrics from a natural-language description.', isTrue: true, explanation: 'Custom metrics (preview) allow up to three such metrics per agent.' },
    { text: 'Foundry\'s continuous evaluation scores sampled production traces for quality and safety.', isTrue: true, explanation: 'It feeds the Agent Monitoring Dashboard alongside operational metrics.' },
    { text: 'The Viva Insights Copilot Dashboard requires a paid Viva Insights licence to view.', isTrue: false, explanation: 'It is available to Microsoft 365 business or enterprise customers with Exchange Online; advanced features depend on licence counts.' },
    { text: 'Model changes should be the first tuning step when resolution rate falls.', isTrue: false, explanation: 'Diagnose the failure class first; content, descriptions and instructions usually come before model changes.' },
  ],
  resources: [
    { label: 'Monitor agent performance in Copilot Studio', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-overview' },
    { label: 'Telemetry with Application Insights (Copilot Studio)', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/telemetry-overview' },
    { label: 'Monitor Copilot Studio in the Power Platform admin center', url: 'https://learn.microsoft.com/en-us/power-platform/admin/monitoring/monitor-copilot-studio' },
    { label: 'Foundry Agent Monitoring Dashboard and continuous evaluation', url: 'https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard' },
  ],
};
