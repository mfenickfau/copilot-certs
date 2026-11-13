import type { Concept } from '../../types';

export const azureFunctionsTriggersBindingsAndHosting: Concept = {
  id: 'azure-functions-triggers-bindings-and-hosting',
  title: 'Azure Functions: Triggers, Bindings, Hosting Plans and Deployment',
  summary:
    'Build serverless APIs and event handlers with Azure Functions: one trigger per function plus declarative input and output bindings (Python v2 decorators, C# attributes), the Flex Consumption, Premium, Dedicated and Container Apps hosting plans, and how to configure and deploy function apps with app settings, host.json, Core Tools and zip packages.',
  certs: ['ai-200'],
  domains: ['ai-200-3'],
  outcomes: ['ai-200-3-2-1', 'ai-200-3-2-2'],
  tags: ['azure-functions', 'triggers', 'bindings', 'flex-consumption', 'serverless', 'python-v2', 'deployment'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Triggers and bindings',
      body: `A function has **exactly one trigger**, which defines how it is invoked and usually carries input data, and zero or more **bindings** that declaratively connect it to other services: **input bindings** fetch data (a Cosmos DB item by id, a blob), **output bindings** write data (a queue message, a Cosmos DB document, a Service Bus message) by returning a value or setting an output parameter. Bindings exist so you do not hand-write SDK clients and connection handling for common integrations; you can still use SDKs directly when a binding is too limited.

Common triggers and what they suit:

| Trigger | Use |
|---|---|
| **HTTP** | REST endpoints and webhooks; auth level \`anonymous\`, \`function\` (key per function) or \`admin\` (host key); \`route\` templates like \`products/{id}\`; 230 second response limit regardless of plan |
| **Timer** | CRON schedules (\`0 */5 * * * *\`, six fields with seconds) for refreshes and clean-ups |
| **Queue storage / Service Bus** | Background work; Service Bus trigger uses peek-lock, auto-completes on success, abandons on exception, renews locks (default up to 5 minutes), batches with \`cardinality=many\` |
| **Event Grid** | Reacting to Azure resource or custom events; handles the validation handshake for you |
| **Cosmos DB** | Change feed processing with a managed lease container |
| **Blob (Event Grid source)** | New files; prefer the Event Grid-based blob trigger over polling |

In the **Python v2 model** everything lives in \`function_app.py\` (or blueprints) as decorators: \`app = func.FunctionApp()\`, \`@app.route(route="chat", methods=["POST"], auth_level=func.AuthLevel.FUNCTION)\`, \`@app.service_bus_queue_trigger(arg_name="msg", queue_name="ingest", connection="SB_CONN")\`, \`@app.cosmos_db_output(arg_name="doc", database_name=..., container_name=..., connection="COSMOS_CONN")\`. The \`connection\` value is the **name of an app setting**, not the connection string itself, and it can point at identity-based settings (\`SB_CONN__fullyQualifiedNamespace\`) so no secret is stored. Binding expressions such as \`{queueTrigger}\` or \`%SETTING%\` resolve from the trigger payload or app settings. Bindings are delivered through **extension bundles** declared in \`host.json\`.`,
    },
    {
      heading: 'Hosting plans',
      body: `The plan decides scaling, networking, cold start and cost:

- **Flex Consumption** (Linux; the recommended serverless plan): pay per execution, scales out to **1,000 instances** on a **per-function** basis (HTTP triggers scale as one group, Durable as another, every other trigger independently), choose **instance memory** (512 MB, 2,048 MB, 4,096 MB), add **always-ready instances** to kill cold starts for a trigger group, and get **virtual network integration**. Deployment is a zip package in a **deployment storage container**; the only code-deployment path. Creation: \`az functionapp create --flexconsumption-location <region> --runtime python --runtime-version 3.12 --storage-account ...\`.
- **Consumption** (legacy): Windows GA, Linux retiring (30 September 2028); no VNet, 5 minute default timeout (10 max). Microsoft says use Flex Consumption for new apps.
- **Premium (Elastic Premium)**: pre-warmed instances (no cold start), VNet, longer runs (unbounded with a 60 minute scale-in grace), larger EP1 to EP3 SKUs, custom Linux images. For always-busy or latency-critical apps.
- **Dedicated (App Service plan)**: predictable billing, runs beside web apps, manual or autoscale, needs **Always On**. For long-running work where Durable Functions does not fit.
- **Container Apps**: the Functions programming model in your own container image on a Container Apps environment, with KEDA rules generated from the triggers; good for GPU or sidecar needs.

Timeouts: \`functionTimeout\` in \`host.json\`; HTTP responses are capped at 230 seconds everywhere, so long work should use **Durable Functions** (orchestrator, activities, async HTTP pattern) or return 202 and process from a queue. **Durable Functions** on Flex Consumption supports the Azure Storage and Durable Task Scheduler backends.`,
    },
    {
      heading: 'Configuring and deploying a function app',
      body: `A function app is an App Service-style resource plus a storage account. Key settings (app settings are environment variables at runtime):

- \`AzureWebJobsStorage\` (or identity-based \`AzureWebJobsStorage__accountName\`): host metadata, timer leases, Durable state.
- \`FUNCTIONS_WORKER_RUNTIME\` (\`python\`, \`dotnet-isolated\`, \`node\`), \`FUNCTIONS_EXTENSION_VERSION\` (\`~4\`).
- \`APPLICATIONINSIGHTS_CONNECTION_STRING\` for monitoring.
- Connection settings referenced by bindings; use **Key Vault references** or identity-based connections instead of raw secrets.
- \`WEBSITE_RUN_FROM_PACKAGE=1\` (Premium/Dedicated/Windows Consumption) runs the app read-only from the uploaded zip; not used on Flex Consumption, which always runs from its package.

\`host.json\` holds runtime-wide settings (logging, extension bundle, \`functionTimeout\`, per-extension options like Service Bus \`maxConcurrentCalls\` or \`autoCompleteMessages\`). \`local.settings.json\` holds local-only settings and is never published. Python dependencies go in \`requirements.txt\` and are installed by a **remote build** (the default for Core Tools and VS Code on Linux; on Consumption/Premium/Dedicated via \`SCM_DO_BUILD_DURING_DEPLOYMENT=true\` and \`ENABLE_ORYX_BUILD=true\`; on Flex Consumption via a deploy-time flag).

Deployment paths: **Azure Functions Core Tools** (\`func azure functionapp publish <app>\`), **Azure CLI zip deploy** (\`az functionapp deployment source config-zip --src app.zip\`), **VS Code**, **GitHub Actions / Azure Pipelines** tasks (which detect Flex Consumption and use package deployment), **deployment slots** for Premium and Dedicated, **container images** for Premium (custom Linux image) and Container Apps, and Bicep/ARM with a package URL. When public access is disabled (private endpoints), the deploying machine must reach the private deployment endpoint (self-hosted runner or Azure private networking for hosted runners). Test locally with \`func start\` and the Azurite storage emulator.`,
    },
    {
      heading: 'The exam angle',
      body: `Expect to pick the trigger, binding, plan or setting:

- *"Write the result to Cosmos DB without using the SDK."* A **Cosmos DB output binding** (return value or output parameter).
- *"Run every 15 minutes."* **Timer trigger** with a six-field CRON expression.
- *"Process Service Bus messages; failing messages should retry, then dead-letter."* **Service Bus trigger** (peek-lock, auto abandon on exception, DLQ after max delivery count); disable \`autoCompleteMessages\` only if you settle manually.
- *"An HTTP function must be callable by partners with a key but not anonymously."* \`auth_level=FUNCTION\` and share a function key (\`x-functions-key\` header or \`code\` query string).
- *"Serverless billing and access to a database on a private VNet."* **Flex Consumption** (or Premium), never legacy Consumption.
- *"Eliminate cold starts for the HTTP functions only."* Flex Consumption **always-ready instances** for the HTTP group (or Premium pre-warmed instances).
- *"Request takes 10 minutes; HTTP client times out."* The **230 second** limit; use Durable Functions async pattern or queue + 202.
- *"Where do the connection strings referenced by bindings live?"* **App settings** (the \`connection\` property names the setting); prefer identity-based connections or Key Vault references.
- *"Deploy with the Azure CLI from a zip."* \`az functionapp deployment source config-zip\` (or \`func azure functionapp publish\`).

Distractors: putting secrets in \`local.settings.json\` and expecting them in Azure (it is never deployed), two triggers on one function (not allowed), choosing legacy Consumption for VNet access, and using \`WEBSITE_RUN_FROM_PACKAGE\` on Flex Consumption.`,
    },
  ],
  examples: [
    {
      title: 'Python v2: HTTP API plus Service Bus trigger with a Cosmos DB output binding',
      description:
        'A document-ingest API accepts uploads over HTTP and enqueues work; a second function in the same app processes the queue, embeds the text and writes to Cosmos DB through an output binding. Connections are identity-based app settings, so no secrets are stored.',
      language: 'python',
      code: `import json, azure.functions as func
app = func.FunctionApp()

@app.route(route="documents", methods=["POST"], auth_level=func.AuthLevel.FUNCTION)
@app.service_bus_queue_output(arg_name="out", queue_name="ingest", connection="SB")
def submit(req: func.HttpRequest, out: func.Out[str]) -> func.HttpResponse:
    body = req.get_json()
    out.set(json.dumps({"id": body["id"], "text": body["text"]}))
    return func.HttpResponse(status_code=202)

@app.service_bus_queue_trigger(arg_name="msg", queue_name="ingest", connection="SB")
@app.cosmos_db_output(arg_name="doc", database_name="kb", container_name="chunks",
                      connection="COSMOS")
def embed(msg: func.ServiceBusMessage, doc: func.Out[func.Document]):
    item = json.loads(msg.get_body().decode())
    item["embedding"] = embed_text(item["text"])
    doc.set(func.Document.from_dict(item))
# app settings: SB__fullyQualifiedNamespace, COSMOS__accountEndpoint (identity-based)`,
      takeaway: 'Decorators declare one trigger and any bindings per function; connection names point at app settings, which can be identity-based so no connection string exists.',
    },
    {
      title: 'Create and deploy a Flex Consumption app with always-ready HTTP instances',
      description:
        'The team wants serverless billing, VNet access to PostgreSQL, and no cold starts on the HTTP endpoints. They create a Flex Consumption app, configure settings with Key Vault references, and deploy a zip with a remote build.',
      language: 'bash',
      code: `az functionapp create -g rg-ai -n fn-rag-api \\
  --flexconsumption-location westeurope --runtime python --runtime-version 3.12 \\
  --storage-account strag --instance-memory 2048 \\
  --always-ready-instances http=2 --assign-identity [system]

az functionapp config appsettings set -g rg-ai -n fn-rag-api --settings \\
  "APPLICATIONINSIGHTS_CONNECTION_STRING=@Microsoft.KeyVault(VaultName=kv-ai;SecretName=appi)" \\
  "SB__fullyQualifiedNamespace=contoso-sb.servicebus.windows.net" \\
  "COSMOS__accountEndpoint=https://contoso-cosmos.documents.azure.com:443/"

az functionapp vnet-integration add -g rg-ai -n fn-rag-api --vnet vnet-ai --subnet snet-fn

func azure functionapp publish fn-rag-api --python   # zip + remote build`,
      takeaway: 'Flex Consumption gives per-function scaling, always-ready instances per trigger group and VNet integration while staying serverless; Core Tools deploys the package.',
    },
    {
      title: 'The setting that stayed on the laptop (a realistic mistake)',
      description:
        'A developer adds SB and COSMOS connection values to local.settings.json, tests with func start, publishes, and the Service Bus trigger never fires in Azure while the logs show "connection string for SB not found". local.settings.json is local-only and is never deployed. The fix is to define the settings on the function app (az functionapp config appsettings set), ideally as identity-based connections with the managed identity granted Azure Service Bus Data Receiver and Cosmos DB data-plane roles, or as Key Vault references.',
      language: 'bash',
      code: `# wrong: values exist only in local.settings.json (never published)
# right: define them on the app and grant the identity the data roles
az functionapp config appsettings set -g rg-ai -n fn-rag-api --settings \\
  "SB__fullyQualifiedNamespace=contoso-sb.servicebus.windows.net"
PRINCIPAL=$(az functionapp identity show -g rg-ai -n fn-rag-api --query principalId -o tsv)
az role assignment create --assignee $PRINCIPAL \\
  --role "Azure Service Bus Data Receiver" \\
  --scope $(az servicebus namespace show -g rg-ai -n contoso-sb --query id -o tsv)`,
      takeaway: 'Bindings read their connections from app settings in Azure; local.settings.json is for your machine only.',
    },
  ],
  keyPoints: [
    'Exactly one trigger per function; input and output bindings connect to services declaratively; the connection property names an app setting.',
    'Python v2 uses decorators in function_app.py (@app.route, @app.service_bus_queue_trigger, @app.cosmos_db_output, @app.timer_trigger); C# uses attributes; bindings ship via extension bundles.',
    'HTTP auth levels: anonymous, function (per-function key), admin (host key); HTTP responses are limited to 230 seconds on every plan.',
    'Service Bus trigger uses peek-lock, auto-completes on success and abandons on exception, renews locks; Event Grid trigger handles validation.',
    'Flex Consumption is the recommended serverless plan: per-function scaling to 1,000 instances, instance memory 512/2048/4096 MB, always-ready instances, VNet integration, package deployment to a blob container.',
    'Premium removes cold starts with pre-warmed instances and supports custom images; Dedicated runs on an App Service plan with Always On; Container Apps hosts Functions as containers with KEDA.',
    'Legacy Consumption on Linux is retiring (30 September 2028) and lacks VNet; migrate to Flex Consumption.',
    'Configure with app settings (AzureWebJobsStorage, FUNCTIONS_WORKER_RUNTIME, connection settings, Key Vault references) and host.json; local.settings.json is never deployed; deploy with func publish, az functionapp deployment source config-zip, CI/CD tasks or containers.',
  ],
  flashcards: [
    { front: 'How many triggers can a single function have?', back: 'Exactly one; bindings are optional and can be many.' },
    { front: 'What does the connection property of a binding contain?', back: 'The name of an app setting that holds the connection string or identity-based settings (for example SB__fullyQualifiedNamespace), not the value itself.' },
    { front: 'Which Python v2 decorator defines an HTTP endpoint?', back: '@app.route(route=..., methods=[...], auth_level=func.AuthLevel.FUNCTION|ANONYMOUS|ADMIN).' },
    { front: 'Maximum time an HTTP-triggered function can take to respond?', back: '230 seconds, regardless of plan (load balancer idle timeout).' },
    { front: 'Which plan is recommended for new serverless function apps?', back: 'Flex Consumption.' },
    { front: 'Which Flex Consumption feature reduces cold starts?', back: 'Always-ready instances per function or trigger group.' },
    { front: 'Instance memory sizes available on Flex Consumption?', back: '512 MB, 2,048 MB and 4,096 MB.' },
    { front: 'Which plans support virtual network integration?', back: 'Flex Consumption, Premium, Dedicated (App Service) and Container Apps; legacy Consumption does not.' },
    { front: 'What is local.settings.json for?', back: 'Local development settings only; it is never published to Azure.' },
    { front: 'Which file holds runtime-wide configuration such as functionTimeout and extension bundles?', back: 'host.json.' },
    { front: 'Core Tools command to deploy a function app?', back: 'func azure functionapp publish <app-name>.' },
    { front: 'How does a Service Bus trigger behave when the function throws?', back: 'The message is abandoned and redelivered; after the max delivery count it is dead-lettered.' },
  ],
  quiz: [
    {
      question:
        'You need a function that runs whenever a message arrives on a Service Bus queue and saves the processed result as a new Cosmos DB item with minimal code. Which combination should you use?',
      options: [
        'A Service Bus queue trigger with a Cosmos DB output binding',
        'A Cosmos DB trigger with a Service Bus output binding',
        'An HTTP trigger polled by a Logic App',
        'Two triggers on one function: Service Bus and Cosmos DB',
      ],
      correct: [0],
      explanation:
        'The queue message drives the function and the output binding writes the item. A Cosmos DB trigger fires on Cosmos changes, polling via HTTP adds latency and cost, and a function can have only one trigger.',
    },
    {
      question:
        'A Python function app must access an Azure Database for PostgreSQL server that only allows private network access, while keeping pay-per-execution billing. Which hosting plan should you choose?',
      options: [
        'Flex Consumption',
        'Consumption (legacy, Linux)',
        'Dedicated App Service plan with Always On',
        'Static Web Apps',
      ],
      correct: [0],
      explanation:
        'Flex Consumption combines serverless billing with VNet integration. Legacy Consumption lacks VNet support and is retiring on Linux, Dedicated is not pay-per-execution, and Static Web Apps hosts front ends.',
    },
    {
      question:
        'Partners call an HTTP-triggered function and must present a key, while internal health probes should not need one. Which TWO configurations satisfy this with the least effort? (Select two)',
      options: [
        'Set auth_level to FUNCTION on the partner endpoint and distribute a function key',
        'Set auth_level to ANONYMOUS on a separate health endpoint',
        'Set auth_level to ADMIN on the partner endpoint and share the master key',
        'Disable HTTPS so partners can call without keys',
      ],
      correct: [0, 1],
      explanation:
        'Function-level keys gate partner access and an anonymous health route needs none. Sharing the admin master key is a serious over-grant, and HTTPS is unrelated to authorization.',
    },
    {
      question:
        'A Service Bus trigger works locally with func start but never fires after deployment, and logs say the connection setting cannot be found. What is the MOST likely cause?',
      options: [
        'The connection was only defined in local.settings.json, which is not deployed',
        'The function app is on the Premium plan',
        'The queue uses receive-and-delete mode',
        'host.json is missing the functionTimeout property',
      ],
      correct: [0],
      explanation:
        'local.settings.json never leaves the developer machine; settings must be created on the function app. The plan, queue receive mode and timeout do not produce a missing-setting error.',
    },
    {
      question:
        'An HTTP-triggered function performs a report generation that takes about eight minutes, and clients receive a timeout even though functionTimeout is set to 30 minutes on a Premium plan. What should you do?',
      options: [
        'Return HTTP 202 immediately and process asynchronously, for example with Durable Functions or a queue, exposing a status endpoint',
        'Increase functionTimeout to 60 minutes',
        'Move to Flex Consumption with 4,096 MB instances',
        'Enable Always On',
      ],
      correct: [0],
      explanation:
        'HTTP responses are capped at 230 seconds on every plan; the async request-reply pattern is the fix. Longer timeouts, more memory or Always On do not change the HTTP limit.',
    },
    {
      question:
        'Users complain about slow first requests to an HTTP API on Flex Consumption after idle periods, while queue-triggered functions in the same app are fine with occasional delay. What is the MOST cost-effective fix?',
      options: [
        'Configure always-ready instances for the HTTP trigger group only',
        'Move the whole app to the Premium plan with four pre-warmed instances',
        'Set the maximum instance count to 1,000',
        'Switch the HTTP functions to a timer trigger',
      ],
      correct: [0],
      explanation:
        'Always-ready instances can be scoped to the HTTP group, removing its cold start without paying for the rest. Premium costs more, max instance count affects scale-out not warmth, and timers do not serve HTTP.',
    },
  ],
  statements: [
    { text: 'A single Azure Function can have both an HTTP trigger and a Timer trigger.', isTrue: false, explanation: 'Each function has exactly one trigger.' },
    { text: 'The connection property on a binding stores the connection string value directly.', isTrue: false, explanation: 'It stores the name of an app setting that contains the connection information.' },
    { text: 'Flex Consumption supports virtual network integration while keeping serverless billing.', isTrue: true, explanation: 'VNet integration is one of its headline additions over legacy Consumption.' },
    { text: 'The HTTP response limit of 230 seconds applies only to the Consumption plan.', isTrue: false, explanation: 'It applies on every plan because of the load balancer idle timeout.' },
    { text: 'On the Flex Consumption plan, the deployment package is stored in a blob container and the app runs from it.', isTrue: true, explanation: 'Package deployment is the only code deployment path for Flex Consumption.' },
    { text: 'Settings in local.settings.json are automatically published to the function app in Azure.', isTrue: false, explanation: 'The file is local-only; create app settings in Azure separately.' },
    { text: 'The Service Bus trigger completes a message automatically when the function returns without error.', isTrue: true, explanation: 'Auto-completion is on by default; disable it if you settle messages yourself.' },
    { text: 'Hosting Azure Functions on Azure Container Apps uses KEDA scale rules generated from the function triggers.', isTrue: true, explanation: 'The platform configures scaling from the triggers automatically.' },
  ],
  resources: [
    { label: 'Azure Functions triggers and bindings concepts', url: 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings' },
    { label: 'Azure Functions hosting options', url: 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale' },
    { label: 'Azure Functions Flex Consumption plan', url: 'https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-plan' },
    { label: 'Azure Functions Python developer guide', url: 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-python' },
  ],
};
