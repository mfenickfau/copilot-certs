import type { Concept } from '../../types';

export const testingAndSecurityWithCopilot: Concept = {
  id: 'testing-and-security-with-copilot',
  title: 'Testing and Security with Copilot: Unit and Integration Tests, Edge Cases, Assertions and Hardening',
  summary:
    'How to get Copilot to generate useful unit and integration tests, surface edge cases and write meaningful assertions, use mocks for external dependencies, and ask for security improvements and performance optimisations, while keeping the human responsible for what the tests actually prove.',
  certs: ['gh-300'],
  domains: ['gh-300-5'],
  outcomes: ['gh-300-5-2-1', 'gh-300-5-2-2', 'gh-300-5-2-3'],
  tags: ['testing', 'unit-tests', 'integration-tests', 'mocks', 'edge-cases', 'assertions', 'security', 'performance'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Generating unit tests that mean something',
      body: `Copilot generates tests quickly, but the exam is interested in *how you prompt* so the tests are worth running. GitHub's documented example asks for a "comprehensive suite of unit tests for the BankAccount class that covers a wide range of scenarios, including edge cases, exception handling, and data validation". That prompt works because it sets:

- **Scope**: a comprehensive suite, not "a test".
- **Scenarios**: edge cases (boundaries such as zero, negative amounts, overdrawing), exception handling (the errors that should be raised and when), and data validation (invalid inputs rejected).
- **Target**: a named class or function.

Three ways to trigger generation:
1. **\`/tests\`** in Chat with the file open or code selected: fast, framework-aware, but it "may not cover all scenarios", so review and extend.
2. **A detailed Chat prompt** like the one above, optionally with a role ("act as a testing specialist") and the framework named.
3. **Inline completions** inside a test file: type \`def test_withdraw_more_than_balance_raises\` and let Copilot fill the body; test-driven development works well because the test name is a precise prompt.

Context matters more than the prompt: **open an existing test file in an adjacent tab** so Copilot sees your framework (pytest versus unittest, Vitest versus Jest), fixtures and naming style. If Copilot keeps producing invalid tests, provide example inputs and outputs for the function under test.

After generation, ask Copilot how to run the tests (\`python -m unittest test_bank_account.py\`), run them, and read the failures: a failing generated test may reveal a real bug or a wrong assumption in the test. You decide which.`,
    },
    {
      heading: 'Integration tests, mocks and edge cases',
      body: `**Integration tests** check that components work together. Copilot handles them best when you **break the request down**: "Write integration tests for the \`deposit\` method of \`BankAccount\`. Use mocks to simulate the \`NotificationSystem\` and verify it is called correctly after a deposit." That prompt specifies the test type, the interaction under test, the mocking strategy and what to verify, so Copilot produces a focused test with \`Mock()\` and \`assert_called_once_with(...)\` rather than a sprawling suite that needs real services.

Iterate to fill gaps: "Add a test case for invalid deposit amounts to verify the exception is raised and the notification service is **not** called." Then ask Copilot to audit coverage: "What additional tests should be included to ensure full coverage of the interaction between \`BankAccount\` and \`NotificationSystem\`?" It will typically point out the untested path (withdrawals, zero amounts, negative initial balance).

**Identifying edge cases.** Copilot is good at enumerating boundaries if asked explicitly: "List the edge cases for a function that parses ISO-8601 dates and write one test per case." Typical categories to prompt for: empty and null inputs, boundaries (0, -1, max), type and format violations, concurrency and ordering, time zones and leap days, large inputs, and failure of dependencies (timeouts, exceptions from mocks).

**Writing assertions.** Weak generated tests assert that "no exception was raised" or compare a value to itself. Ask for assertions that pin down behaviour: exact return values, state after the call (\`get_balance() == 150\`), exceptions of a specific type with a specific message, and interaction assertions on mocks (\`assert_not_called()\`). If an assertion seems to merely restate the implementation, it is probably testing the wrong thing; a test should fail if the behaviour changes, not if the code is reformatted.

Other test types Copilot helps with: end-to-end tests (for example with Playwright, where the Playwright MCP server lets agents drive a browser), mock objects for external APIs, parameterised tests from a table of cases, and fixing failing tests with \`/fixTestFailure\`.`,
    },
    {
      heading: 'Security improvements',
      body: `Copilot both *introduces* and *finds* security issues, so use it deliberately on the finding side.

- **Ask for a security review of a function or file**: "Review \`login.ts\` for OWASP Top 10 issues and explain each finding with a fix." Role prompting ("act as an application security engineer") sharpens the output.
- **Use the built-in agents**: Copilot CLI's \`/security-review\` runs a focused review of local changes and returns prioritised findings with remediation; \`/review\` runs the code-review agent.
- **Copilot code review on pull requests** flags vulnerabilities with severity labels and one-click suggested fixes, and the **cloud agent** validates its own output with CodeQL, secret scanning and dependency checks against the Advisory Database before opening a pull request.
- **Fix alerts**: Copilot Autofix for code scanning and the ability to assign code scanning alerts to the cloud agent turn findings into pull requests.
- **Harden specific concerns**: parameterised queries instead of string-built SQL, input validation and output encoding, safe deserialisation, secure defaults for cookies and headers, secrets moved to environment variables or a vault, dependency upgrades for known CVEs.

The responsible-use caveat applies twice over: Copilot's suggestions can themselves be insecure (the outbound vulnerability filter catches common patterns, not everything), and a clean Copilot review is not a penetration test. Keep CodeQL, secret scanning and dependency review enabled, and treat Copilot as an additional reviewer.`,
    },
    {
      heading: 'Performance optimisation and the exam angle',
      body: `For performance, Copilot can **analyse** ("explain the time complexity of this function and the hot spots"), **propose** ("optimise for large inputs; prefer O(n log n); avoid repeated allocations"), and **implement** the change, with \`/optimize\` in Visual Studio and role prompts elsewhere. The discipline is the same as for refactoring: establish a benchmark or test first, change one thing, measure again. Copilot's claim that something is faster is a hypothesis.

How the exam tests this group:

- A prompt that yields only one trivial test → the fix is to specify scope, scenarios (edge cases, exceptions, validation) and the framework, or to open an existing test file for context.
- Tests that need a real external service → ask for mocks and interaction assertions.
- "Which prompt produces the most useful integration test?" → the one that names the method, the collaborator to mock and the behaviour to verify.
- A suspicious assertion that cannot fail → recognise it as a weak test and ask for behavioural assertions.
- A SQL-injection or hard-coded secret in generated code → both a Copilot limitation and something Copilot can find if asked, with code review and CodeQL as backstops.
- "The generated optimisation made the code faster" → only if measured; otherwise verify.

Distractors tend to be features from the wrong lane: enabling content exclusions or the public-code filter does not improve tests; a bigger model does not replace a better prompt; and disabling Copilot is never the answer to a weak test.`,
    },
  ],
  examples: [
    {
      title: 'A prompt that produces a real suite',
      description:
        'Following GitHub\'s tutorial, a developer asks for a comprehensive unit-test suite for a BankAccount class with an existing pytest file open in another tab. Copilot returns tests for the initial balance, valid deposit and withdrawal, negative amounts raising ValueError, overdrawing, and a negative initial balance. The developer runs them, sees them pass, then adds a test for depositing exactly zero that Copilot missed.',
      language: 'python',
      code: `# Prompt: Develop a comprehensive suite of unit tests for the BankAccount class in
# Python. Cover edge cases, exception handling and data validation. Use pytest.

import pytest
from bank_account import BankAccount

def test_withdraw_more_than_balance_raises():
    account = BankAccount(100)
    with pytest.raises(ValueError, match="Cannot withdraw more"):
        account.withdraw(200)

def test_deposit_zero_raises():          # added by the developer after review
    with pytest.raises(ValueError):
        BankAccount().deposit(0)`,
      takeaway: 'Scope, scenarios and framework context produce a strong first draft; the human still reviews coverage and adds what is missing.',
    },
    {
      title: 'Integration test with a mock and interaction assertions',
      description:
        'The team extends BankAccount to call a NotificationSystem. A focused prompt asks for integration tests of deposit that mock the notifier and verify the call. Copilot produces a test using unittest.mock, and a follow-up prompt adds the negative case where no notification must be sent.',
      language: 'python',
      code: `from unittest.mock import Mock

def test_deposit_notifies():
    notifier = Mock()
    account = BankAccount(initial_balance=100, notification_system=notifier)
    account.deposit(50)
    assert account.get_balance() == 150
    notifier.notify.assert_called_once_with("Deposited 50, new balance: 150")

def test_invalid_deposit_does_not_notify():
    notifier = Mock()
    account = BankAccount(initial_balance=100, notification_system=notifier)
    with pytest.raises(ValueError):
        account.deposit(-50)
    notifier.notify.assert_not_called()`,
      takeaway: 'Name the method, the collaborator to mock and the behaviour to verify; use interaction assertions for both the positive and the negative path.',
    },
    {
      title: 'The test that could not fail (a realistic mistake)',
      description:
        'A generated test for a currency formatter asserted `assert format_price(price) == format_price(price)` and another merely checked that no exception was raised. Both passed while the formatter dropped the currency symbol in production. The developer reprompted: "Write assertions that pin the exact output for 0, 1234.5 and -10 in GBP and EUR, and a test that a non-numeric input raises TypeError." The new tests failed immediately and exposed the bug.',
      takeaway: 'Read generated assertions; a test that restates the implementation or asserts nothing specific gives false confidence.',
    },
    {
      title: 'Hardening a query with Copilot\'s help',
      description:
        'A security review prompt on a data access module returns a High finding: a SQL statement built by string concatenation from a request parameter. Copilot proposes a parameterised query, explains why, and suggests adding an input length check. The developer applies the fix, asks Copilot for a test that passes a classic injection payload and asserts it is treated as data, and Copilot code review on the pull request confirms no further findings while CodeQL remains the backstop.',
      language: 'typescript',
      code: `// Flagged:
const rows = await db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);

// Fixed:
const rows = await db.query('SELECT * FROM users WHERE email = $1', [email]);`,
      takeaway: 'Ask Copilot to find and fix vulnerabilities, then prove the fix with a test and keep scanning tools on.',
    },
  ],
  keyPoints: [
    'Prompt for tests with scope (comprehensive suite), scenarios (edge cases, exception handling, data validation), the target and the framework; /tests is quick but may miss cases.',
    'Open an existing test file in an adjacent tab so Copilot matches your framework, fixtures and naming; provide example inputs and outputs if tests come out invalid.',
    'For integration tests, break the request down: name the method, the collaborator to mock and the behaviour to verify; iterate to add negative cases and ask Copilot what tests are missing.',
    'Ask explicitly for edge cases (empty, null, boundaries, format violations, dependency failures) and for assertions that pin exact values, state, exception types and mock interactions.',
    'A test that cannot fail or restates the implementation is a weak test; reprompt for behavioural assertions.',
    'Security: ask for OWASP-style reviews, use /security-review and Copilot code review, let the cloud agent validate with CodeQL and secret scanning, and keep scanning tools as backstops because generated code can be insecure.',
    'Performance: ask for complexity analysis and targeted optimisations (/optimize in Visual Studio), but measure before and after; Copilot\'s speed claims are hypotheses.',
    'Fix failing tests with /fixTestFailure; drive browsers for end-to-end tests with the Playwright MCP server.',
  ],
  flashcards: [
    { front: 'Which slash command generates unit tests for the selected code?', back: '/tests' },
    { front: 'What three scenario types does GitHub\'s recommended test prompt ask for?', back: 'Edge cases, exception handling and data validation.' },
    { front: 'How can you make Copilot use your project\'s test framework and style?', back: 'Open an existing test file in an adjacent tab so it is in context, or state the framework in the prompt or custom instructions.' },
    { front: 'What should an integration-test prompt specify?', back: 'The method under test, the external collaborator to mock, and the interaction or outcome to verify.' },
    { front: 'Which mock assertions verify that a dependency was or was not called?', back: 'assert_called_once_with(...) for the positive path and assert_not_called() for the negative path (Python unittest.mock).' },
    { front: 'How do you get Copilot to find gaps in test coverage?', back: 'Ask directly: "What additional tests should be included to ensure full coverage of X?"' },
    { front: 'Which CLI slash command runs a focused security review of local changes?', back: '/security-review' },
    { front: 'Which slash command helps find and fix a failing test in VS Code?', back: '/fixTestFailure' },
    { front: 'What is a sign of a weak generated assertion?', back: 'It compares a value to itself, only checks that no exception was raised, or restates the implementation so it can never fail.' },
    { front: 'What security validation does the cloud agent run on its own code before opening a pull request?', back: 'CodeQL analysis, secret scanning, and dependency checks against the GitHub Advisory Database.' },
    { front: 'What must accompany a Copilot performance optimisation?', back: 'A benchmark or test before and after; the claimed improvement must be measured.' },
  ],
  quiz: [
    {
      question:
        'A developer uses /tests on a Python class and gets two trivial tests. Which change to the approach is MOST likely to produce a comprehensive suite?',
      options: [
        'Switch the public-code filter to Allow',
        'Write a detailed prompt asking for a comprehensive suite covering edge cases, exception handling and data validation, with an existing test file open for framework context',
        'Enable next edit suggestions',
        'Ask the cloud agent to delete the class and start over',
      ],
      correct: [1],
      explanation:
        'Scope, scenarios and context are what drive test quality. The public-code filter and next edit suggestions are unrelated, and rewriting the class does not create tests.',
    },
    {
      question:
        'You need tests that verify BankAccount.deposit notifies an external NotificationSystem without calling the real service. Which prompt is MOST effective?',
      options: [
        '"Write tests for BankAccount"',
        '"Write integration tests for the deposit method of BankAccount. Use mocks to simulate the NotificationSystem and verify it is called correctly after a deposit."',
        '"Make the tests pass"',
        '"Explain the NotificationSystem"',
      ],
      correct: [1],
      explanation:
        'The second prompt names the method, the collaborator to mock and the behaviour to verify, matching GitHub\'s documented approach. The others are vague or do not request tests.',
    },
    {
      question:
      'Which TWO assertions indicate a meaningful test rather than a weak one? (Select two)',
      options: [
        'assert account.get_balance() == 150 after depositing 50 into an account of 100',
        'assert format_price(x) == format_price(x)',
        'notifier.notify.assert_not_called() after an invalid deposit raises ValueError',
        'A test body containing only a call to the function with no assertion',
      ],
      correct: [0, 2],
      explanation:
        'Pinning resulting state and asserting on mock interactions both fail when behaviour changes. Comparing a value to itself and asserting nothing are tests that cannot fail.',
    },
    {
      question:
        'A developer wants Copilot to identify edge cases for a function that parses user-supplied dates before writing tests. Which prompt pattern works BEST?',
      options: [
        '"Is this function good?"',
        '"List the edge cases for parseDate (empty input, invalid formats, leap days, time zones, boundaries) and write one test per case using Vitest"',
        '"Optimise parseDate"',
        '"/doc parseDate"',
      ],
      correct: [1],
      explanation:
        'Explicitly asking for enumerated edge cases with the framework named produces targeted tests. The other prompts ask for opinion, performance or documentation.',
    },
    {
      question:
        'Copilot code review flags a SQL statement built from a request parameter as High severity. What is the MOST appropriate response?',
      options: [
        'Dismiss the comment because Copilot reviews are advisory',
        'Apply a parameterised query, add a test with an injection payload, and keep CodeQL and secret scanning enabled as backstops',
        'Disable Copilot code review for the repository',
        'Move the query to a different file so the review does not see it',
      ],
      correct: [1],
      explanation:
        'Fix, prove with a test and keep automated scanning on is the responsible pattern. Dismissing, disabling or hiding the code leaves the vulnerability in place.',
    },
    {
      question:
        'After Copilot rewrites a sorting routine "for performance", what should the developer do before merging?',
      options: [
        'Trust the explanation; Copilot checks complexity automatically',
        'Run the existing tests and a benchmark comparing the old and new implementations on realistic data',
        'Request a Max-effort code review instead of running anything',
        'Switch to a premium model and regenerate',
      ],
      correct: [1],
      explanation:
        'Performance claims must be measured and behaviour preserved. Copilot does not benchmark, and a review or regeneration does not substitute for evidence.',
    },
  ],
  statements: [
    { text: 'The /tests slash command guarantees complete coverage of all scenarios.', isTrue: false, explanation: 'GitHub notes generated tests may not cover all scenarios; review and add missing cases.' },
    { text: 'Opening an existing test file in an adjacent tab helps Copilot match your test framework.', isTrue: true, explanation: 'Copilot uses open files as context, so it sees the framework and style you use.' },
    { text: 'Integration tests generated by Copilot must always call the real external services.', isTrue: false, explanation: 'GitHub\'s tutorial uses mocks to simulate external systems and verify interactions.' },
    { text: 'Asking Copilot "what additional tests should be included" can reveal untested paths.', isTrue: true, explanation: 'This is the documented way to prompt Copilot to evaluate coverage gaps.' },
    { text: 'A passing Copilot security review means no further security scanning is needed.', isTrue: false, explanation: 'Copilot can miss issues; keep CodeQL, secret scanning and dependency review enabled.' },
    { text: 'The Copilot cloud agent runs CodeQL and secret scanning on its own changes by default.', isTrue: true, explanation: 'This validation does not require an Advanced Security licence and can be disabled per repository.' },
    { text: 'Copilot measures the runtime of optimised code before suggesting it.', isTrue: false, explanation: 'Copilot proposes changes; you must benchmark to confirm improvements.' },
  ],
  resources: [
    { label: 'Writing tests with GitHub Copilot', url: 'https://docs.github.com/en/copilot/tutorials/write-tests' },
    { label: 'Generate unit tests (Copilot cookbook)', url: 'https://docs.github.com/en/copilot/tutorials/copilot-cookbook/testing-code/generate-unit-tests' },
    { label: 'Find vulnerabilities (Copilot cookbook)', url: 'https://docs.github.com/en/copilot/tutorials/copilot-cookbook/analyze-security/find-vulnerabilities' },
    { label: 'Refactor for optimization (Copilot cookbook)', url: 'https://docs.github.com/en/copilot/tutorials/copilot-cookbook/refactor-code/refactor-for-optimization' },
  ],
};
