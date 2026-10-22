@echo off
cd /d "%~dp0"
title WM TEC - Clientes
where node >nul 2>nul || (echo Falta instalar Node.js: https://nodejs.org & pause & exit /b)
node server.js
pause
