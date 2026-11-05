<?php
if (!defined('ABSPATH')) { exit; }
function dc_map_url($value) {
    $url = esc_url_raw($value, ['https']);
    $host = wp_parse_url($url, PHP_URL_HOST);
    $path = wp_parse_url($url, PHP_URL_PATH);
    return in_array($host, ['www.google.com','maps.google.com'], true) && str_starts_with((string) $path, '/maps/embed') ? $url : '';
}
function dc_reviews_code($value) {
    $value = trim(sanitize_text_field($value));
    return preg_match('/^\[trustindex\s+[^\[\]]+\]$/', $value) ? $value : '';
}
add_action('customize_register', function ($customizer) {
    $customizer->add_section('dc_integrations', ['title'=>'DC — Google: mapa i opinie']);
    $customizer->add_setting('dc_map_url', ['default'=>'', 'sanitize_callback'=>'dc_map_url']);
    $customizer->add_control('dc_map_url', ['section'=>'dc_integrations','label'=>'Zweryfikowany adres osadzenia Google Maps (HTTPS)','description'=>'Wklej wyłącznie adres src z Google Maps → Udostępnij → Umieść mapę. Nie podawaj niepotwierdzonego adresu siedziby.','type'=>'url']);
    $customizer->add_setting('dc_reviews_shortcode', ['default'=>'', 'sanitize_callback'=>'dc_reviews_code']);
    $customizer->add_control('dc_reviews_shortcode', ['section'=>'dc_integrations','label'=>'Shortcode oficjalnego widgetu Trustindex','description'=>'Np. shortcode dostarczony przez aktywną wtyczkę Trustindex dla zweryfikowanego profilu firmy. Bez ręcznie wpisywanych ocen.','type'=>'text']);
});
add_shortcode('dc_google_map', function () {
    $url = dc_map_url(get_theme_mod('dc_map_url', ''));
    if (!$url) { return ''; }
    return '<section class="map-consent"><h2>Znajdź nas na mapie</h2><p>Mapa Google jest usługą zewnętrzną. Jej włączenie połączy przeglądarkę z Google i może przekazać m.in. adres IP. <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">Zasady prywatności Google</a>.</p><button class="button" type="button" data-map-src="' . esc_url($url) . '">Włącz mapę Google</button><noscript><p>Do osadzenia mapy potrzebny jest JavaScript. Możesz korzystać z danych kontaktowych powyżej.</p></noscript></section>';
});
add_shortcode('dc_google_reviews', function () {
    $code = dc_reviews_code(get_theme_mod('dc_reviews_shortcode', ''));
    if (!$code || !shortcode_exists('trustindex')) { return ''; }
    // Trustindex scripts are plugin-owned: full navigation ensures correct initialization.
    return '<section class="google-reviews"><h2>Opinie klientów w Google</h2>' . do_shortcode($code) . '</section>';
});
