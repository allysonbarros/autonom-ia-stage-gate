import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(".");
const manifestPath = "docs/provenance/export-manifest.json";

async function trackedFiles(relative = "") {
  const directory = path.join(root, relative);
  const children = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const child of children) {
    const childRelative = path.join(relative, child.name);
    if (child.name === ".git") continue;
    if (child.isDirectory()) result.push(...await trackedFiles(childRelative));
    else if (child.isFile()) result.push(childRelative.split(path.sep).join("/"));
  }
  return result;
}

async function sha256(relative) {
  const bytes = await readFile(path.join(root, relative));
  return createHash("sha256").update(bytes).digest("hex");
}

test("provenance manifest covers every public file other than itself", async () => {
  const manifest = JSON.parse(await readFile(path.join(root, manifestPath), "utf8"));
  const entries = new Map(manifest.entries.map((entry) => [entry.destination, entry]));
  const files = (await trackedFiles()).filter((file) => file !== manifestPath).sort();

  assert.deepEqual([...entries.keys()].sort(), files);
  for (const file of files) {
    const entry = entries.get(file);
    assert.match(entry.sha256, /^[a-f0-9]{64}$/);
    assert.equal(entry.sha256, await sha256(file), file);
    assert.match(entry.classification, /^[-a-z]+$/);
    assert.match(entry.origin, /^[-a-z]+$/);
    assert.match(entry.review_status, /^(?:pending-human-review|approved-human-review)$/);
  }
});
