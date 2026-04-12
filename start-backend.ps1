# Start Backend Server with Java 17
# Run this script to start the backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING BACKEND SERVER (Java 17)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set Java 17 environment
$env:JAVA_HOME = "C:\Java\jdk-17.0.14+7"
$env:Path = "C:\Java\jdk-17.0.14+7\bin;" + $env:Path

Write-Host "Java 17 environment configured" -ForegroundColor Green
Write-Host "   JAVA_HOME: $env:JAVA_HOME"
Write-Host ""

# Verify Java version
Write-Host "Verifying Java version..." -ForegroundColor Yellow
java -version
Write-Host ""

# Navigate to backend directory
$backendPath = "c:/Event Managemnt system/smart-intercollege-event-hackathon-manager/smart-intercollege-event-hackathon-manager/backend"
Set-Location $backendPath
Write-Host "Working directory: $backendPath" -ForegroundColor Cyan
Write-Host ""

# Start Spring Boot
Write-Host "Starting Spring Boot application..." -ForegroundColor Green
Write-Host ""
Write-Host "Wait for Started EventManagerApplication message..." -ForegroundColor Yellow
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl-C to stop the server" -ForegroundColor Yellow
Write-Host ""

mvn spring-boot:run -DskipTests
