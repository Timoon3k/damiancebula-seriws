<?php
/** Additive setup for a separate WordPress installation; never overwrites foreign content. */
if (!defined('ABSPATH')) { exit; }

function dc_sync_pages() {
    return [
        'home' => ['strona-glowna','Strona główna','Serwis klimatyzacji i AGD Stalowa Wola — Damian Cebula','Montaż, serwis i naprawa klimatyzacji oraz naprawa pralek, lodówek i zmywarek w Stalowej Woli. Damian Cebula — zadzwoń i omów zgłoszenie: 794 225 139.'],
        'climate' => ['serwis-klimatyzacji-stalowa-wola','Serwis klimatyzacji Stalowa Wola','Serwis klimatyzacji Stalowa Wola — Damian Cebula','Montaż, naprawa, czyszczenie i konserwacja klimatyzacji w Stalowej Woli. Serwis dla domów, mieszkań i biur. Omów zakres prac z Damianem Cebulą.'],
        'appliances' => ['serwis-agd-stalowa-wola','Serwis AGD Stalowa Wola','Serwis AGD Stalowa Wola — naprawa pralek i zmywarek','Naprawa pralek, zmywarek i lodówek w Stalowej Woli. Zgłoś objawy, ustal diagnozę i zakres serwisu AGD. Damian Cebula — telefon 794 225 139.'],
        'projects' => ['realizacje','Realizacje','Realizacje montażu klimatyzacji — Damian Cebula','Zobacz autentyczne zdjęcia montażu i serwisu klimatyzacji przekazane przez Damiana Cebulę. Jednostki wewnętrzne, zewnętrzne i instalacje.'],
        'about' => ['o-firmie','O firmie','Damian Cebula — lokalny serwis AGD i klimatyzacji','Damian Cebula — montaż i serwis klimatyzacji oraz naprawa AGD w Stalowej Woli i okolicach. Poznaj zakres usług i sposób zgłoszenia usterki.'],
        'contact' => ['kontakt','Kontakt','Kontakt — Damian Cebula, serwis w Stalowej Woli','Zgłoś naprawę AGD, serwis lub montaż klimatyzacji w Stalowej Woli. Damian Cebula: 794 225 139, kontakt@damiancebula-serwis.pl. Formularz kontaktowy.'],
    ];
}

function dc_sync_owned_pages() {
    $ids = [];
    foreach (get_posts(['post_type'=>'page','post_status'=>'any','posts_per_page'=>-1,'meta_key'=>'_dc_sync_key']) as $post) {
        $key = get_post_meta($post->ID, '_dc_sync_key', true);
        if (isset(dc_sync_pages()[$key])) { $ids[$key] = $post->ID; }
    }
    return $ids;
}

function dc_sync_preflight($owned) {
    foreach (dc_sync_pages() as $key => $definition) {
        $existing = get_page_by_path($definition[0]);
        if ($existing && (!isset($owned[$key]) || $existing->ID !== $owned[$key])) {
            return new WP_Error('dc_conflict', 'Zachowano istniejącą stronę „'.$existing->post_title.'”. Automatyczna instalacja wymaga osobnej, nowej witryny WordPress.');
        }
    }
    if (!get_option('dc_sync_initialized')) {
        $privacy = (int) get_option('wp_page_for_privacy_policy');
        foreach (get_posts(['post_type'=>'page','post_status'=>['publish','private','draft','pending'],'posts_per_page'=>-1]) as $page) {
            if (in_array($page->ID, $owned, true) || $page->ID === $privacy || in_array($page->post_name, ['sample-page','privacy-policy','polityka-prywatnosci'], true)) { continue; }
            return new WP_Error('dc_existing_site', 'Wykryto istniejące treści. Nie zmieniono witryny; użyj osobnej instalacji WordPress.');
        }
        foreach (get_posts(['post_type'=>'post','post_status'=>['publish','private','draft','pending'],'posts_per_page'=>-1]) as $post) {
            if ($post->post_name === 'hello-world' && in_array($post->post_title,['Hello world!','Witaj, świecie!'],true)) { continue; }
            return new WP_Error('dc_existing_blog','Wykryto istniejące wpisy. Użyj osobnej, nowej instalacji WordPress.');
        }
        $front = (int) get_option('page_on_front');
        if ($front && !in_array($front, $owned, true)) { return new WP_Error('dc_existing_home', 'Witryna ma już własną stronę główną. Nie zmieniono jej ustawień.'); }
    }
    return true;
}

