# Plan lokalnego SEO — Stalowa Wola

Priorytet A: **serwis klimatyzacji Stalowa Wola**.
Priorytet B: **serwis AGD Stalowa Wola**.
Wspierające: montaż klimatyzacji, naprawa klimatyzacji, czyszczenie/odgrzybianie klimatyzacji, naprawa pralek, naprawa zmywarek — tylko jeśli potwierdzone ofertą.

## Mapa intencji / przykładowe metadata

| Strona | H1 (widoczny) | Roboczy Title |
|---|---|---|
| `/` | Naprawiamy. Montujemy. Przywracamy komfort. | Serwis klimatyzacji i AGD Stalowa Wola — Damian Cebula |
| `/serwis-klimatyzacji-stalowa-wola/` | Serwis klimatyzacji Stalowa Wola | Serwis klimatyzacji Stalowa Wola — Damian Cebula |
| `/serwis-agd-stalowa-wola/` | Serwis AGD Stalowa Wola | Serwis AGD Stalowa Wola — naprawa urządzeń |
| `/realizacje/` | Realizacje klimatyzacji i serwisu AGD | Realizacje montażu i serwisu — Damian Cebula |
| `/o-firmie/` | Damian Cebula — lokalny serwis w Stalowej Woli | O firmie — Damian Cebula, Stalowa Wola |
| `/kontakt/` | Kontakt — Damian Cebula, Stalowa Wola | Kontakt — Serwis klimatyzacji i AGD |

Home SEO powinno również zawierać dobrze widoczny H2 „Serwis klimatyzacji i AGD w Stalowej Woli” — zachowaj slogan H1 z makiety. Nie powtarzaj tych samych bloków tekstu na wszystkich stronach.

## Plan treści
Klimatyzacja: prawdziwy zakres, urządzenia, kiedy robić przegląd, etapy, konserwacja, FAQ, realizacje, telefon. AGD: realnie obsługiwane sprzęty, objawy usterek, etap diagnozy/naprawy, FAQ, telefon. Każda podstrona ma własne fotografie/odpowiednie ALT i wewnętrzne linkowanie. Wykorzystaj pierwszoosobowe doświadczenia i konkretne procesy serwisowe, zamiast ogólników.

## On-page i techniczne
- Jedno H1 / stronę, semantyczne H2/H3, poprawne `lang=pl-PL`, breadcrumbs, deskr. URL bez polskich znaków.
- Unikalne meta Title i Description, OG, Twitter; `rel=canonical` zgodny z URL, jeden zestaw. Zachowaj domenę bez `www`, HTTPS.
- WordPress / wtyczka SEO: jedna aktywna sitemap (docelowo `/sitemap_index.xml` jeśli istniejąca wtyczka ją utrzymuje). GSC weryfikacja i zgłoszenie po publikacji; nie podawaj „zindeksowano”, zanim nie sprawdzisz.
- Schema: `LocalBusiness` lub właściwszy `HVACBusiness`, `Service` dla obu usług, `BreadcrumbList`, ewentualnie `FAQPage` zgodne z zasadami i widoczną treścią. Nie duplikuj kodu w Rank Math/AIOSEO i motywie.
- Właściwe dane: nazwa, tel., e-mail, URL, `areaServed: Stalowa Wola`. Adres, geokoordynaty, openingHours, VAT/NIP, mapa i profil Google tylko z potwierdzonego źródła.
- Self-serving review markup nie daje uprawnienia do gwiazdek w Google dla LocalBusiness; nie implementuj fałszywego `aggregateRating`.
- Wydajność: prawdziwe WebP, kompresja, responsywne rozmiary zdjęć, LCP hero bez lazy-loading, reszta lazy, preconnect tylko jeśli potrzebny, dopracowane mobile.
- Indeksacja: sprawdź robots i nagłówki `X-Robots-Tag`, przekierowania starych URL, 404, canonical, noindex z trybu development usunięte przed publikacją.
- Linkowanie i profil firmy: spójny NAP z Google Business Profile po weryfikacji; realne referencje i dane, a nie sztuczne linki/katalogi.
- Nie tworzyć klonów treści dla Niska, Tarnobrzega itd. bez rzeczywistego obszaru działania, unikalnej wartości i zgody właściciela.

## Kryteria testowe
- Crawlowalne strony zwracają 200 i poprawne canonical; nie mają noindex.
- Wszystkie obrazy lokalnie podawane, ALT rzeczowe, linki bez błędów.
- Lighthouse/PageSpeed, Rich Results Test, Search Console URL Inspection w planie publikacji.
- Dokumentacja mapy przekierowań, jeśli zmianie ulegnie którykolwiek stary adres.
- Nie ma gwarancji określonej pozycji SEO.

Wytyczne: https://developers.google.com/search/docs/fundamentals/seo-starter-guide oraz https://developers.google.com/search/docs/appearance/structured-data/local-business
