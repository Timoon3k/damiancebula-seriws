# DC Serwis 3.0 — niebieska makieta

Nowy projekt odwzorowuje główną kompozycję po lewej stronie planszy przekazanej przez właściciela w rozmowie: granatowy pasek kontaktowy i nawigację, hero z ukośnym błękitnym podziałem, dwa wspólne panele usług, sekcję „Dlaczego warto”, pas informacji o obsłudze i lokalny tekst SEO. Prawa kolumna planszy z propozycjami wariantów oraz notatkami nie jest częścią witryny.

## Zakres i porównanie

Paleta to granat `#07182B`, błękit `#08A9EF`, biel oraz ciemniejszy błękit działań `#0878BB`, zapewniający kontrast z białym tekstem. Wektorowy znak łączy koło zębate i śnieżynkę; nazwę firmy renderuje tekst HTML. Nowe favicon mają eksporty 32, 180, 192 i 512 px. Dawne pliki logo, przesłane obrazy i zapisane ustawienia pozostają zachowane; w Dostosuj można wybrać własne logo oraz własną ikonę WordPress.

Układ desktopowy jest porównywany z lewym obszarem referencji o szerokości około 967 px. Przy ≤800 px nawigacja przechodzi w panel modalny wysuwany z prawej, a hero, usługi i sekcja korzyści dostają układ pionowy. Fotografie realizacji zachowują pełny kadr i podgląd lightbox.

Nowa plansza jest dostępna jako obraz w rozmowie, bez osobnego pliku źródłowego w repozytorium. `design/reference/makieta-uklad-strony-1-1.jpg` przedstawia historyczną, czarno-pomarańczową makietę. Nie jest źródłem porównania 3.0. Widok `docs/visual/reference/after/home-reference-967.png` służy do oceny kompozycji nowej planszy; bez jej pliku źródłowego nie wykonuje się wiarygodnego pixel-diff ani nie deklaruje potwierdzonej zgodności pixel-perfect.

Zamierzone różnice wobec grafiki:

- telefon **794 225 139**, zgodny z potwierdzonymi danymi firmy;
- termin wizyty ustalany indywidualnie zamiast niepotwierdzonych godzin otwarcia;
- korzyści opisujące diagnozę, zakres prac i wycenę, bez wymyślonych gwarancji, lat doświadczenia czy obsługi wszystkich marek;
- nowe ilustracyjne obrazy odtwarzające temat i kompozycję, zamiast powiększania małych fragmentów planszy;
- zachowana sekcja prawdziwych realizacji poniżej głównej kompozycji oraz istniejące akapity SEO.

## Strony i SEO

Istniejące siedem adresów pozostaje bez zmian. Do nawigacji z makiety dodano dwie odrębne strony z treścią edytowalną w Gutenbergu:

| Strona | Adres | Rola |
|---|---|---|
| Strona główna | `/` | Lokalny serwis klimatyzacji i AGD, wejścia do usług |
| Serwis klimatyzacji | `/serwis-klimatyzacji-stalowa-wola/` | Serwis, montaż, czyszczenie i naprawa klimatyzacji |
| Serwis AGD | `/serwis-agd-stalowa-wola/` | Naprawa pralek, zmywarek i lodówek |
| Realizacje | `/realizacje/` | Autentyczne prace właściciela, linki z home i stopki |
| O firmie | `/o-firmie/` | Potwierdzony opis lokalnej firmy |
| Cennik | `/cennik/` | Sposób indywidualnej wyceny i czynniki kosztowe, bez fikcyjnych cen |
| Porady | `/porady/` | Przygotowanie zgłoszenia i bezpieczna eksploatacja urządzeń |
| Kontakt | `/kontakt/` | Telefon, e-mail, adres, formularz, mapa i opinie |
| Polityka prywatności | `/polityka-prywatnosci/` | Zachowana treść i adres dokumentu |

Target pozostaje ten sam: **Serwis klimatyzacji Stalowa Wola**, **Serwis AGD Stalowa Wola**, **Montaż klimatyzacji Stalowa Wola**, **Naprawa klimatyzacji Stalowa Wola**, **Naprawa pralek i zmywarek Stalowa Wola**. Nowy H1 home brzmi „Profesjonalny serwis klimatyzacji i AGD w Stalowej Woli”. Istniejące metadane, canonical, OG/Twitter, schema i konfiguracja Rank Math nie są resetowane. Nowe strony otrzymują własne tytuły, opisy i frazy analityczne podczas tworzenia. Motyw nie zgłasza automatycznie indeksacji do Google.

## Edycja i synchronizacja

