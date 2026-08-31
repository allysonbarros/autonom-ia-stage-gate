import assert from "node:assert/strict";
import test from "node:test";

import {
  EvaluationContractError,
  evaluateSyntheticCandidate,
  exactAgreement,
  quadraticWeightedKappa,
} from "../src/index.mjs";

const fixture = Object.freeze({
  fixture_id: "garden-notes-demo",
  schema_version: "1.0.0",
  scientific_eligible: false,
  synthetic: true,
});

test("agreement metrics preserve ordinal agreement semantics", () => {
  const perfect = [[1, 1], [2, 2], [4, 4], [5, 5]];
  assert.deepEqual(exactAgreement(perfect), { matches: 4, total: 4, proportion: 1 });
  assert.equal(quadraticWeightedKappa(perfect), 1);
  assert.equal(quadraticWeightedKappa([[3, 3], [3, 3]]), null);
  assert.throws(() => quadraticWeightedKappa([[0, 1], [1, 1]]), TypeError);
});

test("deterministic evaluation is constrained to a synthetic fixture and local predicates", () => {
  const checklist = [
    { id: "has-title", predicate: (candidate) => typeof candidate.title === "string" && candidate.title.length > 0 },
    { id: "has-two-notes", predicate: (candidate) => ({ passed: Array.isArray(candidate.notes) && candidate.notes.length >= 2, detail: "two notes required" }) },
  ];
  const candidate = { notes: ["water", "mulch"], title: "My garden" };
  const result = evaluateSyntheticCandidate({ fixture, candidate, checklist });
  assert.equal(result.passed, 2);
  assert.equal(result.total, 2);
  assert.equal(result.synthetic, true);
  assert.match(result.evaluation_sha256, /^[a-f0-9]{64}$/);
  assert.throws(
    () => evaluateSyntheticCandidate({ fixture: { ...fixture, synthetic: false }, candidate, checklist }),
    (error) => error instanceof EvaluationContractError || error.code === "FIXTURE_SAFETY_INVALID",
  );
});
