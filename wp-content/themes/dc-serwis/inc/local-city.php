<?php
/** A genuine local photograph beside the existing Stalowa Wola content. */
if (!defined('ABSPATH')) { exit; }

add_action('customize_register', function ($customizer) {
    $customizer->add_section('dc_local_city', [
        'title' => 'DC — Lokalność i zdjęcie miasta',
        'description' => 'Autentyczna fotografia Stalowej Woli w sekcji lokalnego serwisu na stronie głównej. ALT i podpis wybranego zdjęcia edytujesz w Bibliotece mediów.',
    ]);
    $customizer->add_setting('dc_city_photo_enabled', [
        'default' => true,
        'sanitize_callback' => 'wp_validate_boolean',
        'capability' => 'edit_theme_options',
        'transport' => 'refresh',
    ]);
    $customizer->add_control('dc_city_photo_enabled', [
        'section' => 'dc_local_city',
        'label' => 'Pokaż zdjęcie miasta',
        'type' => 'checkbox',
    ]);
    $customizer->add_setting('dc_city_photo', [
        'default' => 0,
        'sanitize_callback' => 'absint',
        'capability' => 'edit_theme_options',
        'transport' => 'refresh',
    ]);
    $customizer->add_control(new WP_Customize_Media_Control($customizer, 'dc_city_photo', [
        'section' => 'dc_local_city',
        'label' => 'Autentyczne zdjęcie Stalowej Woli',
        'description' => 'Wybierz własną fotografię miasta lub materiał z prawem publikacji. Puste pole korzysta ze zdjęcia dołączonego do motywu tylko wtedy, gdy jest dostępne i ma zweryfikowane źródło.',
        'mime_type' => 'image',
    ]));
    foreach (['dc_city_photo_credit' => 'Autor / podpis źródła', 'dc_city_photo_source' => 'Link do źródła fotografii'] as $key => $label) {
        $customizer->add_setting($key, [
            'default' => '',
            'sanitize_callback' => $key === 'dc_city_photo_source' ? 'esc_url_raw' : 'sanitize_text_field',
            'capability' => 'edit_theme_options',
            'transport' => 'refresh',
        ]);
        $customizer->add_control($key, [
            'section' => 'dc_local_city',
            'label' => $label,
            'type' => $key === 'dc_city_photo_source' ? 'url' : 'text',
        ]);
    }
});

/** No remote download or placeholder is performed while rendering a page. */
function dc_local_city_photo() {
    if (!get_theme_mod('dc_city_photo_enabled', true)) { return ''; }
    $id = absint(get_theme_mod('dc_city_photo', 0));
    $image = '';
    $caption = '';
    $credit = '';
    $source = '';
    $license = '';
    $license_url = '';
    if ($id && wp_attachment_is_image($id)) {
        $alt = trim(wp_strip_all_tags((string) get_post_meta($id, '_wp_attachment_image_alt', true)));
        $image = wp_get_attachment_image($id, 'large', false, [
            'class' => 'local-city-image',
            'alt' => $alt ?: 'Stalowa Wola',
            'loading' => 'lazy',
            'decoding' => 'async',
            'sizes' => '(max-width:760px) calc(100vw - 44px), (max-width:1050px) 70vw, 560px',
        ]);
        $caption = wp_kses_post((string) wp_get_attachment_caption($id));
        $credit = sanitize_text_field((string) get_theme_mod('dc_city_photo_credit', ''));
        $source = esc_url((string) get_theme_mod('dc_city_photo_source', ''), ['http', 'https']);
    } else {
        $base = 'assets/images/local-stalowa-wola';
        $file = get_theme_file_path($base . '-960.webp');
        $manifest_file = get_theme_file_path($base . '-source.json');
        if (!is_file($file) || !is_file($manifest_file)) { return ''; }
        $details = json_decode((string) file_get_contents($manifest_file), true);
        if (!is_array($details) || ($details['verified'] ?? false) !== true || empty($details['alt'])) { return ''; }
        $dimensions = wp_getimagesize($file);
        if (!$dimensions) { return ''; }
        $srcset = [];
        foreach ([480, 960, 1536] as $width) {
            $variant = $base . '-' . $width . '.webp';
            if (is_file(get_theme_file_path($variant))) {
                $srcset[] = get_theme_file_uri($variant) . ' ' . $width . 'w';
            }
        }
        $image = '<img class="local-city-image" src="' . esc_url(get_theme_file_uri($base . '-960.webp')) . '" srcset="' . esc_attr(implode(', ', $srcset)) . '" sizes="(max-width:760px) calc(100vw - 44px), (max-width:1050px) 70vw, 560px" width="' . absint($dimensions[0]) . '" height="' . absint($dimensions[1]) . '" alt="' . esc_attr($details['alt']) . '" loading="lazy" decoding="async">';
        $caption = esc_html($details['caption'] ?? 'Stalowa Wola');
        $credit = sanitize_text_field($details['credit'] ?? '');
        $source = esc_url($details['source_url'] ?? '', ['http', 'https']);
        $license = sanitize_text_field($details['license'] ?? '');
        $license_url = esc_url($details['license_url'] ?? '', ['http', 'https']);
    }
    if (!$image) { return ''; }
    $attribution = [];
    if ($credit !== '') {
        $attribution[] = $source !== '' ? '<a href="' . $source . '" target="_blank" rel="noopener noreferrer">' . esc_html($credit) . '</a>' : esc_html($credit);
    } elseif ($source !== '') {
        $attribution[] = '<a href="' . $source . '" target="_blank" rel="noopener noreferrer">Źródło fotografii</a>';
    }
    if ($license !== '') {
        $attribution[] = $license_url !== '' ? '<a href="' . $license_url . '" target="_blank" rel="noopener noreferrer">' . esc_html($license) . '</a>' : esc_html($license);
    }
    $figcaption = $caption;
    if ($attribution) {
        $figcaption .= '<span class="local-city-credit">' . implode(' · ', $attribution) . '</span>';
    }
    return '<figure class="local-city-photo">' . $image . ($figcaption !== '' ? '<figcaption>' . $figcaption . '</figcaption>' : '') . '</figure>';
}

add_filter('render_block_core/group', function ($content, $block) {
    $classes = preg_split('/\s+/', $block['attrs']['className'] ?? '');
    if (!is_front_page() || !in_array('local-copy', $classes, true) || str_contains($content, 'local-city-photo')) { return $content; }
    $figure = dc_local_city_photo();
    if ($figure === '') { return $content; }
    // Append within the group's own closing DIV: never inject a figure into a
    // paragraph or rewrite the owner's copy, links, saved blocks or headings.
    return preg_replace_callback('~</div>\s*$~', static function () use ($figure) { return $figure . '</div>'; }, $content, 1) ?? $content;
}, 30, 2);
