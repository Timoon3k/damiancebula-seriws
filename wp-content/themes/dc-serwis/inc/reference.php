<?php
/** Blue reference layout. Saved Gutenberg content and SEO fields stay intact. */
if (!defined('ABSPATH')) { exit; }

function dc_reference_defaults() {
    return [
        'heading_first' => 'Profesjonalny',
        'heading_service' => 'serwis klimatyzacji',
        'heading_local' => 'i AGD w Stalowej Woli',
        'intro' => "Naprawa, przegląd i konserwacja klimatyzacji\noraz serwis pralek, zmywarek i lodówek\nw Stalowej Woli i okolicach.",
        'why_heading' => 'Dlaczego warto wybrać',
        'why_name' => 'Damian Cebula Serwis?',
        'why_points' => "Lokalny serwis — Stalowa Wola i okolice\nRozpoznanie usterki przed naprawą\nUzgodniony zakres prac i wycena\nObsługa domów, mieszkań i biur\nSprawdzenie urządzenia po zakończeniu prac",
        'climate_heading' => "Serwis klimatyzacji\nStalowa Wola",
        'climate_description' => "Przeglądy, czyszczenie, montaż\ni naprawa klimatyzacji.",
        'agd_heading' => "Serwis AGD\nStalowa Wola",
        'agd_description' => "Naprawa pralek, zmywarek\ni lodówek.",
    ];
}
function dc_reference_text($key) {
    $defaults = dc_reference_defaults();
    return (string) get_theme_mod('dc_reference_'.$key, $defaults[$key] ?? '');
}
function dc_reference_lines($key) {
    return nl2br(esc_html(dc_reference_text($key)), false);
}
function dc_reference_menu() {
    $links = [''=>'Strona główna', 'serwis-klimatyzacji-stalowa-wola'=>'Serwis klimatyzacji', 'serwis-agd-stalowa-wola'=>'Serwis AGD', 'o-firmie'=>'O firmie', 'cennik'=>'Cennik', 'porady'=>'Porady', 'kontakt'=>'Kontakt'];
    echo '<ul class="menu">';
    foreach ($links as $slug=>$label) {
        // Until the authorized admin synchronization, do not emit dead links.
        if (in_array($slug, ['cennik', 'porady'], true)) {
            $page = get_page_by_path($slug);
            if (!$page || get_post_status($page) !== 'publish') { continue; }
        }
        $active = $slug ? is_page($slug) : is_front_page();
        echo '<li><a'.($active ? ' aria-current="page"' : '').' href="'.esc_url(home_url('/'.($slug ? $slug.'/' : ''))).'">'.esc_html($label).'</a></li>';
    }
    echo '</ul>';
}
add_action('customize_register', function ($customizer) {
    $customizer->add_section('dc_reference_home', [
        'title' => 'DC — Strona główna: niebieska makieta',
        'description' => 'Nagłówek i sekcja „Dlaczego warto”. Teksty SEO, realizacje i opinie poniżej edytujesz w treści strony głównej. Zdjęcia ilustracyjne nie zastępują fotografii realizacji.',
    ]);
    $labels = ['heading_first'=>'Nagłówek — pierwszy wiersz', 'heading_service'=>'Nagłówek — błękitny wiersz', 'heading_local'=>'Nagłówek — lokalizacja i AGD', 'intro'=>'Wprowadzenie', 'why_heading'=>'Dlaczego warto — nagłówek', 'why_name'=>'Dlaczego warto — nazwa', 'why_points'=>'Korzyści — jeden punkt w każdym wierszu', 'climate_heading'=>'Panel klimatyzacji — tytuł', 'climate_description'=>'Panel klimatyzacji — opis', 'agd_heading'=>'Panel AGD — tytuł', 'agd_description'=>'Panel AGD — opis'];
    foreach (dc_reference_defaults() as $key => $default) {
        $multiline = in_array($key, ['intro', 'why_points', 'climate_heading', 'climate_description', 'agd_heading', 'agd_description'], true);
        $customizer->add_setting('dc_reference_'.$key, ['default'=>$default, 'sanitize_callback'=>$multiline ? 'sanitize_textarea_field' : 'sanitize_text_field', 'capability'=>'edit_theme_options']);
        $customizer->add_control('dc_reference_'.$key, ['section'=>'dc_reference_home', 'label'=>$labels[$key], 'type'=>$multiline ? 'textarea' : 'text']);
    }
    foreach (['hero'=>'Zdjęcie klimatyzatora i pralki', 'technician'=>'Zdjęcie w sekcji „Dlaczego warto”'] as $key=>$label) {
        $customizer->add_setting('dc_reference_image_'.$key, ['default'=>0, 'sanitize_callback'=>'absint', 'capability'=>'edit_theme_options']);
        $customizer->add_control(new WP_Customize_Media_Control($customizer, 'dc_reference_image_'.$key, ['section'=>'dc_reference_home', 'label'=>$label, 'mime_type'=>'image', 'description'=>'Wybierz własne zdjęcie z Biblioteki mediów. Puste pole używa ilustracji dołączonej do motywu.']));
    }
});

