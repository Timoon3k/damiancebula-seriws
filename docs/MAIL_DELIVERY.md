# Formularz — dostarczanie do kontakt@damiancebula-serwis.pl

Odbiorca jest ustawiony na stałe w motywie: **kontakt@damiancebula-serwis.pl**. Dane przesłane przez odwiedzającego nie mogą podmienić odbiorcy. Nagłówek Reply-To zawiera zweryfikowany adres e-mail odwiedzającego, więc odpowiedź z firmowej skrzynki trafia do zgłaszającego. Treść zawiera potwierdzenie zgody i czas zgłoszenia.

Motyw przekazuje wiadomości do `wp_mail`. Potwierdzenie sukcesu oznacza przyjęcie do wysyłki przez skonfigurowany transport; nie jest dowodem dostarczenia do skrzynki. Lokalny test przechwytuje pocztę i sprawdza dokładny adresat/Reply-To — niczego nie wysyła na prawdziwy adres.

## Konfiguracja na Hostinger

1. Sprawdź w hPanel, czy skrzynka kontakt@damiancebula-serwis.pl istnieje i można zalogować się do webmaila.
2. W WordPress skonfiguruj jedną wtyczkę SMTP, np. WP Mail SMTP lub FluentSMTP. Wybierz własny serwer SMTP, jeżeli taki transport udostępnia skrzynka.
3. Wpisz host, port i rodzaj szyfrowania dokładnie z ustawień klienta pocztowego tej skrzynki w hPanel. Nie zgaduj: wartości zależą od usługi pocztowej/planów Hostinger lub Titan.
4. Ustaw nadawcę kontakt@damiancebula-serwis.pl oraz nazwę Damian Cebula. Uwierzytelnij tę skrzynkę w panelu wtyczki; hasła nie zapisuj w repozytorium ani nie wysyłaj w czacie. Zachowaj weryfikację TLS.
5. Sprawdź konfigurację SPF, DKIM i DMARC dla faktycznego dostawcy. Zachowaj istniejące rekordy poczty — nie resetuj całej strefy DNS i nie twórz drugiego rekordu SPF.
6. Wykonaj zatwierdzony test z panelu SMTP, a następnie zgłoszenie przez formularz. Sprawdź skrzynkę, folder spam i raport dostarczalności; odpowiedz, aby zweryfikować Reply-To.

Dane SMTP nie są częścią paczki motywu. Kod nie może sam potwierdzić otrzymania wiadomości przez serwer odbiorcy bez dostępu do rzeczywistej konfiguracji poczty.
