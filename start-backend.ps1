Write-Output "STARTING BACKEND SERVER"
$mavenPath = "D:\apache-maven\apache-maven-3.9.6\bin"
if (Test-Path $mavenPath) {
    $env:Path = "$mavenPath;" + $env:Path
}
$backendPath = "$PSScriptRoot\backend"
Set-Location $backendPath
mvn spring-boot:run -DskipTests
