# API Integration Checklist

- [ ] Document each endpoint, method, request shape, and response shape.
- [ ] Validate inputs at the client and server boundaries.
- [ ] Set request timeouts and handle network interruptions.
- [ ] Handle non-success HTTP responses explicitly.
- [ ] Avoid duplicate submissions while a request is in progress.
- [ ] Keep secrets in environment configuration, never frontend source.
- [ ] Avoid logging authorization headers or sensitive payloads.
- [ ] Confirm pagination and empty-result behavior.
- [ ] Test malformed responses and server unavailability.