<?php
/** Additive pages for the blue reference navigation; existing pages are never rewritten. */
if (!defined('ABSPATH')) { exit; }

function dc_reference_page_definitions() {
    return [
        'pricing' => [
            'slug' => 'cennik',
            'title' => 'Cennik',
            'seo_title' => 'Cennik serwisu klimatyzacji i AGD — Stalowa Wola',
            'description' => 'Sprawdź, od czego zależy wycena montażu i naprawy klimatyzacji oraz serwisu AGD w Stalowej Woli. Opisz urządzenie i uzgodnij zakres prac.',
            'keyword' => 'cennik serwisu klimatyzacji Stalowa Wola',
        ],
        'advice' => [
            'slug' => 'porady',
            'title' => 'Porady',
            'seo_title' => 'Porady: klimatyzacja i AGD — Damian Cebula, Stalowa Wola',
            'description' => 'Jak przygotować zgłoszenie usterki pralki, zmywarki lub klimatyzacji? Praktyczne wskazówki przed wizytą serwisu w Stalowej Woli.',
            'keyword' => 'serwis klimatyzacji i AGD Stalowa Wola',
        ],
    ];
}

/**
 * Run once on an authorized admin visit/activation, or explicitly through WP-CLI.
 * No existing page, front-page option, permalink setting or menu is changed.
 *
 * @return array|WP_Error Created/preserved page IDs and any insertion errors.
 */
function dc_reference_sync_pages() {
    $cli = defined('WP_CLI') && WP_CLI;
    if (!$cli && (!current_user_can('edit_theme_options') || !current_user_can('publish_pages'))) {
        return new WP_Error('dc_reference_permissions', 'Brak uprawnień do utworzenia stron motywu.');
    }
    $report = ['created'=>[], 'preserved'=>[], 'errors'=>[]];
    foreach (dc_reference_page_definitions() as $key=>$definition) {
        $existing = get_page_by_path($definition['slug'], OBJECT, 'page');
        // An explicitly trashed/renamed page is also an editorial decision.
        $owned = get_posts(['post_type'=>'page', 'post_status'=>'any', 'posts_per_page'=>1, 'fields'=>'ids', 'meta_key'=>'_dc_reference_page', 'meta_value'=>$key]);
        if (!$owned) {
            $owned = get_posts(['post_type'=>'page', 'post_status'=>'trash', 'posts_per_page'=>1, 'fields'=>'ids', 'meta_key'=>'_dc_reference_page', 'meta_value'=>$key]);
        }
        if ($existing || $owned) {
            $report['preserved'][$key] = $existing ? (int)$existing->ID : (int)$owned[0];
            continue;
        }
        // $key is from the fixed definition above, never from request input.
        $file = get_theme_file_path('patterns/'.$key.'.php');
        if (!is_file($file)) {
            $report['errors'][$key] = 'Brak wzorca strony: '.$definition['slug'];
            continue;
        }
        ob_start();
        include $file;
        $content = ob_get_clean();
        if (trim($content) === '') {
            $report['errors'][$key] = 'Pusty wzorzec strony: '.$definition['slug'];
            continue;
        }
        $id = wp_insert_post(wp_slash([
            'post_type'=>'page', 'post_status'=>'publish', 'post_name'=>$definition['slug'],
            'post_title'=>$definition['title'], 'post_content'=>$content,
        ]), true);
        if (is_wp_error($id)) {
            $report['errors'][$key] = $id->get_error_message();
            continue;
        }
        update_post_meta($id, '_dc_reference_page', $key);
        update_post_meta($id, '_dc_layout', 'designed');
        update_post_meta($id, '_wp_page_template', 'page-designed.php');
        update_post_meta($id, '_dc_title', $definition['seo_title']);
        update_post_meta($id, '_dc_description', $definition['description']);
        // These are editorial analysis keywords, never extra frontend meta tags.
        update_post_meta($id, 'rank_math_focus_keyword', $definition['keyword']);
        $report['created'][$key] = (int)$id;
    }
    if (!$report['errors']) { update_option('dc_reference_pages_version', '3.0', false); }
    return $report;
}

add_action('after_switch_theme', function () {
    dc_reference_sync_pages();
});
add_action('admin_init', function () {
    if (get_option('dc_reference_pages_version') !== '3.0' && current_user_can('edit_theme_options') && current_user_can('publish_pages')) {
        dc_reference_sync_pages();
    }
});
add_filter('body_class', function ($classes) {
    foreach (dc_reference_page_definitions() as $key=>$definition) {
        if (is_page($definition['slug'])) { $classes[] = 'dc-page-'.$key; }
    }
    return $classes;
});
