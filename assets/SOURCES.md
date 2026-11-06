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
