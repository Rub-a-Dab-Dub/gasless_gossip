#!/usr/bin/env node

// Simple verification script for intent gossip implementation
console.log('Verifying Intent Gossip Implementation...');

const fs = require('fs');
const path = require('path');

// Check if required files exist
const requiredFiles = [
  'src/intent-gossip/intent-gossip.module.ts',
  'src/intent-gossip/intent-gossip.service.ts',
  'src/intent-gossip/gossip.controller.ts',
  'src/intent-gossip/dto/broadcast-intent.dto.ts',
  'src/intent-gossip/entities/intent-log.entity.ts',
  'migrations/1680000007000-CreateIntentLogsTable.sql'
];

let allFilesExist = true;

console.log('Checking for required files...');
requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${file}`);
  } else {
    console.log(`✗ ${file}`);
    allFilesExist = false;
  }
});

// Check if module is imported in app.module.ts
const appModulePath = path.join(__dirname, '..', 'src', 'app.module.ts');
const appModuleContent = fs.readFileSync(appModulePath, 'utf8');

if (appModuleContent.includes('IntentGossipModule')) {
  console.log('✓ IntentGossipModule imported in app.module.ts');
} else {
  console.log('✗ IntentGossipModule not imported in app.module.ts');
  allFilesExist = false;
}

if (allFilesExist) {
  console.log('\n✅ All files are in place!');
  console.log('\nNext steps:');
  console.log('1. Install @anoma/intents package: npm install @anoma/intents');
  console.log('2. Run database migrations: npm run migrate');
  console.log('3. Start the application: npm run start');
  console.log('4. Test the endpoint with a POST request to /api/gossip/intents');
} else {
  console.log('\n❌ Some files are missing. Please check the implementation.');
  process.exit(1);
}