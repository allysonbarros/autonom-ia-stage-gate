const OCI_DIGEST = /^[a-z0-9][a-z0-9._/-]*@sha256:[a-f0-9]{64}$/;
const SAFE_ENVIRONMENT = Object.freeze({});
const PROHIBITED_ARGUMENT = /(?:--(?:api[-_]?key|token|provider|endpoint|real)|https?:\/\/|secret|credential)/i;

export class OciPolicyError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "OciPolicyError";
    this.code = code;
  }
}

function assertPlainObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new OciPolicyError(`${label} must be a plain object`, "OCI_SPEC_INVALID");
  }
}

function assertArgv(argv) {
  if (!Array.isArray(argv) || argv.length === 0 || argv.length > 64 || argv.some((arg) => typeof arg !== "string" || arg.length === 0 || arg.length > 4096)) {
    throw new OciPolicyError("argv must contain 1 through 64 bounded strings", "OCI_ARGV_INVALID");
  }
  if (argv.some((arg) => PROHIBITED_ARGUMENT.test(arg))) {
    throw new OciPolicyError("argv contains a provider or credential control", "OCI_PROVIDER_CONTROL_FORBIDDEN");
  }
}

/**
 * Builds a declarative OCI invocation. This module intentionally does not call
 * Docker and does not accept network, environment or host-mount configuration.
 */
export function buildProviderFreeOciSpec({ image, argv, limits = {} }) {
  if (typeof image !== "string" || !OCI_DIGEST.test(image)) {
    throw new OciPolicyError("image must be pinned to a sha256 digest", "OCI_IMAGE_NOT_PINNED");
  }
  assertArgv(argv);
  assertPlainObject(limits, "limits");
  const cpu = limits.cpu ?? 1;
  const memoryMb = limits.memory_mb ?? 1024;
  const pids = limits.pids ?? 256;
  if (!Number.isFinite(cpu) || cpu <= 0 || cpu > 4) throw new OciPolicyError("cpu limit is invalid", "OCI_LIMIT_INVALID");
  if (!Number.isSafeInteger(memoryMb) || memoryMb < 128 || memoryMb > 4096) throw new OciPolicyError("memory limit is invalid", "OCI_LIMIT_INVALID");
  if (!Number.isSafeInteger(pids) || pids < 16 || pids > 512) throw new OciPolicyError("pids limit is invalid", "OCI_LIMIT_INVALID");

  return Object.freeze({
    argv: Object.freeze([...argv]),
    environment: SAFE_ENVIRONMENT,
    image,
    limits: Object.freeze({ cpu, memory_mb: memoryMb, pids }),
    network: "none",
    security: Object.freeze({
      cap_drop: Object.freeze(["ALL"]),
      no_new_privileges: true,
      read_only_rootfs: true,
      seccomp: "required",
      user: "nonroot",
    }),
    tmpfs: Object.freeze(["/tmp:rw,noexec,nosuid,size=64m"]),
  });
}

export function dockerArgumentsFor(spec) {
  if (!spec || spec.network !== "none" || spec.environment !== SAFE_ENVIRONMENT || spec.security?.user !== "nonroot") {
    throw new OciPolicyError("spec was not built by the provider-free policy", "OCI_SPEC_UNTRUSTED");
  }
  return [
    "run", "--rm", "--pull=never", "--network=none", "--read-only", "--cap-drop=ALL", "--security-opt=no-new-privileges",
    "--pids-limit", String(spec.limits.pids), "--memory", `${spec.limits.memory_mb}m`, "--cpus", String(spec.limits.cpu),
    "--tmpfs", spec.tmpfs[0], "--user", spec.security.user, spec.image, ...spec.argv,
  ];
}
