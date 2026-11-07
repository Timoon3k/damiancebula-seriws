<?php
/** Readable logo layouts for both a small mark and an uploaded full wordmark. */
if (!defined('ABSPATH')) { exit; }
/** Recover the upload behind a Customizer crop without changing the owner's setting. */
function dc_brand_source($selected_id) {
    $id = (int) $selected_id;
    $seen = [];
    for ($depth = 0; $depth < 3; $depth++) {
        $meta = wp_get_attachment_metadata($id);
        $file = get_attached_file($id);
        $is_crop = get_post_meta($id, '_wp_attachment_context', true) === 'custom-logo'
            || str_starts_with(wp_basename((string) $file), 'cropped-');
        $parent = (int) wp_get_post_parent_id($id);
        if (!$is_crop || !$parent || isset($seen[$parent]) || !wp_attachment_is_image($parent)) { break; }
        $parent_meta = wp_get_attachment_metadata($parent);
        if (empty($parent_meta['width']) || empty($parent_meta['height'])
            || $parent_meta['width'] < ($meta['width'] ?? 0) || $parent_meta['height'] < ($meta['height'] ?? 0)) { break; }
        // Preserve a deliberate symbol-only crop from a full wordmark (and vice versa).
        $child_is_lockup = !empty($meta['height']) && $meta['width'] / $meta['height'] >= 2.7;
        $parent_is_lockup = $parent_meta['width'] / $parent_meta['height'] >= 2.7;
        if ($child_is_lockup !== $parent_is_lockup) { break; }
        $seen[$id] = true;
        $id = $parent;
    }
    $meta = wp_get_attachment_metadata($id);
    $source = ['id'=>$id, 'url'=>wp_get_attachment_url($id), 'width'=>(int) ($meta['width'] ?? 0), 'height'=>(int) ($meta['height'] ?? 0)];
    // WordPress may also retain an unscaled original for a large upload.
    $original = wp_get_original_image_path($id);
    if ($original && is_file($original)) {
        $size = wp_getimagesize($original);
        if ($size) {
            $source['url'] = wp_get_original_image_url($id);
            $source['width'] = $size[0];
            $source['height'] = $size[1];
        }
    }
    return $source;
}

/** The vector mark and live type stay crisp on retina and small screens. */
function dc_reference_brand() {
    echo '<img class="brand-logo brand-reference-symbol" src="'.esc_url(get_theme_file_uri('assets/branding/dc-cog-snowflake.svg')).'" width="128" height="128" alt="" decoding="async">';
    echo '<span class="brand-reference-wordmark"><strong>Damian Cebula</strong><small>SERWIS</small></span>';
}

function dc_header_brand() {
    // Changing the visual default never rewrites an uploaded logo or its crop.
    if (get_theme_mod('dc_brand_style', 'blue-reference') !== 'custom') {
        dc_reference_brand();
        return;
    }
    $id = (int) get_theme_mod('custom_logo');
    if ($id && wp_attachment_is_image($id)) {
        $source = dc_brand_source($id);
        $ratio = $source['height'] ? $source['width'] / $source['height'] : 1;
        $lockup = $ratio >= 2.7;
        $tone = get_theme_mod('dc_logo_tone', 'auto');
        if (!in_array($tone, ['auto','light','dark'], true)) { $tone = 'auto'; }
        $class = $lockup ? 'brand-logo brand-lockup' : 'brand-logo brand-symbol';
        if ($lockup) { echo '<span class="brand-uploaded-lockup">'; }
        $image = new WP_HTML_Tag_Processor(wp_get_attachment_image($source['id'], 'full', false, ['class'=>$class, 'alt'=>'', 'data-logo-tone'=>$tone, 'decoding'=>'async', 'loading'=>'eager']));
        if ($image->next_tag('IMG')) {
            $image->set_attribute('src', $source['url']);
            if ($source['width'] && $source['height']) {
                $image->set_attribute('width', $source['width']);
                $image->set_attribute('height', $source['height']);
            }
            // Transparent margins change the visible scale after fitting. A thumbnail
            // chosen from a nominal 310px sizes hint would become visibly enlarged.
            $image->remove_attribute('srcset');
            $image->remove_attribute('sizes');
        }
        echo $image->get_updated_html();
        if ($lockup) { echo '</span>'; return; }
    } else {
        dc_reference_brand();
        return;
    }
    echo '<span class="brand-wordmark"><strong>Damian Cebula</strong><small>Serwis Klimatyzacji i AGD</small></span>';
}
add_action('customize_register', function ($customizer) {
    $customizer->add_setting('dc_brand_style', ['default'=>'blue-reference','sanitize_callback'=>function ($value) { return $value === 'custom' ? 'custom' : 'blue-reference'; }]);
    $customizer->add_control('dc_brand_style', ['section'=>'title_tagline','label'=>'Logo w nagłówku','description'=>'Niebieski znak z płatkiem śniegu i kołem zębatym odpowiada nowej makiecie. Wariant własny korzysta z logo wybranego w bibliotece. Zapisane pliki i wcześniejsze ustawienia pozostają zachowane.','type'=>'select','choices'=>['blue-reference'=>'Niebieskie logo Damian Cebula Serwis','custom'=>'Własne logo z biblioteki']]);
    $customizer->add_setting('dc_logo_tone', ['default'=>'auto','sanitize_callback'=>function ($value) { return in_array($value,['auto','light','dark'],true) ? $value : 'auto'; }]);
    $customizer->add_control('dc_logo_tone', ['section'=>'title_tagline','label'=>'Czytelność własnego logo','description'=>'Dotyczy własnego logo. Ciemne napisy można rozjaśnić na granatowym nagłówku. Wgraj oryginał w dużej rozdzielczości i pomiń przycinanie. Motyw używa oryginalnego pliku, również dla wcześniejszych przycięć, gdy oryginał jest w bibliotece.','type'=>'select','choices'=>['auto'=>'Automatycznie','light'=>'Jasne logo — zachowaj kolory','dark'=>'Ciemne logo — rozjaśnij']]);
    $customizer->add_setting('dc_favicon_style', ['default'=>'blue-reference','sanitize_callback'=>function ($value) { return $value === 'wordpress' ? 'wordpress' : 'blue-reference'; }]);
    $customizer->add_control('dc_favicon_style', ['section'=>'title_tagline','label'=>'Ikona witryny','description'=>'Domyślna ikona łączy niebieski płatek śniegu z kołem zębatym. Wariant WordPress używa własnej ikony wybranej poniżej.','type'=>'select','choices'=>['blue-reference'=>'Niebieski znak serwisu','wordpress'=>'Własna ikona WordPress']]);
});

// Let WordPress emit its native, single set of browser/mobile icon tags. The
// filter also works with an existing site_icon and never rewrites that option.
add_filter('get_site_icon_url', function ($url, $size, $blog_id) {
    if (get_theme_mod('dc_favicon_style', 'blue-reference') === 'wordpress' || ($blog_id && (int) $blog_id !== get_current_blog_id())) { return $url; }
    $width = $size <= 32 ? 32 : ($size <= 180 ? 180 : ($size <= 192 ? 192 : 512));
    $file = 'assets/branding/dc-favicon-blue-'.$width.'.png';
    if (!is_readable(get_theme_file_path($file))) { $file = 'assets/branding/dc-favicon-blue.svg'; }
    if (!is_readable(get_theme_file_path($file))) { return $url; }
    return add_query_arg('ver', wp_get_theme()->get('Version'), get_theme_file_uri($file));
}, 10, 3);
