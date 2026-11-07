# Weryfikacja 2.1 — fotografie, niebieskie akcenty i identyfikacja

Aktualizacja z 7 listopada 2026 r. (Europe/Warsaw), oparta na `main` `8ebc717`. Zmiany wizualne zostały sprawdzone na odrębnym lokalnym WordPressie. **Autentyczna fotografia Stalowej Woli pozostaje niedołączona z powodu blokady sieci.** Gotowy moduł jej edycji nie oznacza ukończenia tego elementu prośby.

## Rezultat

Siedem miejsc ilustracyjnych ma siedem różnych scen: salon w hero home, detal klimatyzatora w module, pralnię przy AGD, osobną jadalnię w hero Klimatyzacji, filtry w sekcji serwisu, kuchnię ze zmywarką w hero AGD i detal bębna w jego sekcji. Nie powtarza się sąsiadujący kadr. Na telefonie tytuł i opis Klimatyzacji poprzedzają fotografię. Wszystkie zdjęcia realizacji, ich kolejność, ALT, podpisy i pliki pozostały zachowane.

Niebieskie akcenty `#255F8A` i `#17476C` obejmują CTA, telefon mobilny, aktywne menu, kontrolki, numerację i fokus. Jasne powierzchnie `#E5EDF4` łączą proces, moduł AGD i formularz. Logo oraz wyróżnienie „Przywracamy komfort” zachowują ten sam miedziany kolor `#9C4F2C`; zdjęcia nie są barwione. Stopka pozostaje petrolowa, z telefonem, nawigacją i uporządkowanym paskiem prawnym. Usunięto z niej tylko adres i e-mail, pozostawiając te dane w Kontakcie, polityce oraz schema.

Logo używa oryginalnego źródła i dokładnego koloru przez filtr SVG, także dla przezroczystego uploadu. Nowe favicony DC mają rozmiary 32/180/192/512 i wersjonowane URL 2.1.0. Opcje oryginalnej palety i własnej ikony WordPress pozostają w Dostosuj. Nic nie resetuje zapisanych ustawień SEO ani danych właściciela.

## Wykonane kontrole

| Zakres | Rzeczywisty wynik |
|---|---|
| Dedykowany test 2.1 | PASS: 28 widoków, siedem scen, 21 wariantów WebP, prawidłowy układ zdjęć i 10 konkretnych odnośników stopki, Contact/schema oraz favicony |
| Responsywność i funkcje | PASS: 56 widoków siedmiu stron na 360/390/768/1024/1280/1440/1536/1920; AJAX, historia, lightbox, menu, brakJS i obsługa wygasłego formularza |
| Dostępność | PASS: 15 stanów axe WCAG A/AA, bez wykrytych naruszeń; w tym otwarty modal mobilny |
| Logo po AJAX | PASS: 8 rzeczywistych zrzutów logo przed/po nawigacji desktop i mobile; analiza PNG potwierdza widoczne piksele miedzi, nie tylko obecność filtra w DOM |
| Oryginalny upload | PASS: 4 szerokości przy DPR 2; odzyskanie oryginału 2048px z cropa 220×64, poprawna ostrość źródła, marginesy i kontrast |
| Zachowanie SEO | PASS: 7 ścisłych lokalnych porównań treści, H1–H3, title, description, canonical, robots, OG/Twitter, JSON-LD i galerii; 29 SHA256 plików właściciela identycznych |
| Galerie | PASS: 9 galerii przy1440/768/390; pełne kadry contain, podpisy, oryginalne pliki, fokus i lightbox |
| Nawigacja i ruch | PASS:modal, klawiatura/dotyk, inert, przywrócenie scrolla i 12 tras AJAX; bez przesłony, migawki i przygaszania całego widoku |
| Edycja zdjęcia miasta | PASS: 25 lokalnych kontroli na jawnie syntetycznej próbce; bezpieczne URL, ALT/podpis, lazy/srcset, brak duplikacji i niezmienione treści/dat modyfikacji/ustawienia; próbka usunięta |

Porównanie SEO świadomie pomija jedynie zatwierdzone dodatki prezentacji (CTA hero, menu stopki, opcjonalną nową figurę miasta) oraz dokładnie jedno usunięte mailto stopki. Ostatni mailto jest rozpoznawany po kolejności oryginalnej stopki w niezmienionym fixture; e-mail w Kontakcie i polityce nadal jest chroniony. Nie regenerowano wzorca z nowej strony, aby zaakceptować regresję.

