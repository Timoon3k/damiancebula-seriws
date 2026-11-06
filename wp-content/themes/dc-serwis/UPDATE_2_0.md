# Aktualizacja 2.0 — Architectural Service

Wersja **2.0.0** zmienia wygląd na jasny Architectural Service: porcelana, petrol, szałwia, miedź, duża typografia i asymetryczne kompozycje. Klimatyzacja, AGD, Realizacje, O firmie, Kontakt oraz polityka mają odrębnie opracowane układy. Logo DC jest dostosowane kolorystycznie do jasnego nagłówka, favicon pozostaje bez zmian.

Nowe fotografie wnętrz są ilustracyjne. Zastępują domyślne zdjęcia usług na etapie renderowania; nie zmieniają zapisanych bloków. Własne zdjęcia wybrane pod innymi nazwami pozostają zachowane. Zdjęcia realizacji, ich pliki, kolejność, ALT i podpisy pozostają bez zmian, z całym kadrem oraz lightboxem.

Usunięto migawkę tekstu, maski i przygaszanie całej strony. Hero jest widoczne natychmiast. Wybrane grupy niżej pojawiają się jeden raz, subtelnie, bez animowania całego `main`. Przy ograniczonym ruchu i bez JavaScript treść pozostaje widoczna. Zachowano mobilne menu z prawej, pełne URL, historię, fokus i aktualizację metadanych w AJAX.

Zachowane pozostają treści SEO, H1–H3, adresy, canonical, robots, OG/Twitter, schema, dane Rank Math i treść polityki prywatności. Motyw nie resetuje danych SEO ani nie przepisuje istniejących stron. Dodatki w prezentacji to przycisk kontaktu w hero i odnośniki w stopce. Nadal działają mapa w Kontakcie bez przycisku zgody, konfigurowalny shortcode opinii, formularz z checkboxem i odbiorcą **kontakt@damiancebula-serwis.pl**, a także podpis **majewskitomasz.pl**.

## Instalacja na odrębnym stagingu

1. Przygotuj odrębną kopię nowej witryny i pełny backup plików oraz bazy. Nie instaluj paczki do starej strony, którą chcesz zachować. Adres techniczny stagingu pozostaw `noindex`.
2. W **Wygląd → Motywy → Dodaj → Wyślij motyw** wgraj ZIP **2.0.0** z katalogiem `dc-serwis/` i potwierdź zastąpienie plików na stagingu. Zachowaj konfigurację i wtyczki. Nie trzeba ponownie wstawiać wzorców ani uruchamiać synchronizacji treści, aby uzyskać nowy wygląd.
3. Wyczyść cache WordPress/LiteSpeed, Hostinger i przeglądarki, także wygenerowane CSS i optymalizację obrazów. Sprawdź, czy nie jest serwowany stary `premium.css`.
4. W Dostosuj sprawdź adres firmy, źródło logo, mapę i shortcode opinii. Jeśli własne logo jest jasne, wybierz odpowiedni tryb kontrastu; najlepiej użyj oryginalnego pliku w pełnej rozdzielczości lub domyślnego wektora. Nie zmieniaj ustawień Rank Math ani wartości SEO tylko z powodu aktualizacji motywu.
5. Sprawdź wszystkie siedem stron na komputerze, tablecie i telefonie, także menu klawiaturą, Wstecz, ograniczony ruch, brak JavaScript, galerie, pełne zdjęcia, mapę i formularz. Przed publikacją potwierdź rzeczywiste doręczenie testowej wiadomości przez skonfigurowane SMTP.
6. Porównaj zrzut danych SEO produkcji i stagingu: tytuły, opisy, nagłówki, canonical, robots, OG/Twitter, schema, adresy i linki. Na stagingu zachowaj jego `noindex`; produkcyjne reguły indeksowania zmienia się dopiero w osobnym, zatwierdzonym wdrożeniu.

Paczka nie zawiera bazy WordPress, ustawień produkcji ani danych dostępowych. Nie zmienia przypisania domeny. Nowa instalacja nadal korzysta z automatycznego importera; ręcznie edytowane strony są chronione przy późniejszej synchronizacji.

## Status pracy

Zmiany są przygotowywane na `design/architectural-service` na bazie `main` `c007e40`. Ta aktualizacja nie obejmuje merge ani bezpośredniego wdrożenia na Hostinger. Dostęp środowiska do produkcji i API GitHuba był blokowany polityką proxy; zapisany projekt konfiguracji sieci wymaga publikacji, aby mógł zostać zastosowany. Nie jest to potwierdzenie wykonania porównania produkcyjnego ani utworzenia PR.

Bieżące wyniki testów, pomiary i ograniczenia znajdują się w raportach repozytorium: `docs/TEST_REPORT.md`, `docs/SEO_PROTECTION_REPORT.md`, `docs/PERFORMANCE_REPORT.md` i `docs/VISUAL_COMPARISON.md`. Niniejsza instrukcja opisuje instalację i zakres zmiany, a nie potwierdzenie jej publikacji.
