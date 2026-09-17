import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (relative) => readFile(path.join(root, relative), "utf8");
const prose = (value) => value.replace(/\s+/g, " ");
const documentPaths = [
  "README.md",
  "docs/gates.md",
  "docs/real-experiment-handoff.md",
  "docs/stage4/README.md",
];
const documents = new Map(await Promise.all(documentPaths.map(async (relative) => [relative, await read(relative)])));
const manual = documents.get("docs/stage4/README.md");
const text = prose(manual);

test("Stage4 entry points and every local documentation link resolve within the public checkout", async () => {
  for (const entry of documentPaths.slice(0, 3)) {
    assert.match(documents.get(entry), /\]\((?:docs\/)?stage4\/README\.md\)/, entry);
  }
  for (const [relative, source] of documents) {
    const links = [...source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)];
    assert.ok(links.length > 0, `${relative} has navigable links`);
    for (const [, target] of links) {
      assert.doesNotMatch(target, /^(?:[a-z]+:|\/|#)/i, `${relative}: expected a local file link`);
      const [file, anchor] = target.split("#");
      const resolved = path.resolve(root, path.dirname(relative), decodeURIComponent(file));
      assert.ok(resolved.startsWith(root), `${relative}: link escapes public checkout`);
      assert.ok((await stat(resolved)).isFile(), `${relative}: missing ${target}`);
      if (anchor) {
        const destination = await readFile(resolved, "utf8");
        const headings = [...destination.matchAll(/^#{1,6}\s+(.+)$/gm)].map(([, heading]) => heading
          .toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu, "").replace(/\s/g, "-"));
        assert.ok(headings.includes(anchor), `${relative}: missing heading ${target}`);
      }
    }
  }
});

test("Stage4 reference matrix preserves the factorial design and distinct observation units", () => {
  const familyRows = [...manual.matchAll(/^\| (Specs|Apps) \| ([^|]+) \| (\d+) \| (\d+) \([^|]+\) \| (\d+) \| (\d+) \| (\d+) \|$/gm)];
  assert.equal(familyRows.length, 2);
  const counts = familyRows.map(([, family, design, targets, dimensions, judges, repetitions, presentations]) => {
    const values = [targets, dimensions, judges, repetitions, presentations].map(Number);
    const [targetCount, dimensionCount, judgeCount, repetitionCount, presentationCount] = values;
    assert.equal(targetCount * dimensionCount * judgeCount * repetitionCount, presentationCount, family);
    assert.match(design, family === "Specs" ? /2 briefings × 2 generators/ : /2 canonical Specs × 3 environments × 2 builder runs/);
    return values;
  });
  assert.deepEqual(counts, [[4, 4, 3, 2, 96], [12, 4, 3, 2, 288]]);
  assert.equal(counts.reduce((sum, row) => sum + row[4], 0), 384);
  assert.match(text, /64 target-dimension scoring units/);
  assert.match(text, /one target, one dimension, one judge and one judgment repetition/);
  assert.match(text, /not 384 independent projects/);
  assert.match(text, /Each target belongs to a complete project bundle/);
  assert.match(text, /dimension limits the question being scored; it does not guarantee automatic filtering of the project bundle/);
  assert.match(text, /current REAL path includes the complete bundle/);
  assert.match(text, /repetition 1 is the primary observation/i);
  assert.match(text, /repetition 2 measures stability on the same target/i);
  assert.match(text, /second never substitutes for, repairs, selects or is averaged with the first/);
  assert.match(text, /one attempt per presentation and zero automatic retries/);
  assert.match(text, /ambiguous dispatched request requires custody inspection/);
});

