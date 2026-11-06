# Testy i ograniczenia — DC Serwis 1.3

Testowano lokalnie na odrębnej instalacji WordPress 7.1.4 / PHP 8.3 / MariaDB 11.4. Produkcja nie została zmieniona.

- PASS: 49 kombinacji siedmiu stron i siedmiu szerokości, AJAX, historia, obrazy, formularz i menu bez JS. Brak overflow, jeden H1, podpis twórcy obecny.
- PASS: 14 kontroli axe WCAG A/AA bez wykrytych naruszeń.
- PASS: galerie home/Klimatyzacja/Realizacje przy 1440/768/390 — całe zdjęcia, proporcje, podpisy, lightbox i fokus.
- PASS: ciemne pełne logo z dużymi przezroczystymi marginesami — automatyczne dopasowanie i kontrast, czytelne rozmiary 1440/768/390/360, brak zdublowanej nazwy. Ustawienia logo przywrócono po teście.
- PASS: zwykłe podstrony zamiast scrollspy, sticky bez skoku treści, wszystkie pozycje menu desktop/mobile, Wstecz i obsługa klawiatury.
- PASS: rzeczywiste animacje opacity/transform w czasie działania, wyjście/wejście/tytuł/smuga na sześciu trasach desktop/mobile bez View Transitions API; wejście home, reveal, szybkie kliknięcia, Wstecz, reduced motion.
- PASS: formularz — nonce, honeypot, zgoda, e-mail, limit prób, AJAX i przechwycony transport. Dokładny odbiorca kontakt@damiancebula-serwis.pl oraz Reply-To zostały sprawdzone. Żadnego testowego e-maila nie wysłano na prawdziwą skrzynkę.
- PASS: lint PHP/JS. Wcześniejsze testy wersji 1.2 dla mapy, Rank Math, adresu, polityki i idempotencji pozostają w repozytorium; nie przedstawiamy ich jako nowych testów tej zmiany.

Dane w test-results/, zrzuty w visual/ i artifacts/screenshots/. Brak dostępu do transportu pocztowego Hostinger oznacza brak potwierdzenia rzeczywistego dostarczenia do skrzynki. Skonfiguruj SMTP i zweryfikuj dostarczalność zgodnie z MAIL_DELIVERY.md. Google/Hostinger/indeksacja i produkcyjne CWV nie były zmieniane ani weryfikowane.
