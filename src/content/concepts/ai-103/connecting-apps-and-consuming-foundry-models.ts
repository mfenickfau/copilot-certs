import type { Concept } from '../../types';

export const connectingAppsAndConsumingFoundryModels: Concept = {
  id: 'connecting-apps-and-consuming-foundry-models',
  title: 'Connecting an App to a Foundry Project and Consuming Models with the SDKs',
  summary:
    'The code path from application to model: project endpoints and keyless authentication, AIProjectClient and the OpenAI client it hands you, the Responses API versus Chat Completions, consuming LLMs, small models, code models and multimodal models through one deployment-name convention, connections and connectors for other services, and tuning generation with prompt engineering and parameters such as temperature, max_output_tokens, reasoning_effort and structured outputs.',
  certs: ['ai-103', 'ai-901'],
  domains: ['ai-103-2', 'ai-901-2'],
  outcomes: ['ai-103-2-1-1', 'ai-103-2-1-5', 'ai-103-2-1-6', 'ai-103-2-3-1', 'ai-901-2-1-3'],
  tags: ['azure-ai-projects', 'openai-sdk', 'responses-api', 'chat-completions', 'prompt-engineering', 'parameters', 'structured-outputs', 'connections', 'python', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Connecting to a Foundry project',
      body: `Every Foundry project exposes an endpoint of the form \`https://<resource>.services.ai.azure.com/api/projects/<project>\` (shown on the project overview page). The Python package is **azure-ai-projects** 2.x (the 1.x line and connection strings belong to classic hub projects and are incompatible). The client is:

\`\`\`python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
project = AIProjectClient(endpoint=PROJECT_ENDPOINT, credential=DefaultAzureCredential())
openai = project.get_openai_client()        # OpenAI SDK client bound to the project
\`\`\`

\`DefaultAzureCredential\` tries, in order, environment variables, workload identity, managed identity, Azure CLI (\`az login\`), Visual Studio Code and other local credentials, so the same code works on a laptop and in Azure. The caller needs **Foundry User** on the project (or **Foundry Agent Consumer** to only invoke agents). Agents, evaluations, datasets, Content Understanding and workflows *require* Entra ID; API keys cannot be used for them.

What \`AIProjectClient\` gives you besides the OpenAI client: \`project.agents\` (create and version agents), \`project.connections\` (look up connected resources such as Azure AI Search, Application Insights, MCP servers, Bing, OpenAPI connections, by name to get an id), \`project.datasets\` and evaluation helpers, and \`project.beta.memory_stores\`. **Connections** are how a project reaches other services without secrets in code: a connection stores the target, auth type (API key, Entra, project managed identity, RemoteTool) and is referenced by tools and skills. In C# the equivalent is \`AIProjectClient\` with \`ProjectOpenAIClient\`; TypeScript uses \`@azure/ai-projects\`; Java uses \`AgentsClientBuilder\`.

Two endpoint styles to recognise: the **project endpoint** (\`.../api/projects/<p>/openai/v1/responses\`) adds project-scoped files, Foundry tools (SharePoint, Work IQ, Fabric IQ, memory), on-behalf-of auth and project guardrails; the **Azure OpenAI endpoint** (\`https://<resource>.openai.azure.com/openai/v1/\`) gives the lowest latency and maximum compatibility with existing OpenAI clients. The \`/openai/v1/\` route uses implicit versioning, so no \`api-version\` query string.`,
    },
    {
      heading: 'Deploying and consuming LLMs, small, code and multimodal models',
      body: `A **deployment name** is what you pass as \`model\`; it does not have to equal the model name. Deploy from the catalog (Build > Models > Deploy, or Bicep/CLI), then call it. The **Responses API** is the recommended, single entry point for text, vision, tools and agents; **Chat Completions** remains for compatibility. Non-OpenAI models sold by Azure (DeepSeek, Llama, Grok) answer on the same v1 endpoint when they support Responses; otherwise fall back to Chat Completions (a 400 "Model not supported" tells you).

\`\`\`python
# Text, any deployment
r = openai.responses.create(model="gpt-5-mini", input="Summarise the attached policy in 3 bullets.")
print(r.output_text)

# Multimodal input (image URL or base64 data URL), optional detail low|high|auto
r = openai.responses.create(model="gpt-5", input=[{"role": "user", "content": [
    {"type": "input_text", "text": "What safety hazards are visible?"},
    {"type": "input_image", "image_url": photo_url, "detail": "high"}]}])

# Multi-turn without replaying history
r2 = openai.responses.create(model="gpt-5-mini", previous_response_id=r.id, input="Rank them.")
\`\`\`

Code models (Codex family) and reasoning models use the same call but different knobs: reasoning models accept \`reasoning={"effort": "low|medium|high"}\` (Chat Completions: \`reasoning_effort\`) and \`max_output_tokens\` (reasoning tokens bill as output), and they ignore or reject \`temperature\`. Small models such as gpt-5-mini, gpt-5-nano and Phi are consumed identically but at a fraction of the cost. Embeddings use \`openai.embeddings.create(model="text-embedding-3-small", input=texts)\`. Audio and realtime models use the Realtime API or Voice Live, and image models use the images or Responses endpoints (covered in the vision and speech concepts). **Streaming** (\`stream=True\`) lowers perceived latency; **prompt caching** discounts repeated prefixes (put stable system text first; on newer models set \`prompt_cache_key\`).`,
    },
    {
      heading: 'Integrating generative workflows with SDKs and connectors',
      body: `Beyond one-off calls, Foundry integrates through several layers you should be able to name:

- **Foundry SDKs** (Python, C#, JavaScript/TypeScript, Java) wrap the project API; the **OpenAI SDK** works directly against the v1 endpoints; **Microsoft Agent Framework** (\`agent-framework-foundry\`, \`FoundryChatClient\`) adds tool wiring, multi-agent orchestration and tracing; **LangChain and LangGraph** integrate through \`langchain-azure-ai\`; **Semantic Kernel** remains supported for existing code.
- **Function calling / tools**: describe functions with JSON Schema (\`strict=True\` for exact arguments); the model returns a \`function_call\` item, your code runs it and returns a \`function_call_output\`. Hosted tools (web search, file search, code interpreter, MCP, image generation) run server-side.
- **Connectors**: project **connections** to Azure AI Search, Application Insights, Key Vault, Storage, Bing, OpenAPI and MCP servers; the **Foundry Tools catalog** of 1,000+ connectors (SharePoint, Teams, Dynamics, SaaS systems) published as **managed MCP servers**; **Azure Functions** and **Logic Apps** for event-driven glue; **Azure API Management** as an AI gateway; **Power Platform and Copilot Studio** can consume Foundry agents and Foundry IQ knowledge bases.
- **Publishing**: a prompt agent can be published to **Microsoft 365 Copilot and Teams** from the portal; hosted agents expose Responses or Invocations protocols (webhooks, custom JSON) and can be reached over **A2A**.

Secrets and configuration live in connections, Key Vault and environment variables; code holds only endpoint and deployment names.`,
    },
    {
      heading: 'Tuning generation: prompts and parameters',
      body: `Prompt engineering on this exam is practical, not mystical. Microsoft's guidance:

- Structure the **system message**: role, task, constraints, output format, grounding rules ("answer only from the provided documents; say I don't know otherwise"), safety instructions (the **safety system message templates**). Put instructions first and stable content first for caching; mark untrusted content clearly (spotlighting) and never mix user data into instructions.
- Use **few-shot examples**, **chain-of-thought cues** ("think step by step") for non-reasoning models, explicit **output schemas**, and break big tasks into steps. Reasoning models prefer concise goals without few-shot padding.
- **Structured outputs**: \`response_format\` with a Pydantic model via \`client.beta.chat.completions.parse(...)\` or \`text={"format": {...}}\` on Responses guarantees schema-valid JSON; JSON mode only guarantees valid JSON, not your schema.

Parameters and what they change:

| Parameter | Effect | Guidance |
|---|---|---|
| \`temperature\` (0 to 2) | Randomness of token choice | 0 to 0.3 for extraction and classification; higher for creative text; change *either* temperature or top_p |
| \`top_p\` | Nucleus sampling cut-off | Alternative to temperature |
| \`max_output_tokens\` / \`max_completion_tokens\` | Caps generated tokens (including reasoning tokens) | Prevents runaway cost; too low truncates |
| \`stop\` sequences | End generation at a marker | Useful for list or code boundaries |
| \`frequency_penalty\`, \`presence_penalty\` | Discourage repetition / encourage new topics | Small values |
| \`seed\` | Best-effort reproducibility | For evaluation runs |
| \`reasoning.effort\` | How long reasoning models think | Trade latency and cost against quality |
| \`tool_choice\` | auto, required, none, or a named tool | Force or forbid tool calls |

Exam framings: "answers vary run to run for an extraction task" → lower temperature (and use structured outputs); "responses are cut off" → raise max tokens; "model ignores the schema" → structured outputs with strict schema, not JSON mode; "reasoning model returns an error about temperature" → remove sampling parameters and use reasoning effort.`,
    },
  ],
  examples: [
    {
      title: 'A keyless chat client bound to a project',
      description:
        'A console app connects to a project, sends a prompt to gpt-5-mini through the Responses API, and continues the conversation with previous_response_id so no history is replayed by the client.',
      language: 'python',
      code: `import os
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

project = AIProjectClient(endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
                          credential=DefaultAzureCredential())
openai = project.get_openai_client()

first = openai.responses.create(
    model="gpt-5-mini",
    instructions="You are a concise travel assistant. Answer in two sentences.",
    input="What should I pack for Oslo in March?",
)
print(first.output_text)

follow = openai.responses.create(
    model="gpt-5-mini",
    previous_response_id=first.id,       # server keeps the context
    input="And for a child?",
)
print(follow.output_text, follow.usage.total_tokens)`,
      takeaway: 'AIProjectClient plus get_openai_client is the standard Foundry entry point; the Responses API carries context with previous_response_id or conversations.',
    },
    {
      title: 'Structured output for a domain extraction task',
      description:
        'A compliance team extracts obligations from clauses. A loose "return JSON" prompt produced inconsistent keys, so the team moves to a strict schema with Pydantic and a near-zero temperature.',
      language: 'python',
      code: `from pydantic import BaseModel
from openai import OpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

token = get_bearer_token_provider(DefaultAzureCredential(), "https://ai.azure.com/.default")
client = OpenAI(base_url="https://contoso.openai.azure.com/openai/v1/", api_key=token)

class Obligation(BaseModel):
    party: str
    action: str
    deadline_days: int | None
    penalty_clause: bool

completion = client.beta.chat.completions.parse(
    model="gpt-5-mini",                       # deployment name
    temperature=0,
    messages=[{"role": "system", "content": "Extract contractual obligations. Use null if absent."},
              {"role": "user", "content": clause_text}],
    response_format=Obligation,               # schema-enforced, not just valid JSON
)
obligation = completion.choices[0].message.parsed`,
      takeaway: 'For extraction, combine low temperature with structured outputs; JSON mode alone does not enforce your schema.',
    },
    {
      title: 'The reasoning-model parameter mistake',
      description:
        'A developer swaps gpt-4.1 for a reasoning model, keeps temperature=0.2 and max_tokens=200, and gets errors plus empty answers. Reasoning models reject sampling parameters and spend hidden reasoning tokens that count toward the output cap. The fix removes temperature, uses max_output_tokens with headroom and sets reasoning effort explicitly.',
      language: 'python',
      code: `# Before: fails or truncates on a reasoning model
# r = openai.responses.create(model="o4-mini", temperature=0.2, max_output_tokens=200, input=q)

# After
r = openai.responses.create(
    model="o4-mini",
    input=q,
    reasoning={"effort": "medium"},   # low | medium | high
    max_output_tokens=4000,           # reasoning tokens are billed as output
)
print(r.output_text)
print(r.usage.output_tokens_details.reasoning_tokens)`,
      takeaway: 'Reasoning models are tuned with reasoning effort and a generous output cap, not temperature or top_p.',
    },
  ],
  keyPoints: [
    'Connect with AIProjectClient(endpoint, DefaultAzureCredential()) using azure-ai-projects 2.x and the project endpoint https://<resource>.services.ai.azure.com/api/projects/<project>; get_openai_client() returns an OpenAI SDK client.',
    'Agents, evaluations, datasets, Content Understanding and workflows require Entra ID; the caller needs Foundry User (or Foundry Agent Consumer to only call agents).',
    'The Responses API on the /openai/v1/ route is the recommended single entry point; pass the deployment name as model; Chat Completions remains for compatibility.',
    'The project endpoint adds project-scoped data, Foundry tools, on-behalf-of auth and project guardrails; the Azure OpenAI endpoint offers lowest latency and OpenAI-client compatibility.',
    'Multimodal input uses input_image items (URL or base64 data URL) with an optional detail level; multi-turn uses previous_response_id or conversations.',
    'Connections store targets and credentials for Search, App Insights, MCP, OpenAPI and Bing; the Tools catalog publishes 1,000+ connectors as managed MCP servers.',
    'Lower temperature (or top_p, not both) for deterministic extraction; raise max_output_tokens when answers truncate; use structured outputs for schema-valid JSON.',
    'Reasoning models take reasoning effort and max_output_tokens (reasoning tokens bill as output) and reject temperature and top_p.',
  ],
  flashcards: [
    { front: 'What is the format of a Foundry project endpoint?', back: 'https://<resource-name>.services.ai.azure.com/api/projects/<project-name>' },
    { front: 'Which Python package and version line is used with Foundry (new) projects?', back: 'azure-ai-projects 2.x; 1.x targets classic hub projects and is incompatible.' },
    { front: 'How do you get an OpenAI-compatible client from AIProjectClient?', back: 'project.get_openai_client(), optionally with agent_name=... to bind it to a prompt agent.' },
    { front: 'What value do you pass in the model field of a Foundry request?', back: 'The deployment name, which need not equal the underlying model name.' },
    { front: 'How does the Responses API continue a conversation without resending history?', back: 'Pass previous_response_id (or use a server-side conversation id).' },
    { front: 'Which Foundry features cannot be used with API-key authentication?', back: 'Agents, evaluations, the dataset tab, Content Understanding and workflows require Microsoft Entra ID.' },
    { front: 'Structured outputs vs JSON mode?', back: 'Structured outputs enforce your JSON schema (response_format with a schema or Pydantic model); JSON mode only guarantees syntactically valid JSON.' },
    { front: 'Which parameter controls how long a reasoning model thinks?', back: 'reasoning effort (reasoning={"effort": ...} on Responses, reasoning_effort on Chat Completions): low, medium, high and model-specific values.' },
    { front: 'Why should you not change temperature and top_p together?', back: 'Both control randomness; Microsoft recommends adjusting one or the other to keep behaviour predictable.' },
    { front: 'What is a project connection?', back: 'A stored reference to another service (Azure AI Search, App Insights, MCP server, OpenAPI, Bing) with its authentication, referenced by id from tools so code holds no secrets.' },
  ],
  quiz: [
    {
      question:
        'A developer writes a Python app that must create agents and run evaluations in a Foundry project. Which authentication approach is required?',
      options: [
        'The resource API key passed as api_key.',
        'Microsoft Entra ID with DefaultAzureCredential and the Foundry User role on the project.',
        'A shared access signature for the storage account.',
        'Basic authentication with a username and password.',
      ],
      correct: [1],
      explanation:
        'Agents and evaluations require Entra ID; API keys are not accepted for them. SAS tokens and basic auth are not Foundry authentication methods.',
    },
    {
      question:
        'A legal extraction job must return the same JSON structure every time and never invent fields. Which TWO settings help most? (Select two)',
      options: [
        'Set temperature to 0.',
        'Use structured outputs with a strict schema (response_format).',
        'Set temperature to 1.5 for richer answers.',
        'Enable JSON mode without a schema.',
      ],
      correct: [0, 1],
      explanation:
        'Low temperature reduces variation and structured outputs enforce the schema. High temperature increases variation, and JSON mode only guarantees valid JSON, not your shape.',
    },
    {
      question:
        'An existing application uses the OpenAI Python SDK against the public OpenAI API. You want to move it to Foundry with minimal code changes and lowest latency, using only OpenAI models. Which endpoint should it target?',
      options: [
        'https://<resource>.openai.azure.com/openai/v1/ with the deployment name as model.',
        'The project endpoint\'s Content Understanding route.',
        'The Azure AI Search endpoint.',
        'The Application Insights ingestion endpoint.',
      ],
      correct: [0],
      explanation:
        'The Azure OpenAI v1 endpoint offers maximum compatibility with OpenAI clients and best latency. Content Understanding, Search and App Insights are different services.',
    },
    {
      question: 'After switching to a reasoning model, requests fail because of the temperature parameter. What should you do?',
      options: [
        'Set temperature to 0 instead of 0.7.',
        'Remove temperature and top_p, and control depth with the reasoning effort parameter and max_output_tokens.',
        'Switch to JSON mode.',
        'Increase frequency_penalty.',
      ],
      correct: [1],
      explanation:
        'Reasoning models do not support sampling parameters; use reasoning effort and a sufficient output cap. JSON mode and penalties do not address the error.',
    },
    {
      question: 'Which capability is available ONLY when calling the Responses API through the Foundry project endpoint rather than the Azure OpenAI resource endpoint?',
      options: [
        'Streaming responses.',
        'Foundry-specific tools such as SharePoint, Work IQ and memory, plus on-behalf-of tool authentication and project guardrails.',
        'Setting the temperature parameter.',
        'Using the deployment name as the model field.',
      ],
      correct: [1],
      explanation:
        'The project endpoint adds project-scoped data, Foundry tools, OBO auth and project-level governance. Streaming, temperature and deployment names work on both endpoints.',
    },
  ],
  statements: [
    { text: 'The /openai/v1/ route on a Foundry resource requires an api-version query parameter.', isTrue: false, explanation: 'The v1 route uses implicit versioning; no api-version is passed.' },
    { text: 'DefaultAzureCredential lets the same code authenticate with az login locally and managed identity in Azure.', isTrue: true, explanation: 'It chains credential sources in order and picks the first that works.' },
    { text: 'Reasoning tokens produced by o-series or GPT-5 reasoning are billed as output tokens.', isTrue: true, explanation: 'Set max_output_tokens with headroom so visible answers are not truncated.' },
    { text: 'Few-shot examples and chain-of-thought phrases are recommended for reasoning models such as gpt-5 and o-series.', isTrue: false, explanation: 'Microsoft notes these classic techniques are not recommended for reasoning models, which prefer concise goals.' },
    { text: 'A project connection can authenticate to an MCP server using the project managed identity.', isTrue: true, explanation: 'Connections support API key, Entra, project managed identity and RemoteTool auth types.' },
    { text: 'Models from the catalog that do not support the Responses API return HTTP 400 Model not supported, and you should use Chat Completions instead.', isTrue: true, explanation: 'This is the documented fallback behaviour on the v1 endpoint.' },
    { text: 'Prompt caching works best when the variable user content is placed at the start of the prompt.', isTrue: false, explanation: 'Caching matches identical prefixes, so stable system content must come first and variable content last.' },
  ],
  resources: [
    { label: 'Quickstart: Get started with Microsoft Foundry SDK', url: 'https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code' },
    { label: 'Endpoints for Microsoft Foundry Models', url: 'https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/endpoints' },
    { label: 'Structured outputs', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/structured-outputs' },
    { label: 'Prompt engineering techniques', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering' },
  ],
};
