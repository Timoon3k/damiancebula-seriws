# Rank Math SEO i odświeżenie wyników Google

Instrukcja dotyczy nowej witryny WordPress z motywem `dc-serwis`. Konfigurację wykonuje właściciel w swoim panelu. Nie potwierdza ona połączenia z kontem Google, zgłoszenia adresów ani indeksacji. Nazwy opcji zależą od wersji i języka Rank Math.

## 1. Przygotowanie i kreator Rank Math

1. Zainstaluj **Rank Math SEO** z oficjalnego katalogu WordPress i uruchom kreator konfiguracji. Jedna wtyczka SEO powinna odpowiadać za metadane, canonical, mapę XML i dane strukturalne. Jeśli na nowej instalacji działa inna wtyczka SEO, najpierw zabezpiecz jej ustawienia i użyj importu Rank Math; nie pozostawiaj obu aktywnych.
2. Wybierz tryb zaawansowany. Witryna reprezentuje firmę świadczącą usługi, więc wybierz firmę/organizację, a nie osobisty blog. Podaj nazwę **Damian Cebula — Serwis Klimatyzacji i AGD**. Docelowy URL to `https://damiancebula-serwis.pl/`.
3. Jako logo organizacji wgraj do Biblioteki mediów plik motywu `assets/branding/dc-icon.png` (512 × 512 px). Ten PNG nadaje się także na ikonę witryny w ustawieniach WordPress. Nie trzeba włączać przesyłania dowolnych SVG. Dla domyślnej grafiki społecznościowej wybierz odpowiednio szeroki obraz ze strony lub z realizacji firmy, do którego masz prawa.
4. Możesz pominąć połączenie konta Rank Math i Google w kreatorze; nie jest ono warunkiem działania metatagów ani XML sitemap. Search Console da się skonfigurować bezpośrednio według punktu 5.
5. Nie włączaj automatycznego dodawania `nofollow` do wszystkich linków zewnętrznych. Zachowaj naturalne linki do profilu firmy, informacji o prywatności i autora projektu.

Motyw przekazuje do Rank Math dotychczasowe wartości **DC — tytuł i opis SEO**, dopóki konkretna strona nie ma własnego tytułu/opisu zapisanego w Rank Math. Ręcznie zapisane wartości Rank Math mają pierwszeństwo, także szablony z `%title%`. Nie dochodzi do przepisywania bazy ani nadpisywania edycji właściciela. Gdy Rank Math jest aktywny, motyw nie emituje drugiego canonical, zestawu tagów społecznościowych ani grafu JSON-LD. Rank Math wykorzystuje te same wartości zapasowe także dla domyślnych tytułów i opisów Open Graph przez własne API; jawnie zapisane pola społecznościowe wtyczki zachowują pierwszeństwo. Po zmianie wtyczki wyczyść pamięć podręczną i sprawdź źródło HTML strony; poszczególne wtyczki społecznościowe mogą mieć własne ustawienia.

## 2. Firma, lokalne SEO i schematy

Włącz moduł **Local SEO / Lokalne SEO** w Rank Math i uzupełnij zakładkę lokalną w **Tytuły i meta**:

| Pole | Potwierdzona wartość |
|---|---|
| Firma | Damian Cebula — Serwis Klimatyzacji i AGD |
| Ulica i numer | Aleje Jana Pawła II 42 |
| Kod i miejscowość | 37-450 Stalowa Wola |
| Kraj | Polska / PL |
| Telefon | +48 794 225 139 |
| E-mail | kontakt@damiancebula-serwis.pl |
| Obszar obsługi | Stalowa Wola i okolice |
| Witryna | https://damiancebula-serwis.pl/ |

Wybierz typ `HVACBusiness`, jeśli dostępny, lub właściwy `LocalBusiness`. Nie wpisuj adresu w pole obszaru obsługi: `areaServed` opisuje miejscowość, a `PostalAddress` adres firmy. Wtyczka powinna generować jeden spójny podmiot firmy, do którego odnoszą się pozostałe schematy. Zweryfikuj adres z profilem Google firmy przed publikacją; podany tu adres został potwierdzony przez właściciela, lecz nie sprawdzono wizytówki Google. Nie dodawaj niepotwierdzonych godzin otwarcia, NIP, współrzędnych ani ocen.

