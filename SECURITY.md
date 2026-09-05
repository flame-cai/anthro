# Security Policy

## Scope

`anthro` is an open-source implementation of the WHO Child Growth Standards methodology.

Security issues may arise in several areas of the project, including:

- JavaScript and Python code
- dependency management
- input validation
- reference-data processing
- build and release scripts
- GitHub Actions workflows
- npm and PyPI publishing
- documentation or website build processes

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you believe you have identified a security vulnerability, please contact the maintainer privately through an appropriate GitHub security channel or other private communication channel available from the repository owner.

When reporting a vulnerability, please provide:

- A clear description of the issue
- The affected file, component, package, or workflow
- Steps required to reproduce the issue
- The potential security impact
- Any proof of concept that can be safely shared
- Suggested remediation, if known

Please avoid including personal information, credentials, access tokens, private keys, or other sensitive information in the report.

## What should be reported

Examples of security issues include:

- Remote code execution
- Arbitrary code execution through untrusted input
- Injection vulnerabilities
- Path traversal or unsafe file handling
- Dependency vulnerabilities with a practical impact on the project
- Exposure of secrets or credentials
- Unsafe GitHub Actions behavior
- Improper use of GitHub Actions permissions
- Package publishing or release-process vulnerabilities
- Supply-chain attacks
- Tampering with reference data during automated processing or release
- Vulnerabilities in generated or deployed project assets

## GitHub Actions and supply-chain security

The project uses GitHub Actions for testing, building, GitHub Pages deployment, and package publishing.

Changes to workflows should therefore be treated as security-sensitive.

In particular, contributors should carefully review changes involving:

- `permissions`
- GitHub tokens
- OIDC / `id-token`
- npm publishing credentials
- PyPI Trusted Publishing
- third-party GitHub Actions
- release and tag triggers
- dependency installation
- shell commands operating on repository-controlled input

Pull requests from untrusted contributors must not be given unnecessary access to secrets or publishing credentials.

## Supported versions

Security fixes are generally applied to the current development version on the `main` branch.

Because this project is maintained by a small open-source team, security support for old releases is not guaranteed.

Users should use a current release where practical.

## Disclosure

After a vulnerability has been reported, the maintainer will assess its severity and determine an appropriate disclosure and remediation process.

Where appropriate, a security fix may be accompanied by:

- a patched release;
- a GitHub security advisory;
- release notes;
- dependency updates; or
- documentation describing the affected behavior.

The project does not guarantee a particular response time.

## Important limitation

`anthro` is an independent implementation and is not official WHO software.

The existence of a security issue, its remediation, or its absence must not be interpreted as a security assessment or certification by WHO.

## Contact

For security reports, use the repository's private security-reporting facilities where available.

Do not disclose vulnerabilities publicly until the maintainer has had a reasonable opportunity to investigate and address them.