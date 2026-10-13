# Error Handling Guidelines

## Principles
- Show users a concise, actionable message.
- Keep stack traces, internal paths, tokens, and raw server errors out of the UI.
- Distinguish validation errors, authorization failures, network failures, and unexpected errors.
- Preserve user input when safe and useful.
- Provide retry actions only when retrying is safe.
- Log a correlation identifier when available, not sensitive payloads.

## Review checklist
- [ ] Every async request handles failure.
- [ ] Loading state is cleared after success or failure.
- [ ] Empty results are distinct from failed requests.
- [ ] Unauthorized and forbidden responses are handled explicitly.
- [ ] Error messages do not disclose implementation details.