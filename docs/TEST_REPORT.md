# Testy i ograniczenia — DC Serwis 1.2

Odrębny lokalny WordPress 7.1.4 / PHP 8.3 / MariaDB 11.4. Produkcja pozostaje bez zmian. Dane w `test-results/`.

- PASS: 49 kombinacji siedmiu stron i siedmiu szerokości; brak overflow/uszkodzonych obrazów, jeden H1, AJAX, historia, galeria, formularz i menu bez JS. Podpis majewskitomasz.pl sprawdzany na każdej stronie.
- PASS: 14 kontroli axe WCAG A/AA bez wykrytych naruszeń; natywne bloki Gutenberg wszystkich siedmiu stron poprawne.
- PASS: sticky header bez skoku treści, desktop/mobile scrollspy, nawigacja AJAX, fokus/klawiatura, reduced motion i natywne URL bez JS.
- PASS: mapa przyjmuje pełny kod iframe i oficjalne linki, odrzuca niebezpieczne/nieobsługiwane wejścia; bez ustawionego URL używa potwierdzonego adresu firmy. Brak iframe przed zgodą, ponowna zgoda po AJAX, timeout/retry i link zastępczy sprawdzone w przeglądarce. Żądania Google były przechwycone lokalnie — test nie potwierdza dostępności zewnętrznego Google w produkcji.
- PASS: bridge Rank Math zachowuje tytuły/opisy motywu, respektuje własne pola wtyczki i nie dubluje tagów/schema. Sygnatury filtrów i domyślne OG potwierdzono w oficjalnym źródle. Test PHP symuluje stałą/filtry wtyczki, nie zastępuje kontroli z faktycznie zainstalowaną wtyczką.
- PASS: edytowalny adres, sanitizacja, dynamiczny adres w polityce/mapie/schema; automatyczna polityka jest siódmą stroną, bez siódmej pozycji menu. Istniejąca polityka i ręczne zmiany są zachowywane. Synchronizacja stron, zdjęć, menu i zmiany domeny pozostaje idempotentna.
- PASS: formularz — nonce, honeypot, zgoda, e-mail, limit prób, sukces/błąd i AJAX. Wiadomości przechwycone lokalnie, nic nie wysłano do firmy. Potwierdzenie zgody i czas zgłoszenia trafiają do treści wiadomości.
- PASS: lint PHP/JS; unikalne metadata, canonical, schema z potwierdzonym adresem i logo, odnośniki także do polityki i prawdziwy 404.

Ostatni pomiar Lighthouse dotyczył wersji 1.1 (szczegóły w lighthouse-summary.json); nie jest przedstawiany jako pomiar wersji 1.2. Nie zweryfikowano produkcyjnych CWV/INP, indeksacji Google, rzeczywistej dostarczalności SMTP ani integracji kont Google/Hostinger.

Przed publicznym przepięciem domeny należy zastosować politykę do rzeczywistych usług hostingu/poczty, przestrzegać podanych okresów przechowywania danych oraz skonfigurować zgodę dla opcjonalnych widgetów i analityki. Domyślne demo treści WordPressa raportowane są do weryfikacji, bez automatycznego kasowania. Kod nie publikuje witryny ani nie zgłasza automatycznie indeksacji do Google.
