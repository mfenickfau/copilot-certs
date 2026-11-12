import type { Concept } from '../../types';

export const responseFormattingAdaptiveCards: Concept = {
  id: 'response-formatting-adaptive-cards',
  title: 'Formatting Agent Responses and Building Adaptive Cards',
  summary:
    'How to shape what the user sees: Message and Question node formatting, variations, quick replies and media cards; channel rendering differences; and Adaptive Cards as JSON or Power Fx for both displaying information and collecting input, including schema versions, output variables and submit identifiers.',
  certs: ['ab-620'],
  domains: ['ab-620-1'],
  outcomes: ['ab-620-1-3-2', 'ab-620-1-3-8'],
  tags: ['copilot-studio', 'adaptive-cards', 'json', 'power-fx', 'message-node', 'channels', 'formatting'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Formatting with Message and Question nodes',
      body: `The **Message** node sends content from the agent; the **Question** node does everything Message does and also waits for and stores an answer. Both support:

- **Basic formatting**: bold, italic, bulleted and numbered lists (rendered as Markdown where the channel allows it).
- **Variables** inserted with the \`{x}\` picker, so responses are personalised without Power Fx.
- **Message variations**: several phrasings from which the agent picks one at random, which keeps repeated prompts from sounding robotic. **Speech overrides** provide a spoken version for voice channels.
- **Media**: images and videos (public URL or YouTube), **basic cards** with title, text, image and buttons, and **Adaptive Cards**. Several cards in one node display as a **carousel** (default) or a **list**.
- **Quick replies**: suggested responses that post a message or open an HTTPS URL. They are suggestions; to force a choice use a multiple-choice Question node.

Tool-level formatting is set under a tool's **Completion** section: *Don't respond* (output is folded into the agent's own answer), *Write the response with generative AI*, *Send specific response* (a template with variables and Power Fx) or *Send an adaptive card*. Generative answers can also be captured into a variable (clear **Send a message** in the node) and rendered in your own card, but then **citations must be rendered by you**, which matters in Teams.

Rendering is channel dependent. Markdown is fully supported on websites but only partially in Teams, Facebook and Omnichannel; Teams shows at most six suggested actions as a hero card; text-only channels (SMS, WhatsApp) flatten options into a list the user must retype. The customer satisfaction survey is an Adaptive Card on the web but text-only in Teams. Design for the most constrained channel you publish to, or branch on the channel with a Condition.`,
    },
    {
      heading: 'Adaptive Cards: schema, versions and where they go',
      body: `**Adaptive Cards** describe UI in JSON that the host app renders in its own style. Copilot Studio supports schema versions **up to 1.6**, but the host decides what actually works: **Teams** and the Omnichannel live chat widget are limited to **1.5**; the Bot Framework Web Chat used by website channels supports 1.6 but **not** \`Action.Execute\`; the authoring canvas does not preview 1.6 cards (only the test chat does). The safe default is \`"version": "1.5"\` with \`Action.Submit\` and \`Action.OpenUrl\`.

Two placements:

- **Display only**: add an Adaptive Card to a **Message** or **Question** node. Use it for store hours, order summaries, status dashboards. No submit button is required.
- **Collect input**: use the **Ask with Adaptive Card** node. The card **must** contain at least one \`Action.Submit\`, may include \`Input.Text\`, \`Input.Number\`, \`Input.Date\`, \`Input.ChoiceSet\`, \`Input.Toggle\` and so on, and Copilot Studio **generates an output variable per input id** when you save. If the inferred types are wrong, use **Edit Schema** to adjust them.

You author cards in the built-in **Adaptive Card designer** (drag elements or paste JSON in the **card payload editor**), or switch the node to **Formula** to express the card as a **Power Fx record**, which lets you inject \`Topic.\` and \`Global.\` variables, build \`ForAll\` tables of rows from a flow result, and conditionally show elements. Switching from JSON to Formula converts the payload automatically. Images from connectors such as SharePoint may render blurred or as a generic icon; host images on a public URL.`,
    },
    {
      heading: 'Behaviour of interactive cards',
      body: `An **Ask with Adaptive Card** node has properties that govern what happens around the card:

- **How many reprompts** (default: repeat up to 2 times) and a **Retry prompt** when the user types text instead of submitting; each retry re-sends the card.
- **Allow switching to another topic** (default on): a typed message that matches another topic interrupts; the card is sent again when the interrupting topic ends.

Submit buttons stay clickable after submission, so with consecutive cards a user may click an older one. Microsoft's guidance is to put an identifier in each \`Action.Submit\` \`data\` payload (for example \`"actionSubmitId": "booking_confirm_v3"\`) and validate it when processing the response; the identifier distinguishes actions but does not by itself block duplicate submissions. In a custom Web Chat client you can also make submitted cards read-only.

Accessibility and robustness: always set \`wrap: true\` on long TextBlocks, give inputs a \`label\`, use \`isRequired\` with an \`errorMessage\`, and keep action titles short. Cards are also the right place for confirmation steps before a tool runs with side effects: show the parsed values, offer **Confirm** and **Cancel**, and branch on the returned \`actionSubmitId\`.`,
    },
    {
      heading: 'The exam angle',
      body: `Expect questions that test placement, versioning and dynamic content:

- "Show a read-only order summary" is a card on a **Message** node; "collect a delivery date and a yes/no" is **Ask with Adaptive Card** with inputs and a submit button.
- "The card renders on the website but not in Teams" almost always means a **1.6-only feature or Action.Execute**; drop to 1.5.
- "Include values returned by the flow in the card" means switch the card to **Formula** (Power Fx) and reference \`Topic.\` variables; hard-coded JSON cannot interpolate.
- "The output variables created from the card have the wrong types" means **Edit Schema**.
- "Users keep triggering a stale card" means add an **actionSubmitId** and validate it.
- "Phrase the prompt differently each time" means **message variations**; "let the user tap a suggestion but still type freely" means **quick replies**, whereas "force a choice from a list" means a **multiple-choice Question**.

Distractors to recognise: a basic card when inputs are needed, Markdown tables in Teams (partially supported), relying on citation rendering after customising the generative answer, or increasing reprompts to fix a schema issue.`,
    },
  ],
  examples: [
    {
      title: 'Collecting booking details with a dynamic card',
      description:
        'A travel agent topic needs the traveller\'s name and preferred date. The developer uses an Ask with Adaptive Card node, pastes JSON with Input.Text (id myName) and Input.Date (id travelDate), then switches to Formula so the heading uses Topic.Destination. Saving the node creates Topic.myName and Topic.travelDate automatically.',
      code: `{
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    { "type": "TextBlock", "text": "Trip details", "weight": "Bolder", "size": "Medium", "wrap": true },
    { "type": "Input.Text", "id": "myName", "label": "Traveller name", "isRequired": true,
      "errorMessage": "Please enter your name." },
    { "type": "Input.Date", "id": "travelDate", "label": "Departure date", "isRequired": true,
      "errorMessage": "Please pick a date." }
  ],
  "actions": [
    { "type": "Action.Submit", "title": "Continue", "data": { "actionSubmitId": "trip_details_submit" } }
  ]
}`,
      language: 'json',
      takeaway: 'Each input id becomes a topic variable; version 1.5 and Action.Submit keep the card working in Teams and on the web.',
    },
    {
      title: 'The card that vanished in Teams (a realistic mistake)',
      description:
        'A developer builds a rich status card with schema 1.6 and Action.Execute because the designer accepted it and the test chat rendered it. After publishing to Teams, users see nothing. Teams is limited to schema 1.5 and Web Chat does not support Action.Execute. The fix is to set version 1.5, replace Action.Execute with Action.Submit, and verify in Teams rather than only the test chat.',
      takeaway: 'Author for the most restrictive host you publish to: version 1.5 and Action.Submit are the safe baseline.',
    },
    {
      title: 'Rendering flow results as a table with Power Fx',
      description:
        'A flow returns a table of open invoices in Topic.Invoices. The card is switched to Formula so a ForAll builds one FactSet row per invoice, and a Confirm button carries the count in its data payload for validation.',
      code: `{
  '$schema': "http://adaptivecards.io/schemas/adaptive-card.json",
  type: "AdaptiveCard",
  version: "1.5",
  body: [
    { type: "TextBlock", text: Concatenate("Open invoices for ", Global.CustomerName), weight: "Bolder", wrap: true },
    {
      type: "FactSet",
      facts: ForAll(Topic.Invoices, { title: ThisRecord.Number, value: Text(ThisRecord.Amount, "[$-en-US]$#,##0.00") })
    }
  ],
  actions: [
    { type: "Action.Submit", title: "Pay all", data: { actionSubmitId: "pay_all", count: CountRows(Topic.Invoices) } },
    { type: "Action.Submit", title: "Cancel", data: { actionSubmitId: "cancel" } }
  ]
}`,
      language: 'text',
      takeaway: 'The Formula view turns a card into a Power Fx record so variables, ForAll and conditional content can drive the layout.',
    },
    {
      title: 'Customising a generative answer and losing citations',
      description:
        'To brand its answers, a team clears Send a message on the generative answers node, stores the text in Global.Answer and renders it in an Adaptive Card. In Teams the citation links disappear because Copilot Studio adds citations automatically only for uncustomised answers. The team either returns to the default rendering or includes citation rendering in the card.',
      takeaway: 'Customising a generative answer shifts responsibility for citations to you; this is a known Teams limitation.',
    },
  ],
  keyPoints: [
    'Message and Question nodes support basic formatting, variables, message variations, speech overrides, images, videos, basic cards, Adaptive Cards and quick replies; multiple cards show as carousel or list.',
    'Quick replies are suggestions; a multiple-choice Question node forces a choice. Tool Completion settings choose between generative, specific-text and adaptive card responses.',
    'Channels render differently: Markdown partial in Teams, six suggested actions max in Teams, text-only channels flatten options, CSAT survey is text-only in Teams.',
    'Copilot Studio supports Adaptive Card schema up to 1.6, but Teams and Omnichannel live chat are limited to 1.5 and Web Chat lacks Action.Execute; 1.6 cards preview only in the test chat.',
    'Display-only cards go on Message or Question nodes; input-collecting cards use the Ask with Adaptive Card node, which requires an Action.Submit and generates output variables per input id (Edit Schema to correct types).',
    'Switch a card to Formula to express it as a Power Fx record with variables, ForAll and conditional elements.',
    'Reprompt count, retry prompt and Allow switching to another topic govern invalid or interrupted submissions; include an actionSubmitId in Action.Submit data and validate it.',
    'Customised generative answers do not get automatic citations in Teams.',
  ],
  flashcards: [
    { front: 'Which node should you use to collect input with an Adaptive Card?', back: 'Ask with Adaptive Card. It requires at least one Action.Submit and creates an output variable for each input id.' },
    { front: 'Which Adaptive Card schema version does Microsoft Teams support in Copilot Studio?', back: 'Up to 1.5 (Copilot Studio supports up to 1.6, but Teams and the Omnichannel live chat widget are limited to 1.5).' },
    { front: 'How do you include topic variables inside an Adaptive Card payload?', back: 'Switch the card node to Formula, which converts the JSON to a Power Fx record where you can reference Topic. and Global. variables.' },
    { front: 'What is the purpose of message variations?', back: 'The agent randomly picks one of several phrasings each time the node runs, making repeated prompts feel natural.' },
    { front: 'How do quick replies differ from a multiple-choice Question node?', back: 'Quick replies are optional suggestions (the user can still type); a multiple-choice Question requires choosing from the options.' },
    { front: 'What should every Action.Submit include when a conversation has consecutive cards?', back: 'An identifier in its data payload (for example actionSubmitId) that the topic validates to distinguish submissions.' },
    { front: 'What happens if the output variables generated from a card have the wrong type?', back: 'Use Edit Schema in the Adaptive Card node properties to correct the variable list and types.' },
    { front: 'Why can Action.Execute be a problem?', back: 'The Bot Framework Web Chat component used by website channels does not support it; use Action.Submit.' },
    { front: 'What is the maximum number of suggested actions Teams renders from one Question node?', back: 'Six, shown as a hero card.' },
  ],
  quiz: [
    {
      question:
        'A topic must show the user a summary of their open tickets and let them pick one to escalate by tapping a button. Which node should you use?',
      options: [
        'A Message node with a basic card',
        'An Ask with Adaptive Card node whose card contains Action.Submit buttons with ticket ids in the data payload',
        'A Message node with quick replies set to Open URL',
        'A Set variable value node with a Power Fx table',
      ],
      correct: [1],
      explanation:
        'Collecting a choice back into the topic requires an interactive card on the Ask with Adaptive Card node, with submit data identifying the ticket. A basic card and Open URL quick replies do not return structured data to the topic, and Set variable value displays nothing.',
    },
    {
      question:
        'An Adaptive Card displays correctly in the Copilot Studio test chat but does not render for users in Microsoft Teams. What is the MOST likely cause?',
      options: [
        'The card uses schema version 1.6 features or Action.Execute, which Teams does not support',
        'The topic lacks a trigger phrase',
        'The agent uses Authenticate with Microsoft',
        'Message variations are enabled on the node',
      ],
      correct: [0],
      explanation:
        'Teams is limited to schema 1.5 and Action.Submit; the test chat renders 1.6 cards, which hides the problem. Trigger phrases, authentication and variations do not affect card rendering.',
    },
    {
      question:
        'You need the heading of an Adaptive Card to include the customer\'s name stored in Global.CustomerName. What should you do?',
      options: [
        'Insert the variable with the {x} picker inside the JSON payload',
        'Switch the card node to Formula and reference Global.CustomerName in a Power Fx record',
        'Create a second Message node that says the name before the card',
        'Store the name in the card\'s version field',
      ],
      correct: [1],
      explanation:
        'Dynamic content in a card requires the Formula (Power Fx) representation. The {x} picker works in message text, not inside raw JSON, a separate message does not change the card, and the version field is for schema versioning.',
    },
    {
      question:
        'Which TWO statements about response formatting are correct? (Select two)',
      options: [
        'Quick replies force the user to choose one of the suggested options',
        'Markdown is only partially supported in Microsoft Teams',
        'When you customise a generative answer by rendering it from a variable, citations are not added automatically in Teams',
        'Multiple media cards in one node can only be shown as a list',
      ],
      correct: [1, 2],
      explanation:
        'Teams partially supports Markdown and does not auto-render citations for customised answers. Quick replies are suggestions (a multiple-choice Question forces a choice), and multiple cards default to a carousel with list as an option.',
    },
    {
      question:
        'After saving an Ask with Adaptive Card node, the generated variable for an Input.Number field has type String. What should you do?',
      options: [
        'Increase How many reprompts',
        'Select Edit Schema in the node properties and set the variable type to Number',
        'Replace Action.Submit with Action.Execute',
        'Move the card to a Message node',
      ],
      correct: [1],
      explanation:
        'Edit Schema lets you correct inferred output variable types. Reprompts govern invalid submissions, Action.Execute is unsupported in Web Chat, and a Message node cannot collect input.',
    },
  ],
  statements: [
    { text: 'The Question node has all the capabilities of the Message node.', isTrue: true, explanation: 'It adds the ability to wait for and store an answer.' },
    { text: 'Copilot Studio renders version 1.6 Adaptive Cards on the authoring canvas.', isTrue: false, explanation: 'Version 1.6 cards render only in the test chat, not on the canvas.' },
    { text: 'An Adaptive Card on a Message node must include a submit button.', isTrue: false, explanation: 'Display-only cards on Message or Question nodes need no submit action; only Ask with Adaptive Card requires one.' },
    { text: 'Switching an Adaptive Card node from JSON to Formula automatically converts the payload to a Power Fx record.', isTrue: true, explanation: 'This is how you introduce variables into a card.' },
    { text: 'Including an actionSubmitId in Action.Submit data prevents duplicate submissions automatically.', isTrue: false, explanation: 'It distinguishes actions; you still validate it and may need client-side measures to avoid stale clicks.' },
    { text: 'By default an Ask with Adaptive Card node repeats the card up to two times when the user responds with text instead of submitting.', isTrue: true, explanation: 'How many reprompts defaults to Repeat up to 2 times.' },
    { text: 'In Teams the customer satisfaction survey is shown as an Adaptive Card.', isTrue: false, explanation: 'It is a text-only version in Teams.' },
  ],
  resources: [
    { label: 'Send a message', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-send-message' },
    { label: 'Use Adaptive Cards in Copilot Studio', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/adaptive-cards-overview' },
    { label: 'Ask questions with Adaptive Cards', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-ask-with-adaptive-card' },
  ],
};
