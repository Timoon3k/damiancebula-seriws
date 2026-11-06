<?php
/** Readable logo layouts for both a small mark and an uploaded full wordmark. */
if (!defined('ABSPATH')) { exit; }
function dc_header_brand() {
    $id = (int) get_theme_mod('custom_logo');
    $meta = $id ? wp_get_attachment_metadata($id) : false;
    if ($id && wp_attachment_is_image($id)) {
        $ratio = !empty($meta['height']) ? (float) $meta['width'] / (float) $meta['height'] : 1;
        $lockup = $ratio >= 2.7;
        $tone = get_theme_mod('dc_logo_tone', 'auto');
        if (!in_array($tone, ['auto','light','dark'], true)) { $tone = 'auto'; }
        $class = $lockup ? 'brand-logo brand-lockup' : 'brand-logo brand-symbol';
        if ($lockup) { echo '<span class="brand-uploaded-lockup">'; }
        echo wp_get_attachment_image($id, 'full', false, ['class'=>$class, 'alt'=>'', 'data-logo-tone'=>$tone, 'decoding'=>'async', 'loading'=>'eager']);
        if ($lockup) { echo '</span>'; return; }
    } else {
        echo '<img class="brand-logo brand-lockup" src="'.esc_url(get_theme_file_uri('assets/branding/dc-lockup-light.svg')).'" width="1180" height="220" alt="" decoding="async">';
        return;
    }
    echo '<span class="brand-wordmark"><strong>Damian Cebula</strong><small>Serwis Klimatyzacji i AGD</small></span>';
}
add_action('customize_register', function ($customizer) {
    $customizer->add_setting('dc_logo_tone', ['default'=>'auto','sanitize_callback'=>function ($value) { return in_array($value,['auto','light','dark'],true) ? $value : 'auto'; }]);
    $customizer->add_control('dc_logo_tone', ['section'=>'title_tagline','label'=>'Czytelność logo na ciemnym tle','description'=>'Logo z pełną nazwą jest wyświetlane szeroko, bez powielania podpisu. Tryb automatyczny rozpoznaje ciemne litery; jeśli logo jest z zewnętrznej domeny, wybierz właściwy wariant ręcznie.','type'=>'select','choices'=>['auto'=>'Automatycznie','light'=>'Logo ma jasne napisy','dark'=>'Logo ma ciemne napisy — rozjaśnij']]);
});
