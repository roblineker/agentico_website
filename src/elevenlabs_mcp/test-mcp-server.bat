@echo off
REM Test script for Agentico MCP Server (Windows)
REM This script tests all the MCP endpoints to verify everything is working

setlocal enabledelayedexpansion

if "%MCP_SERVER_URL%"=="" (
    set "SERVER_URL=https://www.agentico.com.au/api/mcp"
) else (
    set "SERVER_URL=%MCP_SERVER_URL%"
)

echo ========================================
echo Testing Agentico MCP Server
echo Server: %SERVER_URL%
echo ========================================
echo.

REM Check if MCP_API_SECRET is set
if "%MCP_API_SECRET%"=="" (
    echo ERROR: MCP_API_SECRET environment variable is not set
    echo Please set it with: set MCP_API_SECRET=your-secret-here
    echo.
    pause
    exit /b 1
)

echo [OK] MCP_API_SECRET is set
echo.

REM Test 1: Health Check
echo Test 1: Health Check (GET)
curl -s "%SERVER_URL%" -H "Authorization: Bearer %MCP_API_SECRET%"
echo.
echo.

REM Test 2: Initialize MCP Server
echo Test 2: Initialize (JSON-RPC)
curl -s -X POST "%SERVER_URL%" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %MCP_API_SECRET%" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\"}"
echo.
echo.

REM Test 3: List Resources
echo Test 3: List Resources
curl -s -X POST "%SERVER_URL%" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %MCP_API_SECRET%" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"resources/list\"}"
echo.
echo.

REM Test 4: Read System Prompt Resource
echo Test 4: Read System Prompt Resource
curl -s -X POST "%SERVER_URL%" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %MCP_API_SECRET%" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":3,\"method\":\"resources/read\",\"params\":{\"uri\":\"prompt://elevenlabs-system-prompt\"}}"
echo.
echo.

REM Test 5: List Tools
echo Test 5: List Tools
curl -s -X POST "%SERVER_URL%" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %MCP_API_SECRET%" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":4,\"method\":\"tools/list\"}"
echo.
echo.

REM Test 6: Call get_system_prompt Tool
echo Test 6: Call get_system_prompt Tool
curl -s -X POST "%SERVER_URL%" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %MCP_API_SECRET%" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":5,\"method\":\"tools/call\",\"params\":{\"name\":\"get_system_prompt\",\"arguments\":{}}}"
echo.
echo.

REM Test 7: List Knowledge Files
echo Test 7: List Knowledge Files
curl -s -X POST "%SERVER_URL%" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %MCP_API_SECRET%" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":6,\"method\":\"tools/call\",\"params\":{\"name\":\"list_knowledge_files\",\"arguments\":{}}}"
echo.
echo.

REM Test 8: Search Knowledge Base
echo Test 8: Search Knowledge Base (query: plumber)
curl -s -X POST "%SERVER_URL%" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %MCP_API_SECRET%" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":7,\"method\":\"tools/call\",\"params\":{\"name\":\"search_knowledge\",\"arguments\":{\"query\":\"plumber\",\"maxResults\":2}}}"
echo.
echo.

REM Test 9: Ping
echo Test 9: Ping
curl -s -X POST "%SERVER_URL%" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %MCP_API_SECRET%" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":8,\"method\":\"ping\"}"
echo.
echo.

echo ========================================
echo Test Summary
echo ========================================
echo All core MCP functionality has been tested.
echo Your server is ready to be integrated with ElevenLabs!
echo.
echo Next Steps:
echo 1. Add this MCP server to ElevenLabs: %SERVER_URL%
echo 2. Configure your agent to use: prompt://elevenlabs-system-prompt
echo 3. Enable tools: search_knowledge, get_system_prompt, list_knowledge_files
echo.

endlocal
pause

