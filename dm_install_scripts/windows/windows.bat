@echo off
set INSTALL_DIR=%CD%
set DM_DIR=%INSTALL_DIR%\..\..\docker-machine

echo Creating ~/.docker/machine directory if it doesn't exist...
if not exist "%USERPROFILE%\.docker\machine" mkdir "%USERPROFILE%\.docker\machine"

echo Checking if Docker Machine is already installed...
where docker-machine >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Docker Machine is already installed. Skipping installation.
    pause
    exit /b
)

echo Creating docker-machine directory...
if not exist "%DM_DIR%" mkdir "%DM_DIR%"

echo Downloading Docker Machine (GitLab version)...
powershell -Command "Invoke-WebRequest -Uri 'https://gitlab-docker-machine-downloads.s3.amazonaws.com/v0.16.2-gitlab.11/docker-machine-Windows-x86_64.exe' -OutFile '%DM_DIR%\docker-machine.exe'"

echo Adding Docker Machine directory to PATH if not already present...
echo ;%DM_DIR%| findstr /C:";%DM_DIR%" 1>nul
if errorlevel 1 (
    setx PATH "%PATH%;%DM_DIR%"
    echo Docker Machine directory has been added to PATH.
) else (
    echo Docker Machine directory is already in PATH. Skipping addition.
)

echo Docker Machine (GitLab version) has been installed successfully.
pause