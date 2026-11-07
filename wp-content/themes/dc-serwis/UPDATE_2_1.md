# Aktualizacja DC Serwis 2.1.0

7 listopada 2026 r. Wersja 2.1 rozwija jasny Architectural Service. Siedem ilustracyjnych miejsc na stronie głównej, Klimatyzacji i AGD korzysta z siedmiu różnych scen. Nowe ujęcia obejmują detal klimatyzatora, osobne wnętrze z jednostką, filtry, kuchnię ze zmywarką i detal pralki. Są ilustracjami; zdjęcia realizacji, ich kolejność, ALT, podpisy i lightbox pozostają zachowane.

Stopka ma uporządkowany telefon, przycisk kontaktu, podpis firmy, sześć linków i dolny pasek prawny z `majewskitomasz.pl`. Nie wyświetla adresu ani e-maila. Dane te nadal są w Kontakcie, polityce prywatności i schema; odbiorcą formularza pozostaje `kontakt@damiancebula-serwis.pl`.

Logo w nagłówku otrzymuje dokładny miedziany akcent `#9C4F2C` zgodny z tekstem hero. Zachowano oryginalne źródło i rozdzielczość. Nowa miedziana ikona DC zastępuje domyślny wygląd ikony przeglądarki, a dawny plik wskazywany przez schema pozostaje dostępny. Ustawienia zapisane w WordPress nie są kasowane ani przepisywane.

Najnowsze doprecyzowanie dodaje **niebieskie akcenty interfejsu**: `#255F8A` dla głównych działań i nawigacji, `#17476C` przy najechaniu oraz `#E5EDF4` na spokojnych powierzchniach procesu, panelu AGD i formularza. Niebieski obejmuje również mobilny telefon, numerację i wybrane ikony oraz fokus na jasnym tle. Miedź logo, tekstu hero i ikony DC pozostaje `#9C4F2C`; fotografie i petrolowa stopka zachowują swoje kolory.

## Aktualizacja i ustawienia

1. Wykonaj backup plików i bazy. Wgraj ZIP 2.1.0 z katalogiem `dc-serwis/` na odrębny staging nowej strony. Zachowaj wtyczki, zapisane treści i ustawienia SEO. Nie instaluj do starej witryny, którą chcesz zachować.
2. Wyczyść cache WordPress/LiteSpeed, Hostinger i przeglądarki, także obrazy, CSS i favicon. Nie trzeba ponownie wstawiać wzorców.
3. W **Wygląd → Dostosuj → Tożsamość witryny** ustaw „Kolor logo w nagłówku”: miedź motywu lub oryginalne kolory. Do miedzianego wariantu własnego logo używaj pełnego pliku z przezroczystym tłem. Przy zdjęciu/JPEG bez przezroczystości wybierz oryginalną paletę. Samo powiększenie małego pliku nie doda ostrości.
4. W „Ikona witryny” wybierz miedziany znak DC albo własną ikonę WordPress. Wcześniejsze ustawienie ikony pozostaje zapisane.
5. Sprawdź wszystkie strony na telefonie i komputerze: zdjęcia, niebieskie przyciski i fokus, miedziane logo, stopkę, menu, historię, klawiaturę, ograniczony ruch, galerie, formularz oraz mapę. Na stagingu zachowaj `noindex`. Faktyczne doręczenie poczty i działanie Google/Trustindex sprawdź na hostingu.

## Zdjęcie Stalowej Woli — element nadal do uzupełnienia

W tej paczce **nie ma jeszcze pozyskanej, zweryfikowanej fotografii Stalowej Woli**. Próba pobrania z Wikimedia Commons została zablokowana przez proxy środowiska (CONNECT 403). Nie użyto wygenerowanej fotografii jako rzekomego zdjęcia miasta.

Przygotowano **Dostosuj → DC — Lokalność i zdjęcie miasta**: wybór obrazu z Mediów, autor/podpis, link do źródła i przełącznik wyświetlania. ALT oraz podpis edytuje się w Bibliotece mediów. Wybierz autentyczny materiał z prawem publikacji i odpowiednim oznaczeniem źródła. Bez wybranego zdjęcia lub zweryfikowanego materiału dołączonego do motywu nie powstaje pusta ramka. Przygotowane pole nie oznacza wykonania prośby o rzeczywistą fotografię miasta.

Teksty SEO, nagłówki, adresy, metadata, schema, Rank Math i treść prawna pozostają zachowane. Ilustracje są podmieniane podczas renderowania znanych domyślnych bloków; edytor może pokazywać starszy zapisany podgląd, więc sprawdź widok strony. Paczka nie obejmuje bezpośredniego wdrożenia, zmiany domeny ani danych dostępowych. Faktyczne wyniki i ograniczenia opisuje `docs/REFINEMENT_2_1_REPORT.md` w repozytorium.
