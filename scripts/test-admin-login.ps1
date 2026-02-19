$body = @{
    email = 'admin'
    password = 'Qwerty@123'
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/signin' -Method Post -Body $body -ContentType 'application/json'

Write-Host "`nLogin Test Result:"
Write-Host "==================`n"
$response | ConvertTo-Json -Depth 5
