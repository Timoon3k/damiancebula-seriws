# Damian Cebula — WordPress / DC Serwis

Autorski, wielostronicowy motyw PHP + Gutenberg z automatyczną instalacją stron i zdjęć dla serwisu klimatyzacji i AGD w Stalowej Woli. Zawiera sześć układów stron, lokalne fotografie realizacji, formularz z wymaganą zgodą na przetwarzanie danych, progresywną nawigację AJAX i animacje, fallback SEO oraz konfigurowalne miejsca na Google Maps i opinie Trustindex.

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

Wersja 1.4 zawiera czytelne pełne logo, galerie bez przycinania i wyraźne animacje AJAX na komputerze i telefonie. Scrollspy jest wyłączony; sticky menu nadal działa. Zachowane są edytowalny adres firmy, polityka i mapa. Automatycznie zakłada sześć stron, bibliotekę zdjęć i menu na nowej instalacji; kolejne synchronizacje zachowują ręczne edycje. Kod jest testowany w odrębnym lokalnym WordPressie, a produkcja pozostaje bez zmian. Mapa Google używa podanego adresu firmy jako domyślnego celu i wczytuje się automatycznie w Kontakcie, bez przycisku zgody, również bez JavaScript; można podać własny link lub kod osadzenia. Shortcode opinii pozostaje do samodzielnego uzupełnienia przez właściciela. Motyw nie wymyśla adresu, ocen ani godzin pracy. Zachowuje istniejące treści i politykę prywatności podczas aktywacji — nie zawiera eksportu produkcyjnej bazy.

Dostęp do obecnej witryny i API GitHuba był blokowany polityką proxy. Nowa polityka prywatności powstaje automatycznie na osobnej instalacji; istniejący dokument i ręczne zmiany są zachowywane. Przed publikacją sprawdź rzeczywistą konfigurację usług zewnętrznych i poczty oraz politykę prywatności. Nie deklarujemy zgodności pixel-perfect ani wyników Core Web Vitals bez odpowiednich pomiarów. Pełny stan testów i PR opisuje raport.

Dane potwierdzone: **Damian Cebula**, **794 225 139**, **kontakt@damiancebula-serwis.pl**, **damiancebula-serwis.pl**. Nie umieszczaj haseł, konfiguracji produkcyjnego WordPressa ani eksportów baz w repozytorium.
