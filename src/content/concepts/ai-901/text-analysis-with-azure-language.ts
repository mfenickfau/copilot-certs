import type { Concept } from '../../types';

export const textAnalysisWithAzureLanguage: Concept = {
  id: 'text-analysis-with-azure-language',
  title: 'Text Analysis with Azure Language in Foundry Tools',
  summary:
    'The core text-analysis techniques (language detection, sentiment and opinion mining, key phrase extraction, named entity recognition, entity linking, PII detection, summarisation), what each returns, how to call them from a small Python app with the azure-ai-textanalytics client, and when a language model prompt is the better tool.',
  certs: ['ai-901', 'ai-103'],
  domains: ['ai-901-1', 'ai-901-2', 'ai-103-4'],
  outcomes: ['ai-901-1-3-2', 'ai-901-2-2-1', 'ai-103-4-1-2'],
  tags: ['azure-language', 'nlp', 'sentiment', 'ner', 'key-phrases', 'summarization', 'pii', 'python', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'What text analysis is and when to use the prebuilt service',
      body: `**Text analysis** (natural language processing, NLP) means extracting structured meaning from text you already have: reviews, emails, transcripts, tickets, articles. **Azure Language in Foundry Tools** is the prebuilt service for this. You create a Foundry resource (or a standalone Language resource), take its endpoint, and call REST APIs or client libraries; the **Language playground** in the Foundry portal lets you try each feature without code.

The exam distinguishes the core techniques by what they return:

| Technique | Question it answers | Output |
|---|---|---|
| **Language detection** | What language is this? | ISO language code plus confidence (for example "fr", 0.99) |
| **Sentiment analysis** | How does the writer feel? | positive / negative / neutral / mixed at document and sentence level with confidence scores; **opinion mining** adds targets and assessments ("room" → "noisy") |
| **Key phrase extraction** | What is this about? | A list of the main talking points ("battery life", "customer support") |
| **Named entity recognition (NER)** | Who, what, where, when? | Entities with categories: Person, Organization, Location, DateTime, Quantity, Event, Product, and more |
| **Entity linking** | Which "Mars" is this? | Entities disambiguated and linked to Wikipedia URLs |
| **PII detection** | Is there personal data here? | Entities such as names, phone numbers, emails, credit card and national ID numbers, plus a **redacted** copy of the text |
| **Summarisation** | What is the short version? | **Extractive** (selects key sentences from the source) or **abstractive** (writes new sentences); conversation summarisation for chats and call transcripts |

Microsoft now labels PII detection, language detection, NER and Text analytics for health as **core** (actively evolving) features and sentiment, key phrases, entity linking, summarisation, CLU and question answering as **legacy** (supported, but new generative approaches are recommended for new work). For the exam you need to recognise all of them. **Conversational language understanding (CLU)** predicts an utterance's intent and entities for bots; **custom text classification** and **custom NER** let you train your own labels.`,
    },
    {
      heading: 'Building a lightweight text-analysis app',
      body: `The Python client library is \`azure-ai-textanalytics\`. Every feature follows the same shape: create a **TextAnalyticsClient** with the endpoint and a credential, pass a **list of documents** (up to the batch limit per request), and iterate results, skipping any item where \`is_error\` is true.

- \`client.detect_language(docs)\` → \`primary_language.iso6391_name\`
- \`client.analyze_sentiment(docs, show_opinion_mining=True)\` → \`sentiment\`, \`confidence_scores\`, \`sentences[].mined_opinions\`
- \`client.extract_key_phrases(docs)\` → \`key_phrases\`
- \`client.recognize_entities(docs)\` → \`entities[].text / category / confidence_score\`
- \`client.recognize_linked_entities(docs)\` → \`entities[].url\`
- \`client.recognize_pii_entities(docs)\` → \`entities\` and \`redacted_text\`
- Summarisation is a long-running operation: \`client.begin_extract_summary(docs)\` or \`client.begin_abstract_summary(docs)\`, then \`.result()\`.

Authentication follows the usual Foundry rules: prefer **Microsoft Entra ID** (\`DefaultAzureCredential\`) and a managed identity in Azure; if you must use a key, read it from an environment variable or Key Vault, never from source. Each document can carry an id and a language hint; if you omit the language the service detects it, at a small cost in accuracy. Results are per document, so a batch of 10 reviews returns 10 sentiment results in order.`,
    },
    {
      heading: 'Prebuilt service or a language model prompt?',
      body: `A generative model can also do sentiment, entity extraction and summarisation if you prompt it well, and the AI-103 exam expects you to weigh the options. Rules of thumb for AI-901 scenarios:

- Choose **Azure Language** when you need **consistent, structured, scored output at scale and low cost**: sentiment scores for millions of reviews, standard entity categories, PII redaction with regulatory categories, extractive summaries that quote the source verbatim. It is deterministic, cheap per document and needs no prompt engineering.
- Choose a **language model** when the task is **open-ended or custom**: "summarise this contract for a non-lawyer in three bullets", extract a bespoke JSON schema with fields the service does not know, classify into categories you invent on the day, or reason across a document and a question. Ask for JSON and set a low temperature.
- Combine them when it helps: redact PII with Azure Language before sending text to a model, or use Content Understanding to transcribe a call and Azure Language to summarise it.

"Least development effort" in a scenario that lists a standard technique (sentiment, key phrases, entities, language, PII) points to the prebuilt service or its playground. "Custom categories" without training data points to a model prompt; "custom categories with labelled examples and a need for a trained, reusable model" points to custom text classification or custom NER.`,
    },
    {
      heading: 'The exam angle',
      body: `Classic items ask you to name the technique from the output: "returns 'Person: Satya Nadella, Organization: Microsoft'" (NER); "returns a Wikipedia URL for each entity" (entity linking); "returns positive 0.92 for a review" (sentiment); "returns ['battery life', 'fast charging']" (key phrases); "returns 'en' with 0.99" (language detection); "replaces phone numbers with asterisks" (PII detection and redaction); "produces a shorter version made of sentences copied from the original" (extractive summarisation) versus "written in new words" (abstractive).

Code items show a snippet and ask what is wrong or what it does: a missing \`show_opinion_mining=True\` when the requirement is per-aspect sentiment; passing a single string instead of a list of documents; reading \`sentiment\` on a result where \`is_error\` is true; using \`begin_*\` without calling \`.result()\`; a key hard-coded in the file.

Scenario items pit the Language service against neighbours: Azure Speech (audio, not text), Content Understanding (documents and multimodal files), Translator (changing language rather than detecting it), CLU (intent prediction for a bot rather than analysing a review). The most reliable discriminator is still the output: if the scenario wants categories, scores or redacted text from text you already have, it is Azure Language.`,
    },
  ],
  examples: [
    {
      title: 'Sentiment with opinion mining on hotel reviews',
      description:
        'A hospitality company wants per-aspect sentiment so it can see that "room" is negative while "staff" is positive within one review. Document-level sentiment alone would report "mixed" and hide the detail. Enabling opinion mining returns targets and their assessments with scores.',
      language: 'python',
      code: `import os
from azure.identity import DefaultAzureCredential
from azure.ai.textanalytics import TextAnalyticsClient

client = TextAnalyticsClient(endpoint=os.environ["LANGUAGE_ENDPOINT"],
                             credential=DefaultAzureCredential())

docs = ["The room was noisy and small, but the staff were wonderful."]
for doc in client.analyze_sentiment(docs, show_opinion_mining=True):
    if doc.is_error:
        continue
    print(doc.sentiment, doc.confidence_scores)          # mixed {...}
    for s in doc.sentences:
        for op in s.mined_opinions:
            print(op.target.text, op.target.sentiment,
                  [a.text for a in op.assessments])        # room negative ['noisy','small']`,
      takeaway: 'Opinion mining turns a "mixed" verdict into actionable per-aspect sentiment.',
    },
    {
      title: 'Redacting PII before sending tickets to a model (a realistic mistake)',
      description:
        'A team feeds raw support tickets, including phone numbers and card numbers, into a generative model to draft replies, and the compliance team objects. The fix is to run PII detection first and pass the redacted_text to the model. The service returns the entities it found and a copy of the text with them masked.',
      language: 'python',
      code: `results = client.recognize_pii_entities(tickets, language="en")
safe = [r.redacted_text for r in results if not r.is_error]
# "Call me on ************ about card ****************" -> safe to send onward
for r in results:
    for e in r.entities:
        print(e.category, e.confidence_score)   # PhoneNumber 0.8, CreditCardNumber 0.9`,
      takeaway: 'PII detection returns both the entities and a redacted text; redact before any downstream processing.',
    },
    {
      title: 'Extractive versus abstractive summary of a meeting transcript',
      description:
        'Legal wants a summary that quotes the transcript exactly; marketing wants a readable paragraph. Extractive summarisation (begin_extract_summary) selects original sentences, satisfying legal. Abstractive summarisation (begin_abstract_summary) writes new text for marketing. Both are long-running operations that return a poller you must resolve.',
      language: 'python',
      code: `poller = client.begin_extract_summary([transcript], max_sentence_count=4)
for result in poller.result():                  # wait for the operation to finish
    print(" ".join(s.text for s in result.sentences))`,
      takeaway: 'Extractive quotes, abstractive rewrites; summarisation calls begin with begin_ and need .result().',
    },
  ],
  keyPoints: [
    'Azure Language in Foundry Tools provides prebuilt text analysis: language detection, sentiment with opinion mining, key phrases, NER, entity linking, PII detection and redaction, summarisation, plus custom and conversational features.',
    'Identify the technique by its output: codes (language), scores (sentiment), phrase list (key phrases), categorised entities (NER), Wikipedia links (entity linking), masked text (PII), shorter text (summarisation).',
    'Extractive summarisation selects original sentences; abstractive writes new ones.',
    'Python: azure-ai-textanalytics TextAnalyticsClient(endpoint, credential); pass a list of documents; check is_error; summarisation uses begin_* and .result().',
    'Prefer DefaultAzureCredential; never hard-code keys.',
    'Prebuilt service for standard, scored, high-volume tasks; a language model prompt for open-ended or custom schemas; combine (redact first) when appropriate.',
    'Neighbouring distractors: Speech (audio), Content Understanding (files), Translator (changing language), CLU (bot intents).',
  ],
  flashcards: [
    { front: 'Which Azure Language feature returns "Person", "Organization", "Location" categories?', back: 'Named entity recognition (NER).' },
    { front: 'Which feature links entities to Wikipedia to disambiguate them?', back: 'Entity linking.' },
    { front: 'What does opinion mining add to sentiment analysis?', back: 'Targets (aspects) and assessments with their own sentiment, e.g. "room" -> negative ("noisy").' },
    { front: 'Extractive vs abstractive summarisation?', back: 'Extractive selects key sentences verbatim from the source; abstractive generates new sentences.' },
    { front: 'What does PII detection return besides the entities?', back: 'A redacted_text copy of the input with the PII masked.' },
    { front: 'Which Python package and class call Azure Language text analysis?', back: 'azure-ai-textanalytics, TextAnalyticsClient(endpoint=..., credential=...).' },
    { front: 'What input shape do TextAnalyticsClient methods expect?', back: 'A list of documents (strings or dicts with id, text, language), returning one result per document in order.' },
    { front: 'How do you call summarisation in the Python client?', back: 'client.begin_extract_summary(docs) or client.begin_abstract_summary(docs), then poller.result().' },
    { front: 'What does key phrase extraction return?', back: 'A list of the main concepts or talking points in the text.' },
    { front: 'When is a language model prompt preferable to Azure Language for text analysis?', back: 'Open-ended or custom tasks: bespoke JSON schemas, invented categories, reasoning over text plus a question.' },
    { front: 'Which Language feature predicts the intent of a user utterance for a bot?', back: 'Conversational language understanding (CLU).' },
  ],
  quiz: [
    {
      question:
        'A retailer wants to know, for each product review, whether the writer felt positive or negative about delivery specifically, even when the overall review is mixed. Which capability should they use?',
      options: ['Key phrase extraction', 'Sentiment analysis with opinion mining', 'Language detection', 'Entity linking'],
      correct: [1],
      explanation:
        'Opinion mining attaches sentiment to specific targets such as "delivery". Key phrases list topics without sentiment, language detection identifies the language, and entity linking maps entities to Wikipedia.',
    },
    {
      question:
        'An analyst wants a list of every company and person mentioned in a set of news articles. Which Azure Language feature returns this with category labels?',
      options: ['Named entity recognition', 'Extractive summarisation', 'PII detection', 'Key phrase extraction'],
      correct: [0],
      explanation:
        'NER returns entities with categories such as Person and Organization. Summarisation shortens text, PII detection targets personal identifiers, and key phrases are topics rather than categorised entities.',
    },
    {
      question:
        'Which TWO statements about summarisation in Azure Language are correct? (Select two)',
      options: [
        'Extractive summarisation returns sentences taken verbatim from the source.',
        'Abstractive summarisation generates new sentences that may not appear in the source.',
        'Summarisation is a synchronous call that returns immediately like detect_language.',
        'Summarisation can only be applied to audio files.',
      ],
      correct: [0, 1],
      explanation:
        'The two modes differ exactly this way. Summarisation is a long-running operation (begin_*/result()), and it applies to text and conversation transcripts, not raw audio.',
    },
    {
      question:
        'A developer\'s code calls client.analyze_sentiment("Great service!") and receives an error. What is the MOST likely cause?',
      options: [
        'Sentiment analysis requires opinion mining to be enabled.',
        'The method expects a list of documents, not a single string.',
        'The endpoint must be a Speech resource.',
        'Sentiment analysis is only available through the REST API.',
      ],
      correct: [1],
      explanation:
        'TextAnalyticsClient methods take a list of documents. Opinion mining is optional, the endpoint is a Language or Foundry resource, and the client library fully supports sentiment analysis.',
    },
    {
      question:
        'A bank must remove phone numbers, email addresses and account numbers from chat transcripts before storing them. Which feature provides this with the LEAST development effort?',
      options: ['PII detection with redacted text', 'Key phrase extraction', 'A custom text classification model', 'Language detection'],
      correct: [0],
      explanation:
        'PII detection returns the sensitive entities and a redacted copy out of the box. Key phrases and language detection do not remove data, and a custom classifier would need training and still not redact.',
    },
    {
      question:
        'A company wants to summarise contracts "for a non-lawyer, in three bullets, highlighting payment terms and termination clauses". Which approach fits BEST?',
      options: [
        'Azure Language extractive summarisation',
        'A deployed language model with a prompt specifying the audience, format and focus',
        'Azure Language language detection',
        'Azure Speech text to speech',
      ],
      correct: [1],
      explanation:
        'An audience-specific, format-specific, focused summary is an open-ended generative task. Extractive summarisation copies sentences and cannot target an audience, and the other options are unrelated.',
    },
  ],
  statements: [
    { text: 'Named entity recognition returns entities with categories such as Person, Organization and Location.', isTrue: true, explanation: 'That is NER\'s purpose.' },
    { text: 'Key phrase extraction returns the sentiment of each phrase.', isTrue: false, explanation: 'Key phrases are topics; sentiment comes from sentiment analysis (with opinion mining for per-aspect detail).' },
    { text: 'Abstractive summarisation may produce sentences that do not appear in the original text.', isTrue: true, explanation: 'It generates new wording; extractive summarisation quotes the source.' },
    { text: 'Azure Language can detect PII and return a redacted version of the text.', isTrue: true, explanation: 'recognize_pii_entities returns entities and redacted_text.' },
    { text: 'Azure Language is the right service to transcribe recorded phone calls.', isTrue: false, explanation: 'Transcription is Azure Speech (or Content Understanding for audio files); Azure Language analyses text.' },
    { text: 'TextAnalyticsClient methods accept a single document string as input.', isTrue: false, explanation: 'They accept a list of documents and return one result per document.' },
    { text: 'A language model prompt can perform custom entity extraction with a bespoke JSON schema that Azure Language does not offer.', isTrue: true, explanation: 'Generative prompting is the flexible option for custom or open-ended schemas.' },
  ],
  resources: [
    { label: 'What is Azure Language in Foundry Tools?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview' },
    { label: 'Quickstart: Sentiment analysis and opinion mining', url: 'https://learn.microsoft.com/en-us/azure/ai-services/language-service/sentiment-opinion-mining/quickstart' },
    { label: 'Quickstart: Named entity recognition', url: 'https://learn.microsoft.com/en-us/azure/ai-services/language-service/named-entity-recognition/quickstart' },
    { label: 'Quickstart: Summarization', url: 'https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/quickstart' },
  ],
};
