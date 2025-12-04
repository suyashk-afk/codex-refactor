@echo off
REM -------------------------------------------------------------
REM  Codex Refactor MCP – Reliable Python Launcher
REM -------------------------------------------------------------
setlocal

REM Path to your MCP server script (adjust ONLY if needed)
set SCRIPT=%~dp0mcp_server.py

echo Launching MCP Python server...
echo Script: %SCRIPT%
echo.

REM 1) Try the py launcher (usually installed on Windows)
where py >nul 2>&1
if %ERRORLEVEL%==0 (
    echo Trying: py -3 "%SCRIPT%"
    py -3 "%SCRIPT%"
    goto END
)

REM 2) Try "python"
where python >nul 2>&1
if %ERRORLEVEL%==0 (
    echo Trying: python "%SCRIPT%"
    python "%SCRIPT%"
    goto END
)

REM 3) Try explicit Python312 path
set PYEXE="C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python312\python.exe"
if exist %PYEXE% (
    echo Trying: %PYEXE% "%SCRIPT%"
    %PYEXE% "%SCRIPT%"
    goto END
)

REM 4) Try Program Files variant
set PYEXE2="C:\Program Files\Python312\python.exe"
if exist %PYEXE2% (
    echo Trying: %PYEXE2% "%SCRIPT%"
    %PYEXE2% "%SCRIPT%"
    goto END
)

echo.
echo ❌ ERROR: No working Python interpreter found.
echo Please install Python or add it to PATH.
echo.
pause

:END
endlocal