test("Stage4 rubric keeps dimension-specific evidence and deterministic H1 separate", () => {
  const dimensions = [...manual.matchAll(/^\| ([AB][1-4]) — ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm)];
  assert.deepEqual(dimensions.map(([, code]) => code), ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4"]);
  assert.ok(dimensions.every(([, , question, rationale, evidence]) => question.trim() && rationale.trim() && evidence.trim()));
  assert.match(text, /ordinal integers from 1 to 5/);
  assert.match(text, /dimension-specific anchors supplied by the authorized kit/);
  assert.match(text, /does not freeze a new rubric/);
  assert.match(text, /B2 is a heuristic evaluation, not a usability study with real users/);
  assert.match(text, /Justify before scoring/);
  assert.match(text, /cite the passage or observed element for every score below 5/);
  assert.match(text, /Confidence is descriptive, not a statistical weight/);
  assert.match(text, /recorded and frozen presentation order/);
  assert.match(text, /does not attest operational randomization in the REAL path/);
  assert.match(text, /qualitative judge does not receive the deterministic checklist results/);
  assert.match(text, /H1 is assessed by deterministic functional completeness, not qualitative scores/);
  assert.match(text, /functionality is delivered only when all its required checks pass under valid evaluation conditions/);
  assert.match(text, /Check coverage is a secondary diagnostic/);
  assert.match(text, /broken fixture, reset or runner means incomplete evaluation, not an application failure/);
  for (const control of ["initial state", "expected observation", "controls", "clock", "time zone", "boundaries"]) {
    assert.ok(text.includes(control), control);
  }
});

test("Stage4 describes a complete evidence lifecycle without promoting canaries or custody to science", () => {
  const steps = [...manual.matchAll(/^\| (Prepare|Validate|Canary|Collection|Analysis|Audit\/publication) \|/gm)].map(([, step]) => step);
  assert.deepEqual(steps, ["Prepare", "Validate", "Canary", "Collection", "Analysis", "Audit/publication"]);
  for (const artifact of ["inventory", "bundle references", "prompt hashes", "ART-12", "receipts", "denominators", "Human audit record", "checksums"]) {
    assert.ok(manual.includes(artifact), artifact);
  }
  assert.match(text, /canary may precede scientific instrument freeze, but remains scientifically ineligible and does not satisfy ART-12/);
  assert.match(text, /Official collection requires the completed ART-12 instrument validation and human review/);
  assert.match(text, /No step here grants provider access, sets a budget or authorizes a paid call/);
  assert.match(text, /SQLite records and an evidence vault/);
  assert.match(text, /keep signing\/blinding keys separate from evidence/);
  assert.match(text, /custody summary alone is not an agreement-analysis report or a completed human audit/);
  assert.match(text, /no public end-to-end REAL audit command/);
});

test("Stage4 identifies private analysis capabilities and the smaller public implementation", async () => {
  assert.match(text, /private kit provides ordinal Krippendorff alpha/);
  assert.match(text, /quadratic weighted kappa by judge pair/);
  assert.match(text, /bootstrap with 5,000 replicates/);
  assert.match(text, /resamples targets within each dimension/);
  assert.match(text, /seed is derived reproducibly from the recorded lock and judgment hashes plus the metric ID/);
  assert.match(text, /does not serialize a seed or a resampling-unit field/);
  assert.doesNotMatch(text, /records the applicable resampling unit, seed/);
  assert.match(text, /Use repetition 1 for the primary agreement analysis/);
  assert.match(text, /official report requires a complete, valid and eligible cohort/);
  assert.match(text, /Ordinal alpha, bootstrap with 5,000 replicates, the full three-judge analysis\/report pipeline and the research H1 aggregator are not implemented in this public checkout/);
  assert.match(text, /public evaluator implements checklist predicates, exact agreement and two-rater quadratic weighted kappa on synthetic data/);
  const exports = await read("packages/evaluator/src/agreement.mjs");
  assert.match(exports, /exactAgreement/);
  assert.match(exports, /quadraticWeightedKappa/);
  assert.doesNotMatch(exports, /krippendorff|bootstrap|aggregateH1/i);
});

test("Stage4 preserves the public boundary and does not supply private dispatch commands", async () => {
  assert.match(text, /public checkout runs synthetic, provider-free technical checks only/);
  assert.match(text, /does not run a REAL experiment, dispatch a model, accept credentials/);
  assert.match(text, /FAKE, IMPORTED_FAKE and REAL are private workflow distinctions, not execution modes or CLI switches supplied by this public repository/);
  assert.match(text, /Stage4 names an operational module; it is not an automatic approval of the academic Gate 4/);
  assert.match(text, /A directory named `public`.*not publication permission/);
  assert.match(text, /leaves historical `pending-human-review` entries pending/);
  const packageJson = JSON.parse(await read("package.json"));
  assert.ok(Object.keys(packageJson.scripts).every((name) => !/real|dispatch|provider|verify:kit/i.test(name)));
  for (const [relative, source] of documents) {
    assert.doesNotMatch(source, /(?:\/Users\/|\/home\/|[A-Z]:\\Users\\|https?:\/\/)/i, relative);
    for (const [, language, commands] of source.matchAll(/```(sh|powershell)\n([\s\S]*?)```/g)) {
      assert.doesNotMatch(commands, /https?:\/\/|--(?:provider|endpoint|api-key|real)|\b(?:curl|wget|dispatch|call-provider)\b/, relative);
      for (const line of commands.trim().split("\n")) {
        if (language === "powershell") continue;
        if (/^npm run /.test(line)) {
          const script = line.slice("npm run ".length);
          if (relative === "docs/real-experiment-handoff.md" && script === "verify:kit") continue;
          assert.ok(packageJson.scripts[script], `${relative}: unknown npm script ${script}`);
        } else {
          assert.match(line, /^(?:npm test|node --version|python3 --version|sqlite3 --version)$/, relative);
        }
      }
    }
  }
});

test("Stage4 Windows instructions match public wrapper actions, runner and pinned Node version", async () => {
  const wrapper = await read("infra/vagrant-virtualbox/Stage-Gates.ps1");
  const setup = await read("infra/vagrant-virtualbox/setup-tests.sh");
  const bootstrap = await read("infra/vagrant-kvm/provision/bootstrap-root.sh");
  const actions = new Set([...wrapper.match(/ValidateSet\(([^)]+)\)/)[1].matchAll(/'([^']+)'/g)].map(([, action]) => action));
  const commands = [...manual.matchAll(/```powershell\n([\s\S]*?)```/g)].map(([, block]) => block.trim().split("\n")).flat();
  assert.equal(commands[0], "Set-Location .\\infra\\vagrant-virtualbox");
  for (const command of commands.slice(1)) {
    const match = command.match(/^\.\\Stage-Gates\.ps1 -Action (\w+)$/);
    assert.ok(match, `unexpected Windows command: ${command}`);
    assert.ok(actions.has(match[1]), `unsupported action: ${match[1]}`);
  }
  const nodeVersion = setup.match(/^readonly version=(\d+\.\d+\.\d+)$/m)[1];
  const runner = bootstrap.match(/^readonly RUNNER_USER=(\w+)$/m)[1];
  assert.ok(text.includes(`pins Node.js ${nodeVersion} with a checksum`));
  assert.ok(text.includes(`rootless Docker for \`${runner}\``));
  assert.match(text, /does not prepare the private `tccrunner` user or its runtime environment/);
  assert.match(text, /private kit requires Node\.js 22 or newer, Python 3 and `sqlite3`/);
  assert.match(text, /bundle contains committed `main`, not the current feature branch or uncommitted edits/);
  assert.match(text, /`Test` runs host verification and the tests already transferred/);
  assert.match(text, /`Resume` reloads the existing VM and provisions again/);
  assert.match(text, /external sibling `stage-gate-runtime` directory/);
  assert.match(text, /To adopt an existing VM, pass its original directory through `-RuntimeDirectory`/);
  assert.match(text, /initial bootstrap uses internet access/);
});

test("Stage4 DNS recovery and technical markers do not claim private isolation or scientific approval", async () => {
  const dns = await read("infra/vagrant-virtualbox/network-preflight.sh");
  const vagrantfile = await read("infra/vagrant-virtualbox/Vagrantfile");
  const gateScript = await read("infra/vagrant-virtualbox/run-gates.sh");
  for (const token of ["10.0.2.2", "10.0.2.3", "head.before-stage-gate", "resolvconf -u", "DNS_OK"]) {
    assert.ok(text.includes(token), `documented DNS step: ${token}`);
  }
  assert.match(dns, /resolvconf -u/);
  assert.match(dns, /before-stage-gate/);
  assert.match(vagrantfile, /natdnshostresolver1/);
  assert.match(text, /adjustment supports bootstrap connectivity, not research network isolation/);
  assert.match(gateScript, /PASS_GATES_3_4_TECHNICAL/);
  assert.match(text, /`PASS_GATES_3_4_TECHNICAL` records successful synthetic tests and content checks/);
  assert.match(text, /Neither marker proves the private `tccrunner` rootless environment, a REAL execution, scientific blinding, ART-12 compliance, H1 support or academic gate approval/);
  assert.match(text, /does not execute Docker or demonstrate the experiment-specific container path/);
  assert.match(text, /this guide is not a VM run log/);
});
