# Aktualizacja 1.6 — spokojniejszy wygląd premium

Wersja 1.6 nadaje witrynie bardziej przestronny wygląd w dotychczasowej czerni, graficie i pomarańczu. Na życzenie właściciela projekt rozwija pierwotną makietę, zamiast powielać jej układ 1:1. Duża fotografia w hero, otwarte sekcje usług, oszczędniejsze dekoracje i większe odstępy budują nową hierarchię. Formularz, FAQ, długie teksty i galerie otrzymują spójną oprawę. Na telefonie mini-galeria strony głównej przewija się natywnie w poziomie.

Lokalny **Manrope** obejmuje wagi 200–800 i polskie znaki. Dwa pliki WOFF2 zajmują łącznie około 40 KB; nie wymagają połączenia z Google Fonts ani zewnętrznym CDN. Źródło i dołączoną licencję SIL OFL 1.1 opisuje [dokumentacja fontów](FONTS.md).

Zmiany dotyczą wyglądu i dostarczania fontów. Wszystkie teksty SEO, nagłówki H1–H3, URL, metadane, schema, linki usług i pliki fotografii pozostają zachowane, również obrazy ilustracyjne `editorial-*`. Nie trzeba ponownie wpisywać treści ani odtwarzać podstron. Zakres ochrony treści i zasady projektu opisuje [PREMIUM_DESIGN.md](PREMIUM_DESIGN.md).

Pozostają mobilny panel menu, sticky nagłówek, nawigacja AJAX, migawka tekstu oraz wariant ograniczonego ruchu. Zachowano ostre logo, mapę w Kontakcie bez przycisku zgody, formularz z checkboxem prywatności i odbiorcą **kontakt@damiancebula-serwis.pl** oraz podpis twórcy **majewskitomasz.pl**. Rzeczywiste doręczenie formularza nadal zależy od konfiguracji poczty na hostingu.

## Instalacja w nowej witrynie na Hostinger

1. W **nowej, oddzielnej instancji WordPress** wykonaj kopię jej bieżących plików i bazy. Otwórz **Wygląd → Motywy → Dodaj → Wyślij motyw**, wgraj `dc-serwis.zip` **1.6.0** i potwierdź zastąpienie plików motywu. Nie wgrywaj paczki do starej witryny ani jej bazy.
2. Zachowaj własne logo, ustawienia firmy, mapy i SEO. Nie trzeba ponownie wstawiać wzorców. Jeśli raport synchronizacji zgłasza brakujące zarządzane strony lub zdjęcia, sprawdź go w **Wygląd → DC — synchronizacja**; ręczne edycje pozostają chronione.
3. Wyczyść pamięć podręczną WordPress/LiteSpeed, Hostinger i przeglądarki. Sprawdź, czy optymalizacja CSS lub fontów nie używa starszych plików.
4. Sprawdź sześć głównych podstron i politykę prywatności na komputerze, tablecie i telefonie. Skontroluj czytelność polskich znaków, menu z klawiatury, przejścia AJAX i Wstecz, migawkę i ograniczenie ruchu, poziome przewijanie galerii, lightbox oraz mapę. Formularz sprawdź po skonfigurowaniu SMTP, potwierdzając wiadomość w firmowej skrzynce.

Push do `main` aktualizuje repozytorium; **nie instaluje automatycznie motywu na Hostinger**. Stara witryna, jej baza i przypisanie domeny pozostają bez zmian. Adres techniczny nowej instancji zachowaj jako `noindex` do osobnego przełączenia domeny.

Dokument opisuje zakres aktualizacji i kontrolę po instalacji. Nie potwierdza zakończenia testów ani publikacji na hostingu. Aktualne wyniki znajdują się w [raporcie testów](TEST_REPORT.md).
