<?php
/** Confirmed business address, shared by visible contact details, maps and SEO. */
if (!defined('ABSPATH')) { exit; }

/** Defaults do not write theme mods or replace values already saved by the owner. */
function dc_company_defaults() {
    return [
        'dc_company_street' => 'Aleje Jana Pawła II 42',
        'dc_company_postcode' => '37-450',
        'dc_company_city' => 'Stalowa Wola',
    ];
}

function dc_company_text($value) {
    return is_scalar($value) ? trim(sanitize_text_field((string) $value)) : '';
}

function dc_company_field($key) {
    $defaults = dc_company_defaults();
    if (!array_key_exists($key, $defaults)) { return ''; }
    return dc_company_text(get_theme_mod($key, $defaults[$key]));
}

/** Plain text for visible address, mail text and Google Maps queries. */
function dc_company_address() {
    $locality = trim(dc_company_field('dc_company_postcode') . ' ' . dc_company_field('dc_company_city'));
    return implode(', ', array_filter([dc_company_field('dc_company_street'), $locality], 'strlen'));
}

function dc_company_schema_address() {
    return array_filter([
        '@type' => 'PostalAddress',
        'streetAddress' => dc_company_field('dc_company_street'),
        'postalCode' => dc_company_field('dc_company_postcode'),
        'addressLocality' => dc_company_field('dc_company_city'),
        'addressCountry' => 'PL',
    ], 'strlen');
}

/** Address search only; it does not imply a verified Google Business Profile. */
function dc_company_map_query() {
    $address = dc_company_address();
    return $address ? $address . ', Polska' : 'Stalowa Wola, Polska';
}

add_action('customize_register', function ($customizer) {
    $customizer->add_section('dc_company', [
        'title' => 'DC — Dane firmy',
        'description' => 'Adres firmy widoczny na stronie, w polityce prywatności i w danych strukturalnych. Własna mapa Google ma pierwszeństwo przed wyszukiwaniem adresu.',
    ]);
    $labels = [
        'dc_company_street' => 'Ulica i numer',
        'dc_company_postcode' => 'Kod pocztowy',
        'dc_company_city' => 'Miejscowość',
    ];
    foreach (dc_company_defaults() as $key => $default) {
        $customizer->add_setting($key, [
            'default' => $default,
            'sanitize_callback' => 'dc_company_text',
            'capability' => 'edit_theme_options',
            'transport' => 'refresh',
        ]);
        $customizer->add_control($key, [
            'section' => 'dc_company',
            'label' => $labels[$key],
            'type' => 'text',
        ]);
    }
});

add_shortcode('dc_business_address', function () {
    $address = dc_company_address();
    return $address ? '<span class="dc-business-address">' . esc_html($address) . '</span>' : '';
});
