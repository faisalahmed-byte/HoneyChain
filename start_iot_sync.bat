@echo off
chcp 65001 >nul
title Honey Chain - Live IoT Sensor Bridge
cls
echo ========================================================================
echo   HONEY CHAIN - LIVE ARDUINO DHT11/DHT22 SENSOR BRIDGE
echo ========================================================================
echo.
echo [TIP] If [HOST: Offline] shows up, start the host server by running
echo       start_host.bat in a separate window!
echo.
echo Syncing live temperature and humidity to:
echo   1. Local Host: http://localhost:5000 / http://localhost:5173
echo   2. Supabase Cloud / Vercel Live App
echo.
echo Press Ctrl+C anytime to stop.
echo ========================================================================
echo.
python -u server/arduino_bridge.py
pause
