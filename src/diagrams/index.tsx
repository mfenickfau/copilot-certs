import type { ComponentType } from 'react';
import { AgenticLoop, ContextWindow, McpArchitecture, OrchestrationPatterns, ToolUseSequence, WorkflowVsAgent } from './set1';
import { CoordinatorSubagents, EscalationDecision, EvalLoop, LayeredGuardrails, PromptInjectionDefense, RagPipeline, StructuredOutputFlow } from './set2';
import {
  AgenticSdlc,
  CopilotDataProtection,
  CopilotExtensibilityOptions,
  CopilotStudioAgentAnatomy,
  FoundryAgentStack,
  M365CopilotSystem,
  MlopsGenaiopsLoop,
  ResponsibleAiPrinciples,
} from './microsoft';

interface Meta {
  title: string;
  caption: string;
  component: ComponentType;
}

/**
 * Every diagram a concept can reference via `Concept.diagram`.
 * Add a new one here and in set1/set2 (or a new file).
 */
export const diagrams: Record<string, Meta> = {
  'm365-copilot-system': {
    title: 'How Microsoft 365 Copilot works',
    caption: 'Prompt, grounding in Microsoft Graph and Work IQ, the LLM, responsible-AI checks, and the response, all inside the tenant boundary.',
    component: M365CopilotSystem,
  },
  'copilot-studio-agent-anatomy': {
    title: 'Anatomy of a Copilot Studio agent',
    caption: 'Instructions, knowledge, tools and actions, topics, triggers, channels and the orchestrator that ties them together.',
    component: CopilotStudioAgentAnatomy,
  },
  'copilot-data-protection': {
    title: 'Data protection layers for Copilot',
    caption: 'Identity and permissions, sensitivity labels, DLP, retention and audit, and how each one shapes what Copilot can use.',
    component: CopilotDataProtection,
  },
  'copilot-extensibility-options': {
    title: 'Copilot extensibility options',
    caption: 'Prebuilt agents, declarative agents, Copilot Studio agents, custom engine agents and connectors, by effort and control.',
    component: CopilotExtensibilityOptions,
  },
  'foundry-agent-stack': {
    title: 'Microsoft Foundry agent stack',
    caption: 'Models, tools and knowledge, Foundry Agent Service, evaluation and safety, and observability for production agents.',
    component: FoundryAgentStack,
  },
  'responsible-ai-principles': {
    title: 'Responsible AI principles',
    caption: "Microsoft's six principles and the product controls that implement each one.",
    component: ResponsibleAiPrinciples,
  },
  'agentic-sdlc': {
    title: 'Agentic software development lifecycle',
    caption: 'Where GitHub Copilot completions, chat, agent mode, the coding agent and code review sit in the SDLC, with human checkpoints.',
    component: AgenticSdlc,
  },
  'mlops-genaiops-loop': {
    title: 'MLOps and GenAIOps loop',
    caption: 'Data and prompts, training or tuning, evaluation, deployment, monitoring and feedback for classic ML and generative AI.',
    component: MlopsGenaiopsLoop,
  },
  'agentic-loop': {
    title: 'The agentic loop',
    caption: 'Request, inspect stop_reason, execute the requested tool, append the result, repeat until end_turn.',
    component: AgenticLoop,
  },
  'workflow-vs-agent': {
    title: 'Workflow vs agent',
    caption: 'In a workflow your code decides the path; in an agent the model decides it from tool results.',
    component: WorkflowVsAgent,
  },
  'orchestration-patterns': {
    title: 'Orchestration patterns',
    caption: 'Prompt chaining, routing, parallelization, orchestrator-workers and evaluator-optimizer.',
    component: OrchestrationPatterns,
  },
  'context-window': {
    title: 'The context window as a budget',
    caption: 'System, tools, history and the new turn share one window with the output. Tool results grow fastest.',
    component: ContextWindow,
  },
  'mcp-architecture': {
    title: 'MCP architecture',
    caption: 'A host runs one MCP client per server; servers expose tools, resources and prompts over stdio or HTTP.',
    component: McpArchitecture,
  },
  'tool-use-sequence': {
    title: 'Tool use message sequence',
    caption: 'The five-step exchange between your application and the API when the model calls a tool.',
    component: ToolUseSequence,
  },
  'prompt-injection-defense': {
    title: 'Prompt injection and defense in depth',
    caption: 'Untrusted content can carry instructions; layered controls stop them from becoming actions.',
    component: PromptInjectionDefense,
  },
  'rag-pipeline': {
    title: 'RAG pipeline',
    caption: 'Offline indexing and online retrieval, with the design choices that matter most.',
    component: RagPipeline,
  },
  'eval-loop': {
    title: 'Evaluation loop',
    caption: 'Eval set, candidate, grading, metrics, diagnosis, and production feedback.',
    component: EvalLoop,
  },
  'escalation-decision': {
    title: 'Escalation decision flow',
    caption: 'When a support agent should resolve autonomously and when it must hand off.',
    component: EscalationDecision,
  },
  'layered-guardrails': {
    title: 'Layered guardrails',
    caption: 'Governance, input, capability, model and output layers, with monitoring around all of them.',
    component: LayeredGuardrails,
  },
  'coordinator-subagents': {
    title: 'Coordinator and subagents',
    caption: 'Hub-and-spoke delegation with isolated context, scoped tools and structured results.',
    component: CoordinatorSubagents,
  },
  'structured-output-flow': {
    title: 'Structured output flow',
    caption: 'Schema-constrained generation, semantic validation, retry with feedback, and human routing.',
    component: StructuredOutputFlow,
  },
};

export const diagramIds = Object.keys(diagrams);
export const diagramMeta: Record<string, { title: string; caption: string }> = Object.fromEntries(
  Object.entries(diagrams).map(([k, v]) => [k, { title: v.title, caption: v.caption }]),
);

export function Diagram({ id }: { id: string }) {
  const d = diagrams[id];
  if (!d) return <p className="muted small">Diagram "{id}" is not registered.</p>;
  const C = d.component;
  return (
    <div className="diagram">
      <C />
    </div>
  );
}
