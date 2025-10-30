#!/bin/bash

# ElevenLabs Integration Test Script
# This script tests all the API endpoints to verify the integration is working

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${1:-http://localhost:3000}"
TEST_EMAIL="${2:-test@example.com}"

echo "=================================================="
echo "ElevenLabs Integration Test Suite"
echo "=================================================="
echo "Base URL: $BASE_URL"
echo "Test Email: $TEST_EMAIL"
echo ""

# Test 1: Submit Contact Form (Minimal Data)
echo "Test 1: Submit Contact Form (Minimal Data)"
echo "-------------------------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/elevenlabs/contact" \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Test User\",
    \"email\": \"$TEST_EMAIL\",
    \"phone\": \"+61 400 000 000\",
    \"company\": \"Test Company\"
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Status: $HTTP_CODE"
  echo "Response: $BODY"
else
  echo -e "${RED}✗ FAIL${NC} - Status: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 2: Submit Contact Form (Detailed Data)
echo "Test 2: Submit Contact Form (Detailed Data)"
echo "-------------------------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/elevenlabs/contact" \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Sarah Johnson\",
    \"email\": \"$TEST_EMAIL\",
    \"phone\": \"+61 412 345 678\",
    \"company\": \"Johnson Plumbing\",
    \"website\": \"https://www.johnsonplumbing.com.au\",
    \"industry\": \"electrical_plumbing\",
    \"businessSize\": \"6-20\",
    \"currentSystems\": \"Excel and Gmail\",
    \"monthlyVolume\": \"100-500\",
    \"teamSize\": \"6-10\",
    \"automationGoals\": [\"reduce_manual_work\", \"improve_response_time\"],
    \"specificProcesses\": \"Automate quote generation and job scheduling\",
    \"existingTools\": \"Xero, Gmail, Google Drive\",
    \"integrationNeeds\": [\"accounting\", \"communication\"],
    \"dataVolume\": \"moderate\",
    \"projectDescription\": \"Want to automate our quoting process and reduce paperwork\",
    \"successMetrics\": \"Save 10 hours per week, respond to quotes same day\",
    \"timeline\": \"1-3_months\",
    \"budget\": \"25k-50k\",
    \"callId\": \"test-call-123\",
    \"callDuration\": 420
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Status: $HTTP_CODE"
  echo "Response: $BODY"
else
  echo -e "${RED}✗ FAIL${NC} - Status: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 3: Send Booking Link
echo "Test 3: Send Booking Link"
echo "-------------------------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/elevenlabs/booking/send-link" \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Test User\",
    \"email\": \"$TEST_EMAIL\"
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Status: $HTTP_CODE"
  echo "Response: $BODY"
else
  echo -e "${RED}✗ FAIL${NC} - Status: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 4: Check Availability
echo "Test 4: Check Availability"
echo "-------------------------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/elevenlabs/booking/availability?dateRange=next_two_weeks")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Status: $HTTP_CODE"
  echo "Response: $BODY"
else
  echo -e "${RED}✗ FAIL${NC} - Status: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 5: Book Workshop (should redirect to send link)
echo "Test 5: Book Workshop"
echo "-------------------------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/elevenlabs/booking/book" \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Test User\",
    \"email\": \"$TEST_EMAIL\",
    \"phone\": \"+61 400 000 000\",
    \"dateTime\": \"2025-11-01T10:00:00Z\",
    \"duration\": 60
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Status: $HTTP_CODE (Note: Returns guidance to use send-link)"
  echo "Response: $BODY"
else
  echo -e "${YELLOW}⚠ INFO${NC} - Status: $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 6: Invalid Data (should fail validation)
echo "Test 6: Invalid Data (Missing Required Fields)"
echo "-------------------------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/elevenlabs/contact" \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Test User\"
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 400 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Status: $HTTP_CODE (Correctly rejected invalid data)"
  echo "Response: $BODY"
else
  echo -e "${RED}✗ FAIL${NC} - Status: $HTTP_CODE (Should have been 400)"
  echo "Response: $BODY"
fi
echo ""

# Summary
echo "=================================================="
echo "Test Suite Complete"
echo "=================================================="
echo ""
echo "Next Steps:"
echo "1. Check your email ($TEST_EMAIL) for confirmation and booking link emails"
echo "2. Check Notion for new Client, Contact, and Intake Form entries"
echo "3. Check your logs for any errors or warnings"
echo "4. If using n8n, verify webhook was triggered"
echo ""
echo "Manual Testing Required:"
echo "- Test actual ElevenLabs agent phone call"
echo "- Verify booking link works end-to-end"
echo "- Confirm email formatting looks good"
echo ""

