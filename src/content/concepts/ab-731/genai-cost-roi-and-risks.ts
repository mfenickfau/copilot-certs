import type { Concept } from '../../types';

export const genaiCostRoiAndRisks: Concept = {
  id: 'genai-cost-roi-and-risks',
  title: 'What Generative AI Costs, What It Returns, and Where It Goes Wrong',
  summary:
    'The cost drivers of generative AI (tokens, model tier, deployment type, licences, people and change), how to frame return on investment and total cost of ownership, and the three failure modes every leader must plan for: fabrications, unreliable output and bias.',
  certs: ['ab-731', 'ab-100', 'ab-730'],
  domains: ['ab-731-1', 'ab-100-1', 'ab-730-1'],
  outcomes: ['ab-731-1-1-4', 'ab-731-1-1-5', 'ab-100-1-3-1', 'ab-100-1-3-2', 'ab-730-1-2-1'],
  tags: ['tokens', 'cost', 'roi', 'tco', 'hallucination', 'bias', 'reliability'],
  difficulty: 'foundations',
  diagram: 'context-window',
  sections: [
    {
      heading: 'Tokens: the unit everything is metered in',
      body: `Language models do not read words; they read **tokens**, fragments of text that average roughly four characters in English. Everything you send (the prompt, the system instructions, the documents retrieved for grounding, the conversation history) is **input tokens**, and everything the model writes back is **output tokens**. Usage-based pricing in Microsoft Foundry is quoted per thousand or per million tokens, and output tokens usually cost more than input tokens. Reasoning models also bill the hidden "thinking" tokens they generate before answering.

This has three consequences a leader should internalise:

- **Long context is expensive.** Pasting a 200-page contract into every question costs far more than retrieving the three relevant clauses. Retrieval-augmented generation is a cost control as much as a quality control.
- **Model tier matters more than model brand.** A frontier reasoning model can cost many times more per token than a small model. Matching the cheapest model that meets the quality bar is the single biggest lever on run cost, and Foundry's model router can do it per request.
- **Volume drives the bill.** A pilot with 50 users looks cheap; multiply by 20,000 employees and by every grounded document and the numbers change. Estimate tokens per interaction, interactions per user, users, and then add a margin.

The **context window** is the maximum number of tokens a model can consider at once. Exceeding it means content is truncated or the request fails, so solution design (and cost) depends on how much must fit.`,
    },
    {
      heading: 'The other cost drivers and how pricing models change them',
      body: `Tokens are only the visible meter. A realistic total cost of ownership (TCO) includes:

- **Licences and subscriptions**: a Microsoft 365 Copilot add-on licence is a fixed per-user-per-month cost regardless of usage; Copilot Studio agents and Copilot Cowork are metered in **Copilot Credits**; Foundry models are pay-per-token or reserved capacity.
- **Deployment type on Foundry**: *Standard* (pay-as-you-go per token, best-effort latency) suits variable or unpredictable traffic; *Provisioned throughput* reserves capacity in **provisioned throughput units (PTUs)** billed hourly, with discounts for one-month or one-year Azure reservations, and suits predictable, latency-sensitive production load; *Batch* offers discounted tokens for asynchronous bulk jobs with no latency requirement. Global, Data Zone and regional variants trade price and availability against where data is processed.
- **Grounding infrastructure**: Azure AI Search indexes, storage, connectors and the data-cleanup effort to make content fit for retrieval.
- **People and change**: training, champions, prompt libraries, governance reviews, evaluation and monitoring. For Copilot rollouts this is usually the largest hidden cost and the biggest determinant of whether value appears.
- **Risk and compliance**: data protection reviews, red-teaming, human review steps in regulated processes.

A frequent exam framing is "the pilot's run cost was fine, the production bill was a shock." Causes include uncontrolled long prompts, premium models used for trivial tasks, and no spending limits. Mitigations include model selection, caching, retrieval instead of stuffing, batch processing for non-urgent work, and admin-set spending policies and credit limits.`,
    },
    {
      heading: 'Framing return on investment',
      body: `ROI for generative AI is the value created minus the total cost, over a period, and leaders are expected to define the measures **before** the pilot, not after. Value typically shows up as:

- **Time saved** on frequent tasks (hours per week per role), which is only real value if the time is redeployed to something the business wants.
- **Throughput and cycle time**: more cases closed, faster quote turnaround, shorter onboarding.
- **Quality and risk**: fewer errors, more consistent documents, better compliance evidence.
- **Revenue effects**: higher conversion, better retention, new offerings.
- **Experience**: employee and customer satisfaction scores.

Good ROI criteria pair a baseline (measured before), a target, a measurement method (Copilot Dashboard usage data, process metrics, surveys) and a time horizon. The Microsoft adoption guidance stresses selecting scenarios with clear outcomes and success measures, and Copilot Analytics (the Microsoft Copilot Dashboard and business-impact reports) gives usage and impact data for licensed Copilot.

Avoid two common errors: counting only licence cost against a vague "productivity" benefit, and ignoring the ramp. Adoption follows a curve; measuring in week two of a rollout understates value, and measuring without a control group overstates it. Build an ROI case per business process, not one blended number for "AI".`,
    },
    {
      heading: 'Fabrications, reliability and bias: the risks to design around',
      body: `Every generative AI business case must budget for three failure modes.

**Fabrications (hallucinations).** A model produces fluent, confident text that is false: a non-existent citation, a wrong figure, an invented policy clause. This is inherent to how models generate probable text. Mitigations: ground answers in verified sources with citations, require human review proportional to the stakes, constrain outputs to retrieved content, and evaluate groundedness before and after launch. Over-reliance by users who stop checking is the organisational form of the same risk.

**Reliability.** The same prompt can yield different answers; models are updated; output quality varies with context length and input quality. Mitigations: evaluation sets and quality gates, versioned prompts, pinned model versions, monitoring in production, and designing for review and fallback rather than full autonomy in high-stakes steps.

**Bias.** Models learn from historical data that encodes human and societal bias, and grounding data can under-represent groups. Outputs can therefore favour or disadvantage people (in hiring summaries, credit explanations, customer triage). Mitigations: representative datasets, fairness testing across groups, transparency about AI involvement, human accountability for consequential decisions, and governance review before launch. These map directly to Microsoft's responsible AI principles, covered in the governance concept.

The exam angle: when a scenario shows an AI producing a wrong but convincing answer, the correct remedy is grounding plus verification, not "a bigger model." When it shows unequal outcomes across customer groups, the remedy is representative data and fairness review, not disabling AI. Leaders are expected to treat these as design requirements with owners, not surprises.`,
    },
  ],
  examples: [
    {
      title: 'The production bill that was ten times the pilot',
      description:
        'A customer-service pilot of a Foundry-based assistant for 40 agents cost almost nothing per month. At 2,000 agents the bill jumped far more than fiftyfold. The investigation found that the whole 60-page product manual was being sent with every question, a premium reasoning model answered trivial "where is my order" prompts, and no spending alerts existed. The fix: retrieve only relevant passages with Azure AI Search, route simple questions to a small model, move overnight transcript summaries to batch processing, and set budget alerts.',
      takeaway: 'Token volume, model tier and context length drive run cost; design retrieval, routing and limits before scaling.',
    },
    {
      title: 'An ROI case that survived the CFO',
      description:
        'An HR director wanted Copilot for 600 recruiters. Instead of claiming "30% productivity", she baselined time-to-first-shortlist and job-description drafting time for two months, piloted with 60 recruiters, measured again after eight weeks, and paired the Copilot Dashboard usage data with the process metrics. The case showed hours saved per hire and a shorter time-to-fill, both tied to a known cost per vacancy. The CFO approved the expansion.',
      takeaway: 'Baseline first, measure a real process metric, and tie it to money the business already tracks.',
    },
    {
      title: 'The confident wrong answer (a realistic mistake)',
      description:
        'A finance analyst asks an ungrounded chat assistant for the company\'s capital-expenditure policy threshold and gets a precise figure with an authoritative tone. It is invented. The analyst uses it in a board paper. The fix was threefold: ground the assistant on the actual policy library so it cites the source document, display citations users are trained to check, and require a reviewer for any figure that goes into governance documents.',
      takeaway: 'Fabrications are fluent and confident; grounding, citations and proportionate human review are the controls.',
    },
    {
      title: 'Bias surfaced in a triage pilot',
      description:
        'A utility piloted an AI that prioritised customer complaints. Review showed complaints written in non-native English were consistently ranked lower in urgency. The training and grounding examples had come almost entirely from one region. The team rebuilt the example set to represent the full customer base, added fairness tests across language groups, and kept a human reviewer on any case flagged as low priority before closure.',
      takeaway: 'Unrepresentative data produces biased outcomes; fix the data and add fairness testing, and keep humans accountable.',
    },
  ],
  keyPoints: [
    'Tokens are the metered unit: input (prompt, instructions, grounding, history) plus output; output and reasoning tokens cost more, and long context multiplies cost.',
    'Model tier is the biggest run-cost lever; use the cheapest model that meets the quality bar and reserve premium models for tasks that need them.',
    'Foundry deployment types trade cost against predictability: Standard pay-as-you-go for variable traffic, provisioned throughput (PTUs, hourly or reserved) for predictable latency-sensitive load, Batch for discounted asynchronous bulk work.',
    'Total cost of ownership includes licences, Copilot Credits, grounding infrastructure, people and change management, and governance, not just tokens.',
    'Define ROI criteria before the pilot: baseline, target, measurement method and time horizon per business process; Copilot Analytics supplies usage and impact data.',
    'Fabrications are fluent falsehoods; mitigate with grounding, citations, groundedness evaluation and proportionate human review.',
    'Reliability needs evaluation sets, versioned prompts and models, monitoring and fallback paths; bias needs representative data, fairness testing and human accountability.',
  ],
  flashcards: [
    { front: 'What is a token?', back: 'A fragment of text (about four characters in English) that models read and write; usage-based pricing is metered in input and output tokens.' },
    { front: 'Which usually costs more per token, input or output?', back: 'Output tokens, and reasoning models also bill the hidden reasoning tokens they generate.' },
    { front: 'What is a context window?', back: 'The maximum number of tokens a model can consider in one request, including prompt, grounding and response.' },
    { front: 'Name the Foundry deployment approach suited to predictable, latency-sensitive production traffic.', back: 'Provisioned throughput, measured in PTUs, billed hourly or discounted via a one-month or one-year Azure reservation.' },
    { front: 'When does Batch deployment make sense?', back: 'Bulk, asynchronous workloads with no latency requirement, in exchange for a discounted token rate.' },
    { front: 'What is the single biggest lever on generative AI run cost?', back: 'Model selection: using the cheapest model that meets the quality bar, optionally with a model router.' },
    { front: 'What should an ROI case for generative AI include?', back: 'A baseline measured before, a target, a measurement method, a time horizon, and the total cost of ownership, per business process.' },
    { front: 'What is a fabrication (hallucination)?', back: 'Fluent, confident output that is false, such as an invented citation or figure; mitigated by grounding, citations and human review.' },
    { front: 'How is bias in generative AI mitigated?', back: 'Representative datasets, fairness testing across groups, transparency, and human accountability for consequential decisions.' },
    { front: 'What is over-reliance?', back: 'Users accepting AI output without verification; the organisational twin of fabrication risk, addressed by training, citations and review steps.' },
  ],
  quiz: [
    {
      question:
        'A generative AI assistant\'s monthly Foundry bill rose sharply after rollout. Analysis shows every user question is sent together with the full 80-page policy manual. What is the MOST effective change to reduce cost while keeping answer quality?',
      options: [
        'Switch all users to a larger reasoning model so fewer follow-up questions are needed',
        'Use retrieval-augmented generation to send only the relevant passages of the manual with each question',
        'Move the deployment from Global Standard to a regional provisioned deployment',
        'Shorten the model\'s responses to fifty words',
      ],
      correct: [1],
      explanation:
        'Input tokens from the full manual dominate the cost; retrieval sends only relevant passages. A larger model costs more, changing deployment geography does not cut token volume, and truncating answers harms quality without addressing the input.',
    },
    {
      question: 'Which TWO are direct cost drivers of generative AI usage in Microsoft Foundry? (Select two)',
      options: [
        'The number of input and output tokens processed',
        'The model tier selected, since premium and reasoning models cost more per token',
        'The number of SharePoint sites in the tenant',
        'The number of sensitivity labels published in Microsoft Purview',
      ],
      correct: [0, 1],
      explanation:
        'Tokens and model tier determine usage cost. SharePoint site count and sensitivity labels are governance facts that do not drive model billing.',
    },
    {
      question:
        'A bank runs a customer-facing assistant with steady, predictable traffic and strict response-time targets. Which Foundry billing approach BEST fits?',
      options: [
        'Standard pay-as-you-go deployment',
        'Global Batch deployment',
        'Provisioned throughput with an Azure reservation',
        'The free Copilot Chat experience',
      ],
      correct: [2],
      explanation:
        'Predictable load plus latency sensitivity is the case for provisioned throughput, and a reservation discounts the sustained use. Standard is best-effort, Batch is asynchronous, and Copilot Chat is not a Foundry model deployment.',
    },
    {
      question:
        'A CFO asks for an ROI case for Microsoft 365 Copilot in the sales team. Which approach produces the MOST credible case?',
      options: [
        'Multiply the licence cost by an industry-average productivity percentage',
        'Baseline proposal-drafting time and quote turnaround before a pilot, measure the same metrics after eight weeks, and combine them with Copilot Dashboard usage data',
        'Survey users one week after rollout about whether they like Copilot',
        'Count the number of prompts submitted per user',
      ],
      correct: [1],
      explanation:
        'A credible case pairs a measured baseline with process outcomes tied to money and real usage data. Industry averages, early sentiment surveys and raw prompt counts are not evidence of business value.',
    },
    {
      question:
        'An analyst used a figure from an AI assistant in a board paper; the figure turned out to be invented. Which combination of actions BEST addresses the root cause?',
      options: [
        'Ban the assistant and return to manual research',
        'Ground the assistant in the authoritative policy library with citations and require human review of figures used in governance documents',
        'Upgrade to a larger model so that it fabricates less',
        'Ask users to phrase questions more politely',
      ],
      correct: [1],
      explanation:
        'Fabrication is controlled by grounding, citations and proportionate review. Banning loses the value, a larger model still fabricates when ungrounded, and phrasing has no bearing on factual accuracy.',
    },
    {
      question: 'A complaint-triage AI consistently ranks complaints written by one customer group as lower priority. What is the MOST appropriate remedy?',
      options: [
        'Increase the model\'s temperature setting so results vary more',
        'Rebuild the example and grounding data to represent all customer groups and add fairness testing with human review of low-priority outcomes',
        'Switch from pay-as-you-go to a commitment tier',
        'Remove the triage step from the process entirely',
      ],
      correct: [1],
      explanation:
        'Unequal outcomes signal bias from unrepresentative data; fix the data, test fairness and keep humans accountable. Temperature and billing tier are unrelated, and removing triage discards the value instead of fixing the harm.',
    },
  ],
  statements: [
    { text: 'Output tokens typically cost more than input tokens in usage-based model pricing.', isTrue: true, explanation: 'Generation is priced higher than reading input, and reasoning tokens are billed as output.' },
    { text: 'Provisioned throughput is billed per token consumed.', isTrue: false, explanation: 'Provisioned deployments are billed per PTU per hour regardless of tokens, optionally discounted through Azure reservations.' },
    { text: 'The largest hidden cost of a Copilot rollout is often training, change management and governance rather than the model itself.', isTrue: true, explanation: 'People and process costs determine whether value appears and are frequently underestimated.' },
    { text: 'A fabrication is easy to spot because the model signals uncertainty.', isTrue: false, explanation: 'Fabrications are fluent and confident; that is why grounding, citations and review are needed.' },
    { text: 'An ROI case should define its baseline and measurement method before the pilot begins.', isTrue: true, explanation: 'Without a baseline there is nothing to compare the post-pilot measurements against.' },
    { text: 'Using a larger model is the primary remedy for bias in AI outputs.', isTrue: false, explanation: 'Bias comes from unrepresentative data and unexamined outcomes; the remedy is representative data, fairness testing and human accountability.' },
    { text: 'Retrieval-augmented generation reduces cost as well as improving accuracy, because it sends only relevant content to the model.', isTrue: true, explanation: 'Fewer input tokens per request lowers the bill while keeping answers grounded.' },
  ],
  resources: [
    { label: 'Deployment types for Microsoft Foundry Models', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/deployment-types' },
    { label: 'Provisioned throughput in Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/provisioned-throughput' },
    { label: 'Develop an AI strategy (Cloud Adoption Framework)', url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/ai/strategy' },
    { label: 'Microsoft Copilot Dashboard (Copilot Analytics)', url: 'https://learn.microsoft.com/en-us/viva/insights/org-team-insights/copilot-dashboard' },
  ],
};
