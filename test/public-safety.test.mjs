import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const safetyScript = path.resolve("scripts/check-public-safety.mjs");

async function withFixture(callback) {
  const root = await mkdtemp(path.join(os.tmpdir(), "stage-gate-safety-"));
  try {
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function runSafety(root) {
  try {
    execFileSync(process.execPath, [safetyScript, "--root", root], { encoding: "utf8", stdio: "pipe" });
    return { status: 0, output: "" };
  } catch (error) {
    return { status: error.status, output: `${error.stdout ?? ""}${error.stderr ?? ""}` };
  }
}

test("public-safety rejects a secret canary", async () => withFixture(async (root) => {
  const canary = ["gh", "p_", "0123456789abcdefghij0123456789abcdefghij"].join("");
  await writeFile(path.join(root, "canary.txt"), canary);
  const result = runSafety(root);
  assert.notEqual(result.status, 0);
  assert.match(result.output, /GitHub token/);
}));

test("public-safety rejects a private platform URL", async () => withFixture(async (root) => {
  const host = ["https://", "demo.", "supabase", ".co"].join("");
  await writeFile(path.join(root, "import.mjs"), `export default ${JSON.stringify(host)};`);
  const result = runSafety(root);
  assert.notEqual(result.status, 0);
  assert.match(result.output, /private platform host/);
}));

test("public-safety rejects a private platform import", async () => withFixture(async (root) => {
  const packageName = ["@", "supabase", "/", "supabase-js"].join("");
  await writeFile(path.join(root, "import.mjs"), `import ${JSON.stringify(packageName)};`);
  const result = runSafety(root);
  assert.notEqual(result.status, 0);
  assert.match(result.output, /private platform import/);
}));

test("public-safety scans untracked files in a Git checkout", async () => withFixture(async (root) => {
  execFileSync("git", ["init", "--quiet", root]);
  await writeFile(path.join(root, "tracked.txt"), "safe synthetic fixture");
  execFileSync("git", ["-C", root, "add", "tracked.txt"]);
  const canary = ["gh", "p_", "abcdefghij0123456789abcdefghij0123456789"].join("");
  await writeFile(path.join(root, "untracked.txt"), canary);
  const result = runSafety(root);
  assert.notEqual(result.status, 0);
  assert.match(result.output, /GitHub token/);
}));

test("public-safety scans its own path", async () => withFixture(async (root) => {
  const scannerDirectory = path.join(root, "scripts");
  await import("node:fs/promises").then(({ mkdir }) => mkdir(scannerDirectory, { recursive: true }));
  const canary = ["gh", "p_", "abcdefghij0123456789abcdefghij0123456789"].join("");
  await writeFile(path.join(scannerDirectory, "check-public-safety.mjs"), canary);
  const result = runSafety(root);
  assert.notEqual(result.status, 0);
  assert.match(result.output, /GitHub token/);
}));

test("public-safety rejects symbolic links and high-risk files", async () => withFixture(async (root) => {
  await writeFile(path.join(root, "plain.txt"), "synthetic fixture");
  await symlink(path.join(root, "plain.txt"), path.join(root, "linked.txt"));
  await writeFile(path.join(root, ".env"), "placeholder");
  const result = runSafety(root);
  assert.notEqual(result.status, 0);
  assert.match(result.output, /symbolic links are not permitted/);
  assert.match(result.output, /high-risk file type is not permitted/);
}));
