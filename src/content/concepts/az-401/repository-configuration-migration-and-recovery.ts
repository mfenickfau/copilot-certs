import type { Concept } from '../../types';

export const repositoryConfigurationMigrationAndRecovery: Concept = {
  id: 'repository-configuration-migration-and-recovery',
  title: 'Repository Permissions, Tags, Hooks, Traceability, Migration and Git Recovery',
  summary:
    'Configuring Azure Repos and GitHub repositories: permissions and roles, tags, traceability through quality signals and deep links, Git hooks that check code automatically, migrating repositories from Azure DevOps to GitHub with GitHub Enterprise Importer, and recovering or permanently removing data with Git commands.',
  certs: ['az-401'],
  domains: ['az-401-2'],
  outcomes: ['az-401-2-2-1', 'az-401-2-2-2', 'az-401-2-2-3', 'az-401-2-2-4', 'az-401-2-2-5', 'az-401-2-2-6'],
  tags: ['azure-repos', 'github', 'permissions', 'git-tags', 'git-hooks', 'pre-commit', 'migration', 'gei', 'git-filter-repo', 'reflog'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Repository permissions in Azure Repos and GitHub',
      body: `**Azure Repos** permissions are set at the project level ("Git repositories", inherited by every repo) or per repository, for security groups or users, with Allow, Deny, Not set and inherited variants. The named permissions you should recognise: Read; Contribute; Create branch; Create tag; Manage notes; Contribute to pull requests; Edit policies; Manage permissions; Remove others' locks; Rename repository; Delete or disable repository; Force push (rewrite history, delete branches and tags); Bypass policies when completing pull requests; Bypass policies when pushing. Defaults: Readers get Read and PR participation, Contributors add Contribute, Create branch, Create tag and Manage notes, Project Administrators add Edit policies, Manage permissions and Remove others' locks. The bypass and force-push permissions are not granted to any default group and should stay that way, with a break-glass group if you need one. Branch-level permissions (for example who can create \`release/*\` branches) refine repository permissions.

**GitHub** uses roles. Repository roles are **Read, Triage, Write, Maintain and Admin**, with custom repository roles on Enterprise Cloud. Organization roles are owner, member, billing manager and moderators, plus custom organization roles. Teams receive repository roles and can be nested; base permissions set what every member gets. Admin is the role that can change security settings or delete the repository, so keep it rare, and remember that **rulesets with bypass lists** are the GitHub way to let a team override protections without making them admins. An agent (Copilot cloud agent, a GitHub App) needs only the permissions its tasks require, and only people with write access can direct it.`,
    },
    {
      heading: 'Tags, traceability and quality signals in the repository',
      body: `**Tags** mark releases. Git has lightweight tags (a pointer) and annotated tags (tagger, date, message, optionally signed). Azure Repos creates annotated tags from the web portal and requires the \`Create tag\` permission; GitHub Releases attach notes and assets to a tag, and both platforms let you protect tag patterns (tag policies via branch-style permissions in Azure Repos, tag rulesets in GitHub). Pipelines should tag the commit they shipped with the artifact version so a running system can be traced back to source.

**Traceability inside the repository** means a reader can move from any artifact to its context:

- **Deep links to work**: \`AB#123\` in commits and PR descriptions (Azure Boards), \`Fixes #45\` in GitHub, branch created from the work item, PR linked to the issue. Branch policies can require a linked work item.
- **Code quality**: status checks on the PR from linters and SAST (CodeQL in GitHub Advanced Security, SonarQube, or GitHub Advanced Security for Azure DevOps). Make them required so quality is a gate, not a badge.
- **Code coverage**: Azure Pipelines publishes coverage with \`PublishCodeCoverageResults@2\` and can show **diff coverage** on PRs for Azure Repos with an \`azurepipelines-coverage.yml\` policy; GitHub shows coverage through actions that post a check or a PR comment, with required status checks enforcing a threshold.
- **Build provenance**: the pipeline run links to the commit, the artifact version and the tag; Copilot cloud agent commits link to their session logs.

A useful mental test for the exam: from a production incident, can you reach the deployment, the artifact, the commit, the PR, the reviewer, the test results and the work item in a few clicks? Each missing hop is a traceability outcome the question is probing.`,
    },
    {
      heading: 'Git hooks that check code automatically',
      body: `Git hooks are scripts in \`.git/hooks\` that run on events: **client-side** (\`pre-commit\`, \`prepare-commit-msg\`, \`commit-msg\`, \`pre-push\`) and **server-side** (\`pre-receive\`, \`update\`, \`post-receive\`). Two facts drive every exam answer here:

1. Hooks in \`.git/hooks\` are **not versioned or cloned**, so to share them you commit them elsewhere and install them with a tool: **pre-commit** (Python, \`.pre-commit-config.yaml\`), **Husky** (Node, \`.husky/\`), or \`git config core.hooksPath .githooks\` after committing a \`.githooks\` folder.
2. **Azure Repos and GitHub.com do not run server-side hooks you upload**. Server-side enforcement is done with branch policies and build validation (Azure Repos), branch protection, rulesets, push rulesets and push protection (GitHub), or pre-receive hooks on GitHub Enterprise Server only.

Use client-side hooks for fast feedback (formatting, lint, secret detection with gitleaks, commit message conventions, blocking large files) and treat them as a convenience: a developer can run \`git commit --no-verify\`, and an agent working in a fresh container will not have them unless its setup steps install them. The pipeline and the branch policy remain the source of truth. For Copilot cloud agent sessions you can install the same pre-commit hooks in \`copilot-setup-steps.yml\`, or use **agent hooks** (\`.github/hooks\`) to run the checks before and after tool calls regardless of Git.`,
    },
    {
      heading: 'Migrating a repository from Azure DevOps to GitHub',
      body: `The supported path is **GitHub Enterprise Importer (GEI)** with the \`gh ado2gh\` CLI extension. It migrates Git history, pull requests (including comments), and, with options, rewires Azure Pipelines to the new repository, creates teams and configures the Azure Boards integration. It does **not** migrate work items, Azure Artifacts, wikis, branch policies or pipeline definitions themselves (pipelines keep running in Azure DevOps against GitHub if rewired). TFVC repositories must be converted to Git first.

The workflow Microsoft and GitHub document:

1. Inventory with \`gh ado2gh inventory-report\`; confirm the organization is Microsoft Entra-backed and you hold Project Collection Administrator in ADO and organization owner (or migrator role) in GitHub.
2. Create a PAT for Azure DevOps and a GitHub PAT with the required scopes; set \`ADO_PAT\` and \`GH_PAT\`.
3. Generate a script: \`gh ado2gh generate-script --ado-org SOURCE --github-org DESTINATION --output migrate.ps1\` (add \`--all\` to include pipeline rewiring, teams and Boards integration).
4. **Trial run** into a sandbox organization, validate with users, then halt work and run the production migration; GEI has no delta migration, so changes during the migration must be redone by hand.
5. Follow-up tasks: re-create branch protection or rulesets, CODEOWNERS, secrets, Actions workflows, and update remotes on clients (\`git remote set-url origin\`).

For a single repository you can also run \`gh ado2gh migrate-repo --ado-org ... --ado-team-project ... --ado-repo ... --github-org ... --github-repo ...\`. A plain \`git clone --mirror\` and \`git push --mirror\` moves commits, branches and tags but loses pull request history and metadata, which is why the exam prefers GEI for "repository-to-repository" migration.`,
    },
    {
      heading: 'Recovering or removing specific data with Git',
      body: `Recovery and removal are opposite goals that use neighbouring commands:

**Recover**
- A deleted branch or a lost commit: \`git reflog\` to find the SHA, then \`git checkout -b restored <sha>\` or \`git branch restored <sha>\`.
- A bad merge or commit already pushed: \`git revert <sha>\` creates a new commit that undoes it without rewriting history (safe on protected branches).
- One commit from another branch: \`git cherry-pick <sha>\` (the hotfix-to-main pattern).
- A file from an earlier commit: \`git restore --source=<sha> -- path/file\` or \`git checkout <sha> -- path/file\`.
- A deleted Azure Repos repository can be restored from the project's deleted repositories list within 30 days; GitHub repository restores go through the owner settings or Support within a similar window.

**Remove**
- Stop tracking but keep locally: \`git rm --cached secrets.env\` plus a \`.gitignore\` entry.
- Erase from all history: rotate the credential first (history rewrites never un-leak a secret), then run **git filter-repo** (recommended over filter-branch and BFG) such as \`git filter-repo --path config/secrets.env --invert-paths\`, force-push every branch and tag, ask collaborators to re-clone, and expire the reflog and garbage collect (\`git reflog expire --expire=now --all && git gc --prune=now --aggressive\`).
- Platform cleanup: force-pushing requires temporarily relaxing \`Allow force pushes\` or the Azure Repos \`Force push\` permission, cached views of old commits may remain on GitHub until Support purges them, and open pull requests should be closed or merged first because their diffs change. Signatures on rewritten commits are lost.

Exam heuristics: "undo without rewriting history" is \`revert\`; "find something I deleted locally" is \`reflog\`; "remove a secret from all history" is rotate, then \`filter-repo\`, then force-push and coordinate; "move one fix to another branch" is \`cherry-pick\`.`,
    },
  ],
  examples: [
    {
      title: 'Shared pre-commit hooks for humans and agents',
      description:
        'A team wants formatting, lint and secret detection to run before any commit, on developer laptops and in Copilot cloud agent sessions. They commit a .pre-commit-config.yaml and install the hooks in copilot-setup-steps.yml so the agent’s commits get the same checks; the pipeline runs the same tools as a required status check in case anyone skips the hook.',
      language: 'yaml',
      code: `# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.24.0
    hooks: [{ id: gitleaks }]
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks: [{ id: check-added-large-files, args: ['--maxkb=5000'] }, { id: end-of-file-fixer }]

# .github/workflows/copilot-setup-steps.yml (excerpt)
jobs:
  copilot-setup-steps:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pipx install pre-commit && pre-commit install`,
      takeaway: 'Hooks are a fast local gate; version their configuration, install them for agents too, and back them with a required pipeline check.',
    },
    {
      title: 'Migrating with GitHub Enterprise Importer',
      description:
        'Contoso moves 40 repositories from the ADO organization contoso to the GitHub organization contoso-eng. The migration lead runs a trial into contoso-eng-sandbox, lets teams validate, then schedules a freeze and runs the generated script for real, with --all so pipelines are rewired and the Boards integration is configured.',
      language: 'powershell',
      code: `# Inventory and script generation
gh extension install github/gh-ado2gh
$env:ADO_PAT = "<ado-pat>"; $env:GH_PAT = "<github-pat>"
gh ado2gh inventory-report --ado-org contoso
gh ado2gh generate-script --ado-org contoso --github-org contoso-eng-sandbox --output trial.ps1 --all
.\\trial.ps1          # trial run; users validate

# Production run after freezing work (no delta migrations)
gh ado2gh generate-script --ado-org contoso --github-org contoso-eng --output migrate.ps1 --all
.\\migrate.ps1
gh ado2gh migrate-repo --ado-org contoso --ado-team-project Checkout --ado-repo api \`
  --github-org contoso-eng --github-repo checkout-api   # single repo example`,
      takeaway: 'GEI preserves history and pull requests and can rewire pipelines; always trial, then freeze, because there is no delta migration.',
    },
    {
      title: 'Removing a leaked key the wrong way (a realistic mistake)',
      description:
        'A developer notices a storage account key committed last week, deletes the file in a new commit and asks Copilot to "clean the repo". The key is still in history and still valid. The correct sequence: rotate the key in Azure immediately; close or merge open PRs; run git filter-repo --path src/appsettings.Production.json --invert-paths; force-push all refs after temporarily allowing force pushes; have everyone re-clone; expire reflogs and gc; ask GitHub Support to purge cached views; and add push protection so it cannot happen again.',
      language: 'bash',
      code: `# 1) rotate the secret in Azure first (az storage account keys renew ...)
# 2) rewrite history locally on a fresh clone
git clone --mirror https://github.com/contoso-eng/checkout-api.git && cd checkout-api.git
git filter-repo --path src/appsettings.Production.json --invert-paths
# 3) push rewritten refs (temporarily allow force pushes / Force push permission)
git push --force --all && git push --force --tags
# 4) everyone re-clones; then prune old objects
git reflog expire --expire=now --all && git gc --prune=now --aggressive`,
      takeaway: 'Deleting a file in a new commit does nothing for history; rotate, rewrite with filter-repo, force-push, coordinate re-clones and enable push protection.',
    },
    {
      title: 'Recovering a branch an agent deleted',
      description:
        'A cleanup script run by an automation deletes the feature/pricing branch before its PR merged. The developer finds the last commit with git reflog on a clone that had the branch, recreates it and pushes; because the branch had never been force-pushed, the Azure Repos server also lists it under deleted branches for restore.',
      language: 'bash',
      code: `git reflog --date=iso | grep pricing
# e5d2f1a HEAD@{2026-11-10 14:02:11 +0000}: checkout: moving from feature/pricing to main
git branch feature/pricing e5d2f1a
git push -u origin feature/pricing`,
      takeaway: 'The reflog is your local undo history; combine it with the platform’s deleted-branch restore and never rely on an agent’s cleanup being reversible.',
    },
  ],
  keyPoints: [
    'Azure Repos permissions are Allow/Deny/Not set per security group at project or repository level; Force push and Bypass policies are not granted by default and should stay with a break-glass group.',
    'GitHub repository roles are Read, Triage, Write, Maintain and Admin (plus custom roles on Enterprise Cloud); grant through teams and use ruleset bypass lists instead of admin rights for overrides.',
    'Annotated tags carry tagger, date and message; Azure Repos creates annotated tags in the portal and needs the Create tag permission; GitHub Releases hang off tags; protect release tag patterns.',
    'Traceability in the repository = deep links (AB#, Fixes #) + quality status checks + coverage (PublishCodeCoverageResults@2, diff coverage policy) + build and tag provenance.',
    'Git hooks are not cloned; share them with pre-commit, Husky or core.hooksPath. Azure Repos and GitHub.com do not run custom server-side hooks; use policies, rulesets and push protection instead.',
    'Migrate ADO repositories to GitHub with GitHub Enterprise Importer (gh ado2gh): inventory, generate-script, trial run, freeze, migrate; PR history is preserved, work items and artifacts are not.',
    'Recover with reflog, revert, cherry-pick and restore; remove permanently with git filter-repo after rotating the secret, then force-push, re-clone and gc.',
  ],
  flashcards: [
    { front: 'Which Azure Repos permission allows rewriting history and deleting branches or tags?', back: 'Force push (rewrite history, delete branches and tags).' },
    { front: 'List the five GitHub repository roles.', back: 'Read, Triage, Write, Maintain, Admin.' },
    { front: 'What is the difference between a lightweight and an annotated Git tag?', back: 'Lightweight tags are bare pointers; annotated tags store tagger, date and message and can be signed.' },
    { front: 'Why do Git hooks in .git/hooks need a tool like pre-commit or Husky to share?', back: 'Because .git/hooks is not versioned or cloned; tools install versioned hook definitions on each machine.' },
    { front: 'Can you upload a pre-receive hook to Azure Repos or GitHub.com?', back: 'No. Use branch policies, rulesets and push protection; pre-receive hooks exist only on GitHub Enterprise Server.' },
    { front: 'Which tool and command generate a bulk ADO-to-GitHub migration script?', back: 'GitHub Enterprise Importer: gh ado2gh generate-script --ado-org SOURCE --github-org DESTINATION --output FILE (optionally --all).' },
    { front: 'What does GEI not migrate from Azure DevOps?', back: 'Work items, Azure Artifacts, wikis, branch policies and pipeline definitions (pipelines can be rewired to the new repo).' },
    { front: 'Which Git command undoes a pushed commit without rewriting history?', back: 'git revert <sha>.' },
    { front: 'What is the first step when a secret is found in Git history?', back: 'Rotate or revoke the secret; only then rewrite history with git filter-repo and force-push.' },
    { front: 'Which command shows the history of where HEAD and branches pointed, to recover lost commits?', back: 'git reflog.' },
    { front: 'How does Azure Repos show per-PR code coverage?', back: 'Diff coverage from PublishCodeCoverageResults@2 with an azurepipelines-coverage.yml coverage policy (Azure Repos only).' },
  ],
  quiz: [
    {
      question:
        'A contractor needs to clone and read an Azure Repos repository and comment on pull requests, but must not push. Which default security group provides exactly this?',
      options: ['Contributors', 'Readers', 'Project Administrators', 'Build Administrators'],
      correct: [1],
      explanation:
        'Readers have Read plus pull request participation. Contributors can push (Contribute), Project Administrators manage policies and permissions, and Build Administrators manage pipelines.',
    },
    {
      question:
        'A team commits a .githooks folder with a pre-commit script, but Azure Repos never rejects commits that fail it. Why?',
      options: [
        'Azure Repos only supports hooks written in PowerShell.',
        'Client-side hooks run on the developer’s machine only and Azure Repos does not execute uploaded server-side hooks; use branch policies for enforcement.',
        'The script must be in .git/hooks on the server.',
        'Hooks require the Bypass policies permission.',
      ],
      correct: [1],
      explanation:
        'Hooks are local scripts; hosted Azure Repos and GitHub.com do not run custom server hooks. Enforcement belongs in build validation, status checks or rulesets. Language and permissions are irrelevant.',
    },
    {
      question:
        'Contoso must move 120 Git repositories from Azure DevOps to GitHub Enterprise Cloud while preserving pull request history and rewiring existing Azure Pipelines. Which approach should you recommend?',
      options: [
        'git clone --mirror and git push --mirror for each repository',
        'GitHub Enterprise Importer with gh ado2gh generate-script --all, after a trial run',
        'Export each repository as a ZIP and upload it to GitHub',
        'Azure DevOps Migration Tool (data migration to cloud)',
      ],
      correct: [1],
      explanation:
        'GEI preserves PR history and the --all option rewires pipelines and sets up Boards integration. Mirroring loses PR metadata, ZIP uploads lose history, and the Data Migration Tool moves on-premises collections into Azure DevOps Services, not to GitHub.',
    },
    {
      question:
        'A production connection string was committed three months ago and later deleted in a newer commit. The security team wants it gone from the repository. Which TWO actions are required? (Select two)',
      options: [
        'Rotate the connection string so the exposed value stops working',
        'Rewrite history with git filter-repo and force-push all branches and tags',
        'Add the file to .gitignore',
        'Run git revert on the original commit',
      ],
      correct: [0, 1],
      explanation:
        'Rotation makes the leak harmless and filter-repo removes it from history. .gitignore only affects future commits, and revert adds a new commit while leaving the secret in history.',
    },
    {
      question:
        'A fix was merged to release/3.1 and must also be applied to main without merging the rest of the release branch. Which command should you use?',
      options: ['git merge release/3.1', 'git cherry-pick <fix-sha>', 'git rebase main', 'git reset --hard <fix-sha>'],
      correct: [1],
      explanation:
        'cherry-pick copies a single commit. Merging brings the whole branch, rebase rewrites the current branch onto main, and reset discards commits.',
    },
    {
      question:
        'Which practice gives reviewers evidence of test coverage directly on an Azure Repos pull request?',
      options: [
        'Publishing coverage with PublishCodeCoverageResults@2 and configuring an azurepipelines-coverage.yml diff coverage policy',
        'Adding a coverage badge to the README',
        'Tagging the commit with the coverage percentage',
        'Enabling auditing on the organization',
      ],
      correct: [0],
      explanation:
        'Diff coverage appears on the PR and can gate completion. Badges and tags are informational, and auditing records administrative events.',
    },
  ],
  statements: [
    { text: 'By default, members of the Contributors group in Azure Repos can bypass branch policies when pushing.', isTrue: false, explanation: 'Bypass permissions are not granted to any default group.' },
    { text: 'GitHub Enterprise Cloud supports custom repository roles in addition to Read, Triage, Write, Maintain and Admin.', isTrue: true, explanation: 'Custom repository roles are an Enterprise Cloud feature.' },
    { text: 'Hooks committed to a .githooks folder run automatically on every clone.', isTrue: false, explanation: 'Each clone must set core.hooksPath or install them with a tool such as pre-commit.' },
    { text: 'GitHub Enterprise Importer migrates Azure Boards work items along with the repository.', isTrue: false, explanation: 'Work items, artifacts, wikis and policies are not migrated; only repositories and PR metadata (plus optional pipeline rewiring).' },
    { text: 'git filter-repo is the recommended tool for removing a file from an entire repository history.', isTrue: true, explanation: 'GitHub recommends git filter-repo over filter-branch and BFG.' },
    { text: 'git revert rewrites history and requires a force push.', isTrue: false, explanation: 'revert adds a new commit that undoes the change; history is preserved.' },
    { text: 'Annotated tags can be created from the Azure Repos web portal.', isTrue: true, explanation: 'The portal creates annotated tags; lightweight tags are created from the command line.' },
  ],
  resources: [
    { label: 'Set Git repository permissions (Azure Repos)', url: 'https://learn.microsoft.com/en-us/azure/devops/repos/git/set-git-repository-permissions' },
    { label: 'Repository roles for an organization (GitHub)', url: 'https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization' },
    { label: 'Migrate repositories from Azure DevOps to GitHub Enterprise Cloud', url: 'https://docs.github.com/en/migrations/using-github-enterprise-importer/migrating-from-azure-devops-to-github-enterprise-cloud/migrating-repositories-from-azure-devops-to-github-enterprise-cloud' },
    { label: 'Removing sensitive data from a repository (GitHub)', url: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository' },
  ],
};
