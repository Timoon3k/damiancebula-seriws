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
