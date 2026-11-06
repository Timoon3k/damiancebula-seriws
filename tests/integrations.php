<?php
/** Local WP-CLI assertions: no external requests and no persistent settings. */
function dc_expect($condition, $label) {
    if (!$condition) { throw new RuntimeException($label); }
    WP_CLI::log('PASS: ' . $label);
}
function dc_test_mod($key, $value, $callback) {
    $filter = static function () use ($value) { return $value; };
    add_filter('theme_mod_' . $key, $filter, 999);
    try { return $callback(); } finally { remove_filter('theme_mod_' . $key, $filter, 999); }
}

$privacy_before = get_option('wp_page_for_privacy_policy');
$mods_before = get_theme_mods();
try {
    $invalid = [
        'https://evil.example/maps/embed?pb=test',
        'https://www.google.com.evil.example/maps/embed?pb=test',
        'https://evil.example@www.google.com/maps/embed?pb=test',
        'https://www.google.com:444/maps/embed?pb=test',
        'http://www.google.com/maps/embed?pb=test',
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        '//www.google.com/maps/embed?pb=test',
        'https://www.google.com/maps/embed?pb[]=test',
        'https://www.google.com/maps/embed/v1/place?key=test&q=Stalowa+Wola',
        'https://www.google.com/maps?query[]=test',
        'https://www.google.com/search?q=Stalowa+Wola',
        '<script>alert(1)</script><iframe src="https://www.google.com/maps/embed?pb=test"></iframe>',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<iframe src="https://www.google.com/maps/embed?pb=test"></iframe><img src=x onerror=alert(1)>',
        '<iframe srcdoc="malicious"></iframe>',
        '<iframe src="https://evil.example/maps/embed?pb=test"></iframe>',
    ];
    foreach ($invalid as $index => $input) { dc_expect(dc_map_url($input) === '', 'Map rejects unsafe/malformed input ' . ($index + 1)); }
    $pb = 'https://www.google.com/maps/embed?pb=!1m18!2sStalowa%20Wola';
    dc_expect(dc_map_url($pb) !== '', 'Map accepts official Google embed URL');
    $iframe = '<iframe src="' . $pb . '" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
    dc_expect(dc_map_url($iframe) === dc_map_url($pb), 'Full iframe becomes its safe src URL');
    dc_expect(dc_map_url('<iframe src="' . $pb . '" onload="alert(1)"></iframe>') === dc_map_url($pb), 'Iframe attributes never survive normalization');
    $embeds = [
        'https://www.google.com/maps?q=Stalowa+Wola&output=embed',
        'https://maps.google.com/?q=Stalowa+Wola',
        'https://www.google.pl/maps/search/?api=1&query=Stalowa+Wola',
        'https://www.google.com/maps/place/Aleje+Jana+Paw%C5%82a+II+42,+Stalowa+Wola/@50.5,22.0,15z/',
        'https://www.google.com/maps/search/Stalowa+Wola/',
        'https://www.google.com/maps/@50.5,22.0,15z',
        'https://www.google.com/maps?cid=123456789',
    ];
    foreach ($embeds as $index => $input) { dc_expect(str_contains(dc_map_url($input), 'output=embed'), 'Map converts supported full Google link ' . ($index + 1)); }
    dc_expect(str_contains(dc_map_url('<iframe src="https://www.google.com/maps?q=Stalowa+Wola&amp;output=embed"></iframe>'), 'output=embed'), 'Iframe HTML entities are decoded safely');
    $short = dc_map_normalize('https://maps.app.goo.gl/example');
    dc_expect(is_wp_error($short) && $short->get_error_code() === 'dc_map_short', 'Short link returns actionable validation error without fetching');
    $validity = dc_map_validate(new WP_Error(), 'https://maps.app.goo.gl/example');
    dc_expect($validity->has_errors() && str_contains($validity->get_error_message(), 'Umieść mapę'), 'Customizer explains how to replace shortened link');
    dc_expect(dc_reviews_code('[evil x="1"]') === '', 'Reviews rejects arbitrary shortcode');
    dc_expect(dc_reviews_code('[trustindex no-registration=google]') !== '', 'Reviews accepts Trustindex shortcode');

    dc_test_mod('dc_map_enabled', true, static function () use ($pb) {
        dc_test_mod('dc_map_url', '', static function () {
            $markup = do_shortcode('[dc_google_map]');
            dc_expect(str_contains($markup, '<iframe src='), 'Blank map configuration has a working default');
            dc_expect(str_contains($markup, esc_html(dc_company_address())), 'Default map visibly uses the confirmed company address');
            dc_expect(str_contains(html_entity_decode($markup), rawurlencode(dc_company_map_query())), 'Default embed query shares the company address source');
            dc_expect(str_contains($markup, 'loading="eager"') && !str_contains($markup, '<button'), 'Map loads automatically without an activation button');
            dc_expect(str_contains($markup, 'Otwórz w Google Maps') && str_contains($markup, 'referrerpolicy="no-referrer"'), 'Map and external fallback work without JavaScript and do not send a referrer');
            dc_expect(str_contains($markup, 'title="Adres firmy na mapie"'), 'Frame has an accessible title');
        });
        dc_test_mod('dc_map_url', $pb, static function () use ($pb) {
            $markup = do_shortcode('[dc_google_map]');
            dc_expect(str_contains(html_entity_decode($markup), dc_map_url($pb)), 'Existing custom embed is preserved');
            dc_expect(str_contains($markup, '<iframe src=') && !str_contains($markup, 'data-map-src'), 'Saved custom map is embedded directly');
        });
        dc_test_mod('dc_map_url', 'https://evil.example/maps/embed?pb=bad', static function () {
            $markup = do_shortcode('[dc_google_map]');
            dc_expect(!str_contains($markup, 'evil.example') && str_contains($markup, '<iframe src='), 'Invalid legacy setting uses the safe default');
        });
        dc_test_mod('dc_company_street', '', static function () {
            dc_test_mod('dc_company_postcode', '', static function () {
                dc_test_mod('dc_company_city', '', static function () {
                    dc_test_mod('dc_map_url', '', static function () {
                        $markup = do_shortcode('[dc_google_map]');
                        dc_expect(str_contains($markup, 'obszar dojazdu') && str_contains($markup, 'nie dokładny adres'), 'Missing address uses an explicitly labelled service area');
                    });
                });
            });
        });
    });
    dc_test_mod('dc_map_enabled', false, static function () { dc_expect(do_shortcode('[dc_google_map]') === '', 'Owner can explicitly hide the map'); });
    dc_test_mod('dc_reviews_shortcode', '', static function () { dc_expect(do_shortcode('[dc_google_reviews]') === '', 'Unconfigured reviews remain absent'); });
    dc_expect(get_option('wp_page_for_privacy_policy') === $privacy_before, 'Privacy page setting preserved');
    dc_expect(get_theme_mods() === $mods_before, 'Tests do not change saved theme settings');
    add_filter('dc_external_seo', '__return_true');
    try { dc_expect(dc_seo_plugin(), 'External SEO override supported'); } finally { remove_filter('dc_external_seo', '__return_true'); }
    WP_CLI::success('Integration assertions complete.');
} catch (Throwable $error) {
    WP_CLI::error($error->getMessage());
}
