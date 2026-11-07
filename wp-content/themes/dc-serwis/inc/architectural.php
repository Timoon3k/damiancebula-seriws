<?php
/** Preserve existing page identity and gallery delivery without rewriting saved content. */
if (!defined('ABSPATH')) { exit; }
add_filter('body_class', function ($classes) {
    $pages = ['serwis-klimatyzacji-stalowa-wola'=>'climate','serwis-agd-stalowa-wola'=>'agd','realizacje'=>'projects','o-firmie'=>'about','kontakt'=>'contact','polityka-prywatnosci'=>'privacy'];
    foreach ($pages as $slug=>$name) { if (is_page($slug)) { $classes[] = 'dc-page-'.$name; } }
    return $classes;
});
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
