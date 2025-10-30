@echo off
echo Starting Agentico MCP Knowledge Server...
echo.

cd /d "%~dp0"

echo Building TypeScript files...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo Build failed! Please check for errors above.
    pause
    exit /b %errorlevel%
)

echo.
echo Starting server...
call npm start

pause

