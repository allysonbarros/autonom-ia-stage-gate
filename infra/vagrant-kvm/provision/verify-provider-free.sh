#!/usr/bin/env bash
set -Eeuo pipefail

readonly RUNNER_USER=stagegaterunner
fail() { echo "stage-gate verify: $*" >&2; exit 1; }
as_runner() {
  local uid
  uid="$(id -u "$RUNNER_USER")"
  runuser -u "$RUNNER_USER" -- env "XDG_RUNTIME_DIR=/run/user/$uid" "DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$uid/bus" "$@"
}

[ "$(id -u)" -eq 0 ] || fail "must run as root"
id "$RUNNER_USER" >/dev/null || fail "runner user is missing"
! id -nG "$RUNNER_USER" | tr ' ' '\n' | grep -Ex 'docker|sudo|adm' >/dev/null || fail "runner has a privileged group"
[ ! -e /vagrant ] || fail "/vagrant must not exist"
[ -f /sys/fs/cgroup/cgroup.controllers ] || fail "cgroup v2 is required"
[ "$(stat -c '%a:%U:%G' /var/lib/stagegaterunner)" = "700:stagegaterunner:stagegaterunner" ] || fail "private root permissions diverged"
info="$(as_runner docker info)"
echo "$info" | grep -Eq '^ Cgroup Driver: systemd$' || fail "systemd cgroup driver is required"
echo "$info" | grep -Eq '^  rootless$' || fail "Docker daemon is not rootless"
echo "$info" | grep -Eq '^  cgroupns$' || fail "Docker daemon lacks cgroupns"
echo "$info" | grep -Eq '^  seccomp$' || fail "Docker daemon lacks seccomp"
[ -S "/run/user/$(id -u "$RUNNER_USER")/docker.sock" ] || fail "rootless Docker socket is missing"
echo "stage-gate verify: PASS_PROVIDER_FREE"
