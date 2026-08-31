import assert from "node:assert/strict";
import test from "node:test";

import {
  CANONICALIZATION_ID,
  ContractValidationError,
  assertSyntheticFixture,
  canonicalJson,
  createSyntheticReceipt,
  hashCanonicalJson,
  verifySyntheticReceipt,
} from "../src/index.mjs";

const fixture = Object.freeze({
  fixture_id: "garden-notes-demo",
  schema_version: "1.0.0",
  scientific_eligible: false,
  synthetic: true,
  work_item: { objective: "Track fictional garden notes", title: "Garden Notes" },
});

test("canonical JSON uses UTF-8 key order and a terminal newline", () => {
  assert.equal(canonicalJson({ z: 1, a: [true, null] }), '{"a":[true,null],"z":1}\n');
  assert.equal(hashCanonicalJson({ b: 2, a: 1 }), hashCanonicalJson({ a: 1, b: 2 }));
  assert.throws(() => canonicalJson({ value: undefined }), TypeError);
});

test("public fixtures fail closed unless synthetic and scientifically ineligible", () => {
  assert.equal(assertSyntheticFixture(fixture), fixture);
  assert.throws(
    () => assertSyntheticFixture({ ...fixture, scientific_eligible: true }),
    (error) => error instanceof ContractValidationError && error.code === "FIXTURE_SAFETY_INVALID",
  );
});

test("synthetic receipts are reproducible and tamper evident", () => {
  const receipt = createSyntheticReceipt(fixture, { createdAt: "2026-08-31T12:00:00.000Z" });
  assert.equal(receipt.canonicalization_id, CANONICALIZATION_ID);
  assert.equal(verifySyntheticReceipt(fixture, receipt), true);
  assert.equal(verifySyntheticReceipt(fixture, { ...receipt, fixture_id: "altered" }), false);
});
