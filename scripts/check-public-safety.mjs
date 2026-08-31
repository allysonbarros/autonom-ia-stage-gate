#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { lstat, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const HIGH_RISK_FILE = /(?:^|\/)\.env(?:\.|$)|\.(?:pem|key|p12|pfx|sqlite|db|dump|sql|zip|tar|gz|7z)$/i;
const expression = (fragments, flags = "") => new RegExp(fragments.join(""), flags);
const FORBIDDEN = Object.freeze([
  ["research environment variable", expression(["AUTONOMIA", "_RESEARCH_"])],
  ["platform environment variable", expression(["(?:", "SUPABASE", "_(?:URL|ANON_KEY|SERVICE_ROLE_KEY)|", "OPENROUTER", "_API_KEY)"])],
  ["public client secret variable", expression(["VITE_[A-Z0-9_]*(?:KEY|TOKEN|SECRET)"])],
  ["GitHub token", expression(["(?:ghp|ghs)_[A-Za-z0-9]{20,}|github", "_pat_[A-Za-z0-9_]{20,}"])],
  ["provider API key", expression(["sk-(?:or-v1-)?[A-Za-z0-9_-]{16,}|AIza[0-9A-Za-z_-]{20,}"])],
  ["JSON web token", expression(["eyJ[A-Za-z0-9_-]{8,}\\.[A-Za-z0-9_-]{8,}\\.[A-Za-z0-9_-]{8,}"])],
  ["private platform host", expression(["(?:https?:\\/\\/)?[A-Za-z0-9.-]+\\.(?:", "supabase\\.co|lovable\\.dev)"], "i")],
  ["private platform import", expression(["@", "supabase", "\\/supabase-js|(?:^|[\\\"'])", "supabase", "\\/|", "supabase", "\\/functions|scripts\\/", "artifacts", "\\/real-bridge|operational", "-pilot-export"])],
]);

function parseRoot(argv) {
  if (argv.length === 0) return process.cwd();
  if (argv.length === 2 && argv[0] === "--root") return path.resolve(argv[1]);
  throw new Error("usage: node scripts/check-public-safety.mjs [--root DIRECTORY]");
}

async function walk(root, relative = "") {
  const directory = path.join(root, relative);
  const children = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const child of children) {
    const childRelative = path.join(relative, child.name);
    if (child.name === ".git") continue;
    if (child.isDirectory()) paths.push(...await walk(root, childRelative));
    else paths.push(childRelative);
  }
  return paths;
}

async function inspectPath(root, relative) {
  const normalized = relative.split(path.sep).join("/");
  if (HIGH_RISK_FILE.test(normalized)) return [`${normalized}: high-risk file type is not permitted`];

  const absolute = path.join(root, relative);
  const stat = await lstat(absolute);
  if (stat.isSymbolicLink()) return [`${normalized}: symbolic links are not permitted`];
  if (!stat.isFile()) return [`${normalized}: unsupported filesystem entry`];
  const content = await readFile(absolute, "utf8");
  return FORBIDDEN.flatMap(([label, pattern]) => pattern.test(content)
    ? [`${normalized}: contains ${label}`]
    : []);
}

async function main() {
  const root = parseRoot(process.argv.slice(2));
  const paths = await walk(root);
  const findings = (await Promise.all(paths.map((relative) => inspectPath(root, relative)))).flat();
  if (findings.length > 0) {
    console.error("public-safety: BLOCKED");
    for (const finding of findings) console.error(`- ${finding}`);
    process.exitCode = 1;
    return;
  }
  console.log("public-safety: PASS");
}

main().catch((error) => {
  console.error(`public-safety: ERROR: ${error.message}`);
  process.exitCode = 2;
});
