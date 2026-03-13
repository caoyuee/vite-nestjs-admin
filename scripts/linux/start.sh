#!/usr/bin/env bash
set -euo pipefail

# 基于 Linux 的启动脚本：后台启动 redis（如果可用）、后端与前端，并将日志写入 scripts/logs
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
BACKEND_DIR="$ROOT_DIR/koajs_backend"
FRONTEND_DIR="$ROOT_DIR/koajs-fronted-vite"
LOG_DIR="$ROOT_DIR/scripts/logs"
mkdir -p "$LOG_DIR"

echo "[start.sh] Starting services on Linux..."

echo "[start.sh] Starting backend (pnpm run dev)..."
(cd "$BACKEND_DIR" && nohup pnpm run dev > "$LOG_DIR/backend.log" 2>&1 &) || echo "[start.sh] backend start failed"
echo "[start.sh] Backend start command issued. Logs: $LOG_DIR/backend.log"

echo "[start.sh] Starting frontend (pnpm run dev)..."
(cd "$FRONTEND_DIR" && nohup pnpm run dev > "$LOG_DIR/frontend.log" 2>&1 &) || echo "[start.sh] frontend start failed"
echo "[start.sh] Frontend start command issued. Logs: $LOG_DIR/frontend.log"

echo "[start.sh] All start commands issued. Use 'tail -f $LOG_DIR/*.log' to watch logs."
