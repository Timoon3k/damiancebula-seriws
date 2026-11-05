# Damian Cebula — przebudowa strony WWW

**Cel:** odtworzenie nowego projektu 1:1 na podstawie makiety (czarny/grafit + pomarańcz) i wykonanie wielostronicowej, szybkiej witryny WordPress dla serwisu klimatyzacji i AGD w Stalowej Woli.

- Strona produkcyjna (źródło treści): https://damiancebula-serwis.pl/
- Repozytorium: https://github.com/Timoon3k/damiancebula-seriws
- Telefon (potwierdzony na stronie): **794 225 139**
- E-mail (potwierdzony na stronie): **kontakt@damiancebula-serwis.pl**
- Kluczowe frazy: **serwis klimatyzacji Stalowa Wola**, **serwis AGD Stalowa Wola**.
- Makieta w załącznikach przekazanych przez właściciela; dokładny opis layoutu: [docs/DESIGN_SPEC.md](docs/DESIGN_SPEC.md).
- Pełne zadanie dla Codexa: [CODEX_PROMPT.md](CODEX_PROMPT.md).
- Audyt istniejącej witryny: [docs/CONTENT_AUDIT.md](docs/CONTENT_AUDIT.md).
- SEO: [docs/LOCAL_SEO.md](docs/LOCAL_SEO.md).
- Zasoby: [assets/SOURCES.md](assets/SOURCES.md).

## Sposób pracy

To repozytorium zaczęło jako **puste**. Najpierw dodano dokumentację dla Codexa i procedurę pobrania mediów widocznych publicznie na istniejącej stronie. Nie oznacza to wdrożenia nowej strony na hostingu ani kompletnego eksportu bazy WordPress.

**Ważne:** oryginalne zdjęcia i makieta przesłane w rozmowie są dostarczane także jako paczka ZIP do umieszczenia pod ścieżkami `design/reference/` i `assets/photos/`. Jeżeli te pliki nie znajdują się jeszcze w repo, nie uznawaj odtworzenia 1:1 za zweryfikowane.

## Rozpoczęcie prac

1. Przeczytaj `AGENTS.md`, `CODEX_PROMPT.md` i pozostałe dokumenty.
2. Sprawdź zdjęcia w `assets/source-web/`; import obecnych mediów wykonuje workflow `Import public site media`.
3. Wgraj zdjęcia właściciela i oryginał makiety z paczki ZIP, jeżeli nie ma ich w repo.
4. Stwórz motyw WordPress i wdrażaj zmiany **w PR**, nie na serwerze produkcyjnym.
5. Zweryfikuj frontend względem makiety, lokalne SEO i Core Web Vitals.

Nie umieszczaj żadnych haseł, kluczy API, danych wp-config.php ani eksportów baz danych w tym repozytorium.
