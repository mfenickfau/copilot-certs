import type { Concept } from '../../types';

export const modelDeploymentAndParameters: Concept = {
  id: 'model-deployment-and-parameters',
  title: 'Deploying a Model in Foundry and Tuning Its Parameters',
  summary:
    'What a deployment is, how to create one in the Microsoft Foundry portal, which deployment type to pick (Global Standard, Data Zone, Standard, Provisioned, Batch), and what temperature, top_p, max output tokens, stop sequences and penalties actually change when you test the model in the playground.',
  certs: ['ai-901', 'ai-103'],
  domains: ['ai-901-1', 'ai-901-2', 'ai-103-1'],
  outcomes: ['ai-901-1-2-3', 'ai-901-2-1-2', 'ai-103-1-2-2'],
  tags: ['foundry', 'deployment', 'playground', 'temperature', 'top-p', 'provisioned-throughput', 'intermediate'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Resources, projects and deployments',
      body: `Microsoft Foundry organises everything under a **Foundry resource** (an Azure resource of kind AIServices) that contains one or more **projects**. A project is the working boundary for a team: it holds model deployments, agents, connections, evaluations and the **project endpoint** your code calls, in the form \`https://<resource>.services.ai.azure.com/api/projects/<project>\`.

A **deployment** is an instance of a model made available for inference inside your resource, with a **deployment name** you choose. Your code never calls "GPT-4o"; it calls your deployment named, say, \`chat-prod\`. That indirection lets you swap the underlying model version without changing code. One resource can host many deployments of the same or different models.

To deploy in the portal: open the project, go to **Models + endpoints** (or browse the **model catalog**), select the model, choose **Deploy**, then set the deployment name, the **deployment type**, the model version and the **tokens-per-minute (TPM) quota** to allocate. The deployment appears in Models + endpoints with its endpoint URL and keys; selecting **Open in playground** lets you chat with it immediately. Some models (for example gpt-image-1 or Claude) require an access request or a Marketplace subscription before deployment. With **instant access (preview)** some models can be called by name in supported regions without creating a deployment at all.

Access is governed by Azure RBAC. Creating deployments needs a management role such as Cognitive Services Contributor on the resource; calling the deployment from code needs a data-plane role such as **Foundry User** (previously Azure AI User) on the project, which is what DefaultAzureCredential uses.`,
    },
    {
      heading: 'Deployment types: where data is processed and how you pay',
      body: `The deployment type answers three questions: where inference runs, how you are billed, and how predictable the performance is. The names combine a *data-processing scope* with a *billing model*.

| Deployment type | Processing location | Billing | Choose when |
|---|---|---|---|
| **Global Standard** | Any Azure region | Pay-per-token | Default. Newest models first, lowest price, highest quota |
| **Data Zone Standard** | Within the EU, US or APAC data zone | Pay-per-token | Need data to stay in a geopolitical zone |
| **Standard** (regional) | Within the Azure geography you chose | Pay-per-token | Strict residency in one geography, low volume |
| **Global / Data Zone / Regional Provisioned** | As above | Reserved **provisioned throughput units (PTUs)** | Consistent high volume, low latency variance, predictable cost |
| **Global Batch / Data Zone Batch** | As above | About 50% discount, 24-hour target turnaround | Large asynchronous jobs that are not time-sensitive |
| **Developer** | Any region | Pay-per-token, no SLA, 24-hour lifetime | Evaluating a fine-tuned model only |

Data **at rest** stays in your resource's geography for every type; the type controls where **inference** happens. Microsoft's guidance is to start with Global Standard and move only for a concrete reason: residency (Data Zone or Standard), reserved throughput (Provisioned) or cheap bulk processing (Batch). Standard types are best-effort and can show latency variance under heavy load; provisioned types guarantee throughput. Open-source and custom models on **managed compute** (you pick VM size and instance count) do not use these types at all; they are billed per compute hour.`,
    },
    {
      heading: 'Configuration parameters in the playground and the API',
      body: `After deployment you land in the **model playground** (chat for text models, images or video playground for those modalities). The playground has a **system message** box, the chat pane, and a parameters panel that maps directly to API fields:

- **Temperature** (0 to 2, default around 0.7 or 1): scales the randomness of sampling. Low values make output focused and repeatable, which suits extraction, classification and code; high values make it varied and creative, which suits brainstorming. Temperature 0 is the closest you get to deterministic.
- **Top P** (nucleus sampling, 0 to 1): limits sampling to the smallest set of tokens whose cumulative probability reaches P. It is an alternative way to control randomness. Microsoft recommends adjusting temperature *or* top_p, not both.
- **Max response / max output tokens**: a hard cap on generated tokens. Too low and answers are cut off mid-sentence; it does not make the model more concise, it just truncates.
- **Stop sequences**: up to four strings that end generation when emitted, useful for structured formats.
- **Frequency penalty** and **presence penalty** (-2 to 2): discourage repeating tokens that already appeared (frequency scales with how often; presence is a flat penalty once a token appears). Use them to reduce repetitive output.
- **Past messages included**: how many prior turns the playground sends back to the model, which trades context for tokens.

Reasoning models (GPT-5 reasoning modes, o-series) ignore or reject temperature and top_p and instead expose a **reasoning effort** setting. The playground's **Code** tab (View code) exports the current configuration as Python, C#, JavaScript or curl so you can move from experiment to application, and **Open in VS Code** imports the sample with your endpoint.`,
    },
    {
      heading: 'The exam angle',
      body: `Deployment questions are about matching a constraint to a type: "all inference must occur within the EU" (Data Zone Standard or Data Zone Provisioned), "consistent latency for a high-volume contact centre" (Provisioned, PTUs), "process ten million reviews overnight at the lowest cost" (Global Batch), "fastest way to try a brand-new model" (Global Standard, or instant access where available). Watch for the trap that "Standard" alone means *regional* standard, which has lower quota and later model availability than Global Standard.

Parameter questions give you a symptom: "responses vary each time and the task is data extraction" (lower temperature), "answers are cut off" (raise max output tokens, not temperature), "the model keeps repeating the same phrase" (increase frequency penalty), "needs more creative variety" (raise temperature or top_p). Another common item: "You changed the model version; what must the application change?" The answer is nothing, if the deployment name is unchanged.

Portal-path questions are simple but easy to get wrong under pressure: Models + endpoints is where deployments live and where you find endpoint and key; the model catalog is where you browse and deploy; the playground is where you test; the Code tab exports a sample. Remember that the exam calls the platform **Microsoft Foundry** (formerly Azure AI Foundry) and the portal the **Foundry portal**.`,
    },
  ],
  examples: [
    {
      title: 'Picking the deployment type for a European bank',
      description:
        'A bank in Germany wants to use GPT-4.1 for customer correspondence and its compliance team requires that prompts and responses never be processed outside the EU. Global Standard would route traffic to any Azure region, so it is excluded. Data Zone Standard keeps inference inside the EU data zone at pay-per-token prices and is the right first choice; if traffic later becomes high and steady, Data Zone Provisioned adds guaranteed throughput with the same residency guarantee.',
      takeaway: 'Residency requirements choose the processing scope (Global, Data Zone, Regional); volume and latency requirements choose Standard versus Provisioned.',
    },
    {
      title: 'Fixing truncated answers by turning the wrong knob (a realistic mistake)',
      description:
        'A developer notices that the model\'s summaries stop mid-sentence. They lower the temperature to 0 assuming "more focused" means "shorter and complete". The summaries become more deterministic but are still cut off. The real cause is max output tokens set to 100 in the playground export. Raising max_output_tokens fixes it; temperature was never the issue.',
      language: 'python',
      code: `response = openai.responses.create(
    model="chat-prod",            # deployment name, not the model name
    input=prompt,
    temperature=0.2,              # low randomness for a summarisation task
    max_output_tokens=800,        # was 100: this is what caused the truncation
)
print(response.output_text)`,
      takeaway: 'Max output tokens truncates; temperature controls randomness. Diagnose the symptom before changing a parameter.',
    },
    {
      title: 'Swapping model versions without touching code',
      description:
        'An application calls a deployment named "assistant-v1" that runs gpt-4o. The team wants to move to gpt-4.1. In the portal they edit the deployment (or create a new deployment with the same name after deleting the old one), and the application continues to call "assistant-v1" with no code change. In Standard deployments they can also enable automatic version upgrades so new minor versions roll out when Microsoft releases them.',
      takeaway: 'The deployment name is the stable contract between code and model; change what sits behind it, not the code.',
    },
  ],
  keyPoints: [
    'Structure: Foundry resource > project > deployments; code calls the project endpoint and a deployment name you choose, not the model name.',
    'Deploy from the model catalog or Models + endpoints: pick model, deployment name, deployment type, version and TPM quota; Open in playground to test.',
    'Global Standard is the default (newest models, lowest price, highest quota); Data Zone keeps inference in EU, US or APAC; regional Standard keeps it in one geography.',
    'Provisioned types reserve PTUs for predictable throughput and latency; Batch types process large asynchronous jobs at roughly half price within 24 hours.',
    'Data at rest always stays in your geography; the deployment type controls where inference is processed.',
    'Temperature and top_p control randomness (adjust one, not both); max output tokens truncates; stop sequences end generation; frequency and presence penalties reduce repetition.',
    'Reasoning models replace temperature with a reasoning effort setting.',
    'The playground\'s Code tab exports your configuration; changing the model behind a deployment name requires no application change.',
  ],
  flashcards: [
    { front: 'What is a model deployment in Foundry?', back: 'An instance of a model made available for inference in your resource under a deployment name you choose; your code calls that name.' },
    { front: 'Which deployment type should you start with for most workloads, and why?', back: 'Global Standard: newest models first, lowest price, highest quota, broadest regions.' },
    { front: 'Which deployment type keeps inference within the EU, US or APAC?', back: 'Data Zone Standard or Data Zone Provisioned.' },
    { front: 'What are PTUs and which deployment types use them?', back: 'Provisioned throughput units: reserved capacity bought for Provisioned deployment types, giving predictable throughput and lower latency variance.' },
    { front: 'Which deployment type suits a large overnight job that is not time-sensitive?', back: 'Global Batch (or Data Zone Batch): about 50% discount with a 24-hour target turnaround.' },
    { front: 'What does temperature control?', back: 'The randomness of token sampling: low values give focused, repeatable output; high values give varied, creative output.' },
    { front: 'What does max output tokens do, and what does it not do?', back: 'It caps the number of generated tokens (truncating if reached). It does not make the model write more concisely.' },
    { front: 'What is top_p?', back: 'Nucleus sampling: restrict sampling to the smallest set of tokens whose cumulative probability reaches p. Adjust temperature or top_p, not both.' },
    { front: 'Where in the Foundry portal do you find a deployment\'s endpoint and key?', back: 'Models + endpoints, on the deployment\'s details page.' },
    { front: 'What is the format of a Foundry project endpoint?', back: 'https://<resource-name>.services.ai.azure.com/api/projects/<project-name>' },
    { front: 'Which penalty reduces repetition of tokens in proportion to how often they already appeared?', back: 'Frequency penalty (presence penalty is a flat penalty once a token has appeared).' },
  ],
  quiz: [
    {
      question:
        'A healthcare provider in France must ensure that prompts and model responses are processed only within the European Union. Traffic is moderate and bursty. Which deployment type is MOST appropriate?',
      options: ['Global Standard', 'Data Zone Standard', 'Global Batch', 'Developer'],
      correct: [1],
      explanation:
        'Data Zone Standard processes inference within the EU data zone at pay-per-token prices, suiting bursty traffic. Global Standard and Global Batch may process in any region, and Developer deployments have no residency guarantee or SLA.',
    },
    {
      question:
        'A contact centre handles a steady 2,000 requests per minute and needs consistent low latency with predictable monthly cost. Which deployment type should you recommend?',
      options: ['Global Standard', 'Standard (regional)', 'Global Provisioned', 'Global Batch'],
      correct: [2],
      explanation:
        'Provisioned deployments reserve PTUs for guaranteed throughput and lower latency variance. Standard types are best-effort pay-per-token, and Batch is asynchronous with a 24-hour turnaround.',
    },
    {
      question:
        'You are extracting invoice totals from text in the Foundry chat playground. The same prompt returns slightly different values on each run. Which change is MOST likely to make the output consistent?',
      options: ['Increase max response tokens', 'Lower the temperature towards 0', 'Increase the presence penalty', 'Add more past messages'],
      correct: [1],
      explanation:
        'Temperature controls sampling randomness; lowering it makes outputs repeatable. Max tokens affects length, presence penalty affects repetition, and past messages affect context.',
    },
    {
      question: 'Which TWO statements about deployment types are correct? (Select two)',
      options: [
        'Data stored at rest remains in your resource\'s Azure geography for all deployment types.',
        'Global Standard deployments guarantee that inference happens in the region where the resource was created.',
        'Batch deployments offer a significant discount in exchange for asynchronous processing with a 24-hour target.',
        'Provisioned deployments are billed per token with no reserved capacity.',
      ],
      correct: [0, 2],
      explanation:
        'At-rest residency holds for every type, and Batch trades latency for price. Global types may process inference in any region, and Provisioned types reserve PTUs rather than billing per token.',
    },
    {
      question:
        'A developer\'s application calls a deployment named "writer". The team wants to upgrade the underlying model from gpt-4o to gpt-4.1 without redeploying the application. What should they do?',
      options: [
        'Change the model behind the existing deployment name in the Foundry portal.',
        'Create a new deployment named "gpt-4.1" and update every call in the application code.',
        'Raise the temperature so the model behaves like the newer version.',
        'Switch the deployment type to Provisioned.',
      ],
      correct: [0],
      explanation:
        'The deployment name is the contract with the code; updating what sits behind it needs no code change. Renaming forces code edits, and temperature or deployment type do not change the model.',
    },
    {
      question:
        'Responses from a deployed model stop mid-sentence. Which parameter should you adjust FIRST?',
      options: ['Temperature', 'Top P', 'Max response (max output tokens)', 'Stop sequences'],
      correct: [2],
      explanation:
        'Truncation means the output token cap was reached. Temperature and top_p control randomness; stop sequences could be a cause only if the output contained the stop string, which is less likely than hitting the cap.',
    },
  ],
  statements: [
    { text: 'Application code calls a model by its deployment name rather than by the model\'s catalog name.', isTrue: true, explanation: 'The deployment name is the stable identifier you choose; it lets you change the underlying model without code changes.' },
    { text: 'Global Standard is the recommended starting deployment type for most workloads.', isTrue: true, explanation: 'It gets new models first, has the lowest price and the highest default quota.' },
    { text: 'Data Zone deployments may process inference in any Azure region worldwide.', isTrue: false, explanation: 'Data Zone types restrict inference to the chosen zone (EU, US or APAC); Global types may use any region.' },
    { text: 'Lowering max output tokens makes a model write more concise, complete answers.', isTrue: false, explanation: 'It simply truncates the output when the cap is reached; conciseness comes from the prompt.' },
    { text: 'Microsoft recommends adjusting temperature or top_p, but not both at the same time.', isTrue: true, explanation: 'Both control randomness; changing both makes behaviour hard to reason about.' },
    { text: 'Provisioned deployments are billed only for tokens consumed.', isTrue: false, explanation: 'Provisioned deployments reserve PTUs (capacity) and are billed for that reservation.' },
    { text: 'The Foundry playground can export the current prompt and parameters as code in several languages.', isTrue: true, explanation: 'The Code (View code) tab produces Python, C#, JavaScript or curl samples.' },
  ],
  resources: [
    { label: 'Deployment types for Microsoft Foundry Models', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/foundry-models/concepts/deployment-types' },
    { label: 'Deploy Azure OpenAI models in Foundry', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/deploy-models-openai' },
    { label: 'Microsoft Foundry playgrounds', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/concept-playgrounds' },
    { label: 'Quickstart: use the chat playground in Foundry', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/quickstarts/get-started-playground' },
  ],
};
