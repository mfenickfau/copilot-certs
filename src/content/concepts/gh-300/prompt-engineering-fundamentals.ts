import type { Concept } from '../../types';

export const promptEngineeringFundamentals: Concept = {
  id: 'prompt-engineering-fundamentals',
  title: 'Prompt Engineering for Copilot: Structure, Principles and Zero-, One- and Few-Shot Prompting',
  summary:
    'How to write prompts that Copilot can act on: the anatomy of a good prompt, the 4 S principles (single, specific, short, surround), GitHub\'s best practices, when to show examples (zero-, one- and few-shot), role prompting, and how to specify the shape of the response you want.',
  certs: ['gh-300', 'gh-700'],
  domains: ['gh-300-4', 'gh-700-2'],
  outcomes: ['gh-300-4-1-1', 'gh-300-4-1-3', 'gh-300-4-1-4', 'gh-300-4-2-1', 'gh-700-2-2-1', 'gh-700-2-2-2', 'gh-700-2-2-3'],
  tags: ['prompt-engineering', 'few-shot', 'zero-shot', 'role-prompting', 'best-practices', 'copilot-chat'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Anatomy of a prompt',
      body: `A **prompt** is the request you make to Copilot: a question, a task description, a comment in code, or a code snippet to complete. Copilot never sees the prompt alone; it combines it with **context** (the current file, open tabs, selected code, chat history, custom instructions, attached files) before sending it to the model. Prompt engineering is the craft of writing the part you control so the combined input leads to correct, project-appropriate code.

A well-structured prompt tends to contain:

1. **Goal**: what you want, stated broadly first ("Write a TypeScript function that validates an email address").
2. **Requirements and constraints**: the specifics, most important first, because models give extra weight to the beginning and end of a prompt ("return a boolean; reject addresses over 254 characters; no external libraries").
3. **Context**: the data it acts on and where it lives ("the input comes from the \`SignupForm\` component in \`#file:SignupForm.tsx\`").
4. **Examples**: sample inputs and outputs when the behaviour is easier to show than describe.
5. **Output shape**: language, format, length, tone ("return only the function with a JSDoc comment", "answer as a table", "keep it under 10 lines").

The GH-700 outcomes phrase this as deciding what information the response must contain (including sentiment or tone, coherence, creativity), what data and input variables it acts on, and what structure the response should have (table, bullet list, JSON, maximum length). All three are decisions you make *before* typing.

State rules directly rather than as meta-instructions: "Return the result as JSON" works better than "Remember to always return JSON".`,
    },
    {
      heading: 'Principles: the 4 S\'s and GitHub\'s best practices',
      body: `Microsoft Learn summarises prompt principles as the **4 S's**:

- **Single**: one well-defined task or question per prompt.
- **Specific**: explicit, detailed instructions rather than vague requests.
- **Short**: concise; detail without padding.
- **Surround**: give Copilot rich context, such as descriptive file names and relevant files open in the editor.

GitHub's documented best practices build on them:

- **Start general, then get specific.** Describe the goal, then list requirements; put the most important first.
- **Give examples** of inputs, outputs and implementations. Unit tests make excellent examples: write tests first, then ask Copilot for the function that satisfies them.
- **Break complex tasks into simpler tasks.** Instead of "generate a word-search puzzle", ask for the grid generator, then the word finder, then the composer.
- **Avoid ambiguity.** "What does this do?" is ambiguous when "this" could be the file, the last answer or a selection; name the function. Describe uncommon libraries or import the one you want.
- **Provide relevant context.** Open relevant files and close irrelevant ones; use \`#file\`, \`@workspace\` and attachments; in the CLI use \`@path\` and \`#issue\`; for the cloud agent, name the repository, branch, acceptance criteria and relevant files.
- **Experiment and iterate.** If the first result is wrong, refine the prompt or delete the suggestion and try again; reference the previous response or roll back turns that no longer help.
- **Keep history relevant.** Start a new conversation for a new task.
- **Review the output** as you would a colleague's code.
- **Follow good coding practices** in your own code: consistent style, descriptive names, comments, modular structure and tests all make Copilot's suggestions better because they become its context.

A useful mental model: Copilot is a very capable colleague who has never seen your project. Everything you would tell that colleague belongs in the prompt or the context.`,
    },
    {
      heading: 'Zero-shot, one-shot, few-shot and role prompting',
      body: `These terms describe how many **examples** you include.

- **Zero-shot**: no examples; rely on the model's training. Ideal for common patterns ("write a function that converts Celsius to Fahrenheit"). Fast, but the model picks its own conventions.
- **One-shot**: a single example that shows your pattern or convention. The model imitates it: provide one existing conversion function and ask for "another like this for Kelvin".
- **Few-shot**: several examples. Best when the behaviour has multiple cases or edge conditions, or when consistency across many implementations matters: show three input/output pairs for a date parser, including the awkward formats, and the generated function handles them. Few-shot prompting sits between zero-shot unpredictability and the cost of fine-tuning a model.

Examples do not have to be prose: open test files, existing implementations in adjacent tabs, and sample data all work as implicit examples because Copilot reads open files.

**Role prompting** asks Copilot to adopt an expert persona, which shifts the defaults it reaches for: "Act as a security expert; write a password validator that follows OWASP guidance" tends to add input sanitisation and standard validation patterns; "Act as a performance optimisation expert" biases towards efficient data structures; "Act as a testing specialist" yields broader edge-case coverage. Combine a role with a single, specific task for best results.

Two more techniques appear in exam material: **chain prompting** (a sequence of dependent prompts, each building on the last: implement, add error handling, add tests, document, optimise) and **iterative refinement** (assert what is wrong and ask for a correction instead of starting over).`,
    },
    {
      heading: 'Prompts across surfaces, and the exam angle',
      body: `The same principles apply everywhere, but the mechanics differ:

- **Inline completions**: the prompt is your code plus comments. A descriptive comment above the cursor, a clear function signature and good names are the prompt. Open related files to "surround" it.
- **Chat**: natural language plus keywords. Slash commands (\`/explain\`, \`/fix\`, \`/tests\`, \`/doc\`) pre-package intent; \`#\` variables and \`@\` participants attach context; prompt files make a good prompt reusable; custom instructions supply standing requirements so your prompts can stay short.
- **Agent mode and the cloud agent**: describe the objective, acceptance criteria, constraints and relevant files, and say how the work should be validated (which tests to run). Attach screenshots or mock-ups when visual context matters. Vague, open-ended tasks are the ones agents get wrong.
- **CLI**: precise prompts, quoted carefully; when scripting, demand a strict output shape ("reply only YES or NO") so you can parse it.

Exam items typically show a weak prompt and ask for the improvement, or describe a goal and ask which technique applies. The patterns: a vague prompt → make it single and specific; inconsistent output across similar functions → one- or few-shot with an existing example; a sprawling request → break it into steps or use plan mode; wrong library or style → state the library, import it, or encode it in custom instructions; unparseable scripted output → specify the format and length; persistently generic answers → add context with \`#file\` or open the relevant files.`,
    },
  ],
  examples: [
    {
      title: 'From vague to specific',
      description:
        'A developer asks "make this better" with a 200-line file open. Copilot rewrites style while missing the actual problem. The improved prompt is single, specific and surrounded: it names the function, states the goal and the constraints, and asks for a defined output.',
      language: 'text',
      code: `Weak:
  make this better

Strong:
  Refactor the parseOrders function in #file:orders.ts to stop re-reading the
  file inside the loop. Keep the public signature unchanged, keep the existing
  error messages, and return only the updated function with a short JSDoc.`,
      takeaway: 'Name the target, the goal, the constraints and the output shape; most "bad" Copilot answers are answers to under-specified prompts.',
    },
    {
      title: 'Few-shot for a parser with awkward cases',
      description:
        'A team needs a function that extracts dates from free text in several formats. A zero-shot prompt produced a regex that only matched one format. Supplying the accepted formats plus example input and output turned the request into a few-shot prompt, and the generated function covered every listed case.',
      language: 'text',
      code: `Write a Go function findDates(s string) []string that returns all dates in s.
Accepted formats: 05/02/24, 05/02/2024, 5/2/24, 5/2/2024, 05-02-24, 05-02-2024, 5-2-24, 5-2-2024

Example:
  findDates("Dentist on 11/14/2023 and book club on 12-1-23")
  returns ["11/14/2023", "12-1-23"]`,
      takeaway: 'When behaviour has several cases, show them: few-shot prompting beats describing edge cases in prose.',
    },
    {
      title: 'One-shot for consistency',
      description:
        'A codebase has a particular style for repository classes: constructor injection, async methods returning Result objects, and a specific logging call. New developers\' Copilot output kept drifting. Opening an existing repository class alongside the new file and prompting "create an OrderRepository following the pattern in #file:CustomerRepository.cs" produced code that matched the convention first time.',
      takeaway: 'One good example in context is the cheapest way to get consistent implementations across a codebase.',
    },
    {
      title: 'The monolithic request (a realistic mistake)',
      description:
        'A developer asks agent mode to "build the whole reporting feature: schema, API, UI, tests and docs" in one prompt. The agent produces a plausible but incoherent result and runs out of context partway through. The fix is to chain the work: plan mode first to produce steps, then one prompt per step (schema, then API with tests, then UI), each referencing the artefacts produced so far. Output quality and credit consumption both improve.',
      takeaway: 'Break complex tasks into simpler tasks; one prompt, one well-defined piece of work.',
    },
    {
      title: 'Specifying response structure for a script',
      description:
        'A CI script asks Copilot CLI whether a project has TypeScript errors and tries to grep the answer, but the response is three paragraphs. Adding "Reply only YES or NO. No other text." to the prompt gives a parseable answer every time.',
      language: 'bash',
      code: `if copilot -p 'Does this project have any TypeScript errors? Reply only YES or NO.' -s \\
  | grep -qi "no"; then
  echo "No type errors found."
fi`,
      takeaway: 'When a machine consumes the output, specify the exact format and length in the prompt.',
    },
  ],
  keyPoints: [
    'A prompt is combined with context (file, open tabs, selection, history, instructions) before reaching the model; you engineer the part you control.',
    'Structure: goal first, then requirements (most important first), then context, examples and the desired output shape (format, length, tone).',
    'The 4 S principles: single task, specific instructions, short wording, surround with context (descriptive names, relevant files open).',
    'GitHub best practices: start general then get specific, give examples, break complex tasks down, avoid ambiguity, provide relevant context, iterate, keep history relevant, review output, follow good coding practices.',
    'Zero-shot uses no examples (common patterns); one-shot gives one example for consistency; few-shot gives several for multi-case behaviour and edge cases.',
    'Role prompting ("act as a security expert") shifts defaults toward domain best practices; chain prompting builds a feature across dependent steps.',
    'State rules directly ("Return JSON") rather than as meta-instructions; specify exact output format when scripts will parse the answer.',
    'Unit tests, open files and sample data act as implicit examples because Copilot reads your open context.',
  ],
  flashcards: [
    { front: 'What are the 4 S principles of prompt engineering?', back: 'Single (one task), Specific (explicit detail), Short (concise), Surround (rich context such as descriptive file names and open related files).' },
    { front: 'What is zero-shot prompting?', back: 'Asking for a result without providing any examples, relying on the model\'s training; good for common patterns.' },
    { front: 'When is few-shot prompting most useful?', back: 'When behaviour has several cases or edge conditions, or when you need consistent output across many implementations.' },
    { front: 'What is one-shot prompting?', back: 'Providing a single example so the model follows your specific pattern or convention.' },
    { front: 'Where should the most important requirement go in a prompt, and why?', back: 'At the beginning (or end): models give extra weight to the start and end of a prompt.' },
    { front: 'Why should you break a complex task into smaller prompts?', back: 'Each small, well-defined task gets a more accurate answer, stays within context limits and is easier to verify.' },
    { front: 'What is role prompting?', back: 'Instructing Copilot to act as a specific expert (security, performance, testing) so its output reflects that domain\'s best practices.' },
    { front: 'How can unit tests serve prompt engineering?', back: 'They act as examples: write tests first, then ask Copilot to implement the function the tests describe.' },
    { front: 'How should you phrase an output requirement such as JSON?', back: 'Directly: "Return the result as JSON", not as a meta-instruction like "Remember to always return JSON".' },
    { front: 'What does "avoid ambiguity" mean in practice?', back: 'Name the function or file instead of saying "this", describe uncommon libraries, and import or name the library you want used.' },
    { front: 'What is chain prompting?', back: 'A sequence of dependent prompts where each builds on the previous result, such as implement, add error handling, add tests, document.' },
  ],
  quiz: [
    {
      question:
        'A developer asks Copilot Chat "What does this do?" while several files are open and gets an explanation of the wrong code. Which prompt engineering principle was violated?',
      options: ['Give examples', 'Avoid ambiguity', 'Use role prompting', 'Keep history relevant'],
      correct: [1],
      explanation:
        '"This" could mean the file, a selection or the last response. Naming the function or using #selection removes the ambiguity. Examples, roles and history are not the issue.',
    },
    {
      question:
        'A team needs a function that normalises phone numbers written in eight different formats. A zero-shot prompt handles only two. What is the MOST effective next step?',
      options: [
        'Ask the same prompt again with a different model',
        'Provide the accepted formats plus several example inputs and expected outputs (few-shot prompting)',
        'Enable the public-code filter',
        'Switch from Chat to inline completions',
      ],
      correct: [1],
      explanation:
        'Multi-case behaviour calls for few-shot examples. Repeating the prompt or changing surfaces does not add information, and the public-code filter is unrelated.',
    },
    {
      question: 'Which TWO practices are recommended by GitHub for prompting Copilot? (Select two)',
      options: [
        'Start with a general description of the goal, then list specific requirements with the most important first',
        'Put all unrelated requests into a single long prompt to save requests',
        'Break complex tasks into smaller, simpler tasks',
        'Avoid opening related files so Copilot focuses only on your prompt text',
      ],
      correct: [0, 2],
      explanation:
        'General-then-specific and decomposition are documented best practices. Bundling unrelated work violates "single", and closing related files removes useful context ("surround").',
    },
    {
      question:
        'A developer wants Copilot to generate a payment-validation function that follows OWASP guidance and includes input sanitisation without listing every rule. Which technique is MOST appropriate?',
      options: ['Zero-shot prompting with no further detail', 'Role prompting: "Act as a cybersecurity expert..."', 'Deleting the chat history', 'Using /doc on the function'],
      correct: [1],
      explanation:
        'Role prompting steers the model toward domain best practices. Zero-shot without detail gives generic code, clearing history removes context, and /doc writes documentation.',
    },
    {
      question:
        'A build script calls Copilot CLI to ask a yes/no question and parses the answer, but responses vary in wording. What change to the prompt fixes this?',
      options: [
        'Add more examples of TypeScript errors',
        'Specify the exact response format and length, for example "Reply only YES or NO. No other text."',
        'Use the --allow-all-tools flag',
        'Ask the question in a longer conversation to build context',
      ],
      correct: [1],
      explanation:
        'Specifying structure and length is the documented way to get parseable output. Examples, tool permissions and longer conversations do not constrain format.',
    },
    {
      question:
        'A developer\'s inline suggestions keep using a different HTTP client library than the project standard. Which action BEST aligns the suggestions?',
      options: [
        'Import the preferred library at the top of the file or state it in the prompt, and add it to the repository custom instructions',
        'Disable inline suggestions and use only Chat',
        'Enable next edit suggestions',
        'Ask for suggestions in a different natural language',
      ],
      correct: [0],
      explanation:
        'Naming or importing the library and encoding the standard in instructions supplies the missing context. Switching surfaces or features does not tell Copilot which library you use.',
    },
  ],
  statements: [
    { text: 'Copilot gives extra weight to instructions at the beginning and end of a prompt.', isTrue: true, explanation: 'GitHub recommends putting the most important requirements first for this reason.' },
    { text: 'Few-shot prompting requires fine-tuning the model with your examples.', isTrue: false, explanation: 'Few-shot provides examples inside the prompt; no training or fine-tuning occurs.' },
    { text: 'Meta-instructions such as "Remember to always return JSON" are preferred over direct rules.', isTrue: false, explanation: 'GitHub recommends stating rules directly: "Return the result as JSON".' },
    { text: 'Open files in the editor act as context for inline suggestions.', isTrue: true, explanation: 'Copilot uses adjacent open tabs, so opening relevant files and closing irrelevant ones improves suggestions.' },
    { text: 'The 4 S principle "Surround" refers to wrapping prompts in quotation marks.', isTrue: false, explanation: 'Surround means providing rich context: descriptive file names and related files open in the editor.' },
    { text: 'Writing unit tests before asking Copilot for an implementation is a recommended way to provide examples.', isTrue: true, explanation: 'GitHub documents tests as examples: ask Copilot for the function described by the tests.' },
    { text: 'If Copilot\'s first answer is wrong you should always start a new conversation rather than refine the prompt.', isTrue: false, explanation: 'Iterating on the prompt or referencing the previous response is recommended; start fresh when the history is no longer relevant.' },
  ],
  resources: [
    { label: 'Prompt engineering for GitHub Copilot', url: 'https://docs.github.com/en/copilot/concepts/prompting-and-context/prompt-engineering' },
    { label: 'Prompt engineering foundations and best practices (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/training/modules/introduction-prompt-engineering-with-github-copilot/2-prompt-engineering-foundations-best-practices' },
    { label: 'Best practices for using GitHub Copilot', url: 'https://docs.github.com/en/copilot/get-started/best-practices' },
  ],
};
