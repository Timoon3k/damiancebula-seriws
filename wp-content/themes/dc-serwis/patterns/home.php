<?php
/**
 * Title: Strona główna
 * Slug: dc-serwis/home
 * Categories: dc-serwis
 * Inserter: true
 */
?>
<!-- wp:group {"tagName":"section","className":"hero home-hero"} -->
<section class="wp-block-group hero home-hero">
<!-- wp:group {"tagName":"div","className":"hero-copy"} -->
<div class="wp-block-group hero-copy">
<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Naprawiamy.<br>Montujemy.<br><span class="accent">Przywracamy<br>komfort.</span></h1>
<!-- /wp:heading -->
<!-- wp:paragraph {"className":"hero-intro"} -->
<p class="hero-intro">Serwis klimatyzacji i AGD<br>w Stalowej Woli.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:image {"sizeSlug":"full","className":"hero-media"} -->
<figure class="wp-block-image size-full hero-media"><img src="<?php echo esc_url(get_theme_file_uri('assets/images/editorial-hvac-hero-1600.webp')); ?>" alt="Zdjęcie ilustracyjne: technik przy jednostce wewnętrznej klimatyzacji"/></figure>
<!-- /wp:image -->
</section>
<!-- /wp:group -->
<!-- wp:group {"tagName":"section","className":"wrap services","anchor":"uslugi"} -->
<section class="wp-block-group wrap services" id="uslugi">
<!-- wp:group {"tagName":"article","className":"service-card"} -->
<article class="wp-block-group service-card">
<!-- wp:html -->
<?php echo dc_icon('snow'); ?>
<!-- /wp:html -->
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Klimatyzacja</h2>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Montaż, serwis, czyszczenie i naprawa klimatyzacji w Stalowej Woli.</p>
<!-- /wp:paragraph -->
<!-- wp:image {"sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url(get_theme_file_uri('assets/images/editorial-ac-interior-1600.webp')); ?>" alt="Zdjęcie ilustracyjne: klimatyzator ścienny w nowoczesnym wnętrzu"/></figure>
<!-- /wp:image -->
<!-- wp:html -->
<a class="card-link" href="<?php echo esc_url(home_url('/serwis-klimatyzacji-stalowa-wola/')); ?>"><span class="screen-reader-text">Klimatyzacja — poznaj usługę</span><?php echo dc_icon(); ?></a>
<!-- /wp:html -->
</article>
<!-- /wp:group -->
<!-- wp:group {"tagName":"article","className":"service-card"} -->
<article class="wp-block-group service-card">
<!-- wp:html -->
<?php echo dc_icon('washer'); ?>
<!-- /wp:html -->
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Serwis AGD</h2>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Naprawa pralek, zmywarek i lodówek w Stalowej Woli.</p>
<!-- /wp:paragraph -->
<!-- wp:image {"sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url(get_theme_file_uri('assets/images/editorial-washer-1600.webp')); ?>" alt="Zdjęcie ilustracyjne: pralka automatyczna w ciemnym wnętrzu"/></figure>
<!-- /wp:image -->
<!-- wp:html -->
<a class="card-link" href="<?php echo esc_url(home_url('/serwis-agd-stalowa-wola/')); ?>"><span class="screen-reader-text">Serwis AGD — poznaj usługę</span><?php echo dc_icon(); ?></a>
<!-- /wp:html -->
</article>
<!-- /wp:group -->
</section>
<!-- /wp:group -->
<!-- wp:group {"tagName":"section","className":"wrap process"} -->
<section class="wp-block-group wrap process">
<!-- wp:group {"tagName":"div","className":""} -->
<div class="wp-block-group ">
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Jak przebiega<br>serwis?</h2>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Prosty i przejrzysty proces — od zgłoszenia do sprawnego działania.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:group {"tagName":"div","className":""} -->
<div class="wp-block-group ">
<!-- wp:html -->
<?php echo dc_icon('phone'); ?>
<!-- /wp:html -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">1. Kontakt</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Zgłaszasz problem telefonicznie lub przez formularz.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:group {"tagName":"div","className":""} -->
<div class="wp-block-group ">
<!-- wp:html -->
<?php echo dc_icon('calendar'); ?>
<!-- /wp:html -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">2. Diagnoza</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Ustalamy przyczynę usterki i zakres prac.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:group {"tagName":"div","className":""} -->
<div class="wp-block-group ">
<!-- wp:html -->
<?php echo dc_icon('tools'); ?>
<!-- /wp:html -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">3. Serwis</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Wykonujemy uzgodnioną naprawę lub niezbędny serwis.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:group {"tagName":"div","className":""} -->
<div class="wp-block-group ">
<!-- wp:html -->
<?php echo dc_icon('check'); ?>
<!-- /wp:html -->
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">4. Sprawne działanie</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Sprawdzamy urządzenie po zakończeniu prac.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</section>
<!-- /wp:group -->
<!-- wp:group {"tagName":"section","className":"wrap local-projects"} -->
<section class="wp-block-group wrap local-projects">
<!-- wp:group {"tagName":"div","className":"local-copy","anchor":"o-mnie"} -->
<div class="wp-block-group local-copy" id="o-mnie">
<!-- wp:paragraph {"className":"eyebrow"} -->
<p class="eyebrow">Stalowa Wola i okolice</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Lokalny serwis<br>ze <span class="accent">Stalowej Woli</span></h2>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Damian Cebula — montaż i serwis klimatyzacji oraz naprawa AGD dla domów, mieszkań i biur. Zakres dojazdu i termin ustalamy podczas kontaktu.</p>
<!-- /wp:paragraph -->
<!-- wp:html -->
<a class="button" href="<?php echo esc_url(home_url('/o-firmie/')); ?>">Poznaj serwis <?php echo dc_icon(); ?></a>
<!-- /wp:html -->
</div>
<!-- /wp:group -->
<!-- wp:group {"tagName":"div","className":""} -->
<div class="wp-block-group ">
<!-- wp:group {"tagName":"div","className":"gallery-heading","anchor":"moje-prace"} -->
<div class="wp-block-group gallery-heading" id="moje-prace">
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Realizacje</h2>
<!-- /wp:heading -->
<!-- wp:html -->
<a href="<?php echo esc_url(home_url('/realizacje/')); ?>"><?php echo dc_icon(); ?><span class="screen-reader-text">Zobacz wszystkie realizacje</span></a>
<!-- /wp:html -->
</div>
<!-- /wp:group -->
<!-- wp:group {"tagName":"div","className":"mini-gallery"} -->
<div class="wp-block-group mini-gallery">
<!-- wp:image {"sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><a href="<?php echo esc_url(get_theme_file_uri('assets/images/klimatyzator-scienny-gotowy-montaz-1600.webp')); ?>"><img src="<?php echo esc_url(get_theme_file_uri('assets/images/klimatyzator-scienny-gotowy-montaz-1600.webp')); ?>" alt="Klimatyzator ścienny zamontowany na szarej ścianie"/></a></figure>
<!-- /wp:image -->
<!-- wp:image {"sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><a href="<?php echo esc_url(get_theme_file_uri('assets/images/montaz-klimatyzacji-jednostka-zewnetrzna-aux-480.webp')); ?>"><img src="<?php echo esc_url(get_theme_file_uri('assets/images/montaz-klimatyzacji-jednostka-zewnetrzna-aux-480.webp')); ?>" alt="Jednostka zewnętrzna AUX na elewacji budynku"/></a></figure>
<!-- /wp:image -->
<!-- wp:image {"sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><a href="<?php echo esc_url(get_theme_file_uri('assets/images/serwis-klimatyzacji-pompa-prozniowa-960.webp')); ?>"><img src="<?php echo esc_url(get_theme_file_uri('assets/images/serwis-klimatyzacji-pompa-prozniowa-960.webp')); ?>" alt="Pompa próżniowa podczas prac przy instalacji klimatyzacji"/></a></figure>
<!-- /wp:image -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
</section>
<!-- /wp:group -->
<!-- wp:group {"tagName":"section","className":"wrap text-section"} -->
<section class="wp-block-group wrap text-section">
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Serwis klimatyzacji i AGD w Stalowej Woli</h2>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Klimatyzator wymaga przeglądu, a pralka przestała działać? Opisz objawy i podaj model urządzenia. Ustalimy kolejne kroki: rozpoznanie usterki, możliwy zakres naprawy i wycenę przed rozpoczęciem uzgodnionych prac.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p><a href="<?php echo esc_url(home_url('/serwis-klimatyzacji-stalowa-wola/')); ?>">Montaż i naprawa klimatyzacji</a> · <a href="<?php echo esc_url(home_url('/serwis-agd-stalowa-wola/')); ?>">Naprawa pralek i zmywarek</a></p>
<!-- /wp:paragraph -->
</section>
<!-- /wp:group -->
<!-- wp:group {"tagName":"div","className":"wrap"} -->
<div class="wp-block-group wrap">
<!-- wp:shortcode -->
[dc_google_reviews]
<!-- /wp:shortcode -->
</div>
<!-- /wp:group -->
