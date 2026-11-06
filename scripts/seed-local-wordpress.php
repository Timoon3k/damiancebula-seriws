<?php
/** Local wrapper around the same importer used by a fresh hosted installation. */
if (!defined('WP_CLI') || !WP_CLI) { exit; }
if (!in_array(wp_parse_url(home_url(), PHP_URL_HOST), ['127.0.0.1','localhost'], true)) {
    WP_CLI::error('Wyłącznie lokalna instalacja. Na nowej witrynie hostingowej użyj aktywacji motywu lub wp dc sync.');
}
$report = dc_sync_site();
if ($report['errors']) {
    foreach ($report['errors'] as $message) { WP_CLI::warning($message); }
    WP_CLI::error('Nie przejęto istniejących treści. Uruchom nowy proces na osobnej, pustej bazie.');
}
// Local-only indexing guard; the hosted importer deliberately preserves visibility.
update_option('blog_public', 0);
WP_CLI::success('Strony, zdjęcia i menu zsynchronizowane przez importer motywu.');
