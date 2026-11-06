<?php
if (!defined('ABSPATH')) { exit; }

/** Only a URL is retained from Google's iframe code; supplied HTML is never rendered. */
function dc_map_normalize($value) {
    if (!is_string($value)) { return new WP_Error('dc_map_invalid', 'Wklej link Google Maps lub kod iframe z opcji „Umieść mapę”.'); }
    $value = trim($value);
    if ($value === '') { return ''; }
    if (str_contains($value, '<')) {
        if (!preg_match('~\A<iframe\b[^>]*>\s*</iframe>\z~is', $value)) {
            return new WP_Error('dc_map_html', 'Wklej pojedynczy kod iframe z Google Maps, bez dodatkowego HTML.');
        }
        $tag = new WP_HTML_Tag_Processor($value);
        if (!$tag->next_tag('IFRAME') || !is_string($tag->get_attribute('src'))) {
            return new WP_Error('dc_map_src', 'Kod iframe musi zawierać adres src mapy Google.');
        }
        $value = trim($tag->get_attribute('src'));
    }
    $url = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    if (preg_match('/[\x00-\x20\\\\]/', $url) || !filter_var($url, FILTER_VALIDATE_URL)) {
        return new WP_Error('dc_map_url', 'Adres mapy jest nieprawidłowy. Skopiuj pełny link HTTPS lub kod z Google Maps → Udostępnij → Umieść mapę.');
    }
    $parts = wp_parse_url($url);
    $host = strtolower($parts['host'] ?? '');
    $path = $parts['path'] ?? '/';
    if (in_array($host, ['maps.app.goo.gl', 'goo.gl'], true)) {
        return new WP_Error('dc_map_short', 'Skrócony link Google nie nadaje się do osadzenia. Otwórz go w przeglądarce, a następnie wybierz Udostępnij → Umieść mapę i skopiuj kod iframe lub pełny adres Google Maps.');
    }
    if (($parts['scheme'] ?? '') !== 'https' || isset($parts['user']) || isset($parts['pass']) || isset($parts['port']) || !in_array($host, ['google.com', 'www.google.com', 'maps.google.com', 'google.pl', 'www.google.pl', 'maps.google.pl'], true)) {
        return new WP_Error('dc_map_host', 'Dozwolone są wyłącznie adresy HTTPS map Google w domenie google.com lub google.pl.');
    }
    parse_str($parts['query'] ?? '', $query);
    if ($path === '/maps/embed' && isset($query['pb']) && is_string($query['pb']) && $query['pb'] !== '') {
        return 'https://www.google.com/maps/embed?pb=' . rawurlencode($query['pb']);
    }
    if (str_starts_with($path, '/maps/embed/')) {
        return new WP_Error('dc_map_api', 'Ten adres korzysta z Maps Embed API. Wybierz bezpłatny kod z Google Maps → Udostępnij → Umieść mapę; klucz API nie jest potrzebny.');
    }
    $is_maps_path = $path === '/maps' || str_starts_with($path, '/maps/') || ($path === '/' && str_starts_with($host, 'maps.'));
    if (!$is_maps_path) { return new WP_Error('dc_map_path', 'Link musi prowadzić do mapy Google. Skopiuj go z Google Maps, a nie z wyników wyszukiwarki.'); }
    $search = $query['q'] ?? $query['query'] ?? '';
    if (!is_string($search)) { $search = ''; }
    if (!$search && !empty($query['query_place_id']) && is_string($query['query_place_id']) && preg_match('/^[A-Za-z0-9_-]+$/', $query['query_place_id'])) {
        $search = 'place_id:' . $query['query_place_id'];
    }
    if (!$search && preg_match('~^/maps/(?:search|place)/([^/]+)~', $path, $match)) { $search = urldecode($match[1]); }
    if (!$search && preg_match('~^/maps/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)~', $path, $match) && abs((float) $match[1]) <= 90 && abs((float) $match[2]) <= 180) {
        $search = $match[1] . ',' . $match[2];
    }
    if ($search !== '' && strlen($search) <= 2000 && !preg_match('/[\x00-\x1f]/', $search)) {
        return dc_map_search_url($search, true);
    }
    if (isset($query['cid']) && is_string($query['cid']) && preg_match('/^\d{1,25}$/', $query['cid'])) {
        return 'https://www.google.com/maps?cid=' . $query['cid'] . '&output=embed';
    }
    return new WP_Error('dc_map_query', 'Nie można ustalić miejsca z tego linku. Wybierz Google Maps → Udostępnij → Umieść mapę i wklej pełny kod iframe.');
}

function dc_map_search_url($query, $embed = false) {
    return 'https://www.google.com/maps?q=' . rawurlencode($query) . ($embed ? '&output=embed' : '');
}

/** Sanitizer remains compatible with previously saved dc_map_url theme mods. */
function dc_map_url($value) {
    $url = dc_map_normalize($value);
    return is_wp_error($url) ? '' : $url;
}

function dc_map_validate($validity, $value) {
    $url = dc_map_normalize($value);
    if (is_wp_error($url)) { $validity->add($url->get_error_code(), $url->get_error_message()); }
    return $validity;
}

