## Observability & runbook

### Metrics

Use Micrometer + Prometheus. Export /actuator/prometheus.
Key metrics:

- timeline latency histogram
- post creation latency
- Redis write ops / errors
- ES indexing latency / failures
- rate limit hits per minute
- worker backlog size (queued events)

### Logging

JSON structured logs with correlation ID (X-Request-Id).
Example: {timestamp, level, traceId, spanId, logger, message, userId, postId}

### Tracing

OpenTelemetry + Jaeger to trace create-post -> feed-update path.

### Alerts (Prometheus rules)

High timeline latency (>500ms) sustained 5m
Redis memory > 80% or ops errors > threshold
ES cluster yellow/red
Worker backlog > threshold (number of unprocessed events > 1000)

### Runbook (short)

Redis OOM: check eviction policy, increase instance, restart worker, monitor backlog.
ES down: failover to DB search (disable search end-point temporarily), notify team.
DB migration fails: rollback to previous schema snapshot, restore DB from backup if necessary.
