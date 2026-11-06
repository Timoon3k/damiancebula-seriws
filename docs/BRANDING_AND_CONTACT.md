# Logo, adres, stopka i nawigacja

## Edycja danych firmy

**Wygląd → Dostosuj → DC — Dane firmy** zawiera pola: ulica i numer, kod pocztowy, miejscowość. Początkowo wpisany jest potwierdzony adres: **Aleje Jana Pawła II 42, 37-450 Stalowa Wola**. Zmiana tych pól aktualizuje shortcode `[dc_business_address]`, kontakt, stopkę, politykę prywatności, domyślne zapytanie mapy i dane strukturalne motywu. Własne ustawienia Rank Math Local SEO należy uaktualnić również w tej wtyczce, aby zachować spójność danych.

## Logo

Nowy znak DC używa pomarańczu i srebra oraz trzech linii przepływu powietrza. Domyślnie nagłówek pobiera wektor z `wp-content/themes/dc-serwis/assets/branding/dc-lockup-light.svg`. Pełne logo ma czytelne jasne napisy. Wgrany pełny logotyp jest wyświetlany szeroko, bez dublowania nazwy; osobny znak może nadal korzystać z podpisu HTML.

- Własne logo: **Wygląd → Dostosuj → Tożsamość witryny → Logo**.
- PNG do wgrania: `assets/branding/dc-lockup-light.png`.
- Ikona witryny / logo organizacji Rank Math: kwadratowy `assets/branding/dc-icon.png` (512×512).

Nie trzeba włączać przesyłania dowolnych SVG do WordPressa. Nowe domyślne logo nie nadpisuje własnego logo już wybranego przez administratora.

## Stopka

Podpis twórcy projektu jest widoczny jako **Projekt i wykonanie: majewskitomasz.pl** i prowadzi do `https://majewskitomasz.pl/`. Stopka zawiera też edytowalny adres firmy i odnośnik do strony wybranej w **Ustawienia → Prywatność**.

## Sticky menu i animacje

Scrollspy został wyłączony w wersji 1.3. Menu otwiera pełne podstrony z użyciem AJAX, a po przewinięciu nadal pojawia się sticky nagłówek bez przeskoku treści. Animacje są widoczne na desktopie i mobile, w tym na stronie głównej; ustawienie ograniczenia ruchu jest respektowane.
