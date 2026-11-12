import type { Concept } from '../../types';

export const promptingGroundingAndRag: Concept = {
  id: 'prompting-grounding-and-rag',
  title: 'Prompts, Grounding, RAG and Data: Why Context Decides Quality',
  summary:
    'How prompt engineering changes what a model produces, the techniques leaders should expect their teams to use, what grounding is and when a business requires it, how retrieval-augmented generation works end to end, and why data type, quality and representativeness decide whether an AI solution is trustworthy.',
  certs: ['ab-731', 'ab-100'],
  domains: ['ab-731-1', 'ab-100-1'],
  outcomes: ['ab-731-1-2-1', 'ab-731-1-2-2', 'ab-731-1-2-3', 'ab-731-1-2-4', 'ab-731-1-2-5', 'ab-100-1-2-11', 'ab-100-1-1-2'],
  tags: ['prompt-engineering', 'grounding', 'rag', 'data-quality', 'azure-ai-search', 'copilot'],
  difficulty: 'foundations',
  diagram: 'rag-pipeline',
  sections: [
    {
      heading: 'Why prompt engineering matters to the business',
      body: `A prompt is the instruction and context you give a model. The same model, asked two different ways, will produce a vague paragraph or a board-ready summary. **Prompt engineering** is the discipline of writing prompts that reliably get the output you need, and its impact is business-level: it determines quality, consistency, cost (shorter, sharper prompts use fewer tokens) and risk (prompts that demand citations and admit uncertainty reduce fabrication).

Microsoft's guidance for Copilot users frames a good prompt around four parts: the **goal** (what you want), the **context** (why, for whom, what situation), the **source** (which files, people or data to use) and the **expectations** (format, length, tone). For a leader the implications are:

- Prompting is a **skill to be taught**, not assumed. Training, prompt galleries and shared prompt libraries are adoption investments with measurable return.
- Prompts for **production solutions** (agent instructions, system prompts) are assets that need ownership, versioning and testing like any other configuration.
- Good prompting **does not replace grounding**. If the information is not in the model or the context, no wording will produce an accurate answer.

The exam asks about impact more than mechanics: expect scenarios where inconsistent output is traced to inconsistent prompting and the fix is a prompt library and guidelines, or where a team's results improve after they start specifying sources and formats.`,
    },
    {
      heading: 'Prompt techniques leaders should recognise',
      body: `You do not need to write prompts for a living, but you should recognise the techniques your teams and vendors describe:

| Technique | What it does | Business use |
|---|---|---|
| **Clear instructions and role** | States the task, audience and persona ("You are a claims analyst") | Consistent tone and scope |
| **Zero-shot** | Asks directly with no examples | Fast everyday tasks |
| **Few-shot** | Includes two or three worked examples of the desired output | Standard formats at scale |
| **Chain of thought / step-by-step** | Asks the model to reason through steps before concluding | Analysis, troubleshooting |
| **Output constraints** | Specifies format (table, JSON, bullet count), length, language | Downstream automation |
| **Grounding in the prompt** | Attaches or references the documents to use | Accuracy and citations |
| **Iteration** | Refines the result conversationally | Drafting and review |

Two related concepts matter for governance. **System prompts** (or agent instructions) are the standing instructions an organisation sets for an agent; users cannot see them, so they carry policy: what the agent may discuss, how it cites, when it refuses. **Prompt injection** is the attack where malicious text in a document or web page tries to override those instructions; it is why instructions alone are never a security boundary and why content filters and permissions exist (covered in the secure AI concept).

A **prompt library** with guidelines (naming, which data to reference, review steps for high-stakes outputs) is the organisational tool that turns individual skill into repeatable quality. Microsoft's own Copilot Prompt Gallery and in-product onboarding are starting points.`,
    },
    {
      heading: 'Grounding and retrieval-augmented generation',
      body: `**Grounding** means giving the model trustworthy, relevant information at the moment of the request so its answer is based on *your* facts rather than on general training data. Microsoft 365 Copilot grounds in Microsoft Graph and Work IQ (your mail, files, meetings, people) automatically; a Copilot Studio agent grounds in the knowledge sources you configure; a Foundry application grounds in whatever retrieval you build.

**Retrieval-augmented generation (RAG)** is the standard pattern for grounding on your own content:

1. **Prepare and index** the content. Documents are split into chunks and indexed, usually with both keyword and vector (semantic) search, in a service such as **Azure AI Search**. Permissions and metadata travel with the chunks.
2. **Retrieve.** When a user asks a question, the system searches the index for the most relevant chunks the user is allowed to see.
3. **Augment.** Those chunks are added to the prompt alongside the question and the instructions.
4. **Generate.** The model writes an answer using the supplied context and cites the sources.

Business requirements that point to grounding and RAG rather than a plain model: answers must reflect **current** information that changes; answers must come from **private or proprietary** content; users need **citations** to verify; the organisation needs **access control** (people see only what they could already open); regulators expect **traceability**. RAG also controls cost, because the model reads only the retrieved passages, and it avoids the expense and lag of fine-tuning for knowledge.

The quality of RAG depends on retrieval: if the right passage is not found, the model answers from thin context and may fabricate. That is why index design, chunking, metadata and search relevance are engineering work, and why evaluation of groundedness and retrieval quality belongs in every project plan.`,
    },
    {
      heading: 'Data: type, quality and representativeness',
      body: `AI is only as good as the data it is grounded on or trained with. Leaders are expected to ask three questions.

**What type of data is it?** *Structured* data (tables, databases, CRM records) suits machine learning and analytics, and can be surfaced to language models through tools and connectors. *Unstructured* data (documents, email, chat, images, audio, video) is the natural fuel of generative AI and RAG but needs extraction and indexing. *Semi-structured* data (forms, invoices, JSON) often needs document intelligence to extract fields first. Each type needs different preparation and different Foundry tools.

**How good is it?** Microsoft's planning guidance for grounding data asks for accuracy, relevance, timeliness, cleanliness and availability. Stale policies, duplicate versions, draft documents stored next to approved ones, and content with no owner all degrade answers. Oversharing is a quality problem as well as a security problem: if the wrong people can reach a document, Copilot will surface it to them. "Get your data ready" is step one in every Microsoft adoption checklist for exactly this reason.

**Is it representative?** A dataset that covers only one region, one language, one product line or one customer segment will produce a model or an agent that works well for that slice and poorly, or unfairly, for everyone else. Representativeness is both an accuracy requirement and the main lever against bias.

Scenario cue words for the exam: "outdated answers" means timeliness and curation; "answers differ by team" means duplicate or conflicting sources; "works for head office but not the field" means an unrepresentative dataset; "surfaced a confidential file" means permissions and labelling, not the model.`,
    },
  ],
  examples: [
    {
      title: 'Same model, different prompt, different result',
      description:
        'Two account managers ask Copilot for help before a renewal call. The first types "summarise Northwind." The second types "Using /Northwind renewal notes.docx and my emails with Maria this quarter, give me five bullet points on open issues, two risks to the renewal, and a suggested opening question. Keep it under 150 words." The second gets a usable brief with citations; the first gets a generic company description.',
      language: 'text',
      code: `Goal:        five bullets on open issues, two risks, one opening question
Context:     renewal call with Northwind next week
Source:      /Northwind renewal notes.docx, emails with Maria this quarter
Expectation: under 150 words, business tone, cite sources`,
      takeaway: 'Goal, context, source and expectations turn a vague request into a grounded, reviewable answer.',
    },
    {
      title: 'The knowledge base nobody curated (a realistic mistake)',
      description:
        'An IT department launches a help-desk agent grounded on its entire SharePoint knowledge site, including a folder of superseded procedures and drafts. Users report that the agent gives last year\'s VPN instructions. The team blames the model and considers switching vendors. The actual fix is to curate the knowledge source: archive superseded articles, add an "approved" metadata flag the index can filter on, assign content owners and set a review cadence. Answer accuracy jumps without touching the model.',
      takeaway: 'Most grounded-answer failures are retrieval and data-quality failures; curate the sources before changing the model.',
    },
    {
      title: 'Why the legal team needs RAG, not fine-tuning',
      description:
        'A legal operations lead wants an assistant that answers questions about 4,000 active contracts, with a clause reference for every answer, visible only to people cleared for each matter. Fine-tuning cannot cite, cannot enforce per-document permissions and would lag every amendment. A RAG solution indexes the contracts in Azure AI Search with security trimming, retrieves the relevant clauses per question and makes the model cite them.',
      takeaway: 'Current content, citations and access control are business requirements that point to grounding and RAG.',
    },
    {
      title: 'The representative dataset',
      description:
        'A manufacturer trains a defect-detection model on photos from its newest plant, which has bright LED lighting. Deployed to older plants with dimmer lighting, accuracy collapses. Collecting images across all plants, shifts and lighting conditions before retraining makes the model usable everywhere.',
      takeaway: 'A dataset must represent the conditions the solution will meet in production, or it will fail outside its comfort zone.',
    },
  ],
  keyPoints: [
    'Prompt quality determines output quality, consistency, cost and risk; a good prompt states goal, context, source and expectations.',
    'Recognise the techniques: clear instructions and role, zero-shot, few-shot examples, step-by-step reasoning, output constraints, grounding in the prompt, iteration.',
    'System prompts and agent instructions carry organisational policy and need ownership, versioning and testing; a prompt library turns individual skill into repeatable quality.',
    'Grounding supplies trustworthy, relevant facts at request time; RAG does it by indexing content, retrieving permitted relevant chunks, adding them to the prompt and generating a cited answer.',
    'Business requirements that call for grounding: current information, private content, citations, per-user access control, traceability, and cost control.',
    'Data type decides the tooling: structured data for ML and connectors, unstructured for RAG, semi-structured for document extraction first.',
    'Data quality means accurate, relevant, timely, clean and available; representativeness across regions, languages and groups is the main lever against bias.',
  ],
  flashcards: [
    { front: 'What four elements make an effective Copilot prompt?', back: 'Goal, context, source and expectations (format, length, tone).' },
    { front: 'What is few-shot prompting?', back: 'Including two or three worked examples of the desired output in the prompt so the model matches the format and style.' },
    { front: 'What is a system prompt or agent instruction?', back: 'Standing, user-invisible instructions that define an agent\'s scope, tone, citation behaviour and refusals; they carry policy but are not a security boundary.' },
    { front: 'Define grounding.', back: 'Supplying the model with trustworthy, relevant information at request time so its answer is based on your facts rather than general training data.' },
    { front: 'List the four steps of RAG.', back: 'Index the content (chunks, keyword and vector search), retrieve relevant permitted chunks, augment the prompt with them, generate a cited answer.' },
    { front: 'Which Azure service is the usual retrieval layer for RAG?', back: 'Azure AI Search, with keyword, vector and hybrid search plus security trimming.' },
    { front: 'Name four business requirements that point to RAG over fine-tuning.', back: 'Current or changing content, private proprietary content, citations for verification, per-user access control (also traceability and cost).' },
    { front: 'What five qualities should grounding data have?', back: 'Accuracy, relevance, timeliness, cleanliness and availability.' },
    { front: 'Why does a representative dataset matter?', back: 'A model or agent built from one slice of reality performs poorly or unfairly outside it; representativeness drives accuracy and reduces bias.' },
    { front: 'What is prompt injection?', back: 'Malicious text in content the model reads that tries to override its instructions; mitigated by permissions, content filters and not treating instructions as a security boundary.' },
  ],
  quiz: [
    {
      question:
        'Sales teams in two regions get very different quality from Copilot when drafting proposals. Investigation shows one region trained its staff to specify the source documents, audience and format in prompts. What is the MOST appropriate organisational response?',
      options: [
        'Buy a higher Copilot licence tier for the weaker region',
        'Publish a shared prompt library with guidelines and run prompting training for all sales staff',
        'Fine-tune a model on the better region\'s proposals',
        'Disable Copilot in the weaker region until quality improves',
      ],
      correct: [1],
      explanation:
        'The gap is a prompting-skill gap, solved by a prompt library and training. Licence tier does not change prompting quality, fine-tuning is unnecessary and costly, and disabling removes the value.',
    },
    {
      question:
        'A pharmaceutical company needs an assistant that answers questions about internal standard operating procedures, which are revised monthly, and must cite the exact procedure used. Which approach meets the requirements?',
      options: [
        'Fine-tune a model on the procedures every quarter',
        'Use retrieval-augmented generation over an index of the current procedures with citations',
        'Use a general web-grounded chat experience',
        'Ask users to paste the relevant procedure into every prompt',
      ],
      correct: [1],
      explanation:
        'Monthly changes, private content and citations are the classic RAG requirements. Quarterly fine-tuning lags and cannot cite, web grounding does not know internal procedures, and manual pasting does not scale.',
    },
    {
      question: 'Which TWO are steps in a retrieval-augmented generation pipeline? (Select two)',
      options: [
        'Retrieving the most relevant content chunks the user is permitted to see from an index',
        'Adding the retrieved chunks to the prompt before the model generates its answer',
        'Retraining the foundation model on the retrieved documents',
        'Removing sensitivity labels from documents so they can be indexed',
      ],
      correct: [0, 1],
      explanation:
        'Retrieve and augment are core RAG steps. RAG does not retrain the model, and labels and permissions must be preserved, not removed.',
    },
    {
      question:
        'A help-desk agent grounded on a SharePoint knowledge site returns outdated instructions. The site contains both approved articles and superseded drafts. What should the team do FIRST?',
      options: [
        'Replace the underlying language model with a newer version',
        'Curate the knowledge source: archive superseded content, mark approved articles and assign owners with a review cadence',
        'Increase the number of chunks retrieved per question',
        'Switch the agent to answer from the public web instead',
      ],
      correct: [1],
      explanation:
        'Outdated answers are a data timeliness and curation problem. A newer model still reads the same stale content, retrieving more chunks adds more stale content, and the public web does not contain internal procedures.',
    },
    {
      question:
        'A manufacturer\'s image-classification model trained on photos from one plant performs poorly at other plants. Which data characteristic is MOST likely the cause?',
      options: [
        'The dataset is not representative of the lighting and conditions at the other plants',
        'The images were stored in an unstructured format',
        'The model used too many tokens per image',
        'The images were not protected with sensitivity labels',
      ],
      correct: [0],
      explanation:
        'A dataset drawn from one environment does not represent the others; that is a representativeness failure. Images are inherently unstructured, token count is a language-model concept, and labels affect access, not accuracy.',
    },
    {
      question: 'An insurer wants to extract policy number, claim amount and incident date from thousands of scanned claim forms before analysis. Which data type and preparation step are involved?',
      options: [
        'Structured data loaded directly into a machine learning model',
        'Semi-structured documents that need field extraction, for example with document intelligence, before downstream use',
        'Unstructured video that needs transcription',
        'Structured data that needs sensitivity labelling only',
      ],
      correct: [1],
      explanation:
        'Scanned forms are semi-structured documents; the fields must be extracted before they can be analysed. They are not already structured, and they are not video.',
    },
  ],
  statements: [
    { text: 'A well-written prompt can make a model produce accurate answers about information it has never been given.', isTrue: false, explanation: 'Prompting shapes output but cannot supply missing facts; that requires grounding.' },
    { text: 'Few-shot prompting includes worked examples of the desired output in the prompt.', isTrue: true, explanation: 'Examples help the model match format and style consistently.' },
    { text: 'In RAG, the model retrieves only content the requesting user is permitted to access.', isTrue: true, explanation: 'Security trimming at retrieval time is how RAG respects existing permissions.' },
    { text: 'Fine-tuning is preferred over RAG when answers must cite current internal documents.', isTrue: false, explanation: 'RAG provides citations and current content; fine-tuning cannot cite and lags changes.' },
    { text: 'Agent instructions (system prompts) are a sufficient security boundary against malicious input.', isTrue: false, explanation: 'Prompt injection can override instructions; permissions, content filters and other controls are needed.' },
    { text: 'Accuracy, relevance, timeliness, cleanliness and availability are the qualities Microsoft lists for grounding data.', isTrue: true, explanation: 'These are the data-readiness criteria in Microsoft\'s planning guidance.' },
    { text: 'A dataset drawn from one region is acceptable for a solution that will serve all regions, as long as it is large.', isTrue: false, explanation: 'Size does not fix representativeness; the data must reflect the conditions and groups the solution will serve.' },
  ],
  resources: [
    { label: 'Prompt engineering techniques (Microsoft Foundry)', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/prompt-engineering' },
    { label: 'Retrieval-augmented generation in Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/retrieval-augmented-generation' },
    { label: 'What is Azure AI Search?', url: 'https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search' },
  ],
};
