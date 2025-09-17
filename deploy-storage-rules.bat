@echo off
echo 🚀 Deploying Firebase Storage Rules...
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Firebase CLI not found
    echo    Please install Firebase CLI: npm install -g firebase-tools
    pause
    exit /b 1
)

REM Check if user is authenticated
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Not authenticated with Firebase
    echo    Please run: firebase login
    pause
    exit /b 1
)

REM Deploy storage rules
echo 📋 Deploying storage rules...
firebase deploy --only storage

if %errorlevel% equ 0 (
    echo.
    echo ✅ Storage rules deployed successfully!
    echo.
    echo 📝 Rules Summary:
    echo    • Read access: Public (all images can be viewed)
    echo    • Write access: Authenticated users only
    echo    • File size limit: 10MB per image
    echo    • Allowed formats: JPG, PNG, WebP, AVIF, GIF, SVG, BMP, TIFF, ICO
    echo    • Organized folders: portfolio-images, blog-images, images, admin-uploads, temp
) else (
    echo ❌ Error deploying storage rules
)

pause
