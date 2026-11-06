# Aktualizacja 1.5 — mobilne menu i animacje migawki

Na telefonach nawigacja przyjmuje postać panelu wysuwanego z prawej strony nad przyciemnionym tłem. Menu jest modalne: podczas otwarcia fokus pozostaje w panelu, a tło strony nie przejmuje interakcji. Menu można zamknąć przyciskiem, klawiszem Escape lub kliknięciem tła. Wybranie podstrony zamyka panel i rozpoczyna przejście. Sticky nagłówek pozostaje, a scrollspy nadal jest wyłączony.

Przejścia AJAX obejmują stronę główną i pozostałe podstrony na telefonach oraz komputerach. Strony z aktywnym widgetem opinii mogą nadal przechodzić przez pełne ładowanie, aby uruchomić skrypty wtyczki. Podczas przewijania tekst odsłania się jak migawka, z użyciem przycięcia zamiast błysku całej sekcji. Dekoracyjne podkreślenia są uproszczone. Przy włączonym ograniczeniu ruchu tekst jest od razu widoczny, bez animowanych odsłonięć i przejść. Bez JavaScript pozostają zwykłe adresy podstron i dostępna nawigacja.

Aktualizacja zachowuje logo z oryginalnego pliku lub domyślnego SVG, galerie pokazujące całe zdjęcia oraz mapę osadzoną bezpośrednio w Kontakcie bez przycisku zgody. Dane firmy i własny adres mapy pozostają edytowalne. Formularz nadal kieruje wiadomości na **kontakt@damiancebula-serwis.pl**; dostarczalność zależy od konfiguracji poczty na hostingu.

## Instalacja w nowej witrynie na Hostinger

1. W **nowej, oddzielnej instancji WordPress** wykonaj kopię jej bieżących plików i bazy. Wybierz **Wygląd → Motywy → Dodaj → Wyślij motyw**, wgraj `dc-serwis.zip` 1.5.0 i potwierdź zastąpienie plików tego motywu. Nie wgrywaj paczki do starej witryny ani jej bazy.
2. W **Wygląd → DC — synchronizacja** sprawdź raport i w razie potrzeby uruchom synchronizację. Ręczne edycje stron, własna polityka i ustawienia pozostają zachowane. Do menu i animacji nie trzeba ręcznie wstawiać nowych bloków.
3. Wyczyść pamięć podręczną WordPress/LiteSpeed, Hostinger i przeglądarki, aby pobrać aktualne pliki CSS i JavaScript.
4. Sprawdź wszystkie sześć podstron na telefonie, tablecie i komputerze: otwieranie oraz zamykanie menu, klawisze Tab i Escape, powrót Wstecz, przejścia AJAX i odsłanianie tekstu. Powtórz kontrolę z włączonym ograniczeniem ruchu oraz bez JavaScript. Sprawdź również logo, mapę i formularz; dostarczenie wiadomości potwierdź w firmowej skrzynce po skonfigurowaniu SMTP.

Push do `main` aktualizuje repozytorium; nie wgrywa automatycznie motywu na Hostinger. Stara strona, jej baza i przypisanie domeny pozostają bez zmian. Adres techniczny nowej instancji zachowaj jako `noindex` do czasu osobnego, świadomego przełączenia domeny.

Ten dokument opisuje zakres aktualizacji i sposób jej sprawdzenia. Nie potwierdza zakończenia testów, wysyłki poczty ani publikacji na hostingu. Aktualny stan weryfikacji należy odczytać z [raportu testów](TEST_REPORT.md).
