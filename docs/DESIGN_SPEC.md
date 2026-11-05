# Specyfikacja graficzna makiety 1:1

## Referencja
Oryginalny załącznik: makieta użytkownika 1536×1024 px, kompozycja: duża strona główna po lewej (około 2/3 szerokości obrazu), 2 zrzuty podstron („Klimatyzacja” u góry, „Serwis AGD” na dole) po prawej. **To nie są jednocześnie wyświetlane 3 kolumny jednej witryny.** Traktuj jako trzy odrębne układy stron.

Oryginalny plik powinien znaleźć się pod `design/reference/makieta-uklad-strony-1-1.jpg` (dostarczony osobno przez właściciela). Nie używaj tej kompozycji jako gotowego tła HTML: wszystkie teksty, menu i CTA muszą być prawdziwymi elementami interfejsu.

## Tożsamość
- Tło: czarne / grafitowe, niewielka subtelna tekstura.
- Kolory startowe do kalibracji względem zrzutu: `--ink:#0e1012`, `--surface:#171a1e`, `--surface-2:#202327`, `--orange:#ff7a1a`, `--text:#f6f6f4`, `--muted:#c7c8c9`.
- Font bezszeryfowy, solidny i geometryczny, np. lokalny Inter/Manrope, nagłówki ciężkie 700/800, tekst regular 400–500. Liczy się dopasowanie proporcji, nie wybór tej konkretnej rodziny.
- Motywy: pomarańczowe cienkie ukośne paski, kwadratowe akcenty z ikonami liniowymi, przekątne cięcia przy zdjęciach, ostre krawędzie.
- Minimalne efekty hover/focus; nie przesłaniać treści.
- Zdjęcia w tonacji neutralnej, bez fałszywego pokazywania technika w firmowej odzieży.

## Header
Ciemna belka; logo „DC” w pomarańczowo-szarej estetyce i dane „Damian Cebula / Serwis Klimatyzacji i AGD” po lewej. Po prawej linki „Strona główna”, „Klimatyzacja”, „Serwis AGD”, „Realizacje”, „O firmie”, „Kontakt”; aktywna pozycja: pomarańczowa dolna kreska. Na skraju CTA z ikoną telefonu i numerem `794 225 139`, czarna kapsułka z cienkim pomarańczowym obrysem. Mobilnie menu rozwijane + telefon.

## Strona główna
1. Hero zajmujące ok. 340 px widocznego zrzutu pod nagłówkiem: lewa część z monumentalnym `Naprawiamy. Montujemy. Przywracamy komfort.`; dwa ostatnie człony akcentowane pomarańczowo. Drugorzędny opis `Serwis klimatyzacji i AGD w Stalowej Woli.` po lewej. Po prawej obraz technika przy jednostce klimatyzacyjnej z ukośnym pomarańczowym zamknięciem.
2. Dwie duże karty 50/50: „Klimatyzacja” i „Serwis AGD”, każda ma ciemny gradient poprawiający czytelność, zdjęcie urządzenia, ikonę typu lineart po lewej i kwadratowy pomarańczowy przycisk strzałki w prawym dolnym rogu.
3. Niżej pasek 4 kroków z ikonami i liniami, podpisy: „1. Kontakt”, „2. Diagnoza”, „3. Serwis”, „4. Sprawne działanie”. Z lewej mocny nagłówek „Jak przebiega serwis?”.
4. Blok lokalności: obraz Stalowej Woli (w oryginalnej makiecie charakterystyczna wieża i znak miasta), tekst „Lokalny serwis ze Stalowej Woli” i opis. Obok „Realizacje” z trzema zdjęciami w jednym rzędzie oraz ikoną strzałki.
5. Footer-CTA na pełną szerokość: numer telefonu na czerni, duży pomarańczowy telefon, wezwanie do kontaktu, przycisk „Skontaktuj się” o geometrycznym kształcie.

## Klimatyzacja
- Breadcrumb.
- Hero tekst po lewej: `Serwis klimatyzacji` / `Stalowa Wola` w dwóch kolorach. Odpowiednie zdjęcie wnętrza z jednostką split po prawej.
- Pasek 4 usług z pomarańczowymi ikonami: serwis/naprawa, czyszczenie/odgrzybianie, montaż, konserwacja.
- Pod hero sekcja 2 kolumn: realne zdjęcie klimatyzatora z otwartym filtrem oraz lista 4 zalet regularnego serwisowania z checkmarkami.
- Dodatkowe SEO/FAQ/CTA poniżej pierwszego ekranu, zachowaj estetykę.

## Serwis AGD
- Breadcrumb.
- Hero tekst: `Serwis AGD` / `Stalowa Wola`, po prawej urządzenie AGD (pralka).
- Sekcja ikon i podpisów rodzajów urządzeń — nie pokazuj niepotwierdzonych kategorii jako realnej oferty.
- Dwie kolumny: zdjęcie naprawy i lista „Profesjonalny serwis AGD w Twojej okolicy” z checkmarkami.
- FAQ i CTA dalej.

## Responsive
- 1536/1440: układ docelowy; szerokość kontenera ok. 1280–1360 px; dopasuj do zrzutu, unikaj wielkich pustych marginesów.
- 1024: mniejszy hero i dwa kafle obok siebie, nawigacja może przejść do burgera przy braku miejsca.
- 768: hero na 2 sektory lub obraz pod tekstem, kafle w stosie przy małej szerokości.
- 390/360: jedna kolumna, nagłówki nie wychodzą za ekran, zdjęcia z bezpiecznymi cropami, tap target 44 px, CTA zawsze widoczne bez przesłaniania kontentu.

## Pomiar zgodności
Dla 1440px wykonaj zrzut pełnej strony i zestaw z makietą: zbadaj hierarchię, grid, rozmiary tekstu, proporcje obrazów, odległości, fakturę, przyciski, dekoracyjne przekątne. Kryterium „1:1” dotyczy kompozycji i stylu z możliwością merytorycznych poprawek tekstu; na różnych viewportach wymagane są odpowiedzialne adaptacje, nie sztywne kopiowanie szerokości z JPEG.
