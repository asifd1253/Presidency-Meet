import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const backendDir = resolve(rootDir, "backend");
const frontendDir = resolve(rootDir, "frontend");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

if (!existsSync(resolve(backendDir, "package.json"))) {
  console.error("Cannot find backend/package.json");
  process.exit(1);
}

if (!existsSync(resolve(frontendDir, "package.json"))) {
  console.error("Cannot find frontend/package.json");
  process.exit(1);
}

const processes = [
  start("backend", backendDir, [npmCmd, ["run", "dev"]]),
  start("frontend", frontendDir, [npmCmd, ["run", "dev:frontend"]]),
];

function start(name, cwd, [command, args]) {
  const child = spawn(command, args, {
    cwd,
    env: process.env,
    shell: process.platform === "win32",
    stdio: ["inherit", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => write(name, chunk));
  child.stderr.on("data", (chunk) => write(name, chunk));

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    console.error(`[${name}] stopped${signal ? ` by ${signal}` : ` with code ${code}`}`);
    shutdown(code || 1);
  });

  return child;
}

function write(name, chunk) {
  const lines = chunk.toString().split(/\r?\n/);
  for (const line of lines) {
    if (line.trim()) console.log(`[${name}] ${line}`);
  }
}

let shuttingDown = false;

function shutdown(code = 0) {
  shuttingDown = true;
  for (const child of processes) {
    if (!child.killed) child.kill();
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
