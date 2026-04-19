@echo off
cd /d %~dp0
start cmd /k node app.js
timeout /t 2
start http://localhost:3000/
