# Testy i ograniczenia — DC Serwis 1.4

Testowano 2026-11-06 na odrębnej lokalnej instalacji WordPress 7.1.4 / PHP 8.3 / MariaDB 11.4. Produkcyjna baza i pliki nie zostały zmienione.

- PASS: 49 kombinacji siedmiu stron i siedmiu szerokości (1440, 768, 390, 360, 1024, 1280, 1536). Jeden H1, polski język, canonical, brak poziomego przewijania, lokalne obrazy i podpis twórcy. Działają AJAX, historia, lightbox, menu mobilne i formularz bez JS.
- PASS: 14 kontroli axe WCAG A/AA na wszystkich stronach przy 1440 i 390 px, bez wykrytych naruszeń w testowanym interfejsie i lokalnej atrapie mapy.
- PASS: rzeczywiste stare przycięcie logo WordPressa 220 × 64 px odwołuje się do oryginalnego PNG 2048 px. Cztery szerokości (1440/768/390/360), ekran Retina DPR2, dostateczna liczba pikseli źródła, brak miniatur srcset/sizes, czytelne napisy, dopasowane marginesy i brak zdublowanej nazwy. Zachowano ustawienie wybranego logo; przywrócono je po teście. Sprawdzono również pozostawienie osobnego symbolu i odrzucenie rodzica będącego stroną zamiast obrazem.
- PASS: mapa jest automatycznie osadzana w Kontakcie na desktopie i mobile, po powrocie przez AJAX oraz bez JavaScript. Nie ma przycisku zgody. Przy zablokowanej ramce pozostaje adres i odnośnik. Wszystkie żądania Google w tych testach są przechwytywane; testy nie potwierdzają dostępności prawdziwego Google Maps na hostingu.
- PASS: integracje PHP — bezpieczna normalizacja pełnych linków i kodu iframe Google, odrzucanie obcych hostów/HTML/skróconych linków, zachowanie zapisanej własnej mapy, domyślny potwierdzony adres, wyłączanie mapy i brak fikcyjnych opinii. Ustawienia po teście niezmienione.
- PASS: siedem unikalnych tytułów/opisów, canonical, schema bez fikcyjnych ocen, spójny adres, wszystkie wewnętrzne linki (także polityka), prawidłowe 404. Lokalna instalacja celowo pozostaje noindex.
- PASS: synchronizacja zaktualizowała zarządzaną politykę z opisem bezpośredniej mapy, pozostawiając ręczne zmiany. Nie zmieniano logiki importera.
- PASS: składnia wszystkich 22 plików PHP motywu i zmienionych skryptów JS. ZIP 1.4.0 ma właściwy katalog dc-serwis/, 72 pliki motywu, poprawne CRC i nie zawiera plików środowiska ani repozytorium.

Wyniki JSON: [browser](test-results/browser.json), [accessibility](test-results/accessibility.json), [branding](test-results/branding.json), [map](test-results/map.json), [SEO](test-results/seo.json), [podsumowanie 1.4](test-results/version-1.4.json). Zrzuty logo i mapy w [aktualizacji wizualnej](VISUAL_COMPARISON.md). Test logo używa syntetycznego materiału, zrzuty mapy pokazują jawną atrapę Google. Pełne zrzuty wszystkich stron są w artifacts/screenshots/.

Testy galerii, animacji, nawigacji, Rank Math i przechwyconej wysyłki formularza z wcześniejszych wersji pozostają w repozytorium; nie są przedstawiane jako ponowne pomiary 1.4. Odbiorca formularza nadal wynosi kontakt@damiancebula-serwis.pl. Nie wysyłano testowego e-maila na tę skrzynkę. Konfiguracja rzeczywistego SMTP wymaga hostingu — patrz [instrukcja](MAIL_DELIVERY.md).

Nie zmieniono Hostinger, DNS, indeksacji Google ani starej witryny. Wersja w repozytorium wymaga instalacji ZIP na nowej witrynie. Nie wykonywano nowych pomiarów produkcyjnych Core Web Vitals ani zewnętrznej usługi Google. Własna polityka prywatności i ręcznie edytowane strony nie są nadpisywane; ich opis mapy należy uaktualnić zgodnie z faktyczną konfiguracją.
