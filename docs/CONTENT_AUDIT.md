# Audyt publicznej strony — stan 2026-11-05

Źródło: https://damiancebula-serwis.pl/ oraz publiczne endpointy WordPress REST API. Nie jest to eksport bazy CMS ani pełne pobranie serwera.

## Potwierdzone informacje

- Nazwa: Damian Cebula — Serwis Klimatyzacji i AGD.
- Tel.: **+48 794 225 139**; link `tel:+48794225139`.
- Mail: **kontakt@damiancebula-serwis.pl**.
- Działalność: Stalowa Wola i okolice (dokładny adres firmy niepotwierdzony).
- Usługi: montaż klimatyzacji (naścienne/przypodłogowe/sufitowe/kanałowe wymienione na stronie), czyszczenie, dezynfekcja/odgrzybianie, konserwacja, przeglądy, naprawy klimatyzacji; naprawa pralek, lodówek i zmywarek.
- Strona mówi o domach, mieszkaniach i biurach; należy zachować te grupy docelowe.
- Komunikaty obecnej witryny: doświadczenie techniczne, elastyczne terminy, uczciwa wycena, lokalny serwis; unikaj niepopartych absolutnych gwarancji.
- Na bieżącej stronie istnieje osadzony widget opinii Trustindex z recenzjami Google, nie kopiuj ocen i dat „na sztywno”, nie używaj self-serving aggregateRating w schema.
- Istniejące na dzień audytu strony REST: `/` (slug wewnętrzny `strona-glowna`) i `/polityka-prywatnosci/`. Obecne menu „O mnie”, „Usługi”, „Moje prace”, „Kontakt” jest oparte na **kotwicach** `#o-mnie`, `#uslugi`, `#moje-prace`, `#kontakt`. Nowy projekt wymaga osobnych URL, a nie powielania tych anchorów.
- SEO home: title `Serwis Klimatyzacji Stalowa Wola | Montaż i Naprawa`; opis `Serwis klimatyzacji Stalowa Wola – szybki dojazd, atrakcyjne ceny, gwarancja. Montaż, odgrzybianie, napełnianie. Naprawa AGD z dojazdem. Tel. 794 225 139`; canonical `https://damiancebula-serwis.pl/`.
- Wykryty robots: `Disallow: /wp-admin/`, `Allow: /wp-admin/admin-ajax.php`, sitemap `https://damiancebula-serwis.pl/sitemap_index.xml`.
- Domena ma już `index,follow` na stronie głównej. Nie twórz drugiego źródła metadanych bez sprawdzenia wtyczek.
- Obecny motyw wykorzystuje zasoby demonstracyjne Coolair/themewant; nie kopiuj chronionych elementów bez licencji.

## Treści do zachowania/redakcji

**Montaż i naprawa klimatyzacji domowej oraz biurowej**: montaż, czyszczenie, naprawa, dezynfekcja, konserwacja, oszczędność energii oraz jakość powietrza. Przenieś prawdziwą wartość merytoryczną i popraw język, a nie kopiuj całości mechanicznie.

**Serwis AGD**: pralki, lodówki, zmywarki. Rozszerzenie o piekarniki, płyty i okapy z makiety oznacz jako *do weryfikacji*; dopiero po potwierdzeniu wpisz do oferty.

**O firmie**: unikaj deklaracji „30+ zleceń”, „100% klientów”, „cały zespół wykwalifikowanych techników”, jeżeli brak wiarygodnego potwierdzenia. Preferuj formy osobowe zgodne z działalnością Damiana.

**Proces**: 4 kroki: kontakt, diagnoza, serwis, sprawdzenie działania.

**Opinie**: użyj istniejącego widgetu Trustindex i jego oficjalnych mechanizmów albo linku do profilu Google po ustaleniu oficjalnego adresu. Nie publikuj niezweryfikowanych opinii we własnym markupie.

**Kontakt**: dotychczas strona posiada formularz: imię*, e-mail*, telefon, wiadomość*. Zadbaj o politykę prywatności i zgody zgodnie z faktycznymi integracjami.

## Linki mediów własnych ze starej strony

Autentyczne prace widoczne w bibliotece WordPress:
- `https://damiancebula-serwis.pl/wp-content/uploads/2025/11/praca1.webp`
- `https://damiancebula-serwis.pl/wp-content/uploads/2025/11/prava2.webp`
- `https://damiancebula-serwis.pl/wp-content/uploads/2025/11/praca3.webp`
- `https://damiancebula-serwis.pl/wp-content/uploads/2025/11/praca4.webp`
- `https://damiancebula-serwis.pl/wp-content/uploads/2025/11/praca5.webp`

Logo/identyfikacja widoczne na stronie:
- `https://damiancebula-serwis.pl/wp-content/uploads/2025/07/527cc526-6079-4c42-816f-5ad0ec245512-e1765166448339.png`
- `https://damiancebula-serwis.pl/wp-content/uploads/2025/07/419be228-93d5-4ce1-8484-dc46165974e7.png.webp`

Przed użyciem wykonaj inspekcję obrazu; nazwa pliku nie gwarantuje treści. Nie pobieraj szablonowych zdjęć z `themewant.com`.

## Do sprawdzenia przed publikacją
Godziny pracy, dokładna siedziba, marki urządzeń i ich pełna lista, uprawnienia/koncesje, gwarancja, zakres dojazdu, oficjalna wizytówka GBP i Facebook, zgoda na pokazywanie realizacji oraz integracja formularza. Nie wymyślaj tych informacji.
