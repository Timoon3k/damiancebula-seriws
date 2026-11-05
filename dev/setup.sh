#!/usr/bin/env bash
set -euo pipefail
export DOCKER_HOST=unix:///var/run/docker.sock
unset DOCKER_CONTEXT DOCKER_TLS DOCKER_TLS_VERIFY DOCKER_CERT_PATH
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
state=/workspace/dc-dev
mkdir -p "$state"
python3 - "$state" <<'PY'
from pathlib import Path
import sys,secrets
p=Path(sys.argv[1])/'.env'
if not p.exists():
    p.write_text('DB_PASSWORD='+secrets.token_hex(24)+'\nDB_ROOT_PASSWORD='+secrets.token_hex(24)+'\nWP_ADMIN_PASSWORD='+secrets.token_hex(24)+'\n')
    p.chmod(0o600)
PY
# Copy reviewed project configuration, leaving local secrets untouched.
cp "$repo/dev/compose.yaml" "$state/compose.yaml"
cp "$repo/dev/theme.override.yaml" "$state/theme.override.yaml"
# The theme is publicly readable by the PHP worker; no credentials live here.
find "$repo/wp-content/themes/dc-serwis" -type d -exec chmod 755 {} +
find "$repo/wp-content/themes/dc-serwis" -type f -exec chmod 644 {} +
chmod 755 "$repo/scripts"
chmod 644 "$repo/scripts/seed-local-wordpress.php"
cd "$state"
docker compose -f compose.yaml -f theme.override.yaml --profile tools pull
