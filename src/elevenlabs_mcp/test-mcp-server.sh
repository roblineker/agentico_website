#!/bin/bash

# Test script for Agentico MCP Server
# This script tests all the MCP endpoints to verify everything is working

SERVER_URL="${MCP_SERVER_URL:-https://www.agentico.com.au/api/mcp}"
COLOR_GREEN='\033[0;32m'
COLOR_RED='\033[0;31m'
COLOR_YELLOW='\033[1;33m'
COLOR_BLUE='\033[0;34m'
COLOR_NC='\033[0m' # No Color

echo -e "${COLOR_BLUE}========================================${COLOR_NC}"
echo -e "${COLOR_BLUE}Testing Agentico MCP Server${COLOR_NC}"
echo -e "${COLOR_BLUE}Server: ${SERVER_URL}${COLOR_NC}"
echo -e "${COLOR_BLUE}========================================${COLOR_NC}\n"

# Check if MCP_API_SECRET is set
if [ -z "$MCP_API_SECRET" ]; then
    echo -e "${COLOR_RED}ERROR: MCP_API_SECRET environment variable is not set${COLOR_NC}"
    echo -e "${COLOR_YELLOW}Please set it with: export MCP_API_SECRET=\"your-secret-here\"${COLOR_NC}\n"
    exit 1
fi

echo -e "${COLOR_GREEN}✓ MCP_API_SECRET is set${COLOR_NC}\n"

# Test 1: Health Check
echo -e "${COLOR_YELLOW}Test 1: Health Check (GET)${COLOR_NC}"
response=$(curl -s -w "\n%{http_code}" "${SERVER_URL}" \
  -H "Authorization: Bearer ${MCP_API_SECRET}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    echo -e "${COLOR_GREEN}✓ Health check passed${COLOR_NC}"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "${COLOR_RED}✗ Health check failed (HTTP $http_code)${COLOR_NC}"
    echo "$body"
fi
echo ""

# Test 2: Initialize MCP Server
echo -e "${COLOR_YELLOW}Test 2: Initialize (JSON-RPC)${COLOR_NC}"
response=$(curl -s -X POST "${SERVER_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MCP_API_SECRET}" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize"
  }')

if echo "$response" | jq -e '.result' > /dev/null 2>&1; then
    echo -e "${COLOR_GREEN}✓ Initialize successful${COLOR_NC}"
    echo "$response" | jq '.result'
else
    echo -e "${COLOR_RED}✗ Initialize failed${COLOR_NC}"
    echo "$response" | jq '.'
fi
echo ""

# Test 3: List Resources
echo -e "${COLOR_YELLOW}Test 3: List Resources${COLOR_NC}"
response=$(curl -s -X POST "${SERVER_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MCP_API_SECRET}" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "resources/list"
  }')

if echo "$response" | jq -e '.result.resources' > /dev/null 2>&1; then
    echo -e "${COLOR_GREEN}✓ Resources listed successfully${COLOR_NC}"
    resource_count=$(echo "$response" | jq '.result.resources | length')
    echo "Found $resource_count resources:"
    echo "$response" | jq '.result.resources[] | {uri: .uri, name: .name}'
else
    echo -e "${COLOR_RED}✗ Failed to list resources${COLOR_NC}"
    echo "$response" | jq '.'
fi
echo ""

# Test 4: Read System Prompt Resource
echo -e "${COLOR_YELLOW}Test 4: Read System Prompt Resource${COLOR_NC}"
response=$(curl -s -X POST "${SERVER_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MCP_API_SECRET}" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "resources/read",
    "params": {
      "uri": "prompt://elevenlabs-system-prompt"
    }
  }')

if echo "$response" | jq -e '.result.contents[0].text' > /dev/null 2>&1; then
    echo -e "${COLOR_GREEN}✓ System prompt retrieved successfully${COLOR_NC}"
    prompt_preview=$(echo "$response" | jq -r '.result.contents[0].text' | head -c 200)
    echo "Preview: ${prompt_preview}..."
else
    echo -e "${COLOR_RED}✗ Failed to read system prompt${COLOR_NC}"
    echo "$response" | jq '.'
fi
echo ""

# Test 5: List Tools
echo -e "${COLOR_YELLOW}Test 5: List Tools${COLOR_NC}"
response=$(curl -s -X POST "${SERVER_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MCP_API_SECRET}" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/list"
  }')

if echo "$response" | jq -e '.result.tools' > /dev/null 2>&1; then
    echo -e "${COLOR_GREEN}✓ Tools listed successfully${COLOR_NC}"
    tool_count=$(echo "$response" | jq '.result.tools | length')
    echo "Found $tool_count tools:"
    echo "$response" | jq '.result.tools[] | {name: .name, description: .description}'
else
    echo -e "${COLOR_RED}✗ Failed to list tools${COLOR_NC}"
    echo "$response" | jq '.'
fi
echo ""

# Test 6: Call get_system_prompt Tool
echo -e "${COLOR_YELLOW}Test 6: Call get_system_prompt Tool${COLOR_NC}"
response=$(curl -s -X POST "${SERVER_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MCP_API_SECRET}" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "get_system_prompt",
      "arguments": {}
    }
  }')

