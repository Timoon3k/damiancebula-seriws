# Aktualizacja 1.3 — zdjęcia, logo i widoczne przejścia

- Galerie pokazują całe fotografie. Portretowe realizacje mają grafitowe marginesy zamiast uciętych jednostek i pompy. Lightbox nadal otwiera pełny plik.
- Logo z pełnym napisem nie jest już ściskane do szerokości małego znaku ani dublowane drugim napisem. Nowy wariant ma jasne litery na ciemnym tle, stylistykę DC z falami powietrza i separator. Ciemne wgrane logo z przezroczystymi marginesami jest automatycznie dopasowywane; w Dostosuj → Tożsamość witryny można ręcznie wybrać kontrast.
- Scrollspy jest wyłączony. Menu prowadzi do pełnych podstron także ze strony głównej. Sticky nagłówek pozostał.
- Animacje wejścia, wyjścia AJAX, tytułu/hero, sekcji podczas przewijania i pomarańczowa smuga działają na desktopie i telefonie bez wymagania View Transitions API. Ustawienie ograniczenia ruchu wyłącza animacje.
- Formularz kieruje pocztę na kontakt@damiancebula-serwis.pl i dodaje bezpieczny Reply-To. Faktyczny transport SMTP wymaga konfiguracji skrzynki na hostingu — patrz MAIL_DELIVERY.md.

Zainstaluj ZIP w nowej, oddzielnej instalacji. Po aktualizacji wyczyść cache WordPress/Hostinger oraz przeglądarki, aby nie używała starego JavaScript/CSS. Własne edycje stron i ustawienia logo pozostają zachowane. Kod w repozytorium nie publikuje automatycznie witryny na Hostinger.
