import { createHash } from "node:crypto";

export const CANONICALIZATION_ID = "STAGE-GATE-CANONICAL-JSON-V1";

function compareUtf8(left, right) {
  return Buffer.compare(Buffer.from(left, "utf8"), Buffer.from(right, "utf8"));
}

function assertJsonValue(value, pointer, seen) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (!Number.isFinite(value) || Object.is(value, -0)) {
      throw new TypeError(`non-canonical number at ${pointer}`);
    }
    return;
  }
  if (typeof value !== "object") throw new TypeError(`non-JSON value at ${pointer}`);
  if (seen.has(value)) throw new TypeError(`cyclic JSON value at ${pointer}`);
  seen.add(value);
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      if (!(index in value)) throw new TypeError(`sparse array at ${pointer}/${index}`);
      assertJsonValue(value[index], `${pointer}/${index}`, seen);
    }
  } else {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new TypeError(`non-plain object at ${pointer}`);
    }
    for (const key of Object.keys(value)) {
      if (value[key] === undefined) throw new TypeError(`undefined value at ${pointer}/${key}`);
      assertJsonValue(value[key], `${pointer}/${key}`, seen);
    }
  }
  seen.delete(value);
}

function serialize(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(serialize).join(",")}]`;
  const keys = Object.keys(value).sort(compareUtf8);
  return `{${keys.map((key) => `${JSON.stringify(key)}:${serialize(value[key])}`).join(",")}}`;
}

export function canonicalJsonBytes(value) {
  assertJsonValue(value, "", new Set());
  return Buffer.from(`${serialize(value)}\n`, "utf8");
}

export function canonicalJson(value) {
  return canonicalJsonBytes(value).toString("utf8");
}

export function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function hashCanonicalJson(value) {
  return sha256Hex(canonicalJsonBytes(value));
}