Test mapy korzysta z atrapy, a formularz nie wysyłał wiadomości na rzeczywistą skrzynkę. Ta aktualizacja nie potwierdza działania Google/Trustindex ani SMTP na Hostinger. Automatyczny axe i testy emulowane nie są pełnym certyfikatem WCAG ani badaniem wszystkich fizycznych urządzeń. Raporty JSON: [test-results/refinement](test-results/refinement/).

## Porównania obrazów

21 końcowych zrzutów 2.1 zestawiono z 21 istniejącymi, zapisanymi zrzutami rzeczywistej lokalnej wersji 2.0. Nie są to zrzuty produkcji. W każdej komórce: 2.0 → 2.1, viewport o szerokości podanej w nagłówku i wysokości 1000px, pełna strona, reduced motion. Wyłącznie na potrzeby zapisu wyłączono pomijanie odległych obrazów przez Chromium; produkcyjne lazy loading pozostaje aktywne. Mapa ma podpisaną atrapę testową.

| Strona | 1440px | 768px | 390px |
|---|---|---|---|
| Strona główna | [2.0](visual/architectural/after/home-1440.jpg) → [2.1](visual/refinement/after/home-1440.jpg) | [2.0](visual/architectural/after/home-768.jpg) → [2.1](visual/refinement/after/home-768.jpg) | [2.0](visual/architectural/after/home-390.jpg) → [2.1](visual/refinement/after/home-390.jpg) |
| Klimatyzacja | [2.0](visual/architectural/after/serwis-klimatyzacji-stalowa-wola-1440.jpg) → [2.1](visual/refinement/after/serwis-klimatyzacji-stalowa-wola-1440.jpg) | [2.0](visual/architectural/after/serwis-klimatyzacji-stalowa-wola-768.jpg) → [2.1](visual/refinement/after/serwis-klimatyzacji-stalowa-wola-768.jpg) | [2.0](visual/architectural/after/serwis-klimatyzacji-stalowa-wola-390.jpg) → [2.1](visual/refinement/after/serwis-klimatyzacji-stalowa-wola-390.jpg) |
| Serwis AGD | [2.0](visual/architectural/after/serwis-agd-stalowa-wola-1440.jpg) → [2.1](visual/refinement/after/serwis-agd-stalowa-wola-1440.jpg) | [2.0](visual/architectural/after/serwis-agd-stalowa-wola-768.jpg) → [2.1](visual/refinement/after/serwis-agd-stalowa-wola-768.jpg) | [2.0](visual/architectural/after/serwis-agd-stalowa-wola-390.jpg) → [2.1](visual/refinement/after/serwis-agd-stalowa-wola-390.jpg) |
| Realizacje | [2.0](visual/architectural/after/realizacje-1440.jpg) → [2.1](visual/refinement/after/realizacje-1440.jpg) | [2.0](visual/architectural/after/realizacje-768.jpg) → [2.1](visual/refinement/after/realizacje-768.jpg) | [2.0](visual/architectural/after/realizacje-390.jpg) → [2.1](visual/refinement/after/realizacje-390.jpg) |
| O firmie | [2.0](visual/architectural/after/o-firmie-1440.jpg) → [2.1](visual/refinement/after/o-firmie-1440.jpg) | [2.0](visual/architectural/after/o-firmie-768.jpg) → [2.1](visual/refinement/after/o-firmie-768.jpg) | [2.0](visual/architectural/after/o-firmie-390.jpg) → [2.1](visual/refinement/after/o-firmie-390.jpg) |
| Kontakt | [2.0](visual/architectural/after/kontakt-1440.jpg) → [2.1](visual/refinement/after/kontakt-1440.jpg) | [2.0](visual/architectural/after/kontakt-768.jpg) → [2.1](visual/refinement/after/kontakt-768.jpg) | [2.0](visual/architectural/after/kontakt-390.jpg) → [2.1](visual/refinement/after/kontakt-390.jpg) |
| Polityka prywatności | [2.0](visual/architectural/after/polityka-prywatnosci-1440.jpg) → [2.1](visual/refinement/after/polityka-prywatnosci-1440.jpg) | [2.0](visual/architectural/after/polityka-prywatnosci-768.jpg) → [2.1](visual/refinement/after/polityka-prywatnosci-768.jpg) | [2.0](visual/architectural/after/polityka-prywatnosci-390.jpg) → [2.1](visual/refinement/after/polityka-prywatnosci-390.jpg) |

## Brakująca fotografia miasta

