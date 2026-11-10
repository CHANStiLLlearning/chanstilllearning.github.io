@echo off
echo ========================================================
echo   Starting FinWise Local Server
echo ========================================================
echo Opening browser at http://localhost:8080 ...
start http://localhost:8080
python -m http.server 8080
pause

