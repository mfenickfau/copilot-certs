import type { Concept } from '../../types';
import { choosingFoundryModelsAndServices } from './choosing-foundry-models-and-services';
import { foundryInfrastructureDeploymentsAndCicd } from './foundry-infrastructure-deployments-and-cicd';
import { managingMonitoringAndSecuringAiSystems } from './managing-monitoring-and-securing-ai-systems';
import { guardrailsAndResponsibleAiGovernance } from './guardrails-and-responsible-ai-governance';
import { connectingAppsAndConsumingFoundryModels } from './connecting-apps-and-consuming-foundry-models';
import { ragAndToolAugmentedWorkflows } from './rag-and-tool-augmented-workflows';
import { evaluationAndObservability } from './evaluation-and-observability';
import { buildingAgentsWithFoundryAgentService } from './building-agents-with-foundry-agent-service';
import { multiAgentOrchestrationAndApprovalFlows } from './multi-agent-orchestration-and-approval-flows';
import { imageAndVideoGeneration } from './image-and-video-generation';
import { multimodalImageUnderstanding } from './multimodal-image-understanding';
import { contentUnderstandingAndDocumentIntelligence } from './content-understanding-and-document-intelligence';
import { textAnalysisAndTranslation } from './text-analysis-and-translation';
import { speechForAgents } from './speech-for-agents';
import { retrievalAndGroundingPipelines } from './retrieval-and-grounding-pipelines';

/**
 * Exam AI-103: Developing AI Apps and Agents on Azure.
 * Ordered to follow the study guide: plan and manage, generative AI and agents,
 * computer vision, text analysis, information extraction.
 */
export const ai103Concepts: Concept[] = [
  choosingFoundryModelsAndServices,
  foundryInfrastructureDeploymentsAndCicd,
  managingMonitoringAndSecuringAiSystems,
  guardrailsAndResponsibleAiGovernance,
  connectingAppsAndConsumingFoundryModels,
  ragAndToolAugmentedWorkflows,
  evaluationAndObservability,
  buildingAgentsWithFoundryAgentService,
  multiAgentOrchestrationAndApprovalFlows,
  imageAndVideoGeneration,
  multimodalImageUnderstanding,
  contentUnderstandingAndDocumentIntelligence,
  textAnalysisAndTranslation,
  speechForAgents,
  retrievalAndGroundingPipelines,
];