Pozostaw identyfikator mapy Google i adres profilu firmy puste, dopóki nie masz właściwych danych. Klucz API Google nie jest potrzebny do standardowego osadzenia mapy z funkcji Google „Udostępnij → Umieść mapę”. To osobna konfiguracja od SEO. Nie zastępuj profilu firmy linkiem do przypadkowego wyniku wyszukiwania.

Na obu stronach usług ustaw schemat **Service**, jeżeli edytor schematów używanej wersji Rank Math go udostępnia. Wpisz rzeczywistą nazwę usługi, firmę jako usługodawcę oraz obszar Stalowa Wola. Nie ustawiaj wymyślonej ceny, oceny ani adresu realizacji. Jeżeli nie masz tej funkcji, pozostaw schemat strony i poprawnie skonfigurowanej firmy; nie wklejaj drugiego grafu firmy do treści lub motywu. Włączone moduły i dostępność pól zależą od wersji wtyczki. Motyw przy aktywnym Rank Math oddaje mu odpowiedzialność za schematy.

Na usługach i zwykłych podstronach sprawdź także `BreadcrumbList`. Widoczna nawigacja okruszkowa oraz dane strukturalne powinny opisywać tę samą ścieżkę. Nie dodawaj `aggregateRating` tylko dlatego, że witryna wyświetla widget opinii; własna firma nie uzyskuje przez to uprawnienia do gwiazdek w wynikach Google.

## 3. Ustawienia sześciu stron

Otwórz **Strony → Edytuj → Rank Math → Edytuj fragment**. Ustaw poniższe tytuły/opisy i sprawdź podgląd. Słowo kluczowe w Rank Math pomaga w analizie treści; samo wpisanie go nie jest sygnałem rankingowym ani obietnicą pozycji. Nie zmieniaj widocznych nagłówków tylko po to, aby uzyskać komplet zielonych punktów.

| Adres | Główna fraza | Tytuł SEO |
|---|---|---|
| `/` | serwis klimatyzacji i AGD Stalowa Wola | Serwis klimatyzacji i AGD Stalowa Wola — Damian Cebula |
| `/serwis-klimatyzacji-stalowa-wola/` | serwis klimatyzacji Stalowa Wola | Serwis klimatyzacji Stalowa Wola — Damian Cebula |
| `/serwis-agd-stalowa-wola/` | serwis AGD Stalowa Wola | Serwis AGD Stalowa Wola — naprawa pralek i zmywarek |
| `/realizacje/` | realizacje montażu klimatyzacji | Realizacje montażu klimatyzacji — Damian Cebula |
| `/o-firmie/` | Damian Cebula serwis | Damian Cebula — lokalny serwis AGD i klimatyzacji |
| `/kontakt/` | kontakt Damian Cebula Stalowa Wola | Kontakt — Damian Cebula, serwis w Stalowej Woli |

Proponowane unikalne opisy:

- **Główna:** Montaż, serwis i naprawa klimatyzacji oraz naprawa pralek, lodówek i zmywarek w Stalowej Woli. Damian Cebula — zadzwoń i omów zgłoszenie: 794 225 139.
- **Klimatyzacja:** Montaż, naprawa, czyszczenie i konserwacja klimatyzacji w Stalowej Woli. Serwis dla domów, mieszkań i biur. Omów zakres prac z Damianem Cebulą.
- **AGD:** Naprawa pralek, zmywarek i lodówek w Stalowej Woli. Zgłoś objawy, ustal diagnozę i zakres serwisu AGD. Damian Cebula — telefon 794 225 139.
- **Realizacje:** Zobacz autentyczne zdjęcia montażu i serwisu klimatyzacji przekazane przez Damiana Cebulę. Jednostki wewnętrzne, zewnętrzne i instalacje.
- **O firmie:** Damian Cebula — montaż i serwis klimatyzacji oraz naprawa AGD w Stalowej Woli i okolicach. Poznaj zakres usług i sposób zgłoszenia usterki.
- **Kontakt:** Zgłoś naprawę AGD, serwis lub montaż klimatyzacji w Stalowej Woli. Damian Cebula: 794 225 139, kontakt@damiancebula-serwis.pl. Formularz kontaktowy.

Na stronie klimatyzacji wspieraj naturalnie frazy „montaż klimatyzacji Stalowa Wola” i „naprawa klimatyzacji Stalowa Wola”, a na AGD „naprawa pralek i zmywarek Stalowa Wola”. Nie kopiuj tych samych akapitów na inne podstrony i nie twórz pustych stron dla kolejnych miejscowości. Realizacje pokazują prace klienta, a opisy ALT opisują widoczny obraz bez dopisywania niepotwierdzonej lokalizacji.

