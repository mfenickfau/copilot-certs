import type { Concept } from '../../types';

export const multiAgentPlatformComponents: Concept = {
  id: 'multi-agent-platform-components',
  title: 'Platform Components: Compute, Observability, Monitoring and Developer Tooling',
  summary:
    'Specifying the non-functional layer of a multi-agent solution on Azure: which compute to run agents on (Foundry prompt and hosted agents, Container Apps, Functions, AKS), what observability components deliver cross-service trace correlation, structured reasoning logs and replay, which monitoring components detect coordination failures, drift and regressions and trigger remediation, and the developer toolchain (azd ai, Foundry Toolkit for VS Code, Foundry Skill, dev containers, dependency management, AI instructions) that supports the SDLC.',
  certs: ['ai-500'],
  domains: ['ai-500-1'],
  outcomes: ['ai-500-1-2-4', 'ai-500-1-2-5', 'ai-500-1-2-6', 'ai-500-1-2-7'],
  tags: ['compute', 'hosted-agents', 'container-apps', 'observability', 'monitoring', 'azd', 'vs-code', 'dev-containers', 'sdlc'],
  difficulty: 'advanced',
  diagram: 'foundry-agent-stack',
  sections: [
    {
      heading: 'Choosing compute for agents',
      body: `Compute choice is a trade between control and operational burden, judged against scalability, reliability, operational efficiency, security and cost:

| Option | You manage | Platform manages | Best for |
|---|---|---|---|
| **Foundry prompt agent** | Instructions, model, tools | Everything else: runtime, scaling, identity, conversations, tracing | Declarative agents without custom orchestration code |
| **Foundry hosted agent** | Your code or framework as a container or zip | Managed endpoint, per-session VM-isolated sandbox with persistent \`$HOME\`, scale-to-zero, dedicated Entra identity, session state, telemetry | Custom orchestration (Agent Framework, LangGraph, your code) with the least infrastructure |
| **Azure Container Apps** | Container, scaling rules, ingress, identity wiring | Serverless container hosting, KEDA scaling, Dapr | Orchestrator APIs you want full control over; private MCP servers (internal ingress on a dedicated subnet) |
| **Azure Functions (Flex Consumption) + Durable Task** | Function code | Event triggers, scale to thousands or to zero | Event-driven agents, MCP servers, durable long-running orchestrations via the Agent Framework Durable Extension |
| **AKS** | Cluster, nodes, networking, upgrades | Kubernetes control plane | Teams already standardised on Kubernetes with strict placement or GPU needs |

Hosted agents are the default answer when the question stresses "least management" or "dedicated agent identity and session persistence". Specify the idle timeout (2 to 240 minutes, default 15), CPU and memory per sandbox, and for latency-sensitive agents reduce container readiness time (install and compile at image build, multistage images, memory snapshots). Reliability is a shared responsibility: Microsoft runs the control plane and runtime; in Standard setup you own durability of Cosmos DB, AI Search and Storage (zone redundancy, continuous backup, resource locks, ACR geo-replication). Foundry itself does not provide automatic cross-region failover, so a multi-region design needs your own traffic routing and duplicated projects.`,
    },
    {
      heading: 'Observability components: correlate, log reasoning, replay',
      body: `Observability for agents is built on **OpenTelemetry GenAI semantic conventions** (co-developed by Microsoft and Cisco Outshift for multi-agent systems) and **Azure Monitor Application Insights**:

- **Cross-service trace correlation.** Every agent run, model call, tool call and sub-agent invocation becomes a span under one trace id propagated via W3C Trace Context. Foundry emits server-side traces for prompt and hosted agents automatically once Application Insights is connected; Agent Framework, Semantic Kernel, LangChain/LangGraph and the OpenAI Agents SDK integrate through native instrumentation or OpenInference packages. An API Management AI gateway can stamp an \`X-Correlation-Id\` header so tool traffic joins the same trace. Hosted agents can export the same OTLP data to any collector in parallel with Application Insights.
- **Structured logging of reasoning paths.** Spans carry \`gen_ai.input.messages\`, \`gen_ai.output.messages\`, \`gen_ai.tool.call.arguments\` and results, token usage and latency. Because these are sensitive, route them to the protected \`AppGenAIContent\` table (feature flag \`protectGenAISensitiveData\`), set the table to Protected, and grant **Privileged Monitoring Data Reader** only to authorised identities. Disable content recording in production unless you need it.
- **Replay for reproducible debugging.** Foundry **Trace Replay** reconstructs a conversation from spans in a *Trajectories* view (span hierarchy, duration or token cost per step) and a *User* view (what the user saw), with playback controls and token-level filters. Agent Framework workflow **checkpoints** (captured at superstep boundaries, including an entry checkpoint of the input) make a run resumable and re-executable from any point. Together they answer "where did this response come from?" and "which step introduced the error?".`,
    },
    {
      heading: 'Monitoring components: coordination, drift, regression, remediation',
      body: `Monitoring turns telemetry into decisions. Specify these components:

- **Agent dashboard and Insights.** The per-agent **Monitor** tab shows token usage, latency, run success rate, evaluation scores and red-team results; **Insights in Foundry** analyses production traces for recurring behaviour in categories such as Context and memory, Cost and tokens, Hallucinations, Latency, Output quality, Reliability errors, Security and risk, and Tool call failures, each with evidence, likely cause and a recommended action.
- **Cross-agent coordination tracking.** Workflow-level spans (orchestration, planning, hand-offs) reveal stalls, loops and failed delegations; Magentic round and stall limits plus termination conditions bound them, and workflow failure events are alertable.
- **Behavioural drift and quality regression detection.** **Continuous evaluation** samples production traffic and scores it with evaluators (task adherence, intent resolution, tool call accuracy, groundedness); **scheduled evaluations** rerun a fixed test set to detect drift; **scheduled red teaming** probes for new vulnerabilities. Alerts fire when scores cross thresholds or latency and token usage spike.
- **Fleet view.** **Foundry Control Plane** (the Operate area) aggregates health, run completion, cost, compliance posture and prohibited behaviours across projects and even non-Foundry agents registered as external agents.
- **Automated remediation.** Alert rules trigger Azure Monitor action groups (Logic Apps, Functions, runbooks) to roll traffic back to a previous agent version, disable an endpoint, raise a ticket or pin a model version; Control Plane offers bulk remediation of non-compliant guardrail configurations. Design the remediation path when you design the alert, not after the incident.`,
    },
    {
      heading: 'Developer tools and environment for the SDLC',
      body: `An expert specifies the toolchain so that every environment, from laptop to CI runner, is reproducible:

- **Azure Developer CLI (azd) with the Foundry extensions** (\`azd ext install microsoft.foundry\`): \`azd ai agent init\` scaffolds a project with \`azure.yaml\` (services for project, agent, connections, toolboxes), \`azd ai agent run\` and \`invoke --local\` for local loops, \`azd up\` to provision and deploy, \`azd ai agent doctor\` for read-only health checks with CI-friendly exit codes, \`azd ai agent eval\` for structured quality gates, \`azd pipeline config\` for CI/CD, and \`--no-prompt\` plus \`--output json\` for automation and coding agents.
- **Foundry DevPack** installs azd and azd ai, the Foundry Skill, the Foundry Toolkit for VS Code and Foundry Canvas in one command.
- **Microsoft Foundry Toolkit for Visual Studio Code**: create prompt and hosted agents, **Agent Inspector** to send requests to a local agent with breakpoints and inspect model and tool activity, local trace collection, toolbox authoring and evaluation.
- **Dev containers** pin Python or .NET versions, the Azure CLI, azd and extensions so onboarding and CI match; keep secrets out of the image and inject them through environment variables or Key Vault references.
- **Dependency management**: a virtual environment or lock file (\`uv\`/\`pip\` with pinned \`agent-framework\`, \`azure-ai-projects>=2.x\`), \`PYTHONNOUSERSITE=1\` in images, and compiled dependencies at build time to cut cold starts.
- **AI instructions for coding agents**: the **Microsoft Foundry Skill** (\`npx skills add https://github.com/microsoft/azure-skills --skill microsoft-foundry\`) and the Agent Framework builder skill give GitHub Copilot, Copilot CLI or Claude Code reusable guidance for deployment, evaluation, tracing and troubleshooting; the Microsoft Learn MCP server (\`https://learn.microsoft.com/api/mcp\`) keeps them current. Treat these instruction files like code: versioned, reviewed, scoped.`,
    },
  ],
  examples: [
    {
      title: 'Selecting compute for a three-tier agent system',
      description:
        'A logistics company needs a conversational orchestrator, a webhook-triggered exception handler, and an internal MCP server over its TMS database that must not be internet-reachable. Specification: the orchestrator is a Foundry hosted agent (Responses protocol, dedicated identity, session persistence, least management); the exception handler is a hosted agent on the Invocations protocol; the MCP server runs on Azure Container Apps with internal-only ingress on a dedicated MCP subnet inside the BYO virtual network, reached by the agents through a toolbox.',
      takeaway: 'Use hosted agents for the agents themselves and Container Apps for private tool servers; the protocol follows the caller\'s payload shape.',
    },
    {
      title: 'Wiring Agent Framework telemetry to Foundry with a correlation span',
      description:
        'A hosted Agent Framework orchestrator configures Azure Monitor from the Foundry project, keeps sensitive content recording off in production, and wraps each incoming request in a parent span carrying the upstream correlation id so API gateway, orchestrator, sub-agents and tools share one trace.',
      language: 'python',
      code: `import os
from opentelemetry import trace
from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient
from agent_framework.observability import enable_instrumentation
from azure.identity.aio import DefaultAzureCredential

async def handle(request_text: str, correlation_id: str) -> str:
    async with DefaultAzureCredential() as cred:
        client = FoundryChatClient(credential=cred)                 # endpoint/model from env
        await client.configure_azure_monitor(enable_live_metrics=False)  # App Insights from project
        enable_instrumentation(enable_sensitive_data=os.getenv("ENV") != "prod")
        agent = Agent(client=client, name="Orchestrator", instructions="Coordinate specialists.")
        tracer = trace.get_tracer("contoso.orchestrator")
        with tracer.start_as_current_span("orchestrate") as span:
            span.set_attribute("contoso.correlation_id", correlation_id)
            result = await agent.run(request_text)
            return result.text`,
      takeaway: 'Correlate across services with a parent span and shared ids; record prompt content only outside production and protect it with RBAC.',
    },
    {
      title: 'Alerts with no remediation path (a realistic mistake)',
      description:
        'A team configured alerts on evaluation-score drops but the on-call runbook said only "investigate". A model version update degraded task adherence overnight and the alert sat unanswered for hours. The fix: tie the alert to an action group that runs a Logic App which calls azd ai agent endpoint update to route traffic back to the previous agent version, posts the Trace Replay link to the incident channel, and opens a ticket. Rollback became automatic; investigation happened afterwards with evidence.',
      takeaway: 'Specify remediation (automatic rollback, disable endpoint, pin version) as part of the monitoring design, not as a manual afterthought.',
    },
    {
      title: 'A reproducible developer environment',
      description:
        'A dev container pins Python 3.12, azd with the Foundry extensions, the Azure CLI and the Foundry Toolkit, and the repo carries an AGENTS.md plus the Microsoft Foundry Skill so coding agents follow the team\'s azd conventions. CI runs doctor first and fails fast if role assignments or variables are missing.',
      language: 'json',
      code: `{
  "name": "contoso-agents",
  "image": "mcr.microsoft.com/devcontainers/python:3.12",
  "features": {
    "ghcr.io/devcontainers/features/azure-cli:1": {},
    "ghcr.io/azure/azure-dev/azd:0": {}
  },
  "postCreateCommand": "azd ext install microsoft.foundry && pip install -r requirements.txt",
  "customizations": {
    "vscode": { "extensions": ["ms-python.python", "ms-azuretools.vscode-azure-ai-foundry"] }
  },
  "remoteEnv": { "PYTHONNOUSERSITE": "1" }
}`,
      takeaway: 'Dev containers plus pinned CLIs and skill files make laptop, CI and coding-agent environments identical.',
    },
  ],
  keyPoints: [
    'Foundry hosted agents give per-session VM-isolated sandboxes, persistent $HOME, scale-to-zero, a dedicated Entra identity and built-in telemetry with the least infrastructure; Container Apps, Functions and AKS trade more control for more management.',
    'Reliability is shared: Microsoft runs the runtime; you own durability of BYO Cosmos DB, AI Search, Storage, ACR and App Insights, and Foundry has no automatic cross-region failover.',
    'Observability rests on OpenTelemetry GenAI semantic conventions and Application Insights; prompt and hosted agents emit server-side traces automatically once App Insights is connected.',
    'Protect sensitive span content by routing it to the AppGenAIContent table, marking it Protected and granting Privileged Monitoring Data Reader selectively.',
    'Trace Replay (Trajectories and User views) and workflow checkpoints provide reproducible debugging of agent reasoning paths.',
    'Monitoring = agent dashboard, Insights, continuous and scheduled evaluation, scheduled red teaming, Control Plane fleet view, and alert-driven automated remediation such as version rollback.',
    'The developer toolchain is azd with Foundry extensions (init, run, invoke, doctor, eval, pipeline config), Foundry Toolkit for VS Code with Agent Inspector, dev containers, pinned dependencies and skill files for coding agents.',
  ],
  flashcards: [
    { front: 'Which compute option provides a dedicated Entra identity, per-session isolated sandbox and scale-to-zero with the least management?', back: 'Foundry hosted agents.' },
    { front: 'Where should a private MCP server run in a network-isolated Foundry setup?', back: 'Azure Container Apps with internal-only ingress on a dedicated MCP subnet delegated to Microsoft.App/environments.' },
    { front: 'What is the hosted agent idle timeout range and default?', back: '2 to 240 minutes; default 15 minutes.' },
    { front: 'Which standard do Foundry and Agent Framework traces follow?', back: 'OpenTelemetry GenAI semantic conventions (with multi-agent extensions), stored in Azure Monitor Application Insights.' },
    { front: 'How do you restrict access to prompts and tool arguments captured in traces?', back: 'Route them to the AppGenAIContent table, set it to Protected, and grant Privileged Monitoring Data Reader only to authorised identities.' },
    { front: 'What are the two views in Foundry Trace Replay?', back: 'Trajectories (span hierarchy with duration or token cost) and User (chat-style view of what the user experienced).' },
    { front: 'Name four categories Insights in Foundry reports.', back: 'Any of: Context and memory, Cost and tokens, Hallucinations, Latency, Output quality, Reliability errors, Security and risk, Tool call failures.' },
    { front: 'Which azd command performs read-only health checks with CI-stable exit codes?', back: 'azd ai agent doctor (exit 0 pass, 1 fail, 2 all skipped).' },
    { front: 'What does Foundry DevPack install?', back: 'azd and azd ai, the Microsoft Foundry Skill, the Foundry Toolkit for VS Code (if VS Code is present) and Foundry Canvas (if GitHub Copilot App is present).' },
    { front: 'What is the Microsoft Foundry Skill?', back: 'Reusable guidance installed into coding agents (GitHub Copilot, Copilot CLI, Claude Code) for Foundry deployment, evaluation, tracing and troubleshooting workflows.' },
    { front: 'Does Foundry provide automatic cross-region failover for agents?', back: 'No; you design multi-region deployments and failover of customer-managed dependencies yourself.' },
  ],
  quiz: [
    {
      question:
        'You must host a LangGraph orchestrator with minimal infrastructure management, a dedicated identity per agent, and conversation state that survives idle periods. Which compute component should you specify?',
      options: [
        'Azure Kubernetes Service with a custom operator.',
        'A Foundry hosted agent using the langchain-azure-ai hosting package.',
        'Azure Functions Consumption plan with HTTP triggers.',
        'A Foundry prompt agent.',
      ],
      correct: [1],
      explanation:
        'Hosted agents run your LangGraph code with a managed endpoint, dedicated Entra identity and session persistence. AKS maximises management, Functions lacks the session sandbox model, and prompt agents cannot run custom orchestration code.',
    },
    {
      question: 'Which TWO components are required for cross-service trace correlation across an API gateway, orchestrator agent and sub-agents? (Select two)',
      options: [
        'W3C Trace Context propagation with OpenTelemetry spans emitted by each component.',
        'A shared Application Insights (or OTLP collector) destination that receives spans from all components.',
        'Separate Log Analytics workspaces per agent so data stays small.',
        'Disabling sampling so every token is logged.',
      ],
      correct: [0, 1],
      explanation:
        'Correlation requires propagated trace context and a common backend to join spans. Separate workspaces fragment traces, and sampling is a cost control unrelated to correlation.',
    },
    {
      question:
        'Compliance asks you to let SREs view latency and token metrics for agents but not read user prompts captured in traces. What should you configure?',
      options: [
        'Disable tracing entirely.',
        'Route sensitive GenAI content to the AppGenAIContent table, set it to Protected, and grant Privileged Monitoring Data Reader only to the compliance team.',
        'Give SREs the Log Analytics Reader role and rely on them not to query prompts.',
        'Export traces to a storage account with public read access.',
      ],
      correct: [1],
      explanation:
        'Protected tables deny standard readers by default while metrics remain visible. Disabling tracing removes needed metrics, trust-based access is not a control, and public storage is insecure.',
    },
    {
      question:
        'A nightly model version update silently reduced task adherence. You want detection within hours and automatic reversion to the last good agent version. Which monitoring design meets this?',
      options: [
        'Weekly manual review of Trace Replay sessions.',
        'Continuous evaluation on sampled production traffic with an alert on the task-adherence threshold wired to an action group that routes traffic back to the previous agent version.',
        'A dashboard of token usage with no alerts.',
        'Increasing the content-filter blocking level.',
      ],
      correct: [1],
      explanation:
        'Continuous evaluation detects quality regression quickly and alert-driven remediation automates the rollback. Manual review is slow, token dashboards do not measure quality, and content filters are unrelated.',
    },
    {
      question:
        'A platform team wants laptops, CI runners and coding agents to use the same Python version, azd Foundry extensions and conventions. Which combination is MOST appropriate?',
      options: [
        'A wiki page describing the setup steps.',
        'A dev container that pins the runtime and CLIs, pinned dependencies in a lock file, and the Microsoft Foundry Skill plus repository instruction files for coding agents.',
        'Installing tools globally on each developer machine with sudo pip install.',
        'Giving every developer Owner on the subscription.',
      ],
      correct: [1],
      explanation:
        'Reproducible environments come from dev containers, pinned dependencies and versioned AI instructions. Wikis drift, global installs diverge, and broad RBAC is a security problem, not tooling.',
    },
    {
      question: 'Which azd command should run first in a CI job to fail fast when the runner lacks role assignments or environment variables?',
      options: ['azd ai agent doctor', 'azd ai agent invoke', 'azd ai agent eval run start', 'azd deploy --force'],
      correct: [0],
      explanation:
        'doctor performs read-only local and remote checks and returns CI-stable exit codes. invoke, eval and deploy all assume a healthy configuration.',
    },
  ],
  statements: [
    { text: 'Foundry hosted agents run each session in a VM-isolated sandbox with a persistent filesystem that is restored when the session resumes.', isTrue: true, explanation: 'This enables scale-to-zero with stateful resume.' },
    { text: 'Microsoft Foundry automatically fails agents over to another region during a regional outage.', isTrue: false, explanation: 'Foundry does not provide automatic failover; multi-region resilience is your design responsibility.' },
    { text: 'Server-side tracing for prompt and hosted agents requires adding instrumentation code to the agent.', isTrue: false, explanation: 'Connecting Application Insights to the project enables server-side traces without code changes; client-side instrumentation is an optional second step.' },
    { text: 'Insights in Foundry groups recurring production behaviour into categories such as Tool call failures and Cost and tokens, with evidence and recommended actions.', isTrue: true, explanation: 'It complements known-condition alerts by finding patterns you did not predefine.' },
    { text: 'azd ai agent doctor modifies the project to fix the failures it detects.', isTrue: false, explanation: 'doctor is read-only; it reports pass, fail or skip and suggests next steps.' },
    { text: 'Hosted agents can export telemetry to both Application Insights and an external OTLP endpoint at the same time.', isTrue: true, explanation: 'Independent environment variables enable each exporter.' },
    { text: 'Agent Inspector in the Foundry Toolkit for VS Code lets you debug a local agent with breakpoints while inspecting model and tool activity.', isTrue: true, explanation: 'It connects to a locally running Responses or Invocations server.' },
  ],
  resources: [
    { label: 'What are hosted agents? (Foundry Agent Service)', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents' },
    { label: 'Agent tracing overview in Microsoft Foundry', url: 'https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept' },
    { label: 'Agent development with the Azure Developer CLI', url: 'https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/cli-agent-development' },
    { label: 'Prepare your development environment (Foundry DevPack)', url: 'https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/install-cli-sdk' },
  ],
};
