# Raport weryfikacji DC Serwis 3.0 — 7 listopada 2026

Przebudowa odwzorowuje główną granatowo-błękitną kompozycję po lewej stronie nowej makiety. Wersja wykonawcza: `50f172c2f3020286ea9b1ea6bf251d946af07708`. Testy uruchomiono na odizolowanym WordPressie pod `http://127.0.0.1:8081`; nie na produkcji.

## Zakres i wierność

Zmieniono nagłówek, logo i favicon, hero, wspólny panel dwóch usług, sekcję korzyści, pas informacji i lokalny kontekst SEO. Zachowano pełne podstrony usług, realizacje, kontakt, politykę, mapę i konfigurację Trustindex. Dodano Cennik i Porady, zgodnie z nawigacją makiety. Górne treści home i fotografie edytuje się w Dostosuj; pozostałe teksty i galerie w Gutenbergu. Szczegóły: [REFERENCE_3_0.md](REFERENCE_3_0.md).

Porównano wizualnie **31 zrzutów**: wszystkie 9 stron przy 1440/768/390 px, home 967 px oraz trzy otwarte menu mobilne. Nie znaleziono blokujących błędów, przyciętych nagłówków, etykiet formularza, podpisów ani zdjęć realizacji. Kadr 967 px zachowuje proporcje hero (~396 px), paneli i fotografii korzyści (~247 px). [Porównanie 2.1/3.0](visual/reference/index.html) zawiera 21 wcześniejszych i 27 nowych pełnych widoków; nowe Cennik i Porady mają tylko widoki aktualne.

Nowa plansza jest dostępna w rozmowie, bez osobnego pliku źródłowego w repo. Istniejący `design/reference/makieta-uklad-strony-1-1.jpg` dokumentuje poprzedni pomarańczowy projekt. Nie wykonywano pixel-diff nowej planszy i nie deklaruje się potwierdzonej zgodności pixel-perfect. Zamierzone różnice to prawdziwy telefon **794 225 139**, terminy ustalane indywidualnie, potwierdzony zakres usług i korzyści bez fikcyjnych gwarancji lub lat doświadczenia. Dwie ilustracje odtwarzają kompozycję zdjęć z planszy; model nie jest przedstawiany jako właściciel ani pracownik. Autentyczne realizacje pozostają osobno i niezmienione.

## Faktycznie wykonane kontrole

| Kontrola | Wynik |
|---|---|
| Przeglądarka | 81 widoków: 9 stron × 9 szerokości; HTTP200, pojedyncze H1/canonical, brak przepełnienia, błędów JS i uszkodzonych zasobów |
| Kompozycja referencji | 45 widoków przy 1440/967/768/390/360 px, 12 tras AJAX i historia; czytelne logo i favicon |
| Dostępność axe | 19 stanów: 9 stron desktop/mobile oraz otwarte menu; 0 naruszeń WCAG A/AA |
| Nawigacja | Panel z prawej, natywny dialog, fokus i inert, przywrócenie przewinięcia, dotyk, resize, sticky, historia i wariant bez JS |
| Ruch | 14 tras AJAX desktop/touch; hero i main zawsze widoczne, bez maski i przesłony; jednorazowe pojawianie grup, reduced motion, szybka nawigacja |
| Galerie | 9 galerii przy 1440/768/390 px; pełne kadry, podpisy, lightbox i powrót fokusu |
| SEO i treści | 7 istniejących zestawów title/description/OG/Twitter/canonical/schema bez zmian; treść podstron, polityka, lokalne akapity home i galerie zachowane; 29 plików fotografii ma niezmienione SHA256 |
| Nowe strony | Dwie unikalne strony, pojedyncze H1 i metadata, linkowanie do usług i kontaktu; bez fikcyjnych cen |
| Gutenberg | Wszystkie 9 stron bez niepoprawnych bloków |
| Formularz | Nonce, honeypot, checkbox, e-mail, sukces/błąd transportu, limit i komunikaty AJAX; potwierdzony odbiorca kontakt@damiancebula-serwis.pl i Reply-To |
| Mapa | Automatyczny iframe bez przycisku zgody: desktop, dotyk, AJAX, bez JS i link awaryjny przy blokadzie |
| PHP | Wszystkie pliki PHP motywu przeszły lint na PHP8.3 |
| Synchronizacja | Pierwsze wywołanie utworzyło Cennik/Porady, drugie zachowało oba wpisy bez nadpisania |
| ZIP | CRC poprawne, pojedynczy katalog dc-serwis, 125 plików zgodnych bajtowo ze źródłem, bez sekretów i testowych wtyczek |

