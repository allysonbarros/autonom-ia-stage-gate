#!/usr/bin/env bash
set -Eeuo pipefail
# This adapter uses the first VirtualBox NAT interface. The generic box ships
# external DNS servers; prefer the NAT resolver configured to use Windows DNS.
if ! ip -4 route show default | grep -Eq '^default via 10\.0\.2\.2 '; then
  echo 'stage-gate network: unexpected default gateway; DNS left unchanged' >&2
  exit 1
fi
command -v resolvconf >/dev/null || {
  echo 'stage-gate network: expected Debian resolvconf is missing' >&2
  exit 1
}
readonly dns_head=/etc/resolvconf/resolv.conf.d/head
if ! grep -Eq '^nameserver[[:space:]]+10\.0\.2\.3[[:space:]]*$' "$dns_head"; then
  [ -e "${dns_head}.before-stage-gate" ] || cp -p "$dns_head" "${dns_head}.before-stage-gate"
  temp_head="$(mktemp)"
  { printf '# Stage-gate: VirtualBox NAT host resolver\nnameserver 10.0.2.3\n'; cat "$dns_head"; } > "$temp_head"
  cat "$temp_head" > "$dns_head"
  rm -f "$temp_head"
fi
resolvconf -u
echo 'stage-gate network: effective resolver configuration'
cat /etc/resolv.conf
echo 'stage-gate network: checking DNS before package installation'
for host in deb.debian.org security.debian.org download.docker.com nodejs.org; do
  if ! timeout 20 getent ahostsv4 "$host"; then
    echo "stage-gate network: DNS resolution failed for $host" >&2
    ip route >&2
    cat /etc/resolv.conf >&2
    exit 1
  fi
done
echo 'stage-gate network: DNS_OK'
