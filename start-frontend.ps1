Write-Output "STARTING FRONTEND SERVER"
$frontendPath = "$PSScriptRoot\frontend"
Set-Location $frontendPath
npm run dev
