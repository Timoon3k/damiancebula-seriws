# Logo, adres, stopka i nawigacja

## Edycja danych firmy

**Wygląd → Dostosuj → DC — Dane firmy** zawiera pola: ulica i numer, kod pocztowy, miejscowość. Początkowo wpisany jest potwierdzony adres: **Aleje Jana Pawła II 42, 37-450 Stalowa Wola**. Zmiana tych pól aktualizuje shortcode `[dc_business_address]`, kontakt, stopkę, politykę prywatności, domyślne zapytanie mapy i dane strukturalne motywu. Własne ustawienia Rank Math Local SEO należy uaktualnić również w tej wtyczce, aby zachować spójność danych.

## Logo

Nowy znak DC używa pomarańczu i srebra oraz trzech linii przepływu powietrza. Domyślnie nagłówek pobiera wektor z `wp-content/themes/dc-serwis/assets/branding/dc-mark.svg`. Nazwa i opis są czytelnym tekstem HTML.

- Własne logo: **Wygląd → Dostosuj → Tożsamość witryny → Logo**.
- PNG do wgrania: `assets/branding/dc-mark.png`.
- Ikona witryny / logo organizacji Rank Math: kwadratowy `assets/branding/dc-icon.png` (512×512).

Nie trzeba włączać przesyłania dowolnych SVG do WordPressa. Nowe domyślne logo nie nadpisuje własnego logo już wybranego przez administratora.

## Stopka

Podpis twórcy projektu jest widoczny jako **Projekt i wykonanie: majewskitomasz.pl** i prowadzi do `https://majewskitomasz.pl/`. Stopka zawiera też edytowalny adres firmy i odnośnik do strony wybranej w **Ustawienia → Prywatność**.

## Sticky menu i scrollspy

Nagłówek po przewinięciu poza pierwotne położenie pojawia się jako sticky menu. Jego miejsce jest rezerwowane, aby treść nie przeskakiwała. Na stronie głównej zwykłe kliknięcia nawigacji przewijają do sekcji, a aktywna pozycja śledzi przewijanie. Kafle Klimatyzacja i AGD prowadzą do pełnych podstron usług. Przy wyłączonym JavaScript i otwieraniu linku w nowej karcie menu zachowuje rzeczywiste adresy podstron. Na podstronach nawigacja działa jako menu stron, także przez AJAX. Ograniczenie animacji systemowych jest respektowane.
