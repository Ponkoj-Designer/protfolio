@echo off
setlocal
cd /d "%~dp0"

echo Starting Portfolio API on http://localhost:5005 ...
start "Portfolio API" cmd /k npm.cmd run dev:api

echo Starting Portfolio website on http://localhost:3000 ...
npm.cmd run dev
