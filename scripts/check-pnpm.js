#!/usr/bin/env node
const ua = process.env.npm_config_user_agent || '';
const execPath = process.env.npm_execpath || '';

if (!ua.includes('pnpm') && !execPath.includes('pnpm')) {
    console.error('\nERROR: This project requires pnpm. Please run commands with pnpm, not npm.\nExample: pnpm install\n');
    process.exit(1);
}

console.log('pnpm detected.');
