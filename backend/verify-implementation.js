#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying BlurredAvatarsModule Implementation...\n');

// Check if we're in the correct directory
const currentDir = process.cwd();
console.log(`📁 Current directory: ${currentDir}\n`);

// Files that should exist
const requiredFiles = [
  'src/blurred-avatars/blurred-avatars.module.ts',
  'src/blurred-avatars/blurred-avatars.controller.ts',
  'src/blurred-avatars/blurred-avatars.service.ts',
  'src/blurred-avatars/entities/blurred-avatar.entity.ts',
  'src/blurred-avatars/dto/create-blurred-avatar.dto.ts',
  'src/blurred-avatars/dto/update-blurred-avatar.dto.ts',
  'src/blurred-avatars/blurred-avatars.controller.spec.ts',
  'src/blurred-avatars/blurred-avatars.service.spec.ts',
  'src/blurred-avatars/README.md',
  'src/blurred-avatars/index.ts',
  'migrations/1680000006000-CreateBlurredAvatarsTable.sql'
];

let allFilesExist = true;

console.log('📋 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n📦 Checking dependencies:');

// Check package.json for sharp
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasSharp = packageJson.dependencies && packageJson.dependencies.sharp;
  console.log(`${hasSharp ? '✅' : '❌'} Sharp library: ${hasSharp || 'Not found'}`);
} catch (error) {
  console.log('❌ Could not read package.json');
}

console.log('\n🔧 Checking module structure:');

// Check if module is properly structured
try {
  const moduleContent = fs.readFileSync('src/blurred-avatars/blurred-avatars.module.ts', 'utf8');
  const hasTypeOrm = moduleContent.includes('TypeOrmModule.forFeature');
  const hasEntity = moduleContent.includes('BlurredAvatar');
  const hasController = moduleContent.includes('BlurredAvatarsController');
  const hasService = moduleContent.includes('BlurredAvatarsService');
  
  console.log(`${hasTypeOrm ? '✅' : '❌'} TypeORM integration`);
  console.log(`${hasEntity ? '✅' : '❌'} BlurredAvatar entity`);
  console.log(`${hasController ? '✅' : '❌'} Controller registration`);
  console.log(`${hasService ? '✅' : '❌'} Service registration`);
} catch (error) {
  console.log('❌ Could not verify module structure');
}

console.log('\n🎯 Checking controller endpoints:');

try {
  const controllerContent = fs.readFileSync('src/blurred-avatars/blurred-avatars.controller.ts', 'utf8');
  const endpoints = [
    { method: 'POST', path: '/blur', check: controllerContent.includes('@Post(\'blur\')') },
    { method: 'GET', path: '/blurred/:userId', check: controllerContent.includes('@Get(\'blurred/:userId\')') },
    { method: 'GET', path: '/stats', check: controllerContent.includes('stats') },
    { method: 'PATCH', path: '/blur/:id', check: controllerContent.includes('@Patch(\'blur/:id\')') },
    { method: 'DELETE', path: '/blur/:id', check: controllerContent.includes('@Delete(\'blur/:id\')') }
  ];
  
  endpoints.forEach(endpoint => {
    console.log(`${endpoint.check ? '✅' : '❌'} ${endpoint.method} ${endpoint.path}`);
  });
} catch (error) {
  console.log('❌ Could not verify controller endpoints');
}

console.log('\n🗃️ Checking entity structure:');

try {
  const entityContent = fs.readFileSync('src/blurred-avatars/entities/blurred-avatar.entity.ts', 'utf8');
  const fields = [
    { name: 'id', check: entityContent.includes('id: string') },
    { name: 'userId', check: entityContent.includes('userId: string') },
    { name: 'blurLevel', check: entityContent.includes('blurLevel: number') },
    { name: 'imageUrl', check: entityContent.includes('imageUrl: string') },
    { name: 'originalImageUrl', check: entityContent.includes('originalImageUrl: string') },
    { name: 'isActive', check: entityContent.includes('isActive: boolean') },
    { name: 'createdAt', check: entityContent.includes('createdAt: Date') },
    { name: 'updatedAt', check: entityContent.includes('updatedAt: Date') }
  ];
  
  fields.forEach(field => {
    console.log(`${field.check ? '✅' : '❌'} ${field.name} field`);
  });
} catch (error) {
  console.log('❌ Could not verify entity structure');
}

