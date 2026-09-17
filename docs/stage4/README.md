# Stage4: method and operating guide

Stage4 gathers evaluation, agreement analysis and auditable evidence for the
research project. Here, Stage4 names an operational module; it is not an
automatic approval of the academic Gate 4. This manual explains the reference
method and the steps a researcher follows from preparation to publication.

This public checkout runs synthetic, provider-free technical checks only. It
does not run a REAL experiment, dispatch a model, accept credentials or contain
research data. The [private experiment handoff](../real-experiment-handoff.md)
is the entry point for authorized operators who need the separate private kit.

## Choose the applicable workflow

| Workflow | What it establishes | Where it runs |
| --- | --- | --- |
| Public synthetic checks | Contracts, declarative execution policy, checklist predicates and selected agreement calculations work on invented inputs. | This checkout; local Node.js or the optional VM. |
| Private offline preparation, including FAKE / IMPORTED_FAKE | The private kit's preparation, custody and analysis paths work under their documented synthetic conditions. | The authorized kit, outside this repository. |
| Private REAL canary | Operational behavior for an explicitly authorized pilot; scientifically ineligible. | The private kit and its approved research environment. |
| Private official REAL collection | Research observations eligible for assessment only after the protocol, instrument, authorization and evidence requirements are met. | The private kit and its approved research environment. |

FAKE, IMPORTED_FAKE and REAL are private workflow distinctions, not execution
modes or CLI switches supplied by this public repository. Technical success
does not promote a synthetic run or canary into an official observation.

## Reference design and units of analysis

The reference matrix is:

| Target family | Design | Targets | Dimensions per target | Judges | Judgment repetitions | Presentations |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Specs | 2 briefings × 2 generators | 4 | 4 (A1–A4) | 3 | 2 | 96 |
| Apps | 2 canonical Specs × 3 environments × 2 builder runs | 12 | 4 (B1–B4) | 3 | 2 | 288 |
| Total | 4 Specs + 12 apps | 16 | 64 target-dimension scoring units | 3 | 2 | 384 |

Thus, `(4 + 12) × 4 × 3 × 2 = 384` planned presentations. A presentation is
one target, one dimension, one judge and one judgment repetition. These are
not 384 independent projects. Builder runs produce distinct app targets;
judgment repetitions reassess the same target and do not create another app.

Each target belongs to a complete project bundle and is presented in its complete
project context: specification, requirements, relevant code and observed behavior.
The dimension limits the question being scored; it does not guarantee automatic
filtering of the project bundle. The current REAL path includes the complete
bundle. Inspect the supporting evidence and what each judge will receive before
collection. An isolated task, excerpt or screen is not a replacement for the
complete project context. The private kit verifies the inventory, bundle
references and the correspondence between target, dimension and evidence.

Judgment repetition 1 is the primary observation. Judgment repetition 2 measures
stability on the same target. The second never substitutes for, repairs,
selects or is averaged with the first. A missing or invalid first observation
remains incomplete; choosing the better score would change the design.
The qualitative protocol allows one attempt per presentation and zero automatic
retries. An ambiguous dispatched request requires custody inspection under the
private runbook before any further action; do not resend it to obtain a score.

## Rubric and evidence

Scores are ordinal integers from 1 to 5, using the frozen, dimension-specific
anchors supplied by the authorized kit. This guide describes the method; it
does not freeze a new rubric or introduce a quality threshold.

| Dimension | Question addressed | Evidence needed |
| --- | --- | --- |
| A1 — Clarity and absence of ambiguity | Can requirements be interpreted consistently? | Sanitized specification with relevant passages. |
| A2 — Requirement verifiability | Can fulfillment be decided from explicit criteria? | Sanitized specification and acceptance criteria. |
| A3 — Internal consistency | Do terminology, rules and sections agree? | Sanitized specification across its related sections. |
| A4 — Sufficiency for autonomous construction | Is there enough context to build without inventing central requirements? | Sanitized specification covering scope, data, flows and limits. |
| B1 — Fidelity to the specification | Does the app follow the specified behavior? | Specification, inert code and observed behavior. |
| B2 — Usability, heuristic evaluation | Are flows and feedback understandable? | Main-flow, error-state and empty-state screenshots. |
| B3 — Technical quality | Is implementation coherent and technically sound? | Inert source code. |
| B4 — Observed robustness | What happens at input and interaction boundaries? | Recorded observations of edge interactions. |

