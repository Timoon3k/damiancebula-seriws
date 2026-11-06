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
        echo '<img class="brand-logo brand-lockup" src="'.esc_url(get_theme_file_uri('assets/branding/dc-lockup-light.svg')).'" width="1180" height="220" alt="" decoding="async">';
        return;
    }
    echo '<span class="brand-wordmark"><strong>Damian Cebula</strong><small>Serwis Klimatyzacji i AGD</small></span>';
}
add_action('customize_register', function ($customizer) {
    $customizer->add_setting('dc_logo_tone', ['default'=>'auto','sanitize_callback'=>function ($value) { return in_array($value,['auto','light','dark'],true) ? $value : 'auto'; }]);
    $customizer->add_control('dc_logo_tone', ['section'=>'title_tagline','label'=>'Czytelność logo na ciemnym tle','description'=>'Wgraj oryginalne logo w dużej rozdzielczości i pomiń przycinanie. Motyw korzysta z oryginału zamiast miniatury, również dla wcześniejszych przycięć, gdy oryginał jest w bibliotece. Samo powiększenie małego pliku nie przywróci szczegółów. Tryb automatyczny rozpoznaje ciemne litery; dla zewnętrznej domeny wybierz wariant ręcznie.','type'=>'select','choices'=>['auto'=>'Automatycznie','light'=>'Logo ma jasne napisy','dark'=>'Logo ma ciemne napisy — rozjaśnij']]);
});
