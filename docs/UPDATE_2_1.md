# Aktualizacja 2.1 — editorial refinement

Wersja **2.1.0**, 7 listopada 2026 r. (Europe/Warsaw), rozwija Architectural Service na bazie `main` `8ebc717`. Zmiany są przygotowywane na `design/editorial-refinement`. Obejmują zróżnicowane ilustracje usług, uporządkowaną stopkę, niebieskie akcenty interfejsu, miedzianą identyfikację i detale interakcji. To instrukcja aktualizacji; rzeczywiste wyniki sprawdzenia opisuje [REFINEMENT_2_1_REPORT.md](REFINEMENT_2_1_REPORT.md). Raporty 2.0 pozostają historycznym zapisem poprzedniej wersji.

## Co się zmienia

Siedem ilustracyjnych miejsc na stronie głównej i obu podstronach usług otrzymuje siedem różnych scen. Home zachowuje salon w hero oraz pralnię przy AGD, a moduł Klimatyzacji pokazuje detal jednostki. Klimatyzacja ma osobne wnętrze w hero i techniczne ujęcie filtrów; AGD — kuchnię ze zmywarką i detal bębna pralki. Fotografie są ilustracyjne. **Realizacje, ich pliki, kolejność, ALT i podpisy pozostają zachowane.** Podmiana znanych domyślnych ilustracji następuje w prezentacji bloków, bez przepisywania zapisanych treści Gutenberga.

Stopka zawiera telefon, przycisk kontaktu, spokojny podpis firmy, sześć linków nawigacji i dolny pasek z polityką oraz `majewskitomasz.pl`. Usunięto z niej adres i e-mail zgodnie z prośbą właściciela. Oba dane nadal są w Kontakcie, dokumentach prawnych i danych strukturalnych. Formularz nadal kieruje wiadomości do `kontakt@damiancebula-serwis.pl`.

Logo w nagłówku ma dokładny akcent **`#9C4F2C`**, taki jak wyróżnienie „Przywracamy komfort”. Zachowano geometrię i pełną rozdzielczość źródła logo. Domyślna ikona przeglądarki ma nowy, miedziany wariant DC. Dotychczasowy plik ikony używany przez schema pozostaje pod istniejącym adresem. Ustawienia administratora nie są nadpisywane w bazie.

Zgodnie z dalszą prośbą właściciela elementy interfejsu otrzymują niebieski akcent. Główne przyciski, mobilny przycisk telefonu, aktywna nawigacja, numeracja, wybrane ikony i fokus na jasnym tle korzystają z błękitu. Proces, panel AGD i formularz kontaktowy mają delikatną, jasnoniebieską powierzchnię. Logo, wyróżnienie hero i nowa ikona DC zachowują miedź; zdjęcia oraz petrolowa stopka nie są przemalowywane.

| Rola | Kolor |
|---|---|
| Główny niebieski akcent | `#255F8A` |
| Niebieski stan hover | `#17476C` |
| Jasnoniebieskie powierzchnie | `#E5EDF4` |
| Miedź logo i wyróżnienia hero | `#9C4F2C` |
| Petrol tekstu i stopki | `#192E33` |

Na telefonie tekst modułu Klimatyzacji poprzedza zdjęcie, aby po hero nie następowało drugie podobne otwarcie zdjęciowe. Drobny ruch strzałek przy najechaniu wynosi 3 px; ograniczenie ruchu nadal wyłącza animacje. Nie przywrócono migawki, przesłony ani animowania całego `main`.

## Instalacja na odrębnym stagingu

1. Wykonaj backup plików i bazy. Wgraj ZIP 2.1.0 z jednym katalogiem `dc-serwis/` na odrębną kopię nowej witryny. Zachowaj wtyczki, treści, ustawienia SEO i politykę prywatności.
2. Wyczyść cache WordPress/LiteSpeed, Hostinger i przeglądarki, w tym generowane CSS, optymalizację obrazów i pamięć ikony witryny. Nie trzeba ponownie wstawiać wzorców ani synchronizować treści, aby zobaczyć nową oprawę.
3. W **Wygląd → Dostosuj → Tożsamość witryny** sprawdź „Kolor logo w nagłówku”. Domyślnie wybrana jest miedź motywu. Dla własnego logo użyj pełnego, ostrego pliku z przezroczystym tłem; oryginalny plik zostaje zachowany. Opcja „Oryginalne kolory logo” przywraca jego paletę i ustawienie kontrastu. Przy pliku bez przezroczystości korzystaj z oryginalnych kolorów.
4. W tej samej sekcji „Ikona witryny” wybierz miedzianą ikonę DC albo własną ikonę WordPress. Ta opcja zmienia sposób wyświetlania, nie kasuje zapisanej wcześniej ikony.
5. Sprawdź siedem stron na komputerze i telefonie: unikalne ilustracje, pełne zdjęcia realizacji, niebieskie przyciski i ich fokus, miedziane logo, czytelność stopki, menu, Wstecz, formularz i mapę. Zachowaj stagingowe `noindex`. Potwierdź działanie SMTP i usług zewnętrznych na hostingu przed odrębną publikacją.

## Fotografia Stalowej Woli — przygotowane miejsce, brak materiału

**Rzeczywista fotografia miasta nie została jeszcze dołączona.** Pobranie materiału z Wikimedia Commons blokuje proxy środowiska (CONNECT 403). Zapisano projekt dostępu do `commons.wikimedia.org` i `upload.wikimedia.org`, ale wymaga on opublikowania w ustawieniach środowiska. Nie zastąpiono miasta wygenerowaną sceną ani nie przypisano przypadkowemu zdjęciu niepotwierdzonej lokalizacji.

Konfiguracja jest gotowa w **Dostosuj → DC — Lokalność i zdjęcie miasta**. Można wybrać własną autentyczną fotografię z Biblioteki mediów, podać autora i link do źródła oraz włączyć jej wyświetlanie. ALT i podpis edytuje się w Bibliotece mediów. Administrator powinien mieć prawo publikacji zdjęcia i zachować wymagane oznaczenia autora/licencji. Wyłączenie opcji ukrywa samą fotografię; nie usuwa treści lokalnej ani realizacji.

Bez wybranego zdjęcia i bez zweryfikowanego pliku w paczce sekcja nie dodaje pustej ramki. Przygotowanie tych pól **nie stanowi zakończenia prośby o rzeczywiste zdjęcie Stalowej Woli**. Ten element pozostaje do uzupełnienia po uzyskaniu materiału i sprawdzeniu jego źródła.

## Zakres publikacji i ochrony SEO

Zmiana nie obejmuje bezpośredniego wdrożenia na Hostinger ani zmiany domeny. Poprzednia dyspozycja właściciela dopuszcza push do `main` po weryfikacji; faktyczny status należy sprawdzić w raporcie i historii Git. Sam ZIP lub dokument nie potwierdza wykonanego push ani instalacji produkcyjnej.

Zachowane są adresy stron, H1–H3, treści lokalne i prawne, meta title/description, canonical, robots, OG/Twitter, schema i wartości Rank Math. Jedyną zamierzoną zmianą istniejących linków kontaktowych jest usunięcie e-maila ze stopki. Źródła nowych obrazów i status miasta: [SOURCES.md](../assets/SOURCES.md). Bazowe instrukcje Architectural Service: [UPDATE_2_0.md](UPDATE_2_0.md).
