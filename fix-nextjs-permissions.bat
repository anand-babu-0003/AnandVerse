@echo off
echo Fixing Next.js permission issues on Windows...

REM Stop any Node.js processes
taskkill /F /IM node.exe 2>nul

REM Remove .next directory
if exist ".next" (
    echo Removing .next directory...
    rmdir /S /Q ".next" 2>nul
)

REM Clear npm cache
echo Clearing npm cache...
npm cache clean --force

REM Create fresh .next directory
echo Creating fresh .next directory...
mkdir ".next" 2>nul

REM Set permissions
echo Setting permissions...
icacls ".next" /grant Everyone:F /T /Q 2>nul

echo.
echo Permission fix complete!
echo You can now run 'npm run dev' or 'npm run build'
echo.
pause
