$apiDir = "C:\Users\ADMIN\altfaze.ic\app\api"
$files = @(Get-ChildItem -Path $apiDir -Recurse -Filter "*.ts")

$results = @()

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $hasJson = $content -match 'NextResponse\.json\s*\('
    $hasImport = $content -match 'from\s+[''"].*lib/api-utils'
    
    if ($hasJson -and -not $hasImport) {
        $lines = $content -split "`n"
        $issues = @()
        
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match 'NextResponse\.json\s*\(') {
                $issues += @{
                    Line = $i + 1
                    Code = $lines[$i].Trim()
                }
            }
        }
        
        $results += @{
            File = $file.FullName.Replace($apiDir, "").TrimStart("\")
            Issues = $issues
        }
    }
}

foreach ($r in $results) {
    Write-Output "FILE: $($r.File)"
    foreach ($issue in $r.Issues) {
        Write-Output "  Line $($issue.Line): $($issue.Code)"
    }
    Write-Output ""
}

Write-Output "TOTAL FILES WITH ISSUES: $($results.Count)"
