<?php
// Test-only mail interception. Never copy to production.
if (wp_parse_url(home_url(), PHP_URL_HOST) === '127.0.0.1') {
    add_action('rest_api_init', function () { register_rest_route('dc-test/v1', '/mail-interceptor', ['methods'=>'GET','permission_callback'=>'__return_true','callback'=>function () { return ['enabled'=>true]; }]); });
    add_filter('pre_wp_mail', function ($return, $atts) {
        update_option('dc_test_mail_intercepted', (int) get_option('dc_test_mail_intercepted',0) + 1);
        return !str_contains($atts['message'], '[FAIL]');
    }, PHP_INT_MAX, 2);
}
