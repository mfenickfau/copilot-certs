import type { Concept } from '../../types';

export const mlAssetsEnvironmentsComponentsRegistries: Concept = {
  id: 'ml-assets-environments-components-registries',
  title: 'Data Assets, Environments, Components and Registries',
  summary:
    'The four versioned building blocks of reproducible MLOps in Azure Machine Learning: data assets that pin a dataset version, environments that pin dependencies, components that pin a unit of pipeline logic, and registries that share all of them across workspaces.',
  certs: ['ai-300'],
  domains: ['ai-300-1'],
  outcomes: ['ai-300-1-2-1', 'ai-300-1-2-2', 'ai-300-1-2-3', 'ai-300-1-2-4'],
  tags: ['azure-ml', 'data-assets', 'mltable', 'environments', 'components', 'registries', 'cli-v2'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Data assets: three types, immutable versions',
      body: `A **data asset** is a named, versioned pointer to data that a job can consume by friendly name instead of a long URI. Versions are **immutable**: once created, a version cannot be modified or deleted, which is what gives you reproducibility, auditability and lineage (you can see which jobs consumed which version).

There are three asset types and the exam expects you to pick the right one:

| Type | API name | Use when |
|---|---|---|
| File | \`uri_file\` | A single file of any format, for example one CSV |
| Folder | \`uri_folder\` | A folder of Parquet/CSV files, or unstructured data such as images |
| Table | \`mltable\` | You need a schema, transformations or a subset of tabular data; **required for AutoML tabular jobs** |

The \`path\` can be local (uploaded to the default datastore), a datastore URI (\`azureml://datastores/<name>/paths/<path>\`), a public https URL or a direct \`wasbs://\` or \`abfss://\` URL.

\`\`\`yaml
# data.yml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
name: churn_training
version: 3
type: uri_folder
path: azureml://datastores/curated_blob/paths/churn/2026-11/
\`\`\`

\`az ml data create -f data.yml\` registers version 3; a job then uses \`inputs.training_data.path: azureml:churn_training:3\` with a mode such as \`ro_mount\` or \`download\`. MLTable adds a \`MLTable\` file next to the data with \`read_delimited\` and other transforms, so a changing CSV schema is handled in the table definition rather than in every training script.`,
    },
    {
      heading: 'Environments: curated or custom, always versioned',
      body: `An **environment** defines the Docker image and Python dependencies that a job or deployment runs in. Azure ML builds a container from the specification and caches it in the workspace container registry.

- **Curated environments** are Microsoft-maintained, prefixed \`AzureML-\`, prebuilt and fast to start. Reference them as \`azureml:AzureML-sklearn-1.5@latest\` or by exact version for reproducibility.
- **Custom environments** come from (a) a base image plus a conda YAML, or (b) a Docker **build context** containing a Dockerfile. The first is simplest; the second is required when you need system packages or a private base image.

\`\`\`yaml
# env.yml
$schema: https://azuremlschemas.azureedge.net/latest/environment.schema.json
name: churn-train-env
version: 7
image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu22.04
conda_file: conda.yml
\`\`\`

Environment versions are immutable: changing \`conda.yml\` means a new version. For managed online deployments, the environment must include the inference server dependencies (\`azureml-inference-server-http\`); MLflow models skip this because Azure ML generates the environment from the model's own \`conda.yaml\`. The exam distractor to recognise is "edit the environment in place"; the answer is always "create a new version and reference it".`,
    },
    {
      heading: 'Components: reusable pipeline steps with a contract',
      body: `A **component** is a self-contained unit of code with a declared interface (inputs, outputs, environment, command). Pipelines are built by wiring components together, and because each component is versioned, a pipeline job records exactly which logic produced each artifact. Components can be reused across pipelines and shared across teams through registries.

\`\`\`yaml
# prep-component.yml
$schema: https://azuremlschemas.azureedge.net/latest/commandComponent.schema.json
type: command
name: prep_churn_data
version: 2
inputs:
  raw_data: {type: uri_folder}
  test_ratio: {type: number, default: 0.2}
outputs:
  train_data: {type: uri_folder}
  test_data: {type: uri_folder}
code: ./src
environment: azureml:churn-train-env:7
command: >-
  python prep.py --raw \${{inputs.raw_data}} --ratio \${{inputs.test_ratio}}
  --train \${{outputs.train_data}} --test \${{outputs.test_data}}
\`\`\`

\`az ml component create -f prep-component.yml\` registers it. In a pipeline YAML, a step says \`component: azureml:prep_churn_data:2\` and binds \`\${{parent.inputs.raw}}\` to its inputs. Besides \`command\`, there are \`pipeline\` components (a nested pipeline), \`spark\` and \`parallel\` components. The design rule: a component should do one thing (prepare, train, evaluate, register) so steps can be cached, swapped and tested independently.`,
    },
    {
      heading: 'Registries: share across workspaces and promote across environments',
      body: `Workspaces are isolation boundaries, which is exactly what you want for dev, test and prod, but it means assets registered in one workspace are invisible to another. An **Azure Machine Learning registry** is an organisation-level resource that stores **models, environments, components and data assets** so any workspace in the organisation (even in other subscriptions and regions) can consume them.

Two scenarios motivate registries:

1. **Cross-workspace MLOps**: train in the dev workspace, publish the model to the registry, deploy from the registry to endpoints in test and prod workspaces, keeping lineage back to the training job.
2. **Reuse across teams**: publish a hardened environment or a feature-engineering component once; every project consumes the same version.

The CLI commands are the same ones you already know, with \`--registry-name\` instead of \`--workspace-name\`:

\`\`\`bash
az ml registry create --name contoso-registry -g rg-shared -f registry.yml
az ml environment create -f env.yml --registry-name contoso-registry
az ml component create -f prep-component.yml --registry-name contoso-registry
# promote an existing workspace model into the registry
az ml model share --name churn-model --version 4 --registry-name contoso-registry \\
  --share-with-name churn-model --share-with-version 4
\`\`\`

Consumers reference \`azureml://registries/contoso-registry/models/churn-model/versions/4\`. The **AzureML Registry User** role grants read/write on assets without the right to create or delete the registry. Registries support regional replication (list the regions in \`registry.yml\`) so a prod workspace in another region can pull without cross-region egress surprises. Remember two limits: MLflow's own client cannot target organisational registries, and a registry is for *assets*, not for compute or jobs.`,
    },
  ],
  examples: [
    {
      title: 'Promoting a model from dev to prod with a registry',
      description:
        'Contoso trains in mlw-dev (subscription A) and serves in mlw-prod (subscription B). After evaluation passes, the CI pipeline shares model version 12 to the shared registry, and the prod deployment YAML references the registry path. Lineage in prod still points to the dev training job.',
      language: 'yaml',
      code: `# prod-deployment.yml (in the prod workspace)
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
name: green
endpoint_name: churn-endpoint
model: azureml://registries/contoso-registry/models/churn-model/versions/12
environment: azureml://registries/contoso-registry/environments/churn-infer-env/versions/3
instance_type: Standard_DS3_v2
instance_count: 2`,
      takeaway: 'Registries decouple assets from workspaces so promotion across environments is a reference change, not a re-upload.',
    },
    {
      title: 'AutoML job fails with a uri_folder (a realistic mistake and the fix)',
      description:
        'An engineer registers the training CSVs as a uri_folder asset and submits an AutoML classification job. It fails because AutoML tabular jobs require an MLTable input. The fix is to add an MLTable file describing the delimited read and register the asset as type mltable, which also documents the schema for everyone else.',
      language: 'yaml',
      code: `# MLTable (saved next to the CSVs)
type: mltable
paths:
  - pattern: ./*.csv
transformations:
  - read_delimited:
      delimiter: ','
      header: all_files_same_headers
      encoding: utf8
---
# data.yml
name: churn_tabular
version: 1
type: mltable
path: azureml://datastores/curated_blob/paths/churn/2026-11/`,
      takeaway: 'Choose mltable when a schema or transformation must travel with the data, and always for AutoML tabular tasks.',
    },
    {
      title: 'Pinning an environment for reproducibility',
      description:
        'A model trained in March cannot be reproduced in September because the job referenced AzureML-sklearn@latest, and the curated image had moved to a newer scikit-learn. The team switches all job YAML to exact environment versions, and builds a custom environment from a Dockerfile for the inference image so library versions are frozen in Git.',
      language: 'yaml',
      code: `# env-build.yml
$schema: https://azuremlschemas.azureedge.net/latest/environment.schema.json
name: churn-infer-env
version: 3
build:
  path: ./docker      # contains Dockerfile and requirements.txt
  dockerfile_path: Dockerfile
---
# job.yml excerpt
environment: azureml:churn-train-env:7   # exact version, not @latest`,
      takeaway: '@latest is for exploration; production jobs and deployments pin an exact environment version.',
    },
  ],
  keyPoints: [
    'Data asset types: uri_file (one file), uri_folder (folder), mltable (tabular with schema and transforms; required for AutoML tabular).',
    'Data asset, environment and component versions are immutable; change means a new version, which is what makes jobs reproducible.',
    'Curated environments are prefixed AzureML- and prebuilt; custom environments use image + conda file or a Docker build context.',
    'MLflow models do not need an explicit scoring environment for managed online deployment; Azure ML derives it from the model.',
    'A command component declares inputs, outputs, code, environment and command; pipelines bind them with ${{parent.inputs.x}} syntax.',
    'Registries store models, environments, components and data assets for cross-workspace MLOps and cross-team reuse; reference them as azureml://registries/<name>/...',
    'Use --registry-name on the same az ml commands to target a registry; az ml model share promotes a workspace model into a registry.',
    'AzureML Registry User can read and write registry assets but cannot create or delete the registry itself.',
  ],
  flashcards: [
    { front: 'Which data asset type must you use for an AutoML tabular training job?', back: 'mltable.' },
    { front: 'Can you delete or modify version 2 of a data asset after creating it?', back: 'No. Data asset versions are immutable; create a new version instead.' },
    { front: 'What prefix identifies a curated Azure ML environment?', back: 'AzureML- (for example AzureML-sklearn-1.5).' },
    { front: 'Name the two ways to define a custom environment.', back: 'A base Docker image plus a conda YAML, or a Docker build context (Dockerfile).' },
    { front: 'What does a command component declare?', back: 'Inputs, outputs, code location, environment and the command to run.' },
    { front: 'Which asset kinds can an Azure ML registry hold?', back: 'Models, environments, components and data assets.' },
    { front: 'How do you create an environment in a registry instead of a workspace?', back: 'Run az ml environment create with --registry-name instead of --workspace-name.' },
    { front: 'How does a prod workspace reference a model in a registry?', back: 'azureml://registries/<registry>/models/<name>/versions/<version>.' },
    { front: 'Which role lets data scientists publish assets to a registry without managing the registry?', back: 'AzureML Registry User.' },
    { front: 'Can the MLflow client register models to an organisational registry?', back: 'No. MLflow model management works only against the workspace registry.' },
  ],
  quiz: [
    {
      question:
        'Your team trains models in a development workspace and must deploy them to a production workspace in a different subscription while keeping lineage to the training job. What should you use?',
      options: [
        'Download the model files and re-register them in the production workspace',
        'An Azure Machine Learning registry shared by both workspaces',
        'A datastore in the production workspace pointing at the dev storage account',
        'A compute cluster attached to both workspaces',
      ],
      correct: [1],
      explanation:
        'Registries are built for cross-workspace promotion with lineage. Re-registering loses lineage, a datastore shares data not models, and compute cannot be attached to two workspaces.',
    },
    {
      question:
        'A training job must read a folder of 400 Parquet files that is refreshed monthly, and auditors must be able to reproduce any past run. Which TWO actions should you take? (Select two)',
      options: [
        'Register the folder as a uri_folder data asset and create a new version each month',
        'Reference the folder directly by its wasbs:// URL in every job',
        'Pin each job to an exact data asset version such as azureml:sales:2026-11',
        'Register the folder as a uri_file data asset',
      ],
      correct: [0, 2],
      explanation:
        'Versioned uri_folder assets plus exact version references give reproducibility and lineage. Direct URLs are not versioned, and uri_file is for a single file.',
    },
    {
      question:
        'A data scientist edits conda.yml to upgrade pandas and asks how to update environment version 7 so existing jobs pick it up. What is the correct guidance?',
      options: [
        'Run az ml environment update to change version 7 in place',
        'Create version 8 of the environment and update the job YAML to reference it',
        'Delete version 7 and recreate it with the same number',
        'Use @latest in job YAML so no change is needed',
      ],
      correct: [1],
      explanation:
        'Environment versions are immutable. Deleting and recreating is not supported for in-use assets, and @latest sacrifices reproducibility.',
    },
    {
      question:
        'Several teams keep rewriting the same data preparation step inside their pipelines with slightly different bugs. Which approach best promotes reuse with least maintenance?',
      options: [
        'Publish a versioned command component for the step to a shared registry and reference it from each pipeline',
        'Email the prep.py script to every team',
        'Create one large pipeline that every team must use',
        'Store the step as a notebook on a shared compute instance',
      ],
      correct: [0],
      explanation:
        'Components are the reuse unit for pipelines, and a registry makes them available across workspaces. Scripts by email and shared notebooks drift; one giant pipeline removes team autonomy.',
    },
    {
      question: 'Which statement about Azure ML data assets is correct?',
      options: [
        'Creating a data asset from a local path leaves the data on the local machine.',
        'An mltable asset can combine files spread across multiple storage locations.',
        'uri_folder assets cannot be mounted to compute.',
        'Data asset versions can be edited after creation if no job has used them.',
      ],
      correct: [1],
      explanation:
        'MLTable supports paths across locations and transformations. Local paths are uploaded to the default datastore, folders can be mounted or downloaded, and versions are always immutable.',
    },
  ],
  statements: [
    { text: 'An mltable data asset is required for AutoML tabular jobs in SDK and CLI v2.', isTrue: true, explanation: 'AutoML v2 accepts MLTable inputs for training data.' },
    { text: 'Curated environments can be modified in place to add a Python package.', isTrue: false, explanation: 'Curated environments are Microsoft-managed; create a custom environment or a new version.' },
    { text: 'Components can be shared across workspaces through a registry.', isTrue: true, explanation: 'Registries hold models, environments, components and data assets.' },
    { text: 'A registry can also host compute clusters shared by multiple workspaces.', isTrue: false, explanation: 'Registries store assets only; compute belongs to a workspace.' },
    { text: 'When you create a data asset from a local path, the data is uploaded to the workspace default datastore.', isTrue: true, explanation: 'Local paths are uploaded to workspaceblobstore automatically.' },
    { text: 'The MLflow client can register a model directly into an organisational Azure ML registry.', isTrue: false, explanation: 'MLflow model management is limited to the workspace; use az ml model share or the SDK with a registry client.' },
  ],
  resources: [
    { label: 'Create and manage data assets', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-create-data-assets' },
    { label: 'Manage Azure Machine Learning environments with the CLI and SDK (v2)', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-manage-environments-v2' },
    { label: 'Share models, components, and environments across workspaces with registries', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-share-models-pipelines-across-workspaces-with-registries' },
    { label: 'Machine learning registries for MLOps', url: 'https://learn.microsoft.com/en-us/azure/machine-learning/concept-machine-learning-registries-mlops' },
  ],
};
