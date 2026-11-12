import type { Concept } from '../../types';

export const foundryAgents: Concept = {
  id: 'foundry-agents',
  title: 'Building and Calling a Single Agent with Foundry Agent Service',
  summary:
    'What a Foundry agent is made of (model, instructions, tools, knowledge), how to create and test a prompt agent in the Foundry portal\'s agents playground, how the Responses API with conversations gives it memory, and the minimal client application that talks to the agent from code.',
  certs: ['ai-901', 'ai-103'],
  domains: ['ai-901-2', 'ai-103-2'],
  outcomes: ['ai-901-2-1-4', 'ai-901-2-1-5', 'ai-103-2-2-1'],
  tags: ['agents', 'foundry-agent-service', 'prompt-agent', 'tools', 'responses-api', 'python', 'intermediate'],
  difficulty: 'intermediate',
  diagram: 'foundry-agent-stack',
  sections: [
    {
      heading: 'Anatomy of a Foundry agent',
      body: `**Foundry Agent Service** is the managed runtime in Microsoft Foundry for building, running and governing agents. An agent is a **model** plus **instructions** plus **tools**, hosted so that you do not write the orchestration loop yourself: the service receives a user message, lets the model reason, executes any tool calls, feeds results back, and returns the final answer, keeping the conversation state for you.

The building blocks you configure:

- **Model**: any supported deployment from the catalog (GPT-5, GPT-4.1, Claude, Llama and others). You can swap models without changing agent code.
- **Instructions**: the agent's system prompt. Role, goals, boundaries, tone, when to use which tool, when to ask for clarification.
- **Tools**: capabilities the agent can invoke. Built-in tools include **file search** (retrieval over uploaded files), **code interpreter** (runs Python in a sandbox for maths, charts and data), **web search** (Bing grounding), **Azure AI Search**, **SharePoint**, **Azure Functions**, **OpenAPI** specs, **MCP servers** and your own **function tools** whose definitions you describe and whose code runs in your application. A **Toolbox** curates a set of tools once and shares it across agents.
- **Knowledge**: data sources attached for grounding, such as files or a search index, usually surfaced through file search or AI Search tools.
- **Memory and conversations**: the Responses API keeps a server-side **conversation** so multi-turn context carries over without you replaying history.

Foundry offers three agent types. **Prompt agents** are defined entirely by configuration (instructions, model, tools) and run on Foundry's infrastructure with nothing for you to host. **Voice-based prompt agents** add real-time speech through Voice Live. **Hosted agents** are your own code (Microsoft Agent Framework, LangGraph, OpenAI Agents SDK or anything else) packaged as a container that Foundry runs with a managed endpoint, identity and scaling. AI-901 focuses on single prompt agents; the term you will see for a design-your-own-orchestration agent is hosted agent.`,
    },
    {
      heading: 'Creating and testing an agent in the Foundry portal',
      body: `The portal path for a single-agent solution:

1. Open your project and make sure a chat model is deployed (the agent getting-started flow can deploy one for you).
2. In the **Build** section select **Agents**, then **Create agent**. Give it a name.
3. In the setup pane choose the **model deployment**, write the **instructions**, and optionally add **tools** (for example upload a PDF to enable file search, or turn on code interpreter) and **knowledge** sources.
4. Chat with the agent in the **agents playground**. Test the happy path, then edge cases: out-of-scope questions, requests that should trigger a tool, ambiguous input.
5. Inspect the run: the playground exposes **tracing** (which tool was called with what arguments, how many tokens were used) and **evaluations** (AgentOps metrics such as intent resolution, tool-call accuracy and task adherence) so you can see *why* the agent behaved as it did.
6. Iterate on instructions and tools, and **save** a new agent **version**. Agents are versioned, so a client can pin a stable version while you keep experimenting.

Permissions matter in portal questions: creating or editing agents and chatting in the playground requires the **Foundry User** role (previously Azure AI User) on the project; creating the Foundry resource and project itself needs **Foundry Account Owner** or Contributor/Owner at the subscription level. Once satisfied, the **Code** tab shows how to call the agent from Python, C#, JavaScript or REST, and **publishing** can expose the agent to Microsoft Teams, Microsoft 365 Copilot or an API endpoint.`,
    },
    {
      heading: 'Calling the agent from a client application',
      body: `A lightweight agent client has three moves, mirroring the portal:

1. **Connect to the project**: \`AIProjectClient(endpoint=PROJECT_ENDPOINT, credential=DefaultAzureCredential())\`.
2. **Create or reference the agent**: \`project.agents.create_version(agent_name=..., definition=PromptAgentDefinition(model=..., instructions=..., tools=[...]))\` creates a new version; in production you normally reference an agent that already exists by name.
3. **Talk to it with the Responses API**: \`openai = project.get_openai_client(agent_name=AGENT_NAME)\` returns a client bound to that agent; \`conversation = openai.conversations.create()\` opens a memory thread; \`openai.responses.create(conversation=conversation.id, input="...")\` sends a turn and returns \`output_text\`. Send a follow-up with the same conversation id and the agent remembers the earlier turns.

In the previous generation of the service (the Assistants-style **Agents v1** API, now deprecated and retiring in March 2027), the same ideas were called **threads**, **messages** and **runs**, and samples used \`project_client.agents.create_agent(...)\`, \`threads.create()\`, \`messages.create()\` and \`runs.create_and_process()\`. The current **Agents v2** mapping is: thread becomes conversation, message becomes item, run becomes response, assistant becomes agent version. Expect both vocabularies on the exam and in older tutorials; the concepts line up one to one.

When your agent has **function tools**, the response can contain a tool call with arguments instead of an answer. Your client executes the function, submits the output back, and the agent continues. Built-in tools (file search, code interpreter, web search) run inside the service and need no client-side handling.`,
    },
    {
      heading: 'The exam angle',
      body: `Expect three kinds of items.

**Component identification.** "Which part of the agent configuration tells it to refuse off-topic requests?" (instructions). "Which tool lets the agent answer from uploaded PDFs?" (file search). "Which tool lets it compute statistics and draw a chart from a CSV?" (code interpreter). "Which tool lets it call your internal pricing API?" (a function tool, OpenAPI tool or MCP server).

**Portal workflow.** Where to create an agent (Build > Agents in the Foundry portal), where to test it (agents playground), how to see which tool was called (tracing), what role a colleague needs to test it (Foundry User on the project), and that saving produces a new version.

**Client code.** Recognise the sequence AIProjectClient → create_version with PromptAgentDefinition → get_openai_client(agent_name) → conversations.create → responses.create(conversation=..., input=...). Know that the conversation id is what gives the agent memory between turns, that DefaultAzureCredential is the expected credential, and that a prompt agent requires no hosting on your side. Distractors include building the loop yourself with raw chat completions when the scenario asks for Foundry Agent Service, choosing a hosted agent when configuration alone would do, or attaching a tool that solves a different need (web search when the data is in uploaded files).`,
    },
  ],
  examples: [
    {
      title: 'Create an agent and chat with it from Python',
      description:
        'The complete lightweight client for a single prompt agent: connect, define the agent version with instructions, open a conversation and send two turns. The second turn relies on the first, demonstrating that the conversation carries memory.',
      language: 'python',
      code: `from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import PromptAgentDefinition

ENDPOINT = "https://my-resource.services.ai.azure.com/api/projects/my-project"
AGENT = "travel-helper"

project = AIProjectClient(endpoint=ENDPOINT, credential=DefaultAzureCredential())

project.agents.create_version(
    agent_name=AGENT,
    definition=PromptAgentDefinition(
        model="gpt-5-mini",                       # deployment name
        instructions=("You help employees plan business travel under Contoso policy. "
                      "Ask for dates and destination if missing. Keep answers short."),
    ),
)

openai = project.get_openai_client(agent_name=AGENT)   # client bound to the agent
conversation = openai.conversations.create()           # memory for this chat

r1 = openai.responses.create(conversation=conversation.id,
                             input="I need to visit the Dublin office in May.")
print(r1.output_text)

r2 = openai.responses.create(conversation=conversation.id,
                             input="Make it the second week, three nights.")
print(r2.output_text)   # the agent remembers Dublin and May`,
      takeaway: 'Bind an OpenAI client to the agent, create a conversation, and send turns with the conversation id to keep memory.',
    },
    {
      title: 'Choosing the right tool for the job',
      description:
        'A finance team wants an agent that answers questions from this quarter\'s PDF reports and can also calculate growth rates and draw a chart. File search gives retrieval over the uploaded PDFs; code interpreter gives calculation and charting. Web search would pull public information instead of the team\'s documents and is not needed. Both chosen tools run inside the service, so the client needs no extra code.',
      takeaway: 'File search for your documents, code interpreter for maths and charts, web search for public current information, function or MCP tools for your own systems.',
    },
    {
      title: 'Losing the thread (a realistic mistake)',
      description:
        'A developer calls responses.create for each user message without passing a conversation id. Users complain the agent "forgets" what they said one message earlier. Each call started a fresh context. The fix is to create a conversation once per chat session and pass its id on every turn (or, in the older v1 API, reuse the same thread id).',
      language: 'python',
      code: `# Wrong: every turn is a new, memoryless request
openai.responses.create(input=user_message)

# Right: one conversation per chat session
conversation = openai.conversations.create()          # once
openai.responses.create(conversation=conversation.id, input=user_message)   # every turn`,
      takeaway: 'Memory lives in the conversation (formerly thread); reuse its id across turns.',
    },
  ],
  keyPoints: [
    'An agent = model + instructions + tools (+ knowledge and memory); Foundry Agent Service runs the reasoning and tool-calling loop for you.',
    'Agent types: prompt agents (configuration only, Foundry-hosted), voice-based prompt agents (real-time speech via Voice Live), hosted agents (your own code in a container).',
    'Built-in tools: file search, code interpreter, web search, Azure AI Search, SharePoint, OpenAPI, Azure Functions, MCP servers; function tools run in your app.',
    'Portal: Build > Agents > Create agent; choose model, write instructions, add tools and knowledge; test in the agents playground; inspect tracing and evaluations; save versions.',
    'Foundry User role on the project is needed to create or test agents; Foundry Account Owner (or subscription Owner/Contributor) to create the resource and project.',
    'Client code: AIProjectClient -> agents.create_version(PromptAgentDefinition) -> get_openai_client(agent_name) -> conversations.create() -> responses.create(conversation=id, input=...).',
    'Vocabulary mapping: thread -> conversation, message -> item, run -> response, assistant -> agent version (Agents v1 is deprecated, retiring March 2027).',
    'Memory comes from reusing the conversation id across turns; forgetting to pass it is the classic bug.',
  ],
  flashcards: [
    { front: 'What three elements define a Foundry prompt agent?', back: 'A model deployment, instructions, and tools (optionally knowledge sources).' },
    { front: 'What is Foundry Agent Service?', back: 'The managed runtime in Microsoft Foundry that hosts agents, runs the reasoning and tool-calling loop, manages conversations and provides tracing, evaluation and governance.' },
    { front: 'Difference between a prompt agent and a hosted agent?', back: 'Prompt agent: defined by configuration and run entirely by Foundry. Hosted agent: your own agent code in a container that Foundry runs with a managed endpoint.' },
    { front: 'Which built-in tool answers from uploaded documents?', back: 'File search.' },
    { front: 'Which built-in tool runs Python for calculations and charts?', back: 'Code interpreter.' },
    { front: 'Where in the Foundry portal do you create and test an agent?', back: 'Build > Agents > Create agent, then the agents playground.' },
    { front: 'Which role does a team member need to create or test agents in a project?', back: 'Foundry User (formerly Azure AI User) at the project scope.' },
    { front: 'Which Python call creates a prompt agent in azure-ai-projects 2.x?', back: 'project.agents.create_version(agent_name=..., definition=PromptAgentDefinition(model=..., instructions=...)).' },
    { front: 'How does an agent keep memory across turns in the Responses API?', back: 'Create a conversation (openai.conversations.create()) and pass conversation=conversation.id on every responses.create call.' },
    { front: 'Map the old agent terms thread, message, run to the new ones.', back: 'Thread -> conversation, message -> item, run -> response (and assistant -> agent version).' },
    { front: 'What does the agents playground tracing view show?', back: 'Each step of a run: tool calls with arguments, results, token usage and timing, so you can see why the agent behaved as it did.' },
  ],
  quiz: [
    {
      question:
        'You are creating an agent in the Foundry portal that must answer questions from a set of uploaded policy PDFs. Which tool should you add to the agent?',
      options: ['Web search', 'File search', 'Code interpreter', 'A function tool that calls a weather API'],
      correct: [1],
      explanation:
        'File search provides retrieval over uploaded files. Web search pulls public web content, code interpreter runs code, and a weather function is unrelated.',
    },
    {
      question:
        'A colleague can see the project but gets a permission error when trying to chat with an agent in the agents playground. Which role should be assigned at the project scope?',
      options: ['Reader', 'Foundry User', 'Billing Reader', 'Network Contributor'],
      correct: [1],
      explanation:
        'Foundry User (formerly Azure AI User) grants the agents read and action permissions needed to create and test agents. Reader cannot act, and the other roles are unrelated.',
    },
    {
      question:
        'In a Python client using azure-ai-projects 2.x, users report the agent forgets earlier turns. Which change fixes this?',
      options: [
        'Pass the same conversation id to responses.create on every turn.',
        'Increase the temperature.',
        'Call create_version before every message.',
        'Switch the credential to an API key.',
      ],
      correct: [0],
      explanation:
        'Conversation state is held in the server-side conversation; reusing its id provides memory. Temperature, re-creating the agent version, or the credential type do not affect memory.',
    },
    {
      question: 'Which TWO statements about Foundry agent types are correct? (Select two)',
      options: [
        'A prompt agent is defined by instructions, a model and tools, and runs on Foundry infrastructure without code you host.',
        'A hosted agent lets you bring your own code or framework as a container that Foundry runs with a managed endpoint.',
        'A prompt agent requires you to deploy and scale your own container.',
        'Hosted agents cannot use Foundry models or tools.',
      ],
      correct: [0, 1],
      explanation:
        'Prompt agents are configuration-only and fully managed; hosted agents are your code run by Foundry. Prompt agents need no containers, and hosted agents call the project endpoint for models and tools.',
    },
    {
      question:
        'An agent must calculate year-over-year growth from numbers in a user-uploaded spreadsheet and produce a chart. Which built-in tool enables this?',
      options: ['Web search', 'Code interpreter', 'SharePoint', 'Azure AI Search'],
      correct: [1],
      explanation:
        'Code interpreter runs Python in a sandbox for data analysis and charting. The other tools retrieve information rather than compute.',
    },
    {
      question:
        'After testing an agent in the Foundry portal, a developer wants to understand why the agent called a tool with unexpected arguments on one turn. Where should they look?',
      options: ['The model catalog', 'The tracing view in the agents playground', 'The deployment quota page', 'Azure Marketplace'],
      correct: [1],
      explanation:
        'Tracing shows each step of a run including tool calls and arguments. The catalog, quota page and Marketplace do not record agent runs.',
    },
  ],
  statements: [
    { text: 'A Foundry prompt agent is defined by a model, instructions and tools, and Foundry runs the orchestration loop for you.', isTrue: true, explanation: 'That is what makes it declarative: no orchestration code to host.' },
    { text: 'To give a Foundry agent memory across turns, you must resend the entire chat history in every request.', isTrue: false, explanation: 'The Responses API keeps a server-side conversation; pass its id on each turn.' },
    { text: 'Agents in Foundry are versioned, so a client can pin a stable version while you iterate.', isTrue: true, explanation: 'create_version and the portal save produce new agent versions.' },
    { text: 'The code interpreter tool retrieves answers from uploaded PDFs.', isTrue: false, explanation: 'File search handles document retrieval; code interpreter runs Python for computation and charts.' },
    { text: 'In the new Agents API, a thread is called a conversation and a run is called a response.', isTrue: true, explanation: 'This is the v1-to-v2 terminology mapping; v1 is deprecated.' },
    { text: 'Only a hosted agent can use tools such as web search or file search.', isTrue: false, explanation: 'Prompt agents configured in the portal or SDK can attach built-in tools; hosted agents access the same tools through the project endpoint.' },
    { text: 'The agents playground can show evaluation metrics and traces for each agent response.', isTrue: true, explanation: 'AgentOps tracing and evaluations are built into the playground.' },
  ],
  resources: [
    { label: 'What is Microsoft Foundry Agent Service?', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/agents/overview' },
    { label: 'Quickstart: Get started with the Microsoft Foundry SDK (agents)', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/quickstarts/get-started-code' },
    { label: 'Foundry Agent Service tool catalog', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/tool-catalog' },
    { label: 'Microsoft Foundry playgrounds', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/concept-playgrounds' },
  ],
};
