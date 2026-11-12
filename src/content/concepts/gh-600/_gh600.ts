import type { Concept } from '../../types';
import { agentsInTheSdlc } from './agents-in-the-sdlc';
import { planThenAct } from './plan-then-act';
import { autonomyObservabilityAndControl } from './autonomy-observability-and-control';
import { agentToolsAndPermissions } from './agent-tools-and-permissions';
import { mcpServersRegistriesAndAllowlists } from './mcp-servers-registries-and-allowlists';
import { agentExecutionContexts } from './agent-execution-contexts';
import { safeExecutionAndErrorHandling } from './safe-execution-and-error-handling';
import { agentMemoryStrategies } from './agent-memory-strategies';
import { statePersistenceAndContextDrift } from './state-persistence-and-context-drift';
import { evaluationSignalsAndSuccessCriteria } from './evaluation-signals-and-success-criteria';
import { failureAnalysisAndTuning } from './failure-analysis-and-tuning';
import { multiAgentOrchestration } from './multi-agent-orchestration';
import { multiAgentObservabilityAndRecovery } from './multi-agent-observability-and-recovery';
import { guardrailsAndHumanInTheLoop } from './guardrails-and-human-in-the-loop';

export const gh600Concepts: Concept[] = [
  agentsInTheSdlc,
  planThenAct,
  autonomyObservabilityAndControl,
  agentToolsAndPermissions,
  mcpServersRegistriesAndAllowlists,
  agentExecutionContexts,
  safeExecutionAndErrorHandling,
  agentMemoryStrategies,
  statePersistenceAndContextDrift,
  evaluationSignalsAndSuccessCriteria,
  failureAnalysisAndTuning,
  multiAgentOrchestration,
  multiAgentObservabilityAndRecovery,
  guardrailsAndHumanInTheLoop,
];
