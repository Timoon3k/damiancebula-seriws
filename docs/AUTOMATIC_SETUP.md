# Automatyczne strony, zdjęcia i menu — DC Serwis 1.4

## Nowa, oddzielna witryna

1. W Hostinger utwórz osobną instalację WordPress z własną bazą i adresem technicznym. Nie instaluj tej paczki do katalogu ani bazy starej strony.
2. Zainstaluj `dc-serwis.zip` i aktywuj motyw. Motyw tworzy sześć stron z kompletnymi treściami, SEO i szablonami oraz osobną politykę prywatności, importuje zdjęcia do biblioteki Mediów, tworzy menu i przypisuje stronę główną. Nie trzeba ręcznie wstawiać wzorców. Domyślne przykładowe treści WordPressa nie są kasowane bez sprawdzenia: raport przypomina o ich weryfikacji i usunięciu, jeżeli nie są potrzebne.
3. Wynik sprawdzisz w **Wygląd → DC — synchronizacja**. Możesz ponownie użyć przycisku „Synchronizuj strony i zdjęcia”. Dostęp wymaga uprawnień administratora; żądanie jest chronione nonce. Alternatywnie: `wp dc sync` w katalogu nowej instalacji.
4. Ustaw widoczność dla wyszukiwarek na nieindeksowalną na domenie technicznej. Import zachowuje ustawienie indeksacji, zamiast zgadywać gotowość publikacji. Skonfiguruj pocztę i sprawdź wszystkie strony. Nowa polityka powstaje automatycznie; jeżeli wskazano już rzeczywisty opublikowany dokument, zostaje on zachowany i wymaga przeglądu zamiast nadpisania.

Automatyczna instalacja zatrzyma się przy kolizji z istniejącą stroną lub własną stroną główną. Nie przejmuje cudzych treści. Stara witryna pozostaje w oddzielnej instalacji, do późniejszego odłączenia od domeny.

## Aktualizacje i synchronizacja

- Strony i pliki mają trwałe identyfikatory, więc ponowne uruchomienie nie tworzy duplikatów.
- Zmiany wzorców i zdjęć są wykrywane przy wejściu administratora do panelu; treść niezmieniona ręcznie jest aktualizowana automatycznie. Brakujące zarządzane strony są odtwarzane przy synchronizacji.
- Ręcznie zmieniona treść, SEO, tytuł, slug lub szablon powodują zachowanie strony i informację w raporcie. Importer nie wymusza powrotu do tekstu motywu. Aby korzystać z edytowalnych stron, ich zawartość pozostaje w zwykłych blokach Gutenberga.
- Zdjęcia importują się do Mediów z opisami ALT i responsywnymi rozmiarami WordPressa. Zmiana pliku źródłowego aktualizuje zarządzany obraz bez tworzenia kolejnej pozycji biblioteki. Import nie usuwa archiwalnych plików użytkownika.
- Ustawienia Google Maps, Trustindex, poczty, indeksacji i istniejącej polityki prywatności pozostają zachowane.
- To synchronizacja plików zainstalowanego motywu z tą jedną bazą WordPress. Sam push do GitHuba nie wgrywa motywu na hosting — automatyczny deploy wymaga oddzielnego połączenia z Hostinger.

## Fotografie

Zdjęcia klienta z przekazanego pliku i źródeł starej witryny są używane wyłącznie w galeriach Realizacji (również mini-galeriach). Hero, kafle i zdjęcia opisujące usługi to pięć oryginalnych fotografii ilustracyjnych wygenerowanych w stylistyce makiety. Nie przedstawiają rzeczywistych prac klienta, nie zawierają jego logo i nie są kopiami zdjęć wyciętymi z makiety. Pochodzenie opisuje `assets/SOURCES.md`.

## Przepięcie domeny

Po gotowości nowej instalacji domenę `damiancebula-serwis.pl` można przypisać do niej, zachowując starą bazę i pliki. Przy zmianie ustawień adresu WordPressa importer przelicza zarządzane odnośniki i URL zdjęć; nie pozostawia adresu technicznego w wygenerowanych stronach. Ręczne treści zachowuje, aktualizując tylko znane adresy tej samej instalacji. Nie jest to narzędzie do modyfikacji DNS ani przenoszenia baz między serwerami.

Przed publicznym przełączeniem sprawdź SSL, canonical, mapę witryny, formularz i rzeczywistą politykę prywatności; dopiero wtedy włącz indeksację. Nie używaj starego lokalnego `seed-local-wordpress.php` do inicjalizacji na hostingu.

## Dane firmy, mapa i polityka

Adres jest edytowalny w Wygląd → Dostosuj → DC — Dane firmy. Początkowo używany jest potwierdzony adres Aleje Jana Pawła II 42, 37-450 Stalowa Wola. Ten sam adres jest widoczny w kontakcie, stopce, polityce i domyślnej mapie. Własny link Google można podać w sekcji DC — Google: mapa i opinie.

Od wersji 1.4 mapa jest osadzona bezpośrednio w Kontakcie i ładuje się automatycznie, również po przejściu przez menu AJAX i bez JavaScript. Nie trzeba klikać przycisku zgody. Przełącznik „Pokaż mapę Google w Kontakcie” pozwala administratorowi wyłączyć osadzenie; puste pole adresu mapy używa danych firmy. Przy blokadzie zewnętrznych ramek pozostaje tekstowy adres i odnośnik do Google Maps.

Polityka jest osobną stroną pod `/polityka-prywatnosci/` i nie staje się siódmą pozycją głównego menu. Strona wskazana jako polityka w WordPressie i ręczne edycje są zachowywane. Dokument obejmuje faktyczne funkcje motywu, formularz, mapę i opcjonalne opinie; po włączeniu analityki, innej poczty lub nowych wtyczek trzeba go odpowiednio zaktualizować.

Zarządzana polityka bez własnych zmian zostanie zsynchronizowana z opisem automatycznego połączenia z Google Maps. Własny istniejący dokument wymaga samodzielnego uaktualnienia: mapa przesyła dane techniczne do Google już podczas jej ładowania, bez dodatkowego kliknięcia odwiedzającego.

Nowy znak DC jest w `assets/branding/`, a twórca projektu w stopce to majewskitomasz.pl. Sticky menu działa bez powielania nagłówka; scrollspy został wyłączony. Menu otwiera podstrony przez AJAX. Konfigurację Rank Math i ponownej indeksacji opisuje `RANK_MATH_SEO.md`.
