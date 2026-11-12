import type { Concept } from '../../types';

export const generativeAiAndMachineLearningForLeaders: Concept = {
  id: 'generative-ai-and-machine-learning-for-leaders',
  title: 'Generative AI, Traditional AI and Machine Learning: What Leaders Must Tell Apart',
  summary:
    'The three kinds of AI a leader will be asked to fund (traditional predictive AI, generative AI and agentic AI), how pretrained and fine-tuned models differ, when machine learning rather than a language model is the right answer, the lifecycle of an ML solution, and how to recognise a business need that generative AI will genuinely scale or automate.',
  certs: ['ab-731', 'ai-901'],
  domains: ['ab-731-1', 'ai-901-1'],
  outcomes: ['ab-731-1-1-1', 'ab-731-1-1-2', 'ab-731-1-1-3', 'ab-731-1-1-6', 'ab-731-1-2-7', 'ab-731-1-2-8', 'ai-901-1-2-1'],
  tags: ['generative-ai', 'machine-learning', 'models', 'fine-tuning', 'business-value', 'fundamentals'],
  difficulty: 'foundations',
  diagram: 'mlops-genaiops-loop',
  sections: [
    {
      heading: 'Three kinds of AI, three kinds of business question',
      body: `Microsoft's Cloud Adoption Framework groups AI into three capability areas, and the exam expects you to place a scenario in the right one.

- **Traditional (non-generative) AI** analyses data and produces a result for a *defined purpose*: a prediction ("this customer is likely to churn"), a classification ("this invoice is a duplicate"), an anomaly flag ("this transaction is unusual"). It is built with **machine learning**: an algorithm learns patterns from historical, labelled data and applies them to new data. The output is a number, a label or a score.
- **Generative AI** creates *new content* from a request and the context it is given: drafting an email, summarising a report, answering a question, generating an image or code. It is powered by **large language models (LLMs)** and other foundation models that were pretrained on enormous general datasets, so they work on tasks they were never specifically trained for.
- **Agentic AI** combines a model with instructions and tools so it can pursue a goal: interpret a request, decide what to do, call systems and take actions within permissions. Agents often use generative AI to understand a request and traditional AI to make a prediction before acting.

The practical test: if the business wants a *decision or prediction from structured historical data*, think machine learning. If it wants *language, content or conversation*, think generative AI. If it wants *work done across systems with minimal supervision*, think agents. Many real solutions mix all three, and the business decision is "where does AI create value and how much capability do we need", not simply "AI or no AI".`,
    },
    {
      heading: 'Pretrained, fine-tuned and small models',
      body: `A **pretrained (foundation) model** has already learned language, reasoning and general knowledge from vast public data. You use it as-is through prompts and grounding. Most Microsoft Copilot experiences and most Foundry projects start here, because there is nothing to train, no data science team to hire and the model improves as the vendor releases new versions.

A **fine-tuned model** starts from a pretrained model and is further trained on your own examples so that it adopts a specific style, format, vocabulary or narrow behaviour. Fine-tuning helps when prompting alone cannot get consistent results, when you need a very specific output format at scale, or when you want a smaller, cheaper model to perform like a larger one on a narrow task. It does **not** teach the model up-to-date facts reliably; for current or private knowledge the right tool is grounding and retrieval-augmented generation (RAG), covered in a separate concept. Fine-tuning costs money to run, needs curated training data, and the resulting model has to be re-evaluated and maintained every time the base model changes.

**Small language models (SLMs)** such as the Phi family trade breadth for speed and cost. They suit narrow, high-volume or on-device tasks. **Reasoning models** spend more tokens "thinking" and suit complex multi-step analysis but cost more per request. Multimodal models accept images, audio or video as well as text.

The exam angle is a matching question: a legal team wanting answers about *its own* contracts needs grounding, not fine-tuning; a call centre wanting every summary in an exact 5-field template at a million calls a month is a fine-tuning or SLM candidate; a marketing team drafting campaign copy just needs a good pretrained model and good prompts.`,
    },
    {
      heading: 'When machine learning adds value, and its lifecycle',
      body: `Generative AI is fashionable, but a leader still needs to recognise the problems that classic machine learning solves better and cheaper:

- **Forecasting** demand, revenue, staffing or inventory from historical series.
- **Classification and scoring**: fraud detection, credit risk, churn propensity, lead scoring, predictive maintenance.
- **Recommendation and personalisation** from behavioural data.
- **Anomaly detection** in telemetry, transactions or quality data.

These problems share a shape: lots of structured historical data, a measurable target, and a decision that repeats thousands of times. An LLM would be slower, costlier and less accurate than a purpose-built model.

The **ML lifecycle** is the loop the exam wants you to describe, and Azure Machine Learning supports each step:

1. **Define the business problem** and the metric that counts as success.
2. **Collect and prepare data**: clean it, label it, check it is representative of the cases the model will see.
3. **Train** candidate models and **evaluate** them against held-out data.
4. **Deploy** the chosen model as an endpoint or batch job.
5. **Monitor** for drift (the world changes, the model does not) and **retrain** on a schedule or trigger.

The generative-AI equivalent (sometimes called GenAIOps) swaps training for prompt and grounding design and evaluation, but the loop is the same: define, build, evaluate, deploy, monitor, improve. Leaders should fund the whole loop, not just the exciting first deployment.`,
    },
    {
      heading: 'Spotting business value: scale, automation and selection',
      body: `Generative AI pays off when a task is **frequent, language-heavy, and bounded by information the organisation already has**. Microsoft's strategy guidance frames two broad purposes:

- **Enhance individual efficiency**: drafting, research, meeting preparation, information discovery. Value scales with headcount and the hours spent on those tasks. This is the natural home of Microsoft 365 Copilot.
- **Automate business functionality**: agents, forecasting and decision support that remove steps from a process rather than speeding up a person. Value scales with transaction volume. This is where Copilot Studio agents and Foundry solutions live.

Signals that a use case is a strong candidate: high volume, repetitive, text or document centric, tolerant of human review, measurable before and after. Signals that it is a weak candidate: needs certainty (regulatory calculations), has little data to ground on, is rare and bespoke, or carries legal liability if wrong without a review step.

**Selecting a solution** follows the principle "the least operational responsibility that meets the requirement". Buy a prebuilt experience (Copilot, in-product Copilots in Dynamics 365, Power Platform or GitHub) first; extend it with agents when you need your own knowledge and actions; build a custom solution on Foundry only when you need your own models, orchestration or an external-facing product. More customisation means more skills to hire and more to operate.

Exam items typically describe a department and a pain, then ask which type of AI and which level of customisation fits. Anchor on the data shape and the output: prediction from numbers (ML), content from language (generative), work across systems (agent).`,
    },
  ],
  examples: [
    {
      title: 'Churn prediction: an ML problem, not a chatbot',
      description:
        'A telecom retention director asks for "an AI that tells us who is about to leave." The team has five years of billing, usage and complaint records with a clear label (left or stayed). This is a classification problem on structured data. A machine learning model trained in Azure Machine Learning will outperform any language model and cost a fraction per prediction. Generative AI can still help afterwards, drafting the personalised retention offer the agent sends.',
      takeaway: 'Structured history plus a measurable target is machine learning territory; generative AI adds value at the communication step.',
    },
    {
      title: 'Fine-tuning when grounding was needed (a realistic mistake)',
      description:
        'A compliance team spends three months fine-tuning a model on last year\'s policy manual so it can "answer policy questions." Two weeks after launch the policies change and the model keeps giving the old answers confidently. The fix is to stop fine-tuning for knowledge and instead ground a pretrained model on the current policy library with retrieval, so updates to the documents flow straight into the answers.',
      takeaway: 'Fine-tuning shapes behaviour and style; grounding and RAG supply current facts. Choosing the wrong one wastes months.',
    },
    {
      title: 'Picking the scale-friendly use case',
      description:
        'An insurer shortlists two generative AI pilots: summarising 40,000 claim-adjuster notes a month into a standard template, or drafting the CEO\'s quarterly letter. The first is frequent, language-heavy, document-grounded and easy to measure (handling time before and after). The second happens four times a year and the CEO will rewrite it anyway. The claims summariser is the pilot that demonstrates scalable value.',
      takeaway: 'Business value from generative AI compounds with volume and repetition; pick pilots that can be measured and scaled.',
    },
    {
      title: 'Three AI types in one process',
      description:
        'A bank\'s loan-processing agent reads an application (generative AI extracts and summarises the documents), calls a credit-risk model (traditional ML returns a score), and then updates the loan system and emails the applicant (agentic actions within defined permissions). Leaders funding the project need to recognise that each layer has different data, cost and governance needs.',
      takeaway: 'Real solutions mix generative, predictive and agentic AI; evaluate each layer on its own terms.',
    },
  ],
  keyPoints: [
    'Traditional AI predicts, classifies and detects from structured historical data; generative AI creates new content from language; agentic AI pursues goals using models plus tools and permissions.',
    'Pretrained foundation models are used as-is through prompts and grounding; fine-tuning further trains them on your examples to change style, format or narrow behaviour, not to add current knowledge.',
    'Small language models trade breadth for speed and cost; reasoning models trade cost for deeper multi-step analysis.',
    'Machine learning adds the most value for forecasting, scoring, recommendation and anomaly detection where there is lots of labelled data and a repeating decision.',
    'The ML lifecycle is define, prepare data, train and evaluate, deploy, monitor and retrain; GenAIOps follows the same loop with prompts and grounding instead of training.',
    'Generative AI delivers business value when tasks are frequent, language-heavy, grounded in existing information and tolerant of human review.',
    'Choose the solution with the least operational responsibility that meets the need: buy Copilot experiences first, extend with agents, build on Foundry last.',
  ],
  flashcards: [
    { front: 'What distinguishes generative AI from traditional AI?', back: 'Traditional AI produces predictions, classifications or anomaly flags for a defined purpose; generative AI creates new content (text, images, code) from a request and its context.' },
    { front: 'What is agentic AI?', back: 'AI that uses models with instructions and tools to pursue a goal: interpret a request, decide what to do, and take actions in connected systems within defined permissions.' },
    { front: 'What is a pretrained (foundation) model?', back: 'A model already trained on vast general data that you use as-is through prompts and grounding, without training it yourself.' },
    { front: 'What does fine-tuning change, and what does it not change?', back: 'It changes style, format, vocabulary and narrow behaviour by training on your examples. It does not reliably add current or private facts; that is the job of grounding and RAG.' },
    { front: 'Name four business scenarios where classic machine learning adds value.', back: 'Demand forecasting, fraud or churn scoring, recommendation and personalisation, anomaly detection (also predictive maintenance).' },
    { front: 'List the stages of the machine learning lifecycle.', back: 'Define the problem and metric; collect and prepare data; train and evaluate; deploy; monitor for drift and retrain.' },
    { front: 'What is model drift?', back: 'The decline in a deployed model\'s accuracy as the real world changes while the model stays the same; monitoring and retraining address it.' },
    { front: 'What are the two broad purposes for which organisations adopt AI, per Microsoft\'s guidance?', back: 'Enhance individual efficiency (drafting, research, meeting prep) and automate business functionality (agents, forecasting, decision support).' },
    { front: 'What signals make a use case a strong generative AI candidate?', back: 'High volume, repetitive, text or document centric, grounded in information the organisation has, tolerant of human review, measurable.' },
    { front: 'What is a small language model (SLM) best for?', back: 'Narrow, high-volume or on-device tasks where speed and low cost matter more than broad general knowledge.' },
  ],
  quiz: [
    {
      question:
        'A retailer wants to predict next month\'s demand for each of 12,000 products using five years of sales history. Which type of AI solution is the MOST appropriate?',
      options: [
        'A generative AI chat assistant grounded in the sales data',
        'A machine learning forecasting model trained on the historical sales data',
        'A fine-tuned large language model trained on the sales reports',
        'An image-generation model that renders demand charts',
      ],
      correct: [1],
      explanation:
        'Forecasting from structured historical series is a classic machine learning problem. A chat assistant or fine-tuned LLM generates language, not accurate numeric forecasts at scale, and image generation is irrelevant.',
    },
    {
      question:
        'A legal team wants an assistant that answers questions about the firm\'s current contract templates, which change monthly. The team proposes fine-tuning a model on the templates. What should you recommend instead?',
      options: [
        'Fine-tune the model every month on the latest templates',
        'Use a pretrained model grounded on the template library with retrieval so changes flow into answers automatically',
        'Train a small language model from scratch on the templates',
        'Use a reasoning model without any grounding so it infers the templates',
      ],
      correct: [1],
      explanation:
        'Fine-tuning shapes behaviour and does not reliably add current facts; monthly re-tuning is costly and still lags. Grounding a pretrained model on the live library is the fit. Training from scratch is impractical, and an ungrounded model would fabricate.',
    },
    {
      question: 'Which TWO statements correctly describe differences between pretrained and fine-tuned models? (Select two)',
      options: [
        'A pretrained model can be used immediately through prompts without any additional training.',
        'A fine-tuned model is created by further training a pretrained model on an organisation\'s own examples to adjust style, format or narrow behaviour.',
        'A fine-tuned model automatically stays up to date with new company documents.',
        'A pretrained model cannot be used for any business task until it is fine-tuned.',
      ],
      correct: [0, 1],
      explanation:
        'Pretrained models work as-is and fine-tuning adds behaviour from your examples. Fine-tuned models do not update themselves with new documents (that needs grounding), and pretrained models are used for most business tasks without fine-tuning.',
    },
    {
      question:
        'A COO must choose one pilot to prove the value of generative AI. Which candidate BEST demonstrates scalable business value?',
      options: [
        'Drafting the annual shareholder letter',
        'Summarising 30,000 customer-support transcripts a month into a standard template for quality review',
        'Generating a one-off logo for an internal event',
        'Calculating statutory tax liabilities for the finance close',
      ],
      correct: [1],
      explanation:
        'The transcript summariser is frequent, language-heavy, grounded in existing data and measurable, so value compounds with volume. The letter and logo are rare one-offs, and tax calculations demand exactness that generative AI should not own.',
    },
    {
      question: 'A deployed fraud-detection model that performed well at launch is now missing new fraud patterns. Which stage of the machine learning lifecycle addresses this?',
      options: [
        'Defining the business problem',
        'Monitoring for drift and retraining the model on recent data',
        'Prompt engineering the model\'s instructions',
        'Switching the model from pay-as-you-go to a commitment tier',
      ],
      correct: [1],
      explanation:
        'Declining accuracy as the world changes is drift, handled by monitoring and retraining. The problem definition has not changed, prompt engineering applies to language models, and billing tier does not affect accuracy.',
    },
    {
      question: 'An operations leader describes a solution that reads supplier emails, predicts delivery delays from historical data, and then updates purchase orders and notifies buyers without being asked. Which description is MOST accurate?',
      options: [
        'A traditional AI solution only, because it makes predictions',
        'A generative AI solution only, because it reads emails',
        'An agentic solution that combines generative AI for understanding, machine learning for prediction, and tools for taking action',
        'A fine-tuned model that replaces the purchasing team',
      ],
      correct: [2],
      explanation:
        'Reading language (generative), predicting from history (traditional ML) and acting across systems toward a goal (agentic) is the textbook combination. The single-type answers ignore the other layers, and nothing in the scenario is about fine-tuning.',
    },
  ],
  statements: [
    { text: 'Generative AI is the best choice for forecasting inventory demand from years of structured sales data.', isTrue: false, explanation: 'That is a classic machine learning forecasting problem; generative AI creates content rather than accurate numeric predictions at scale.' },
    { text: 'A pretrained foundation model can be used for business tasks without any further training.', isTrue: true, explanation: 'Prompts and grounding adapt pretrained models to most tasks; fine-tuning is the exception, not the rule.' },
    { text: 'Fine-tuning is the recommended way to keep a model informed about documents that change every month.', isTrue: false, explanation: 'Grounding and retrieval-augmented generation supply current facts; fine-tuning shapes behaviour and lags behind changing content.' },
    { text: 'Agentic AI uses models with instructions and tools to pursue a goal and take actions within defined permissions.', isTrue: true, explanation: 'That is Microsoft\'s description of agentic AI, which often combines generative and traditional AI.' },
    { text: 'The machine learning lifecycle ends when the model is deployed to production.', isTrue: false, explanation: 'Monitoring for drift and retraining are part of the lifecycle; models degrade as conditions change.' },
    { text: 'Generative AI delivers the most business value on tasks that are frequent, language-heavy and tolerant of human review.', isTrue: true, explanation: 'Value compounds with volume and repetition, and human review manages the risk of errors.' },
    { text: 'Microsoft recommends choosing the AI solution with the greatest customisation first, then simplifying later.', isTrue: false, explanation: 'The guidance is the opposite: approve the solution that meets requirements with the least operational responsibility, since customisation needs more skills and ownership.' },
  ],
  resources: [
    { label: 'Develop an AI strategy (Cloud Adoption Framework)', url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/ai/strategy' },
    { label: 'Fundamentals of generative AI (Microsoft Learn module)', url: 'https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/' },
    { label: 'What is Azure Machine Learning?', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/overview-what-is-azure-machine-learning' },
    { label: 'Fine-tuning overview (Microsoft Foundry)', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/fine-tuning-overview' },
  ],
};
