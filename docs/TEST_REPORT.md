# Testy i ograniczenia — DC Serwis 1.5

Testowano 2026-11-06 na odrębnej lokalnej instalacji WordPress 7.1.4 / PHP 8.3.36 / MariaDB 11.4. Środowisko po wznowieniu działa, testowy WordPress odpowiada pod http://127.0.0.1:8081. Nie zmieniano produkcyjnej witryny, jej bazy ani przypisania domeny.

- PASS: 49 kombinacji siedmiu stron i siedmiu szerokości (1440/768/390/360/1024/1280/1536). Brak poziomego przewijania, jeden H1, poprawny język i canonical, dostępne obrazy, podpis twórcy, AJAX/historia, lightbox, mobilne menu oraz formularz i nawigacja bez JavaScript.
- PASS: 15 kontroli axe WCAG A/AA — siedem stron desktop/mobile oraz otwarte mobilne menu modalne. Brak wykrytych naruszeń w badanym interfejsie.
- PASS: drawer na 360/390/768 px jest zakotwiczony po prawej i używa natywnego dialogu modalnego. Jedno menu jest przenoszone, nie kopiowane. Sprawdzono blokadę tła, Tab/Shift+Tab, Escape/przycisk/kliknięcie tła, przywrócenie scrollY650, powrót fokusu i przeniesienie menu do nagłówka po zmianie rozmiaru na desktop.
- PASS: rzeczywista animacja wysuwania panelu i przejścia AJAX przy emulacji dotyku (isMobile/hasTouch). Zamknięcie panelu nie odbiera fokusu nowej podstronie. Sticky nadal rezerwuje miejsce i nie zmienia aktywnego linku podczas przewijania; scrollspy pozostaje wyłączony.
- PASS: 12 przejść między sześcioma trasami na desktopie i telefonie. Próbki z działających animacji potwierdzają zmianę opacity/transform oraz maski clip-path tytułu i przesłony. Przejścia nie wymagają View Transitions API. Sprawdzono Wstecz i dwie szybkie zmiany adresu bez pozostawionej przesłony lub aria-busy.
- PASS: tekst odsłania się podczas przewijania bez animowania całych długich sekcji. Po zakończeniu znika przycięcie, a powrót do tego samego tekstu nie uruchamia go ponownie. Ograniczony ruch wyłącza animacje, a bez JS treść pozostaje widoczna.
- PASS: dodatkowy przegląd i kontrole read-only — brak showModal pozostawia zwykłą nawigację i działający AJAX; przejście na desktop podczas animacji zamykania przywraca pojedyncze menu, zamyka dialog i odblokowuje stronę. Brak nowych błędów JS.
- PASS: składnia zmienionego header.php i skryptów JS, git diff --check. ZIP1.5.0: 72 pliki, katalog dc-serwis/ na górze, poprawne CRC i wersja, bez plików środowiska.

Wyniki: [browser](test-results/browser.json), [accessibility](test-results/accessibility.json), [navigation](test-results/navigation.json), [motion](test-results/motion.json), [podsumowanie 1.5 i SHA256 ZIP](test-results/version-1.5.json). Zrzuty trzech szerokości i otwartego menu są w [porównaniu wizualnym](VISUAL_COMPARISON.md); wszystkie pełne strony w artifacts/screenshots/. Kontrole bez ruchu dokumentują finalny wygląd, a test motion mierzy uruchomione animacje.

Mapa pozostaje osadzona bezpośrednio w Kontakcie. Jej żądania są zastępowane atrapą lub blokowane w testach; nie sprawdzano dostępności prawdziwego Google Maps na hostingu. Logo, odbiorca kontakt@damiancebula-serwis.pl, konfiguracja adresu i treści pozostają zachowane. Nie wysyłano wiadomości na prawdziwą skrzynkę. Rzeczywiste SMTP, indeksacja Google, dostępność zewnętrznych wtyczek i produkcyjne Core Web Vitals nie były zmieniane ani potwierdzane.

Aktualizację trzeba zainstalować ZIP-em na nowej, oddzielnej witrynie Hostinger i wyczyścić cache. Sam push nie wdraża plików na hosting. Instrukcja: [aktualizacja 1.5](UPDATE_1_5.md).

## Wcześniejsza weryfikacja 1.4


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