function dc_reviews_code($value) {
    $value = trim(sanitize_text_field($value));
    return preg_match('/^\[trustindex\s+[^\[\]]+\]$/', $value) ? $value : '';
}
add_action('customize_register', function ($customizer) {
    $customizer->add_section('dc_integrations', ['title'=>'DC — Google: mapa i opinie']);
    $customizer->add_setting('dc_map_enabled', ['default'=>true, 'sanitize_callback'=>'rest_sanitize_boolean']);
    $customizer->add_control('dc_map_enabled', ['section'=>'dc_integrations', 'label'=>'Pokaż mapę Google z przyciskiem zgody', 'type'=>'checkbox']);
    $customizer->add_setting('dc_map_url', ['default'=>'', 'sanitize_callback'=>'dc_map_url', 'validate_callback'=>'dc_map_validate']);
    $customizer->add_control('dc_map_url', [
        'section'=>'dc_integrations',
        'label'=>'Mapa Google — link lub kod iframe',
        'description'=>'Wklej kod Google Maps → Udostępnij → Umieść mapę lub pełny link miejsca/wyszukiwania. Skrócone linki maps.app.goo.gl wymagają otwarcia i skopiowania kodu osadzenia. Puste pole pokaże adres z sekcji „DC — Dane firmy”; bez danych adresowych — obszar Stalowej Woli. Mapa działa bez klucza API.',
        'type'=>'textarea',
    ]);
    $customizer->add_setting('dc_reviews_shortcode', ['default'=>'', 'sanitize_callback'=>'dc_reviews_code']);
    $customizer->add_control('dc_reviews_shortcode', ['section'=>'dc_integrations','label'=>'Shortcode oficjalnego widgetu Trustindex','description'=>'Np. shortcode dostarczony przez aktywną wtyczkę Trustindex dla zweryfikowanego profilu firmy. Bez ręcznie wpisywanych ocen.','type'=>'text']);
});
add_shortcode('dc_google_map', function () {
    if (!rest_sanitize_boolean(get_theme_mod('dc_map_enabled', true))) { return ''; }
    $url = dc_map_url(get_theme_mod('dc_map_url', ''));
    $address = function_exists('dc_company_address') ? dc_company_address() : '';
    $query = function_exists('dc_company_map_query') ? dc_company_map_query() : 'Stalowa Wola, Polska';
    $custom = $url !== '';
    if (!$custom) { $url = dc_map_search_url($query, true); }
    $open = $url;
    parse_str((string) wp_parse_url($url, PHP_URL_QUERY), $parameters);
    if (isset($parameters['q']) && is_string($parameters['q'])) { $open = dc_map_search_url($parameters['q']); }
    if (isset($parameters['cid']) && is_string($parameters['cid'])) { $open = 'https://www.google.com/maps?cid=' . rawurlencode($parameters['cid']); }
    $title = $custom ? 'Mapa Google' : ($address ? 'Adres firmy na mapie' : 'Stalowa Wola — obszar dojazdu');
    $description = $custom ? '' : ($address ? '<p>' . esc_html($address) . '.</p>' : '<p>Mapa przedstawia obszar obsługi w Stalowej Woli, nie dokładny adres siedziby.</p>');
    $id = wp_unique_id('dc-map-');
    return '<section class="map-consent" data-map-state="idle"><h2>' . esc_html($title) . '</h2>' . $description
        . '<p>Mapa Google jest usługą zewnętrzną. Jej włączenie połączy przeglądarkę z Google i może przekazać m.in. adres IP. <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">Zasady prywatności Google</a>.</p>'
        . '<div class="map-actions"><button class="button" type="button" data-map-src="' . esc_url($url) . '" data-map-title="' . esc_attr($title) . '" aria-controls="' . esc_attr($id) . '" aria-describedby="' . esc_attr($id . '-status') . '">Włącz mapę Google</button> '
        . '<a href="' . esc_url($open) . '" target="_blank" rel="noopener noreferrer" data-no-ajax>Otwórz w Google Maps <span class="screen-reader-text">(nowa karta, usługa zewnętrzna)</span></a></div>'
        . '<p class="map-status" id="' . esc_attr($id . '-status') . '" role="status" aria-live="polite">Mapa pozostaje wyłączona do czasu wyrażenia zgody przyciskiem.</p>'
        . '<div class="map-viewport" id="' . esc_attr($id) . '"></div><noscript><p>Aby włączyć mapę tutaj, potrzebny jest JavaScript. Możesz otworzyć ją w Google Maps linkiem powyżej.</p></noscript></section>';
});
add_shortcode('dc_google_reviews', function () {
    $code = dc_reviews_code(get_theme_mod('dc_reviews_shortcode', ''));
    if (!$code || !shortcode_exists('trustindex')) { return ''; }
    // Trustindex scripts are plugin-owned: full navigation ensures correct initialization.
    return '<section class="google-reviews"><h2>Opinie klientów w Google</h2>' . do_shortcode($code) . '</section>';
});
