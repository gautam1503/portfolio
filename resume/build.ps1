# Rebuilds the downloadable resume PDF from resume.html using Microsoft Edge (headless).
$src = Join-Path $PSScriptRoot "resume.html"
$out = Join-Path $PSScriptRoot "..\public\assets\Gautam_Pandey_Resume.pdf"
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
& $edge --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$out" ("file:///" + ($src -replace '\\', '/')) | Out-Null
Start-Sleep -Seconds 2
Get-Item $out | Select-Object Name, Length, LastWriteTime
