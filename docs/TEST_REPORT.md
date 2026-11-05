# Testy i ograniczenia

PASS: 42 kombinacje sześciu stron i siedmiu szerokości; AJAX, Wstecz, galeria klawiaturowa, menu mobilne, formularz bez JS. Wszystkie sześć stron przechodzi walidację bloków Gutenberg. PASS: 12 kontroli axe WCAG A/AA, lint PHP/JS, nonce, honeypot, zgoda, walidacja, limit prób i przechwycone lokalnie sukces/błąd poczty. Żadnego testowego e-maila nie wysłano. Wyniki w `test-results/`.

Lighthouse mobile: performance/accessibility/best-practices 100; LCP 1,1 s, CLS 0,004, TBT około 0 ms. SEO 69 przez celowy lokalny noindex. To pomiar lokalny, nie gwarancja CWV produkcji. Setup/start i instalacja npm z lockfile sprawdzone.

Polityki produkcyjnej nie zaimportowano z powodu odmowy proxy; jej lokalny URL zwraca 404 i nie jest zaliczonym testem. Motyw zachowuje istniejącą politykę przy aktywacji. Przed wdrożeniem wymagane są kontrola polityki, SMTP, sitemap i indeksacji. Mapa i opinie pozostają puste do uzupełnienia przez właściciela. Produkcja bez zmian.