**Wygląd → Dostosuj → DC — Strona główna: niebieska makieta** udostępnia trzy wiersze H1, wprowadzenie, tytuły i opisy obu paneli usług, nagłówek korzyści, listę punktów oraz dwa zdjęcia. Własne obrazy wybiera się z Biblioteki mediów; ALT można uzupełnić w bibliotece. Dodatkowy panel w edycji strony głównej wyjaśnia podział edycji.

Teksty SEO, lokalny opis, galeria, dodatkowe bloki i `[dc_google_reviews]` pozostają w Gutenbergu. Zapisane wcześniej grupy `home-hero`, `services` i `process` pozostają w bazie dla zachowania danych; nowy szablon zastępuje ich prezentację. Zmiana ich treści w edytorze nie zmienia nowej górnej kompozycji — służą do tego pola Dostosuj. Sekcję `text-section` szablon umieszcza obok dekoracyjnego obrysu miasta, bez przepisywania jej akapitów.

`inc/reference-pages.php` dodaje brakujące Cennik i Porady po aktywacji lub pierwszej wizycie w panelu przez użytkownika z uprawnieniami do zarządzania motywem i publikowania stron. Wersja synchronizacji zapobiega powtarzaniu automatycznego importu. Istniejące strony, statusy, metadane i treści nie są nadpisywane; świadomie przemianowane lub przeniesione do kosza strony tego modułu nie są tworzone ponownie. Moduł nie zmienia strony głównej, permalinków ani zapisanych menu. Bez przypisanego nowego menu działa wbudowana nawigacja; brakujące lub nieopublikowane strony dodatkowe nie tworzą martwych linków.

Opcjonalne uruchomienie na izolowanej instalacji przez administratora technicznego:

```sh
wp eval 'echo wp_json_encode(dc_reference_sync_pages(), JSON_PRETTY_PRINT);'
```

## Integracje i obrazy

Mapa korzysta z istniejącego `[dc_google_map]` i ustawień **DC — Google: mapa i opinie**. W Kontakcie osadza się bezpośrednio, bez przycisku zgody. Własny link lub iframe Google można zachować; przy pustym polu używany jest adres z **DC — Dane firmy**. Trustindex korzysta z dotychczasowego shortcode i aktywnej wtyczki. Bez konfiguracji nie pojawiają się fikcyjne opinie ani oceny.

Formularz nadal wymaga danych zgłoszenia i checkboxa przetwarzania danych, kieruje wiadomość do **kontakt@damiancebula-serwis.pl** i zachowuje obsługę AJAX oraz zwykłego POST. Adres i e-mail pozostają w Kontakcie, polityce i schema; stopka zachowuje telefon, nawigację, politykę oraz podpis **majewskitomasz.pl**.

Dwie nowe sceny `editorial-reference-*` są wygenerowanymi ilustracjami. Model przy samochodzie nie jest identyfikowany jako właściciel lub pracownik. Logo na samochodzie nakłada osobny element strony. Dekoracyjny obrys miasta jest autorskim rysunkiem, nie zdjęciem Stalowej Woli. Materiały te nie trafiają do Realizacji. Pochodzenie i pliki źródłowe opisuje [SOURCES.md](../assets/SOURCES.md).

## Weryfikacja i instalacja

Zakres kontroli obejmuje dziewięć stron, widoki desktop/tablet/mobile, dostępność, menu modalne, historię AJAX, ograniczony ruch, wariant bez JS, formularz, mapę, galerie, ochronę SEO i niezmienność 29 oryginalnych plików fotografii. `tests/reference-preservation.cjs` korzysta z niezmienianego historycznego fixture; nowe H1, prezentacja home i reorganizacja nawigacji są jawnymi zmianami zakresu. Wyniki muszą pochodzić z rzeczywistych uruchomień, a nie z samej tej specyfikacji.

`scripts/capture-reference.cjs` zapisuje 27 pełnych zrzutów dziewięciu stron przy 1440/768/390 px oraz widok 967 px. [Interaktywne porównanie](visual/reference/index.html) pozwala wybrać stronę, szerokość i widok obu wersji albo pojedynczego kadru. Porównania z wersją 2.1 korzystają z 21 istniejących zrzutów `docs/visual/refinement/after/`; nowe Cennik i Porady nie mają poprzedników. Mapa na lokalnych zrzutach jest wyraźnie oznaczoną atrapą testową, ponieważ zewnętrzne połączenie z Google jest blokowane w tym środowisku. Nie jest to potwierdzenie działania produkcyjnego widgetu ani dostarczenia poczty.

Instalację na odrębnym stagingu opisuje [UPDATE_3_0.md](../wp-content/themes/dc-serwis/UPDATE_3_0.md). Ta przebudowa nie obejmuje bezpośredniego wdrożenia na Hostinger, zmiany DNS ani produkcyjnej bazy. Push do `main` i instalacja motywu to odrębne działania.
