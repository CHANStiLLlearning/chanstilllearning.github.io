@echo off
echo ========================================================
echo   Publishing FinWise to GitHub Pages
echo ========================================================
echo.
echo Repository: https://github.com/CH4N855/finwise
echo Live URL:   https://ch4n855.github.io/finwise/
echo.
echo Opening GitHub Upload page in your browser...
start https://github.com/CH4N855/finwise/upload/main
echo Opening website folder in Windows Explorer...
start explorer.exe "%~dp0"
echo.
echo ========================================================
echo  INSTRUCTIONS:
echo  1. In the folder that opened, select your files:
echo     - index.html, favicon.svg, ads.txt, robots.txt, sitemap.xml
echo     - css, js, tools, blog, pages folders
echo  2. Drag them into the GitHub page in your browser.
echo  3. Click the green "Commit changes" button!
echo.
echo  Your site is LIVE at https://ch4n855.github.io/finwise/
echo ========================================================
pause

