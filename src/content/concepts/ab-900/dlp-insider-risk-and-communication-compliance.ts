import type { Concept } from '../../types';

export const dlpInsiderRiskAndCommunicationCompliance: Concept = {
  id: 'dlp-insider-risk-and-communication-compliance',
  title: 'Responding to Risk: DLP Alerts, Insider Risk Management and Communication Compliance',
  summary:
    'How Purview DLP policies raise alerts and how to triage them, how Insider Risk Management turns signals into pseudonymised alerts and cases (including the Risky AI usage template), and how Communication Compliance surfaces policy violations in email, Teams and Copilot interactions.',
  certs: ['ab-900'],
  domains: ['ab-900-2'],
  outcomes: ['ab-900-2-3-4', 'ab-900-2-3-3', 'ab-900-2-3-5'],
  tags: ['dlp', 'alerts', 'insider-risk-management', 'communication-compliance', 'purview', 'incident-response'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'DLP policies and the alerts they generate',
      body: `A **Data Loss Prevention (DLP) policy** watches **locations** (Exchange, SharePoint, OneDrive, Teams, devices through Endpoint DLP, on-premises repositories, Fabric and Power BI, and the **Microsoft Copilot, Copilot Chat and Copilot Cowork** location) for **conditions**, mostly sensitive information types, trainable classifiers or sensitivity labels, and takes **actions**: audit only, show a policy tip, block with override, block, restrict access, or encrypt. Copilot-specific actions can stop Copilot processing a prompt that contains sensitive information, stop it using files that carry a chosen label, or stop sensitive prompts being sent to web search.

Every rule can also generate an **alert**, with a severity, an optional aggregation threshold (alert when a user triggers the rule *n* times in a window) and email notifications to a distribution list. Alerts appear on the **DLP alerts dashboard**: *Purview portal > Data loss prevention > Alerts*, and also flow into the Microsoft Defender portal incidents queue for security teams.

Triage follows a fixed shape that exam scenarios reproduce:

1. Filter and open the alert; the **Details** tab summarises what happened, who did it and which policy matched (Security Copilot can summarise it).
2. The **Events** tab lists each matching action; **Matched sensitive content** shows the exact text, which requires the Content Explorer Content Viewer role group.
3. The **User activity summary** (when Insider Risk sharing is on) shows the user's other exfiltration activity over 120 days.
4. Decide: true positive, false positive or needs investigation; assign an owner, comment, then set the status to **Resolved**.

A recurring false positive means the policy needs tuning (higher instance counts, extra conditions, exceptions), not that the alert should be ignored. Alert retention follows your audit log retention. Roles that can work alerts include Compliance Administrator, Security Operator, Security Reader and the Information Protection role groups, each needing the *Manage alerts* role.`,
    },
    {
      heading: 'Insider Risk Management: from signals to cases',
      body: `**Insider Risk Management (IRM)** correlates signals from Microsoft 365, Defender, HR connectors and third-party sources to identify *potentially* risky users, then lets analysts investigate without exposing identities unnecessarily. Design principles the exam tests: **privacy by design** (users are **pseudonymised** by default), **role-based access**, configurable policies and an integrated workflow with eDiscovery.

The workflow:

- **Policies** are built from **templates**: Data theft by departing users (triggered by an HR resignation date), Data leaks (general, by priority users, by risky users), Security policy violations, Patient data misuse, **Risky AI usage** (prompt injection attempts, access to protected material, sensitive data in prompts), Risky agents and Risky browser usage. Each template defines **triggering events** and **indicators** such as downloading from SharePoint, copying to USB, printing, emailing to personal accounts or sending to generative-AI sites.
- **Alerts** are generated when indicators exceed thresholds. The alerts dashboard (or the Triage Agent) scores and lists them.
- **Triage**: an analyst reviews the user activity timeline and either dismisses or confirms the alert into a **case**.
- **Cases** gather the evidence, allow **notice** emails to the user, escalation to **eDiscovery (Premium)**, or sharing to Defender for Endpoint and ServiceNow through connectors.
- **Adaptive protection** assigns users a risk level and automatically applies stricter DLP, Conditional Access or retention controls to high-risk users, loosening them again as risk falls.

Before writing policies, **analytics** scans the tenant and estimates how many users would match each template. IRM requires E5-level licensing, and a Risky AI usage policy is the one-click option DSPM for AI offers for "detect risky interactions in AI apps". When a scenario describes a user who is about to leave and has started mass-downloading, or asks how to flag prompt-injection attempts against Copilot, IRM is the solution.`,
    },
    {
      heading: 'Communication Compliance: detecting policy violations in messages',
      body: `**Communication Compliance** detects and remediates inappropriate or non-compliant **messages**: email, Teams chats and channels, Viva Engage, third-party sources imported with connectors, and **Microsoft 365 Copilot and Copilot Chat prompts and responses**. It addresses three scenario families:

- **Corporate policy**: harassment, threats, discrimination, profanity, adult images.
- **Risk management**: leaks of confidential project information, conflicts of interest.
- **Regulatory compliance**: supervision duties such as FINRA Rule 3110 for broker-dealer communications.

Policies are created from **templates** (Detect inappropriate text, Detect inappropriate images, Monitor for sensitive information, Monitor for regulatory compliance, Detect customer complaints) or from scratch. Conditions combine **trainable classifiers** (Threat, Harassment, Discrimination, Profanity, Targeted harassment), **sensitive information types**, keywords and direction (inbound, outbound, internal), applied to a percentage sample or to everyone in scope. The DSPM for AI one-click policy *Unethical behavior in Copilot* is simply a Communication Compliance policy scoped to Copilot interactions.

Review is privacy-first: user names are **pseudonymised** until a reviewer needs to act, and reviewers are explicitly designated, separating the admins who configure policies from the people who read messages. For each **policy match** a reviewer can **resolve**, tag as **false positive**, **notify** the user with a template, **escalate** to a manager or to eDiscovery, **remove** the message in Teams, or mark it as misclassified to improve the classifier. Reports show policy matches, resolution times and items per policy.

The exam asks you to tell IRM from Communication Compliance: IRM watches **behaviour and activity patterns** (downloads, exfiltration) and produces user risk; Communication Compliance reads **message content** and produces policy matches. Both are E5 solutions, both pseudonymise, and both can hand off to eDiscovery.`,
    },
    {
      heading: 'Choosing and combining the three',
      body: `Think of them as three lenses on the same tenant:

| You want to | Use | Output you work |
|---|---|---|
| Stop or watch sensitive data moving to the wrong place, including into Copilot | **DLP** | Alerts and events |
| Spot users whose pattern of activity signals leak, theft or risky AI use | **Insider Risk Management** | Alerts and cases |
| Catch messages, including Copilot prompts and responses, that break conduct or regulatory rules | **Communication Compliance** | Policy matches |

They reinforce each other. DLP alerts carry a user activity summary fed by IRM. IRM's **Risky AI usage** template uses DLP's sensitive information types to decide what counts as sensitive in a prompt. **Adaptive protection** from IRM can tighten DLP for a high-risk user automatically. Communication Compliance can escalate a message to an IRM case or eDiscovery. All three write to the unified audit log and appear in DSPM for AI reports.

Practical response order for a Copilot-era incident ("a user pasted a customer list into Copilot and asked it to find the richest clients"): the DLP policy on the Copilot location blocks the prompt and raises an alert; an IRM Risky AI usage policy adds the event to the user's risk score; if the prompt also contained threatening language, Communication Compliance flags it. The admin triages the DLP alert, checks the IRM activity timeline for a wider pattern, and documents the outcome. The wrong answer in such scenarios is usually "disable Copilot for everyone": the controls exist precisely so that one incident does not require a blanket shutdown.`,
    },
  ],
  examples: [
    {
      title: 'Triaging a DLP alert on the Copilot location',
      description:
        'A DLP policy prevents Copilot from processing prompts containing UK National Insurance numbers and raises a medium-severity alert. The compliance analyst opens the alert, sees in Events that the user pasted a payroll extract into Copilot Chat three times, confirms the matched content, finds no wider exfiltration in the User activity summary, records it as a true positive caused by a training gap, notifies the manager and sets the alert to Resolved.',
      takeaway: 'Alert triage is: read details, review events and matched content, check wider activity, decide, document, resolve.',
    },
    {
      title: 'The leaver who downloaded everything (a realistic mistake)',
      description:
        'HR records a resignation but the security team only learns weeks later that the employee downloaded 2,000 customer files to a personal device before leaving. No IRM policy existed. Had a Data theft by departing users policy been connected to the HR connector, the resignation date would have triggered monitoring, the download spike would have produced a high-severity alert, and adaptive protection could have blocked USB copies automatically.',
      takeaway: 'IRM templates such as Data theft by departing users exist to catch exactly this pattern; configure them before you need them.',
    },
    {
      title: 'Harassment in Copilot prompts',
      description:
        'A Communication Compliance policy scoped to Copilot interactions and Teams chat uses the Threat and Harassment classifiers. It flags a Copilot prompt asking the assistant to draft an intimidating message to a colleague. The designated reviewer sees a pseudonymised match, reveals the user to act, escalates to HR and tags the item resolved. IT administrators who built the policy never saw the message content.',
      takeaway: 'Communication Compliance covers Copilot prompts and responses, and separates policy configuration from message review.',
    },
  ],
  keyPoints: [
    'DLP policies combine locations (including the Microsoft Copilot, Copilot Chat and Cowork location), conditions (SITs, classifiers, labels) and actions (audit, tip, block, restrict, prevent Copilot processing), and can raise alerts with thresholds and notifications.',
    'DLP alerts are triaged on the Purview DLP alerts dashboard: details, events, matched content (Content Viewer role), user activity summary, then assign and resolve; repeated false positives mean tune the policy.',
    'Insider Risk Management correlates activity signals into pseudonymised alerts and cases using templates such as Data theft by departing users, Data leaks and Risky AI usage; adaptive protection tightens controls for high-risk users.',
    'Communication Compliance detects policy violations in message content, including Copilot prompts and responses, using classifiers and SITs, with designated reviewers who resolve, notify, escalate or remove.',
    'IRM looks at behaviour patterns; Communication Compliance looks at message content; DLP looks at data movement.',
    'All three are privacy-conscious, E5-level (for IRM and Communication Compliance), write to the audit log, and can hand off to eDiscovery.',
    'The right response to a Copilot data incident is targeted controls and triage, not disabling Copilot for everyone.',
  ],
  flashcards: [
    { front: 'Where do you view DLP alerts in Purview?', back: 'Purview portal > Data loss prevention > Alerts (also surfaced in the Defender portal incidents queue).' },
    { front: 'Which role group is required to see matched sensitive content in a DLP alert?', back: 'Content Explorer Content Viewer.' },
    { front: 'What does the User activity summary tab on a DLP alert show, and what enables it?', back: 'The user\'s exfiltration activities over the past 120 days; it requires sharing to be turned on in Insider Risk Management settings and the user to be in scope of an IRM policy.' },
    { front: 'Name three Insider Risk Management policy templates.', back: 'Data theft by departing users, Data leaks, Risky AI usage (also Security policy violations, Patient data misuse, Risky agents).' },
    { front: 'How does IRM protect user privacy by default?', back: 'User identities are pseudonymised; role-based access and audit logs control who can reveal them.' },
    { front: 'What is adaptive protection?', back: 'An IRM capability that assigns risk levels to users and automatically applies stricter DLP, Conditional Access or retention controls to high-risk users.' },
    { front: 'Which communications can Communication Compliance monitor?', back: 'Exchange email, Teams, Viva Engage, imported third-party sources, and Microsoft 365 Copilot and Copilot Chat prompts and responses.' },
    { front: 'Name four remediation actions for a Communication Compliance match.', back: 'Resolve, tag as false positive, notify the user, escalate (including to eDiscovery), remove the Teams message.' },
    { front: 'IRM vs Communication Compliance in one line?', back: 'IRM analyses user activity patterns; Communication Compliance analyses message content.' },
    { front: 'What is the one-click DSPM for AI policy "Unethical behavior in Copilot"?', back: 'A Communication Compliance policy scoped to Copilot prompts and responses.' },
  ],
  quiz: [
    {
      question: 'A compliance analyst sees a DLP alert showing that a user attempted to share a file containing credit card numbers externally. After confirming it is a genuine violation and notifying the manager, what should the analyst do to complete the workflow?',
      options: ['Delete the DLP policy', 'Set the alert status to Resolved and record comments', 'Disable the user\'s Copilot licence', 'Create a retention label'],
      correct: [1],
      explanation:
        'Triage ends by documenting and resolving the alert. Deleting the policy removes protection, Copilot licensing is unrelated to an email share, and retention does not address the incident.',
    },
    {
      question: 'Contoso wants to be alerted when an employee who has submitted their resignation starts downloading unusual volumes of files from SharePoint. Which solution should you configure?',
      options: [
        'A Communication Compliance policy with the Harassment classifier',
        'An Insider Risk Management policy using the Data theft by departing users template connected to the HR connector',
        'A sensitivity label with encryption',
        'A Conditional Access policy requiring MFA',
      ],
      correct: [1],
      explanation:
        'Departing-user data theft is a behavioural pattern IRM detects, triggered by HR data. Communication Compliance reads messages, labels protect files but do not alert on behaviour, and MFA does not detect exfiltration.',
    },
    {
      question: 'Which TWO statements about Microsoft Purview Communication Compliance are correct? (Select two)',
      options: [
        'It can review Microsoft 365 Copilot prompts and responses for inappropriate content.',
        'It encrypts flagged messages automatically.',
        'Reviewers see pseudonymised user names until they need to act.',
        'It replaces Data Loss Prevention for blocking file sharing.',
      ],
      correct: [0, 2],
      explanation:
        'Copilot interactions are a supported channel and pseudonymisation is a design principle. Communication Compliance does not encrypt content or block file sharing; those are label and DLP functions.',
    },
    {
      question: 'Security wants Copilot prompt-injection attempts and the use of protected material in AI prompts to raise an alert that contributes to the user\'s risk score. What should you configure?',
      options: [
        'An Insider Risk Management policy based on the Risky AI usage template',
        'A Teams messaging policy',
        'A SharePoint restricted content discovery setting',
        'An Entra Conditional Access named location',
      ],
      correct: [0],
      explanation:
        'The Risky AI usage template detects these indicators and feeds user risk. Messaging policies, SharePoint discovery settings and named locations do not detect prompt content.',
    },
    {
      question: 'A DLP alert fires several times a day on a policy that detects nine-digit numbers, mostly for internal purchase order numbers. What is the MOST appropriate action?',
      options: [
        'Resolve each alert as a false positive and keep going.',
        'Tune the policy by raising the instance count, adding supporting evidence conditions or excluding the purchasing site.',
        'Delete the policy entirely.',
        'Switch the action to block for everyone.',
      ],
      correct: [1],
      explanation:
        'Persistent false positives indicate a tuning problem. Ignoring them wastes analyst time, deleting removes protection, and blocking without tuning increases false positives\' impact.',
    },
    {
      question: 'What is the primary difference between Insider Risk Management and Communication Compliance?',
      options: [
        'IRM analyses user activity patterns to produce risk alerts; Communication Compliance analyses message content for policy violations.',
        'IRM is included in Microsoft 365 E3; Communication Compliance requires E5.',
        'IRM applies only to Copilot; Communication Compliance applies only to email.',
        'IRM reveals user identities by default; Communication Compliance never can.',
      ],
      correct: [0],
      explanation:
        'Behaviour versus content is the distinction. Both are E5-level solutions, both cover multiple workloads including Copilot, and both pseudonymise by default while allowing authorised reveal.',
    },
  ],
  statements: [
    { text: 'DLP policies can prevent Copilot from processing prompts that contain sensitive information types.', isTrue: true, explanation: 'The Microsoft Copilot, Copilot Chat and Cowork location supports actions that block processing of sensitive prompts and labelled files.' },
    { text: 'DLP alerts can only be viewed in the Microsoft Defender portal.', isTrue: false, explanation: 'The primary dashboard is in the Purview portal under Data loss prevention > Alerts; alerts also flow to Defender.' },
    { text: 'Insider Risk Management pseudonymises users by default.', isTrue: true, explanation: 'Privacy by design is a core principle; authorised roles can reveal identities during investigation.' },
    { text: 'Adaptive protection permanently blocks any user who triggers an IRM alert.', isTrue: false, explanation: 'It applies risk-level-based controls that tighten and relax as the user\'s risk changes.' },
    { text: 'Communication Compliance can remove a flagged message from a Teams channel.', isTrue: true, explanation: 'Remove message in Teams is one of the remediation actions.' },
    { text: 'The Risky AI usage template is a Communication Compliance template.', isTrue: false, explanation: 'It is an Insider Risk Management policy template.' },
    { text: 'The best first response to any Copilot data incident is to disable Copilot for the whole organisation.', isTrue: false, explanation: 'Targeted DLP, IRM and Communication Compliance controls exist so incidents can be contained without a blanket shutdown.' },
  ],
  resources: [
    { label: 'Learn about the DLP alerts dashboard', url: 'https://learn.microsoft.com/en-us/purview/dlp-alerts-dashboard-learn' },
    { label: 'Learn about data loss prevention for Microsoft 365 Copilot and Copilot Chat', url: 'https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about' },
    { label: 'Learn about Insider Risk Management', url: 'https://learn.microsoft.com/en-us/purview/insider-risk-management' },
    { label: 'Learn about Communication Compliance', url: 'https://learn.microsoft.com/en-us/purview/communication-compliance' },
  ],
};
