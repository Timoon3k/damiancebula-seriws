<?php
/** Isolated WP-CLI check. The disposable logo image is NOT a city photograph. */
if (!defined('WP_CLI') || !WP_CLI || !in_array(wp_parse_url(home_url(), PHP_URL_HOST), ['localhost', '127.0.0.1'], true)) {
    throw new RuntimeException('Run this fixture only on isolated localhost WordPress through WP-CLI.');
}
if (!function_exists('dc_local_city_photo')) { throw new RuntimeException('The local city component is not loaded.'); }

$checks = [];
$check = static function ($condition, $description) use (&$checks) {
    if (!$condition) { throw new RuntimeException('Local city photo: ' . $description); }
    $checks[] = $description;
};
$saved_globals = [];
foreach (['wp_query', 'wp_the_query', 'post'] as $key) {
    $saved_globals[$key] = ['exists' => array_key_exists($key, $GLOBALS), 'value' => $GLOBALS[$key] ?? null];
}
$saved_mods = get_theme_mods();
$front_id = (int) get_option('page_on_front');
$front_before = get_post($front_id, ARRAY_A);
$front_meta_before = get_post_meta($front_id);
$attachment = 0;
$uploaded_file = '';
$token = wp_generate_uuid4();
$values = ['dc_city_photo_enabled' => true, 'dc_city_photo' => 0, 'dc_city_photo_credit' => '', 'dc_city_photo_source' => ''];
$filters = [];
foreach (array_keys($values) as $key) {
    $filters[$key] = static function () use (&$values, $key) { return $values[$key]; };
    add_filter('theme_mod_' . $key, $filters[$key]);
}

