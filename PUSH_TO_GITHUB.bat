@echo off
title Push MISSION: BEYOND to GitHub
cd /d "C:\Users\Dell\Desktop\Mission Beyond"
set PATH=%LOCALAPPDATA%\Git\cmd;%LOCALAPPDATA%\gh;%PATH%

echo ===================================================================
echo               MISSION: BEYOND - GITHUB SYNC
echo   Target: https://github.com/aishwaryaamashi/Mission-Beyond.git
echo ===================================================================
echo.
echo Pushing committed code to branch 'main'...
echo (If a browser window or login prompt appears, simply click 'Sign in')
echo.

git push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================================
    echo  [SUCCESS] All files successfully uploaded to your GitHub repository!
    echo ===================================================================
) else (
    echo ===================================================================
    echo  [NOTICE] If you need to sign in, GitHub CLI is also available.
    echo ===================================================================
)
echo.
pause
