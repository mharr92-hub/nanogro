param(
  [string]$InformesPath = "C:\Users\harri\OneDrive\Desktop\informes",
  [string]$FichasPath = "C:\Users\harri\OneDrive\Desktop\fichas",
  [string]$OutDir = "docs\real-data-extraction"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

function Get-ZipEntryText {
  param([string]$Path, [string]$EntryPattern)
  $archive = $null
  try {
    $archive = [System.IO.Compression.ZipFile]::OpenRead($Path)
    $entries = $archive.Entries | Where-Object { $_.FullName -like $EntryPattern }
    $chunks = foreach ($entry in $entries) {
      $reader = New-Object System.IO.StreamReader($entry.Open())
      try { $reader.ReadToEnd() } finally { $reader.Close() }
    }
    return ($chunks -join "`n")
  } catch {
    return ""
  } finally {
    if ($archive) { $archive.Dispose() }
  }
}

function Convert-XmlishToText {
  param([string]$Xmlish)
  if (-not $Xmlish) { return "" }
  $text = $Xmlish -replace '<w:tab\s*/>', ' '
  $text = $text -replace '</w:p>', "`n"
  $text = $text -replace '</w:tr>', "`n"
  $text = $text -replace '<[^>]+>', ' '
  $text = [System.Net.WebUtility]::HtmlDecode($text)
  $text = $text -replace '[ \t]+', ' '
  $text = $text -replace '(\r?\n\s*){3,}', "`n`n"
  return $text.Trim()
}

function Get-DocxText {
  param([string]$Path)
  $xml = Get-ZipEntryText -Path $Path -EntryPattern "word/*.xml"
  return Convert-XmlishToText -Xmlish $xml
}

function Get-XlsxText {
  param([string]$Path)
  $xml = Get-ZipEntryText -Path $Path -EntryPattern "xl/sharedStrings.xml"
  return Convert-XmlishToText -Xmlish $xml
}

function Get-Kind {
  param([string]$Extension)
  switch ($Extension.ToLowerInvariant()) {
    ".docx" { "extractable_docx" }
    ".xlsx" { "extractable_xlsx" }
    ".pdf" { "pdf_needs_text_extraction" }
    ".doc" { "legacy_doc_needs_conversion" }
    ".jpeg" { "image_needs_ocr" }
    ".jpg" { "image_needs_ocr" }
    ".rar" { "archive_needs_unpacking" }
    default { "unknown" }
  }
}

$files = @()
foreach ($root in @(@{name="informes"; path=$InformesPath}, @{name="fichas"; path=$FichasPath})) {
  if (Test-Path $root.path) {
    $files += Get-ChildItem -Path $root.path -Recurse -File | ForEach-Object {
      [pscustomobject]@{
        group = $root.name
        name = $_.Name
        full_path = $_.FullName
        extension = $_.Extension
        length = $_.Length
        last_write_time = $_.LastWriteTime.ToString("s")
        kind = Get-Kind -Extension $_.Extension
      }
    }
  }
}

$records = foreach ($file in $files) {
  $text = ""
  $kind = $file.kind
  if ($file.kind -eq "extractable_docx") {
    $text = Get-DocxText -Path $file.full_path
    if (-not $text) { $kind = "modern_document_needs_conversion" }
  } elseif ($file.kind -eq "extractable_xlsx") {
    $text = Get-XlsxText -Path $file.full_path
    if (-not $text) { $kind = "spreadsheet_needs_conversion" }
  }

  $safeName = ($file.group + "__" + $file.name) -replace '[\\/:*?"<>|]', '_'
  $txtPath = Join-Path $OutDir ($safeName + ".txt")
  if ($text) {
    Set-Content -Path $txtPath -Value $text -Encoding UTF8
  }

  $preview = if ($text.Length -gt 900) { $text.Substring(0, 900) } else { $text }
  [pscustomobject]@{
    group = $file.group
    name = $file.name
    full_path = $file.full_path
    extension = $file.extension
    length = $file.length
    last_write_time = $file.last_write_time
    kind = $kind
    extracted_text_path = $(if ($text) { $txtPath } else { $null })
    extracted_characters = $text.Length
    preview = $preview
  }
}

$jsonPath = Join-Path $OutDir "inventory.json"
$records | ConvertTo-Json -Depth 4 | Set-Content -Path $jsonPath -Encoding UTF8

$summaryPath = Join-Path $OutDir "README.md"
$lines = @(
  "# Real Nano-Gro source data extraction",
  "",
  "Generated from Desktop folders: informes and fichas.",
  "",
  "| Group | File | Kind | Extracted characters |",
  "| --- | --- | --- | --- |"
)
$lines += $records | ForEach-Object { "| $($_.group) | $($_.name) | $($_.kind) | $($_.extracted_characters) |" }
Set-Content -Path $summaryPath -Value $lines -Encoding UTF8

Write-Output "Wrote $jsonPath"
Write-Output "Wrote $summaryPath"