try {
    $check($front_id > 0 && $front_before, 'A separate local front page exists');
    $GLOBALS['wp_query'] = $GLOBALS['wp_the_query'] = new WP_Query(['page_id' => $front_id]);
    $check(is_front_page(), 'The per-process query represents the front page');
    $bundled = get_theme_file_path('assets/images/local-stalowa-wola-960.webp');
    $manifest = get_theme_file_path('assets/images/local-stalowa-wola-source.json');
    $details = is_file($manifest) ? json_decode((string) file_get_contents($manifest), true) : [];
    $has_bundle = is_file($bundled) && is_array($details) && ($details['verified'] ?? false) === true && !empty($details['alt']);
    if (!$has_bundle) {
        $check(dc_local_city_photo() === '', 'No source means no placeholder or invented city photograph');
    }
    $values['dc_city_photo_enabled'] = false;
    $check(dc_local_city_photo() === '', 'Disabled means no photo markup');
    $values['dc_city_photo_enabled'] = true;

    require_once ABSPATH . 'wp-admin/includes/image.php';
    $fixture = __DIR__ . '/fixtures/logo-dark-padded.png';
    $check(is_file($fixture), 'The explicitly synthetic image fixture is available');
    $upload = wp_upload_bits('dc-city-synthetic-' . $token . '.png', null, file_get_contents($fixture));
    if (!empty($upload['error'])) { throw new RuntimeException($upload['error']); }
    $uploaded_file = $upload['file'];
    $attachment = wp_insert_attachment([
        'post_mime_type' => 'image/png',
        'post_title' => 'Synthetic local city slot test — not a city photograph',
        'post_excerpt' => 'Podpis syntetycznej ilustracji testowej.',
        'post_status' => 'inherit',
    ], $uploaded_file, 0, true);
    if (is_wp_error($attachment)) { $error = $attachment; $attachment = 0; throw new RuntimeException($error->get_error_message()); }
    update_post_meta($attachment, '_dc_test_city_slot', $token);
    update_post_meta($attachment, '_wp_attachment_image_alt', 'Syntetyczny obraz testowy — nie fotografia Stalowej Woli.');
    wp_update_attachment_metadata($attachment, wp_generate_attachment_metadata($attachment, $uploaded_file));
    $values['dc_city_photo'] = $attachment;
    $values['dc_city_photo_credit'] = '<b>Autor testowy</b>';
    $values['dc_city_photo_source'] = 'https://example.test/photo?ref=city&lang=pl';
    $photo = dc_local_city_photo();
    $image = new WP_HTML_Tag_Processor($photo);
    $check($image->next_tag('IMG'), 'Selected media produces an image');
    $check($image->get_attribute('alt') === 'Syntetyczny obraz testowy — nie fotografia Stalowej Woli.', 'The selected media ALT is preserved');
    $check($image->get_attribute('loading') === 'lazy' && $image->get_attribute('decoding') === 'async', 'The photo is lazy and asynchronously decoded');
    $check(str_contains((string) $image->get_attribute('sizes'), 'max-width:760px') && $image->get_attribute('srcset'), 'Responsive sizes and media srcset are supplied');
    $check((int) $image->get_attribute('width') > 0 && (int) $image->get_attribute('height') > 0, 'Image dimensions reserve its layout');
    $check(str_contains($photo, 'Podpis syntetycznej ilustracji testowej.'), 'The media caption is preserved');
    $check(str_contains($photo, 'Autor testowy') && !str_contains($photo, '<b>'), 'Credit is rendered as safe text');
    $credit_link = new WP_HTML_Tag_Processor($photo);
    $check($credit_link->next_tag('A') && $credit_link->get_attribute('href') === 'https://example.test/photo?ref=city&lang=pl', 'An HTTPS source link is preserved and escaped');
    $check(str_contains((string) $credit_link->get_attribute('rel'), 'noopener'), 'The source link has safe external-link attributes');
    $values['dc_city_photo_source'] = 'javascript:alert(1)';
    $unsafe = dc_local_city_photo();
    $check(!str_contains($unsafe, 'javascript:') && !(new WP_HTML_Tag_Processor($unsafe))->next_tag('A'), 'A JavaScript source URL cannot become a link');
    $values['dc_city_photo_source'] = 'https://example.test/photo';

    $markup = '<div class="wp-block-group local-copy"><p class="eyebrow">Stalowa Wola i okolice</p><h2>Lokalny serwis ze Stalowej Woli</h2><p>Oryginalny tekst SEO pozostaje bez zmian.</p><a class="button" href="' . esc_url(home_url('/o-firmie/')) . '">Poznaj serwis</a></div>';
    $block = ['blockName' => 'core/group', 'attrs' => ['className' => 'local-copy'], 'innerBlocks' => []];
    $rendered = apply_filters('render_block_core/group', $markup, $block);
    $check(substr_count($rendered, '<figure class="local-city-photo">') === 1, 'Only one city figure is inserted into the local group');
    $without_photo = preg_replace('~<figure class="local-city-photo">.*?</figure>~s', '', $rendered, 1);
    $check($without_photo === $markup, 'Existing title, SEO copy and CTA markup remain byte-for-byte unchanged');
    $check(apply_filters('render_block_core/group', $rendered, $block) === $rendered, 'Rendering an existing city figure does not duplicate it');
    $other_block = $block;
    $other_block['attrs']['className'] = 'local-projects';
    $check(apply_filters('render_block_core/group', $markup, $other_block) === $markup, 'Other groups remain untouched');
    $contact = get_page_by_path('kontakt');
    $check($contact instanceof WP_Post, 'A separate local Contact page exists');
    $GLOBALS['wp_query'] = $GLOBALS['wp_the_query'] = new WP_Query(['page_id' => $contact->ID]);
    $check(!is_front_page() && apply_filters('render_block_core/group', $markup, $block) === $markup, 'The component does not insert city photos on other pages');
    $check(get_post($front_id, ARRAY_A) === $front_before && get_post_meta($front_id) === $front_meta_before, 'Front-page content, dates and SEO metadata were never rewritten');
} finally {
    foreach ($filters as $key => $callback) { remove_filter('theme_mod_' . $key, $callback); }
    foreach ($saved_globals as $key => $saved) {
        if ($saved['exists']) { $GLOBALS[$key] = $saved['value']; } else { unset($GLOBALS[$key]); }
    }
    if ($attachment && get_post_meta($attachment, '_dc_test_city_slot', true) === $token) { wp_delete_attachment($attachment, true); }
    if ($uploaded_file && is_file($uploaded_file)) { wp_delete_file($uploaded_file); }
}
$check(get_theme_mods() === $saved_mods, 'All persistent theme settings remain unchanged');
$check(!$attachment || !get_post($attachment), 'The disposable attachment was removed');
$check(!$uploaded_file || !is_file($uploaded_file), 'The disposable source file was removed');
WP_CLI::log(wp_json_encode(['localOnly' => true, 'realCityPhotoObtained' => false, 'fixtureExplicitlySynthetic' => true, 'checks' => $checks, 'persistentThemeModsChanged' => false, 'fixtureCleanedUp' => true], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
WP_CLI::success('Local city photo slot: ' . count($checks) . ' checks passed; no real city photo was obtained or claimed.');
