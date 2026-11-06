<?php
/**
 * WP-CLI assertions for the Rank Math bridge. No database/settings writes.
 * Run: wp eval-file /path/to/tests/rank-math.php
 * Plugin filters are simulated when Rank Math is not installed.
 */
if (!defined('WP_CLI') || !WP_CLI) { exit(1); }
function dc_test_rank_math($condition, $message) {
    if (!$condition) { throw new RuntimeException($message); }
    WP_CLI::log('PASS: ' . $message);
}

$original_query = $GLOBALS['wp_query'];
$query = new WP_Query();
$query->is_singular = true;
$query->is_page = true;
$query->queried_object_id = 987654321;
$query->queried_object = (object) ['ID'=>987654321, 'post_type'=>'page'];
$GLOBALS['wp_query'] = $query;
$metadata = ['_dc_title'=>'Serwis klimatyzacji Stalowa Wola — Damian Cebula', '_dc_description'=>'Montaż, naprawa i serwis klimatyzacji w Stalowej Woli.'];
$intercept = function ($value, $id, $key, $single) use (&$metadata) {
    if ((int) $id !== 987654321) { return $value; }
    return $single ? ($metadata[$key] ?? '') : (isset($metadata[$key]) ? [$metadata[$key]] : []);
};
add_filter('get_post_metadata', $intercept, 99, 4);

try {
    if (!defined('RANK_MATH_VERSION')) {
        dc_test_rank_math(apply_filters('rank_math/frontend/title', 'Plugin title') === 'Plugin title', 'Inactive Rank Math does not change title');
        define('RANK_MATH_VERSION', 'dc-test-simulation');
    }
    dc_test_rank_math(dc_seo_plugin(), 'Rank Math owns metadata and structured data');
    dc_test_rank_math(apply_filters('rank_math/frontend/title', 'Global template title') === $metadata['_dc_title'], 'Imported page title survives activating Rank Math');
    dc_test_rank_math(apply_filters('rank_math/frontend/description', 'Global description') === $metadata['_dc_description'], 'Imported page description survives activating Rank Math');

    $metadata['rank_math_title'] = '%title% %sep% %sitename%';
    $metadata['rank_math_description'] = 'Opis zapisany przez właściciela w Rank Math.';
    dc_test_rank_math(apply_filters('rank_math/frontend/title', 'Rendered custom title') === 'Rendered custom title', 'Explicit Rank Math title keeps the rendered plugin value');
    dc_test_rank_math(apply_filters('rank_math/frontend/description', $metadata['rank_math_description']) === $metadata['rank_math_description'], 'Explicit Rank Math description wins');

    $metadata = ['_dc_title'=>' ', '_dc_description'=>''];
    dc_test_rank_math(apply_filters('rank_math/frontend/title', 'Plugin default title') === 'Plugin default title', 'Missing imported title preserves plugin defaults');
    dc_test_rank_math(apply_filters('rank_math/frontend/description', 'Plugin default description') === 'Plugin default description', 'Missing imported description preserves plugin defaults');

    $metadata = ['_dc_title'=>'Imported title', '_dc_description'=>'Imported description'];
    $query->is_singular = false;
    $query->is_page = false;
    $query->is_search = true;
    dc_test_rank_math(apply_filters('rank_math/frontend/title', 'Search title') === 'Search title', 'Search results do not inherit page metadata');
    dc_test_rank_math(apply_filters('rank_math/frontend/description', 'Archive description') === 'Archive description', 'Non-singular descriptions stay under plugin control');
    $query->is_singular = true;
    $query->is_search = false;
    $query->queried_object_id = 0;
    dc_test_rank_math(apply_filters('rank_math/frontend/title', 'Unknown page') === 'Unknown page', 'Missing queried page is ignored');
    $query->queried_object_id = 987654321;
    dc_test_rank_math(apply_filters('pre_get_document_title', 'Plugin document title') === 'Plugin document title', 'Theme document-title override stays disabled with Rank Math');

    // Invoke only this theme's head callbacks; avoid network/plugin head effects.
    $head_output = '';
    foreach ($GLOBALS['wp_filter']['wp_head']->callbacks as $callbacks) {
        foreach ($callbacks as $callback) {
            if (!$callback['function'] instanceof Closure) { continue; }
            $reflection = new ReflectionFunction($callback['function']);
            if ($reflection->getFileName() !== get_theme_file_path('inc/seo.php')) { continue; }
            ob_start();
            $callback['function']();
            $head_output .= ob_get_clean();
        }
    }
    dc_test_rank_math($head_output === '', 'Theme does not duplicate canonical, social metadata or JSON-LD with Rank Math');
} finally {
    remove_filter('get_post_metadata', $intercept, 99);
    $GLOBALS['wp_query'] = $original_query;
}
WP_CLI::success('Rank Math metadata bridge assertions passed (no database writes).');
