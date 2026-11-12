import type { Concept } from '../../types';

export const generativeAiModels: Concept = {
  id: 'generative-ai-models',
  title: 'How Generative AI Models Work and How to Choose One',
  summary:
    'Tokens, embeddings, transformers and next-token prediction explained for someone starting out, followed by the practical question the exam keeps asking: given a task, which kind of model fits (large or small language model, reasoning, multimodal, embedding, image or audio) and where you find it in the Foundry model catalog.',
  certs: ['ai-901', 'ai-103'],
  domains: ['ai-901-1', 'ai-103-1'],
  outcomes: ['ai-901-1-2-1', 'ai-901-1-2-2', 'ai-103-1-1-1'],
  tags: ['generative-ai', 'llm', 'tokens', 'transformers', 'embeddings', 'model-catalog', 'foundations'],
  difficulty: 'foundations',
  diagram: 'context-window',
  sections: [
    {
      heading: 'From text to tokens to probabilities',
      body: `A generative language model does one thing repeatedly: given a sequence of **tokens**, it predicts a probability distribution over the next token, picks one, appends it, and repeats until it emits a stop token or hits a limit. Everything else, from chat to code generation to summarisation, is built on that loop.

- **Tokens** are the units the model reads and writes. A tokenizer splits text into pieces that are roughly word fragments: "unbelievable" might become "un", "believ", "able". In English, one token is around four characters or three-quarters of a word. Pricing, rate limits and the **context window** (the maximum tokens a model can attend to in one request, prompt plus output) are all measured in tokens.
- **Embeddings** are numeric vectors that represent the meaning of a token, sentence or document. Text with similar meaning lands close together in vector space. Models use embeddings internally, and dedicated **embedding models** (such as text-embedding-3) expose them so you can do semantic search and retrieval-augmented generation (RAG).
- **Transformers** are the neural network architecture behind modern language models. Their key mechanism, **attention**, lets every token weigh the relevance of every other token in the context, which is how a model keeps track of what "it" refers to three paragraphs back.
- **Training** happens in stages: pre-training on vast text corpora (learn language and world knowledge), then fine-tuning and alignment with human feedback (learn to follow instructions and refuse harmful requests). The model's knowledge is frozen at its training cutoff; anything newer must arrive through the prompt.

The practical consequences matter more than the maths. Because output is sampled from a probability distribution, the same prompt can give different answers, and a fluent answer is not necessarily a correct one (a **hallucination** or fabrication). Because the model only sees its context window, long conversations and large documents must be trimmed, summarised or retrieved selectively.`,
    },
    {
      heading: 'Model families and what each is for',
      body: `The Foundry model catalog lists thousands of models from Microsoft, OpenAI, Anthropic, Meta, Mistral, DeepSeek, Cohere, Hugging Face and others. They fall into recognisable families, and the exam expects you to match a task to the right family:

| Family | Examples | Best for |
|---|---|---|
| Large language model (LLM) | GPT-5, GPT-4.1, Claude, Llama 3 (large) | Broad knowledge, complex instructions, long-context reasoning, agents |
| Small language model (SLM) | Phi-4, Phi-4-mini, Llama 3 (8B) | Low latency, low cost, edge or on-device, narrow well-defined tasks, fine-tuning |
| Reasoning model | o-series, GPT-5 (reasoning), DeepSeek-R1 | Multi-step logic, maths, planning; slower and more expensive per request |
| Multimodal model | GPT-4o, GPT-5, gpt-audio, Claude (vision) | Input that mixes text with images or audio; one model instead of a pipeline |
| Embedding model | text-embedding-3-large / -small | Vector search, RAG, clustering, semantic similarity; produces vectors, not text |
| Image generation | gpt-image-1 / gpt-image-2 series, FLUX | Create or edit images from text and reference images |
| Audio / speech models | gpt-realtime, gpt-audio, gpt-4o-mini-tts, Whisper | Live voice conversations, speech in or out |
| Domain or industry models | Healthcare, financial, task-specific models | Specialised vocabulary and compliance needs |

Two cross-cutting distinctions: **Foundry Models sold by Azure** (hosted and supported by Microsoft under Microsoft product terms, with SLAs) versus **models from partners and community** (billed through Azure Marketplace, supported by the provider), and **open-weight** models you can fine-tune and self-host versus **proprietary** models accessed only through an API.`,
    },
    {
      heading: 'Choosing a model: the questions to ask',
      body: `Model choice is a trade-off, and the exam phrases it as "which model is MOST appropriate". Work through these questions in order:

1. **What modalities are in and out?** Text only, or do you need to read images, hear audio, or produce an image or speech? If the input is a photo, you need a multimodal (vision-enabled) model, not an LLM plus a separate OCR step, unless you specifically need OCR coordinates.
2. **How hard is the task?** Classification, extraction and short rewrites are SLM territory. Multi-step reasoning over long documents, or orchestrating tools in an agent, favours a frontier LLM or reasoning model.
3. **What are the latency and cost constraints?** A customer-facing chat needs sub-second first tokens; a nightly batch job does not. Smaller models are faster and cheaper; reasoning models are slower and pricier.
4. **Where must it run?** On-device, in a container or in a restricted region points to an SLM or open-weight model. Data-residency requirements influence the deployment type rather than the model (covered in the deployment concept).
5. **Does it need customisation?** If you have thousands of labelled examples and a stable task, fine-tuning an SLM or an open model can beat prompting a large one. If you need current or private knowledge, use grounding (RAG) rather than retraining.
6. **Is it for retrieval?** If the output is "which documents are similar", you want an embedding model, and no amount of prompting a chat model substitutes for one.

In the Foundry portal, the **model catalog** lets you filter by provider, modality, deployment type and licence, read each **model card** (capabilities, limitations, responsible-AI notes), compare **benchmarks and leaderboards** for quality, cost and latency, and try models in the playground before deploying. Comparing two or three candidates on your own prompts in the playground is the recommended last step before committing.`,
    },
    {
      heading: 'The exam angle',
      body: `Expect questions of three kinds.

**Mechanism questions.** "Which term describes the units a model reads and writes?" (tokens). "What limits how much text can be sent in one request?" (the context window). "Why does the same prompt give different answers?" (sampling from a probability distribution; temperature). "Why does the model not know about last month's product launch?" (training cutoff; use grounding). "What is a numeric representation of meaning used for semantic search?" (embedding).

**Selection questions.** A scenario gives a task plus a constraint and asks for the model type. Signals: "photo of a damaged vehicle" means multimodal; "must run on a factory device with no internet" means SLM or open-weight; "step-by-step mathematical proofs" means reasoning model; "find similar support tickets" means embedding model; "generate marketing images" means an image-generation model; "lowest cost for a simple classification at high volume" means SLM.

**Catalog questions.** "Where would you compare quality and cost of candidate models?" (model catalog benchmarks and leaderboards). "What document describes a model's intended use and limitations?" (the model card). "A model is billed through Azure Marketplace and supported by its provider; which category?" (models from partners and community).

The distractors are usually a model family that solves a neighbouring problem: an embedding model offered for a chat task, an LLM offered when the scenario screams for an image model, or fine-tuning offered when the real need is fresh data (which calls for grounding).`,
    },
  ],
  examples: [
    {
      title: 'The support-ticket search that used the wrong model',
      description:
        'A team wants to find historical tickets similar to a new one. They prompt GPT-4o with "here are 5,000 tickets, which are similar to this?" and hit the context-window limit and a large bill. The fix is to generate embeddings for every ticket with an embedding model, store them in a vector index (Azure AI Search), embed the new ticket and return the nearest neighbours, then optionally let an LLM summarise the top matches.',
      language: 'python',
      code: `# Embed once, search many times
openai = project.get_openai_client()
vec = openai.embeddings.create(
    model="text-embedding-3-small",   # your embedding deployment name
    input="Customer cannot reset password after MFA change",
).data[0].embedding
# -> list of floats; store in a vector index and compare by cosine similarity`,
      takeaway: 'Similarity and retrieval tasks call for an embedding model plus a vector index, not a chat model stuffed with every document.',
    },
    {
      title: 'Picking a model for a kiosk with no connectivity (a realistic mistake)',
      description:
        'A retailer builds an in-store kiosk that answers questions about product availability from a small local catalogue. The first design calls a frontier LLM in the cloud, but the stores have unreliable connectivity and the latency is unacceptable. Switching to a small language model (Phi-4-mini) running locally in a container meets the latency need, cuts cost and keeps working offline, because the task is narrow and the knowledge lives in the local catalogue, not the model.',
      takeaway: 'Narrow task, tight latency, offline or edge: choose a small language model. Save frontier LLMs for broad, complex reasoning.',
    },
    {
      title: 'Counting tokens before you hit the wall',
      description:
        'A developer sends a 400-page PDF to a model with a 128k-token context window and is surprised by an error. Roughly 500 words per page and three-quarters of a word per token gives around 270,000 tokens, more than double the window. The fix is to chunk the document, embed the chunks and retrieve only the relevant ones for each question, or to summarise sections first.',
      language: 'python',
      code: `import tiktoken
enc = tiktoken.get_encoding("o200k_base")       # tokenizer used by recent OpenAI models
tokens = enc.encode(open("report.txt").read())
print(len(tokens))                              # compare with the model's context window`,
      takeaway: 'Everything is measured in tokens; estimate before you send and use retrieval when the content exceeds the window.',
    },
  ],
  keyPoints: [
    'Generative language models predict the next token repeatedly; tokens are word fragments, and prompts, outputs, pricing and limits are all counted in tokens.',
    'The context window is the maximum tokens (prompt plus output) a model can process in one request; exceed it and you must chunk, summarise or retrieve.',
    'Embeddings are vectors that encode meaning; embedding models power semantic search and RAG, and produce numbers rather than text.',
    'Transformers with attention are the architecture; pre-training gives knowledge up to a cutoff, alignment makes the model follow instructions; new knowledge enters via the prompt.',
    'Outputs are sampled, so they vary and can be fluent but wrong (hallucinations); grounding and evaluation are the mitigations.',
    'Model families: LLM (broad reasoning), SLM (cheap, fast, edge), reasoning (multi-step logic), multimodal (image or audio input), embedding, image generation, audio or speech, domain-specific.',
    'Choose by modality, task difficulty, latency and cost, where it runs, need for customisation and whether the job is retrieval.',
    'The Foundry model catalog provides model cards, benchmarks and leaderboards, and filters by provider, modality and deployment type; models sold by Azure are Microsoft-supported, partner and community models are billed via Marketplace.',
  ],
  flashcards: [
    { front: 'What is a token?', back: 'The unit a language model reads and writes: a word fragment produced by the tokenizer, roughly four characters of English. Pricing, limits and the context window are measured in tokens.' },
    { front: 'What is the context window?', back: 'The maximum number of tokens (prompt plus generated output) a model can handle in one request.' },
    { front: 'What is an embedding?', back: 'A numeric vector representing the meaning of text; similar meanings produce nearby vectors, which enables semantic search and RAG.' },
    { front: 'What does a generative language model fundamentally do?', back: 'Predicts a probability distribution over the next token given the preceding tokens, samples one, and repeats.' },
    { front: 'Why can a model give a fluent but false answer?', back: 'It generates the most probable continuation, not a verified fact; this is called a hallucination or fabrication. Grounding and evaluation mitigate it.' },
    { front: 'When should you choose a small language model over a large one?', back: 'Narrow well-defined tasks, tight latency or cost budgets, edge or offline deployment, or when fine-tuning on your own data.' },
    { front: 'Which model type is needed to answer questions about an uploaded photo?', back: 'A multimodal (vision-enabled) model such as GPT-4o or GPT-5.' },
    { front: 'Which model type is needed to find documents similar to a query?', back: 'An embedding model (for example text-embedding-3), combined with a vector index.' },
    { front: 'What is a reasoning model best for, and what is the trade-off?', back: 'Multi-step logic, maths and planning; it is slower and more expensive per request.' },
    { front: 'What is a model card?', back: 'The documentation for a model in the catalog: intended uses, capabilities, limitations and responsible AI considerations.' },
    { front: 'Difference between Foundry Models sold by Azure and models from partners and community?', back: 'Sold by Azure: hosted and supported by Microsoft under Microsoft terms with SLAs. Partners and community: provided by third parties, billed through Azure Marketplace, supported by the provider.' },
  ],
  quiz: [
    {
      question:
        'A developer sends a long legal contract to a model and receives an error saying the request exceeds the model limit. Which concept explains the error?',
      options: ['The model\'s training cutoff', 'The context window', 'The embedding dimension', 'The temperature setting'],
      correct: [1],
      explanation:
        'The context window caps the tokens a request can contain. Training cutoff concerns knowledge recency, embedding dimension concerns vector size, and temperature controls randomness.',
    },
    {
      question:
        'An insurer wants an application where customers upload a photo of vehicle damage and receive a plain-language description of the damage. Which type of model is MOST appropriate?',
      options: ['An embedding model', 'A small text-only language model', 'A multimodal model that accepts image input', 'An image-generation model'],
      correct: [2],
      explanation:
        'Interpreting an image and producing text requires a vision-enabled multimodal model. Embedding models return vectors, text-only models cannot see the image, and image-generation models create images rather than describe them.',
    },
    {
      question:
        'A manufacturer needs to classify short maintenance notes into five categories on a device inside a factory with no internet access, at very high volume. Which model choice BEST fits?',
      options: [
        'A frontier reasoning model accessed over the internet',
        'A small language model deployed locally in a container',
        'An embedding model used to generate the category labels as text',
        'An image-generation model fine-tuned on the notes',
      ],
      correct: [1],
      explanation:
        'A narrow, high-volume, offline task is the textbook case for a small language model. A cloud reasoning model needs connectivity and is slow and costly, embedding models do not generate labels as text, and image models are irrelevant.',
    },
    {
      question: 'Which TWO statements about generative language models are correct? (Select two)',
      options: [
        'They generate output by repeatedly predicting the next token.',
        'They look up answers in a database of verified facts at inference time.',
        'The same prompt can produce different outputs because tokens are sampled from a probability distribution.',
        'They automatically know about events that happened after they were trained.',
      ],
      correct: [0, 2],
      explanation:
        'Next-token prediction and sampling are how the models work. They do not consult a fact database unless you add retrieval, and knowledge after the training cutoff must be supplied in the prompt.',
    },
    {
      question:
        'A team wants to compare the quality, latency and cost of three candidate models before deploying one. Where in Microsoft Foundry should they look FIRST?',
      options: [
        'The model catalog\'s benchmarks and leaderboards, then the playground to test their own prompts',
        'The Azure Marketplace billing page',
        'The content filter configuration',
        'The project\'s access control (IAM) settings',
      ],
      correct: [0],
      explanation:
        'Benchmarks, leaderboards and model cards in the catalog are designed for comparison, and the playground lets you validate on real prompts. Billing, content filters and IAM do not compare model quality.',
    },
    {
      question:
        'A support team wants to retrieve the most similar past tickets for each new ticket. Which model type should generate the representations used for similarity search?',
      options: ['A reasoning model', 'An embedding model', 'An image-generation model', 'A text-to-speech model'],
      correct: [1],
      explanation:
        'Embedding models convert text to vectors so similarity can be computed. Reasoning models produce text, and image or speech models are unrelated to text similarity.',
    },
  ],
  statements: [
    { text: 'A token is roughly four characters of English text, and model pricing and limits are measured in tokens.', isTrue: true, explanation: 'Tokens are the fundamental unit of input and output.' },
    { text: 'A model\'s context window includes only the user\'s prompt, not the generated response.', isTrue: false, explanation: 'The window covers prompt plus output; a long prompt leaves less room for the answer.' },
    { text: 'Embedding models return text completions like chat models do.', isTrue: false, explanation: 'Embedding models return numeric vectors used for similarity search, not text.' },
    { text: 'Small language models are a good fit for narrow tasks with tight latency, cost or offline requirements.', isTrue: true, explanation: 'They are cheaper and faster and can run on edge devices or in containers.' },
    { text: 'Fine-tuning is the recommended way to give a model knowledge of documents that change every day.', isTrue: false, explanation: 'Frequently changing or private knowledge should be supplied through grounding (RAG), not retraining.' },
    { text: 'Reasoning models are typically slower and more expensive per request than standard chat models.', isTrue: true, explanation: 'They spend more compute on multi-step reasoning before answering.' },
    { text: 'Models from partners and community in the Foundry catalog are billed through Azure Marketplace and supported by their providers.', isTrue: true, explanation: 'Models sold by Azure are the ones Microsoft hosts and supports directly.' },
  ],
  resources: [
    { label: 'Overview of Microsoft Foundry Models and the model catalog', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/foundry-models-overview' },
    { label: 'Foundry Models sold by Azure', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/foundry-models/concepts/models-sold-directly-by-azure' },
    { label: 'Understand embeddings in Azure OpenAI', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/understand-embeddings' },
    { label: 'Model benchmarks and leaderboards in Foundry', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/model-benchmarks' },
  ],
};
