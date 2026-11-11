@echo off
echo ========================================================
echo   Publishing FinWise to GitHub Pages Root Domain
echo ========================================================
echo.
echo Primary Repository: https://github.com/CHANStiLLlearning/chanstilllearning.github.io
echo Live Production:    https://chanstilllearning.github.io/
echo.
echo Pushing latest code directly via git...
git add .
git commit -m "Deploy latest website updates"
git push user-site main
git push origin main
echo.
echo ========================================================
echo  Your site is LIVE at https://chanstilllearning.github.io/
echo ========================================================
pause
