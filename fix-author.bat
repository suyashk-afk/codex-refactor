@echo off
echo Fixing commit author...
echo.

set /p email="Enter your email (or press Enter for sunil@example.com): "
if "%email%"=="" set email=sunil@example.com

echo.
echo Updating commit author to: Sunil Kumar ^<%email%^>
git commit --amend --author="Sunil Kumar <%email%>" --no-edit

echo.
echo Force pushing to GitHub...
git push -f origin main

echo.
echo ========================================
echo Done! Commit author has been updated.
echo ========================================
pause
