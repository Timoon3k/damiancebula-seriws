# DC Serwis — instalacja i edycja

Natywny motyw WordPress 6.6+, PHP 8.2+. Bez bundlera, zewnętrznych fontów i bibliotek frontendowych. Testowany lokalnie na WordPress 7.1.4 / PHP 8.3.36 / MariaDB 11.4. Interfejs jest po polsku; pakiet językowy panelu WordPress instaluje administrator niezależnie od motywu.

## Instalacja na stagingu

1. Wykonaj pełny backup plików i bazy istniejącej witryny. Utwórz odrębną kopię stagingową. Zachowaj aktywne wtyczki i treść `/polityka-prywatnosci/`.
2. Wgraj `dc-serwis.zip` przez Wygląd → Motywy → Dodaj → Wyślij motyw. Aktywuj na stagingu. Aktywacja nie tworzy, nie usuwa i nie nadpisuje stron ani ustawień.
3. Utwórz lub zredaguj strony zgodnie z poniższą tabelą. W edytorze blokowym wybierz Wzorce → DC Serwis i wstaw właściwy wzorzec. Ustaw szablon „DC — układ projektowy (nagłówek w treści)” na podstronach. Strona główna korzysta z `front-page.php`.
4. Ustawienia → Czytanie: ustaw statyczną stronę główną. Ustawienia → Bezpośrednie odnośniki: nazwa wpisu. Zachowaj istniejący URL polityki prywatności i jej treść. Motyw wyświetla standardowe strony przez `the_content()`.
5. Wygląd → Menu: opcjonalnie przypisz własne menu do „Nawigacja główna”; bez przypisania działa wbudowana nawigacja sześciu stron. Wygląd → Dostosuj → Tożsamość witryny pozwala podmienić znak logo.
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
| Kontakt | `/kontakt/` |

## Edycja

Teksty, nagłówki, listy, sekcje, FAQ i obrazy są natywnymi blokami Gutenberga, bez edycji PHP. Zachowaj jedno H1 i klasy sekcji podczas zmian. Dekoracyjne ikony i strzałki używają bloków HTML. Fotografie można zastąpić obrazami z biblioteki mediów; WordPress tworzy ich srcset. Zdjęcia dostarczone w motywie mają własny srcset dodawany podczas renderowania, aby zachować poprawność bloków w edytorze. Szablony i wzorce są niezależne: zmiana wzorca w pliku nie nadpisuje już zapisanych treści stron.

## Mapa i opinie Google

Wygląd → Dostosuj → „DC — Google: mapa i opinie”:

- Mapa: wpisz zweryfikowany adres `src` z Google Maps → Udostępnij → Umieść mapę, na domenie `https://www.google.com/maps/embed...`. Nie wpisuj niepotwierdzonej siedziby. Wzorzec Kontakt zawiera `[dc_google_map]`. Bez adresu sekcja nie jest wyświetlana. Iframe jest tworzony dopiero po świadomym kliknięciu „Włącz mapę Google”. Informacja o połączeniu z Google jest widoczna przed kliknięciem.
- Opinie: zainstaluj i skonfiguruj oficjalny widget Trustindex dla rzeczywistej wizytówki. Wklej jego `[trustindex ...]` w pole shortcode. Wzorce Kontakt i Strona główna zawierają `[dc_google_reviews]`. Bez shortcode lub aktywnej wtyczki sekcja nie jest wyświetlana. Motyw nie dopisuje ocen, recenzji ani `aggregateRating`. Właściciel pozostawił oba pola do samodzielnego uzupełnienia.
- Zweryfikuj politykę prywatności oraz zgodę na technologie widgetu przed aktywacją integracji. Kod zewnętrznego widgetu może wymagać rozwiązania zarządzania zgodami zależnie od faktycznej konfiguracji.

## Formularz

Wstaw `[dc_contact]`. Wymagane: imię, e-mail, wiadomość i checkbox zgody na przetwarzanie danych w celu odpowiedzi, z odnośnikiem do polityki prywatności. Telefon opcjonalny. Walidacja serwera, nonce, honeypot, limit trzech prób wysyłki na pięć minut, stały odbiorca i temat, escapowanie wyjścia. Dane nie trafiają do zewnętrznego API. Wiadomości są przekazywane do `wp_mail`; transport określa konfiguracja WordPressa. Motyw nie przechowuje treści zgłoszeń w bazie. Limit przechowuje czasowo skrót HMAC adresu IP i licznik; uwzględnij go w polityce oraz sprawdź prawidłowe REMOTE_ADDR za reverse proxy. Bez JS działa standardowy POST z przekierowaniem i komunikatem; z JS odpowiedź AJAX z zachowaniem treści przy błędzie.

## AJAX i animacje

Nawigacja progresywnie pobiera pełny HTML WordPressa, wymienia treść, tytuł, metadata, schema i stan menu. Obsługuje Wstecz, fokus i komunikaty czytnika ekranu. Awaria pobrania uruchamia zwykłą nawigację. Obce strony, panel, pliki, linki `tel:` i `mailto:` działają standardowo. View Transitions i reveal mają wariant `prefers-reduced-motion`. Strony zawierające widget opinii przechodzą na pełne ładowanie, aby umożliwić poprawną inicjalizację skryptów wtyczki. Formularz AJAX działa niezależnie.

## Źródła grafiki

Fotografie: materiały właściciela z `assets/photos/` i istniejącej strony z `assets/source-web/`. Kopie WebP w `assets/images/` mają usunięte metadane; ze zdjęcia AUX usunięto czarne pasy z oryginału. SVG AGD i ikony są autorską ilustracją, nie fotografiami realizacji. Makieta jest referencją, nie tłem HTML. Różnice wobec jej fotografii opisuje raport porównawczy. Oryginały w repozytorium pozostają zachowane.
