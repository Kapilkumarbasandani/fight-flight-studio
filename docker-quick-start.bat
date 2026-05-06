@echo off
REM Quick Start Script for Fight and Flight Studio with Docker (Windows)

echo.
echo ========================================
echo  Starting Fight and Flight Studio
echo  with Docker
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Build and start containers
echo [BUILD] Building and starting containers...
docker-compose up -d --build

REM Wait for services to be ready
echo.
echo [WAIT] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if containers are running
docker-compose ps -q app >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo [OK] Application container is running
) else (
    echo.
    echo [ERROR] Application container failed to start
    docker-compose logs app
    exit /b 1
)

docker-compose ps -q mongodb >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MongoDB container is running
) else (
    echo [ERROR] MongoDB container failed to start
    docker-compose logs mongodb
    exit /b 1
)

REM Populate initial data
echo.
echo [SETUP] Setting up initial data...
echo Creating test users...
docker-compose exec -T app node scripts/create-test-users.js

echo Populating classes...
docker-compose exec -T app node scripts/populate-classes.js

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Application: http://localhost:3001
echo MongoDB: localhost:27017
echo.
echo Useful commands:
echo   - View logs: docker-compose logs -f
echo   - Stop: docker-compose down
echo   - Restart: docker-compose restart
echo.

pause
