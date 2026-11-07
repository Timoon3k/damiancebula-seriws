<?php
/** Main composition from the left-hand side of the owner's blue design board. */
if (!defined('ABSPATH')) { exit; }
?>
<section class="hero home-hero reference-hero" aria-labelledby="home-title">
    <figure class="hero-media"><?php echo dc_reference_image('hero', 'Zdjęcie ilustracyjne: klimatyzator ścienny i pralka w granatowym wnętrzu', true); ?></figure>
    <div class="wrap reference-hero-inner">
        <div class="hero-copy">
            <h1 id="home-title"><span><?php echo esc_html(dc_reference_text('heading_first')); ?></span>
                <span class="accent"><?php echo esc_html(dc_reference_text('heading_service')); ?></span>
                <span><?php echo esc_html(dc_reference_text('heading_local')); ?></span></h1>
            <p class="hero-intro"><?php echo dc_reference_lines('intro'); ?></p>
            <div class="hero-actions"><a class="button" href="<?php echo esc_url(home_url('/kontakt/')); ?>"><?php echo dc_icon('calendar'); ?>Umów serwis <?php echo dc_icon('chevron'); ?></a><a class="button button-outline" href="tel:+48794225139"><?php echo dc_icon('phone'); ?>794 225 139</a></div>
        </div>
    </div>
    <ul class="hero-benefits">
        <li><?php echo dc_icon('snow'); ?><p><strong>Serwis klimatyzacji</strong><span>Stalowa Wola</span></p></li>
        <li><?php echo dc_icon('washer'); ?><p><strong>Serwis AGD</strong><span>Stalowa Wola</span></p></li>
        <li><?php echo dc_icon('tools'); ?><p><strong>Diagnoza usterki</strong><span>i zakres prac</span></p></li>
        <li><?php echo dc_icon('shield'); ?><p><strong>Termin wizyty</strong><span>do uzgodnienia</span></p></li>
    </ul>
</section>
<section class="wrap services reference-services" id="uslugi" aria-label="Nasze usługi">
    <article class="service-card" id="klimatyzacja"><?php echo dc_icon('ac'); ?><div><h2><?php echo dc_reference_lines('climate_heading'); ?></h2><p><?php echo dc_reference_lines('climate_description'); ?></p></div><a class="card-link" href="<?php echo esc_url(home_url('/serwis-klimatyzacji-stalowa-wola/')); ?>"><?php echo dc_icon('chevron'); ?><span class="screen-reader-text">Serwis klimatyzacji — poznaj usługę</span></a></article>
    <article class="service-card" id="agd"><?php echo dc_icon('washer'); ?><div><h2><?php echo dc_reference_lines('agd_heading'); ?></h2><p><?php echo dc_reference_lines('agd_description'); ?></p></div><a class="card-link" href="<?php echo esc_url(home_url('/serwis-agd-stalowa-wola/')); ?>"><?php echo dc_icon('chevron'); ?><span class="screen-reader-text">Serwis AGD — poznaj usługę</span></a></article>
</section>
<section class="wrap reference-why" aria-labelledby="why-title">
    <div class="why-copy" data-reveal><h2 id="why-title"><?php echo esc_html(dc_reference_text('why_heading')); ?><br><span class="accent"><?php echo esc_html(dc_reference_text('why_name')); ?></span></h2><ul class="check-list"><?php foreach (array_filter(array_map('trim', explode("\n", dc_reference_text('why_points')))) as $point) : ?><li><?php echo dc_icon('check'); ?><span><?php echo esc_html($point); ?></span></li><?php endforeach; ?></ul></div>
    <figure class="why-media" data-reveal><div class="why-image-frame"><?php echo dc_reference_image('technician', 'Zdjęcie ilustracyjne: model w odzieży serwisowej obok granatowego samochodu'); ?><div class="van-brand" aria-hidden="true"><img src="<?php echo esc_url(get_theme_file_uri('assets/branding/dc-cog-snowflake.svg')); ?>" width="58" height="58" alt="" loading="lazy"><strong>Damian Cebula</strong><span>SERWIS</span></div></div><figcaption>Zdjęcie ilustracyjne</figcaption></figure>
</section>
<div class="wrap reference-assurances" aria-label="Jak działamy">
    <div><?php echo dc_icon('pin'); ?><p><strong>Stalowa Wola</strong><span>i okolice</span></p></div>
    <div><?php echo dc_icon('calendar'); ?><p><strong>Termin wizyty</strong><span>ustalany indywidualnie</span></p></div>
    <div><?php echo dc_icon('shield'); ?><p><strong>Uzgodniony</strong><span>zakres prac</span></p></div>
    <div><?php echo dc_icon('coins'); ?><p><strong>Przejrzysta</strong><span>wycena naprawy</span></p></div>
</div>
