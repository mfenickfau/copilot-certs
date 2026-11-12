import type { Concept } from '../../types';

export const sharepointOnedriveForCopilot: Concept = {
  id: 'sharepoint-onedrive-for-copilot',
  title: 'SharePoint, OneDrive and Oversharing Readiness for Copilot',
  summary:
    'Creating and securing SharePoint sites, then using SharePoint Advanced Management (data access governance reports, site access reviews, restricted access control, restricted content discovery), Restricted SharePoint Search and Microsoft Search settings to find and fix oversharing before Copilot and agents make it discoverable.',
  certs: ['ab-650', 'ab-900'],
  domains: ['ab-650-1', 'ab-650-3', 'ab-900-2'],
  outcomes: ['ab-650-1-2-4', 'ab-650-1-2-5', 'ab-650-3-1-2', 'ab-900-2-4-1', 'ab-900-2-4-3'],
  tags: ['sharepoint', 'onedrive', 'oversharing', 'sharepoint-advanced-management', 'restricted-content-discovery', 'restricted-access-control', 'data-access-governance', 'microsoft-search', 'powershell'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Sites and permissions',
      body: `Sites are created in the **SharePoint admin center > Sites > Active sites > Create** as a **Team site** (Microsoft 365 group-connected), a **Communication site**, or from templates; a team created in Teams also creates a site. Each site has **site admins** (the group owners for group-connected sites), and three default SharePoint groups: **Owners** (Full Control), **Members** (Edit) and **Visitors** (Read). Permissions inherit from the site to libraries, folders and files unless broken. Sharing links add another layer: **Anyone**, **People in your organization**, **People with existing access** and **Specific people**; the tenant and each site set the most permissive link type allowed, and Anyone links can have expiry and view-only defaults.

The oversharing patterns Copilot exposes come from a handful of configurations:

- **Everyone except external users (EEEU)** or "Everyone" granted on a site or library.
- Default **People in your organization** links created in bulk.
- Public Microsoft 365 groups and teams.
- Sites that grant **thousands of users** access via large security groups.

Admin tools: **Site permissions** in the admin center, **Set-SPOSite** and **Set-SPOTenant** in SharePoint Online Management Shell, sharing settings under **Policies > Sharing**, and **sensitivity labels on sites** (privacy, external sharing and unmanaged-device access). For OneDrive, the admin can restrict who can access or share from OneDrive with security groups and can restrict access to a specific user's OneDrive.`,
    },
    {
      heading: 'SharePoint Advanced Management (SAM)',
      body: `**SharePoint Advanced Management** is an add-on that is **included with a Microsoft 365 Copilot licence** and is Microsoft's primary oversharing toolkit, run from the SharePoint admin center. Key capabilities:

- **Data access governance (DAG) reports** (Reports > Data access governance): *snapshot* reports for **site permissions across the organization** (sites with the broadest access, EEEU, thousands of users, external guests), **site permissions for a given user**, and **sensitivity labels applied to files**; *activity* reports for **sharing links** created and content **shared with EEEU** in the last 28 days. Reports can be generated with PowerShell and produce **AI insights** with recommended actions. E5 tenants without SAM get a limited version.
- **Site access reviews**: delegate review of an overshared site to its owners straight from a DAG report (up to 100 sites from the UI, more via PowerShell, 1,000 per month from the permissions report). Owners get a tailored email and a review page where they can remove EEEU or sharing links.
- **Restricted access control (RAC)**: limit access to a site or OneDrive to up to 10 Microsoft 365 or Entra security groups; users outside the group lose access even with direct permissions or links, and Copilot and search honour it. Enable tenant-wide first (*Set-SPOTenant -EnableRestrictedAccessControl $true*), optionally delegate to site admins.
- **Restricted content discovery (RCD)**: a site-level flag (*Set-SPOSite -RestrictContentOrgWideSearch $true*, or the **Restrict content from Microsoft 365 Copilot** toggle on the site Settings tab) that removes the site from organization-wide search and Copilot responses and hides AI entry points, **without changing permissions**. Use it as a temporary measure for high-risk sites under review; overuse degrades Copilot quality. Not supported for OneDrive.
- **Content management assessment**, **site lifecycle** (inactive sites, ownerless sites, site attestations), **block download** policies, **Conditional Access authentication contexts** for sites, **change history** and **agent access insights** showing which agents touch which sites.`,
    },
    {
      heading: 'Restricted SharePoint Search, Microsoft Search and the Copilot search surface',
      body: `**Restricted SharePoint Search (RSS)** is the older, tenant-wide allow list: when on, organization-wide search and Copilot only surface content from up to **100 curated sites** (hub sites count once and bring their associated sites) plus the user's own OneDrive, mail, chats, files they recently touched or that were shared with them (last 2,000 items). It is off by default, is **not a security boundary**, degrades search for everyone, and Microsoft is **retiring it: new enablement is blocked from 31 July 2026**. The recommended path is RCD plus SAM and Purview, then turning RSS off.

**Microsoft Search** settings live in the Microsoft 365 admin center under **Settings > Search & intelligence**: **Search admin** and **Search editor** roles, curated answers (**bookmarks, acronyms, Q&A, locations, floor plans**), **Copilot connectors** to index external systems, and **item insights** controls. The same bookmarks and acronyms feed **Microsoft 365 Copilot Search**, so no extra curation is needed. Copilot and Copilot Search respect site permissions, RAC and RCD, and surface **Copilot connector** content according to the connector's access-control lists.

**Site exclusions** in exam language usually refer to RCD (exclude a site from Copilot and org-wide discovery) rather than deleting search index entries; the classic search schema **NoCrawl** on a library hides it from all search, including Copilot, but is a crawl setting rather than a governance control.`,
    },
    {
      heading: 'The readiness workflow for data leaks, oversharing and compliance',
      body: `Microsoft's **Secure and governed data foundation blueprint** sequences the work as *remediate oversharing*, *set up guardrails*, *meet regulations*. The practical order for an AB-650 scenario:

1. **Discover**: run the DAG site permissions snapshot and the EEEU and sharing-links activity reports; check the **Purview DSPM for AI** weekly data risk assessment of the top 100 sites; review the SAM content management assessment.
2. **Contain**: apply **RCD** to high-risk sites while owners review; apply **RAC** where a site should only ever be reachable by a defined group; set sharing defaults to *Specific people* and expire Anyone links.
3. **Remediate**: initiate **site access reviews** so owners remove EEEU and broad links; fix public teams that should be private; archive or delete inactive sites with site lifecycle policies.
4. **Protect**: label sites and files with **sensitivity labels** (auto-labelling where licensed), use **DLP for Copilot** to block labelled content from being summarised, and keep **audit** on so prompts, responses and accessed files are logged.
5. **Verify and release**: remove RCD and any Restricted SharePoint Search once reviews finish; monitor DAG reports and DSPM for AI on a schedule.

Compliance readiness additionally means **retention policies** that cover Copilot interactions, **eDiscovery** readiness, and **Compliance Manager** AI regulation assessments. Remember the two things that are *not* fixes: turning Copilot off tenant-wide, and relying on RSS indefinitely.`,
    },
  ],
  examples: [
    {
      title: 'Hiding a sensitive site from Copilot while owners review it',
      description:
        'A DAG report shows the Mergers site is shared with Everyone except external users. Legal needs a week to clean it up, and leadership wants Copilot to stop surfacing its documents immediately. The admin enables restricted content discovery on the site, which removes it from Copilot responses and org-wide search without touching permissions, then initiates a site access review so the owners remove EEEU. Once finished, RCD is removed.',
      language: 'powershell',
      code: `Connect-SPOService -Url https://contoso-admin.sharepoint.com

# Temporarily exclude the site from Copilot and org-wide search (permissions unchanged)
Set-SPOSite -Identity https://contoso.sharepoint.com/sites/Mergers -RestrictContentOrgWideSearch $true
Get-SPOSite -Identity https://contoso.sharepoint.com/sites/Mergers | Select RestrictContentOrgWideSearch

# Later, after the owners finish their review
Set-SPOSite -Identity https://contoso.sharepoint.com/sites/Mergers -RestrictContentOrgWideSearch $false`,
      takeaway: 'RCD is the fast, reversible containment step; the real fix is removing the broad permission.',
    },
    {
      title: 'Locking a site to one group with restricted access control',
      description:
        'The Executive Board site must only ever be reachable by members of the Board security group, regardless of links or direct permissions. The admin enables RAC for the tenant, waits up to an hour, then applies the control group to the site. Users outside the group lose access and no longer see the content in search or Copilot.',
      language: 'powershell',
      code: `Set-SPOTenant -EnableRestrictedAccessControl $true   # tenant-level switch, may take up to 1 hour

Set-SPOSite -Identity https://contoso.sharepoint.com/sites/Board \`
  -RestrictedAccessControl $true \`
  -AddRestrictedAccessControlGroups "<BoardSecurityGroupObjectId>"`,
      takeaway: 'RAC is a hard boundary (members must have both group membership and site permission); RCD only affects discovery.',
    },
    {
      title: 'Leaving Restricted SharePoint Search on for a year (a realistic mistake)',
      description:
        'Fabrikam turned on Restricted SharePoint Search at Copilot launch with 60 allowed sites and never revisited it. A year later users complain that search misses obvious documents and Copilot gives thin answers. The admin realises RSS limits all organization-wide search, is capped at 100 sites and is being retired. The fix is to run DAG reports and site access reviews, apply RCD to the few sites still at risk, label sensitive content, then disable RSS and notify agent owners that responses will change.',
      takeaway: 'Restricted SharePoint Search is a temporary bridge, not a governance strategy; migrate to RCD, SAM and Purview.',
    },
    {
      title: 'Oversharing baseline report with PowerShell and a site access review',
      description:
        'The SharePoint Administrator generates the site permissions snapshot report, exports the sites with more than 5,000 users, and initiates site access reviews for the top offenders so each owner confirms or removes broad access. Progress is tracked on the My review requests tab.',
      language: 'powershell',
      code: `# Generate the DAG "site permissions" snapshot (SharePoint Advanced Management)
Start-SPODataAccessGovernanceInsight -ReportEntity PermissionedUsers -Workload SharePoint -ReportType Snapshot -Name "Broad-Access-Baseline"
Get-SPODataAccessGovernanceInsight -ReportEntity PermissionedUsers | Select Name, Status, ReportId`,
      takeaway: 'DAG snapshot reports give the baseline; activity reports catch new oversharing within 28 days.',
    },
  ],
  keyPoints: [
    'Sites are created in the SharePoint admin center (team, communication, templates); permissions flow through Owners/Members/Visitors groups, inheritance and sharing links (Anyone, People in your organization, Existing access, Specific people).',
    'SharePoint Advanced Management is included with a Microsoft 365 Copilot licence and provides DAG reports, site access reviews, restricted access control, restricted content discovery, site lifecycle and agent insights.',
    'Restricted content discovery excludes a site from Copilot and org-wide search without changing permissions; it is site-level, temporary by design, and not supported for OneDrive.',
    'Restricted access control limits a site or OneDrive to up to 10 groups and is honoured by Copilot and search; users need both group membership and site permission.',
    'Restricted SharePoint Search is a 100-site allow list, not a security boundary, degrades search tenant-wide and is being retired (new enablement blocked from 31 July 2026).',
    'Microsoft Search settings (Settings > Search & intelligence) hold bookmarks, acronyms and connectors that also power Microsoft 365 Copilot Search.',
    'Readiness workflow: discover (DAG, DSPM for AI), contain (RCD, RAC, sharing defaults), remediate (site access reviews), protect (labels, DLP, audit), verify and release.',
    'Turning off Copilot or keeping RSS on indefinitely are not remediation; fixing permissions is.',
  ],
  flashcards: [
    { front: 'Which licence includes SharePoint Advanced Management?', back: 'Microsoft 365 Copilot (it is also sold as an add-on).' },
    { front: 'What does restricted content discovery change about a site\'s permissions?', back: 'Nothing. It only removes the site from org-wide search and Copilot responses and hides AI entry points.' },
    { front: 'Which PowerShell parameter enables restricted content discovery on a site?', back: 'Set-SPOSite -RestrictContentOrgWideSearch $true' },
    { front: 'How many groups can be used as a restricted access control group for a site?', back: 'Up to 10 Microsoft 365 groups or Microsoft Entra security groups.' },
    { front: 'What must be done before applying restricted access control to any site?', back: 'Enable it for the tenant: Set-SPOTenant -EnableRestrictedAccessControl $true (allow up to an hour).' },
    { front: 'How many sites can Restricted SharePoint Search allow?', back: 'Up to 100 sites; hub sites count once and bring their associated sites.' },
    { front: 'Is Restricted SharePoint Search a security boundary?', back: 'No. It does not change permissions and users still see content they own or recently accessed; it is being retired.' },
    { front: 'Name the two DAG activity reports.', back: 'Sharing links created, and content shared with Everyone except external users (both over the last 28 days).' },
    { front: 'What does a site access review do?', back: 'Delegates review of an overshared site (from a DAG report) to its owners, who get a tailored email and a review page to remove broad access.' },
    { front: 'Where are Microsoft Search bookmarks and acronyms managed?', back: 'Microsoft 365 admin center > Settings > Search & intelligence (Search admin or Search editor roles); they also feed Copilot Search.' },
    { front: 'Does restricted content discovery work for OneDrive?', back: 'No, it applies to SharePoint sites only.' },
  ],
  quiz: [
    {
      question:
        'After enabling Copilot, HR discovers that salary spreadsheets on the HR site appear in Copilot answers for all staff because the site is shared with Everyone except external users. HR needs two weeks to fix permissions. What should you do FIRST to stop Copilot surfacing the content without changing access?',
      options: [
        'Delete the HR site and restore it later.',
        'Turn on restricted content discovery for the HR site.',
        'Disable Microsoft 365 Copilot for all users.',
        'Apply restricted access control to every site in the tenant.',
      ],
      correct: [1],
      explanation:
        'RCD removes a site from Copilot and org-wide search immediately without changing permissions, which is the stated requirement. Deleting the site or disabling Copilot is disproportionate, and RAC changes access rather than discovery.',
    },
    {
      question:
        'You need to ensure that only members of the Finance-Leads security group can open content in the Finance Planning site, even if a document was previously shared with a specific external-facing link. Which SharePoint Advanced Management feature should you use?',
      options: ['Restricted content discovery', 'Restricted access control', 'Restricted SharePoint Search', 'Site access review'],
      correct: [1],
      explanation:
        'Restricted access control enforces that only members of up to 10 control groups can access the site regardless of prior links or permissions. RCD and RSS affect discoverability only, and a site access review asks owners to fix permissions manually.',
    },
    {
      question: 'Which TWO statements about Restricted SharePoint Search are correct? (Select two)',
      options: [
        'It limits organization-wide search and Copilot to an allow list of up to 100 sites.',
        'It permanently changes site permissions for sites not on the list.',
        'It is intended as a temporary measure and new enablement is blocked from July 2026.',
        'It applies only to OneDrive accounts.',
      ],
      correct: [0, 2],
      explanation:
        'RSS is a 100-site allow list designed as a stopgap and is being retired. It never changes permissions and it concerns SharePoint sites, not OneDrive.',
    },
    {
      question:
        'You want site owners, not IT, to review and remove broad sharing on the 80 sites flagged in the "Shared with Everyone except external users" report. Which action requires the LEAST administrative effort?',
      options: [
        'Email each owner a screenshot of the report.',
        'Initiate site access reviews for the selected sites from the data access governance report.',
        'Remove the Everyone except external users claim from every site yourself with PowerShell.',
        'Apply a sensitivity label that blocks external sharing.',
      ],
      correct: [1],
      explanation:
        'Site access reviews can be initiated for up to 100 sites from the report UI and send owners a tailored review page. Manual emails and admin-side removal do not delegate, and a label that blocks external sharing does not address internal EEEU exposure.',
    },
    {
      question:
        'Users complain that Microsoft 365 Copilot does not define internal acronyms such as "QBR" the way the intranet does. Where should you configure authoritative acronym answers?',
      options: [
        'Microsoft 365 admin center > Settings > Search & intelligence (or Copilot > Search) > Acronyms',
        'SharePoint admin center > Policies > Sharing',
        'Microsoft Purview portal > Data Loss Prevention',
        'Teams admin center > Meeting policies',
      ],
      correct: [0],
      explanation:
        'Acronyms and bookmarks curated for Microsoft Search are reused by Copilot Search. Sharing policies, DLP and meeting policies do not affect search answers.',
    },
    {
      question:
        'Which report identifies SharePoint sites where users created the most sharing links in the last 28 days?',
      options: [
        'Data access governance sharing links activity report',
        'Microsoft 365 Copilot readiness report',
        'Site permissions for a given user snapshot report',
        'Service health issue history',
      ],
      correct: [0],
      explanation:
        'The sharing links activity report tracks recent link creation. The readiness report concerns licences and app usage, the per-user permissions report lists one user\'s sites, and Service health is unrelated.',
    },
  ],
  statements: [
    { text: 'SharePoint Advanced Management is included with a Microsoft 365 Copilot licence.', isTrue: true, explanation: 'It can also be purchased as an add-on.' },
    { text: 'Restricted content discovery removes a site\'s content from the search index.', isTrue: false, explanation: 'Content stays indexed; the site is excluded from org-wide discovery and Copilot responses while permissions are unchanged.' },
    { text: 'Restricted access control applies to OneDrive as well as SharePoint sites.', isTrue: true, explanation: 'Both can be restricted to security groups or Microsoft 365 groups.' },
    { text: 'Restricted SharePoint Search is Microsoft\'s recommended long-term oversharing control.', isTrue: false, explanation: 'It is a temporary measure being retired; RCD, SAM and Purview are recommended.' },
    { text: 'Data access governance snapshot reports show sites with the broadest permissions across the organization.', isTrue: true, explanation: 'The site permissions snapshot is the recommended starting report.' },
    { text: 'A site access review can be sent to owners of up to 100 sites at once from the admin center UI.', isTrue: true, explanation: 'Larger batches use PowerShell; the permissions report allows 1,000 reviews per month.' },
    { text: 'Private channel sites inherit restricted access control from their parent team site.', isTrue: false, explanation: 'Shared and private channel sites are separate site collections and must be configured separately.' },
    { text: 'Microsoft Search acronyms must be re-created separately for Copilot Search.', isTrue: false, explanation: 'Existing bookmarks and acronyms are reused by Copilot Search.' },
  ],
  resources: [
    { label: 'SharePoint Advanced Management overview', url: 'https://learn.microsoft.com/en-us/sharepoint/advanced-management' },
    { label: 'Restrict discovery of SharePoint sites and content (restricted content discovery)', url: 'https://learn.microsoft.com/en-us/sharepoint/restricted-content-discovery' },
    { label: 'Data access governance reports for SharePoint sites', url: 'https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports' },
    { label: 'Restricted SharePoint Search', url: 'https://learn.microsoft.com/en-us/sharepoint/restricted-sharepoint-search' },
  ],
};