Dla tych sześciu docelowych stron ustaw **index, follow** dopiero po uruchomieniu finalnej witryny. Canonical pozostaw automatyczny, prowadzący do własnego adresu każdej strony. Nie ustawiaj wszystkim stronom canonical na stronę główną. W ustawieniach społecznościowych sprawdź tytuł, opis i obraz; własne pola Facebook/X w Rank Math mogą mieć pierwszeństwo przed standardowym fragmentem SEO.

## 4. Mapa witryny, archiwa i indeksowanie

W **Rank Math → Ustawienia mapy witryny** włącz mapę XML oraz publiczne strony i obrazy. Dla obecnej witryny wystarczą strony; wpisy, kategorie i inne typy dodaj do mapy dopiero, gdy zawierają rzeczywiste materiały przeznaczone do wyszukiwania. Sprawdź `https://damiancebula-serwis.pl/sitemap_index.xml` i plik mapy stron, do którego prowadzi indeks. Przy aktywnym Rank Math korzystaj z jego mapy, zamiast zgłaszać jednocześnie niezależną mapę motywu lub WordPress.

- Usuń z mapy wersje demonstracyjne, koszyk/testowe strony techniczne i strony z `noindex`.
- Przekieruj strony załączników do właściwego pliku lub strony nadrzędnej zgodnie z opcjami wtyczki; nie indeksuj pustych stron załączników.
- Ustaw `noindex` dla wewnętrznych wyników wyszukiwania. Wyłącz lub ustaw `noindex` dla nieużywanych archiwów autora, dat, tagów i kategorii, które nie mają własnej wartościowej treści.
- Zachowaj dotychczasową politykę prywatności i jej URL. Nie nadpisuj istniejącego dokumentu przy synchronizacji. Jeżeli nowa instalacja nie ma dotychczasowej polityki, uzupełnij i sprawdź jej treść przed publikacją. Polityka nie jest stroną ofertową; można wyłączyć ją z mapy i ustawić `noindex, follow`, pozostawiając dostępny link w stopce i formularzu.

Oddzielna witryna pod adresem technicznym Hostinger powinna pozostać zablokowana przed indeksacją, najlepiej również zabezpieczona dostępem. W WordPress użyj **Ustawienia → Czytanie → Proś wyszukiwarki o nieindeksowanie tej witryny** na kopii roboczej. Sam `noindex` nie jest kontrolą dostępu. Nie blokuj robotom odczytu strony w `robots.txt`, oczekując jednocześnie, że odczytają jej `noindex`.

Przy przełączeniu domeny na nową instalację zdejmij tę opcję **wyłącznie na finalnej witrynie**. Sprawdź odpowiedzi HTTP 200, HTTPS, brak `noindex` w HTML i nagłówkach `X-Robots-Tag`, prawidłowy canonical oraz dostępną mapę XML. Wyczyść cache WordPress/Hostinger po zmianach. Jeżeli stare adresy usług się zmieniają, przygotuj przekierowania 301 ze starych adresów na odpowiadające im nowe strony; nie kieruj wszystkich starych URL na stronę główną.

## 5. Search Console: odświeżenie wyników wyszukiwania Google

