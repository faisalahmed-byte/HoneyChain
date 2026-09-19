@echo off
chcp 65001 >nul
title Honey Chain - Complete System Launcher
cls
echo ========================================================================
echo   HONEY CHAIN - COMPLETE FULL SYSTEM LAUNCHER
echo ========================================================================
echo.
echo Launching:
echo   1. Backend Host Server (Port 5000)
echo   2. Frontend Web App (Port 5173)
echo   3. IoT Arduino Sync Bridge
echo.
start "Honey Chain - Host Backend (5000)" cmd /k "node server/server.js"
start "Honey Chain - Web Client (5173)" cmd /k "cd client && npm run dev"
timeout /t 3 /nobreak >nul
start "Honey Chain - IoT Sensor Bridge" cmd /k "python -u server/arduino_bridge.py"
echo All 3 Honey Chain services launched in separate windows!
echo Access the local web app at: http://localhost:5173
pause
