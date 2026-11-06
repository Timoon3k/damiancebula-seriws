# Testy i ograniczenia — DC Serwis 1.1

Środowisko: osobny WordPress 7.1.4 / PHP 8.3 / MariaDB 11.4, odrębna lokalna baza. Dane wynikowe w `test-results/`.

- PASS: czysta aktywacja automatycznie tworzy sześć stron z końcowymi URL, menu i 15 pozycjami fotografii w bibliotece Mediów. Bez ręcznego dodawania wzorców.
- PASS: natychmiastowa kolejna synchronizacja bez zmian; stabilne ID stron/mediów, brak duplikatów; zachowane ręczne edycje, obce strony, indeksacja, polityka i ustawienia Google.
- PASS: odtworzenie brakującej zarządzanej strony i kolejności menu; zmiana adresu aktualizuje linki i media, bez podwójnego prefiksu i nowych załączników.
- PASS: 42 kombinacje sześciu stron i siedmiu szerokości; obrazy załadowane, brak overflow, jeden H1, AJAX, Wstecz, galeria klawiaturą, menu i formularz bez JS. Automatyczne asercje rozdzielają ilustracyjne zdjęcia usług od prawdziwych zdjęć galerii.
- PASS: poprawność bloków Gutenberg wszystkich sześciu stron i 12 kontroli axe WCAG A/AA, bez wykrytych naruszeń.
- PASS: nonce, honeypot, zgoda, walidacja e-mail, limit prób, sukces/błąd AJAX formularza. Poczta przechwycona lokalnie — żadnego testowego e-maila nie wysłano.
- PASS: lint PHP/JS; unikalne metadata, canonical, JSON-LD, odnośniki i prawdziwy 404 (z wyjątkiem jawnie niezaimportowanej polityki).

Lighthouse 13.6 mobile, pojedynczy pomiar lokalny: performance 97, accessibility 100, best-practices 100, SEO 69 przez celowy noindex. LCP 1,7 s, CLS 0, TBT około 180 ms. Nie jest to gwarancja CWV produkcji ani pomiar INP z rzeczywistych wizyt.

Produkcja nie została zmieniona. Istniejącej polityki prywatności nie zaimportowano z powodu niedostępnego połączenia z hostingiem; jej lokalny adres zwraca 404 i nie jest zaliczonym testem. Przed przepięciem domeny wymagane są skopiowanie rzeczywistej polityki do nowej instalacji, kontrola SMTP, sitemap, SSL i indeksacji. Mapa oraz opinie pozostają puste do samodzielnego uzupełnienia. Domyślne treści WordPressa nie są usuwane — panel raportuje je do weryfikacji. Automatyczny import nie zastępuje wdrożenia plików na Hostinger.