add_action('add_meta_boxes_page', function ($post) {
    if ((int) get_option('page_on_front') !== (int) $post->ID) { return; }
    add_meta_box('dc-reference-editing', 'DC — edycja nowej strony głównej', function () {
        echo '<p>Nagłówek, panele usług, korzyści i zdjęcia nowej makiety edytujesz w <a href="'.esc_url(admin_url('customize.php?autofocus[section]=dc_reference_home')).'">Dostosuj → DC — Strona główna: niebieska makieta</a>.</p><p>Poniżej edytujesz teksty SEO, lokalny opis, realizacje i shortcode opinii. Wcześniejsze bloki hero, usług i procesu pozostają zapisane w treści dla zachowania danych, lecz nowy szablon zastępuje ich prezentację.</p>';
    }, 'page', 'normal', 'high');
});

function dc_reference_image($scene, $alt, $hero = false) {
    $id = absint(get_theme_mod('dc_reference_image_'.$scene, 0));
    $sizes = $hero ? '(max-width:800px) 100vw, 60vw' : '(max-width:800px) 100vw, 60vw';
    $attributes = ['alt'=>$alt, 'sizes'=>$sizes, 'loading'=>$hero ? 'eager' : 'lazy', 'decoding'=>'async', 'fetchpriority'=>$hero ? 'high' : 'low'];
    if ($id && wp_attachment_is_image($id)) {
        $saved_alt = trim((string) get_post_meta($id, '_wp_attachment_image_alt', true));
        if ($saved_alt !== '') { $attributes['alt'] = $saved_alt; }
        return wp_get_attachment_image($id, 'full', false, $attributes);
    }
    $stem = 'assets/images/editorial-reference-'.$scene;
    $file = get_theme_file_path($stem.'-1536.webp');
    $dimensions = is_file($file) ? wp_getimagesize($file) : false;
    if (!$dimensions) { return ''; }
    $srcset = [];
    foreach ([480, 960, 1536] as $width) { $srcset[] = get_theme_file_uri($stem.'-'.$width.'.webp').' '.$width.'w'; }
    return '<img src="'.esc_url(get_theme_file_uri($stem.'-1536.webp')).'" srcset="'.esc_attr(implode(', ', $srcset)).'" sizes="'.esc_attr($sizes).'" width="'.absint($dimensions[0]).'" height="'.absint($dimensions[1]).'" alt="'.esc_attr($alt).'" loading="'.esc_attr($attributes['loading']).'" fetchpriority="'.esc_attr($attributes['fetchpriority']).'" decoding="async">';
}

/** Reorder the existing lower sections, retaining custom blocks and shortcodes. */
function dc_reference_home_content($content) {
    $seo = [];
    $remaining = [];
    foreach (parse_blocks($content) as $block) {
        $classes = preg_split('/\s+/', $block['attrs']['className'] ?? '');
        if (array_intersect(['home-hero', 'services', 'process'], $classes)) { continue; }
        if (in_array('text-section', $classes, true)) { $seo[] = $block; }
        else { $remaining[] = $block; }
    }
    if ($seo) {
        echo '<div class="reference-local-seo"><div class="wrap reference-local-inner"><div class="local-seo-copy">';
        echo apply_filters('the_content', serialize_blocks($seo));
        echo '</div><div class="local-city-mark" aria-hidden="true"><span class="city-brush">Stalowa Wola<small>Twój lokalny serwis</small></span><img src="'.esc_url(get_theme_file_uri('assets/branding/local-outline.svg')).'" width="530" height="190" alt="" loading="lazy"></div></div></div>';
    }
    echo apply_filters('the_content', serialize_blocks($remaining));
}
