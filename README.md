# Damian Cebula — WordPress / DC Serwis

Autorski, wielostronicowy motyw PHP + Gutenberg dla serwisu klimatyzacji i AGD w Stalowej Woli. Wersja 1.6 nadaje witrynie spokojniejszy, przestronny wygląd w czerni, graficie i pomarańczu, z dużą fotografią oraz lokalnym krojem Manrope. Zachowuje treści SEO, adresy podstron i fotografie realizacji. Zawiera automatyczną instalację stron i zdjęć, formularz z wymaganą zgodą na przetwarzanie danych, progresywną nawigację AJAX i animacje, fallback SEO oraz konfigurowalne Google Maps i opinie Trustindex.

- [Aktualizacja 1.6 — nowy wygląd premium](docs/UPDATE_1_6.md)
- [Założenia wyglądu 1.6 i zachowanie treści](docs/PREMIUM_DESIGN.md)
- [Lokalny krój Manrope i licencja](docs/FONTS.md)
- [Aktualizacja 1.5 — mobilne menu i animacje migawki](docs/UPDATE_1_5.md)
- [Aktualizacja 1.4 — ostre logo i mapa w Kontakcie](docs/UPDATE_1_4.md)
- [Formularz i SMTP](docs/MAIL_DELIVERY.md)
- [Konfiguracja Rank Math i wyników Google](docs/RANK_MATH_SEO.md)
- [Automatyczna instalacja i synchronizacja](docs/AUTOMATIC_SETUP.md)
- [Motyw i instrukcja instalacji](wp-content/themes/dc-serwis/README.md)
- [Lokalny WordPress w Dockerze](dev/README.md)
- [Testy i ograniczenia](docs/TEST_REPORT.md)
- [Porównanie z makietą](docs/VISUAL_COMPARISON.md)
- [Migracja i SEO](docs/MIGRATION_CHECKLIST.md)
- [Wymagania projektu](CODEX_PROMPT.md)
- [Makieta referencyjna](design/reference/makieta-uklad-strony-1-1.jpg)
- [Źródła fotografii](assets/SOURCES.md)

## Szybki start w środowisku chmurowym

```sh
cd /workspace/damiancebula-seriws
bash dev/setup.sh
bash dev/start.sh
npm ci
npm run test:browser
npm run test:editor
npm run test:a11y
python3 scripts/package-theme.py
```

Archiwum powstaje jako `artifacts/dc-serwis.zip`, z katalogiem `dc-serwis/` na najwyższym poziomie, gotowym do instalacji przez panel. Screenshoty 1440/768/390 zapisuje test przeglądarkowy w `artifacts/screenshots/`; porównania i wybrane zrzuty znajdują się w `docs/visual/`.

## Status i granice wdrożenia

Wersja 1.6 zmienia warstwę wizualną: większy fotograficzny hero, otwarte sekcje usług, więcej przestrzeni w procesie obsługi i dwukolumnowe teksty na szerokich ekranach. Formularz, FAQ, dłuższe treści i galerie korzystają ze wspólnej typografii i spokojniejszych akcentów. Mobilna galeria na stronie głównej przewija się natywnie w poziomie. Na życzenie właściciela nowy projekt rozwija pierwotną makietę; nie jest deklarowany jako jej odwzorowanie 1:1. Zakres i instalację opisuje [instrukcja 1.6](docs/UPDATE_1_6.md), a aktualny stan weryfikacji — [raport testów](docs/TEST_REPORT.md).

Pozostają mobilne menu wysuwane z prawej jako panel modalny, przejścia AJAX na telefonach i komputerach oraz odsłanianie tekstu przy przewijaniu efektem migawki. Ustawienie ograniczenia ruchu pozostawia tekst widoczny bez animacji. Scrollspy jest wyłączony; sticky nagłówek pozostaje. Redesign nie zmienia tekstów SEO, nagłówków H1–H3, URL, metadanych, schema ani plików fotografii, także ilustracyjnych `editorial-*`. Kontrola zachowania treści obejmuje siedem publicznych stron i sumy kontrolne 29 chronionych plików obrazów; jej wynik należy sprawdzić w raporcie.

Zachowane są ostre logo z oryginalnego pliku lub domyślnego SVG, galerie bez przycinania, edytowalny adres firmy i polityka prywatności. Motyw automatycznie zakłada sześć stron, bibliotekę zdjęć i menu na nowej instalacji; kolejne synchronizacje zachowują ręczne edycje. Mapa Google używa podanego adresu firmy jako domyślnego celu i wczytuje się automatycznie w Kontakcie, bez przycisku zgody, również bez JavaScript; można podać własny link lub kod osadzenia. Shortcode opinii pozostaje do samodzielnego uzupełnienia przez właściciela. Formularz kieruje wiadomości na **kontakt@damiancebula-serwis.pl**, a faktyczne doręczenie wymaga prawidłowego transportu pocztowego.

ZIP instaluj wyłącznie w nowej, oddzielnej instancji WordPress. Aktualizacja repozytorium nie zmienia starej witryny, jej bazy ani przypisania domeny i nie uruchamia automatycznego wdrożenia na Hostinger. Motyw zachowuje istniejące treści i politykę podczas aktywacji; nie zawiera eksportu produkcyjnej bazy. Nie dopisuje niepotwierdzonych danych firmy, ocen ani godzin pracy.

Dostęp do obecnej witryny i API GitHuba był blokowany polityką proxy. Nowa polityka prywatności powstaje automatycznie na osobnej instalacji; istniejący dokument i ręczne zmiany są zachowywane. Przed publikacją sprawdź rzeczywistą konfigurację usług zewnętrznych i poczty oraz politykę prywatności. Nie deklarujemy zgodności pixel-perfect ani wyników Core Web Vitals bez odpowiednich pomiarów. Pełny stan testów i PR opisuje raport.

Dane potwierdzone: **Damian Cebula**, **794 225 139**, **kontakt@damiancebula-serwis.pl**, **damiancebula-serwis.pl**. Nie umieszczaj haseł, konfiguracji produkcyjnego WordPressa ani eksportów baz w repozytorium.
