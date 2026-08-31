# Public/private boundary

## Public

- canonical data contracts and integrity checks;
- provider-free OCI policy, supervisor and offline adapters;
- synthetic fixtures, test vectors and non-production evidence examples;
- evaluation, agreement and reporting code that operates only on synthetic or
  sanitized inputs;
- Vagrant/KVM bootstrap documentation with no host-specific data.

## Private

- production platform, authentication, database and export bridge;
- real project identifiers, Wizard contents, capsules, datasets and results;
- provider credentials, HMAC keys, access tokens and private evidence;
- operational topology, host addresses and paid-dispatch configuration.

The first public releases accept only newly invented synthetic fixtures. A future
sanitized package would require a separate release process: provenance manifest,
human review, DLP scan, re-identification assessment and published checksums. The
public repository never connects back to the platform or accepts a credential.
