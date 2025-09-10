## Testing plan

### Unit tests

- Services (TimelineService, PostService, LikeService): Mockito.
- Utilities (sanitizer, mappers).

### Repository tests

- @DataJpaTest for repository custom queries.

### Integration tests

- @SpringBootTest with Testcontainers for Postgres, Redis, Elasticsearch (start containers in CI). Tests:
  creating a post triggers ES index and feed updates in Redis (use Awaitility to wait for worker).
  timeline fallback reads are correct.

### e2e tests (Cypress)

- Flows: register -> login -> follow -> post -> timeline -> like -> comment -> search.
- Use a seeded DB for deterministic tests.

### Load tests

- k6/Gatling scenarios:
  readers: 10k concurrent reading timelines (fetch from Redis)
  writers: 500 concurrent create-posts that fan-out to feeds (measure write latency)
  celebrity scenario: 1 user with 1M followers posting; measure worker backlog processing rate.

### Security tests

- OWASP ZAP scan against deployed staging instance.
- Manual penetration testing checklists:
  SQL injection on search endpoints
  XSS vector on post content
  Auth bypass tests (JWT replay/forged tokens)

### CI integration

- Unit tests run on every PR
- Integration tests run on nightly or on main branch (Testcontainers)
- e2e tests run on main after deploy to preview environment (docker-compose or staging)
