# DC Serwis — instalacja i edycja

Natywny motyw WordPress 6.6+, PHP 8.2+. Bez bundlera, zewnętrznych fontów i bibliotek frontendowych. Testowany lokalnie na WordPress 7.1.4 / PHP 8.3.36 / MariaDB 11.4. Interfejs jest po polsku; pakiet językowy panelu WordPress instaluje administrator niezależnie od motywu.

## Instalacja na stagingu

1. Wykonaj pełny backup plików i bazy istniejącej witryny. Utwórz odrębną kopię stagingową. Zachowaj aktywne wtyczki i treść `/polityka-prywatnosci/`.
2. Wgraj `dc-serwis.zip` przez Wygląd → Motywy → Dodaj → Wyślij motyw. Aktywuj na stagingu. Na nowej instalacji aktywacja tworzy strony, zdjęcia i menu; istniejąca witryna jest chroniona przed automatycznym nadpisaniem.
3. Na nowej oddzielnej instalacji aktywacja automatycznie tworzy sześć stron i osobną politykę prywatności, importuje fotografie do Mediów i ustawia menu oraz stronę główną. Wynik i ponowna synchronizacja: Wygląd → DC — synchronizacja. Na istniejącej witrynie wykryte kolizje zatrzymują import, bez nadpisywania treści. Nie instaluj do starej bazy, którą chcesz zachować.
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
| Polityka prywatności | `/polityka-prywatnosci/` |

## Edycja

Teksty, nagłówki, listy, sekcje, FAQ i obrazy są natywnymi blokami Gutenberga, bez edycji PHP. Zachowaj jedno H1 i klasy sekcji podczas zmian. Dekoracyjne ikony i strzałki używają bloków HTML. Fotografie można zastąpić obrazami z biblioteki mediów; WordPress tworzy ich srcset. Zdjęcia dostarczone w motywie mają własny srcset dodawany podczas renderowania, aby zachować poprawność bloków w edytorze. Synchronizacja aktualizuje zarządzane strony, dopóki nie zostały zmienione ręcznie. Wykryte własne edycje są zachowywane i raportowane.

## Mapa i opinie Google

Wygląd → Dostosuj → „DC — Google: mapa i opinie”:

- Mapa działa bez klucza API. Puste pole używa potwierdzonego adresu z sekcji DC — Dane firmy. Możesz wkleić pełny kod iframe z Google Maps → Udostępnij → Umieść mapę albo pełny link Google. Skrócony link maps.app.goo.gl trzeba najpierw otworzyć i skopiować kod osadzenia. Przełącznik „Pokaż mapę Google” pozwala ją wyłączyć. Iframe pojawia się dopiero po kliknięciu „Włącz mapę Google”; status, ponowienie i link „Otwórz w Google Maps” pomagają przy blokadzie treści zewnętrznych. Wzorzec Kontakt używa `[dc_google_map]`.
- Opinie: zainstaluj i skonfiguruj oficjalny widget Trustindex dla rzeczywistej wizytówki. Wklej jego `[trustindex ...]` w pole shortcode. Wzorce Kontakt i Strona główna zawierają `[dc_google_reviews]`. Bez shortcode lub aktywnej wtyczki sekcja nie jest wyświetlana. Motyw nie dopisuje ocen, recenzji ani `aggregateRating`. Shortcode opinii pozostaje do samodzielnego uzupełnienia przez właściciela.
- Zweryfikuj politykę prywatności oraz zgodę na technologie widgetu przed aktywacją integracji. Kod zewnętrznego widgetu może wymagać rozwiązania zarządzania zgodami zależnie od faktycznej konfiguracji.

## Formularz

