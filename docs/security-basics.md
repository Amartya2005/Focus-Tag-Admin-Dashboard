# Dashboard Security Basics

- Enforce authentication and authorization on the server, not only by hiding UI controls.
- Validate and normalize untrusted input at system boundaries.
- Use parameterized database operations through the project's supported data layer.
- Keep secrets out of source control and client-side bundles.
- Use secure session handling and appropriate cookie settings for the deployment.
- Apply least privilege to database and service credentials.
- Avoid rendering untrusted HTML without safe sanitization.
- Do not expose stack traces, internal identifiers, or secrets in user-facing errors.
- Review dependency advisories and update vulnerable packages.
- Test role boundaries and direct API access, not only the visible UI.