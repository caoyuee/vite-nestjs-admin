#!/usr/bin/env bash
set -euo pipefail

# macOS 启动脚本，默认行为与 Linux 类似（不试图打开新终端）
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
BACKEND_DIR="$ROOT_DIR/koajs_backend"
FRONTEND_DIR="$ROOT_DIR/koajs-fronted-vite"
LOG_DIR="$ROOT_DIR/scripts/logs"
mkdir -p "$LOG_DIR"

echo "[start.sh macOS] Starting services on macOS..."

echo "[start.sh macOS] Starting redis-server if available..."
if command -v redis-server >/dev/null 2>&1; then
  nohup redis-server > "$LOG_DIR/redis.log" 2>&1 &
  echo "[start.sh macOS] redis-server started (background). Logs: $LOG_DIR/redis.log"
else
  echo "[start.sh macOS] redis-server not found in PATH, skip starting Redis."
fi

echo "[start.sh macOS] Starting backend (pnpm run dev)..."
(cd "$BACKEND_DIR" && nohup pnpm run dev > "$LOG_DIR/backend.log" 2>&1 &) || echo "[start.sh macOS] backend start failed"
echo "[start.sh macOS] Backend start command issued. Logs: $LOG_DIR/backend.log"

echo "[start.sh macOS] Starting frontend (pnpm run dev)..."
(cd "$FRONTEND_DIR" && nohup pnpm run dev > "$LOG_DIR/frontend.log" 2>&1 &) || echo "[start.sh macOS] frontend start failed"
echo "[start.sh macOS] Frontend start command issued. Logs: $LOG_DIR/frontend.log"

echo "[start.sh macOS] All start commands issued. Use 'tail -f $LOG_DIR/*.log' to watch logs."
