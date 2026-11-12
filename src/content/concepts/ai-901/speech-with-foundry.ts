import type { Concept } from '../../types';

export const speechWithFoundry: Concept = {
  id: 'speech-with-foundry',
  title: 'Speech Solutions: Azure Speech and Audio-Capable Models in Foundry',
  summary:
    'Speech recognition (speech to text) and speech synthesis (text to speech) explained with their key features, the two ways to build spoken experiences in Foundry (Azure Speech in Foundry Tools with the Speech SDK, or an audio-capable multimodal model such as gpt-audio or gpt-realtime), and the small Python apps the exam expects you to recognise.',
  certs: ['ai-901', 'ai-103'],
  domains: ['ai-901-1', 'ai-901-2', 'ai-103-4'],
  outcomes: ['ai-901-1-3-3', 'ai-901-2-2-2', 'ai-901-2-2-3', 'ai-103-4-2-1', 'ai-103-4-2-3'],
  tags: ['speech', 'speech-to-text', 'text-to-speech', 'speech-sdk', 'multimodal', 'voice-live', 'python', 'intermediate'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Speech recognition and speech synthesis',
      body: `**Speech recognition** (speech to text, STT) converts spoken audio into text. **Speech synthesis** (text to speech, TTS) converts text into spoken audio. Both are provided by **Azure Speech in Foundry Tools**, which you access through a Foundry resource, the **Speech SDK** (Python, C#, JavaScript, Java and more), the Speech CLI, or REST APIs, and which you can try in the Foundry portal's speech playgrounds.

Speech to text features to know:
- **Real-time transcription** of streaming audio from a microphone or stream, with interim results, used for captions, dictation and voice commands.
- **Fast transcription** for pre-recorded files when you need the result quickly, and **batch transcription** for large volumes processed asynchronously.
- **Language identification** (detect which of several candidate languages is spoken), **speaker diarization** (who said what), **phrase lists** (boost recognition of product names and jargon), profanity filtering, and output formats (display text, lexical, with timestamps).
- **Custom speech** models trained on your own audio and text to handle accents, noise and domain vocabulary.
- **Pronunciation assessment** scores a learner's accuracy and fluency.

Text to speech features to know:
- **Neural (standard) voices**: natural, humanlike voices in many languages and styles, selected by name (for example \`en-US-Ava:DragonHDLatestNeural\`).
- **Speech Synthesis Markup Language (SSML)**: XML that controls pitch, rate, volume, pauses, pronunciation and speaking style.
- **Custom voice**: a brand-specific voice trained on recordings (gated, with responsible-AI requirements).
- **Text-to-speech avatar**: a synthetic talking-head video.

**Speech translation** combines recognition, translation and optional synthesis for real-time speech-to-speech or speech-to-text translation, and **Voice Live** provides a managed, low-latency conversational voice interface for agents.`,
    },
    {
      heading: 'Building a lightweight speech app with the Speech SDK',
      body: `The Python package is \`azure-cognitiveservices-speech\`, imported as \`speechsdk\`. Every app follows the same three objects:

1. **SpeechConfig**: your resource's key (or token) and endpoint or region, plus settings such as the recognition language or the synthesis voice name.
2. **AudioConfig**: where audio comes from or goes to. \`AudioConfig(use_default_microphone=True)\` or \`AudioConfig(filename="call.wav")\` for input; \`AudioOutputConfig(use_default_speaker=True)\` or \`AudioOutputConfig(filename="out.wav")\` for output.
3. **A recognizer or synthesizer**: \`SpeechRecognizer(speech_config, audio_config)\` with \`recognize_once_async().get()\` for a single utterance (up to about 30 seconds or until silence) or \`start_continuous_recognition()\` with event handlers for long audio; \`SpeechSynthesizer(speech_config, audio_config)\` with \`speak_text_async(text).get()\` or \`speak_ssml_async(ssml).get()\`.

Always check \`result.reason\`: \`RecognizedSpeech\` means success, \`NoMatch\` means audio contained no recognisable speech, and \`Canceled\` carries \`cancellation_details\` with the error (bad key, wrong region, unsupported format). For synthesis, \`SynthesizingAudioCompleted\` is success. The portal's speech playground shows the same code in its Code tab, and the portal lets you pick a voice from the **voice gallery** and hear it before writing anything. Audio for file-based recognition should be WAV (16 kHz, 16-bit, mono PCM is the safe default); other formats need compressed-audio support.`,
    },
    {
      heading: 'Responding to spoken prompts with a multimodal model',
      body: `The second route skips the separate STT and TTS steps: deploy an **audio-capable multimodal model** and send audio directly. Options in Foundry:

- **gpt-audio** and **gpt-audio-mini** extend the Chat Completions API with an audio modality. You pass \`modalities=["text", "audio"]\`, include an \`input_audio\` content part (base64 WAV or MP3) in the user message, and optionally set \`audio={"voice": "alloy", "format": "wav"}\` to receive spoken output. The model hears the question, reasons about it and answers in text and/or audio in one call. In the portal you test these in the **chat playground** (the dedicated audio playground does not support them).
- **gpt-realtime** models use a WebSocket **Realtime API** for low-latency, interruptible speech-to-speech conversation, which is what voice agents use.
- **gpt-4o-mini-tts** is a model-based text-to-speech option, and **Whisper** or the newer transcription models provide STT through the audio transcriptions API.

How to choose: use the **multimodal model** when you want one call to understand *and respond to* spoken input conversationally, or when the question requires reasoning about the audio's content and tone. Use **Azure Speech** when you need precise transcripts with timestamps, diarization, custom vocabulary, batch processing of thousands of files, SSML-controlled synthesis, specific neural or custom voices, or speech translation. Foundry's **voice-based prompt agents** show both architectures: *native speech-to-speech* (one realtime model) for the most natural latency, or *cascaded* (Speech STT → text model → Speech TTS) for broader model and voice choice and explicit control over each stage.`,
    },
    {
      heading: 'The exam angle',
      body: `Feature-identification items: "identify which of three languages a caller is speaking" (language identification), "label who spoke each line in a meeting recording" (speaker diarization), "improve recognition of our product names" (phrase list or custom speech), "control pauses and pronunciation in the read-aloud output" (SSML), "process 10,000 recordings overnight" (batch transcription), "a brand-specific voice" (custom voice), "live subtitles translated into Spanish" (speech translation).

Code items: a snippet with \`SpeechRecognizer\` means speech to text, \`SpeechSynthesizer\` means text to speech; \`recognize_once_async\` handles one utterance while continuous recognition handles long audio; \`speech_synthesis_voice_name\` selects the voice; a \`Canceled\` result with an authentication error means the key or region is wrong, not that the audio was silent (that is \`NoMatch\`).

Architecture items: "respond to spoken questions about an uploaded chart with a spoken answer in a single request" points to an audio-capable multimodal model such as gpt-audio; "a low-latency, interruptible voice conversation" points to gpt-realtime or Voice Live; "exact transcripts with timestamps for compliance" points to Azure Speech. Distractors include Azure Language (text only), Content Understanding audio analyzers (good for post-call analytics on files, not real-time captioning) and Translator (text translation).`,
    },
  ],
  examples: [
    {
      title: 'Transcribe a WAV file and read the answer aloud',
      description:
        'A small helpdesk utility: recognise a recorded question from a WAV file, then synthesise a spoken confirmation using a neural voice. It shows the SpeechConfig / AudioConfig / recognizer-synthesizer pattern and the result-reason checks.',
      language: 'python',
      code: `import os
import azure.cognitiveservices.speech as speechsdk

speech_config = speechsdk.SpeechConfig(subscription=os.environ["SPEECH_KEY"],
                                       endpoint=os.environ["ENDPOINT"])
speech_config.speech_recognition_language = "en-GB"

# Speech to text from a file
audio_in = speechsdk.audio.AudioConfig(filename="question.wav")
recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_in)
result = recognizer.recognize_once_async().get()
if result.reason == speechsdk.ResultReason.RecognizedSpeech:
    print("Heard:", result.text)
elif result.reason == speechsdk.ResultReason.NoMatch:
    print("No speech recognised")
elif result.reason == speechsdk.ResultReason.Canceled:
    print("Error:", result.cancellation_details.error_details)

# Text to speech to the default speaker
speech_config.speech_synthesis_voice_name = "en-GB-SoniaNeural"
audio_out = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_out)
synthesizer.speak_text_async("Thanks, I have logged your question.").get()`,
      takeaway: 'SpeechConfig plus AudioConfig plus a recognizer or synthesizer is the whole Speech SDK pattern; always branch on result.reason.',
    },
    {
      title: 'Answering a spoken question with gpt-audio-mini',
      description:
        'Instead of transcribing and then prompting, the app sends the audio directly to an audio-capable model and asks for both a text and a spoken reply. One call replaces the STT, LLM and TTS steps for a conversational use case.',
      language: 'python',
      code: `import base64
audio_b64 = base64.b64encode(open("question.wav", "rb").read()).decode()

openai = project.get_openai_client()          # from AIProjectClient
completion = openai.chat.completions.create(
    model="gpt-audio-mini",                   # deployment name
    modalities=["text", "audio"],
    audio={"voice": "alloy", "format": "wav"},
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Answer the question in this recording briefly."},
            {"type": "input_audio", "input_audio": {"data": audio_b64, "format": "wav"}},
        ],
    }],
)
print(completion.choices[0].message.audio.transcript)   # text version of the spoken answer
open("answer.wav", "wb").write(base64.b64decode(completion.choices[0].message.audio.data))`,
      takeaway: 'Audio-capable models take input_audio content and can return spoken output, collapsing the STT-LLM-TTS pipeline into one request.',
    },
    {
      title: 'Blaming the microphone when the key was wrong (a realistic mistake)',
      description:
        'A developer\'s recognizer returns a Canceled result and they spend an hour testing microphones. Printing cancellation_details shows an authentication error: the SPEECH_KEY environment variable pointed to a resource in a different region than the endpoint. Silence or background noise would have produced NoMatch, not Canceled. Fixing the configuration resolved it.',
      takeaway: 'Canceled means a service or configuration error; NoMatch means the audio had no recognisable speech. Read cancellation_details before debugging audio.',
    },
  ],
  keyPoints: [
    'Speech to text converts audio to text (real-time, fast, batch); text to speech converts text to audio with neural voices and SSML; both come from Azure Speech in Foundry Tools.',
    'STT features: language identification, speaker diarization, phrase lists, custom speech, timestamps, pronunciation assessment; TTS features: voice gallery, SSML, custom voice, avatars.',
    'Speech SDK pattern: SpeechConfig (key/endpoint, language or voice) + AudioConfig (mic, file, speaker) + SpeechRecognizer or SpeechSynthesizer; check result.reason.',
    'recognize_once_async for a single utterance; continuous recognition for long audio; speak_text_async or speak_ssml_async for synthesis.',
    'Audio-capable multimodal models (gpt-audio, gpt-audio-mini) accept input_audio and can return spoken output in one call; gpt-realtime and Voice Live handle low-latency conversations.',
    'Choose Azure Speech for precise transcripts, diarization, custom vocabulary, batch and SSML control; choose a multimodal model for conversational understanding and response in one request.',
    'Voice agents can be native speech-to-speech (one realtime model) or cascaded (STT, text model, TTS).',
  ],
  flashcards: [
    { front: 'What is speech recognition and what is speech synthesis?', back: 'Recognition (speech to text) converts spoken audio to text; synthesis (text to speech) converts text to spoken audio.' },
    { front: 'Which Speech feature identifies who spoke each part of a recording?', back: 'Speaker diarization.' },
    { front: 'Which Speech feature detects which language is being spoken?', back: 'Language identification.' },
    { front: 'How do you improve recognition of product names and jargon?', back: 'Phrase lists for a quick boost, or a custom speech model trained on your data.' },
    { front: 'What is SSML?', back: 'Speech Synthesis Markup Language: XML that controls pitch, rate, volume, pauses, pronunciation and style of synthesised speech.' },
    { front: 'Which three Speech SDK objects appear in almost every app?', back: 'SpeechConfig, AudioConfig (or AudioOutputConfig), and SpeechRecognizer or SpeechSynthesizer.' },
    { front: 'recognize_once_async vs continuous recognition?', back: 'recognize_once handles a single utterance (up to about 30 seconds or until silence); continuous recognition streams long audio with events.' },
    { front: 'A recognizer returns ResultReason.NoMatch. What happened?', back: 'The audio contained no recognisable speech (silence or noise). A configuration or auth error would return Canceled.' },
    { front: 'How do you send audio to gpt-audio-mini?', back: 'Chat Completions with modalities=["text","audio"], an input_audio content part (base64 data and format), and optionally an audio voice/format for spoken output.' },
    { front: 'Which model type suits a low-latency, interruptible voice conversation?', back: 'A realtime speech-to-speech model (gpt-realtime) via the Realtime API or Voice Live.' },
    { front: 'Which option gives exact transcripts with timestamps and diarization for compliance?', back: 'Azure Speech speech to text (real-time or batch), not a multimodal chat model.' },
  ],
  quiz: [
    {
      question:
        'A company records customer calls and needs transcripts that show which speaker said each sentence, processed overnight for thousands of files. Which capability fits BEST?',
      options: [
        'Azure Speech batch transcription with speaker diarization',
        'Azure Speech text to speech with SSML',
        'gpt-audio-mini via the chat playground',
        'Azure Language key phrase extraction',
      ],
      correct: [0],
      explanation:
        'Batch transcription handles large asynchronous volumes and diarization labels speakers. TTS generates audio, a chat model is interactive rather than batch and lacks diarization, and key phrases need text first.',
    },
    {
      question:
        'An accessibility team wants read-aloud output where product names are pronounced correctly and there is a pause before each price. Which feature should they use?',
      options: ['Language identification', 'SSML with the text to speech service', 'Speaker diarization', 'Phrase lists'],
      correct: [1],
      explanation:
        'SSML controls pronunciation, pauses and prosody in synthesis. Language identification and diarization are recognition features, and phrase lists improve recognition rather than synthesis.',
    },
    {
      question:
        'Which Python code recognises a single spoken utterance from a WAV file using the Speech SDK?',
      options: [
        'speechsdk.SpeechSynthesizer(speech_config, speechsdk.audio.AudioConfig(filename="q.wav")).speak_text_async("q.wav").get()',
        'speechsdk.SpeechRecognizer(speech_config=cfg, audio_config=speechsdk.audio.AudioConfig(filename="q.wav")).recognize_once_async().get()',
        'speechsdk.SpeechConfig(filename="q.wav").recognize()',
        'speechsdk.audio.AudioOutputConfig(filename="q.wav").recognize_once()',
      ],
      correct: [1],
      explanation:
        'A SpeechRecognizer with an AudioConfig pointing at the file and recognize_once_async is the documented pattern. Synthesizers produce audio, SpeechConfig holds credentials, and AudioOutputConfig is for output.',
    },
    {
      question:
        'A kiosk should let visitors ask a question by voice and hear a spoken answer, handled in a single request to one deployed model. Which model type should you deploy?',
      options: ['An embedding model', 'An audio-capable multimodal model such as gpt-audio-mini', 'An image-generation model', 'A text-only small language model'],
      correct: [1],
      explanation:
        'Audio-capable models accept input_audio and can return spoken output in one call. Embedding and image models do not handle conversation, and a text-only model would need separate STT and TTS steps.',
    },
    {
      question: 'Which TWO are features of Azure Speech speech to text? (Select two)',
      options: ['Speaker diarization', 'Phrase lists to boost domain vocabulary', 'Inpainting', 'Opinion mining'],
      correct: [0, 1],
      explanation:
        'Diarization and phrase lists are STT features. Inpainting belongs to image editing, and opinion mining belongs to Azure Language sentiment analysis.',
    },
    {
      question:
        'Your SpeechRecognizer returns ResultReason.Canceled every time, even with a clear recording. What should you check FIRST?',
      options: [
        'The microphone volume',
        'cancellation_details for an authentication or endpoint error in the SpeechConfig',
        'Whether the file is shorter than 30 seconds',
        'Whether opinion mining is enabled',
      ],
      correct: [1],
      explanation:
        'Canceled signals a service or configuration error, reported in cancellation_details. Silent audio would give NoMatch, duration affects recognize_once but not Canceled, and opinion mining is unrelated.',
    },
  ],
  statements: [
    { text: 'Speaker diarization identifies which speaker said each part of a transcript.', isTrue: true, explanation: 'It separates and labels speakers in recognised audio.' },
    { text: 'SSML is used to improve the accuracy of speech recognition.', isTrue: false, explanation: 'SSML controls speech synthesis output; phrase lists and custom speech improve recognition.' },
    { text: 'In the Speech SDK, recognize_once_async is intended for a single utterance of up to about 30 seconds.', isTrue: true, explanation: 'Use continuous recognition for longer audio.' },
    { text: 'A ResultReason.NoMatch result indicates an invalid subscription key.', isTrue: false, explanation: 'NoMatch means no recognisable speech; an invalid key produces Canceled with an authentication error.' },
    { text: 'gpt-audio-mini can accept audio input and return spoken audio output through the Chat Completions API.', isTrue: true, explanation: 'Set modalities to text and audio and include an input_audio content part.' },
    { text: 'Azure Language is the service to convert spoken audio into text.', isTrue: false, explanation: 'Azure Speech performs speech to text; Azure Language analyses text.' },
    { text: 'A voice agent can be built either with a single realtime speech-to-speech model or with a cascaded STT, text model and TTS pipeline.', isTrue: true, explanation: 'Foundry documents both architectures for voice-based prompt agents.' },
  ],
  resources: [
    { label: 'What is Azure Speech in Foundry Tools?', url: 'https://learn.microsoft.com/en-us/azure/ai-services/speech-service/overview' },
    { label: 'Quickstart: Recognize and convert speech to text', url: 'https://learn.microsoft.com/en-us/azure/ai-services/speech-service/get-started-speech-to-text' },
    { label: 'Quickstart: Convert text to speech', url: 'https://learn.microsoft.com/en-us/azure/ai-services/speech-service/get-started-text-to-speech' },
    { label: 'Quickstart: Azure OpenAI audio generation (gpt-audio)', url: 'https://learn.microsoft.com/en-us/azure/ai-foundry/openai/audio-completions-quickstart' },
  ],
};
