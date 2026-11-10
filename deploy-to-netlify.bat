@echo off
echo ========================================================
echo   Deploying FinWise to Netlify
echo ========================================================
echo.
echo 1. Opening Netlify Drop in your default browser...
start https://app.netlify.com/drop
echo 2. Opening folder with your ready-to-deploy website-dist.zip...
explorer.exe /select,"%~dp0website-dist.zip"
echo.
echo ========================================================
echo  INSTRUCTIONS:
echo  Simply DRAG AND DROP 'website-dist.zip' into the
echo  Netlify browser window that just opened!
echo.
echo  Your site will be LIVE online with HTTPS in 10 seconds!
echo ========================================================
pause

