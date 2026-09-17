#!/usr/bin/env bash
set -Eeuo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install --yes --no-install-recommends git xz-utils ca-certificates curl
readonly version=22.23.2
readonly checksum=d60acfe00a2932254bb0ad20e01b0d74397a0875595de719654b214f4b03f307
readonly archive="node-v${version}-linux-x64.tar.xz"
[ "$(dpkg --print-architecture)" = amd64 ] || { echo 'Requires x86_64 guest' >&2; exit 1; }
download_dir="$(mktemp -d)"
trap 'rm -rf -- "$download_dir"' EXIT
curl --fail --show-error --silent --location --proto '=https' --proto-redir '=https' "https://nodejs.org/dist/v${version}/${archive}" -o "$download_dir/$archive"
echo "$checksum  $download_dir/$archive" | sha256sum --check --strict
install -d "/opt/node-v${version}"
tar -xJf "$download_dir/$archive" -C "/opt/node-v${version}" --strip-components=1
for executable in node npm npx; do
  ln -sfn "/opt/node-v${version}/bin/$executable" "/usr/local/bin/$executable"
done
readonly target=/var/lib/stagegaterunner/workspace/autonom-ia-stage-gate
if [ ! -d "$target/.git" ]; then
  runuser -u stagegaterunner -- git clone --branch main /tmp/stage-gate-source.bundle "$target"
else
  runuser -u stagegaterunner -- git -C "$target" diff --quiet
  runuser -u stagegaterunner -- git -C "$target" diff --cached --quiet
  runuser -u stagegaterunner -- git -C "$target" fetch /tmp/stage-gate-source.bundle main
  runuser -u stagegaterunner -- git -C "$target" merge --ff-only FETCH_HEAD
fi
