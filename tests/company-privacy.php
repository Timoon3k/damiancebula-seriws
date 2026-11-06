<?php
/** Local WP-CLI checks; restore every changed setting and never send email. */
function dc_company_expect($condition, $label) {
    if (!$condition) { throw new RuntimeException($label); }
    WP_CLI::log('PASS: ' . $label);
}

$dc_company_saved_mods = get_theme_mods();
$dc_company_saved_mods = is_array($dc_company_saved_mods) ? $dc_company_saved_mods : [];
$dc_company_keys = array_keys(dc_company_defaults());
try {
    foreach ($dc_company_keys as $dc_company_key) { remove_theme_mod($dc_company_key); }
    dc_company_expect(dc_company_address() === 'Aleje Jana Pawła II 42, 37-450 Stalowa Wola', 'Confirmed business address is the default');
    dc_company_expect(dc_company_map_query() === 'Aleje Jana Pawła II 42, 37-450 Stalowa Wola, Polska', 'Map query uses confirmed business address');
    $dc_company_schema = dc_company_schema_address();
    dc_company_expect($dc_company_schema['@type'] === 'PostalAddress' && $dc_company_schema['postalCode'] === '37-450' && $dc_company_schema['addressCountry'] === 'PL', 'Schema contains the confirmed postal address');
    dc_company_expect(dc_company_text(['invalid']) === '', 'Non-scalar address input is rejected');
    dc_company_expect(dc_company_text('<strong>Adres</strong>') === 'Adres', 'Address sanitizer removes HTML');

    set_theme_mod('dc_company_street', '  Inna ulica 12  ');
    set_theme_mod('dc_company_postcode', '00-001');
    set_theme_mod('dc_company_city', 'Miasto <script>alert(1)</script>');
    dc_company_expect(str_starts_with(dc_company_address(), 'Inna ulica 12, 00-001 '), 'Saved company address takes precedence over defaults');
    $dc_company_markup = do_shortcode('[dc_business_address]');
    dc_company_expect(str_contains($dc_company_markup, 'Inna ulica 12') && !str_contains($dc_company_markup, '<script>'), 'Address shortcode uses current settings and escapes output');
    dc_company_expect(dc_company_schema_address()['streetAddress'] === 'Inna ulica 12', 'Schema follows edited address');

    ob_start();
    include get_theme_file_path('patterns/privacy.php');
    $dc_company_policy = ob_get_clean();
    $dc_company_blocks = parse_blocks($dc_company_policy);
    dc_company_expect($dc_company_blocks[0]['blockName'] === 'core/group', 'Privacy policy is an editable native block pattern');
    dc_company_expect(str_contains($dc_company_policy, '[dc_business_address]'), 'Privacy policy address remains dynamically editable');
    dc_company_expect(str_contains(do_shortcode($dc_company_policy), 'Inna ulica 12'), 'Privacy policy reflects current address without content replacement');
    foreach (['kontakt@damiancebula-serwis.pl', '794 225 139', 'lit. a RODO', 'lit. b RODO', 'lit. f RODO', 'sprostowania', 'usunięcia', 'przenoszenia', 'sprzeciw', 'wycofać zgodę', 'uodo.gov.pl', 'Hostinger', 'Google Maps', 'Trustindex', '6 miesięcy', '5 minut', '6 listopada 2026'] as $dc_company_phrase) {
        dc_company_expect(str_contains($dc_company_policy, $dc_company_phrase), 'Privacy policy covers: ' . $dc_company_phrase);
    }
} finally {
    foreach ($dc_company_keys as $dc_company_key) {
        if (array_key_exists($dc_company_key, $dc_company_saved_mods)) {
            set_theme_mod($dc_company_key, $dc_company_saved_mods[$dc_company_key]);
        } else {
            remove_theme_mod($dc_company_key);
        }
    }
}
WP_CLI::success('Company address and privacy policy assertions complete.');
