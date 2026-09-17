# AutonomIA Stage-Gate

Reproducible, provider-free technical evidence for the development and
testing-validation stages of the AutonomIA research project.

## Scope

The repository is organized around the TCC Stage-gate process:

- **Gate 3 - Development approval:** portable development artifacts, contracts,
  isolated execution infrastructure and synthetic fixtures.
- **Gate 4 - Testing and validation approval:** automated checks, evaluation,
  agreement analysis and reproducible reports using synthetic data.

This project is intentionally separate from the production platform. It does
not contain platform source code, production integrations, real projects,
research capsules, provider credentials, private evidence, or any route that
can dispatch a paid model.

## Safety boundary

All bundled inputs are synthetic and marked non-scientific. A successful local
test is evidence that the harness works; it is not an ART-12, H1, product or
scientific claim. The public repository defaults to provider-free execution.

## Available components

- [Contracts](packages/contracts/README.md): canonical JSON, synthetic input
  validation and reproducible integrity receipts.
- [Executor policy](packages/executor/README.md): a declarative, provider-free
  OCI invocation with a pinned image and fixed isolation settings. It does not
  execute Docker.
- [Host candidate](infra/vagrant-kvm/README.md): Vagrant/KVM provisioning and
  checks for rootless Docker, with the default shared folder disabled.
- [Evaluator](packages/evaluator/README.md): local checklist predicates, exact
  agreement and quadratic weighted kappa for synthetic inputs.
- Public-content scanning, negative safety tests and per-file provenance hashes.

Pending work includes OCI runtime integration and an observed boot on a Linux
KVM host. The complete agreement/report pipeline, including ordinal alpha and
reproducible reports, also remains pending. Public unit tests do not establish
these operational results.

This checkout does not dispatch or run a REAL experiment. Researchers preparing
one should use the [private experiment handoff](docs/real-experiment-handoff.md)
to obtain and verify the separate private kit. A future sanitized evidence
release requires its own review; no research results are bundled here.

See [the public/private boundary](docs/public-private-boundary.md) and
[the gate mapping](docs/gates.md).

## Development

```sh
npm test
npm run test:public-safety
npm run check:public-safety
```

No environment variable, provider account, Docker socket or network access is
required by the current test suite.

## License

MIT. See [LICENSE](LICENSE).
