param(
  [string]$InformesPath = "C:\Users\harri\OneDrive\Desktop\informes",
  [string]$FichasPath = "C:\Users\harri\OneDrive\Desktop\fichas",
  [string]$PublicDir = "public\source-data"
)

function Convert-ToSafeFileName {
  param([string]$Name)
  $normalized = $Name.Normalize([Text.NormalizationForm]::FormD)
  $builder = New-Object System.Text.StringBuilder
  foreach ($char in $normalized.ToCharArray()) {
    $category = [Globalization.CharUnicodeInfo]::GetUnicodeCategory($char)
    if ($category -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$builder.Append($char)
    }
  }
  $ascii = $builder.ToString().Normalize([Text.NormalizationForm]::FormC).ToLowerInvariant()
  $ascii = $ascii -replace '[^a-z0-9.]+', '-'
  $ascii = $ascii -replace '-+', '-'
  $ascii = $ascii.Trim('-')
  if (-not $ascii) { return "source-file" }
  return $ascii
}

New-Item -ItemType Directory -Force -Path (Join-Path $PublicDir "informes") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $PublicDir "fichas") | Out-Null

$manifest = @()
foreach ($root in @(@{name="informes"; path=$InformesPath}, @{name="fichas"; path=$FichasPath})) {
  if (-not (Test-Path $root.path)) { continue }
  $targetGroup = Join-Path $PublicDir $root.name
  foreach ($file in Get-ChildItem -Path $root.path -Recurse -File) {
    $safeName = Convert-ToSafeFileName -Name $file.Name
    $target = Join-Path $targetGroup $safeName
    $index = 2
    while (Test-Path $target) {
      $base = [IO.Path]::GetFileNameWithoutExtension($safeName)
      $ext = [IO.Path]::GetExtension($safeName)
      $target = Join-Path $targetGroup "$base-$index$ext"
      $index += 1
    }
    Copy-Item -LiteralPath $file.FullName -Destination $target
    $manifest += [pscustomobject]@{
      group = $root.name
      original_name = $file.Name
      public_path = "/" + (($target -replace '^public[\\/]', '') -replace '\\', '/')
      bytes = $file.Length
    }
  }
}

$manifestPath = Join-Path $PublicDir "manifest.json"
$manifest | ConvertTo-Json -Depth 3 | Set-Content -Path $manifestPath -Encoding UTF8
Write-Output "Copied $($manifest.Count) source files"
Write-Output "Wrote $manifestPath"