1. W [Google Search Console](https://search.google.com/search-console) dodaj usługę **Domena** `damiancebula-serwis.pl`, jeśli nie ma jej już na właściwym koncie. Dla istniejącej usługi zachowaj uprawnienia i weryfikację. Nie zgłaszaj adresu technicznego jako docelowej domeny firmy.
2. Jeśli potrzebna jest weryfikacja, skopiuj **własny** rekord TXT z Search Console. W Hostinger otwórz zarządzanie DNS domeny i dodaj go w strefie, która rzeczywiście obsługuje DNS. Zachowaj dotychczasowe rekordy TXT, MX, SPF, DKIM, DMARC i rekordy weryfikacyjne; nie podmieniaj całej strefy. Przy zewnętrznych serwerach nazw rekord dodaje się u ich operatora.
3. Po publikacji finalnej strony otwórz w Search Console **Mapy witryn** i zgłoś `https://damiancebula-serwis.pl/sitemap_index.xml`. Sprawdź komunikat o odczycie i wykryte adresy. Jeżeli mapa już jest zgłoszona pod tym URL, sprawdź jej aktualną treść i stan odczytu zamiast tworzyć drugi wpis.
4. Użyj **Sprawdzenia adresu URL** dla sześciu adresów z tabeli. Wykonaj test opublikowanego URL; jeżeli strona jest dostępna dla Google i przeznaczona do indeksowania, wybierz **Poproś o zindeksowanie**. Zgłoszenie jest prośbą o ponowne pobranie, nie potwierdzeniem indeksacji.
5. Sprawdź raport indeksowania: wykluczenia `noindex`, alternatywne canonical, przekierowania, 404 i błędy serwera. Po zebraniu danych obserwuj w **Skuteczność** zapytania usługowe i strony docelowe, także na urządzeniach mobilnych.

**Ta sama domena, nowa instalacja lub hosting:** nie używaj narzędzia „Zmiana adresu” Search Console. Przy pozostaniu na `damiancebula-serwis.pl` aktualizujesz zawartość, sitemap i ewentualne przekierowania ścieżek. Narzędzie zmiany adresu służy przeprowadzce na inną domenę.

Wyniki Google nie aktualizują się natychmiast. Google sam wybiera termin pobrania, indeksację, tytuł i fragment opisu; może pokazać fragment inny niż zapisany w Rank Math. Nie ma gwarancji terminu, pozycji ani gwiazdek. Aktualizacja logo lub favicon także wymaga ponownego pobrania. Nie używaj narzędzia usuwania URL tylko po to, by odświeżyć stary opis firmy.

Jeżeli przez „wyszukiwania witryny” rozumiesz wyszukiwarkę wewnętrzną WordPress, szuka ona w opublikowanych treściach, a nie w polach fraz Rank Math. Tytuły stron, opisy usług i odnośniki powinny odpowiadać temu, co użytkownik faktycznie znajdzie. Stron wyników wewnętrznej wyszukiwarki nie zgłaszaj do Google.

## 6. Kontrola po konfiguracji

Sprawdź wszystkie sześć stron na finalnej domenie: jeden tytuł HTML, jeden opis meta, jeden canonical, poprawny obraz społecznościowy, linki i telefon. Przetestuj dane strukturalne w [Rich Results Test](https://search.google.com/test/rich-results) i [Schema Markup Validator](https://validator.schema.org/). Poprawny schemat nie oznacza gwarancji specjalnego wyglądu wyniku. Weryfikację indeksacji wykonaj w Search Console, a szybkość w PageSpeed Insights; nie deklaruj wyników na podstawie samej instalacji wtyczki.

Lokalny test integracji dla programisty: `wp eval-file /ścieżka/do/repo/tests/rank-math.php`. Test wykorzystuje filtry metadanych i obiekt zapytania w pamięci; nie zapisuje ustawień ani treści. Gdy Rank Math nie jest zainstalowany, symuluje jego stałą i filtry, więc nie zastępuje kontroli HTML z rzeczywiście aktywną wtyczką.

## Dokumentacja źródłowa

- [Rank Math: kreator konfiguracji](https://rankmath.com/kb/how-to-setup/), [Tytuły i meta](https://rankmath.com/kb/titles-and-meta/), [Lokalne SEO](https://rankmath.com/kb/local-seo/), [XML sitemap](https://rankmath.com/kb/configure-sitemaps/), [filtry i API](https://rankmath.com/kb/filters-hooks-api-developer/).
- Zweryfikowany kod oficjalnego repozytorium Rank Math: [filtry frontend/title i frontend/description](https://github.com/rankmath/seo-by-rank-math/blob/master/includes/frontend/paper/class-paper.php) oraz [Open Graph: domyślny tytuł i opis korzystają z Paper](https://github.com/rankmath/seo-by-rank-math/blob/master/includes/opengraph/class-opengraph.php). Gałąź `master` jest zmienna; po aktualizacji wtyczki należy sprawdzić wynikowy HTML.
- [Google: weryfikacja własności](https://support.google.com/webmasters/answer/9008080), [mapy witryny](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [prośba o ponowne zindeksowanie](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
- [Google: tytuły wyników](https://developers.google.com/search/docs/appearance/title-link), [opisy wyników](https://developers.google.com/search/docs/appearance/snippet), [migracja ze zmianą URL](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [dane firmy lokalnej](https://developers.google.com/search/docs/appearance/structured-data/local-business).
