#!/usr/bin/env bash
# ============================================================
# deploy.sh — Manual Docker deployment script
# ============================================================
# Usage:
#   ./scripts/deploy.sh [image-tag]
#
# Examples:
#   ./scripts/deploy.sh                    # deploys :latest
#   ./scripts/deploy.sh 42-abc1234         # deploys specific tag
# ============================================================

set -euo pipefail

# ── Configuration ────────────────────────────────────────────
APP_NAME="${APP_NAME:-react-cicd-app}"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-docker.io}"
DOCKER_IMAGE="${DOCKER_IMAGE:-myuser/react-cicd-app}"
IMAGE_TAG="${1:-latest}"
APP_PORT="${APP_PORT:-3000}"

FULL_IMAGE="${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${IMAGE_TAG}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀  Deploying ${APP_NAME}"
echo "    Image: ${FULL_IMAGE}"
echo "    Port:  ${APP_PORT} → 80"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Pull latest image ────────────────────────────────────────
echo "📥  Pulling image..."
docker pull "${FULL_IMAGE}"

# ── Stop & remove existing container ─────────────────────────
echo "🛑  Stopping existing container (if any)..."
docker stop "${APP_NAME}" 2>/dev/null || true
docker rm "${APP_NAME}" 2>/dev/null || true

# ── Run new container ────────────────────────────────────────
echo "▶️   Starting new container..."
docker run -d \
    --name "${APP_NAME}" \
    --restart unless-stopped \
    -p "${APP_PORT}:80" \
    "${FULL_IMAGE}"

echo ""
echo "✅  Deployment complete!"
echo "    App running at: http://localhost:${APP_PORT}"
