# Instrukcje dla Codexa — damiancebula-seriws

## Aktualny kierunek — wersja 2.0

Najnowsza prośba właściciela „PREMIUM WEBSITE REDESIGN — Architectural Service” zastępuje wcześniejszy wymóg ciemnej makiety 1:1. Obowiązuje jasna porcelana, petrol, szałwia i miedź, asymetryczna kompozycja, duża typografia i osobne układy wszystkich podstron. Szczegóły: `docs/ARCHITECTURAL_DESIGN.md` i `docs/UPDATE_2_0.md`. Nie przywracaj czarno-pomarańczowych kart, migawki, `clipPath`, pełnoekranowej przesłony ani animowania całego `main`.

Pracuj na gałęzi i przygotuj PR do `main`; bez merge i bez bezpośredniego wdrożenia produkcyjnego. Zachowaj wszystkie istniejące adresy, treści SEO, H1–H3, metadane, schema, Rank Math, politykę oraz fotografie realizacji (pliki, kolejność, ALT, podpisy). Nowe wnętrza mogą zastępować wyłącznie ilustracyjne zdjęcia usług. Przed zmianami zapisuj dane SEO; lokalny test nie zastępuje porównania rzeczywistej produkcji. Blokady dostępu raportuj jawnie.

Animuj tylko wybrane grupy poniżej pierwszego widoku: opacity 0→1, translateY 16→0, 500–750 ms, jednorazowo. Hero ma być widoczne od razu. Bez JavaScript i przy ograniczonym ruchu treść pozostaje widoczna. Favicon jest zachowany; logo DC może zmieniać kolor dla jasnego nagłówka.

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
