#!/usr/bin/env node

/**
 * Script to clear Firebase cache and reset state
 * Run with: node clear-firebase-cache.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Firebase cache and resetting state...\n');

// Clear Next.js cache
const nextCacheDir = '.next';
if (fs.existsSync(nextCacheDir)) {
  try {
    console.log('📁 Clearing Next.js cache...');
    fs.rmSync(nextCacheDir, { recursive: true, force: true });
    console.log('✅ Next.js cache cleared');
  } catch (error) {
    console.warn('⚠️ Could not clear Next.js cache:', error.message);
  }
} else {
  console.log('ℹ️ No Next.js cache found');
}

// Clear node_modules/.cache if it exists
const nodeCacheDir = path.join('node_modules', '.cache');
if (fs.existsSync(nodeCacheDir)) {
  try {
    console.log('📁 Clearing node_modules cache...');
    fs.rmSync(nodeCacheDir, { recursive: true, force: true });
    console.log('✅ Node modules cache cleared');
  } catch (error) {
    console.warn('⚠️ Could not clear node_modules cache:', error.message);
  }
} else {
  console.log('ℹ️ No node_modules cache found');
}

console.log('\n🎯 Firebase Cache Clearing Instructions:');
console.log('1. Open your browser\'s Developer Tools (F12)');
console.log('2. Go to the Application/Storage tab');
console.log('3. Under "Storage", find "IndexedDB"');
console.log('4. Delete any Firebase-related databases:');
console.log('   - firebaseLocalStorageDb');
console.log('   - firestore/[your-project-id]');
console.log('5. Clear "Local Storage" and "Session Storage"');
console.log('6. Refresh your application');

console.log('\n🔧 Alternative Browser Commands:');
console.log('Chrome/Edge: Press Ctrl+Shift+Delete, select "All time", check all boxes, click "Clear data"');
console.log('Firefox: Press Ctrl+Shift+Delete, select "Everything", check all boxes, click "Clear Now"');

console.log('\n✅ Cache clearing complete!');
console.log('🔄 Restart your development server: npm run dev');
console.log('📱 Clear your browser cache and refresh the page');
