# Damian Cebula — WordPress / DC Serwis

Autorski, wielostronicowy motyw PHP + Gutenberg dla serwisu klimatyzacji i AGD w Stalowej Woli. Wersja **3.0.0 — niebieska makieta** odtwarza główny projekt po lewej stronie nowej planszy właściciela: granat, błękit i biel, znak ze śnieżynką, ukośne hero, dwa panele usług oraz sekcję korzyści. Mapa Google, Trustindex, kontakt i dotychczasowy target lokalnego SEO pozostają zachowane. Prawdziwe realizacje nadal przedstawiają prace Damiana Cebuli; nowe sceny hero i modela są oznaczonymi ilustracjami.

- [Bieżący zakres 3.0, porównanie, SEO i edycja](docs/REFERENCE_3_0.md)
- [Instalacja i aktualizacja motywu 3.0](wp-content/themes/dc-serwis/UPDATE_3_0.md)
- [Interaktywne porównanie wyglądu 2.1 / 3.0](docs/visual/reference/index.html)
- [Historyczna aktualizacja 2.1](docs/UPDATE_2_1.md)
- [Historyczne wyniki i ograniczenia 2.1](docs/REFINEMENT_2_1_REPORT.md)
- [Historyczny kierunek Architectural Service](docs/ARCHITECTURAL_DESIGN.md)
- [Bazowa aktualizacja 2.0 — instalacja na stagingu](docs/UPDATE_2_0.md)
- [Motyw i edycja w WordPress](wp-content/themes/dc-serwis/README.md)
- [Historyczny raport testów 2.0](docs/TEST_REPORT.md)
- [Historyczne porównanie wyglądu 2.0](docs/VISUAL_COMPARISON.md)
- [Raport ochrony SEO 2.0](docs/SEO_PROTECTION_REPORT.md)
- [Raport wydajności 2.0](docs/PERFORMANCE_REPORT.md)
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
node tests/reference-preservation.cjs
python3 scripts/package-theme.py
```

Dla już uruchomionego, izolowanego WordPressa wskaż jego adres przez `BASE_URL`, np. `http://127.0.0.1:8081`. Polecenia testów i wymagane fixture opisuje raport testów. Archiwum powstaje jako `artifacts/dc-serwis.zip`, zawierające wyłącznie katalog `dc-serwis/` na najwyższym poziomie. `scripts/capture-reference.cjs` zapisuje 27 zrzutów dziewięciu stron przy 1440/768/390 px oraz widok home 967 px w `docs/visual/reference/after/`. Porównanie z poprzednią wersją korzysta z istniejących zrzutów 2.1; nowa plansza z rozmowy nie ma osobnego pliku źródłowego do pixel-diff.

## Zakres bieżącej wersji 3.0

Na desktopie układ podąża za główną stroną z referencji, a na telefonie menu wysuwa się z prawej jako modal. Górną część home edytuje się w **Dostosuj → DC — Strona główna: niebieska makieta**. Dotychczasowe lokalne akapity SEO, galeria i shortcode opinii pozostają w Gutenbergu. Nowe strony **Cennik** i **Porady** mają unikalne treści i SEO, a ich synchronizacja dodaje wyłącznie brakujące strony. Istniejące treści i ustawienia nie są resetowane.

Numer telefonu to nadal **794 225 139**; formularz korzysta z **kontakt@damiancebula-serwis.pl**, a stopka zachowuje **majewskitomasz.pl**. Dane i obietnice z makiety są dostosowane do potwierdzonej oferty firmy. Dekoracyjny obrys miasta nie jest przedstawiany jako zdjęcie Stalowej Woli. Bieżący opis nie stanowi potwierdzenia wdrożenia na Hostinger ani wykonania testów produkcji.

## Historyczny zakres wersji 2.1

Usunięto powtórzenia ilustracji pomiędzy hero a kolejnymi modułami usług. Fotografie realizacji pozostają nienaruszone. Stopka nie pokazuje adresu i e-maila; nadal udostępnia telefon, Kontakt, pełną nawigację, politykę i podpis twórcy. Dane firmy pozostały w Kontakcie, polityce oraz schema, a formularz nadal używa właściwego odbiorcy.

Logo ma ten sam akcent `#9C4F2C` co wyróżnienie hero, również przy własnym przezroczystym pliku. Nowa ikona DC ma rozmiary dla przeglądarki i urządzeń mobilnych. W Dostosuj można wybrać oryginalne kolory logo i własną ikonę WordPress; zapisane wcześniej ustawienia nie są kasowane. Na telefonie tekst modułu Klimatyzacji poprzedza fotografię. Subtelny ruch strzałek respektuje reduced motion.

