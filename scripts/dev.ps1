$ErrorActionPreference = 'Stop'

function Get-PortOrDefault {
  param(
    [string]$Value,
    [int]$Default
  )

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return $Default
  }

  $parsed = 0
  if ([int]::TryParse($Value, [ref]$parsed) -and $parsed -gt 0 -and $parsed -le 65535) {
    return $parsed
  }

  return $Default
}

function Test-PortFree {
  param([int]$Port)

  $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)

  try {
    $listener.Start()
    return $true
  } catch [System.Net.Sockets.SocketException] {
    return $false
  } finally {
    $listener.Stop()
  }
}

function Find-FreePort {
  param(
    [int]$StartPort,
    [int[]]$ExcludedPorts = @()
  )

  for ($port = $StartPort; $port -le 65535; $port++) {
    if ($ExcludedPorts -contains $port) {
      continue
    }

    if (Test-PortFree -Port $port) {
      return $port
    }
  }

  throw "Unable to find a free port at or above $StartPort."
}

function Stop-ProcessTree {
  param([System.Diagnostics.Process]$Process)

  if ($null -eq $Process -or $Process.HasExited) {
    return
  }

  & taskkill /PID $Process.Id /T /F | Out-Null
}

function Start-LoggedProcess {
  param(
    [string]$Name,
    [string]$CommandLine
  )

  $process = [System.Diagnostics.Process]::new()
  $process.StartInfo = [System.Diagnostics.ProcessStartInfo]::new()
  $process.StartInfo.FileName = 'cmd.exe'
  $process.StartInfo.Arguments = '/d /s /c "' + $CommandLine + '"'
  $process.StartInfo.RedirectStandardOutput = $true
  $process.StartInfo.RedirectStandardError = $true
  $process.StartInfo.UseShellExecute = $false
  $process.StartInfo.CreateNoWindow = $true
  $process.StartInfo.StandardOutputEncoding = [System.Text.Encoding]::UTF8
  $process.StartInfo.StandardErrorEncoding = [System.Text.Encoding]::UTF8
  $process.EnableRaisingEvents = $true

  $prefix = "[$Name]"
  $handler = [System.Diagnostics.DataReceivedEventHandler]{
    param($sender, $eventArgs)

    if ($null -ne $eventArgs.Data) {
      Write-Host "$prefix $($eventArgs.Data)"
    }
  }

  $process.add_OutputDataReceived($handler)
  $process.add_ErrorDataReceived($handler)

  if (-not $process.Start()) {
    throw "Failed to start $Name."
  }

  $process.BeginOutputReadLine()
  $process.BeginErrorReadLine()
  return $process
}

$requestedBackendPort = Get-PortOrDefault -Value $env:PORT -Default 5000
$requestedClientPort = Get-PortOrDefault -Value $env:CLIENT_PORT -Default 5173
$backendPort = Find-FreePort -StartPort $requestedBackendPort
$clientPort = Find-FreePort -StartPort $requestedClientPort -ExcludedPorts @($backendPort)
$backendUrl = "http://localhost:$backendPort"
$clientUrl = "http://localhost:$clientPort"

$env:PORT = "$backendPort"
$env:CLIENT_URL = $clientUrl
$env:BASE_URL = $backendUrl
$env:CLIENT_PORT = "$clientPort"
$env:VITE_BACKEND_URL = $backendUrl

Write-Host "Starting dev servers on $clientUrl and $backendUrl"

$serverProcess = Start-LoggedProcess -Name 'SERVER' -CommandLine 'npm run dev -w server'
$clientProcess = Start-LoggedProcess -Name 'CLIENT' -CommandLine 'npm run dev -w client'

try {
  while (-not $serverProcess.HasExited -and -not $clientProcess.HasExited) {
    Start-Sleep -Milliseconds 200
  }

  if ($serverProcess.HasExited -and -not $clientProcess.HasExited) {
    Stop-ProcessTree -Process $clientProcess
  }

  if ($clientProcess.HasExited -and -not $serverProcess.HasExited) {
    Stop-ProcessTree -Process $serverProcess
  }

  while (-not $serverProcess.HasExited -or -not $clientProcess.HasExited) {
    Start-Sleep -Milliseconds 100
  }

  if ($serverProcess.ExitCode -ne 0 -or $clientProcess.ExitCode -ne 0) {
    exit 1
  }

  exit 0
} finally {
  Stop-ProcessTree -Process $serverProcess
  Stop-ProcessTree -Process $clientProcess
}