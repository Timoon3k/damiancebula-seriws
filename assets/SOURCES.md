# Źródła zdjęć i grafiki

## 1. Autentyczne materiały właściciela (przekazane w rozmowie)

Paczka przekazana przez właściciela ma być umieszczona w repo:
- `design/reference/makieta-uklad-strony-1-1.jpg` — rzeczywista kompozycja referencyjna (desktop: homepage + 2 usługowe podstrony).
- `assets/photos/montaz-klimatyzacji-jednostka-zewnetrzna-aux.webp` — jednostka zewnętrzna AUX na elewacji.
- `assets/photos/montaz-klimatyzacji-prowadzenie-instalacji.webp` — instalacja przewodów.
- `assets/photos/montaz-klimatyzatora-jednostka-wewnetrzna.webp` — jednostka wewnętrzna zabezpieczona folią.
- `assets/photos/klimatyzator-scienny-gotowy-montaz.webp` — jednostka wewnętrzna zamontowana na szarej ścianie.
- `assets/photos/serwis-klimatyzacji-pompa-prozniowa.webp` — pompa próżniowa i prace serwisowe.

**UWAGA:** Sam manifest nie jest obrazem. Jeśli pliki nie pojawiły się w repozytorium, importuj je z archiwum `damiancebula-codex-makieta-i-zdjecia.zip` przekazanego w rozmowie. ZIP zawiera bezpośrednio foldery `design/` i `assets/`. Nie twierdź, że są w GitHub, dopóki ich nie zobaczysz w tree repo.

## 2. Publiczne materiały pochodzące z istniejącej witryny

Prawdziwe fotografie w WordPress Media Library z `https://damiancebula-serwis.pl/` są dostępne pod nazwami `praca1.webp`, `prava2.webp`, `praca3.webp`, `praca4.webp`, `praca5.webp`. Dodane są również dwa assety identyfikacji firmowej. Skrypt `scripts/import-public-site-media.sh` pobiera je do `assets/source-web/`. Workflow `.github/workflows/import-assets.yml` może je dodać automatycznie do `main`.

Nie pobieraj reklamowych/demo fotografii z `themewant.com`, nie używaj przypadkowych zdjeć „montażu przez firmę”. W razie braku właściwej fotografii do dokładnego hero z makiety zastosuj legalną/licencjonowaną ilustrację lub zaproponuj właścicielowi sesję zdjęciową. Obrazy powinny być finalnie ładowane lokalnie z motywu/Media Library, bez hotlinkowania.

## 3. Opisy i bezpieczeństwo

Obrazy realnych prac podpisuj wyłącznie tym, co na nich widać. Nie ujawniaj dokładnego adresu domu, nie przypisuj im miejscowości realizacji bez dowodu. Usuń EXIF/GPS podczas optymalizacji, zachowaj proporcje. Zapewnij WebP/AVIF, responsywne źródła i dobre kadry w UI.

## 4. Fotografie ilustracyjne inspirowane makietą — aktualizacja 2026-11-06

Na życzenie właściciela zdjęcia realizacji są używane wyłącznie w galeriach. Główne fotografie usług to nowe, wygenerowane obrazy ilustracyjne w stylistyce makiety: neutralna ciemna przestrzeń, technik w niebrandowanej odzieży, jednostka split, czyszczenie filtrów, pralka i diagnostyka AGD. Nie są kopiami zdjęć z cudzego motywu ani dokumentacją prac Damiana Cebuli.

Pliki `wp-content/themes/dc-serwis/assets/images/editorial-*-{480,960,1600}.webp`:

- `editorial-hvac-hero`: anonimowy technik przy klimatyzatorze — główne hero.
- `editorial-ac-interior`: jednostka split — kafel i hero Klimatyzacja.
- `editorial-ac-cleaning`: czyszczenie filtrów — sekcja korzyści Klimatyzacja.
- `editorial-washer`: pralka — kafel i hero AGD.
- `editorial-agd-service`: ilustracyjna diagnostyka pralki — sekcja AGD.