Wstaw `[dc_contact]`. Wymagane: imię, e-mail, wiadomość i checkbox zgody na przetwarzanie danych w celu odpowiedzi, z odnośnikiem do polityki prywatności. Telefon opcjonalny. Walidacja serwera, nonce, honeypot, limit trzech prób wysyłki na pięć minut, stały odbiorca i temat, escapowanie wyjścia. Dane nie trafiają do zewnętrznego API. Wiadomości są przekazywane do `wp_mail`; transport określa konfiguracja WordPressa. Motyw nie przechowuje treści zgłoszeń w bazie. Limit przechowuje czasowo skrót HMAC adresu IP i licznik; uwzględnij go w polityce oraz sprawdź prawidłowe REMOTE_ADDR za reverse proxy. Bez JS działa standardowy POST z przekierowaniem i komunikatem; z JS odpowiedź AJAX z zachowaniem treści przy błędzie.

## AJAX i animacje

Nawigacja progresywnie pobiera pełny HTML WordPressa, wymienia treść, tytuł, metadata, schema i stan menu. Obsługuje Wstecz, fokus i komunikaty czytnika ekranu. Awaria pobrania uruchamia zwykłą nawigację. Obce strony, panel, pliki, linki `tel:` i `mailto:` działają standardowo. View Transitions i reveal mają wariant `prefers-reduced-motion`. Strony zawierające widget opinii przechodzą na pełne ładowanie, aby umożliwić poprawną inicjalizację skryptów wtyczki. Formularz AJAX działa niezależnie.

## Źródła grafiki

Fotografie Realizacji: materiały właściciela z `assets/photos/` i istniejącej strony z `assets/source-web/`. Hero i fotografie opisujące usługi: oryginalne wygenerowane obrazy `editorial-*`, inspirowane stylem makiety; nie są zdjęciami rzeczywistych prac klienta. Kopie WebP w `assets/images/` mają usunięte metadane; ze zdjęcia AUX usunięto czarne pasy z oryginału. Ikony oraz rezerwowa grafika SVG AGD są autorskie; docelowe podstrony AGD wykorzystują fotografie ilustracyjne. Makieta jest referencją, nie tłem HTML. Różnice wobec jej fotografii opisuje raport porównawczy. Oryginały w repozytorium pozostają zachowane.

Pełne zasady automatycznej instalacji, bezpiecznej synchronizacji i przepięcia domeny: `docs/AUTOMATIC_SETUP.md` w repozytorium.

## Wersja 1.2: adres, mapa, polityka i nawigacja

Adres firmy edytujesz w **Wygląd → Dostosuj → DC — Dane firmy**. Wartości początkowe: Aleje Jana Pawła II 42, 37-450 Stalowa Wola. Z tego samego źródła korzystają kontakt, stopka, mapa i polityka. Na nowej instalacji importer dodaje politykę jako osobną stronę, bez siódmej pozycji głównego menu; istniejącej polityki ani ręcznych zmian nie nadpisuje.

Nagłówek ma nowe logo DC; eksporty PNG i ikonę witryny znajdziesz w `assets/branding/`. Sticky menu pojawia się po przewinięciu. Menu i kafle usług otwierają pełne podstrony; scrollspy został wyłączony w 1.3. Bez JavaScript i przy otwarciu w nowej karcie działają rzeczywiste URL podstron.

Konfigurację Rank Math i ponownego zgłaszania stron do Google opisuje `docs/RANK_MATH_SEO.md` w repozytorium. Aktualizacja kodu nie zgłasza automatycznie indeksacji ani nie zmienia konfiguracji kont Google.

## Wersja 1.3

Scrollspy jest wyłączony; sticky menu i zwykłe podstrony pozostają. Widoczne animacje AJAX i wejścia są wspólne dla desktopu/mobile. Galerie pokazują całe zdjęcia. Logo pełne wgrywaj przez Tożsamość witryny; nie zostanie zmniejszone do samej ikony. Jasny wariant w paczce: `assets/branding/dc-lockup-light.png`; tryb kontrastu jest edytowalny. Formularz wysyła do kontakt@damiancebula-serwis.pl; sprawdź SMTP zgodnie z `docs/MAIL_DELIVERY.md`.
