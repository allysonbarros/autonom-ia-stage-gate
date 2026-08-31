import assert from "node:assert/strict";
import test from "node:test";

import { OciPolicyError, buildProviderFreeOciSpec, dockerArgumentsFor } from "../src/index.mjs";

const image = `example/provider-free-builder@sha256:${"a".repeat(64)}`;

test("provider-free OCI spec has immutable isolation defaults", () => {
  const spec = buildProviderFreeOciSpec({ image, argv: ["builder", "--offline"] });
  assert.equal(spec.network, "none");
  assert.equal(spec.security.read_only_rootfs, true);
  assert.equal(spec.security.no_new_privileges, true);
  assert.deepEqual(spec.environment, {});
  const args = dockerArgumentsFor(spec);
  assert.ok(args.includes("--network=none"));
  assert.ok(args.includes("--pull=never"));
});

test("provider-free OCI spec fails closed for a tag or external control", () => {
  assert.throws(
    () => buildProviderFreeOciSpec({ image: "example/provider-free-builder:latest", argv: ["builder"] }),
    (error) => error instanceof OciPolicyError && error.code === "OCI_IMAGE_NOT_PINNED",
  );
  assert.throws(
    () => buildProviderFreeOciSpec({ image, argv: ["builder", "--provider", "anything"] }),
    (error) => error instanceof OciPolicyError && error.code === "OCI_PROVIDER_CONTROL_FORBIDDEN",
  );
});
