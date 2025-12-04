@echo off
echo Setting up Git and GitHub...
echo.

REM Configure git user
git config user.name "Sunil Kumar"
git config user.email "sunil@example.com"

REM Add and commit all files
git add .
git commit -m "Initial commit: CodeX Refactor project"

echo.
echo ========================================
echo Git is configured and code is committed!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Go to: https://github.com/new
echo 2. Repository name: codex-refactor
echo 3. Keep it Public or Private (your choice)
echo 4. DO NOT check "Initialize with README"
echo 5. Click "Create repository"
echo.
echo 6. After creating, GitHub will show you commands. Use these instead:
echo.
set /p username="Enter your GitHub username: "
echo.
echo Running: git remote add origin https://github.com/%username%/codex-refactor.git
git remote add origin https://github.com/%username%/codex-refactor.git
echo.
echo Running: git branch -M main
git branch -M main
echo.
echo Running: git push -u origin main
git push -u origin main
echo.
echo ========================================
echo Done! Your code is now on GitHub!
echo ========================================
pause
