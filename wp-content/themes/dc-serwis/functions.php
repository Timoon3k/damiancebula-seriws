<?php
/** Theme setup and integrations. */
if (!defined('ABSPATH')) { exit; }
function dc_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', ['height' => 64, 'width' => 220, 'flex-width' => true]);
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('responsive-embeds');
    add_theme_support('editor-styles');
    add_editor_style('assets/site.css');
    register_nav_menus(['primary' => 'Nawigacja główna', 'footer' => 'Nawigacja stopki']);
    register_block_pattern_category('dc-serwis', ['label' => 'DC Serwis']);
}
add_action('after_setup_theme', 'dc_setup');
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('dc-site', get_theme_file_uri('assets/site.css'), [], filemtime(get_theme_file_path('assets/site.css')));
    wp_enqueue_script('dc-site', get_theme_file_uri('assets/site.js'), [], filemtime(get_theme_file_path('assets/site.js')), ['in_footer' => true, 'strategy' => 'defer']);
});
function dc_links() {
    return ['' => 'Strona główna', 'serwis-klimatyzacji-stalowa-wola' => 'Klimatyzacja', 'serwis-agd-stalowa-wola' => 'Serwis AGD', 'realizacje' => 'Realizacje', 'o-firmie' => 'O firmie', 'kontakt' => 'Kontakt'];
}
function dc_menu() {
    echo '<ul class="menu">';
    foreach (dc_links() as $slug => $label) {
        $active = $slug ? is_page($slug) : is_front_page();
        echo '<li><a' . ($active ? ' aria-current="page"' : '') . ' href="' . esc_url(home_url('/' . ($slug ? $slug . '/' : ''))) . '">' . esc_html($label) . '</a></li>';
    }
    echo '</ul>';
}
function dc_icon($name = 'arrow') {
    $paths = [
        'arrow' => '<path d="M4 12h16m-6-6 6 6-6 6"/>',
        'phone' => '<path d="m5 3 4 4-2 3c2 3 4 5 7 6l3-2 4 4-2 3C10 22 2 14 2 5Z"/>',
        'snow' => '<path d="M12 2v20M3 7l18 10M3 17 21 7M8 4l4 3 4-3M8 20l4-3 4 3M3 11l4-1-1-4m12 12-1-4 4-1M3 13l4 1-1 4m12-12-1 4 4 1"/>',
        'washer' => '<rect x="4" y="2" width="16" height="20" rx="1"/><circle cx="12" cy="14" r="5"/><path d="M4 7h16M7 4h1m3 0h1"/>',
        'tools' => '<path d="m3 21 10-10m-4-7 3 3 4-1 1-4a7 7 0 0 1-8 10L2 19Zm6 11 6 6 3-3-6-6"/>',
        'check' => '<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
        'calendar' => '<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M7 2v6m10-6v6M7 14h2m4 0h2m-8 4h2m4 0h2"/>',
        'pin' => '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    ];
    return '<svg class="icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . ($paths[$name] ?? $paths['arrow']) . '</svg>';
}
require_once get_theme_file_path('inc/seo.php');
require_once get_theme_file_path('inc/contact.php');

require_once get_theme_file_path("inc/integrations.php");
// The public content is Polish even on a development core without a language pack.
add_filter('language_attributes', function ($attributes) {
    return preg_replace('/lang="[^"]*"/', 'lang="pl-PL"', $attributes);
});
// Keep native Image block serialization valid; add delivery attributes at render time.
add_filter('render_block_core/image', function ($content, $block) {
    $tags = new WP_HTML_Tag_Processor($content);
    if (!$tags->next_tag('IMG')) { return $content; }
    $src = $tags->get_attribute('src');
    $base = get_theme_file_uri('assets/images/');
    if (!is_string($src) || !str_starts_with($src, $base)) { return $content; }
    $name = basename(wp_parse_url($src, PHP_URL_PATH));
    $file = get_theme_file_path('assets/images/'.$name);
    $is_hero = str_contains($block['attrs']['className'] ?? '', 'hero-media');
    if (is_file($file) && pathinfo($file, PATHINFO_EXTENSION) === 'webp') {
        $size = getimagesize($file);
        if ($size) { $tags->set_attribute('width', $size[0]); $tags->set_attribute('height', $size[1]); }
        $stem = preg_replace('/-\d+\.webp$/', '', $name);
        $sources = [];
        foreach ([480,960,1600] as $width) {
            $candidate = get_theme_file_path('assets/images/'.$stem.'-'.$width.'.webp');
            if (is_file($candidate)) { $dimensions = getimagesize($candidate); $sources[] = get_theme_file_uri('assets/images/'.$stem.'-'.$width.'.webp').' '.$dimensions[0].'w'; }
        }
        if ($sources) { $tags->set_attribute('srcset', implode(', ', $sources)); $tags->set_attribute('sizes', '(max-width:700px) 100vw, 50vw'); }
    } elseif ($name === 'agd-illustration.svg') { $tags->set_attribute('width', 1000); $tags->set_attribute('height',700); }
    $tags->set_attribute('loading', $is_hero ? 'eager' : 'lazy');
    if ($is_hero) { $tags->set_attribute('fetchpriority','high'); }
    $tags->set_attribute('decoding','async');
    return $tags->get_updated_html();
}, 10, 2);
