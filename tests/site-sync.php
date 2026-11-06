<?php
/** Run with `wp eval-file` only in a disposable local WordPress installation. */
if (!defined('WP_CLI') || !WP_CLI || !in_array(wp_parse_url(home_url(),PHP_URL_HOST),['localhost','127.0.0.1'],true)) { exit(1); }
function dc_test_sync($condition,$message) { if (!$condition) { throw new RuntimeException($message); } WP_CLI::log('PASS: '.$message); }
function dc_test_attachment_ids() { return get_posts(['post_type'=>'attachment','post_status'=>'inherit','fields'=>'ids','posts_per_page'=>-1,'meta_key'=>'_dc_asset_key']); }

$indexing = get_option('blog_public');
$privacy_setting = get_option('wp_page_for_privacy_policy');
set_theme_mod('dc_reviews_shortcode','[trustindex no-registration=google]');
$report = dc_sync_site();
dc_test_sync(!$report['errors'],'Fresh setup succeeds');
$pages = dc_sync_owned_pages();
dc_test_sync(count($pages)===6,'Exactly six managed pages');
dc_test_sync(get_option('show_on_front')==='page' && (int)get_option('page_on_front')===$pages['home'],'Static homepage configured');
$media = dc_test_attachment_ids();
dc_test_sync(count($media)>0,'Photographs imported into Media Library');
$menu = (int)get_option('dc_sync_menu');
dc_test_sync(count(wp_get_nav_menu_items($menu))===6,'Exactly six navigation items');
foreach ($pages as $key=>$id) {
    dc_test_sync((bool)get_post_meta($id,'_dc_sync_hash',true),'Content baseline saved: '.$key);
    dc_test_sync(!str_contains(get_post_field('post_content',$id),'?page_id='),'Initial page contains final permalink URLs: '.$key);
    dc_test_sync(!str_contains(get_post_field('post_content',$id),'/assets/images/') || str_contains(get_post_field('post_content',$id),'.svg'),'Raster photographs use Media Library URLs: '.$key);
}
$again = dc_sync_site();
dc_test_sync(!$again['errors'] && !$again['created'] && !$again['updated'],'Repeated sync makes no duplicate or content update');
dc_test_sync($pages===dc_sync_owned_pages() && $media===dc_test_attachment_ids(),'Page and attachment IDs remain stable');
dc_test_sync(count(wp_get_nav_menu_items($menu))===6,'Menu remains deduplicated');
dc_test_sync(get_option('blog_public')===$indexing && get_option('wp_page_for_privacy_policy')===$privacy_setting,'Indexing and privacy settings preserved');
dc_test_sync(get_theme_mod('dc_reviews_shortcode')==='[trustindex no-registration=google]','Google settings preserved');

$about = $pages['about'];
$original = get_post_field('post_content',$about);
$edited = $original."\n<!-- wp:paragraph --><p>Treść zmieniona ręcznie przez właściciela.</p><!-- /wp:paragraph -->";
wp_update_post(wp_slash(['ID'=>$about,'post_content'=>$edited]));
$preserved = dc_sync_site();
dc_test_sync(get_post_field('post_content',$about)===$edited && count($preserved['preserved'])===1,'Manual content edits are preserved');
// Restore a generated fixture, preserving the original content baseline.
wp_update_post(wp_slash(['ID'=>$about,'post_content'=>$original]));

// An unowned colliding slug must stop the entire operation before uploads/settings changes.
delete_post_meta($about,'_dc_sync_key');
$before = get_post_field('post_content',$about);
$conflict = dc_sync_site();
dc_test_sync((bool)$conflict['errors'] && get_post_field('post_content',$about)===$before,'Foreign page is not silently adopted or overwritten');
update_post_meta($about,'_dc_sync_key','about');

// Restore a missing owned page/menu link without duplicating other content.
wp_delete_post($about,true);
$restored = dc_sync_site();
$pages = dc_sync_owned_pages();
dc_test_sync(!$restored['errors'] && isset($pages['about']) && $pages['about']!==$about,'Missing managed page is recreated');
dc_test_sync(count($pages)===6 && count(wp_get_nav_menu_items($menu))===6,'Recreated page does not duplicate navigation');
$menu_ids = array_map(function ($item) { return (int)$item->object_id; }, wp_get_nav_menu_items($menu));
dc_test_sync(array_map(function ($key) use ($pages) { return $pages[$key]; }, array_keys(dc_sync_pages())) === $menu_ids,'Recreated page retains the intended menu position');

$old_home = get_option('home'); $old_site = get_option('siteurl');
$preview = untrailingslashit($old_home).'/dc-domain-change-test';
try {
    update_option('home',$preview); update_option('siteurl',$preview);
    foreach (dc_sync_owned_pages() as $id) {
        $content = get_post_field('post_content',$id);
        dc_test_sync(!str_contains($content,$old_home.'/wp-content/'),'Old upload domain removed: '.$id);
        dc_test_sync(!str_contains($content,'/dc-domain-change-test/dc-domain-change-test'),'No duplicated URL prefix: '.$id);
        dc_test_sync(!str_contains($content,$old_home.'/kontakt/'),'Old internal page URL removed: '.$id);
    }
    dc_test_sync(count($media)===count(dc_test_attachment_ids()),'Domain switch does not duplicate attachments');
} finally {
    update_option('home',$old_home); update_option('siteurl',$old_site);
    remove_theme_mod('dc_reviews_shortcode');
}
dc_test_sync(!get_option('dc_sync_lock'),'Synchronization lock released');
WP_CLI::success('Repeatable page/media/menu synchronization assertions passed.');