function dc_sync_origins() {
    $origins = get_option('dc_sync_origins', []);
    $origins[] = untrailingslashit(home_url());
    return array_values(array_unique(array_filter($origins, 'is_string')));
}

function dc_sync_rebase($value) {
    $origins = dc_sync_origins();
    usort($origins, function ($a, $b) { return strlen($b) <=> strlen($a); });
    $map = [];
    foreach ($origins as $origin) { $map[$origin.'/'] = untrailingslashit(home_url()).'/'; }
    return strtr($value, $map);
}

function dc_sync_page_hash($id) {
    $page = get_post($id);
    if (!$page) { return ''; }
    $data = [$page->post_title, $page->post_content, $page->post_name, $page->post_status];
    foreach (['_wp_page_template','_dc_title','_dc_description'] as $key) { $data[] = get_post_meta($id, $key, true); }
    $origins = dc_sync_origins();
    usort($origins, function ($a, $b) { return strlen($b) <=> strlen($a); });
    foreach ($data as &$value) {
        foreach ($origins as $origin) { $value = str_replace($origin.'/', '{{DC_SITE}}/', $value); }
    }
    return hash('sha256', wp_json_encode($data));
}

function dc_sync_signature() {
    $hash = hash_init('sha256');
    foreach (array_merge(glob(get_theme_file_path('patterns/*.php')) ?: [], glob(get_theme_file_path('assets/images/*')) ?: [], [__FILE__, get_theme_file_path('functions.php'), get_theme_file_path('style.css')]) as $path) {
        if (is_file($path)) { hash_update_file($hash, $path); }
    }
    hash_update($hash, home_url().'|'.site_url());
    return hash_final($hash);
}

/** Import only local, referenced raster images. SVG remains bundled and cannot be uploaded here. */
function dc_sync_import_asset($filename, $alt, &$media) {
    $filename = basename($filename);
    if (!preg_match('/\.(webp|png|jpe?g|avif)$/i', $filename)) { return 0; }
    $file = get_theme_file_path('assets/images/'.$filename);
    if (!is_file($file)) { return new WP_Error('dc_missing_asset', 'Brak pliku zdjęcia: '.$filename); }
    $key = preg_replace('/-\d+(?=\.[^.]+$)/', '', $filename);
    if (isset($media[$key])) { return $media[$key]; }
    $ids = get_posts(['post_type'=>'attachment','post_status'=>'inherit','fields'=>'ids','posts_per_page'=>1,'meta_key'=>'_dc_asset_key','meta_value'=>$key]);
    $id = $ids ? (int) $ids[0] : 0;
    $hash = hash_file('sha256', $file);
    if ($id && get_post_meta($id, '_dc_asset_hash', true) === $hash && is_file(get_attached_file($id))) { $media[$key] = $id; return $id; }
    require_once ABSPATH.'wp-admin/includes/file.php';
    require_once ABSPATH.'wp-admin/includes/image.php';
    $type = wp_check_filetype($filename);
    $upload = wp_upload_bits(pathinfo($filename, PATHINFO_FILENAME).'-'.substr($hash,0,10).'.'.pathinfo($filename,PATHINFO_EXTENSION), null, file_get_contents($file));
    if (!empty($upload['error'])) { return new WP_Error('dc_upload', $upload['error']); }
    if (!$id) {
        $id = wp_insert_attachment(['post_mime_type'=>$type['type'],'post_title'=>sanitize_text_field($alt ?: pathinfo($key,PATHINFO_FILENAME)),'post_status'=>'inherit'], $upload['file'], 0, true);
        if (is_wp_error($id)) { return $id; }
        update_post_meta($id, '_wp_attachment_image_alt', sanitize_text_field($alt));
    } else { update_attached_file($id, $upload['file']); }
    $metadata = wp_generate_attachment_metadata($id, $upload['file']);
    if ($metadata) { wp_update_attachment_metadata($id, $metadata); }
    update_post_meta($id, '_dc_asset_key', $key);
    update_post_meta($id, '_dc_asset_hash', $hash);
    $media[$key] = $id;
    return $id;
}

