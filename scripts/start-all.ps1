# PowerShell script to run Collabefy Full Stack (Backend + Frontend)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   COLLABEFY PRODUCTION FULL STACK RUNNER                 " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start Backend on Port 4000
Write-Host "`n[1/2] Starting Independent Backend API Server on http://localhost:4000..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location (Join-Path $args[0] "backend")
    npm run dev
} -ArgumentList $PSScriptRoot\..

Start-Sleep -Seconds 3

# 2. Start Frontend on Port 3000
Write-Host "[2/2] Starting Next.js Production Frontend on http://localhost:3000..." -ForegroundColor Yellow
Set-Location (Join-Path $PSScriptRoot "..")
npm run dev

# Cleanup when terminated
Stop-Job $backendJob
Remove-Job $backendJob
