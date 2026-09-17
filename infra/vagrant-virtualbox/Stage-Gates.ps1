[CmdletBinding()]
param([ValidateSet('Validate','Up','Resume','Test','Status','Ssh','Halt')][string]$Action = 'Validate',
      [string]$RuntimeDirectory)
$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path
if (-not $RuntimeDirectory) {
    $RuntimeDirectory = Join-Path (Split-Path $repo -Parent) 'stage-gate-runtime'
}
$RuntimeDirectory = [System.IO.Path]::GetFullPath($RuntimeDirectory)
if ($RuntimeDirectory.TrimEnd('\') -eq $repo.TrimEnd('\') -or
    $RuntimeDirectory.StartsWith($repo.TrimEnd('\') + '\', [StringComparison]::OrdinalIgnoreCase)) {
    throw 'RuntimeDirectory deve ficar fora do repositorio publico.'
}
New-Item -ItemType Directory -Force -Path $RuntimeDirectory | Out-Null
$env:STAGE_GATE_REPO = $repo.Replace('\', '/')
# Preserve an existing runtime's cache when adopting an already created VM.
$legacyCache = Join-Path (Split-Path (Split-Path $RuntimeDirectory -Parent) -Parent) 'work\vagrant-home'
$env:VAGRANT_HOME = if ((Test-Path -LiteralPath (Join-Path $RuntimeDirectory '.vagrant')) -and (Test-Path -LiteralPath $legacyCache)) { $legacyCache } else { Join-Path $RuntimeDirectory 'vagrant-home' }
$env:VAGRANT_DEFAULT_PROVIDER = 'virtualbox'
New-Item -ItemType Directory -Force -Path $env:VAGRANT_HOME | Out-Null
foreach ($asset in @('Vagrantfile','network-preflight.sh','setup-tests.sh','run-gates.sh')) {
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot $asset) -Destination (Join-Path $RuntimeDirectory $asset) -Force
}
$vagrantCommand = Get-Command vagrant.exe -ErrorAction SilentlyContinue
$vagrantExe = if ($vagrantCommand) { $vagrantCommand.Source } else { 'C:\Program Files\Vagrant\bin\vagrant.exe' }
if (-not (Test-Path -LiteralPath $vagrantExe)) { throw 'Vagrant nao encontrado. Instale o Vagrant antes de continuar.' }
Push-Location $RuntimeDirectory
$transcribing = $false
try {
    if ($Action -ne 'Ssh') {
        $logDir = Join-Path $RuntimeDirectory 'logs'
        New-Item -ItemType Directory -Force -Path $logDir | Out-Null
        $logPath = Join-Path $logDir ("{0}-{1}.log" -f (Get-Date -Format 'yyyyMMdd-HHmmss'), $Action)
        Start-Transcript -Path $logPath | Out-Null
        $transcribing = $true
        Write-Host "Log desta execucao: $logPath"
    }
    if ($Action -in @('Validate','Up','Resume')) {
        if (-not (Test-Path -LiteralPath (Join-Path $repo '.git'))) {
            throw "Repositorio Git nao encontrado em: $repo"
        }
        # The checkout was created by CodexSandboxOnline, while the operator
        # runs this script under their Windows account. Trust only this exact
        # checkout for these commands; do not change global Git configuration.
        $trustedRepo = (Resolve-Path -LiteralPath $repo).Path.Replace('\', '/')
        $gitArgs = @('-c', "safe.directory=$trustedRepo", '-C', $repo)
        & git @gitArgs rev-parse --is-inside-work-tree
        if ($LASTEXITCODE -ne 0) { throw "Git nao conseguiu abrir o repositorio: $repo" }
        & git @gitArgs bundle create (Join-Path $RuntimeDirectory 'source.bundle') main
        if ($LASTEXITCODE -ne 0) { throw 'Falha ao preparar o snapshot Git.' }
        & git @gitArgs bundle verify (Join-Path $RuntimeDirectory 'source.bundle')
        if ($LASTEXITCODE -ne 0) { throw 'O snapshot Git criado nao passou na verificacao.' }
    }
    if ($Action -eq 'Up') {
        $vboxCommand = Get-Command VBoxManage.exe -ErrorAction SilentlyContinue
        $vboxExe = if ($vboxCommand) { $vboxCommand.Source } else { 'C:\Program Files\Oracle\VirtualBox\VBoxManage.exe' }
        if (-not (Test-Path -LiteralPath $vboxExe)) { throw 'VirtualBox nao encontrado. Instale-o e execute novamente com -Action Up.' }
    }
    switch ($Action) {
        'Validate' { & $vagrantExe validate }
        'Up'       { & $vagrantExe up --provider=virtualbox --provision }
        'Resume'   { & $vagrantExe reload --provision }
        'Test'     { & $vagrantExe provision --provision-with 'verify-provider-free,run-gates' }
        'Status'   { & $vagrantExe status }
        'Ssh'      { & $vagrantExe ssh }
        'Halt'     { & $vagrantExe halt }
    }
    if ($LASTEXITCODE -ne 0) { throw "Vagrant falhou (exit $LASTEXITCODE)." }
} finally {
    if ($transcribing) { Stop-Transcript | Out-Null }
    Pop-Location
}