B2 is a heuristic evaluation, not a usability study with real users. B4 needs
observed behavior; documentation alone does not prove an interaction happened.
The reference method judges one dimension at a time, uses a recorded and frozen
presentation order, fixes versioned prompts and requires blinded origin. This
guide does not attest operational randomization in the REAL path. The qualitative
judge does not receive the deterministic checklist results. Public synthetic
examples have public oracles and cannot establish scientific blinding.

Each judgment associates an opaque object reference and dimension with evidence,
a justification, an ordinal score and reported confidence. Justify before
scoring, and cite the passage or observed element for every score below 5.
Confidence is descriptive, not a statistical weight. Preserve evidence links
so a reviewer can inspect the basis of a score without guessing from an average.

## Functional evaluation and H1

H1 is assessed by deterministic functional completeness, not qualitative scores.
A functionality is delivered only when all its required checks pass under valid
evaluation conditions. Freeze the primary scope and decision rule before
official collection; this manual does not redefine them. Check coverage is a
secondary diagnostic and cannot replace the functionality-delivery rate.

For each check, prepare a versioned fixture, initial state, expected observation,
runner, reset and controls for passing, failing and alternative conforming
implementations. Temporal cases also require a controlled clock, time zone and
explicit boundaries. Exercise controls and replay/reset behavior before relying
on the instrument. A broken fixture, reset or runner means incomplete evaluation,
not an application failure. See the [evaluator guidance](../../packages/evaluator/README.md).

## From preparation to publication

The sequence is prepare → validate → canary → collection → analysis →
audit/publication. It is a guide to responsibilities and expected evidence;
the exact private commands and authorizations come with the private kit.

| Step | Work and decision | Expected artifacts, kept private for REAL work |
| --- | --- | --- |
| Prepare | Obtain and verify the kit; select complete project targets and prepare the functional instrument and qualitative evidence. | Kit integrity result, versioned source inventory, project bundle references, fixtures, resets and controls. |
| Validate | Verify the actual research host, custody, rootless runtime, network/resource controls and permitted operational scope. Complete instrument validation and human review before official collection. | Measured host evidence, control/replay results, frozen protocol and prompt hashes, applicable authorization and ART-12 review evidence. |
| Canary | Run only the operational pilot permitted by the private runbook and inspect the outcome. | Separate, scientifically ineligible pilot records; no substitution into the official cohort. |
| Collection | Use the frozen official plan and inspect each presentation's terminal status. Preserve ambiguous or incomplete outcomes. | Blinded packets/plan, private identity map, judgments, execution receipts and custody records. |
| Analysis | Verify cohort completeness, validity and eligibility, then calculate the prescribed metrics. | Analysis outputs, denominators, exclusions/failures, coefficient estimates and reproducibility metadata. |
| Audit/publication | Review the evidence and analysis, seal and verify custody, then prepare a separately reviewed sanitized release. | Human audit record, custody verification, private backups, approved release inventory and checksums. |

An authorized operational canary may precede scientific instrument freeze, but
remains scientifically ineligible and does not satisfy ART-12. Official
collection requires the completed ART-12 instrument validation and human review.
No step here grants provider access, sets a budget or authorizes a paid call.

In the private workflow, SQLite records and an evidence vault retain operational
state and responses. Back up and verify both under the kit's custody procedure;
keep signing/blinding keys separate from evidence and publication outputs.
Preserve partial failures and interrupted attempts. A sealed record establishes
integrity under its trust assumptions, not truth of the observation or permission
to publish it. A custody summary alone is not an agreement-analysis report or a
completed human audit. There is no public end-to-end REAL audit command.

## Reading the analysis

The private kit provides ordinal Krippendorff alpha for agreement across three
judges, quadratic weighted kappa by judge pair, exact/within-one-point agreement,
score distributions and same-target judgment stability. Its reference analysis
uses bootstrap with 5,000 replicates and records the applicable resampling unit,
seed and interval method so the report can be reproduced. Do not treat the 384
presentations as interchangeable independent observations for resampling.

Use repetition 1 for the primary agreement analysis; compare repetition 1 and 2
for stability. Keep results by dimension and target family, with the specified
experimental groupings. Report undefined coefficients, absent ratings and
incomplete cohorts explicitly. The official report requires a complete, valid
and eligible cohort under the private protocol; a partial technical output
does not become an official result because a command exits successfully.

