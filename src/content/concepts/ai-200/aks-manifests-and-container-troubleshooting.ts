import type { Concept } from '../../types';

export const aksManifestsAndContainerTroubleshooting: Concept = {
  id: 'aks-manifests-and-container-troubleshooting',
  title: 'AKS Deployments with Manifests, and Troubleshooting AKS and Container Apps',
  summary:
    'Deploy workloads to Azure Kubernetes Service with Deployment, Service and ConfigMap manifests, wire the cluster to Azure Container Registry, then diagnose failures on AKS and Container Apps by reading pod events, container logs, Log Analytics tables and ingress configuration.',
  certs: ['ai-200'],
  domains: ['ai-200-1'],
  outcomes: ['ai-200-1-2-3', 'ai-200-1-2-4'],
  tags: ['aks', 'kubernetes', 'kubectl', 'manifests', 'container-insights', 'log-analytics', 'troubleshooting'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Getting a cluster ready and deploying manifests',
      body: `Azure Kubernetes Service (AKS) is managed Kubernetes: Azure runs the control plane, you own the node pools and the workloads. The deployment loop is:

1. \`az aks create -g rg -n aks-ai --node-count 2 --attach-acr contosoacr\` creates the cluster and grants the kubelet identity **AcrPull** on the registry. For an existing cluster use \`az aks update --attach-acr contosoacr\`. Without this, pods pulling from ACR fail with **ImagePullBackOff**. (ABAC-enabled registries use the Container Registry Repository Reader role instead.)
2. \`az aks get-credentials -g rg -n aks-ai\` merges a kubeconfig context so \`kubectl\` can talk to the API server.
3. Write **manifests** (YAML) and apply them: \`kubectl apply -f app.yaml\`. The core objects on the exam are a **Deployment** (desired replica count, pod template with image, ports, env, resources, probes), a **Service** (\`ClusterIP\` for internal traffic, \`LoadBalancer\` for a public Azure IP), **ConfigMap** and **Secret** for configuration, and optionally an **Ingress** for HTTP routing.
4. Verify with \`kubectl get pods\`, \`kubectl get service --watch\` (wait for EXTERNAL-IP), and \`kubectl rollout status deployment/<name>\`.

A manifest references images by full registry path, for example \`image: contosoacr.azurecr.io/rag-api:1.4\`. Updating the tag and re-applying performs a **rolling update**; \`kubectl rollout undo deployment/<name>\` rolls back. Set \`resources.requests\` and \`limits\` so the scheduler can place pods; a pod that cannot be placed stays **Pending** with an "Insufficient cpu/memory" event. Environment values come from \`env\`, \`envFrom.configMapRef\` or \`secretKeyRef\`; for Azure secrets, prefer **workload identity** and the Key Vault CSI driver over copying values into Kubernetes Secrets.`,
    },
    {
      heading: 'Troubleshooting AKS: events, logs and connectivity',
      body: `Debugging Kubernetes is a fixed sequence, and exam items test whether you know which command answers which question.

- **What state is the pod in?** \`kubectl get pods -n <ns>\`. Common statuses: \`ImagePullBackOff\`/\`ErrImagePull\` (wrong image name, tag, or no pull permission such as a missing \`--attach-acr\`), \`CrashLoopBackOff\` (the process exits; read logs), \`Pending\` (no node fits the resource requests, or a PVC is unbound), \`OOMKilled\` (memory limit too low), \`CreateContainerConfigError\` (a referenced ConfigMap or Secret does not exist).
- **Why?** \`kubectl describe pod <pod>\` shows the **Events** section: scheduling failures, image pull errors, failed liveness/readiness probes. \`kubectl get events --sort-by=.metadata.creationTimestamp\` shows events cluster-wide.
- **What does the app say?** \`kubectl logs <pod> [-c container] --previous\` for the crashed container's output. \`kubectl exec -it <pod> -- sh\` to run commands inside.
- **Can traffic reach it?** \`kubectl get svc\` to confirm the Service type and that \`selector\` labels match the pod labels (a Service with no endpoints means a label mismatch; check \`kubectl get endpoints\`). Then test from inside the cluster with a temporary pod: \`kubectl run curl --rm -it --image=curlimages/curl -- curl http://svc:80/health\`. For a \`LoadBalancer\` Service with no EXTERNAL-IP, inspect the service events for Azure quota or subnet issues.

**Container insights** (Azure Monitor for containers) stores cluster telemetry in Log Analytics. Key tables: **ContainerLogV2** (stdout/stderr), **KubeEvents** (Kubernetes events; only Warning events unless \`collect_all_kube_events\` is enabled), **KubePodInventory** (pod status and restarts), **KubeNodeInventory**, **Perf** and **InsightsMetrics** (CPU/memory). A typical query joins ContainerLogV2 with KubePodInventory on PodName to filter one deployment's logs.`,
    },
    {
      heading: 'Troubleshooting Azure Container Apps',
      body: `Container Apps hides Kubernetes but the failure modes rhyme. Start with logs:

- **Console logs** are the container's stdout/stderr: \`az containerapp logs show -n app -g rg --type console --follow\`, or query **ContainerAppConsoleLogs_CL** in Log Analytics.
- **System logs** are platform events (image pull, replica provisioning, probe failures, scaling): \`--type system\`, or **ContainerAppSystemLogs_CL**.
- **HTTP logs** (via diagnostic settings) land in **ContainerAppHTTPLogs**; the \`ResponseCodeDetails\` column tells you whether the proxy failed the request (\`route_not_found\`, \`upstream_per_try_timeout\`) or your container returned the error (\`via_upstream\`).

Then check the revision: \`az containerapp revision list\` shows **Provision status** and **Running status**. "Provisioned but Degraded" with *Deployment Progress Deadline Exceeded, 0/1 replicas ready* means the container never passed its probes within about 10 minutes, so look at startup time, the **target port**, and health probe ports. A revision that is "Scaled to zero" shows no log stream; set min replicas to 1 while debugging. If the image cannot be pulled, verify registry credentials or the registry identity.

Connectivity checks: is **ingress enabled**, is it \`external\` when internet clients need it, does the **target port** match the port the container listens on, and are probe ports equal to the target port? Requests from the VNet that return 404 often mean the ingress is internal-only or the environment type does not match. \`az containerapp replica list\` and \`az containerapp exec --command sh\` let you reach into a running replica. In multiple revision mode, confirm traffic weights are not still routing to an outdated revision.`,
    },
    {
      heading: 'The exam angle',
      body: `Most items hand you a symptom and ask for the diagnostic step or the root cause:

- *"Pods show ImagePullBackOff after moving images to ACR."* Run \`az aks update --attach-acr\` (AcrPull for the kubelet identity).
- *"Pod is CrashLoopBackOff; find out why."* \`kubectl logs <pod> --previous\`, then \`kubectl describe pod\`.
- *"Service has an external IP but connections time out."* Compare the Service selector with pod labels, and the Service targetPort with the container port.
- *"Query the last hour of stdout from pods in namespace prod."* ContainerLogV2 (joined to KubePodInventory for namespace or pod names).
- *"See why Kubernetes evicted or failed to schedule pods."* KubeEvents (Warning events) or \`kubectl get events\`.
- *"Container App revision is Degraded, 0/1 replicas ready."* Startup/probe problem: check target port and health probes; extend the startup probe for slow apps.
- *"Container App returns 404 for internal callers."* Ingress visibility or environment type mismatch.
- *"Where do a Container App's stdout lines live in Log Analytics?"* ContainerAppConsoleLogs_CL; platform events are ContainerAppSystemLogs_CL.

Distractors: enabling the ACR admin user to fix ImagePullBackOff (works but is not the recommended identity-based fix), reading AzureActivity for application logs, and looking in ContainerAppSystemLogs_CL for application exceptions.`,
    },
  ],
  examples: [
    {
      title: 'Deployment and Service manifest for an inference API',
      description:
        'A minimal AKS manifest for a FastAPI inference service pulled from ACR, exposed on a public load balancer, with resource requests so the scheduler can place it and a readiness probe so traffic waits for model load.',
      language: 'yaml',
      code: `apiVersion: apps/v1
kind: Deployment
metadata: { name: rag-api }
spec:
  replicas: 2
  selector: { matchLabels: { app: rag-api } }
  template:
    metadata: { labels: { app: rag-api } }
    spec:
      containers:
      - name: api
        image: contosoacr.azurecr.io/rag-api:1.4
        ports: [{ containerPort: 8000 }]
        env:
        - { name: SEARCH_ENDPOINT, valueFrom: { configMapKeyRef: { name: rag-config, key: searchEndpoint } } }
        resources:
          requests: { cpu: "500m", memory: "1Gi" }
          limits:   { cpu: "1",    memory: "2Gi" }
        readinessProbe: { httpGet: { path: /health, port: 8000 }, initialDelaySeconds: 20 }
---
apiVersion: v1
kind: Service
metadata: { name: rag-api }
spec:
  type: LoadBalancer
  selector: { app: rag-api }
  ports: [{ port: 80, targetPort: 8000 }]`,
      takeaway: 'The Service selector must match the pod labels and targetPort must match containerPort; requests/limits and probes keep scheduling and traffic predictable.',
    },
    {
      title: 'Finding one deployment\'s errors in Log Analytics',
      description:
        'Operations wants the last hour of error output from the rag-api pods in the prod namespace, plus any Kubernetes warning events for them.',
      language: 'text',
      code: `let pods = KubePodInventory
  | where TimeGenerated > ago(1h) and Namespace == "prod" and Name startswith "rag-api"
  | distinct ContainerID = tostring(ContainerID), PodName = Name;
ContainerLogV2
| where TimeGenerated > ago(1h)
| join kind=inner pods on $left.PodName == $right.PodName
| where LogMessage has_any ("ERROR", "Traceback")
| project TimeGenerated, PodName, LogMessage
| order by TimeGenerated desc;

KubeEvents
| where TimeGenerated > ago(1h) and Namespace == "prod" and Name startswith "rag-api"
| project TimeGenerated, Reason, Message, KubeEventType`,
      takeaway: 'ContainerLogV2 holds stdout/stderr, KubePodInventory maps pods to containers and namespaces, KubeEvents holds scheduling and probe warnings.',
    },
    {
      title: 'The label typo that produced a healthy app nobody could reach (a realistic mistake)',
      description:
        'A developer deploys to AKS, pods are Running, the LoadBalancer Service has a public IP, yet every request times out. kubectl get endpoints rag-api shows <none>: the Deployment labels pods app: rag-api but the Service selector says app: ragapi. Fixing the selector (or the labels) and re-applying restores traffic in seconds. The same pattern shows up in Container Apps as a target port that does not match the container\'s listening port.',
      language: 'bash',
      code: `kubectl get svc rag-api            # EXTERNAL-IP present, but...
kubectl get endpoints rag-api      # ENDPOINTS: <none>  -> selector mismatch
kubectl get pods -l app=rag-api --show-labels
kubectl describe svc rag-api | grep -i selector
# fix the selector in the manifest, then
kubectl apply -f rag-api.yaml && kubectl get endpoints rag-api`,
      takeaway: 'A Service with no endpoints is a selector or port mismatch, not a networking outage; check endpoints before blaming the load balancer.',
    },
  ],
  keyPoints: [
    'az aks create/update --attach-acr grants the kubelet identity AcrPull; without it pods show ImagePullBackOff.',
    'kubectl apply -f deploys manifests; Deployment + Service (ClusterIP or LoadBalancer) + ConfigMap/Secret are the core objects.',
    'Service selector must match pod labels and targetPort must match containerPort; kubectl get endpoints reveals mismatches.',
    'Diagnose pods in order: kubectl get pods (status), kubectl describe pod (events), kubectl logs --previous (crash output), kubectl exec (inside).',
    'Container insights tables: ContainerLogV2 (stdout/stderr), KubeEvents (warnings), KubePodInventory, KubeNodeInventory, Perf/InsightsMetrics.',
    'Container Apps logs: ContainerAppConsoleLogs_CL (app output), ContainerAppSystemLogs_CL (platform), ContainerAppHTTPLogs (proxy); az containerapp logs show --type console|system.',
    'A Degraded revision with 0/1 replicas ready points to probes, target port or slow startup; a scaled-to-zero revision has no log stream.',
    'For Container Apps connectivity check ingress enabled, external vs internal, target port, probe ports and traffic weights.',
  ],
  flashcards: [
    { front: 'Which AKS flag lets nodes pull from Azure Container Registry without credentials?', back: '--attach-acr on az aks create or az aks update (assigns AcrPull to the kubelet identity).' },
    { front: 'Pod status ImagePullBackOff most likely means?', back: 'Wrong image name/tag or no permission to pull from the registry.' },
    { front: 'Pod status CrashLoopBackOff: first command to run?', back: 'kubectl logs <pod> --previous (then kubectl describe pod for events).' },
    { front: 'Pod stuck in Pending: likely causes?', back: 'No node satisfies resource requests (insufficient cpu/memory), or an unbound persistent volume claim.' },
    { front: 'Which Log Analytics table holds AKS container stdout/stderr?', back: 'ContainerLogV2.' },
    { front: 'Which table holds Kubernetes events in Container insights?', back: 'KubeEvents (Warning events by default).' },
    { front: 'Which table holds a Container App\'s application console output?', back: 'ContainerAppConsoleLogs_CL.' },
    { front: 'Which table holds Container Apps platform/system events?', back: 'ContainerAppSystemLogs_CL.' },
    { front: 'CLI command to stream a Container App\'s console logs?', back: 'az containerapp logs show -n <app> -g <rg> --type console --follow' },
    { front: 'A Container Apps revision shows Degraded with "0/1 replicas ready". Likely cause?', back: 'The container never became healthy: wrong target port, failing health probes, or startup slower than the probe allows.' },
    { front: 'kubectl get endpoints shows <none> for a Service. Diagnosis?', back: 'The Service selector does not match any pod labels (or pods are not ready).' },
  ],
  quiz: [
    {
      question:
        'After migrating images to Azure Container Registry, pods on an existing AKS cluster fail with ImagePullBackOff. What is the recommended fix?',
      options: [
        'Run az aks update --attach-acr <registry> to grant AcrPull to the cluster identity',
        'Enable the ACR admin user and create an imagePullSecret with its password',
        'Change the Deployment image to use the latest tag',
        'Scale the node pool to add more nodes',
      ],
      correct: [0],
      explanation:
        'attach-acr assigns AcrPull to the kubelet managed identity. The admin user works but is the least secure approach, tag changes do not fix authorization, and node count is unrelated.',
    },
    {
      question:
        'A pod on AKS repeatedly restarts and shows CrashLoopBackOff. Which command gives you the output of the failed container run?',
      options: [
        'kubectl logs <pod> --previous',
        'kubectl get events',
        'az aks show --query powerState',
        'kubectl rollout status deployment/<name>',
      ],
      correct: [0],
      explanation:
        'kubectl logs --previous reads the terminated container\'s stdout/stderr. Events show scheduling and probe failures but not application output; az aks show reports cluster state; rollout status reports deployment progress.',
    },
    {
      question:
        'You need a KQL query over the last hour of stdout and stderr from containers in the prod namespace of an AKS cluster monitored by Container insights. Which table should the query start from?',
      options: [
        'ContainerLogV2',
        'AzureActivity',
        'ContainerAppConsoleLogs_CL',
        'KubeNodeInventory',
      ],
      correct: [0],
      explanation:
        'ContainerLogV2 stores AKS container logs. AzureActivity is control-plane activity, ContainerAppConsoleLogs_CL belongs to Container Apps, and KubeNodeInventory describes nodes.',
    },
    {
      question:
        'A new Azure Container Apps revision shows Provision status Provisioned and Running status Degraded with the message "Deployment Progress Deadline Exceeded. 0/1 replicas ready." Which TWO things should you check first? (Select two)',
      options: [
        'That the ingress target port matches the port the container listens on',
        'That health probe configuration allows enough time for the container to start',
        'That the Container Apps environment has a Log Analytics workspace',
        'That the revision mode is set to multiple',
      ],
      correct: [0, 1],
      explanation:
        'Zero ready replicas means probes never succeeded, which is usually a port mismatch or slow startup. Log destination and revision mode do not affect replica readiness.',
    },
    {
      question:
        'A Kubernetes Service of type LoadBalancer has an external IP, but requests time out. kubectl get endpoints shows no endpoints. What is the MOST likely cause?',
      options: [
        'The Azure load balancer has not finished provisioning',
        'The Service selector does not match the pod labels',
        'The cluster is missing the --attach-acr integration',
        'Container insights is not enabled on the cluster',
      ],
      correct: [1],
      explanation:
        'No endpoints means the selector matched no ready pods. An unprovisioned load balancer would show a pending EXTERNAL-IP, ACR integration affects image pulls, and monitoring does not affect routing.',
    },
    {
      question:
        'An engineer wants to see platform events such as image pulls and replica provisioning failures for an Azure Container App using the CLI. Which command is correct?',
      options: [
        'az containerapp logs show -n app -g rg --type system',
        'az containerapp logs show -n app -g rg --type console',
        'kubectl describe pod app',
        'az monitor activity-log list -g rg',
      ],
      correct: [0],
      explanation:
        'System logs carry platform events; console logs are the application\'s stdout/stderr. kubectl is not available for Container Apps, and the activity log records ARM operations rather than runtime events.',
    },
  ],
  statements: [
    { text: 'kubectl apply -f creates or updates the Kubernetes objects defined in a manifest file.', isTrue: true, explanation: 'apply is declarative and performs create-or-update.' },
    { text: 'A pod in Pending state usually indicates the application crashed on startup.', isTrue: false, explanation: 'Pending means it has not been scheduled, typically due to insufficient resources; crashes show as CrashLoopBackOff.' },
    { text: 'Container insights collects all Kubernetes events, including Normal events, by default.', isTrue: false, explanation: 'Only Warning events are collected unless collect_all_kube_events is enabled in the ConfigMap.' },
    { text: 'ContainerAppConsoleLogs_CL contains the stdout and stderr of containers in Azure Container Apps.', isTrue: true, explanation: 'Console logs are the application output; system logs are platform events.' },
    { text: 'A Container App that has scaled to zero still provides a live log stream from its replicas.', isTrue: false, explanation: 'With zero replicas there is nothing to stream; set min replicas to 1 while debugging.' },
    { text: 'az aks get-credentials configures kubectl to connect to an AKS cluster.', isTrue: true, explanation: 'It downloads and merges the cluster context into your kubeconfig.' },
    { text: 'In Container Apps, ResponseCodeDetails of via_upstream means your container itself returned the error status.', isTrue: true, explanation: 'via_upstream indicates the upstream (your app) set the status code, as opposed to proxy-generated codes like route_not_found.' },
  ],
  resources: [
    { label: 'Tutorial: Deploy an application to AKS', url: 'https://learn.microsoft.com/en-us/azure/aks/tutorial-kubernetes-deploy-application' },
    { label: 'Authenticate AKS with Azure Container Registry', url: 'https://learn.microsoft.com/en-us/azure/aks/cluster-container-registry-integration' },
    { label: 'Query logs from Container insights', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/containers/container-insights-log-query' },
    { label: 'Monitor logs in Azure Container Apps with Log Analytics', url: 'https://learn.microsoft.com/en-us/azure/container-apps/log-monitoring' },
  ],
};
