import { assertSyntheticFixture, hashCanonicalJson } from "../../contracts/src/index.mjs";

export class EvaluationContractError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "EvaluationContractError";
    this.code = code;
  }
}

function assertChecklist(checklist) {
  if (!Array.isArray(checklist) || checklist.length === 0) {
    throw new EvaluationContractError("checklist must be a non-empty array", "CHECKLIST_INVALID");
  }
  const identifiers = new Set();
  for (const check of checklist) {
    if (!check || typeof check !== "object" || typeof check.id !== "string" || !/^[a-z][a-z0-9-]{2,63}$/.test(check.id)) {
      throw new EvaluationContractError("check id is invalid", "CHECK_ID_INVALID");
    }
    if (identifiers.has(check.id)) throw new EvaluationContractError("check ids must be unique", "CHECK_ID_DUPLICATE");
    if (typeof check.predicate !== "function") {
      throw new EvaluationContractError("check predicate must be a function", "CHECK_PREDICATE_INVALID");
    }
    identifiers.add(check.id);
  }
}

/**
 * Runs only locally supplied predicates over a synthetic candidate. The return
 * value is stable when the predicates are deterministic.
 */
export function evaluateSyntheticCandidate({ fixture, candidate, checklist }) {
  assertSyntheticFixture(fixture);
  assertChecklist(checklist);
  const results = checklist.map((check) => {
    let passed = false;
    let detail = null;
    try {
      const outcome = check.predicate(structuredClone(candidate));
      if (typeof outcome === "boolean") passed = outcome;
      else if (outcome && typeof outcome === "object" && typeof outcome.passed === "boolean") {
        passed = outcome.passed;
        detail = typeof outcome.detail === "string" ? outcome.detail : null;
      } else {
        throw new TypeError("predicate result must be boolean or { passed, detail? }");
      }
    } catch (error) {
      detail = `predicate error: ${error.message}`;
    }
    return { id: check.id, passed, detail };
  });
  const passed = results.filter((result) => result.passed).length;
  const payload = {
    candidate_sha256: hashCanonicalJson(candidate),
    fixture_id: fixture.fixture_id,
    fixture_sha256: hashCanonicalJson(fixture),
    passed,
    results,
    synthetic: true,
    total: results.length,
  };
  return { ...payload, evaluation_sha256: hashCanonicalJson(payload) };
}
