# Code Review Checklist

- [ ] The change solves a clearly stated problem.
- [ ] Naming and structure match existing conventions.
- [ ] Inputs and external data are validated.
- [ ] Failure and loading paths are handled.
- [ ] Authorization is enforced by trusted server-side logic where needed.
- [ ] Sensitive information is not exposed in logs or responses.
- [ ] Tests cover the main behavior and likely regressions.
- [ ] Documentation and configuration examples are updated.
- [ ] Dependencies are justified and reviewed.
- [ ] The diff contains no unrelated generated files or secrets.