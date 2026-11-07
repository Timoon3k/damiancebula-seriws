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

function dc_header_brand() {
    $palette = get_theme_mod('dc_logo_palette', 'copper') === 'original' ? 'original' : 'copper';
    if ($palette === 'copper') {
        // A colour treatment of the original alpha channel keeps the source sharp.
        // sRGB plus the CSS accent gives precisely the same ink as the hero text.
        echo '<svg class="brand-ink-filter" width="0" height="0" aria-hidden="true" focusable="false"><defs><filter id="dc-brand-copper" color-interpolation-filters="sRGB"><feFlood class="brand-ink-color" flood-color="#9c4f2c"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs></svg>';
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
            if ($palette === 'copper') {
                $style = trim((string) $image->get_attribute('style'), "; \t\n\r");
                $image->set_attribute('style', ($style !== '' ? $style.';' : '').'filter:url(#dc-brand-copper)');
            }
        }
        echo $image->get_updated_html();
        if ($lockup) { echo '</span>'; return; }
    } else {
        echo '<img class="brand-logo brand-lockup" src="'.esc_url(get_theme_file_uri('assets/branding/dc-lockup-porcelain.svg')).'" width="1180" height="220" alt="" decoding="async"'.($palette === 'copper' ? ' style="filter:url(#dc-brand-copper)"' : '').'>';
        return;
    }
    echo '<span class="brand-wordmark" data-logo-palette="'.esc_attr($palette).'"><strong>Damian Cebula</strong><small>Serwis Klimatyzacji i AGD</small></span>';
}
add_action('customize_register', function ($customizer) {
    $customizer->add_setting('dc_logo_palette', ['default'=>'copper','sanitize_callback'=>function ($value) { return $value === 'original' ? 'original' : 'copper'; }]);
    $customizer->add_control('dc_logo_palette', ['section'=>'title_tagline','label'=>'Kolor logo w nagłówku','description'=>'Miedziany wariant stosuje dokładnie kolor wyróżnienia „Przywracamy komfort”, także do własnego logo z przezroczystym tłem. Oryginalny plik i jego rozdzielczość pozostają zachowane.','type'=>'select','choices'=>['copper'=>'Miedź motywu','original'=>'Oryginalne kolory logo']]);
    $customizer->add_setting('dc_logo_tone', ['default'=>'auto','sanitize_callback'=>function ($value) { return in_array($value,['auto','light','dark'],true) ? $value : 'auto'; }]);
    $customizer->add_control('dc_logo_tone', ['section'=>'title_tagline','label'=>'Czytelność oryginalnych kolorów logo','description'=>'Dotyczy wariantu „Oryginalne kolory logo”. Wgraj oryginalne logo w dużej rozdzielczości i pomiń przycinanie. Motyw korzysta z oryginału zamiast miniatury, również dla wcześniejszych przycięć, gdy oryginał jest w bibliotece. Samo powiększenie małego pliku nie przywróci szczegółów.','type'=>'select','choices'=>['auto'=>'Automatycznie','light'=>'Logo ma jasne napisy — przyciemnij','dark'=>'Logo ma ciemne napisy']]);
    $customizer->add_setting('dc_favicon_style', ['default'=>'copper','sanitize_callback'=>function ($value) { return $value === 'wordpress' ? 'wordpress' : 'copper'; }]);
    $customizer->add_control('dc_favicon_style', ['section'=>'title_tagline','label'=>'Ikona witryny','description'=>'Domyślna miedziana ikona odpowiada nowemu logo. Wariant WordPress używa ikony wybranej poniżej, bez zmiany zapisanych ustawień.','type'=>'select','choices'=>['copper'=>'Miedziana ikona DC','wordpress'=>'Własna ikona WordPress']]);
});

// Let WordPress emit its native, single set of browser/mobile icon tags. The
// filter also works with an existing site_icon and never rewrites that option.
add_filter('get_site_icon_url', function ($url, $size, $blog_id) {
    if (get_theme_mod('dc_favicon_style', 'copper') === 'wordpress' || ($blog_id && (int) $blog_id !== get_current_blog_id())) { return $url; }
    $width = $size <= 32 ? 32 : ($size <= 180 ? 180 : ($size <= 192 ? 192 : 512));
    $file = 'assets/branding/dc-favicon-copper-'.$width.'.png';
    if (!is_readable(get_theme_file_path($file))) { return $url; }
    return add_query_arg('ver', wp_get_theme()->get('Version'), get_theme_file_uri($file));
}, 10, 3);
