# Założenia wyglądu premium — wersja 1.6

Nowa prośba właściciela zmienia kierunek wizualny: witryna ma być spokojniejsza i bardziej luksusowa, przy zachowaniu czerni, grafitu i pomarańczowego akcentu. Wersja 1.6 jest autorskim rozwinięciem pierwotnej makiety. Makieta pozostaje dokumentacją wcześniejszej kompozycji; nie deklarujemy zgodności nowego układu 1:1 z tą referencją.

## Kompozycja i typografia

Duża fotografia i wyraźny nagłówek prowadzą pierwszy widok. Sekcje usług mają oddzielne zdjęcie, tytuł, opis i odnośnik, z mniejszą liczbą obramowań i dekoracji. Proces obsługi ma większe odstępy, a teksty na szerokich ekranach otrzymują dwukolumnowy układ. Kolumny składają się w czytelny pionowy układ na telefonach. Formularz, FAQ, dłuższe treści, polityka i galerie korzystają z tej samej skali typograficznej i spokojnych powierzchni grafitowych.

**Manrope** jest dostarczany lokalnie w dwóch podzbiorach WOFF2, z polskimi znakami i zmiennymi wagami 200–800. Łączny rozmiar wynosi 39 956 B. Font korzysta z `font-display: swap`, a zapasowy krój to Arial/Helvetica/sans-serif. Nie dodano zewnętrznych żądań fontów. Licencja, źródło i sposób dostarczania: [FONTS.md](FONTS.md).

## Zachowanie treści i fotografii

Redesign zmienia prezentację CSS oraz ustawienia i ładowanie fontów, z zachowaniem natywnych bloków WordPress. Nie przepisuje treści stron ani logiki formularza, mapy czy SEO. Zachowane pozostają:

- teksty SEO oraz treść i kolejność nagłówków H1–H3;
- adresy podstron, linki usług, tytuły SEO, opisy, canonical, robots i schema;
- zdjęcia rzeczywistych realizacji, ich odnośniki, opisy ALT i podpisy;
- wszystkie istniejące pliki fotografii, także ilustracyjne `editorial-*`;
- edytowalne dane firmy, polityka prywatności i ustawienia integracji.

Fotografie realizacji nadal pokazują cały kadr, a lightbox otwiera pełny obraz. Na telefonie mini-galeria strony głównej korzysta z natywnego poziomego przewijania CSS, bez dodatkowej biblioteki. Duże fotografie ilustracyjne w hero i sekcjach usług pozostają dotychczasowymi plikami; zmieniają się ich rozmiary i prezentacja w układzie. Źródła obrazów nadal opisuje [SOURCES.md](../assets/SOURCES.md).

## Interakcje i dostępność

Pozostają drawer z prawej strony, nawigacja AJAX na telefonach i komputerach, historia Wstecz oraz odsłanianie tekstu efektem migawki. Ustawienie ograniczonego ruchu pozostawia treść widoczną bez animowanych odsłonięć i przejść. Zwykłe odnośniki i treść działają bez JavaScript. Nie zmieniają się ostre logo, automatyczna mapa w Kontakcie, formularz z checkboxem prywatności i odbiorcą **kontakt@damiancebula-serwis.pl** ani podpis **majewskitomasz.pl** w stopce.

## Kontrola zachowania treści

Test `tests/premium-preservation.cjs` porównuje stan z zapisanym przed redesignem plikiem `tests/fixtures/premium-baseline.json`. Obejmuje siedem publicznych stron: główną, obie usługi, Realizacje, O firmie, Kontakt i politykę prywatności. Porównuje znormalizowany tekst, nagłówki, metadane, schema, linki usług oraz adresy, ALT i podpisy galerii. Dodatkowo porównuje sumy SHA256 **29 chronionych plików obrazów** realizacji i oryginałów. Nie należy ponownie zapisywać wzorca porównawczego tylko po to, aby zaakceptować różnice.

Ten zakres kontroli nie zastępuje oceny wyglądu ani testów dostępności i działania. Przed publikacją wymagają sprawdzenia widoki komputerowe, tablet i telefon, polskie znaki, kontrast, klawiatura, drawer, AJAX, migawka, ograniczony ruch, galerie, lightbox i formularz. Aktualny stan weryfikacji opisuje [raport testów](TEST_REPORT.md); dokument założeń nie stanowi potwierdzenia zakończenia tych testów.

Instalację ZIP 1.6.0 w nowej, oddzielnej witrynie opisuje [UPDATE_1_6.md](UPDATE_1_6.md). Sam push do `main` nie wdraża witryny na Hostinger ani nie zmienia starej bazy czy przypisania domeny.
