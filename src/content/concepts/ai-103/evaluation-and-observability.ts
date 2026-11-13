import type { Concept } from '../../types';

export const evaluationAndObservability: Concept = {
  id: 'evaluation-and-observability',
  title: 'Evaluating Models, Apps and Agents, and Setting Up Observability',
  summary:
    'How to measure generative quality and safety with Foundry evaluators (RAG, quality, safety, agent and rubric evaluators), run cloud evaluations and agent evaluations from the SDK, detect fabrications with groundedness checks, build reflection and self-critique loops, perform error analysis on agent runs, and set up observability with OpenTelemetry tracing, token analytics, safety signals, latency breakdowns and continuous evaluation in production.',
  certs: ['ai-103'],
  domains: ['ai-103-2'],
  outcomes: ['ai-103-2-1-4', 'ai-103-2-2-6', 'ai-103-2-3-2', 'ai-103-2-3-3'],
  tags: ['evaluation', 'evaluators', 'groundedness', 'agent-evaluators', 'red-teaming', 'tracing', 'opentelemetry', 'application-insights', 'observability', 'python', 'advanced'],
  difficulty: 'advanced',
  diagram: 'eval-loop',
  sections: [
    {
      heading: 'What to measure: the evaluator catalog',
      body: `Foundry treats evaluation as a lifecycle activity: establish a baseline before release, gate changes in CI, and keep scoring production traffic. The **built-in evaluators** fall into families you should be able to name and match to a question:

- **RAG evaluators**: *Retrieval* and *Document Retrieval* (did we fetch the right chunks; the latter needs labelled relevance judgements), *Groundedness* (1 to 5, is the answer supported by the context; the classic fabrication detector), *Groundedness Pro* (binary, uses Content Safety, no judge model), *Relevance*, *Response Completeness*.
- **General purpose**: *Coherence*, *Fluency*. **Textual similarity**: *Similarity*, *F1*, *BLEU*, *GLEU*, *ROUGE*, *METEOR* against ground truth.
- **Risk and safety**: Hate and Unfairness, Sexual, Violence, Self-Harm (0 to 7 severity, pass threshold default 3, aggregate *defect rate*), Protected Materials, Indirect Attack (XPIA), Code Vulnerability, Ungrounded Attributes, Prohibited Actions, Sensitive Data Leakage. These run in the hosted evaluation service and need no judge deployment.
- **Agent evaluators**: *Intent Resolution*, *Task Adherence*, *Task Completion*, *Tool Call Accuracy*, *Tool Selection*, *Tool Input Accuracy*, *Tool Output Utilization*, *Tool Call Success*, *Task Navigation Efficiency*, *Customer Satisfaction*, and batched *Output Quality* and *Tool Use Quality* graders. They behave like unit tests: pass/fail per turn, with conversation-level evaluation for multi-turn outcomes.
- **Rubric evaluators** (weighted custom criteria judged by an LLM, can be generated from an agent's instructions and tools), **Azure OpenAI graders** (label model, string check, text similarity, score model) and **custom evaluators** (code or prompt based).

Microsoft's recommended bundles: RAG apps = Retrieval + Groundedness + Relevance + content safety; agents = Output Quality + Tool Use Quality + Rubric + content safety. LLM-judge evaluators take a \`deployment_name\` for the judge model (a strong model such as gpt-5-mini or better) and a \`threshold\`; scores at or above the threshold pass. Data arrives as JSONL with \`query\`, \`response\`, optional \`context\`, \`ground_truth\`, \`tool_definitions\`, or as a \`messages\` array for conversations.`,
    },
    {
      heading: 'Running evaluations: local SDK, cloud evaluation and agent evaluation',
      body: `Three execution modes exist.

**Local, with azure-ai-evaluation** (classic SDK, still common in samples): instantiate evaluators such as \`GroundednessEvaluator(model_config)\` or \`ContentSafetyEvaluator(credential, azure_ai_project)\`, call them on single rows, or run \`evaluate(data="test.jsonl", evaluators={...}, evaluator_config={...column mapping...}, azure_ai_project=...)\` to score a dataset and log results to the project.

**Cloud evaluation with azure-ai-projects 2.x**: use the project's OpenAI client **evals** API. Define a \`data_source_config\` (item schema), \`testing_criteria\` as \`TestingCriterionAzureAIEvaluator(evaluator_name="builtin.groundedness", initialization_parameters={"deployment_name": ...}, data_mapping={"query": "{{item.query}}", ...})\`, create the eval with \`openai_client.evals.create(...)\`, upload a dataset file, start a run with \`evals.runs.create(eval_id, data_source=...)\`, poll, and read per-item scores. Targets can be a dataset, a model, or an agent that generates the responses; conversations can be simulated. Results live in the project (Build > Evaluations) and can be pushed to Application Insights.

**Agent evaluation**: the recommended primary measure is a **rubric** generated from the agent's context (name, instructions, tools) with \`EvaluatorGenerationInputs(... sources=[AgentEvaluatorGenerationJobSource(agent_name=...)])\`, paired with agent, quality and safety evaluators. Run against a test dataset of queries; the service invokes the agent, scores turns and conversations, and reports pass rates you can turn into acceptance thresholds (for example 85% task adherence).

Supporting tooling: **synthetic dataset generation** and **convert traces to datasets** (turn real production conversations into test cases), the **evaluation GitHub Action / Azure DevOps task** for CI gates with statistical significance, **cluster analysis** to group failures by root cause, **human evaluation** for labelling, and the **AI Red Teaming Agent** for adversarial safety scans (Attack Success Rate). Evaluations require Entra ID and the Foundry User role, and some features (safety evaluators, rubric generation) are region-limited.`,
    },
    {
      heading: 'Fabrications, reflection, chain-of-thought checks and error analysis',
      body: `**Detecting fabrications**: Groundedness (score plus reason) and Groundedness Pro (binary) compare claims with the supplied context; Ungrounded Attributes catches invented facts about people; Protected Materials catches regurgitation. Pair with Relevance, because a grounded answer can still miss the question. At runtime, the (retiring) groundedness detection filter or your own critic call can check before display.

**Reflection and self-critique loops** make evaluation part of generation: draft, critique (a second call with a rubric, or an evaluator), revise, stop at threshold or iteration cap. Variants: *LLM-as-judge with reasons* fed back to the generator; *chain-of-thought evaluation* where a judge reads the reasoning trace or the sequence of tool calls (Task Navigation Efficiency, Tool Call Accuracy) rather than only the final answer; *verifier* steps using deterministic checks (code tests in code interpreter, schema validation). Keep the critic independent (different prompt or model) to avoid grading its own homework, and log critic scores as telemetry so you can see drift.

**Error analysis for agents** follows a loop: (1) pull failing runs from traces or evaluation results; (2) classify failures: wrong intent, wrong tool selected, bad tool arguments, tool error, ignored tool output, hallucinated answer, guardrail block, timeout; (3) cluster them (Foundry cluster analysis or by hand); (4) fix the most common class first: instructions and tool descriptions for selection errors, strict schemas for argument errors, retries and idempotency for tool failures, better retrieval for groundedness; (5) convert the failing cases into a regression dataset and re-run. The **agent optimizer** (preview) automates part of this by proposing instruction and tool improvements from evaluation data. Save every fix as a new agent version so you can compare versions side by side (setup, chat output and YAML diff) and roll back.`,
    },
    {
      heading: 'Observability: tracing, token analytics, safety signals, latency',
      body: `Foundry observability is built on **OpenTelemetry** with GenAI semantic conventions and stores data in **Application Insights** connected to the project.

- **Tracing**: once App Insights is connected (Build > Agents > Traces > Connect, or Project details > Connected resources), **server-side traces** for prompt agents, hosted agents and workflows appear automatically for 90 days with spans for model calls, tool calls, arguments, results, token counts and durations; you can replay traces and open the full conversation (inputs, outputs, run steps). **Client-side tracing** instruments your own code: \`pip install azure-ai-projects opentelemetry-sdk azure-core-tracing-opentelemetry\`, configure \`azure-monitor-opentelemetry\` with the App Insights connection string, enable content recording only when privacy allows. Agent Framework, LangChain, LangGraph and the OpenAI Agents SDK emit compatible spans, and multi-agent conventions capture agent-to-agent handoffs. Local development can use the VS Code Foundry Toolkit collector and Agent Inspector.
- **Token analytics**: \`usage\` on every response (input, output, cached, reasoning tokens), the *Processed Prompt Tokens* and *Generated Completion Tokens* Azure Monitor metrics, the Agent Monitoring Dashboard token card, Cost Management meters; alert on spikes.
- **Safety signals**: content-filter and Prompt Shields annotations on responses, blocked-request counts, continuous safety evaluator scores, red-team scan outcomes, Defender and Purview alerts in Foundry Control Plane.
- **Latency breakdowns**: span durations isolate model time from tool time from retrieval time; *Time to Response* (time to first token) versus total time; streaming improves perceived latency; capacity pressure shows as rising latency without rising tokens (watch provisioned utilization and 429s).
- **Continuous evaluation and alerts**: recurring evaluations on sampled production traffic (set up in the portal or with the SDK; the project managed identity needs Foundry User), red-team schedules, and alerts on latency, token usage, evaluation scores or safety findings. End-user feedback can be logged to App Insights and joined to traces.

Privacy: traces capture prompts, outputs and tool arguments; redact secrets and personal data, restrict access with Log Analytics Reader (and Privileged Monitoring Data Reader for protected tables), and set retention deliberately.`,
    },
  ],
  examples: [
    {
      title: 'Cloud evaluation of a RAG dataset with groundedness and relevance',
      description:
        'The team uploads a JSONL file of question, retrieved context and answer rows, then creates an evaluation with Groundedness and Relevance judged by gpt-5-mini and a safety evaluator that needs no judge model.',
      language: 'python',
      code: `from azure.ai.projects.models import TestingCriterionAzureAIEvaluator
from openai.types.eval_create_params import DataSourceConfigCustom
from openai.types.evals.create_eval_jsonl_run_data_source_param import (
    CreateEvalJSONLRunDataSourceParam, SourceFileID)

openai_client = project_client.get_openai_client()
data_source_config = DataSourceConfigCustom(type="custom", include_sample_schema=True,
    item_schema={"type": "object", "properties": {"query": {"type": "string"},
                 "context": {"type": "string"}, "response": {"type": "string"}},
                 "required": ["query", "context", "response"]})
mapping = {"query": "{{item.query}}", "context": "{{item.context}}", "response": "{{item.response}}"}
testing_criteria = [
    TestingCriterionAzureAIEvaluator(name="groundedness", evaluator_name="builtin.groundedness",
        initialization_parameters={"deployment_name": "gpt-5-mini", "threshold": 4}, data_mapping=mapping),
    TestingCriterionAzureAIEvaluator(name="relevance", evaluator_name="builtin.relevance",
        initialization_parameters={"deployment_name": "gpt-5-mini"}, data_mapping=mapping),
    TestingCriterionAzureAIEvaluator(name="violence", evaluator_name="builtin.violence",
        data_mapping={"query": "{{item.query}}", "response": "{{item.response}}"}),
]
eval_obj = openai_client.evals.create(name="rag-baseline", data_source_config=data_source_config,
                                      testing_criteria=testing_criteria)
dataset = project_client.datasets.upload_file(name="rag-tests", version="1", file_path="rag.jsonl")
run = openai_client.evals.runs.create(eval_id=eval_obj.id, name="run-1",
    data_source=CreateEvalJSONLRunDataSourceParam(type="jsonl",
        source=SourceFileID(type="file_id", id=dataset.id)))`,
      takeaway: 'Cloud evaluations bind built-in evaluators to dataset columns through data_mapping; LLM-judge evaluators need a judge deployment, safety evaluators do not.',
    },
    {
      title: 'Error analysis on agent traces turned into a regression set',
      description:
        'After a spike in failed runs, the engineer queries traces in Application Insights for tool errors, classifies the failures, and finds that 60% are wrong arguments to the booking tool. The fix is a strict schema and clearer parameter descriptions; the failing conversations become an evaluation dataset so the regression cannot return.',
      language: 'text',
      code: `// Kusto query over Application Insights traces (dependencies = tool/model spans)
dependencies
| where timestamp > ago(24h)
| where customDimensions["gen_ai.operation.name"] == "execute_tool"
| extend tool = tostring(customDimensions["gen_ai.tool.name"]),
         err  = tostring(customDimensions["error.type"])
| where isnotempty(err)
| summarize failures = count() by tool, err
| order by failures desc

// Findings -> actions
// book_slot / InvalidArgument 143  -> strict=True schema, describe "date" as ISO 8601, add example
// book_slot / Timeout          31  -> retry with idempotency key
// lookup_customer / 403        12  -> agent identity lacks role on CRM; grant least-privilege role
// Then: Traces -> "Convert to evaluation dataset" and re-run Tool Call Accuracy + Task Adherence`,
      takeaway: 'Classify failures by step and cause from trace attributes, fix the largest class, and freeze the failing cases into a dataset for continuous evaluation.',
    },
    {
      title: 'Self-critique loop with an independent judge (and the mistake it fixes)',
      description:
        'A report-writing agent judged its own drafts with the same prompt and always passed itself. Switching to a separate rubric judge with reasons, a pass threshold and a two-round cap produced measurable improvement and exposed where the generator ignored tool output.',
      language: 'python',
      code: `RUBRIC = """Score 1-5 each: (a) every number is supported by the tool output,
(b) all requested sections present, (c) no speculation. Return JSON {score, reasons}."""

draft = openai.responses.create(model="gpt-5-mini", input=task_with_tool_output).output_text
for round_ in range(2):                                   # bounded reflection loop
    verdict = openai.responses.create(
        model="gpt-5",                                    # different, stronger judge
        instructions=RUBRIC,
        input=f"TOOL OUTPUT:\\n{tool_output}\\n\\nDRAFT:\\n{draft}",
        text={"format": {"type": "json_object"}},
    )
    result = json.loads(verdict.output_text)
    span.set_attribute("critic.score", result["score"])  # emit as telemetry
    if result["score"] >= 4:
        break
    draft = openai.responses.create(model="gpt-5-mini",
        input=f"Revise the draft to fix: {result['reasons']}\\n\\nDRAFT:\\n{draft}").output_text`,
      takeaway: 'Use an independent critic with explicit criteria, bound the loop, and record critic scores as telemetry so quality is observable, not assumed.',
    },
  ],
  keyPoints: [
    'Evaluator families: RAG (Retrieval, Document Retrieval, Groundedness, Groundedness Pro, Relevance, Response Completeness), quality (Coherence, Fluency), similarity (F1, BLEU, ROUGE, METEOR), risk and safety (0 to 7 severity, defect rate), agent (Intent Resolution, Task Adherence, Tool Call Accuracy and more), rubric, graders and custom.',
    'LLM-judge evaluators need a judge deployment and a threshold (1 to 5 scale, default pass 3); safety evaluators run in the hosted service without a deployment.',
    'Groundedness is the primary fabrication detector; pair it with Relevance and, for agents, Tool Output Utilization and Ungrounded Attributes.',
    'Run evaluations locally (azure-ai-evaluation evaluate()), in the cloud (evals.create and evals.runs.create via the project OpenAI client), against agents with generated rubrics, and in CI with the GitHub Action.',
    'Reflection loops: draft, independent critic with a rubric or evaluator, revise, stop at threshold or cap; chain-of-thought evaluation judges the reasoning or tool-call trace, not only the answer.',
    'Error analysis: pull failing traces, classify by step and cause, cluster, fix the largest class, convert traces to a regression dataset, save a new agent version and compare.',
    'Observability uses OpenTelemetry GenAI conventions in Application Insights: server-side traces are automatic once connected; client-side spans need azure-core-tracing-opentelemetry.',
    'Monitor token usage, latency breakdowns (time to first token vs total), safety annotations and continuous evaluation scores; alert on anomalies and protect trace data as sensitive telemetry.',
  ],
  flashcards: [
    { front: 'Which evaluator returns a binary grounded/ungrounded result without a judge model?', back: 'Groundedness Pro (preview), backed by Azure AI Content Safety.' },
    { front: 'What scale and default threshold do LLM-judge quality evaluators such as Groundedness use?', back: 'A 1 to 5 score; scores at or above the threshold (default 3) pass.' },
    { front: 'What scale do content-safety risk evaluators use?', back: '0 to 7 severity with a default pass threshold of 3, aggregated into a defect rate.' },
    { front: 'Which agent evaluators check tool behaviour?', back: 'Tool Call Accuracy, Tool Selection, Tool Input Accuracy, Tool Output Utilization and Tool Call Success (batched as Tool Use Quality).' },
    { front: 'How do you create a cloud evaluation with azure-ai-projects 2.x?', back: 'Build data_source_config and testing_criteria (TestingCriterionAzureAIEvaluator with data_mapping), call openai_client.evals.create, then evals.runs.create with a dataset file id.' },
    { front: 'What is a rubric evaluator?', back: 'An LLM-judged evaluator with custom weighted criteria, normalised to 0 to 1 with per-dimension reasons; it can be generated from an agent\'s instructions and tools.' },
    { front: 'How do server-side traces get enabled for Foundry agents?', back: 'Connect an Application Insights resource to the project; Foundry then records traces automatically for prompt agents, hosted agents and workflows (90-day view).' },
    { front: 'Which packages add client-side tracing in Python?', back: 'azure-ai-projects, opentelemetry-sdk and azure-core-tracing-opentelemetry (export with azure-monitor-opentelemetry).' },
    { front: 'What role does the project managed identity need for continuous evaluation?', back: 'Foundry User on the Foundry resource.' },
    { front: 'Why should the critic in a self-critique loop differ from the generator?', back: 'To avoid the model grading its own output leniently; use a different prompt or stronger model and bound the loop.' },
    { front: 'What is the recommended evaluator bundle for RAG apps?', back: 'Retrieval + Groundedness + Relevance + content safety evaluators.' },
  ],
  quiz: [
    {
      question:
        'Users complain that a documentation assistant confidently invents configuration flags. Which evaluator best quantifies this problem before release?',
      options: ['Fluency', 'Groundedness', 'BLEU', 'Task Navigation Efficiency'],
      correct: [1],
      explanation:
        'Groundedness measures whether the response is supported by the retrieved context, which is the definition of fabrication in RAG. Fluency and BLEU measure language quality and overlap, and Task Navigation Efficiency measures agent step paths.',
    },
    {
      question: 'Which TWO statements about Foundry evaluators are correct? (Select two)',
      options: [
        'Risk and safety evaluators run in the hosted evaluation service and do not require a judge model deployment.',
        'Groundedness requires labelled ground truth answers for every row.',
        'Agent evaluators such as Tool Call Accuracy produce pass/fail results per turn like unit tests.',
        'BLEU is the recommended metric for detecting hallucinations.',
      ],
      correct: [0, 2],
      explanation:
        'Safety evaluators need project info but no deployment, and agent evaluators return binary results. Groundedness needs context, not ground truth, and BLEU measures n-gram overlap with references, not hallucination.',
    },
    {
      question:
        'An agent\'s success rate dropped after adding three new tools. Traces show the model often calls a tool with malformed dates. What is the MOST effective first fix?',
      options: [
        'Raise the model temperature so it explores alternatives.',
        'Make the tool schema strict with additionalProperties false and describe the date parameter format with an example, then re-run Tool Input Accuracy on the failing cases.',
        'Remove tracing to reduce latency.',
        'Switch the judge model used by evaluators.',
      ],
      correct: [1],
      explanation:
        'Argument errors are addressed with strict schemas and clearer descriptions, verified by re-running agent evaluators on a regression dataset. Temperature, removing tracing and changing the judge do not fix tool inputs.',
    },
    {
      question: 'You need per-step latency for model calls versus tool calls in a hosted agent running in production. What should you do?',
      options: [
        'Enable diagnostic settings for Audit Logs.',
        'Connect Application Insights to the project and inspect span durations in the agent traces.',
        'Set max_output_tokens lower.',
        'Create a Cost Management budget.',
      ],
      correct: [1],
      explanation:
        'Traces contain spans with durations for each model and tool operation. Audit logs, token caps and budgets do not give per-step latency.',
    },
    {
      question: 'Which approach implements a self-critique loop correctly?',
      options: [
        'The generator rates its own draft with the same prompt and returns it if it says it is good.',
        'A separate judge call (or evaluator) scores the draft against explicit criteria with reasons; the generator revises until the score passes a threshold or an iteration cap is reached.',
        'Run the generation twice and return the longer answer.',
        'Lower the temperature to zero and skip the critique.',
      ],
      correct: [1],
      explanation:
        'Independent critique with criteria, reasons, a threshold and a cap is the documented pattern. Self-grading is biased, length is not quality, and temperature alone does not verify content.',
    },
    {
      question: 'Which feature turns real production agent conversations into test cases for future evaluations?',
      options: ['Prompt caching', 'Convert traces to evaluation datasets', 'Spillover', 'Model router'],
      correct: [1],
      explanation:
        'Foundry can convert agent traces into evaluation datasets. The other features concern cost, capacity and routing.',
    },
  ],
  statements: [
    { text: 'Groundedness Pro returns a 1 to 5 score produced by an LLM judge.', isTrue: false, explanation: 'Groundedness Pro uses Azure AI Content Safety and returns a binary pass/fail without a model deployment; the standard Groundedness evaluator returns 1 to 5.' },
    { text: 'Conversation-level evaluation requires the data to be in the messages format.', isTrue: true, explanation: 'Query-and-response rows support turn-level evaluation only.' },
    { text: 'Agent evaluation results and traces can be reviewed in the Foundry portal and in Application Insights.', isTrue: true, explanation: 'Results are stored in the project and can be routed to the connected App Insights resource.' },
    { text: 'Connecting Application Insights to a project automatically traces local tool functions executed inside your own Python application.', isTrue: false, explanation: 'Server-side tracing covers Foundry-hosted execution; local code needs client-side OpenTelemetry instrumentation.' },
    { text: 'Risk and safety evaluators aggregate results into a defect rate.', isTrue: true, explanation: 'The defect rate is the percentage of responses with undesired content above the threshold.' },
    { text: 'Statistical significance testing is available when comparing agent versions with the evaluation GitHub Action.', isTrue: true, explanation: 'The action reports confidence intervals and significance between a baseline and candidate agents.' },
    { text: 'Trace data is safe to share broadly because prompts and tool arguments are redacted automatically.', isTrue: false, explanation: 'Traces can contain sensitive inputs and outputs; you must redact, restrict access and set retention yourself.' },
  ],
  resources: [
    { label: 'Built-in evaluators reference', url: 'https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators' },
    { label: 'Introduction to cloud evaluation with the Foundry SDK', url: 'https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/cloud-evaluation' },
    { label: 'Evaluate your AI agents', url: 'https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent' },
    { label: 'Set up tracing in Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-setup' },
  ],
};
