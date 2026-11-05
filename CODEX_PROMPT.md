# Zadanie dla Codexa: pełna przebudowa damiancebula-serwis.pl

Jesteś senior WordPress engineer, frontend engineer, designerem oraz specjalistą technicznego i lokalnego SEO. Wykonaj **rzeczywistą implementację**, a nie makietę, opis działań lub landing page. Pracujesz w repozytorium `Timoon3k/damiancebula-seriws`. Obecny serwis produkcyjny to https://damiancebula-serwis.pl/ . Przeczytaj najpierw `AGENTS.md`, `docs/DESIGN_SPEC.md`, `docs/CONTENT_AUDIT.md`, `docs/LOCAL_SEO.md`, `assets/SOURCES.md`.

## 1. Główny cel i źródła

Odtwórz **1:1** udostępnioną przez właściciela makietę: desktop — duży ekran strony głównej po lewej, dwie osobne podstrony „Klimatyzacja” i „Serwis AGD” po prawej. Nie interpretuj wizualizacji dowolnie i nie stosuj generycznych szablonów. Jeśli w repo jest `design/reference/makieta-uklad-strony-1-1.jpg`, obejrzyj ją i użyj jako głównego wzorca. W przeciwnym razie skorzystaj z dokładnego opisu w `docs/DESIGN_SPEC.md` i zgłoś brak oryginału; nie deklaruj wtedy zweryfikowanej zgodności pixel-perfect. Korzystaj ze zdjęć faktycznych realizacji z `assets/photos/` i `assets/source-web/`, a nie przypadkowych stocków.

Dokonaj inwentaryzacji aktualnej witryny. Wykorzystaj prawdziwe informacje o usługach i kontakcie. Nie kopiuj kodu ani licencjonowanych grafik z motywu demonstracyjnego; napisz od podstaw niezależny, dobrze zabezpieczony motyw WordPress. Zachowaj stary serwis produkcyjny bez zmian do momentu akceptacji.

## 2. Technologia i repo

Zbuduj instalowalny natywny motyw `wp-content/themes/dc-serwis/` kompatybilny z aktualnym stabilnym WordPress, PHP 8.2+ i Gutenberg. Użyj semantycznego HTML5, CSS (CSS custom properties, nowoczesny responsive) i lekkiego JS bez ciężkich zależności. Nie używaj React/Vite do renderowania całej witryny; jeśli potrzebny jest pipeline do CSS/JS, musi dostarczać finalne pliki w motywie. Dodaj `style.css` z nagłówkiem motywu, `theme.json`, `functions.php`, `header.php`, `footer.php`, `front-page.php`, `page.php`, `404.php`, odpowiednie templates/template-parts, assets, dostępne menu, dynamiczne dane z WP, deklarację wsparcia thumbnails/logo/nav menus, optymalizację zasobów. Nie umieszczaj sekretów w repo.

Przygotuj lokalne uruchomienie WordPress (np. wp-env lub Docker, jeżeli to możliwe), oraz instrukcję instalacji motywu jako ZIP. Treści muszą być edytowalne w WordPress bez ingerowania w PHP (Gutenberg, post meta/ustawienia lub rozsądne customizer controls). Nie wymagaj płatnego Elementora ani WPBakery.

## 3. Nawigacja i architektura URL

Witryna ma mieć oddzielne, realne podstrony:
- `/` — Strona główna.
- `/serwis-klimatyzacji-stalowa-wola/` — menu „Klimatyzacja”; unikalna podstrona usługi.
- `/serwis-agd-stalowa-wola/` — menu „Serwis AGD”; unikalna podstrona usługi.
- `/realizacje/` — galerie prawdziwych prac, opcjonalne podstrony realizacji tylko z danymi.
- `/o-firmie/` — rzeczywisty opis firmy, doświadczenie bez niepotwierdzonych liczb.
- `/kontakt/` — formularz i widoczne dane kontaktowe.
- `/polityka-prywatnosci/` — zachowaj istniejącą opublikowaną stronę i jej adres.
Opcjonalne tematyczne podstrony (np. montaż/odgrzybianie) tylko jeśli zapewnisz unikalną, merytoryczną treść oraz realną odrębną wartość — żadnych doorway pages.

Zbuduj wyraźną nawigację w headerze jak w makiecie: logo + „Damian Cebula / Serwis Klimatyzacji i AGD”, aktywna podstrona z pomarańczowym podkreśleniem, duży przycisk telefoniczny `794 225 139`. Mobile: czytelne rozwijane menu i CTA „Zadzwoń”. W stopce lokalizacja Stalowa Wola (obszar działania, nie udawany adres siedziby), linki wewnętrzne, kontakt, polityka prywatności.

## 4. Wygląd 1:1 — strona główna

