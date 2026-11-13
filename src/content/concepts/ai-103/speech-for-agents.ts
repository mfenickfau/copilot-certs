import type { Concept } from '../../types';

export const speechForAgents: Concept = {
  id: 'speech-for-agents',
  title: 'Speech for Agentic Interactions: Speech to Text, Text to Speech, Voice Agents and Speech Translation',
  summary:
    'Building voice workflows for agents: speech-to-text and text-to-speech with Azure Speech in Foundry Tools (Speech SDK, fast transcription, custom speech, custom voice), speech as an agent modality through Voice Live, voice-based prompt agents and GPT-Live, multimodal reasoning over audio inputs with audio-capable models (gpt-audio, gpt-realtime, Content Understanding audio analyzers), and translating speech with the Speech SDK TranslationRecognizer, GPT Realtime Translate and LLM flows.',
  certs: ['ai-103', 'ai-901'],
  domains: ['ai-103-4', 'ai-901-2'],
  outcomes: ['ai-103-4-2-1', 'ai-103-4-2-2', 'ai-103-4-2-3', 'ai-103-4-2-4', 'ai-901-2-2-3'],
  tags: ['speech', 'speech-to-text', 'text-to-speech', 'voice-live', 'voice-agents', 'realtime-api', 'custom-speech', 'speech-translation', 'python', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Speech to text and text to speech building blocks',
      body: `**Azure Speech in Foundry Tools** is consumed through the **Speech SDK** (\`azure-cognitiveservices-speech\`, \`import azure.cognitiveservices.speech as speechsdk\`) or REST. Configure once with \`SpeechConfig(subscription=KEY, endpoint=ENDPOINT)\` (or a token credential), then:

- **Speech to text**: \`SpeechRecognizer(speech_config, audio_config)\` with \`recognize_once_async()\` for a single utterance (up to about 30 seconds) or \`start_continuous_recognition()\` with event handlers for long audio; \`AudioConfig(use_default_microphone=True)\` or \`AudioConfig(filename=...)\`; set \`speech_recognition_language\` or enable **language identification**; add **phrase lists** for just-in-time vocabulary boosts. For files, **fast transcription** (synchronous REST, returns a whole transcript quickly) and **batch transcription** (asynchronous, bulk, supports diarization) are the scalable options; **gpt-4o-transcribe / mai-transcribe** style models are also available through the Audio and Realtime APIs.
- **Text to speech**: \`SpeechSynthesizer(speech_config, audio_config)\` with \`speak_text_async(text)\` or \`speak_ssml_async(ssml)\`; choose from 600+ standard and HD neural voices across 150+ locales via \`speech_synthesis_voice_name\`; **SSML** controls prosody, pauses, pronunciation and styles; \`audio_config=None\` returns bytes (\`result.audio_data\`) for streaming; **custom voice** (professional or personal) creates a brand voice; **text to speech avatar** adds a synchronised video presenter.
- **Custom speech** improves recognition of domain vocabulary and acoustic conditions: upload text and audio data, train, measure **word error rate (WER)** against a human transcript, deploy to a custom endpoint (required for real-time; optional for batch), then point \`SpeechConfig.endpoint_id\` at it. Pronunciation and display-text customisation (inverse text normalisation, rewrite, profanity) sit alongside.

The simplest agentic voice loop is the pipeline: STT → text agent (Responses API) → TTS. It is easy to reason about and works with any text agent, at the cost of latency between turns and losing paralinguistic cues.`,
    },
    {
      heading: 'Speech as an agent modality: Voice Live, voice-based prompt agents and GPT-Live',
      body: `Foundry offers managed **speech-to-speech** so you do not chain STT, LLM and TTS yourself.

- **Voice Live API**: a WebSocket API compatible with the Azure OpenAI Realtime API that bundles a generative model (gpt-realtime family, GPT-5, GPT-4.1, Phi), Azure STT and TTS voices (including custom voice), **noise suppression**, **echo cancellation**, **interruption** and **end-of-turn detection** (server VAD, semantic VAD), avatars and **function calling**; models are fully managed (no deployment). The Python SDK is \`azure-ai-voicelive\`: \`async with connect(endpoint=..., credential=..., model=...) as conn\`, then \`conn.session.update(session=RequestSession(modalities=[Modality.TEXT, Modality.AUDIO], instructions=..., voice=AzureStandardVoice(name=...), input_audio_format=InputAudioFormat.PCM16, turn_detection=ServerVad(...), input_audio_noise_reduction=AudioNoiseReduction(...)))\`, stream microphone PCM16 at 24 kHz, and handle server events (transcripts, audio deltas, tool calls). Voice Live can also drive an existing **Foundry text agent** by agent id, reusing its instructions and tools.
- **Voice-based prompt agents (preview)** in Foundry Agent Service: create an agent with interaction mode **Voice** (fixed at creation), configure model, instructions, audio settings, greeting and tools (MCP, toolboxes), test in the playground, and connect over WebSocket; Foundry manages the voice pipeline, tool execution, identity, tracing and **telephony channels** (SIP and provider integrations). Voice agents can delegate to **subagents** (inline or delegate) and send images in a turn.
- **GPT Realtime / GPT-Live**: the Realtime API (WebSocket, WebRTC or SIP) for low-latency speech-to-speech with your own orchestration; **GPT-Live** is full-duplex (listens while speaking), delegating lookups and tools to a backend while the live model handles the spoken exchange.

Design choices items probe: use Voice Live or a voice-based prompt agent when you want a managed pipeline with Azure voices and telephony; use the Realtime API or GPT-Live when you need full-duplex behaviour or custom orchestration; use the STT → agent → TTS pipeline when accuracy-critical transcripts, custom speech models or batch processing dominate. Custom speech and phrase lists plug into Voice Live inputs; custom voice plugs into outputs.`,
    },
    {
      heading: 'Multimodal reasoning over audio inputs',
      body: `Sometimes the goal is to *reason* about audio rather than converse. Options, from most to least conversational:

- **Audio-capable chat models** (\`gpt-audio\`, \`gpt-audio-mini\`, gpt-4o-audio) accept audio as a content part in Chat Completions (\`{"type": "input_audio", "input_audio": {"data": base64_wav, "format": "wav"}}\`) and can return audio (\`modalities=["text", "audio"]\`, \`audio={"voice": ..., "format": "wav|mp3|flac|opus|pcm16|aac"}\`). Use them to answer questions about a recording ("what did the customer agree to?"), detect tone, or respond in speech, all in one call.
- **Realtime and Voice Live sessions** reason over streaming audio with tool calls, so an agent can act on what it hears.
- **Content Understanding audio analyzers** (\`prebuilt-audioSearch\`, custom analyzers on \`prebuilt-audio\`) transcribe with diarization, speaker roles and timestamps, then generate fields (summary, sentiment, topics, compliance flags) for call-centre analytics, podcasts and meeting records; output Markdown and JSON ready for RAG. Multilingual transcription handles mixed-language calls.
- **Transcribe then reason**: fast or batch transcription followed by a text model with structured outputs; cheapest for large archives and lets you redact PII in text before the LLM sees it.

Guardrails note: the Foundry guardrail system does not apply to prompts and completions processed by audio transcription models, so moderate transcripts with Content Safety text analysis when needed. Whisper and gpt-4o-transcribe deployments handle file transcription with the \`/audio/transcriptions\` endpoint; \`/audio/translations\` returns English text from foreign speech.`,
    },
    {
      heading: 'Speech translation and the exam angle',
      body: `Three ways to translate speech:

1. **Speech SDK speech translation**: \`SpeechTranslationConfig(subscription, endpoint)\`, set \`speech_recognition_language="en-US"\` and \`add_target_language("it")\` (several targets allowed), then \`TranslationRecognizer(translation_config, audio_config).recognize_once_async()\`; \`result.translations["it"]\` holds the text, and you can synthesise translated speech by setting \`voice_name\` for speech-to-speech translation. Supports custom speech models for the source side and continuous recognition for live captions.
2. **GPT Realtime Translate** (and GPT-Live speech translation): a purpose-built realtime model that translates a continuous audio stream into translated speech *and* transcript with low latency, without segmenting; deploy from the catalog as Global Standard and use the Realtime API patterns. Best for live events, cross-language calls and multilingual voice assistants.
3. **LLM translation flows**: transcribe (STT, Whisper), translate text with a chat model (tone, glossary, formatting) or **Azure Translator**, then TTS; most control, highest latency.

Exam framings: "transcribe 50,000 archived calls and extract complaints" → batch transcription or Content Understanding audio analyzer plus text model; "the agent must understand factory jargon that the base model mis-hears" → custom speech (train, measure WER, deploy endpoint) or phrase lists for small lists; "brand-consistent voice for the assistant" → custom voice; "voice bot that handles interruptions and background noise in a call centre" → Voice Live or a voice-based prompt agent with server VAD, noise suppression and echo cancellation; "a phone agent that listens while it speaks" → GPT-Live; "live simultaneous interpretation of a conference" → GPT Realtime Translate; "reuse an existing text agent's tools in a voice channel" → Voice Live bound to the agent (or migrate to a voice-based prompt agent); "answer a question about an uploaded voicemail" → audio-capable chat model with input_audio.`,
    },
  ],
  examples: [
    {
      title: 'STT → agent → TTS pipeline with the Speech SDK',
      description:
        'A kiosk captures one spoken request, sends the transcript to a Foundry prompt agent through the Responses API, and speaks the reply with a neural voice. A phrase list boosts product names.',
      language: 'python',
      code: `import azure.cognitiveservices.speech as speechsdk

speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, endpoint=SPEECH_ENDPOINT)
speech_config.speech_recognition_language = "en-GB"
speech_config.speech_synthesis_voice_name = "en-GB-SoniaNeural"

recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config,
    audio_config=speechsdk.audio.AudioConfig(use_default_microphone=True))
phrases = speechsdk.PhraseListGrammar.from_recognizer(recognizer)
for p in ["Contoso K200", "ClickBoard Pro"]:
    phrases.addPhrase(p)                              # just-in-time vocabulary boost

heard = recognizer.recognize_once_async().get()
if heard.reason == speechsdk.ResultReason.RecognizedSpeech:
    reply = openai.responses.create(conversation=conv.id, input=heard.text).output_text  # agent-bound client
    synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config,
        audio_config=speechsdk.audio.AudioOutputConfig(use_default_speaker=True))
    synthesizer.speak_text_async(reply).get()`,
      takeaway: 'The pipeline pattern composes any text agent with STT and TTS; phrase lists and custom speech improve recognition of domain terms.',
    },
    {
      title: 'Voice Live session with noise suppression, VAD and an Azure voice',
      description:
        'A contact-centre voice assistant uses the Voice Live SDK: one WebSocket session carries audio both ways, with server VAD for turn-taking, noise reduction and echo cancellation, and instructions that define the agent role.',
      language: 'python',
      code: `from azure.ai.voicelive.aio import connect
from azure.ai.voicelive.models import (RequestSession, Modality, InputAudioFormat, OutputAudioFormat,
    AzureStandardVoice, ServerVad, AudioNoiseReduction, AudioEchoCancellation, ServerEventType)
from azure.identity.aio import DefaultAzureCredential

async def run():
    async with connect(endpoint=VOICELIVE_ENDPOINT, credential=DefaultAzureCredential(),
                       model="gpt-realtime") as conn:          # managed model, no deployment needed
        await conn.session.update(session=RequestSession(
            modalities=[Modality.TEXT, Modality.AUDIO],
            instructions="You are Contoso's billing assistant. Be brief and confirm account numbers.",
            voice=AzureStandardVoice(name="en-US-Ava:DragonHDLatestNeural"),
            input_audio_format=InputAudioFormat.PCM16, output_audio_format=OutputAudioFormat.PCM16,
            turn_detection=ServerVad(threshold=0.5, silence_duration_ms=500),
            input_audio_noise_reduction=AudioNoiseReduction(type="azure_deep_noise_suppression"),
            input_audio_echo_cancellation=AudioEchoCancellation(),
        ))
        asyncio.create_task(stream_microphone(conn))          # append 24 kHz PCM16 chunks
        async for event in conn:
            if event.type == ServerEventType.RESPONSE_AUDIO_DELTA:
                play(event.delta)
            elif event.type == ServerEventType.RESPONSE_AUDIO_TRANSCRIPT_DONE:
                log(event.transcript)`,
      takeaway: 'Voice Live replaces the STT/LLM/TTS chain with one managed session that handles turn detection, audio cleanup, voices and tool calls.',
    },
    {
      title: 'The jargon problem and the custom speech fix (a realistic mistake)',
      description:
        'A maintenance voice agent transcribed "VFD inverter trip" as "VHD inventor trip" and routed tickets wrongly. The team first tried rewriting the agent instructions, which cannot fix recognition. The fix was a custom speech model trained on equipment names and shop-floor audio, validated by WER against human transcripts, deployed to an endpoint, and referenced from the Speech configuration (and Voice Live input settings).',
      language: 'python',
      code: `# Point recognition at the deployed custom speech endpoint
speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, endpoint=SPEECH_ENDPOINT)
speech_config.speech_recognition_language = "en-US"
speech_config.endpoint_id = CUSTOM_SPEECH_ENDPOINT_ID        # from the custom speech deployment

# Speech translation with the same custom model on the source side
tcfg = speechsdk.translation.SpeechTranslationConfig(subscription=SPEECH_KEY, endpoint=SPEECH_ENDPOINT)
tcfg.speech_recognition_language = "en-US"
tcfg.endpoint_id = CUSTOM_SPEECH_ENDPOINT_ID
tcfg.add_target_language("de")
tcfg.voice_name = "de-DE-KatjaNeural"                       # speech-to-speech translation
translator = speechsdk.translation.TranslationRecognizer(translation_config=tcfg,
    audio_config=speechsdk.audio.AudioConfig(use_default_microphone=True))
result = translator.recognize_once_async().get()
print(result.text, "->", result.translations["de"])`,
      takeaway: 'Recognition errors are fixed in the speech layer (custom speech, phrase lists), not in the agent prompt; the custom model also serves speech translation.',
    },
  ],
  keyPoints: [
    'Speech SDK basics: SpeechConfig, SpeechRecognizer (recognize_once_async or continuous recognition), SpeechSynthesizer (speak_text_async, SSML, voice names), AudioConfig for microphone, file or bytes; fast and batch transcription for files.',
    'Custom speech trains on text and audio to fix domain vocabulary and acoustic conditions, is measured by word error rate, and must be deployed to an endpoint for real-time use; phrase lists are the lightweight alternative; custom voice brands the output.',
    'Voice Live is a managed speech-to-speech WebSocket API (Realtime-compatible) with gpt-realtime and other models, Azure voices, noise suppression, echo cancellation, interruption and end-of-turn detection, avatars and function calling; it can drive an existing Foundry text agent.',
    'Voice-based prompt agents (preview) make voice a first-class agent mode in Foundry Agent Service with managed pipeline, tools, tracing, subagents and telephony channels; interaction mode is fixed at creation.',
    'GPT Realtime (WebSocket, WebRTC, SIP) and full-duplex GPT-Live suit custom low-latency orchestration where the agent listens while speaking and delegates work to a backend.',
    'Audio reasoning: gpt-audio models accept input_audio parts and can return audio; Content Understanding audio analyzers produce diarized transcripts plus generated fields; transcribe-then-reason is cheapest for archives.',
    'Speech translation: SpeechTranslationConfig with add_target_language and TranslationRecognizer (optionally voice_name for speech-to-speech), GPT Realtime Translate for continuous low-latency streams, or STT plus Translator or LLM plus TTS for maximum control.',
    'Guardrails do not cover audio transcription models, so moderate transcripts separately; the STT → agent → TTS pipeline remains valid when transcripts, custom models or batch processing matter most.',
  ],
  flashcards: [
    { front: 'Which Speech SDK method transcribes a single utterance of up to about 30 seconds?', back: 'SpeechRecognizer.recognize_once_async(); use continuous recognition for longer audio.' },
    { front: 'How do you get synthesised speech as bytes instead of playing it?', back: 'Create SpeechSynthesizer with audio_config=None and read result.audio_data.' },
    { front: 'What metric validates a custom speech model and what deployment step is required for real-time use?', back: 'Word error rate (WER) against human transcripts; deploy the model to a custom endpoint and reference its endpoint_id (batch transcription does not need the endpoint).' },
    { front: 'Name four audio-quality features Voice Live adds over a raw Realtime session.', back: 'Noise suppression, echo cancellation, robust interruption detection and advanced end-of-turn detection (plus avatars and Azure custom voices).' },
    { front: 'Do you need to deploy a model to use Voice Live?', back: 'No; Voice Live models are fully managed and selected by name in the session.' },
    { front: 'Which Voice Live SDK objects configure a session?', back: 'connect(endpoint, credential, model) and RequestSession with modalities, instructions, voice, audio formats, turn_detection (ServerVad or semantic VAD) and noise or echo settings.' },
    { front: 'What is GPT-Live?', back: 'A full-duplex voice API: the live model listens and speaks simultaneously and delegates reasoning, tools and lookups to a backend such as a Responses API agent.' },
    { front: 'How do you send audio to a chat model for reasoning?', back: 'Use an audio-capable model (gpt-audio, gpt-audio-mini) with an input_audio content part containing base64 data and format; set modalities to include audio for spoken replies.' },
    { front: 'Which Speech SDK classes perform speech translation?', back: 'SpeechTranslationConfig (speech_recognition_language, add_target_language, optional voice_name) and TranslationRecognizer; results are in result.translations[lang].' },
    { front: 'When is GPT Realtime Translate the best fit?', back: 'Continuous, low-latency translation of live speech into translated speech and transcript: conferences, cross-language support calls, multilingual voice assistants.' },
    { front: 'Which Content Understanding analyzer gives diarized transcripts plus summaries for call analytics?', back: 'prebuilt-audioSearch, or a custom analyzer based on prebuilt-audio with generated fields such as sentiment and topics.' },
  ],
  quiz: [
    {
      question:
        'A utility company wants a phone assistant that handles background noise, lets callers interrupt, uses the company\'s custom neural voice and calls existing APIs, with minimal custom orchestration. Which option is MOST appropriate?',
      options: [
        'A batch transcription job followed by email replies.',
        'Voice Live (or a voice-based prompt agent) with server VAD, noise suppression, echo cancellation, the custom voice and function calling.',
        'Azure Translator document translation.',
        'Azure Vision Read.',
      ],
      correct: [1],
      explanation:
        'Voice Live and voice-based prompt agents provide a managed speech-to-speech pipeline with exactly these features. Batch transcription is asynchronous, and Translator and Vision are unrelated.',
    },
    {
      question: 'Field technicians\' recordings contain equipment names the base speech model consistently mis-transcribes. Which TWO actions address the problem? (Select two)',
      options: [
        'Add the terms to a phrase list for just-in-time boosting.',
        'Rewrite the agent\'s system prompt to ask it to fix transcription errors.',
        'Train a custom speech model with domain text and audio, validate WER and deploy it to an endpoint.',
        'Increase the model temperature.',
      ],
      correct: [0, 2],
      explanation:
        'Recognition is fixed in the speech layer with phrase lists (small lists) or custom speech (robust). Prompts and temperature act after transcription and cannot recover mis-heard words.',
    },
    {
      question: 'An international conference needs live spoken interpretation into three languages with the lowest latency and continuous output. Which capability fits BEST?',
      options: [
        'GPT Realtime Translate through the Realtime API.',
        'Document translation of the slide deck.',
        'Batch transcription after the event.',
        'Content Understanding audio analyzer.',
      ],
      correct: [0],
      explanation:
        'GPT Realtime Translate processes streaming audio continuously and outputs translated speech and transcripts. The others are offline or non-speech options.',
    },
    {
      question: 'A compliance team must process 100,000 archived call recordings to produce diarized transcripts, a summary and a complaint flag per call for a RAG index. What should you use?',
      options: [
        'Voice Live sessions replayed from files.',
        'Content Understanding audio analyzer (prebuilt-audioSearch or a custom audio analyzer with generated fields), or batch transcription followed by a text model.',
        'GPT-Live.',
        'Speech SDK recognize_once_async per file.',
      ],
      correct: [1],
      explanation:
        'Audio analyzers or batch transcription are built for bulk, offline processing with diarization and structured fields. Voice Live and GPT-Live are real-time conversational APIs, and recognize_once handles short utterances.',
    },
    {
      question: 'Which statement about voice-based prompt agents in Foundry Agent Service is correct?',
      options: [
        'You can switch an existing text agent to voice mode at any time.',
        'The interaction mode (text or voice) is chosen at creation and cannot be changed afterwards.',
        'They require you to deploy and manage a speech pipeline in your own container.',
        'They cannot use tools.',
      ],
      correct: [1],
      explanation:
        'Interaction mode is fixed when the agent is created; Foundry manages the voice pipeline, and tools (MCP, toolboxes) are supported.',
    },
  ],
  statements: [
    { text: 'Voice Live is designed to be compatible with the Azure OpenAI Realtime API events.', isTrue: true, explanation: 'Its events largely match the Realtime API with optional additive Azure speech features.' },
    { text: 'A custom speech model must be deployed to a custom endpoint before it can be used with batch transcription.', isTrue: false, explanation: 'Batch transcription can use a custom model without a hosted endpoint; real-time recognition requires the endpoint.' },
    { text: 'Foundry guardrails apply to prompts and completions processed by audio transcription models.', isTrue: false, explanation: 'Audio transcription models are excluded; moderate transcripts separately with Content Safety.' },
    { text: 'The Speech SDK TranslationRecognizer can target several languages in one recognition.', isTrue: true, explanation: 'Call add_target_language for each target; results are keyed by language code.' },
    { text: 'gpt-audio models can both accept audio input and return spoken audio in Chat Completions.', isTrue: true, explanation: 'Use input_audio parts for input and set modalities to text and audio for output.' },
    { text: 'GPT-Live waits for the user to finish speaking before it can start responding.', isTrue: false, explanation: 'GPT-Live is full-duplex: it listens and speaks simultaneously and handles interruptions.' },
    { text: 'Voice Live can connect to an existing Foundry text agent so the agent\'s instructions and tools drive the spoken conversation.', isTrue: true, explanation: 'Voice Live with Foundry Agent Service uses the agent id instead of session instructions.' },
  ],
  resources: [
    { label: 'Voice Live API for real-time voice agents', url: 'https://learn.microsoft.com/en-us/azure/ai-services/speech-service/voice-live' },
    { label: 'What is custom speech?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/speech-service/custom-speech-overview' },
    { label: 'What is speech translation?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-translation' },
    { label: 'GPT Realtime Translate overview', url: 'https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/gpt-realtime-translate' },
  ],
};
