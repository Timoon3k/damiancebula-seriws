# Aktualizacja 3.0 — niebieska makieta

Wersja **3.0.0** wprowadza granatowo-błękitny wygląd według głównej strony po lewej stronie nowej makiety właściciela. Obejmuje nowe logo ze śnieżynką, favicon, hero z ukośnym zdjęciem, wspólny panel dwóch usług, sekcję korzyści i lokalny tekst SEO. Prawa kolumna wariantów z planszy nie jest częścią witryny. Prawdziwe realizacje pozostają zachowane.

Telefon nadal wynosi **794 225 139**. Nie przepisano niepotwierdzonych godzin, gwarancji i doświadczenia z grafiki. Fotografie hero i modela przy samochodzie są ilustracyjne; nie dokumentują prac ani pracowników Damiana Cebuli. Miasto reprezentuje dekoracyjny obrys, nie wygenerowane zdjęcie podpisane jako Stalowa Wola.

## Aktualizacja odrębnej witryny

1. Przygotuj backup plików i bazy nowej witryny oraz jej odrębny staging. Nie zastępuj starej strony i jej bazy. Staging pozostaw `noindex`.
2. Wgraj paczkę **3.0.0** z katalogiem `dc-serwis/` przez **Wygląd → Motywy → Dodaj → Wyślij motyw**, zastępując pliki tego motywu na stagingu. Zachowaj wtyczki, ustawienia i istniejące strony. Nie trzeba ponownie wstawiać wzorców, aby zobaczyć nowy układ.
3. Odwiedź panel jako administrator. Moduł 3.0 doda tylko brakujące strony **Cennik** i **Porady**. Istniejących treści, metadanych i statusów nie nadpisuje. Cennik wyjaśnia sposób wyceny bez wpisywania fikcyjnych cen. W razie wcześniejszych stron o tych adresach sprawdź ich treść; automatyzacja zachowuje zastane strony.
4. Wyczyść cache WordPress/LiteSpeed, Hostinger i przeglądarki, również wygenerowane CSS i optymalizację obrazów.
5. W **Dostosuj → DC — Strona główna: niebieska makieta** ustaw H1, wprowadzenie, oba panele usług, korzyści i zdjęcia. W **Tożsamość witryny** wybierz domyślny niebieski znak lub własne logo; zapisane własne obrazy nie są usuwane. Możesz także wybrać własną ikonę WordPress.
6. Opcjonalnie przypisz menu do lokalizacji **Nawigacja główna — niebieska makieta**. Bez własnego przypisania działa menu siedmiu pozycji z referencji. Realizacje pozostają dostępne z home i stopki. Zapisane stare menu nie jest kasowane.
7. Sprawdź **DC — Dane firmy** oraz **DC — Google: mapa i opinie**. Mapa w Kontakcie ładuje się bez przycisku zgody. Zachowaj poprawny link/iframe Google. Trustindex wymaga aktywnej wtyczki i shortcode rzeczywistej wizytówki; bez nich sekcja opinii jest ukryta.
8. Obejrzyj wszystkie dziewięć stron na komputerze, tablecie i telefonie. Sprawdź pełne kadry realizacji, menu z prawej, klawiaturę, Wstecz/Dalej, ograniczony ruch i zwykłe linki bez JS. Formularz nadal wymaga checkboxa i wysyła do **kontakt@damiancebula-serwis.pl**; rzeczywiste doręczenie potwierdź przez skonfigurowany SMTP.
9. Porównaj istniejące adresy, title, description, canonical, robots, OG/Twitter, schema i ustawienia Rank Math z kopią sprzed aktualizacji. Target usług w Stalowej Woli pozostaje ten sam. Cennik i Porady otrzymują własne SEO przy utworzeniu. Motyw nie zgłasza indeksacji do Google i nie zmienia konfiguracji Search Console.

## Gdzie edytować treści

Górną część nowego home edytujesz w Dostosuj. Teksty SEO, lokalny opis, realizacje, dodatkowe bloki i shortcode opinii nadal edytujesz w Gutenbergu. Zapisane starsze grupy `home-hero`, `services`, `process` pozostają w bazie, ale nowy szablon zastępuje ich prezentację. Panel informacyjny w edycji strony głównej wskazuje właściwe miejsce zmiany treści.

Pozostałe podstrony, w tym Cennik i Porady, są natywnymi blokami WordPress. Polityka prywatności zachowuje treść i adres. Nie zmieniaj ustawień Rank Math tylko z powodu nowej palety.

Układ 967 px można porównać wizualnie z planszą w rozmowie. Nowy plik źródłowy makiety nie jest częścią repozytorium; dawny JPG dotyczy wcześniejszej wersji. Nie jest deklarowana potwierdzona zgodność pixel-perfect. Zakres, pochodzenie obrazów i zasady kontroli opisuje `docs/REFERENCE_3_0.md` w repozytorium.

Paczka nie zawiera produkcyjnej bazy, sekretów ani konfiguracji domeny. Aktualizacja kodu i push do `main` nie instalują jej na Hostinger. Bezpośrednie wdrożenie oraz przepięcie domeny pozostają osobnymi działaniami.
