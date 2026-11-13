import type { Concept } from '../../types';

export const packageManagementVersioningAndRetention: Concept = {
  id: 'package-management-versioning-and-retention',
  title: 'Package Management, Feeds and Views, Versioning and Retention',
  summary:
    'Choosing between Azure Artifacts and GitHub Packages, designing feeds with local and upstream sources and release views, versioning dependencies with SemVer or CalVer, versioning pipeline artifacts and build numbers, and setting retention so storage and reproducibility stay in balance.',
  certs: ['az-401'],
  domains: ['az-401-3'],
  outcomes: ['az-401-3-1-1', 'az-401-3-1-2', 'az-401-3-1-3', 'az-401-3-1-4', 'az-401-3-6-3'],
  tags: ['azure-artifacts', 'github-packages', 'upstream-sources', 'feed-views', 'semver', 'calver', 'build-number', 'retention'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Recommending a package management tool',
      body: `Both platforms host private packages; the recommendation depends on where the consumers and pipelines live.

| | Azure Artifacts | GitHub Packages |
|---|---|---|
| Formats | NuGet, npm, Maven, Python, Cargo, Universal Packages | npm, RubyGems, Maven, Gradle, NuGet, Docker and OCI images (ghcr.io Container registry) |
| Scope | Organization- or project-scoped feeds | Repository- or organization-scoped packages; ghcr.io for containers |
| Upstreams | Yes: public registries and other Azure Artifacts feeds, with saved copies | No upstream proxying; use the public registry directly |
| Quality promotion | Feed views (@local, @prerelease, @release) | Tags and release versions; no views |
| Auth from pipelines | Service connections, pipeline identity (Project Collection Build Service) | GITHUB_TOKEN with \`packages: write\`, PATs |
| Pricing | 2 GiB free per organization, then billed storage | Included storage and transfer per plan, then billed |
| Retention | Feed retention policies (versions, days since download) | Delete versions manually or via API/workflow |

Pick **Azure Artifacts** when pipelines run in Azure Pipelines, you need upstream caching of public registries for reliability and compliance, you want release views to signal quality, or you need Universal Packages for arbitrary blobs. Pick **GitHub Packages** when code and Actions live in GitHub, you publish containers to ghcr.io, and you want the \`GITHUB_TOKEN\` to publish without extra credentials. Many organizations use both: ghcr.io for images from GitHub Actions and an Azure Artifacts feed with upstreams as the single source for NuGet and npm.`,
    },
    {
      heading: 'Feeds, upstream sources and views',
      body: `An Azure Artifacts **feed** is the unit of permission and billing. Feed roles are **Reader**, **Collaborator** (Feed and Upstream Reader; can save packages from upstreams), **Contributor** (publish) and **Owner**. Project-scoped feeds inherit project visibility; organization-scoped feeds are shared across projects.

**Upstream sources** let one feed serve packages published to it *and* packages pulled from public registries (NuGet.org, npmjs.com, PyPI, Maven Central, crates.io) or from other Azure Artifacts feeds, including feeds in other organizations in the same tenant. The first time a package is requested, the feed saves a copy, so builds keep working if the public registry is down and you can audit exactly which versions entered your estate. Two rules: reference only **one feed** in nuget.config or .npmrc so restores are deterministic, and **order upstreams intentionally** because the feed resolves a package name from the first source that has it (a public upstream placed before your internal feed is how dependency confusion attacks succeed).

**Views** communicate quality. Every feed has \`@local\` (everything published or saved; the only view you can publish to and the default), plus suggested \`@prerelease\` and \`@release\`. You **promote** a version into a view; promotion cannot be undone, and promoted packages are exempt from retention policies. Consumers who want only validated packages point at \`https://pkgs.dev.azure.com/{org}/_packaging/{feed}@release/nuget/v3/index.json\`. Views are not a security boundary (same permissions as the feed); they are a quality signal that pipelines can automate by promoting after tests pass.`,
    },
    {
      heading: 'Versioning dependencies and packages: SemVer and CalVer',
      body: `**Semantic Versioning (SemVer)** is \`MAJOR.MINOR.PATCH[-prerelease][+build]\`: bump MAJOR for breaking changes, MINOR for backward-compatible features, PATCH for fixes; \`1.4.0-beta.2\` is a prerelease that sorts before \`1.4.0\`. Consumers express tolerance with ranges (\`^1.4.0\` in npm takes any 1.x at or above 1.4.0; \`~1.4.0\` only patches; NuGet floating versions such as \`1.4.*\`). SemVer is right for libraries and APIs because the number carries a compatibility promise.

**Calendar Versioning (CalVer)** encodes the date: \`2026.11.1\`, \`26.11\`, or \`YYYY.MM.MICRO\`. It suits applications, data snapshots, tooling images and anything released on a cadence where "newer" matters more than "compatible". It also suits agent-generated artifacts where a daily build is expected. CalVer says nothing about breaking changes, so pair it with release notes.

Strategy decisions the exam expects you to make:

- Libraries shared across teams: SemVer, immutable versions (Azure Artifacts enforces immutability; you cannot republish 1.4.0), prereleases from PR builds, promotion to \`@release\` on the tagged build.
- Applications deployed by pipeline: CalVer or SemVer, but the deployed version must equal the artifact version and the Git tag.
- Dependency updates: lock files committed; Dependabot or Renovate opens PRs; policy decides whether patch updates auto-merge after checks pass.
- Deprecate rather than delete when consumers still restore a version; **unlist** hides it from search while keeping restores working.`,
    },
    {
      heading: 'Versioning pipeline artifacts and the build number',
      body: `Pipeline artifacts (the output of a build that a release stage consumes) must be **immutable and uniquely identified**, and the identifier should appear in the artifact name, the package version, the container tag and the Git tag. In Azure Pipelines the run number comes from \`name:\` at the top of the YAML; the default is \`$(Date:yyyyMMdd).$(Rev:r)\`, where \`$(Rev:r)\` increments within the day and resets whenever any other part of the pattern changes. A SemVer-style pattern is \`name: 1.4.$(Rev:r)\` or, better, a computed version from Git history with a tool such as GitVersion (\`MinVer\`, \`Nerdbank.GitVersioning\` for .NET) so the version is derived from tags and branch, not from the day. Read it back with \`$(Build.BuildNumber)\`.

In GitHub Actions there is no built-in build number; use \`github.run_number\` (increments per workflow), \`github.sha\`, Git tags, or the same version tools, and stamp the value into the artifact with \`actions/upload-artifact\` names and container image tags. In both platforms:

- Publish once, deploy many: stages download the same artifact rather than rebuilding.
- Tag the commit with the artifact version on successful release.
- Containers: tag with the version *and* reference by digest for deployments; \`latest\` is for humans, not for pipelines.
- Keep the version in one place (build number or version file) and feed it to every output so a running system reports a version you can find in the feed, the registry and Git.`,
    },
    {
      heading: 'Retention for pipeline artifacts and dependencies',
      body: `Retention trades storage cost against reproducibility and compliance. Set it in four places:

1. **Azure Pipelines project settings** (Pipelines > Settings): days to keep runs, artifacts, symbols and attachments, and pull request runs, plus the minimum number of latest runs to retain per pipeline, counted for the default branch and each protected branch. Individual runs can be **retained** manually or by a retention lease created from YAML or the REST API so a production release is never cleaned up.
2. **Azure Artifacts feed retention policies**: maximum number of versions per package and days to keep recently downloaded packages; a version is deleted only when both conditions are met. Promoted (view) versions are exempt; deleted versions sit in the Recycle Bin for 30 days.
3. **GitHub Actions artifacts and logs**: artifacts default to 90 days of retention; set \`retention-days\` on \`actions/upload-artifact\` or change the repository or organization default. The Actions cache evicts entries unused for 7 days and is capped per repository (10 GB by default, configurable).
4. **GitHub Packages**: no automatic retention; delete old versions by API or a scheduled workflow, keeping tagged releases.

Design pattern: short retention for CI and PR runs (days), long or indefinite retention for release artifacts (retain the run, promote the package to \`@release\`, keep the tag), and a dependency policy that keeps the versions your supported releases need. If auditors ask "what exactly ran in production last March?", you must be able to fetch that artifact; if finance asks why storage doubled, the answer is usually unpromoted prerelease versions nobody cleans up.`,
    },
  ],
  examples: [
    {
      title: 'One feed with upstreams for the whole organization',
      description:
        'Contoso creates an organization-scoped feed named contoso-packages with upstream sources for NuGet.org and npmjs.com, places the internal feed first in the upstream order and configures every repository’s nuget.config to reference only this feed. Pipelines publish prerelease versions from PR builds and promote to @release on tagged builds; consumers in production pin to the @release view.',
      language: 'yaml',
      code: `# azure-pipelines.yml (excerpt): publish, then promote on tagged release builds
- task: NuGetCommand@2
  inputs:
    command: push
    packagesToPush: '$(Build.ArtifactStagingDirectory)/**/*.nupkg'
    nuGetFeedType: internal
    publishVstsFeed: 'contoso-packages'
- \${{ if startsWith(variables['Build.SourceBranch'], 'refs/tags/v') }}:
  - script: |
      az artifacts universal --help > /dev/null  # ensure CLI
      az devops invoke --area Packaging --resource PackageVersions --route-parameters \\
        feedId=contoso-packages packageName=Contoso.Core packageVersion=$(Build.BuildNumber) \\
        --http-method PATCH --in-file promote.json
    displayName: Promote to @release`,
      takeaway: 'Single feed, intentional upstream order and automated promotion give deterministic restores and a clear quality signal.',
    },
    {
      title: 'Choosing SemVer for the SDK and CalVer for the service',
      description:
        'A team ships a client SDK consumed by other teams and a web service deployed daily. They version the SDK with SemVer derived from Git tags (breaking changes bump MAJOR; PR builds produce -preview suffixes) and the service with CalVer 2026.11.<run>, stamped on the container image and the Git tag by the pipeline.',
      language: 'yaml',
      code: `# GitHub Actions: CalVer tag for the service image
- name: Compute version
  id: ver
  run: echo "version=$(date -u +%Y.%m).\${{ github.run_number }}" >> "$GITHUB_OUTPUT"
- name: Build and push
  run: |
    docker build -t ghcr.io/contoso/checkout:\${{ steps.ver.outputs.version }} .
    docker push ghcr.io/contoso/checkout:\${{ steps.ver.outputs.version }}
- name: Tag commit
  run: git tag "v\${{ steps.ver.outputs.version }}" && git push origin --tags`,
      takeaway: 'SemVer carries a compatibility promise for libraries; CalVer communicates recency for applications; either way the artifact, image and tag share one version.',
    },
    {
      title: 'Build numbers that collided (a realistic mistake)',
      description:
        'A pipeline uses name: 1.0.$(Rev:r) and publishes NuGet packages. A second pipeline for a hotfix branch uses the same pattern, produces 1.0.7 again and the push fails because Azure Artifacts versions are immutable; the team "fixes" it by deleting the package, breaking consumers who had already restored it. The correct approach: derive versions from Git (tags plus branch, for example 1.0.7-hotfix.1 on the hotfix branch), never delete a published version that consumers may have, and use deprecate or unlist instead.',
      takeaway: 'Immutability is a feature; version from source control so two pipelines can never claim the same number, and deprecate rather than delete.',
    },
    {
      title: 'Retention that satisfies both finance and the auditor',
      description:
        'A platform team sets Azure Pipelines retention to 30 days for runs and 10 days for PR runs, keeps a minimum of 3 runs per pipeline, and adds a retention lease in the production stage so any run that deployed to production is kept for 2 years. On the feed they enable retention with 50 versions per package and 60 days since last download, knowing promoted @release versions are exempt. GitHub Actions artifacts for CI are set to 7 days.',
      language: 'yaml',
      code: `# Retain the run that deployed to production (Azure Pipelines)
- task: PowerShell@2
  displayName: Retain production run for 2 years
  inputs:
    targetType: inline
    script: |
      $body = '[{ "daysValid": 730, "definitionId": $(System.DefinitionId), "ownerId": "User:$(Build.RequestedForId)", "protectPipeline": false, "runId": $(Build.BuildId) }]'
      $url = "$(System.CollectionUri)$(System.TeamProject)/_apis/build/retention/leases?api-version=7.1"
      Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType 'application/json' -Headers @{ Authorization = "Bearer $(System.AccessToken)" }
  env:
    SYSTEM_ACCESSTOKEN: $(System.AccessToken)`,
      takeaway: 'Short default retention plus explicit leases for production runs and view promotion for released packages keeps cost down without losing the evidence you need.',
    },
  ],
  keyPoints: [
    'Azure Artifacts: NuGet, npm, Maven, Python, Cargo and Universal Packages, with upstream sources and feed views; GitHub Packages: npm, RubyGems, Maven, Gradle, NuGet and container images on ghcr.io published with GITHUB_TOKEN.',
    'Upstream sources save a copy of every package pulled from public registries or other feeds; reference one feed per config file and order upstreams with your internal feed first.',
    'Views: @local is the default and the only publish target; promote to @prerelease or @release to signal quality; promotion is permanent and promoted versions are exempt from retention.',
    'SemVer (MAJOR.MINOR.PATCH with prerelease suffixes) for libraries and APIs; CalVer (date-based) for applications and cadenced releases; published versions are immutable, so deprecate or unlist rather than delete.',
    'Azure Pipelines run numbers come from name:, default $(Date:yyyyMMdd).$(Rev:r); GitHub Actions uses github.run_number, github.sha or version tools; stamp one version on artifact, image, package and Git tag.',
    'Retention lives in Azure Pipelines settings (days for runs, artifacts, PR runs; minimum runs per protected branch; retention leases), feed retention policies (max versions and days since download), and GitHub artifact retention-days (default 90) and cache eviction (7 days unused, 10 GB default).',
    'Azure Artifacts includes 2 GiB of free storage per organization; deleted package versions stay in the Recycle Bin for 30 days.',
  ],
  flashcards: [
    { front: 'Which Azure Artifacts view can packages be published to?', back: 'Only @local, the default view; other views are populated by promotion.' },
    { front: 'What happens when you promote a package version to @release?', back: 'It appears in that view, becomes exempt from retention policies, and the promotion cannot be reverted.' },
    { front: 'What do upstream sources do when a package is requested for the first time?', back: 'The feed fetches it from the upstream (public registry or another feed) and saves a copy in the feed.' },
    { front: 'Which feed role is required to save packages from upstream sources?', back: 'Feed and Upstream Reader (Collaborator) or higher.' },
    { front: 'Why should nuget.config or .npmrc reference only one feed?', back: 'To keep restores deterministic and avoid dependency confusion between sources.' },
    { front: 'SemVer: which component changes for a backward-compatible new feature?', back: 'MINOR.' },
    { front: 'What is CalVer and when is it a good fit?', back: 'Date-based versioning such as 2026.11.3; good for applications and cadenced releases where recency matters more than compatibility promises.' },
    { front: 'What is the default Azure Pipelines run number format and how does $(Rev:r) behave?', back: '$(Date:yyyyMMdd).$(Rev:r); Rev increments per run and resets to 1 when any other part of the name changes.' },
    { front: 'Under what conditions does an Azure Artifacts retention policy delete a version?', back: 'Only when the package exceeds the maximum number of versions AND the version has not been downloaded within the configured days.' },
    { front: 'What is the default retention for GitHub Actions artifacts?', back: '90 days, adjustable with retention-days on upload-artifact or in repository/organization settings.' },
    { front: 'Which registry hosts container images in GitHub Packages?', back: 'The GitHub Container registry, ghcr.io.' },
  ],
  quiz: [
    {
      question:
        'Contoso builds .NET libraries in Azure Pipelines and wants builds to keep working when NuGet.org is unavailable, with an auditable record of every public package used. What should you recommend?',
      options: [
        'Reference NuGet.org and an Azure Artifacts feed in nuget.config',
        'An Azure Artifacts feed with NuGet.org configured as an upstream source, referenced as the only feed in nuget.config',
        'GitHub Packages with the GITHUB_TOKEN',
        'Pipeline caching of the ~/.nuget/packages folder',
      ],
      correct: [1],
      explanation:
        'Upstream sources save copies of consumed packages, giving reliability and an audit trail, and a single feed keeps restores deterministic. Two feeds in config invite dependency confusion, GitHub Packages has no upstream proxying, and caching helps speed, not availability or audit.',
    },
    {
      question:
        'Consumers of an internal npm package must receive only versions that passed integration tests. Which Azure Artifacts feature provides this with the least effort?',
      options: ['A separate feed per quality level', 'Feed views with promotion to @release after tests pass', 'Unlisting failed versions', 'Feed permissions set to Reader'],
      correct: [1],
      explanation:
        'Views exist for exactly this: consumers target @release and the pipeline promotes validated versions. Separate feeds duplicate storage and config, unlisting only hides from search, and permissions do not express quality.',
    },
    {
      question:
        'A shared SDK introduces a change that removes a public method. According to Semantic Versioning, how should the version change from 2.3.1?',
      options: ['2.3.2', '2.4.0', '3.0.0', '2026.11.1'],
      correct: [2],
      explanation:
        'Removing public API is a breaking change, which increments MAJOR. PATCH is for fixes, MINOR for compatible features, and a date-based version is CalVer, not SemVer.',
    },
    {
      question:
        'Which TWO settings reduce Azure Artifacts storage while guaranteeing released versions are never cleaned up automatically? (Select two)',
      options: [
        'Enable feed retention with a maximum number of versions per package',
        'Promote released versions to the @release view',
        'Delete the @local view',
        'Set the feed to project scope',
      ],
      correct: [0, 1],
      explanation:
        'Retention policies remove old unpromoted versions and promoted versions are exempt. @local cannot be removed (it is the publish target) and feed scope does not affect retention.',
    },
    {
      question:
        'Auditors require that any Azure Pipelines run that deployed to production remains available for two years, while CI runs should be cleaned up after 30 days. What should you do?',
      options: [
        'Set the project retention to 730 days for all runs.',
        'Keep the 30-day project retention and add a retention lease (or mark the run to retain) from the production stage.',
        'Export each production run to a storage account.',
        'Disable retention policies.',
      ],
      correct: [1],
      explanation:
        'Leases retain specific runs beyond the policy while the default stays short. Raising retention for everything wastes storage, exporting loses the pipeline linkage, and disabling retention is not possible and would not target production runs.',
    },
    {
      question:
        'A pipeline publishes version 1.0.7 of a NuGet package, and a second pipeline on another branch fails when it tries to publish 1.0.7 again. What is the BEST fix?',
      options: [
        'Delete 1.0.7 from the feed and republish.',
        'Derive versions from Git tags and branch (for example a prerelease suffix on non-main branches) so versions are unique.',
        'Enable "allow overwrite" on the feed.',
        'Publish to a different view.',
      ],
      correct: [1],
      explanation:
        'Azure Artifacts versions are immutable by design and deleting breaks consumers; there is no overwrite option, and views are not publish targets. Version from source control so each build is unique.',
    },
  ],
  statements: [
    { text: 'Azure Artifacts lets you republish a package version with different content if you are a Feed Owner.', isTrue: false, explanation: 'Package versions are immutable; a version number cannot be reused.' },
    { text: 'Promoting a package to a view is permanent and cannot be reversed to @local.', isTrue: true, explanation: 'Azure Artifacts does not support demotion.' },
    { text: 'GitHub Packages can proxy and cache packages from npmjs.com as upstream sources.', isTrue: false, explanation: 'Upstream sources are an Azure Artifacts feature; GitHub Packages hosts your own packages.' },
    { text: 'In SemVer, 1.4.0-beta.2 has lower precedence than 1.4.0.', isTrue: true, explanation: 'Prerelease versions sort before the associated normal version.' },
    { text: '$(Rev:r) in an Azure Pipelines run number keeps incrementing across days regardless of the rest of the name.', isTrue: false, explanation: 'It resets to 1 whenever any other part of the build number changes, such as the date.' },
    { text: 'A promoted package version is exempt from Azure Artifacts feed retention policies.', isTrue: true, explanation: 'Only unpromoted versions are candidates for automatic deletion.' },
    { text: 'The GitHub Actions cache removes entries that have not been accessed for 7 days.', isTrue: true, explanation: 'Unused caches are evicted after 7 days and total size is limited per repository.' },
  ],
  resources: [
    { label: 'Azure Artifacts feed views', url: 'https://learn.microsoft.com/en-us/azure/devops/artifacts/concepts/views' },
    { label: 'Azure Artifacts upstream sources', url: 'https://learn.microsoft.com/en-us/azure/devops/artifacts/concepts/upstream-sources' },
    { label: 'Delete and recover packages, including retention policies', url: 'https://learn.microsoft.com/en-us/azure/devops/artifacts/how-to/delete-and-recover-packages' },
    { label: 'Introduction to GitHub Packages', url: 'https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages' },
  ],
};
