#!/usr/bin/env node
/**
 * Email Configuration Diagnostic Script
 * 
 * This script checks your Postmark email configuration and helps diagnose
 * why emails might not be sending in production.
 * 
 * Usage:
 *   node scripts/check-email-config.mjs
 * 
 * Or with environment variables:
 *   POSTMARK_API_TOKEN=your-token node scripts/check-email-config.mjs
 */

import { ServerClient } from 'postmark';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  console.log('\n' + '='.repeat(60));
  log(message, 'cyan');
  console.log('='.repeat(60) + '\n');
}

async function checkEmailConfiguration() {
  header('📧 Postmark Email Configuration Check');

  // Check 1: Environment Variable
  log('1️⃣ Checking POSTMARK_API_TOKEN environment variable...', 'blue');
  const token = process.env.POSTMARK_API_TOKEN;

  if (!token) {
    log('   ✗ POSTMARK_API_TOKEN is NOT set', 'red');
    log('   This is why emails are not being sent!', 'red');
    log('\n   To fix:', 'yellow');
    log('   - Add POSTMARK_API_TOKEN to your production environment variables', 'yellow');
    log('   - Get your token from: https://account.postmarkapp.com/servers', 'yellow');
    console.log();
    return false;
  }

  const maskedToken = token.substring(0, 8) + '...' + token.substring(token.length - 4);
  log(`   ✓ POSTMARK_API_TOKEN is set: ${maskedToken}`, 'green');

  // Check 2: Token validity
  header('2️⃣ Testing Postmark API Connection');
  log('   Connecting to Postmark...', 'blue');

  try {
    const client = new ServerClient(token);
    const server = await client.getServer();
    
    log('   ✓ Successfully connected to Postmark!', 'green');
    log(`   Server Name: ${server.Name}`, 'cyan');
    log(`   Server ID: ${server.ID}`, 'cyan');
    log(`   Inbound Hash: ${server.InboundHash || 'N/A'}`, 'cyan');

    // Check 3: Sender Signatures
    header('3️⃣ Checking Sender Signatures');
    log('   Fetching sender signatures...', 'blue');

    const signatures = await client.getSenderSignatures();
    
    if (!signatures || signatures.SenderSignatures.length === 0) {
      log('   ✗ No sender signatures found', 'red');
      log('   You need to verify at least one sender domain!', 'yellow');
      console.log();
      return false;
    }

    log(`   Found ${signatures.SenderSignatures.length} sender signature(s):`, 'green');
    
    const requiredSenders = [
      'alex@agentico.com.au',
      'sales@agentico.com.au',
      'rob@agentico.com.au'
    ];

    for (const sig of signatures.SenderSignatures) {
      const status = sig.Confirmed ? '✓' : '✗';
      const color = sig.Confirmed ? 'green' : 'red';
      log(`   ${status} ${sig.Domain || sig.EmailAddress} - ${sig.Confirmed ? 'Verified' : 'NOT VERIFIED'}`, color);
    }

    // Check if required senders are verified
    const verifiedEmails = signatures.SenderSignatures
      .filter(s => s.Confirmed)
      .map(s => s.EmailAddress?.toLowerCase() || s.Domain?.toLowerCase());

    console.log();
    log('   Checking required sender emails:', 'blue');
    let allVerified = true;

    for (const email of requiredSenders) {
      const domain = email.split('@')[1];
      const isVerified = verifiedEmails.some(v => 
        v === email || v === domain || v?.includes(domain)
      );
      
      if (isVerified) {
        log(`   ✓ ${email} - OK`, 'green');
      } else {
        log(`   ✗ ${email} - NOT VERIFIED`, 'red');
        allVerified = false;
      }
    }

    if (!allVerified) {
      console.log();
      log('   ⚠️  Some required sender emails are not verified!', 'yellow');
      log('   Verify them at: https://account.postmarkapp.com/signature_domains', 'yellow');
    }

    // Check 4: Test Email (optional)
    header('4️⃣ Email Sending Test (Optional)');
    log('   Would you like to send a test email? This will use your Postmark credits.', 'yellow');
    log('   Set TEST_EMAIL environment variable to send a test:', 'cyan');
    log('   TEST_EMAIL=your@email.com node scripts/check-email-config.mjs', 'cyan');

    const testEmail = process.env.TEST_EMAIL;
    if (testEmail) {
      log(`\n   Sending test email to ${testEmail}...`, 'blue');
      
      try {
        const result = await client.sendEmail({
          From: 'alex@agentico.com.au',
          To: testEmail,
          Subject: 'Postmark Test Email from Agentico',
          TextBody: 'This is a test email to verify your Postmark configuration is working correctly.',
          HtmlBody: '<p>This is a test email to verify your Postmark configuration is working correctly.</p>',
          MessageStream: 'outbound',
        });

        log(`   ✓ Test email sent successfully!`, 'green');
        log(`   Message ID: ${result.MessageID}`, 'cyan');
      } catch (error) {
        log('   ✗ Failed to send test email', 'red');
        log(`   Error: ${error.message}`, 'red');
        if (error.code === 406) {
          log('   This usually means the sender email is not verified', 'yellow');
        }
      }
    }

    // Summary
    header('📊 Summary');
    log('✓ Postmark API token is configured', 'green');
    log(`✓ Connected to server: ${server.Name}`, 'green');
    
    if (allVerified) {
      log('✓ All required sender emails are verified', 'green');
      console.log();
      log('🎉 Your email configuration looks good!', 'green');
      log('If emails still aren\'t sending in production:', 'yellow');
      log('1. Check production environment variables are set', 'yellow');
      log('2. Check production logs for [EMAIL] messages', 'yellow');
      log('3. Verify your deployment platform supports outbound SMTP', 'yellow');
    } else {
      log('⚠️  Some sender emails need verification', 'yellow');
      log('Verify them at: https://account.postmarkapp.com/signature_domains', 'yellow');
    }

    console.log();
    return true;

  } catch (error) {
    log('   ✗ Failed to connect to Postmark', 'red');
    log(`   Error: ${error.message}`, 'red');
    
    if (error.code === 401 || error.message.includes('Unauthorized')) {
      log('\n   Your API token appears to be invalid!', 'yellow');
      log('   Get a valid token from: https://account.postmarkapp.com/servers', 'yellow');
    } else if (error.code === 'ENOTFOUND' || error.message.includes('network')) {
      log('\n   Network error - check your internet connection', 'yellow');
    }
    
    console.log();
    return false;
  }
}

// Run the check
checkEmailConfiguration()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    log('\n💥 Unexpected error:', 'red');
    console.error(err);
    process.exit(1);
  });

