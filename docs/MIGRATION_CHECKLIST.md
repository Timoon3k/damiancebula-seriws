# Migracja i SEO — bez wdrożenia produkcyjnego w tej zmianie

## Przed przełączeniem

- Backup plików i bazy oraz sprawdzona procedura powrotu do poprzedniego motywu. Kopia stagingowa, zablokowana przed indeksacją.
- Zachować `/` oraz `/polityka-prywatnosci/`, identyfikator i treść istniejącej polityki; nie zastępować jej przykładowym tekstem WordPressa. Odczyt produkcji był blokowany przez proxy, dlatego nie przygotowano niezweryfikowanej kopii polityki.
- Zaktualizować politykę wyłącznie po sprawdzeniu rzeczywistych procesów: administrator, podstawa przetwarzania i zgoda formularza, odbiorcy/hosting/poczta, czas przechowywania, prawa osób, logi i limit antyspamowy, Google Maps, Trustindex i technologie śledzące po ich konfiguracji. Właściciel zatwierdza finalną treść.
- Na osobnej nowej instalacji aktywacja motywu 1.1 tworzy strony, zdjęcia i menu automatycznie; sprawdzić raport w Wygląd → DC — synchronizacja. Nie uruchamiać lokalnego skryptu seed na produkcji — ma blokadę domeny.
- Zachować telefon, e-mail i domenę. Nie uzupełniać niepotwierdzonych adresu, godzin, ocen, uprawnień ani marek.
- Nie usuwać starych uploadów. Sprawdzić URL mediów, linki zewnętrzne, stary profil Google i Search Console po uzyskaniu dostępu.

## URL i kotwice

| Dotychczas | Docelowo | Działanie |
|---|---|---|
| `/` | `/` | zachować |
| `/polityka-prywatnosci/` | ten sam URL | zachować treść i stronę |
| `/#o-mnie` | `/o-firmie/` | aktualizacja linków; fragment nie trafia do serwera |
| `/#uslugi` | dwie podstrony usług | aktualizacja linków |
| `/#moje-prace` | `/realizacje/` | aktualizacja linków |
| `/#kontakt` | `/kontakt/` | aktualizacja linków |

Motyw obsługuje historyczne kotwice na stronie głównej, aby starsze linki przewijały do odpowiedniej sekcji. Nie twórz reguł 301 dla fragmentów URL: serwer ich nie otrzymuje. Przy odkryciu innych starych ścieżek przygotować 301 jeden-do-jednego po audycie, bez zbiorczego przekierowywania 404 na home.

## Przed publikacją

- Sześć stron oraz istniejąca polityka: status 200, poprawne canonical, jeden H1, jeden komplet metadanych, lang pl-PL, brak błędów PHP/JS i uszkodzonych obrazów.
- Jedna aktywna wtyczka SEO albo fallback motywu. Zweryfikować schema w Rich Results Test; brak ocen i fikcyjnego adresu jest zamierzony.
- Mapa XML: domyślnie `/wp-sitemap.xml`; przy wtyczce jej właściwy adres (często `/sitemap_index.xml`). Sprawdzić tylko strony przeznaczone do publikacji. Zachować robots administracyjne.
- Na produkcji wyłączyć „Proś wyszukiwarki o nieindeksowanie” i blokady stagingowe. W lokalnym środowisku `noindex` jest celowy. Sprawdzić też nagłówek X-Robots-Tag i cache/CDN.
- Formularz: rzeczywisty test dostarczalności na zatwierdzonym stagingu, SMTP, SPF/DKIM/DMARC, wiadomość sukcesu i błędu, zgoda, brak wycieku danych. Nie kopiować testowej wtyczki przechwytującej pocztę.
- Mapa i opinie domyślnie puste. Uzupełnić tylko zweryfikowane dane; sprawdzić prywatność i widget. Nie przypisywać zdjęciom lokalizacji bez dowodów.
- Desktop 1440/1536, tablet 768, mobile 390/360, klawiatura, czytnik, formularz i menu bez JS.
- PageSpeed/Lighthouse na stagingu i po produkcji; cele LCP <2,5 s, CLS <0,1, INP <200 ms wymagają reprezentatywnych pomiarów. Lokalne testy nie stanowią gwarancji Core Web Vitals.
- Dopiero po zatwierdzeniu: wdrożenie, purge cache, testy URL, sitemap w GSC, URL Inspection i monitoring 404. Nie deklarować indeksacji ani pozycji bez danych. Uzgodnić NAP z prawdziwym Google Business Profile.
