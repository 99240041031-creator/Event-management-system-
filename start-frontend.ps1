# Start Frontend Server with Node.js
# Run this script to start the frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING FRONTEND SERVER (Vite)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
$frontendPath = "c:/Event Managemnt system/smart-intercollege-event-hackathon-manager/smart-intercollege-event-hackathon-manager/frontend"
Set-Location $frontendPath
Write-Host "Working directory: $frontendPath" -ForegroundColor Cyan
Write-Host ""

# Start Vite
Write-Host "Starting Vite development server..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl-C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
