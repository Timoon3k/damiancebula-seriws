# DC Serwis 3.0 — instalacja i edycja

Wersja **3.0.0** realizuje nową granatowo-błękitną makietę właściciela: znak ze śnieżynką, ukośne hero, dwa panele usług, korzyści i lokalny tekst SEO. Wzorzec stanowi główna strona po lewej stronie planszy; kolumna wariantów nie jest treścią witryny. Zachowane są mapa Google, Trustindex, formularz, target SEO i prawdziwe realizacje. [Instrukcja aktualizacji 3.0](UPDATE_3_0.md) ma pierwszeństwo przed historycznymi opisami 1.2–2.1 niżej.

Górną część home edytujesz w **Dostosuj → DC — Strona główna: niebieska makieta**. Dodatkowe lokalne akapity SEO, realizacje i shortcode opinii pozostają w Gutenbergu. Nowe sceny są ilustracyjne; model nie jest identyfikowany jako Damian Cebula ani pracownik. Obrys miasta jest dekoracją, nie fotografią Stalowej Woli. Nowy plik źródłowy planszy nie jest dołączony do repo; nie deklaruje się potwierdzonej zgodności pixel-perfect.

Natywny motyw WordPress 6.6+, PHP 8.2+. Bez bundlera i bibliotek frontendowych. Krój Manrope jest dołączony lokalnie: dwa pliki WOFF2 z polskimi znakami, bez żądań do zewnętrznych serwisów fontów. Środowisko dotychczasowych testów lokalnych: WordPress 7.1.4 / PHP 8.3.36 / MariaDB 11.4; wyniki bieżącej wersji opisuje raport w repozytorium. Interfejs jest po polsku; pakiet językowy panelu WordPress instaluje administrator niezależnie od motywu.

## Instalacja na stagingu

1. Wykonaj pełny backup plików i bazy istniejącej witryny. Utwórz odrębną kopię stagingową. Zachowaj aktywne wtyczki i treść `/polityka-prywatnosci/`.
2. Wgraj `dc-serwis.zip` przez Wygląd → Motywy → Dodaj → Wyślij motyw. Aktywuj na stagingu. Na nowej instalacji aktywacja tworzy strony, zdjęcia i menu; istniejąca witryna jest chroniona przed automatycznym nadpisaniem.
3. Na nowej oddzielnej instalacji aktywacja tworzy sześć podstawowych stron i osobną politykę prywatności, importuje fotografie do Mediów i ustawia stronę główną. Moduł 3.0 dodaje jeszcze brakujące Cennik i Porady po aktywacji lub uprawnionej wizycie w panelu. Istniejących stron nie nadpisuje. Wynik podstawowego importera i ponowna synchronizacja: Wygląd → DC — synchronizacja. Na istniejącej witrynie kolizje zatrzymują podstawowy import, bez nadpisywania treści. Nie instaluj do starej bazy, którą chcesz zachować.
4. Ustawienia → Czytanie: ustaw statyczną stronę główną. Ustawienia → Bezpośrednie odnośniki: nazwa wpisu. Zachowaj istniejący URL polityki prywatności i jej treść. Motyw wyświetla standardowe strony przez `the_content()`.
5. Wygląd → Menu: opcjonalnie przypisz własne menu do „Nawigacja główna — niebieska makieta”; bez przypisania działa wbudowane menu siedmiu pozycji z referencji. Realizacje są dostępne z home i stopki. Zapisane stare menu nie jest kasowane. Wygląd → Dostosuj → Tożsamość witryny pozwala wybrać domyślny znak lub własne logo i ikonę WordPress.
6. Uzupełnij pola „DC — tytuł i opis SEO” w edycji każdej strony lub skonfiguruj jedną wtyczkę SEO. Motyw wyłącza własne metadata i schema po wykryciu Yoast, Rank Math, AIOSEO, SEOPress lub The SEO Framework. Dla innej wtyczki ustaw filtr `dc_external_seo` na true. Sprawdź wynikowy HTML po integracji.
7. Sprawdź formularz na stagingu z przechwytywaniem poczty. Przed produkcją skonfiguruj transport `wp_mail` / SMTP, nadawcę i SPF/DKIM/DMARC. Komunikat sukcesu oznacza przyjęcie przez transport, nie potwierdzone dostarczenie do skrzynki.
8. Przejdź checklistę migracji i testy. Dopiero po akceptacji wykonaj osobne wdrożenie. Repozytorium nie zawiera danych produkcyjnego WordPressa ani jego bazy.

