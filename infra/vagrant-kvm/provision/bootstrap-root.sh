#!/usr/bin/env bash
set -Eeuo pipefail

readonly RUNNER_USER=stagegaterunner
readonly SUBID_COUNT=65536
fail() { echo "stage-gate bootstrap: $*" >&2; exit 1; }
as_runner() {
  local uid
  uid="$(id -u "$RUNNER_USER")"
  runuser -u "$RUNNER_USER" -- env "XDG_RUNTIME_DIR=/run/user/$uid" "DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$uid/bus" "$@"
}
has_range() { awk -F: -v user="$1" -v count="$2" '$1 == user && $3 >= count { ok=1 } END { exit ok ? 0 : 1 }' "$3"; }
next_range() { awk -F: 'BEGIN { max=99999 } $2 ~ /^[0-9]+$/ && $3 ~ /^[0-9]+$/ { end=$2+$3-1; if (end>max) max=end } END { print max+1 }' "$1"; }

[ "$(id -u)" -eq 0 ] || fail "must run as root"
. /etc/os-release
[ "${ID:-}" = debian ] || fail "only Debian guests are supported"
[ -f /sys/fs/cgroup/cgroup.controllers ] || fail "cgroup v2 is required"
command -v systemctl >/dev/null || fail "systemd is required"

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install --yes --no-install-recommends ca-certificates curl gnupg uidmap dbus-user-session
install -d -m 0755 /etc/apt/keyrings
if [ ! -f /etc/apt/keyrings/docker.asc ]; then
  curl --fail --show-error --silent --location --proto '=https' --proto-redir '=https' https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
  chmod 0644 /etc/apt/keyrings/docker.asc
fi
arch="$(dpkg --print-architecture)"
echo "deb [arch=$arch signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $VERSION_CODENAME stable" > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install --yes --no-install-recommends docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras

id "$RUNNER_USER" >/dev/null 2>&1 || useradd --create-home --shell /bin/bash "$RUNNER_USER"
passwd --lock "$RUNNER_USER"
for group in docker sudo adm; do
  id -nG "$RUNNER_USER" | tr ' ' '\n' | grep -Fx "$group" >/dev/null && gpasswd --delete "$RUNNER_USER" "$group"
done
if ! has_range "$RUNNER_USER" "$SUBID_COUNT" /etc/subuid; then
  start="$(next_range /etc/subuid)"
  usermod --add-subuids "$start-$((start + SUBID_COUNT - 1))" "$RUNNER_USER"
fi
if ! has_range "$RUNNER_USER" "$SUBID_COUNT" /etc/subgid; then
  start="$(next_range /etc/subgid)"
  usermod --add-subgids "$start-$((start + SUBID_COUNT - 1))" "$RUNNER_USER"
fi
has_range "$RUNNER_USER" "$SUBID_COUNT" /etc/subuid || fail "subuid range is unavailable"
has_range "$RUNNER_USER" "$SUBID_COUNT" /etc/subgid || fail "subgid range is unavailable"

install -d -o "$RUNNER_USER" -g "$RUNNER_USER" -m 0700 /var/lib/stagegaterunner /var/lib/stagegaterunner/private /var/lib/stagegaterunner/evidence /var/lib/stagegaterunner/workspace
loginctl enable-linger "$RUNNER_USER"
systemctl start "user@$(id -u "$RUNNER_USER").service"
if ! as_runner docker info >/dev/null 2>&1; then as_runner dockerd-rootless-setuptool.sh install; fi
as_runner systemctl --user enable --now docker
as_runner docker context use rootless >/dev/null 2>&1 || true
echo "stage-gate bootstrap: rootless Docker configured for $RUNNER_USER"
