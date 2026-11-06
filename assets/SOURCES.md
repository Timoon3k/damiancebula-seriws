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
