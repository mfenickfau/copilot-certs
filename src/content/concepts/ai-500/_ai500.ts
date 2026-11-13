import type { Concept } from '../../types';
import { decomposingGoalsIntoAgentWorkflows } from './decomposing-goals-into-agent-workflows';
import { agentCommunicationProtocolsMcpA2a } from './agent-communication-protocols-mcp-a2a';
import { memoryAndContextManagement } from './memory-and-context-management';
import { zeroTrustSecurityForAgents } from './zero-trust-security-for-agents';
import { multiAgentPlatformComponents } from './multi-agent-platform-components';
import { advancedPromptingAndFineTuning } from './advanced-prompting-and-fine-tuning';
import { multiAgentRagAndKnowledge } from './multi-agent-rag-and-knowledge';
import { toolEcosystemsAndMcpServers } from './tool-ecosystems-and-mcp-servers';
import { orchestrationPatternsAndFrameworks } from './orchestration-patterns-and-frameworks';
import { scalingCachingAndMiddleware } from './scaling-caching-and-middleware';
import { evaluationAndContinuousImprovement } from './evaluation-and-continuous-improvement';
import { observabilityTracingAndCost } from './observability-tracing-and-cost';
import { layeredGuardrailsForAgents } from './layered-guardrails-for-agents';
import { releaseStrategiesAndCicd } from './release-strategies-and-cicd';

/**
 * Exam AI-500: Designing and Implementing Multi-Agent AI Solutions
 * (Microsoft Certified: Multi-Agent AI Solutions Expert).
 * Ordered to follow the four functional groups of the study guide.
 */
export const ai500Concepts: Concept[] = [
  // Architect multi-agent solutions
  decomposingGoalsIntoAgentWorkflows,
  agentCommunicationProtocolsMcpA2a,
  memoryAndContextManagement,
  zeroTrustSecurityForAgents,
  multiAgentPlatformComponents,
  // Develop multi-agent solutions in Azure
  advancedPromptingAndFineTuning,
  multiAgentRagAndKnowledge,
  toolEcosystemsAndMcpServers,
  orchestrationPatternsAndFrameworks,
  scalingCachingAndMiddleware,
  // Evaluate, optimize, and monitor
  evaluationAndContinuousImprovement,
  observabilityTracingAndCost,
  // Secure, govern, and deploy
  layeredGuardrailsForAgents,
  releaseStrategiesAndCicd,
];
