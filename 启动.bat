@echo off
cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing dependencies, please wait...
  npm install
)

start "" powershell -WindowStyle Hidden -Command "Start-Sleep 5; Start-Process 'http://localhost:3016'"

npm run dev
pause
