# Aktualizacja 1.4 — ostre logo i bezpośrednia mapa

Logo w nagłówku korzysta z oryginalnego obrazu w bibliotece mediów, zamiast powiększanej miniatury. Jeśli starszy WordPress zapisał przycięcie 220 × 64 px, motyw odnajduje powiązany oryginał. Nie zmienia wybranego załącznika ani nie zastępuje świadomego wycięcia samego znaku pełnym logotypem. Domyślne logo pozostaje wektorem SVG. Nowe ustawienia logo dopuszczają elastyczną szerokość i wysokość zamiast wymuszania małego przycięcia.

Mapa Google jest osadzona bezpośrednio w Kontakcie i wczytuje się automatycznie, bez przycisku zgody. Działa także po przejściu AJAX i bez JavaScript. Zachowano podany wcześniej link lub kod iframe; puste pole używa adresu Aleje Jana Pawła II 42, 37-450 Stalowa Wola. Przełącznik administratora pozwala ukryć mapę. Adres tekstowy i link do Google Maps pozostają dostępne przy zablokowanej ramce. Polityka motywu opisuje automatyczne połączenie z Google.

## Instalacja w nowej witrynie na Hostinger

1. W nowej, oddzielnej instalacji WordPress wybierz **Wygląd → Motywy → Dodaj → Wyślij motyw** i zainstaluj `dc-serwis.zip` 1.4.0. Przy aktualizacji istniejącego motywu potwierdź zastąpienie jego plików.
2. W **Wygląd → DC — synchronizacja** uruchom synchronizację. Zarządzane, niezmienione ręcznie treści zostaną zaktualizowane; własne strony i polityka pozostają zachowane. Jeśli edytowano własną politykę, uaktualnij jej opis automatycznego ładowania mapy.
3. W **Dostosuj → Tożsamość witryny** wybierz oryginalny PNG, najlepiej co najmniej 1180 px szerokości, i **Pomiń przycinanie**. Jeśli biblioteka zachowała już oryginał poprzedniego przycięcia, motyw użyje go automatycznie. Mały plik bez oryginału wymaga ponownego przesłania; brakujących szczegółów nie da się odtworzyć przez powiększenie. Usunięcie własnego wyboru włącza domyślne SVG.
4. W **Dostosuj → DC — Google: mapa i opinie** pozostaw włączone **Pokaż mapę Google w Kontakcie**. Pole mapy można pozostawić puste albo wkleić pełny kod z Google Maps → Udostępnij → Umieść mapę. Skrócone linki `maps.app.goo.gl` nie są kodem osadzenia. Klucz API nie jest potrzebny.
5. Wyczyść pamięć podręczną WordPress/LiteSpeed, Hostinger i przeglądarki. Sprawdź Kontakt oraz logo na komputerze i telefonie. Jeśli optymalizator obrazów ponownie zmienia źródło logo na małą miniaturę, wyklucz obraz logo z tej funkcji.

Push do `main` aktualizuje repozytorium; nie instaluje automatycznie plików na Hostinger. Stara witryna, baza i przypisanie domeny pozostają bez zmian.

Wyniki w [raporcie testów](TEST_REPORT.md). Google Maps w testach przeglądarkowych zastąpiono jawną atrapą, bez wysyłania ruchu do Google. Zrzuty mapy pokazują tę atrapę, a nie potwierdzenie dostępności zewnętrznej usługi. Test logo używa syntetycznego pliku 2048 px i rzeczywistego przycięcia WordPressa 220 × 64 px.
