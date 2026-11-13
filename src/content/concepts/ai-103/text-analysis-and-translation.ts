import type { Concept } from '../../types';

export const textAnalysisAndTranslation: Concept = {
  id: 'text-analysis-and-translation',
  title: 'Text Analysis with Language Models and Foundry Tools: Extraction, Sentiment, Safety and Translation',
  summary:
    'Extracting entities, topics, summaries and structured JSON with generative prompting and with Azure Language (NER, key phrases, summarization, PII), detecting sentiment, tone, safety issues and sensitive content with Language sentiment analysis, Content Safety and guardrails, translating text with Azure Translator or LLM-powered flows, and customising language model output for domain tasks such as compliance summarisation and domain extraction through prompts, structured outputs, custom Language projects and fine-tuning.',
  certs: ['ai-103', 'ai-901'],
  domains: ['ai-103-4', 'ai-901-2'],
  outcomes: ['ai-103-4-1-1', 'ai-103-4-1-2', 'ai-103-4-1-3', 'ai-103-4-1-4', 'ai-901-2-2-1'],
  tags: ['text-analysis', 'azure-language', 'ner', 'pii', 'sentiment', 'summarization', 'translator', 'structured-outputs', 'fine-tuning', 'python', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Extraction, topics, summaries and structured JSON',
      body: `Two toolsets do text extraction and you choose by determinism, cost and flexibility.

**Azure Language in Foundry Tools** (SDK \`azure-ai-textanalytics\`, \`TextAnalyticsClient\`) offers pretrained, deterministic skills billed per text record: \`recognize_entities\` (NER with categories such as Person, Organization, Location, DateTime, Quantity), \`recognize_linked_entities\` (Wikipedia links), \`extract_key_phrases\` (topics as key phrases), \`recognize_pii_entities\` (with redaction), \`detect_language\`, \`analyze_sentiment\`, and long-running \`begin_extract_summary\` (extractive) and \`begin_abstract_summary\` (abstractive), plus conversation summarization. **Custom NER**, **custom text classification** and **Conversational Language Understanding (CLU)** are trained in Language Studio or the Foundry portal from labelled data. Language is also exposed to agents as an **MCP server** (\`https://<resource>.cognitiveservices.azure.com/language/mcp\`) and through intent routing and exact question answering agents (CQA). The same capabilities appear as **Azure AI Search skills** (Entity Recognition, Key Phrase Extraction, PII Detection, Sentiment, Language Detection) for enrichment during indexing.

**Generative prompting** with a Foundry model handles open-ended schemas: "extract all parties, obligations and dates as JSON", "list the five main topics", "summarise for an executive in 100 words". Use **structured outputs** (\`response_format\` with a Pydantic or JSON Schema model) so the JSON is schema-valid, low temperature for consistency, and few-shot examples for edge cases; chunk long inputs and summarise hierarchically (map-reduce). Small models (gpt-5-mini, Phi) are usually enough for extraction and summarisation and keep cost down.

Rule of thumb for items: fixed, well-known categories at high volume with predictable cost → Language; novel or nested schemas, reasoning, multi-document synthesis → LLM with structured outputs; both → run Language first (PII redaction, language detection) and pass the clean text to the model.`,
    },
    {
      heading: 'Sentiment, tone, safety issues and sensitive content',
      body: `**Sentiment and tone**: Language \`analyze_sentiment(documents, show_opinion_mining=True)\` returns document and sentence sentiment (positive, neutral, negative, mixed) with confidence scores and, with opinion mining, *targets* and *assessments* ("the food [negative]", "the concierge [positive]"). For tone beyond polarity (frustrated, urgent, sarcastic, formal) prompt a model with a fixed label set and structured output, or train **custom text classification** when you have labelled data and need consistency. In Azure AI Search the **Sentiment skill** scores documents during indexing.

**Safety issues**: run **Azure AI Content Safety** \`text:analyze\` (\`ContentSafetyClient.analyze_text(AnalyzeTextOptions(text=...))\`) to get severity (0 to 6 in the API, mapped to safe/low/medium/high) per harm category (Hate, Sexual, Violence, SelfHarm), add **block lists** for exact terms, use **Prompt Shields** for jailbreak or injection attempts, and **protected material** detection for copyrighted text. In Foundry, model deployments and agents get the same classifiers through **guardrails**, so user input and model output are checked automatically; your pipeline reads the annotations. For user-generated content moderation outside a model call, the Content Safety API is the right answer; **Custom categories** (standard retiring September 2026, rapid retiring April 2027) are being replaced by custom text classification.

**Sensitive content and PII**: Language **PII detection** (\`recognize_pii_entities\`, categories such as Person, PhoneNumber, Email, Address, CreditCardNumber, national IDs, with \`redacted_text\`) and **Text Analytics for health** (medical entities, PHI) handle de-identification before data reaches a model, an index or a log; the Foundry **PII / sensitive data leakage** guardrail risk and the **Sensitive Data Leakage** evaluator cover agent outputs; **Microsoft Purview** classifies and labels at the data layer. Order matters: redact PII before embedding or indexing, before sending to a model, and before writing traces.`,
    },
    {
      heading: 'Translation: Azure Translator and LLM-powered flows',
      body: `**Azure Translator in Foundry Tools** (SDK \`azure-ai-translation-text\`, \`TextTranslationClient\`) is the deterministic, broad-coverage option: \`translate(body=[InputTextItem(text=...)], to_language=["es", "it"], from_language="en")\` (auto-detects source when omitted), \`transliterate\`, \`detect\` via the translate call, **dictionary lookup**, **profanity** handling, **dynamic dictionary** and **custom translator** models trained on domain parallel data, 130+ languages, and **document translation** for whole files (Word, PDF, PowerPoint) preserving layout, including batch jobs from Blob Storage. Translator is also available as an agent tool through the Foundry Tools catalog.

**LLM-powered translation** uses a chat model: "translate to formal Brazilian Portuguese, keep product names, use the glossary below, return JSON {translation, notes}". Strengths: style and register control, glossary adherence by instruction, handling of mixed content (markdown, code, placeholders), cultural adaptation, explanations. Weaknesses: variability, cost per token, occasional omissions or additions, weaker on low-resource languages; mitigate with low temperature, structured outputs and a back-translation or Translator cross-check, and evaluate with BLEU/METEOR evaluators against references. **Speech translation** has its own stack (Speech SDK and GPT Realtime Translate) covered in the speech concept.

Decision guide: high-volume UI strings, documents with layout, many language pairs, predictable cost → Translator (plus custom translator for terminology); marketing copy, tone-sensitive text, instructions with glossaries, post-editing suggestions → LLM; combined flow: Translator for bulk, LLM for review or for the few premium pairs.`,
    },
    {
      heading: 'Customising language model output for domain tasks, and the exam angle',
      body: `"Customize language model outputs for domain tasks" is a ladder; climb only as far as needed:

1. **Prompt engineering**: role, domain glossary, explicit output schema, length and audience ("compliance officer; cite clause numbers"), few-shot examples from real documents, refusal rules ("do not infer facts not present"). For **compliance summarisation**: instruct the model to list obligations, deadlines, penalties and open questions, quote the source clause, and mark anything uncertain.
2. **Structured outputs and validation**: Pydantic schemas with enums for regulatory categories; post-validate with deterministic rules (dates parse, amounts non-negative); run **Groundedness** against the source text and **Rubric** evaluators with domain criteria.
3. **Retrieval for domain knowledge**: ground the model in policies, standards and glossaries (RAG) instead of hoping it memorised them.
4. **Deterministic domain models**: Language custom NER and custom text classification, Content Understanding analyzers with field schemas, Document Intelligence custom models, Translator custom models when terminology must be exact.
5. **Fine-tuning** (Foundry fine-tuning, GA) when prompting and retrieval still miss the style or format: supervised fine-tuning on hundreds to thousands of examples, evaluate on a held-out set, deploy to a **Developer** deployment for evaluation then Standard/Global Standard for production; fine-tune for *behaviour and format*, not to inject knowledge that changes (use RAG for that). Distillation into a small model lowers cost at scale.

Typical items: "extract 12 fixed entity types from 10 million reviews daily at lowest cost" → Language NER (or custom NER); "summarise each contract into the firm's compliance template with clause citations" → LLM prompt with structured outputs and Groundedness evaluation; "detect frustrated customers" → sentiment with opinion mining or custom classification; "remove personal data before indexing" → PII detection with redaction; "translate 20,000 product descriptions into 30 languages" → Translator; "preserve brand voice in five languages" → LLM translation with glossary; "the model keeps using the wrong internal terminology despite prompts" → fine-tuning or a custom Translator model.`,
    },
  ],
  examples: [
    {
      title: 'Compliance summarisation with structured output and a groundedness check',
      description:
        'A compliance team summarises supplier contracts into a fixed schema with clause citations. Low temperature and a Pydantic schema give consistent JSON; a Groundedness evaluator flags summaries not supported by the contract text.',
      language: 'python',
      code: `from pydantic import BaseModel
from typing import Literal

class Obligation(BaseModel):
    party: str
    description: str
    deadline: str | None
    clause: str                      # e.g. "12.3"
    risk: Literal["low", "medium", "high"]

class ComplianceSummary(BaseModel):
    obligations: list[Obligation]
    open_questions: list[str]        # anything uncertain or missing

completion = client.beta.chat.completions.parse(
    model="gpt-5-mini", temperature=0,
    messages=[{"role": "system", "content": "You are a compliance analyst. Summarise ONLY what the "
               "contract states. Cite the clause for every obligation. Mark uncertainty in open_questions."},
              {"role": "user", "content": contract_markdown}],
    response_format=ComplianceSummary)
summary = completion.choices[0].message.parsed
score = groundedness_eval(query="Summarise obligations", context=contract_markdown,
                          response=summary.model_dump_json())
if score["groundedness"] < 4:
    route_to_reviewer(summary, reason=score["groundedness_reason"])`,
      takeaway: 'Domain customisation starts with a precise role, a strict schema and verification against the source, before considering fine-tuning.',
    },
    {
      title: 'Sentiment with opinion mining, PII redaction and translation in one pipeline',
      description:
        'A multilingual feedback pipeline detects language, redacts PII, scores sentiment with aspect-level opinions, and translates negative comments into English for the support team using Translator.',
      language: 'python',
      code: `from azure.ai.textanalytics import TextAnalyticsClient
from azure.ai.translation.text import TextTranslationClient
from azure.ai.translation.text.models import InputTextItem

lang = TextAnalyticsClient(endpoint=LANGUAGE_ENDPOINT, credential=DefaultAzureCredential())
translator = TextTranslationClient(credential=DefaultAzureCredential(),            # keyless Entra auth
                                   region=TRANSLATOR_REGION, resource_id=TRANSLATOR_RESOURCE_ID)

pii = lang.recognize_pii_entities(reviews)                       # redact before anything else
clean = [d.redacted_text for d in pii if not d.is_error]

for i, doc in enumerate(lang.analyze_sentiment(clean, show_opinion_mining=True)):
    for sentence in doc.sentences:
        for opinion in sentence.mined_opinions:
            print(opinion.target.text, opinion.target.sentiment,
                  [a.text for a in opinion.assessments])
    if doc.sentiment == "negative":
        result = translator.translate(body=[InputTextItem(text=clean[i])],
                                      to_language=["en"])        # source auto-detected
        escalate(result[0].translations[0].text,
                 detected=result[0].detected_language.language)`,
      takeaway: 'Chain deterministic Language and Translator calls: redact PII first, then sentiment with opinion mining, then translate only what needs human attention.',
    },
    {
      title: 'The expensive extraction mistake',
      description:
        'A team used GPT-5 with a long prompt to pull names, organisations and dates from 8 million support tickets a day. Costs were high and categories drifted between runs. Moving the fixed-category extraction to Language NER (and PII detection) cut cost by an order of magnitude and made results deterministic; the LLM now handles only the free-form "root cause" field with a strict schema.',
      language: 'python',
      code: `# Deterministic, cheap, fixed categories
entities = lang.recognize_entities(tickets)
for doc in entities:
    people = [e.text for e in doc.entities if e.category == "Person"]
    orgs   = [e.text for e in doc.entities if e.category == "Organization"]
    dates  = [e.text for e in doc.entities if e.category == "DateTime"]

# Generative only where the schema is open-ended
root_cause = openai.responses.create(
    model="gpt-5-mini", temperature=0,
    instructions="Return JSON {root_cause: string, category: 'billing'|'shipping'|'product'|'other'}",
    input=ticket_text,
    text={"format": {"type": "json_object"}},
).output_text`,
      takeaway: 'Reserve generative extraction for open-ended fields; fixed entity categories at scale belong to Azure Language.',
    },
  ],
  keyPoints: [
    'Azure Language (TextAnalyticsClient) provides deterministic NER, linked entities, key phrases, PII detection with redaction, language detection, sentiment with opinion mining, extractive and abstractive summarization, plus custom NER, custom classification and CLU; it is also an MCP server for agents and a set of AI Search skills.',
    'Generative prompting with structured outputs handles open-ended or nested schemas, topics and executive summaries; use low temperature, small models where possible and hierarchical summarisation for long texts.',
    'Sentiment polarity and aspect-level opinions come from Language; richer tone labels come from a model with a fixed label set or custom text classification.',
    'Safety issues in text are detected by Content Safety text:analyze (harm severities), block lists, Prompt Shields and protected material detection, applied automatically through Foundry guardrails on deployments and agents.',
    'Redact PII (recognize_pii_entities, Text Analytics for health) before embedding, indexing, prompting or logging; the PII guardrail risk and Sensitive Data Leakage evaluator cover agent outputs.',
    'Azure Translator (TextTranslationClient.translate with to_language) covers 130+ languages, auto-detection, transliteration, dictionaries, custom translator and document translation; LLM translation adds style, glossary and mixed-content control at higher variability.',
    'Customise domain output in order: prompts and few-shot, structured outputs with validation and evaluators, retrieval for domain knowledge, custom deterministic models, then fine-tuning for format and behaviour (not for changing knowledge).',
    'Evaluate translations and summaries with BLEU/METEOR/ROUGE against references and Groundedness against the source.',
  ],
  flashcards: [
    { front: 'Which Azure Language method returns aspect-level targets and assessments alongside sentiment?', back: 'analyze_sentiment(documents, show_opinion_mining=True).' },
    { front: 'Which Language method redacts personal data and what property holds the result?', back: 'recognize_pii_entities; each result exposes redacted_text plus the detected PII entities.' },
    { front: 'Extractive vs abstractive summarization in Azure Language?', back: 'Extractive (begin_extract_summary) returns key sentences verbatim; abstractive (begin_abstract_summary) generates new summary text.' },
    { front: 'When should you prefer Language NER over an LLM for entity extraction?', back: 'Fixed, well-known categories at high volume where deterministic results and predictable per-record cost matter.' },
    { front: 'Which Content Safety API analyses user-generated text for hate, sexual, violence and self-harm severities?', back: 'text:analyze (ContentSafetyClient.analyze_text with AnalyzeTextOptions).' },
    { front: 'How do you translate with the Translator SDK to several languages at once?', back: 'TextTranslationClient.translate(body=[InputTextItem(text=...)], to_language=["es", "it"]); omit from_language to auto-detect.' },
    { front: 'Which Translator capability translates Word, PDF and PowerPoint files while preserving layout?', back: 'Document translation (single file or batch from Blob Storage).' },
    { front: 'What is a custom translator?', back: 'A Translator model trained on your domain parallel data so terminology is translated consistently.' },
    { front: 'When is fine-tuning the right customisation step?', back: 'When prompting, structured outputs and retrieval still miss the required style or format; fine-tune for behaviour and format, use RAG for changing knowledge.' },
    { front: 'How can an agent use Azure Language capabilities as tools?', back: 'Through the Azure Language MCP server endpoint (language/mcp) or the intent routing and exact question answering agents (CLU + CQA).' },
    { front: 'Which Foundry evaluators measure translation quality against reference translations?', back: 'BLEU, GLEU, METEOR and ROUGE (textual similarity evaluators), with Fluency and Coherence for readability.' },
  ],
  quiz: [
    {
      question:
        'A bank must extract account holder names, organisations and dates from 5 million emails per day with predictable cost and deterministic categories. Which approach is MOST appropriate?',
      options: [
        'Azure Language named entity recognition.',
        'GPT-5 with a detailed few-shot prompt per email.',
        'Content Understanding agentic mode.',
        'Azure Translator dictionary lookup.',
      ],
      correct: [0],
      explanation:
        'Fixed categories at scale are the sweet spot for Language NER (per-record pricing, deterministic). LLM prompting is costlier and variable, agentic mode is for document reasoning, and dictionary lookup is a translation feature.',
    },
    {
      question: 'Which TWO steps correctly protect personal data in a pipeline that indexes customer chats and later summarises them with a model? (Select two)',
      options: [
        'Run PII detection with redaction before embedding and indexing the chats.',
        'Send raw chats to the model and ask it to ignore personal data.',
        'Use the redacted text as model input and enable the PII guardrail risk on the deployment or agent.',
        'Store the original chats in trace attributes for debugging.',
      ],
      correct: [0, 2],
      explanation:
        'Redaction must happen before data spreads into indexes, prompts and logs, and guardrails add a second layer on outputs. Asking the model to ignore PII is not a control, and traces should not carry raw personal data.',
    },
    {
      question: 'Marketing needs product taglines translated into five languages with brand voice preserved and a glossary of protected product names. Which approach fits BEST?',
      options: [
        'Translator text translation with default settings.',
        'An LLM translation flow with instructions covering tone and the glossary, low temperature and structured output, evaluated against reviewed references.',
        'Azure Language key phrase extraction.',
        'Speech translation.',
      ],
      correct: [1],
      explanation:
        'Style- and glossary-sensitive marketing copy benefits from LLM control; Translator default settings may not preserve voice (a custom translator helps terminology but not tone). Key phrases and speech translation address different tasks.',
    },
    {
      question: 'A support dashboard must flag reviews where the food is praised but the service is criticised within the same review. Which capability provides this directly?',
      options: ['Language detection', 'Sentiment analysis with opinion mining', 'Content Safety text:analyze', 'Extractive summarization'],
      correct: [1],
      explanation:
        'Opinion mining returns per-target sentiment (food positive, service negative). Language detection, safety analysis and summarization do not expose aspect-level sentiment.',
    },
    {
      question: 'Despite detailed prompts and retrieval, a model keeps producing compliance summaries in the wrong internal format and terminology across thousands of documents. What is the next appropriate customisation step?',
      options: [
        'Increase temperature to encourage adaptation.',
        'Supervised fine-tuning on examples of correctly formatted summaries, evaluated on a held-out set before deployment.',
        'Switch to Translator document translation.',
        'Remove structured outputs.',
      ],
      correct: [1],
      explanation:
        'Fine-tuning teaches consistent format and style once prompting and retrieval are exhausted. Higher temperature increases variability, translation is unrelated, and removing schemas worsens format control.',
    },
  ],
  statements: [
    { text: 'Azure Language abstractive summarization generates new sentences rather than selecting existing ones.', isTrue: true, explanation: 'Extractive summarization selects sentences; abstractive produces new text.' },
    { text: 'Azure Translator requires you to specify the source language on every request.', isTrue: false, explanation: 'Source language is auto-detected when from_language is omitted, and the response reports the detected language.' },
    { text: 'Content Safety text analysis is applied automatically to model inputs and outputs in Foundry through guardrails.', isTrue: true, explanation: 'Guardrails use the same Content Safety classifiers on deployments and agents; the standalone API serves other pipelines.' },
    { text: 'Fine-tuning is the recommended way to teach a model facts that change frequently, such as current prices.', isTrue: false, explanation: 'Use retrieval for changing knowledge; fine-tune for behaviour, style and format.' },
    { text: 'Azure Language can be connected to Foundry agents as an MCP server.', isTrue: true, explanation: 'The Azure Language MCP server endpoint exposes NER, PII, CLU, CQA, summarization and more as tools (preview).' },
    { text: 'Custom categories (standard) in Content Safety is the long-term recommended approach for custom text moderation.', isTrue: false, explanation: 'It retires in September 2026; Microsoft points to custom text classification and block lists instead.' },
    { text: 'Document translation preserves the layout of Word, PDF and PowerPoint files.', isTrue: true, explanation: 'Document translation handles whole files, including batch jobs from Blob Storage.' },
  ],
  resources: [
    { label: 'What is Azure Language in Foundry Tools?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview' },
    { label: 'Azure Language tools and agents', url: 'https://learn.microsoft.com/en-us/azure/ai-services/language-service/concepts/foundry-tools-agents' },
    { label: 'Quickstart: Azure Translator text translation client library', url: 'https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/quickstart/client-library-sdk' },
    { label: 'Azure AI Content Safety overview', url: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview' },
  ],
};
