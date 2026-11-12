import type { Concept } from '../../types';

export const zeroTrustAndThreatProtection: Concept = {
  id: 'zero-trust-and-threat-protection',
  title: 'Zero Trust, Authentication, Authorisation and Microsoft Defender XDR',
  summary:
    'The three Zero Trust principles, the difference between proving who you are (authentication) and what you may do (authorisation), which Entra authentication methods are phishing-resistant, and how threat protection and Microsoft Defender XDR deliver the "assume breach" principle.',
  certs: ['ab-900'],
  domains: ['ab-900-1'],
  outcomes: ['ab-900-1-2-1', 'ab-900-1-2-2', 'ab-900-1-2-3', 'ab-900-1-2-4', 'ab-900-1-2-5'],
  tags: ['zero-trust', 'authentication', 'authorization', 'mfa', 'defender-xdr', 'threat-protection', 'fundamentals'],
  difficulty: 'foundations',
  sections: [
    {
      heading: 'Zero Trust: never trust, always verify',
      body: `**Zero Trust** is a security model, not a product. It replaces the old assumption that anything inside the corporate network is safe with a simple rule: *never trust, always verify*. Every request is treated as if it came from an open network, whoever and wherever it comes from. Microsoft frames it as three principles:

1. **Verify explicitly.** Authenticate and authorise using *all* available signals: identity, device health, location, application, data sensitivity and real-time risk. Verification is continuous, not a one-off at sign-in.
2. **Use least privilege access.** Give users and workloads only the access they need, for the shortest time needed: just-in-time and just-enough access, risk-based adaptive policies, and data protection that follows the content.
3. **Assume breach.** Design as if an attacker is already inside. Segment access to limit blast radius, encrypt end to end, and use analytics to detect and respond quickly.

Why does this sit in a Copilot administration exam? Because Copilot amplifies whatever access already exists. Microsoft's own guidance for preparing a tenant for Copilot is organised around these three principles: verify identities and devices with Conditional Access, fix oversharing so least privilege is real, and rely on Defender and Purview to detect misuse. When a scenario asks which Zero Trust principle an action supports, map it: MFA and device compliance are *verify explicitly*; removing "Everyone" permissions and using PIM are *least privilege*; Defender XDR and auditing are *assume breach*.`,
    },
    {
      heading: 'Authentication: proving who you are',
      body: `**Authentication** answers "are you really this user?". Microsoft Entra ID supports many methods, and the exam expects you to rank them.

- **Password** alone is the weakest primary method.
- **Multifactor authentication (MFA)** adds a second factor: Microsoft Authenticator push notifications (with number matching), software or hardware OATH tokens, SMS or voice call. These block most password attacks but can still be phished in real time because the user types or approves a code.
- **Passwordless and phishing-resistant** methods bind the credential to the device and the site, so there is nothing to relay: **Windows Hello for Business**, **passkeys (FIDO2)** including security keys and passkeys in Microsoft Authenticator, **certificate-based authentication** and Platform Credential for macOS. Microsoft recommends these for everyone and especially for administrators.
- **Temporary Access Pass (TAP)** is a time-limited passcode used to onboard a user or recover access so they can register a strong method.
- **Self-service password reset (SSPR)** lets users recover without the help desk, using registered methods.

Admins manage all of this under **Entra ID > Protection > Authentication methods**, where a policy decides which methods each group may register and use. **Authentication strengths** let a Conditional Access policy demand a particular class of method (for example "phishing-resistant MFA" for admins). The simplest exam heuristic: if the scenario needs the strongest protection against phishing, choose a FIDO2 passkey or Windows Hello for Business, not SMS.`,
    },
    {
      heading: 'Authorisation: deciding what you may do',
      body: `**Authorisation** happens after authentication and answers "what is this identity allowed to do?". In Microsoft 365 it is layered:

- **Microsoft Entra roles** (Global Administrator, User Administrator, AI Administrator and dozens more) authorise *administrative* actions. Microsoft's rule is least privilege: use the narrowest role that completes the task and keep Global Administrators to a handful.
- **Workload permissions** authorise *data* access: SharePoint groups and sharing links, mailbox permissions, Teams membership, Purview role groups. These are what Copilot inherits when it searches on a user's behalf.
- **Application permissions and consent** authorise *apps*. Delegated permissions act as the signed-in user; application permissions act as the app itself. Admin consent is required for high-privilege scopes, and the user consent setting decides whether users can grant low-risk permissions to apps on their own.
- **Conditional Access** is the policy engine that combines authentication results with signals (device, location, risk) to decide grant, block or require more, and so bridges authentication and authorisation.

A memorable contrast: authentication is checked at the door; authorisation is checked at every room. A compromised but low-privilege account does less damage, which is why least-privilege roles, Privileged Identity Management and tidy SharePoint permissions are authorisation controls that reduce breach impact.`,
    },
    {
      heading: 'Threat protection, threat intelligence and Defender XDR',
      body: `**Threat protection** is the set of services that prevent, detect and respond to attacks across the estate:

- **Microsoft Defender for Office 365** protects email and collaboration: anti-phishing, **Safe Links** (time-of-click URL checks), **Safe Attachments** (detonation in a sandbox), and, in Plan 2, attack simulation training and automated investigation. All cloud mailboxes also get built-in Exchange Online Protection.
- **Defender for Endpoint** protects devices; **Defender for Identity** watches on-premises Active Directory; **Defender for Cloud Apps** governs SaaS usage, including discovering unsanctioned generative-AI apps; **Defender Vulnerability Management** tracks exposure.
- **Threat intelligence** is the knowledge behind the detections: Microsoft analyses trillions of signals a day and publishes **threat analytics** reports and **Microsoft Defender Threat Intelligence** data about actors, campaigns and indicators so defenders can prioritise.

**Microsoft Defender XDR** (extended detection and response) is the layer that stitches these products together in the **Microsoft Defender portal** (security.microsoft.com). Its distinctive capabilities are:

- A single **incidents** queue that correlates alerts from endpoints, identities, email and apps into one attack story.
- **Automatic attack disruption**, which contains in-progress attacks (for example disabling a compromised account) using high-confidence cross-product signals.
- **Automated investigation and response** that self-heals mailboxes, devices and identities.
- **Advanced hunting** with KQL across all the data, and **Microsoft Secure Score** for posture.

For Copilot specifically, Defender XDR receives risky-AI-usage signals from Purview Insider Risk Management and shows an AI agent inventory, which is the "assume breach" leg of a Copilot deployment.`,
    },
  ],
  examples: [
    {
      title: 'Mapping a hardening plan to the three principles',
      description:
        'Before a Copilot rollout, Contoso lists its actions: require MFA for all users and compliant devices for Copilot (verify explicitly); remove "Everyone except external users" from 40 SharePoint sites and move admins to PIM (least privilege); turn on Defender for Office 365 Safe Links and review Defender XDR incidents weekly (assume breach). Labelling each action makes gaps visible: nothing covered device health until the compliance requirement was added.',
      takeaway: 'Zero Trust is a checklist of three principles; a good plan has controls under each one.',
    },
    {
      title: 'The MFA that was still phished (a realistic mistake)',
      description:
        'An administrator uses SMS codes for MFA. An attacker sends a convincing sign-in page that forwards the username, password and SMS code to Microsoft in real time, and the attacker gets a session. The remediation is to require phishing-resistant authentication (a FIDO2 passkey or Windows Hello for Business) for administrators through an authentication strength in Conditional Access.',
      takeaway: 'SMS and codes can be relayed; passkeys and Windows Hello cannot. Protect privileged accounts with phishing-resistant methods.',
    },
    {
      title: 'One incident instead of five alerts',
      description:
        'A user clicks a phishing link, enters credentials, and the attacker signs in from a new country and starts mass-forwarding mail. Defender for Office 365, Entra ID Protection and Defender for Cloud Apps each raise an alert. Defender XDR correlates them into a single incident, automatic attack disruption disables the account, and the analyst sees the whole chain in one view instead of triaging five separate alerts.',
      takeaway: 'Defender XDR correlates cross-product alerts into incidents and can disrupt attacks automatically.',
    },
  ],
  keyPoints: [
    'Zero Trust principles: verify explicitly, use least privilege access, assume breach; it is a model, not a product.',
    'Authentication proves identity; authorisation decides what the identity may do. Conditional Access sits between them as the policy engine.',
    'Phishing-resistant methods are Windows Hello for Business, passkeys (FIDO2), passkeys in Authenticator and certificate-based authentication; SMS, voice and codes are weaker MFA.',
    'Temporary Access Pass onboards users to passwordless methods; authentication strengths let policies demand a class of method.',
    'Authorisation layers: Entra admin roles (least privilege), workload permissions that Copilot inherits, app permissions and consent.',
    'Defender for Office 365 (Safe Links, Safe Attachments, anti-phishing), Defender for Endpoint, Identity and Cloud Apps provide threat protection; threat analytics and Defender Threat Intelligence supply the intelligence.',
    'Defender XDR correlates alerts into incidents in the Microsoft Defender portal, performs automatic attack disruption and automated investigation, and offers advanced hunting with KQL.',
  ],
  flashcards: [
    { front: 'Name the three Zero Trust principles.', back: 'Verify explicitly, use least privilege access, assume breach.' },
    { front: 'Which Zero Trust principle does removing broad "Everyone" permissions from SharePoint support?', back: 'Use least privilege access.' },
    { front: 'Authentication vs authorisation in one line?', back: 'Authentication verifies who you are; authorisation decides what you are allowed to do.' },
    { front: 'Name three phishing-resistant authentication methods in Entra ID.', back: 'Windows Hello for Business, passkeys (FIDO2 security keys or passkeys in Authenticator), certificate-based authentication.' },
    { front: 'What is a Temporary Access Pass?', back: 'A time-limited passcode an admin issues so a user can sign in and register strong methods, or recover access.' },
    { front: 'What does an authentication strength do?', back: 'Lets a Conditional Access policy require a specific class of methods, such as phishing-resistant MFA.' },
    { front: 'Which Defender product protects email with Safe Links and Safe Attachments?', back: 'Microsoft Defender for Office 365.' },
    { front: 'What is automatic attack disruption?', back: 'A Defender XDR capability that uses high-confidence correlated signals to contain an in-progress attack automatically, for example by disabling a user.' },
    { front: 'Where is the Defender XDR incidents queue?', back: 'In the Microsoft Defender portal (security.microsoft.com).' },
    { front: 'Which query language does advanced hunting use?', back: 'Kusto Query Language (KQL).' },
  ],
  quiz: [
    {
      question: 'Contoso requires administrators to prove their identity with a method that cannot be phished through a fake sign-in page. Which authentication method should you require?',
      options: ['SMS one-time code', 'Voice call approval', 'Passkey (FIDO2) security key', 'Software OATH token'],
      correct: [2],
      explanation:
        'FIDO2 passkeys are bound to the legitimate site and device, so they cannot be relayed. SMS, voice and OATH codes can all be captured and replayed by a real-time phishing proxy.',
    },
    {
      question: 'An administrator removes the "Everyone except external users" group from 30 SharePoint sites before enabling Copilot. Which Zero Trust principle does this action MOST directly apply?',
      options: ['Verify explicitly', 'Use least privilege access', 'Assume breach', 'Defence in depth'],
      correct: [1],
      explanation:
        'Trimming broad access so people hold only what they need is least privilege. Verify explicitly is about authentication signals, assume breach about detection and containment, and defence in depth is not one of the three Zero Trust principles.',
    },
    {
      question: 'A user signs in successfully with MFA but cannot open a confidential SharePoint library. Which statement BEST describes the situation?',
      options: [
        'Authentication failed because MFA was not strong enough.',
        'Authentication succeeded but authorisation denied access because the user lacks permission to the library.',
        'Conditional Access blocked the sign-in.',
        'The user needs a Copilot licence to open the library.',
      ],
      correct: [1],
      explanation:
        'The sign-in (authentication) completed; the library permission (authorisation) is missing. Conditional Access would have blocked the sign-in, and licences do not grant SharePoint permissions.',
    },
    {
      question: 'Which TWO capabilities are provided by Microsoft Defender XDR rather than by a single Defender product? (Select two)',
      options: [
        'Correlating alerts from email, endpoints, identities and apps into a single incident',
        'Scanning email attachments in a sandbox before delivery',
        'Automatic attack disruption using cross-product signals',
        'Applying a sensitivity label to a document',
      ],
      correct: [0, 2],
      explanation:
        'Incident correlation and automatic attack disruption are XDR-level features. Attachment sandboxing is Defender for Office 365 Safe Attachments, and labelling is a Purview Information Protection capability.',
    },
    {
      question: 'Which service protects users from malicious URLs by checking them at the time of click in email and Teams?',
      options: ['Microsoft Defender for Endpoint', 'Microsoft Defender for Office 365 Safe Links', 'Microsoft Entra ID Protection', 'Microsoft Purview DLP'],
      correct: [1],
      explanation:
        'Safe Links is the time-of-click URL protection in Defender for Office 365. Defender for Endpoint protects devices, ID Protection detects risky identities, and DLP protects sensitive data.',
    },
    {
      question: 'A new employee has no registered authentication methods and must set up a passkey on their first day. What should the administrator issue?',
      options: ['A Temporary Access Pass', 'A permanent SMS-only policy', 'A Global Reader role', 'A Conditional Access exclusion'],
      correct: [0],
      explanation:
        'A Temporary Access Pass is a time-limited credential for onboarding to passwordless methods. SMS weakens security, roles are unrelated, and excluding the user from Conditional Access removes protection.',
    },
  ],
  statements: [
    { text: 'Zero Trust is a product you license from Microsoft.', isTrue: false, explanation: 'It is a security model implemented with many products and processes.' },
    { text: 'Verification in Zero Trust is continuous rather than a single check at sign-in.', isTrue: true, explanation: 'Signals are re-evaluated throughout the session as conditions change.' },
    { text: 'SMS-based MFA is considered phishing-resistant.', isTrue: false, explanation: 'SMS codes can be relayed by real-time phishing; passkeys, Windows Hello and certificates are phishing-resistant.' },
    { text: 'Authorisation decides which resources an authenticated identity can access.', isTrue: true, explanation: 'Authentication proves identity; authorisation grants or denies actions.' },
    { text: 'Microsoft Defender XDR is accessed through the Microsoft Defender portal.', isTrue: true, explanation: 'security.microsoft.com is the single pane for incidents, hunting and Secure Score.' },
    { text: 'Defender for Office 365 Safe Attachments protects on-premises file servers from ransomware.', isTrue: false, explanation: 'Safe Attachments detonates email and collaboration attachments; endpoint protection is Defender for Endpoint.' },
    { text: 'Threat analytics in the Defender portal provides intelligence on active campaigns and threat actors.', isTrue: true, explanation: 'It is Microsoft\'s curated threat intelligence surfaced to defenders.' },
  ],
  resources: [
    { label: 'Zero Trust overview (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview' },
    { label: 'Authentication methods in Microsoft Entra ID', url: 'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-methods' },
    { label: 'What is Microsoft Defender XDR?', url: 'https://learn.microsoft.com/en-us/defender-xdr/microsoft-365-defender' },
    { label: 'Apply Zero Trust principles to Microsoft 365 Copilot', url: 'https://learn.microsoft.com/en-us/security/zero-trust/copilots/zero-trust-microsoft-365-copilot' },
  ],
};
