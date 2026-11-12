import type { Concept } from '../../types';

export const conditionalAccessAndSignInTroubleshooting: Concept = {
  id: 'conditional-access-and-sign-in-troubleshooting',
  title: 'Conditional Access, Sign-in Troubleshooting, Identity Secure Score and Audit Logs',
  summary:
    'How Conditional Access policies turn signals into grant or block decisions, which tools diagnose MFA, Conditional Access and risky sign-in failures, how to read Identity Secure Score, and where user and admin activity is audited in Entra and Purview.',
  certs: ['ab-900'],
  domains: ['ab-900-1'],
  outcomes: ['ab-900-1-3-2', 'ab-900-1-3-5', 'ab-900-1-3-6', 'ab-900-1-3-7'],
  tags: ['conditional-access', 'sign-in-logs', 'id-protection', 'identity-secure-score', 'audit-logs', 'troubleshooting'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Conditional Access: if this, then that',
      body: `**Conditional Access** is Microsoft's Zero Trust policy engine. A policy is an if-then statement evaluated *after* the first factor succeeds: **if** a user in scope tries to reach a resource under certain conditions, **then** grant, grant with controls, or block.

**Assignments (the "if")**: users and groups (with exclusions, always including a break-glass account), target resources (cloud apps, user actions, agent resources), and **conditions**: sign-in risk and user risk (from ID Protection), device platform, locations (named locations, trusted IPs, countries), client apps (to block legacy authentication), and device filters.

**Access controls (the "then")**: **Block**, or **Grant** requiring one or more of: MFA, a specific **authentication strength** (for example phishing-resistant), a **compliant** device (Intune), a Microsoft Entra hybrid joined device, an approved client app or app protection policy, a password change, or acceptance of terms of use. **Session** controls add sign-in frequency, persistent browser restrictions and Defender for Cloud Apps session monitoring.

Practical rules:

- Start every new policy in **report-only** mode and review the results in sign-in logs before enforcing.
- Use **templates** for common policies: MFA for admins, MFA for all users, block legacy authentication, require compliant devices.
- Conditional Access needs Entra ID P1; risk-based conditions need P2.
- It is not a frontline defence against denial-of-service and does not replace permissions; a user who passes a policy still needs authorisation to the data.

For Copilot, a common requirement is "only compliant or hybrid-joined devices may use Copilot", which is simply a policy targeting the Copilot or Microsoft 365 resources with a device grant control.`,
    },
    {
      heading: 'Troubleshooting sign-in failures',
      body: `When a user cannot sign in, the tool is the **sign-in logs** in the Entra admin center: *Entra ID > Monitoring & health > Sign-in logs*. The least-privileged role is **Reports Reader**. Filter by user, application, date and **Status: Failure**, then open the event. The important details are:

- **Failure reason** and **Additional details**, which usually say exactly what to fix.
- **Sign-in error code** (for example 50126 invalid credentials, 500121 MFA prompt not completed, 53003 blocked by Conditional Access, 50076 MFA required because of policy) which you can paste into the error code lookup.
- The **Conditional Access** tab listing every policy evaluated with *Success*, *Failure*, *Not applied* or *Report-only*, and which grant control was not satisfied.
- The **Authentication details** tab showing each factor attempted and whether it succeeded.
- The **Correlation ID** for support cases.

For "which policy would hit this user?" questions before anything fails, use the Conditional Access **What If** tool. For MFA registration and method problems, check the user's **Authentication methods** blade and the authentication methods policy; a user who never registered gets 500121-type failures and a Temporary Access Pass fixes it.

**Risky sign-ins** come from **Entra ID Protection**: *Protection > Identity Protection* has three reports: **Risk detections**, **Risky sign-ins** and **Risky users**. If a risk-based policy blocked the user, an admin can *confirm compromised* (forcing a password reset) or *dismiss* or *confirm safe*; where self-remediation is enabled, the user clears risk by completing MFA or a secure password reset. Users can see their own history at mysignins.microsoft.com, which is useful when asking "was that you?".`,
    },
    {
      heading: 'Identity Secure Score',
      body: `**Identity Secure Score** is a percentage that shows how closely your tenant's identity configuration matches Microsoft's recommended practices. Every 24 hours Microsoft evaluates your settings against a list of improvement actions and awards points, partially where an action is partly met. You find it at *Entra ID > Identity Secure Score* (Global Reader can view) or through *Entra ID > Overview > Recommendations* filtered to Security, and it also contributes to the organisation-wide **Microsoft Secure Score** in the Defender portal.

Typical recommendations: require MFA for administrative roles, ensure all users can complete MFA, block legacy authentication, use least-privileged administrative roles, designate more than one Global Administrator, do not allow users to grant consent to unreliable applications, protect all users with sign-in and user risk policies, enable self-service password reset, remove dormant accounts from sensitive groups.

Each action can be set to a status that tells the exam what you are doing with it:

- **To address**: you plan to fix it (also the default for partially complete actions).
- **Planned**: concrete plans exist.
- **Risk accepted**: you choose not to implement; no points, hidden from the list, reversible.
- **Resolved through third party** or **through alternate mitigation**: you meet the intent another way, and you *do* receive points.
- **Ignored**: not applicable to your environment; excluded from the calculation.

How to interpret it: the score is relative to actions that apply to your licences, so compare trends over time rather than fixating on the number, and start with the highest-point actions, which are usually MFA and legacy authentication. A falling score after no changes typically means Microsoft added a new recommendation.`,
    },
    {
      heading: 'Reviewing audit logs for user and admin activity',
      body: `Two different audit stores answer two different questions.

**Microsoft Entra audit logs** (*Entra ID > Monitoring & health > Audit logs*) record changes to the *directory*: users created or deleted, group membership and owner changes, licences assigned, roles activated, applications and service principals added, Conditional Access policies edited, agent identities changed. Each entry shows date, service, category, activity, status, the actor and target, and old and new values. Entries are system generated and cannot be altered. Alongside sit the **sign-in logs** (interactive, non-interactive, service principal and managed identity sign-ins) and **provisioning logs**. Default retention is short (seven days on Free, 30 days on P1/P2), so organisations stream logs to a Log Analytics workspace, storage account or SIEM such as Microsoft Sentinel through diagnostic settings for long-term retention and alerting.

**Microsoft Purview Audit** (*Purview portal > Solutions > Audit*) records *workload* activity across Microsoft 365: files viewed or shared in SharePoint, mailbox access, Teams actions, Purview label and DLP events, admin changes in the workload admin centers, and every **Copilot and AI interaction** (prompts, responses, and the files Copilot accessed, with their sensitivity labels). Search by date, user, activity and workload; filter to the *Copilot* and *AIApp* workloads for Copilot investigations. The **Audit Reader** role group (or Compliance Administrator) can search. **Audit (Standard)** keeps records for 180 days; **Audit (Premium)** (E5) keeps one year by default with a ten-year add-on and provides extra intelligent insights such as mail items accessed. Auditing is on by default for new tenants, and DSPM for AI's first checklist item is simply "turn on Purview Audit".

Rule of thumb: a question about who changed a *user, group, role or app* points to Entra audit logs; a question about who *accessed or shared data*, or what Copilot did, points to Purview Audit.`,
    },
  ],
  examples: [
    {
      title: 'Diagnosing "you cannot access this right now"',
      description:
        'A salesperson travelling abroad cannot open Copilot Chat. The admin opens Entra sign-in logs, filters to the user and Status: Failure, and finds error 53003 with the Conditional Access tab showing the "Block access from untrusted countries" policy as Failure. The fix is a named-location exception for the approved travel country or a temporary exclusion, not a licence change.',
      language: 'text',
      code: `Entra admin center > Entra ID > Monitoring & health > Sign-in logs
  Filter: User = alex@contoso.com, Status = Failure
  Event details
    Sign-in error code .... 53003
    Failure reason ........ Access has been blocked by Conditional Access policies.
    Conditional Access tab
      "Block untrusted countries" ... Failure (Grant control: Block)
      "Require MFA for all users" ... Success`,
      takeaway: 'Sign-in logs plus the Conditional Access tab tell you which policy fired and why.',
    },
    {
      title: 'Enforcing a policy without report-only first (a realistic mistake)',
      description:
        'An admin creates a "require compliant device" policy for all users and all apps and turns it on immediately. Hundreds of staff on personal phones and the emergency access account are locked out. The recovery is to use the break-glass account, switch the policy to report-only, review sign-in logs for a week, exclude the break-glass account, and scope the policy to the right groups before enforcing.',
      takeaway: 'Always exclude emergency access accounts and pilot in report-only mode.',
    },
    {
      title: 'Which log answers the question?',
      description:
        'Legal asks two questions after a leaver: who added the leaver to the Finance Admins group last month, and which SharePoint files the leaver downloaded in their final week. The first is a directory change, answered by Entra audit logs. The second is workload activity, answered by a Purview Audit search filtered to the user and FileDownloaded activities.',
      takeaway: 'Directory changes live in Entra audit logs; data and Copilot activity live in Purview Audit.',
    },
  ],
  keyPoints: [
    'Conditional Access policies combine assignments (users, resources, conditions such as risk, device, location, client app) with grant or block controls and session controls, evaluated after first-factor authentication.',
    'Pilot policies in report-only mode, use templates, and always exclude a break-glass account; risk-based conditions need Entra ID P2.',
    'Troubleshoot sign-ins in Entra sign-in logs (Reports Reader): failure reason, error code, Conditional Access tab, authentication details; use What If for prediction.',
    'Risky sign-ins and risky users are investigated in Entra ID Protection reports; admins confirm compromised, dismiss or confirm safe, and risk-based policies can self-remediate.',
    'Identity Secure Score is a percentage recalculated every 24 hours; statuses include To address, Planned, Risk accepted, Resolved through third party or alternate mitigation, and Ignored.',
    'Entra audit logs capture directory changes (users, groups, roles, apps); stream them to Log Analytics or a SIEM for long retention.',
    'Purview Audit captures workload activity including Copilot prompts, responses and accessed files; Audit (Standard) retains 180 days, Audit (Premium) one year with a ten-year option.',
  ],
  flashcards: [
    { front: 'When are Conditional Access policies evaluated?', back: 'After first-factor authentication succeeds, before access is granted.' },
    { front: 'What does report-only mode do?', back: 'Evaluates and logs the policy result in sign-in logs without enforcing it.' },
    { front: 'Least-privileged role to read Entra sign-in logs?', back: 'Reports Reader.' },
    { front: 'Which tab in a sign-in log entry shows which policies applied and their result?', back: 'The Conditional Access tab.' },
    { front: 'Name the three Entra ID Protection reports.', back: 'Risk detections, Risky sign-ins, Risky users.' },
    { front: 'What does the Conditional Access What If tool do?', back: 'Predicts which policies would apply to a given user, app and set of conditions without a real sign-in.' },
    { front: 'How often is Identity Secure Score recalculated?', back: 'Every 24 hours.' },
    { front: 'Which Identity Secure Score status gives you points while not implementing Microsoft\'s control?', back: 'Resolved through third party or Resolved through alternate mitigation.' },
    { front: 'Where do you find who added a user to a group?', back: 'Microsoft Entra audit logs.' },
    { front: 'Where do you find which files Copilot accessed to answer a prompt?', back: 'Microsoft Purview Audit (Copilot and AIApp workloads), also surfaced in DSPM for AI activity explorer.' },
    { front: 'Default retention of Audit (Standard) records?', back: '180 days (Audit Premium: one year, extendable to ten).' },
  ],
  quiz: [
    {
      question: 'Contoso wants Microsoft 365 Copilot to be used only from devices that are marked compliant in Intune. What should you configure?',
      options: [
        'A Conditional Access policy targeting the Copilot resources with the Require device to be marked as compliant grant control',
        'A Teams meeting policy',
        'A SharePoint sharing policy set to Only people in your organization',
        'An Identity Secure Score improvement action',
      ],
      correct: [0],
      explanation:
        'Device compliance is a Conditional Access grant control. Teams and SharePoint policies control different behaviours, and Secure Score only recommends.',
    },
    {
      question: 'A user reports they are prompted for MFA but then see an error. In the sign-in log the error code is 500121. What is the MOST likely cause?',
      options: [
        'The user did not complete the MFA prompt or has not registered an MFA method.',
        'The user\'s licence has expired.',
        'The user is blocked by a SharePoint restricted access control policy.',
        'The password was entered incorrectly.',
      ],
      correct: [0],
      explanation:
        '500121 indicates the MFA challenge was not completed, often because no method is registered. Licences and SharePoint policies do not produce sign-in errors, and wrong passwords produce an invalid credentials error.',
    },
    {
      question: 'Which TWO tools should an administrator use to investigate why a specific user was blocked by a risk-based Conditional Access policy? (Select two)',
      options: [
        'Entra ID Protection Risky sign-ins report',
        'Entra sign-in logs with the Conditional Access tab',
        'SharePoint data access governance reports',
        'Exchange admin center mail flow trace',
      ],
      correct: [0, 1],
      explanation:
        'The sign-in log shows the policy that fired and the Risky sign-ins report shows the risk detection behind it. DAG reports and message trace address different problems.',
    },
    {
      question: 'Your Identity Secure Score lists "Require MFA for administrative roles" as incomplete, but you enforce MFA for admins through a third-party identity provider. What should you do to reflect this accurately?',
      options: [
        'Set the action status to Risk accepted.',
        'Set the action status to Resolved through third party.',
        'Ignore the action.',
        'Delete the recommendation.',
      ],
      correct: [1],
      explanation:
        'Resolved through third party records that the intent is met elsewhere and awards the points. Risk accepted and Ignored give no points, and recommendations cannot be deleted.',
    },
    {
      question: 'A compliance officer needs the prompts a departed employee entered into Copilot and the files Copilot read to answer them. Which tool should they use?',
      options: ['Microsoft Entra audit logs', 'Microsoft Purview Audit search filtered to the Copilot workload', 'Entra sign-in logs', 'Teams admin center usage reports'],
      correct: [1],
      explanation:
        'Copilot interactions, including accessed resources and labels, are recorded in the Purview unified audit log. Entra logs cover directory and sign-in events, and Teams reports are aggregate usage.',
    },
    {
      question: 'An administrator wants to keep Entra sign-in logs for two years for forensic analysis. What should they do?',
      options: [
        'Nothing; Entra keeps sign-in logs indefinitely.',
        'Configure diagnostic settings to send the logs to a Log Analytics workspace or storage account.',
        'Enable Audit (Premium) in Purview.',
        'Export the Identity Secure Score history.',
      ],
      correct: [1],
      explanation:
        'Entra retains activity logs for at most 30 days in the portal; long retention requires streaming via diagnostic settings. Purview Audit Premium governs Microsoft 365 workload audit, not Entra sign-ins, and Secure Score is unrelated.',
    },
  ],
  statements: [
    { text: 'Conditional Access policies are evaluated before the user enters a password.', isTrue: false, explanation: 'They are enforced after first-factor authentication completes.' },
    { text: 'Report-only mode lets you see a policy\'s impact in sign-in logs without enforcing it.', isTrue: true, explanation: 'It is the recommended way to pilot a policy.' },
    { text: 'Reports Reader is sufficient to read the Entra sign-in logs.', isTrue: true, explanation: 'It is the least-privileged role for activity logs.' },
    { text: 'Identity Secure Score is an absolute count of vulnerabilities in the tenant.', isTrue: false, explanation: 'It is a percentage of alignment with Microsoft recommendations, recalculated daily.' },
    { text: 'Marking an improvement action as Risk accepted awards its points.', isTrue: false, explanation: 'Risk accepted gives no points; Resolved through third party or alternate mitigation does.' },
    { text: 'Microsoft Purview Audit records Copilot prompts and the resources Copilot accessed.', isTrue: true, explanation: 'Copilot interactions are logged under the Copilot and AIApp workloads.' },
    { text: 'Entra audit log entries can be edited by a Global Administrator.', isTrue: false, explanation: 'Entries are system generated and cannot be changed or deleted.' },
  ],
  resources: [
    { label: 'What is Conditional Access?', url: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview' },
    { label: 'How to troubleshoot sign-in errors using the sign-in logs', url: 'https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-troubleshoot-sign-in-errors' },
    { label: 'What is Identity Secure Score?', url: 'https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-identity-secure-score' },
    { label: 'Audit logs for Copilot and AI activities (Microsoft Purview)', url: 'https://learn.microsoft.com/en-us/purview/audit-copilot' },
  ],
};
