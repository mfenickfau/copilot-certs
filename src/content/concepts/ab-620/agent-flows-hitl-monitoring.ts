import type { Concept } from '../../types';

export const agentFlowsHitlMonitoring: Concept = {
  id: 'agent-flows-hitl-monitoring',
  title: 'Human-in-the-Loop, Error Handling and Monitoring for Agent Flows',
  summary:
    'How to keep people in control of automated flows with approvals, multistage and AI approval stages and the request-for-information action; how to make flows resilient with run-after conditions, scopes, retries and explicit error outputs; and how to monitor flow runs, failures and capacity in Copilot Studio and the Power Platform admin center.',
  certs: ['ab-620'],
  domains: ['ab-620-1'],
  outcomes: ['ab-620-1-2-2', 'ab-620-1-2-4', 'ab-620-1-2-6'],
  tags: ['copilot-studio', 'agent-flows', 'approvals', 'human-in-the-loop', 'error-handling', 'monitoring'],
  difficulty: 'intermediate',
  diagram: 'escalation-decision',
  sections: [
    {
      heading: 'Human-in-the-loop actions',
      body: `Agent flows have a dedicated **Human review** group of actions. Three matter for the exam:

- **Start and wait for an approval** (standard approvals): the flow pauses until assigned approvers respond in the Teams Approvals app, Outlook or the Power Automate portal. Approval types include *Approve/Reject - First to respond*, *Approve/Reject - Everyone must approve* and custom responses.
- **Run a multistage approval (preview)**: a sequence of **manual stages** and **AI stages** with **conditions** between them. An AI stage receives instructions plus inputs (documents, images, text, knowledge) and returns Approve, Reject or "Analysis failed" with a rationale; by default an AI approval continues to the next stage and an AI rejection ends the approval, and you can route every outcome explicitly so a human always makes the final call. AI stages consume Copilot Credits, documents must be base64, and the same approver should not be assigned to multiple stages. Favour stronger reasoning models for approval decisions.
- **Request for information (RFI)**: pauses the flow and emails designated reviewers (Outlook only, same tenant) a form with typed inputs (text, yes/no, email, number, date). The **first response wins**, and every input becomes a parameter for later actions.

Design guidance Microsoft repeats: for sensitive decisions (money, legal, personnel, compliance) make sure a **human stage is always reached**; use AI stages to pre-screen routine requests, not to replace accountability. An agent can also keep humans in the loop before the flow starts (**Ask the end user before running** on the tool) and after it (an adaptive card with Confirm and Cancel).`,
    },
    {
      heading: 'Error handling inside a flow',
      body: `Agent flows inherit the Power Automate error model, and the exam expects you to know the four tools:

1. **Configure run after**: every action can run after the previous one *is successful*, *has failed*, *is skipped* or *has timed out*. A notification or compensating action set to run after "has failed" is the basic catch block.
2. **Scopes**: group actions so a whole block reports one status. The classic **try / catch / finally** pattern is three scopes: *Try* holds the business logic; *Catch* is configured to run after Try has failed or timed out; *Finally* runs after both regardless of outcome. Keep the trigger and the **Respond to the agent** action outside scopes, and remember the eight-level nesting limit.
3. **Retry policy** in an action's settings (default, exponential, fixed interval, none) for transient connector failures, and **timeouts** per action.
4. **Terminate** to end a run explicitly as Succeeded, Failed or Cancelled with a message, which makes failures visible in run history and analytics instead of silently continuing.

Two agent-specific rules: first, tell the **agent** what went wrong by returning an explicit output such as \`Success\` (boolean) and \`ErrorMessage\` (text) from Respond to the agent, then branch in the topic or let the Completion response explain. A flow that fails without responding surfaces only as a generic error in the chat. Second, use **Flow checker** before publishing; a flow with errors cannot be published. For data-level errors (a lookup that returns nothing) prefer a **Condition** on the result over letting a downstream action throw.`,
    },
    {
      heading: 'Monitoring flows',
      body: `Each agent flow has four tabs:

- **Overview**: name, description, connections, owner and co-owners, recent runs, turn off or delete, and savings rules for solution flows.
- **Designer**: the canvas, version history and Flow checker.
- **Activity**: the run history with status and duration; open a run to step through each action's inputs and outputs, select several runs to **resubmit** them, or cancel runs that are in progress.
- **Analytics**: run counts, failure rate and trends. Runs can take up to 30 minutes to appear, metrics exist only for solution flows, and co-owned or shared flow runs are excluded.

At the agent level, the **Activity** page and the **activity map** in the test pane show when the orchestrator called the flow and what it returned; the **Monitor** page gives session and outcome analytics. Capacity is monitored in the **Power Platform admin center > Licensing > Copilot Studio**, where you can see agent flow actions used per flow and set credit caps. For enterprise observability, send agent telemetry to **Application Insights** (agent-level connection string, or environment-level export of OpenTelemetry-aligned spans) and alert on failures from Azure Monitor. Approval decisions and AI-stage rationales are reviewable in the **Power Automate Approvals** history.

Express mode has its own monitoring caveats: live activity is not shown while the run is in progress, and loop iterations may be hidden when a connector response exceeds the memory limit.`,
    },
    {
      heading: 'The exam angle',
      body: `Expect scenario items that mix the three outcomes:

- "A manager must approve expenses above 5,000 but routine ones should be auto-approved after a policy check" points to a **multistage approval** with an **AI stage**, a **condition** on amount, and a **manual stage**.
- "A field adjuster must supply missing photos before the flow continues" points to **Request for information**, not an approval (no decision is being made; data is being collected).
- "If the ERP call fails, log the error and tell the user, but still complete the request" points to **scopes with run-after** and an error output on **Respond to the agent**, not to turning off the agent's On Error topic.
- "Find out why yesterday's runs failed" points to the flow's **Activity** tab, and "how many actions did this flow consume" points to the **Power Platform admin center** licensing view.

Common distractors: the Copilot Studio **HTTP node's Continue on error** (a topic feature, not a flow feature), the agent's **On Error system topic** (agent level, not flow level), **Ask the end user before running** (confirmation before a tool, not an approval inside the flow) and **human supervision** (a computer use setting).`,
    },
  ],
  examples: [
    {
      title: 'Expense approval with an AI pre-screen',
      description:
        'Contoso\'s expense agent collects a receipt and amount, then calls an agent flow. The flow runs a multistage approval: an AI stage checks the receipt against the travel policy; a condition routes amounts over 5,000 to a manual manager stage and lets smaller approved amounts finish as approved; a final finance stage handles payment. The flow then responds to the agent with Decision and Rationale outputs, which the agent relays.',
      code: `Run a multistage approval
  Stage 1 (AI):      "Approve if the receipt matches the policy in /TravelPolicy. Reject if alcohol
                      or personal items appear. Inputs: /Receipt (document), /Amount (number)."
                      On Approve -> next stage | On Reject -> end as rejected | Analysis failed -> next stage
  Condition:         Amount > 5000 ? -> Stage 2 : -> end as approved
  Stage 2 (Manual):  Approve/Reject - First to respond, Assigned to: manager email
  Stage 3 (Manual):  Finance review, Everyone must approve
Respond to the agent
  Outputs: Decision (Text), Rationale (Text)`,
      language: 'text',
      takeaway: 'AI stages accelerate routine approvals; conditions and manual stages keep humans accountable for the decisions that matter.',
    },
    {
      title: 'The silent failure (a realistic mistake)',
      description:
        'An onboarding flow creates a Dataverse row, then calls an HR API through a custom connector. When the API returns 500, the flow run fails and the agent tells the user "Something went wrong". Nobody is notified and the Dataverse row is left orphaned. The developer wraps the API call in a Try scope, adds a Catch scope (run after Try has failed) that deletes the row and posts to a Teams channel, a Finally scope that always runs, and changes Respond to the agent to return Success=false with a readable ErrorMessage so the topic can apologise and offer to retry.',
      code: `Scope: Try
  - HR API - Create employee (custom connector)   [Retry policy: exponential, 4 retries]
Scope: Catch            [Configure run after: Try has failed, has timed out]
  - Dataverse - Delete a row (compensate)
  - Teams - Post message in a channel ("Onboarding failed for @{triggerBody()?['text']}")
Scope: Finally          [Configure run after: Try is successful, has failed, is skipped, has timed out]
  - Compose: Success = @{equals(result('Try')?[0]?['status'], 'Succeeded')}
Respond to the agent    [outside scopes]
  Outputs: Success (Yes/No), ErrorMessage (Text)`,
      language: 'text',
      takeaway: 'Catch failures with run-after conditions and scopes, compensate, notify, and return a structured error to the agent instead of letting the run fail silently.',
    },
    {
      title: 'Collecting missing data without an approval',
      description:
        'An insurance claims flow detects that a claim lacks a repair estimate. Instead of rejecting it, the flow uses Request for information to email the field adjuster a form asking for the estimate amount (number), inspection date (date) and whether photos were taken (yes/no). When the adjuster submits, the parameters feed an AI approval stage. The developer notes that only the first responder\'s answer is used and that requests cannot go outside the tenant.',
      takeaway: 'Use Request for information when the flow needs data, and an approval when it needs a decision.',
    },
    {
      title: 'Finding the failing runs',
      description:
        'Finance reports that invoice postings stopped overnight. The developer opens the flow in Copilot Studio, checks the Activity tab, filters failed runs, steps into one and sees the ERP connector returned 401 because a service account password expired. After fixing the connection on the Overview tab, they select the failed runs and resubmit them, then check the Analytics tab the next day to confirm the failure rate dropped.',
      takeaway: 'Activity shows individual runs and lets you resubmit; Analytics shows trends; the Power Platform admin center shows capacity consumed.',
    },
  ],
  keyPoints: [
    'Human review actions: standard approvals, multistage approvals (manual stages, AI stages, conditions; preview) and Request for information (typed inputs, first response wins, Outlook only).',
    'AI approval stages return Approve, Reject or Analysis failed with a rationale; route outcomes so a human stage is always reached for sensitive decisions; AI stages consume Copilot Credits.',
    'Error handling uses Configure run after (succeeded, failed, skipped, timed out), Scope-based try/catch/finally, per-action retry policies and timeouts, and Terminate.',
    'Return explicit Success and ErrorMessage outputs from Respond to the agent so the topic or completion response can handle failures gracefully.',
    'Flows with errors cannot be published; use Flow checker.',
    'Monitor per flow with the Overview, Activity (run history, resubmit, cancel) and Analytics (runs, failure rate, trends) tabs; analytics cover solution flows and may lag 30 minutes.',
    'Capacity consumption per flow is visible in the Power Platform admin center under Licensing > Copilot Studio; Application Insights adds alerting and cross-agent observability.',
    'Distinguish flow-level controls from agent-level ones: On Error topic and HTTP node Continue on error belong to topics; human supervision belongs to computer use.',
  ],
  flashcards: [
    { front: 'Which agent flow action collects typed data from a human reviewer without making an approval decision?', back: 'Request for information (RFI), under Human review; it emails a form via Outlook and uses the first response.' },
    { front: 'What are the three building blocks of a multistage approval?', back: 'Manual stages, AI stages and conditions between stages.' },
    { front: 'What does an AI approval stage return when its instructions are contradictory or inputs insufficient?', back: '"Analysis failed", which by default continues to the next stage so a human can decide.' },
    { front: 'How do you implement try/catch in an agent flow?', back: 'Put the logic in a Try scope, set a Catch scope to run after Try has failed or timed out, and optionally a Finally scope that runs after all outcomes.' },
    { front: 'Where do you configure whether an action runs when the previous action failed?', back: 'In the action\'s Configure run after settings (is successful, has failed, is skipped, has timed out).' },
    { front: 'Which tab lets you resubmit or cancel agent flow runs?', back: 'The Activity tab of the agent flow.' },
    { front: 'Where do you see how many agent flow actions a flow consumed?', back: 'Power Platform admin center > Licensing > Copilot Studio.' },
    { front: 'Can a flow with errors be published?', back: 'No. All Flow checker errors must be fixed first.' },
    { front: 'Why return a Success boolean and ErrorMessage from Respond to the agent?', back: 'So the agent or topic can branch and explain the failure instead of showing a generic error.' },
  ],
  quiz: [
    {
      question:
        'An expense flow must automatically approve requests under 1,000 that comply with policy, route requests over 1,000 to the employee\'s manager, and always send approved requests to Finance. Which action should you use?',
      options: [
        'Start and wait for an approval with Everyone must approve',
        'Run a multistage approval with an AI stage, a condition on the amount and manual stages',
        'Request for information assigned to the manager and Finance',
        'Ask the end user before running on the flow tool',
      ],
      correct: [1],
      explanation:
        'Multistage approvals combine AI stages (policy check), conditions (amount) and manual stages (manager, Finance). A single standard approval has no stages or conditions, RFI collects data rather than decisions, and Ask the end user before running is a tool confirmation prompt in the agent.',
    },
    {
      question:
        'A flow calls an external API through a custom connector. If the call fails, the flow must undo an earlier Dataverse insert, notify a Teams channel and still return a readable error to the agent. Which design meets the requirement?',
      options: [
        'Enable Continue on error on the HTTP node in the topic',
        'Place the API call in a Try scope, add a Catch scope configured to run after Try has failed, and return Success and ErrorMessage outputs from Respond to the agent',
        'Add a Terminate action set to Succeeded after the API call',
        'Customise the agent\'s On Error system topic',
      ],
      correct: [1],
      explanation:
        'Scopes with run-after conditions implement compensation and notification, and explicit outputs let the agent respond gracefully. Continue on error is a topic HTTP node feature, Terminate Succeeded would hide the failure, and the On Error topic cannot undo the Dataverse insert.',
    },
    {
      question:
        'A claims flow must pause until a field adjuster supplies a repair estimate and inspection date, then continue using those values. Which action is MOST appropriate?',
      options: [
        'Request for information with Number and Date inputs',
        'Start and wait for an approval with custom responses',
        'Run a prompt to estimate the values',
        'A Delay action followed by a Dataverse lookup',
      ],
      correct: [0],
      explanation:
        'RFI collects typed inputs from a human and exposes them as parameters. Approvals produce decisions, not structured data; a prompt would fabricate values; a Delay does not involve a human.',
    },
    {
      question:
        'Which TWO statements about monitoring agent flows are correct? (Select two)',
      options: [
        'The Activity tab shows run history and lets you resubmit failed runs',
        'The Analytics tab updates in real time for all flows including shared ones',
        'Agent flow action consumption per flow is visible in the Power Platform admin center under Licensing > Copilot Studio',
        'Flow run failures can only be seen in Application Insights',
      ],
      correct: [0, 2],
      explanation:
        'Activity provides run history with resubmit and cancel, and the admin center shows capacity consumption. Analytics can lag up to 30 minutes and excludes co-owned or shared flows; Application Insights is optional, not the only place to see failures.',
    },
    {
      question:
        'A finance director worries that an AI approval stage could approve a fraudulent payment without anyone noticing. What is the recommended mitigation?',
      options: [
        'Remove all AI stages and use only manual approvals',
        'Configure the AI stage\'s Next step based on decision so approvals still proceed to a manual stage before payment',
        'Assign the same approver to every stage',
        'Turn off human supervision on the flow',
      ],
      correct: [1],
      explanation:
        'Microsoft recommends ensuring human stages are reached for sensitive decisions by routing AI outcomes to subsequent manual stages. Removing AI stages discards the efficiency gain unnecessarily, assigning one approver to multiple stages causes the flow to fail, and human supervision is a computer use feature.',
    },
  ],
  statements: [
    { text: 'In a Request for information action, responses from all assignees are merged.', isTrue: false, explanation: 'Only the first person to respond is used; later responses are not processed.' },
    { text: 'AI approval stages require Copilot Credits in the environment.', isTrue: true, explanation: 'Without sufficient credits the approval stalls.' },
    { text: 'The trigger and Respond to the agent action should be placed inside a Scope for clarity.', isTrue: false, explanation: 'Microsoft advises keeping triggers and response actions outside scopes.' },
    { text: 'A Catch scope is implemented by configuring it to run after the Try scope has failed or timed out.', isTrue: true, explanation: 'This is the standard try/catch pattern with run-after conditions.' },
    { text: 'A flow containing Flow checker errors can still be published if you acknowledge the warnings.', isTrue: false, explanation: 'Errors block publishing; only warnings can be acknowledged.' },
    { text: 'The Analytics tab for agent flows shows metrics only for solution flows.', isTrue: true, explanation: 'Run analysis metrics are available only for solution flows.' },
    { text: 'Approval decisions and AI stage rationales can be reviewed in the Power Automate Approvals history.', isTrue: true, explanation: 'Approvers see decisions and rationale in the Approvals center History tab.' },
  ],
  resources: [
    { label: 'Multistage and AI approvals in agent flows', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-advanced-approvals' },
    { label: 'Request information from human review in agent flows', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-request-for-information' },
    { label: 'Monitor your agent flows', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/flow-manage-monitor' },
    { label: 'Use scopes to organize actions in cloud flows', url: 'https://learn.microsoft.com/en-us/power-automate/scopes' },
  ],
};
