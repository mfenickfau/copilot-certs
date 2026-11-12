import type { Concept } from '../../types';

export const copilotStudioAgentDesign: Concept = {
  id: 'copilot-studio-agent-design',
  title: 'Copilot Studio Agent Design: Orchestration, Topics, Agent Flows and Prompt Tools',
  summary:
    'The architectural choices inside a Copilot Studio agent on the standard harness: generative orchestration versus classic trigger-phrase matching versus conversational language understanding, how to design topics and the fallback path, when to push work into deterministic agent flows, and how to design reusable prompt actions.',
  certs: ['ab-100', 'ab-620'],
  domains: ['ab-100-2', 'ab-620-1'],
  outcomes: ['ab-100-2-1-10', 'ab-100-2-1-14', 'ab-100-2-1-15', 'ab-100-2-1-16', 'ab-620-1-2-1', 'ab-620-1-3-7'],
  tags: ['copilot-studio', 'topics', 'fallback', 'generative-orchestration', 'clu', 'agent-flows', 'prompt-tools'],
  difficulty: 'advanced',
  diagram: 'orchestration-patterns',
  sections: [
    {
      heading: 'Choosing the understanding model: NLU, CLU or generative orchestration',
      body: `A Copilot Studio agent on the standard harness has to decide *what the user wants* before it does anything. Three mechanisms exist and the exam asks you to pick one for a scenario.

- **Standard natural language understanding (classic orchestration).** Topics carry **trigger phrases**; the built-in NLU model matches the utterance to the closest topic, extracts entities (prebuilt or custom, including regex and closed lists) and runs that topic's authored nodes. Knowledge is used only as a fallback or when a topic explicitly calls a generative answers node. Choose it when the conversation must be tightly scripted, when every response must be pre-approved wording, when you need custom entities, or when an admin has disabled generative orchestration in the environment.
- **Conversational language understanding (CLU) from Azure AI Language.** An external recogniser whose intents and entities are mapped to topics and Copilot Studio entities (through the OnRecognize trigger, with intents and entities surfaced in System.Recognizer variables). Choose it when you already own a trained CLU model, need language or entity coverage the built-in NLU lacks, or require a governed, versioned intent model your data science team maintains. It is also the basis of the **NLU+** option in Dynamics 365 Contact Center voice agents, where processing happens within Dynamics 365.
- **Generative orchestration (default for new agents).** The model selects topics, tools, knowledge and connected agents by their **descriptions**, can combine several in one turn, generates clarifying questions for missing inputs and composes the reply. Choose it for broad, natural conversations across many capabilities, for autonomous agents, and whenever you need MCP tools, Computer Use, event triggers or deep reasoning. Its cost is less predictability: responses vary, and conversation history influences selection, so testing in a fresh session can differ from a long Teams thread.

Hybrid is normal: a generative agent with a few classic-style topics whose message nodes hold regulated wording, and whose descriptions tell the orchestrator exactly when to use them. The CAF framing applies: deterministic where the outcome must be repeatable, generative where language is unstructured.`,
    },
    {
      heading: 'Designing topics and the fallback path',
      body: `A **topic** is a conversation path made of nodes: messages, questions (with entity and variable binding), conditions, redirects, tool calls, generative answers nodes and variable management. Design rules an architect enforces:

- One intent per topic, with a clear **description** (generative orchestration) and 5 to 10 varied **trigger phrases** (classic). Overlapping phrases or descriptions produce misfires.
- Collect inputs with **slot filling**: question nodes bound to entities so a user who says "book me a room for 4 on Friday" skips the questions already answered.
- Keep business logic out of topics where possible: call an **agent flow** or tool for anything deterministic, and keep the topic for conversation.
- Use **adaptive cards** for structured display and input, and **variables** (topic, global, system) deliberately; set global variables for context shared across topics such as authenticated user and channel.

**System topics** handle lifecycle: Conversation Start, Greeting, Escalate, End of Conversation, Reset Conversation, Sign in, On Error, Multiple Topics Matched and **Fallback**. The fallback design decides what happens when nothing matches. The default Fallback system topic fires **On Unknown Intent**, asks the user to rephrase up to twice, then redirects to **Escalate**. In generative mode, **generative answers over knowledge act as the first fallback** before the system Fallback topic. Architects customise the Fallback topic to: capture the unrecognised utterance (the UnrecognizedTriggerPhrase variable) for analytics and new-topic mining, call a back-end search or flow, hand off to a live representative through Dynamics 365 Contact Center or another engagement hub, or offer a menu of top topics. In Microsoft Teams there is no default Fallback topic, so you must create one. The **Escalate** topic should be designed with the channel in mind: a web channel might collect contact details and create a case, while a voice channel transfers the call.

Exam cues: "agent repeatedly asks the user to rephrase" means Fallback is reached because trigger coverage or descriptions are weak; "agent must transfer to a human after failing to understand" points at customising Fallback and Escalate; "must say exact compliance wording" points at a message node in an authored topic rather than a generative answer.`,
    },
    {
      heading: 'Agents and agent flows: putting determinism where it belongs',
      body: `**Agent flows** are Copilot Studio's deterministic automation layer (created and managed as classic-style flows in the standard harness). A flow is a **trigger** plus one or more **actions**. Triggers can be instant (including *When an agent calls the flow*), scheduled or event-based. Actions include connectors (Dataverse, SharePoint, Outlook, SAP, ServiceNow and thousands more), control structures, **human-in-the-loop** approvals, and **AI capabilities** such as run a prompt, process a document, call an agent and return a natural-language reply to the calling agent.

Why flows matter in agent design:
- **Consistency.** The same input produces the same output; use flows for record creation, calculations, lookups with business rules, approvals and notifications.
- **Separation of concerns.** The agent interprets and converses; the flow executes. This makes testing easier (flow runs are deterministic) and lets different teams own each.
- **Governance.** Flows run under connection references managed in solutions, are subject to data policies, and have run history for audit.
- **Billing.** Agent flow actions consume Copilot Credits per 100 actions (no charge when triggered by *When an agent calls the flow* for a Microsoft 365 Copilot-licensed, authenticated user). Chatty flows are a cost smell.

Design patterns: an **intake agent** collects and validates inputs via slot filling, then calls a flow that creates the case; an **autonomous agent** reacts to an event trigger and uses a flow with an approval action before changing a record; a **task agent** returns findings to a flow that files them. Define flow inputs and outputs explicitly (typed parameters), add error handling (configure run-after, retry and a failure branch that tells the agent what to say), and keep long-running work asynchronous so the conversation does not time out.`,
    },
    {
      heading: 'Designing prompt actions (prompt tools)',
      body: `A **prompt action** is a reusable generative AI step built in the **prompt builder**: natural-language instructions, **input variables** supplied at runtime, optional **knowledge** (Dataverse tables, uploaded documents) to ground the prompt, a selected model and settings, and a defined output (text or **structured JSON**). You add it as a **tool** to an agent, as a node in a topic, or as an action in an agent flow or Power Apps.

Good prompt-action design:
- Single purpose with a precise **name and description**, because generative orchestration selects tools by description.
- Explicit inputs with examples, and an output schema when a flow or app consumes the result.
- Grounding via prompt knowledge for facts, not via pasting content into the instruction text.
- Start from the **prompt library** templates (document extraction, data transformation, content generation), then tune tone and detail to organisational standards.
- Choose the model deliberately: the default model for most tasks, a Foundry catalog model (bring your own model) for specialist needs, and keep model version and settings recorded.
- Validate with **batch testing** in the Test hub and keep the dataset with the prompt in a solution.
- Remember billing: text and generative AI tools are metered by tokens in basic, standard and premium tiers, and content processing tools per page.

Where prompt actions beat alternatives: classification and extraction inside a flow (versus a generative answers node, which is for answering users), transformation of tool output before the agent speaks, and standardised drafting (emails, summaries) used across many agents. Where they do not belong: deciding something that must be auditable and repeatable (use a rule or AI Builder prediction model) and retrieving knowledge for conversation (use knowledge sources and generative answers).`,
    },
  ],
  examples: [
    {
      title: 'Regulated wording inside a generative agent',
      description:
        'A bank\'s support agent uses generative orchestration for most questions, but regulators require an exact disclosure before discussing overdrafts. The architect adds a topic whose description says "use whenever overdrafts or borrowing limits are discussed" with a message node containing the approved text, followed by a redirect back to generative answers. Testing confirms the orchestrator selects the topic and never paraphrases the disclosure.',
      takeaway: 'Mix authored topics with message nodes into a generative agent for wording that must not vary.',
    },
    {
      title: 'The Teams agent with no fallback (a realistic mistake)',
      description:
        'A Copilot Studio agent published to Teams silently ends the conversation when it cannot match an intent, and users assume it is broken. Teams has no default Fallback topic. The fix is to create a Fallback topic that triggers On Unknown Intent, logs UnrecognizedTriggerPhrase to Dataverse for topic mining, tries generative answers over the knowledge base, and offers a handoff to the service desk if two attempts fail.',
      takeaway: 'Always design the fallback path per channel; Teams needs an explicit Fallback topic.',
    },
    {
      title: 'Moving logic from topics into an agent flow',
      description:
        'A leave-request agent originally computed entitlement inside topic condition nodes, which broke whenever policy changed. The redesign keeps the topic for slot filling (dates, leave type) and calls an agent flow with typed inputs that reads the policy table in Dataverse, computes entitlement, submits an approval to the manager and returns a natural-language outcome. Flow runs are now visible in run history and the topic has four nodes instead of thirty.',
      takeaway: 'Deterministic logic belongs in agent flows with typed inputs and outputs; topics should stay conversational.',
    },
    {
      title: 'A prompt action shared by three agents',
      description:
        'Sales, service and finance agents each need to classify inbound email intent and extract order numbers. One prompt action with inputs {email_body} and JSON output {intent, order_ids[]} is built from the extraction template, grounded on an order-format reference table, batch-tested on 40 emails, and added as a tool to all three agents and to a Power Automate flow.',
      takeaway: 'Design prompt actions as single-purpose, schema-outputting, tested tools so they can be reused across agents and flows.',
    },
  ],
  keyPoints: [
    'Classic orchestration matches trigger phrases with built-in NLU; CLU brings an external Azure AI Language model with its own intents and entities; generative orchestration selects topics, tools and knowledge by description and is required for MCP, Computer Use, triggers and deep reasoning.',
    'Choose deterministic understanding for scripted, regulated or entity-heavy dialogues; choose generative orchestration for broad natural conversation and autonomous behaviour; hybrids are common.',
    'Topics are node graphs (message, question, condition, redirect, tool call, generative answers); one intent per topic with precise descriptions and varied trigger phrases.',
    'The Fallback system topic fires On Unknown Intent, asks to rephrase twice, then redirects to Escalate; in generative mode knowledge-based generative answers come first; Teams has no default Fallback topic.',
    'Customise Fallback to log unrecognised phrases, search back-end systems or hand off to a human; design Escalate per channel.',
    'Agent flows are deterministic trigger-plus-actions automations with connectors, human-in-the-loop approvals and AI actions; use them for record changes, calculations and approvals, with typed inputs, outputs and error handling.',
    'Agent flow actions are billed per 100 actions in Copilot Credits except when called by an authenticated Microsoft 365 Copilot-licensed user through the agent-call trigger.',
    'Prompt actions are reusable prompt-builder tools with input variables, grounding knowledge, model choice and structured output; name and describe them precisely, batch-test them and ship them in solutions.',
  ],
  flashcards: [
    { front: 'How does classic orchestration decide which topic runs?', back: 'By matching the user utterance to topic trigger phrases with the built-in NLU model.' },
    { front: 'How does generative orchestration decide what to run?', back: 'It selects topics, tools, knowledge sources and connected agents based on their names and descriptions, possibly several in one turn.' },
    { front: 'When would you integrate a CLU model with a Copilot Studio agent?', back: 'When you already have a trained Azure AI Language CLU model, need its entity or language coverage, or want a governed external intent model; intents map to topic triggers via OnRecognize.' },
    { front: 'What does the default Fallback system topic do?', back: 'Triggers On Unknown Intent, asks the user to rephrase up to twice, then redirects to the Escalate system topic.' },
    { front: 'In a generative-mode agent, what happens before the Fallback topic when no topic matches?', back: 'Generative answers over the agent\'s knowledge sources attempt to answer first.' },
    { front: 'Which channel has no default Fallback topic?', back: 'Microsoft Teams; you must create one.' },
    { front: 'What variable holds the unrecognised user input in the Fallback topic?', back: 'UnrecognizedTriggerPhrase.' },
    { front: 'What are the two building blocks of an agent flow?', back: 'A trigger (instant, scheduled or event, including When an agent calls the flow) and one or more actions.' },
    { front: 'Why put business logic in an agent flow rather than a topic?', back: 'Flows are deterministic, have run history, run under governed connection references and are easier to test and own separately.' },
    { front: 'Name four components of a prompt action built in the prompt builder.', back: 'Instructions, input variables, optional knowledge for grounding, model and settings, and a defined (text or JSON) output.' },
    { front: 'How is a prompt action validated before release?', back: 'Batch testing in the Test hub against a dataset with expected results to produce an accuracy score.' },
  ],
  quiz: [
    {
      question:
        'A regulated insurer requires that its Copilot Studio agent always reads an exact legal disclosure before quoting, but wants natural conversation for everything else. Which design is MOST appropriate?',
      options: [
        'Classic orchestration only, with a topic per possible question',
        'Generative orchestration, plus an authored topic with a message node containing the disclosure and a description telling the orchestrator when to use it',
        'Generative orchestration with the disclosure placed in a knowledge source',
        'An agent flow that emails the disclosure after the chat',
      ],
      correct: [1],
      explanation:
        'A hybrid gives natural conversation plus guaranteed wording. Classic-only loses flexibility, knowledge sources are paraphrased by the model, and emailing afterwards does not meet "before quoting".',
    },
    {
      question:
        'Users of a Teams-published agent report that it goes silent when it does not understand them. What is the MOST likely cause and fix?',
      options: [
        'Generative orchestration is off; turn it on',
        'Teams has no default Fallback system topic; create a Fallback topic triggered On Unknown Intent',
        'The agent lacks a Greeting topic; add one',
        'The Copilot Credits allocation is exhausted; add credits',
      ],
      correct: [1],
      explanation:
        'Teams does not include a default Fallback topic, so unknown intents produce no response. Orchestration mode, greetings and credit allocation would not cause silence only on unrecognised input.',
    },
    {
      question:
        'An organisation already maintains a trained conversational language understanding model in Azure AI Language with 120 intents and custom entities. It wants a Copilot Studio agent to use the same intent model. What should you design?',
      options: [
        'Re-create the intents as trigger phrases in Copilot Studio',
        'Integrate the CLU model with the agent so CLU intents map to topic triggers and entities',
        'Use generative orchestration and delete the CLU model',
        'Call the CLU API from a generative answers node',
      ],
      correct: [1],
      explanation:
        'CLU integration maps existing intents and entities directly to topics via the OnRecognize trigger. Re-creating phrases duplicates effort, deleting the model wastes investment, and generative answers nodes are for knowledge, not intent recognition.',
    },
    {
      question:
        'Which TWO types of work should be implemented in an agent flow rather than in topic nodes? (Select two)',
      options: [
        'Creating a Dataverse record after validating business rules',
        'Asking the user which product they are calling about',
        'Routing a manager approval before changing a credit limit',
        'Displaying the agent\'s greeting message',
      ],
      correct: [0, 2],
      explanation:
        'Record creation with rules and approvals are deterministic, auditable actions suited to flows with human-in-the-loop. Asking questions and greetings are conversational and belong in topics.',
    },
    {
      question:
        'Three agents and a Power Automate flow need the same email-intent classification returning structured JSON. What is the BEST way to implement it?',
      options: [
        'A separate generative answers node in each agent',
        'A single prompt action in the prompt builder with an input variable and JSON output, added as a tool to each agent and as an action in the flow',
        'Instructions in each agent describing the classification',
        'A custom entity list in each agent',
      ],
      correct: [1],
      explanation:
        'A reusable prompt action with defined inputs and schema is designed for exactly this. Generative answers nodes answer users rather than classify, duplicated instructions drift, and entities cannot classify free text semantically.',
    },
    {
      question:
        'An analytics review shows 30% of conversations end in the Fallback topic. What should the architect do FIRST?',
      options: [
        'Increase the number of rephrase attempts in Fallback to five',
        'Mine the captured UnrecognizedTriggerPhrase values to identify missing topics and improve descriptions or trigger phrases',
        'Disable the Fallback topic',
        'Switch the primary model to an experimental model',
      ],
      correct: [1],
      explanation:
        'A high fallback rate signals coverage gaps; the captured utterances tell you what to add. More rephrase loops frustrate users, disabling fallback hides the problem, and experimental models are not for production.',
    },
  ],
  statements: [
    { text: 'In classic orchestration, knowledge sources are searched proactively before topics are considered.', isTrue: false, explanation: 'Classic orchestration matches topics first and uses knowledge as a fallback or when a topic calls a generative answers node.' },
    { text: 'Generative orchestration can call several topics, tools and knowledge sources in a single turn.', isTrue: true, explanation: 'It selects and sequences multiple components based on descriptions.' },
    { text: 'The default Fallback topic escalates immediately on the first unrecognised utterance.', isTrue: false, explanation: 'It asks the user to rephrase up to twice before redirecting to Escalate.' },
    { text: 'CLU intents can be bound to Copilot Studio topic triggers.', isTrue: true, explanation: 'CLU integration maps intents and entities through the OnRecognize trigger.' },
    { text: 'Agent flows are non-deterministic because they use generative AI for every step.', isTrue: false, explanation: 'Agent flows are deterministic rule-based automations; AI actions are optional steps within them.' },
    { text: 'Prompt actions can return structured JSON that an agent flow or app consumes.', isTrue: true, explanation: 'The prompt builder lets you define a JSON output format.' },
    { text: 'Agent flow actions triggered by an authenticated Microsoft 365 Copilot-licensed user through the agent-call trigger do not consume Copilot Credits.', isTrue: true, explanation: 'That inclusion applies to the When an agent calls the flow trigger; other triggers are billed at standard rates.' },
  ],
  resources: [
    { label: 'Orchestrate agent behavior with generative AI', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions' },
    { label: 'Customize the system Fallback topic', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-fallback-topic' },
    { label: 'Agent flows overview', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview' },
    { label: 'Integrate a conversational language understanding model', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-clu-integration' },
  ],
};