function dc_sync_image_block($block, &$media) {
    foreach ($block['innerBlocks'] as &$child) {
        $result = dc_sync_image_block($child, $media);
        if (is_wp_error($result)) { return $result; }
        $child = $result;
    }
    unset($child);
    if ($block['blockName'] !== 'core/image') { return $block; }
    $tags = new WP_HTML_Tag_Processor($block['innerHTML']);
    if (!$tags->next_tag('IMG')) { return $block; }
    $src = $tags->get_attribute('src');
    $base = get_theme_file_uri('assets/images/');
    if (!is_string($src) || !str_starts_with($src, $base)) { return $block; }
    $id = dc_sync_import_asset(basename(wp_parse_url($src,PHP_URL_PATH)), (string) $tags->get_attribute('alt'), $media);
    if (is_wp_error($id)) { return $id; }
    if (!$id) { return $block; }
    // WP_CONTENT_URL is a request-lifetime constant and can still contain the
    // previous domain during an option update or WP-CLI command.
    $url = dc_sync_rebase(wp_get_attachment_url($id));
    $tags->set_attribute('src', $url);
    $tags->add_class('wp-image-'.$id);
    $html = $tags->get_updated_html();
    $links = new WP_HTML_Tag_Processor($html);
    while ($links->next_tag('A')) {
        $href = $links->get_attribute('href');
        if (is_string($href) && str_starts_with($href, $base)) { $links->set_attribute('href', $url); }
    }
    $html = $links->get_updated_html();
    $block['attrs']['id'] = $id;
    $block['innerHTML'] = $html;
    $block['innerContent'] = [$html];
    return $block;
}

function dc_sync_render_pattern($key, &$media, $owned) {
    $file = get_theme_file_path('patterns/'.$key.'.php');
    if (!is_file($file)) { return new WP_Error('dc_missing_pattern','Brak wzorca strony: '.$key); }
    ob_start(); include $file; $content = ob_get_clean();
    if (trim($content) === '') { return new WP_Error('dc_empty_pattern','Wzorzec strony jest pusty: '.$key); }
    foreach (dc_sync_pages() as $page_key=>$definition) {
        if (isset($owned[$page_key])) {
            // Initial placeholders are drafts and permalink settings are applied only
            // after a complete import. Render their final slug URLs, never ?page_id.
            $id = $owned[$page_key];
            $url = !get_option('dc_sync_initialized') || get_post_status($id) !== 'publish'
                ? home_url('/'.get_post_field('post_name',$id).'/') : get_permalink($id);
            $content = str_replace(home_url('/'.$definition[0].'/'), $url, $content);
        }
    }
    $blocks = parse_blocks($content);
    foreach ($blocks as &$block) {
        $result = dc_sync_image_block($block, $media);
        if (is_wp_error($result)) { return $result; }
        $block = $result;
    }
    return serialize_blocks($blocks);
}

function dc_sync_menu($owned) {
    $menu = (int) get_option('dc_sync_menu');
    if (!$menu || !wp_get_nav_menu_object($menu)) {
        $menu = wp_create_nav_menu('DC Serwis — nawigacja');
        if (is_wp_error($menu)) { return $menu; }
        update_option('dc_sync_menu', $menu, false);
    }
    $items = wp_get_nav_menu_items($menu) ?: [];
    $labels = ['home'=>'Strona główna','climate'=>'Klimatyzacja','appliances'=>'Serwis AGD','projects'=>'Realizacje','about'=>'O firmie','contact'=>'Kontakt'];
    $position = 0;
    foreach ($labels as $key=>$label) {
        ++$position;
        $existing = array_values(array_filter($items, function ($item) use ($owned,$key) { return get_post_meta($item->ID,'_dc_sync_menu_key',true) === $key || (int) $item->object_id === $owned[$key]; }));
        if ($existing && (int) $existing[0]->object_id === $owned[$key]) { continue; }
        $result = wp_update_nav_menu_item($menu, $existing ? $existing[0]->ID : 0, ['menu-item-object-id'=>$owned[$key],'menu-item-object'=>'page','menu-item-type'=>'post_type','menu-item-title'=>$label,'menu-item-position'=>$position,'menu-item-status'=>'publish']);
        if (is_wp_error($result)) { return $result; }
        update_post_meta($result,'_dc_sync_menu_key',$key);
    }
    $locations = get_theme_mod('nav_menu_locations', []);
    if (empty($locations['primary'])) { $locations['primary'] = $menu; set_theme_mod('nav_menu_locations', $locations); }
    return true;
}

