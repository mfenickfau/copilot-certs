import type { Concept } from '../../types';

export const powerPlatformAiAndWellArchitected: Concept = {
  id: 'power-platform-ai-and-well-architected',
  title: 'Power Platform AI: AI Hub, Canvas App Copilot, Generative Pages, Agent Feed and Well-Architected',
  summary:
    'How an architect embeds AI into Power Platform workloads: the AI hub and AI Builder, Copilot and prompt actions inside canvas app business processes, code-first generative pages and the agent feed for human-agent collaboration in model-driven apps, and the Power Platform Well-Architected Framework applied to intelligent application workloads.',
  certs: ['ab-100'],
  domains: ['ab-100-2'],
  outcomes: ['ab-100-2-1-9', 'ab-100-2-1-12', 'ab-100-2-1-13', 'ab-100-2-3-5'],
  tags: ['power-platform', 'power-apps', 'ai-builder', 'ai-hub', 'generative-pages', 'agent-feed', 'well-architected', 'canvas-apps'],
  difficulty: 'advanced',
  sections: [
    {
      heading: 'Power Platform AI features and the AI hub',
      body: `Power Platform gives makers AI in three layers, and architects should be able to propose the right layer for a requirement.

- **Maker Copilots** help build: describe an app and Copilot generates the data model and screens; Copilot writes and explains Power Fx formulas; Copilot edits apps and generates flows; **AI code generation tools** such as GitHub Copilot CLI build canvas apps, model-driven apps and generative pages from a local development environment. Generally available maker Copilot features are on by default; preview features can be turned off per environment (Settings > Features) or per tenant in the Power Platform admin center.
- **AI hub** in Power Apps and Power Automate is the home for **AI Builder**: **prompts** (the prompt builder and prompt library shared with Copilot Studio, batch testing in the Test hub, bring your own Foundry model), **AI models** (prebuilt: receipts, invoices, identity documents, business cards, sentiment, text recognition, translation; custom: document processing, prediction, object detection, category and entity extraction), and templates for common scenarios. AI Builder consumes **Copilot Credits** allocated to the environment. Use prebuilt models for scenarios common across businesses and custom models when your data is unique.
- **In-app AI for users**: **Microsoft Copilot in canvas and model-driven apps** (natural-language questions over the app's Dataverse and SharePoint data, requiring Dataverse search and the tenant setting that allows Dataverse data in Microsoft Copilot), the **Copilot answer control**, **form fill assistance**, Copilot case summaries, data visualisation in views, and the **agent feed**. Admins control who can use AI features in model-driven apps from the Copilot area of the Power Platform admin center.

Adjacent platform capabilities to know: the **Dataverse MCP server** (connect Copilot Studio, Visual Studio Code or non-Microsoft clients to Dataverse data), **low-code plug-ins** (Power Fx business logic callable by agents), and **Power Apps in Microsoft Copilot** (preview), which generates an MCP server and declarative agent from a model-driven app so Copilot can surface the app's records as interactive grids and forms.`,
    },
    {
      heading: 'Designing AI into a canvas app business process',
      body: `A canvas app is often the front end of a business process, and AB-100 asks how to include AI components in that process without turning the app into a chatbot.

Design options, from simplest to richest:
1. **AI Builder prompt or model actions in Power Fx.** Call a prompt action (summarise, classify, extract) or a document-processing model from a button or on form submit; show the result for the user to confirm before saving to Dataverse. This is the pattern for intake forms, triage and data-entry assistance.
2. **Copilot answer control.** Place a one-shot generated answer (a summary of the record, a recommendation) in the screen with a predefined prompt, so users get AI help without a chat.
3. **Microsoft Copilot in canvas apps (preview).** Enable Copilot at environment and app level so users can ask natural-language questions about the app's Dataverse tables or SharePoint lists from the Copilot button. Customise it with an agent in Copilot Studio when it needs topics, knowledge or tools beyond the app's data. Note that the older **Copilot control** cannot be added to new canvas apps since February 2026 and should be migrated to Microsoft Copilot.
4. **Hand off to an agent or flow.** For multi-step automation (create records, send approvals, chase suppliers), the app triggers a Copilot Studio agent or agent flow and shows progress; results return through Dataverse so the process stays auditable.

Design rules: keep the human decision explicit (AI proposes, user approves) wherever the action is consequential; store AI outputs with provenance (which prompt and model version produced them); handle latency with asynchronous patterns; build for failure (a prompt action that returns nothing must not block the process); and respect Dataverse security (Copilot answers only from data the user can read). Licensing: AI Builder prompts and models consume Copilot Credits; Microsoft Copilot in apps follows the Copilot and Dataverse settings in the admin centres.

Apply the Well-Architected **Experience Optimization** pillar here: AI should reduce steps and cognitive load, surface relevance, and compose naturally with the screen, not interrupt it.`,
    },
    {
      heading: 'Code-first generative pages and the agent feed',
      body: `Two newer model-driven app capabilities turn apps into **collaboration surfaces for agents**.

**Generative pages.** Describe the page you need in natural language (optionally with an image), name the Dataverse tables, Power Platform connectors (preview) or Dataverse custom APIs (preview) it should use, and Power Apps generates a fully functional React page with layout, components and business logic, then lets you refine it conversationally. Two authoring paths produce the same artefact: in-browser at make.powerapps.com, or, recommended by Microsoft, **AI code generation tools** such as GitHub Copilot CLI working **code-first** in your local environment with TypeScript and React, access to the latest frontier models, worldwide availability, and the ability to generate several pages plus supporting tables and place them in the right app and solution in one run. Choose code-first when you need source control, IntelliSense, repeatability and ALM discipline; choose in-browser for quick maker iteration. Use generative pages for bespoke experiences (dashboards, review consoles, side-by-side comparison screens) that standard forms and views cannot express.

**Agent feed.** The agent feed surfaces agent-generated, actionable tasks inside a model-driven app so users can review, validate, complete or take over agent work: a unified, task-based feed for **human-agent collaboration and supervision**. From May 2026 the feed supports only agents that use the **Power Apps MCP server** to create tasks (replacing the earlier activity-based feed). The Power Apps MCP server equips agents with app tools such as **data entry from unstructured content with human review and approval**, and gives business users supervision tools to see, assist and take control of agent actions. In finance and operations apps the equivalent appears in **Immersive Home** with feed items created through Dataverse custom APIs, ranked, secured by menu items and rendered as cards.

Architectural proposal pattern: autonomous agents do the work, write tasks to the agent feed through the Power Apps MCP server, and a generative page gives supervisors a tailored review console. This keeps humans accountable, satisfies the Responsible AI transparency and accountability principles, and avoids a separate supervision app.`,
    },
    {
      heading: 'Applying Power Platform Well-Architected to intelligent workloads',
      body: `The **Power Platform Well-Architected Framework** mirrors Azure Well-Architected with five pillars: **Reliability**, **Security**, **Operational Excellence**, **Performance Efficiency** and **Experience Optimization**. Each has design principles, a checklist, recommendations and tradeoffs, and an assessment (the Well-Architected Review). The **Intelligent application workload** guidance applies the pillars to agents and AI-infused apps; its structure (Get started, Architecture, Implement, Adopt, Manage, Improve) is a ready-made review agenda.

How each pillar lands on an AI workload:
- **Reliability**: identify critical conversational flows, design **reliable agentic loops** (bounded retries, timeouts, deterministic fallbacks to flows), handle transient faults in connectors, define target metrics (containment, resolution, latency) and test with failure-mode analysis.
- **Security**: security baseline and threat model for prompt injection and data exfiltration, data classification for knowledge sources, identity and access (Entra agent identities, least-privilege connections), secrets in environment variables and Azure Key Vault, monitoring for threats and incident response. Implement a **zoned governance strategy** (personal productivity, team, enterprise zones with different controls).
- **Operational Excellence**: capture governance requirements, an **ALM strategy** with solutions and pipelines, a **testing strategy** including agent evaluation, monitoring of operations, compliance and **Copilot Credit** capacity, and managing the **AI model lifecycle** for agents.
- **Performance Efficiency**: right-size models, cache and ground efficiently, keep knowledge sources lean, test early with realistic load, monitor latency per turn.
- **Experience Optimization**: design effective language understanding, topic authoring and trigger phrase best practices, slot filling, Teams deployment conventions and context-aware designs that avoid duplicate messages.

The **adoption maturity model** (pillars: AI strategy and experience, business strategy, AI governance and security, technology and data, organisation and culture) complements the framework for roadmap conversations. Exam questions typically describe a symptom (agent fails under load, credits exhausted, duplicate messages, unreviewed autonomous changes) and ask which pillar or recommendation applies.`,
    },
  ],
  examples: [
    {
      title: 'Triage in a canvas app without a chatbot',
      description:
        'Facilities staff log maintenance requests in a canvas app. The architect adds an AI Builder prompt action that classifies the free-text description and extracts the asset ID when the user taps Submit, shows the proposed category and priority for confirmation, stores the prompt version with the record, and triggers an agent flow for high-priority items. No chat UI is needed.',
      takeaway: 'Embed AI as process steps (prompt or model actions with user confirmation) rather than defaulting to conversational UI.',
    },
    {
      title: 'A supervision console built with generative pages',
      description:
        'A procurement agent creates purchase requisitions from supplier emails through the Power Apps MCP server, which posts tasks to the agent feed. Buyers wanted a single screen comparing the email, the extracted fields and the proposed requisition. The team used GitHub Copilot CLI to generate a React generative page code-first, checked it into source control inside the solution, and deployed it through pipelines.',
      takeaway: 'Pair the agent feed (via the Power Apps MCP server) with a code-first generative page for tailored human-agent review experiences.',
    },
    {
      title: 'Agent feed stopped working (a realistic mistake)',
      description:
        'After May 2026 a team\'s agent feed disappears from their model-driven app. Their Copilot Studio agent still created feed items through the older activity-based method. The fix is to onboard the agent to the Power Apps MCP server so it creates tasks the feed supports.',
      takeaway: 'The agent feed requires agents to create tasks through the Power Apps MCP server.',
    },
    {
      title: 'Well-Architected review of a failing agent',
      description:
        'An HR agent times out under month-end load, repeats messages in Teams, and has exhausted the environment\'s Copilot Credits twice. The review maps the issues to Performance Efficiency (oversized model and 40 knowledge sources), Experience Optimization (duplicate messages from non-context-aware topics) and Operational Excellence (no credit capacity monitoring). Remediation: trim knowledge, choose a lighter model for simple turns, apply context-aware topic design and add capacity alerts in the Power Platform admin center.',
      takeaway: 'Use the five pillars to diagnose agent symptoms and prioritise fixes.',
    },
  ],
  keyPoints: [
    'Power Platform AI has three layers: maker Copilots and AI code generation tools, the AI hub with AI Builder prompts and models (billed in Copilot Credits), and in-app AI for users (Microsoft Copilot in apps, Copilot answer control, form fill, agent feed).',
    'Prebuilt AI Builder models suit common scenarios; custom models (document processing, prediction, object detection, extraction) suit unique business data.',
    'Include AI in a canvas app process as prompt or model actions with user confirmation, Copilot answer controls, Microsoft Copilot in canvas apps (customisable with a Copilot Studio agent), or handoff to agents and flows; the legacy Copilot control cannot be added to new apps since February 2026.',
    'Generative pages produce React pages from natural language; the recommended code-first path uses AI code generation tools such as GitHub Copilot CLI for the latest models, source control and multi-page runs.',
    'The agent feed surfaces agent tasks in model-driven apps for human review and takeover; since May 2026 it supports only agents using the Power Apps MCP server.',
    'Power Platform Well-Architected pillars: Reliability, Security, Operational Excellence, Performance Efficiency, Experience Optimization, with intelligent application workload guidance spanning architecture, implementation, adoption, management and improvement.',
    'Typical AI-workload applications: reliable agentic loops and fallbacks (Reliability), threat modelling and zoned governance (Security), ALM, testing and credit monitoring (Operational Excellence), right-sized models and lean knowledge (Performance), topic and trigger-phrase design (Experience).',
  ],
  flashcards: [
    { front: 'Where do makers find AI Builder prompts and models in Power Apps or Power Automate?', back: 'In the AI hub (AI hub > Prompts or AI models).' },
    { front: 'When should you use a custom AI Builder model instead of a prebuilt one?', back: 'When the data is unique to your business (custom documents, your historical outcomes, your product images); prebuilt models cover common scenarios such as receipts, invoices and sentiment.' },
    { front: 'What replaced the Copilot control for canvas apps?', back: 'Microsoft Copilot in canvas apps; the Copilot control cannot be added to new apps since 2 February 2026.' },
    { front: 'What does a generative page generate?', back: 'A fully functional React page (layout, components and business logic) for a model-driven app from a natural-language description, using Dataverse tables, connectors or custom APIs.' },
    { front: 'Why does Microsoft recommend the code-first path for generative pages?', back: 'Latest frontier models, worldwide availability, TypeScript and React in your IDE with source control, and multi-page generation with supporting tables in one run.' },
    { front: 'What is the agent feed?', back: 'A task-based feed in model-driven apps where users review, validate, complete or take over agent-generated work; it requires agents to create tasks through the Power Apps MCP server.' },
    { front: 'What two capability types does the Power Apps MCP server provide?', back: 'Automating repetitive app tasks (for example data entry from unstructured content with human review) and supervising agent activity through the agent feed.' },
    { front: 'List the five Power Platform Well-Architected pillars.', back: 'Reliability, Security, Operational Excellence, Performance Efficiency and Experience Optimization.' },
    { front: 'Which pillar covers ALM, monitoring and Copilot Credit capacity management?', back: 'Operational Excellence.' },
    { front: 'Which pillar covers topic authoring, trigger phrases and avoiding duplicate messages?', back: 'Experience Optimization.' },
  ],
  quiz: [
    {
      question:
        'A field inspection canvas app must classify free-text defect descriptions and extract asset IDs before saving, with inspectors confirming the result. Which approach is MOST appropriate?',
      options: [
        'Add the legacy Copilot control to the app for inspectors to chat with',
        'Call an AI Builder prompt action from Power Fx on submit and display the proposed values for confirmation',
        'Publish a Copilot Studio agent to a public website',
        'Train a custom engine agent in Foundry',
      ],
      correct: [1],
      explanation:
        'A prompt action embedded in the process with user confirmation fits the requirement. The Copilot control cannot be added to new apps, a website agent is the wrong surface, and a custom engine agent is disproportionate.',
    },
    {
      question:
        'Supervisors need a bespoke review console in a model-driven app comparing supplier emails with extracted requisition data, maintained in source control with repeatable deployments. Which approach aligns with Microsoft\'s recommendation?',
      options: [
        'Build the page in the browser at make.powerapps.com only',
        'Create a code-first generative page with AI code generation tools such as GitHub Copilot CLI and include it in the solution',
        'Use a classic canvas app embedded in the model-driven app',
        'Export the data to Excel for review',
      ],
      correct: [1],
      explanation:
        'Code-first generative pages are the recommended path and support source control and ALM. In-browser authoring lacks the code workflow, and the other options do not meet the bespoke, maintainable requirement.',
    },
    {
      question:
        'After May 2026, an organisation\'s agent feed no longer appears in its model-driven app. What is the MOST likely cause?',
      options: [
        'The app lacks a Microsoft 365 Copilot licence',
        'The agents create feed items through the older activity-based method instead of the Power Apps MCP server',
        'Dataverse search is turned off',
        'The environment is not a managed environment',
      ],
      correct: [1],
      explanation:
        'From May 2026 the agent feed only supports agents that use the Power Apps MCP server to create tasks. The other settings do not control the agent feed\'s appearance.',
    },
    {
      question:
        'Which TWO issues map to the Operational Excellence pillar of Power Platform Well-Architected for an agent workload? (Select two)',
      options: [
        'No pipeline exists to move the agent between development, test and production',
        'Copilot Credit capacity is exhausted without any alerting',
        'The agent sends duplicate messages in Teams',
        'Knowledge sources include confidential documents without classification',
      ],
      correct: [0, 1],
      explanation:
        'ALM and capacity monitoring are Operational Excellence concerns. Duplicate messages are an Experience Optimization issue and data classification belongs to Security.',
    },
    {
      question:
        'Users want to ask natural-language questions about Dataverse data directly inside a canvas app. Which prerequisites must the architect confirm?',
      options: [
        'A Foundry project and Azure AI Search index',
        'Dataverse search enabled and the tenant setting allowing Dataverse data in Microsoft Copilot, with Microsoft Copilot enabled for the environment and app',
        'A Teams admin policy permitting custom apps',
        'An AI Builder prediction model trained on the tables',
      ],
      correct: [1],
      explanation:
        'Microsoft Copilot in canvas apps requires Dataverse search and the tenant setting for Dataverse data in Copilot, plus enabling the feature. Foundry, Teams policies and prediction models are unrelated.',
    },
    {
      question:
        'A finance team needs to extract line items from thousands of supplier invoices in a Power Automate flow without writing code. Which Power Platform AI feature should you propose?',
      options: [
        'The AI Builder prebuilt invoice processing model from the AI hub',
        'A generative page',
        'The agent feed',
        'Copilot for Power Fx formulas',
      ],
      correct: [0],
      explanation:
        'Invoice processing is a prebuilt AI Builder model. Generative pages build UI, the agent feed supervises agent tasks, and Power Fx Copilot helps makers write formulas.',
    },
  ],
  statements: [
    { text: 'AI Builder prompts and models consume Copilot Credits allocated to the environment.', isTrue: true, explanation: 'AI Builder capacity is licensed through Copilot Credits.' },
    { text: 'The legacy Copilot control can still be added to new canvas apps.', isTrue: false, explanation: 'Since 2 February 2026 it cannot be added to new apps; Microsoft Copilot in canvas apps replaces it.' },
    { text: 'Generative pages can only be authored in the browser at make.powerapps.com.', isTrue: false, explanation: 'They can also, and preferably, be authored code-first with AI code generation tools such as GitHub Copilot CLI.' },
    { text: 'The agent feed lets business users review and take over agent-generated tasks inside model-driven apps.', isTrue: true, explanation: 'It is the human-agent collaboration and supervision surface.' },
    { text: 'Power Platform Well-Architected has four pillars identical to Azure Well-Architected.', isTrue: false, explanation: 'It has five pillars, including Experience Optimization in place of Azure\'s Cost Optimization.' },
    { text: 'Turning off Copilot for makers at tenant level also disables Copilot for model-driven app users.', isTrue: false, explanation: 'The maker setting does not turn off the Copilot control for canvas apps or Copilot for model-driven apps.' },
    { text: 'Power Apps in Microsoft Copilot generates an MCP server and declarative agent from a model-driven app.', isTrue: true, explanation: 'This preview feature surfaces app data as interactive UI inside Copilot.' },
  ],
  resources: [
    { label: 'Generate a page using natural language (generative pages)', url: 'https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/generative-pages' },
    { label: 'Work with the Power Apps MCP Server and agent feed', url: 'https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/power-apps-mcp-server' },
    { label: 'Power Platform Well-Architected: intelligent application workload', url: 'https://learn.microsoft.com/en-us/power-platform/well-architected/intelligent-application/' },
    { label: 'Overview of AI Builder', url: 'https://learn.microsoft.com/en-us/ai-builder/overview' },
  ],
};
