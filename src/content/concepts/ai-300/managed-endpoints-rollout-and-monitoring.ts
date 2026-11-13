import type { Concept } from '../../types';

export const managedEndpointsRolloutAndMonitoring: Concept = {
  id: 'managed-endpoints-rollout-and-monitoring',
  title: 'Managed Endpoints, Safe Rollout and Production Model Monitoring',
  summary:
    'Deploying a registered model as a managed online or batch endpoint, testing and troubleshooting it, rolling out a new version with blue-green traffic splitting and mirrored traffic, and then closing the loop with model monitoring: data drift, prediction drift, data quality, performance signals and the alerts or Event Grid events that trigger retraining.',
  certs: ['ai-300', 'ai-500'],
  domains: ['ai-300-2', 'ai-500-4'],
  outcomes: ['ai-300-2-3-1', 'ai-300-2-3-2', 'ai-300-2-3-3', 'ai-300-2-4-1', 'ai-300-2-4-2', 'ai-300-2-4-3', 'ai-500-4-3-1'],
  tags: ['managed-online-endpoint', 'batch-endpoint', 'blue-green', 'mirrored-traffic', 'model-monitoring', 'data-drift', 'event-grid', 'azure-ml'],
  difficulty: 'intermediate',
  diagram: 'mlops-genaiops-loop',
  sections: [
    {
      heading: 'Online versus batch endpoints',
      body: `An **endpoint** is a stable HTTPS URL with authentication; a **deployment** is the set of resources (model, environment, code, compute) that serves requests behind it. One endpoint hosts several deployments, which is what makes safe rollout possible.

**Managed online endpoints** serve real-time, low-latency requests on Azure-managed VMs. You choose \`instance_type\` and \`instance_count\` (use at least three for high availability; Azure reserves 20 percent extra for upgrades), optional autoscaling, and \`auth_mode\`: \`key\` (never expires), \`aml_token\` (expires) or \`aad_token\` (Microsoft Entra). **Kubernetes online endpoints** run the same contract on AKS or Arc clusters you manage.

**Batch endpoints** run asynchronous scoring jobs over large data on a compute cluster: invoke with an input data asset or folder, control \`mini_batch_size\`, \`instance_count\` and \`output_action\` (append rows or summary only), and read results from the output datastore. They fit expensive models, many files and no latency requirement.

\`\`\`yaml
# endpoint.yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
name: churn-endpoint
auth_mode: aad_token
# blue.yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
name: blue
endpoint_name: churn-endpoint
model: azureml:churn-model:14            # MLflow model: no code_configuration needed
instance_type: Standard_DS3_v2
instance_count: 3
\`\`\`

\`az ml online-endpoint create -f endpoint.yml\` then \`az ml online-deployment create -f blue.yml --all-traffic\`. Custom models add \`code_configuration\` (scoring script with \`init()\` and \`run()\`) and an environment that includes the inference server. Managed online endpoints can also use a **managed identity** to reach downstream resources during scoring.`,
    },
    {
      heading: 'Testing and troubleshooting a deployment',
      body: `Test before and after you route traffic:

\`\`\`bash
# test one deployment without changing traffic
az ml online-endpoint invoke -n churn-endpoint --deployment-name green --request-file sample.json
# logs: inference server (default) or storage initializer
az ml online-deployment get-logs -e churn-endpoint -n green --lines 200
az ml online-deployment get-logs -e churn-endpoint -n green --container storage-initializer
# iterate locally in Docker before the cloud
az ml online-deployment create -f green.yml --local
\`\`\`

Map the symptom to the cause, which is how the exam tests this skill:

| Symptom | Likely cause and fix |
|---|---|
| \`OutOfQuota\` on create | Not enough cores for the VM family; request quota or change \`instance_type\` |
| \`ResourceNotReady\` or container restarts | \`init()\` fails or is slow; read inference-server logs, raise readiness probe timeouts |
| Storage initializer errors | Model or code could not be downloaded; check model path and workspace identity permissions |
| Container registry authorization failure | Workspace keys out of sync; run \`az ml workspace sync-keys\` or check ACR access |
| HTTP 424 or 5xx on invoke | Exception in \`run()\`; reproduce with \`--local\` or the inference HTTP server package |
| HTTP 429 | Too few instances or no autoscale; scale out |

Local deployment (\`--local\`) uses Docker on your machine and supports create, update, invoke and logs, which makes it the cheapest way to debug a scoring script. Application Insights, linked to the workspace, receives request latency, errors and console logs when \`app_insights_enabled: true\` is set on the deployment.`,
    },
    {
      heading: 'Progressive rollout and safe rollback with blue-green',
      body: `The safe rollout pattern uses one endpoint and two deployments: **blue** (current) and **green** (new).

1. Create \`green\` with **0 percent traffic**: \`az ml online-deployment create -f green.yml\` (no \`--all-traffic\`).
2. **Test in isolation** with \`invoke --deployment-name green\`.
3. **Mirror traffic**: \`az ml online-endpoint update -n churn-endpoint --mirror-traffic "green=10"\` copies 10 percent of live requests to green; clients still receive blue's responses, so green is validated on real data with zero user impact. Mirroring cannot exceed 50 percent and is not supported on Kubernetes online endpoints.
4. **Canary**: \`az ml online-endpoint update -n churn-endpoint --traffic "blue=90 green=10"\`, watch latency, errors and business metrics.
5. **Promote**: \`--traffic "blue=0 green=100"\`.
6. **Rollback** at any step is one command: \`--traffic "blue=100 green=0"\`. Because blue is still provisioned, rollback is instant.
7. Delete blue once green is proven: \`az ml online-deployment delete -n blue -e churn-endpoint\`.

\`\`\`python
endpoint = ml_client.online_endpoints.get("churn-endpoint")
endpoint.traffic = {"blue": 90, "green": 10}
ml_client.online_endpoints.begin_create_or_update(endpoint).result()
\`\`\`

Traffic percentages must sum to 100 across deployments. Scale a deployment before sending it traffic (\`az ml online-deployment update --set instance_count=3\`). This is the same blue-green and canary vocabulary used for agent releases: keep the old version alive until the new one proves itself, and make rollback a traffic change rather than a redeploy.`,
    },
    {
      heading: 'Model monitoring: drift, quality and performance signals',
      body: `Models decay because the world changes. **Azure ML model monitoring** compares **production inference data** (inputs and outputs collected from the deployment) with **reference data** (training, validation or recent production data) on a schedule and alerts when a metric crosses a threshold.

Step one is **data collection** on the deployment:

\`\`\`yaml
# in the deployment YAML
data_collector:
  collections:
    model_inputs: {enabled: 'True'}
    model_outputs: {enabled: 'True'}
\`\`\`

Collected data lands in Blob storage as a data asset you can also use for retraining. For batch endpoints or models deployed elsewhere you collect the data yourself and point the monitor at it.

Built-in **signals** and their metrics:

| Signal | Compares | Metrics |
|---|---|---|
| **Data drift** | Input feature distributions vs training or past production | Jensen-Shannon distance, Population Stability Index, normalised Wasserstein, two-sample Kolmogorov-Smirnov, Pearson chi-squared |
| **Prediction drift** | Output distribution vs validation or past production | Same family plus Chebyshev |
| **Data quality** | Input integrity | Null value rate, data type error rate, out-of-bounds rate |
| **Feature attribution drift** (preview) | Feature importance now vs training | Normalised discounted cumulative gain |
| **Model performance** (preview) | Predictions vs collected **ground truth** | Accuracy, precision, recall (classification); MAE, MSE, RMSE (regression) |

Best practice: use training data as the reference for data drift and data quality, validation data for prediction drift, monitor the **top N important features** to reduce noise and cost, set frequency to match data volume (daily for busy endpoints), and keep the reference and production **lookback windows** non-overlapping. You can add **custom signals** with your own component.`,
    },
    {
      heading: 'Thresholds, alerts and retraining triggers',
      body: `A monitor is an Azure ML **schedule** with a \`create_monitor\` block. Each signal has \`metric_thresholds\`; when one is exceeded the run raises an alert and emails the addresses in \`alert_notification\`.

\`\`\`yaml
$schema: http://azureml/sdk-2-0/Schedule.json
name: churn_monitor
trigger: {type: recurrence, frequency: day, interval: 1, schedule: {hours: 3, minutes: 15}}
create_monitor:
  compute: {instance_type: standard_e4s_v3, runtime_version: "3.4"}
  monitoring_target: {ml_task: classification, endpoint_deployment_id: azureml:churn-endpoint:green}
  monitoring_signals:
    drift:
      type: data_drift
      reference_data: {input_data: {path: azureml:churn_training:3, type: mltable}, data_context: training,
                       data_column_names: {target_column: churn}}
      features: {top_n_feature_importance: 10}
      metric_thresholds: {numerical: {jensen_shannon_distance: 0.01}, categorical: {pearsons_chi_squared_test: 0.02}}
  alert_notification: {emails: [mlops@contoso.com]}
\`\`\`

\`az ml schedule create -f monitor.yml\` turns it on. For automation beyond email, monitoring runs publish **Azure Event Grid** events (for example a run completed with drift detected). Subscribe an Azure Function, Logic App or a GitHub Actions webhook that submits the training pipeline (\`az ml job create -f pipeline.yml\`) and, after evaluation, registers a new version and rolls it out via the blue-green flow above. That is the MLOps loop: deploy, collect, monitor, trigger, retrain, register, roll out. Operational metrics (request latency, errors, CPU and memory) come from Azure Monitor and Application Insights on the endpoint, and **metric alerts** there cover the infrastructure side; model monitoring covers the statistical side. The classic distractor is "retrain on a fixed weekly schedule regardless of drift": acceptable as a fallback, but threshold-triggered retraining is the answer when the question asks about exceeding thresholds.`,
    },
  ],
  examples: [
    {
      title: 'Blue-green rollout script in CI',
      description:
        'The release workflow deploys green with no traffic, runs a smoke invoke, mirrors 10 percent for an hour, then shifts traffic in two steps. Any failed check reverts traffic to blue, which never left.',
      language: 'bash',
      code: `set -e
EP=churn-endpoint
az ml online-deployment create -f deploy/green.yml -e $EP           # 0% traffic
az ml online-endpoint invoke -n $EP --deployment-name green --request-file tests/sample.json
az ml online-endpoint update -n $EP --mirror-traffic "green=10"
sleep 3600 && python tests/compare_mirror_metrics.py || { az ml online-endpoint update -n $EP --mirror-traffic "green=0"; exit 1; }
az ml online-endpoint update -n $EP --mirror-traffic "green=0"
az ml online-endpoint update -n $EP --traffic "blue=90 green=10"
python tests/check_slo.py || { az ml online-endpoint update -n $EP --traffic "blue=100 green=0"; exit 1; }
az ml online-endpoint update -n $EP --traffic "blue=0 green=100"`,
      takeaway: 'Rollback is a traffic update, not a redeploy, because the previous deployment stays alive until you delete it.',
    },
    {
      title: 'Batch scoring of a monthly file drop',
      description:
        'A credit-risk model scores 40 million rows once a month. A batch endpoint with a deployment on cpu-cluster is invoked by the data pipeline when the files land; results are appended to a Parquet output in the default datastore.',
      language: 'bash',
      code: `az ml batch-endpoint create --name risk-batch
az ml batch-deployment create -f batch-deploy.yml --set-default
# batch-deploy.yml: model azureml:risk-model:7, compute azureml:cpu-cluster,
#   settings: {instance_count: 4, mini_batch_size: 10, output_action: append_row, output_file_name: scores.parquet}
az ml batch-endpoint invoke --name risk-batch --input azureml:risk_inputs_2026_11:1 --query name -o tsv`,
      takeaway: 'Batch endpoints trade latency for throughput and cost; the invocation is a job you can poll, not a synchronous call.',
    },
    {
      title: 'Monitor says "no drift" while accuracy falls (a realistic mistake and the fix)',
      description:
        'A team enabled data drift monitoring on the top 10 features and saw no alerts, yet downstream KPIs dropped. Ground-truth labels arrive two weeks later and were never wired in, so the monitor had no model performance signal. The fix adds a model performance signal joined on a correlation ID that the data collector stores, plus a prediction drift signal against the validation set, and routes the Event Grid event to a retraining pipeline.',
      language: 'yaml',
      code: `monitoring_signals:
  performance:
    type: model_performance
    production_data:
      - input_data: {path: azureml:churn_model_outputs:latest, type: uri_folder}
        data_context: model_outputs
        data_column_names: {prediction: churn_pred, correlation_id: correlationid}
      - input_data: {path: azureml:churn_ground_truth:latest, type: uri_folder}
        data_context: ground_truth_data
        data_column_names: {actual: churn_actual, correlation_id: correlationid}
    metric_thresholds: {classification: {accuracy: 0.85, recall: 0.70}}
    alert_enabled: true`,
      takeaway: 'Input drift is a proxy; when labels exist, monitor actual performance and let the threshold, not the calendar, trigger retraining.',
    },
  ],
  keyPoints: [
    'An endpoint is the stable URL and auth boundary; deployments behind it hold model, environment, code and compute, and traffic is split across them.',
    'Managed online endpoints: instance_type, instance_count (3+ for HA), auth_mode key / aml_token / aad_token; MLflow models deploy with no scoring script.',
    'Batch endpoints run asynchronous scoring jobs on a compute cluster with mini_batch_size, instance_count and output_action.',
    'Test with az ml online-endpoint invoke --deployment-name, debug with get-logs (inference server or storage-initializer) and --local Docker deployments.',
    'Blue-green: create green with 0 traffic, test, mirror up to 50 percent, canary split, promote to 100, roll back by resetting traffic to blue.',
    'Model monitoring compares collected production inputs/outputs with reference data on a schedule; enable data_collector on the deployment first.',
    'Signals: data drift (JS distance, PSI, Wasserstein, KS, chi-squared), prediction drift, data quality (nulls, type errors, out-of-bounds), feature attribution drift (NDCG), model performance (needs ground truth).',
    'Thresholds raise email alerts and Event Grid events; subscribe automation that submits the retraining pipeline when a threshold is exceeded.',
  ],
  flashcards: [
    { front: 'What is the difference between an endpoint and a deployment?', back: 'The endpoint is the stable URL with authentication; a deployment is the model, environment, code and compute behind it. One endpoint can route traffic to several deployments.' },
    { front: 'Which auth_mode values can a managed online endpoint use?', back: 'key (no expiry), aml_token (expiring token) and aad_token (Microsoft Entra token).' },
    { front: 'How do you send live traffic copies to a new deployment without affecting client responses?', back: 'Mirrored traffic: az ml online-endpoint update --mirror-traffic "green=10" (max 50 percent, managed online endpoints only).' },
    { front: 'What is the fastest rollback after a bad canary?', back: 'Reset traffic: az ml online-endpoint update --traffic "blue=100 green=0"; blue is still provisioned.' },
    { front: 'Which CLI command shows container logs for a deployment?', back: 'az ml online-deployment get-logs -e <endpoint> -n <deployment> (add --container storage-initializer for download issues).' },
    { front: 'What must be enabled on a deployment before Azure ML model monitoring can use its production data?', back: 'The data_collector with model_inputs and model_outputs collections.' },
    { front: 'Name three metrics used by the data drift signal.', back: 'Jensen-Shannon distance, Population Stability Index, normalised Wasserstein distance (also two-sample KS and Pearson chi-squared).' },
    { front: 'Which monitoring signal requires ground truth data?', back: 'Model performance (accuracy/precision/recall or MAE/MSE/RMSE).' },
    { front: 'What are the three data quality metrics?', back: 'Null value rate, data type error rate and out-of-bounds rate.' },
    { front: 'How can a drift alert start a retraining pipeline automatically?', back: 'Subscribe to the Azure Event Grid events emitted by model monitoring runs and trigger a Function, Logic App or CI workflow that submits the pipeline job.' },
    { front: 'When should you use a batch endpoint instead of an online endpoint?', back: 'Large volumes of data, expensive models, many files and no low-latency requirement.' },
  ],
  quiz: [
    {
      question:
        'You must validate a new model version against real production requests before any user receives its predictions. Which action meets this requirement?',
      options: [
        'Deploy green with --all-traffic and monitor errors',
        'Deploy green with 0 percent traffic and configure mirrored traffic of 10 percent to green',
        'Deploy green to a separate endpoint and ask clients to switch',
        'Set traffic to blue=50 green=50',
      ],
      correct: [1],
      explanation:
        'Mirroring copies requests to green while clients still get blue responses. --all-traffic and a 50/50 split expose users; a separate endpoint requires client changes and does not replay live traffic.',
    },
    {
      question:
        'A managed online deployment fails to create with a ResourceNotReady error. Logs show the scoring script raises an exception while loading the model in init(). What is the MOST efficient next step?',
      options: [
        'Increase instance_count to 3',
        'Recreate the deployment locally with --local and debug the scoring script in Docker',
        'Change auth_mode to key',
        'Request more quota for the VM family',
      ],
      correct: [1],
      explanation:
        'Local deployment reproduces init() failures quickly without cloud provisioning. More instances or quota do not fix code errors, and auth mode is unrelated.',
    },
    {
      question:
        'A classification model receives ground truth labels three days after prediction. The team wants an alert when production accuracy drops below 0.85 and wants automation to start retraining. Which TWO configurations are required? (Select two)',
      options: [
        'A model performance signal joining model outputs with ground truth on a correlation ID, with an accuracy threshold',
        'A data quality signal with a null value rate threshold',
        'An Event Grid subscription on model monitoring events that triggers the retraining pipeline',
        'A weekly cron schedule that always retrains',
      ],
      correct: [0, 2],
      explanation:
        'Model performance monitoring needs ground truth joined to predictions, and Event Grid provides the trigger. Data quality does not measure accuracy, and unconditional weekly retraining ignores the threshold requirement.',
    },
    {
      question:
        'You deploy a model that scores 50 million records every night from Parquet files. Latency per record does not matter but cost does. Which deployment option fits best?',
      options: [
        'Managed online endpoint with autoscaling',
        'Batch endpoint with a deployment on an autoscaling compute cluster',
        'Kubernetes online endpoint on AKS',
        'A compute instance running a notebook on a schedule',
      ],
      correct: [1],
      explanation:
        'Batch endpoints are built for asynchronous high-volume scoring on clusters that scale to zero afterwards. Online endpoints are for real-time requests, and notebooks are not a production serving mechanism.',
    },
    {
      question:
        'After promoting green to 100 percent, an issue appears two hours later. Blue has not been deleted. What is the fastest safe rollback?',
      options: [
        'Redeploy the previous model version as a new deployment',
        'Update endpoint traffic to blue=100 green=0',
        'Delete the green deployment',
        'Scale blue to zero instances and restart it',
      ],
      correct: [1],
      explanation:
        'Traffic reassignment is immediate because blue is still provisioned. Redeploying takes minutes, deleting green leaves no deployment with traffic until you reassign, and scaling blue down is the opposite of what is needed.',
    },
    {
      question: 'Which reference data should you use for a prediction drift signal according to Microsoft guidance?',
      options: [
        'The training data',
        'The validation data or recent past production data',
        'Ground truth labels',
        'The model\'s feature importance from training',
      ],
      correct: [1],
      explanation:
        'Prediction drift compares output distributions with validation data (or recent production). Training data is the reference for data drift and quality, ground truth feeds the performance signal, and feature importance feeds feature attribution drift.',
    },
  ],
  statements: [
    { text: 'Mirrored traffic can be set to 100 percent so that every request is duplicated to the new deployment.', isTrue: false, explanation: 'Mirrored traffic is capped at 50 percent.' },
    { text: 'Deleting the blue deployment before verifying green removes the fast rollback path.', isTrue: true, explanation: 'Rollback by traffic update requires the previous deployment to still exist.' },
    { text: 'Azure ML model monitoring can monitor models deployed outside Azure ML if you collect the production inference data yourself.', isTrue: true, explanation: 'You bring the data; the monitor computes the signals.' },
    { text: 'The data drift signal requires ground truth labels.', isTrue: false, explanation: 'Only the model performance signal needs ground truth; drift compares distributions.' },
    { text: 'By default a model monitoring alert emails the user who created the monitor when a threshold is exceeded.', isTrue: true, explanation: 'Emails are the default channel; Event Grid enables automation.' },
    { text: 'A managed online endpoint can host only one deployment at a time.', isTrue: false, explanation: 'Multiple deployments per endpoint with traffic splitting is the basis of blue-green rollout.' },
    { text: 'Traffic percentages across deployments under an endpoint must total 100.', isTrue: true, explanation: 'Live traffic allocation always sums to 100; mirrored traffic is separate.' },
  ],
  resources: [
    { label: 'Perform safe rollout of new deployments for real-time inference', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-safely-rollout-online-endpoints' },
    { label: 'Troubleshoot online endpoint deployment and scoring', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-troubleshoot-online-endpoints' },
    { label: 'Azure Machine Learning model monitoring', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/concept-model-monitoring' },
    { label: 'Monitor performance of models deployed to production', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-monitor-model-performance' },
  ],
};
