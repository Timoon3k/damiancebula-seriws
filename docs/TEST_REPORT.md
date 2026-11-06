# Testy — Architectural Service 2.0.0

Testowano 2026-11-06 na oddzielnym lokalnym WordPressie 7.1.4, PHP 8.3.36, MariaDB 11.4 i Chromium 155. Zmiany powstały z `main` `c007e40` na `design/architectural-service`. Produkcja i domena pozostają bez zmian. Historyczny opis 1.6 znajduje się w [TEST_REPORT_1_6.md](TEST_REPORT_1_6.md).

| Zakres | Rzeczywisty wynik |
|---|---|
| Responsywność | PASS: 56 widoków — 7 stron × 360/390/768/1024/1280/1440/1536/1920 px; HTTP 200, jeden H1, obrazy, brak poziomego overflow |
| Nawigacja | PASS: AJAX zachowuje dokument, URL, historię, Wstecz i fokus nowej treści; pełna nawigacja także bez JS |
| Menu | PASS: modal z prawej, dotyk i klawiatura, tło inert, Escape/przycisk/tło, blokada i przywrócenie scrolla, powrót fokusu, resize, sticky bez scrollspy |
| Animacje | PASS: 12 przejść desktop/mobile kontrolowanych w kolejnych klatkach; brak wipe/clipPath/przygaszania main i H1, hero natychmiast widoczne, jednorazowe grupy reveal, szybkie przejścia, historia, reduced motion i brak JS |
| Galerie | PASS: 9 galerii na 1440/768/390 px; pełne kadry contain, brak zoomu, podpisy, rzeczywiste zdjęcia, lightbox pełnego pliku i powrót fokusu |
| SEO i treść | PASS lokalnie: 7 migawek przed/po; pełny zakres i ograniczenie produkcyjne opisane w [raporcie SEO](SEO_PROTECTION_REPORT.md); 29 plików zdjęć ma niezmienione SHA256 |
| Dostępność | PASS: 15 audytów axe WCAG A/AA, w tym otwarty modal mobilny; 0 wykrytych naruszeń w badanych stanach |
| Fonty i fokus | PASS na 1440/390 px: dwa lokalne WOFF2, polskie znaki, widoczny obrys przycisków i usług |
| Polityka prywatności | PASS: niezmieniona treść prawna, układ ograniczony do dokumentu; osobny test potwierdza pełną szerokość body i kontrast AA wszystkich linków stopki |
| Gutenberg | PASS: 7 stron bez nieprawidłowych bloków; brak przepisywania zapisanych bloków na nowy layout |
| Formularz | PASS: nonce, honeypot, checkbox, email, błąd wysyłki, sukces, rate limit HTTP 429, stan AJAX i komunikaty; odbiorca kontakt@damiancebula-serwis.pl i Reply-To potwierdzone |
| Mapa | PASS lokalnie: automatyczna ramka bez przycisku zgody w Kontakcie, AJAX, telefon, brak JS i link awaryjny przy blokadzie ramki |
| Logo | PASS przy DPR 2 i 1440/768/390/360 px: pełny oryginalny plik zamiast cropa 220×64, zachowane proporcje, brak overflow i podwójnego napisu, odpowiednia rozdzielczość i kontrast na porcelanie |
| PHP / JS / JSON | PASS: składnia 23 plików PHP, zmienionych skryptów, poprawność theme.json i git diff --check |

Wiadomości przechwyciła tymczasowa lokalna atrapa `wp_mail`, usunięta po teście. Nie wysłano wiadomości na rzeczywistą skrzynkę. Test nie potwierdza dostarczalności SMTP na Hostinger. Wszystkie połączenia Google w testach mapy były zastępowane atrapą lub blokowane. Nie potwierdzono dostępności Google Maps ani aktywnego widgetu Trustindex na produkcji.

Automatyczny test axe nie jest pełnym certyfikatem WCAG. Osobne testy obejmują fokus, klawiaturę, dotyk, ograniczenie ruchu i brak JavaScript. Oględziny screenshotów wykryły zbyt szeroki selektor `.privacy-policy`, który wpływał na otoczenie dokumentu; został zawężony, a test kontrastu stopki zabezpiecza ten przypadek.

Rzeczywiste pomiary Lighthouse i Event Timing opisuje [PERFORMANCE_REPORT.md](PERFORMANCE_REPORT.md). Zrzuty wszystkich stron i metodę przed/po opisuje [VISUAL_COMPARISON.md](VISUAL_COMPARISON.md). JSON z bieżących testów jest w [test-results/architectural](test-results/architectural/); wcześniejsze raporty wersji pozostają zachowane.

Paczka `artifacts/dc-serwis-2.0.0.zip` zawiera 85 plików wyłącznie pod `dc-serwis/`, ma 2 927 912 B i poprawne CRC. Zweryfikowano zgodność każdego pliku z kodem, nowe ilustracje, adapter, fonty z licencją oraz brak dawnych warstw premium i plików środowiska. SHA256: `1aa9b389abf32b87cc9d4d63f128a70a56d1b757b55bc96d3203316471e93ce4`. Dowód: [package-2.0.json](test-results/architectural/package-2.0.json).

## Odtworzenie

Uruchom odrębną instalację lokalną, zainstaluj `npm ci`, ustaw `BASE_URL=http://127.0.0.1:8081`. Główne polecenia: `npm run test:browser`, `test:a11y`, `test:navigation`, `test:motion`, `test:gallery`, `test:preservation`, `test:premium`, `test:map`. `test:editor` wymaga wygenerowanych lokalnych danych testowej instalacji. Formularz i branding wymagają tymczasowych fixture PHP opisanych w skryptach testowych — nie uruchamiaj ich na produkcji.

Nie uruchamiaj `test:legacy-preservation` jako kryterium wersji 2.0: ten historyczny test nie uwzględnia zatwierdzonego nowego CTA i nawigacji stopki. Aktualny wzorzec `architectural-baseline.json` został wyprowadzony z HTML sprzed zmian i nadal chroni cały istniejący tekst i linki.

## Ograniczenia odbioru

Produkcja oraz API GitHuba odmawiają połączenia przez proxy środowiska (CONNECT 403). Zapisana konfiguracja sieci wymaga opublikowania w ustawieniach. Brakuje produkcyjnej migawki SEO przed/po i utworzonego Pull Requesta. Nie dokonano merge, wdrożenia, zmiany DNS ani zgłoszeń indeksacji. Nie jest to pełny odbiór produkcyjny.
