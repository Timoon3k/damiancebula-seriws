# Ochrona SEO — Architectural Service 2.0.0

Porównanie **lokalne PASS, 7/7 stron**. Wymagane porównanie z produkcją pozostaje **niewykonane z powodu blokady sieci**. Nie należy utożsamiać tych dwóch wyników.

Punktem wyjścia jest `main` `c007e40592628316a4484f4b7236aeea2cf9246c` (1.6.0), sprawdzony przez fetch przed zmianami. Zmiany powstają na `design/architectural-service`. Nie zmieniono produkcji, domeny, indeksacji ani ustawień Rank Math. Nie wysyłano żądań indeksowania.

## Dowód lokalny przed i po

Przed przebudową zapisano rzeczywiste odpowiedzi HTTP siedmiu stron oddzielnej instalacji WordPress. Z tego HTML, a nie z wersji po zmianie, utworzono `tests/fixtures/architectural-baseline.json`. Test `tests/architectural-seo.cjs` porównuje:

- status HTTP, język i X-Robots-Tag;
- cały tekst `main`, kolejność i treść H1–H3, akapity, FAQ, adresy i treść prawną;
- title, description, robots, canonical, Open Graph i Twitter Cards;
- JSON-LD oraz dotychczasowe linki wewnętrzne i zewnętrzne;
- href/src, kolejność, ALT i podpisy zdjęć realizacji;
- SHA256 29 chronionych plików zdjęć i oryginałów.

Wszystkie pola są identyczne po normalizacji wyłącznie originu lokalnej instalacji. Dwa świadome dodatki są wyłączone z porównania tekstu/linków: przycisk kontaktu w hero i dodatkowa nawigacja stopki. Nie wyłączono żadnego istniejącego tekstu, nagłówka ani linku. Nowe ilustracje usług mają nowe ALT i nie są zdjęciami realizacji.

| Adres | Wynik lokalny |
|---|---|
| `/` | PASS |
| `/serwis-klimatyzacji-stalowa-wola/` | PASS |
| `/serwis-agd-stalowa-wola/` | PASS |
| `/realizacje/` | PASS |
| `/o-firmie/` | PASS |
| `/kontakt/` | PASS |
| `/polityka-prywatnosci/` | PASS |

Raport maszynowy: [architectural-seo.json](test-results/architectural/architectural-seo.json). Oryginalny wcześniejszy `premium-baseline.json` również pozostaje zachowany. Nie regeneruj żadnego wzorca z aktualnego HTML w celu zaakceptowania różnic.

## Zakres ochrony w kodzie

`inc/seo.php`, wzorce z treściami, mechanizm synchronizacji i konfiguracja SEO nie zostały zmienione. `inc/architectural.php` filtruje prezentację bloków i dodaje klasy układu; nie zapisuje danych do bazy. Znane ilustracje domyślne zastępuje podczas renderowania. Nie dotyka galerii właściciela. Zachowano nazwy, treść i adresy stron, favicon oraz obsługę zewnętrznej wtyczki SEO bez dublowania znaczników. Dotychczasowy importer nadal rozpoznaje ręcznie edytowane treści i nie zastępuje ich wzorcami.

AJAX nadal przenosi title, description, canonical, robots, OG/Twitter i JSON-LD nowej odpowiedzi WordPress, aktualizuje URL, historię i fokus. Test motion sprawdza rzeczywiste przejścia, a browser sprawdza zachowanie dokumentu oraz Wstecz. Widoki z zewnętrznym widgetem opinii przechodzą przez pełne ładowanie, aby wtyczka mogła się zainicjalizować.

## Brakująca weryfikacja produkcji

Próba odczytu `https://damiancebula-serwis.pl/` przed zmianami oraz ponowiony odczyt zakończyły się `curl (56): CONNECT tunnel failed, response 403`, HTTP `000`. To odmowa proxy środowiska, a nie odpowiedź strony. Nie pobrano produkcyjnych metadanych, robots.txt ani sitemap i nie można potwierdzić ich zgodności ze stanem lokalnym, szczególnie ręcznych wartości Rank Math.

Dowód: [production-seo-status.json](test-results/architectural/production-seo-status.json). Skrypt `scripts/capture-production-seo.cjs` jest gotowy do odczytu siedmiu URL, robots.txt i obu możliwych adresów sitemap po udostępnieniu sieci. Zapisuje rzeczywiste odpowiedzi i zatrzymuje się przy blokadzie; nie modyfikuje witryny.

Zapisano projekt konfiguracji dopuszczający domenę i API GitHuba. Musi zostać opublikowany w ustawieniach środowiska, aby działał. Następnie należy pobrać migawkę publicznej produkcji, porównać ją ze stagingiem z nowym motywem i wyjaśnić każdą różnicę. Staging powinien zachować własne `noindex`. Do tego czasu aktualizacja nie ma pełnego odbioru produkcyjnego SEO i nie jest wdrażana.
