# D:\BSWebSaaS\tools\setup-saas.ps1
# Run with: powershell -ExecutionPolicy Bypass -File D:\BSWebSaaS\tools\setup-and-dev.ps1

param(
    [switch]$SkipInstall
)

$root = "D:\BSWebSaaS"
Write-Host ">> Switching to $root" -ForegroundColor Cyan
Set-Location $root

if (-not $SkipInstall) {
    Write-Host ">> Step 1: Installing dependencies with pnpm install ..." -ForegroundColor Cyan
    pnpm install
}

Write-Host ">> Step 2: Ensuring Payload CMS packages are installed (3.63.0)..." -ForegroundColor Cyan
# Chỉ cần gọi add, nếu đã tồn tại đúng version thì pnpm sẽ sync lại, không sao cả
pnpm add -w `
  payload@3.63.0 `
  @payloadcms/next@3.63.0 `
  @payloadcms/db-postgres@3.63.0 `
  @payloadcms/richtext-lexical@3.63.0

Write-Host ">> Step 3: Starting Docker services (Postgres, Redis, ...)" -ForegroundColor Cyan
docker compose up -d

Write-Host ">> Step 4: Running Payload migrations..." -ForegroundColor Cyan
pnpm payload:migrate

Write-Host ">> Step 5: Starting dev server (pnpm dev)..." -ForegroundColor Cyan
pnpm dev