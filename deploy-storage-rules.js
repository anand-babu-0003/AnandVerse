#!/usr/bin/env node

/**
 * Deploy Firebase Storage Rules
 * 
 * This script deploys the storage.rules file to Firebase Storage
 * 
 * Usage:
 *   node deploy-storage-rules.js
 * 
 * Prerequisites:
 *   - Firebase CLI installed: npm install -g firebase-tools
 *   - Firebase project initialized: firebase init
 *   - Authenticated with Firebase: firebase login
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Firebase Storage Rules...\n');

// Check if storage.rules file exists
const rulesPath = path.join(__dirname, 'storage.rules');
if (!fs.existsSync(rulesPath)) {
  console.error('❌ Error: storage.rules file not found');
  console.error('   Please ensure storage.rules exists in the project root');
  process.exit(1);
}

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Error: Firebase CLI not found');
  console.error('   Please install Firebase CLI: npm install -g firebase-tools');
  process.exit(1);
}

// Check if user is authenticated
try {
  execSync('firebase projects:list', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Error: Not authenticated with Firebase');
  console.error('   Please run: firebase login');
  process.exit(1);
}

// Deploy storage rules
try {
  console.log('📋 Deploying storage rules...');
  execSync('firebase deploy --only storage', { stdio: 'inherit' });
  console.log('\n✅ Storage rules deployed successfully!');
  console.log('\n📝 Rules Summary:');
  console.log('   • Read access: Public (all images can be viewed)');
  console.log('   • Write access: Authenticated users only');
  console.log('   • File size limit: 10MB per image');
  console.log('   • Allowed formats: JPG, PNG, WebP, AVIF, GIF, SVG, BMP, TIFF, ICO');
  console.log('   • Organized folders: portfolio-images, blog-images, images, admin-uploads, temp');
} catch (error) {
  console.error('❌ Error deploying storage rules:', error.message);
  process.exit(1);
}
