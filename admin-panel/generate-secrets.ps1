# PowerShell script to generate admin panel secrets

Write-Host "Generating JWT Secret..." -ForegroundColor Green
$jwtSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor Yellow

Write-Host "`nTo generate password hash, run:" -ForegroundColor Green
Write-Host "node -e `"const bcrypt = require('bcryptjs'); bcrypt.hash('your_password', 10).then(hash => console.log('ADMIN_PASSWORD_HASH=' + hash))`"" -ForegroundColor Yellow

Write-Host "`nCopy these values to your .env file:" -ForegroundColor Green
