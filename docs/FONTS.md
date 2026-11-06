# Lokalny krój Manrope

Witryna i edytor WordPress używają rodziny **Manrope**. Dwa lokalne pliki WOFF2 obsługują zmienny zakres grubości **200–800**, bez siedmiu oddzielnych odmian. Łączny rozmiar plików: **39956 B**.

## Źródło i licencja

- Paczka: [`@fontsource-variable/manrope` 5.3.0](https://www.npmjs.com/package/@fontsource-variable/manrope/v/5.3.0).
- Pliki skopiowano bez modyfikacji z `package/files/` oficjalnej paczki Fontsource.
- Dane paczki: Manrope v20; źródło rodziny [google/fonts](https://github.com/google/fonts/tree/main/ofl/manrope), autorzy [The Manrope Project Authors](https://github.com/sharanda/manrope).
- Licencja: **SIL Open Font License 1.1**, pozwalająca na lokalne hostowanie i dołączenie do motywu. Pełny tekst i copyright są w [`OFL-Manrope.txt`](../wp-content/themes/dc-serwis/assets/fonts/OFL-Manrope.txt).

## Dostarczanie i polskie znaki

`theme.json` deklaruje dwie reguły `fontFace`, zakresy `unicodeRange` i `fontDisplay: swap`. WordPress generuje odpowiadające im `@font-face` z lokalnymi URL motywu. Nie potrzeba połączeń z Google Fonts, Fontsource CDN ani zewnętrznych arkuszy fontów. Nie należy dodawać równoległego importu z Google Fonts.

`latin` obsługuje podstawowy alfabet, cyfry i m.in. ó/Ó; `latin-ext` dostarcza pozostałe polskie litery. Sprawdzono mapy znaków przez FontTools: **ąćęłńóśźżĄĆĘŁŃÓŚŹŻ**. Oba pliki zawierają zmienną oś `wght` 200–800. Fallback: Arial, Helvetica, sans-serif. Tymczasowy dekoder Brotli do weryfikacji działał wyłącznie z `/tmp`; nie dodano zależności do projektu ani motywu.

| Plik w `assets/fonts/` | Rozmiar | SHA256 |
|---|---:|---|
| `manrope-latin-ext-wght-normal.woff2` | 15120 B | `3911b66d9f2e005a4b989223405d0e5032619c668597ba467cc76a23c8fffcfb` |
| `manrope-latin-wght-normal.woff2` | 24836 B | `a30ddcd349703aff7464c34bef3fffdff405ee50c113440d7c8693c02d210972` |

## Reguły CSS — odpowiednik deklaracji WordPress

Przykład dokumentuje deklaracje. Przy aktywnym `theme.json` nie trzeba drugi raz dodawać ich do arkusza premium. Ścieżki są względne wobec CSS w `assets/`.

```css
@font-face {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 200 800;
  font-display: swap;
  src: url('fonts/manrope-latin-ext-wght-normal.woff2') format('woff2');
  unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
}
@font-face {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 200 800;
  font-display: swap;
  src: url('fonts/manrope-latin-wght-normal.woff2') format('woff2');
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}
```

## Preload

Preload powinien wskazywać lokalny URL z `get_theme_file_uri()`, używać `as="font"`, `type="font/woff2"` i `crossorigin`. Polski nagłówek zawiera zarówno znaki podstawowe, jak i litery z `latin-ext`, więc oba małe pliki mogą być potrzebne już w pierwszym widoku. Nie należy preloadować nieużywanych podzbiorów ani oddzielnych wag. `font-display: swap` zachowuje widoczny tekst podczas pobierania.
