#!/usr/bin/env bash
set -Eeuo pipefail

readonly FORBIDDEN_PATTERN='AUTONOMIA_RESEARCH_|SUPABASE_URL|SUPABASE_ANON_KEY|operational-pilot-export|nutriacompanha|habitododia|gho_[A-Za-z0-9_]+|sk-[A-Za-z0-9_-]{16,}'

if rg -n -i --hidden --glob '!.git/**' --glob '!scripts/check-public-safety.sh' "$FORBIDDEN_PATTERN" .; then
  echo "public-safety: forbidden private identifier or credential-like value found" >&2
  exit 1
fi

if find . -path './.git' -prune -o -type l -print | grep -q .; then
  echo "public-safety: symlinks are not permitted in the public source tree" >&2
  exit 1
fi

echo "public-safety: PASS"
