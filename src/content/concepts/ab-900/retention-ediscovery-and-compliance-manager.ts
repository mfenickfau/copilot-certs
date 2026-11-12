import type { Concept } from '../../types';

export const retentionEdiscoveryAndComplianceManager: Concept = {
  id: 'retention-ediscovery-and-compliance-manager',
  title: 'Retention, eDiscovery Content Search and Compliance Manager',
  summary:
    'How retention policies and retention labels keep or delete content in place (including Copilot prompts and responses), how to search mailboxes and sites with Content search in Purview eDiscovery, and how Compliance Manager turns regulations into a score and a to-do list.',
  certs: ['ab-900'],
  domains: ['ab-900-2'],
  outcomes: ['ab-900-2-1-4', 'ab-900-2-3-8', 'ab-900-2-3-1'],
  tags: ['retention', 'data-lifecycle-management', 'ediscovery', 'content-search', 'compliance-manager', 'purview'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Retention: keep what you must, delete what you should',
      body: `**Microsoft Purview Data Lifecycle Management** retains content you are required to keep and deletes content you no longer need, which both satisfies regulators and shrinks the attack surface (and the amount of stale material Copilot can surface). Retention settings produce one of three outcomes: **retain only**, **delete only**, or **retain and then delete** (for example keep mail for seven years, then purge).

Retention works **in place**. Users keep working normally; if they edit or delete an item under retention, a copy is preserved in a hidden location: the **Preservation Hold library** for SharePoint and OneDrive, **Recoverable Items** for Exchange, and the **SubstrateHolds** folder for Teams, Viva Engage and **Copilot and AI app** messages. When the period ends the item is permanently deleted on a timer job.

Two tools assign retention settings:

- **Retention policies** apply the same setting to whole **locations**: Exchange mailboxes, SharePoint and OneDrive sites, Microsoft 365 group mailboxes and sites, Teams chats and channel messages, and the newer **Microsoft Copilot experiences**, **Enterprise AI apps** and **Other AI apps** locations. Scope to all instances or specific users and sites. Policies do not travel with content that is moved.
- **Retention labels** apply at the **item** level (a document or email), travel with the item inside the tenant, can start the clock from an event or the labelling date, support **disposition review** before deletion, can mark items as **records**, and can be published for users or auto-applied by classification.

When several policies or holds apply, the **principles of retention** resolve conflicts: retention wins over deletion, the longest retention period wins, explicit (label) beats implicit (policy), and the shortest deletion period wins when only deletions apply. Copilot prompts and responses are stored in the user's mailbox, so a retention policy on the Copilot experiences location is how an organisation decides how long AI conversations are kept.`,
    },
    {
      heading: 'Content search in Microsoft Purview eDiscovery',
      body: `**Microsoft Purview eDiscovery** identifies, preserves, collects, reviews and exports electronic information for legal, regulatory and HR investigations. The classic Content search, eDiscovery (Standard) and eDiscovery (Premium) experiences were retired in August 2025 and replaced by a single **unified eDiscovery** experience in the Purview portal, where searches live inside **cases**. A default **Content search** case exists for quick, ad-hoc searches that do not need a formal matter, and premium features (custodians, legal hold notifications, review sets, analytics) light up with E5 licensing.

Running a search:

1. **Name** the search inside a case.
2. Choose **data sources**: Exchange mailboxes (including group, team and Viva Engage mailboxes), SharePoint and OneDrive sites, public folders, or everything. Copilot and Copilot Chat prompts and responses are stored in the user's mailbox, so selecting a mailbox and adding the condition *Type contains Copilot activity* returns AI interactions.
3. Build the **query** with keywords (KQL, with AND, OR, NOT, NEAR) and **conditions** such as date, sender, file type or **sensitivity label**.
4. Review **statistics** (locations and item counts), **preview** results, then **export** to a local computer or add to a review set.

Permissions: membership of the **eDiscovery Manager** role group (or a custom role group with the Compliance Search role) is required; an eDiscovery Administrator can see every case. Searches can also drive **holds** to prevent deletion during litigation and, in the premium workflow, **purge** actions for data spills.

Exam angle: "find all emails and files mentioning Project Falcon across the tenant" is Content search. "Preserve a leaver's mailbox during a lawsuit" is an eDiscovery hold. "Find what a user asked Copilot last month" is Content search against the mailbox with the Copilot activity condition, or DSPM for AI activity explorer if you only need to browse recent interactions.`,
    },
    {
      heading: 'Compliance Manager: regulations into actions',
      body: `**Microsoft Purview Compliance Manager** helps you assess and manage compliance with standards and regulations across Microsoft 365 and other clouds. It works with four building blocks:

- **Regulations**: more than 360 templates (ISO 27001, GDPR, NIST, HIPAA, and AI-specific ones such as the EU AI Act and ISO/IEC 42001) plus custom templates.
- **Assessments**: a regulation applied to a set of in-scope services; completing its actions brings your configuration in line with that regulation.
- **Controls**: the individual requirements, split into **Microsoft managed** (Microsoft implements and provides audit evidence), **your controls** (you implement) and **shared controls**.
- **Improvement actions**: the concrete, step-by-step tasks behind your controls (turn on MFA for admins, create a DLP policy for financial data, enable audit). Actions can be assigned to owners, hold evidence and notes, and track implementation and test status. Many technical actions are detected automatically.

Points earned for completed actions roll up into a **compliance score**. Microsoft gives every tenant an initial score from the **Microsoft 365 data protection baseline**, so the score is never zero and is risk-weighted: mandatory, preventive actions carry more points than discretionary, detective ones.

How an administrator uses it: open the overview to see the score and what needs attention, add assessments for the regulations your organisation must meet, work through improvement actions by points, and generate reports for auditors. DSPM for AI's "guided assistance to AI regulations" recommendation simply creates the relevant Compliance Manager assessments. Distinguish it from **Identity Secure Score** (identity posture) and **Microsoft Secure Score** (security posture): Compliance Manager measures *regulatory and data-protection* posture.`,
    },
    {
      heading: 'Putting the three together',
      body: `A compliance programme for Copilot typically uses all three tools in sequence.

**Decide what to keep.** Create a retention policy for the *Microsoft Copilot experiences* location (for example retain for one year, then delete) so AI conversations are governed like Teams chats. Use retention labels, not policies, when specific items such as contracts need a longer period or a disposition review.

**Be able to find it.** Confirm that eDiscovery Managers can run a Content search that returns Copilot activity from a mailbox, and that legal can place a hold when needed. Because retention and holds both preserve content in SubstrateHolds and Recoverable Items, a deleted Copilot chat is still discoverable while a hold or retention period applies.

**Prove it.** In Compliance Manager, add the assessment for the regulation you answer to, and complete the improvement actions that point at retention, audit and DLP. The score gives leadership a trend line and auditors evidence.

Common distractors to recognise: a *sensitivity label* protects and classifies but does not delete; a *retention label* keeps or deletes but does not encrypt; *DLP* blocks sharing but does not preserve; and *Compliance Manager* recommends controls but does not itself enforce anything. The correct answer always names the tool whose job matches the verb in the question: keep or delete (retention), find or preserve (eDiscovery), assess or score (Compliance Manager).`,
    },
  ],
  examples: [
    {
      title: 'Governing Copilot conversations',
      description:
        'Contoso policy says business communications are kept for three years. The admin already has a retention policy for Teams chats and creates a new one for the Microsoft Copilot experiences location with retain for three years, then delete. Prompts and responses are preserved in the hidden mailbox folder and remain searchable by eDiscovery even if a user deletes the chat.',
      takeaway: 'Copilot interactions have their own retention location and are stored in the user mailbox, which is why eDiscovery can find them.',
    },
    {
      title: 'Using a retention policy where a label was needed (a realistic mistake)',
      description:
        'A records manager wants signed contracts kept for ten years and everything else in the Legal site deleted after three. They apply a single ten-year retention policy to the whole site, so nothing can be deleted for a decade. The fix is a three-year retention policy on the site plus a ten-year retention label (optionally marking the item as a record) auto-applied to contracts; the explicit label wins for those items.',
      takeaway: 'Policies set the baseline for a location; labels handle item-level exceptions and records.',
    },
    {
      title: 'A targeted Content search',
      description:
        'HR must gather what a former employee asked Copilot about a competitor, plus related email, within a week. An eDiscovery Manager opens the Content search case, adds the user mailbox as a source, uses a date range and the keyword "Fabrikam", adds the condition Type contains Copilot activity for one search and runs a second for email, previews results and exports them for HR.',
      language: 'text',
      code: `Purview portal > Solutions > eDiscovery > Cases > Content search > Searches > Create a search
  Data sources ....... Mailbox: former.employee@contoso.com
  Query (KQL) ........ Fabrikam AND (sent>=2026-01-01 AND sent<=2026-03-31)
  Condition .......... Type  contains any of  Copilot activity
  Actions ............ Statistics -> Preview -> Export`,
      takeaway: 'Content search targets locations plus a query; the Copilot activity type condition isolates AI interactions.',
    },
  ],
  keyPoints: [
    'Retention outcomes: retain only, delete only, retain then delete; content stays in place and copies go to the Preservation Hold library, Recoverable Items or SubstrateHolds.',
    'Retention policies apply to locations (mailboxes, sites, Teams, Microsoft Copilot experiences, Enterprise AI apps, Other AI apps); retention labels apply to items, travel with them, support events, disposition review and records.',
    'Principles of retention: retention beats deletion, longest retention wins, explicit label beats policy, shortest deletion wins.',
    'Copilot prompts and responses are stored in the user mailbox, governed by the Copilot experiences retention location and discoverable through eDiscovery.',
    'Unified eDiscovery in the Purview portal replaced classic Content search and Standard/Premium; searches live in cases, with a default Content search case for ad-hoc work.',
    'A Content search specifies data sources, a KQL query and conditions, then offers statistics, preview and export; eDiscovery Manager role group is required.',
    'Compliance Manager uses regulations, assessments, controls (Microsoft managed, yours, shared) and improvement actions to produce a risk-weighted compliance score starting from the data protection baseline.',
  ],
  flashcards: [
    { front: 'Where are retained SharePoint items kept after a user deletes them?', back: 'In the site\'s Preservation Hold library.' },
    { front: 'Which hidden folder stores retained Teams and Copilot messages?', back: 'SubstrateHolds, inside the Exchange Recoverable Items folder.' },
    { front: 'Retention policy vs retention label?', back: 'Policies apply to whole locations and do not travel with content; labels apply to items, travel with them, and support events, disposition review and records.' },
    { front: 'If one policy retains for 5 years and another deletes after 3, what happens?', back: 'Retention wins over deletion: the item is kept for 5 years, then deleted.' },
    { front: 'Which retention location covers Microsoft 365 Copilot prompts and responses?', back: 'Microsoft Copilot experiences (older tenants may still have Teams chats and Copilot interactions).' },
    { front: 'Which role group is needed to run a Content search?', back: 'eDiscovery Manager (or a custom role group with Compliance Search).' },
    { front: 'How do you limit an eDiscovery search to Copilot interactions?', back: 'Search the user mailbox and add the condition Type contains Copilot activity.' },
    { front: 'What are the three control types in Compliance Manager?', back: 'Microsoft managed controls, your (customer managed) controls, and shared controls.' },
    { front: 'What gives a tenant its initial compliance score?', back: 'The Microsoft 365 data protection baseline assessment.' },
    { front: 'What is a disposition review?', back: 'A retention label option that routes content to reviewers before permanent deletion at the end of its retention period.' },
  ],
  quiz: [
    {
      question: 'Contoso must keep all Microsoft 365 Copilot prompts and responses for two years and then delete them. What should the administrator create?',
      options: [
        'A sensitivity label with a two-year expiry',
        'A retention policy for the Microsoft Copilot experiences location set to retain for two years and then delete',
        'A DLP policy for the Copilot location',
        'An eDiscovery hold on all mailboxes',
      ],
      correct: [1],
      explanation:
        'Retention policies govern keep-and-delete for a location. Sensitivity labels protect rather than delete, DLP prevents misuse, and a hold preserves indefinitely with no deletion.',
    },
    {
      question: 'Legal needs to export every email and SharePoint document mentioning "Project Falcon" from the past year. Which tool should they use?',
      options: ['Microsoft Purview Compliance Manager', 'Content search in Microsoft Purview eDiscovery', 'Data explorer', 'Microsoft Entra audit logs'],
      correct: [1],
      explanation:
        'Content search queries mailboxes and sites with keywords and conditions and exports results. Compliance Manager scores controls, Data explorer lists classified items, and Entra logs record directory changes.',
    },
    {
      question: 'A SharePoint site has a retention policy that deletes content after three years. Some tax documents in it must be kept for seven years. What is the MOST appropriate action?',
      options: [
        'Change the site policy to retain everything for seven years.',
        'Apply a seven-year retention label to the tax documents.',
        'Move the tax documents to OneDrive.',
        'Encrypt the tax documents with a sensitivity label.',
      ],
      correct: [1],
      explanation:
        'Item-level exceptions are what retention labels are for, and the longer retention wins. Extending the site policy over-retains everything, moving content loses policy coverage, and encryption does not affect retention.',
    },
    {
      question: 'Which TWO statements about Compliance Manager are correct? (Select two)',
      options: [
        'It provides prebuilt assessment templates for regulations such as ISO 27001 and the EU AI Act.',
        'It automatically encrypts files that match regulated data types.',
        'Improvement actions can be assigned to users and hold evidence for auditors.',
        'It replaces the need for retention policies.',
      ],
      correct: [0, 2],
      explanation:
        'Templates and assignable improvement actions are core features. Compliance Manager recommends controls but does not encrypt or retain anything itself.',
    },
    {
      question: 'An investigator must find the prompts a user submitted to Copilot Chat during March. Which search configuration is correct?',
      options: [
        'Search all SharePoint sites for the keyword "Copilot".',
        'Search the user\'s mailbox with the condition Type contains Copilot activity and a March date range.',
        'Search the Teams admin center usage report.',
        'Search Entra sign-in logs for the Copilot application.',
      ],
      correct: [1],
      explanation:
        'Copilot interactions are stored in the user\'s mailbox and exposed through the Copilot activity type condition. Sites, usage reports and sign-in logs do not contain prompt content.',
    },
    {
      question: 'What is the initial source of points in a new tenant\'s compliance score?',
      options: ['Identity Secure Score', 'The Microsoft 365 data protection baseline assessment', 'The number of licences purchased', 'DSPM for AI recommendations'],
      correct: [1],
      explanation:
        'Every tenant starts with the data protection baseline. Identity Secure Score is a separate identity metric, licences do not score, and DSPM recommendations only link to assessments.',
    },
  ],
  statements: [
    { text: 'Retention settings require moving content to a separate archive location.', isTrue: false, explanation: 'Retention works in place; copies are preserved in hidden locations only when items are edited or deleted.' },
    { text: 'A retention label travels with a document when it moves to another site in the tenant.', isTrue: true, explanation: 'Labels are item-level and persistent; policies are location-based and do not travel.' },
    { text: 'When a retention policy and a deletion policy both apply, deletion takes precedence.', isTrue: false, explanation: 'Retention always wins over deletion.' },
    { text: 'Copilot prompts and responses are stored in the user\'s Exchange mailbox and can be found with eDiscovery.', isTrue: true, explanation: 'This is why mailbox searches with the Copilot activity condition return them.' },
    { text: 'Classic Content search is still the primary search experience in the Purview portal.', isTrue: false, explanation: 'Classic experiences retired in August 2025; the unified eDiscovery experience with cases replaced them.' },
    { text: 'Compliance Manager\'s score is risk-weighted so that some improvement actions are worth more than others.', isTrue: true, explanation: 'Mandatory preventive actions carry more points.' },
    { text: 'Microsoft managed controls are controls your organisation must implement itself.', isTrue: false, explanation: 'Microsoft implements those; your controls are the customer-managed ones.' },
  ],
  resources: [
    { label: 'Learn about retention policies and retention labels', url: 'https://learn.microsoft.com/en-us/purview/retention' },
    { label: 'Learn about retention for Copilot and AI apps', url: 'https://learn.microsoft.com/en-us/purview/retention-policies-copilot' },
    { label: 'Microsoft Purview eDiscovery solutions', url: 'https://learn.microsoft.com/en-us/purview/ediscovery' },
    { label: 'Microsoft Purview Compliance Manager', url: 'https://learn.microsoft.com/en-us/purview/compliance-manager' },
  ],
};
