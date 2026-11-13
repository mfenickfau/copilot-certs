import type { Concept } from '../../types';

export const automlSweepsDistributedPipelines: Concept = {
  id: 'automl-sweeps-distributed-pipelines',
  title: 'Automated ML, Hyperparameter Sweeps, Distributed Training and Pipelines',
  summary:
    'The four job types that turn a single training script into an orchestrated search for the best model: AutoML jobs that pick algorithms, sweep jobs that tune hyperparameters with sampling and early termination, distributed jobs for deep learning across GPUs, and pipeline jobs that chain components into a repeatable training workflow.',
  certs: ['ai-300'],
  domains: ['ai-300-2'],
  outcomes: ['ai-300-2-1-2', 'ai-300-2-1-4', 'ai-300-2-1-6', 'ai-300-2-1-7'],
  tags: ['automl', 'sweep', 'hyperparameter-tuning', 'distributed-training', 'pipelines', 'components', 'azure-ml'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Automated ML: let the service search algorithms and featurisation',
      body: `**Automated machine learning (AutoML)** trains many candidate pipelines (algorithm plus featurisation plus hyperparameters) against a **primary metric** and returns the best model, ready to register and deploy. In v2 it is just another job type, submitted from YAML or the SDK. Tabular tasks are **classification**, **regression** and **forecasting**; there are also computer vision and NLP tasks.

\`\`\`yaml
# automl.yml
$schema: https://azuremlschemas.azureedge.net/latest/autoMLJob.schema.json
type: automl
task: classification
experiment_name: churn-automl
compute: azureml:cpu-cluster
training_data:
  type: mltable
  path: azureml:churn_tabular:1
target_column_name: churn
primary_metric: AUC_weighted
n_cross_validations: 5
limits:
  timeout_minutes: 60
  max_trials: 40
  max_concurrent_trials: 4
  enable_early_termination: true
featurization:
  mode: auto
training:
  enable_model_explainability: true
  blocked_training_algorithms: [LightGBM]
\`\`\`

Facts the exam checks: training data **must be an MLTable**; \`limits\` (time, trials, concurrency) are the cost control; \`featurization\` can be auto, off or custom; you can allow or block specific algorithms; \`enable_model_explainability\` produces explanations for the best model; validation can be a separate dataset, cross-validation or a holdout percentage. Forecasting adds \`forecasting.time_column_name\`, \`forecast_horizon\` and optional time-series IDs. AutoML is the answer when the scenario says "explore many models quickly with minimal code"; it is **not** the answer when the data scientist needs a custom architecture or a specific loss.`,
    },
    {
      heading: 'Sweep jobs: automated hyperparameter tuning',
      body: `A **sweep job** wraps a command job (the **trial**) and runs it many times with different hyperparameter values drawn from a **search space**. Your script must log the objective metric with the exact name used in \`primary_metric\`.

\`\`\`yaml
# sweep.yml
$schema: https://azuremlschemas.azureedge.net/latest/sweepJob.schema.json
type: sweep
experiment_name: churn-sweep
trial:
  code: ./src
  command: python train.py --lr \${{search_space.lr}} --depth \${{search_space.depth}}
  environment: azureml:churn-train-env:7
compute: azureml:cpu-cluster
sampling_algorithm: bayesian
search_space:
  lr: {type: loguniform, min_value: -6.9, max_value: -2.3}
  depth: {type: choice, values: [4, 6, 8, 12]}
objective: {goal: maximize, primary_metric: auc}
limits: {max_total_trials: 40, max_concurrent_trials: 4, timeout: 7200}
\`\`\`

Choose the **sampling algorithm**: **grid** exhaustively enumerates discrete choices (small spaces only); **random** samples discrete and continuous distributions and is the usual starting point; **bayesian** learns from previous trials to pick promising values and needs fewer trials but works best with low concurrency. Choose an **early termination policy** to kill poor trials: **bandit** (slack factor or amount from the best run), **median stopping** (below the running median), **truncation selection** (bottom X percent each interval). Each takes \`evaluation_interval\` and \`delay_evaluation\`. Bayesian sampling does **not** support early termination policies. Continuous distributions are \`uniform\`, \`loguniform\`, \`normal\`, \`lognormal\` and their quantised \`q\` variants; discrete is \`choice\`. The sweep's child jobs show in studio with a parallel-coordinates chart; the best child's model is the one you register.`,
    },
    {
      heading: 'Distributed training for large and deep models',
      body: `When one GPU is too slow or too small, split the work across **worker nodes**. **Data parallelism** copies the model to every node, gives each node a slice of each batch and synchronises gradients; it is the easiest approach and fits most cases. **Model parallelism** splits the model itself across nodes and is used when the model does not fit in one GPU's memory; frameworks such as DeepSpeed handle the sharding.

In Azure ML you ask for multiple instances and declare the distribution type; the service sets the environment variables and launches one process per GPU:

\`\`\`yaml
# distributed.yml (excerpt of a command job)
command: python train_ddp.py --epochs 10
environment: azureml:AzureML-acpt-pytorch-2.2-cuda12.1@latest
compute: azureml:gpu-cluster
resources:
  instance_count: 2
distribution:
  type: pytorch
  process_count_per_instance: 4   # one per GPU on a 4-GPU SKU
\`\`\`

Distribution types are \`pytorch\` (torch.distributed / DistributedDataParallel), \`tensorflow\` (with \`worker_count\`) and \`mpi\` (Horovod, DeepSpeed and generic MPI with \`process_count_per_instance\`). Use GPU SKUs such as NC or ND series, prefer InfiniBand-capable SKUs for multi-node scaling, and shard the dataset so each process reads its own partition. Checkpoint to an output so a pre-empted low-priority node does not lose the run. The exam distinguishes "model too big for GPU memory" (model parallelism, DeepSpeed ZeRO) from "training too slow" (data parallelism, more nodes).`,
    },
    {
      heading: 'Pipelines: components wired into a workflow',
      body: `A **pipeline job** chains components so each step runs with its own compute and environment, passing outputs to the next step's inputs. The payoff is **reuse** (steps whose inputs did not change are reused from cache), **parallelism** (independent steps run concurrently) and **clarity** (prepare, train, evaluate, register are separate, testable units).

\`\`\`yaml
# pipeline.yml
$schema: https://azuremlschemas.azureedge.net/latest/pipelineJob.schema.json
type: pipeline
experiment_name: churn-pipeline
inputs:
  raw: {type: uri_folder, path: azureml:churn_training:3}
settings: {default_compute: azureml:cpu-cluster}
jobs:
  prep:
    component: azureml:prep_churn_data:2
    inputs: {raw_data: \${{parent.inputs.raw}}}
  train:
    component: azureml:train_churn:5
    inputs: {train_data: \${{parent.jobs.prep.outputs.train_data}}}
    compute: azureml:gpu-cluster
  evaluate:
    component: azureml:evaluate_churn:3
    inputs:
      model: \${{parent.jobs.train.outputs.model}}
      test_data: \${{parent.jobs.prep.outputs.test_data}}
outputs:
  model: \${{parent.jobs.train.outputs.model}}
\`\`\`

Steps can also be **sweep steps** (tune inside the pipeline), **AutoML steps**, **parallel** steps for embarrassingly parallel scoring, and **Spark** steps. Pipelines run on a **schedule** (\`az ml schedule create\` with recurrence or cron) or on demand from CI/CD. Set \`settings.force_rerun: true\` only when you must bypass reuse. In the SDK you decorate a Python function with \`@pipeline\` and call loaded components inside it. A registered pipeline component lets other teams call your whole workflow as one step.`,
    },
  ],
  examples: [
    {
      title: 'Random sweep with bandit early termination',
      description:
        'A team tunes a gradient boosting model. They start with random sampling over a log-uniform learning rate and discrete depth, and add a bandit policy so a trial that is more than 10 percent worse than the best after five evaluations is stopped, saving roughly a third of the compute budget.',
      language: 'yaml',
      code: `sampling_algorithm: random
search_space:
  learning_rate: {type: loguniform, min_value: -6.9, max_value: -1.6}
  max_depth: {type: choice, values: [3, 5, 7, 9]}
  subsample: {type: uniform, min_value: 0.6, max_value: 1.0}
objective: {goal: maximize, primary_metric: auc}
early_termination:
  type: bandit
  slack_factor: 0.1
  evaluation_interval: 1
  delay_evaluation: 5
limits: {max_total_trials: 60, max_concurrent_trials: 6, trial_timeout: 1800}`,
      takeaway: 'Random sampling plus an early termination policy is the default recipe for cost-effective tuning.',
    },
    {
      title: 'Scaling PyTorch training to two nodes',
      description:
        'Training a transformer on one Standard_NC24ads_A100_v4 takes 11 hours. The engineer sets instance_count to 2 with a pytorch distribution, switches the script to DistributedDataParallel using the injected RANK and WORLD_SIZE variables, shards the data loader with DistributedSampler, and checkpoints every epoch to the job output.',
      language: 'python',
      code: `import os, torch, torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP
from torch.utils.data import DataLoader, DistributedSampler

dist.init_process_group("nccl")            # Azure ML sets MASTER_ADDR/PORT, RANK, WORLD_SIZE
local_rank = int(os.environ["LOCAL_RANK"])
torch.cuda.set_device(local_rank)
model = DDP(build_model().cuda(local_rank), device_ids=[local_rank])
sampler = DistributedSampler(train_ds)
loader = DataLoader(train_ds, batch_size=64, sampler=sampler)
for epoch in range(args.epochs):
    sampler.set_epoch(epoch)
    train_one_epoch(model, loader)
    if dist.get_rank() == 0:
        torch.save(model.module.state_dict(), f"{args.model_out}/ckpt_{epoch}.pt")`,
      takeaway: 'Declare distribution in the job and use the framework\'s native distributed API; Azure ML supplies the rendezvous variables.',
    },
    {
      title: 'Bayesian sweep that never terminates early (a realistic mistake and the fix)',
      description:
        'An engineer configures bayesian sampling with a median stopping policy and max_concurrent_trials of 16. The job is rejected because Bayesian sampling does not support early termination, and even if it ran, high concurrency would starve the Bayesian optimiser of completed trials to learn from. The fix is either random sampling with the policy, or Bayesian sampling with no policy and low concurrency.',
      language: 'yaml',
      code: `# option A: keep early termination
sampling_algorithm: random
early_termination: {type: median_stopping, evaluation_interval: 1, delay_evaluation: 5}
limits: {max_total_trials: 80, max_concurrent_trials: 8}
# option B: keep Bayesian
sampling_algorithm: bayesian
# (no early_termination block)
limits: {max_total_trials: 40, max_concurrent_trials: 2}`,
      takeaway: 'Bayesian sampling trades early termination for smarter sampling; pick one strategy and set concurrency to match.',
    },
  ],
  keyPoints: [
    'AutoML jobs (type: automl) search algorithms and featurisation for classification, regression, forecasting, vision and NLP; tabular training data must be an MLTable.',
    'AutoML cost is controlled with limits (timeout_minutes, max_trials, max_concurrent_trials, enable_early_termination); you can block or allow algorithms.',
    'A sweep job wraps a trial command job; the script must log the primary_metric by name.',
    'Sampling: grid (discrete only), random (default starting point), bayesian (learns from trials, no early termination support).',
    'Early termination policies: bandit (slack factor/amount), median stopping, truncation selection; each with evaluation_interval and delay_evaluation.',
    'Distributed training: resources.instance_count plus distribution type pytorch, tensorflow or mpi; data parallelism for speed, model parallelism (DeepSpeed) for models too large for one GPU.',
    'Pipeline jobs chain components with ${{parent.inputs.x}} and ${{parent.jobs.step.outputs.y}} bindings, reuse unchanged steps, and can include sweep, AutoML, parallel and Spark steps.',
    'Schedule pipelines with az ml schedule create (recurrence or cron) or trigger them from CI/CD.',
  ],
  flashcards: [
    { front: 'What data asset type does an AutoML tabular job require?', back: 'mltable.' },
    { front: 'Which AutoML limits settings control cost and duration?', back: 'limits.timeout_minutes, max_trials, max_concurrent_trials and enable_early_termination.' },
    { front: 'Which sampling algorithm does not support early termination policies?', back: 'Bayesian sampling.' },
    { front: 'Name the three early termination policies for sweep jobs.', back: 'Bandit, median stopping and truncation selection.' },
    { front: 'What must a training script do for a sweep job to work?', back: 'Log the objective metric with the exact name used in objective.primary_metric.' },
    { front: 'Which distribution types does an Azure ML command job support?', back: 'pytorch, tensorflow and mpi.' },
    { front: 'When is model parallelism preferred over data parallelism?', back: 'When the model is too large to fit in a single GPU\'s memory.' },
    { front: 'How does a pipeline step reference the output of a previous step?', back: '${{parent.jobs.<step>.outputs.<name>}}.' },
    { front: 'What pipeline feature avoids recomputing steps whose inputs did not change?', back: 'Step output reuse (caching); disable with settings.force_rerun: true.' },
    { front: 'How do you run a pipeline every night at 02:00?', back: 'Create a schedule with az ml schedule create using a recurrence or cron trigger that points at the pipeline job.' },
  ],
  quiz: [
    {
      question:
        'A business analyst with limited ML experience must produce a baseline churn classifier from a table in ADLS Gen2 within a day, with explanations for the best model. Which approach fits best?',
      options: [
        'A sweep job over a custom PyTorch script',
        'An AutoML classification job with an MLTable input and enable_model_explainability',
        'A distributed training job on a GPU cluster',
        'A pipeline job with a Spark step',
      ],
      correct: [1],
      explanation:
        'AutoML explores algorithms and featurisation automatically and can emit explanations. Sweeps and distributed jobs require a script and expertise; a Spark step alone does not train models.',
    },
    {
      question:
        'Your sweep job has 200 trials and a large budget. You want poorly performing trials stopped when they fall below the median of completed trials at the same point. Which configuration should you use?',
      options: [
        'sampling_algorithm: bayesian with early_termination type median_stopping',
        'sampling_algorithm: random with early_termination type median_stopping',
        'sampling_algorithm: grid with a bandit policy and slack_factor 0',
        'No early termination; reduce max_total_trials to 20',
      ],
      correct: [1],
      explanation:
        'Median stopping does what is described, and random sampling supports early termination. Bayesian does not support policies; grid cannot sample continuous values and slack 0 would stop almost everything; cutting trials changes the budget rather than the mechanism.',
    },
    {
      question:
        'A 70-billion-parameter model cannot be loaded on a single GPU. Which TWO choices address this? (Select two)',
      options: [
        'Use data parallelism with more nodes of the same GPU size',
        'Use model parallelism such as DeepSpeed ZeRO sharding across GPUs',
        'Choose a GPU SKU with more memory per device',
        'Reduce max_concurrent_trials in the sweep',
      ],
      correct: [1, 2],
      explanation:
        'Model parallelism shards the model, and larger-memory GPUs can hold more of it. Data parallelism still requires the whole model on each device, and sweep concurrency is unrelated.',
    },
    {
      question:
        'A training pipeline has prepare, train and evaluate components. Only the train component\'s code changed. What happens on the next run by default?',
      options: [
        'All three steps rerun because the pipeline definition changed',
        'The prepare step is reused from the previous run; train and evaluate rerun',
        'Only train reruns; evaluate uses the old model',
        'The run fails until force_rerun is set',
      ],
      correct: [1],
      explanation:
        'Reuse applies to steps whose inputs and definition are unchanged (prepare). Train changed, and evaluate depends on train\'s new output, so both rerun.',
    },
    {
      question:
        'A distributed PyTorch job on two 4-GPU nodes launches only two processes in total and uses one GPU per node. What is the most likely misconfiguration?',
      options: [
        'instance_count is set to 2 instead of 8',
        'distribution.process_count_per_instance is 1 instead of 4',
        'The environment lacks the mpi distribution type',
        'The compute is a compute instance rather than a cluster',
      ],
      correct: [1],
      explanation:
        'process_count_per_instance controls processes per node, one per GPU. instance_count 2 is correct for two nodes; pytorch distribution does not need mpi; a compute instance could not have two nodes.',
    },
  ],
  statements: [
    { text: 'AutoML v2 can accept a uri_folder of CSV files directly as training_data.', isTrue: false, explanation: 'Tabular AutoML requires an MLTable input.' },
    { text: 'Grid sampling is only suitable for search spaces made of discrete choice parameters.', isTrue: true, explanation: 'Grid enumerates combinations; it cannot sample continuous distributions.' },
    { text: 'The bandit policy stops trials whose metric is outside a slack factor or slack amount of the best run so far.', isTrue: true, explanation: 'That is the bandit definition; evaluation_interval and delay_evaluation control timing.' },
    { text: 'Data parallelism requires each worker to hold a full copy of the model.', isTrue: true, explanation: 'Each node trains the whole model on a data shard and synchronises gradients.' },
    { text: 'A pipeline job must run all steps on the same compute target.', isTrue: false, explanation: 'Each step can specify its own compute; default_compute is just a fallback.' },
    { text: 'Bayesian sampling supports the truncation selection early termination policy.', isTrue: false, explanation: 'Bayesian sampling supports no early termination policy.' },
  ],
  resources: [
    { label: 'Set up AutoML training for tabular data with the CLI and Python SDK', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-configure-auto-train' },
    { label: 'Hyperparameter tuning a model (v2)', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-tune-hyperparameters' },
    { label: 'Distributed training with Azure Machine Learning', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/concept-distributed-training' },
    { label: 'Create and run machine learning pipelines using components with the CLI v2', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-create-component-pipelines-cli' },
  ],
};
