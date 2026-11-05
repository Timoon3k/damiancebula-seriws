#!/usr/bin/env bash
set -euo pipefail
export DOCKER_HOST=unix:///var/run/docker.sock
unset DOCKER_CONTEXT DOCKER_TLS DOCKER_TLS_VERIFY DOCKER_CERT_PATH
cd /workspace/dc-dev
compose=(docker compose -f compose.yaml -f theme.override.yaml)
"${compose[@]}" up -d --wait db wordpress
for attempt in $(seq 1 60); do
    if "${compose[@]}" exec -T wordpress test -s /var/www/html/wp-config.php; then break; fi
    if [ "$attempt" = 60 ]; then exit 1; fi
    sleep 1
done
if ! "${compose[@]}" run --rm -T cli wp core is-installed; then
    "${compose[@]}" run --rm -T --entrypoint sh cli -c 'wp core install --url=http://127.0.0.1:8080 --title="Damian Cebula" --admin_user=dc_local --admin_email=dev@example.test --admin_password="$WP_ADMIN_PASSWORD" --skip-email'
fi
"${compose[@]}" run --rm -T cli wp theme activate dc-serwis
"${compose[@]}" run --rm -T cli wp eval-file /scripts/seed-local-wordpress.php
curl --fail --silent --show-error --retry 10 --retry-connrefused --retry-delay 1 http://127.0.0.1:8080/ -o /tmp/dc-wordpress-home.html
curl --fail --silent --show-error 'http://127.0.0.1:8080/?rest_route=/wp/v2/types' -o /tmp/dc-wordpress-types.json
python3 - <<'PY'
import json
from pathlib import Path
assert 'Naprawiamy.' in Path('/tmp/dc-wordpress-home.html').read_text()
assert 'page' in json.loads(Path('/tmp/dc-wordpress-types.json').read_text())
print('PASS: DC theme homepage and WordPress REST page type')
PY
