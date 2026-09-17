# Preparing a private REAL experiment

This public repository provides synthetic technical checks. The software for
an authorized REAL experiment is distributed as a separate private kit, with
its own versioned operating instructions. This guide describes the handoff;
it does not supply a research dataset, an execution grant or a provider route.

Start with the [Stage4 manual](stage4/README.md) for the reference matrix,
rubric, functional evaluation, analysis and evidence lifecycle. This handoff
describes the transition from that public guide to authorized private operation.

## 1. Obtain the private kit

Request the applicable kit through an authorized private channel. Extract it
into a dedicated directory outside the public repository. Keep credentials,
capsules and results in separate private locations, also outside the public
repository. Do not add the kit or its outputs to this checkout or its history.

## 2. Verify the private software

The standalone kit requires Node.js 22 or newer, Python 3 and the `sqlite3`
command. Run the following from the unpacked private kit root:

```sh
node --version
python3 --version
sqlite3 --version
npm run verify:kit
npm test
```

`verify:kit` belongs to the private kit; it is not a command in this public
checkout. It verifies the distributed files against the kit manifest. The
standalone controller does not require `npm install` or a frontend deployment.
Resolve integrity or test failures using the kit's instructions before proceeding.
Passing these checks establishes software integrity and offline behavior only.

## 3. Validate the operational prerequisites

Follow the kit's versioned runbooks on the intended research host. Verify the
actual Linux VM, rootless Docker, container isolation, network restrictions and
resource quotas. Preserve the measured evidence and the applicable authorization
in private storage; configuration declarations alone do not establish enforcement.

The [Windows / VirtualBox bootstrap](../infra/vagrant-virtualbox/README.md)
configures the public `stagegaterunner` user and pins Node.js 22.23.2 for synthetic
tests. It does not prepare the private `tccrunner` user, its rootless socket or
its research environment. Follow the private kit's setup and verify that actual
user's dependencies, permissions, isolation and resource controls. The public
`PASS_GATES_3_4_TECHNICAL` marker is not proof of those private prerequisites.

For official collection, review the selected source artifacts, scope and
priorities before freezing the evaluation instrument. Prepare fixtures, initial
states, deterministic expected observations, runners, resets and controls.
Temporal cases need an explicit clock, time zone and boundary conditions. Execute
the controls and repeatability checks, and complete the required ART-12 instrument
validation and human review before official collection. Documentary completeness
does not establish that a runner or control has actually executed.

Passing the public test suite does not prove a VM boot, runtime isolation or
scientific blinding. Neither the public tests nor a successful private kit test
run establish ART-12 compliance, H1 support or permission to invoke a provider.

## 4. Run the authorized canary, then the collection

An operational pilot or canary may precede scientific instrument freeze when
permitted by the operational prerequisites and authorization defined in the
private runbooks. It remains scientifically ineligible and does not satisfy
ART-12. Inspect its evidence before starting the official collection, complete
the required instrument validation and human review, and keep pilot and canary
outputs separate from the official sample.
Provider access, budgets, exact invocation instructions and evidence custody
remain part of that private workflow. This public guide cannot authorize them.

## 5. Analyze, audit and prepare a separate release

Preserve the frozen matrix of 4 Specs + 12 apps, 4 dimensions per target,
3 judges and 2 judgment repetitions: 384 planned presentations. Each target
retains its complete project context. Repetition 1 is primary; repetition 2
measures stability and must not substitute for or be averaged with the first.
Follow the private protocol for incomplete or ambiguous outcomes; the qualitative
protocol has one attempt per presentation and zero automatic retries.

The private kit provides ordinal alpha, pairwise quadratic weighted kappa and
bootstrap with 5,000 replicates. Check completeness, validity and scientific
eligibility before interpreting an official analysis. Ordinal alpha, bootstrap
and the complete research analysis pipeline are not implemented in this public
checkout. The public evaluator supplies
synthetic checklist predicates, exact agreement and two-rater kappa only;
qualitative scores do not replace deterministic functional completeness for H1.

Preserve and verify private SQLite state and the evidence vault, keep keys
separate, and complete the required custody sealing and human audit. A custody
summary does not substitute for an analysis report or a human review. Neither
the public repository nor this handoff supplies an end-to-end REAL audit CLI.

Any later public evidence release has a separate sanitization and review
process under the [public/private boundary](public-private-boundary.md). This
handoff does not record a human review or approval of historical exports and
does not close pending publication gates.
