import type { Concept } from '../../types';
import { agentSolutionPlanning } from './agent-solution-planning';
import { agentFlowsBuild } from './agent-flows-build';
import { agentFlowsHitlMonitoring } from './agent-flows-hitl-monitoring';
import { topicsToolsAndVariables } from './topics-tools-and-variables';
import { responseFormattingAdaptiveCards } from './response-formatting-adaptive-cards';
import { generativeAnswersPromptsHttp } from './generative-answers-prompts-http';
import { enterpriseKnowledgeSources } from './enterprise-knowledge-sources';
import { connectorAndRestApiTools } from './connector-and-rest-api-tools';
import { mcpAndComputerUse } from './mcp-and-computer-use';
import { multiAgentCollaboration } from './multi-agent-collaboration';
import { azureFoundryIntegration } from './azure-foundry-integration';
import { agentEvaluationTesting } from './agent-evaluation-testing';
import { almSolutionsPipelines } from './alm-solutions-pipelines';

/**
 * AB-620: Designing and Building Integrated AI Agent Solutions in Copilot Studio
 * (Microsoft Certified: AI Agent Builder Associate).
 */
export const ab620Concepts: Concept[] = [
  agentSolutionPlanning,
  agentFlowsBuild,
  agentFlowsHitlMonitoring,
  topicsToolsAndVariables,
  responseFormattingAdaptiveCards,
  generativeAnswersPromptsHttp,
  enterpriseKnowledgeSources,
  connectorAndRestApiTools,
  mcpAndComputerUse,
  multiAgentCollaboration,
  azureFoundryIntegration,
  agentEvaluationTesting,
  almSolutionsPipelines,
];
