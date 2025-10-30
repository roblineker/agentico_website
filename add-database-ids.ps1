# PowerShell script to add Notion database IDs to .env.local
# Run this script in PowerShell: .\add-database-ids.ps1

$envFile = ".env.local"
$envContent = @"

# ============================================
# NOTION DATABASE IDs
# ============================================
# Added automatically - these enable full lead evaluation features
NOTION_CLIENTS_DB_ID=28753ceefab08000a95cea49e7bf1762
NOTION_PROPOSALS_DB_ID=9bdf517b89d147a89963628d398870cc
NOTION_ESTIMATES_DB_ID=28753ceefab080e2842ccd40eaf73efe
NOTION_COMPANY_STYLE_GUIDES_DB_ID=b919f771bec746dd8ebdc956ec618176
NOTION_CONTACT_STYLE_GUIDES_DB_ID=2f196f71d920429e9a7318f43b154954
"@

# Check if .env.local exists
if (Test-Path $envFile) {
    # Check if IDs are already added
    $currentContent = Get-Content $envFile -Raw
    
    if ($currentContent -match "NOTION_CLIENTS_DB_ID") {
        Write-Host "✅ Database IDs already present in .env.local" -ForegroundColor Green
        exit 0
    }
    
    # Append to existing file
    Add-Content -Path $envFile -Value $envContent
    Write-Host "✅ Added database IDs to existing .env.local" -ForegroundColor Green
} else {
    # Create new file with just the database IDs
    $envContent | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host "✅ Created .env.local with database IDs" -ForegroundColor Green
    Write-Host "⚠️  Don't forget to add your NOTION_API_TOKEN and other required variables!" -ForegroundColor Yellow
}

Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart your dev server (Ctrl+C, then npm run dev)" -ForegroundColor White
Write-Host "  2. Submit a test form" -ForegroundColor White
Write-Host "  3. Check server logs - you should see 'Proposal created' instead of warnings" -ForegroundColor White
Write-Host "`n🚀 All features will now be enabled!" -ForegroundColor Green

