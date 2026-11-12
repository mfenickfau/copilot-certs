import type { Concept } from '../../types';

export const modelStrategyAndPromptEngineering: Concept = {
  id: 'model-strategy-and-prompt-engineering',
  title: 'Model Strategy: Custom Models, Small Language Models, Model Router and Prompt Engineering',
  summary:
    'When a business solution should rely on prompting and grounding, when it justifies a custom or fine-tuned model in Microsoft Foundry or AI Builder, where small language models fit, how a model router balances cost and quality, and the prompt engineering and prompt library guidelines an architect publishes and validates across Copilot, Copilot Studio and Foundry.',
  certs: ['ab-100', 'ab-731'],
  domains: ['ab-100-1', 'ab-100-2', 'ab-100-3', 'ab-731-1'],
  outcomes: ['ab-100-1-2-8', 'ab-100-1-2-9', 'ab-100-1-2-10', 'ab-100-1-2-11', 'ab-100-1-3-4', 'ab-100-2-2-1', 'ab-100-3-2-3', 'ab-731-1-1-3'],
  tags: ['models', 'fine-tuning', 'small-language-models', 'model-router', 'prompt-engineering', 'prompt-library', 'foundry', 'ai-builder'],
  difficulty: 'advanced',
  diagram: 'foundry-agent-stack',
  sections: [
    {
      heading: 'Prompt, ground, then customise: when custom models are justified',
      body: `The default model strategy for business solutions is **prompt engineering plus grounding (RAG) on a foundation model**, because it is cheapest to change, needs no training data and keeps answers current. Microsoft's guidance is to escalate to a **custom model** only when that approach measurably fails. Signals that justify customisation:

- The task needs **consistent style, structure or schema** that few-shot prompting cannot hold (for example strict clinical coding output).
- **Domain language or behaviour** that pretrained models misread, where you have high-quality labelled examples.
- **Prompt overhead** is the cost driver: thousands of tokens of examples on every call, where a fine-tuned model would need none.
- **Tool-use accuracy**: the agent picks the wrong tool or malformed arguments despite good descriptions.
- A **smaller, cheaper model** could meet requirements if specialised with teacher-generated examples.
- **Predictive, non-generative needs** (will this invoice be paid late? which category is this document?) where a trained classifier or regressor is the right tool anyway.

Where to build. **Microsoft Foundry** offers fine-tuning of catalog models with supervised fine-tuning (SFT), preference fine-tuning (DPO) and reinforcement fine-tuning (RFT), through Managed Training (submit data and settings) or Programmed Training (preview, Python-controlled). Fine-tuning does not replace retrieval for current information or application-level safety controls, adds training and hosting cost, and must be proven against a held-out evaluation set. **AI Builder** in Power Platform provides low-code custom models (prediction, document processing, object detection, classification, entity extraction) trained on Dataverse data and prebuilt models (receipts, invoices, ID documents, sentiment) for common scenarios, surfaced to Power Apps, Power Automate and Copilot Studio.

Design the decision as a ladder: prompt, then ground, then fine-tune or train, and record the evidence (evaluation scores, cost per call, latency) that justified each step.`,
    },
    {
      heading: 'Small language models and the model portfolio',
      body: `A **small language model (SLM)** such as the Phi family in the Foundry catalog (1B and 3B base and instruct variants are published explicitly for on-device and edge inferencing) trades breadth for speed, cost and deployability. Use cases an architect should develop:

- **Edge and on-device inference**: field technicians in Dynamics 365 Field Service working offline, retail devices, factory floor equipment where latency and connectivity rule out a cloud frontier model.
- **High-volume, narrow tasks**: classification, routing, extraction, summarisation of short texts, where a fine-tuned SLM matches a large model at a fraction of the cost.
- **Data residency or sovereignty**: running inference inside your own infrastructure or region when a frontier model's data zone is unavailable.
- **Sub-agents in multi-agent systems**: the coordinator uses a frontier model while specialised task agents run SLMs.
- **Privacy-sensitive pre-processing**: PII detection or redaction before anything reaches a shared model.

The portfolio view matters more than any single choice. Foundry's catalog spans frontier models (OpenAI, Anthropic and others), open models (Meta, DeepSeek, Mistral), industry models and SLMs, deployable as Global Standard, Data Zone Standard or regional deployments. Copilot Studio lets you pick a **primary model** per agent (a general chat model is the default; GA models, preview models and experimental models carry tags and regional notes, and some are cross-geo), use **deep reasoning** models for complex steps, and bring Foundry catalog models into **prompt tools**. When Copilot Studio changes its default model, you can keep an agent on the current model for up to 30 days to test and migrate. A model strategy therefore includes a **model lifecycle**: approved models per workload class, pinned versions, retirement dates and an evaluation gate before switching.`,
    },
    {
      heading: 'Model router: letting the platform pick per request',
      body: `**Model router** in Microsoft Foundry is itself a trained language model deployed like any other Foundry model. For each prompt it assesses complexity, reasoning need and task type in real time and routes to the most suitable underlying model from a pool (OpenAI, DeepSeek, Meta, xAI and Anthropic models in the current version; Claude models must be deployed separately first). It does not store prompts and honours data-zone boundaries, routing only to models you are eligible for.

Routing modes:
- **Balanced** (default): consider models within a small quality band (roughly 1 to 2% of the best) and pick the most cost-effective.
- **Cost**: a wider quality band (roughly 5 to 6%) for maximum savings.
- **Quality**: always the highest-rated model, ignoring cost.

You can also define a **model subset** to constrain the pool, which matters because the effective context window is limited by the *smallest* underlying model. Model router supports Global Standard and Data Zone Standard deployments, works with **Foundry Agent Service** agents including tool calls (a greeting routes to a cheap model, a complex tool-calling chain to a frontier model), uses date-stamped versions (the latest version receives new models in place), and can be governed with Azure Policy and monitored with per-model usage metrics.

Architect's implementation checklist: deploy model router with the mode that matches the workload's quality bar, restrict the subset to approved models for residency and compliance, **evaluate it against your current single-model baseline** with the same test set before cutover (Microsoft is explicit that managed routing must be confirmed to improve outcomes), and watch per-model cost and latency after go-live. Model router is a cost and latency optimisation, not a substitute for grounding or guardrails.`,
    },
    {
      heading: 'Prompt engineering guidelines and a governed prompt library',
      body: `Architects do not write every prompt, so they publish **guidelines** and curate a **library**.

**Guidelines for people using Copilot.** Microsoft's four prompt elements: state the **goal**, give **context** (who, why, constraints), name the **source** (reference the file, meeting or person with /, or a knowledge source), and set **expectations** (format, length, tone, audience). Iterate rather than accept the first answer, ask Copilot to show its sources, and never paste secrets. Microsoft's **Prompt Gallery** in Copilot Chat lets users save, like and share prompts with their team, and admins can export usage.

**Guidelines for builders (Copilot Studio, Foundry).** Separate system instructions from user input and mark data with delimiters; be specific about role, task, allowed sources and refusal behaviour; prefer positive instructions over long lists of prohibitions; use few-shot examples for format, chain-of-thought style decomposition for multi-step tasks (not for reasoning models, which do this internally); ask for structured output (JSON schema) when another system consumes it; ground with retrieved content and tell the model to say when sources are silent; keep prompts versioned alongside the model version that was tested. Instructions are not a security boundary; pair them with Prompt Shields and content filters.

**Prompt library.** Copilot Studio's **prompt builder** creates reusable prompts with input variables and knowledge, started from Microsoft's **prompt library** templates (document extraction, data transformation, content generation), reachable from Copilot Studio Tools or the Power Apps and Power Automate **AI hub**. Organisational library rules: one owner per prompt, naming and description standards so generative orchestration selects correctly, inputs and expected output schema documented, a **test set with expected answers run through batch testing** (the Test hub produces an accuracy score), model version and settings recorded, distribution through **solutions** so prompts move dev, test, prod with the agent, and a review cadence when models change.

**Validating prompt best practices (3-2-3)** means proving them: batch-test prompts against representative cases, compare versions over time, review automatic evaluations with a human, and treat a drop in accuracy after a model update as a release blocker.`,
    },
  ],
  examples: [
    {
      title: 'Choosing not to fine-tune',
      description:
        'A telecom wants a model that writes contract summaries in its house style. The architect first adds a style guide and three exemplar summaries to the Copilot Studio prompt, grounds on the contract library, and measures with a 60-case test set: 92% acceptable. Fine-tuning is deferred because the remaining failures are missing clauses in source documents, a data problem, not a model problem.',
      takeaway: 'Prompt and ground first; justify customisation with evaluation evidence, and check whether failures are really data failures.',
    },
    {
      title: 'An SLM at the edge',
      description:
        'A utility\'s field engineers classify photographed meter faults in areas without connectivity. The design deploys a fine-tuned Phi model to the mobile device for on-device classification, syncs results to Dataverse when online, and reserves the cloud frontier model for the back-office agent that drafts work orders from the aggregated data.',
      takeaway: 'SLMs fit narrow, high-volume or offline tasks; keep frontier models for broad reasoning.',
    },
    {
      title: 'Model router adopted without a baseline (a realistic mistake)',
      description:
        'A team swaps its customer-service agent to model router in Cost mode to save money. Complaints rise because long multi-document prompts fail: the smallest model in the pool has a shorter context window, and some nuanced answers degraded. The fix is to define a model subset with adequate context, switch to Balanced mode, and re-run the agent evaluation suite against the previous single-model baseline before redeploying.',
      takeaway: 'Evaluate model router against your baseline with the same test set, and constrain the subset so context and quality limits hold.',
    },
    {
      title: 'A prompt library that survives model updates',
      description:
        'A retailer keeps 40 reusable prompts in Copilot Studio for returns, product descriptions and supplier emails. Each prompt lives in a solution with an owner, a documented output schema and a 25-case batch test. When Copilot Studio announces a new default model, the CoE runs all batch tests during the 30-day retention window; two prompts drop below the 90% accuracy threshold and are revised before the switch.',
      language: 'text',
      code: `Prompt record (library standard)
  Name:        Returns-Reason-Classifier v3
  Owner:       Customer Care CoE
  Inputs:      {customer_message: text}
  Output:      JSON {reason: enum[damaged|late|wrong_item|other], confidence: 0-1}
  Model:       GPT Chat Latest (pinned 2026-10), temperature low
  Knowledge:   Returns policy (SharePoint, current folder only)
  Test set:    25 cases, threshold 90% accuracy (batch test)
  Last run:    94% pass, 2026-11-03`,
      takeaway: 'Treat prompts as versioned, owned, tested assets distributed through solutions.',
    },
  ],
  keyPoints: [
    'Default to prompting plus grounding; move to fine-tuning or trained models only when evaluation shows persistent gaps in format, domain behaviour, tool use, cost or latency.',
    'Foundry fine-tuning offers SFT, preference (DPO) and reinforcement fine-tuning via Managed or Programmed Training; it does not replace retrieval for current facts or safety controls.',
    'AI Builder provides low-code custom models (prediction, document processing, classification, extraction, object detection) and prebuilt models for Power Platform and Copilot Studio.',
    'SLMs such as Phi suit edge and on-device inference, narrow high-volume tasks, residency constraints and sub-agents; frontier models suit broad reasoning.',
    'Model router routes each request to the most suitable model in Balanced, Cost or Quality mode, honours data zones, supports a model subset, and must be evaluated against your baseline.',
    'The effective context window of model router is limited by the smallest model in its pool; constrain the subset accordingly.',
    'Prompt elements for users: goal, context, source, expectations; builders add delimiters, few-shot examples, structured output, grounding and refusal behaviour, and pin model versions.',
    'A governed prompt library has owners, descriptions, input/output schemas, batch tests with accuracy thresholds, solution-based distribution and a review cadence tied to model changes.',
  ],
  flashcards: [
    { front: 'What is the default order of model strategy escalation?', back: 'Prompt engineering, then grounding (RAG), then fine-tuning or custom-trained models, each justified by evaluation evidence.' },
    { front: 'Name the three fine-tuning approaches available in Microsoft Foundry.', back: 'Supervised fine-tuning, preference fine-tuning (DPO) and reinforcement fine-tuning (RFT).' },
    { front: 'Does fine-tuning remove the need for retrieval?', back: 'No. Fine-tuning changes behaviour and style; retrieval is still needed for current information, and safety controls remain application-level.' },
    { front: 'Give three use cases for small language models.', back: 'On-device or edge inference, high-volume narrow tasks (classification, extraction), and residency-constrained or sub-agent workloads.' },
    { front: 'What are model router\'s three routing modes?', back: 'Balanced (default, small quality band, cheapest), Cost (wider band), Quality (best model regardless of cost).' },
    { front: 'What limits model router\'s context window?', back: 'The smallest underlying model in the pool; use a model subset to control it.' },
    { front: 'Which low-code tool provides custom prediction and document-processing models for Power Platform?', back: 'AI Builder, accessed through the AI hub in Power Apps or Power Automate.' },
    { front: 'Microsoft\'s four elements of an effective Copilot prompt?', back: 'Goal, context, source and expectations.' },
    { front: 'How do you validate a reusable Copilot Studio prompt?', back: 'Batch testing in the Test hub against a dataset with expected results, producing an accuracy score to compare over time.' },
    { front: 'How are reusable prompts moved between environments?', back: 'Distributed in Power Platform solutions alongside the agents and flows that use them.' },
    { front: 'How long can a Copilot Studio agent stay on its current model after a default-model upgrade?', back: 'Up to 30 days, to test and migrate.' },
  ],
  quiz: [
    {
      question:
        'A claims team needs responses in a rigid JSON schema with domain codes that a foundation model gets wrong 20% of the time even with ten few-shot examples, which also make every call expensive. You have 5,000 labelled historical examples. What should you recommend?',
      options: [
        'Switch to classic orchestration in Copilot Studio',
        'Fine-tune a Foundry model with supervised fine-tuning and evaluate on a held-out set',
        'Add more public websites as knowledge',
        'Enable model router in Quality mode',
      ],
      correct: [1],
      explanation:
        'Persistent schema and domain errors with high prompt overhead and ample labelled data are the textbook case for fine-tuning. Orchestration mode and extra knowledge do not change output discipline, and model router optimises cost and quality across general models rather than teaching domain codes.',
    },
    {
      question:
        'Field technicians must classify equipment photos while offline, and results are later synced to Dataverse. Which model choice is MOST appropriate?',
      options: [
        'A frontier model via Foundry Agent Service',
        'A small language or vision model deployed on the device',
        'Model router in Cost mode',
        'The Analyst agent in Microsoft 365 Copilot',
      ],
      correct: [1],
      explanation:
        'Offline, narrow classification is the SLM/on-device use case. Cloud options (frontier models, model router, Microsoft 365 agents) require connectivity.',
    },
    {
      question:
        'After moving an agent to model router in Cost mode, long prompts start failing and quality drops. Which TWO actions should the architect take? (Select two)',
      options: [
        'Define a model subset whose smallest model has adequate context, and switch to Balanced mode',
        'Re-run the agent evaluation suite against the previous single-model baseline before redeploying',
        'Disable content filters to reduce latency',
        'Replace the router with the cheapest single model',
      ],
      correct: [0, 1],
      explanation:
        'Context is bounded by the smallest model and Cost mode widens the quality band, so constrain the subset and rebalance, then prove the change against a baseline. Disabling safety controls is never the answer, and the cheapest single model would worsen quality.',
    },
    {
      question:
        'An organisation wants to standardise how employees prompt Microsoft 365 Copilot. Which guidance set should the architect publish?',
      options: [
        'Use one-word prompts to reduce token cost',
        'State the goal, provide context, reference the source, and set expectations for format and tone, then iterate',
        'Always disable web grounding',
        'Paste the full document text into the prompt instead of referencing it',
      ],
      correct: [1],
      explanation:
        'Goal, context, source and expectations are Microsoft\'s prompt elements. One-word prompts lose context, disabling web grounding is a situational choice, and pasting documents ignores Copilot\'s grounding and may leak data.',
    },
    {
      question:
        'A reusable Copilot Studio prompt used by three agents must be protected against regressions when the default model changes. What is the MOST appropriate control?',
      options: [
        'Hard-code the model name in agent instructions',
        'Maintain a batch-test dataset with an accuracy threshold in the Test hub and run it before accepting the model change',
        'Ask users to report wrong answers after the change',
        'Store the prompt text in a SharePoint document',
      ],
      correct: [1],
      explanation:
        'Batch testing gives an objective, repeatable gate. Instructions cannot pin models, user reports are reactive, and a document is not a test.',
    },
    {
      question:
        'A finance team wants to predict which supplier invoices will be paid late using five years of Dataverse history, without writing code. Which option fits?',
      options: [
        'An AI Builder custom prediction model',
        'A generative orchestration agent with deep reasoning',
        'Model router in Balanced mode',
        'A declarative agent in Agent Builder',
      ],
      correct: [0],
      explanation:
        'A deterministic prediction on structured historical data is a classic AI Builder prediction model. Generative agents, routing and declarative agents do not train predictive classifiers.',
    },
  ],
  statements: [
    { text: 'Fine-tuning a model in Foundry removes the need for retrieval-augmented generation for up-to-date information.', isTrue: false, explanation: 'Fine-tuning changes behaviour; current facts still require retrieval.' },
    { text: 'Phi models in the Foundry catalog include small variants intended for on-device and edge inference.', isTrue: true, explanation: 'The catalog lists 1B and 3B base and instruct SLMs for edge scenarios.' },
    { text: 'Model router stores prompts to improve future routing decisions.', isTrue: false, explanation: 'Model router does not store your prompts.' },
    { text: 'In Balanced mode, model router picks the most cost-effective model within a small quality band of the best model.', isTrue: true, explanation: 'Balanced uses roughly a 1 to 2% quality band; Cost widens it; Quality ignores cost.' },
    { text: 'Prompt instructions alone are a sufficient security boundary against prompt injection.', isTrue: false, explanation: 'Instructions must be paired with Prompt Shields, content filters and application controls.' },
    { text: 'Copilot Studio prompts created with the prompt builder can be distributed between environments in solutions.', isTrue: true, explanation: 'Solutions carry prompts with agents and flows through ALM.' },
    { text: 'AI Builder prebuilt models require you to supply training data before use.', isTrue: false, explanation: 'Prebuilt models are ready to use; custom models need training on your data.' },
  ],
  resources: [
    { label: 'Model router for Microsoft Foundry (concepts)', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-router' },
    { label: 'Fine-tuning overview in Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/foundry/fine-tuning/overview' },
    { label: 'Prompts overview in Copilot Studio (prompt builder)', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/prompts-overview' },
    { label: 'Prompt engineering techniques (Azure OpenAI in Foundry)', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering' },
  ],
};