/** Non-destructive reconciliation. Published/user-edited foreign pages are never adopted. */
function dc_sync_site() {
    $report = ['created'=>[],'updated'=>[],'preserved'=>[],'errors'=>[],'warnings'=>[],'media'=>0];
    $lock = (int) get_option('dc_sync_lock');
    if ($lock && time()-$lock < 300) { $report['errors'][] = 'Synchronizacja już trwa. Spróbuj ponownie za chwilę.'; return $report; }
    if ($lock) { delete_option('dc_sync_lock'); }
    if (!add_option('dc_sync_lock', time(), '', false)) { $report['errors'][] = 'Synchronizacja już trwa.'; return $report; }
    try {
        // Read ownership only after acquiring the lock: another request may have
        // completed setup while this request was waiting to enter.
        $owned = dc_sync_owned_pages();
        $preflight = dc_sync_preflight($owned);
        if (is_wp_error($preflight)) { $report['errors'][] = $preflight->get_error_message(); update_option('dc_sync_report',$report,false); return $report; }
        if (get_page_by_path('sample-page') || get_posts(['post_type'=>'post','post_status'=>['publish','draft','private'],'name'=>'hello-world','posts_per_page'=>1,'fields'=>'ids'])) {
            $report['warnings'][] = 'Pozostawiono przykładowe treści WordPressa (sample-page / hello-world). Sprawdź je w panelu i usuń samodzielnie, jeżeli nie są potrzebne.';
        }
        update_option('dc_sync_origins', dc_sync_origins(), false);
        $new_install = !get_option('dc_sync_initialized');
        $fresh = [];
        foreach (dc_sync_pages() as $key=>$definition) {
            if (isset($owned[$key])) { continue; }
            $id = wp_insert_post(['post_type'=>'page','post_status'=>'draft','post_name'=>$definition[0],'post_title'=>$definition[1]], true);
            if (is_wp_error($id)) { $report['errors'][] = $id->get_error_message(); continue; }
            update_post_meta($id,'_dc_sync_key',$key); update_post_meta($id,'_dc_sync_pending',1);
            $owned[$key] = $id; $fresh[$key] = true;
        }
        $media = [];
        foreach (dc_sync_pages() as $key=>$definition) {
            if (!isset($owned[$key])) { continue; }
            $id = $owned[$key];
            $baseline = get_post_meta($id,'_dc_sync_hash',true);
            if (!$baseline && get_post_meta($id,'_dc_sync_pending',true) && get_post_field('post_content',$id) === '' && get_the_title($id) === $definition[1]) { $fresh[$key] = true; }
            if (empty($fresh[$key]) && $baseline !== dc_sync_page_hash($id)) {
                $post = get_post($id);
                $rebased = dc_sync_rebase($post->post_content);
                if ($rebased !== $post->post_content) { wp_update_post(wp_slash(['ID'=>$id,'post_content'=>$rebased])); }
                $report['preserved'][] = $definition[1].' — zachowano ręczne zmiany'; continue;
            }
            $content = dc_sync_render_pattern($key,$media,$owned);
            if (is_wp_error($content)) { $report['errors'][] = $content->get_error_message(); continue; }
            $current = get_post($id);
            if (isset($fresh[$key]) || $content !== $current->post_content || $definition[1] !== $current->post_title) {
                $result = wp_update_post(wp_slash(['ID'=>$id,'post_content'=>$content,'post_title'=>$definition[1],'post_status'=>'publish']), true);
                if (is_wp_error($result)) { $report['errors'][] = $result->get_error_message(); continue; }
                $report[isset($fresh[$key]) ? 'created' : 'updated'][] = $definition[1];
            }
            update_post_meta($id,'_dc_layout','designed');
            update_post_meta($id,'_wp_page_template','page-designed.php');
            update_post_meta($id,'_dc_title',$definition[2]); update_post_meta($id,'_dc_description',$definition[3]);
            update_post_meta($id,'_dc_sync_hash',dc_sync_page_hash($id)); delete_post_meta($id,'_dc_sync_pending');
        }
        $report['media'] = count($media);
        if (count($owned) === count(dc_sync_pages()) && !$report['errors']) {
            if ($new_install) {
                update_option('show_on_front','page'); update_option('page_on_front',$owned['home']);
                update_option('blogname','Damian Cebula — Serwis Klimatyzacji i AGD'); update_option('blogdescription','Stalowa Wola i okolice');
                // Keep both persisted options and the current request's rewrite
                // object in sync before a second import/get_permalink call.
                global $wp_rewrite;
                $wp_rewrite->set_permalink_structure('/%postname%/');
                flush_rewrite_rules(false);
                update_option('dc_sync_initialized', true, false);
            }
            $menu = dc_sync_menu($owned);
            if (is_wp_error($menu)) { $report['errors'][] = $menu->get_error_message(); }
        }
        if (!$report['errors']) { update_option('dc_sync_signature',dc_sync_signature(),false); }
        update_option('dc_sync_report',$report,false);
    } finally { delete_option('dc_sync_lock'); }
    return $report;
}

