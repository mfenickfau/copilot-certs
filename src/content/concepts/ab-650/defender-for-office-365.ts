import type { Concept } from '../../types';

export const defenderForOffice365: Concept = {
  id: 'defender-for-office-365',
  title: 'Securing Email and Collaboration with Defender for Office 365',
  summary:
    'Configuring preset and custom threat policies (anti-phishing, Safe Links, Safe Attachments, anti-spam, anti-malware), managing alerts and alert policies in the Microsoft Defender portal, investigating and remediating threats with Threat Explorer, automated investigation and response and the Action center, and running Attack simulation training campaigns.',
  certs: ['ab-650'],
  domains: ['ab-650-2'],
  outcomes: ['ab-650-2-3-1', 'ab-650-2-3-2', 'ab-650-2-3-3', 'ab-650-2-3-4'],
  tags: ['defender-for-office-365', 'preset-security-policies', 'safe-links', 'safe-attachments', 'alerts', 'threat-explorer', 'air', 'attack-simulation-training'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Threat policies: preset first, custom when needed',
      body: `Everything lives in the **Microsoft Defender portal** (security.microsoft.com) under **Email & collaboration > Policies & rules > Threat policies**. **Exchange Online Protection (EOP)** gives every tenant anti-spam, anti-malware, anti-phishing (spoof intelligence) and quarantine. **Defender for Office 365 Plan 1** adds **Safe Attachments** (detonation, including for SharePoint, OneDrive and Teams), **Safe Links** (time-of-click URL rewriting and scanning, including in Teams and Office apps), impersonation protection (user and domain impersonation, mailbox intelligence), and Real-time detections. **Plan 2** (included in Microsoft 365 E5) adds **Threat Explorer**, **automated investigation and response (AIR)**, **Attack simulation training**, **Threat Trackers**, campaign views and advanced hunting.

Microsoft's recommendation is to use **preset security policies**:

- **Built-in protection**: on for everyone by default; basic Safe Links and Safe Attachments with no configurable settings except exclusions.
- **Standard** and **Strict**: toggle on, then choose recipients (users, groups, domains) for the EOP protections and the Defender for Office 365 protections separately, add impersonation protection entries (trusted senders and domains, protected users and domains), and review. Settings are fixed by Microsoft; Strict is more aggressive (quarantine rather than junk, stricter bulk thresholds).

**Custom policies** are for exceptions: a bulk-mail threshold for marketing, a different quarantine policy, or a Safe Links policy that does not rewrite URLs for a partner domain. **Precedence** when a recipient is in several policies: Strict preset, then Standard preset, then Defender for Office 365 evaluation policies, then custom policies by priority order, then default policies, with Built-in protection last. **Quarantine policies** define what users can do with quarantined mail (release, request release, preview) and notifications. **Tenant Allow/Block List** is where you override verdicts for senders, URLs, files and spoofed senders after a false positive or false negative, and **user reported settings** route user submissions to Microsoft and your SOC mailbox. Configuration needs **Security Administrator** (or Organization Management in Exchange Online); **Global Reader** or **Security Reader** can view. PowerShell: *Set-AntiPhishPolicy*, *New-SafeLinksPolicy*, *New-SafeLinksRule*, *Set-AtpPolicyForO365*.`,
    },
    {
      heading: 'Alerts and alert policies',
      body: `Defender for Office 365 raises **alerts** from **alert policies** found under **Email & collaboration > Policies & rules > Alert policy**. Default policies cover malware campaigns after delivery, phishing delivered due to ETR override, suspicious email sending patterns, users restricted from sending, admin submissions, eDiscovery and unusual external file sharing; many default policies **trigger automated investigations**. Custom alert policies choose an activity, conditions, threshold, severity, category and recipients. Managing alert policies requires **Organization Management** or **Security Administrator** (or Defender XDR unified RBAC *Detection tuning (manage)*); **Security Reader** can view alerts.

Alerts appear in **Incidents & alerts > Alerts** and are correlated into **incidents** in Microsoft Defender XDR. For each alert you can view the **alert story**, affected entities (mailboxes, users, messages), set **status** (New, In progress, Resolved), **classification** (True positive, Informational, False positive), **assign** an owner, and link to the investigation. **Alert tuning** rules (Settings > Microsoft Defender XDR > Alert tuning) suppress noisy benign patterns, and Microsoft ships built-in tuning rules; disable the "email reported by user" tuning if you rely on the Security Copilot Phishing Triage Agent. Email notifications for alerts come from the alert policy or from notification rules in Defender XDR. The exam contrast: **alert policies** detect *activity*; **threat policies** decide the *verdict* on messages; **Purview alert policies** cover DLP and compliance events in the Purview portal.`,
    },
    {
      heading: 'Investigate and respond: Explorer, AIR and the Action center',
      body: `**Threat Explorer** (Plan 2; **Real-time detections** in Plan 1) is the hunting console under **Email & collaboration > Explorer**. Views include **All email**, **Malware**, **Phish**, **Campaigns**, **Content malware** (SharePoint, OneDrive, Teams) and **URL clicks**. Filter by sender, recipient, subject, URL, detection technology, delivery action and location (Inbox, Junk, Quarantine, Deleted), pivot to the **email entity page** to see headers, detonation details and the URL and attachment verdicts, and **take action**: **move to Junk**, **move to Deleted Items**, **soft delete**, **hard delete**, **move to Inbox** (false positive), **submit to Microsoft**, **propose remediation**, or **start an automated investigation**. Deleting or moving mail requires the **Search and Purge** role (Data Investigator or Organization Management role groups); previewing or downloading messages needs the **Preview** role. **Zero-hour auto purge (ZAP)** retroactively moves already-delivered mail when a verdict changes.

**Automated investigation and response (AIR)** starts from qualifying alerts (user-reported phish, ZAP, suspicious sending, user clicks on malicious URLs) or manually from Explorer and advanced hunting. The playbook gathers evidence (messages, URLs, similar clusters, affected users), scopes the threat organization-wide and queues **remediation actions** (soft delete email clusters, block URL, turn off external forwarding, reset passwords) in the **Action center** (**Actions & submissions > Action center**) for approval; malicious URL and file clusters are auto-approved. SecOps approves or rejects pending actions and reviews the **History** tab. AIR requires **audit logging** on (default). **Campaigns** group related phishing attempts so you can see delivered versus blocked and act on the whole campaign. **Submissions** (Actions & submissions > Submissions) let admins send email, URLs and files to Microsoft and view user reports, and **Threat analytics** gives intelligence reports.`,
    },
    {
      heading: 'Attack simulation training',
      body: `**Attack simulation training** (Plan 2 / Microsoft 365 E5; **Email & collaboration > Attack simulation training**) runs realistic phishing simulations and assigns training to users who fall for them. Roles: **Attack Simulation Administrator** (full control), **Attack Payload Author** (payloads only), **Security Administrator**, with Security Reader and Security Operator able to view. There are no PowerShell cmdlets; everything is in the portal.

Building a simulation: choose a **social engineering technique** (**Credential Harvest**, **Malware Attachment**, **Link in Attachment**, **Link to Malware**, **Drive-by URL**, **OAuth Consent Grant**, **How-to Guide**), pick or create a **payload** (global built-in payloads or tenant payloads with your branding, phishing login pages and attachments), select **target users** (all, groups, or imported, with filters by city, department or past behaviour such as repeat offenders), assign **training** (Microsoft-curated courses auto-assigned based on the user's actions, with due dates and reminders), pick the **landing page** and **end-user notifications**, then schedule the launch. **Simulation automations** run recurring campaigns with random payloads; **payload automations** harvest real phishing reported by users to create new payloads; **training campaigns** can be assigned without a simulation to meet annual awareness requirements.

Reports show compromised rate, clicks, reporting rate, training completion and **repeat offenders**; the **Microsoft 365 Defender simulation URLs** must be allowed in filters so the simulations are not blocked by Safe Links or third-party gateways. Exam framing: "measure and improve user resilience to phishing" is Attack simulation training; "block phishing" is preset security policies; "find already-delivered phishing" is Explorer and AIR.`,
    },
  ],
  examples: [
    {
      title: 'Standard for everyone, Strict for executives',
      description:
        'Contoso has no custom mail hygiene configuration beyond defaults. The admin turns on the Standard preset security policy for all recipients and the Strict preset for the Executives group, adding the CEO and CFO as protected users for impersonation protection and the finance partner domain as a trusted domain. Because Strict has higher precedence, executives get the stricter settings even though they also match Standard.',
      takeaway: 'Preset policies are Microsoft\'s recommended baseline; Strict beats Standard beats custom in precedence.',
    },
    {
      title: 'Remediating a phishing campaign that was delivered',
      description:
        'A user reports a phishing email asking for payroll changes. In Threat Explorer the SOC filters on the subject and sender domain, finds 140 recipients, 30 of whom clicked, and selects all messages to soft delete them, then starts an automated investigation. AIR identifies the URL cluster and queues a block URL action plus password resets for the clickers in the Action center, which an analyst approves. The sender domain is added to the Tenant Allow/Block List as blocked.',
      language: 'powershell',
      code: `# Equivalent hunting from Exchange Online PowerShell (last 2 days, 10-day max for message trace)
Get-MessageTraceV2 -StartDate (Get-Date).AddDays(-2) -EndDate (Get-Date) \`
  -SenderAddress "payroll@c0ntoso-hr.example" | Select Received, RecipientAddress, Subject, Status

# Block the sender domain
New-TenantAllowBlockListItems -ListType Sender -Block -Entries "c0ntoso-hr.example" -NoExpiration`,
      takeaway: 'Explorer finds and removes delivered mail; AIR scopes and remediates; the Tenant Allow/Block List prevents repeats.',
    },
    {
      title: 'Safe Links policy that excluded everything (a realistic mistake)',
      description:
        'To stop Safe Links from rewriting URLs to an internal HR portal, an admin added "*" to the "Do not rewrite the following URLs" list in a custom Safe Links policy. Time-of-click protection silently stopped for every link. The fix is to remove the wildcard and add only the specific portal URL pattern, or better, keep Safe Links in the Standard preset and manage the exception with a narrow custom policy at lower precedence.',
      takeaway: 'Exceptions in threat policies should be as narrow as possible; broad exclusions remove protection without warning.',
    },
    {
      title: 'Quarterly phishing simulation with automatic training',
      description:
        'Security wants recurring phishing tests with training only for those who fall for them. The Attack Simulation Administrator creates a simulation automation using the Credential Harvest technique with randomised global payloads, targets all users except executives (who get a separate campaign), sets Microsoft training assignment to be based on user behaviour with a 30-day due date, and schedules it to run monthly. The repeat offenders report drives targeted coaching.',
      takeaway: 'Simulation automations plus behaviour-based training assignment deliver continuous awareness with minimal admin effort.',
    },
  ],
  keyPoints: [
    'EOP provides anti-spam, anti-malware and anti-phishing; Defender for Office 365 Plan 1 adds Safe Links, Safe Attachments and impersonation protection; Plan 2 adds Threat Explorer, AIR, Attack simulation training and campaigns.',
    'Use preset security policies (Built-in protection, Standard, Strict); precedence is Strict, Standard, evaluation policies, custom, default, Built-in protection.',
    'Alert policies under Email & collaboration > Policies & rules generate alerts that correlate into Defender XDR incidents; Security Administrator manages, Security Reader views; alert tuning suppresses benign noise.',
    'Threat Explorer (Plan 2) or Real-time detections (Plan 1) hunts and remediates email; moving or deleting messages needs the Search and Purge role, previewing needs the Preview role.',
    'AIR investigates qualifying alerts and queues remediation in the Action center for approval; malicious URL and file clusters are auto-approved; audit logging must be on.',
    'Tenant Allow/Block List overrides verdicts for senders, URLs, files and spoof; submissions send items to Microsoft and surface user reports.',
    'Attack simulation training (Plan 2) uses techniques, payloads, target groups, training assignment, landing pages and automations; roles are Attack Simulation Administrator and Attack Payload Author; no PowerShell.',
  ],
  flashcards: [
    { front: 'Which Defender for Office 365 plan includes Threat Explorer and automated investigation and response?', back: 'Plan 2 (included in Microsoft 365 E5). Plan 1 has Real-time detections.' },
    { front: 'Name the three preset security policies.', back: 'Built-in protection, Standard and Strict.' },
    { front: 'If a user is in both Standard and Strict preset policies, which applies?', back: 'Strict, because it has the highest precedence.' },
    { front: 'Where do you override a false-positive sender or URL verdict?', back: 'Tenant Allow/Block List under Policies & rules > Threat policies.' },
    { front: 'What does Safe Links do?', back: 'Rewrites and scans URLs at time of click in email, Teams and Office apps.' },
    { front: 'Where do Defender for Office 365 alert policies live?', back: 'Microsoft Defender portal > Email & collaboration > Policies & rules > Alert policy.' },
    { front: 'Which role is required to delete messages from mailboxes in Threat Explorer?', back: 'Search and Purge (Data Investigator or Organization Management role groups).' },
    { front: 'Where do AIR remediation actions wait for approval?', back: 'The Action center (Actions & submissions > Action center), Pending tab.' },
    { front: 'What is ZAP?', back: 'Zero-hour auto purge: retroactively moves delivered messages when their verdict changes to malware, phish or spam.' },
    { front: 'Which licence is needed for Attack simulation training?', back: 'Microsoft 365 E5 or Defender for Office 365 Plan 2.' },
    { front: 'List four social engineering techniques available in Attack simulation training.', back: 'Credential Harvest, Malware Attachment, Link in Attachment, Link to Malware (also Drive-by URL, OAuth Consent Grant, How-to Guide).' },
    { front: 'Which role can create payloads but not launch simulations?', back: 'Attack Payload Author.' },
  ],
  quiz: [
    {
      question:
        'Contoso has Microsoft 365 E5 and only default protection. Security asks you to apply Microsoft\'s recommended anti-phishing, Safe Links and Safe Attachments settings to all users with the LEAST administrative effort. What should you do?',
      options: [
        'Create custom anti-phishing, Safe Links and Safe Attachments policies for all recipients.',
        'Turn on the Standard preset security policy and include all recipients.',
        'Enable security defaults in Microsoft Entra.',
        'Create a mail flow rule that quarantines messages with attachments.',
      ],
      correct: [1],
      explanation:
        'Preset security policies apply Microsoft\'s recommended settings in one step. Custom policies take more effort, security defaults are an identity control, and mail flow rules are not threat protection.',
    },
    {
      question:
        'A phishing message was delivered to 200 mailboxes before detection. You need to remove it from all mailboxes and find out who clicked the link. Which tool should you use?',
      options: ['Threat Explorer', 'Attack simulation training', 'Microsoft Purview eDiscovery', 'Exchange mail flow rules'],
      correct: [0],
      explanation:
        'Explorer shows delivered messages and URL clicks and supports bulk remediation actions. Attack simulation trains users, eDiscovery is for legal search, and mail flow rules act on future mail only.',
    },
    {
      question:
        'An analyst can see phishing messages in Threat Explorer but the Delete option is unavailable. Which role should be assigned to allow deletion?',
      options: ['Security Reader', 'Search and Purge', 'Reports Reader', 'Attack Payload Author'],
      correct: [1],
      explanation:
        'Moving or deleting messages requires the Search and Purge role, included in the Data Investigator and Organization Management role groups. The other roles are read-only or unrelated.',
    },
    {
      question: 'Which TWO events can start an automated investigation in Defender for Office 365 Plan 2? (Select two)',
      options: [
        'A user reports a message as phishing.',
        'An analyst selects Take action > Trigger investigation in Threat Explorer.',
        'A user changes their password through SSPR.',
        'A sensitivity label is applied to a document.',
      ],
      correct: [0, 1],
      explanation:
        'User submissions and manual triggers from Explorer both start AIR, as do ZAP and URL click alerts. Password changes and labelling are identity and Purview events.',
    },
    {
      question:
        'You need to run monthly phishing simulations that automatically assign training only to users who enter credentials on the fake page. Which feature should you configure?',
      options: [
        'A simulation automation in Attack simulation training with behaviour-based training assignment.',
        'A Safe Links policy with user notifications.',
        'A Purview communication compliance policy.',
        'An alert policy for suspicious email sending patterns.',
      ],
      correct: [0],
      explanation:
        'Simulation automations run recurring campaigns and training can be assigned according to user actions. Safe Links, communication compliance and alert policies do not simulate attacks or assign training.',
    },
    {
      question:
        'After enabling the Strict preset policy, legitimate newsletters from a partner are quarantined. You need to allow them without weakening protection for other senders. What should you do?',
      options: [
        'Turn off the Strict preset policy.',
        'Add the partner sender or domain to the Tenant Allow/Block List as allowed via an admin submission.',
        'Create a mail flow rule that bypasses all spam filtering for all external mail.',
        'Move the partner to the Built-in protection policy.',
      ],
      correct: [1],
      explanation:
        'Allow entries created through admin submissions override the false-positive verdict for that sender only. Disabling Strict or bypassing filtering for all external mail weakens protection broadly, and Built-in protection has no spam settings.',
    },
  ],
  statements: [
    { text: 'Safe Attachments can protect files in SharePoint, OneDrive and Teams, not just email.', isTrue: true, explanation: 'Safe Attachments for SharePoint, OneDrive and Microsoft Teams is enabled in the global settings.' },
    { text: 'Settings inside the Standard and Strict preset policies can be customised per tenant.', isTrue: false, explanation: 'Preset settings are fixed by Microsoft; use custom policies for exceptions.' },
    { text: 'Real-time detections is available in Defender for Office 365 Plan 1 and Threat Explorer in Plan 2.', isTrue: true, explanation: 'Explorer adds more views, filters, saved queries and actions.' },
    { text: 'Automated investigation and response automatically executes every remediation without analyst approval.', isTrue: false, explanation: 'Most actions wait in the Action center; only malicious URL and file clusters are auto-approved.' },
    { text: 'Attack simulation training can be configured through Exchange Online PowerShell cmdlets.', isTrue: false, explanation: 'There are no PowerShell cmdlets; it is portal-only.' },
    { text: 'Alert policies in the Defender portal require Security Administrator or Organization Management to manage.', isTrue: true, explanation: 'Security Reader can view alerts but not change policies.' },
    { text: 'Zero-hour auto purge can move an already-delivered message to quarantine when Microsoft updates its verdict.', isTrue: true, explanation: 'ZAP acts retroactively on malware, phish and spam.' },
    { text: 'Attack Payload Author can launch simulations.', isTrue: false, explanation: 'Payload Authors create payloads only; launching requires Attack Simulation Administrator or Security Administrator.' },
  ],
  resources: [
    { label: 'Preset security policies in EOP and Microsoft Defender for Office 365', url: 'https://learn.microsoft.com/en-us/defender-office-365/preset-security-policies' },
    { label: 'Threat Explorer and Real-time detections', url: 'https://learn.microsoft.com/en-us/defender-office-365/threat-explorer-real-time-detections-about' },
    { label: 'Automated investigation and response (AIR) in Defender for Office 365', url: 'https://learn.microsoft.com/en-us/defender-office-365/air-about' },
    { label: 'Get started using Attack simulation training', url: 'https://learn.microsoft.com/en-us/defender-office-365/attack-simulation-training-get-started' },
  ],
};