This public evaluator implements checklist predicates, exact agreement and
two-rater quadratic weighted kappa on synthetic data. Ordinal alpha, bootstrap
with 5,000 replicates, the full three-judge analysis/report pipeline and the
research H1 aggregator are not implemented in this public checkout. Qualitative
scores and agreement describe complementary evidence; they do not decide H1.

## Run the public checks locally

From this repository root, with Node.js 20 or newer as declared in
[package.json](../../package.json):

```sh
node --version
npm test
npm run check:public-safety
```

The current suite needs no `npm install`, environment variable, network access,
provider account or Docker socket. It checks synthetic behavior, documentation,
public-content safety and the per-file provenance inventory. New public files
must be inventoried; hashes must match the files being reviewed. A passing test
does not record human approval or erase a pending publication review.

## Windows / VirtualBox path

Follow the [Windows / VirtualBox guide](../../infra/vagrant-virtualbox/README.md)
after installing its host prerequisites. The optional initial bootstrap uses
internet access for the Debian box, packages and Node.js; it is separate from
the network-free Node.js tests above. In PowerShell at the public repository root:

```powershell
Set-Location .\infra\vagrant-virtualbox
.\Stage-Gates.ps1 -Action Validate
.\Stage-Gates.ps1 -Action Up
.\Stage-Gates.ps1 -Action Test
.\Stage-Gates.ps1 -Action Status
.\Stage-Gates.ps1 -Action Ssh
```

`Validate` checks Vagrant configuration; it does not boot a VM. `Up` transfers a
Git bundle and provisions. The bundle contains committed `main`, not the current
feature branch or uncommitted edits. `Test` runs host verification and the tests
already transferred to the guest; use `Up` to transfer a newer committed `main`.
After a failed provision, `Resume` reloads the existing VM and provisions again.
Use `Halt` when finished. Both are supported `-Action` values.

The wrapper defaults to an external sibling `stage-gate-runtime` directory for
VM state, generated SSH keys, cache, source bundle and transcript logs. Keep it
outside the repository. To adopt an existing VM, pass its original directory
through `-RuntimeDirectory`; choosing another directory can create another VM.
The default guest has 4 CPUs, 8192 MiB RAM and a minimum 80 GB disk. Shared
folders and SSH agent forwarding are disabled. See the linked guide for host
overrides and the lack of fully pinned box/apt versions.

The synchronized DNS preflight uses the Windows resolver through VirtualBox NAT:
it requires gateway `10.0.2.2`, prepends nameserver `10.0.2.3` to the guest's
resolvconf head, preserves `head.before-stage-gate`, runs `resolvconf -u` and
checks bootstrap domain resolution before apt. If the gateway or resolvconf is
unexpected it stops. Inspect the transcript and `DNS_OK` marker before retrying;
follow the infrastructure guide to restore the backed-up DNS configuration.
This adjustment supports bootstrap connectivity, not research network isolation.

The public bootstrap creates and verifies rootless Docker for `stagegaterunner`.
Its test setup pins Node.js 22.23.2 with a checksum. It does not prepare the
private `tccrunner` user or its runtime environment. Creating that environment,
verifying its rootless socket, isolation, quotas, dependencies and evidence
storage remains an authorized private-kit step. The private kit requires
Node.js 22 or newer, Python 3 and `sqlite3`; do not infer those private
prerequisites from a public VM pass.

Guest logs are stored in `/var/lib/stagegaterunner/evidence`.
`PASS_PROVIDER_FREE` records the public host checks;
`PASS_GATES_3_4_TECHNICAL` records successful synthetic tests and content checks.
Neither marker proves the private `tccrunner` rootless environment, a REAL
execution, scientific blinding, ART-12 compliance, H1 support or academic gate
approval. The public executor still builds a declarative OCI invocation; it
does not execute Docker or demonstrate the experiment-specific container path.

## Boundaries and reporting status

Separate what is implemented, what passed offline, what was observed on the
intended host and what has scientific approval. A run log can substantiate only
the revision and checks it actually records; this guide is not a VM run log.

Keep credentials, provider routing, real project identifiers, capsules, raw
responses, private maps, private kit files and backups outside this repository
and its history. A directory named `public` inside a private workflow denotes a
blinded surface, not publication permission. Release only after the separate
sanitization, provenance and human-review process in the
[public/private boundary](../public-private-boundary.md). This documentation
leaves historical `pending-human-review` entries pending.

For the next practical step, run the public checks above or follow the
[authorized private-kit handoff](../real-experiment-handoff.md). The
[gate mapping](../gates.md) explains how technical evidence supports, but does
not replace, the academic assessment.
