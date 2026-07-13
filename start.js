#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");

const platform = process.platform;
const scriptsDir = path.resolve(__dirname, "scripts");

function runNodeScript(relPath) {
  const scriptPath = path.join(scriptsDir, relPath);
  const child = spawn(process.execPath, [scriptPath], { stdio: "inherit" });
  child.on("exit", (code) => process.exit(code));
}

function runShellScript(relPath) {
  const scriptPath = path.join(scriptsDir, relPath);
  const child = spawn("bash", [scriptPath], { stdio: "inherit" });
  child.on("exit", (code) => process.exit(code));
}

if (platform === "win32") {
  runNodeScript("start-windows.js");
} else if (platform === "linux") {
  runShellScript("linux/start.sh");
} else if (platform === "darwin") {
  runShellScript("macos/start.sh");
} else {
  console.error("Unsupported platform:", platform);
  process.exit(1);
}
