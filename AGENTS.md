# Instrukcje dla Codexa — damiancebula-seriws

## Bieżący priorytet — niebieska makieta 3.0, 2026-11-07

Najnowsza prośba właściciela o przebudowę według nowej makiety ma pierwszeństwo przed kierunkami 2.0–2.1 i pierwotnym czarno-pomarańczowym projektem. Wzorzec to główna strona po **lewej stronie** planszy 1536×1024 z rozmowy (obszar szerokości około 967 px). Prawa kolumna wariantów i notatek SEO nie jest treścią witryny. Obowiązują granat `#07182B`, błękit `#08A9EF`, biel, ciemniejszy błękit przycisków `#0878BB`, logo koła zębatego ze śnieżynką i proporcje referencji. Statyczne ukośne kadry zdjęć są teraz wymagane; nadal nie maskuj i nie animuj całego `main` ani H1.

Pozostaw mapę Google ładowaną bezpośrednio w Kontakcie, konfigurowalne opinie Trustindex, formularz i dotychczasowy target SEO: serwis klimatyzacji, serwis AGD, montaż i naprawa klimatyzacji oraz naprawa pralek i zmywarek w Stalowej Woli. Właściciel dopuścił zmianę tekstów przy zachowaniu tych fraz. Nowe H1, intro i prezentacja usług na home są zamierzone. Zachowaj istniejące adresy, metadane, schema, ustawienia Rank Math, treść polityki, lokalne akapity SEO i wszystkie fotografie realizacji (pliki, kolejność, ALT i podpisy). Nie regeneruj historycznych fixture, aby dopasować test do nowej implementacji.

Używaj potwierdzonego telefonu **794 225 139**, nie numeru 603 z makiety. Nie przepisuj z grafiki niepotwierdzonych godzin, gwarancji, doświadczenia, zakresu marek ani dodatkowych usług. Cennik i Porady to dwie nowe, merytoryczne strony; nie wpisuj wymyślonych cen. Nawigacja główna odpowiada siedmiu pozycjom makiety, a Realizacje pozostają dostępne ze strony głównej i stopki.

Nowe obrazy `editorial-reference-*` są ilustracjami wygenerowanymi według kompozycji makiety. Model przy samochodzie nie jest przedstawiany jako Damian Cebula ani pracownik. Nie używaj ilustracji w Realizacjach. Dekoracyjny obrys miasta jest autorskim rysunkiem, nie fotografią Stalowej Woli. Pochodzenie: `assets/SOURCES.md`. Dawny plik `design/reference/makieta-uklad-strony-1-1.jpg` przedstawia poprzednią makietę. Nowy wzorzec jest dostępny w rozmowie, bez osobnego pliku źródłowego w repo; porównaj wizualnie widok 967 px, lecz nie deklaruj zweryfikowanej zgodności pixel-perfect ani wykonanego pixel-diff.

Edycja nowej górnej części home odbywa się przez **Dostosuj → DC — Strona główna: niebieska makieta**. Zapisane wcześniejsze grupy `home-hero`, `services`, `process` pozostają w bazie, a szablon zastępuje ich prezentację; lokalny tekst, SEO, realizacje, dodatkowe bloki i shortcode pozostają edytowalne w Gutenbergu. Moduł `inc/reference-pages.php` dodaje tylko brakujące Cennik i Porady po aktywacji lub uprawnionej wizycie w panelu. Nie nadpisuj istniejących ani świadomie przemianowanych/usuniętych stron.

Pracuj na osobnej gałęzi i weryfikuj wszystkie dziewięć stron na komputerze, tablecie i telefonie. Push do `main` jest wcześniej autoryzowany po testach; nie oznacza zgody na bezpośrednie wdrożenie na Hostinger, zmianę produkcyjnej bazy ani DNS. Bieżący zakres i edycja: `docs/REFERENCE_3_0.md` oraz `wp-content/themes/dc-serwis/UPDATE_3_0.md`. Raporty 2.0–2.1 pozostają historyczne.

## Historyczne doprecyzowanie — wersja 2.1, 2026-11-07

Najnowsze poprawki właściciela rozwijają Architectural Service: siedem odrębnych scen ilustracyjnych zamiast powtórzeń, stopka bez adresu i e-maila, dokładnie miedziane logo `#9C4F2C` i nowa ikona DC. Zmiany identyfikacji zastępują historyczne wymaganie zachowania wyglądu favicon z 2.0. Zachowaj oryginalne pliki i ustawienia WordPress; pozwól wybrać własną ikonę i oryginalną paletę logo. Dane adresowe, e-mail, metadane i treść prawna pozostają w Kontakcie/schema/polityce. Jedyną zamierzoną zmianą istniejących linków jest usunięcie e-maila ze stopki.

Kolejne doprecyzowanie właściciela wymaga niebieskich akcentów UI: `#255F8A` (działania i aktywna nawigacja), `#17476C` (hover), `#E5EDF4` (powierzchnie procesu, panelu AGD i formularza). Stosuj błękit także do mobilnego telefonu, numeracji, wybranych ikon i fokusu na jasnym tle. Miedź `--accent: #9C4F2C`, wyróżnienie H1, logo i ikona DC pozostają miedziane. Nie przemalowuj fotografii ani petrolowej stopki. Ta paleta UI ma pierwszeństwo przed historyczną szałwią akcentowanych powierzchni w bazie 2.0.