| Wzorzec | URL |
|---|---|
| Strona główna | `/` (strona statyczna) |
| Serwis klimatyzacji | `/serwis-klimatyzacji-stalowa-wola/` |
| Serwis AGD | `/serwis-agd-stalowa-wola/` |
| Realizacje | `/realizacje/` |
| O firmie | `/o-firmie/` |
| Cennik | `/cennik/` |
| Porady | `/porady/` |
| Kontakt | `/kontakt/` |
| Polityka prywatności | `/polityka-prywatnosci/` |

## Edycja

Nagłówki, wprowadzenie, panele usług, lista korzyści i dwa zdjęcia nowego home mają pola w **Dostosuj → DC — Strona główna: niebieska makieta**. Zapisane wcześniejsze grupy `home-hero`, `services`, `process` pozostają w bazie, a szablon zastępuje ich prezentację. Informuje o tym panel w edycji strony głównej.

Lokalny opis, teksty SEO, realizacje, dodatkowe bloki i shortcode opinii na home oraz treść wszystkich podstron są natywnymi blokami Gutenberga, bez edycji PHP. Zachowaj jedno H1 i klasy sekcji podczas zmian. Fotografie można wybrać z biblioteki mediów; WordPress tworzy ich srcset. Domyślne zdjęcia motywu również mają warianty responsywne. Synchronizacja podstawowych stron zachowuje wykryte własne edycje, a moduł Cennik/Porady wyłącznie tworzy brakujące strony. Istniejące treści i SEO tych dwóch stron nie są później automatycznie przepisywane.

## Mapa i opinie Google

Wygląd → Dostosuj → „DC — Google: mapa i opinie”:

- Mapa działa bez klucza API. Puste pole używa potwierdzonego adresu z sekcji DC — Dane firmy. Możesz wkleić pełny kod iframe z Google Maps → Udostępnij → Umieść mapę albo pełny link Google. Skrócony link maps.app.goo.gl trzeba najpierw otworzyć i skopiować kod osadzenia. Przełącznik „Pokaż mapę Google w Kontakcie” pozwala ją wyłączyć. Iframe jest osadzony bezpośrednio w Kontakcie i ładuje się automatycznie, bez przycisku zgody, także przez AJAX i bez JavaScript. Tekstowy adres i link „Otwórz w Google Maps” pozostają dostępne przy blokadzie treści zewnętrznych. Wzorzec Kontakt używa `[dc_google_map]`.
- Opinie: zainstaluj i skonfiguruj oficjalny widget Trustindex dla rzeczywistej wizytówki. Wklej jego `[trustindex ...]` w pole shortcode. Wzorce Kontakt i Strona główna zawierają `[dc_google_reviews]`. Bez shortcode lub aktywnej wtyczki sekcja nie jest wyświetlana. Motyw nie dopisuje ocen, recenzji ani `aggregateRating`. Shortcode opinii pozostaje do samodzielnego uzupełnienia przez właściciela.
- Polityka motywu opisuje automatyczne połączenie z Google Maps i przekazywanie danych technicznych. Uaktualnij również własny dokument, jeśli zastępuje politykę motywu. Przed aktywacją widgetu opinii zweryfikuj opis jego technologii i wymagany mechanizm zgód dla faktycznej konfiguracji.

## Formularz

Wstaw `[dc_contact]`. Wymagane: imię, e-mail, wiadomość i checkbox zgody na przetwarzanie danych w celu odpowiedzi, z odnośnikiem do polityki prywatności. Telefon opcjonalny. Walidacja serwera, nonce, honeypot, limit trzech prób wysyłki na pięć minut, stały odbiorca i temat, escapowanie wyjścia. Dane nie trafiają do zewnętrznego API. Wiadomości są przekazywane do `wp_mail`; transport określa konfiguracja WordPressa. Motyw nie przechowuje treści zgłoszeń w bazie. Limit przechowuje czasowo skrót HMAC adresu IP i licznik; uwzględnij go w polityce oraz sprawdź prawidłowe REMOTE_ADDR za reverse proxy. Bez JS działa standardowy POST z przekierowaniem i komunikatem; z JS odpowiedź AJAX z zachowaniem treści przy błędzie.

## AJAX i animacje

Nawigacja progresywnie pobiera pełny HTML WordPressa, wymienia treść, tytuł, metadata, schema i stan menu. Obsługuje Wstecz, fokus i komunikaty czytnika ekranu. Awaria pobrania uruchamia zwykłą nawigację. Obce strony, panel, pliki, linki `tel:` i `mailto:` działają standardowo. Całe `main` i hero pozostają widoczne, bez View Transitions, masek i przygaszania. Wybrane grupy poniżej pierwszego widoku pojawiają się tylko raz przez opacity i przesunięcie o 16 px w 620 ms; `prefers-reduced-motion` i brak JavaScript pozostawiają treść bez animacji. Strony zawierające widget opinii przechodzą na pełne ładowanie, aby umożliwić poprawną inicjalizację skryptów wtyczki. Formularz AJAX działa niezależnie.

