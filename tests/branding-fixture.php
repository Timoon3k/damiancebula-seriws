<?php
/** Disposable local-logo fixture; never use against hosting. */
if (!defined('WP_CLI') || !WP_CLI || !in_array(wp_parse_url(home_url(),PHP_URL_HOST),['localhost','127.0.0.1'],true)) { exit(1); }
$mode=$args[0] ?? 'prepare';
if ($mode==='cleanup') {
    $state=get_option('dc_test_branding_state');
    if (!$state) { return; }
    foreach (['custom_logo','dc_logo_tone'] as $key) {
        if (array_key_exists($key,$state['mods'])) { set_theme_mod($key,$state['mods'][$key]); } else { remove_theme_mod($key); }
    }
    foreach (array_reverse($state['ids'] ?? [$state['id'] ?? 0]) as $id) {
        if ($id && get_post_meta($id,'_dc_test_branding',true)) { wp_delete_attachment($id,true); }
    }
    delete_option('dc_test_branding_state'); WP_CLI::success('Original logo settings restored.'); return;
}
if (get_option('dc_test_branding_state')) { throw new RuntimeException('Clean up the prior fixture first.'); }
$state=['mods'=>array_intersect_key((array)get_theme_mods(),array_flip(['custom_logo','dc_logo_tone']))];
update_option('dc_test_branding_state',$state,false);
require_once ABSPATH.'wp-admin/includes/image.php';
$file=wp_upload_bits('dc-dark-padded-test.png',null,file_get_contents(__DIR__.'/fixtures/logo-dark-padded.png'));
if (!empty($file['error'])) { throw new RuntimeException($file['error']); }
$id=wp_insert_attachment(['post_mime_type'=>'image/png','post_title'=>'Local logo regression fixture','post_status'=>'inherit'],$file['file'],0,true);
if(is_wp_error($id)){throw new RuntimeException($id->get_error_message());}
update_post_meta($id,'_dc_test_branding',1);wp_update_attachment_metadata($id,wp_generate_attachment_metadata($id,$file['file']));
$state['ids']=[$id];update_option('dc_test_branding_state',$state,false);
if ($mode==='cropped') {
    // Reproduce the old Customizer crop, including WordPress's link to its upload.
    $editor=wp_get_image_editor($file['file']);
    if (is_wp_error($editor)) { throw new RuntimeException($editor->get_error_message()); }
    $editor->resize(220,64,true);
    $crop=$editor->save(dirname($file['file']).'/cropped-dc-dark-padded-test.png');
    if (is_wp_error($crop)) { throw new RuntimeException($crop->get_error_message()); }
    $child=wp_insert_attachment(['post_mime_type'=>'image/png','post_title'=>'Old Customizer 220x64 logo crop','post_status'=>'inherit','post_parent'=>$id],$crop['path'],0,true);
    if (is_wp_error($child)) { throw new RuntimeException($child->get_error_message()); }
    update_post_meta($child,'_dc_test_branding',1);
    $state['ids'][]=$child;update_option('dc_test_branding_state',$state,false);
    update_post_meta($child,'_wp_attachment_context','custom-logo');
    wp_update_attachment_metadata($child,wp_generate_attachment_metadata($child,$crop['path']));
    if (dc_brand_source($child)['id'] !== $id) { throw new RuntimeException('Crop must render the original upload.'); }
    $metadata=wp_get_attachment_metadata($child);
    wp_update_attachment_metadata($child,array_replace($metadata,['width'=>64,'height'=>64]));
    if (dc_brand_source($child)['id'] !== $child) { throw new RuntimeException('Keep a deliberate symbol-only crop.'); }
    wp_update_attachment_metadata($child,$metadata);
    // An ordinary page parent must never become the logo source.
    wp_update_post(['ID'=>$child,'post_parent'=>(int)get_option('page_on_front')]);
    if (dc_brand_source($child)['id'] !== $child) { throw new RuntimeException('Do not follow non-image parents.'); }
    wp_update_post(['ID'=>$child,'post_parent'=>$id]);
    $id=$child;
}
set_theme_mod('custom_logo',$id);set_theme_mod('dc_logo_tone','auto');
ob_start();dc_header_brand();$html=ob_get_clean();
if ((int)get_theme_mod('custom_logo') !== $id || str_contains($html,'srcset=') || str_contains($html,'sizes=')) { throw new RuntimeException('Rendering must preserve selection and omit small responsive variants.'); }
WP_CLI::success('Dark padded logo fixture enabled: '.$mode.'.');
