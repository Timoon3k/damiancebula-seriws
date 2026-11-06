# Logo, adres, stopka i nawigacja

## Edycja danych firmy

**Wygląd → Dostosuj → DC — Dane firmy** zawiera pola: ulica i numer, kod pocztowy, miejscowość. Początkowo wpisany jest potwierdzony adres: **Aleje Jana Pawła II 42, 37-450 Stalowa Wola**. Zmiana tych pól aktualizuje shortcode `[dc_business_address]`, kontakt, stopkę, politykę prywatności, domyślne zapytanie mapy i dane strukturalne motywu. Własne ustawienia Rank Math Local SEO należy uaktualnić również w tej wtyczce, aby zachować spójność danych.

## Mapa w Kontakcie

W **Wygląd → Dostosuj → DC — Google: mapa i opinie** pozostaw włączone „Pokaż mapę Google w Kontakcie”. Mapa jest osadzona bezpośrednio na podstronie Kontakt i ładuje się automatycznie, bez przycisku zgody, również po przejściu z menu AJAX oraz bez JavaScript. Puste pole mapy wskazuje adres z danych firmy. Możesz też wkleić pełny kod iframe z Google Maps → Udostępnij → Umieść mapę albo obsługiwany pełny link Google. Krótki link `maps.app.goo.gl` trzeba najpierw otworzyć i skopiować kod osadzenia.

Przeglądarka nawiązuje połączenie z Google przy ładowaniu mapy. Polityka prywatności motywu opisuje automatyczne osadzenie oraz przekazywane dane techniczne. Jeśli witryna ma własną politykę, uaktualnij jej opis mapy. Adres i odnośnik „Otwórz w Google Maps” pozostają dostępne także wtedy, gdy przeglądarka blokuje ramkę.

## Logo

Nowy znak DC używa pomarańczu i srebra oraz trzech linii przepływu powietrza. Domyślnie nagłówek pobiera wektor z `wp-content/themes/dc-serwis/assets/branding/dc-lockup-light.svg`. Pełne logo ma czytelne jasne napisy. Wgrany pełny logotyp jest wyświetlany szeroko, bez dublowania nazwy; osobny znak może nadal korzystać z podpisu HTML.

- Własne logo: **Wygląd → Dostosuj → Tożsamość witryny → Logo**.
- PNG do wgrania: `assets/branding/dc-lockup-light.png`.
- Ikona witryny / logo organizacji Rank Math: kwadratowy `assets/branding/dc-icon.png` (512×512).

Od wersji 1.4 nagłówek używa oryginalnego pliku, bez miniatur `srcset`. Jeżeli WordPress utworzył wcześniej przycięte logo 220 × 64 px, motyw odczytuje powiązany oryginał z biblioteki, bez zmiany wybranego logo w ustawieniach. Nowe przesyłanie ma elastyczny rozmiar i nie wymaga przycinania. Wgraj oryginalny PNG (najlepiej co najmniej 1180 px szerokości) i wybierz **Pomiń przycinanie**. Jeśli zachował się tylko mały raster, nie da się odzyskać brakujących szczegółów — prześlij ponownie oryginał albo usuń własny wybór, aby użyć domyślnego ostrego wektora. Przy dużych przezroczystych marginesach ważna jest rozdzielczość samego znaku i napisów, nie pustego tła.

Nie trzeba włączać przesyłania dowolnych SVG do WordPressa. Nowe domyślne logo nie nadpisuje własnego logo już wybranego przez administratora.

## Stopka

Podpis twórcy projektu jest widoczny jako **Projekt i wykonanie: majewskitomasz.pl** i prowadzi do `https://majewskitomasz.pl/`. Stopka zawiera też edytowalny adres firmy i odnośnik do strony wybranej w **Ustawienia → Prywatność**.

## Sticky menu i animacje

Scrollspy został wyłączony w wersji 1.3. Po przewinięciu nadal pojawia się sticky nagłówek. Wersja 1.5 dodaje mobilny panel menu wysuwany z prawej strony nad przyciemnionym tłem. Panel jest modalny: fokus pozostaje w jego obrębie, a zamknięcie przyciskiem, klawiszem Escape lub kliknięciem tła przywraca dostęp do strony. Wybranie podstrony zamyka menu przed przejściem. Bez JavaScript odnośniki pozostają dostępne jako zwykła nawigacja.

Przejścia AJAX obejmują telefony i komputery, również stronę główną. Tekst odsłania się przy przewijaniu jak migawka, z użyciem przycięcia zamiast krótkiego błysku całej sekcji. Ozdobne podkreślenia nagłówków są uproszczone. Ustawienie **Ogranicz ruch** w systemie lub przeglądarce wyłącza animowane odsłanianie i przejścia; treść pozostaje od razu czytelna. Bez obsługi efektów przeglądarka wyświetla zwykły tekst i odnośniki.

Aktualizację ZIP instaluj w nowej, oddzielnej witrynie zgodnie z [instrukcją 1.5](UPDATE_1_5.md). Po wyczyszczeniu cache sprawdź menu, klawiaturę, Wstecz i animacje na telefonie oraz komputerze. Stara witryna, jej baza i przypisanie domeny pozostają bez zmian.
