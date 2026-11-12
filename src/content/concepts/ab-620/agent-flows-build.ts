import type { Concept } from '../../types';

export const agentFlowsBuild: Concept = {
  id: 'agent-flows-build',
  title: 'Building Agent Flows: Triggers, Actions, Connectors and Parameters',
  summary:
    'Agent flows are the deterministic automation layer of Copilot Studio. Learn how a flow is structured, how the "When an agent calls the flow" trigger and "Respond to the agent" action turn a flow into a tool, how to configure connector actions and input and output parameters, and how response timing (synchronous, asynchronous, express mode) shapes the design.',
  certs: ['ab-620', 'ab-100'],
  domains: ['ab-620-1', 'ab-100-2'],
  outcomes: ['ab-620-1-2-1', 'ab-620-1-2-3', 'ab-620-1-2-5', 'ab-100-2-1-15'],
  tags: ['copilot-studio', 'agent-flows', 'power-automate', 'connectors', 'parameters', 'automation'],
  difficulty: 'intermediate',
  diagram: 'workflow-vs-agent',
  sections: [
    {
      heading: 'What an agent flow is and why you would use one',
      body: `An **agent flow** is a cloud flow that is created and managed in Copilot Studio (on the standard harness) and billed against Copilot Studio capacity rather than Power Automate licences. Its defining property is **determinism**: the same input follows the same rule-based path to the same output. That makes agent flows the right home for anything that must be auditable and repeatable: creating a record, sending an approval, calling three systems in a fixed order, or running on a schedule.

A flow consists of **one trigger and at least one action**:

- **Triggers** are instant (manual or **When an agent calls the flow**), scheduled, or event based (a connector event such as "when an item is created").
- **Actions** come in four families: **AI capabilities** (run a prompt, call an agent, generate text, create a natural-language reply to a calling agent), **Human in the loop** (approvals, request for information), **built-in tools** (conditions, loops, scopes, data operations, date and time, child flows) and **connectors** (Microsoft 365, Dataverse, third-party services and your own custom connectors).

Compare this with a generative orchestrator choosing tools at run time: the orchestrator decides *whether and when* to call the flow; the flow decides *exactly what happens* once called. Exam questions often contrast the two: "must execute the same steps every time, with an audit trail" points to an agent flow; "respond flexibly to varied requests" points to generative orchestration with tools.

Agent flows live in **solutions**, which gives them drafts, version history (recorded in Dataverse), export and import. You open them from the **Flows** (Workflows) page; Power Automate cloud flows that are already in a solution can be **converted** to agent flows by changing their plan to Copilot Studio, a one-way operation.`,
    },
    {
      heading: 'Creating a flow that an agent can call',
      body: `For a flow to be used as a **tool**, it must:

1. Start with the **When an agent calls the flow** trigger.
2. End with a **Respond to the agent** action (unless you deliberately want fire-and-forget behaviour).
3. Respond within the synchronous window (the docs cite a 100-second action limit and a two-minute flow default) unless asynchronous response is enabled.

The quickest path is **Tools > Add a tool > New tool > Agent flow** from inside the agent: the designer opens with the trigger and response action already placed. You then add input parameters to the trigger, actions in between, and output parameters to the response action, and **Publish**. Flows with errors cannot be published; the **Flow checker** lists them. Testing in the designer or the agent's test chat does not consume capacity.

To add the published flow: **Tools > Add a tool > Flow**, select it, then **Add and configure**. Give it a **name and description that explain when to use it**, because generative orchestration selects tools from descriptions. Under **Inputs** choose how each input is filled (dynamically with AI from context, by asking the user, or with a custom value or Power Fx formula); under **Completion** choose whether the agent incorporates the output silently, writes a generative response, sends a specific message or sends an adaptive card.

Actions placed **after** Respond to the agent continue to run (up to the 30-day flow limit) without holding up the conversation, which is the standard pattern for "acknowledge now, finish later".`,
    },
    {
      heading: 'Configuring actions and connectors',
      body: `Each action card has a **Parameters** tab where you supply literal values, dynamic content from earlier steps, or expressions. Connector actions need a **connection**; in a flow called by an agent, connectors can run with the **user's credentials** when the agent is authenticated and the channel supports it, or with a fixed connection. In environments with **customer-managed keys**, set the run-only settings to specific connections rather than "provided by run-only user".

Practical rules the exam likes:

- Prefer **connector actions** over raw HTTP actions when a connector exists; connectors inherit data policy governance and connection management.
- Use a **custom connector** when the API is yours or has no prebuilt connector; create it from an OpenAPI definition and add it to the same solution.
- Keep **connection references** and **environment variables** in the solution so the flow can move between environments without editing.
- Use the **Run a prompt** action for single-turn AI tasks (classify, extract, summarise) inside a deterministic flow, and the **Call an agent** action when the flow should delegate a reasoning step to an agent.
- Keep the **Respond to the agent** action and trigger outside **Scope** containers.

Capacity: every executed action consumes Copilot Studio capacity. Running a flow from a topic consumes one classic answer plus the actions; running it from generative orchestration consumes one autonomous action plus the actions. When an environment runs out of Copilot Credits, new autonomous flow runs are blocked until credits are available.`,
    },
    {
      heading: 'Input and output parameters, and response timing',
      body: `Inputs on the **When an agent calls the flow** trigger and outputs on **Respond to the agent** are typed (text, number, boolean, date, file and more). Each needs a **name and description**; the orchestrator uses descriptions to fill inputs from conversation context or to generate a question for the user, and output descriptions tell the agent what came back. Keep outputs small and structured: return an order number and a status rather than a 2 MB JSON blob, because large payloads slow the conversation and break **express mode**.

Three response modes:

| Mode | How | When |
|---|---|---|
| **Synchronous** (default) | Respond to the agent completes within the time limit | Lookups, quick writes |
| **Asynchronous response** | Toggle on in Respond to the agent settings (new infrastructure only); flow runs past two minutes and calls back when done, fully supported in Teams | Long-running work where the user should still get the result |
| **Immediate / fire-and-forget** | Remove Respond to the agent | Notifications, logging |

**Express mode (preview)** speeds up logic-heavy flows so they fit the two-minute window; it is turned on from the trigger card or the flow details. It is for flows that process rather than move data: limits include about 100 actions per run, 1,024 characters per variable, 64 KB per connector response, no Delay or webhook actions, and no automatic test in the designer. If a flow fails in express mode during testing, turn it off rather than ship it.

Exam framing: "the agent times out waiting for the flow" means enable asynchronous response or move slow actions after the response; "the flow must return a value the agent uses in the next sentence" means add an output parameter to Respond to the agent and set Completion accordingly.`,
    },
  ],
  examples: [
    {
      title: 'A purchase-order lookup flow as a tool',
      description:
        'A procurement agent needs to answer "what is the status of PO 4471?". The developer creates an agent flow from the agent\'s Tools page: the trigger has a text input PONumber, a Dataverse "Get a row by ID" action retrieves the order, and Respond to the agent returns Status, Supplier and ExpectedDate. The tool description reads "Looks up the current status, supplier and delivery date of a purchase order by its PO number." Completion is set to "Write the response with generative AI" so the agent phrases the answer naturally.',
      code: `Trigger: When an agent calls the flow
  Inputs:  PONumber (Text)  "The purchase order number, e.g. 4471"
Action:  Dataverse - Get a row by ID
  Table: Purchase Orders   Row ID: lookup by PONumber
Action:  Respond to the agent
  Outputs: Status (Text), Supplier (Text), ExpectedDate (Date)
  Settings > Asynchronous response: Off`,
      language: 'text',
      takeaway: 'Typed, well-described inputs and outputs are what let generative orchestration fill parameters and use the result without hand-authored question nodes.',
    },
    {
      title: 'The two-minute timeout (a realistic mistake)',
      description:
        'A flow generates a 60-page compliance report by looping over 400 SharePoint items and then writes the file to OneDrive before responding. In the test chat the agent reports an error after about two minutes. The developer first tries express mode, which fails on the 100-item loop limit. The right fix is to move the heavy work after Respond to the agent (returning "Report generation started" immediately) or to turn on Asynchronous response so the flow can call back with the file link when finished.',
      takeaway: 'Respond early or respond asynchronously; express mode is for logic-heavy flows, not data-heavy ones.',
    },
    {
      title: 'Converting an existing Power Automate flow',
      description:
        'Northwind already has a cloud flow that creates a ServiceNow incident and posts to Teams. To let a Copilot Studio agent call it, the developer confirms the flow is in a solution, edits it in Power Automate, changes the plan to Copilot Studio (a one-way conversion), replaces the manual trigger with When an agent calls the flow, adds Respond to the agent with the IncidentNumber output, and publishes. Billing moves to Copilot Studio capacity.',
      takeaway: 'Existing solution-aware flows can become agent flows, but the conversion is irreversible and the trigger and response action must be swapped.',
    },
    {
      title: 'Choosing a flow over generative orchestration',
      description:
        'An onboarding process must always create the Entra account, then the mailbox, then the badge request, in that order, and record each step for audit. A maker suggests giving the agent three connector tools and letting it decide. The architect insists on a single agent flow exposed as one tool, because the sequence and the audit trail must be identical every time; the agent only decides when to start it.',
      takeaway: 'Use agent flows for sequences that must be deterministic and auditable; let the orchestrator decide when to invoke them.',
    },
  ],
  keyPoints: [
    'Agent flows are deterministic cloud flows managed in Copilot Studio and billed on Copilot Studio capacity; one trigger plus actions (AI capabilities, human in the loop, built-in tools, connectors).',
    'To be an agent tool a flow needs the When an agent calls the flow trigger and a Respond to the agent action, and it must be published without errors.',
    'Create flows from Tools > Add a tool > New tool > Agent flow to get the trigger and response action prefilled; add the published flow via Add a tool > Flow and write a clear description.',
    'Inputs and outputs are typed and described; the orchestrator fills inputs from context or asks the user, and Completion controls how the output is used.',
    'Synchronous responses must fit the time limit; use Asynchronous response for long work (Teams callback), or remove the response action for fire-and-forget; actions after the response keep running.',
    'Express mode (preview) speeds logic-heavy flows but has 100-action, 1,024-character variable and 64 KB message limits and disallows Delay and webhook actions.',
    'Connector actions in agent-called flows can run with user credentials in authenticated agents; keep connection references and environment variables in the solution.',
    'Power Automate cloud flows in solutions can be converted to agent flows one way by changing the plan to Copilot Studio.',
  ],
  flashcards: [
    { front: 'Which trigger and action does a flow need to be used as a tool by an agent?', back: 'The When an agent calls the flow trigger and the Respond to the agent action.' },
    { front: 'Where in Copilot Studio do you create a new agent flow that is prewired for an agent?', back: 'Agent > Tools > Add a tool > New tool > Agent flow; the designer opens with the trigger and response action in place.' },
    { front: 'How do you let a flow run longer than two minutes and still return a result to the agent?', back: 'Turn on Asynchronous response in the settings of the Respond to the agent action (new infrastructure environments; callback fully supported in Teams).' },
    { front: 'What happens to actions placed after Respond to the agent?', back: 'They keep running in the background, up to the 30-day flow run limit, without delaying the agent\'s reply.' },
    { front: 'Name three limits of express mode.', back: 'About 100 actions per run, 1,024 characters per variable, 64 KB per connector response; no Delay or webhook actions; must finish in two minutes.' },
    { front: 'Does testing an agent flow in the designer consume Copilot Studio capacity?', back: 'No. Designer tests and runs from the agent\'s test chat do not consume capacity.' },
    { front: 'What is consumed when a topic runs an agent flow?', back: 'One classic answer plus the agent flow actions executed (one autonomous action instead when generative orchestration runs it).' },
    { front: 'Can you convert an agent flow back to a Power Automate flow?', back: 'No. Converting a solution cloud flow to the Copilot Studio plan is one-way.' },
    { front: 'What are the four action families in agent flows?', back: 'AI capabilities, Human in the loop, built-in tools (control, data operations), and connectors.' },
  ],
  quiz: [
    {
      question:
        'You create an agent flow in the Flows page with a manual trigger and a Dataverse action, publish it, and then try to add it to your agent as a tool. The flow does not appear in the list. What is the MOST likely cause?',
      options: [
        'The flow is not in a solution',
        'The flow does not use the When an agent calls the flow trigger',
        'The agent is using classic orchestration',
        'The flow has express mode turned off',
      ],
      correct: [1],
      explanation:
        'Only flows with the When an agent calls the flow trigger (and normally a Respond to the agent action) can be added as agent tools. Agent flows are always in solutions, orchestration mode does not filter the flow list, and express mode is a performance option.',
    },
    {
      question:
        'An agent flow generates a large report and takes about six minutes. Users must receive the report link in Microsoft Teams when it is ready. What should you configure?',
      options: [
        'Turn on express mode on the trigger card',
        'Turn on Asynchronous response in the Respond to the agent action settings',
        'Remove the Respond to the agent action',
        'Increase the Request timeout on the HTTP node',
      ],
      correct: [1],
      explanation:
        'Asynchronous response lets the flow run past the two-minute limit and call back to the agent with the result, fully supported in Teams. Express mode requires completion within two minutes, removing the response action loses the link, and the HTTP node timeout belongs to topics, not flows.',
    },
    {
      question:
        'Which TWO practices make a flow tool work well with generative orchestration? (Select two)',
      options: [
        'Write a specific tool description that says what the flow does and when to use it',
        'Return the whole raw JSON response from the connector as a single output',
        'Define typed input and output parameters with clear descriptions on the trigger and response action',
        'Set every input to Custom value so the agent never asks the user',
      ],
      correct: [0, 2],
      explanation:
        'The orchestrator chooses tools from descriptions and fills inputs from parameter descriptions. Raw JSON blobs slow the conversation and break express mode limits, and forcing every input to a fixed value defeats dynamic slot filling for user-provided data.',
    },
    {
      question:
        'A flow has a loop over 1,500 rows returned by a SharePoint Get items action and must respond to the agent. Enabling express mode causes runtime failures. What should you do?',
      options: [
        'Turn express mode off; it is designed for logic-heavy, not data-heavy, flows',
        'Add a Delay action to pace the loop',
        'Convert the flow back to a Power Automate cloud flow',
        'Replace the Respond to the agent action with a Terminate action',
      ],
      correct: [0],
      explanation:
        'Express mode has memory, 100-iteration and 64 KB message limits; data-heavy flows should run with it off. Delay actions are not supported in express mode, conversion is one-way and does not fix the limit, and Terminate would remove the response the agent needs.',
    },
    {
      question:
        'Contoso has a cloud flow in Power Automate that it wants an agent to call, using Copilot Studio capacity. Which statement is correct?',
      options: [
        'The flow must be in a solution before it can be converted to an agent flow, and the conversion cannot be reversed',
        'Any cloud flow can be converted and later converted back',
        'Only flows created in Copilot Studio can ever be called by agents',
        'The flow must be recreated from scratch in the agent flow designer',
      ],
      correct: [0],
      explanation:
        'Conversion requires the flow to be in a solution and to have Copilot Studio capacity in the environment; it is one-way. Flows need not be recreated, but they do need the agent trigger and response action to be usable as tools.',
    },
  ],
  statements: [
    { text: 'Agent flows are deterministic: the same input always produces the same output path.', isTrue: true, explanation: 'This is the core benefit Microsoft lists for agent flows.' },
    { text: 'A flow without a Respond to the agent action cannot be triggered by an agent.', isTrue: false, explanation: 'It can; the agent simply responds immediately after triggering it (fire-and-forget).' },
    { text: 'Actions after the Respond to the agent action are skipped.', isTrue: false, explanation: 'They continue to run in the background up to the 30-day run limit.' },
    { text: 'Testing a flow in the designer consumes Copilot Studio capacity.', isTrue: false, explanation: 'Designer tests and test-chat runs do not consume capacity.' },
    { text: 'Express mode disallows Delay and webhook actions.', isTrue: true, explanation: 'Errors appear on save when these actions are present with express mode on.' },
    { text: 'Agent flows live in solutions and have version history recorded in Dataverse.', isTrue: true, explanation: 'This enables drafts, versioning, export and import.' },
    { text: 'When an environment has no Copilot Credits, new autonomous agent flow runs are blocked until credits are available.', isTrue: true, explanation: 'In-progress runs finish; runs for Microsoft 365 Copilot-licensed interactive users and designer tests are unaffected.' },
  ],
  resources: [
    { label: 'Agent flows overview', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview' },
    { label: 'Create an agent flow as a tool', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-flow-create' },
    { label: 'Asynchronous response support for agent flows', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-asynchronous-response' },
    { label: 'Speed up agent flow execution with express mode', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-flow-express-mode' },
  ],
};
