import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = "infra/vagrant-kvm";

test("Vagrant host disables the shared folder and provisions only provider-free checks", async () => {
  const vagrantfile = await readFile(`${root}/Vagrantfile`, "utf8");
  const verify = await readFile(`${root}/provision/verify-provider-free.sh`, "utf8");
  assert.match(vagrantfile, /synced_folder "\.", "\/vagrant", disabled: true/);
  assert.match(vagrantfile, /vagrant-libvirt/);
  assert.match(verify, /PASS_PROVIDER_FREE/);
  assert.match(verify, /Docker daemon is not rootless/);
  assert.match(verify, /Docker daemon lacks seccomp/);
});
