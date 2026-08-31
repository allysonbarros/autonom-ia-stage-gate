import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(".");
const manifestPath = "docs/provenance/export-manifest.json";

function trackedFiles() {
  return execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "buffer" })
    .toString("utf8")
    .split("\0")
    .filter(Boolean);
}

async function sha256(relative) {
  const bytes = await readFile(path.join(root, relative));
  return createHash("sha256").update(bytes).digest("hex");
}

test("provenance manifest covers every public file other than itself", async () => {
  const manifest = JSON.parse(await readFile(path.join(root, manifestPath), "utf8"));
  const entries = new Map(manifest.entries.map((entry) => [entry.destination, entry]));
  const files = trackedFiles().filter((file) => file !== manifestPath).sort();

  assert.deepEqual([...entries.keys()].sort(), files);
  for (const file of files) {
    const entry = entries.get(file);
    assert.match(entry.sha256, /^[a-f0-9]{64}$/);
    assert.equal(entry.sha256, await sha256(file), file);
    assert.match(entry.classification, /^[-a-z]+$/);
    assert.match(entry.origin, /^[-a-z]+$/);
    assert.match(entry.review_status, /^(?:pending-human-review|approved-human-review|owner-authorized-extraction)$/);
  }
});
