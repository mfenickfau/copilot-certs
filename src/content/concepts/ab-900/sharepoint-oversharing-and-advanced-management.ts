import type { Concept } from '../../types';

export const sharepointOversharingAndAdvancedManagement: Concept = {
  id: 'sharepoint-oversharing-and-advanced-management',
  title: 'Finding and Fixing Oversharing: Data Access Governance and SharePoint Advanced Management',
  summary:
    'Which tools reveal oversharing in SharePoint and OneDrive, how to run and act on data access governance reports, and how SharePoint Advanced Management features such as restricted access control, restricted content discovery and site lifecycle policies contain the risk before and after a Copilot rollout.',
  certs: ['ab-900'],
  domains: ['ab-900-2'],
  outcomes: ['ab-900-2-4-1', 'ab-900-2-4-2', 'ab-900-2-4-3'],
  tags: ['sharepoint', 'oversharing', 'data-access-governance', 'sharepoint-advanced-management', 'restricted-access-control', 'restricted-content-discovery'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Why oversharing is the Copilot problem',
      body: `Oversharing is content that more people can reach than should: a payroll workbook in a site shared with *Everyone except external users* (EEEU), an "Anyone" link to a contract, an old project site whose owners left years ago. Before Copilot, this exposure was mostly theoretical because nobody searched for it. Copilot's semantic index makes it one prompt away. Copilot does not create the exposure, but it collapses the time to discover it.

The toolset for troubleshooting oversharing spans three products, and the exam expects you to know which does what:

- **SharePoint admin center**: **data access governance (DAG) reports**, the **content management assessment**, **site access reviews**, sharing policies, **restricted access control**, **restricted content discovery**, site lifecycle policies (inactive and ownerless sites, site attestation), **block download** policies, and agent insights. Most of these are **SharePoint Advanced Management (SAM)** features, included with a Microsoft 365 Copilot licence or purchasable separately.
- **Microsoft Purview**: **DSPM for AI data risk assessments** (which sites hold sensitive data shared broadly), sensitivity labels, auto-labelling, DLP, and retention to delete stale content.
- **Microsoft Entra**: access reviews for groups and guests, and Conditional Access authentication contexts that SAM can bind to sensitive sites.

Microsoft's deployment blueprint describes a cycle: **identify** risky sites and files (DAG, DSPM), **apply interim restrictions** where needed (restricted content discovery or restricted access control), **fix** permissions, labels and sharing settings, and **enforce guardrails** continuously (sharing policies, lifecycle, DLP). The common wrong answer is to stop at the interim restriction.`,
    },
    {
      heading: 'Running data access governance reports',
      body: `**Data access governance reports** live at *SharePoint admin center > Reports > Data access governance* and require the SharePoint Administrator role. There are two families.

**Snapshot reports** describe the current state:

- **Site permissions across your organization** (recommended first): every SharePoint and OneDrive site ranked by breadth of access, flagging sites with thousands of users, guests, or EEEU and Everyone permissions.
- **Site permissions for users**: all sites a given user can reach and how (direct or via groups), ideal for leaver and investigation questions.
- **Sensitivity label applied to files**: which sites hold files with specific labels, to confirm sensitive content sits behind the right controls.
- **Sites and files shared via special SharePoint groups**: the exact items made effectively public through EEEU or Everyone, for scripted clean-up.

**Activity reports** cover the last 28 days of sharing behaviour:

- **Sharing links**: sites where users created the most Anyone, People in your organization and Specific people links.
- **Shared with Everyone except external users**: sites where content was recently shared with the whole company.

Running one: open the report, select *Run report* (or *Create report* with filters such as site template, sensitivity label or privacy), wait for generation, then download the CSV or open the site list. From a report you can **initiate a site access review**, which emails site owners a task to review and prune their permissions, and SAM can generate **AI insights** summarising risk patterns. Microsoft suggests snapshots quarterly and activity reports monthly. Organisations with E5 but no SAM get a limited version: activity reports only, up to 10,000 sites, no snapshot reports or remedial actions, and data collection must be switched on first. PowerShell (the SharePoint Online Management Shell) can also generate DAG reports for automation.`,
    },
    {
      heading: 'Restricted access control and restricted content discovery',
      body: `Two SAM controls contain risk while you remediate, and they are easy to confuse.

**Restricted access control (RAC)**, also called site-level access restriction, limits access to a site **and its content** to members of up to ten Microsoft 365 groups or Entra security groups. Anyone outside those groups is denied even if they hold a direct permission or a sharing link, and search and Copilot honour the policy. Being in the control group does not grant access by itself; a user still needs normal permission *and* group membership. Enable it for the tenant under *Policies > Access control > Site-level access restriction* (or \`Set-SPOTenant -EnableRestrictedAccessControl $true\`), then configure a site from *Active sites > site > Settings > Restricted site access*, or with \`Set-SPOSite -Identity <url> -RestrictedAccessControl $true -AddRestrictedAccessControlGroups <group ids>\`. Private and shared channel sites must be configured separately, and management can be delegated to site admins. RAC also exists for OneDrive, limiting who can access a user's OneDrive content.

**Restricted content discovery (RCD)** stops a site's content appearing in **organisation-wide search and Copilot responses** and removes AI entry points on the site, **without changing permissions**. Users who already have access can still open files directly. Turn it on from *Active sites > site > Settings > Restrict content from Microsoft Copilot* or \`Set-SPOSite -Identity <url> -RestrictContentOrgWideSearch $true\`. Microsoft positions it as a **temporary** control for sites under review and warns that overuse starves Copilot of context. It is for SharePoint sites only, not OneDrive.

**Restricted SharePoint Search**, the older allow list of up to 100 sites, is retiring (new enablement blocked from 31 July 2026) in favour of RCD. On the exam, choose RAC when the requirement is to actually *stop people accessing* a site; choose RCD when the requirement is to *keep a site out of Copilot and search* temporarily while permissions are reviewed.`,
    },
    {
      heading: 'The rest of SharePoint Advanced Management',
      body: `SAM groups its features into three goals.

**Prevent oversharing**: DAG reports and site access reviews; RAC and RCD; the **content management assessment** hub with recommendations; **block download** policies for sites, OneDrive and Teams meeting recordings (view in browser only); **Conditional Access authentication contexts** that tie a site to an Entra policy such as "require MFA and a compliant device for the Legal site"; **app insights** on third-party apps touching SharePoint; **agent insights** and **agent access insights** showing which SharePoint agents exist and what they read; **AI insights** generated from reports; restricting OneDrive access or site creation with security groups.

**Manage content sprawl**: the **site ownership policy** (minimum owner counts and notifications), the **inactive site policy** that notifies owners and can archive or make sites read-only, and **site attestation** asking owners to confirm a site is still needed and correctly permissioned. Less stale content means fewer surprising Copilot answers.

**Manage the content lifecycle**: **catalog management** to group sites by department, region or information barrier, **change history reports** for 180 days of settings changes, recent change tracking on site properties, **site policy comparison** against a baseline, and restricting site creation by apps.

Licensing: SAM is included with Microsoft 365 Copilot licences (and E7) and is otherwise an add-on; most features need the SharePoint Administrator role and the SharePoint Online PowerShell module for scripting. For the exam, when a scenario mentions ownerless or inactive sites, broad EEEU access, blocking downloads from a sensitive site, or temporarily hiding a site from Copilot, the answer lives in SharePoint Advanced Management.`,
    },
  ],
  examples: [
    {
      title: 'A quarterly oversharing review',
      description:
        'The SharePoint admin runs the Site permissions across your organization snapshot report and finds 37 sites granting EEEU access, including two HR sites. She launches a site access review for all 37, applies restricted content discovery to the two HR sites immediately, and runs the Sharing links activity report monthly to catch new Anyone links. Within six weeks the owners have trimmed 30 sites and RCD is removed from HR.',
      takeaway: 'Snapshot reports set the baseline, activity reports catch new risk, and site access reviews delegate clean-up to owners.',
    },
    {
      title: 'Hiding a site but not securing it (a realistic mistake)',
      description:
        'An admin applies restricted content discovery to the Finance site after Copilot surfaced bonus data, and declares the issue closed. A month later an employee browses straight to the site and opens the bonus spreadsheet, because RCD never changed the permissions. The admin should have used RCD only as a stopgap and then either fixed the site permissions or applied restricted access control to a Finance security group.',
      code: `# Interim: keep the site out of Copilot and org-wide search
Set-SPOSite -Identity https://contoso.sharepoint.com/sites/Finance -RestrictContentOrgWideSearch $true

# Durable: only Finance group members can access the site at all
Set-SPOTenant -EnableRestrictedAccessControl $true
Set-SPOSite -Identity https://contoso.sharepoint.com/sites/Finance -RestrictedAccessControl $true
Set-SPOSite -Identity https://contoso.sharepoint.com/sites/Finance -AddRestrictedAccessControlGroups "<finance-group-guid>"

# Then remove the interim restriction once permissions are right
Set-SPOSite -Identity https://contoso.sharepoint.com/sites/Finance -RestrictContentOrgWideSearch $false`,
      language: 'powershell',
      takeaway: 'Restricted content discovery hides; restricted access control secures. Use the first briefly and the second (or permission fixes) permanently.',
    },
    {
      title: 'Ownerless sites before rollout',
      description:
        'Before buying Copilot licences, Contoso configures a SAM inactive site policy (no activity for 180 days triggers owner notification and then read-only archive) and a site ownership policy requiring two owners. Four hundred abandoned project sites are archived, so their stale content stops appearing in Copilot answers, and 80 ownerless sites get new owners who can then respond to access reviews.',
      takeaway: 'Lifecycle policies reduce the stale, ownerless content that both pollutes Copilot answers and blocks remediation.',
    },
  ],
  keyPoints: [
    'Oversharing tools: SharePoint admin center DAG reports, content management assessment, site access reviews, RAC, RCD and lifecycle policies (SharePoint Advanced Management); Purview DSPM for AI assessments, labels, DLP and retention; Entra access reviews.',
    'DAG snapshot reports: site permissions across the organisation, site permissions for users, sensitivity labels applied to files, items shared via EEEU or Everyone; activity reports (28 days): sharing links and shared with EEEU.',
    'Run DAG reports from Reports > Data access governance as a SharePoint Administrator; start site access reviews from the report; E5 without SAM gets only limited activity reports.',
    'Restricted access control limits site access to up to ten groups and is honoured by search and Copilot; users need both permission and membership.',
    'Restricted content discovery keeps a site out of org-wide search and Copilot without changing permissions; it is temporary and SharePoint-only; Restricted SharePoint Search is retiring.',
    'Other SAM features: block download, Conditional Access authentication contexts, inactive and ownerless site policies, site attestation, catalog management, change history, agent insights.',
    'SAM is included with Microsoft 365 Copilot licences; the remediation cycle is identify, interim restrict, fix, enforce.',
  ],
  flashcards: [
    { front: 'Where are data access governance reports found?', back: 'SharePoint admin center > Reports > Data access governance (SharePoint Administrator role).' },
    { front: 'Which DAG report should you run first to understand your baseline?', back: 'Site permissions across your organization (a snapshot report).' },
    { front: 'How far back do DAG activity reports look?', back: '28 days.' },
    { front: 'What can you launch directly from a DAG report to delegate clean-up?', back: 'A site access review sent to the site owners.' },
    { front: 'What does restricted access control require of a user to open a site?', back: 'Both normal permission to the content and membership of one of the configured control groups (up to ten).' },
    { front: 'Does restricted content discovery change site permissions?', back: 'No. It only removes the site from org-wide search and Copilot; users with access can still open content directly.' },
    { front: 'PowerShell to enable restricted content discovery on a site?', back: 'Set-SPOSite -Identity <url> -RestrictContentOrgWideSearch $true' },
    { front: 'What is happening to Restricted SharePoint Search?', back: 'It is retiring; new enablement is blocked from 31 July 2026 in favour of restricted content discovery and comprehensive controls.' },
    { front: 'Which SAM policy handles sites nobody has touched for months?', back: 'The inactive site policy (notify owners, then archive or set read-only).' },
    { front: 'How does an organisation obtain SharePoint Advanced Management?', back: 'It is included with Microsoft 365 Copilot licences (and E7) or bought as an add-on.' },
  ],
  quiz: [
    {
      question: 'Before rolling out Copilot, you need to identify every SharePoint site where content is accessible to "Everyone except external users". Which report should you run?',
      options: [
        'The Microsoft Copilot readiness report',
        'The Site permissions across your organization data access governance report',
        'The Entra sign-in logs',
        'The Teams usage report',
      ],
      correct: [1],
      explanation:
        'The site permissions snapshot report flags EEEU and other broad access. Readiness reports assess licence eligibility, sign-in logs cover authentication, and Teams usage is adoption data.',
    },
    {
      question: 'The Legal site is under permissions review. Leadership wants it excluded from Copilot responses and organisation-wide search for the next month without changing who can open the documents. What should you do?',
      options: [
        'Enable restricted access control for the site.',
        'Enable restricted content discovery for the site.',
        'Delete the site and restore it later.',
        'Remove the Copilot licence from Legal users.',
      ],
      correct: [1],
      explanation:
        'Restricted content discovery hides content from discovery experiences while permissions stay unchanged. RAC would deny access, deletion is destructive, and removing licences affects users rather than the site.',
    },
    {
      question: 'Only members of the Finance security group may access the Finance site, even if other users were previously granted permissions or received sharing links. Which SharePoint Advanced Management feature meets this requirement?',
      options: ['Restricted content discovery', 'Restricted access control', 'Block download policy', 'Site attestation'],
      correct: [1],
      explanation:
        'RAC enforces group-based access regardless of existing permissions or links. RCD hides without blocking, block download limits downloads only, and attestation asks owners to confirm site details.',
    },
    {
      question: 'Which TWO are SharePoint Advanced Management capabilities? (Select two)',
      options: [
        'Site access reviews initiated from data access governance reports',
        'Creating sensitivity labels',
        'Inactive site policies that notify owners and archive unused sites',
        'Configuring Conditional Access named locations',
      ],
      correct: [0, 2],
      explanation:
        'Site access reviews and inactive site policies are SAM features. Sensitivity labels are created in Purview and named locations in Microsoft Entra.',
    },
    {
      question: 'An organisation has Microsoft 365 E5 but no Microsoft 365 Copilot or SharePoint Advanced Management licences. Which statement about data access governance reports is correct?',
      options: [
        'All snapshot and activity reports are available with remedial actions.',
        'Only activity reports are available, limited to 10,000 sites, after enabling data collection; snapshot reports and remedial actions are not.',
        'No reports are available at all.',
        'Reports are available only through PowerShell.',
      ],
      correct: [1],
      explanation:
        'E5 alone provides a reduced DAG experience. Full snapshots and actions require SAM; the reports are not entirely absent and are not PowerShell-only.',
    },
    {
      question: 'After applying restricted content discovery to an HR site, an administrator considers the oversharing issue closed. What is the MOST important follow-up action?',
      options: [
        'Nothing; RCD permanently secures the site.',
        'Review and fix the site\'s permissions (or apply restricted access control), then remove RCD.',
        'Apply RCD to every site in the tenant.',
        'Disable Copilot for HR users.',
      ],
      correct: [1],
      explanation:
        'RCD is temporary and does not change permissions, so the exposure remains until permissions are fixed. Applying it everywhere degrades Copilot and search, and disabling Copilot does not fix access.',
    },
  ],
  statements: [
    { text: 'Data access governance reports are generated in the Microsoft Purview portal.', isTrue: false, explanation: 'They are in the SharePoint admin center under Reports > Data access governance.' },
    { text: 'Activity reports in data access governance cover the last 28 days of sharing behaviour.', isTrue: true, explanation: 'Sharing links and Shared with EEEU reports are 28-day activity reports.' },
    { text: 'Restricted content discovery removes users\' existing permissions to a site.', isTrue: false, explanation: 'It only hides the site from org-wide search and Copilot; direct access continues.' },
    { text: 'Restricted access control can use up to ten Microsoft 365 or Entra security groups per site.', isTrue: true, explanation: 'The control group list supports up to ten groups.' },
    { text: 'SharePoint Advanced Management is included with Microsoft 365 Copilot licences.', isTrue: true, explanation: 'Copilot (and E7) include SAM; otherwise it is an add-on.' },
    { text: 'Restricted SharePoint Search is Microsoft\'s recommended long-term oversharing control.', isTrue: false, explanation: 'It is a retiring temporary measure; use RCD, RAC, DAG reports and Purview controls instead.' },
    { text: 'A site access review emails site owners to review and prune permissions identified in a DAG report.', isTrue: true, explanation: 'It delegates remediation to the people who know the content.' },
  ],
  resources: [
    { label: 'Data access governance reports for SharePoint sites', url: 'https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports' },
    { label: 'Restrict SharePoint site access with restricted access control', url: 'https://learn.microsoft.com/en-us/sharepoint/restricted-access-control' },
    { label: 'Restricted content discovery', url: 'https://learn.microsoft.com/en-us/sharepoint/restricted-content-discovery' },
    { label: 'SharePoint Advanced Management overview', url: 'https://learn.microsoft.com/en-us/sharepoint/advanced-management' },
  ],
};