add_action('after_switch_theme', function () { dc_sync_site(); });
add_action('admin_init', function () {
    if (!current_user_can('switch_themes')) { return; }
    $pending = get_posts(['post_type'=>'page','post_status'=>'any','fields'=>'ids','posts_per_page'=>1,'meta_key'=>'_dc_sync_pending','meta_value'=>'1']);
    if ((get_option('dc_sync_initialized') || $pending) && (count(dc_sync_owned_pages()) < count(dc_sync_pages()) || $pending || get_option('dc_sync_signature') !== dc_sync_signature())) { dc_sync_site(); }
});
add_action('updated_option', function ($option) {
    if (in_array($option,['home','siteurl'],true) && get_option('dc_sync_initialized')) { wp_upload_dir(null,false,true); dc_sync_site(); }
});
add_action('admin_menu', function () { add_theme_page('DC — synchronizacja','DC — synchronizacja','switch_themes','dc-site-sync','dc_sync_admin_page'); });
function dc_sync_admin_page() {
    if (!current_user_can('switch_themes')) { return; }
    $report = get_option('dc_sync_report', []);
    echo '<div class="wrap"><h1>DC — strony i zdjęcia</h1><p>Aktywacja motywu na nowej instalacji tworzy sześć stron, nawigację i bibliotekę zdjęć. Synchronizacja uzupełnia brakujące elementy i aktualizuje treści motywu, zachowując Twoje ręczne zmiany. Nie zmienia istniejącej polityki prywatności, indeksacji ani ustawień mapy, opinii i poczty.</p>';
    if ($report) {
        foreach (['created'=>'Utworzono','updated'=>'Zaktualizowano','preserved'=>'Zachowano','warnings'=>'Sprawdź przed publikacją','errors'=>'Wymaga uwagi'] as $key=>$label) {
            if (empty($report[$key])) { continue; }
            echo '<h2>'.esc_html($label).'</h2><ul>';
            foreach ($report[$key] as $message) { echo '<li>'.esc_html($message).'</li>'; }
            echo '</ul>';
        }
        echo '<p>Zdjęcia dostępne w bibliotece: '.esc_html((string) count(get_posts(['post_type'=>'attachment','post_status'=>'inherit','fields'=>'ids','posts_per_page'=>-1,'meta_key'=>'_dc_asset_key']))).'.</p>';
    }
    echo '<form method="post" action="'.esc_url(admin_url('admin-post.php')).'"><input type="hidden" name="action" value="dc_site_sync">';
    wp_nonce_field('dc_site_sync'); submit_button('Synchronizuj strony i zdjęcia'); echo '</form><p>Przed podłączeniem domeny sprawdź politykę prywatności i dostarczalność formularza. Motyw nie zastępuje tych treści automatycznie.</p></div>';
}
add_action('admin_post_dc_site_sync', function () {
    if (!current_user_can('switch_themes')) { wp_die('Brak uprawnień.','',['response'=>403]); }
    check_admin_referer('dc_site_sync'); dc_sync_site(); wp_safe_redirect(admin_url('themes.php?page=dc-site-sync')); exit;
});
add_action('admin_notices', function () {
    if (!current_user_can('switch_themes') || !get_option('dc_sync_report')) { return; }
    if (get_option('dc_sync_initialized') && empty(get_option('dc_sync_report')['errors'])) { return; }
    echo '<div class="notice notice-warning"><p>DC Serwis: sprawdź <a href="'.esc_url(admin_url('themes.php?page=dc-site-sync')).'">wynik automatycznej instalacji stron</a>. Istniejące treści nie zostały nadpisane.</p></div>';
});
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('dc sync', function () {
        $report = dc_sync_site();
        foreach (['created','updated','preserved','warnings','errors'] as $key) { foreach ($report[$key] as $message) { WP_CLI::log($key.': '.$message); } }
        if ($report['errors']) { WP_CLI::error('Synchronizacja nie została zakończona. Zachowano istniejące treści.'); }
        WP_CLI::success('Strony i zdjęcia zsynchronizowane; ręczne zmiany zachowane.');
    });
}