Docelowy klimat: **premium industrial HVAC**, czarny/antracyt `#0e1012`, grafit `#171a1e`, białe napisy `#f6f6f4`, pomarańcz `#ff7a1a` jako akcent. Wyraźna typografia, duże ciężkie nagłówki, cienkie pomarańczowe linie i ukośne cięcia, subtelne tekstury, mocne zdjęcia, brak generycznych kart z zaokrąglonymi rogami i nadmiaru gradientów.

Odwzoruj bloki makiety w tej kolejności:
1. Sticky / standardowy header na szerokość, logo po lewej, 6 linków i telefon po prawej.
2. Hero z ogromnym hasłem w 4 liniach: „Naprawiamy. / Montujemy. / Przywracamy / komfort.”. Dwóch ostatnich wierszy użyj w pomarańczu; poniżej „Serwis klimatyzacji i AGD w Stalowej Woli.”. Po prawej dominujący obraz HVAC/technika, na styku geometryczny cięty pomarańczowy kształt. Obraz nie może utrudniać czytania.
3. Dwie szerokie obrazowe kafle/karty prowadzące do usług: „Klimatyzacja” (montaż/serwis/czyszczenie/naprawa) i „Serwis AGD” (pralki/zmywarki/lodówki/pozostałe potwierdzone). Białe nagłówki, realne zdjęcie, ikona i pomarańczowy kwadratowy przycisk-strzałka.
4. Pasek „Jak przebiega serwis?” z czterema ikonami i etapami: „Kontakt” → „Diagnoza” → „Serwis” → „Sprawne działanie”. Zachowaj poziomy układ, małe opisy i pomarańczowe łączniki.
5. Dolny blok: autentyczny lokalny kontekst „Lokalny serwis ze Stalowej Woli” oraz obok mini-galeria „Realizacje” z 3 fotografiami. Jeśli nie masz licencji do zdjęcia charakterystycznego obiektu miasta z makiety, wybierz bezpieczny lokalny element (tekst, mapa lub zdjęcie z odpowiednią licencją), nie udawaj posiadania zdjęcia.
6. Końcowy pasek CTA: pomarańczowa ikona telefonu, duży `794 225 139`, komunikat kontaktowy i pomarańczowy „Skontaktuj się”.

Desktop: projektuj najpierw pod 1440px i 1536px, starannie odtwórz proporcje makiety; wersje 1280, 1024, 768, 390 i 360 mają być odrębnie dopracowane. Ani nagłówki, ani zdjęcia, ani menu nie mogą się nakładać lub wychodzić poza viewport.

## 5. Podstrona Klimatyzacja — jak górna makieta po prawej

Breadcrumb „Strona główna / Klimatyzacja”. Hero z lewym tytułem „Serwis klimatyzacji / Stalowa Wola” (wyróżnij miasto w pomarańczu) i dużym zdjęciem jednostki split po prawej. Intro o montażu, naprawie, czyszczeniu i serwisie tylko w zakresie prawdziwie oferowanych usług. Pod hero poziomy pasek 4 ikon/usług: „Serwis i naprawa”, „Czyszczenie i odgrzybianie”, „Montaż klimatyzacji”, „Przeglądy i konserwacja”. Dalej podział na zdjęcie czyszczenia klimatyzatora + tekst „Dlaczego warto regularnie serwisować klimatyzację?” z 4 konkretnymi korzyściami. Uzupełnij o FAQ, mini-realizacje, jasne CTA kontaktu. Nie obiecuj przyjazdu w konkretnym czasie bez potwierdzenia.

## 6. Podstrona AGD — jak dolna makieta po prawej

Breadcrumb. Hero „Serwis AGD / Stalowa Wola”, po prawej pralka/zmywarka. Sekcja „Jakie urządzenia serwisujemy?” z ikonami: pralki, zmywarki, lodówki oraz inne rodzaje dopiero po potwierdzeniu na starej stronie/właściciela (nie wymyślaj zasięgu napraw). Niżej zdjęcie technika przy diagnozie urządzenia oraz lista „Profesjonalny serwis AGD w Twojej okolicy”: diagnoza, naprawa, usługi w Stalowej Woli, doradztwo. Osobne FAQ, CTA. Utrzymuj dokładnie tę samą identyfikację wizualną jak na stronie głównej.

## 7. Galeria, firma i kontakt

Realizacje: responsywna siatka galerii z rzeczywistymi zdjęciami instalacji i podpisami opisującymi widoczne prace. Przygotuj SEO-friendly ALT; nie podpisuj zdjęć nazwą miejsca realizacji, jeśli nie ma danych. Lightbox dostępny klawiaturą i przyciskiem zamykania. Użyj zdjęć z `assets/photos/` i `assets/source-web/`; nie odsyłaj przeglądarki do zewnętrznych hotlinków.

