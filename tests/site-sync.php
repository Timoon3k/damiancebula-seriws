<?php
/** Run with `wp eval-file` only in a disposable local WordPress installation. */
if (!defined('WP_CLI') || !WP_CLI || !in_array(wp_parse_url(home_url(),PHP_URL_HOST),['localhost','127.0.0.1'],true)) { exit(1); }
function dc_test_sync($condition,$message) { if (!$condition) { throw new RuntimeException($message); } WP_CLI::log('PASS: '.$message); }
function dc_test_attachment_ids() { return get_posts(['post_type'=>'attachment','post_status'=>'inherit','fields'=>'ids','posts_per_page'=>-1,'meta_key'=>'_dc_asset_key']); }

$indexing = get_option('blog_public');
set_theme_mod('dc_reviews_shortcode','[trustindex no-registration=google]');
$report = dc_sync_site();
dc_test_sync(!$report['errors'],'Fresh setup succeeds');
$privacy_setting = get_option('wp_page_for_privacy_policy');
$policy = dc_sync_owned_privacy();
dc_test_sync($policy && $policy->post_status==='publish','A real privacy policy is automatically published');
dc_test_sync($policy->post_name==='polityka-prywatnosci' && (int)$privacy_setting===$policy->ID,'Privacy policy has stable slug and WordPress selection');
dc_test_sync(str_contains($policy->post_content,'Prezesa Urzędu Ochrony Danych Osobowych'),'Privacy policy includes data-subject complaint information');
dc_test_sync(function_exists('dc_company_address') && str_contains(do_shortcode($policy->post_content),dc_company_address()),'Privacy policy displays confirmed company address');
$policy_id = $policy->ID;
$policy_content = $policy->post_content;
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
dc_test_sync(dc_sync_owned_privacy()->ID===$policy_id && count(get_posts(['post_type'=>'page','post_status'=>'any','fields'=>'ids','posts_per_page'=>-1,'meta_key'=>'_dc_privacy_managed','meta_value'=>'1']))===1,'Privacy synchronization does not create duplicate policies');
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

// The separate policy retains manual changes and never adopts another policy.
$policy_edited = $policy_content."\n<!-- wp:paragraph --><p>Ręcznie uzgodniona informacja administratora.</p><!-- /wp:paragraph -->";
wp_update_post(wp_slash(['ID'=>$policy_id,'post_content'=>$policy_edited]));
$privacy_manual = dc_sync_site();
dc_test_sync(get_post_field('post_content',$policy_id)===$policy_edited,'Manual privacy-policy edits are preserved');
wp_update_post(wp_slash(['ID'=>$policy_id,'post_content'=>$policy_content]));
$foreign_policy = wp_insert_post(['post_type'=>'page','post_status'=>'publish','post_name'=>'dc-test-foreign-policy','post_title'=>'Istniejąca polityka','post_content'=>'Uzgodniona, istniejąca treść polityki prywatności.']);
try {
    update_option('wp_page_for_privacy_policy',$foreign_policy);
    dc_sync_site();
    dc_test_sync((int)get_option('wp_page_for_privacy_policy')===$foreign_policy && get_post_field('post_content',$foreign_policy)==='Uzgodniona, istniejąca treść polityki prywatności.','Existing real privacy policy and administrator selection are preserved');
} finally { update_option('wp_page_for_privacy_policy',$policy_id); wp_delete_post($foreign_policy,true); }

$old_home = get_option('home'); $old_site = get_option('siteurl');
$preview = untrailingslashit($old_home).'/dc-domain-change-test';
$policy_with_custom_link = $policy_content.'<!-- wp:paragraph --><p>Ręczny odnośnik: <a href="'.esc_url($old_home.'/kontakt/').'">Kontakt</a></p><!-- /wp:paragraph -->';
wp_update_post(wp_slash(['ID'=>$policy_id,'post_content'=>$policy_with_custom_link]));
try {
    update_option('home',$preview); update_option('siteurl',$preview);
    foreach (dc_sync_owned_pages() as $id) {
        $content = get_post_field('post_content',$id);
        dc_test_sync(!str_contains($content,$old_home.'/wp-content/'),'Old upload domain removed: '.$id);
        dc_test_sync(!str_contains($content,'/dc-domain-change-test/dc-domain-change-test'),'No duplicated URL prefix: '.$id);
        dc_test_sync(!str_contains($content,$old_home.'/kontakt/'),'Old internal page URL removed: '.$id);
    }
    dc_test_sync(count($media)===count(dc_test_attachment_ids()),'Domain switch does not duplicate attachments');
    $moved_policy = get_post_field('post_content',$policy_id);
    dc_test_sync(str_contains($moved_policy,$preview.'/kontakt/') && str_contains($moved_policy,'Ręczny odnośnik'),'Privacy URL rebasing preserves hand-edited content');
    dc_test_sync(!str_contains($moved_policy,'/dc-domain-change-test/dc-domain-change-test'),'Privacy URL prefix is not duplicated');
    dc_test_sync(str_starts_with(get_privacy_policy_url(),$preview.'/'),'WordPress privacy URL follows domain change');
} finally {
    update_option('home',$old_home); update_option('siteurl',$old_site);
    wp_update_post(wp_slash(['ID'=>$policy_id,'post_content'=>$policy_content]));
    remove_theme_mod('dc_reviews_shortcode');
}
dc_test_sync(!get_option('dc_sync_lock'),'Synchronization lock released');
WP_CLI::success('Repeatable page/media/menu synchronization assertions passed.');
