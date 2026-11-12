import type { Concept } from '../../types';

export const promptsAndChatClients: Concept = {
  id: 'prompts-and-chat-clients',
  title: 'Effective Prompts, Grounding and a Lightweight Chat Client with the Foundry SDK',
  summary:
    'How system and user prompts shape model behaviour, the techniques that reliably improve results (role, context, examples, format, constraints), why grounding with your own data beats hoping the model knows, and the minimal Python chat client built on azure-ai-projects and the Responses API that the exam expects you to recognise.',
  certs: ['ai-901', 'ai-103'],
  domains: ['ai-901-2', 'ai-103-2'],
  outcomes: ['ai-901-2-1-1', 'ai-901-2-1-3', 'ai-103-2-3-1', 'ai-103-2-1-6'],
  tags: ['prompt-engineering', 'system-message', 'rag', 'grounding', 'foundry-sdk', 'responses-api', 'python', 'intermediate'],
  difficulty: 'intermediate',
  diagram: 'rag-pipeline',
  sections: [
    {
      heading: 'System prompts and user prompts',
      body: `A chat request carries messages with **roles**. The **system message** (also called instructions or the developer message) is written by you, the builder, and sets the model's persona, scope, rules and output format for the whole conversation. The **user message** is what the end user types each turn. **Assistant messages** are the model's earlier replies, replayed so it has conversational memory. In the Foundry playground the system message lives in the setup panel; in the Responses API it is the \`instructions\` parameter, and in Chat Completions it is the message with \`role: "system"\`.

A good system prompt answers five questions:

1. **Who is the model?** A role and tone ("You are a support assistant for Contoso's billing team. Be concise and factual.").
2. **What may it do, and not do?** Scope and refusals ("Only answer questions about Contoso billing. If asked anything else, say you cannot help with that.").
3. **What does it know?** Context, definitions, or the instruction to rely only on provided documents.
4. **How should it answer?** Format (bullet list, JSON schema, maximum length, language), and what to do when unsure ("If the answer is not in the provided context, say so rather than guessing").
5. **How should it behave safely?** Guardrails against revealing the system prompt, following instructions embedded in documents, or producing harmful content.

User prompts benefit from the same clarity: state the task, provide the content to act on, specify the output. Microsoft's prompt-engineering guidance describes prompt components as **instructions**, **primary content** (the text to transform), **examples**, **cues** (a leading phrase such as "Summary:") and **supporting content** (dates, preferences, retrieved data). The ordering matters: models weight the end of a prompt heavily, so put the key instruction last when the content is long. Note that reasoning models (GPT-5, o-series) want shorter, more direct prompts and do not need chain-of-thought coaxing.`,
    },
    {
      heading: 'Techniques that reliably improve results',
      body: `- **Be specific and descriptive.** "Write a 120-word product summary in British English for IT managers, highlighting security and cost" beats "Write a summary".
- **Few-shot examples.** Show two or three input-output pairs in the format you want. This is the single most effective way to get consistent structure, especially for classification and extraction.
- **Ask for structured output.** Request JSON with named fields, or use the API's structured outputs with a schema, so your code can parse the result safely.
- **Break the task into steps.** For complex tasks, ask the model to work through steps or split into several calls (extract, then classify, then draft). Chain-of-thought instructions help standard chat models; reasoning models do it internally.
- **Give the model an out.** "If you do not know, answer 'I don't know'" measurably reduces fabrication.
- **Repeat key instructions** at the end of a long prompt, and use clear delimiters (triple quotes, XML-style tags) to separate instructions from content so that text inside a document is not mistaken for a command (a basic defence against **prompt injection**).
- **Set parameters to match the task.** Low temperature for extraction, higher for ideation.
- **Iterate in the playground.** Compare two or three prompt variants side by side, then export the winner with the Code tab.

What prompting cannot do: it cannot teach the model facts it never saw (new product data, your policies, yesterday's prices) in a durable way, and it cannot make the model stop fabricating when it has no source. That is what grounding is for.`,
    },
    {
      heading: 'Grounding: retrieval-augmented generation in one paragraph',
      body: `**Grounding** means supplying the model with trusted, relevant data at request time so it answers from that data rather than from memory. The standard pattern is **retrieval-augmented generation (RAG)**:

1. **Ingest**: split your documents into chunks, create embeddings for each chunk and store them in an index (Azure AI Search is the usual choice; Content Understanding can produce clean markdown chunks from PDFs, images and recordings first).
2. **Retrieve**: when a user asks a question, embed the question, find the most similar chunks (vector, keyword or hybrid search).
3. **Augment**: insert the retrieved chunks into the prompt as supporting content, with an instruction to answer only from them and to cite them.
4. **Generate**: the model writes the answer with citations.

In Foundry you can do this without code by adding a **knowledge source** (file search, Azure AI Search index, SharePoint) to an agent in the agents playground, or in code by calling the search index yourself and building the prompt. Grounding is the right answer whenever a scenario mentions private documents, current data, reducing hallucinations, or citations. **Fine-tuning** is the distractor: it changes style and skill, not knowledge, and it cannot keep up with changing data.`,
    },
    {
      heading: 'A lightweight chat client with the Foundry SDK',
      body: `The exam expects you to recognise the shape of a minimal client built with the **Microsoft Foundry SDK**. In Python that is the \`azure-ai-projects\` package (2.x) plus \`azure-identity\`:

1. Create an **AIProjectClient** with the **project endpoint** and a credential. **DefaultAzureCredential** picks up your \`az login\` identity locally and a managed identity in Azure, so no key is stored in code.
2. Call \`project.get_openai_client()\` to obtain an OpenAI-compatible client pre-wired to your project.
3. Call \`responses.create(model=<deployment name>, instructions=<system prompt>, input=<user prompt>)\` and read \`output_text\`. For a multi-turn chat, keep an array of messages (or a server-side **conversation**) and send the history each time.

The **Responses API** is the current primary API and the one the new Foundry agent runtime uses; the older **Chat Completions API** (\`chat.completions.create\` with a messages array) still works for direct model calls and appears in older samples. Both identify the model by **deployment name**. The same pattern exists in C# (Azure.AI.Projects), JavaScript (@azure/ai-projects) and Java, and the REST API takes an Entra bearer token. In the exam, answers that paste keys into code, call the model by catalog name instead of deployment name, or use a connection string (the retired hub-based approach) are wrong.`,
    },
  ],
  examples: [
    {
      title: 'A minimal Python chat loop with the Foundry SDK',
      description:
        'The whole lightweight client: authenticate, get an OpenAI client bound to the project, send a system prompt and loop on user input while keeping history so the model has conversational memory.',
      language: 'python',
      code: `from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

ENDPOINT = "https://my-resource.services.ai.azure.com/api/projects/my-project"
SYSTEM = ("You are a concise assistant for Contoso HR. Answer only HR policy questions. "
          "If the answer is not in the provided context, say you don't know.")

project = AIProjectClient(endpoint=ENDPOINT, credential=DefaultAzureCredential())
openai = project.get_openai_client()

history = []
while True:
    user = input("You: ")
    if user.lower() in ("quit", "exit"):
        break
    history.append({"role": "user", "content": user})
    response = openai.responses.create(
        model="gpt-5-mini",          # deployment name
        instructions=SYSTEM,         # system prompt
        input=history,               # full conversation so far
        temperature=0.3,
    )
    print("Assistant:", response.output_text)
    history.append({"role": "assistant", "content": response.output_text})`,
      takeaway: 'AIProjectClient + DefaultAzureCredential + get_openai_client + responses.create is the canonical lightweight Foundry chat client.',
    },
    {
      title: 'A vague prompt versus a specific one',
      description:
        'A marketer asks a model to "write about our new headphones" and gets a generic paragraph. The improved prompt sets a role, provides the product facts as primary content inside delimiters, specifies audience, length and format, and asks for a cue-led output. The second version produces usable copy on the first try.',
      language: 'text',
      code: `Weak:
  Write about our new headphones.

Strong:
  You are a copywriter for an audio brand. Using ONLY the facts between <facts> tags,
  write a 60-word product blurb for commuters, upbeat tone, UK spelling, ending with
  a one-line call to action. Do not invent features.
  <facts>Model: Aria X. 40h battery. Active noise cancelling. USB-C. Folds flat.</facts>
  Blurb:`,
      takeaway: 'Role, delimited primary content, audience, length, format, and a "do not invent" rule turn a vague request into a reliable one.',
    },
    {
      title: 'Fixing hallucinated policy answers with grounding (a realistic mistake)',
      description:
        'An HR assistant built on a plain chat model confidently cites "28 days annual leave" when the company offers 25. The team first tries rewriting the system prompt ("be accurate") with no effect, then considers fine-tuning. The actual fix is grounding: index the HR handbook in Azure AI Search (or attach it as a file search knowledge source to an agent), retrieve the relevant section for each question, include it in the prompt and instruct the model to answer only from it with citations. Accuracy jumps and answers can be verified.',
      language: 'python',
      code: `context = search_handbook(user_question)   # your retrieval step (Azure AI Search)
response = openai.responses.create(
    model="gpt-5-mini",
    instructions=("Answer using ONLY the context below. Cite the section title. "
                  "If the context does not contain the answer, say so.\\n\\nContext:\\n" + context),
    input=user_question,
)`,
      takeaway: 'Fabricated facts are a grounding problem, not a wording problem; retrieval plus a "only from context" instruction is the fix.',
    },
  ],
  keyPoints: [
    'System message: builder-defined persona, scope, rules, format and safety; user message: the end user\'s request each turn; assistant messages: replayed history for memory.',
    'Prompt components: instructions, primary content, examples, cues and supporting content; put key instructions at the end of long prompts and use delimiters.',
    'Techniques: be specific, add few-shot examples, request structured output, break tasks into steps, give the model an out, match temperature to the task, iterate in the playground.',
    'Grounding (RAG) supplies trusted data at request time: ingest and index, retrieve by similarity, augment the prompt, generate with citations; it is the fix for hallucinations and stale or private knowledge.',
    'Fine-tuning changes style and skill, not knowledge; it is the usual distractor when grounding is the answer.',
    'Lightweight client: azure-ai-projects AIProjectClient(endpoint, DefaultAzureCredential()) -> get_openai_client() -> responses.create(model=deployment, instructions, input).',
    'Use the project endpoint and deployment name; never embed keys; the Responses API is primary, Chat Completions still works for direct model calls.',
  ],
  flashcards: [
    { front: 'What is the system message for?', back: 'Builder-defined instructions that set the model\'s role, scope, rules, output format and safety behaviour for the whole conversation.' },
    { front: 'Name Microsoft\'s five prompt components.', back: 'Instructions, primary content, examples, cues, supporting content.' },
    { front: 'What is few-shot prompting?', back: 'Including a few example input-output pairs in the prompt so the model copies the pattern and format.' },
    { front: 'Why put the main instruction at the end of a long prompt?', back: 'Models weight recent tokens more heavily, so instructions placed after long content are followed more reliably.' },
    { front: 'What is grounding?', back: 'Supplying trusted, relevant data in the prompt at request time so the model answers from it rather than from memory.' },
    { front: 'List the four RAG steps.', back: 'Ingest (chunk and embed into an index), retrieve (find similar chunks), augment (add them to the prompt), generate (answer with citations).' },
    { front: 'Grounding or fine-tuning for data that changes weekly?', back: 'Grounding (RAG). Fine-tuning does not keep up with changing data and is for style or skill.' },
    { front: 'Which Python package and class create a Foundry project client?', back: 'azure-ai-projects, class AIProjectClient(endpoint=..., credential=DefaultAzureCredential()).' },
    { front: 'How do you get an OpenAI-compatible client from a Foundry project in Python?', back: 'project.get_openai_client(), then call openai.responses.create(model=<deployment name>, input=...).' },
    { front: 'Which credential class avoids storing keys in code?', back: 'DefaultAzureCredential from azure-identity (uses az login locally and managed identity in Azure).' },
    { front: 'What simple instruction reduces fabricated answers?', back: 'Tell the model to say "I don\'t know" when the answer is not in the provided context.' },
  ],
  quiz: [
    {
      question:
        'A chatbot built on a general-purpose model answers questions about an internal benefits policy but frequently states incorrect figures. Which approach is MOST likely to fix the problem?',
      options: [
        'Increase the temperature to make the model more confident.',
        'Ground the model by retrieving relevant policy sections and instructing it to answer only from them.',
        'Fine-tune the model on last year\'s benefits brochure.',
        'Switch from the Responses API to the Chat Completions API.',
      ],
      correct: [1],
      explanation:
        'Incorrect facts about private data are solved by grounding (RAG). Temperature does not add knowledge, fine-tuning bakes in stale information and cannot track changes, and the API choice does not affect accuracy.',
    },
    {
      question:
        'You want a model to classify support tickets into exactly one of five categories and return only the category name. Which TWO prompt techniques are MOST effective? (Select two)',
      options: [
        'Provide a few labelled example tickets in the prompt.',
        'Raise the temperature to 1.5 for variety.',
        'State the allowed categories and the required output format explicitly in the system message.',
        'Remove the system message so the model can decide the format.',
      ],
      correct: [0, 2],
      explanation:
        'Few-shot examples and explicit constraints on labels and format drive consistent classification. High temperature increases randomness, and removing the system message removes the constraints.',
    },
    {
      question:
        'Which Python statement correctly creates a client for a Microsoft Foundry project without embedding a secret in code?',
      options: [
        'AIProjectClient(endpoint=PROJECT_ENDPOINT, credential=DefaultAzureCredential())',
        'AIProjectClient(connection_string="...;key=abc123")',
        'AIProjectClient(model="gpt-4o", api_key="abc123")',
        'OpenAI(api_key="abc123")',
      ],
      correct: [0],
      explanation:
        'The project endpoint plus DefaultAzureCredential is the supported, keyless pattern. Connection strings belong to the retired hub-based approach, and the other options embed a key or skip the project entirely.',
    },
    {
      question:
        'A developer writes: response = openai.responses.create(model="gpt-4.1", input="Hello") and receives an error that the model is not found, even though gpt-4.1 is deployed under the name "chat-main". What is the problem?',
      options: [
        'The Responses API does not support gpt-4.1.',
        'The model parameter must be the deployment name ("chat-main"), not the catalog model name.',
        'The input must be a list of messages, not a string.',
        'DefaultAzureCredential cannot be used with the Responses API.',
      ],
      correct: [1],
      explanation:
        'Requests address models by deployment name. The Responses API supports gpt-4.1, a plain string input is valid, and DefaultAzureCredential works with the project client.',
    },
    {
      question:
        'Which element of a prompt should contain the rule "Only answer questions about Contoso billing; refuse anything else"?',
      options: ['The user message', 'The system message (instructions)', 'The stop sequence', 'The max output tokens parameter'],
      correct: [1],
      explanation:
        'Scope and behavioural rules belong in the system message so they apply to every turn. User messages are the end user\'s input, and stop sequences and max tokens control generation mechanics.',
    },
    {
      question:
        'A long prompt includes a 3,000-word article followed by the instruction "Summarise in three bullets". The model sometimes ignores the bullet requirement. What is the BEST first adjustment?',
      options: [
        'Move the instruction before the article and repeat it after the article, using delimiters around the article.',
        'Increase the frequency penalty.',
        'Lower max output tokens to 50.',
        'Replace the model with an embedding model.',
      ],
      correct: [0],
      explanation:
        'Instruction placement and delimiters are the standard fixes for ignored instructions in long prompts. Frequency penalty affects repetition, a tiny token cap truncates, and embedding models do not generate text.',
    },
  ],
  statements: [
    { text: 'The system message is written by the application builder and applies across the conversation.', isTrue: true, explanation: 'It sets persona, scope, format and safety rules for every turn.' },
    { text: 'Fine-tuning is the recommended way to keep a model up to date with documents that change frequently.', isTrue: false, explanation: 'Grounding (RAG) supplies current data at request time; fine-tuning changes style and skill and goes stale.' },
    { text: 'Few-shot examples in a prompt help the model produce consistent output formats.', isTrue: true, explanation: 'Examples are one of the most effective prompt components for structure and classification.' },
    { text: 'In the Foundry SDK, the model parameter of responses.create should be the model\'s catalog name such as "gpt-4o".', isTrue: false, explanation: 'It should be your deployment name (which may or may not equal the model name).' },
    { text: 'DefaultAzureCredential lets the same code authenticate with a developer\'s az login locally and a managed identity in Azure.', isTrue: true, explanation: 'This is why it is the recommended credential and avoids keys in code.' },
    { text: 'Telling a model to say "I don\'t know" when the answer is not in the context tends to reduce fabricated answers.', isTrue: true, explanation: 'Giving the model an explicit alternative to guessing is a documented technique.' },
    { text: 'Reasoning models such as GPT-5 benefit most from long chain-of-thought instructions in the prompt.', isTrue: false, explanation: 'Reasoning models reason internally and respond best to short, direct prompts.' },
  ],
  resources: [
    { label: 'Quickstart: Get started with the Microsoft Foundry SDK', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/quickstarts/get-started-code' },
    { label: 'Prompt engineering techniques', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/prompt-engineering' },
    { label: 'System message design', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/system-message' },
    { label: 'Retrieval-augmented generation in Foundry', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/retrieval-augmented-generation' },
  ],
};
