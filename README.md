# Damian Cebula — WordPress / DC Serwis

Autorski, wielostronicowy motyw PHP + Gutenberg dla serwisu klimatyzacji i AGD w Stalowej Woli. Wersja **2.0.0 — Architectural Service** zastępuje dotychczasową czerń i pomarańcz jasną porcelaną, petrolem, szałwią i miedzią. Asymetryczne układy, lokalny Manrope oraz nowe ilustracyjne fotografie wnętrz tworzą indywidualną oprawę. Autentyczne realizacje, istniejące treści SEO i adresy stron pozostają chronione.

- [Kierunek Architectural Service i ochrona treści](docs/ARCHITECTURAL_DESIGN.md)
- [Aktualizacja 2.0 — instalacja na stagingu](docs/UPDATE_2_0.md)
- [Motyw i edycja w WordPress](wp-content/themes/dc-serwis/README.md)
- [Raport testów](docs/TEST_REPORT.md)
- [Porównanie wyglądu i zrzuty](docs/VISUAL_COMPARISON.md)
- [Raport ochrony SEO](docs/SEO_PROTECTION_REPORT.md)
- [Raport wydajności](docs/PERFORMANCE_REPORT.md)
- [Lokalny krój Manrope i licencja](docs/FONTS.md)
- [Źródła fotografii](assets/SOURCES.md)
- [Formularz i SMTP](docs/MAIL_DELIVERY.md)
- [Konfiguracja Rank Math](docs/RANK_MATH_SEO.md)
- [Automatyczna instalacja i synchronizacja](docs/AUTOMATIC_SETUP.md)
- [Lokalny WordPress w Dockerze](dev/README.md)
- [Migracja i SEO](docs/MIGRATION_CHECKLIST.md)

## Szybki start

```sh
cd /workspace/damiancebula-seriws
bash dev/setup.sh
bash dev/start.sh
export BASE_URL=http://127.0.0.1:8080
npm ci
npm run test:browser
npm run test:a11y
npm run test:motion
npm run test:preservation
python3 scripts/package-theme.py
```

Dla już uruchomionego, izolowanego WordPressa wskaż jego adres przez `BASE_URL`, np. `http://127.0.0.1:8081`. Polecenia testów i wymagane fixture opisuje raport testów. Archiwum powstaje jako `artifacts/dc-serwis.zip`, zawierające wyłącznie katalog `dc-serwis/` na najwyższym poziomie. Zrzuty wszystkich siedmiu stron w szerokościach 1440/768/390 zapisuje test przeglądarkowy w `artifacts/screenshots/`; pełne porównania przed/po wszystkich stron znajdują się w `docs/visual/architectural/`.

## Zakres wersji 2.0

Duże, natychmiast widoczne hero ma jeden przycisk kontaktu. Klimatyzacja i AGD otrzymują różne kompozycje; sekwencja serwisu, lokalność, nieregularne galerie, formularz i polityka mają własne układy. Rozpoznawalne logo DC ma wariant kolorystyczny na jasny nagłówek; favicon pozostaje bez zmian. Fotografie wnętrz są ilustracjami, a zdjęcia realizacji nadal pokazują prace właściciela, w dotychczasowej kolejności i z dotychczasowymi ALT oraz podpisami.

Usunięto migawkę tekstu, pełnoekranową przesłonę, maskowanie i przygaszanie podczas AJAX. Wybrane grupy poniżej pierwszego widoku pojawiają się jeden raz przez łagodne przesunięcie o 16 px i zmianę przezroczystości. Hero i całe `main` pozostają widoczne. Ograniczony ruch i brak JavaScript pozostawiają treść bez animacji. Mobilne menu nadal wysuwa się z prawej jako modal, a nawigacja zachowuje pełne URL, historię i aktualizację metadanych. Scrollspy pozostaje wyłączony.

Redesign nie zapisuje tekstów ani ustawień SEO do bazy. Zachowuje H1–H3, politykę prywatności, linkowanie, metadane, schema i konfigurację Rank Math. Dodaje jeden przycisk kontaktu w hero oraz powtórzenie istniejącej nawigacji w stopce. Lokalny test porównawczy jest odrębny od wymaganego audytu produkcji; rzeczywiste ograniczenia opisuje raport ochrony SEO.

Mapa jest osadzona w Kontakcie bez przycisku zgody, z adresem firmy jako domyślnym celem; własny link można podać w Dostosuj. Opinie Trustindex pozostają do skonfigurowania przez właściciela, bez fikcyjnych ocen. Formularz z checkboxem prywatności kieruje wiadomości do **kontakt@damiancebula-serwis.pl**. Faktyczne doręczenie zależy od poprawnego transportu `wp_mail` / SMTP. Stopka zachowuje podpis **majewskitomasz.pl**.

## Granice wdrożenia

Gałąź pracy: `design/architectural-service`, wyjściowy commit `main`: `c007e40` (1.6.0). Ta zmiana jest przygotowywana do Pull Requesta; nie obejmuje merge do `main`, wdrożenia produkcyjnego, zmiany DNS ani zapisów do produkcyjnej bazy. Instaluj paczkę dopiero na odrębnym stagingu, z kopią bezpieczeństwa i kontrolą dotychczasowych ustawień. Aktywacja i synchronizacja nadal chronią ręcznie edytowane strony.

Dostęp środowiska do obecnej witryny i API GitHuba był blokowany przez politykę proxy. Zapisanie projektu konfiguracji sieci nie oznacza jej zastosowania. Status audytu produkcyjnego, PR oraz rzeczywiste wyniki testów i pomiarów znajdują się w raportach; dokumentacja założeń nie stanowi potwierdzenia publikacji ani spełnienia Core Web Vitals.

Dane potwierdzone: **Damian Cebula**, **794 225 139**, **kontakt@damiancebula-serwis.pl**, **damiancebula-serwis.pl**, **Aleje Jana Pawła II 42, 37-450 Stalowa Wola**. Nie umieszczaj haseł, konfiguracji produkcyjnego WordPressa ani eksportów baz w repozytorium.

Dokumentacja historyczna: [1.6](docs/UPDATE_1_6.md), [założenia 1.6](docs/PREMIUM_DESIGN.md), [1.5](docs/UPDATE_1_5.md), [pierwotna makieta](design/reference/makieta-uklad-strony-1-1.jpg). Pierwotna ciemna makieta jest punktem historycznym, a nie celem zgodności 1:1 dla wersji 2.0.