Główne działania i akcenty interfejsu są niebieskie (`#255F8A`, hover `#17476C`), z jasnoniebieskimi powierzchniami `#E5EDF4` w procesie, panelu AGD i formularzu. Mobilny telefon, aktywne menu, numeracja i wybrane ikony również korzystają z błękitu. Miedziane logo, wyróżnienie hero i ikona DC oraz petrolowa stopka i kolory zdjęć pozostają zachowane.

W **Dostosuj → DC — Lokalność i zdjęcie miasta** są pola autentycznej fotografii, autora i źródła. Materiał ze Stalowej Woli nie został jeszcze pozyskany: Wikimedia Commons blokuje proxy środowiska (CONNECT 403), a zapisany projekt dostępu sieci wymaga publikacji. Bez wybranego lub zweryfikowanego zdjęcia nie powstaje puste miejsce. Status i dalsze kroki: [UPDATE_2_1.md](docs/UPDATE_2_1.md).

## Baza wersji 2.0

Duże, natychmiast widoczne hero ma jeden przycisk kontaktu. Klimatyzacja i AGD otrzymują różne kompozycje; sekwencja serwisu, lokalność, nieregularne galerie, formularz i polityka mają własne układy. Rozpoznawalne logo DC ma wariant kolorystyczny na jasny nagłówek; favicon pozostaje bez zmian. Fotografie wnętrz są ilustracjami, a zdjęcia realizacji nadal pokazują prace właściciela, w dotychczasowej kolejności i z dotychczasowymi ALT oraz podpisami.

Usunięto migawkę tekstu, pełnoekranową przesłonę, maskowanie i przygaszanie podczas AJAX. Wybrane grupy poniżej pierwszego widoku pojawiają się jeden raz przez łagodne przesunięcie o 16 px i zmianę przezroczystości. Hero i całe `main` pozostają widoczne. Ograniczony ruch i brak JavaScript pozostawiają treść bez animacji. Mobilne menu nadal wysuwa się z prawej jako modal, a nawigacja zachowuje pełne URL, historię i aktualizację metadanych. Scrollspy pozostaje wyłączony.

Redesign nie zapisuje tekstów ani ustawień SEO do bazy. Zachowuje H1–H3, politykę prywatności, linkowanie, metadane, schema i konfigurację Rank Math. Dodaje jeden przycisk kontaktu w hero oraz powtórzenie istniejącej nawigacji w stopce. Lokalny test porównawczy jest odrębny od wymaganego audytu produkcji; rzeczywiste ograniczenia opisuje raport ochrony SEO.

Mapa jest osadzona w Kontakcie bez przycisku zgody, z adresem firmy jako domyślnym celem; własny link można podać w Dostosuj. Opinie Trustindex pozostają do skonfigurowania przez właściciela, bez fikcyjnych ocen. Formularz z checkboxem prywatności kieruje wiadomości do **kontakt@damiancebula-serwis.pl**. Faktyczne doręczenie zależy od poprawnego transportu `wp_mail` / SMTP. Stopka zachowuje podpis **majewskitomasz.pl**.

## Granice wdrożenia

Gałąź zmian 2.1: `design/editorial-refinement`, wyjściowy commit `main`: `8ebc717` (2.0.0). Właściciel polecił wcześniej push do `main`; dla tej iteracji następuje on po weryfikacji. Faktyczny status opisuje raport i historia Git. Push nie jest bezpośrednią instalacją na Hostinger. Zmiany nie obejmują produkcyjnej bazy ani DNS. Instaluj paczkę na odrębnym stagingu, z kopią bezpieczeństwa i kontrolą dotychczasowych ustawień. Aktywacja i synchronizacja nadal chronią ręcznie edytowane strony.

Dostęp środowiska do obecnej witryny i API GitHuba był blokowany przez politykę proxy. Zapisanie projektu konfiguracji sieci nie oznacza jej zastosowania. Status audytu produkcyjnego, PR oraz rzeczywiste wyniki testów i pomiarów znajdują się w raportach; dokumentacja założeń nie stanowi potwierdzenia publikacji ani spełnienia Core Web Vitals.

Dane potwierdzone: **Damian Cebula**, **794 225 139**, **kontakt@damiancebula-serwis.pl**, **damiancebula-serwis.pl**, **Aleje Jana Pawła II 42, 37-450 Stalowa Wola**. Nie umieszczaj haseł, konfiguracji produkcyjnego WordPressa ani eksportów baz w repozytorium.

Dokumentacja historyczna: [2.0](docs/UPDATE_2_0.md), [1.6](docs/UPDATE_1_6.md), [założenia 1.6](docs/PREMIUM_DESIGN.md), [1.5](docs/UPDATE_1_5.md), [pierwotna makieta](design/reference/makieta-uklad-strony-1-1.jpg). Pierwotna ciemna makieta jest punktem historycznym, a nie celem zgodności 1:1 dla obecnego Architectural Service.
