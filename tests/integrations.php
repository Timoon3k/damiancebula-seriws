<?php
/** Local WP-CLI assertions; no external calls and no persistent settings. */
function dc_expect($condition,$label) { if (!$condition) { WP_CLI::error($label); } WP_CLI::log('PASS: '.$label); }
dc_expect(dc_map_url('https://evil.example/maps/embed')==='', 'Map rejects external hosts');
dc_expect(dc_map_url('javascript:alert(1)')==='', 'Map rejects executable URL');
dc_expect(dc_map_url('https://www.google.com/maps/embed?pb=test')!=='', 'Map accepts Google embed URL');
dc_expect(dc_reviews_code('[evil x="1"]')==='', 'Reviews rejects arbitrary shortcode');
dc_expect(dc_reviews_code('[trustindex no-registration=google]')!=='', 'Reviews accepts Trustindex shortcode');
dc_expect(do_shortcode('[dc_google_map]')==='', 'Unconfigured map is absent');
dc_expect(do_shortcode('[dc_google_reviews]')==='', 'Unconfigured reviews are absent');
$before=get_option('page_for_privacy_policy');
$theme_before=get_theme_mod('dc_map_url');
set_theme_mod('dc_map_url','https://www.google.com/maps/embed?pb=test');
try {
 $markup=do_shortcode('[dc_google_map]');
 dc_expect(!str_contains($markup,'<iframe'), 'Map does not connect before consent');
 dc_expect(str_contains($markup,'data-map-src='), 'Map has explicit consent control');
} finally {
 if ($theme_before) { set_theme_mod('dc_map_url',$theme_before); } else { remove_theme_mod('dc_map_url'); }
}
dc_expect(get_option('page_for_privacy_policy')===$before,'Privacy page setting preserved');
add_filter('dc_external_seo','__return_true');
dc_expect(dc_seo_plugin(),'External SEO override supported');
WP_CLI::success('Integration assertions complete.');
