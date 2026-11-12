import type { Concept } from '../../types';

export const tenantConfigurationAndHealth: Concept = {
  id: 'tenant-configuration-and-health',
  title: 'Tenant Configuration, Backup, Network Insights and Service Health',
  summary:
    'The Microsoft 365 admin center settings every administrator owns: organization branding and themes, custom domains and DNS, organization profile and security and privacy settings, Microsoft 365 Backup policies and restores, network connectivity insights, and Service health with email notifications.',
  certs: ['ab-650'],
  domains: ['ab-650-1'],
  outcomes: ['ab-650-1-1-1', 'ab-650-1-1-2', 'ab-650-1-1-3', 'ab-650-1-1-6', 'ab-650-1-1-7', 'ab-650-1-1-8'],
  tags: ['microsoft-365-admin-center', 'branding', 'domains', 'org-settings', 'backup', 'network-connectivity', 'service-health'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Branding, themes and the organization profile',
      body: `Tenant branding lives under **Settings > Org settings > Organization profile > Custom themes** in the Microsoft 365 admin center. You get one **default theme** that applies to everyone and up to **four additional group themes**, each assignable to up to five Microsoft 365 groups. A theme has four tabs:

- **General**: name, group assignment, whether users can override the theme, and whether to show the user's display name.
- **Logos**: a default logo and an alternate logo for dark mode, supplied as an HTTPS URL that allows anonymous access (or an uploaded image under 10 KB for the default theme), plus the on-click link that the logo opens (your intranet, for example).
- **Copilot Chat**: adds a **branded footer** to the Chat screen of the Microsoft 365 Copilot app using the default theme's logo, with an optional label such as *Approved by*, *Provided by* or *Managed by*. This is only available on the default theme and is off by default.
- **Colors**: navigation bar, accent, and text and icon colours.

The **Organization profile** tab also holds the organization information (name, address, technical contact, preferred language), **Release preferences** (Standard or Deferred release for the whole organization or selected users), the custom **Help desk** card, and **Data location**. Security and privacy settings for the tenant (password expiration policy, self-service password reset link, sharing, idle session timeout, privacy profile URL) sit on the **Security & privacy** tab of Org settings.

Exam framing: "add the company logo to the top bar for only the Sales team" means create a *group theme* assigned to the Sales Microsoft 365 group; "show users that Copilot Chat is the company-approved AI" means the Copilot Chat branded footer on the default theme.`,
    },
    {
      heading: 'Domains and DNS',
      body: `Every tenant starts with an *onmicrosoft.com* domain; production email and sign-in use a **custom domain**. Add one under **Settings > Domains > Add domain**. You must hold the **Domain Name Administrator** role (or Global Administrator); the change affects the whole tenant so scoped or custom admins cannot do it.

Two paths exist:

1. **Domain Connect** (recommended). If your registrar supports it, Microsoft 365 confirms ownership and creates the required DNS records for you after you sign in at the registrar.
2. **Manual**. You add a TXT (or MX) record to prove ownership, then add the service records yourself: **MX** for mail routing, **CNAME** *autodiscover* for Outlook, **TXT** for SPF, and the Teams/Skype SRV and CNAME records.

Order matters when migrating mail: add the domain, create the users and mailboxes, and only then switch the MX record so mail flow is not interrupted. The default domain can be changed later; new users then get UPNs on it. Setting the domain's intended services tells the wizard which records to require. You can also set a domain as the default for new Microsoft 365 groups. Removing a domain requires first moving every user, group and email address off it.

Common troubleshooting: "DNS records are incorrect" on the Domains page usually means the registrar still has a stale record; the admin center shows the expected value next to the detected one.`,
    },
    {
      heading: 'Microsoft 365 Backup',
      body: `**Microsoft 365 Backup** protects **SharePoint sites, OneDrive accounts and Exchange Online mailboxes** with backups that stay inside the Microsoft 365 trust boundary and are stored append-only, so ransomware cannot alter old restore points. Set it up from the admin center (**Setup**, or **Settings > Microsoft 365 Backup**) as a **SharePoint Administrator** or Global Administrator:

1. **Turn on pay-as-you-go billing**. Backup is metered per GiB protected per month and billed to an Azure subscription and resource group, configured as a *billing policy* under **Billing > Pay-as-you-go** (new customers after April 2026) with optional budgets and alerts. Restores are free.
2. **Create backup policies** per workload, selecting sites, accounts or mailboxes (by picker, filter or CSV upload) and a **recovery window**: 3 months, 6 months or 1 to 10 whole years for SharePoint and OneDrive, up to 2 years for Exchange.
3. **Restore**. For SharePoint and OneDrive you can roll a whole site or account back to a point in time (10-minute restore points for the last two weeks, weekly thereafter), to the same or a new URL, or restore selected files and folders from the last 14 days. For Exchange you restore mailboxes or individual mail, calendar, contact and task items that were modified or deleted, to the same or a new folder.
4. **Monitor** backup and restore status on the Backup pages; every action is audited.

The exam contrast: **retention policies** keep content for compliance and eDiscovery; **Backup** is for fast business-continuity recovery. **Recycle bins** cover only recent user deletions. Backup is also available through partner apps built on the Microsoft 365 Backup Storage platform.`,
    },
    {
      heading: 'Network connectivity insights and Service health',
      body: `**Health > Network connectivity** shows aggregated network assessment scores for the tenant and for each office location. Insights appear only once locations are known, through one of three options: enable **Windows Location Services** data collection (Wi-Fi devices with OneDrive, locations rounded to the city), add locations with **LAN subnet** information (or import a CSV), or run the **Microsoft 365 network connectivity test** tool from the office. The page then surfaces issues such as backhauled egress, Exchange sample latency, or missing proximity to the Microsoft front door, with recommendations. **Report Reader** can read it; configuring locations requires **Service Support Administrator**. Copilot-specific readiness also expects Microsoft 365 Apps on Current or Monthly Enterprise channel and the Copilot endpoints (including *.cloud.microsoft) allowed through proxies.

**Health > Service health** lists every service with its state, **active issues Microsoft is working on** (incidents and advisories), **issues for your organization to act on**, and 30 days of **issue history**. Each issue has an ID, affected services, issue origin (Microsoft or your environment), status, user impact and an update feed. If an outage is not listed, use **Report an issue**. To be alerted, choose **Customize > Email** and enable *Send me email notifications about service health* with up to **two email addresses per admin**, choosing incidents and/or advisories and the services. You can also subscribe to a single active issue via **Manage notifications for this issue**. **Service Support Administrator** and **Helpdesk Administrator** can view Service health. Planned maintenance and feature changes are *not* on Service health; they are in the **Message center**. The Microsoft 365 Admin mobile app gives push notifications for both.`,
    },
  ],
  examples: [
    {
      title: 'Branding Copilot Chat as the approved assistant',
      description:
        'Contoso wants employees to recognise the work-managed Copilot experience and stop pasting data into consumer chatbots. The admin opens Settings > Org settings > Organization profile > Custom themes, selects the Default theme, confirms a logo is configured on the Logos tab, opens the Copilot Chat tab, selects "Add your brand to Copilot Chat footer area" and picks the "Approved by" footer style. The footer appears for all users; it cannot be targeted to groups.',
      takeaway: 'The Copilot Chat branded footer is a default-theme-only setting that uses the default logo and applies to everyone.',
    },
    {
      title: 'Switching MX too early (a realistic mistake)',
      description:
        'An admin adds contoso.com, lets Domain Connect create all records immediately, and only then starts creating mailboxes. Inbound mail for users who do not yet have a mailbox bounces for a day. The fix is the documented order: verify the domain, create users and mailboxes (or sync them), then add or change the MX record so Microsoft 365 becomes the destination only when every recipient exists.',
      takeaway: 'Create recipients before pointing MX at Microsoft 365; the Domains wizard lets you defer adding the records.',
    },
    {
      title: 'Setting up Microsoft 365 Backup with PowerShell-style checks',
      description:
        'A SharePoint Administrator connects an Azure subscription through a pay-as-you-go billing policy, then creates a SharePoint backup policy with a 1-year recovery window for all finance sites. Two weeks later a ransomware-infected sync client encrypts a site. The admin restores the full site to its state at 09:40 the previous day (a 10-minute restore point), choosing a new URL so the team can compare content before cutting over.',
      language: 'text',
      code: `Admin center path
  Billing > Pay-as-you-go > Billing policies > Add a billing policy
     (Azure subscription, resource group, region, optional budget + alerts)
  Setup > Microsoft 365 Backup > Turn on > Set up policies
     SharePoint: select sites -> recovery window 1 year -> Create policy
  Restore: Microsoft 365 Backup > SharePoint > Restore options
     "Full site" -> pick restore point -> "Restore to a new URL"`,
      takeaway: 'Backup needs a billing policy first; restores can target a new URL to avoid overwriting current content.',
    },
    {
      title: 'Getting alerted about an Exchange incident',
      description:
        'The help desk complains that they only learn about Exchange Online incidents from users. The admin goes to Health > Service health > Customize > Email, enables email notifications, enters the help desk shared mailbox and an on-call address (the two-address limit), selects Incidents, and scopes to Exchange Online, Teams and SharePoint. Planned changes still arrive separately through Message center email digests.',
      takeaway: 'Service health email notifications are per admin, limited to two addresses, and cover incidents and advisories, not planned maintenance.',
    },
  ],
  keyPoints: [
    'Custom themes: one default theme for everyone plus up to four group themes, each assignable to up to five Microsoft 365 groups; the Copilot Chat branded footer is default-theme-only.',
    'Organization profile holds company details, release preferences and data location; Security & privacy holds password expiration, idle session timeout and the privacy profile.',
    'Adding or removing domains requires the Domain Name Administrator (or Global Administrator) role; Domain Connect automates verification and DNS, otherwise add TXT, MX, CNAME and SRV records manually.',
    'Microsoft 365 Backup covers SharePoint, OneDrive and Exchange Online; it needs pay-as-you-go billing to an Azure subscription, uses append-only storage, and offers 10-minute restore points for recent weeks.',
    'Backup recovery windows: 3 months, 6 months or 1 to 10 years for SharePoint and OneDrive, up to 2 years for Exchange; file-level restores only within the last 14 days.',
    'Network connectivity insights appear under Health and need office locations from Windows Location Services, LAN subnets or the connectivity test tool; Report Reader can view, Service Support Administrator configures.',
    'Service health shows incidents and advisories with up to two email addresses per admin for notifications; planned maintenance is in Message center.',
  ],
  flashcards: [
    { front: 'How many themes can a Microsoft 365 tenant have?', back: 'One default theme plus up to four group themes, each assignable to up to five Microsoft 365 groups.' },
    { front: 'Where do you add a branded footer to Copilot Chat?', back: 'Settings > Org settings > Organization profile > Custom themes > Default theme > Copilot Chat tab. It uses the default theme logo and applies to all users.' },
    { front: 'Which role is required to add or remove a custom domain?', back: 'Domain Name Administrator (Global Administrator also works). Custom or scoped roles cannot because the change is tenant-wide.' },
    { front: 'What does Domain Connect do?', back: 'For supporting registrars, it automatically verifies ownership and creates the DNS records Microsoft 365 needs.' },
    { front: 'Which workloads does Microsoft 365 Backup protect?', back: 'SharePoint sites, OneDrive accounts and Exchange Online mailboxes.' },
    { front: 'How is Microsoft 365 Backup billed?', back: 'Pay-as-you-go per GiB protected per month through a billing policy tied to an Azure subscription; restores are free.' },
    { front: 'Which role sets up Microsoft 365 Backup?', back: 'SharePoint Administrator or Global Administrator.' },
    { front: 'Where are network connectivity insights found, and what must exist first?', back: 'Health > Network connectivity; office locations must be known via Windows Location Services, LAN subnet entries or the connectivity test tool.' },
    { front: 'How many email addresses can one admin register for Service health notifications?', back: 'Up to two per admin account, choosing incidents and/or advisories and specific services.' },
    { front: 'Where do planned maintenance and upcoming feature changes appear?', back: 'Message center (filter "Plan for change"), not Service health.' },
    { front: 'Which roles can view Service health besides Global Administrator?', back: 'Service Support Administrator and Helpdesk Administrator, among others.' },
  ],
  quiz: [
    {
      question:
        'You are the administrator for Contoso. Leadership wants the Contoso logo in the Microsoft 365 top navigation bar for all users, and a different logo for the Fabrikam subsidiary, whose users are members of a Microsoft 365 group. What should you do with the LEAST administrative effort?',
      options: [
        'Create two tenants and configure a default theme in each.',
        'Configure the default theme with the Contoso logo and create a group theme assigned to the Fabrikam Microsoft 365 group.',
        'Create a Conditional Access policy that assigns a theme based on group membership.',
        'Deploy the Fabrikam logo through an Intune configuration profile.',
      ],
      correct: [1],
      explanation:
        'Custom themes support a default theme plus up to four group themes assigned to Microsoft 365 groups. Conditional Access and Intune do not control the suite header, and a second tenant is excessive.',
    },
    {
      question: 'A help desk analyst with the Helpdesk Administrator role tries to add the custom domain fabrikam.com and receives an access-denied error. Which role is the MINIMUM needed to add the domain?',
      options: ['Global Reader', 'Domain Name Administrator', 'Exchange Administrator', 'Service Support Administrator'],
      correct: [1],
      explanation:
        'Adding, modifying or removing domains requires the Domain Name Administrator role (or Global Administrator). Exchange Administrator manages mail flow but not tenant domains; Global Reader and Service Support Administrator cannot change domains.',
    },
    {
      question:
        'A ransomware-infected device encrypted thousands of files in a SharePoint site yesterday at 14:00. The site is protected by a Microsoft 365 Backup policy. You need to recover the site to its state at 13:50 without overwriting the current content while the team reviews it. What should you do?',
      options: [
        'Restore each file from the site recycle bin.',
        'Use the Preservation Hold library created by a retention policy to copy files back.',
        'Perform a full site restore from the 13:50 restore point to a new URL.',
        'Run Restore-SPODeletedSite against the site.',
      ],
      correct: [2],
      explanation:
        'Backup provides 10-minute restore points for the last two weeks and can restore a full site to the same or a new URL. Recycle bins do not help with encrypted (modified) files, retention policies are for compliance rather than rollback, and Restore-SPODeletedSite only restores deleted sites.',
    },
    {
      question: 'You open Health > Network connectivity and see no assessment data. Which TWO actions would allow network insights to appear? (Select two)',
      options: [
        'Add office locations with their LAN subnet information under Locations.',
        'Enable Windows Location Services data collection in the Network connectivity settings.',
        'Turn on Microsoft 365 Backup for all OneDrive accounts.',
        'Assign the Reports Reader role to all users.',
      ],
      correct: [0, 1],
      explanation:
        'Insights require known office locations, obtained through LAN subnet entries, Windows Location Services collection, or the connectivity test tool. Backup is unrelated, and Reports Reader only grants read access to data that already exists.',
    },
    {
      question:
        'Your operations team wants an email whenever Microsoft posts an incident affecting Exchange Online or Teams, sent to the shared on-call mailbox and the duty manager. Which configuration meets the requirement?',
      options: [
        'In Service health, select Customize > Email, enable notifications, enter the two addresses and select Incidents for Exchange Online and Teams.',
        'Create a Message center email preference and select the Plan for change category.',
        'Create a Defender alert policy for service incidents.',
        'Subscribe the mailbox to the @MSFT365status feed in Outlook.',
      ],
      correct: [0],
      explanation:
        'Service health supports per-admin email notifications with up to two addresses scoped by issue type and service. Message center covers planned changes, Defender alert policies cover security activity, and the social feed is not a tenant notification mechanism.',
    },
    {
      question: 'A user reports Teams is down, but Service health shows every service healthy. What is the MOST appropriate first action?',
      options: [
        'Open a support case immediately.',
        'Select Report an issue on the Service health page and describe the problem.',
        'Restore the Teams service from Microsoft 365 Backup.',
        'Disable and re-enable the Teams license for the user.',
      ],
      correct: [1],
      explanation:
        'Report an issue lets Microsoft correlate your report with telemetry and other tenants and, if confirmed, post an incident you can track. Backup does not cover Teams service availability, and license toggling or a support case are premature.',
    },
  ],
  statements: [
    { text: 'A Microsoft 365 tenant can have one default theme and up to four group themes.', isTrue: true, explanation: 'Group themes are assigned to up to five Microsoft 365 groups each.' },
    { text: 'The Copilot Chat branded footer can show a different logo to each department.', isTrue: false, explanation: 'The footer is only available on the default theme and applies to all users.' },
    { text: 'Microsoft 365 Backup protects SharePoint, OneDrive and Exchange Online and bills per GiB protected per month.', isTrue: true, explanation: 'Restores are free; billing is through a pay-as-you-go billing policy linked to an Azure subscription.' },
    { text: 'Microsoft 365 Backup can restore individual files from a restore point that is six months old.', isTrue: false, explanation: 'File and folder restores are limited to recovery points within the last 14 days; older points support full site or account restores.' },
    { text: 'Planned maintenance events appear on the Service health page.', isTrue: false, explanation: 'Planned maintenance and feature changes are published in Message center.' },
    { text: 'Each admin can register up to two email addresses for Service health notifications.', isTrue: true, explanation: 'The two-address limit is per admin account.' },
    { text: 'Network connectivity insights work without any location configuration.', isTrue: false, explanation: 'Office locations must be discovered or added before per-location assessments appear.' },
    { text: 'A Domain Name Administrator can add and verify a custom domain.', isTrue: true, explanation: 'This is the least-privileged built-in role for tenant domain changes.' },
  ],
  resources: [
    { label: 'Customize the theme for your organization', url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/setup/customize-your-organization-theme' },
    { label: 'Add a domain to Microsoft 365', url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/setup/add-domain' },
    { label: 'Overview of Microsoft 365 Backup', url: 'https://learn.microsoft.com/en-us/microsoft-365/backup/backup-overview' },
    { label: 'How to check Microsoft 365 service health', url: 'https://learn.microsoft.com/en-us/microsoft-365/enterprise/view-service-health' },
  ],
};
