# Windows / VirtualBox technical checks

Prerequisites: Git, Vagrant 2.4.9 or compatible, VirtualBox 7.2 or compatible,
hardware virtualization, and internet access for the initial bootstrap.
The default Debian 12 guest uses 4 CPUs, 8192 MiB RAM and an 80 GB minimum
virtual disk. A larger box disk is not shrunk. Override STAGE_GATE_CPUS,
STAGE_GATE_MEMORY_MB, STAGE_GATE_DISK_GB or STAGE_GATE_BOX if required.

From this directory in PowerShell:

```powershell
.\Stage-Gates.ps1 -Action Validate
.\Stage-Gates.ps1 -Action Up
.\Stage-Gates.ps1 -Action Test
.\Stage-Gates.ps1 -Action Ssh
.\Stage-Gates.ps1 -Action Halt
```

The wrapper copies these templates to a sibling `stage-gate-runtime` directory
outside the repository. It stores VM state, generated SSH keys, Vagrant cache,
Git bundle and transcript logs there. Never copy runtime files into the public
repository. `-RuntimeDirectory` selects a different external directory; to
adopt an existing VM, specify its original Vagrant directory rather than creating
a new one. The earlier local adapter's external cache is retained when detected.

The bundle contains committed `main`, not uncommitted edits or another branch.
Run after committing the desired source. The guest receives the public Git
bundle, not host credentials. Shared folders and SSH agent forwarding are disabled.
The existing KVM bootstrap and verification scripts configure rootless Docker.
Node.js 22.23.2 is downloaded with a pinned SHA-256; tests need no npm install.
Box and apt package versions are not pinned, so bootstrap is not bit reproducible.

`Resume` restarts the existing VM and repeats provisioning after a failure.
`Up` also explicitly repeats provisioning; `Test` runs only host verification
and the already transferred tests. To transfer a new committed main, use `Up`.
Evidence logs are stored in `/var/lib/stagegaterunner/evidence` in the guest.
Success markers: `PASS_PROVIDER_FREE` and `PASS_GATES_3_4_TECHNICAL`.

## DNS on Windows

The VirtualBox NAT adapter uses the Windows host resolver. The generic box may
still specify unreachable external DNS servers. The preflight therefore adds
10.0.2.3 to the beginning of `/etc/resolvconf/resolv.conf.d/head`, backs up the
original as `head.before-stage-gate`, and regenerates resolv.conf with resolvconf.
It requires the expected NAT gateway 10.0.2.2 and resolvconf; otherwise it stops.
It resolves all bootstrap domains before apt runs. Restore the saved head and
run `sudo resolvconf -u` to undo the guest DNS customization.

See the [VirtualBox NAT documentation](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/AdvancedTopics.html).

These are synthetic technical checks, not REAL collection, scientific approval,
or proof of all experiment-specific isolation and resource controls. Follow the
[private experiment handoff](../../docs/real-experiment-handoff.md) for that work.