Wymagane autentyczne zdjęcie Stalowej Woli pozostaje do pozyskania, dopóki nie ma zweryfikowanego pliku i źródła. Nie podszywaj wygenerowanego obrazu pod zdjęcie miasta. Gotowe pola Dostosuj nie oznaczają zakończenia tego elementu; bez materiału nie pokazuj pustego placeholdera. Blokadę Wikimedia CONNECT 403 i potrzebę publikacji zapisanej konfiguracji sieci raportuj jawnie.

Pracuj na osobnej gałęzi. Właściciel dopuścił push do `main` po weryfikacji; nie jest to zgoda na bezpośrednie wdrożenie na Hostinger ani zmianę produkcyjnej bazy czy DNS. Bieżące instrukcje: `docs/UPDATE_2_1.md`; faktyczne wyniki: `docs/REFINEMENT_2_1_REPORT.md`. Raporty 2.0 pozostają historyczne. Nie dopasowuj baseline przez regenerację danych po zmianie.

## Historyczny kierunek Architectural Service — baza 2.0

Najnowsza prośba właściciela „PREMIUM WEBSITE REDESIGN — Architectural Service” zastępuje wcześniejszy wymóg ciemnej makiety 1:1. Obowiązuje jasna porcelana, petrol, szałwia i miedź, asymetryczna kompozycja, duża typografia i osobne układy wszystkich podstron. Szczegóły: `docs/ARCHITECTURAL_DESIGN.md` i `docs/UPDATE_2_0.md`. Nie przywracaj czarno-pomarańczowych kart, migawki, `clipPath`, pełnoekranowej przesłony ani animowania całego `main`.

Zachowaj wszystkie istniejące adresy, treści SEO, H1–H3, metadane, schema, Rank Math, politykę oraz fotografie realizacji (pliki, kolejność, ALT, podpisy). Nowe wnętrza mogą zastępować wyłącznie ilustracyjne zdjęcia usług. Przed zmianami zapisuj dane SEO; lokalny test nie zastępuje porównania rzeczywistej produkcji. Blokady dostępu raportuj jawnie.

Animuj tylko wybrane grupy poniżej pierwszego widoku: opacity 0→1, translateY 16→0, 500–750 ms, jednorazowo. Hero ma być widoczne od razu. Bez JavaScript i przy ograniczonym ruchu treść pozostaje widoczna. Zmiany koloru logo i ikony witryny opisuje bieżące doprecyzowanie 2.1 powyżej.

## Historyczne źródła projektu

Poniższa makieta i ciemny kierunek dokumentują początkową wersję; w kwestiach wyglądu pierwszeństwo ma powyższy brief 2.0.

1. Załączona przez właściciela makieta wizualna — **cel wierności 1:1** na desktopie.
2. `docs/DESIGN_SPEC.md` — rozpiska układu makiety, także wersja mobilna.
3. Zdjęcia właściciela `assets/photos/`; publiczne zdjęcia ze starej strony `assets/source-web/`.
4. Treści i dane kontaktowe potwierdzone na https://damiancebula-serwis.pl/ — `docs/CONTENT_AUDIT.md`.
5. `docs/LOCAL_SEO.md` — wymagania SEO / a11y / wydajność.
6. `CODEX_PROMPT.md` — kompletny zakres i kryteria odbioru.

## Nie negocjuj wymagań
- Nie twórz jednostronicowego landingu. To ma być pełnoprawna wielostronicowa witryna.
- Dla wersji 2.0 realizuj Architectural Service. Pierwotne proporcje ciemnej makiety są dokumentacją historyczną, bez deklaracji zgodności 1:1.
- Zachowaj nazwę **Damian Cebula**, tel. **794 225 139**, e-mail **kontakt@damiancebula-serwis.pl**, domenę **damiancebula-serwis.pl**.
- Pracuj w technologii WordPress (samodzielny natywny motyw PHP + Gutenberg), bez przerabiania na SPA.
- Dwie osobne podstrony usług i ich unikalna treść: **Serwis klimatyzacji Stalowa Wola** i **Serwis AGD Stalowa Wola**.
- Nie wymyślaj adresu firmy, godzin otwarcia, ocen, certyfikatów, gwarancji, zakresu marek, świadectw F-gaz, doświadczenia ani lokalizacji zdjęć.
- Nie używaj zewnętrznych ilustracji z cudzego motywu bez potwierdzonej licencji. Nie kopiuj obecnego motywu Coolair; pobierz wyłącznie własne treści/obrazy i przygotuj autorski motyw.
- Nie podmieniaj produkcyjnej strony, nie ingeruj w bazę produkcyjną ani nie kasuj obecnych treści.
- Nie powielaj meta tagów i JSON-LD, jeśli wybrana wtyczka SEO już je generuje.
- Zadbaj o formularz z walidacją, antyspamem i bezpieczną obsługą; linki tel:/mailto: mają działać.

## Oczekiwane rezultaty
Motyw `wp-content/themes/dc-serwis/`, instrukcja instalacji, zip gotowy do `Wygląd → Motywy`, screenshoty testowe 1440px/768px/390px, raport porównania z poprzednią wersją, testy, ochronę SEO i pomiary wydajności. Pracuj na gałęzi i otwórz PR. Nie zgłaszaj ukończenia bez uruchomienia i sprawdzenia.
