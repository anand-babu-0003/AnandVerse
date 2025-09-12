#!/usr/bin/env node

/**
 * Interactive script to set up Firestore indexes
 * This script will guide you through the entire process
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function checkFirebaseCLI() {
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    console.log('✅ Firebase CLI is installed');
    return true;
  } catch (error) {
    console.log('❌ Firebase CLI not found');
    return false;
  }
}

async function installFirebaseCLI() {
  console.log('\n📦 Installing Firebase CLI...');
  try {
    execSync('npm install -g firebase-tools', { stdio: 'inherit' });
    console.log('✅ Firebase CLI installed successfully');
    return true;
  } catch (error) {
    console.log('❌ Failed to install Firebase CLI');
    console.log('Please run: npm install -g firebase-tools');
    return false;
  }
}

async function checkFirebaseLogin() {
  try {
    execSync('firebase projects:list', { stdio: 'pipe' });
    console.log('✅ Firebase CLI is authenticated');
    return true;
  } catch (error) {
    console.log('❌ Firebase CLI not authenticated');
    return false;
  }
}

async function loginToFirebase() {
  console.log('\n🔐 Logging in to Firebase...');
  console.log('This will open your browser for authentication.');
  
  const answer = await question('Continue? (y/n): ');
  if (answer.toLowerCase() !== 'y') {
    console.log('❌ Login cancelled');
    return false;
  }

  try {
    execSync('firebase login', { stdio: 'inherit' });
    console.log('✅ Successfully logged in to Firebase');
    return true;
  } catch (error) {
    console.log('❌ Failed to login to Firebase');
    return false;
  }
}

async function selectProject() {
  try {
    const output = execSync('firebase projects:list', { encoding: 'utf8' });
    console.log('\n📋 Available Firebase projects:');
    console.log(output);
    
    const projectId = await question('\nEnter your project ID: ');
    
    try {
      execSync(`firebase use ${projectId}`, { stdio: 'inherit' });
      console.log(`✅ Selected project: ${projectId}`);
      return true;
    } catch (error) {
      console.log(`❌ Failed to select project: ${projectId}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to list projects');
    return false;
  }
}

async function deployIndexes() {
  console.log('\n🚀 Deploying Firestore indexes...');
  
  try {
    execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
    console.log('\n✅ Firestore indexes deployed successfully!');
    return true;
  } catch (error) {
    console.log('\n❌ Failed to deploy indexes');
    console.log('Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔥 Firestore Index Setup Script');
  console.log('================================\n');

  // Check if Firebase CLI is installed
  if (!(await checkFirebaseCLI())) {
    const install = await question('Would you like to install Firebase CLI? (y/n): ');
    if (install.toLowerCase() === 'y') {
      if (!(await installFirebaseCLI())) {
        console.log('\n❌ Setup failed. Please install Firebase CLI manually.');
        process.exit(1);
      }
    } else {
      console.log('\n❌ Firebase CLI is required. Please install it manually.');
      process.exit(1);
    }
  }

  // Check if logged in
  if (!(await checkFirebaseLogin())) {
    if (!(await loginToFirebase())) {
      console.log('\n❌ Setup failed. Please login to Firebase manually.');
      process.exit(1);
    }
  }

  // Select project
  if (!(await selectProject())) {
    console.log('\n❌ Setup failed. Please select a project manually.');
    process.exit(1);
  }

  // Deploy indexes
  if (await deployIndexes()) {
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📊 Your Firestore queries should now be much faster!');
    console.log('\n📚 Check FIRESTORE_INDEXING_GUIDE.md for more information.');
  } else {
    console.log('\n❌ Setup failed. Please check the error messages above.');
  }

  rl.close();
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n❌ Setup cancelled by user');
  rl.close();
  process.exit(0);
});

main().catch(console.error);
