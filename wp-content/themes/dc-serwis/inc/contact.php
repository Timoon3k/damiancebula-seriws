<?php
if (!defined('ABSPATH')) { exit; }
function dc_contact_messages() {
    return ['sent'=>'Wiadomość została przekazana do wysyłki. Dziękujemy za kontakt.', 'invalid'=>'Sprawdź imię, adres e-mail, treść wiadomości i potwierdzenie zapoznania z polityką prywatności.', 'expired'=>'Formularz wygasł. Odśwież stronę i spróbuj ponownie.', 'limited'=>'Zbyt wiele prób. Odczekaj kilka minut lub zadzwoń: 794 225 139.', 'failed'=>'Nie udało się przekazać wiadomości do wysyłki. Zadzwoń: 794 225 139 lub napisz bezpośrednio e-mail.'];
}
add_shortcode('dc_contact', function () {
    $messages = dc_contact_messages();
    $status = isset($_GET['dc_status']) && is_string($_GET['dc_status']) ? sanitize_key($_GET['dc_status']) : '';
    ob_start(); ?>
    <form class="contact-form" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post" data-ajax-contact>
    <h2>Napisz, w czym możemy pomóc</h2>
    <div class="form-status" role="status" aria-live="polite" tabindex="-1"><?php echo esc_html($messages[$status] ?? ''); ?></div>
    <input type="hidden" name="action" value="dc_contact">
    <?php wp_nonce_field('dc_contact', 'dc_nonce', false); ?>
    <div class="honeypot" aria-hidden="true"><label>Nie wypełniaj tego pola<input name="website" tabindex="-1" autocomplete="off"></label></div>
    <div class="form-row"><label>Imię <span>(wymagane)</span><input name="dc_name" required maxlength="100" autocomplete="given-name"></label><label>E-mail <span>(wymagany)</span><input name="dc_email" type="email" required maxlength="190" autocomplete="email"></label></div>
    <label>Telefon <span>(opcjonalnie)</span><input name="dc_phone" type="tel" maxlength="30" autocomplete="tel"></label>
    <label>Wiadomość <span>(wymagana, min. 10 znaków)</span><textarea name="dc_message" required minlength="10" maxlength="5000" rows="5"></textarea></label>
    <label class="consent"><input type="checkbox" name="dc_privacy" value="1" required><span>Wyrażam zgodę na przetwarzanie podanych danych osobowych przez Damiana Cebulę w celu udzielenia odpowiedzi na zgłoszenie. Zapoznałem/am się z <a href="<?php echo esc_url(get_privacy_policy_url() ?: home_url('/polityka-prywatnosci/')); ?>">polityką prywatności</a>. Dane służą udzieleniu odpowiedzi na zgłoszenie.</span></label>
    <p>Nie podawaj danych wrażliwych. Zgłoszenie nie jest potwierdzeniem terminu wizyty.</p>
    <button class="button" type="submit">Wyślij wiadomość <?php echo dc_icon(); ?></button>
    </form><?php return ob_get_clean();
});
function dc_contact_finish($status) {
    if (isset($_POST['dc_ajax']) && $_POST['dc_ajax'] === '1') {
        $messages = dc_contact_messages();
        wp_send_json(['success'=>$status === 'sent','status'=>$status,'message'=>$messages[$status]], $status === 'sent' ? 200 : ($status === 'limited' ? 429 : 422));
    }
    wp_safe_redirect(add_query_arg('dc_status', $status, home_url('/kontakt/')) . '#contact'); exit;
}
function dc_contact_handle() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { dc_contact_finish('invalid'); }
    $field = function ($key) { return isset($_POST[$key]) && is_string($_POST[$key]) ? wp_unslash($_POST[$key]) : ''; };
    if (!wp_verify_nonce($field('dc_nonce'), 'dc_contact')) { dc_contact_finish('expired'); }
    if ($field('website') !== '') { dc_contact_finish('invalid'); }
    $name = sanitize_text_field($field('dc_name'));
    $email = sanitize_email($field('dc_email'));
    $phone = sanitize_text_field($field('dc_phone'));
    $message = sanitize_textarea_field($field('dc_message'));
    if (!$name || strlen($name)>100 || !is_email($email) || strlen($email)>190 || strlen($phone)>30 || strlen($message)<10 || strlen($message)>5000 || $field('dc_privacy') !== '1') { dc_contact_finish('invalid'); }
    $key = 'dc_mail_' . hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? '', wp_salt('nonce'));
    $attempts = (int) get_transient($key);
    if ($attempts >= 3) { dc_contact_finish('limited'); }
    set_transient($key, $attempts + 1, 5 * MINUTE_IN_SECONDS);
    // Fixed destination and subject; user data can never become a mail header.
    $body = "Imię: $name\nE-mail: $email\nTelefon: $phone\n\n$message\n\nPotwierdzenie zgody na odpowiedź: tak\nData zgłoszenia: " . wp_date('Y-m-d H:i:s T') . "\nPolityka prywatności: " . (get_privacy_policy_url() ?: home_url('/polityka-prywatnosci/'));
    $sent = wp_mail('kontakt@damiancebula-serwis.pl', 'Zgłoszenie ze strony Damian Cebula', $body, ['Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . $email]);
    dc_contact_finish($sent ? 'sent' : 'failed');
}
add_action('admin_post_nopriv_dc_contact', 'dc_contact_handle');
add_action('admin_post_dc_contact', 'dc_contact_handle');
