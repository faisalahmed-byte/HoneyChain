@echo off
chcp 65001 >nul
title Honey Chain - Backend Server (Port 5000)
cls
echo ========================================================================
echo   HONEY CHAIN - LOCAL BACKEND SERVER (PORT 5000)
echo ========================================================================
echo.
echo Starting Express API & SQLite Database...
echo Host URL: http://localhost:5000
echo.
node server/server.js
pause
