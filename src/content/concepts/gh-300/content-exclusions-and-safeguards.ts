import type { Concept } from '../../types';

export const contentExclusionsAndSafeguards: Concept = {
  id: 'content-exclusions-and-safeguards',
  title: 'Privacy Controls: Content Exclusions, Public-Code Filtering, Output Ownership and Troubleshooting',
  summary:
    'How to keep sensitive files out of Copilot with content exclusions at repository, organisation and enterprise level (and what they cannot guarantee), how the suggestions-matching-public-code filter works, who owns generated output and what GitHub does and does not promise, and how to diagnose missing suggestions and exclusions that are not applying.',
  certs: ['gh-300'],
  domains: ['gh-300-6', 'gh-300-2'],
  outcomes: ['gh-300-6-1-1', 'gh-300-6-1-2', 'gh-300-6-2-1', 'gh-300-6-2-2', 'gh-300-2-1-3'],
  tags: ['content-exclusion', 'privacy', 'public-code-filter', 'code-referencing', 'ownership', 'troubleshooting', 'yaml'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Content exclusion: what it does and who sets it',
      body: `**Content exclusion** makes Copilot ignore specified files. For an excluded file:
- inline suggestions are not available in it;
- its content does not inform suggestions in other files;
- its content does not inform Chat or agent responses;
- it is not reviewed by Copilot code review.

It is a **Copilot Business and Enterprise** feature, configured on GitHub.com, never from the IDE:

| Level | Who | Where | Scope |
|---|---|---|---|
| **Repository** | Repository administrators (Maintain role can view only) | Repository *Settings > Copilot > Content exclusion* | Anyone in the enterprise working in that repository |
| **Organisation** | Organisation owners | Organisation *Settings > Copilot > Content exclusion* | Users assigned a seat **by that organisation**; can target any repository or non-Git paths |
| **Enterprise** | Enterprise owners | Enterprise *AI controls > Copilot > Content exclusion* | All Copilot users in the enterprise |

Inherited rules appear as read-only grey boxes at lower levels. Changes propagate to IDEs within about **30 minutes**; to apply sooner, reload the window (VS Code *Developer: Reload Window*) or restart JetBrains and Visual Studio. Vim/Neovim fetch exclusions each time a file opens. Changes are recorded in the audit log as \`copilot.content_exclusion_changed\`, and the settings page shows who last changed the rules. Organisation and enterprise owners can also manage exclusions through the REST API.

Supported clients: inline suggestions and chat/agent support in VS Code, Visual Studio, JetBrains, Xcode and Eclipse; completions only in Vim/Neovim and Azure Data Studio; and respected by Copilot CLI, the Copilot app, Copilot in the cloud and code review.`,
    },
    {
      heading: 'Writing exclusion rules',
      body: `Rules use **fnmatch** glob patterns, case-insensitive, one per line. A leading \`/\` anchors to the repository root; a bare name matches anywhere.

**Repository settings** list paths only:

\`\`\`yaml
# Paths to exclude in this repository
- "/src/some-dir/kernel.rs"   # one file
- "secrets.json"              # any file with this name, anywhere
- "secret*"                   # names starting with secret
- "*.cfg"                     # by extension
- "/scripts/**"               # everything under /scripts
\`\`\`

**Organisation and enterprise settings** are keyed by repository reference, with \`"*"\` meaning "any file system root, Git or not":

\`\`\`yaml
# Exclude .env files everywhere, including outside Git
"*":
  - "**/.env"

# A repository in this organisation
octo-repo:
  - "/src/some-dir/kernel.rs"

# A repository on GitHub, by URL
https://github.com/primer/react.git:
  - "secrets.json"
  - "/src/**/temp.rb"

# The copilot repository in any GitHub organisation
git@github.com:*/copilot:
  - "/__tests__/**"
  - "/scripts/*"

# A repository on another host
git@gitlab.com:gitlab-org/gitlab-runner.git:
  - "{server,session}*"
  - "*.m[dk]"
  - "**/security/**"
\`\`\`

Repository references accept \`https://\`, \`git://\`, \`ssh://\` and SCP-style \`user@host:path\` forms and match however the repository was cloned; the \`user@\` and \`:port\` parts are ignored. Azure DevOps old and new host names both match.

Test a change by editing an excluded file (no suggestion should appear), then an unexcluded file (suggestions should appear), and by attaching an excluded file to Chat with "explain this file": the file will not appear in the response's references.`,
    },
    {
      heading: 'Limitations, ownership and the public-code filter',
      body: `**What content exclusion is not.** GitHub is explicit: it is a guardrail for GitHub-controlled tools, **not a file-system security boundary**. Known gaps:
- Third-party MCP servers or clients are not guaranteed to respect it.
- The IDE may indirectly leak **semantic information** from excluded files (type information, hover definitions, build configuration).
- Agents in the IDE, CLI and Copilot app are blocked from reading excluded paths through Copilot tools and have identifiable file paths in commands checked, but **indirect access** (a script that cats a file) may not be detected.
- **Symlinks** and repositories on **remote file systems** are not covered.
Treat it as privacy hygiene that complements, not replaces, operating-system permissions and secret management.

**Ownership and limitations of outputs.** GitHub does not claim ownership of the code Copilot generates for you; you are responsible for it as you would be for any code you write, including testing, security review and licence compliance. GitHub's terms address intellectual-property concerns for Business and Enterprise customers who keep the public-code filter enabled (often summarised as IP indemnification), but the exam-safe statements are: output is non-deterministic, may be incorrect or insecure, may occasionally match public code, and the human who accepts it owns the consequences.

**Suggestions matching public code.** The duplicate detection filter compares a suggestion plus about 150 characters of surrounding code with the public-code index of GitHub (private repositories and code hosted elsewhere are not indexed). Two settings:
- **Block**: matching or near-matching suggestions are not shown.
- **Allow**: they are shown, and **code references** record the matching file URLs and detected licences (or NOASSERTION/unknown). In VS Code open *Output > GitHub Copilot Log (Code References)*; JetBrains writes "[Public Code References]" entries to \`idea.log\`; chat answers show a reference beneath the output; agent session logs link to matches.

Individuals set it in their personal Copilot settings; for Business and Enterprise seats it is a policy that **cannot be overridden** personally. Some products support only annotate (Allow) mode, and the exam notes that an organisation must configure this policy before it can assign seats via the API.`,
    },
    {
      heading: 'Troubleshooting suggestions and exclusions',
      body: `Symptom-to-cause pairs the exam expects you to know:

- **No suggestions in one file; icon has a diagonal line** → content exclusion applies. Hover the icon to see which setting; ask the repository or organisation admin if it is wrong.
- **Exclusion added but still seeing suggestions** → propagation takes up to 30 minutes; reload the window or restart the IDE. Check the rule's level: an organisation rule only covers users seated *by that organisation*; a repository rule covers everyone in that repository. Check pattern anchoring (\`/scripts/*\` versus \`/scripts/**\`) and that the file is not reached through a symlink or remote file system.
- **Excluded file still influences Chat** → the IDE may be feeding semantic information indirectly, or a third-party MCP server supplied it. Reduce indirect sources and verify with the References list.
- **Few or no suggestions anywhere, especially for common algorithms** → the public-code filter is set to Block and the suggestion matched public code; this is working as intended. Switch to Allow (if policy permits) if you prefer references to suppression.
- **Code references not appearing** → references only exist in Allow mode or in products without Block support; in Block mode nothing is logged because nothing is shown.
- **Suggestions missing everywhere** → signed out, disabled globally or per language, outdated extension, policy disabled, rate limit, or a GitHub incident; check the status icon, sign in, update, and read the Copilot status page.
- **Non-sensical or off-topic output** → a model artefact; stop any running agent, discard unexpected changes, resubmit or change model, and report if it repeats.
- **Need evidence** → VS Code *Output > GitHub Copilot*, *Developer: Set Log Level > Trace*, *Developer: Chat Diagnostics*; JetBrains \`idea.log\` with \`#com.github.copilot:trace\`; Visual Studio *Output > GitHub Copilot*.

Underlying rule: distinguish "working as designed" (exclusions, Block filter, policies) from faults (auth, version, network) before escalating.`,
    },
  ],
  examples: [
    {
      title: 'Excluding secrets across an organisation',
      description:
        'A security team wants every `.env` file and anything under `config/secrets/` kept away from Copilot for all developers seated by the organisation, plus a specific vendored crypto file in one repository. They add organisation-level rules and confirm them in a repository where the inherited rule appears as a read-only box.',
      language: 'yaml',
      code: `"*":
  - "**/.env"
  - "**/config/secrets/**"
https://github.com/contoso/payments.git:
  - "/vendor/crypto/legacy_cipher.c"`,
      takeaway: 'Organisation rules use repository references (or "*" for any root) with fnmatch paths; they apply to users the organisation seats and show as inherited in repositories.',
    },
    {
      title: 'Block versus Allow in practice',
      description:
        'Two developers type the same `function fizzBuzz()` stub. One, on a Business seat with the policy set to Block, receives nothing because the canonical implementation matches public code. The other, on a personal plan set to Allow, receives the implementation and finds an entry in the VS Code "GitHub Copilot Log (Code References)" channel listing two repositories and their licences.',
      language: 'text',
      code: `2025-03-27 12:17:54 [info] file:///Users/dev/fizzbuzz.js Similar code at [Ln 2, Col 8] ...
2025-03-27 12:17:54 [info] License: unknown, URL: https://github.com/octo-org/octo-repo/blob/.../fizzBuzz.js
2025-03-27 12:17:54 [info] License: MIT, URL: https://github.com/octo-org/monalisa/blob/.../fizz-buzz.js`,
      takeaway: 'Block suppresses matching suggestions; Allow shows them with references so you can decide whether to use, attribute or remove the code.',
    },
    {
      title: 'The exclusion that "did not work" (a realistic mistake)',
      description:
        'An organisation owner adds `/scripts/*` to exclude deployment scripts, tests immediately in VS Code, and still sees suggestions in `scripts/deploy/prod.sh`. Two problems: the IDE had not reloaded the policy (up to 30 minutes, or reload the window), and `/scripts/*` matches only files directly in the folder, not the `deploy` subfolder. Changing the rule to `/scripts/**` and reloading fixes it. A third developer still sees suggestions because her seat comes from a different organisation in the enterprise; an enterprise-level rule would cover her.',
      takeaway: 'Check propagation, pattern depth and which organisation seats the user before concluding exclusions are broken.',
    },
    {
      title: 'Expecting a security boundary',
      description:
        'A team excludes `infra/terraform.tfstate` and assumes the state file can never reach the model. In an agent-mode session the agent runs a script that prints the file to the terminal, and the output enters the context. Content exclusion blocked Copilot\'s direct file tools and would have caught the path in a plain `cat` command, but it does not detect every indirect read. The real fix is to keep state files out of the repository and protect them with access controls and secret management.',
      takeaway: 'Content exclusion is a guardrail, not a file-system security boundary; combine it with OS permissions and secret management.',
    },
  ],
  keyPoints: [
    'Content exclusion (Business and Enterprise) stops Copilot using specified files for suggestions, chat, agents and code review; it is configured on GitHub.com at repository, organisation or enterprise level, never in the IDE.',
    'Repository admins exclude paths in their repositories (affects everyone there); organisation owners exclude for users they seat, across repositories and non-Git paths; enterprise owners cover everyone.',
    'Rules are fnmatch globs, case-insensitive; repository settings list paths, organisation settings key them by repository reference or "*"; /dir/* is one level, /dir/** is recursive.',
    'Changes take up to 30 minutes to reach loaded IDEs (reload or restart to force); they are logged as copilot.content_exclusion_changed.',
    'Limitations: not a security boundary; not guaranteed for third-party MCP servers or clients; semantic information may leak via the IDE; indirect file access by agents may not be detected; symlinks and remote file systems are not covered.',
    'You own and are responsible for generated output; it is non-deterministic and may be wrong, insecure or match public code.',
    'Suggestions matching public code: Block suppresses matches (about 150 characters of context against the public-code index); Allow shows them with code references and licences; organisation policy overrides personal settings.',
    'Troubleshoot by distinguishing working-as-designed (slashed icon, Block filter, policies) from faults (sign-in, extension version, network, rate limits) and gather logs or diagnostics.',
  ],
  flashcards: [
    { front: 'Which plans support content exclusion?', back: 'Copilot Business and Copilot Enterprise.' },
    { front: 'Who can configure content exclusion, and where?', back: 'Repository administrators (repository Settings > Copilot > Content exclusion), organisation owners (organisation Settings > Copilot), enterprise owners (AI controls > Copilot); never from the IDE.' },
    { front: 'What are the four effects of excluding a file?', back: 'No inline suggestions in it, it does not inform suggestions in other files, it does not inform Chat or agent responses, and Copilot code review does not review it.' },
    { front: 'How long can content exclusion changes take to apply in an IDE?', back: 'Up to 30 minutes; reload the window (VS Code) or restart the IDE to apply sooner.' },
    { front: 'What pattern syntax do exclusion rules use?', back: 'fnmatch glob patterns, case-insensitive; "/scripts/**" is recursive, "/scripts/*" is one level, "secrets.json" matches anywhere.' },
    { front: 'What does "*": in organisation exclusion settings mean?', back: 'Paths to exclude from any file system root, inside or outside Git.' },
    { front: 'Does content exclusion guarantee a file can never reach the model?', back: 'No. It is a guardrail for GitHub-controlled tools, not a file-system security boundary; MCP servers, indirect semantic data, agent indirection, symlinks and remote file systems are gaps.' },
    { front: 'How does the public-code filter decide a match?', back: 'It compares the suggestion plus about 150 characters of surrounding code against GitHub\'s public-code index.' },
    { front: 'Where do you see code references in VS Code?', back: 'Output panel, channel "GitHub Copilot Log (Code References)".' },
    { front: 'Can a Copilot Business user change their own suggestions-matching-public-code setting?', back: 'No; it is inherited from the organisation or enterprise policy.' },
    { front: 'Who owns the code Copilot generates?', back: 'You do, with the responsibility that comes with it: testing, security and licence review; GitHub does not claim ownership.' },
    { front: 'Which audit log event records exclusion changes?', back: 'copilot.content_exclusion_changed' },
  ],
  quiz: [
    {
      question:
        'An organisation owner needs to prevent Copilot from using any file named `.env` in any repository, including code outside Git on developers\' machines, for all users the organisation seats. Which configuration achieves this?',
      options: [
        'Add "- .env" to each repository\'s content exclusion settings',
        'In organisation content exclusion settings, add "*": followed by "- \\"**/.env\\""',
        'Ask developers to add .env to .gitignore',
        'Set the suggestions-matching-public-code policy to Block',
      ],
      correct: [1],
      explanation:
        'The "*" key targets any file system root, Git or not, for the organisation\'s seated users. Per-repository rules would need to be repeated and would not cover non-Git paths; .gitignore and the public-code filter are unrelated to Copilot context.',
    },
    {
      question:
        'A repository administrator adds "/scripts/*" to the repository\'s content exclusions and immediately still sees suggestions in scripts/deploy/run.sh. Which TWO explanations are likely? (Select two)',
      options: [
        'Changes can take up to 30 minutes to apply in an IDE where settings are already loaded',
        'The pattern "/scripts/*" matches files directly under /scripts, not the deploy subfolder; "/scripts/**" is needed',
        'Content exclusion only works on Copilot Free',
        'Repository-level exclusions do not apply to administrators',
      ],
      correct: [0, 1],
      explanation:
        'Propagation delay and pattern depth are the documented causes. Content exclusion is a Business and Enterprise feature, and repository rules apply to everyone working in the repository, including admins.',
    },
    {
      question:
        'A developer on a Copilot Business seat gets no suggestion when typing a common algorithm, while a colleague on a personal plan gets one with a code reference. What explains the difference?',
      options: [
        'The Business seat has the suggestions-matching-public-code policy set to Block, so the matching suggestion was suppressed',
        'Content exclusion blocks algorithms',
        'The Business user has exceeded 2,000 completions',
        'Code references are only available on Copilot Enterprise',
      ],
      correct: [0],
      explanation:
        'Block suppresses suggestions that match public code; Allow shows them with references. Exclusions target file paths, Business has unlimited completions, and references are available wherever Allow mode applies.',
    },
    {
      question: 'Which statement about the limitations of content exclusion is correct?',
      options: [
        'It is enforced at the operating-system level and blocks all file reads',
        'It is a guardrail for GitHub-controlled tools and may not be respected by third-party MCP servers or detect indirect file access by agents',
        'It applies to symbolic links and remote file systems',
        'It also deletes excluded files from the repository',
      ],
      correct: [1],
      explanation:
        'GitHub documents that exclusion is not a security boundary, excludes symlinks and remote file systems from coverage, and may miss indirect access. It never modifies files.',
    },
    {
      question:
        'A legal team asks who owns the code produced by Copilot and what obligations the company has. Which answer is MOST accurate?',
      options: [
        'GitHub owns all generated code and licenses it back',
        'The developer or company owns the output and remains responsible for testing it, reviewing security and checking licences, since output may occasionally match public code',
        'Generated code is automatically public domain',
        'Ownership transfers to the model provider',
      ],
      correct: [1],
      explanation:
        'GitHub does not claim ownership of your output, and the responsible-use documentation puts verification and licence precautions on the user.',
    },
    {
      question:
        'A developer wants to confirm whether an inline suggestion they accepted matched public code. Where should they look in VS Code?',
      options: [
        'The repository audit log',
        'The Output panel channel "GitHub Copilot Log (Code References)"',
        'The content exclusion settings page',
        'The pull request summary',
      ],
      correct: [1],
      explanation:
        'Code references for inline suggestions are written to that log channel when the policy allows matches. Audit logs record admin events, exclusion settings list paths, and PR summaries describe changes.',
    },
  ],
  statements: [
    { text: 'Content exclusion can be configured on Copilot Pro by the individual developer.', isTrue: false, explanation: 'It is an organisation feature of Copilot Business and Enterprise, configured by admins on GitHub.com.' },
    { text: 'Excluded files are still used as context for Copilot code review.', isTrue: false, explanation: 'Excluded files are not reviewed by Copilot code review.' },
    { text: 'Organisation-level exclusion rules apply only to users who receive their Copilot seat from that organisation.', isTrue: true, explanation: 'Enterprise rules cover everyone in the enterprise; repository rules cover everyone working in the repository.' },
    { text: 'After configuring content exclusion, the client sends the repository URL to GitHub to retrieve the policy, and the URL is not logged.', isTrue: true, explanation: 'This is the documented data flow for fetching exclusion policies.' },
    { text: 'Setting the public-code policy to Allow means matching suggestions are shown with references to the source repositories and licences.', isTrue: true, explanation: 'Allow mode annotates matches; Block mode suppresses them.' },
    { text: 'A member of a Copilot Business organisation can override the organisation\'s public-code setting in personal settings.', isTrue: false, explanation: 'The setting is inherited from the organisation or enterprise for seated members.' },
    { text: 'Content exclusion covers files reached through symbolic links.', isTrue: false, explanation: 'Symlinks and repositories on remote file systems are currently not covered.' },
  ],
  resources: [
    { label: 'Content exclusion for GitHub Copilot (concept)', url: 'https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/content-exclusion' },
    { label: 'Excluding content from GitHub Copilot', url: 'https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot' },
    { label: 'Finding public code that matches GitHub Copilot suggestions', url: 'https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/copilot-for-common-tasks/find-matching-code' },
    { label: 'Troubleshooting common issues with GitHub Copilot', url: 'https://docs.github.com/en/copilot/how-tos/troubleshoot-copilot/troubleshoot-common-issues' },
  ],
};
