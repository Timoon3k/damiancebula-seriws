<?php
/** Present existing blocks without rewriting page content or saved SEO fields. */
if (!defined('ABSPATH')) { exit; }
add_filter('body_class', function ($classes) {
    $pages = ['serwis-klimatyzacji-stalowa-wola'=>'climate','serwis-agd-stalowa-wola'=>'agd','realizacje'=>'projects','o-firmie'=>'about','kontakt'=>'contact','polityka-prywatnosci'=>'privacy'];
    foreach ($pages as $slug=>$name) { if (is_page($slug)) { $classes[] = 'dc-page-'.$name; } }
    return $classes;
});
add_filter('render_block_core/image', function ($content, $block = []) {
    $image = new WP_HTML_Tag_Processor($content);
    if (!$image->next_tag('IMG')) { return $content; }
    $src = $image->get_attribute('src');
    if (!is_string($src)) { return $content; }
    // Exact editorial filenames only. Client photographs are never substituted.
    $name = wp_basename((string) wp_parse_url($src, PHP_URL_PATH));
    if (!preg_match('/^editorial-(hvac-hero|ac-interior|ac-cleaning|washer|agd-service)-\d+(?:-[a-f0-9]{10})?(?:-\d+)?\.webp$/', $name, $matches)) { return $content; }
    // Every authored placement has its own subject. In particular the home
    // service photograph must never repeat the adjacent atmospheric hero.
    $scenes = [
        'hvac-hero' => ['living', 'klimatyzator ścienny w jasnym salonie'],
        'ac-interior' => is_page('serwis-klimatyzacji-stalowa-wola')
            ? ['climate-room', 'klimatyzator ścienny w jasnej jadalni']
            : ['ac-detail', 'detal białego klimatyzatora na jasnej ścianie'],
        'ac-cleaning' => ['filter-detail', 'filtry siatkowe klimatyzatora na kamiennym blacie'],
        'washer' => is_page('serwis-agd-stalowa-wola')
            ? ['dishwasher-kitchen', 'otwarta zmywarka w jasnej zabudowie kuchennej']
            : ['laundry', 'pralka automatyczna w jasnej zabudowie'],
        'agd-service' => ['washer-detail', 'otwarte drzwi i stalowy bęben pralki automatycznej'],
    ];
    [$scene, $description] = $scenes[$matches[1]];
    $stem = 'editorial-architecture-'.$scene;
    $alt = 'Zdjęcie ilustracyjne: '.$description;
    $sources = [];
    foreach ([480,960,1536] as $width) { $sources[] = get_theme_file_uri('assets/images/'.$stem.'-'.$width.'.webp').' '.$width.'w'; }
    $image->set_attribute('src', get_theme_file_uri('assets/images/'.$stem.'-1536.webp'));
    $image->set_attribute('srcset', implode(', ', $sources));
    $image->set_attribute('sizes', '(max-width:760px) calc(100vw - 44px), (max-width:1400px) 52vw, 700px');
    if ($matches[1] === 'washer') {
        $image->set_attribute('sizes', is_front_page()
            ? '(max-width:760px) calc((100vw - 44px) * .88 - 52px), (max-width:1400px) 30vw, 350px'
            : '(max-width:760px) calc(100vw - 44px), (max-width:1050px) 80vw, (max-width:1400px) 72vw, 1000px');
    }
    if (!str_contains($block['attrs']['className'] ?? '', 'hero-media')) {
        $image->set_attribute('loading', 'lazy');
        $image->set_attribute('fetchpriority', 'low');
    }
    $image->set_attribute('width', 1536);
    $image->set_attribute('height', 1024);
    $image->set_attribute('alt', $alt);
    return $image->get_updated_html();
}, 20, 2);
// Preserve every gallery file/ALT/caption while keeping below-fold work from
// competing with the eager, high-priority hero during the first navigation.
add_filter('render_block_core/group', function ($content, $block) {
    $classes = preg_split('/\s+/', $block['attrs']['className'] ?? '');
    if (!array_intersect(['mini-gallery', 'gallery-grid'], $classes)) { return $content; }
    $images = new WP_HTML_Tag_Processor($content);
    while ($images->next_tag('IMG')) {
        $images->set_attribute('loading', 'lazy');
        $images->set_attribute('fetchpriority', 'low');
    }
    return $images->get_updated_html();
}, 25, 2);
add_filter('render_block_core/group', function ($content, $block) {
    $classes = preg_split('/\s+/', $block['attrs']['className'] ?? '');
    if (!is_front_page() || !in_array('hero-copy', $classes, true) || str_contains($content,'architectural-hero-cta')) { return $content; }
    $cta = '<a class="button architectural-hero-cta" href="'.esc_url(home_url('/kontakt/')).'">Skontaktuj się '.dc_icon().'</a>';
    return preg_replace('~</div>\s*$~', $cta.'</div>', $content, 1);
}, 20, 2);
