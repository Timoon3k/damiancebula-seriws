#!/usr/bin/env bash
# Downloads only images from the website owned by the customer.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"
mkdir -p assets/source-web

declare -a sources=(
  "realizacja-praca1.webp|https://damiancebula-serwis.pl/wp-content/uploads/2025/11/praca1.webp"
  "realizacja-prava2.webp|https://damiancebula-serwis.pl/wp-content/uploads/2025/11/prava2.webp"
  "realizacja-praca3.webp|https://damiancebula-serwis.pl/wp-content/uploads/2025/11/praca3.webp"
  "realizacja-praca4.webp|https://damiancebula-serwis.pl/wp-content/uploads/2025/11/praca4.webp"
  "realizacja-praca5.webp|https://damiancebula-serwis.pl/wp-content/uploads/2025/11/praca5.webp"
  "identyfikacja-dc-logo.png|https://damiancebula-serwis.pl/wp-content/uploads/2025/07/527cc526-6079-4c42-816f-5ad0ec245512-e1765166448339.png"
  "identyfikacja-dc-logo.webp|https://damiancebula-serwis.pl/wp-content/uploads/2025/07/419be228-93d5-4ce1-8484-dc46165974e7.png.webp"
)

for item in "${sources[@]}"; do
  name="${item%%|*}"
  url="${item#*|}"
  target="assets/source-web/$name"
  if [ -s "$target" ]; then
    echo "Already exists: $target"
    continue
  fi
  temp="${target}.download"
  rm -f "$temp"
  echo "Downloading $url"
  curl --location --fail --silent --show-error --retry 3 --max-time 45 "$url" --output "$temp"
  [ -s "$temp" ] || { echo "Empty file: $url" >&2; exit 1; }
  mimetype="$(file -b --mime-type "$temp")"
  case "$mimetype" in
    image/png|image/webp|image/jpeg) ;;
    *) echo "Unexpected MIME type: $mimetype for $url" >&2; rm -f "$temp"; exit 1 ;;
  esac
  mv "$temp" "$target"
  echo "Saved $target ($mimetype)"
done
echo "Website photos and brand source files imported."