Raporty maszynowe są w [test-results/reference](test-results/reference/). Historycznych fixture SEO nie regenerowano. Poprawiono rzeczywisty kontrast napisów na przyciskach. Test kadrowania galerii uwzględnia zawartość ramki pomniejszoną o nową obwódkę, nadal wymaga pełnego obrazu i braku powiększenia/przycinania.

Poczta testowa była przechwytywana lokalnie; żaden test nie wysłał wiadomości na zewnętrzną skrzynkę. To nie jest test dostarczalności SMTP Hostinger. Zapytania Google w testach mapy były przechwytywane; lokalne screenshoty jednoznacznie oznaczają atrapę mapy. Konfiguracja widgetu Trustindex na produkcji pozostaje zachowana, ale prawdziwy widget i jego oceny nie były sprawdzane w lokalnej instalacji bez konfiguracji.

## Wydajność

Lighthouse13.6.0: **18 kolejnych pomiarów**, 3 uruchomienia × 3 strony × telefon/komputer. Kod wykonawczy zachował identyczny fingerprint przed i po audycie. Wyniki poniżej to mediany; wszystkie mediany LCP <2,5s i CLS <0,1.

| Strona | Tryb | Lighthouse | LCP | CLS | TBT |
|---|---|---:|---:|---:|---:|
| Strona główna | Telefon | 99 | 1.965 s | 0.000 | 98 ms |
| Klimatyzacja | Telefon | 99 | 2.113 s | 0.000 | 8 ms |
| AGD | Telefon | 99 | 1.974 s | 0.000 | 0 ms |
| Strona główna | Komputer | 100 | 0.436 s | 0.000 | 0 ms |
| Klimatyzacja | Komputer | 100 | 0.667 s | 0.000 | 33 ms |
| AGD | Komputer | 100 | 0.624 s | 0.000 | 0 ms |

Jedno z trzech uruchomień AGD na komputerze miało wynik74 i TBT713ms (nieprzypisana długa praca przeglądarki ~787ms); pozostałe dwa miały100 i TBT0. Wynik odstający zachowano w danych, bez usuwania go z median. Syntetyczne interakcje dotykowe przy 4× CPU: 12 interakcji, maksimum136ms. Nie jest to pomiar rzeczywistego INP ani wynik terenowy Core Web Vitals. Lokalny serwer, cache, wtyczki i zewnętrzne widgety różnią się od produkcji.

Pełny zestaw wartości, ustawień i ostrzeżeń: [performance.json](test-results/reference/performance.json). Surowe lokalne raporty: `artifacts/performance-reference-3.0/raw/`. Polecenie odtworzenia: `node scripts/performance-audit.mjs --runs=3 --out=artifacts/performance-reference-3.0`.

## Paczka i publikacja kodu

Paczka: `artifacts/dc-serwis-3.0.0.zip` (4 651 042 bajty), również jako `artifacts/dc-serwis.zip`. SHA256: `cbb4e949a708f069bd26e6237eac9e0b68c288a1cef0eb3f27091aa1865940a5`. [Instrukcja instalacji](../wp-content/themes/dc-serwis/UPDATE_3_0.md). Instalacja na stagingu jest osobnym działaniem; nie wdrażano motywu na Hostinger, nie zmieniano DNS ani produkcyjnej bazy.

Gałąź `design/blue-reference-3` jest opublikowana w GitHubie. Przebudowa trafia na `main` zgodnie z wcześniejszą dyspozycją właściciela. Próba automatycznego otwarcia draft PR przez `gh pr create` została odrzucona: `Post https://api.github.com/graphql: Forbidden`. PR nie został utworzony; nie zmieniano tokenów ani polityki sieci w celu obejścia blokady. Końcowy identyfikator commitu main jest podany w odpowiedzi do właściciela. Porównanie SEO aktualnej produkcji pozostaje niezweryfikowane ze względu na ograniczenia dostępu do zewnętrznego hosta; lokalny snapshot ma jawnie opisane źródło c007e40.