O firmie: historia/opis Damiana Cebuli na podstawie aktualnej strony, obszar działania Stalowa Wola i okolice, uczciwa prezentacja specjalizacji, brak wymyślonych statystyk.

Kontakt: aktywny telefon `tel:+48794225139`, `mailto:kontakt@damiancebula-serwis.pl`, formularz z wyraźnymi stanami, walidacją, zabezpieczeniem nonce, antyspamem i komunikatem potwierdzenia. Nie wysyłaj wiadomości ani danych kontaktowych do zewnętrznych serwisów bez zgody. Nie pokazuj fikcyjnego adresu punktu obsługi. Facebook tylko jeśli potwierdzony oficjalny profil.

## 8. LOKALNE SEO — priorytet krytyczny

Najważniejsze zapytania: **serwis klimatyzacji Stalowa Wola**, **serwis AGD Stalowa Wola**, a dodatkowe dopasowania wyłącznie zgodne z usługami: „montaż klimatyzacji Stalowa Wola”, „naprawa klimatyzacji Stalowa Wola”, „naprawa pralek Stalowa Wola”, „naprawa zmywarek Stalowa Wola”.

Dla każdej strony:
- unikalny Title 50–60 znaków w miarę możliwości, opis meta ok. 140–160 znaków, naturalny H1 (jeden), logiczne H2/H3, wartościowe copy po polsku;
- zgodne z rzeczywistą ofertą FAQs i wewnętrzne linki; brak keyword stuffing i mnożenia podstron miejscowości;
- canonical, Open Graph i Twitter Card, schema JSON-LD: HomeAndConstructionBusiness/HVACBusiness lub odpowiedni LocalBusiness + Service + BreadcrumbList, bez zdublowania wtyczką SEO, bez zmyślonego adresu/ocen;
- polskie `lang="pl-PL"`, kontakt w header/footer, schema `areaServed: Stalowa Wola`; NAP spójny z profilem Google, jeśli dane potwierdzone;
- poprawna mapa XML, robots, brak noindex na stronach publicznych, przekierowania przy zmianie istniejących URL, GSC, Google Business Profile checklist;
- dane geograficzne tylko autentyczne; zgodność z wytycznymi Google Search Central;
- alt zdjęć opisujące faktyczny obraz, sensowne nazwy plików, WebP/AVIF + `srcset` i `sizes`.

Nie da się uczciwie zagwarantować „1 miejsca” w Google — celem jest mocna, technicznie poprawna i wiarygodna podstawa pod lokalne pozycjonowanie.

## 9. Wydajność, jakość, bezpieczeństwo

LCP docelowo <2.5 s, CLS <0.1, INP <200 ms w warunkach reprezentatywnych; hero preload/fetchpriority, lazy-load pozostałych zdjęć, brak render-blocking zewnętrznych fontów, mało JS. WCAG 2.2 AA w krytycznych interakcjach, kontrast, focus-visible, klawiatura, skip link, aria. Responsywność bez horizontal scrolling. PHP sanitization/escaping/nonces/capability checks, bez aktywnego debugowania na produkcji. Sprawdź aktualność linków, brak 404 i białych ekranów WP. Nie rezygnuj z dostępności na rzecz dekoracji.

## 10. Plan implementacji i odbioru

1. Zinwentaryzuj pliki i publiczną witrynę WordPress. Pobierz/media źródłowe tylko z prawem wykorzystania.
2. Zbuduj strukturę motywu i dane edytowalne.
3. Zrealizuj homepage i dwie główne podstrony wiernością 1:1, następnie resztę nawigacji.
4. Przygotuj lokalne / testowe uruchomienie, screenshoty porównawcze 1440, 768, 390. Iteruj aż znikną istotne różnice: typografia, odstępy, kolory, kadrowanie, proporcje, geometria przycisków.
5. Dodaj SEO, schema, mapę strony przez WordPress/plugin i checklistę migracji.
6. Uruchom lint / phpcs / testy renderowania / automatyczne testy linków i formularza na środowisku testowym.
7. Udokumentuj wymagania niepotwierdzone (np. siedziba, marki AGD, godziny) i nie twórz fikcyjnych danych.
8. Przygotuj gotowe pliki motywu i jego ZIP, README instalacji i PR z dokładnym opisem ukończonych elementów, testów i braków.

**Definicja ukończenia:** wszystkie strony działają; na desktopie layout jest zgodny z makietą; na mobile w pełni użyteczny; zdjęcia są realne i lokalne; oba główne słowa kluczowe mają dedykowane silne podstrony; WordPress edytuje treści; są działania przygotowujące indeksację; nie ma broken links, demo treści, fikcyjnych opinii, pustych sekcji, niewyjaśnionych placeholderów ani śladów generatora.

Zacznij wdrażać projekt w kodzie. Nie kończ odpowiedzi na samym planie.