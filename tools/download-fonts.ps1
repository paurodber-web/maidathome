$ErrorActionPreference = 'Stop'

$fontDirectory = Join-Path $PSScriptRoot '..\public\fonts'
New-Item -ItemType Directory -Force -Path $fontDirectory | Out-Null

$fonts = @{
  'dm-sans-latin-ext.woff2' = 'https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu6-K6h9Q.woff2'
  'dm-sans-latin.woff2' = 'https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2'
  'plus-jakarta-sans-latin-ext.woff2' = 'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko40yyygA.woff2'
  'plus-jakarta-sans-latin.woff2' = 'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yw.woff2'
}

foreach ($font in $fonts.GetEnumerator()) {
  Invoke-WebRequest -Uri $font.Value -OutFile (Join-Path $fontDirectory $font.Key) -UseBasicParsing
}
