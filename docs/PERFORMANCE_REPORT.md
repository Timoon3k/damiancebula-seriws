# Wydajność — Architectural Service 2.0.0

Pomiar wykonano 2026-11-06, 22:25–22:29 UTC na oddzielnym lokalnym WordPressie `127.0.0.1:8081`, PHP 8.3.36, WordPress 7.1.4. To wyniki laboratoryjne; nie opisują wydajności produkcji ani rzeczywistych Core Web Vitals.

Lighthouse **13.6.0**, Chromium **155.0.8059.79**, 18 kolejnych pomiarów: trzy zimne uruchomienia przeglądarki dla trzech stron w dwóch trybach. Mobilnie użyto symulacji slow 4G i CPU ×4; desktop korzysta z presetu Lighthouse. Lokalny PHP/baza mogły mieć ciepły cache. Dokładne ustawienia, ostrzeżenia, zasoby i wszystkie wyniki zapisano w [raporcie JSON](test-results/architectural/performance-architectural.json).

| Tryb | Strona | LCP, mediana | CLS, mediana | TBT, mediana | Wynik performance, mediana |
|---|---|---:|---:|---:|---:|
| Telefon | Główna | 2258 ms | 0 | 23 ms | 99 |
| Telefon | Klimatyzacja | 2115 ms | 0 | 45 ms | 99 |
| Telefon | AGD | 1668 ms | 0 | 0 ms | 100 |
| Desktop | Główna | 513 ms | 0 | 0 ms | 100 |
| Desktop | Klimatyzacja | 523 ms | 0 | 0 ms | 100 |
| Desktop | AGD | 410 ms | 0 | 0 ms | 100 |

Jeden mobilny pomiar AGD zgłosił ostrzeżenie o wolniejszym CPU środowiska (TBT 178 ms, wynik 97); zachowano go w zestawie, bez odrzucania prób.

Wszystkie mediany spełniły lokalne cele LCP ≤2500 ms i CLS ≤0,1. Pliki runtime motywu pozostały identyczne przez cały pomiar: fingerprint SHA256 `feae1825c43c49c873d5527db8dba6a5a69f724e94bf158ef3bf8a54499b8d60`. W raporcie Git HEAD wskazuje bazowy `c007e40`, ponieważ pomiar wykonano przed commitem; to fingerprint identyfikuje faktycznie zmierzone nowe pliki 2.0.0.

## Reakcje na dotyk

W osobnym teście wykonano 12 rzeczywistych zdarzeń dotykowych Playwright: otwieranie/zamykanie menu i FAQ, z faktycznym throttlingiem CDP CPU ×4 oraz reduced motion. Event Timing zarejestrował 12 pogrupowanych interakcji; najdłuższa i syntetyczny p98 wyniosły **136 ms**. Próg obserwatora to 16 ms.

**Nie zmierzono INP użytkowników.** Ten krótki scenariusz nie jest reprezentatywnym percentylem ruchu, a TBT Lighthouse nie jest INP. Odbiór celu INP ≤200 ms na produkcji wymaga danych rzeczywistych użytkowników po odrębnym wdrożeniu.

## Zasoby i odtworzenie

Motyw używa dwóch lokalnych fontów WOFF2, natywnych API animacji i lekkiego JS. Nowe ilustracje mają WebP 480/960/1536, srcset, sizes oraz deklarowane wymiary. Hero jest eager/high priority; pozostałe obrazy zachowują lazy loading. Nie dodano biblioteki animacyjnej ani usługi fontów. Lokalny początkowy transfer mobilny w pomiarze wynosił około 310 kB / 183 kB / 116 kB odpowiednio dla home/Klimatyzacji/AGD; to nie całkowita wielkość wszystkich obrazów po przewinięciu.

```sh
npm install --prefix /tmp/dc-performance --ignore-scripts lighthouse@13.6.0
node scripts/performance-audit.mjs --runs=3
```

Skrypt obsługuje wyłącznie localhost. Uruchamiaj bez równoległych testów Chromium i bez zmian motywu. Surowe 18 raportów znajduje się w `artifacts/performance-architectural/raw/`, podsumowanie w `artifacts/performance-architectural/summary.json`. Zestawienie JSON w dokumentacji zawiera metryki, ustawienia i próbki zdarzeń; surowe duże pliki pozostają artefaktami lokalnymi.

Lokalny serwer, cache, opóźnienia sieci i zestaw wtyczek różnią się od Hostinger. Produkcyjne widgety Trustindex/Google mogą wpływać na wynik; nie założono ich braku na produkcji. Mapa jest na osobnej stronie Kontakt i jej testy korzystają z atrapy. Nie potwierdzono produkcyjnego CDN, kompresji, cache LiteSpeed, SMTP ani wydajności usług zewnętrznych.