## Źródła grafiki

Fotografie Realizacji: materiały właściciela z `assets/photos/` i istniejącej strony z `assets/source-web/`. Nowe obrazy home 3.0 to `editorial-reference-hero-*` i `editorial-reference-technician-*` (WebP 480/960/1536). Powstały przez image generation według kompozycji nowej referencji. Model jest postacią ilustracyjną, nie przedstawicielem firmy, a źródłowy samochód jest niebrandowany; znak nakłada osobny element strony. Fotografie są oznaczone jako ilustracyjne i nie trafiają do Realizacji. Dekoracyjny obrys miasta nie jest zdjęciem Stalowej Woli. Wcześniejsze ilustracje i pliki identyfikacji pozostają zachowane w paczce. Szczegółowe pochodzenie opisuje `assets/SOURCES.md` w repozytorium.

Wersja 1.6 zachowuje wszystkie istniejące pliki fotografii i dodaje lokalny krój **Manrope**, wagi 200–800, podzbiory `latin` i `latin-ext` (łącznie około 40 KB). Źródło: `@fontsource-variable/manrope` 5.3.0; licencja SIL OFL 1.1 jest dołączona w `assets/fonts/OFL-Manrope.txt`. Szczegóły: `docs/FONTS.md` w repozytorium.

Pełne zasady automatycznej instalacji, bezpiecznej synchronizacji i przepięcia domeny: `docs/AUTOMATIC_SETUP.md` w repozytorium.

## Wersja 1.2: adres, mapa, polityka i nawigacja

Adres firmy edytujesz w **Wygląd → Dostosuj → DC — Dane firmy**. Wartości początkowe: Aleje Jana Pawła II 42, 37-450 Stalowa Wola. Z tego samego źródła korzystają kontakt, stopka, mapa i polityka. Na nowej instalacji importer dodaje politykę jako osobną stronę, bez siódmej pozycji głównego menu; istniejącej polityki ani ręcznych zmian nie nadpisuje.

Nagłówek ma nowe logo DC; eksporty PNG i ikonę witryny znajdziesz w `assets/branding/`. Sticky menu pojawia się po przewinięciu. Menu i kafle usług otwierają pełne podstrony; scrollspy został wyłączony w 1.3. Bez JavaScript i przy otwarciu w nowej karcie działają rzeczywiste URL podstron.

Konfigurację Rank Math i ponownego zgłaszania stron do Google opisuje `docs/RANK_MATH_SEO.md` w repozytorium. Aktualizacja kodu nie zgłasza automatycznie indeksacji ani nie zmienia konfiguracji kont Google.

## Wersja 1.3

Scrollspy jest wyłączony; sticky menu i zwykłe podstrony pozostają. Widoczne animacje AJAX i wejścia są wspólne dla desktopu/mobile. Galerie pokazują całe zdjęcia. Logo pełne wgrywaj przez Tożsamość witryny; nie zostanie zmniejszone do samej ikony. Jasny wariant w paczce: `assets/branding/dc-lockup-light.png`; tryb kontrastu jest edytowalny. Formularz wysyła do kontakt@damiancebula-serwis.pl; sprawdź SMTP zgodnie z `docs/MAIL_DELIVERY.md`.

## Wersja 1.4

Nagłówek pobiera oryginalny plik logo bez miniatur responsywnych. Wcześniejsze małe przycięcia WordPressa korzystają z powiązanego oryginału, gdy jest dostępny w bibliotece; świadome wycięcie samego symbolu z pełnego logotypu pozostaje zachowane. Nowe logo wgrywaj w pełnej rozdzielczości i pomiń przycinanie. Gdy oryginał został usunięty, prześlij go ponownie lub usuń własny wybór, aby użyć domyślnego SVG. Mapa jest bezpośrednio osadzona w Kontakcie, bez przycisku zgody. Po aktualizacji wyczyść cache hostingu, WordPressa i przeglądarki. Własne ustawienia i ręcznie edytowane strony pozostają zachowane.

## Wersja 1.5

Mobilne menu wysuwa się z prawej jako panel modalny. Przejścia AJAX działają na telefonach i komputerach; przewijanie odsłania tekst efektem migawki, a dekoracyjne podkreślenia są uproszczone. Ograniczenie ruchu wyłącza animacje i pozostawia całą treść widoczną. Zachowane są ostre logo, automatyczna mapa w Kontakcie oraz odbiorca formularza **kontakt@damiancebula-serwis.pl**.

