# Porównanie wizualne — Architectural Service 2.0.0

Nowy brief właściciela zastępuje dawną ciemną makietę 1:1. Wersja 2.0 ma jasną porcelanę, petrol, miedź i szałwię, asymetrię, dużą typografię oraz odrębne układy stron. Nie deklarujemy zgodności 1:1 z pierwotną ciemną makietą. Historyczny opis wersji 1.6 zachowano w [VISUAL_COMPARISON_1_6.md](VISUAL_COMPARISON_1_6.md).

Zapisano **42 pełne zrzuty**: siedem stron × trzy szerokości × przed/po. Widok „przed” odtwarza rzeczywisty HTML lokalnej instalacji zapisany przed zmianami i oryginalne zasoby motywu z `c007e40` odczytane z Git. To odtworzenie udokumentowanego lokalnego stanu 1.6, nie screenshot produkcji. Widok „po” pochodzi z działającego WordPressa z nowym motywem. Obie serie mają viewport 1440/768/390 × 1000 px, DPR 1 oraz reduced motion dla statycznej oceny.

Podczas zapisu przewinięto całą stronę, odkodowano wszystkie obrazy i poczekano na fonty. Wyłącznie w przeglądarce testowej ustawiono `content-visibility:visible` obrazów, aby pełny screenshot Chromium nie pomijał zdjęć lazy poza viewportem. Mapa ma wyraźnie podpisaną atrapę lokalną; nie jest to dowód działania zewnętrznego Google Maps. Animacje sprawdza oddzielny test kolejnych klatek, bez ograniczenia ruchu.

## Wszystkie strony

W każdej komórce: **przed → po**. Zdjęcia realizacji i ich podpisy są identyczne w obu seriach; zmieniły się ramki i układ.

| Strona | Desktop 1440 | Tablet 768 | Telefon 390 |
|---|---|---|---|
| Strona główna | [przed](visual/architectural/before/home-1440.jpg) → [po](visual/architectural/after/home-1440.jpg) | [przed](visual/architectural/before/home-768.jpg) → [po](visual/architectural/after/home-768.jpg) | [przed](visual/architectural/before/home-390.jpg) → [po](visual/architectural/after/home-390.jpg) |
| Klimatyzacja | [przed](visual/architectural/before/serwis-klimatyzacji-stalowa-wola-1440.jpg) → [po](visual/architectural/after/serwis-klimatyzacji-stalowa-wola-1440.jpg) | [przed](visual/architectural/before/serwis-klimatyzacji-stalowa-wola-768.jpg) → [po](visual/architectural/after/serwis-klimatyzacji-stalowa-wola-768.jpg) | [przed](visual/architectural/before/serwis-klimatyzacji-stalowa-wola-390.jpg) → [po](visual/architectural/after/serwis-klimatyzacji-stalowa-wola-390.jpg) |
| Serwis AGD | [przed](visual/architectural/before/serwis-agd-stalowa-wola-1440.jpg) → [po](visual/architectural/after/serwis-agd-stalowa-wola-1440.jpg) | [przed](visual/architectural/before/serwis-agd-stalowa-wola-768.jpg) → [po](visual/architectural/after/serwis-agd-stalowa-wola-768.jpg) | [przed](visual/architectural/before/serwis-agd-stalowa-wola-390.jpg) → [po](visual/architectural/after/serwis-agd-stalowa-wola-390.jpg) |
| Realizacje | [przed](visual/architectural/before/realizacje-1440.jpg) → [po](visual/architectural/after/realizacje-1440.jpg) | [przed](visual/architectural/before/realizacje-768.jpg) → [po](visual/architectural/after/realizacje-768.jpg) | [przed](visual/architectural/before/realizacje-390.jpg) → [po](visual/architectural/after/realizacje-390.jpg) |
| O firmie | [przed](visual/architectural/before/o-firmie-1440.jpg) → [po](visual/architectural/after/o-firmie-1440.jpg) | [przed](visual/architectural/before/o-firmie-768.jpg) → [po](visual/architectural/after/o-firmie-768.jpg) | [przed](visual/architectural/before/o-firmie-390.jpg) → [po](visual/architectural/after/o-firmie-390.jpg) |
| Kontakt | [przed](visual/architectural/before/kontakt-1440.jpg) → [po](visual/architectural/after/kontakt-1440.jpg) | [przed](visual/architectural/before/kontakt-768.jpg) → [po](visual/architectural/after/kontakt-768.jpg) | [przed](visual/architectural/before/kontakt-390.jpg) → [po](visual/architectural/after/kontakt-390.jpg) |
| Polityka prywatności | [przed](visual/architectural/before/polityka-prywatnosci-1440.jpg) → [po](visual/architectural/after/polityka-prywatnosci-1440.jpg) | [przed](visual/architectural/before/polityka-prywatnosci-768.jpg) → [po](visual/architectural/after/polityka-prywatnosci-768.jpg) | [przed](visual/architectural/before/polityka-prywatnosci-390.jpg) → [po](visual/architectural/after/polityka-prywatnosci-390.jpg) |

## Ocena kompozycji

Home ma natychmiast widoczny nagłówek i jedno CTA, wysoką fotografię wnętrza, szeroki moduł Klimatyzacji i węższy, przesunięty moduł AGD. Proces jest sekwencją techniczną, a lokalność i realizacje tworzą otwartą kompozycję. Telefon układa te elementy pionowo z zachowaniem hierarchii.

Klimatyzacja łączy portretowy hero z zakresem usług, naprzemienną fotografią i treścią oraz FAQ. AGD otwiera szeroka typografia i przesunięte zdjęcie; sekcje diagnozy i treści SEO mają inne proporcje. Realizacje zachowują kolejność DOM w nieregularnej siatce; całe kadry są dostępne bez cropu i w lightboxie. O firmie pozostaje oszczędną prezentacją specjalisty. Kontakt ma czytelne dane i szałwiowy formularz, a dokument prawny spokojną kolumnę tekstu.

Przegląd zrzutów ujawnił zbyt szeroki selektor polityki prywatności, wpływający na stopkę. Poprawiono zakres do samej kolumny dokumentu i dodano osobną kontrolę AA kontrastu linków oraz szerokości body. Nie poprawiano tego przez zmianę treści prawnej.

Zdjęcia wnętrz są nowymi ilustracjami, nie realizacjami firmy. Logo zachowuje geometrię DC z kolorystyką na jasny nagłówek; favicon nie zmieniono. Nie dodano fikcyjnych ocen, liczb, historii ani uprawnień.

Metoda i lista plików: [architectural-visual.json](test-results/architectural/architectural-visual.json). Odtworzenie: `BASE_URL=http://127.0.0.1:8081 DC_BEFORE_HTML=/ścieżka/do/rzeczywistego/html-przed.json npm run test:visual`. Skrypt wymaga faktycznej migawki sprzed zmian; nie tworzy jej z bieżącej strony. Surowy lokalny HTML (z czasowymi nonce formularza) pozostaje poza repozytorium; semantyczny wzorzec SEO bez nonce jest wersjonowany.
