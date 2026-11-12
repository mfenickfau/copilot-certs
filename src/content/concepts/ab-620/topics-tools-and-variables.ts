import type { Concept } from '../../types';

export const topicsToolsAndVariables: Concept = {
  id: 'topics-tools-and-variables',
  title: 'Topics: Calling Tools and Agent Flows, and Managing Variables',
  summary:
    'Topics are the deterministic conversation paths of a standard-harness agent. Learn how topics interact with generative orchestration, how to call agent flows and other tools from a topic node, and how topic, global, system and environment variables flow through a conversation with Power Fx.',
  certs: ['ab-620', 'ab-100'],
  domains: ['ab-620-1', 'ab-100-2'],
  outcomes: ['ab-620-1-3-1', 'ab-620-1-3-3', 'ab-620-1-3-9', 'ab-100-2-1-10'],
  tags: ['copilot-studio', 'topics', 'variables', 'power-fx', 'tools', 'agent-flows', 'orchestration'],
  difficulty: 'intermediate',
  diagram: 'tool-use-sequence',
  sections: [
    {
      heading: 'Topics under generative and classic orchestration',
      body: `A **topic** is an authored conversation path: a trigger, then nodes (Message, Question, Condition, Set variable, Redirect, tool and flow nodes, HTTP request, generative answers, adaptive cards, Authenticate, End). **System topics** (Conversation Start, Fallback, Escalate, On Error, Sign in, Reset Conversation and others) ship with every agent.

How a topic is chosen depends on the orchestration mode:

| | Generative orchestration (default) | Classic orchestration |
|---|---|---|
| Topic selection | By the topic **description** (its purpose), alongside tools, knowledge and agents in one plan | By matching the user message to **trigger phrases** |
| Tools | Can be called by the orchestrator **or** explicitly from topics | **Only** explicitly from topics |
| Knowledge | Searched proactively | Fallback when no topic matches, or via a generative answers node |
| Missing inputs | Orchestrator generates questions to fill topic inputs | You author Question nodes |

Topics therefore serve two roles. In classic mode they are the whole agent. In generative mode they are **deterministic islands** for anything that must not vary: compliance wording, multi-step forms, sign-in, hand-off. Topic **inputs and outputs** (Details panel) let the orchestrator pass values in from context and use outputs in later plan steps; the input setting **Should prompt user** controls whether the agent asks for a missing value before running the topic. Giving each topic a precise description matters as much as a good tool description, because both compete for selection in the same plan.`,
    },
    {
      heading: 'Adding tools and agent flows to a topic',
      body: `From any node, **Add node (+) > Add a tool** opens three tabs: **Basic tools** (built-in operations), **Connector** (Power Platform connector actions) and **Tool** (flows, prompts, custom connectors, REST API tools, MCP servers already in the environment). Choosing a **Flow** inserts an action node wired to the flow's **When an agent calls the flow** inputs and **Respond to the agent** outputs: you map each input to a variable, literal or Power Fx formula, and each output appears as a new topic variable.

Rules that show up in exam items:

- A flow must be **published** and carry the agent trigger before it is listed. The agent's topic and the flow must be in the same environment.
- Literal inputs are interpreted as number, boolean or string; wrap a value in quotes (\`"123"\`) to force a string. Use a Power Fx formula for records and tables.
- After a connector action is refreshed, output types may stay unresolved until all required inputs are set; save the topic and re-check the output variables.
- Tools called from a topic run with the tool's configured credential mode (end user or maker). In classic mode the topic is the **only** way a tool runs.
- A tool node's **Completion** settings (Don't respond, Write with generative AI, Send specific response, Send an adaptive card) also apply when you call it from a topic.
- You can **redirect to a child or connected agent** from a topic and resume the topic afterwards; agent outputs land in topic variables.
- The **Authenticate** node (manual authentication only) is a leaf node with success and failure branches; place logic that uses \`User.AccessToken\` under the success path.

When the same operation is needed in several topics, add it once on the agent's **Tools** page and reference it from each topic rather than recreating connections.`,
    },
    {
      heading: 'Variables: scopes, lifecycle and Power Fx',
      body: `Variables are typed (String, Number, Boolean, DateTime, Table, Record, Choice, Any) and prefixed by **scope** in Power Fx:

- **Topic.** variables exist for the topic run. Mark one to **receive values from other topics** or **return values to other topics** in the Variables panel so a redirect can pass data and skip a question that was already answered.
- **Global.** variables are available in every topic for the whole session and must have unique names. Promoting a topic variable to global is one-way. They are cleared by the **Clear variable values** node (used by the Reset Conversation topic) and can be **set from an external source** such as a web page or Dynamics 365 context, with a wait timeout and default value. If a global variable is referenced before it is filled, the agent jumps to the node that defines it and comes back.
- **System.** variables are read-only runtime facts: \`System.Activity.Text\`, \`System.Conversation.Id\`, \`System.User.DisplayName\`, \`System.Recognizer.TriggerMessage\`, plus \`User.Id\`, \`User.DisplayName\`, \`User.IsLoggedIn\` and \`User.AccessToken\` depending on authentication.
- **Environment.** variables are Power Platform environment variables from the solution, including **Azure Key Vault secret** variables. For secrets, grant the **Microsoft Copilot Studio Service** application the *Key Vault Secrets User* role and tag the secret with \`AllowedEnvironments\` or \`AllowedAgents\` (\`{envId}/{schemaName}\`). The runtime caches secret values for five minutes. Anyone who can edit the agent could print a secret in a Message node, so restrict edit access.

Power Fx uses **US-style numbers** (period decimal, comma separators). The **Set variable value** node accepts a literal, another variable or a formula; the **Parse value** node converts \`Any\` (for example an HTTP error body or connector output) into a typed record using a sample JSON. Common functions: \`Text\`, \`Concatenate\`, \`Upper\`, \`IsBlank\`, \`If\`, \`Switch\`, \`Filter\`, \`LookUp\`, \`ForAll\`, \`JSON\`, \`ParseJSON\`, \`DateAdd\`, \`DateDiff\`, \`IfError\`.`,
    },
    {
      heading: 'Patterns and the exam angle',
      body: `Three patterns cover most scenario questions:

1. **Collect once, reuse everywhere.** Ask for the customer number in the Greeting topic, store it in \`Global.CustomerId\`, and every later topic and flow input references it; Reset Conversation clears it.
2. **Deterministic transaction inside a generative agent.** The orchestrator recognises "cancel my order", fills the topic input \`OrderId\` from context, the topic shows an adaptive card to confirm, calls the Cancel Order flow with \`Topic.OrderId\`, checks the flow's \`Success\` output in a Condition node, and sends a specific message on either branch.
3. **Context from the host page.** A website passes \`Global.ProductSku\` when it opens the chat so the agent can start with "I see you are looking at the X200".

Exam cues: "available in all topics for the session" is a **global** variable; "defined once per environment and different in test and production" is an **environment** variable; "the agent should not ask again" is **receive values from other topics**; "convert a JSON string into fields" is **Parse value**; "stop a tool running unless a topic calls it" is clearing **Allow agent to decide dynamically when to use the tool**. Distractors swap scopes (a topic variable where a global one is needed), suggest storing secrets in global variables instead of Key Vault environment variables, or propose re-creating the flow inside each topic.`,
    },
  ],
  examples: [
    {
      title: 'Confirming and calling a cancellation flow from a topic',
      description:
        'A retail agent runs in generative mode. The "Cancel order" topic has an input OrderId (Identify as: Number, Should prompt user on). After an adaptive card confirmation, a tool node calls the Cancel Order agent flow, passing Topic.OrderId, and a Condition node branches on the flow\'s Success output.',
      code: `// Set variable value node -> Topic.Message (Formula)
If(
  Topic.CancelOrder.Success,
  Concatenate("Order ", Text(Topic.OrderId), " was cancelled. Refund: ",
              Text(Topic.CancelOrder.RefundAmount, "[$-en-US]$#,##0.00")),
  Concatenate("I couldn't cancel order ", Text(Topic.OrderId), ". ",
              Topic.CancelOrder.ErrorMessage)
)`,
      language: 'text',
      takeaway: 'Topic inputs filled by the orchestrator, a flow node with typed outputs and Power Fx branching give you a deterministic transaction inside a generative agent.',
    },
    {
      title: 'The variable that kept asking (a realistic mistake)',
      description:
        'A maker builds a Greeting topic that asks for the employee ID and a Leave Balance topic that asks for it again. Users complain about being asked twice. The maker tries to fix it by copying the Question node. The real fix is either to set the Leave Balance variable to Receive values from other topics and pass it on redirect, or to promote the variable to Global.EmployeeId so every topic can read it. Because promotion to global is one-way and names must be unique, the maker renames it first.',
      takeaway: 'Reuse values across topics with receive/return settings or global variables; do not duplicate questions.',
    },
    {
      title: 'Reading an API key securely',
      description:
        'A topic calls a partner API with the HTTP request node and needs an API key in a header. Instead of pasting the key into the node, the developer creates a secret environment variable backed by Azure Key Vault, grants the Microsoft Copilot Studio Service application the Key Vault Secrets User role, tags the secret with AllowedAgents = {envId}/{agentSchemaName}, and references Environment.PartnerApiKey in the header value. The key is never stored in the solution and can differ between test and production.',
      code: `// Header value in the HTTP request node (Formula)
Concatenate("Bearer ", Environment.PartnerApiKey)`,
      language: 'text',
      takeaway: 'Secrets belong in Key Vault-backed environment variables referenced with the Environment. prefix, never in topic text or global variables.',
    },
    {
      title: 'Parsing a connector output',
      description:
        'A connector returns its payload as type Any. The developer adds a Parse value node, pastes a sample response to generate the schema, and stores the result in Topic.Order so that Topic.Order.Items can be used with CountRows and ForAll in later nodes.',
      code: `// Sample JSON used by the Parse value node to infer the record type
{
  "orderId": 4471,
  "status": "Shipped",
  "items": [ { "sku": "X200", "qty": 2 }, { "sku": "C15", "qty": 1 } ]
}

// Later Set variable value (Formula)
Concatenate(Text(CountRows(Topic.Order.items)), " line items, status ", Topic.Order.status)`,
      language: 'json',
      takeaway: 'Use Parse value to turn Any into a typed record so Power Fx can address fields and tables safely.',
    },
  ],
  keyPoints: [
    'Generative orchestration selects topics by description alongside tools and knowledge; classic orchestration matches trigger phrases and runs tools only from topics.',
    'Add a tool or flow to a topic via Add node > Add a tool (Basic tools, Connector, Tool tabs); a flow must be published with the When an agent calls the flow trigger.',
    'Flow inputs are mapped from variables, literals or Power Fx; outputs become topic variables; Completion settings decide how the agent responds.',
    'Variable scopes and prefixes: Topic., Global., System., Environment.; global variables last for the session and are reset by Clear variable values.',
    'Topic variables can receive values from or return values to other topics to avoid asking twice; promoting to global is one-way.',
    'Environment variables, including Azure Key Vault secrets, are referenced with the Environment. prefix and need the Copilot Studio service principal granted Key Vault Secrets User plus AllowedEnvironments or AllowedAgents tags.',
    'Power Fx in Copilot Studio uses US-style numbers and comma separators; Set variable value and Parse value nodes handle formulas and typed conversion from Any.',
    'Global variables can be set from an external source (web page or Dynamics 365 context) with a timeout and default value.',
  ],
  flashcards: [
    { front: 'How does an agent with generative orchestration decide to run a topic?', back: 'By the topic\'s description, chosen alongside tools, knowledge and agents as part of a plan; classic orchestration uses trigger phrases instead.' },
    { front: 'What prefix does a global variable get in Copilot Studio?', back: 'Global. (for example Global.CustomerId); it is available in every topic for the session.' },
    { front: 'Which node resets global variables and which system topic uses it?', back: 'Clear variable values, used by the Reset Conversation system topic (triggered by "start over").' },
    { front: 'How do you avoid re-asking a question already answered in an earlier topic?', back: 'Set the destination variable to Receive values from other topics and pass the value on redirect, or use a global variable.' },
    { front: 'What prefix references an environment variable in Power Fx?', back: 'Environment., for example Environment.PartnerApiKey.' },
    { front: 'Which role and tags are needed for Copilot Studio to read a Key Vault secret environment variable?', back: 'Key Vault Secrets User on the Microsoft Copilot Studio Service application, plus an AllowedEnvironments or AllowedAgents ({envId}/{schemaName}) tag on the secret.' },
    { front: 'Which node converts a value of type Any into a typed record?', back: 'The Parse value node, using a sample JSON to infer the schema.' },
    { front: 'In classic orchestration, how can a tool run?', back: 'Only when a topic calls it explicitly from an action node.' },
    { front: 'How do you force the literal 123 to be treated as a string input?', back: 'Wrap it in double quotes: "123".' },
    { front: 'Where is the Authenticate node allowed in a topic?', back: 'Only as a leaf node at the end of a branch, with manual authentication configured; it creates success and failure paths.' },
  ],
  quiz: [
    {
      question:
        'Your agent uses generative orchestration. A compliance topic must always read an approved disclaimer and then call a published agent flow with the customer\'s account number collected earlier in the conversation. Which approach is correct?',
      options: [
        'Add the flow as a tool with Allow agent to decide dynamically on, and rely on the orchestrator to read the disclaimer',
        'Create a topic with a Message node for the disclaimer, then Add a tool > Flow, mapping the account number variable to the flow input',
        'Switch the agent to classic orchestration so the disclaimer is always shown',
        'Put the disclaimer in the flow\'s Respond to the agent output',
      ],
      correct: [1],
      explanation:
        'A topic is the deterministic path for mandatory wording followed by an explicit flow call. Dynamic tool selection does not guarantee the disclaimer, switching orchestration modes is unnecessary and loses generative benefits, and the flow output is produced after the call rather than before.',
    },
    {
      question:
        'Users are asked for their employee ID in the Greeting topic and again in the Payslip topic. You need the Payslip topic to reuse the value with the least change. What should you do?',
      options: [
        'Promote the Payslip variable to a global variable and reference Global.EmployeeId from the Greeting topic as well',
        'Copy the Question node from Greeting into every topic',
        'Store the employee ID in an environment variable',
        'Add a Clear variable values node to the Greeting topic',
      ],
      correct: [0],
      explanation:
        'A global variable is available in all topics for the session. Copying questions keeps asking twice, environment variables are per environment not per user, and Clear variable values resets values rather than sharing them.',
    },
    {
      question:
        'A topic must send an API key in an HTTP header. The key differs between the test and production environments and must not be visible in the solution. What should you use?',
      options: [
        'A global variable set in the Conversation Start topic',
        'A topic variable with the key as a literal',
        'A secret environment variable backed by Azure Key Vault referenced as Environment.ApiKey',
        'The System.User.AccessToken variable',
      ],
      correct: [2],
      explanation:
        'Key Vault-backed environment variables keep secrets out of the solution and allow per-environment values. Global or topic literals embed the secret in the agent, and the user access token is the user\'s identity, not a partner API key.',
    },
    {
      question:
        'Which TWO statements about variables in Copilot Studio are true? (Select two)',
      options: [
        'A global variable can be converted back to a topic variable at any time',
        'Power Fx formulas in Copilot Studio use a period as the decimal separator and commas between parameters',
        'Global variables persist until the session ends or the Reset Conversation topic clears them',
        'System variables can be assigned new values with the Set variable value node',
      ],
      correct: [1, 2],
      explanation:
        'Copilot Studio Power Fx uses US-style numbering, and global variables live for the session until cleared. Promotion to global is one-way, and system variables are read-only runtime values.',
    },
    {
      question:
        'After adding a connector action node to a topic, the output variable shows an unresolved type. What should you do first?',
      options: [
        'Delete and recreate the connector',
        'Enter all required inputs for the action, save the topic and check the outputs again',
        'Switch the agent to classic orchestration',
        'Promote the output variable to global',
      ],
      correct: [1],
      explanation:
        'Output types can remain unresolved until required inputs are provided and the topic is saved. Recreating the connector is unnecessary, orchestration mode is unrelated, and scope changes do not resolve types.',
    },
  ],
  statements: [
    { text: 'In classic orchestration, tools can only run when a topic calls them explicitly.', isTrue: true, explanation: 'Classic mode has no orchestrator-driven tool selection.' },
    { text: 'A flow appears in the Add a tool > Flow list as soon as it is saved, even if unpublished.', isTrue: false, explanation: 'The flow must be published and use the When an agent calls the flow trigger.' },
    { text: 'Topic variables can be configured to receive values from other topics so redirected topics skip already-answered questions.', isTrue: true, explanation: 'This is set in the Variables panel or Variable properties.' },
    { text: 'The Reset Conversation system topic clears global variables.', isTrue: true, explanation: 'It uses the Clear variable values node.' },
    { text: 'Environment variables are referenced in Power Fx with the Global. prefix.', isTrue: false, explanation: 'They use the Environment. prefix.' },
    { text: 'Secret environment variables are cached by the dialog runtime for five minutes.', isTrue: true, explanation: 'Unsuccessful reads are cached for 30 seconds.' },
    { text: 'The Authenticate node can be placed in the middle of a topic with nodes after both branches merged.', isTrue: false, explanation: 'It is only available as a leaf node at the end of a branch, creating separate success and failure paths.' },
  ],
  resources: [
    { label: 'Add tools to custom agents', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent' },
    { label: 'Work with variables', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-variables' },
    { label: 'Create expressions using Power Fx', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-power-fx' },
    { label: 'Call an agent flow from an agent', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-use-flow' },
  ],
};
