<!--
Sync Impact Report

- Version change: template (no prior version) -> 1.0.0
- Modified principles: (added) Serverless-First Architecture; Infrastructure-as-Code (Terraform Governance); Test-First & CI-Gated Deployments; Security & Least Privilege; Observability, Monitoring & Simplicity
- Added sections: Operational Constraints; Development Workflow
- Removed sections: none
- Templates requiring review: ✅ .specify/templates/plan-template.md
	✅ .specify/templates/spec-template.md
	✅ .specify/templates/tasks-template.md
- Commands folder: ⚠ none present at .specify/templates/commands (no files found)
- Follow-up TODOs: none (no remaining bracket placeholders)
-->

# enPlace Constitution

## Core Principles

### Serverless-First Architecture
The system MUST favour serverless patterns for backend services where appropriate. Backend services are implemented as AWS Lambda functions exposed via API Gateway; the frontend is hosted on S3 and served via CloudFront. Design decisions MUST prefer managed services that reduce operational overhead and improve scalability.

Rationale: The project is built on a serverless architecture; this reduces maintenance burden and aligns with cost and scaling expectations for the app.

### Infrastructure-as-Code (Terraform Governance)
All infrastructure MUST be defined, reviewed, and deployed via Terraform. Terraform configurations MUST be stored in this repository (under `infra/`), use a remote state backend, and include `terraform plan` output in PRs affecting infrastructure. Changes to live infrastructure are NOT permitted outside of tracked Terraform changes.

Rationale: Declarative infra ensures reproducible environments and peer-reviewed changes for production safety.

### Test-First & CI-Gated Deployments (NON-NEGOTIABLE)
Development MUST follow a test-first mindset: unit tests, contract tests, and integration tests where applicable. CI pipelines MUST run tests and static analysis; merges to `main`/`prod` branches MUST only occur after passing CI and at least one approving review from a repository owner or code owner.

Rationale: Tests reduce regressions and ensure reliable serverless releases where rollbacks are more complex.

### Security & Least Privilege
Security is a first-class concern. IAM roles and policies MUST follow least-privilege principles. Secrets MUST be stored in AWS Secrets Manager or equivalent and never committed to source. Authentication and authorization flows MUST use managed services (e.g., Cognito) where feasible. Security-related changes require an explicit review and mention in the PR description.

Rationale: Protect user data and production resources; make security explicit and auditable.

### Observability, Monitoring & Simplicity
All services MUST emit structured logs and relevant metrics. Critical business flows MUST have alerts with clear escalation paths. Solutions SHOULD start simple and be iterated on using data; avoid premature optimization.

Rationale: Observability enables fast detection and remediation of issues while simplicity reduces maintenance cost.

## Operational Constraints

This project is operated on AWS and managed via Terraform. Primary services and constraints:

- Cloud: AWS (API Gateway, Lambda, S3, CloudFront, DynamoDB, Secrets Manager, Cognito)
- Infrastructure: Managed in `infra/` via Terraform; remote state required for shared environments
- CI/CD: PRs MUST include `terraform plan` for infra changes; CI MUST run tests for code changes
- Secrets & Keys: Store in Secrets Manager and reference via environment variables in Lambda; rotate and audit secrets regularly
- Cost & Backups: Teams MUST consider cost impact for new services; critical datasets in DynamoDB MUST have export/import/runbook procedures

Operational Rules:

- No manual edits to production infrastructure outside Terraform.
- Feature flags and incremental rollouts SHOULD be used for risky changes.
- Use staging environment(s) mirroring production for testing infra and integration changes.

## Development Workflow

- All work MUST be done on feature branches and merged via Pull Request.
- PRs MUST include: change summary, rationale, test plan, and where applicable `terraform plan` output for infra changes.
- Reviews: At least one approving review from a code owner; for security or infra changes, require two approvers including an infra or security owner.
- CI Gates: Unit tests, linting, and contract/integration tests (as applicable) MUST pass before merge.
- Releases: Deployments to production MUST be triggered from CI after tagging a release; deployment runbooks or rollback steps MUST be included for infra-impacting releases.

## Governance

Amendments to this constitution MUST be made via a Pull Request that modifies this file and includes:

- A clear description of the proposed change and rationale.
- A migration or compliance plan if the change affects operational processes.
- Approval from at least two maintainers (one must be an infra or security owner for infra/security changes).

Versioning policy:

- MAJOR: Backwards-incompatible governance or principle removals/ redefinitions.
- MINOR: Addition of new principles or material expansions to existing sections.
- PATCH: Clarifications, wording fixes, and non-semantic refinements.

Compliance review expectations:

- Every PR that affects infra, security, or release processes MUST reference this constitution and list any resulting compliance impacts.

**Version**: 1.0.0 | **Ratified**: 2026-01-25 | **Last Amended**: 2026-01-25
