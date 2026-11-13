import type { Concept } from '../../types';
import { acrAndAppServiceContainers } from './acr-and-app-service-containers';
import { containerAppsRevisionsAndKeda } from './container-apps-revisions-and-keda';
import { aksManifestsAndContainerTroubleshooting } from './aks-manifests-and-container-troubleshooting';
import { cosmosDbSdkQueriesAndPerformance } from './cosmos-db-sdk-queries-and-performance';
import { cosmosDbVectorSearchAndChangeFeed } from './cosmos-db-vector-search-and-change-feed';
import { postgresqlConnectionsSchemaAndPooling } from './postgresql-connections-schema-and-pooling';
import { postgresqlPgvectorIndexingAndRag } from './postgresql-pgvector-indexing-and-rag';
import { azureManagedRedisCachingAndVectorSearch } from './azure-managed-redis-caching-and-vector-search';
import { serviceBusAndEventGrid } from './service-bus-and-event-grid';
import { azureFunctionsTriggersBindingsAndHosting } from './azure-functions-triggers-bindings-and-hosting';
import { keyVaultAndAppConfiguration } from './key-vault-and-app-configuration';
import { opentelemetryTracingAndKql } from './opentelemetry-tracing-and-kql';

/**
 * Exam AI-200: Developing AI Cloud Solutions on Azure.
 * Ordered to follow the study guide: containerized solutions, AI solutions on
 * Azure data management services, connecting to and consuming Azure services,
 * then securing, monitoring and troubleshooting.
 */
export const ai200Concepts: Concept[] = [
  acrAndAppServiceContainers,
  containerAppsRevisionsAndKeda,
  aksManifestsAndContainerTroubleshooting,
  cosmosDbSdkQueriesAndPerformance,
  cosmosDbVectorSearchAndChangeFeed,
  postgresqlConnectionsSchemaAndPooling,
  postgresqlPgvectorIndexingAndRag,
  azureManagedRedisCachingAndVectorSearch,
  serviceBusAndEventGrid,
  azureFunctionsTriggersBindingsAndHosting,
  keyVaultAndAppConfiguration,
  opentelemetryTracingAndKql,
];
