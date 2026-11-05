<?php
if (!defined('ABSPATH')) { exit; }
function dc_seo_plugin() {
    return defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION') || defined('AIOSEO_VERSION') || defined('SEOPRESS_VERSION') || defined('THE_SEO_FRAMEWORK_VERSION') || class_exists('The_SEO_Framework\\Load') || (bool) apply_filters('dc_external_seo', false);
}
function dc_meta() {
    $id = get_queried_object_id();
    $title = get_post_meta($id, '_dc_title', true);
    $description = get_post_meta($id, '_dc_description', true);
    return [$title ?: wp_strip_all_tags(get_the_title($id)), $description ?: wp_trim_words(wp_strip_all_tags(get_post_field('post_content', $id)), 25, '')];
}
add_filter('pre_get_document_title', function ($title) {
    if (dc_seo_plugin() || !is_singular()) { return $title; }
    return dc_meta()[0];
});
add_action('wp', function () {
    if (!dc_seo_plugin() && is_singular()) { remove_action('wp_head', 'rel_canonical'); }
});
add_action('wp_head', function () {
    if (dc_seo_plugin() || !is_singular()) { return; }
    [$title, $description] = dc_meta();
    $url = get_permalink();
    echo '<meta name="description" content="' . esc_attr($description) . '">' . "\n";
    echo '<link rel="canonical" href="' . esc_url($url) . '">' . "\n";
    foreach (['og:type'=>'website', 'og:locale'=>'pl_PL', 'og:site_name'=>'Damian Cebula', 'og:title'=>$title, 'og:description'=>$description, 'og:url'=>$url] as $property=>$value) {
        echo '<meta property="' . esc_attr($property) . '" content="' . esc_attr($value) . '">' . "\n";
    }
    echo '<meta name="twitter:card" content="summary"><meta name="twitter:title" content="' . esc_attr($title) . '"><meta name="twitter:description" content="' . esc_attr($description) . '">' . "\n";
    $business = ['@type'=>'HVACBusiness','@id'=>home_url('/#business'),'name'=>'Damian Cebula — Serwis Klimatyzacji i AGD','url'=>home_url('/'),'telephone'=>'+48794225139','email'=>'kontakt@damiancebula-serwis.pl','areaServed'=>['@type'=>'City','name'=>'Stalowa Wola']];
    $graph = [$business];
    if (!is_front_page()) {
        $graph[] = ['@type'=>'BreadcrumbList','itemListElement'=>[['@type'=>'ListItem','position'=>1,'name'=>'Strona główna','item'=>home_url('/')],['@type'=>'ListItem','position'=>2,'name'=>get_the_title(),'item'=>$url]]];
    }
    if (is_page(['serwis-klimatyzacji-stalowa-wola', 'serwis-agd-stalowa-wola'])) {
        $graph[] = ['@type'=>'Service','@id'=>$url.'#service','name'=>get_the_title(),'provider'=>['@id'=>home_url('/#business')],'areaServed'=>['@type'=>'City','name'=>'Stalowa Wola'],'url'=>$url];
    }
    echo '<script type="application/ld+json">' . wp_json_encode(['@context'=>'https://schema.org','@graph'=>$graph], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP) . '</script>' . "\n";
}, 5);
// Metadata stays editable without modifying PHP; WordPress handles nonce and permissions.
add_action('init', function () {
    foreach (['_dc_title', '_dc_description'] as $key) {
        register_post_meta('page', $key, ['type'=>'string','single'=>true,'show_in_rest'=>true,'sanitize_callback'=>'sanitize_text_field','auth_callback'=>function () { return current_user_can('edit_pages'); }]);
    }
});
add_action('add_meta_boxes_page', function () {
    add_meta_box('dc-seo', 'DC — tytuł i opis SEO (bez aktywnej wtyczki SEO)', function ($post) {
        wp_nonce_field('dc_seo_save', 'dc_seo_nonce');
        foreach (['_dc_title'=>'Tytuł SEO', '_dc_description'=>'Opis meta'] as $key=>$label) {
            echo '<p><label>' . esc_html($label) . '<input class="widefat" name="' . esc_attr($key) . '" value="' . esc_attr(get_post_meta($post->ID, $key, true)) . '"></label></p>';
        }
    });
});
add_action('save_post_page', function ($id) {
    if (!isset($_POST['dc_seo_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['dc_seo_nonce'])), 'dc_seo_save') || !current_user_can('edit_page', $id) || wp_is_post_revision($id) || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)) { return; }
    foreach (['_dc_title','_dc_description'] as $key) {
        if (isset($_POST[$key]) && is_string($_POST[$key])) { update_post_meta($id, $key, sanitize_text_field(wp_unslash($_POST[$key]))); }
    }
});