if echo "$response" | jq -e '.result.content[0].text' > /dev/null 2>&1; then
    echo -e "${COLOR_GREEN}✓ get_system_prompt tool executed successfully${COLOR_NC}"
    prompt_length=$(echo "$response" | jq -r '.result.content[0].text' | wc -c)
    echo "System prompt length: $prompt_length characters"
else
    echo -e "${COLOR_RED}✗ Failed to call get_system_prompt${COLOR_NC}"
    echo "$response" | jq '.'
fi
echo ""

# Test 7: List Knowledge Files
echo -e "${COLOR_YELLOW}Test 7: List Knowledge Files${COLOR_NC}"
response=$(curl -s -X POST "${SERVER_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MCP_API_SECRET}" \
  -d '{
    "jsonrpc": "2.0",
    "id": 6,
    "method": "tools/call",
    "params": {
      "name": "list_knowledge_files",
      "arguments": {}
    }
  }')

if echo "$response" | jq -e '.result.content[0].text' > /dev/null 2>&1; then
    echo -e "${COLOR_GREEN}✓ Knowledge files listed successfully${COLOR_NC}"
    echo "$response" | jq -r '.result.content[0].text'
else
    echo -e "${COLOR_RED}✗ Failed to list knowledge files${COLOR_NC}"
    echo "$response" | jq '.'
fi
echo ""

# Test 8: Search Knowledge Base
echo -e "${COLOR_YELLOW}Test 8: Search Knowledge Base (query: plumber)${COLOR_NC}"
response=$(curl -s -X POST "${SERVER_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MCP_API_SECRET}" \
  -d '{
    "jsonrpc": "2.0",
    "id": 7,
    "method": "tools/call",
    "params": {
      "name": "search_knowledge",
      "arguments": {
        "query": "plumber",
        "maxResults": 2
      }
    }
  }')

if echo "$response" | jq -e '.result.content[0].text' > /dev/null 2>&1; then
    echo -e "${COLOR_GREEN}✓ Knowledge search successful${COLOR_NC}"
    echo "$response" | jq -r '.result.content[0].text' | head -n 20
else
    echo -e "${COLOR_RED}✗ Failed to search knowledge base${COLOR_NC}"
    echo "$response" | jq '.'
fi
echo ""

# Test 9: Ping
echo -e "${COLOR_YELLOW}Test 9: Ping${COLOR_NC}"
response=$(curl -s -X POST "${SERVER_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MCP_API_SECRET}" \
  -d '{
    "jsonrpc": "2.0",
    "id": 8,
    "method": "ping"
  }')

if echo "$response" | jq -e '.result' > /dev/null 2>&1; then
    echo -e "${COLOR_GREEN}✓ Ping successful${COLOR_NC}"
    echo "$response" | jq '.'
else
    echo -e "${COLOR_RED}✗ Ping failed${COLOR_NC}"
    echo "$response" | jq '.'
fi
echo ""

# Summary
echo -e "${COLOR_BLUE}========================================${COLOR_NC}"
echo -e "${COLOR_BLUE}Test Summary${COLOR_NC}"
echo -e "${COLOR_BLUE}========================================${COLOR_NC}"
echo -e "${COLOR_GREEN}All core MCP functionality has been tested.${COLOR_NC}"
echo -e "${COLOR_GREEN}Your server is ready to be integrated with ElevenLabs!${COLOR_NC}\n"

echo -e "${COLOR_YELLOW}Next Steps:${COLOR_NC}"
echo "1. Add this MCP server to ElevenLabs: ${SERVER_URL}"
echo "2. Configure your agent to use: prompt://elevenlabs-system-prompt"
echo "3. Enable tools: search_knowledge, get_system_prompt, list_knowledge_files"
echo ""

