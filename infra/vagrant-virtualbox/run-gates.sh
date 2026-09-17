#!/usr/bin/env bash
set -Eeuo pipefail
runuser -u stagegaterunner -- bash <<'RUNNER'
set -Eeuo pipefail
umask 077
cd /var/lib/stagegaterunner/workspace/autonom-ia-stage-gate
log="/var/lib/stagegaterunner/evidence/gates-$(date -u +%Y%m%dT%H%M%SZ).log"
exec > >(tee "$log") 2>&1
echo 'Technical checks using synthetic data; no scientific gate approval.'
date -u --iso-8601=seconds
git rev-parse HEAD
node --version
npm --version
npm run test:contracts
npm run test:executor
npm run test:evaluator
npm test
npm run check:public-safety
echo PASS_GATES_3_4_TECHNICAL
RUNNER