Żądanie Wikimedia Commons zwróciło `curl (56) CONNECT tunnel failed, response 403`, HTTP 000. To odmowa proxy środowiska, nie odpowiedź serwisu. Po ponownym uruchomieniu środowiska dostęp sprawdzono ponownie; nadal jest blokowany. Projekt konfiguracji zapisuje `commons.wikimedia.org` i `upload.wikimedia.org`, ale nie został zastosowany do uruchomionej instancji (obserwowana rewizja 1, brak domen użytkownika).

Po zatwierdzeniu i zapisaniu dostępu w ustawieniach środowiska trzeba pobrać rzeczywistą fotografię, potwierdzić miejsce i licencję, przygotować warianty oraz wymagane oznaczenie autora. Alternatywnie administrator może wybrać własny materiał w Dostosuj → DC—Lokalność i zdjęcie miasta. Obecnie nie ma sztucznej sceny podpisanej jako Stalowa Wola ani pustej ramki. Status maszynowy: [city-photo-status.json](test-results/refinement/city-photo-status.json).

Prawdziwa migawka SEO produkcji także pozostaje niedostępna przez politykę sieci. Lokalne porównanie nie potwierdza ręcznych wartości Rank Math na hostingu. Kod, baza produkcyjna, DNS i indeksacja nie były zmieniane bezpośrednio na Hostinger.

## Wydajność końcowej wersji

Lighthouse 13.6.0 / Chromium 155, 18 kolejnych prób (3 strony × 2 tryby × 3 powtórzenia), osobna zimna przeglądarka dla każdej próby. Mobilnie symulacja slow 4G i CPU ×4; desktop preset Lighthouse. Lokalny PHP/baza mogły mieć ciepły cache. Nie uruchamiano równolegle testów Chromium. Pomiar po ponownym uruchomieniu środowiska zastępuje przerwaną serię diagnostyczną; ta wcześniejsza seria nie służy do odbioru.

| Tryb | Strona | LCP mediana | CLS | TBT mediana | Wynik mediana |
|---|---|---:|---:|---:|---:|
| Telefon | Główna | 2189 ms | 0 | 21 ms | 99 |
| Telefon | Klimatyzacja | 1964 ms | 0 | 45 ms | 99 |
| Telefon | AGD | 1889 ms | 0 | 0 ms | 100 |
| Desktop | Główna | 517 ms | 0 | 0 ms | 100 |
| Desktop | Klimatyzacja | 491 ms | 0 | 0 ms | 100 |
| Desktop | AGD | 529 ms | 0 | 0 ms | 100 |

Wszystkie mediany spełniają lokalne cele LCP ≤2500 ms i CLS ≤0,1. Hero jest eager/high; pozostałe ilustracje i galerie lazy/low, a osobny `sizes` ogranicza nadmiernie duży wariant zdjęcia małego modułu AGD. Pełne wyniki, ustawienia, ostrzeżenia i 12 syntetycznych interakcji są w [performance.json](test-results/refinement/performance.json). Najdłuższa reakcja dotykowa przy rzeczywistym CDP CPU ×4 wyniosła **96 ms**. To nie jest pomiar terenowego INP; TBT także nie jest INP.

Fingerprint runtime pozostał identyczny przed/po całym pomiarze: `ea22cfee704245f3f902322de8c9c0ae5fe828d43a145993816d390dab903070`. Git HEAD w raporcie wskazuje bazowy 8ebc717, ponieważ zmiany mierzono przed commitem. Wyniki nie opisują Hostinger, aktywnych zewnętrznych widgetów ani doświadczeń rzeczywistych użytkowników. Odtworzenie: `node scripts/performance-audit.mjs --runs=3 --out=artifacts/performance-refinement`. Surowe raporty pozostają w tej lokalnej ścieżce; wersjonowane podsumowanie zawiera wszystkie 18 prób.

## Paczka i składnia

Zweryfikowano składnię 24 plików PHP, skryptów JS i JSON oraz `git diff --check`. ZIP `artifacts/dc-serwis-2.1.0.zip` ma **106 plików**, **4,160,425B**, wyłącznie katalog `dc-serwis/`. Każdy plik archiwum odpowiada źródłu, CRC jest poprawne, dołączono fonty i licencję, ilustracje, favicony i moduł miasta. Nie ma bazy, danych dostępowych ani testowych fixture. SHA256: `310534813e42216a800144443ec8f54152b61e9d43173752d80620fa1bf52df2`. Dowód: [package-2.1.json](test-results/refinement/package-2.1.json).

Raport [version-2.1.json](test-results/refinement/version-2.1.json) rozróżnia zweryfikowane lokalnie zmiany oraz brakującą rzeczywistą fotografię miasta. Nie wykonano osobnego wdrożenia na Hostinger.
