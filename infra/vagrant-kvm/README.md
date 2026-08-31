# Vagrant/KVM provider-free host

This disposable Debian 12 x86_64 VM is a reproducible host candidate for the
provider-free Gate 3 checks. It does not receive credentials, private packages,
research artifacts or a command that dispatches a model.

## Prerequisites

- KVM virtualization available to the operator;
- libvirt/KVM, `virsh`, Vagrant and the `vagrant-libvirt` plugin;
- network access only for the initial box and package bootstrap.

## Create and validate

```sh
cd infra/vagrant-kvm
vagrant up --provider=libvirt
vagrant provision --provision-with verify-provider-free
```

The default VM has 4 vCPU, 8192 MiB RAM and an 80 GiB disk. Set
`STAGE_GATE_CPUS`, `STAGE_GATE_MEMORY_MB`, `STAGE_GATE_DISK_GB`,
`STAGE_GATE_BOX` or `STAGE_GATE_HOSTNAME` before `vagrant up` to change them.

The bootstrap creates `stagegaterunner` without a password, sudo access or a
Docker group membership. Its Docker daemon is rootless. The VM has no `/vagrant`
mount and does not mount the operator's repository, home directory, SSH socket or
container socket.

The verification command proves only host preconditions: rootless Docker,
`seccomp`, `cgroupns`, systemd cgroups and the absence of the default shared
folder. It does not make a scientific claim and it does not authorize a paid run.

## Destroy

Preserve any private local evidence outside this repository before discarding the
VM:

```sh
vagrant destroy -f
```
