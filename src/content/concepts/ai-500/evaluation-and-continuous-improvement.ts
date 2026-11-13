import type { Concept } from '../../types';

export const evaluationAndContinuousImprovement: Concept = {
  id: 'evaluation-and-continuous-improvement',
  title: 'Evaluating Multi-Agent Solutions and Closing the Improvement Loop',
  summary:
    'Designing evaluation and validation for agents in Foundry: human review templates and trace annotations, built-in agent, RAG and safety evaluators for memory, knowledge, tools and prompts, a testing pyramid from unit tests to automated evaluations in CI/CD, and continuous improvement with LLM-as-a-judge rubrics, synthetic and trace-derived datasets, optimisation loops and user feedback.',
  certs: ['ai-500', 'ai-300'],
  domains: ['ai-500-3', 'ai-500-4', 'ai-300-4'],
  outcomes: ['ai-500-3-1-1', 'ai-500-3-1-2', 'ai-500-3-2-3', 'ai-500-4-3-3', 'ai-300-4-1-4'],
  tags: ['evaluation', 'evaluators', 'llm-as-a-judge', 'human-review', 'synthetic-data', 'testing', 'ci-cd', 'agent-optimizer', 'foundry'],
  difficulty: 'advanced',
  diagram: 'eval-loop',
  sections: [
    {
      heading: 'Human review in Foundry: templates, annotations and feedback',
      body: `Automated scores need a human anchor. Foundry offers three complementary human-review mechanisms:

- **Human evaluation templates** (preview). As the agent builder you define a template of questions (thumbs up/down, 1-5 slider, multiple choice, free text) under the agent's Evaluation tab; only one template is active at a time. Reviewers with the Foundry User role open the agent's preview web app, chat, and submit the form for each response; builders download the JSON results. Use it for pre-release acceptance by domain experts and compliance reviewers.
- **Trace annotations** (preview). Builders mark individual production traces thumbs up or down (default scoring template \`task_completion\`, score 1.0 pass or 0.0 fail) with an optional explanation; annotations append and never overwrite, and each carries a source (\`builder\` or \`end_user\`) and actor type \`human\` so they remain filterable against automated evaluations.
- **End-user feedback logging**. Your application emits \`gen_ai.evaluation.result\` OpenTelemetry events (binary thumbs or Likert 1-5) correlated to the trace, so satisfaction can be queried in Application Insights alongside latency and tokens.

A sound human review process defines *who* reviews (domain experts for correctness, safety reviewers for harm, accessibility or legal where relevant), *what sample* (stratified by intent, failure signals, low automated scores, random), *how disagreements are resolved* (calibration sessions and a rubric), and *where results flow* (datasets for regression tests, rubric refinement, optimiser runs). Human labels are also how you validate that an LLM judge agrees with people before trusting it at scale.`,
    },
    {
      heading: 'Evaluators for memory, knowledge, tools and prompts',
      body: `Foundry's built-in evaluators act like unit tests for agents, producing pass/fail or thresholded scores, and the exam expects you to pick the right family for each component:

| Component | Evaluators | What they catch |
|---|---|---|
| **Prompts and instructions** | Task Adherence, Intent Resolution, Coherence, Fluency, Output Quality (batched), rubric evaluators | Instructions ignored, intent misread, drift after prompt changes |
| **Knowledge and RAG** | Retrieval, Document Retrieval (needs ground truth), Groundedness, Groundedness Pro, Relevance, Response Completeness | Wrong or missing chunks, hallucinated facts, incomplete answers |
| **Tools** | Tool Call Accuracy, Tool Selection, Tool Input Accuracy, Tool Output Utilization, Tool Call Success, Task Navigation Efficiency, Tool Use Quality (batched) | Wrong tool, bad arguments, ignored results, technical failures, inefficient paths |
| **Memory and context** | Conversation-level Task Completion and Customer Satisfaction, Ungrounded Attributes, custom checks that a remembered fact is used correctly | Forgotten constraints, fabricated user attributes, summary drift |
| **Safety** | Hate and Unfairness, Sexual, Violence, Self-Harm, Protected Materials, Indirect Attack (XPIA), Code Vulnerability, Prohibited Actions, Sensitive Data Leakage | Harmful output, injection susceptibility, policy violations |

Evaluations run at **turn level** (single response) or **conversation level** (whole interaction, needed for memory and multi-step task completion), against existing datasets, generated responses from a target agent, simulated conversations or production traces. In code, \`project.get_openai_client().evals.create()\` defines testing criteria of type \`azure_ai_evaluator\` and a run targets \`{"type": "azure_ai_agent", "name": ..., "version": ...}\`; Agent Framework's \`evaluate_agent()\` with \`LocalEvaluator\` checks (keyword, tool_called, tool_call_args_match) and \`FoundryEvals\` combines fast local checks with cloud judges. Custom evaluators (Python code or prompt-based) cover domain rules the catalogue lacks.`,
    },
    {
      heading: 'A testing strategy: unit, integration, regression, automated evaluation',
      body: `Agents need the classic pyramid plus a layer the classic pyramid lacks:

1. **Unit tests** (pytest, xUnit) for tool handlers, prompt templating, schema validators and workflow executors, with the model mocked; fast and deterministic.
2. **Local integration tests**: run the agent locally (\`azd ai agent run\` and \`invoke --local\`, Agent Inspector) against real models and tools in a dev project; verify protocol behaviour, tool wiring and approvals.
3. **Deployed integration tests**: smoke-test the deployed agent (\`azd ai agent invoke\`, the CI/CD quickstart's test prompt) after each deployment to a stage.
4. **Regression tests**: a fixed, versioned dataset of representative and edge-case queries, including previously failed cases and red-team prompts, scored with the same evaluators every run so changes are comparable.
5. **Automated evaluations as quality gates**: the Foundry evaluation **GitHub Action** or **Azure DevOps** task invokes agents by \`name:version\` with a dataset and evaluator list, reports confidence intervals and statistical significance when comparing versions against a baseline, and fails the pipeline below thresholds; \`azd ai eval run start --fail-on\` does the same from the CLI with \`evals/azure.eval.yaml\` committed next to the code.

Because LLM outputs vary, gates use thresholds and repetitions (Agent Framework can repeat queries to measure consistency) rather than exact string matches, and sample sizes large enough for the statistics to mean something. Safety evaluators and red-team scans belong in the same gate. Store evaluation results with the agent version and the model version so a regression can be attributed.`,
    },
    {
      heading: 'Continuous improvement: judges, synthetic data, optimisation loops, feedback',
      body: `Improvement is a loop, not a launch task:

- **LLM-as-a-judge frameworks.** Most quality evaluators are AI-assisted judges returning a score and explanation. **Rubric evaluators** let you define weighted criteria (each 1-5, weighted average normalised to 0-1 with a pass threshold); Foundry can auto-generate a rubric from the agent's instructions, reference files and production traces, and recommends recent GPT-5-class models as judges. Validate the judge against human labels, keep the judge model separate from the agent model where possible, and watch for judge drift when models update.
- **Synthetic data generation.** Before launch or for edge cases, generate Simple QnA (single-turn) datasets or **simulation seeds** that drive the conversation simulator, which plays the user against the target agent with configurable turns, repetitions and behaviours; red teaming generates adversarial sets. Synthetic and trace-based data are complementary.
- **Trace-derived datasets.** Convert production traces into evaluation datasets with intelligent sampling (filters low-signal traffic, MinHash diversity, up to 1,000 rows, private-content redaction by default), closing the loop between real behaviour and tests.
- **Semantic optimisation loops.** The **agent optimizer** evaluates a baseline, generates candidate instructions, tool descriptions, skills and model choices, scores them on the dataset, and lets you promote a candidate as a new version; **Prompt Optimizer** refines instructions interactively; **Insights** clusters recurring production behaviour with likely causes; cluster analysis groups evaluation failures.
- **User feedback loops.** Thumbs and ratings flow in as OpenTelemetry events, correlate to traces, and seed the next dataset and rubric revision.

Schedule the loop: continuous evaluation on sampled traffic, recurring evaluations on the regression set, scheduled red teaming, and a cadence for optimiser runs gated by the same thresholds as any release.`,
    },
  ],
  examples: [
    {
      title: 'Cloud evaluation of an agent version with agent and RAG evaluators',
      description:
        'Before promotion, a pipeline evaluates the candidate agent version against a versioned query dataset with task adherence, tool call accuracy and groundedness, then reads the summary to decide whether to fail the build.',
      language: 'python',
      code: `from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

project = AIProjectClient(endpoint=ENDPOINT, credential=DefaultAzureCredential())
client = project.get_openai_client()
dataset = project.datasets.upload_file(name="support-regression", version="7", file_path="queries.jsonl")

evaluation = client.evals.create(
    name="support-agent gate",
    data_source_config={"type": "custom", "include_sample_schema": True,
        "item_schema": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}},
    testing_criteria=[
        {"type": "azure_ai_evaluator", "name": "adherence", "evaluator_name": "builtin.task_adherence"},
        {"type": "azure_ai_evaluator", "name": "tools", "evaluator_name": "builtin.tool_call_accuracy"},
        {"type": "azure_ai_evaluator", "name": "grounded", "evaluator_name": "builtin.groundedness"},
    ],
)
run = client.evals.runs.create(eval_id=evaluation.id, name="candidate v12",
    data_source={"type": "azure_ai_target_completions",
        "source": {"type": "file_id", "id": dataset.id},
        "input_messages": {"type": "template", "template": [{"type": "message", "role": "user",
            "content": {"type": "input_text", "text": "{{item.query}}"}}]},
        "target": {"type": "azure_ai_agent", "name": "support-agent", "version": "12"}})`,
      takeaway: 'Target a specific agent version with a versioned dataset and a fixed evaluator set so results are comparable release to release.',
    },
    {
      title: 'Fast local checks plus Foundry judges with Agent Framework',
      description:
        'Developers run deterministic local checks on every commit (did the agent call the right tool, did the answer mention the expected entity) and add cloud judges for relevance and task adherence in the nightly job.',
      language: 'python',
      code: `from agent_framework import LocalEvaluator, evaluate_agent, tool_called_check, keyword_check, evaluator
from agent_framework.foundry import FoundryEvals

@evaluator
def cites_source(response: str) -> bool:
    return "[1]" in response            # our agents must cite at least one source

local = LocalEvaluator(tool_called_check("search_policy"), keyword_check("policy"), cites_source)
judges = FoundryEvals(project_client=project, model="gpt-5-mini",
                      evaluators=[FoundryEvals.TASK_ADHERENCE, FoundryEvals.RELEVANCE])

results = await evaluate_agent(
    agent=policy_agent,
    queries=["How many vacation days do new hires get?", "Can I carry over unused leave?"],
    evaluators=[local, judges],
)
for r in results:
    print(r.provider, f"{r.passed}/{r.total}")
    r.raise_for_status()                # fails CI if any item failed`,
      takeaway: 'Combine cheap deterministic checks for the inner loop with LLM judges for quality; both run through one evaluation API.',
    },
    {
      title: 'Trusting the judge before validating it (a realistic mistake)',
      description:
        'A team adopted an auto-generated rubric and set the pass threshold at 0.8, then shipped prompt changes whenever the score rose. Users complained; human review showed the rubric over-weighted "polite tone" and under-weighted "correct policy clause". The fix: calibrate the rubric against 100 human-labelled responses, re-weight criteria (correctness 9, tone 2), add a deterministic clause-match check, and require that human spot-check agreement with the judge stays above an agreed level before the judge gates releases.',
      takeaway: 'An LLM judge is a model too: calibrate it against human labels and pair it with deterministic checks.',
    },
    {
      title: 'Closing the loop from production traces',
      description:
        'Monthly, the team converts the last 30 days of traces into a sampled evaluation dataset (redacted), merges in failed trace annotations and thumbs-down feedback, runs the agent optimizer with task completion and tool call accuracy as criteria, reviews the candidate instructions, and promotes the winner behind a canary with the same evaluation gate.',
      language: 'bash',
      code: `# Scaffold, generate and run an evaluation with the azd AI evaluations extension
azd extension install azure.ai.evaluations
azd ai eval init --source traces --target support-agent          # writes evals/azure.eval.yaml
azd ai eval generate                                             # optional: synthetic dataset + rubric evaluator
azd ai eval create                                               # register datasets, evaluators, eval
azd ai eval run start --fail-on "task_completion<0.85"           # build gate; summary printed
azd ai eval run output list -o json | jq '.[] | select(.passed==false)'`,
      takeaway: 'Traces become datasets, datasets drive optimisation and gates, and the same thresholds protect every promotion.',
    },
  ],
  keyPoints: [
    'Human review in Foundry: evaluation templates filled in the agent preview app (one active template), thumbs up/down trace annotations with source builder or end_user, and end-user feedback emitted as gen_ai.evaluation.result events.',
    'Pick evaluators by component: Task Adherence and Intent Resolution for prompts; Retrieval, Document Retrieval, Groundedness and Relevance for knowledge; Tool Call Accuracy, Tool Input Accuracy, Tool Output Utilization and Tool Call Success for tools; conversation-level Task Completion for memory and multi-step work; risk and safety evaluators throughout.',
    'Evaluate at turn or conversation level against datasets, generated responses, simulated conversations or production traces; target agents by name:version.',
    'Testing strategy: unit tests with mocked models, local and deployed integration tests (azd ai agent run/invoke), versioned regression datasets, and automated evaluations as CI/CD gates (GitHub Action, Azure DevOps, azd ai eval --fail-on) with thresholds and statistics rather than exact matches.',
    'LLM-as-a-judge: rubric evaluators with weighted 1-5 criteria normalised to 0-1; auto-generate from instructions and traces, use strong judge models, and calibrate against human labels.',
    'Synthetic data (Simple QnA, simulation seeds driving the conversation simulator) and trace-derived datasets (intelligent sampling, redaction) are complementary sources.',
    'Optimisation loops: agent optimizer (candidates scored on datasets, promote as new version), Prompt Optimizer, Insights and cluster analysis; schedule continuous, recurring and red-team evaluations.',
  ],
  flashcards: [
    { front: 'Which role do human reviewers need to submit evaluations in the Foundry agent preview app?', back: 'Foundry User on the project (and Reader on the account); builders need Foundry Project Manager to manage templates.' },
    { front: 'How many human evaluation templates can be active for an agent at once?', back: 'One; activating another deactivates the current one.' },
    { front: 'What score values does the default trace annotation template use?', back: 'Thumbs up = 1.0 (pass), thumbs down = 0.0 (fail), under evaluation name task_completion.' },
    { front: 'Which evaluators are process-level checks of tool use?', back: 'Tool Call Accuracy, Tool Selection, Tool Input Accuracy, Tool Output Utilization and Tool Call Success.' },
    { front: 'Which evaluator requires ground truth of optimal tool sequences?', back: 'Task Navigation Efficiency.' },
    { front: 'What is a rubric evaluator?', back: 'An LLM-judge evaluator scoring weighted custom criteria 1-5 each, combined into a normalised 0-1 score with a pass threshold; can be auto-generated from agent context and traces.' },
    { front: 'What does intelligent sampling do when creating datasets from traces?', back: 'Filters low-signal traces and selects a diverse representative subset (MinHash), up to 1,000 rows, with private-content redaction by default.' },
    { front: 'Name two ways to run evaluations as CI/CD gates.', back: 'The Foundry evaluation GitHub Action or Azure DevOps task (agent name:version, dataset, evaluators, statistical comparison), and azd ai eval run start --fail-on.' },
    { front: 'What does the conversation simulator need?', back: 'Scenario descriptions (test cases, optionally generated as simulation seeds), a simulator model to play the user, and a target agent; conversation-level evaluators score the results.' },
    { front: 'Why calibrate an LLM judge against human labels?', back: 'The judge is itself a model; agreement with humans validates its weights and threshold before it gates releases, and reveals judge drift.' },
    { front: 'What does Agent Framework LocalEvaluator provide?', back: 'Fast, API-free checks such as keyword_check, tool_called_check, tool_calls_present and tool_call_args_match, plus custom @evaluator functions.' },
  ],
  quiz: [
    {
      question:
        'Compliance officers must assess a loan-advice agent\'s responses using their own questions (accuracy, policy clause cited, tone) before launch, and the results must be downloadable. Which Foundry feature fits BEST?',
      options: [
        'Continuous evaluation with built-in evaluators.',
        'A human evaluation template activated for the agent, completed by reviewers in the agent preview app.',
        'Thumbs up/down end-user feedback events.',
        'The AI Red Teaming Agent.',
      ],
      correct: [1],
      explanation:
        'Human evaluation templates let builders define questions and reviewers submit structured assessments that can be downloaded. Continuous evaluation is automated, end-user feedback is binary or Likert from users, and red teaming tests adversarial safety.',
    },
    {
      question:
        'An agent\'s answers are fluent but frequently cite the wrong policy document. Which TWO evaluators most directly diagnose this? (Select two)',
      options: ['Fluency', 'Document Retrieval (with ground truth)', 'Groundedness', 'Violence'],
      correct: [1, 2],
      explanation:
        'Document Retrieval measures whether the right documents were retrieved and Groundedness whether the answer is supported by retrieved context. Fluency is already fine, and Violence is a safety evaluator.',
    },
    {
      question:
        'You need a CI gate that compares a candidate agent version with the production version on a fixed dataset and only passes if the improvement is statistically meaningful. Which approach is designed for this?',
      options: [
        'Manual comparison of two playground chats.',
        'The Foundry evaluation GitHub Action with multiple agent-ids and a baseline-agent-id, failing on thresholds.',
        'Diffing the two system prompts.',
        'Checking token usage in the dashboard.',
      ],
      correct: [1],
      explanation:
        'The GitHub Action evaluates multiple agent versions against a baseline with confidence intervals and significance tests. Playground chats and prompt diffs do not measure quality statistically, and token usage is not quality.',
    },
    {
      question:
        'A new agent has no production traffic yet, but the team needs multi-turn regression tests covering edge cases. What is the recommended approach?',
      options: [
        'Wait for production traces.',
        'Generate simulation-seed scenarios from the agent definition and reference files, run the conversation simulator against the agent, and score with conversation-level evaluators.',
        'Hand-write three example conversations.',
        'Use the fine-tuning training set as the test set.',
      ],
      correct: [1],
      explanation:
        'Synthetic simulation seeds plus the simulator produce diverse multi-turn conversations pre-launch. Waiting delays testing, three examples lack coverage, and reusing training data leaks evaluation.',
    },
    {
      question:
        'Your rubric evaluator passes responses that human reviewers reject because it over-weights tone. What should you do?',
      options: [
        'Raise the pass threshold to 0.95.',
        'Re-weight the rubric criteria toward correctness, add a deterministic clause-match check, and calibrate the judge against human-labelled responses before using it as a gate.',
        'Replace human review with the judge.',
        'Switch to Fluency as the only evaluator.',
      ],
      correct: [1],
      explanation:
        'Judge calibration and criterion weighting fix the misalignment at its source. A higher threshold on a wrong rubric still rewards tone, removing humans removes the anchor, and Fluency ignores correctness.',
    },
    {
      question: 'Which practice correctly reflects a testing strategy for agent code in a hosted agent project?',
      options: [
        'Only end-to-end evaluations are needed because agents are non-deterministic.',
        'Unit tests for tool handlers and prompt assembly with mocked models, local and deployed integration tests with azd ai agent invoke, and automated evaluations on a versioned regression dataset as a gate.',
        'Exact-string assertions on model output in unit tests.',
        'Manual exploratory testing in the playground before each release.',
      ],
      correct: [1],
      explanation:
        'The pyramid plus evaluation gates balances speed and coverage. Skipping unit tests slows feedback, exact-string assertions on LLM output are brittle, and manual testing alone does not scale or catch regressions reliably.',
    },
  ],
  statements: [
    { text: 'Trace annotations added by builders overwrite end-user feedback on the same trace.', isTrue: false, explanation: 'Annotations are appended, each with its own source attribute, and never replace existing feedback.' },
    { text: 'Conversation-level evaluation is required to measure outcomes such as task completion across multiple steps.', isTrue: true, explanation: 'Turn-level evaluation scores individual responses; multi-step outcomes need the whole conversation.' },
    { text: 'Foundry agent evaluators return binary pass/fail (or thresholded) results, making them usable as unit-test-style gates.', isTrue: true, explanation: 'They are designed to function like unit tests for agentic systems.' },
    { text: 'Synthetic datasets replace the need for trace-derived datasets once an agent is in production.', isTrue: false, explanation: 'They are complementary: traces reflect real behaviour, synthetic data covers edge cases and pre-launch scenarios.' },
    { text: 'A rubric evaluator\'s overall score is the weighted average of 1-5 criterion scores normalised to a 0-1 range.', isTrue: true, explanation: 'A pass threshold is applied to the normalised score.' },
    { text: 'The agent optimizer applies the best candidate automatically to production without review.', isTrue: false, explanation: 'You review candidate scores and changes, then promote a candidate as a new version (or apply and redeploy for hosted agents).' },
    { text: 'Exact string matching is the recommended assertion style for LLM output in automated evaluations.', isTrue: false, explanation: 'Use evaluators with thresholds, repetitions and statistics; outputs vary legitimately.' },
  ],
  resources: [
    { label: 'Set up human evaluation for your agents (preview)', url: 'https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/human-evaluation' },
    { label: 'Agent evaluators in Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators' },
    { label: 'Run an evaluation in GitHub Actions (preview)', url: 'https://learn.microsoft.com/en-us/azure/foundry/how-to/evaluation-github-action' },
    { label: 'Rubric evaluators (LLM-as-a-judge)', url: 'https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/rubric-evaluators' },
  ],
};
