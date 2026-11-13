import type { Concept } from '../../types';

export const serviceBusAndEventGrid: Concept = {
  id: 'service-bus-and-event-grid',
  title: 'Azure Service Bus and Event Grid for Event-Driven AI Back Ends',
  summary:
    'Decouple AI workloads with messaging: Service Bus queues, topics and subscription filters with peek-lock settlement and dead-letter handling, versus Event Grid topics and subscriptions with event-type, subject and advanced filters, custom events, retry policy and dead-lettering to Blob storage.',
  certs: ['ai-200'],
  domains: ['ai-200-3'],
  outcomes: ['ai-200-3-1-1', 'ai-200-3-1-2'],
  tags: ['service-bus', 'event-grid', 'messaging', 'dead-letter', 'topics', 'subscriptions', 'retries'],
  difficulty: 'intermediate',
  sections: [
    {
      heading: 'Messages versus events: choosing the service',
      body: `A **message** carries data that the receiver must process (a document to embed, an order to fulfil); the sender expects work to happen and the payload may be large. An **event** is a lightweight notification that something happened (a blob was created, a secret is about to expire); the publisher has no expectation about what subscribers do. Azure maps these to two services:

- **Azure Service Bus**: enterprise message broker. Queues (one competing-consumer group, FIFO ordering, load levelling), topics with **subscriptions** (publish/subscribe fan-out with per-subscription filters), transactions, sessions (ordered processing per session id), scheduled and deferred messages, duplicate detection, and **dead-letter queues**. Standard tier messages up to 256 KB; Premium up to 100 MB. Pull-based: your worker asks for messages.
- **Azure Event Grid**: event router with push delivery (HTTP webhooks, Functions, Service Bus, Event Hubs, Storage queues) and pull delivery via namespace topics. System topics come from Azure resources (Storage, Key Vault, Container Registry), **custom topics** are yours, and partner topics come from SaaS. Events are small (the payload array up to 1 MB, each event up to 1 MB) and delivery is at-least-once with a **retry policy** and optional **dead-lettering** to a storage account.

In an AI back end they often chain: Event Grid signals "blob uploaded" → an Azure Function drops an *ingest* message on a Service Bus queue → a Container App worker (scaled by KEDA on queue depth) chunks, embeds and writes vectors → it publishes a custom "document indexed" event for anyone interested. Service Bus is where you want buffering, ordering and poison-message handling; Event Grid is where you want reactive fan-out without polling.`,
    },
    {
      heading: 'Service Bus: settlement, locks, filters and dead-lettering',
      body: `Receivers run in one of two modes. **Receive-and-delete** removes the message as it is handed over (at-most-once; fine for low-value data). **Peek-lock** (the default in the SDKs) locks the message for the lock duration while you process it, then you **settle**: \`complete\` (done, remove), \`abandon\` (release for redelivery, delivery count +1), \`defer\` (set aside to fetch later by sequence number), or \`dead_letter\` (move to the DLQ with a reason). If you take longer than the lock duration, **renew the lock** (the Functions trigger does this automatically, default up to 5 minutes); if the lock expires or your receiver closes before settling, the message is redelivered and the delivery count increments. In Python: \`ServiceBusClient(fully_qualified_namespace, credential)\`, \`get_queue_sender\`/\`get_queue_receiver\` (or \`get_subscription_receiver\`), \`send_messages\`, \`receive_messages(max_message_count, max_wait_time)\`, \`complete_message\`, \`dead_letter_message(msg, reason=..., error_description=...)\`.

Every queue and subscription has an automatic **dead-letter queue** (DLQ) at \`<queue>/$DeadLetterQueue\` or \`<topic>/Subscriptions/<sub>/$DeadLetterQueue\`; you cannot create or delete it, TTL does not apply inside it, and nothing is cleaned up automatically. The system dead-letters when: **MaxDeliveryCountExceeded** (default max delivery count 10; the one that catches poison messages that keep throwing), **TTLExpiredException** (only if *dead-lettering on message expiration* is enabled; otherwise expired messages are simply dropped), **HeaderSizeExceeded**, and optionally on filter evaluation exceptions. Applications dead-letter explicitly with a custom reason when retrying is pointless (malformed JSON). Read the DLQ with a receiver on \`sub_queue=ServiceBusSubQueue.DEAD_LETTER\`, inspect \`DeadLetterReason\`/\`DeadLetterErrorDescription\`, fix and **resubmit** to the main queue, then complete the DLQ copy. Messages that fail auto-forwarding land in the *transfer* DLQ.

**Subscription filters** control which topic messages a subscription copies: **SQL filters** (\`user.type = 'invoice' AND sys.Label LIKE 'eu-%'\`; system properties prefixed \`sys.\`), **correlation filters** (cheap equality on CorrelationId, Subject/Label, ContentType, To, or custom properties; prefer these for performance), and the boolean **TrueFilter**/**FalseFilter**. Rules without actions OR together into one copy; a rule with an **action** (\`SET quantity = quantity / 2\`) yields its own annotated copy.`,
    },
    {
      heading: 'Event Grid: custom events, filters, retries and dead-letters',
      body: `Create a custom topic (\`az eventgrid topic create\`), then publish with the SDK (\`EventGridPublisherClient\`) or HTTP POST with the \`aeg-sas-key\` header (or Entra auth with *EventGrid Data Sender*). Events use either the **Event Grid schema** (\`id\`, \`eventType\`, \`subject\`, \`eventTime\`, \`data\`, \`dataVersion\`) or **CloudEvents 1.0** (\`type\`, \`source\`, \`subject\`, \`data\`); the topic's input schema decides. Design the **subject** as a path (\`/tenants/contoso/docs/123.pdf\`) because subscribers filter on it.

An **event subscription** binds a topic to an endpoint (\`az eventgrid event-subscription create --source-resource-id <topic> --endpoint <url|resource>\`). Webhook endpoints must pass **validation**: Event Grid sends a \`SubscriptionValidationEvent\` with a \`validationCode\` the endpoint echoes back (or the endpoint owner clicks the \`validationUrl\`); Functions with an Event Grid trigger, Logic Apps and Automation handle this for you. CloudEvents webhooks use the HTTP OPTIONS abuse-protection handshake instead.

Filtering happens per subscription: **event type** (\`--included-event-types Contoso.Doc.Indexed\`), **subject begins/ends with** (\`--subject-begins-with /tenants/contoso --subject-ends-with .pdf\`), and **advanced filters** on data fields (\`--advanced-filter data.priority NumberGreaterThan 7\`, operators such as StringContains, StringIn, NumberIn, BoolEquals, IsNullOrUndefined, with up to 25 filter values per subscription and OR support).

Delivery is at-least-once with an **exponential back-off schedule** (10 s, 30 s, 1 min, 5 min, 10 min, 30 min, 1 h, 3 h, 6 h, then every 12 hours) for **24 hours or 30 attempts by default**; both are configurable (\`--event-ttl 1..1440\` minutes, \`--max-delivery-attempts 1..30\`, whichever is hit first wins) and the schedule itself is not configurable. Event Grid waits 30 seconds for a 2xx; 400, 413 and 403 (and 401 for some handlers) are not retried and go straight to dead-letter. **Dead-lettering is off by default**: enable it by naming a Blob container (\`--deadletter-endpoint <storage>/blobServices/default/containers/<name>\`), optionally with managed identity; undelivered events are written there (after about a five-minute delay) and you can subscribe to the dead-letter container's own blob events to alert on them. Output **batching** (max events per batch, preferred batch size KB) is per subscription and all-or-nothing per delivery.`,
    },
    {
      heading: 'The exam angle',
      body: `Service Bus items revolve around settlement and dead-letters:

- *"Messages reappear and are processed twice after about a minute."* Processing exceeds the **lock duration**; renew the lock, process faster, or shorten work per message.
- *"Malformed messages keep failing and blocking the queue."* After 10 deliveries they go to the DLQ (**MaxDeliveryCountExceeded**); dead-letter explicitly earlier with a reason, then inspect via the \`$DeadLetterQueue\` sub-queue.
- *"Expired messages vanish without trace."* Enable **dead-lettering on message expiration**.
- *"Three teams need different subsets of one event stream."* A **topic** with three **subscriptions** and **filters** (correlation filters when equality is enough).
- *"Hold a message until a specific time."* Scheduled enqueue time; "process all steps of one order in order" → **sessions**.

Event Grid items revolve around subscriptions:

- *"Receive only PDF uploads from one container."* subject begins with the container path, ends with \`.pdf\`, event type BlobCreated.
- *"Don't lose events when the handler is down for a day."* Dead-lettering to Blob storage (off by default) plus the 24 hour/30 attempt retry policy.
- *"Webhook never receives events."* The **validation handshake** was not answered.
- *"Filter on a field inside data."* **Advanced filter**.
- *"Publish your own domain events."* Custom topic, \`aeg-sas-key\` or Entra, choose Event Grid or CloudEvents schema.

Distractors: using Event Grid for 5 MB documents (use a Blob pointer), expecting Event Grid to guarantee ordering (it does not), expecting Service Bus to push to a webhook (it is pull-based; pair it with Functions or KEDA), and trying to delete or configure TTL on a DLQ.`,
    },
  ],
  examples: [
    {
      title: 'Peek-lock worker with explicit dead-lettering and DLQ inspection',
      description:
        'A Container Apps worker embeds documents from a Service Bus queue. Transient errors are abandoned so the message retries; unparseable messages are dead-lettered immediately with a reason. A separate script reads the DLQ for triage.',
      language: 'python',
      code: `from azure.identity import DefaultAzureCredential
from azure.servicebus import ServiceBusClient, ServiceBusSubQueue
import json

client = ServiceBusClient("contoso-sb.servicebus.windows.net", DefaultAzureCredential())

with client.get_queue_receiver(queue_name="ingest", max_wait_time=30) as receiver:
    for msg in receiver:                               # peek-lock by default
        try:
            doc = json.loads(str(msg))
        except json.JSONDecodeError as e:               # retrying will not help
            receiver.dead_letter_message(msg, reason="BadPayload",
                                         error_description=str(e)); continue
        try:
            embed_and_store(doc)                       # renew lock if slow
            receiver.complete_message(msg)
        except TransientError:
            receiver.abandon_message(msg)              # delivery count +1, retry

# triage: read the dead-letter sub-queue
with client.get_queue_receiver("ingest", sub_queue=ServiceBusSubQueue.DEAD_LETTER) as dlq:
    for msg in dlq.receive_messages(max_message_count=10, max_wait_time=5):
        print(msg.dead_letter_reason, msg.dead_letter_error_description)`,
      takeaway: 'Complete on success, abandon for transient failures, dead-letter with a reason when retries are futile; the DLQ is read as a sub-queue of the same entity.',
    },
    {
      title: 'Custom Event Grid topic with filtered subscription, retries and dead-letter',
      description:
        'The indexing service publishes Contoso.Document.Indexed events; a downstream Function should only receive high-priority events for one tenant, with a 12 hour retry window and dead-lettering to Blob storage.',
      language: 'bash',
      code: `az eventgrid topic create -g rg-ai -n contoso-docs -l westeurope --input-schema cloudeventschemav1_0
TOPIC_ID=$(az eventgrid topic show -g rg-ai -n contoso-docs --query id -o tsv)
STORAGE_ID=$(az storage account show -g rg-ai -n contosodlq --query id -o tsv)

az eventgrid event-subscription create -n notify-contoso \\
  --source-resource-id $TOPIC_ID \\
  --endpoint-type azurefunction \\
  --endpoint /subscriptions/<sub>/resourceGroups/rg-ai/providers/Microsoft.Web/sites/fn-notify/functions/OnIndexed \\
  --included-event-types Contoso.Document.Indexed \\
  --subject-begins-with /tenants/contoso/ \\
  --advanced-filter data.priority NumberGreaterThanOrEquals 7 \\
  --event-ttl 720 --max-delivery-attempts 20 \\
  --deadletter-endpoint $STORAGE_ID/blobServices/default/containers/eg-deadletters`,
      takeaway: 'Event type, subject prefix and advanced data filters narrow delivery; TTL and max attempts bound retries; a Blob container catches what could not be delivered.',
    },
    {
      title: 'The lock that expired (a realistic mistake)',
      description:
        'An embedding worker receives messages in peek-lock mode, calls an LLM that sometimes takes two minutes, and then completes the message. Operators notice documents being embedded twice and, after ten rounds, landing in the DLQ with MaxDeliveryCountExceeded. The lock (one minute) expires before completion, so Service Bus redelivers while the first worker is still processing, and the late complete() fails with a lock-lost error. Fixes: renew the lock during long work (or use the Functions trigger\'s automatic renewal with maxAutoLockRenewalDuration), keep processing idempotent (check whether the chunk already exists), and move the slow model call behind a smaller unit of work.',
      language: 'python',
      code: `from azure.servicebus import AutoLockRenewer

renewer = AutoLockRenewer(max_lock_renewal_duration=600)   # keep renewing up to 10 min
with client.get_queue_receiver("ingest") as receiver:
    for msg in receiver:
        renewer.register(receiver, msg)                     # background renewals
        if already_embedded(msg.message_id):                # idempotency guard
            receiver.complete_message(msg); continue
        embed_and_store(json.loads(str(msg)))               # may take minutes
        receiver.complete_message(msg)`,
      takeaway: 'Lock expiry, not a bug in Service Bus, causes duplicate processing; renew locks for long work and make handlers idempotent.',
    },
  ],
  keyPoints: [
    'Service Bus carries messages (work to do) with queues, topics/subscriptions, sessions, transactions and DLQs; Event Grid routes events (notifications) with push delivery and filters.',
    'Peek-lock: complete, abandon, defer or dead-letter; renew the lock for long processing or the message is redelivered and the delivery count grows.',
    'Default max delivery count is 10; exceeding it dead-letters with MaxDeliveryCountExceeded. Expired messages dead-letter only if dead-lettering on expiration is enabled.',
    'The DLQ lives at <entity>/$DeadLetterQueue, cannot be deleted, ignores TTL and requires manual draining and resubmission.',
    'Subscription filters: SQL (sys./user. properties), correlation (fast equality) and TrueFilter/FalseFilter; actions annotate copies.',
    'Event Grid custom topics accept Event Grid or CloudEvents 1.0 schema; webhook endpoints must answer the validation handshake.',
    'Event subscriptions filter by event type, subject begins/ends with, and advanced filters on data fields.',
    'Event Grid retries with exponential back-off for 24 hours or 30 attempts (configurable); dead-lettering to a Blob container is off by default and must be enabled per subscription.',
  ],
  flashcards: [
    { front: 'Service Bus queue versus topic?', back: 'A queue delivers each message to one competing consumer; a topic copies each message to every matching subscription (pub/sub).' },
    { front: 'Name the four settlement actions in peek-lock mode.', back: 'Complete, abandon, defer, dead-letter.' },
    { front: 'What happens when a message\'s delivery count exceeds the maximum (default 10)?', back: 'It is moved to the dead-letter queue with reason MaxDeliveryCountExceeded.' },
    { front: 'Path of a subscription\'s dead-letter queue?', back: '<topic>/Subscriptions/<subscription>/$DeadLetterQueue (queues: <queue>/$DeadLetterQueue).' },
    { front: 'Do expired Service Bus messages always go to the DLQ?', back: 'No. Only when dead-lettering on message expiration is enabled; otherwise they are dropped.' },
    { front: 'Which filter type should you prefer for simple equality matches on topic subscriptions?', back: 'Correlation filters (cheaper than SQL filters).' },
    { front: 'Default Event Grid retry policy?', back: '24 hours (1440 minutes) or 30 delivery attempts, whichever comes first, with exponential back-off.' },
    { front: 'Is Event Grid dead-lettering enabled by default?', back: 'No. Enable it per subscription by specifying a Blob storage container.' },
    { front: 'Which HTTP responses make Event Grid dead-letter immediately without retry?', back: '400 Bad Request and 413 Payload Too Large (also 403 Forbidden).' },
    { front: 'Three Event Grid filter categories?', back: 'Event type, subject begins/ends with, advanced filters on data fields.' },
    { front: 'What must a custom webhook do before receiving Event Grid events?', back: 'Complete the validation handshake by echoing the validationCode (or the owner opens the validationUrl).' },
    { front: 'Which header authenticates a REST publish to a custom Event Grid topic?', back: 'aeg-sas-key (or use Microsoft Entra with the EventGrid Data Sender role).' },
  ],
  quiz: [
    {
      question:
        'A worker processes Service Bus messages in peek-lock mode. Some messages are processed twice and eventually appear in the dead-letter queue with reason MaxDeliveryCountExceeded. Processing can take several minutes. What is the MOST likely cause?',
      options: [
        'The message lock expires before the worker completes the message, so Service Bus redelivers it',
        'The queue has duplicate detection enabled',
        'The sender publishes each message twice',
        'The dead-letter queue has a short time to live',
      ],
      correct: [0],
      explanation:
        'Lock expiry triggers redelivery and increments the delivery count until the DLQ threshold. Duplicate detection prevents duplicates, double publishing would not raise delivery counts, and the DLQ ignores TTL.',
    },
    {
      question:
        'Three downstream services each need a different subset of order messages: EU orders, high-value orders, and all orders for auditing. Which Service Bus design requires the LEAST code?',
      options: [
        'One topic with three subscriptions, each with its own filter rule',
        'Three queues and a sender that evaluates routing logic',
        'One queue read by three competing consumers',
        'Three namespaces with one queue each',
      ],
      correct: [0],
      explanation:
        'Topic subscriptions with SQL or correlation filters do the routing in the broker. Multiple queues push logic into the sender, competing consumers split rather than copy messages, and extra namespaces add cost without routing.',
    },
    {
      question:
        'Messages that exceed their time to live disappear from a Service Bus queue and operators want to inspect them instead. What should you configure?',
      options: [
        'Enable dead-lettering on message expiration for the queue',
        'Increase the maximum delivery count',
        'Switch receivers to receive-and-delete mode',
        'Create a dead-letter queue manually',
      ],
      correct: [0],
      explanation:
        'With that option enabled, expired messages move to the DLQ with TTLExpiredException. Delivery count concerns failures, receive-and-delete removes messages faster, and the DLQ exists automatically and cannot be created.',
    },
    {
      question:
        'An Azure Function must receive only BlobCreated events for .pdf files uploaded to the "contracts" container of a storage account. Which TWO subscription filters should you configure? (Select two)',
      options: [
        'Included event type Microsoft.Storage.BlobCreated',
        'Subject ends with .pdf and subject begins with /blobServices/default/containers/contracts',
        'An advanced filter on data.contentLength NumberGreaterThan 0',
        'Output batching with max events per batch 1',
      ],
      correct: [0, 1],
      explanation:
        'Event type and subject filters select exactly the required events. A content-length filter does not target the container or extension, and batching affects delivery shape not selection.',
    },
    {
      question:
        'An Event Grid subscription delivers to a webhook that will be offline for maintenance for two days. Events must not be lost. What should you do?',
      options: [
        'Enable dead-lettering to a Blob storage container on the subscription',
        'Set --max-delivery-attempts to 100',
        'Set --event-ttl to 4320 minutes',
        'Switch the topic to CloudEvents schema',
      ],
      correct: [0],
      explanation:
        'Retry cannot exceed 24 hours or 30 attempts, so undelivered events must be captured by dead-lettering. The maximum attempts limit is 30 and TTL tops out at 1440 minutes; schema does not affect durability.',
    },
    {
      question:
        'A custom HTTPS endpoint registered as an Event Grid webhook never receives events, and the subscription shows a failed provisioning state. What is the MOST likely cause?',
      options: [
        'The endpoint did not complete the subscription validation handshake',
        'The topic uses the Event Grid schema instead of CloudEvents',
        'Dead-lettering is not configured',
        'The subject filter is case sensitive',
      ],
      correct: [0],
      explanation:
        'Webhooks must echo the validation code (or the owner must open the validation URL) before delivery starts. Schema choice, dead-letter configuration and filter case do not block provisioning.',
    },
  ],
  statements: [
    { text: 'Azure Service Bus delivers messages to receivers by pushing to an HTTP endpoint.', isTrue: false, explanation: 'Service Bus is pull-based (AMQP receivers); Event Grid pushes to endpoints.' },
    { text: 'A Service Bus dead-letter queue is created automatically for every queue and subscription and cannot be deleted independently.', isTrue: true, explanation: 'It is a sub-queue of the parent entity.' },
    { text: 'In receive-and-delete mode a message lost during transfer to the client is redelivered.', isTrue: false, explanation: 'Receive-and-delete settles on send; a lost message is gone. Use peek-lock for at-least-once.' },
    { text: 'Correlation filters are more efficient than SQL filters for simple equality matching.', isTrue: true, explanation: 'Correlation filters match on a fixed set of properties with low overhead.' },
    { text: 'Event Grid guarantees that events are delivered in the order they were published.', isTrue: false, explanation: 'Event Grid provides at-least-once delivery without ordering guarantees.' },
    { text: 'Event Grid dead-letters an event immediately when the endpoint returns HTTP 400.', isTrue: true, explanation: '400 and 413 indicate the delivery can never succeed, so no retries occur.' },
    { text: 'Event Grid allows you to customise the exact retry schedule of a subscription.', isTrue: false, explanation: 'You can set TTL and maximum attempts, but the back-off schedule itself is fixed.' },
    { text: 'A Service Bus topic subscription can carry a rule action that modifies message properties on the copy it receives.', isTrue: true, explanation: 'Rules with actions produce annotated copies, for example SET quantity = quantity / 2.' },
  ],
  resources: [
    { label: 'Service Bus dead-letter queues', url: 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dead-letter-queues' },
    { label: 'Service Bus topic filters and actions', url: 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/topic-filters' },
    { label: 'Event Grid message delivery and retry', url: 'https://learn.microsoft.com/en-us/azure/event-grid/delivery-and-retry' },
    { label: 'Event filtering for Event Grid subscriptions', url: 'https://learn.microsoft.com/en-us/azure/event-grid/event-filtering' },
  ],
};
