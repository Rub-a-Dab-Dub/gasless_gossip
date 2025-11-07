#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}${colors.bright}
╔═══════════════════════════════════════╗
║   Gasless Gossip Environment Setup   ║
╔═══════════════════════════════════════╝
${colors.reset}`);

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function copyEnvFile(examplePath, targetPath, name) {
  if (fs.existsSync(targetPath)) {
    const overwrite = await question(
      `${colors.yellow}⚠️  ${name} already exists. Overwrite? (y/N): ${colors.reset}`
    );
    if (overwrite.toLowerCase() !== 'y') {
      console.log(`${colors.blue}ℹ️  Skipping ${name}${colors.reset}`);
      return false;
    }
  }

  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, targetPath);
    console.log(`${colors.green}✓ Created ${name}${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.yellow}⚠️  ${examplePath} not found, skipping${colors.reset}`);
    return false;
  }
}

async function main() {
  const rootDir = path.join(__dirname, '..');
  const apiEnvExample = path.join(rootDir, 'api', '.env.example');
  const apiEnv = path.join(rootDir, 'api', '.env');
  const webEnvExample = path.join(rootDir, 'web', '.env.local.example');
  const webEnv = path.join(rootDir, 'web', '.env.local');

  console.log(`${colors.bright}Setting up environment files...${colors.reset}\n`);

  // Copy API .env
  const apiCreated = await copyEnvFile(apiEnvExample, apiEnv, 'api/.env');

  // Copy Web .env.local
  const webCreated = await copyEnvFile(webEnvExample, webEnv, 'web/.env.local');

  console.log(`\n${colors.cyan}${colors.bright}═══════════════════════════════════════${colors.reset}`);
  
  if (apiCreated || webCreated) {
    console.log(`${colors.green}${colors.bright}\n✓ Environment setup complete!${colors.reset}\n`);
    console.log(`${colors.yellow}⚠️  Important: Update the following in your .env files:${colors.reset}`);
    console.log(`   1. ${colors.cyan}api/.env${colors.reset}:`);
    console.log(`      - STARKNET_ACCOUNT_ADDRESS`);
    console.log(`      - STARKNET_PRIVATE_KEY`);
    console.log(`      - STARKNET_CONTRACT_ADDRESS`);
    console.log(`      - JWT_SECRET (generate a secure random string)`);
    console.log(`\n   2. ${colors.cyan}web/.env.local${colors.reset}:`);
    console.log(`      - Should work with defaults for local development\n`);
  } else {
    console.log(`${colors.blue}\nℹ️  All environment files already exist.${colors.reset}\n`);
  }

  console.log(`${colors.bright}Next steps:${colors.reset}`);
  console.log(`  1. ${colors.cyan}npm run docker:start${colors.reset}  - Start PostgreSQL & Redis`);
  console.log(`  2. ${colors.cyan}npm run dev${colors.reset}           - Start both API and Web\n`);

  rl.close();
}

main().catch(error => {
  console.error(`${colors.yellow}Error: ${error.message}${colors.reset}`);
  rl.close();
  process.exit(1);
});
