import type { Concept } from '../../types';

export const agentEvaluationTesting: Concept = {
  id: 'agent-evaluation-testing',
  title: 'Evaluating Agent Performance with Test Sets',
  summary:
    'How to test an agent systematically: build single-response and conversational test sets, pick evaluation methods (general quality, compare meaning, tool use, keyword match, text similarity, exact match, content safety, custom), run and compare evaluations, read results and response times, automate runs through the Power Platform API, and understand the limits of automated evaluation.',
  certs: ['ab-620'],
  domains: ['ab-620-3'],
  outcomes: ['ab-620-3-1-1', 'ab-620-3-1-2', 'ab-620-3-1-3'],
  tags: ['copilot-studio', 'evaluation', 'testing', 'test-sets', 'quality', 'content-safety', 'ci-cd'],
  difficulty: 'intermediate',
  diagram: 'eval-loop',
  sections: [
    {
      heading: 'Why agent evaluation, and how it differs from the test chat',
      body: `The **Test your agent** pane answers one question at a time and is hard to repeat; **agent evaluation** runs a whole **test set** of test cases, scores each one, and lets you rerun the identical set after every change so you have an objective baseline. Microsoft positions the two as complementary: use the test chat while authoring and evaluation to catch regressions, measure accuracy, relevance and quality, and check safety before release.

A **test case** is one simulated interaction (a question or a conversation) with optional **expected response**, expected **keywords**, or expected **tools and topics**. A **test set** groups test cases and the **test methods** used to grade them, and can apply several methods at once. Evaluations run **as the signed-in user**: the agent answers with that user's knowledge and tool connections, so to test as someone else you sign out and in as that account. Generated test cases may surface data the connected account can read, and any maker with access to the agent can see the test sets.

Limitations to know: evaluation supports agents with **No authentication** or **Authenticate with Microsoft**, not **Authenticate manually**; **Fabric data agents** are not supported; GCC environments cannot use user profiles or the similarity method; and the **Review** button shows a warning when no evaluation exists or the **model changed** since the last one, without blocking publishing. Results are kept for **89 days**; export to CSV to keep them longer.`,
    },
    {
      heading: 'Creating test sets',
      body: `From the agent's **Evaluation** page select **New evaluation** and choose the type:

**Single responses** (up to **100 test cases**, each one unconnected question). Creation options:
- **Quick question set**: 10 AI-generated questions from the agent's description, instructions and capabilities.
- **Full question set**: generated from **knowledge sources** (best for generative orchestration) or **topics** (best for classic), choosing the number of questions; sources can be text, Word, Excel, PDF or individual SharePoint files up to 5 MB (folders unsupported).
- **Use your test chat conversation**: questions from the latest test chat, also reachable from the evaluate icon in the test pane.
- **Import** from a spreadsheet, **write questions yourself**, or **use production data** based on analytics themes.

**Conversation** test sets (up to **20 test cases**, each up to **12 messages**, that is six question-and-answer pairs) assess context retention, clarification and multi-step completion. Options: **Quick conversation set** (10 short conversations), **Full conversation set** (from knowledge or topics, short or long) and **Use your test chat**.

For either type you name the set, **add test methods** (some need a **pass score**, some need **expected answers, keywords or tools** per case; cases missing them return **Invalid**), and under **Additional configuration > Manage** review the signed-in user's connections, since broken connections make tool- and knowledge-dependent cases fail. **Save** stores the set; **Run** evaluates immediately. Test sets can be edited later (details and individual cases), and other makers can run sets you created.`,
    },
    {
      heading: 'Choosing evaluation methods',
      body: `| Method | Measures | Set type | Scoring | Needs |
|---|---|---|---|---|
| **General quality** (default on every set) | LLM-judged relevance, groundedness, completeness and abstention | Single or conversation | 0 to 100 percent | Nothing |
| **Content safety** | Hate and unfairness, sexual, violence, self-harm; one method per content type | Single or conversation | Pass or fail against a severity threshold 0 (strictest) to 7 | Content type and permitted level |
| **Compare meaning** | Semantic similarity of intent to the expected answer | Single | 0 to 100 percent, default pass 50 | Expected answer, pass score |
| **Tool use** | Whether expected tools or topics were used | Single | Pass or fail | Expected capabilities |
| **Keyword match** | Any or all expected words or phrases present | Single or conversation | Pass or fail | Keywords |
| **Text similarity** | Lexical similarity to the expected answer | Single | 0 to 100 percent | Expected answer, pass score |
| **Exact match** | Identical answer | Single | Pass or fail | Expected answer |
| **Custom** | Your own instructions and labels | Single or conversation | Pass or fail | Name, instructions, labels |

Choosing: with **no single right wording**, use general quality or compare meaning; when the answer must contain a specific policy number or disclaimer, use keyword match; when the routing matters more than the text ("did it call the Create ticket flow?"), use tool use; for strictly templated outputs, exact match or text similarity; for refusals that general quality would penalise under its abstention criterion, write a **custom** method that defines a correct refusal; for responsible-AI gates, add content safety methods per category. General quality can error when retrieved knowledge makes the grading input too large, and reducing knowledge sources does not reliably fix it; refine the case instead.`,
    },
    {
      heading: 'Running, reading and automating evaluations',
      body: `Run from the end of the test-set wizard or from **Recent results** (one evaluation at a time; a run takes minutes and streams results case by case, and you can stop it). Each case ends as **Pass, Fail, Invalid or Error**, and the set gets a **pass rate**. Open a case to see the expected and actual response, the grader's **reasoning**, the **transcript**, the **activity map** of decisions and tool calls, the **resources used**, and the **response time** in seconds (end to end including tool and connector calls; measurement only, no pass or fail). Only the maker who started a run sees the agent responses and explanations; others see status and metrics. Rate graders with thumbs up or down to send feedback on the evaluation itself.

**Compare with** lets you line up two runs of the same set and see which cases flipped from fail to pass or pass to fail, which is how you prove an instruction or knowledge change helped. **Export test results** produces a CSV with question, expected response, method, pass score, agent response, result and analysis.

For CI/CD, evaluations can be triggered through the **Power Platform REST API** and through **connector actions** in agent flows, Power Automate or as tools, so a deployment pipeline can run the regression set and gate promotion on the pass rate. To let testers manage evaluations without editing the agent, share the agent with the **Agent viewer** role, which can view, run, rename, cancel and delete evaluations and see the Monitor tab but cannot change the agent or its test sets.

Exam cues: "repeatable regression testing" means a **test set**; "the answer wording varies but meaning must match" means **compare meaning**; "confirm the flow was called" means **tool use**; "block harmful content before release" means **content safety**; "show the change improved quality" means **Compare with**; "run tests from the pipeline" means the **Power Platform API or connector**; "manual authentication agent cannot be evaluated" is a documented limitation, not a bug.`,
    },
  ],
  examples: [
    {
      title: 'A regression set for an HR agent',
      description:
        'Before each release the HR agent team runs a 60-case single-response set: a full question set generated from the policy SharePoint files, plus 15 hand-written edge cases imported from a spreadsheet. Methods: general quality for all, compare meaning (pass 70) with expected answers for the policy questions, keyword match (All) for cases that must cite the policy number, and tool use for the three cases that should call the Leave balance flow. The set is rerun after every instruction change and compared with the previous run.',
      code: `question,expected_response,keywords,expected_tools
"How many days of parental leave do I get?","Eligible employees receive 16 weeks of paid parental leave (Policy HR-204).","HR-204;16 weeks",
"What is my remaining annual leave?","","", "Leave balance flow"
"Can I carry over unused leave?","Up to 5 days can be carried into the next year (Policy HR-201).","HR-201;5 days",`,
      language: 'text',
      takeaway: 'Mix generated breadth with hand-written edge cases, and combine methods so each case is judged on what matters for it.',
    },
    {
      title: 'The refusal that failed general quality (a realistic mistake)',
      description:
        'A test case asks the agent for a colleague\'s salary; the agent correctly refuses. General quality marks it for improvement because the abstention criterion sees that the agent did not answer. The maker initially lowers the pass threshold, which weakens every other case. The correct fix is a custom test method with instructions and labels that define a polite, policy-citing refusal as the passing outcome for that case.',
      takeaway: 'When a refusal is the right answer, grade it with a custom method rather than bending general quality.',
    },
    {
      title: 'Evaluating as the right user',
      description:
        'An evaluation of a Finance agent returns many Invalid and Fail results because the maker running it has no connection to the finance ERP connector and cannot see the Finance SharePoint site. Agent evaluation runs as the signed-in user. The maker signs out, signs in as a test account with the right access, repairs connections in Manage profile and connections, and reruns; pass rate rises from 40 to 92 percent.',
      takeaway: 'Evaluation results depend on the signed-in user\'s permissions and connections; test with a representative account.',
    },
    {
      title: 'Gating a pipeline on an evaluation',
      description:
        'A deployment pipeline has a pre-deployment step that calls the Power Platform API to run the agent\'s regression test set in the test environment and reads the pass rate. If it falls below 90 percent or any content safety case fails, the flow rejects the deployment step with a comment explaining which cases regressed.',
      code: `# Pseudocode for the pipeline extension flow
run = PowerPlatformAPI.evaluations.run(agentId, testSetId)
wait until run.status in ("Completed", "Failed")
if run.passRate < 0.90 or any(case.method == "Content safety" and case.result == "Fail" for case in run.cases):
    PerformUnboundAction("UpdatePreDeploymentStepStatus", status=30, comments="Evaluation gate failed")
else:
    PerformUnboundAction("UpdatePreDeploymentStepStatus", status=20)`,
      language: 'text',
      takeaway: 'Evaluations are automatable, so quality and safety can become release gates rather than manual checks.',
    },
  ],
  keyPoints: [
    'Agent evaluation runs test sets of test cases (single responses up to 100, conversations up to 20 with up to 12 messages) and scores each case Pass, Fail, Invalid or Error; results last 89 days.',
    'Test cases can be generated (quick set, full set from knowledge or topics), taken from the test chat, imported from a spreadsheet, written manually or built from production themes.',
    'Methods: general quality (default; relevance, groundedness, completeness, abstention), content safety (per category, severity 0 to 7), compare meaning, tool use, keyword match (any or all), text similarity, exact match and custom.',
    'Pick the method by what matters: meaning versus wording, routing (tool use), mandatory phrases (keywords), safety gates (content safety), correct refusals (custom).',
    'Evaluations run as the signed-in user with that user\'s connections; manual authentication agents and Fabric data agents cannot be evaluated.',
    'Results show grader reasoning, transcript, activity map, resources used and response time; Compare with highlights cases that flipped between runs; export to CSV.',
    'Automate runs through the Power Platform REST API or connector actions in flows and pipelines; the Agent viewer role lets testers run evaluations without editing the agent.',
    'The Review button warns when no evaluation exists or the model changed since the last run, but does not block publishing.',
  ],
  flashcards: [
    { front: 'How many test cases can a single-response test set and a conversation test set contain?', back: 'Up to 100 single-response cases; up to 20 conversation cases, each with at most 12 messages (six pairs).' },
    { front: 'Which evaluation method is on by default for every test set?', back: 'General quality, which judges relevance, groundedness, completeness and abstention with an LLM.' },
    { front: 'Which method checks that the agent called the expected flow or topic?', back: 'Tool use (single response sets, pass or fail).' },
    { front: 'How does compare meaning differ from text similarity?', back: 'Compare meaning judges semantic intent against the expected answer; text similarity measures lexical overlap. Both are scored 0 to 100 with a pass score.' },
    { front: 'What severity scale does content safety use?', back: 'Levels 0 (strictest) to 7 (most permissive); the test passes when the response stays within the configured level.' },
    { front: 'Whose identity does an evaluation use?', back: 'The currently signed-in user\'s, including their knowledge access and tool connections.' },
    { front: 'Which authentication setting prevents an agent from being evaluated?', back: 'Authenticate manually; only No authentication and Authenticate with Microsoft are supported.' },
    { front: 'How long are evaluation results retained in Copilot Studio?', back: '89 days; export to CSV to keep them longer.' },
    { front: 'What does the Compare with feature do?', back: 'Compares two runs of the same test set and marks cases that changed from fail to pass or pass to fail.' },
    { front: 'How can evaluations be run from a CI/CD pipeline?', back: 'Through the Power Platform REST API or connector actions in agent flows, Power Automate or tools.' },
  ],
  quiz: [
    {
      question:
        'You must verify that an agent always calls the Create incident flow when users report an outage, regardless of the wording of its reply. Which evaluation method should you add?',
      options: ['Exact match', 'Tool use', 'Keyword match', 'Content safety'],
      correct: [1],
      explanation:
        'Tool use checks whether expected tools or topics were used. Exact match and keyword match judge the response text, and content safety screens for harmful content.',
    },
    {
      question:
        'Policy answers can be phrased in many valid ways, but their meaning must match the approved answer. Which method is MOST appropriate?',
      options: ['Exact match', 'Text similarity with a pass score of 95', 'Compare meaning with an expected answer', 'Tool use'],
      correct: [2],
      explanation:
        'Compare meaning evaluates semantic intent rather than wording. Exact match and a high text-similarity threshold penalise valid paraphrases, and tool use does not judge content.',
    },
    {
      question:
        'An evaluation of an agent configured with Authenticate manually cannot be started. What is the cause?',
      options: [
        'Test sets require at least 20 test cases',
        'Agent evaluation supports only No authentication and Authenticate with Microsoft',
        'The agent uses classic orchestration',
        'The test set lacks a user profile',
      ],
      correct: [1],
      explanation:
        'Manual authentication is a documented limitation of agent evaluation. Case counts have no minimum, orchestration mode is irrelevant, and a user profile is optional.',
    },
    {
      question:
        'Which TWO statements about evaluation results are correct? (Select two)',
      options: [
        'Response time is measured for each interaction but does not affect pass or fail',
        'Results are retained indefinitely in Copilot Studio',
        'Compare with shows which test cases changed outcome between two runs of the same set',
        'Any maker with access to the agent can view the agent responses and explanations of every run',
      ],
      correct: [0, 2],
      explanation:
        'Response time is informational and Compare with highlights flipped cases. Results last 89 days (export to CSV for longer), and only the maker who initiated a run can see the responses and explanations.',
    },
    {
      question:
        'A test case expects the agent to decline to reveal another employee\'s salary. General quality flags the correct refusal for improvement. What should you do?',
      options: [
        'Lower the general quality pass threshold for the whole set',
        'Add a custom test method with instructions and labels that define the expected refusal as passing',
        'Remove the test case',
        'Switch to exact match with the refusal text',
      ],
      correct: [1],
      explanation:
        'Custom methods let you define a correct refusal. Lowering the threshold weakens every case, removing the case loses coverage, and exact match fails on any rewording of the refusal.',
    },
  ],
  statements: [
    { text: 'A conversation test case can contain up to 12 messages.', isTrue: true, explanation: 'That is six question-and-answer pairs; conversation sets hold up to 20 cases.' },
    { text: 'General quality requires an expected answer for each test case.', isTrue: false, explanation: 'General quality needs no expected answers; it judges relevance, groundedness, completeness and abstention.' },
    { text: 'Content safety level 0 is the most permissive setting.', isTrue: false, explanation: 'Level 0 is the strictest; level 7 is the most permissive.' },
    { text: 'Evaluations can be triggered from agent flows or Power Automate through connector actions.', isTrue: true, explanation: 'Along with the Power Platform REST API, this supports CI/CD integration.' },
    { text: 'The Review button blocks publishing until an evaluation has been run.', isTrue: false, explanation: 'It shows warnings (no evaluation, model changed) but does not block publishing.' },
    { text: 'Users with the Agent viewer role can run evaluations but cannot edit the agent or its test sets.', isTrue: true, explanation: 'They can view, run, rename, cancel and delete evaluations and see Monitor.' },
    { text: 'Fabric data agents are supported in agent evaluation.', isTrue: false, explanation: 'Agent evaluation does not support Fabric data agents.' },
  ],
  resources: [
    { label: 'About agent evaluation', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-intro' },
    { label: 'Choose evaluation methods', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-overview' },
    { label: 'Create a single response test set', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-create' },
    { label: 'Run evaluations and view results', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-results' },
  ],
};
