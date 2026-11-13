import type { Concept } from '../../types';
import { mlWorkspaceDatastoresCompute } from './ml-workspace-datastores-compute';
import { mlAssetsEnvironmentsComponentsRegistries } from './ml-assets-environments-components-registries';
import { mlIacGithubActionsNetworking } from './ml-iac-github-actions-networking';
import { mlflowTrackingAndTrainingJobs } from './mlflow-tracking-and-training-jobs';
import { automlSweepsDistributedPipelines } from './automl-sweeps-distributed-pipelines';
import { modelRegistrationAndResponsibleAi } from './model-registration-and-responsible-ai';
import { managedEndpointsRolloutAndMonitoring } from './managed-endpoints-rollout-and-monitoring';
import { foundryResourcesIdentityNetworking } from './foundry-resources-identity-networking';
import { foundationModelDeploymentAndPtu } from './foundation-model-deployment-and-ptu';
import { promptDesignVariantsVersioning } from './prompt-design-variants-versioning';
import { genaiEvaluationAndSafety } from './genai-evaluation-and-safety';
import { genaiObservabilityTracingCost } from './genai-observability-tracing-cost';
import { ragOptimizationHybridSearch } from './rag-optimization-hybrid-search';
import { fineTuningLifecycleSyntheticData } from './fine-tuning-lifecycle-synthetic-data';

/**
 * Exam AI-300: Operationalizing Machine Learning and Generative AI Solutions.
 * Ordered to follow the study guide: MLOps infrastructure, ML model lifecycle,
 * GenAIOps infrastructure, GenAI quality and observability, optimisation.
 */
export const ai300Concepts: Concept[] = [
  mlWorkspaceDatastoresCompute,
  mlAssetsEnvironmentsComponentsRegistries,
  mlIacGithubActionsNetworking,
  mlflowTrackingAndTrainingJobs,
  automlSweepsDistributedPipelines,
  modelRegistrationAndResponsibleAi,
  managedEndpointsRolloutAndMonitoring,
  foundryResourcesIdentityNetworking,
  foundationModelDeploymentAndPtu,
  promptDesignVariantsVersioning,
  genaiEvaluationAndSafety,
  genaiObservabilityTracingCost,
  ragOptimizationHybridSearch,
  fineTuningLifecycleSyntheticData,
];