Zainstaluj ZIP 1.5.0 przez **Wygląd → Motywy → Dodaj → Wyślij motyw** wyłącznie w nowej, oddzielnej instancji WordPress, zastępując tam pliki motywu. Wyczyść cache i sprawdź menu, klawiaturę, Wstecz, przejścia oraz wariant ograniczonego ruchu. Aktualizacja nie zmienia starej witryny, bazy ani domeny; wgranie na Hostinger wykonuje się osobno. Szczegóły: `docs/UPDATE_1_5.md` w repozytorium.

## Wersja 1.6

Przestronny wygląd w czerni, graficie i pomarańczu: duża fotografia w hero, otwarte sekcje usług, spokojniejszy proces obsługi oraz nowe układy tekstów, galerii, FAQ i formularza. Na telefonie mini-galeria strony głównej przewija się w poziomie bez dodatkowej biblioteki. Treści SEO, H1–H3, adresy, metadane, schema i pliki zdjęć pozostają zachowane. Nadal działają drawer, AJAX, migawka tekstu, ograniczenie ruchu, ostre logo i automatyczna mapa w Kontakcie. Formularz kieruje wiadomości na **kontakt@damiancebula-serwis.pl**, a stopka wskazuje **majewskitomasz.pl**.

Wgraj ZIP **1.6.0** wyłącznie do nowej, oddzielnej instancji WordPress i zastąp tam pliki motywu. Wyczyść cache WordPress/LiteSpeed, Hostinger i przeglądarki; sprawdź wszystkie podstrony oraz widoki mobilne. Nie trzeba ponownie wstawiać wzorców ani wpisywać tekstów SEO. Stara strona, jej baza i przypisanie domeny pozostają bez zmian. Push do `main` nie instaluje paczki na Hostinger. Instrukcja: `docs/UPDATE_1_6.md`; założenia wyglądu: `docs/PREMIUM_DESIGN.md` w repozytorium.

## Wersja 2.0

Architectural Service zastępuje ciemne powierzchnie porcelaną, petrolem i szałwią. Nowe fotografie wnętrz są ilustracjami; fotografie realizacji pozostają w niezmienionej kolejności, z oryginalnymi ALT, podpisami i pełnym lightboxem. Galerie na telefonie korzystają z pionowej, nieregularnej kompozycji. Logo zachowuje znak DC, z wariantem kolorystycznym dla jasnego nagłówka; favicon pozostaje bez zmian.

Migawka tekstu, pełnoekranowy wipe i przygaszanie `main` są usunięte. Hero jest widoczne natychmiast, a dyskretna animacja niższych grup działa tylko raz. Zachowano pełne adresy stron, teksty SEO, H1–H3, metadata, schema, Rank Math, prawną treść polityki i mechanizmy formularza, mapy oraz opinii. Aktualizacja nie przepisuje bazy. Szczegóły instalacji i sprawdzenia: [UPDATE_2_0.md](UPDATE_2_0.md).

## Wersja 2.1

Siedem miejsc ilustracyjnych ma siedem różnych scen; prawdziwe zdjęcia realizacji pozostają zachowane. Stopka udostępnia telefon, Kontakt, nawigację, politykę i `majewskitomasz.pl`; adres i e-mail są nadal w Kontakcie, polityce i schema. Formularz kieruje wiadomości do `kontakt@damiancebula-serwis.pl`.

Niebieski `#255F8A` akcentuje główne przyciski, mobilny telefon, nawigację, numerację i wybrane ikony; hover to `#17476C`, a jasne powierzchnie procesu, panelu AGD i formularza — `#E5EDF4`. Miedź logo i wyróżnienia hero oraz kolory zdjęć i petrolowej stopki pozostają zachowane.

W **Dostosuj → Tożsamość witryny** można wybrać miedź `#9C4F2C` albo oryginalne kolory logo oraz miedzianą ikonę DC albo własną ikonę WordPress. Korzystaj z ostrego pliku źródłowego; miedziany wariant własnego logo wymaga przezroczystego tła. Zapisane ustawienia i oryginalne pliki pozostają zachowane.

W **Dostosuj → DC — Lokalność i zdjęcie miasta** wybiera się autentyczne zdjęcie, autora i link źródłowy. W paczce nie ma jeszcze zweryfikowanej fotografii Stalowej Woli; pobranie z Wikimedia blokuje proxy środowiska. Brak zdjęcia nie tworzy pustej ramki i nie jest uznawany za zakończenie tej części prośby. Pełne ustawienia i ograniczenia: [UPDATE_2_1.md](UPDATE_2_1.md).
