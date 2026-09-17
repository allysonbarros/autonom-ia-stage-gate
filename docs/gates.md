# Gate mapping

The names in this repository follow the Stage-gate terminology adopted by the
TCC process.

The [Stage4 manual](stage4/README.md) is the central guide for method, operating
sequence and interpretation of evidence. Stage4 names an operational software
module; completing it does not automatically approve academic Gate 4.

## Gate 3 - Development approval

Gate 3 evaluates the developed prototype and development plan before the work
advances to testing and validation. The public technical evidence will cover
portable contracts, synthetic inputs, isolated execution infrastructure and
provider-free checks.

## Gate 4 - Testing and validation approval

Gate 4 reviews test and validation results before a product or solution moves
forward. The public technical evidence will cover deterministic test harnesses,
evaluation, agreement analysis, reports and sanitized release bundles.

The repository does not make an approval decision on behalf of TCC evaluators.
It provides auditable technical artifacts that can support those decisions.

## Interpreting the public technical checks

The [Windows / VirtualBox path](../infra/vagrant-virtualbox/README.md) runs the
public host verification and synthetic suite. `PASS_PROVIDER_FREE` concerns the
public `stagegaterunner` host checks; `PASS_GATES_3_4_TECHNICAL` concerns the
synthetic tests and public-content checks. Neither establishes the private
`tccrunner` rootless environment, REAL collection, ART-12 compliance, scientific
blinding, H1 support or an academic approval.

Keep four statuses separate: implemented capability, offline test result,
observed operation on the intended host, and scientific eligibility/review.
The public executor currently produces a declarative OCI invocation and does
not execute Docker. The public evaluator includes checklist predicates and
two-rater agreement; the full ordinal-alpha, bootstrap and research reporting
pipeline belongs to the private kit and is not implemented here.

H1 depends on deterministic functional completeness under the frozen instrument.
Qualitative rubric scores and judge agreement are complementary evidence, not
substitutes for that decision. Authorized REAL preparation follows the
[private-kit handoff](real-experiment-handoff.md); publication additionally
requires the [public/private boundary](public-private-boundary.md) review.
