import type { Concept } from '../../types';

export const promptDesignVariantsVersioning: Concept = {
  id: 'prompt-design-variants-versioning',
  title: 'Prompt Design, Prompt Variants and Prompt Version Control',
  summary:
    'Treating prompts as production artifacts: designing system messages and templates that behave predictably, creating variants and comparing them with the same evaluation dataset, and storing prompts in Git alongside model and agent versions so every production behaviour is traceable and reversible.',
  certs: ['ai-300', 'ai-103'],
  domains: ['ai-300-3', 'ai-103-2'],
  outcomes: ['ai-300-3-3-1', 'ai-300-3-3-2', 'ai-300-3-3-3', 'ai-103-2-3-1'],
  tags: ['prompt-engineering', 'system-message', 'prompt-variants', 'prompt-versioning', 'git', 'agent-versions', 'genaiops'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Designing prompts that operate well',
      body: `A production prompt is a **template** with a fixed part (system message, instructions, output schema, examples) and a dynamic part (user input, retrieved context, tool results). Design principles that generalise across models:

- **Be explicit about role, task, constraints and output format.** "You are a returns assistant for Contoso. Answer only from the provided policy excerpts. If the answer is not present, say you do not know. Reply in JSON with fields answer and citations." Each clause removes a class of failure.
- **Put stable content first, variable content last.** This improves **prompt caching** hit rates (identical prefixes are cached) and makes the model treat the instructions as authoritative.
- **Use few-shot examples** for format and tone; two or three good examples beat a paragraph of description. Keep examples representative of production inputs.
- **Separate instructions from data** with clear delimiters, and state that content inside the data block is information, not instructions, as a first line of defence against indirect prompt injection.
- **Constrain generation**: lower temperature for classification and extraction, structured outputs or JSON mode when a parser consumes the result, and explicit length limits to bound cost.
- **Prefer safety system messages** from Microsoft's templates (grounding, harm avoidance, jailbreak resistance) in addition to content filters.

Parameters are part of the design: temperature, top_p, max output tokens, stop sequences and tool definitions change behaviour as much as wording does, so they belong in the same versioned artifact as the text.`,
    },
    {
      heading: 'Variants: compare prompts with evidence, not taste',
      body: `A **prompt variant** is the same task with a different prompt text or different parameters (temperature, model, few-shot set). Variant testing is how you decide between candidates: run every variant against the **same evaluation dataset** and score with the **same evaluators**, then compare aggregate and per-row results.

The workflow in Foundry:

1. Build a test dataset of representative queries, with context and ground truth where available (JSONL).
2. Define variants: \`v1_baseline\`, \`v2_fewshot\`, \`v3_fewshot_temp0\`. Change one thing at a time where possible.
3. Generate responses for each variant (local script, or an evaluation with a model or agent target), and run evaluators such as relevance, groundedness, coherence, fluency and task-specific custom evaluators.
4. Compare in the portal's evaluation comparison view or programmatically; look at pass rates, mean scores, token usage and latency, and inspect the rows where variants disagree.
5. Promote the winner; keep the losers' results as a record.

For agents, the Foundry **agent playground** supports saving changes as **agent versions** and comparing versions side by side on identical inputs (chat output comparison) and by YAML definition diff; every saved version is immutable. The classic **prompt flow** tool offered node-level variants with a batch run and metrics; it is being retired (announced for 20 April 2027) and is not recommended for new work, so the exam-safe answer for comparing prompts is an evaluation run per variant on a shared dataset, not an ad-hoc chat in the playground. A single impressive answer is an anecdote; a pass rate over 200 rows is evidence.`,
    },
    {
      heading: 'Version control for prompts',
      body: `Prompts drift when they live in a chat window or a database field nobody reviews. GenAIOps puts them in **Git** with the same discipline as code:

- **One file per prompt**, in a structured format such as a \`.prompty\` or YAML file with front matter (name, description, model deployment, parameters, input schema) and the template body with placeholders. Some teams keep prompts in \`.jinja\` or \`.md\` files loaded at run time.
- **Semantic versioning or Git tags** per prompt release, and a **changelog** entry describing why it changed.
- **Pull requests** as the gate: a reviewer reads the diff, and CI runs the evaluation suite against the changed prompt, failing the build if a quality threshold drops.
- **Promotion** through environments by merging to release branches, with the deployment pipeline injecting environment-specific settings (deployment names, endpoints) rather than editing prompt text per environment.
- **Traceability**: log the prompt version (file hash or tag) as a trace attribute and evaluation metadata so a production trace points to the exact prompt.

\`\`\`yaml
# prompts/returns_assistant.prompty
---
name: returns_assistant
version: 2.3.0
model:
  api: chat
  configuration: {type: azure_openai, azure_deployment: \${env:ASSISTANT_DEPLOYMENT}}
  parameters: {temperature: 0.2, max_tokens: 400, response_format: {type: json_object}}
inputs: {question: {type: string}, policy_excerpts: {type: string}}
---
system:
You are a returns assistant for Contoso. Answer only from the policy excerpts in <policy>.
If the answer is not present, reply {"answer": "I don't know", "citations": []}.
<policy>{{policy_excerpts}}</policy>
user:
{{question}}
\`\`\`

In Foundry, **agent versions** (\`<agent_name>:<version>\`) are the server-side counterpart: immutable, comparable and addressable, so an application can pin a version and roll back by changing a string. Export the agent definition YAML to Git as well so the repository stays the source of truth.`,
    },
    {
      heading: 'The exam angle',
      body: `Expect scenario items that mix the three outcomes:

- "A new prompt wording 'feels better' to the product manager" leads to **create a variant and evaluate both on the shared dataset**, not deploy the preferred wording.
- "The assistant started refusing valid requests after someone edited the system message in the portal" leads to **version control plus review**, with the fix being to restore the previous Git version or agent version and add a CI evaluation gate.
- "Cost rose 40 percent after a prompt change" leads to measuring **token usage per variant** as part of comparison, and to **ordering stable content first** so caching applies.
- "Which parameter change makes extraction deterministic" leads to **lower temperature** (and structured outputs), not more few-shot examples.
- "Prompts must behave the same in test and prod" leads to **parameterising deployment names and keeping prompt text identical** across environments.

Distractors to recognise: storing prompts in a database table edited through an admin UI without review, comparing prompts by chatting in the playground, using prompt flow variants as the recommended path for new projects, and changing both the model version and the prompt in a single release so you cannot attribute a regression.`,
    },
  ],
  examples: [
    {
      title: 'Variant comparison in CI with the Foundry evaluation client',
      description:
        'A team keeps two prompt variants in Git. The CI job renders each template over the shared test set, writes responses to JSONL, and submits one cloud evaluation per variant with identical evaluators, then fails the build if the candidate\'s groundedness pass rate is lower than the baseline.',
      language: 'python',
      code: `import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

project = AIProjectClient(endpoint=os.environ["AZURE_AI_PROJECT_ENDPOINT"], credential=DefaultAzureCredential())
oai = project.get_openai_client()
criteria = [
    {"type": "azure_ai_evaluator", "name": "groundedness", "evaluator_name": "builtin.groundedness",
     "initialization_parameters": {"deployment_name": os.environ["JUDGE_DEPLOYMENT"]},
     "data_mapping": {"query": "{{item.query}}", "context": "{{item.context}}", "response": "{{item.response}}"}},
    {"type": "azure_ai_evaluator", "name": "relevance", "evaluator_name": "builtin.relevance",
     "initialization_parameters": {"deployment_name": os.environ["JUDGE_DEPLOYMENT"]},
     "data_mapping": {"query": "{{item.query}}", "response": "{{item.response}}"}},
]
for variant in ["v2_3_0_baseline", "v2_4_0_fewshot"]:
    ev = oai.evals.create(name=f"returns-{variant}", data_source_config={"type": "custom", "item_schema": {"type": "object"}, "include_sample_schema": True},
                          testing_criteria=criteria)
    file_id = oai.files.create(file=open(f"out/{variant}.jsonl", "rb"), purpose="evals").id
    run = oai.evals.runs.create(eval_id=ev.id, name=variant, data_source={"type": "jsonl", "source": {"type": "file_id", "id": file_id}})
    print(variant, run.id)`,
      takeaway: 'Same dataset, same evaluators, one run per variant: the comparison is then a table, not an opinion.',
    },
    {
      title: 'Portal edit breaks production (a realistic mistake and the fix)',
      description:
        'An engineer tightened the system message of a published agent directly in the portal to reduce verbosity. The new version also dropped the sentence allowing the agent to ask clarifying questions, so task adherence fell and support tickets rose. Because agent versions are immutable, the app was pointed back to the previous version within minutes. The team then exported the agent YAML to Git, made the portal read-only for prod, and added a PR evaluation gate.',
      language: 'yaml',
      code: `# .github/workflows/prompt-eval.yml
on: { pull_request: { paths: ['prompts/**', 'agents/**'] } }
permissions: { id-token: write, contents: read }
jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with: { client-id: \${{ secrets.AZURE_CLIENT_ID }}, tenant-id: \${{ secrets.AZURE_TENANT_ID }}, subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }} }
      - run: pip install azure-ai-projects azure-identity openai
      - run: python eval/run_variants.py --dataset data/returns_eval.jsonl --min-pass-rate 0.9`,
      takeaway: 'Immutable versions make rollback trivial; Git plus a CI evaluation gate stops the regression from shipping in the first place.',
    },
    {
      title: 'Cache-friendly prompt restructuring',
      description:
        'A prompt placed the user question first and 3,000 tokens of policy text after it, so no two requests shared a prefix and prompt caching never hit. Reordering to system instructions, then the static policy excerpts, then the question made the first 3,200 tokens identical across requests, cutting input cost and latency with no change to answers, confirmed by rerunning the evaluation.',
      language: 'text',
      code: `Before:  [system] [question] [policy excerpts ... 3000 tokens]   -> no shared prefix
After:   [system] [policy excerpts ... 3000 tokens] [question]   -> cached prefix, same evaluation scores`,
      takeaway: 'Prompt layout is an operational decision: stable content first enables caching and is still verified with the same evaluation.',
    },
  ],
  keyPoints: [
    'A production prompt is a template: explicit role, task, constraints and output format; stable content first, variable content last; data separated from instructions.',
    'Model parameters (temperature, max tokens, structured output, tools) are part of the prompt artifact and must be versioned with the text.',
    'Compare variants by running the same evaluation dataset and evaluators against each; compare pass rates, scores, token usage and latency, then inspect disagreements.',
    'Agent versions in Foundry are immutable and comparable (setup, chat output, YAML diff); prompt flow variants are classic and prompt flow is being retired.',
    'Store prompts as files in Git (for example .prompty or YAML with front matter), review through pull requests, and gate merges with an automated evaluation.',
    'Parameterise deployment names and endpoints per environment; never fork prompt text per environment.',
    'Log the prompt version as a trace attribute and in evaluation metadata so production behaviour is traceable to a commit.',
    'Change one variable per release (prompt or model version) so regressions can be attributed.',
  ],
  flashcards: [
    { front: 'Why should stable instructions come before dynamic content in a prompt?', back: 'Identical prefixes enable prompt caching (lower cost and latency) and the model treats early instructions as authoritative.' },
    { front: 'What is a prompt variant?', back: 'The same task with different prompt text or parameters (temperature, few-shot set, model), compared against the same evaluation dataset.' },
    { front: 'What is the recommended way to decide between two prompt wordings?', back: 'Run an evaluation for each variant on the same dataset with the same evaluators and compare scores, token usage and latency.' },
    { front: 'How are Foundry agent versions referenced in code?', back: '<agent_name>:<version>; versions are immutable once saved.' },
    { front: 'What three comparisons does the agent version history offer?', back: 'Agent setup (configuration), chat output on identical inputs, and YAML definition diff.' },
    { front: 'What is the status of prompt flow for new development?', back: 'Not recommended; retirement announced for 20 April 2027, with migration to Microsoft Agent Framework advised.' },
    { front: 'Which parameter change makes classification or extraction more deterministic?', back: 'Lowering temperature (and using structured outputs or JSON mode).' },
    { front: 'How should prompt text differ between test and production environments?', back: 'It should not; parameterise deployment names and endpoints instead.' },
    { front: 'What should a CI pipeline do when a prompt file changes?', back: 'Run the evaluation suite against the changed prompt and fail if quality thresholds are not met.' },
    { front: 'Why log the prompt version on production traces?', back: 'So any behaviour seen in production can be traced to the exact prompt commit or agent version.' },
  ],
  quiz: [
    {
      question:
        'A product manager rewrote the assistant\'s system message and reports that it "answers much better" in the playground. What should the MLOps engineer do before releasing it?',
      options: [
        'Deploy it because the product manager owns the experience',
        'Create it as a variant and run the shared evaluation dataset against both the current and new prompt, comparing scores, token usage and latency',
        'Ask three colleagues to chat with both versions and vote',
        'Increase temperature so the new prompt is more creative',
      ],
      correct: [1],
      explanation:
        'Variant evaluation on the same dataset is the evidence-based path. Playground impressions and informal votes are anecdotes, and changing temperature is a different variable.',
    },
    {
      question:
        'After a portal edit to a published prompt-based agent, task adherence dropped. Which TWO actions restore service fastest and prevent recurrence? (Select two)',
      options: [
        'Point the application back to the previous immutable agent version',
        'Delete the agent and recreate it from memory',
        'Export the agent definition to Git and add a pull request evaluation gate',
        'Switch the production deployment to auto-upgrade',
      ],
      correct: [0, 2],
      explanation:
        'Immutable versions give instant rollback; Git plus CI evaluation prevents unreviewed edits. Recreating from memory loses the definition, and model upgrade policy is unrelated.',
    },
    {
      question:
        'An extraction prompt returns inconsistent JSON across identical inputs. Which change is most likely to fix the inconsistency?',
      options: [
        'Add more descriptive adjectives to the instructions',
        'Lower the temperature and use structured outputs or JSON mode',
        'Increase max output tokens',
        'Move the user input before the system instructions',
      ],
      correct: [1],
      explanation:
        'Determinism comes from lower temperature and enforced output structure. Adjectives, longer outputs and moving the input do not address randomness.',
    },
    {
      question:
        'Your team wants prompts to behave identically in test and production while using different model deployments in each environment. What is the correct approach?',
      options: [
        'Maintain a separate prompt file per environment',
        'Keep one prompt file and parameterise the deployment name through environment configuration',
        'Edit the prompt in the production portal after each release',
        'Store prompts in a database with per-environment rows',
      ],
      correct: [1],
      explanation:
        'One versioned prompt with environment-injected settings keeps text identical. Separate files or rows drift, and portal edits bypass review.',
    },
    {
      question:
        'Which approach for comparing prompt variants is recommended for new generative AI projects in Microsoft Foundry?',
      options: [
        'Prompt flow node variants with a batch run',
        'An evaluation run per variant against a shared dataset using the Foundry evaluation SDK or portal',
        'Manual spot checks in the chat playground',
        'A/B testing in production without evaluation',
      ],
      correct: [1],
      explanation:
        'Evaluation runs give repeatable, comparable metrics. Prompt flow is being retired and not recommended for new work; spot checks are anecdotal; production A/B without offline evaluation exposes users to untested prompts.',
    },
  ],
  statements: [
    { text: 'Model parameters such as temperature should be versioned together with the prompt text.', isTrue: true, explanation: 'They change behaviour as much as wording and belong in the same artifact.' },
    { text: 'Saved agent versions in Foundry can be edited in place.', isTrue: false, explanation: 'Versions are immutable; changes create a new version.' },
    { text: 'Placing a large static context block before the user question can improve prompt cache hit rates.', isTrue: true, explanation: 'Caching works on identical prompt prefixes.' },
    { text: 'Prompt flow is Microsoft\'s recommended tool for new prompt variant development.', isTrue: false, explanation: 'Prompt flow is being retired (20 April 2027) and is no longer recommended for new development.' },
    { text: 'A pull request that changes a prompt should trigger an automated evaluation before merge.', isTrue: true, explanation: 'This is the CI gate that prevents quality regressions.' },
    { text: 'Changing the model version and the prompt in the same release is good practice because it reduces the number of deployments.', isTrue: false, explanation: 'Changing two variables at once makes regressions impossible to attribute.' },
  ],
  resources: [
    { label: 'Prompt engineering techniques (Azure OpenAI in Foundry Models)', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/prompt-engineering' },
    { label: 'Agent development lifecycle in Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/development-lifecycle' },
    { label: 'Tune prompts using variants (classic prompt flow)', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/flow-tune-prompts-using-variants' },
    { label: 'Introduction to cloud evaluation with the Microsoft Foundry SDK', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/develop/cloud-evaluation' },
  ],
};
