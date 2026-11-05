# Instrukcje dla Codexa — damiancebula-seriws

## Źródła prawdy, priorytet
1. Załączona przez właściciela makieta wizualna — **cel wierności 1:1** na desktopie.
2. `docs/DESIGN_SPEC.md` — rozpiska układu makiety, także wersja mobilna.
3. Zdjęcia właściciela `assets/photos/`; publiczne zdjęcia ze starej strony `assets/source-web/`.
4. Treści i dane kontaktowe potwierdzone na https://damiancebula-serwis.pl/ — `docs/CONTENT_AUDIT.md`.
5. `docs/LOCAL_SEO.md` — wymagania SEO / a11y / wydajność.
6. `CODEX_PROMPT.md` — kompletny zakres i kryteria odbioru.

## Nie negocjuj wymagań
- Nie twórz jednostronicowego landingu. To ma być pełnoprawna wielostronicowa witryna.
- Odtwórz wizualnie makietę: ciemna kolorystyka, akcent pomarańczowy, geometria ściętych krawędzi, hero z mocnym hasłem, dwa szerokie boksy usług i konkretny układ sekcji.
- Zachowaj nazwę **Damian Cebula**, tel. **794 225 139**, e-mail **kontakt@damiancebula-serwis.pl**, domenę **damiancebula-serwis.pl**.
- Pracuj w technologii WordPress (samodzielny natywny motyw PHP + Gutenberg), bez przerabiania na SPA.
- Dwie osobne podstrony usług i ich unikalna treść: **Serwis klimatyzacji Stalowa Wola** i **Serwis AGD Stalowa Wola**.
- Nie wymyślaj adresu firmy, godzin otwarcia, ocen, certyfikatów, gwarancji, zakresu marek, świadectw F-gaz, doświadczenia ani lokalizacji zdjęć.
- Nie używaj zewnętrznych ilustracji z cudzego motywu bez potwierdzonej licencji. Nie kopiuj obecnego motywu Coolair; pobierz wyłącznie własne treści/obrazy i przygotuj autorski motyw.
- Nie podmieniaj produkcyjnej strony, nie ingeruj w bazę produkcyjną ani nie kasuj obecnych treści.
- Nie powielaj meta tagów i JSON-LD, jeśli wybrana wtyczka SEO już je generuje.
- Zadbaj o formularz z walidacją, antyspamem i bezpieczną obsługą; linki tel:/mailto: mają działać.

## Oczekiwane rezultaty
Motyw `wp-content/themes/dc-serwis/`, instrukcja instalacji, zip gotowy do `Wygląd → Motywy`, screenshoty testowe 1440px/768px/390px, raport porównania z makietą, testy i plan migracji/SEO. Pracuj na gałęzi i otwórz PR. Nie zgłaszaj ukończenia bez uruchomienia i sprawdzenia.
