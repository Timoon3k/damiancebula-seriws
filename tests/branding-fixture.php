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
    if (!empty($state['id']) && get_post_meta($state['id'],'_dc_test_branding',true)) { wp_delete_attachment($state['id'],true); }
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
$state['id']=$id;update_option('dc_test_branding_state',$state,false);set_theme_mod('custom_logo',$id);set_theme_mod('dc_logo_tone','auto');
WP_CLI::success('Dark padded custom-logo fixture enabled.');
