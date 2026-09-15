@echo off
setlocal enabledelayedexpansion

title Enterprise Solution Portfolio and Demo Hub

:: Change directory to script folder (handles spaces in path)
cd /d "%~dp0"

echo ===================================================
echo  Enterprise Solution Portfolio and Demo Hub v2.0
echo ===================================================
echo.

:: Verify Node.js availability
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js was not found in your system PATH.
    echo Please install Node.js v18 or higher from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Install dependencies if node_modules is absent
if not exist "node_modules\" (
    echo [SETUP] node_modules folder not found. Installing dependencies...
    call npm.cmd install
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to install project dependencies.
        pause
        exit /b 1
    )
    echo [SETUP] Dependencies successfully installed.
    echo.
)

echo [LAUNCH] Starting development server...
echo [URL] Opening http://localhost:5173/ in browser...
echo.

call npm.cmd run dev -- --open

if %errorlevel% neq 0 (
    echo.
    echo [NOTICE] Development server stopped.
)

pause
