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

## Private experiment handoff

The [handoff guide](real-experiment-handoff.md) describes how an authorized
operator obtains and verifies a separate private kit outside the public
repository. It contains no private package, download endpoint or deployment
configuration. Updating both repositories does not authorize copying private
source, capsules or evidence into this repository or its Git history.

The historical requirements for identified human review remain pending where
the provenance registry and specification review say so. This documentation
update does not approve those entries or close the historical release gates.
