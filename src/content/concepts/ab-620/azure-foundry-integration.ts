import type { Concept } from '../../types';

export const azureFoundryIntegration: Concept = {
  id: 'azure-foundry-integration',
  title: 'Integrating Agents with Azure: Foundry Models, Azure AI Search and Application Insights',
  summary:
    'The Azure side of a Copilot Studio solution: generative answers grounded through Azure OpenAI on your data and Azure AI Search built in Microsoft Foundry, custom prompts that run on models from the Foundry model catalog, external primary models and their admin controls, and agent-level and environment-level telemetry in Application Insights.',
  certs: ['ab-620'],
  domains: ['ab-620-2'],
  outcomes: ['ab-620-2-4-1', 'ab-620-2-4-2', 'ab-620-2-4-3'],
  tags: ['copilot-studio', 'foundry', 'azure-openai', 'azure-ai-search', 'model-catalog', 'application-insights', 'telemetry', 'kql'],
  difficulty: 'advanced',
  diagram: 'foundry-agent-stack',
  sections: [
    {
      heading: 'Generative answers with Azure AI Search and Foundry',
      body: `There are two ways to bring an Azure AI Search index built in **Microsoft Foundry** (formerly Azure AI Foundry) into a Copilot Studio answer:

1. **Azure AI Search as a knowledge source** (agent level or in a generative answers node): connect to one vector index with access key, certificate, service principal or Entra integrated authentication. This is the GA route and is covered in the knowledge concept.
2. **Azure OpenAI on your data (preview)** in a **generative answers node**: in Foundry you connect a data source (for example blob storage indexed by Azure AI Search) to an Azure OpenAI model and choose **Deploy to > A new Microsoft Copilot Studio bot**. Foundry creates an agent in your default environment, wires the Azure connection, and generates a **Conversational boosting** system topic. In any topic you open the generative answers node, choose **Classic data**, **Add connection** to the Azure OpenAI Service, and adjust **Connection properties** for model and data parameters. The node then answers from the Azure-indexed data while respecting Azure OpenAI content policies.

Design points: knowledge in a node **overrides** agent-level knowledge (agent level acts as fallback); Azure OpenAI on your data is only available under **Classic data** and not in generative orchestration's proactive search; classic orchestration allows up to five Azure OpenAI connections. Choose this path when the Foundry team already owns the retrieval configuration (chunking, hybrid search, system message) and Copilot Studio is the conversational front end; choose the direct Azure AI Search knowledge source when Copilot Studio should own retrieval and you want generative orchestration to search it proactively. Both work with **private endpoints** and Power Platform **Virtual Network** support.`,
    },
    {
      heading: 'Foundry model catalog for custom prompts, and external primary models',
      body: `**Prompts** run by default on Microsoft-managed models (GPT-4.1 mini default, GPT-4.1, GPT-5 chat and reasoning variants, and others, categorised Mini, General and Deep with basic, standard and premium Copilot Credit rates). **Bring your own model** lets a prompt use any **chat-completion** model deployed in the **Foundry model catalog** (OpenAI, Llama, DeepSeek, Phi and more than 1,800 others):

1. In the prompt editor, open the **Model** dropdown and select **+** to **Connect a model from Azure AI Foundry**.
2. Enter the **model deployment name** and **base model name** exactly as they appear in Foundry, plus the endpoint. The endpoint must be the **chat completions** URL ending in \`/chat/completions\`; the Responses API endpoint (\`/openai/v1/responses\`) fails with "Resource not found". GPT-5 family models are not supported for BYO model.
3. **Connect**; the model then appears in the dropdown and every run of that prompt uses it.

Image or document inputs filter the dropdown to vision-capable models (Phi-3.5-vision, Phi-4-multimodal, GPT-4o, GPT-4o mini, o1 and others). The integration is a connector named **Azure AI Foundry**, so admins can govern it with a **data policy**, and Microsoft recommends applying responsible-AI policies to the model in Foundry. Image generation is not native; expose a DALL-E deployment as a REST endpoint and call it from a tool.

Separately, an agent's **primary model** (Overview page > Model) can be an **external model** from **Anthropic**, **Mistral** or **xAI**. Admins must **turn on external models** in the Power Platform admin center (environment or environment group) and **allow each provider** in the **Microsoft 365 admin center**; preview and external model controls are independent. If an admin later removes a provider, agents fall back to a suitable internal model or error until the maker changes the model. The **default model** is also the fallback when a selected model is unavailable.`,
    },
    {
      heading: 'Application Insights telemetry',
      body: `Copilot Studio's built-in **Monitor** page covers sessions, outcomes, themes and custom metrics. For enterprise observability, alerting and correlation with other systems you export to **Azure Monitor Application Insights** at one of two scopes:

| | Agent-level telemetry | Environment-level telemetry (preview) |
|---|---|---|
| Configured | Per agent: Settings > Advanced > Application Insights **connection string** | Once per **managed environment**, as an export package in the Power Platform admin center |
| Owner | Maker or dev team | Admin, platform or CoE team (tenant-level Power Platform admin plus Dataverse admin role) |
| Harness | Standard only | Standard and Microsoft Copilot harness |
| Shape | **Event-based**, in the \`customEvents\` table | **OpenTelemetry-aligned spans** in the \`dependencies\` table: \`InvokeAgent\`, \`ExecuteTool\`, \`OutputMessages\`, grouped per turn by \`operation_Id\` and per conversation by \`gen_ai.conversation.id\` |
| Best for | Message activity, topic events, custom events, single-agent troubleshooting | Agent invocations, tool execution, dependencies, cross-agent monitoring |

Agent-level options: **Enable logging**, **Log conversation details** (user ID, name, message text; also tool inputs and outputs in spans) and **Log sensitive Activity properties**. All conversations, including tests, are logged; filter them out with the \`designMode\` custom dimension. The **Copilot Studio Dashboard** workbook in Application Insights (Monitoring > Workbooks) visualises conversations, latency, exceptions, tool usage and topic analytics and can be edited and shared (readers need the Reader role on the resource).

Governance: block the **Application Insights in Copilot Studio** connector with a data policy to prevent makers configuring agent-level telemetry, and standardise on the environment-level export. Environment-level data can take up to 24 hours to appear on new configurations. Application Insights requires an Azure subscription.`,
    },
    {
      heading: 'The exam angle',
      body: `Expect items that place a requirement on one of these three integration points:

- "Use the Azure AI Search index that the Foundry team maintains, with their Azure OpenAI configuration": **Azure OpenAI on your data** connection under Classic data in a generative answers node (or Deploy to Copilot Studio from Foundry).
- "Prompt must run on a Llama or DeepSeek model deployed in Foundry": **bring your own model** in the prompt's Model dropdown, with the chat completions endpoint.
- "Connection fails with Resource not found": the endpoint is the **Responses API**; use \`/chat/completions\`.
- "Makers cannot select Anthropic models": admin must enable **external models** in the Power Platform admin center **and** allow the provider in the **Microsoft 365 admin center**.
- "Alert when tool execution fails across all agents in the environment": **environment-level** telemetry, query the \`dependencies\` table for \`ExecuteTool\` spans with \`resultCode == "ERROR"\`.
- "A maker wants to see how many distinct users chatted with their agent per day": **agent-level** telemetry, KQL on \`customEvents\`, excluding \`designMode == "True"\`.
- "Prevent makers from sending telemetry to their own Application Insights": **data policy** blocking the Application Insights in Copilot Studio connector.

Distractors: putting an Azure OpenAI endpoint into the Send HTTP request node when a supported connection exists, expecting BYO model to work with the agent's primary model picker (that is the external-model feature), confusing the Monitor page with Application Insights, or assuming the environment export includes Microsoft Copilot harness logs for everything (only standard-harness agents built in Copilot Studio are fully covered).`,
    },
  ],
  examples: [
    {
      title: 'Alerting on failed tool calls across an environment',
      description:
        'The platform team enables environment-level telemetry export to a central Application Insights resource and writes a KQL query that counts failed ExecuteTool spans per agent over the last hour, then turns it into an Azure Monitor alert rule.',
      code: `dependencies
| where timestamp > ago(1h)
| where name == "ExecuteTool" and resultCode == "ERROR"
| extend agentName = tostring(customDimensions["gen_ai.agent.name"]),
         toolName  = tostring(customDimensions["gen_ai.tool.name"])
| summarize failures = count() by agentName, toolName
| where failures > 5
| order by failures desc`,
      language: 'text',
      takeaway: 'Environment-level spans in the dependencies table give cross-agent, per-tool observability that the Monitor page cannot.',
    },
    {
      title: 'Distinct users per day without test noise',
      description:
        'A maker connects their agent to Application Insights with a connection string under Settings > Advanced, turns on Enable logging, and queries customEvents for daily unique users while excluding conversations from the test canvas. They note the count is only meaningful because the agent is authenticated and user IDs are stable.',
      code: `customEvents
| where timestamp > ago(14d)
| extend isDesignMode = tostring(customDimensions["designMode"])
| where isDesignMode == "False"
| summarize uniqueUsers = dcount(user_Id) by bin(timestamp, 1d)
| render timechart`,
      language: 'text',
      takeaway: 'Agent-level telemetry lands in customEvents; filter designMode to separate production from authoring traffic.',
    },
    {
      title: 'The Responses endpoint that would not connect (a realistic mistake)',
      description:
        'A developer deploys a Llama model in Foundry and pastes its endpoint into the Connect a model from Azure AI Foundry dialog. The connection fails with Resource not found. The URL ended in /openai/v1/responses; BYO model supports only chat-completion endpoints. Switching to the /chat/completions URL and double-checking the deployment and base model names fixes it.',
      code: `# Works (chat completions)
https://contoso-foundry.services.ai.azure.com/openai/deployments/llama-3-70b/chat/completions

# Fails with "Resource not found" (Responses API)
https://contoso-foundry.services.ai.azure.com/openai/v1/responses`,
      language: 'text',
      takeaway: 'Bring-your-own-model connections must target the chat completions endpoint with exact deployment and base model names.',
    },
    {
      title: 'Unblocking Anthropic models for makers',
      description:
        'Makers report that Claude models appear greyed out in the primary model picker. The Power Platform admin confirms external models are enabled for the environment group, but the Microsoft 365 admin had not accepted the Anthropic provider in the Microsoft 365 admin center. After both controls are set, the models become selectable; the team also notes that experimental or preview tags mean the models are not recommended for production.',
      takeaway: 'External primary models require two separate admin approvals: Power Platform admin center (environment) and Microsoft 365 admin center (provider).',
    },
  ],
  keyPoints: [
    'Azure OpenAI on your data (preview) connects a generative answers node to a Foundry-managed Azure OpenAI plus Azure AI Search configuration under Classic data; Deploy to Copilot Studio from Foundry creates the agent and Conversational boosting topic.',
    'Azure AI Search can also be added directly as a knowledge source; node-level knowledge overrides agent-level knowledge.',
    'Bring your own model lets a prompt run on any chat-completion model from the Foundry model catalog via deployment name, base model name and a /chat/completions endpoint; GPT-5 family is excluded; the Azure AI Foundry connector is governed by data policies.',
    'External primary models (Anthropic, Mistral, xAI) need external models enabled in the Power Platform admin center and the provider allowed in the Microsoft 365 admin center; preview and external controls are separate.',
    'Agent-level Application Insights telemetry: connection string in Settings > Advanced, event-based customEvents, options for logging conversation details and sensitive properties, standard harness only.',
    'Environment-level telemetry (preview): configured once per managed environment in the Power Platform admin center, OpenTelemetry-aligned spans (InvokeAgent, ExecuteTool, OutputMessages) in the dependencies table, correlated by operation_Id and gen_ai.conversation.id.',
    'Use the designMode custom dimension to exclude test conversations; the Copilot Studio Dashboard workbook provides a ready-made view.',
    'Block the Application Insights in Copilot Studio connector with a data policy to centralise telemetry at environment level.',
  ],
  flashcards: [
    { front: 'How do you use an Azure OpenAI on your data configuration in a topic?', back: 'In a generative answers node, choose Classic data, Add connection to the Azure OpenAI Service, and adjust Connection properties.' },
    { front: 'What does Deploy to > A new Microsoft Copilot Studio bot in Foundry create?', back: 'An agent in your default environment connected to the Azure resource, with an auto-generated Conversational boosting system topic.' },
    { front: 'Which endpoint type must a bring-your-own Foundry model use for prompts?', back: 'A chat completions endpoint ending in /chat/completions; the Responses API endpoint fails with Resource not found.' },
    { front: 'Which two admin actions enable Anthropic, Mistral or xAI primary models?', back: 'Turn on external models in the Power Platform admin center (environment or group) and allow the provider in the Microsoft 365 admin center.' },
    { front: 'Where is agent-level Application Insights configured?', back: 'Agent Settings > Advanced > Application Insights connection string, with Enable logging, Log conversation details and Log sensitive Activity properties options.' },
    { front: 'Which Application Insights table holds agent-level Copilot Studio telemetry, and which holds environment-level spans?', back: 'customEvents for agent-level; dependencies for environment-level OpenTelemetry-aligned spans.' },
    { front: 'Name the three span types exported by environment-level telemetry.', back: 'InvokeAgent, ExecuteTool and OutputMessages.' },
    { front: 'How do you exclude test-canvas conversations from Application Insights queries?', back: 'Filter on customDimensions["designMode"] == "False".' },
    { front: 'How can an admin stop makers from configuring agent-level Application Insights?', back: 'Block the Application Insights in Copilot Studio connector with a Power Platform data policy.' },
    { front: 'Which harnesses does environment-level telemetry support?', back: 'Both the standard harness and the Microsoft Copilot harness (agent-level supports only the standard harness).' },
  ],
  quiz: [
    {
      question:
        'The Foundry team maintains an Azure OpenAI deployment connected to an Azure AI Search index with a tuned system message. A Copilot Studio topic must answer from that configuration. What should you configure?',
      options: [
        'A Send HTTP request node that posts to the Azure OpenAI endpoint',
        'A generative answers node with Classic data > Add connection to the Azure OpenAI Service',
        'A public website knowledge source pointing to the search endpoint',
        'Bring your own model on a prompt',
      ],
      correct: [1],
      explanation:
        'Azure OpenAI on your data is supported in the generative answers node under Classic data. An HTTP node bypasses the supported connection and governance, a website source cannot query a search index, and BYO model changes which model a prompt runs on rather than grounding.',
    },
    {
      question:
        'A prompt must run on a DeepSeek model deployed in the Foundry model catalog. In the Connect a model dialog the connection fails with Resource not found. What is the MOST likely cause?',
      options: [
        'The deployment uses the Responses API endpoint instead of the chat completions endpoint',
        'The agent uses Authenticate with Microsoft',
        'External models are disabled in the Microsoft 365 admin center',
        'The prompt has an image input',
      ],
      correct: [0],
      explanation:
        'BYO model supports chat-completion endpoints only; a /openai/v1/responses URL fails with that error. Agent authentication is unrelated, external-model admin settings govern the primary model picker, and image inputs only filter the model list.',
    },
    {
      question:
        'The platform team must receive alerts when tool executions fail for any of the 40 agents in a managed environment, without asking each maker to configure anything. Which approach is correct?',
      options: [
        'Ask each maker to enter the Application Insights connection string in their agent settings',
        'Configure environment-level telemetry export in the Power Platform admin center and alert on ExecuteTool spans in the dependencies table',
        'Export conversation transcripts from the Monitor page daily',
        'Enable Log sensitive Activity properties on every agent',
      ],
      correct: [1],
      explanation:
        'Environment-level export is configured once by admins and emits OpenTelemetry-aligned spans suitable for cross-agent alerting. Per-agent configuration depends on makers, transcripts are not an alerting mechanism, and sensitive property logging adds data rather than coverage.',
    },
    {
      question:
        'Which TWO statements about external primary models in Copilot Studio are correct? (Select two)',
      options: [
        'Admins must enable external models in the Power Platform admin center and allow the provider in the Microsoft 365 admin center',
        'Enabling preview models automatically enables external models',
        'If an admin removes access to an external model, agents using it switch to a suitable internal model or error until changed',
        'External models can only be used in agent flows, not as the agent\'s primary model',
      ],
      correct: [0, 2],
      explanation:
        'Two separate admin controls are required, and removal triggers fallback or errors. Preview and external model controls are independent, and external models are selected as the primary model on the agent Overview page.',
    },
    {
      question:
        'A maker queries customEvents and sees far more conversations than real users. What should they add to the query?',
      options: [
        'A filter on customDimensions["designMode"] == "False" to exclude test-canvas conversations',
        'A join to the dependencies table',
        'A filter on resultCode == "OK"',
        'A switch from agent-level to environment-level telemetry',
      ],
      correct: [0],
      explanation:
        'Agent-level telemetry logs test conversations too; designMode distinguishes them. The dependencies table and resultCode belong to environment-level spans, and switching scopes does not by itself remove test traffic.',
    },
  ],
  statements: [
    { text: 'Azure OpenAI on your data can be used as an agent-level knowledge source searched proactively by generative orchestration.', isTrue: false, explanation: 'It is available only under Classic data inside a generative answers node.' },
    { text: 'Bring your own model for prompts supports the GPT-5 family of models.', isTrue: false, explanation: 'GPT-5 and later models are not currently supported for BYO model in prompts.' },
    { text: 'The Azure AI Foundry connector used by bring your own model can be governed with a Power Platform data policy.', isTrue: true, explanation: 'It appears as the Azure AI Foundry connector in the policy page.' },
    { text: 'Agent-level Application Insights telemetry includes OpenTelemetry-aligned spans.', isTrue: false, explanation: 'Agent-level export is event-based in customEvents; only environment-level export is OpenTelemetry-aligned.' },
    { text: 'Each agent turn in environment-level telemetry is its own trace identified by a shared operation_Id.', isTrue: true, explanation: 'InvokeAgent is the root span; ExecuteTool and OutputMessages nest under it; gen_ai.conversation.id links turns.' },
    { text: 'Environment-level telemetry requires a managed environment.', isTrue: true, explanation: 'The feature is available only for managed environments.' },
    { text: 'Application Insights for Copilot Studio is included at no cost without an Azure subscription.', isTrue: false, explanation: 'Application Insights is an Azure Monitor feature that requires an Azure subscription.' },
  ],
  resources: [
    { label: 'Connect your data to Azure OpenAI for generative answers (preview)', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-generative-answers-azure-openai' },
    { label: 'Bring your own model for your prompts', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/bring-your-own-model-prompts' },
    { label: 'Telemetry with Application Insights overview', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/telemetry-overview' },
    { label: 'Agent-level telemetry with Application Insights', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-bot-framework-composer-capture-telemetry' },
  ],
};
