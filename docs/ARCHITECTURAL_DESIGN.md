# Architectural Service — wersja 2.0

Ten kierunek wynika z najnowszego briefu właściciela i zastępuje wcześniejsze wymaganie ciemnej makiety 1:1. Punktem wyjścia kodu jest wersja 1.6.0 (`c007e40`). Zmiana powstaje na `design/architectural-service`, do przeglądu przez PR, bez bezpośredniej publikacji.

## System wizualny

| Rola | Kolor |
|---|---|
| Porcelanowe tło | `#F7F6F2` |
| Jasna powierzchnia | `#FFFEFB` |
| Petrol i tekst | `#192E33` |
| Szałwia | `#DDE5E1` |
| Miedź dekoracyjna | `#CC7446` |
| Ciemniejszy akcent tekstu i fokusu | `#9C4F2C` |

Manrope pozostaje lokalny, z polskimi znakami, zmiennymi wagami i licencją SIL OFL. Typografia ma płynną skalę; kompozycja korzysta z otwartych powierzchni, oddechu i asymetrii. Logo zachowuje geometrię DC, a nowy lockup ma kolorystykę dostosowaną do jasnego nagłówka. Ikona witryny pozostaje bez zmian.

`assets/site.css` zawiera fundamenty, wspólne elementy i stronę główną; `assets/pages.css` — osobne układy podstron. `branding.css`, `navigation.css` i `motion.css` odpowiadają za swoje komponenty. Dawne warstwy `premium.css` i `premium-pages.css` zostały usunięte. Nie należy dopisywać kolejnych plików z nadpisaniami starego designu.

## Kompozycje

- Strona główna: natychmiast widoczne, asymetryczne hero z jednym CTA, fotograficzna Klimatyzacja, przesunięty moduł AGD na szałwii, cztery etapy w technicznej sekwencji, lokalność i nieregularna mini-galeria, pełne treści SEO oraz petrolowa stopka.
- Klimatyzacja: portretowa fotografia obok nagłówka, układ zdjęciowy, zakres usług i FAQ z zachowanymi treściami lokalnymi.
- AGD: szerokie otwarcie tekstowe i przesunięta fotografia; inna kolejność i proporcje sekcji niż w Klimatyzacji.
- Realizacje: nieregularna siatka zachowująca porządek DOM i oryginalną kolejność zdjęć. Całe kadry są widoczne przez `object-fit: contain`, a lightbox otwiera pełne obrazy.
- O firmie: oszczędna prezentacja specjalisty i danych, bez dopisywania historii, liczb ani uprawnień.
- Kontakt: dane i mapa obok formularza na spokojnej szałwiowej powierzchni; działające odnośniki i widoczny checkbox prywatności.
- Polityka: poprawiona szerokość tekstu, odstępy i czytelność, bez zmian treści prawnej.

## Fotografie i edycja

Nowe ilustracyjne wnętrza `editorial-architecture-living-*` i `editorial-architecture-laundry-*` nie przedstawiają prac właściciela. Mają warianty WebP 480/960/1536 i opisujące ilustrację ALT. Nie trafiają do galerii realizacji. Źródła i rozmiary: [SOURCES.md](../assets/SOURCES.md).

`inc/architectural.php` mapuje podczas renderowania wyłącznie znane, domyślne pliki ilustracyjne wcześniejszego motywu na nowe wnętrza. Obsługuje również nazwy z sufiksem importera. Nie zapisuje bloków, dat modyfikacji, danych SEO ani ustawień do bazy. Własne zdjęcie o innej nazwie, wybrane w Gutenbergu, pozostaje własnym zdjęciem. Edytor może nadal pokazywać zapisany wcześniejszy podgląd domyślnego obrazka; ostateczną kompozycję sprawdzaj w podglądzie strony.

Prawdziwe zdjęcia realizacji nie są podmieniane, retuszowane ani reorganizowane. Zachowane są pliki, odnośniki, ALT i podpisy. Galeria na telefonie układa się w pionową kompozycję zamiast wcześniejszego poziomego przewijania.

## Ruch i nawigacja

Usunięto migawkę tekstu, maski, wipe i przygaszanie widoku. `main` i hero nie są animowane. Wybrane grupy poniżej pierwszego widoku korzystają z IntersectionObserver i jednorazowego przejścia opacity 0→1 oraz translateY 16→0 w 620 ms, z easingiem `cubic-bezier(.22,1,.36,1)`. Stagger dotyczy jedynie elementów powiązanych i jest ograniczony do 90 ms. Treści w pierwszym widoku nie są ukrywane; powtórne przewijanie nie uruchamia odsłonięcia ponownie. Ograniczenie ruchu, brak JavaScript i wejście fokusu pozostawiają treść widoczną.

AJAX zachowuje pełne adresy WordPress, tytuł, canonical, robots, OG/Twitter, schema, historię i fokus. Bieżąca strona pozostaje widoczna podczas pobierania następnej. Podstrony z zewnętrznym widgetem opinii korzystają z pełnego ładowania dla inicjalizacji wtyczki. Mobilny dialog wysuwa się z prawej, blokuje tło i przywraca fokus. Scrollspy pozostaje wyłączony.

## Ochrona danych i kontrola

Zachowane są wszystkie adresy, H1–H3, treści lokalne, polityka prywatności, metadane, schema, ustawienia SEO oraz dotychczasowe linkowanie. Dodatki to jeden przycisk kontaktu w hero i nawigacja w stopce. Mechanizmy formularza, mapy i Trustindex pozostają. Formularz kieruje wiadomości do `kontakt@damiancebula-serwis.pl`, a podpis projektu to `majewskitomasz.pl`.

Test `tests/architectural-seo.cjs` porównuje siedem lokalnych stron z bazą utworzoną z surowego HTML zapisanego przed zmianami, a także sumy SHA256 29 chronionych plików. Wyłącza z porównania wyłącznie dwa wskazane dodatki nawigacyjne. Nie wolno regenerować wzorca z aktualnej strony tylko po to, by zaakceptować regresję. Wymagane porównanie produkcyjne jest osobnym etapem; jego status i ograniczenia dokumentuje [raport ochrony SEO](SEO_PROTECTION_REPORT.md).

Dowody końcowe znajdują się w [raporcie testów](TEST_REPORT.md), [porównaniu wizualnym](VISUAL_COMPARISON.md) i [raporcie wydajności](PERFORMANCE_REPORT.md). Cele LCP/CLS/INP nie są gwarancją wyników na dowolnym hostingu; pomiar laboratoryjny nie zastępuje danych rzeczywistych użytkowników.
