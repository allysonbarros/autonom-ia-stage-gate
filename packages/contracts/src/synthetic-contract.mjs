import { CANONICALIZATION_ID, hashCanonicalJson } from "./canonical-json.mjs";

export const SYNTHETIC_FIXTURE_SCHEMA_VERSION = "1.0.0";
const SHA256 = /^[a-f0-9]{64}$/;

export class ContractValidationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "ContractValidationError";
    this.code = code;
  }
}

export function assertSyntheticFixture(fixture) {
  if (!fixture || typeof fixture !== "object" || Array.isArray(fixture)) {
    throw new ContractValidationError("fixture must be an object", "FIXTURE_TYPE_INVALID");
  }
  if (fixture.schema_version !== SYNTHETIC_FIXTURE_SCHEMA_VERSION) {
    throw new ContractValidationError("fixture schema_version is unsupported", "FIXTURE_SCHEMA_UNSUPPORTED");
  }
  if (fixture.synthetic !== true || fixture.scientific_eligible !== false) {
    throw new ContractValidationError(
      "public fixtures must be synthetic and scientifically ineligible",
      "FIXTURE_SAFETY_INVALID",
    );
  }
  if (typeof fixture.fixture_id !== "string" || !/^[a-z][a-z0-9-]{2,63}$/.test(fixture.fixture_id)) {
    throw new ContractValidationError("fixture_id is invalid", "FIXTURE_ID_INVALID");
  }
  return fixture;
}

export function createSyntheticReceipt(fixture, { createdAt } = {}) {
  assertSyntheticFixture(fixture);
  if (typeof createdAt !== "string" || Number.isNaN(Date.parse(createdAt))) {
    throw new ContractValidationError("createdAt must be an ISO-8601 timestamp", "RECEIPT_TIME_INVALID");
  }
  const payload = {
    canonicalization_id: CANONICALIZATION_ID,
    created_at: createdAt,
    fixture_id: fixture.fixture_id,
    fixture_sha256: hashCanonicalJson(fixture),
    scientific_eligible: false,
    synthetic: true,
  };
  return { ...payload, receipt_sha256: hashCanonicalJson(payload) };
}

export function verifySyntheticReceipt(fixture, receipt) {
  assertSyntheticFixture(fixture);
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) return false;
  if (!SHA256.test(receipt.receipt_sha256 ?? "")) return false;
  const { receipt_sha256: claimed, ...payload } = receipt;
  return (
    payload.canonicalization_id === CANONICALIZATION_ID &&
    payload.fixture_id === fixture.fixture_id &&
    payload.fixture_sha256 === hashCanonicalJson(fixture) &&
    payload.synthetic === true &&
    payload.scientific_eligible === false &&
    claimed === hashCanonicalJson(payload)
  );
}
