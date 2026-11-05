<?php
/** wp eval-file: explicit, additive demo setup. Never overwrites existing pages. */
if (!defined('WP_CLI') || !WP_CLI) { exit; }
if (!in_array(wp_parse_url(home_url(), PHP_URL_HOST), ['127.0.0.1','localhost'], true)) { WP_CLI::error('Wyłącznie lokalna instalacja — odmowa zmian na innej domenie.'); }
$pages = [
 ['strona-glowna','Strona główna','home','Serwis klimatyzacji i AGD Stalowa Wola — Damian Cebula','Montaż, serwis i naprawa klimatyzacji oraz naprawa pralek, lodówek i zmywarek w Stalowej Woli. Damian Cebula — zadzwoń i omów zgłoszenie: 794 225 139.'],
 ['serwis-klimatyzacji-stalowa-wola','Serwis klimatyzacji Stalowa Wola','climate','Serwis klimatyzacji Stalowa Wola — Damian Cebula','Montaż, naprawa, czyszczenie i konserwacja klimatyzacji w Stalowej Woli. Serwis dla domów, mieszkań i biur. Omów zakres prac z Damianem Cebulą.'],
 ['serwis-agd-stalowa-wola','Serwis AGD Stalowa Wola','appliances','Serwis AGD Stalowa Wola — naprawa pralek i zmywarek','Naprawa pralek, zmywarek i lodówek w Stalowej Woli. Zgłoś objawy, ustal diagnozę i zakres serwisu AGD. Damian Cebula — telefon 794 225 139.'],
 ['realizacje','Realizacje','projects','Realizacje montażu klimatyzacji — Damian Cebula','Zobacz autentyczne zdjęcia montażu i serwisu klimatyzacji przekazane przez Damiana Cebulę. Jednostki wewnętrzne, zewnętrzne i instalacje.'],
 ['o-firmie','O firmie','about','Damian Cebula — lokalny serwis AGD i klimatyzacji','Damian Cebula — montaż i serwis klimatyzacji oraz naprawa AGD w Stalowej Woli i okolicach. Poznaj zakres usług i sposób zgłoszenia usterki.'],
 ['kontakt','Kontakt','contact','Kontakt — Damian Cebula, serwis w Stalowej Woli','Zgłoś naprawę AGD, serwis lub montaż klimatyzacji w Stalowej Woli. Damian Cebula: 794 225 139, kontakt@damiancebula-serwis.pl. Formularz kontaktowy.'],
];
foreach ($pages as [$slug,$title,$pattern,$seo,$description]) {
    $existing = get_page_by_path($slug);
    if ($existing) { WP_CLI::log('Zachowano istniejącą stronę: '.$slug); continue; }
    ob_start(); include get_theme_file_path('patterns/'.$pattern.'.php'); $content = ob_get_clean();
    $id = wp_insert_post(['post_type'=>'page','post_status'=>'publish','post_name'=>$slug,'post_title'=>$title,'post_content'=>wp_slash($content)], true);
    if (is_wp_error($id)) { WP_CLI::error($id->get_error_message()); }
    update_post_meta($id,'_dc_layout','designed'); update_post_meta($id,'_wp_page_template','page-designed.php'); update_post_meta($id,'_dc_title',$seo); update_post_meta($id,'_dc_description',$description);
}
$home = get_page_by_path('strona-glowna');
update_option('show_on_front','page'); update_option('page_on_front',$home->ID);
update_option('WPLANG','pl_PL'); update_option('blogname','Damian Cebula — Serwis Klimatyzacji i AGD'); update_option('blogdescription','Stalowa Wola i okolice');
update_option('permalink_structure','/%postname%/'); update_option('blog_public',0);
flush_rewrite_rules();
WP_CLI::success('Strony lokalne utworzone. Istniejąca polityka prywatności pozostaje bez zmian.');