console.log('\n📝 Checking DTO validation:');

try {
  const createDtoContent = fs.readFileSync('src/blurred-avatars/dto/create-blurred-avatar.dto.ts', 'utf8');
  const validations = [
    { name: 'IsUUID userId', check: createDtoContent.includes('@IsUUID()') },
    { name: 'Min blur level', check: createDtoContent.includes('@Min(1') },
    { name: 'Max blur level', check: createDtoContent.includes('@Max(10') },
    { name: 'IsUrl validation', check: createDtoContent.includes('@IsUrl') }
  ];
  
  validations.forEach(validation => {
    console.log(`${validation.check ? '✅' : '❌'} ${validation.name}`);
  });
} catch (error) {
  console.log('❌ Could not verify DTO validation');
}

console.log('\n🧪 Checking test files:');

try {
  const controllerTestContent = fs.readFileSync('src/blurred-avatars/blurred-avatars.controller.spec.ts', 'utf8');
  const serviceTestContent = fs.readFileSync('src/blurred-avatars/blurred-avatars.service.spec.ts', 'utf8');
  
  const hasControllerTests = controllerTestContent.includes('describe(') && controllerTestContent.includes('it(');
  const hasServiceTests = serviceTestContent.includes('describe(') && serviceTestContent.includes('it(');
  
  console.log(`${hasControllerTests ? '✅' : '❌'} Controller tests`);
  console.log(`${hasServiceTests ? '✅' : '❌'} Service tests`);
} catch (error) {
  console.log('❌ Could not verify test files');
}

console.log('\n🗄️ Checking database migration:');

try {
  const migrationContent = fs.readFileSync('migrations/1680000006000-CreateBlurredAvatarsTable.sql', 'utf8');
  const hasMigration = migrationContent.includes('CREATE TABLE') && migrationContent.includes('blurred_avatars');
  console.log(`${hasMigration ? '✅' : '❌'} Database migration file`);
} catch (error) {
  console.log('❌ Could not verify migration file');
}

console.log('\n🔗 Checking app module integration:');

try {
  const appModuleContent = fs.readFileSync('src/app.module.ts', 'utf8');
  const isImported = appModuleContent.includes('BlurredAvatarsModule');
  const isInImports = appModuleContent.includes('BlurredAvatarsModule') && 
                     (appModuleContent.includes('...loadModules()') || 
                      appModuleContent.match(/imports:\s*\[[\s\S]*BlurredAvatarsModule[\s\S]*\]/));
  
  console.log(`${isImported ? '✅' : '❌'} Module imported in app.module.ts`);
  console.log(`${isInImports ? '✅' : '❌'} Module added to imports array`);
} catch (error) {
  console.log('❌ Could not verify app module integration');
}

console.log('\n📚 Documentation files:');

const docFiles = [
  'src/blurred-avatars/README.md',
  'src/blurred-avatars/USAGE_EXAMPLES.md',
  'BLURRED_AVATARS_IMPLEMENTATION.md'
];

docFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n🎉 Verification Summary:');
console.log(`📁 All required files: ${allFilesExist ? '✅ PASS' : '❌ FAIL'}`);
console.log('📋 Module structure: Check individual items above');
console.log('🎯 API endpoints: Check individual endpoints above');
console.log('🗃️ Database entity: Check individual fields above');
console.log('📝 DTO validation: Check individual validations above');
console.log('🧪 Test coverage: Check test files above');

console.log('\n🚀 Next Steps to Test Implementation:');
console.log('1. Fix any compilation errors in existing code (❗ Found in other modules)');
console.log('2. Install dependencies: npm install');
console.log('3. Run migration: npm run migrate (requires PostgreSQL setup)');
console.log('4. Start server: npm run start:dev');
console.log('5. Test endpoints with curl or Postman');
console.log('6. Run unit tests: npm test -- blurred-avatars');

console.log('\n💡 Quick Test Commands:');
console.log('# Test compilation (our module only):');
console.log('tsc --noEmit src/blurred-avatars/**/*.ts');
console.log('');
console.log('# Test API endpoint (after server is running):');
console.log('curl -X POST http://localhost:3001/avatars/blur \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\');
console.log('  -d \'{"userId":"test-uuid","blurLevel":5,"originalImageUrl":"https://example.com/avatar.jpg"}\'');

console.log('\n✨ BlurredAvatarsModule verification complete!');
