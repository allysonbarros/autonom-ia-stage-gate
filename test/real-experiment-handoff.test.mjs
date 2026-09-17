import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (relative) => readFile(new URL(`../${relative}`, import.meta.url), "utf8");
const prose = (value) => value.replace(/\s+/g, " ");

test("README distinguishes existing public components from pending runtime work", async () => {
  const readme = prose(await read("README.md"));
  assert.match(readme, /\]\(docs\/real-experiment-handoff\.md\)/);
  for (const capability of [/canonical/i, /declarative.*OCI/i, /rootless/i, /quadratic weighted kappa/i]) {
    assert.match(readme, capability);
  }
  assert.match(readme, /does not execute Docker/i);
  assert.match(readme, /(?:pending|remain).*runtime.*(?:integration|execution)/i);
  assert.match(readme, /(?:pending|remain).*alpha.*report/i);
  assert.match(readme, /does not.*(?:dispatch|run).*REAL/i);
});

test("REAL handoff verifies a separate private kit before any operational steps", async () => {
  const handoff = await read("docs/real-experiment-handoff.md");
  const text = prose(handoff);
  assert.match(text, /authorized private channel/i);
  assert.match(text, /outside (?:the|this) public (?:repository|checkout)/i);
  assert.match(text, /Node\.js 22 or newer/);
  assert.match(text, /Python 3/);
  assert.match(text, /sqlite3/);
  assert.match(text, /from the (?:unpacked )?private kit root/i);
  const commands = [...handoff.matchAll(/```sh\n([\s\S]*?)```/g)].map((match) => match[1]).join("\n");
  assert.match(commands, /^npm run verify:kit$/m);
  assert.match(commands, /^npm test$/m);
  assert.doesNotMatch(commands, /npm install|--(?:provider|endpoint|api-key)|https?:\/\//);
  assert.match(text, /does not require `npm install` or a frontend deployment/i);
  const publicPackage = JSON.parse(await read("package.json"));
  assert.equal(publicPackage.scripts["verify:kit"], undefined);
  assert.ok(text.indexOf("npm run verify:kit") < text.indexOf("Validate the operational prerequisites"));
  assert.ok(text.indexOf("Validate the operational prerequisites") < text.indexOf("Run the authorized canary"));
  for (const prerequisite of [/rootless Docker/, /network/, /quotas/, /ART-12/, /instrument/, /controls/]) {
    assert.match(text, prerequisite);
  }
  assert.match(text, /public test suite does not prove.*VM.*runtime isolation.*scientific blinding/i);
  assert.match(text, /ART-12 instrument validation and human review before official collection/i);
  assert.match(text, /operational pilot or canary may precede scientific instrument freeze/i);
  assert.match(text, /remains scientifically ineligible and does not satisfy ART-12/i);
  assert.match(text, /operational prerequisites and authorization defined in the private runbooks/i);
  assert.doesNotMatch(text, /ART-12.*before the canary and official collection/i);
});

test("evaluation guidance keeps check diagnostics and documentary preparation separate from H1", async () => {
  const evaluator = prose(await read("packages/evaluator/README.md"));
  assert.match(evaluator, /functionality and a check are different units/i);
  assert.match(evaluator, /all.*required checks/i);
  assert.match(evaluator, /check coverage.*secondary.*does not change.*H1/i);
  assert.match(evaluator, /documentation does not prove execution/i);
  for (const requirement of [/fixture/, /reset/, /controls/, /clock/, /time zone/, /boundaries/]) {
    assert.match(evaluator, requirement);
  }
  assert.match(evaluator, /incomplete evaluation.*not.*application failure/i);
  assert.match(evaluator, /does not implement.*H1 aggregator/i);
});

test("the handoff preserves the public boundary and pending human review", async () => {
  const boundary = prose(await read("docs/public-private-boundary.md"));
  assert.match(boundary, /newly invented synthetic fixtures/);
  assert.match(boundary, /never connects back to the platform or accepts a credential/);
  assert.match(boundary, /private kit.*outside the public repository/i);
  assert.match(boundary, /does not authorize.*private source.*capsules.*evidence/i);
  assert.match(boundary, /human review.*pending/i);
  const handoff = prose(await read("docs/real-experiment-handoff.md"));
  assert.match(handoff, /does not record.*human review.*approval/i);
  assert.match(handoff, /credentials.*capsules.*results.*outside the public repository/i);
});
