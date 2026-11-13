import type { Concept } from '../../types';

export const mlflowTrackingAndTrainingJobs: Concept = {
  id: 'mlflow-tracking-and-training-jobs',
  title: 'Experiment Tracking with MLflow, Notebooks and Command Jobs',
  summary:
    'How training becomes an auditable record: MLflow experiments and runs on the workspace tracking server, notebooks on compute instances for exploration, command jobs that run scripts reproducibly, and the studio and MLflow APIs used to compare metrics across jobs.',
  certs: ['ai-300'],
  domains: ['ai-300-2'],
  outcomes: ['ai-300-2-1-1', 'ai-300-2-1-3', 'ai-300-2-1-5', 'ai-300-2-1-8'],
  tags: ['mlflow', 'experiment-tracking', 'command-job', 'notebooks', 'compute-instance', 'azure-ml', 'sdk-v2'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'MLflow is the tracking layer of Azure Machine Learning',
      body: `Azure Machine Learning workspaces are **MLflow-compatible tracking servers**. Every Azure ML **job** is an MLflow **run**, grouped into **experiments**. Metrics, parameters, artifacts and models you log with the standard MLflow API land in the workspace, so code written against MLflow runs unchanged locally, on a compute instance or inside a job.

Setup is two packages and, when running outside Azure ML, one URI:

\`\`\`python
# pip install mlflow azureml-mlflow azure-ai-ml
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential
import mlflow

ml_client = MLClient.from_config(DefaultAzureCredential())
mlflow.set_tracking_uri(ml_client.workspaces.get(ml_client.workspace_name).mlflow_tracking_uri)
mlflow.set_experiment("churn-baseline")

with mlflow.start_run(run_name="lr-c0.5") as run:
    mlflow.log_param("C", 0.5)
    mlflow.log_metric("auc", 0.91)
    mlflow.sklearn.log_model(model, "model")
\`\`\`

Inside an Azure ML job you do **not** set the tracking URI or the experiment; the job injects them, and \`experiment_name\` in the job YAML decides the grouping. \`mlflow.autolog()\` captures parameters, metrics and the model for supported frameworks (scikit-learn, PyTorch Lightning, XGBoost and others) with one line. Logging the **model** with an MLflow flavor (\`mlflow.<flavor>.log_model\`) is what later enables no-code deployment and \`mlflow.register_model\` with lineage. Some MLflow server features differ on Azure ML, for example model stages and renaming are not supported, so read the support matrix when a question hinges on an exotic API.`,
    },
    {
      heading: 'Notebooks for exploration, scripts for everything else',
      body: `Exploration happens in **notebooks** on a **compute instance**: the studio Notebooks experience, JupyterLab or VS Code (desktop or web) connected to the instance. The instance has the SDK, CLI, Git and conda preinstalled, and the notebook files live on the workspace file share so they survive instance deletion and are visible to teammates.

Operational hygiene the exam rewards:

- One compute instance per person; it cannot be shared concurrently.
- Enable **idle shutdown** or a start/stop **schedule** to control cost.
- Use **kernels per conda environment**; create one from your \`conda.yml\` so the notebook matches the job environment.
- Run **MLflow tracking from the notebook** (\`mlflow.set_experiment\`, \`mlflow.start_run\`) so interactive results are comparable with jobs.

Notebooks are not the production unit. When an approach works, move the code into \`src/train.py\` with argument parsing and MLflow logging, and submit it as a **command job**. The notebook then becomes a thin "submit and inspect" driver using \`ml_client.jobs.create_or_update(job)\`. The distractor pattern is "schedule the notebook on the compute instance"; the correct answer is a job on a cluster or serverless compute, scheduled or triggered by CI.`,
    },
    {
      heading: 'Command jobs: the reproducible unit of training',
      body: `A **command job** runs a command in an environment on a compute target with declared inputs and outputs. Everything about it is captured: code snapshot, environment version, data asset versions, parameters, Git commit, logs and MLflow metrics.

\`\`\`yaml
# job.yml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
experiment_name: churn-training
display_name: lr-baseline
code: ./src
command: >-
  python train.py --data \${{inputs.training_data}} --C \${{inputs.C}}
  --model_out \${{outputs.model}}
inputs:
  training_data:
    type: uri_folder
    path: azureml:churn_training:3
    mode: ro_mount
  C: 0.5
outputs:
  model:
    type: mlflow_model
environment: azureml:churn-train-env:7
compute: azureml:cpu-cluster
\`\`\`

Submit with \`az ml job create -f job.yml\` (add \`--stream\` to follow logs) or with the SDK \`command()\` builder. Input modes matter: \`ro_mount\` streams data on demand, \`download\` copies it first (better for many small files), \`direct\` passes the URI for the script to handle. Output type \`mlflow_model\` tells Azure ML the folder is an MLflow model so it can be registered directly from the job. Use \`resources.instance_count\` and \`distribution\` for multi-node, and \`identity\` to run the job under a managed identity for identity-based data access. The SDK equivalent is \`from azure.ai.ml import command, Input, Output\`.`,
    },
    {
      heading: 'Comparing performance across jobs',
      body: `With consistent metric names, comparison is a query. In **studio**, open the experiment, select several jobs and choose **Compare** to see metrics side by side and chart them; the **Metrics** tab of a single job plots logged series such as loss per epoch. Child jobs of a sweep appear under the parent with a parallel-coordinates chart.

Programmatically, \`mlflow.search_runs\` returns a DataFrame you can sort and filter:

\`\`\`python
runs = mlflow.search_runs(
    experiment_names=["churn-training"],
    filter_string="metrics.auc > 0.88 and tags.stage = 'candidate'",
    order_by=["metrics.auc DESC"],
    max_results=10,
)
best_run_id = runs.loc[0, "run_id"]
\`\`\`

Then \`mlflow.register_model(f"runs:/{best_run_id}/model", "churn-model")\` promotes the winner with lineage intact. Compare like with like: the same evaluation dataset version, the same metric definition and the same split. The exam frequently describes two jobs with different test sets and asks why the comparison is invalid. Tags (\`mlflow.set_tag\`) and \`display_name\` are how you make large experiments searchable; artifacts such as confusion matrices or ROC plots are logged with \`mlflow.log_artifact\` or \`mlflow.log_figure\` and viewed in the job's Outputs + logs tab.`,
    },
  ],
  examples: [
    {
      title: 'From notebook experiment to tracked job',
      description:
        'A data scientist proves a gradient boosting approach in a notebook on her compute instance, logging to the churn-training experiment with MLflow so the result sits next to earlier runs. She then moves the code to src/train.py and submits it from the same notebook as a command job on cpu-cluster, so the official candidate run has a code snapshot, pinned data version and environment.',
      language: 'python',
      code: `from azure.ai.ml import MLClient, command, Input, Output
from azure.identity import DefaultAzureCredential

ml_client = MLClient.from_config(DefaultAzureCredential())
job = command(
    code="./src",
    command="python train.py --data \${{inputs.data}} --n_estimators \${{inputs.n}} --model_out \${{outputs.model}}",
    inputs={"data": Input(type="uri_folder", path="azureml:churn_training:3"), "n": 400},
    outputs={"model": Output(type="mlflow_model")},
    environment="azureml:churn-train-env:7",
    compute="cpu-cluster",
    experiment_name="churn-training",
    display_name="gbm-n400",
)
returned = ml_client.jobs.create_or_update(job)
ml_client.jobs.stream(returned.name)`,
      takeaway: 'Notebooks explore; command jobs produce the reproducible, comparable record.',
    },
    {
      title: 'Autolog plus a custom metric',
      description:
        'Inside train.py the team enables mlflow.autolog() to capture hyperparameters and standard metrics automatically, then logs a business metric (expected revenue saved) that the framework does not know about. Both appear in studio and in search_runs.',
      language: 'python',
      code: `import argparse, mlflow, pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import roc_auc_score

p = argparse.ArgumentParser(); p.add_argument("--data"); p.add_argument("--n_estimators", type=int); p.add_argument("--model_out")
a = p.parse_args()
mlflow.autolog()                      # params, metrics, model
df = pd.read_parquet(a.data)
X, y = df.drop(columns="churn"), df["churn"]
model = GradientBoostingClassifier(n_estimators=a.n_estimators).fit(X, y)
mlflow.log_metric("revenue_saved_eur", float((model.predict_proba(X)[:, 1] > 0.5).sum() * 120))
mlflow.sklearn.save_model(model, a.model_out)   # output folder registered as mlflow_model`,
      takeaway: 'autolog covers the framework metrics; log_metric adds the metric the business actually decides on.',
    },
    {
      title: 'Invalid comparison (a realistic mistake and the fix)',
      description:
        'Two candidate jobs report AUC 0.93 and 0.90, and the team is about to promote the first. A reviewer notices job one evaluated on churn_training:2 (an older, easier split) while job two used version 3. The fix is to parameterise the evaluation data asset version, rerun both on version 3, tag the runs with the data version, and only then compare with search_runs.',
      language: 'python',
      code: `import mlflow
with mlflow.start_run(run_name="gbm-n400-eval-v3"):
    mlflow.set_tag("eval_data", "churn_training:3")
    mlflow.set_tag("stage", "candidate")
    mlflow.log_metric("auc", auc)

runs = mlflow.search_runs(experiment_names=["churn-training"],
                          filter_string="tags.eval_data = 'churn_training:3' and tags.stage = 'candidate'",
                          order_by=["metrics.auc DESC"])`,
      takeaway: 'Metrics are only comparable when the evaluation data version and metric definition match; tags make that filterable.',
    },
  ],
  keyPoints: [
    'An Azure ML workspace is an MLflow tracking server: jobs are runs, grouped into experiments; install mlflow and azureml-mlflow.',
    'Outside a job, set the tracking URI from the workspace (mlflow_tracking_uri) and call set_experiment; inside a job both are injected and experiment_name in the YAML decides the grouping.',
    'mlflow.autolog() captures params, metrics and the model for supported frameworks; log the model with an MLflow flavor to enable no-code deployment and lineage.',
    'Notebooks run on a single-owner compute instance for exploration; production training is a command job on a cluster or serverless compute.',
    'A command job pins code, command, inputs (with modes ro_mount, download, direct), outputs, environment and compute; submit with az ml job create -f or the SDK command() builder.',
    'Output type mlflow_model marks a job output as a registrable MLflow model.',
    'Compare jobs in studio with Compare and the Metrics tab, or programmatically with mlflow.search_runs filtered and ordered by metrics.',
    'Only compare runs that used the same evaluation data version and metric definition; use tags to make that explicit.',
  ],
  flashcards: [
    { front: 'Which two Python packages are needed to use MLflow tracking against an Azure ML workspace from outside a job?', back: 'mlflow and azureml-mlflow (plus azure-ai-ml to look up the tracking URI).' },
    { front: 'How does an Azure ML job know which MLflow experiment to log to?', back: 'From the experiment_name property in the job definition; the tracking URI and experiment are injected automatically.' },
    { front: 'What does mlflow.autolog() do?', back: 'Automatically logs parameters, metrics and the trained model for supported frameworks without explicit log calls.' },
    { front: 'Which job output type should you declare so the trained model can be registered directly as an MLflow model?', back: 'type: mlflow_model.' },
    { front: 'What is the difference between ro_mount and download input modes?', back: 'ro_mount streams data from storage on demand; download copies the data to the compute before the script starts.' },
    { front: 'Where do notebook files on a compute instance persist?', back: 'On the workspace file share (mounted under ~/cloudfiles/code), so they survive instance deletion.' },
    { front: 'Which MLflow API returns runs as a DataFrame for comparison?', back: 'mlflow.search_runs(experiment_names=..., filter_string=..., order_by=...).' },
    { front: 'How do you register the best model from a run while preserving lineage?', back: 'mlflow.register_model("runs:/<run_id>/<artifact_path>", "<model_name>").' },
    { front: 'Which CLI flag streams job logs to the terminal on submission?', back: 'az ml job create -f job.yml --stream.' },
    { front: 'Can two data scientists share one compute instance at the same time?', back: 'No. A compute instance has a single owner; create one per person.' },
  ],
  quiz: [
    {
      question:
        'A data scientist runs experiments in a local VS Code environment and wants metrics to appear in the Azure ML workspace next to pipeline jobs. What is the minimum change to the training code?',
      options: [
        'Replace all logging with the Azure ML SDK v1 Run.log API',
        'Set the MLflow tracking URI to the workspace tracking URI and set the experiment name',
        'Upload the notebook to the compute instance and run it there',
        'Register the local machine as a compute target',
      ],
      correct: [1],
      explanation:
        'Azure ML is MLflow-compatible; pointing the tracking URI at the workspace and setting an experiment is enough. SDK v1 is legacy, running on the instance is not required, and local machines are not registered as targets.',
    },
    {
      question:
        'A team schedules a notebook to run nightly on a compute instance to retrain a model. Which TWO problems does this approach cause compared with a command job? (Select two)',
      options: [
        'No code snapshot, environment version or data version is captured for reproducibility',
        'MLflow cannot be used from notebooks',
        'The compute instance is single-owner and stays running, incurring cost and a single point of failure',
        'Notebooks cannot read from datastores',
      ],
      correct: [0, 2],
      explanation:
        'Jobs capture snapshots and versions and run on autoscaling compute; notebooks on an instance do neither. MLflow works fine in notebooks and notebooks can read datastores.',
    },
    {
      question:
        'You submit a command job and want the output folder produced by train.py to be registrable as a model without a scoring script. Which output configuration is correct?',
      options: [
        'outputs: model: {type: uri_folder}',
        'outputs: model: {type: mlflow_model}',
        'outputs: model: {type: custom_model}',
        'outputs: model: {type: uri_file}',
      ],
      correct: [1],
      explanation:
        'mlflow_model marks the folder as an MLflow model, enabling registration and no-code deployment. uri_folder is generic, custom_model requires a scoring script, and uri_file is a single file.',
    },
    {
      question:
        'Two jobs in the same experiment report AUC 0.94 and 0.91. Before promoting the better one, what should you verify FIRST?',
      options: [
        'That both jobs used the same compute size',
        'That both jobs evaluated on the same data asset version with the same metric definition',
        'That both jobs ran for the same duration',
        'That both jobs used curated environments',
      ],
      correct: [1],
      explanation:
        'Metrics are only comparable on the same evaluation data and definition. Compute size, duration and environment type do not affect the validity of the comparison.',
    },
    {
      question: 'Which approach retrieves the ten best runs of an experiment by a logged metric for programmatic comparison?',
      options: [
        'ml_client.jobs.list() sorted by creation time',
        'mlflow.search_runs(experiment_names=[...], order_by=["metrics.auc DESC"], max_results=10)',
        'az ml job show on each job individually',
        'Reading the job logs from the default datastore',
      ],
      correct: [1],
      explanation:
        'search_runs filters and orders by metrics directly. jobs.list does not sort by metrics, job show is one at a time, and logs are not structured metrics.',
    },
  ],
  statements: [
    { text: 'Inside an Azure ML job you must call mlflow.set_tracking_uri() before logging metrics.', isTrue: false, explanation: 'The job injects the tracking URI and experiment; only code running outside Azure ML needs to set them.' },
    { text: 'mlflow.autolog() can log the trained model as well as parameters and metrics.', isTrue: true, explanation: 'For supported frameworks autolog records params, metrics and the model artifact.' },
    { text: 'A compute instance can be shared by two data scientists running notebooks simultaneously.', isTrue: false, explanation: 'Compute instances are single-user; each person needs their own.' },
    { text: 'Jobs in Azure ML correspond to MLflow runs.', isTrue: true, explanation: 'Azure ML calls MLflow runs "jobs"; experiments group them.' },
    { text: 'The download input mode is often better than ro_mount for datasets made of many small files.', isTrue: true, explanation: 'Downloading avoids per-file mount latency.' },
    { text: 'Azure ML supports MLflow model stages (Staging, Production) for deployment selection.', isTrue: false, explanation: 'Deployment from a model stage and model renaming are not supported on Azure ML; use versions and tags.' },
  ],
  resources: [
    { label: 'Track experiments and models by using MLflow', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-use-mlflow-cli-runs' },
    { label: 'Train models with Azure Machine Learning CLI, SDK, and REST API', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-train-model' },
    { label: 'Run Jupyter notebooks in your workspace', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-run-jupyter-notebooks' },
    { label: 'Track, monitor, and analyze jobs', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-track-monitor-analyze-runs' },
  ],
};
