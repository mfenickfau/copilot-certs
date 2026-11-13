import type { Concept } from '../../types';

export const genaiEvaluationAndSafety: Concept = {
  id: 'genai-evaluation-and-safety',
  title: 'Evaluating Generative AI: Test Datasets, Quality Evaluators, Safety Evaluations, Red Teaming and Automation',
  summary:
    'How quality assurance works for LLM applications and agents in Microsoft Foundry: building JSONL test datasets and mapping their fields to evaluators, measuring groundedness, relevance, coherence and fluency with AI-assisted judges, running risk and safety evaluations and the AI Red Teaming Agent, writing custom evaluators, and wiring evaluations into CI/CD and continuous evaluation.',
  certs: ['ai-300', 'ai-103'],
  domains: ['ai-300-4', 'ai-103-2'],
  outcomes: ['ai-300-4-1-1', 'ai-300-4-1-2', 'ai-300-4-1-3', 'ai-300-4-1-4', 'ai-103-2-1-4'],
  tags: ['evaluation', 'evaluators', 'groundedness', 'relevance', 'content-safety', 'red-teaming', 'custom-evaluators', 'ci-cd', 'foundry'],
  difficulty: 'intermediate',
  diagram: 'eval-loop',
  sections: [
    {
      heading: 'Test datasets and data mapping',
      body: `Evaluation starts with a **test dataset**: a JSONL file where each line is one test item. The fields depend on what you measure:

- \`query\` – the input to your application.
- \`response\` – what the application produced (present when you evaluate stored outputs; generated at run time when you evaluate a **model or agent target**).
- \`context\` – the retrieved grounding passages, concatenated into one string (needed for groundedness and retrieval metrics).
- \`ground_truth\` – the expected answer (needed for similarity, F1, response completeness and document retrieval).
- Multi-turn items use a \`messages\` array or a \`conversation\` object; agent items may include \`tool_calls\` and \`tool_definitions\`.

Datasets come from real logs (sanitised), hand-written edge cases, and **synthetic generation** (the SDK's Simulator can produce query-response pairs from documents or an index, and adversarial simulators produce attack prompts). Register the dataset in the project so runs are reproducible and comparable.

**Data mapping** binds dataset fields to evaluator inputs using the \`{{item.<field>}}\` syntax; when a model or agent generates the response during the run, map \`{{sample.output_text}}\` (text) or \`{{sample.output_items}}\` (agent output). Each evaluator documents its required inputs: groundedness needs response and context (query optional), relevance needs query and response, response completeness needs response and ground truth, document retrieval needs \`retrieval_ground_truth\` and \`retrieved_documents\`. A mapping that omits a required field is the most common cause of a failed evaluation run.`,
    },
    {
      heading: 'Quality evaluators: groundedness, relevance, coherence, fluency and more',
      body: `Foundry ships a catalog of **built-in evaluators**. The AI-assisted ones use a **judge model** you specify (\`deployment_name\`) and return a score, a pass/fail against a threshold and a reason.

| Category | Evaluators | What they answer |
|---|---|---|
| General quality | **Coherence**, **Fluency**, QA (composite) | Is the answer logically organised and well written? |
| RAG | **Groundedness** (bring-your-own judge), **Groundedness Pro** (Azure AI Content Safety service), **Relevance**, **Retrieval**, **Document Retrieval**, **Response Completeness** | Does the answer stay inside the context (precision), address the query, and cover the ground truth (recall)? Were the right chunks retrieved? |
| Textual similarity (deterministic) | Similarity, F1, BLEU, GLEU, ROUGE, METEOR | How close is the answer to the ground truth? |
| Agentic | **Intent Resolution**, **Tool Call Accuracy**, **Task Adherence** | Did the agent understand, pick the right tools with the right arguments, and follow the task? |
| Azure OpenAI graders | Label, string check, text similarity, general grader | Rubric- and template-based scoring |

Scores are mostly 1 to 5 with a default pass threshold of 3; document retrieval returns NDCG, XDCG, fidelity, max relevance and "holes" and requires relevance labels (qrels). Groundedness measures the **precision** side (nothing invented), response completeness the **recall** side (nothing critical missed). Judge-model evaluators consume tokens and need the Foundry User role plus a chat deployment; deterministic metrics are free and fast but need ground truth. Pick the evaluator that matches the failure you fear: hallucination (groundedness), off-topic answers (relevance), wrong tool (tool call accuracy), missing facts (response completeness).`,
    },
    {
      heading: 'Risk and safety evaluations and the AI Red Teaming Agent',
      body: `**Risk and safety evaluators** run on Microsoft-hosted safety models in the Foundry evaluation service; they need the project but **no judge deployment**. Each returns a severity and the run reports a **defect rate** (percentage of items flagged).

- Content harms: **violence**, **sexual**, **self-harm**, **hate and unfairness** (also combined as Content Safety).
- **Protected material** (copyrighted text), **code vulnerability**, **ungrounded attributes** (inferring personal attributes without evidence).
- **Indirect attack (XPIA)**: did the model follow instructions hidden in retrieved documents?
- Agent-only (preview): **prohibited actions** (did the agent violate its policy or call disallowed tools) and **sensitive data leakage**.

These complement, rather than replace, **content filters and guardrails** at inference time: evaluations tell you how often harmful content gets through on a test set; filters block it per request in production.

The **AI Red Teaming Agent** automates adversarial testing. Built on Microsoft's open-source **PyRIT**, it takes seed prompts per risk category, applies **attack strategies** (encoding, character flipping, role-play, multi-step jailbreaks) to evade safety alignment, sends them to your model, agent or endpoint, scores responses with the safety evaluators and reports an **Attack Success Rate (ASR)** per category and strategy. Run it at model selection, before deployment and on a schedule after deployment; cloud runs redact harmful inputs from results, target agents transiently, and are limited to specific regions. Red teaming finds vulnerabilities; it is still used with human reviewers and is not a substitute for production guardrails.`,
    },
    {
      heading: 'Custom evaluators and automated evaluation workflows',
      body: `When a built-in metric does not capture your requirement (brand tone, mandatory disclaimer, schema compliance), write a **custom evaluator**:

- **Code-based**: a Python \`grade(sample, item) -> float\` function returning 0.0 to 1.0, run in a sandbox (no network, two-minute limit, common packages such as numpy, pandas, rapidfuzz available). Good for format checks and keyword rules.
- **Prompt-based**: a judge prompt with \`{{placeholders}}\` returning a JSON \`result\` and \`reason\`, scored ordinal (1 to 5), continuous or binary.
- **Endpoint-based**: an HTTP endpoint you host that returns the standard result schema, for proprietary scorers.

Register custom evaluators in the project catalog and use them in runs next to built-ins.

**Automation** has three layers:

1. **Local evaluation** during development with the \`azure-ai-evaluation\` package (\`evaluate()\` over a JSONL file with evaluator instances).
2. **Cloud evaluation** from CI/CD with the Foundry SDK (\`azure-ai-projects\` 2.x): \`openai_client.evals.create(...)\` with \`testing_criteria\` of type \`azure_ai_evaluator\`, then \`evals.runs.create(...)\` with a dataset or a model/agent target; poll the run and fail the pipeline when a pass rate drops below the threshold. Results are stored in the project and visible in the portal.
3. **Continuous evaluation** in production: sample live agent traces at a configured rate and score them with quality and safety evaluators; combine with **scheduled evaluations** on a fixed dataset to detect drift and **scheduled red teaming**, with Azure Monitor alerts on threshold breaches.

\`\`\`python
criteria = [{"type": "azure_ai_evaluator", "name": "groundedness", "evaluator_name": "builtin.groundedness",
             "initialization_parameters": {"deployment_name": judge},
             "data_mapping": {"query": "{{item.query}}", "context": "{{item.context}}", "response": "{{item.response}}"}},
            {"type": "azure_ai_evaluator", "name": "violence", "evaluator_name": "builtin.violence",
             "data_mapping": {"query": "{{item.query}}", "response": "{{item.response}}"}}]
ev = oai.evals.create(name="assistant-pr-check", data_source_config={"type": "custom", "item_schema": {"type": "object"}, "include_sample_schema": True}, testing_criteria=criteria)
run = oai.evals.runs.create(eval_id=ev.id, name="pr-412", data_source={"type": "jsonl", "source": {"type": "file_id", "id": file_id}})
\`\`\`

The exam frames this as "automated evaluation workflows by using built-in and custom evaluation metrics": the answer combines a registered dataset, a mix of built-in and custom evaluators, a CI job that blocks on thresholds, and continuous evaluation after release.`,
    },
  ],
  examples: [
    {
      title: 'A RAG test dataset with mapping for three evaluators',
      description:
        'The team assembles 250 JSONL items from sanitised support logs plus 50 hand-written edge cases. Each has query, retrieved context and, for 120 items, a ground truth written by support leads. Groundedness and relevance run on all items; response completeness only on the labelled subset.',
      language: 'json',
      code: `{"query": "Can I return a gift without a receipt?", "context": "Items can be returned within 30 days with original receipt for full refund.\\n\\nGift items are eligible for store credit only.", "response": "Gift items can be returned for store credit; a receipt is needed for a cash refund.", "ground_truth": "Gifts are eligible for store credit only."}
{"query": "What are the store hours on Sunday?", "context": "Our store is open Monday-Friday 9am-6pm and Saturday 10am-4pm.", "response": "The store is closed on Sunday.", "ground_truth": "The store is not open on Sunday."}`,
      takeaway: 'Include context for groundedness and ground truth where you can; evaluators are only as good as the fields you give them.',
    },
    {
      title: 'Custom code-based evaluator for a mandatory disclaimer',
      description:
        'Regulation requires every answer about fees to end with a disclaimer. A code-based evaluator checks the response ends with the approved sentence and that no competitor name appears, returning 1.0, 0.5 or 0.0. It runs alongside groundedness in the same evaluation.',
      language: 'python',
      code: `def grade(sample: dict, item: dict) -> float:
    """1.0 = disclaimer present and no competitor names; 0.5 = disclaimer only; 0.0 otherwise."""
    response = item.get("response") or item.get("sample", {}).get("output_text", "")
    if not response:
        return 0.0
    has_disclaimer = response.strip().endswith("Fees are subject to change; see the current fee schedule.")
    mentions_competitor = any(name in response for name in ("Fabrikam Bank", "Northwind Finance"))
    if has_disclaimer and not mentions_competitor:
        return 1.0
    return 0.5 if has_disclaimer else 0.0`,
      takeaway: 'Deterministic custom evaluators encode business rules cheaply; keep them defensive because exceptions score the item as 0 and an error.',
    },
    {
      title: 'Groundedness looked fine but users saw hallucinations (a realistic mistake and the fix)',
      description:
        'A team evaluated groundedness with a dataset whose context field held the ideal passage, not what the retriever actually returned. Scores were high, yet production answers invented facts because retrieval often missed. The fix was to regenerate the dataset by capturing the real retrieved chunks, add the Retrieval evaluator to measure retrieval quality separately, and turn on continuous evaluation so sampled production traces are scored with the same evaluators.',
      language: 'python',
      code: `# capture what the app really used, then evaluate that
row = {"query": q, "context": "\\n\\n".join(chunk.text for chunk in retrieved), "response": answer}
criteria = [
  {"type": "azure_ai_evaluator", "name": "retrieval", "evaluator_name": "builtin.retrieval",
   "initialization_parameters": {"deployment_name": judge}, "data_mapping": {"query": "{{item.query}}", "context": "{{item.context}}"}},
  {"type": "azure_ai_evaluator", "name": "groundedness", "evaluator_name": "builtin.groundedness",
   "initialization_parameters": {"deployment_name": judge}, "data_mapping": {"query": "{{item.query}}", "context": "{{item.context}}", "response": "{{item.response}}"}},
]`,
      takeaway: 'Evaluate the system you ship: real retrieved context, retrieval scored on its own, and production samples, not curated inputs.',
    },
  ],
  keyPoints: [
    'Test datasets are JSONL with query, response, context, ground_truth (and messages or tool_calls for conversations and agents); register them in the project for reproducibility.',
    'Data mapping uses {{item.field}} for dataset columns and {{sample.output_text}} or {{sample.output_items}} for responses generated by a model or agent target.',
    'Groundedness = precision against context; Response Completeness = recall against ground truth; Relevance = addresses the query; Coherence and Fluency = writing quality; Retrieval and Document Retrieval score the retriever.',
    'AI-assisted evaluators need a judge deployment_name; risk and safety evaluators run on Microsoft-hosted models and report a defect rate.',
    'Safety categories: violence, sexual, self-harm, hate/unfairness, protected material, code vulnerability, ungrounded attributes, indirect attack; agent-only prohibited actions and sensitive data leakage.',
    'The AI Red Teaming Agent (PyRIT-based) applies attack strategies and reports Attack Success Rate; use it before deployment and on a schedule, with human review.',
    'Custom evaluators are code-based (grade() returning 0-1), prompt-based (LLM judge with result and reason) or endpoint-based.',
    'Automate with the Foundry SDK: evals.create with testing_criteria, evals.runs.create against a dataset or target, fail CI on thresholds, then continuous and scheduled evaluation in production.',
  ],
  flashcards: [
    { front: 'Which dataset fields does the Groundedness evaluator use?', back: 'response and context (query optional); it measures whether the response stays within the context.' },
    { front: 'Which evaluator measures the recall side of a RAG answer against ground truth?', back: 'Response Completeness.' },
    { front: 'What is the data mapping syntax for a field in your dataset and for a generated response?', back: '{{item.<field>}} for dataset fields; {{sample.output_text}} (or {{sample.output_items}} for agents) for responses generated during the run.' },
    { front: 'Do risk and safety evaluators require a judge model deployment?', back: 'No. They run on hosted safety models in the Foundry evaluation service and only need the project.' },
    { front: 'What does the Indirect Attack (XPIA) evaluator measure?', back: 'Whether the response followed jailbreak instructions injected through documents or other context (cross-domain prompt injection).' },
    { front: 'What metric does the AI Red Teaming Agent report?', back: 'Attack Success Rate (ASR) per risk category and attack strategy.' },
    { front: 'Which open-source framework underpins the AI Red Teaming Agent?', back: 'PyRIT (Python Risk Identification Tool).' },
    { front: 'What must a code-based custom evaluator return?', back: 'A float between 0.0 and 1.0 from a grade(sample, item) function; exceptions score 0.0 and mark the item as an error.' },
    { front: 'Which three agent-specific quality evaluators exist?', back: 'Intent Resolution, Tool Call Accuracy and Task Adherence.' },
    { front: 'What is continuous evaluation in Foundry?', back: 'Scoring a sampled share of live production agent traces with quality and safety evaluators, with alerts on threshold breaches.' },
    { front: 'Which Document Retrieval metrics require relevance labels?', back: 'NDCG, XDCG, fidelity, max relevance and holes, computed from retrieval_ground_truth (qrels) and retrieved_documents.' },
  ],
  quiz: [
    {
      question:
        'Users report that a RAG assistant invents policy details. Which evaluator most directly measures this failure, and what dataset fields does it need?',
      options: [
        'Fluency, needing query and response',
        'Groundedness, needing response and the retrieved context',
        'Coherence, needing response only',
        'BLEU, needing response and ground truth',
      ],
      correct: [1],
      explanation:
        'Groundedness checks whether the response is supported by the context. Fluency and coherence measure writing quality, and BLEU measures lexical overlap with a reference, not fabrication.',
    },
    {
      question:
        'You evaluate stored responses for harmful content in a region where the Foundry evaluation service is supported. Which TWO statements are correct about risk and safety evaluators? (Select two)',
      options: [
        'They require a deployment_name for a judge model',
        'They run on Microsoft-hosted safety models and report a defect rate',
        'They include categories such as violence, self-harm and protected material',
        'They replace inference-time content filters',
      ],
      correct: [1, 2],
      explanation:
        'Safety evaluators use hosted models (no judge deployment) and cover those categories. They measure risk on a dataset; content filters still block harmful output per request in production.',
    },
    {
      question:
        'Before releasing an agent, security wants to know how often adversarial prompts using encodings and role-play bypass its safety behaviour. Which tool should you use?',
      options: [
        'The Relevance evaluator on the regression dataset',
        'The AI Red Teaming Agent with multiple attack strategies, reviewing Attack Success Rate',
        'Azure Monitor metric alerts on token usage',
        'A prompt-based custom evaluator for tone',
      ],
      correct: [1],
      explanation:
        'The Red Teaming Agent automates adversarial probing and reports ASR. Relevance and tone evaluators measure quality, and token alerts measure cost.',
    },
    {
      question:
        'Every answer about pricing must end with a specific legal sentence. Which evaluator type is the most appropriate and economical way to enforce this in the evaluation suite?',
      options: [
        'A prompt-based evaluator asking a judge model whether the tone is professional',
        'A code-based custom evaluator whose grade() function checks the response ending',
        'The Similarity evaluator against the legal sentence',
        'Groundedness Pro',
      ],
      correct: [1],
      explanation:
        'A deterministic code check is exact and free of judge-model cost. Tone judgement and similarity are approximate, and Groundedness Pro measures context consistency.',
    },
    {
      question:
        'A team wants pull requests that change prompts or retrieval settings to be blocked when quality drops. Which approach implements this?',
      options: [
        'Ask reviewers to test the change in the playground',
        'A CI job that creates a cloud evaluation run with built-in and custom evaluators on the registered test dataset and fails when pass rates fall below thresholds',
        'Enable content filters on the deployment',
        'Schedule a weekly red teaming run',
      ],
      correct: [1],
      explanation:
        'Automated evaluation in CI is the quality gate. Playground tests are manual, content filters address safety at inference, and weekly red teaming runs after the fact.',
    },
    {
      question:
        'Groundedness scores in offline evaluation are high, yet production users see hallucinations. What is the most likely flaw in the evaluation design?',
      options: [
        'The judge model deployment is too small',
        'The dataset context field contained ideal passages rather than the chunks the retriever actually returned, so retrieval failures were never measured',
        'Fluency was not included',
        'The pass threshold was set to 3',
      ],
      correct: [1],
      explanation:
        'Evaluating with curated context hides retrieval misses. Add the Retrieval evaluator with real retrieved chunks and continuous evaluation of production traces. Judge size, fluency and the default threshold do not explain the gap.',
    },
  ],
  statements: [
    { text: 'The Relevance evaluator requires a ground_truth field.', isTrue: false, explanation: 'Relevance needs only query and response; ground truth is required by similarity, F1 and response completeness.' },
    { text: 'Groundedness Pro uses the Azure AI Content Safety service rather than a judge model you deploy.', isTrue: true, explanation: 'Groundedness Pro returns a strict true/false consistency check from the service.' },
    { text: 'The AI Red Teaming Agent reports an Attack Success Rate per risk category and attack strategy.', isTrue: true, explanation: 'ASR is the key metric of a red teaming scan.' },
    { text: 'Code-based custom evaluators can call external APIs during grading.', isTrue: false, explanation: 'They run in a sandbox without network access; use an endpoint-based evaluator for that.' },
    { text: 'Continuous evaluation scores a sampled share of production traces rather than every request.', isTrue: true, explanation: 'Sampling controls cost while detecting quality and safety regressions.' },
    { text: 'If a required field is missing from the data mapping, the evaluator silently scores the item as passing.', isTrue: false, explanation: 'Missing required inputs cause the evaluation to fail or error for those items.' },
  ],
  resources: [
    { label: 'Observability in generative AI (Microsoft Foundry)', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/observability' },
    { label: 'Retrieval-Augmented Generation (RAG) evaluators', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/evaluation-evaluators/rag-evaluators' },
    { label: 'Risk and safety evaluators', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/evaluation-evaluators/risk-safety-evaluators' },
    { label: 'AI Red Teaming Agent', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/ai-red-teaming-agent' },
  ],
};
