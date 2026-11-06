# Pull Request — Architectural Service 2.0

Gałąź: `design/architectural-service`, docelowo `main`. PR nie został utworzony: odczyt API GitHuba zakończył się blokadą proxy CONNECT 403. Porównanie gałęzi po push jest dostępne pod https://github.com/Timoon3k/damiancebula-seriws/compare/main...design/architectural-service — ten adres nie jest istniejącym PR.

Tytuł: **Redesign DC Serwis as Architectural Service (2.0.0)**. Poniżej gotowa treść do przeglądu. PR powinien pozostać szkicem do czasu porównania produkcyjnego SEO.

The existing 1.6 theme used dark panels and shutter/page-dimming transitions. This redesign introduces Architectural Service: porcelain, petrol, sage and copper, asymmetric editorial layouts, distinct Climate and AGD compositions, responsive illustrative interiors and a recolored DC vector lockup. The favicon and authentic project photographs remain unchanged.

Rebuild the CSS foundation instead of stacking premium overrides. Keep the hero visible immediately and reveal selected off-screen groups once; AJAX retains the current view during fetch and updates history, focus and SEO without masking or dimming main. Keep the right-side modal, contact form, map, Trustindex integration and legal content. The presentation adapter changes known default illustrations without rewriting saved Gutenberg content or SEO fields.

Validation on the isolated local WordPress:
- 56 page/viewport checks across seven routes and 360–1920px; AJAX/history, no-JS, lightbox and mobile navigation pass.
- 15 axe states with zero detected violations; keyboard, touch, reduced motion and privacy-page footer contrast checked separately.
- Seven complete local semantic before/after snapshots match, including H1–H3, text, legal content, metadata, OG/Twitter, canonical, robots, JSON-LD and existing links. All 29 protected client image files match SHA256.
- Contact validation, mail interception/recipient, editor blocks, branding, automatic map embedding and PHP/JS/JSON checks pass. No real test email was sent; Google was mocked in tests.
- 42 before/after screenshots at 1440/768/390px. Before views replay actual pre-change local HTML with c007e40 assets; they are not production screenshots.
- 18 Lighthouse runs: median mobile LCP 2258/2115/1668ms (home/climate/AGD), CLS 0; desktop LCP 513/523/410ms. Synthetic touch max136ms; field INP is unmeasured.
- Installable 2.0.0 ZIP verified: 85 files under dc-serwis/, CRC and exact source match, local fonts/license, no legacy premium stylesheet layers.

Review evidence: docs/VISUAL_COMPARISON.md, docs/TEST_REPORT.md, docs/SEO_PROTECTION_REPORT.md, docs/PERFORMANCE_REPORT.md and docs/test-results/architectural/.

Pending before production acceptance: the managed proxy blocks damiancebula-serwis.pl and api.github.com (CONNECT403). The required public production SEO snapshot/comparison could not be obtained. The saved environment network draft must be published, then production-specific Rank Math metadata and active Google/Trustindex/SMTP must be verified on staging. Local parity is not a claim of production parity or field Core Web Vitals.

No merge, DNS change, indexing request or production deployment is included. Keep this PR in draft until the production SEO verification is complete.
