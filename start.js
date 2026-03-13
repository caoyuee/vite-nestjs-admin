#!/usr/bin/env node
const { exec } = require("child_process");
const path = require("path");

// 默认路径（可通过修改此文件或用 ENV/参数扩展）
const redisExe = "C:\\service\\Redis-8.2.3-msys2\\redis-server.exe";
const backendPath = path.resolve(__dirname, "koajs_backend");

console.log("Starting Redis service...");
exec(`start "Redis Server" "${redisExe}"`, (err) => {
    if (err) {
        console.error("启动 Redis 失败:", err.message || err);
    } else {
        console.log("Redis 启动命令已触发。");
    }
});

// 再启动后端（与原脚本行为一致）

console.log("Starting Koa.js backend service...");
// 在新窗口中启动并保持窗口打开以便查看日志
const cmd = `start "Koa.js Backend" cmd /k "cd /d ${backendPath} && pnpm run dev"`;
exec(cmd, (err) => {
    if (err) {
        console.error("启动后端失败:", err.message || err);
    } else {
        console.log("后端启动命令已触发。");
    }
});
console.log("Done!");

//再启动前端项目
const frontendPath = path.resolve(__dirname, "koajs-fronted-vite");
console.log("Starting Koa.js frontend service...");
const frontendCmd = `start "Koa.js Frontend" cmd /k "cd /d ${frontendPath} && pnpm run dev"`;
exec(frontendCmd, (err) => {
    if (err) {
        console.error("启动前端失败:", err.message || err);
    } else {
        console.log("前端启动命令已触发。");
    }
});


// 友好退出（父进程不必等待子进程）
process.on("uncaughtException", (err) => {
    console.error("未捕获的异常:", err);
});
