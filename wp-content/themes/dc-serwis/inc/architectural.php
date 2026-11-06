<?php
/** Present existing blocks without rewriting page content or saved SEO fields. */
if (!defined('ABSPATH')) { exit; }
add_filter('body_class', function ($classes) {
    $pages = ['serwis-klimatyzacji-stalowa-wola'=>'climate','serwis-agd-stalowa-wola'=>'agd','realizacje'=>'projects','o-firmie'=>'about','kontakt'=>'contact','polityka-prywatnosci'=>'privacy'];
    foreach ($pages as $slug=>$name) { if (is_page($slug)) { $classes[] = 'dc-page-'.$name; } }
    return $classes;
});
add_filter('render_block_core/image', function ($content) {
    $image = new WP_HTML_Tag_Processor($content);
    if (!$image->next_tag('IMG')) { return $content; }
    $src = $image->get_attribute('src');
    if (!is_string($src)) { return $content; }
    // Exact editorial filenames only. Client photographs are never substituted.
    $name = wp_basename((string) wp_parse_url($src, PHP_URL_PATH));
    if (preg_match('/^editorial-(hvac-hero|ac-interior|ac-cleaning)-\d+(?:-[a-f0-9]{10})?(?:-\d+)?\.webp$/', $name)) {
        $stem = 'editorial-architecture-living';
        $alt = 'Zdjęcie ilustracyjne: klimatyzator ścienny w jasnym, nowoczesnym wnętrzu';
    } elseif (preg_match('/^editorial-(washer|agd-service)-\d+(?:-[a-f0-9]{10})?(?:-\d+)?\.webp$/', $name)) {
        $stem = 'editorial-architecture-laundry';
        $alt = 'Zdjęcie ilustracyjne: pralka automatyczna w jasnej zabudowie';
    } else { return $content; }
    $sources = [];
    foreach ([480,960,1536] as $width) { $sources[] = get_theme_file_uri('assets/images/'.$stem.'-'.$width.'.webp').' '.$width.'w'; }
    $image->set_attribute('src', get_theme_file_uri('assets/images/'.$stem.'-1536.webp'));
    $image->set_attribute('srcset', implode(', ', $sources));
    $image->set_attribute('sizes', '(max-width:760px) calc(100vw - 44px), (max-width:1400px) 52vw, 700px');
    $image->set_attribute('width', 1536);
    $image->set_attribute('height', 1024);
    $image->set_attribute('alt', $alt);
    return $image->get_updated_html();
}, 20);
add_filter('render_block_core/group', function ($content, $block) {
    $classes = preg_split('/\s+/', $block['attrs']['className'] ?? '');
    if (!is_front_page() || !in_array('hero-copy', $classes, true) || str_contains($content,'architectural-hero-cta')) { return $content; }
    $cta = '<a class="button architectural-hero-cta" href="'.esc_url(home_url('/kontakt/')).'">Skontaktuj się '.dc_icon().'</a>';
    return preg_replace('~</div>\s*$~', $cta.'</div>', $content, 1);
}, 20, 2);
