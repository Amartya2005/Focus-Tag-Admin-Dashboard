# Environment Setup Practices

1. Identify the runtime and package manager used by the project.
2. Install dependencies using the repository's documented lockfile workflow.
3. Keep local environment files out of version control.
4. Provide an example environment file containing names and safe placeholder values only.
5. Validate required configuration at startup and explain missing variables clearly.
6. Never put private API keys or service-role secrets in browser-delivered code.
7. Document supported runtime versions and common setup failures.
8. Recreate the environment from a clean checkout before calling setup instructions complete.