Obrazy powstały z użyciem image generation na podstawie opisu sceny i kompozycji referencji. ALT określa je jako ilustracyjne. Nie identyfikują technika jako właściciela ani pracownika firmy, nie zawierają logo i nie trafiają do Realizacji. WebP mają usunięte metadane i warianty responsywne. Oryginalne prace klienta w `assets/photos/` i `assets/source-web/` pozostają zachowane.

## 5. Logo 1.2

Nowy autorski monogram DC z motywem przepływu powietrza: `assets/branding/dc-mark.svg` w katalogu motywu. Wektor jest ręcznie zdefiniowaną geometrią inspirowaną koncepcją wygenerowaną dla tej witryny; nie korzysta z logotypu cudzego motywu. PNG są eksportami tego samego SVG. W nagłówku nazwę firmy i opis renderuje HTML. Podpis twórcy projektu w stopce: majewskitomasz.pl, zgodnie z instrukcją właściciela.

## 6. Krój pisma i fotografie w wersji 1.6

Do motywu dołączono lokalny krój **Manrope**, wagi 200–800, podzbiory `latin` i `latin-ext` w dwóch plikach WOFF2 (łącznie 39 956 B). Źródło: [`@fontsource-variable/manrope` 5.3.0](https://www.npmjs.com/package/@fontsource-variable/manrope/v/5.3.0), rodzina autorstwa The Manrope Project Authors. Pliki są dystrybuowane na licencji **SIL Open Font License 1.1**; pełna licencja znajduje się w [`assets/fonts/OFL-Manrope.txt`](../wp-content/themes/dc-serwis/assets/fonts/OFL-Manrope.txt) w motywie. Pochodzenie, mapy znaków i sposób dostarczania opisuje [dokumentacja fontów](../docs/FONTS.md). Fonty są pobierane z własnej witryny, bez Google Fonts ani zewnętrznego CDN.

Redesign 1.6 nie dodaje ani nie podmienia plików fotografii. Zachowane są materiały realizacji z `assets/photos/` i `assets/source-web/`, ich warianty w motywie oraz istniejące ilustracyjne obrazy `editorial-*`. Wcześniejsze opisy ich pochodzenia pozostają aktualne.

## 7. Architectural Service 2.0 — wnętrza ilustracyjne, 2026-11-06

Na podstawie nowego briefu właściciela przygotowano przez **image generation** dwie nowe fotografie ilustracyjne. Nie są zdjęciami faktycznych realizacji Damiana Cebuli i nie przedstawiają pracowników. Nie pochodzą z cudzego motywu ani biblioteki stockowej. Dotychczasowe zdjęcia z technikami pozostają w archiwum plików dla kompatybilności, ale znane domyślne ilustracje usług są podczas renderowania zastępowane nowymi wnętrzami.

| Rodzina plików w motywie `assets/images/` | Zawartość | WebP 480 / 960 / 1536 px |
|---|---|---|
| `editorial-architecture-living-*` | Jasny salon, drewno, szałwia i ścienny klimatyzator split | 17 598 / 59 284 / 140 034 B |
| `editorial-architecture-laundry-*` | Pralka w jasnej zabudowie gospodarczej z drewnem i szałwią | 11 748 / 36 000 / 79 074 B |

Źródłowe wygenerowane PNG w przestrzeni roboczej (nie są częścią paczki motywu):

- salon: `/workspace/generated_images/exec-e4b83c90-9205-432a-91f5-796d3fde0ae0.png`;
- pralnia: `/workspace/generated_images/exec-95bfe52b-e154-4881-84a5-f3b34a8109fd.png`.

WebP są dostarczane lokalnie z `srcset` i `sizes`, z ALT zaczynającym się od „Zdjęcie ilustracyjne”. Nie trafiły do Realizacji. Autentyczne pliki z `assets/photos/`, `assets/source-web/` oraz ich chronione warianty pozostają bez zmian, z dotychczasowymi ALT, podpisami i kolejnością.

Wariant logo `assets/branding/dc-lockup-porcelain.svg` w motywie zachowuje geometrię dotychczasowego znaku DC i zmienia wyłącznie wypełnienia na petrol oraz ciemniejszą miedź dla jasnego nagłówka. Istniejące warianty i favicon pozostają zachowane. Fonty Manrope i licencja OFL nie zmieniają się.

## 8. Editorial refinement 2.1 — odrębne kadry i identyfikacja, 2026-11-07

Na prośbę właściciela o usunięcie powtarzających się zdjęć przygotowano przez **image generation** pięć nowych, odrębnych scen ilustracyjnych. Zachowują jasną, architektoniczną paletę; nie są fotografiami prac Damiana Cebuli ani zdjęciami Stalowej Woli. Nie zawierają osób identyfikowanych jako właściciel lub pracownicy i nie trafiają do Realizacji. Siedem ilustracyjnych miejsc na home i obu podstronach usług korzysta teraz z siedmiu różnych scen; pozostają wśród nich dwa wnętrza opisane w sekcji 7.

| Rodzina w motywie `assets/images/` | Zastosowanie i scena | WebP 480 / 960 / 1536 px |
|---|---|---|
| `editorial-architecture-ac-detail-*` | Moduł Klimatyzacji na home; detal białego klimatyzatora na jasnej ścianie | 8 800 / 33 838 / 78 364 B |
| `editorial-architecture-climate-room-*` | Hero Klimatyzacji; klimatyzator w jasnej jadalni | 18 966 / 60 750 / 137 912 B |
| `editorial-architecture-filter-detail-*` | Sekcja serwisu Klimatyzacji; filtry siatkowe na kamiennym blacie | 23 212 / 83 726 / 207 816 B |
| `editorial-architecture-dishwasher-kitchen-*` | Hero AGD; otwarta zmywarka w jasnej kuchni | 17 320 / 53 956 / 115 084 B |
| `editorial-architecture-washer-detail-*` | Sekcja AGD; drzwi i stalowy bęben pralki | 23 556 / 69 762 / 144 664 B |

Każda rodzina ma proporcje 3:2 i warianty 480×320, 960×640 oraz 1536×1024, dostarczane lokalnie przez `srcset` i `sizes`. ALT jednoznacznie opisują zdjęcie ilustracyjne. Źródłowe wygenerowane PNG poza paczką motywu:

- ac-detail: `/workspace/generated_images/exec-f9df9905-e3ed-40d4-ae21-853551de9766.png`;
- climate-room: `/workspace/generated_images/exec-c0f244f3-2d32-43f4-9b0d-663d5388de78.png`;
- filter-detail: `/workspace/generated_images/exec-5c55b195-aaa5-444e-a8d1-3aad68e0aaa2.png`;
- dishwasher-kitchen: `/workspace/generated_images/exec-1cf7cb17-3bec-4eba-bda9-2decd3bb0ed5.png`;
- washer-detail: `/workspace/generated_images/exec-f8d945f3-bfa5-4b4f-b27f-6bac08b550b9.png`.

Nowa ikona `assets/branding/dc-favicon-copper-{32,180,192,512}.png` jest wariantem wygenerowanym na podstawie dotychczasowego `dc-icon.png`, w miedzianej kolorystyce i z uproszczonym motywem DC do małych rozmiarów. Źródłowy PNG: `/workspace/generated_images/exec-221ef19b-2ef2-4d8c-bb63-29d5b0c575b1.png`. Dawny `dc-icon.png` pozostaje w motywie, także pod dotychczasowym adresem wykorzystywanym przez schema. W nagłówku geometryczne źródło logo pozostaje oryginalne; miedziany filtr nadaje mu dokładny akcent `#9C4F2C`, zgodny z wyróżnieniem tekstu hero. Administrator może wrócić do oryginalnej palety i własnej ikony WordPress bez zmiany plików źródłowych.

**Autentyczne zdjęcie Stalowej Woli: nadal do pozyskania.** Próba pobrania materiału z Wikimedia Commons została zablokowana przez proxy środowiska (CONNECT 403). Nie przypisano wygenerowanej scenie nazwy miasta ani nie wpisano niezweryfikowanego autora lub licencji. Przygotowano wybór fotografii, podpisu i linku źródłowego w Dostosuj; bez własnego zdjęcia lub zweryfikowanego materiału w paczce nie renderuje się puste miejsce. Zapisany projekt konfiguracji sieci dla `commons.wikimedia.org` i `upload.wikimedia.org` wymaga publikacji w ustawieniach środowiska przed kolejną próbą. Dodanie kontrolowanego miejsca nie oznacza spełnienia prośby o rzeczywistą fotografię miasta.

## 9. Niebieska makieta 3.0 — ilustracje i wektory, 2026-11-07

Najnowsza plansza właściciela zastępuje kierunek Architectural Service z sekcji 7–8. Źródłem kompozycji jest główna witryna po lewej stronie obrazu 1536×1024 przekazanego w rozmowie; prawa kolumna alternatywnych układów nie jest treścią strony. Nowy obraz referencyjny nie ma osobnego pliku w repozytorium. Istniejący `design/reference/makieta-uklad-strony-1-1.jpg` przedstawia wcześniejszą, czarno-pomarańczową makietę.

Przygotowano przez **image generation** dwie odrębne sceny inspirowane fotograficznymi fragmentami nowej referencji. Są to ilustracje, nie fotografie realizacji firmy, jej właściciela lub pracowników. Nie pochodzą z biblioteki stockowej ani cudzego motywu. Model w granatowej odzieży jest postacią ilustracyjną; samochód i ubranie w źródłowym obrazie są niebrandowane. Znak oraz napis na samochodzie dodaje osobny element HTML witryny, a fotografia ma widoczny podpis ilustracyjny.

| Rodzina w motywie `assets/images/` | Scena | WebP 480 / 960 / 1536 px |
|---|---|---|
| `editorial-reference-hero-*` | Biały klimatyzator split i srebrna pralka w chłodnym granatowym wnętrzu | 14 684 / 39 384 / 83 312 B |
| `editorial-reference-technician-*` | Ilustracyjny model obok granatowego samochodu serwisowego | 18 748 / 45 424 / 93 530 B |

Źródłowe wygenerowane PNG pozostają w przestrzeni roboczej, poza repozytorium i paczką motywu:

- hero: `/workspace/generated_images/exec-658abc79-5620-431a-9769-f977ab945fa6.png`;
- model i samochód: `/workspace/generated_images/exec-132eaa51-9dba-485d-b3b7-cf6efedbf125.png`.

Warianty mają rozmiary 480×320, 960×640 i 1536×1024, bez EXIF/GPS. Są dostarczane lokalnie przez `srcset` i `sizes`; hero ma priorytet ładowania, druga scena ładuje się leniwie. ALT określają ilustracyjny charakter obrazów. Żaden z tych plików nie jest używany w Realizacjach. Oryginalne fotografie właściciela i ich warianty pozostają zachowane.

Nowe autorskie wektory w motywie `assets/branding/`:

- `dc-cog-snowflake.svg` — geometryczny znak koła zębatego ze śnieżynką, błękit/biel na granacie; nazwa firmy jest tekstem HTML;
- `dc-favicon-blue.svg` i `dc-favicon-blue-{32,180,192,512}.png` — warianty tego samego znaku dla przeglądarki i urządzeń mobilnych;
- `local-outline.svg` — dekoracyjny rysunek zabudowy i wieży, używany obok lokalnych tekstów SEO. Nie jest fotografią, mapą ani zweryfikowanym odwzorowaniem panoramy Stalowej Woli; ma funkcję dekoracyjną i jest ukryty przed czytnikiem ekranu.

Nie pozyskano nowej autentycznej fotografii miasta. Obrys nie zastępuje takiej fotografii pod fałszywym podpisem. Dotychczasowa możliwość wyboru własnego zdjęcia i źródła pozostaje dostępna. Dawne pliki ilustracji, logo oraz ikony są zachowane dla historii i kompatybilności; opisy w poprzednich sekcjach dotyczą wersji, w których je wprowadzono.
