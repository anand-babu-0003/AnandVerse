#!/usr/bin/env node

/**
 * Script to deploy Firestore indexes
 * Run with: node deploy-indexes.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Firestore indexes...\n');

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI found');
} catch (error) {
  console.error('❌ Firebase CLI not found. Please install it first:');
  console.error('   npm install -g firebase-tools');
  console.error('   firebase login');
  process.exit(1);
}

// Check if firebase.json exists
if (!fs.existsSync('firebase.json')) {
  console.error('❌ firebase.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if firestore.indexes.json exists
if (!fs.existsSync('firestore.indexes.json')) {
  console.error('❌ firestore.indexes.json not found.');
  process.exit(1);
}

try {
  console.log('📋 Deploying Firestore indexes...');
  
  // Deploy only the indexes
  execSync('firebase deploy --only firestore:indexes', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Firestore indexes deployed successfully!');
  console.log('\n📊 Indexes created:');
  console.log('   - Portfolio items by createdAt (desc)');
  console.log('   - Portfolio items by slug');
  console.log('   - Portfolio items by updatedAt (desc)');
  console.log('   - Portfolio items by title + createdAt');
  console.log('   - Portfolio items by tags (array contains) + createdAt');
  console.log('   - Blog posts by createdAt (desc)');
  console.log('   - Blog posts by slug');
  console.log('   - Blog posts by status + createdAt');
  console.log('   - Blog posts by publishedAt (desc)');
  console.log('   - Blog posts by status + publishedAt');
  console.log('   - Announcements by createdAt (desc)');
  console.log('   - Announcements by isActive + createdAt');
  console.log('   - Testimonials by createdAt (desc)');
  console.log('   - Testimonials by isApproved + createdAt');
  console.log('   - Notifications by createdAt (desc)');
  console.log('   - Notifications by userId + createdAt');
  console.log('   - Notifications by isRead + createdAt');
  console.log('   - AI Content by createdAt (desc)');
  console.log('   - AI Content by contentType + createdAt');
  console.log('   - Contact Messages by submittedAt (desc)');
  console.log('   - Contact Messages by isRead + submittedAt');
  console.log('   - Visitor Sessions by createdAt (desc)');
  console.log('   - Visitor Sessions by sessionId + createdAt');
  console.log('\n🎉 Your Firestore queries should now be much faster!');
  
} catch (error) {
  console.error('\n❌ Error deploying indexes:', error.message);
  console.error('\nTroubleshooting:');
  console.error('1. Make sure you are logged in: firebase login');
  console.error('2. Make sure you have the correct project selected: firebase use <project-id>');
  console.error('3. Check your Firebase project permissions');
  process.exit(1);
}
