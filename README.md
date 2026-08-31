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

## Roadmap

1. Publish the public contracts, synthetic fixtures and DLP barrier.
2. Extract Gate 3's OCI runtime and offline host harness.
3. Extract Gate 4's evaluator, agreement and report pipeline.
4. Release a versioned, sanitized research-evidence bundle after the TCC.

See [the public/private boundary](docs/public-private-boundary.md) and
[the gate mapping](docs/gates.md).

## Development

```sh
npm test
npm run check:public-safety
```

No environment variable, provider account, Docker socket or network access is
required by the current test suite.

## License

MIT. See [LICENSE](LICENSE).
