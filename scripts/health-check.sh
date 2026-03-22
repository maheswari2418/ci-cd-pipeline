#!/usr/bin/env bash
# ============================================================
# health-check.sh — Post-deployment health check
# ============================================================
# Usage:
#   ./scripts/health-check.sh [url] [max-retries]
#
# Examples:
#   ./scripts/health-check.sh
#   ./scripts/health-check.sh http://192.168.1.100:3000 10
# ============================================================

set -euo pipefail

URL="${1:-http://localhost:3000}"
MAX_RETRIES="${2:-5}"
DELAY=5

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❤️  Health Check"
echo "    URL:     ${URL}"
echo "    Retries: ${MAX_RETRIES}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for i in $(seq 1 "${MAX_RETRIES}"); do
    echo "⏳  Attempt ${i}/${MAX_RETRIES}..."

    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${URL}" 2>/dev/null || echo "000")

    if [ "${HTTP_STATUS}" -eq 200 ]; then
        echo ""
        echo "✅  Health check passed! (HTTP ${HTTP_STATUS})"
        exit 0
    fi

    echo "    Received HTTP ${HTTP_STATUS} — retrying in ${DELAY}s..."
    sleep "${DELAY}"
done

echo ""
echo "❌  Health check failed after ${MAX_RETRIES} attempts."
exit 1
