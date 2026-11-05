# Lokalny WordPress

Z `/workspace/damiancebula-seriws`:

```sh
bash dev/setup.sh
bash dev/start.sh
npm ci
npm run test:browser
npm run test:editor
npm run test:a11y
```

W tym środowisku wywołania Dockera, lokalnych portów i sieci wymagają wykonania poza sandboxem. Nie zmieniaj proxy ani zaufania TLS. Obrazy są przypięte digestami; brak pobierania kodu z produkcji.

Konfiguracja i losowe hasła deweloperskie: `/workspace/dc-dev`, plik `.env` (0600). Nie drukuj, nie commituj i nie kopiuj ich do konfiguracji środowiska. `dc_local` jest wyłącznie lokalnym administratorem. Baza i pliki rdzenia są w named volumes `dc-dev_database` i `dc-dev_wordpress`. Nie traktuj ich jako backupu ani nie zakładaj, że działające procesy przetrwają odtworzenie maszyny. Start uruchamia usługi ponownie; przy braku wolumenów tworzy świeżą lokalną witrynę. Seed nie nadpisuje istniejących stron, ale ustawia lokalną stronę główną, linki bezpośrednie i noindex. Blokada domeny uniemożliwia użycie seeda na produkcji.

Zatrzymanie bez kasowania danych: `cd /workspace/dc-dev && docker compose stop`. Nie używaj `down -v` do restartu. Wyłącznie motyw jest montowany do WordPressa; repozytorium nie zastępuje rdzenia CMS. Korzystaj z istniejącego checkoutu, nie twórz worktree bez polecenia użytkownika.

Playwright korzysta z systemowego `/usr/bin/chromium`; możesz ustawić `CHROMIUM_PATH` po dostosowaniu skryptów. Test `test:editor` loguje się hasłem odczytanym w pamięci z lokalnego `.env`, nie ujawnia go.

`test:contact` wymaga testowego przechwytywania poczty; użyj `tests/mail-interceptor.php` wyłącznie na lokalnej instalacji:

```sh
cd /workspace/dc-dev
docker compose exec -T wordpress mkdir -p wp-content/mu-plugins
docker cp /workspace/damiancebula-seriws/tests/mail-interceptor.php dc-dev-wordpress-1:/var/www/html/wp-content/mu-plugins/dc-test-mail.php
docker compose exec -T wordpress chmod 644 wp-content/mu-plugins/dc-test-mail.php
docker compose -f compose.yaml -f theme.override.yaml run --rm -T cli wp transient delete --all
cd /workspace/damiancebula-seriws
npm run test:contact
```

Usuwanie transientów jest dopuszczalne tylko w tej odizolowanej testowej bazie. Test wysyłki nie wysyła wiadomości. Odbiorcą w kodzie jest firmowy adres, ale filtr `pre_wp_mail` przechwytuje każdą próbę; nigdy nie kopiuj go na staging/produkcję. Po testach usuń `dc-test-mail.php`.
