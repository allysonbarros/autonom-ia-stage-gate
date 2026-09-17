# Evaluator

This Gate 4 package provides local deterministic checklist evaluation and
two-rater ordinal agreement metrics for synthetic fixtures. It has no provider,
network or credential interface.

The packaged metrics are technical checks, not a substitute for the TCC's
scientific validation protocol.

## Interpreting checks

A functionality and a check are different units. A functionality is delivered
only when all its required checks are satisfied under valid evaluation
conditions. Check coverage is a secondary diagnostic; it does not change the
primary H1 decision or its frozen scope. Equal coverage can conceal failures in
different functionalities.

This package returns individual predicate outcomes and their counts. It does
not implement the research H1 aggregator, decide which functionalities belong
in the primary scope, or freeze an instrument. Do not interpret `passed / total`
as the primary functionality-delivery rate.

## Preparing an instrument

Complete documentation does not prove execution. Each check needs a versioned
fixture, initial state, deterministic expected observation, runner, reset and
controls for passing, failing and alternative conforming implementations.
Temporal checks also need the relevant controlled clock, time zone and explicit
temporal boundaries. Exercise the reset and compare two replays before relying
on the check.

A fixture, reset or runner problem means incomplete evaluation, not an
application failure. The current predicate API returns only a pass flag and
optional detail; it does not certify that these conditions were met or represent
the full research evidence protocol. In particular, a predicate exception must
be investigated before its returned failure is interpreted as an app defect.

The [private experiment handoff](../../docs/real-experiment-handoff.md) explains
the separate operational and ART-12 prerequisites. These notes add no scientific
approval, model dispatch or execution capability to this package.
